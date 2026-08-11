import { NextRequest } from 'next/server';
import { searchAll } from '@/lib/queries/search';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  if (!query.trim()) {
    return Response.json({ stores: [], coupons: [], deals: [] });
  }

  try {
    const results = await searchAll(query, 5);
    return Response.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
