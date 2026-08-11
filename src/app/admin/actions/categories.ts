'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { ContentStatus } from '@/app/generated/prisma/enums';
import { uploadImage } from '@/lib/supabase-storage';

export async function saveCategoryAction(prevState: any, formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const isNew = id === 'new';

    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const parentId = formData.get('parentId') as string;
    const status = formData.get('status') as ContentStatus;
    const isFeatured = formData.get('isFeatured') === 'on';

    // Instead of image upload, for categories we often just use emoji strings or icons.
    // If they want real images, we can do it, but schema has `image String?`. The user was using emojis in the seed.
    // I will let them provide a string OR upload an image if it's a file.
    
    let imageUrl = formData.get('existingImage') as string;
    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile);
    } else {
      // If it's just a text string (like an emoji) from a text input fallback (if we had one, but we use file)
      // Actually we'll just keep the existing image if no new file is uploaded.
    }

    const data = {
      name,
      slug,
      image: imageUrl || null,
      description: description || null,
      parentId: parentId || null,
      status,
      isFeatured,
    };

    if (isNew) {
      await prisma.category.create({ data });
    } else {
      await prisma.category.update({ where: { id }, data });
    }

    revalidatePath('/admin/categories');
    revalidatePath('/categories');
    
    return { success: true, redirect: '/admin/categories', error: '' };
  } catch (error: any) {
    console.error('Save category error:', error);
    return { success: false, error: error.message || 'Failed to save category', redirect: '' };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath('/admin/categories');
    revalidatePath('/categories');
    return { success: true };
  } catch (error: any) {
    console.error('Delete category error:', error);
    return { error: error.message || 'Failed to delete category' };
  }
}
