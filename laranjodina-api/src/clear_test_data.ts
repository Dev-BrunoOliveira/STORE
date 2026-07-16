import { query } from './db';
import { db } from './config/firebase';
import { ref, set } from 'firebase/database';

async function main() {
    try {
        // Limpar banco MySQL local
        await query('DELETE FROM users');
        await query('ALTER TABLE users AUTO_INCREMENT = 1');
        console.log("✔️  Usuários do MySQL apagados e IDs resetados.");

        // Limpar Firebase Realtime Database
        try {
            await set(ref(db, 'users'), null);
            await set(ref(db, 'login_events'), null);
            console.log("✔️  Nós 'users' e 'login_events' apagados do Firebase.");
        } catch (fbErr: any) {
            console.log("⚠️ Não foi possível apagar dados do Firebase por causa das regras de segurança. Apague-os manualmente no painel.", fbErr.message);
        }

    } catch (err) {
        console.error("Erro ao apagar usuários:", err);
    }
    process.exit(0);
}

main();
