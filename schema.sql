CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    category TEXT NOT NULL,
    brand TEXT NOT NULL,
    price REAL NOT NULL DEFAULT 0,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO products
(id, product_name, category, brand, price, stock_quantity, description)
VALUES
(1, 'Laptop', 'Computers', 'Dell', 8500, 12, 'Laptop for study'),
(2, 'Smartphone', 'Phones', 'Samsung', 4200, 20, 'Android smartphone'),
(3, 'Wireless Mouse', 'Accessories', 'Logitech', 250, 30, 'Wireless mouse'),
(4, 'Keyboard', 'Accessories', 'HP', 350, 25, 'USB keyboard'),
(5, 'Monitor', 'Displays', 'LG', 2100, 8, 'Full HD monitor'),
(6, 'Headphones', 'Audio', 'Sony', 600, 15, 'Over-ear headphones'),
(7, 'Tablet', 'Computers', 'Lenovo', 3200, 10, 'Portable tablet'),
(8, 'Flash Drive', 'Storage', 'SanDisk', 150, 40, '64GB flash drive'),
(9, 'Printer', 'Office', 'Canon', 1800, 6, 'Office printer'),
(10, 'Webcam', 'Accessories', 'Logitech', 450, 14, 'USB webcam');