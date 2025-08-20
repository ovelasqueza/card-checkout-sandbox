-- Crear base de datos card_checkout (si no existe)
CREATE DATABASE IF NOT EXISTS card_checkout;

-- Usar la base de datos
\c card_checkout;

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de clientes
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de transacciones
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payflow_transaction_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de entregas
CREATE TABLE IF NOT EXISTS deliveries (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    delivery_status VARCHAR(50) DEFAULT 'PENDING',
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar productos de ejemplo
INSERT INTO products (name, description, price, image_url, stock) VALUES
('Laptop Gaming', 'Laptop para gaming de alta gama con RTX 4060', 2500000.00, 'https://via.placeholder.com/300x200?text=Laptop+Gaming', 10),
('Mouse Gamer', 'Mouse óptico para gaming con RGB', 150000.00, 'https://via.placeholder.com/300x200?text=Mouse+Gamer', 25),
('Teclado Mecánico', 'Teclado mecánico con switches azules', 300000.00, 'https://via.placeholder.com/300x200?text=Teclado+Mecanico', 15),
('Monitor 4K', 'Monitor 4K de 27 pulgadas para gaming', 1200000.00, 'https://via.placeholder.com/300x200?text=Monitor+4K', 8),
('Auriculares Gaming', 'Auriculares con sonido envolvente 7.1', 250000.00, 'https://via.placeholder.com/300x200?text=Auriculares+Gaming', 20)
ON CONFLICT DO NOTHING;

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_product_id ON transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_transaction_id ON deliveries(transaction_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);