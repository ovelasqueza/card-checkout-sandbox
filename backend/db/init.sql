-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuarios iniciales
INSERT INTO
    users (name, email)
VALUES (
        'Fernando',
        'fernando@example.com'
    ),
    ('Ana', 'ana@example.com'),
    (
        'Carlos',
        'carlos@example.com'
    );