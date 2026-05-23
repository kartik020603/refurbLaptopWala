import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // Unique combination of product id and config
  productId: number;
  brand: string;
  model: string;
  image: string;
  basePrice: number;
  finalPrice: number;
  ram: string;
  storage: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const id = `${item.productId}-${item.ram}-${item.storage}`;
        const existingItem = state.items.find(i => i.id === id);
        
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
            )
          };
        }
        
        return { items: [...state.items, { ...item, id }] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(i => 
          i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
        )
      })),
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => get().items.reduce((total, item) => total + (item.finalPrice * item.quantity), 0),
    }),
    {
      name: 'refurblaptopwala-cart',
    }
  )
);
