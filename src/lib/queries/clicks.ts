import prisma from '@/lib/db';
import { ClickTargetType } from '@/app/generated/prisma/enums';

interface RecordClickInput {
  targetType: ClickTargetType;
  couponId?: string;
  dealId?: string;
  storeId: string;
  ipHash?: string;
  userAgent?: string;
  referrer?: string;
}

/**
 * Record a click event and increment the cached click count on the coupon or deal.
 */
export async function recordClick(data: RecordClickInput) {
  const { targetType, couponId, dealId, storeId, ipHash, userAgent, referrer } = data;

  // Create click record and increment cached count in a transaction
  await prisma.$transaction([
    prisma.click.create({
      data: {
        targetType,
        couponId,
        dealId,
        storeId,
        ipHash,
        userAgent: userAgent?.substring(0, 500),
        referrer: referrer?.substring(0, 500),
      },
    }),
    // Increment cached click count
    ...(targetType === ClickTargetType.COUPON && couponId
      ? [
          prisma.coupon.update({
            where: { id: couponId },
            data: { clickCount: { increment: 1 } },
          }),
        ]
      : []),
    ...(targetType === ClickTargetType.DEAL && dealId
      ? [
          prisma.deal.update({
            where: { id: dealId },
            data: { clickCount: { increment: 1 } },
          }),
        ]
      : []),
  ]);
}
