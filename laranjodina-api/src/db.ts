// src/db.ts

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Garante que o .env seja lido

// Configura a pool de conexão
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Função 'query' para executar comandos SQL
export const query = async <T>(sql: string, values: any[] = []): Promise<T> => {
    // Tenta obter uma conexão e executar o comando
    const [rows] = await pool.execute(sql, values);
    return rows as T;
};