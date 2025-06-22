/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ChecklistItem from '@/models/ChecklistItem';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const checklistItems = await ChecklistItem.find({});

    return NextResponse.json(
      { success: true, data: checklistItems },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching checklist items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch checklist items' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    await connectDB();

    const checklistItem = await ChecklistItem.create(body);

    return NextResponse.json(
      { success: true, data: checklistItem },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating checklist item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create checklist item' },
      { status: 500 },
    );
  }
}
