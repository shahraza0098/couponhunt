import prisma from '@/lib/db';
import { ContentStatus } from '@/app/generated/prisma/enums';

const PUBLISHED_FILTER = { status: ContentStatus.PUBLISHED };

/**
 * Get popular stores for the homepage.
 */
export async function getPopularStores(limit = 12) {
  return prisma.store.findMany({
    where: { ...PUBLISHED_FILTER, isPopular: true },
    orderBy: { sortOrder: 'asc' },
    take: limit,
    include: {
      _count: {
        select: {
          coupons: { where: PUBLISHED_FILTER },
          deals: { where: PUBLISHED_FILTER },
        },
      },
    },
  });
}

/**
 * Get featured stores.
 */
export async function getFeaturedStores(limit = 8) {
  return prisma.store.findMany({
    where: { ...PUBLISHED_FILTER, isFeatured: true },
    orderBy: { sortOrder: 'asc' },
    take: limit,
    include: {
      _count: {
        select: {
          coupons: { where: PUBLISHED_FILTER },
          deals: { where: PUBLISHED_FILTER },
        },
      },
    },
  });
}

/**
 * Get all published stores with optional search, paginated.
 */
export async function getAllStores({
  page = 1,
  pageSize = 24,
  search,
}: {
  page?: number;
  pageSize?: number;
  search?: string;
} = {}) {
  const where = {
    ...PUBLISHED_FILTER,
    ...(search
      ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { shortDescription: { contains: search, mode: 'insensitive' as const } },
        ],
      }
      : {}),
  };

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        _count: {
          select: {
            coupons: { where: PUBLISHED_FILTER },
            deals: { where: PUBLISHED_FILTER },
          },
        },
      },
    }),
    prisma.store.count({ where }),
  ]);

  return {
    stores,
    total,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
  };
}

/**
 * Get a single store by slug with its categories.
 */
export async function getStoreBySlug(slug: string) {
  return prisma.store.findUnique({
    where: { slug },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      _count: {
        select: {
          coupons: { where: PUBLISHED_FILTER },
          deals: { where: PUBLISHED_FILTER },
        },
      },
    },
  });
}

/**
 * Get active coupons for a store.
 */
export async function getStoreCoupons(storeId: string, limit = 20) {
  const now = new Date();
  return prisma.coupon.findMany({
    where: {
      storeId,
      status: ContentStatus.PUBLISHED,
      OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
    },
    orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    take: limit,
    include: {
      store: { select: { name: true, slug: true, logo: true } },
      categories: { include: { category: true } },
    },
  });
}

/**
 * Get active deals for a store.
 */
export async function getStoreDeals(storeId: string, limit = 20) {
  const now = new Date();
  return prisma.deal.findMany({
    where: {
      storeId,
      status: ContentStatus.PUBLISHED,
      OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
    },
    orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    take: limit,
    include: {
      store: { select: { name: true, slug: true, logo: true } },
      categories: { include: { category: true } },
    },
  });
}
