import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Property from '@/lib/models/Property';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.starlanddevelopers.online';

  // Base routes
  const routes = [
    '',
    '/properties',
    '/about',
    '/contact',
    '/gallery',
    '/interior',
    '/join',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic property routes
  try {
    await dbConnect();
    const properties = await Property.find({}, { _id: 1, updatedAt: 1 }).lean();
    
    const propertyRoutes = properties.map((property) => ({
      url: `${baseUrl}/properties/${property._id}`,
      lastModified: property.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...routes, ...propertyRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return routes;
  }
}
