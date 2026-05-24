import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
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
    const products = await prisma.product.findMany({ select: { id: true } });
    
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
