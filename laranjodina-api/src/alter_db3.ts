import { query } from './db';

async function main() {
    try {
        await query('ALTER TABLE users ADD COLUMN address VARCHAR(255) NULL;');
        console.log("Coluna address adicionada.");
    } catch (e: any) {
        if (e.code !== 'ER_DUP_FIELDNAME') console.error(e);
        else console.log("Coluna address já existe.");
    }
    
    process.exit(0);
}

main();
