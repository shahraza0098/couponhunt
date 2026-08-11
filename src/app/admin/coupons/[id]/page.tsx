import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import CouponForm from './CouponForm';

export default async function EditCouponPage({ params }: PageProps<'/admin/coupons/[id]'>) {
  const { id } = await params;
  
  const [stores, categories] = await Promise.all([
    prisma.store.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.category.findMany({ select: { id: true, name: true, image: true }, orderBy: { name: 'asc' } }),
  ]);

  if (id === 'new') {
    return <CouponForm stores={stores} categories={categories} />;
  }

  const coupon = await prisma.coupon.findUnique({
    where: { id },
    include: { categories: true }
  });
  
  if (!coupon) {
    notFound();
  }

  return <CouponForm coupon={coupon} stores={stores} categories={categories} />;
}
