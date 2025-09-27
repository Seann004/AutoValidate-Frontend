import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Forward the request to your backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-voc`, {
      method: 'POST',
      headers: {
         "x-api-key": process.env.SSS_API_KEY || "",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error uploading VOC:', error);
    return NextResponse.json(
      { error: 'Failed to upload VOC file', details: error.message }, 
      { status: 500 }
    );
  }
}