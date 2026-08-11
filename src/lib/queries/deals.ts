import prisma from '@/lib/db';
import { ContentStatus } from '@/app/generated/prisma/enums';

/**
 * Get featured deals for homepage.
 */
export async function getFeaturedDeals(limit = 8) {
  const now = new Date();
  return prisma.deal.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    take: limit,
    include: {
      store: { select: { name: true, slug: true, logo: true } },
      categories: { include: { category: true } },
    },
  });
}

/**
 * Get latest deals.
 */
export async function getLatestDeals(limit = 10) {
  const now = new Date();
  return prisma.deal.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      store: { select: { name: true, slug: true, logo: true } },
      categories: { include: { category: true } },
    },
  });
}

/**
 * Get all published deals, paginated, with optional filters.
 */
export async function getAllDeals({
  page = 1,
  pageSize = 16,
  search,
  categorySlug,
  storeSlug,
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  categorySlug?: string;
  storeSlug?: string;
} = {}) {
  const now = new Date();

  const where: Record<string, unknown> = {
    status: ContentStatus.PUBLISHED,
    OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
  };

  if (search) {
    where.AND = [
      {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { productName: { contains: search, mode: 'insensitive' } },
        ],
      },
    ];
  }

  if (categorySlug) {
    where.categories = {
      some: { category: { slug: categorySlug } },
    };
  }

  if (storeSlug) {
    where.store = { slug: storeSlug };
  }

  const [deals, total] = await Promise.all([
    prisma.deal.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        store: { select: { name: true, slug: true, logo: true } },
        categories: { include: { category: true } },
      },
    }),
    prisma.deal.count({ where }),
  ]);

  return {
    deals,
    total,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
  };
}

/**
 * Get a single deal by slug.
 */
export async function getDealBySlug(slug: string) {
  return prisma.deal.findUnique({
    where: { slug },
    include: {
      store: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          websiteUrl: true,
          shortDescription: true,
        },
      },
      categories: { include: { category: true } },
    },
  });
}

/**
 * Get related deals (same store, excluding current).
 */
export async function getRelatedDeals(dealId: string, storeId: string, limit = 4) {
  const now = new Date();
  return prisma.deal.findMany({
    where: {
      storeId,
      id: { not: dealId },
      status: ContentStatus.PUBLISHED,
      OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
    },
    orderBy: [{ isFeatured: 'desc' }, { clickCount: 'desc' }],
    take: limit,
    include: {
      store: { select: { name: true, slug: true, logo: true } },
    },
  });
}
