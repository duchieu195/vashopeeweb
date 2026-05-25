import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

const CART_VERSION = 2;

interface VariantInfo {
  variantId: string;
  variantLabel: string;
  variantPrice: number;
}

interface CartState {
  items: CartItem[];
  version: number;
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, variant?: VariantInfo) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

function cartKey(productId: string, variantId?: string): string {
  return variantId ? `${productId}__${variantId}` : productId;
}

function itemKey(item: CartItem): string {
  return cartKey(item.product.id, item.variantId);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      version: CART_VERSION,
      isOpen: false,

      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const key = cartKey(product.id, variant?.variantId);
          const existing = state.items.find((i) => itemKey(i) === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i) === key ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          const newItem: CartItem = {
            product,
            quantity,
            variantId: variant?.variantId,
            variantLabel: variant?.variantLabel,
            variantPrice: variant?.variantPrice,
          };
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (productId, variantId) => {
        const key = cartKey(productId, variantId);
        set((state) => ({
          items: state.items.filter((i) => itemKey(i) !== key),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        const key = cartKey(productId, variantId);
        if (quantity < 1) {
          set((state) => ({ items: state.items.filter((i) => itemKey(i) !== key) }));
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i) === key ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => {
          const price = i.variantPrice ?? i.product.price;
          return sum + price * i.quantity;
        }, 0),
    }),
    {
      name: 'vashopeeweb-cart',
      partialize: (state) => ({ items: state.items, version: state.version }),
      onRehydrateStorage: () => (state) => {
        if (state && (state as { version?: number }).version !== CART_VERSION) {
          state.items = [];
          state.version = CART_VERSION;
        }
      },
    }
  )
);

export const useCart = () => useCartStore();
