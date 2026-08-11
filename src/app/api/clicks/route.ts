import { NextRequest } from 'next/server';
import { recordClick } from '@/lib/queries/clicks';
import { ClickTargetType } from '@/app/generated/prisma/enums';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetType, couponId, dealId, storeId } = body;

    if (!targetType || !storeId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!Object.values(ClickTargetType).includes(targetType)) {
      return Response.json({ error: 'Invalid target type' }, { status: 400 });
    }

    // Extract analytics data from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
    // Simple hash to avoid storing raw IPs
    const ipHash = btoa(ip).substring(0, 32);
    const userAgent = request.headers.get('user-agent') || undefined;
    const referrer = request.headers.get('referer') || undefined;

    await recordClick({
      targetType: targetType as ClickTargetType,
      couponId: couponId || undefined,
      dealId: dealId || undefined,
      storeId,
      ipHash,
      userAgent,
      referrer,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Click tracking error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
