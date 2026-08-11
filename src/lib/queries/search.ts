import prisma from '@/lib/db';
import { ContentStatus } from '@/app/generated/prisma/enums';

/**
 * Search across stores, coupons, and deals.
 */
export async function searchAll(query: string, limit = 10) {
  if (!query || query.trim().length === 0) {
    return { stores: [], coupons: [], deals: [] };
  }

  const searchTerm = query.trim();
  const now = new Date();

  const [stores, coupons, deals] = await Promise.all([
    prisma.store.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { shortDescription: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      orderBy: { name: 'asc' },
      take: limit,
      include: {
        _count: {
          select: {
            coupons: { where: { status: ContentStatus.PUBLISHED } },
            deals: { where: { status: ContentStatus.PUBLISHED } },
          },
        },
      },
    }),
    prisma.coupon.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { code: { contains: searchTerm, mode: 'insensitive' } },
        ],
        AND: [
          { OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        store: { select: { name: true, slug: true, logo: true } },
      },
    }),
    prisma.deal.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { productName: { contains: searchTerm, mode: 'insensitive' } },
        ],
        AND: [
          { OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        store: { select: { name: true, slug: true, logo: true } },
      },
    }),
  ]);

  return { stores, coupons, deals };
}
