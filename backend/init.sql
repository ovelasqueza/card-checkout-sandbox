-- Crear base de datos
CREATE DATABASE IF NOT EXISTS card_checkout;
USE card_checkout;

-- Tabla de productos
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE customers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de transacciones
CREATE TABLE transactions (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    status ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING',
    amount DECIMAL(10, 2) NOT NULL,
    payflow_transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabla de entregas
CREATE TABLE deliveries (
    id VARCHAR(36) PRIMARY KEY,
    transaction_id VARCHAR(36) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    status ENUM('PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
);

-- Insertar algunos productos de ejemplo
INSERT INTO products (id, name, description, price, stock) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Smartphone Samsung Galaxy A54', 'Smartphone con pantalla de 6.4 pulgadas, 128GB de almacenamiento y cámara de 50MP', 899000.00, 25),
('550e8400-e29b-41d4-a716-446655440002', 'Laptop HP Pavilion 15', 'Laptop con procesador Intel Core i5, 8GB RAM, 512GB SSD y pantalla de 15.6 pulgadas', 2299000.00, 15),
('550e8400-e29b-41d4-a716-446655440003', 'Auriculares Sony WH-1000XM4', 'Auriculares inalámbricos con cancelación de ruido y hasta 30 horas de batería', 649000.00, 40),
('550e8400-e29b-41d4-a716-446655440004', 'Tablet iPad Air', 'Tablet de 10.9 pulgadas con chip M1, 64GB de almacenamiento y compatibilidad con Apple Pencil', 1899000.00, 20),
('550e8400-e29b-41d4-a716-446655440005', 'Smart TV LG 55 pulgadas', 'Smart TV 4K UHD de 55 pulgadas con webOS y compatibilidad HDR', 1599000.00, 10);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX idx_transactions_product_id ON transactions(product_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_deliveries_transaction_id ON deliveries(transaction_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_products_stock ON products(stock);