import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Guest from '@/models/Guest';
import { logger } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;

    await connectDB();

    const guest = await Guest.findById(id);

    if (!guest) {
      return NextResponse.json(
        { success: false, error: 'Guest not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: guest }, { status: 200 });
  } catch (error) {
    console.error('Error fetching guest:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch guest' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const body = await request.json();

    // Ensure additionalGuests is properly converted to a number
    if (body.additionalGuests !== undefined) {
      body.additionalGuests = Number(body.additionalGuests);
    }

    logger.info('Updating guest with ID:', id);
    logger.info('Update body:', body);

    await connectDB();

    const guest = await Guest.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!guest) {
      return NextResponse.json(
        { success: false, error: 'Guest not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: guest }, { status: 200 });
  } catch (error) {
    console.error('Error updating guest:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update guest' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;

    await connectDB();

    const guest = await Guest.findByIdAndDelete(id);

    if (!guest) {
      return NextResponse.json(
        { success: false, error: 'Guest not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete guest' },
      { status: 500 },
    );
  }
}
