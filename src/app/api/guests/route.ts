/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Guest from '@/models/Guest';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const guests = await Guest.find({});

    return NextResponse.json({ success: true, data: guests }, { status: 200 });
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch guests' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Ensure additionalGuests is properly converted to a number
    if (body.additionalGuests !== undefined) {
      body.additionalGuests = Number(body.additionalGuests);
    }

    await connectDB();

    const guest = await Guest.create(body);

    return NextResponse.json({ success: true, data: guest }, { status: 201 });
  } catch (error) {
    console.error('Error creating guest:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create guest' },
      { status: 500 },
    );
  }
}
