import { promises as fs } from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';
import { Product } from '@/store/useProductStore';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const filePath = path.join(process.cwd(), 'src/data/products.json');
    const data = await fs.readFile(filePath, 'utf8');
    const products: Product[] = JSON.parse(data);
    return products.find(p => String(p.id) === String(id)) || null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    return {
      title: 'Product Not Found | RefurbLaptopWala',
      description: 'The requested refurbished laptop was not found.',
    };
  }

  const modelName = `${product.brand} ${product.model}`;
  const keywords = `refurbished ${product.brand} laptop agra, second hand ${product.brand} ${product.model} mathura, purana ${product.brand} laptop firozabad, used ${product.brand} laptop etawah, certified refurbished ${modelName}`;

  return {
    title: `Refurbished ${modelName} (${product.processor}, ${product.ram}, ${product.storage}) | Kartik Computers`,
    description: `Buy certified second-hand / refurbished ${modelName} laptop at half price in Agra, Mathura, Firozabad. Sourced from corporate environments, 40+ tests passed, 3-month warranty.`,
    keywords: keywords,
    alternates: {
      canonical: `https://refurblaptopwala.com/products/${id}`,
    },
    openGraph: {
      title: `Certified Refurbished ${modelName} - Kartik Computers`,
      description: `Get a premium corporate ${modelName} at just ₹${product.price.toLocaleString('en-IN')}. Rigorously tested, certified Grade A with 3 months complete warranty. Delivery across Agra region.`,
      images: [
        {
          url: product.image || '/hp.png',
          alt: modelName,
        }
      ],
      url: `https://refurblaptopwala.com/products/${id}`,
    }
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="bg-surface-ice min-h-screen flex items-center justify-center py-20">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full mx-4">
          <h3 className="font-heading font-semibold text-secondary text-lg mb-1">Product Not Found</h3>
          <p className="text-gray-500 text-sm mb-4">The laptop you are looking for does not exist or has been removed.</p>
          <a href="/products" className="text-primary hover:underline font-medium text-sm">Browse Laptops</a>
        </div>
      </div>
    );
  }

  return <ProductDetailClient initialProduct={product} />;
}

