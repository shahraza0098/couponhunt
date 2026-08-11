import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import CategoryForm from './CategoryForm';

export default async function EditCategoryPage({ params }: PageProps<'/admin/categories/[id]'>) {
  const { id } = await params;
  
  const parents = await prisma.category.findMany({ select: { id: true, name: true } });

  if (id === 'new') {
    return <CategoryForm parents={parents} />;
  }

  const category = await prisma.category.findUnique({ where: { id } });
  
  if (!category) {
    notFound();
  }

  return <CategoryForm category={category} parents={parents} />;
}
