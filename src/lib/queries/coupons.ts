import prisma from '@/lib/db';
import { ContentStatus } from '@/app/generated/prisma/enums';

/**
 * Get featured coupons for homepage.
 */
export async function getFeaturedCoupons(limit = 8) {
  const now = new Date();
  return prisma.coupon.findMany({
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
 * Get latest coupons.
 */
export async function getLatestCoupons(limit = 10) {
  const now = new Date();
  return prisma.coupon.findMany({
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
 * Get all published coupons, paginated, with optional filters.
 */
export async function getAllCoupons({
  page = 1,
  pageSize = 16,
  search,
  categorySlug,
  storeSlug,
  verified,
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  categorySlug?: string;
  storeSlug?: string;
  verified?: boolean;
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
          { code: { contains: search, mode: 'insensitive' } },
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

  if (verified !== undefined) {
    where.isVerified = verified;
  }

  const [coupons, total] = await Promise.all([
    prisma.coupon.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        store: { select: { name: true, slug: true, logo: true } },
        categories: { include: { category: true } },
      },
    }),
    prisma.coupon.count({ where }),
  ]);

  return {
    coupons,
    total,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
  };
}

/**
 * Get a single coupon by slug.
 */
export async function getCouponBySlug(slug: string) {
  return prisma.coupon.findUnique({
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
 * Get related coupons (same store, excluding current).
 */
export async function getRelatedCoupons(couponId: string, storeId: string, limit = 4) {
  const now = new Date();
  return prisma.coupon.findMany({
    where: {
      storeId,
      id: { not: couponId },
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
