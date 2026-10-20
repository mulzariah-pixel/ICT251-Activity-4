const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Tech Product Showcase API is running' });
});

app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products ORDER BY id', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/products/:id', (req, res) => {
    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Product not found' });
        res.json(row);
    });
});

app.post('/api/products', (req, res) => {
    const { product_name, category, brand, price, stock_quantity, description } = req.body;

    if (!product_name || !category || !brand || price === undefined ||
        stock_quantity === undefined || !Number.isFinite(Number(price)) ||
        Number(price) < 0 || !Number.isInteger(Number(stock_quantity)) ||
        Number(stock_quantity) < 0) {
        return res.status(400).json({ error: 'Provide valid product fields.' });
    }

    db.run(`INSERT INTO products
        (product_name, category, brand, price, stock_quantity, description)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [product_name, category, brand, Number(price),
         Number(stock_quantity), description || ''],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            db.get('SELECT * FROM products WHERE id = ?', [this.lastID],
                (e, row) => e
                    ? res.status(500).json({ error: e.message })
                    : res.status(201).json(row));
        });
});

app.put('/api/products/:id', (req, res) => {
    const { product_name, category, brand, price, stock_quantity, description } = req.body;

    if (!product_name || !category || !brand || price === undefined ||
        stock_quantity === undefined || !Number.isFinite(Number(price)) ||
        Number(price) < 0 || !Number.isInteger(Number(stock_quantity)) ||
        Number(stock_quantity) < 0) {
        return res.status(400).json({ error: 'Provide valid product fields.' });
    }

    db.run(`UPDATE products SET product_name=?, category=?, brand=?, price=?,
        stock_quantity=?, description=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
        [product_name, category, brand, Number(price), Number(stock_quantity),
         description || '', req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (!this.changes) return res.status(404).json({ error: 'Product not found' });
            db.get('SELECT * FROM products WHERE id=?', [req.params.id],
                (e, row) => e
                    ? res.status(500).json({ error: e.message })
                    : res.json(row));
        });
});

app.delete('/api/products/:id', (req, res) => {
    db.run('DELETE FROM products WHERE id=?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (!this.changes) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));