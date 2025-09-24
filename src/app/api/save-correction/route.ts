import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { typo, corrected, domain } = await request.json();

    if (!typo || !corrected || !domain) {
      return NextResponse.json(
        { error: 'Missing required parameters' }, 
        { status: 400 }
      );
    }

    console.log('Sending correction to API:', { typo, corrected, domain });

    // Build URL with query parameters instead of sending in body
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/save-correction`);
    url.searchParams.append('typo', typo);
    url.searchParams.append('corrected', corrected);
    url.searchParams.append('domain', domain);

    // Send request with query parameters
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Empty body since we're using query parameters
    });

    if (!response.ok) {
      // Log more details about the error
      const errorText = await response.text();
      console.error(`API returned ${response.status}: ${errorText}`);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error saving correction:', error);
    return NextResponse.json(
      { error: 'Failed to save correction', details: error.message }, 
      { status: 500 }
    );
  }
}