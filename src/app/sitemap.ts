import prisma from '@/lib/db';
import { ContentStatus } from '@/app/generated/prisma/enums';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || 'https://couponhunt.in';

  const [stores, coupons, deals, categories] = await Promise.all([
    prisma.store.findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: { slug: true, updatedAt: true },
    }),
    prisma.coupon.findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: { slug: true, updatedAt: true },
    }),
    prisma.deal.findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/stores`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/coupons`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/deals`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  const storePages: MetadataRoute.Sitemap = stores.map((s) => ({
    url: `${baseUrl}/stores/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  const couponPages: MetadataRoute.Sitemap = coupons.map((c) => ({
    url: `${baseUrl}/coupons/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  const dealPages: MetadataRoute.Sitemap = deals.map((d) => ({
    url: `${baseUrl}/deals/${d.slug}`,
    lastModified: d.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/categories/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...storePages, ...couponPages, ...dealPages, ...categoryPages];
}
