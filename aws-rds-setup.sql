-- AWS RDS PostgreSQL Setup Script
-- Run this script after creating your RDS instance

-- Create database (if not created during RDS setup)
-- CREATE DATABASE payflow_db;

-- Connect to the database
\c payflow_db;

-- Create extension for UUID generation (if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verify connection
SELECT version();

-- Show current database
SELECT current_database();

-- Create a test table to verify permissions
CREATE TABLE IF NOT EXISTS connection_test (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message VARCHAR(255) DEFAULT 'RDS Connection Successful'
);

-- Insert test data
INSERT INTO connection_test (message) VALUES ('AWS RDS PostgreSQL is ready!');

-- Verify test data
SELECT * FROM connection_test;

-- Clean up test table
DROP TABLE IF EXISTS connection_test;

-- Show all tables (should be empty after cleanup)
\dt