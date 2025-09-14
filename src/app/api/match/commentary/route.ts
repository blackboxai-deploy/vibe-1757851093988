import { NextResponse } from 'next/server';
import { cricketAPI } from '@/lib/cricket-api';

export async function GET() {
  try {
    const commentary = await cricketAPI.getCommentary();
    
    return NextResponse.json({
      success: true,
      data: commentary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch commentary',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}