import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import StoreForm from './StoreForm';

export default async function EditStorePage({ params }: PageProps<'/admin/stores/[id]'>) {
  const { id } = await params;
  
  if (id === 'new') {
    return <StoreForm />;
  }

  const store = await prisma.store.findUnique({ where: { id } });
  
  if (!store) {
    notFound();
  }

  return <StoreForm store={store} />;
}
