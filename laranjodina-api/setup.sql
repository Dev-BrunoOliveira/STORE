-- Script de setup do banco de dados Laranjodina Store
-- Execute: mysql -u root -p < setup.sql

CREATE DATABASE IF NOT EXISTS laranjodina_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE laranjodina_store;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2),
    image_url VARCHAR(500) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    colors JSON,
    sizes JSON NOT NULL,
    category JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Produtos de exemplo (opcional - o frontend usa dados locais por padrão)
INSERT IGNORE INTO produtos (name, price, image_url, slug, description, colors, sizes, category) VALUES
('Camiseta 2PAC', 119.90, '/img/2pac-modelo.jpg', 'camiseta-2pac', 'Camiseta 100% algodão com cromia vibrante do lendário rapper 2PAC.', '["Preto"]', '["P","M","G","GG"]', '["hiphop","camisetas"]'),
('Camiseta Fresh Prince', 119.90, '/img/will-modelo.jpg', 'camiseta-will', 'Design exclusivo Fresh Prince, 100% algodão fio 30.', '["Preto"]', '["P","M","G","GG"]', '["hiphop","camisetas"]'),
('Camiseta Michael Jordan', 119.90, '/img/jordan-modelo.jpg', 'camiseta-jordan', 'Camiseta em homenagem ao GOAT do basquete.', '["Preto"]', '["P","M","G","GG"]', '["cultura negra","camisetas"]'),
('Camiseta Breaking Bad', 119.90, '/img/bb-modelo.jpg', 'breaking-bad', 'Camiseta temática Breaking Bad.', '["Branca"]', '["P","M","G","GG"]', '["lancamentos","camisetas"]'),
('Camiseta Tyler The Creator', 119.90, '/img/tyler-modelo.jpg', 'tyler-the-creator', 'Black edition Tyler The Creator.', '["Branca"]', '["P","M","G","GG"]', '["lancamentos","camisetas","hiphop"]'),
('Camiseta Travis Scott', 119.90, '/img/travis-modelo.jpg', 'travis-scott', 'Estampa exclusiva Travis Scott.', '["Preto"]', '["P","M","G","GG"]', '["lancamentos","hiphop","camisetas"]'),
('Camiseta Kendrick Lamar', 119.90, '/img/kendrick-modelo.jpg', 'kendrick-lamar', 'Estampa exclusiva Kendrick Lamar.', '["Preto"]', '["P","M","G","GG"]', '["lancamentos","hiphop","camisetas"]');
