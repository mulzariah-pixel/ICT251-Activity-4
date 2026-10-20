const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, process.env.DB_PATH || 'products.db');
const db = new sqlite3.Database(dbPath);

db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'), (err) => {
    if (err) {
        console.error('Database setup failed:', err.message);
    } else {
        console.log('SQLite database ready.');
    }
});

module.exports = db;