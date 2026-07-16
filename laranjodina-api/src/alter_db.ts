import { query } from './db';

async function main() {
    try {
        await query('ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL;');
        console.log("Coluna 'phone' adicionada com sucesso.");
    } catch (err: any) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("Coluna 'phone' já existe.");
        } else {
            console.error("Erro ao alterar tabela:", err);
        }
    }
    process.exit(0);
}

main();
