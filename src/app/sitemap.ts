import { MetadataRoute } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import { Product } from '@/store/useProductStore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://refurblaptopwala.com';

  // Static routes
  const staticRoutes = [
    '',
    '/products',
    '/about',
    '/contact',
    '/warranty',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic routes from products
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const filePath = path.join(process.cwd(), 'src/data/products.json');
    const data = await fs.readFile(filePath, 'utf8');
    const products: Product[] = JSON.parse(data);
    
    dynamicRoutes = products.map((p) => ({
      url: `${baseUrl}/products/${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error generating dynamic sitemap routes:', error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
