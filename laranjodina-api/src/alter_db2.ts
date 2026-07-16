import { query } from './db';

async function main() {
    try {
        await query('ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) NULL;');
        await query('ALTER TABLE users ADD COLUMN reset_token_expires BIGINT NULL;');
        console.log("Colunas reset_token adicionadas.");
    } catch (e: any) {
        if (e.code !== 'ER_DUP_FIELDNAME') console.error(e);
    }
    
    try {
        await query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                total DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                payment_id VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);
        console.log("Tabela orders criada/verificada.");
    } catch (e) {
        console.error("Erro orders:", e);
    }
    process.exit(0);
}

main();
