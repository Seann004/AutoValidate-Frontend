import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { query: string } }
) {
  try {
    const query = params.query;
    
    // Call your backend API to detect brand typos
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/detect/brand/${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error detecting brand typo:', error);
    return NextResponse.json({ error: 'Failed to detect brand typo' }, { status: 500 });
  }
}