import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ChecklistItem from '@/models/ChecklistItem';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;

    await connectDB();

    const checklistItem = await ChecklistItem.findById(id);

    if (!checklistItem) {
      return NextResponse.json(
        { success: false, error: 'Checklist item not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: checklistItem },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching checklist item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch checklist item' },
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

    await connectDB();

    const checklistItem = await ChecklistItem.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!checklistItem) {
      return NextResponse.json(
        { success: false, error: 'Checklist item not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: checklistItem },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating checklist item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update checklist item' },
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

    const checklistItem = await ChecklistItem.findByIdAndDelete(id);

    if (!checklistItem) {
      return NextResponse.json(
        { success: false, error: 'Checklist item not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    console.error('Error deleting checklist item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete checklist item' },
      { status: 500 },
    );
  }
}
