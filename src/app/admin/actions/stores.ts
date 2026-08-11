'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ContentStatus } from '@/app/generated/prisma/enums';
import { uploadImage } from '@/lib/supabase-storage';

export async function saveStoreAction(prevState: any, formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const isNew = id === 'new';

    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const description = formData.get('description') as string;
    const websiteUrl = formData.get('websiteUrl') as string;
    const status = formData.get('status') as ContentStatus;
    const isFeatured = formData.get('isFeatured') === 'on';
    const isPopular = formData.get('isPopular') === 'on';

    // Handle Image Uploads
    let logoUrl = formData.get('existingLogo') as string;
    const logoFile = formData.get('logo') as File | null;
    if (logoFile && logoFile.size > 0) {
      logoUrl = await uploadImage(logoFile);
    }

    let bannerUrl = formData.get('existingBanner') as string;
    const bannerFile = formData.get('bannerImage') as File | null;
    if (bannerFile && bannerFile.size > 0) {
      bannerUrl = await uploadImage(bannerFile);
    }

    const data = {
      name,
      slug,
      logo: logoUrl || null,
      bannerImage: bannerUrl || null,
      shortDescription: shortDescription || null,
      description: description || null,
      websiteUrl: websiteUrl || null,
      status,
      isFeatured,
      isPopular,
    };

    if (isNew) {
      await prisma.store.create({ data });
    } else {
      await prisma.store.update({ where: { id }, data });
    }

    revalidatePath('/admin/stores');
    revalidatePath('/stores');
    
    return { success: true, redirect: '/admin/stores', error: '' };
  } catch (error: any) {
    console.error('Save store error:', error);
    return { success: false, error: error.message || 'Failed to save store', redirect: '' };
  }
}

export async function deleteStoreAction(id: string) {
  try {
    await prisma.store.delete({ where: { id } });
    revalidatePath('/admin/stores');
    revalidatePath('/stores');
    return { success: true };
  } catch (error: any) {
    console.error('Delete store error:', error);
    return { error: error.message || 'Failed to delete store' };
  }
}
