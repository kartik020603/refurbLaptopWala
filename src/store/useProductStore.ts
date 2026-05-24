import { create } from 'zustand';

export interface Product {
  id: number;
  brand: string;
  model: string;
  processor: string;
  ram: string;
  storage: string;
  condition: string;
  price: number;      // Used by product listing page
  basePrice: number;  // Used by product details configurator page
  originalPrice: number;
  description: string;
  image: string;
  images: string[];
  tags: string[];
  specs: {
    processor: string;
    display: string;
    graphics: string;
    os: string;
  };
  tests: {
    battery: number;
    display: string;
    hardware: string;
  };
  stock: boolean;
}

interface ProductStore {
  products: Product[];
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: number, updatedProduct: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  toggleStock: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  fetchProducts: async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        set({ products: data });
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  },
  addProduct: async (product) => {
    let nextId = 1;
    set((state) => {
      nextId = state.products.length > 0 ? Math.max(...state.products.map(p => p.id)) + 1 : 1;
      return {
        products: [...state.products, { ...product, id: nextId }]
      };
    });
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
    } catch (error) {
      console.error('Failed to persist added product on server:', error);
    }
  },
  updateProduct: async (id, updatedProduct) => {
    set((state) => ({
      products: state.products.map((p) => {
        if (p.id === id) {
          const merged = { ...p, ...updatedProduct };
          if (updatedProduct.price !== undefined) {
            merged.basePrice = updatedProduct.price;
          } else if (updatedProduct.basePrice !== undefined) {
            merged.price = updatedProduct.basePrice;
          }
          return merged;
        }
        return p;
      })
    }));
    try {
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedProduct }),
      });
    } catch (error) {
      console.error('Failed to persist updated product on server:', error);
    }
  },
  deleteProduct: async (id) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id)
    }));
    try {
      await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete product on server:', error);
    }
  },
  toggleStock: async (id) => {
    let updatedProduct: any = null;
    set((state) => {
      const updated = state.products.map((p) => {
        if (p.id === id) {
          updatedProduct = { ...p, stock: !p.stock };
          return updatedProduct;
        }
        return p;
      });
      return { products: updated };
    });
    if (updatedProduct) {
      try {
        await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, stock: updatedProduct.stock }),
        });
      } catch (error) {
        console.error('Failed to toggle stock on server:', error);
      }
    }
  }
}));
