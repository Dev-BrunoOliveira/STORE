import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  slug: string;
  oldPrice?: number;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, size: string) => void;
  removeItem: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, size) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.product.id === product.id && item.size === size
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && item.size === size
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            const newItem: CartItem = { product, size, quantity: 1 };
            return { items: [...state.items, newItem] };
          }
        }),

      removeItem: (productId, size) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.product.id === productId && item.size === size)
          ),
        })),

      updateQuantity: (productId, size, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) =>
                  !(item.product.id === productId && item.size === size)
              ),
            };
          }
          return {
            items: state.items.map((item) =>
              item.product.id === productId && item.size === size
                ? { ...item, quantity }
                : item
            ),
          };
        }),
    }),
    {
      name: "cart-storage", // nome do localStorage
    }
  )
);
