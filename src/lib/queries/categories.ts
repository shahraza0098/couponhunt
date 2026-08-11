import prisma from '@/lib/db';
import { ContentStatus } from '@/app/generated/prisma/enums';

/**
 * Get featured categories for homepage.
 */
export async function getFeaturedCategories(limit = 8) {
  return prisma.category.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      parentId: null,
    },
    orderBy: { sortOrder: 'asc' },
    take: limit,
    include: {
      _count: {
        select: {
          coupons: true,
          deals: true,
        },
      },
    },
  });
}

/**
 * Get all published categories (top-level with children).
 */
export async function getAllCategories() {
  return prisma.category.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      parentId: null,
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      children: {
        where: { status: ContentStatus.PUBLISHED },
        orderBy: { sortOrder: 'asc' },
        include: {
          _count: {
            select: { coupons: true, deals: true },
          },
        },
      },
      _count: {
        select: { coupons: true, deals: true },
      },
    },
  });
}

/**
 * Get a single category by slug with its coupons and deals.
 */
export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        where: { status: ContentStatus.PUBLISHED },
        orderBy: { sortOrder: 'asc' },
      },
      parent: { select: { name: true, slug: true } },
      _count: {
        select: { coupons: true, deals: true },
      },
    },
  });
}

/**
 * Get coupons for a category.
 */
export async function getCategoryCoupons(categoryId: string, limit = 16) {
  const now = new Date();
  return prisma.coupon.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      categories: { some: { categoryId } },
      OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
    },
    orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    take: limit,
    include: {
      store: { select: { name: true, slug: true, logo: true } },
    },
  });
}

/**
 * Get deals for a category.
 */
export async function getCategoryDeals(categoryId: string, limit = 16) {
  const now = new Date();
  return prisma.deal.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      categories: { some: { categoryId } },
      OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
    },
    orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    take: limit,
    include: {
      store: { select: { name: true, slug: true, logo: true } },
    },
  });
}
