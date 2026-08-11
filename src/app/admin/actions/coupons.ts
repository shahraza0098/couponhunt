'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { ContentStatus, CouponType, DiscountType } from '@/app/generated/prisma/enums';

export async function saveCouponAction(prevState: any, formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const isNew = id === 'new';

    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const code = formData.get('code') as string;
    const couponType = formData.get('couponType') as CouponType;
    const discountType = formData.get('discountType') as DiscountType | '';
    const discountValue = formData.get('discountValue') ? Number(formData.get('discountValue')) : null;
    const minimumOrderValue = formData.get('minimumOrderValue') ? Number(formData.get('minimumOrderValue')) : null;
    const maximumDiscount = formData.get('maximumDiscount') ? Number(formData.get('maximumDiscount')) : null;
    const couponUrl = formData.get('couponUrl') as string;
    const startsAt = formData.get('startsAt') ? new Date(formData.get('startsAt') as string) : null;
    const expiresAt = formData.get('expiresAt') ? new Date(formData.get('expiresAt') as string) : null;
    const status = formData.get('status') as ContentStatus;
    const isVerified = formData.get('isVerified') === 'on';
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
      code: code || null,
      couponType,
      discountType: discountType || null,
      discountValue,
      minimumOrderValue,
      maximumDiscount,
      couponUrl: couponUrl || null,
      startsAt,
      expiresAt,
      status,
      isVerified,
      verifiedAt: isVerified ? new Date() : null,
      isFeatured,
      storeId,
    };

    if (isNew) {
      const coupon = await prisma.coupon.create({ data });
      if (categoryIds.length > 0) {
        await prisma.couponCategory.createMany({
          data: categoryIds.map(categoryId => ({ couponId: coupon.id, categoryId }))
        });
      }
    } else {
      await prisma.coupon.update({ where: { id }, data });
      // Update categories (delete all and recreate)
      await prisma.couponCategory.deleteMany({ where: { couponId: id } });
      if (categoryIds.length > 0) {
        await prisma.couponCategory.createMany({
          data: categoryIds.map(categoryId => ({ couponId: id, categoryId }))
        });
      }
    }

    revalidatePath('/admin/coupons');
    revalidatePath('/coupons');
    
    return { success: true, redirect: '/admin/coupons', error: '' };
  } catch (error: any) {
    console.error('Save coupon error:', error);
    return { success: false, error: error.message || 'Failed to save coupon', redirect: '' };
  }
}

export async function deleteCouponAction(id: string) {
  try {
    await prisma.coupon.delete({ where: { id } });
    revalidatePath('/admin/coupons');
    revalidatePath('/coupons');
    return { success: true };
  } catch (error: any) {
    console.error('Delete coupon error:', error);
    return { error: error.message || 'Failed to delete coupon' };
  }
}
