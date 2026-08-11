'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { ContentStatus, DiscountType } from '@/app/generated/prisma/enums';
import { uploadImage } from '@/lib/supabase-storage';

export async function saveDealAction(prevState: any, formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const isNew = id === 'new';

    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const productName = formData.get('productName') as string;
    const productUrl = formData.get('productUrl') as string;
    
    // Handle Image Upload
    let productImageUrl = formData.get('existingImage') as string;
    const imageFile = formData.get('productImage') as File | null;
    if (imageFile && imageFile.size > 0) {
      productImageUrl = await uploadImage(imageFile);
    }

    const currency = formData.get('currency') as string;
    const originalPrice = formData.get('originalPrice') ? Number(formData.get('originalPrice')) : null;
    const salePrice = formData.get('salePrice') ? Number(formData.get('salePrice')) : null;
    
    const discountType = formData.get('discountType') as DiscountType | '';
    const discountValue = formData.get('discountValue') ? Number(formData.get('discountValue')) : null;
    
    const startsAt = formData.get('startsAt') ? new Date(formData.get('startsAt') as string) : null;
    const expiresAt = formData.get('expiresAt') ? new Date(formData.get('expiresAt') as string) : null;
    const status = formData.get('status') as ContentStatus;
    const isFeatured = formData.get('isFeatured') === 'on';
    const storeId = formData.get('storeId') as string;
    const categoryIds = formData.getAll('categoryIds') as string[];

    if (!storeId) {
      return { error: 'Store is required' };
    }

    const data = {
      title,
      slug,
      description: description || null,
      productName: productName || null,
      productImage: productImageUrl || null,
      productUrl: productUrl || null,
      originalPrice,
      salePrice,
      currency: currency || 'INR',
      discountType: discountType || null,
      discountValue,
      startsAt,
      expiresAt,
      status,
      isFeatured,
      storeId,
    };

    if (isNew) {
      const deal = await prisma.deal.create({ data });
      if (categoryIds.length > 0) {
        await prisma.dealCategory.createMany({
          data: categoryIds.map(categoryId => ({ dealId: deal.id, categoryId }))
        });
      }
    } else {
      await prisma.deal.update({ where: { id }, data });
      // Update categories (delete all and recreate)
      await prisma.dealCategory.deleteMany({ where: { dealId: id } });
      if (categoryIds.length > 0) {
        await prisma.dealCategory.createMany({
          data: categoryIds.map(categoryId => ({ dealId: id, categoryId }))
        });
      }
    }

    revalidatePath('/admin/deals');
    revalidatePath('/deals');
    
    return { success: true, redirect: '/admin/deals', error: '' };
  } catch (error: any) {
    console.error('Save deal error:', error);
    return { success: false, error: error.message || 'Failed to save deal', redirect: '' };
  }
}

export async function deleteDealAction(id: string) {
  try {
    await prisma.deal.delete({ where: { id } });
    revalidatePath('/admin/deals');
    revalidatePath('/deals');
    return { success: true };
  } catch (error: any) {
    console.error('Delete deal error:', error);
    return { error: error.message || 'Failed to delete deal' };
  }
}
