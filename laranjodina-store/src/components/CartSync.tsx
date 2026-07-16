import { useEffect, useRef } from 'react';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';
import { db } from '../config/firebase';
import { ref, set, get } from 'firebase/database';

const CartSync = () => {
    const { user } = useAuthStore();
    const { items } = useCartStore();
    const isInitialMount = useRef(true);

    // Quando o usuário loga, baixa o carrinho do Firebase
    useEffect(() => {
        if (user) {
            const fetchCart = async () => {
                try {
                    const snapshot = await get(ref(db, `carts/${user.id}`));
                    if (snapshot.exists()) {
                        const cloudItems = snapshot.val();
                        
                        // Pegamos os itens atuais do LocalStorage
                        const localItems = useCartStore.getState().items;
                        
                        // Mesclar: se já existe, mantém. Se não, adiciona o da nuvem.
                        // (Lógica simples: substituímos pelo da nuvem + local combinados sem duplicar IDs iguais de mesmo tamanho)
                        const merged = [...localItems];
                        cloudItems.forEach((cloudItem: any) => {
                            const exists = merged.find(i => i.product.id === cloudItem.product.id && i.size === cloudItem.size);
                            if (!exists) {
                                merged.push(cloudItem);
                            }
                        });
                        
                        useCartStore.setState({ items: merged });
                    }
                } catch (e) {
                    console.error("Erro ao sincronizar carrinho:", e);
                }
            };
            fetchCart();
        }
    }, [user]);

    // Sempre que os itens do carrinho mudarem, salva na nuvem (se logado)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (user) {
            set(ref(db, `carts/${user.id}`), items).catch(e => console.error(e));
        }
    }, [items, user]);

    return null;
};

export default CartSync;
