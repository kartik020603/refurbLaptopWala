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

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    brand: 'HP',
    model: 'EliteBook 840 G8',
    processor: 'Intel Core i7',
    ram: '16GB',
    storage: '512GB SSD',
    condition: 'Grade A',
    price: 32500,
    basePrice: 32500,
    originalPrice: 85000,
    description: 'The HP EliteBook 840 G8 is designed for modern professionals who demand high performance and robust security. Sourced from corporate environments, this laptop offers a premium aluminum chassis and top-tier specifications.',
    image: '/hp.png',
    images: ['/hp.png', '/lenovo.png', '/dell.png'],
    tags: ['Grade A', 'Corporate'],
    specs: { processor: 'Intel Core i7 11th Gen', display: '14" FHD IPS', graphics: 'Intel Iris Xe', os: 'Windows 11 Pro' },
    tests: { battery: 85, display: 'No Screen Bleeding / Certified', hardware: '40-Point Motherboard Test Passed' },
    stock: true
  },
  {
    id: 2,
    brand: 'Lenovo',
    model: 'ThinkPad X1 Carbon',
    processor: 'Intel Core i7',
    ram: '16GB',
    storage: '512GB SSD',
    condition: 'Like New',
    price: 38000,
    basePrice: 38000,
    originalPrice: 115000,
    description: 'The Lenovo ThinkPad X1 Carbon is a legendary ultra-light business laptop. Known for its best-in-class keyboard and durable carbon-fiber chassis.',
    image: '/lenovo.png',
    images: ['/lenovo.png', '/hp.png', '/dell.png'],
    tags: ['Like New'],
    specs: { processor: 'Intel Core i7 10th Gen', display: '14" FHD+ IPS', graphics: 'Intel UHD', os: 'Windows 11 Pro' },
    tests: { battery: 92, display: 'Pristine Condition', hardware: 'Passed Military Grade Specs' },
    stock: true
  },
  {
    id: 3,
    brand: 'Dell',
    model: 'Latitude 7420',
    processor: 'Intel Core i5',
    ram: '16GB',
    storage: '256GB SSD',
    condition: 'Grade A',
    price: 28500,
    basePrice: 28500,
    originalPrice: 75000,
    description: 'Dell Latitude 7420 offers a premium, intelligent design and a long battery life. Perfect for productivity on the go.',
    image: '/dell.png',
    images: ['/dell.png', '/hp.png', '/lenovo.png'],
    tags: ['Grade A'],
    specs: { processor: 'Intel Core i5 11th Gen', display: '14" FHD WVA', graphics: 'Intel Iris Xe', os: 'Windows 11 Pro' },
    tests: { battery: 88, display: 'Grade A Display', hardware: 'Thermals & Keyboard Tested' },
    stock: false
  },
  {
    id: 4,
    brand: 'Apple',
    model: 'MacBook Air M1',
    processor: 'M1 8-Core',
    ram: '8GB',
    storage: '256GB SSD',
    condition: 'Like New',
    price: 54000,
    basePrice: 54000,
    originalPrice: 92900,
    description: 'The Apple MacBook Air M1 redefines the thin-and-light laptop with unprecedented performance and battery life thanks to the revolutionary M1 chip.',
    image: '/macbook.png',
    images: ['/macbook.png', '/hp.png', '/lenovo.png'],
    tags: ['Like New', 'Bestseller'],
    specs: { processor: 'Apple M1 8-Core', display: '13.3" Retina True Tone', graphics: '7-Core GPU', os: 'macOS' },
    tests: { battery: 95, display: 'Flawless Retina Screen', hardware: '100% Apple Diagnostics Passed' },
    stock: true
  },
  {
    id: 5,
    brand: 'HP',
    model: 'ProBook 450 G8',
    processor: 'Intel Core i5',
    ram: '8GB',
    storage: '256GB SSD',
    condition: 'Grade B',
    price: 24000,
    basePrice: 24000,
    originalPrice: 65000,
    description: 'The HP ProBook 450 G8 delivers commercial performance, security, and durability to professionals at growing companies.',
    image: '/hp.png',
    images: ['/hp.png', '/lenovo.png', '/dell.png'],
    tags: ['Grade B', 'Budget'],
    specs: { processor: 'Intel Core i5 11th Gen', display: '15.6" FHD IPS', graphics: 'Intel UHD', os: 'Windows 11 Pro' },
    tests: { battery: 82, display: 'Grade B Display (Minor scratch)', hardware: 'Fully Functional' },
    stock: true
  },
  {
    id: 6,
    brand: 'Dell',
    model: 'XPS 13 9310',
    processor: 'Intel Core i7',
    ram: '16GB',
    storage: '512GB SSD',
    condition: 'Like New',
    price: 45000,
    basePrice: 45000,
    originalPrice: 135000,
    description: 'The Dell XPS 13 is a meticulously crafted premium 13-inch laptop featuring an InfinityEdge display and aerospace-inspired carbon fiber.',
    image: '/dell.png',
    images: ['/dell.png', '/macbook.png', '/hp.png'],
    tags: ['Like New', 'Premium'],
    specs: { processor: 'Intel Core i7 11th Gen', display: '13.4" FHD+ InfinityEdge', graphics: 'Intel Iris Xe', os: 'Windows 11 Pro' },
    tests: { battery: 90, display: 'Pristine InfinityEdge', hardware: 'Stress Tested & Cleaned' },
    stock: true
  }
];

export const useProductStore = create<ProductStore>((set) => ({
  products: INITIAL_PRODUCTS,
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
