import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Skip API call if no query and no session_id
    if (!body.query && !body.session_id) {
      return NextResponse.json({ results: [] });
    }
    
    // Call your backend API to search
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to search', details: error.message }, 
      { status: 500 }
    );
  }
}