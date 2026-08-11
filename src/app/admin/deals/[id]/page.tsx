import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import DealForm from './DealForm';

export default async function EditDealPage({ params }: PageProps<'/admin/deals/[id]'>) {
  const { id } = await params;
  
  const [stores, categories] = await Promise.all([
    prisma.store.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.category.findMany({ select: { id: true, name: true, image: true }, orderBy: { name: 'asc' } }),
  ]);

  if (id === 'new') {
    return <DealForm stores={stores} categories={categories} />;
  }

  const deal = await prisma.deal.findUnique({
    where: { id },
    include: { categories: true }
  });
  
  if (!deal) {
    notFound();
  }

  return <DealForm deal={deal} stores={stores} categories={categories} />;
}
