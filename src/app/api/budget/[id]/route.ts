import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BudgetItem from '@/models/BudgetItem';

export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const { id } = context.params;

    await connectDB();

    const budgetItem = await BudgetItem.findById(id).populate('vendor', 'name');

    if (!budgetItem) {
      return NextResponse.json(
        { success: false, error: 'Budget item not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: budgetItem },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching budget item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budget item' },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const { id } = context.params;
    const body = await req.json();

    await connectDB();

    const budgetItem = await BudgetItem.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate('vendor', 'name');

    if (!budgetItem) {
      return NextResponse.json(
        { success: false, error: 'Budget item not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: budgetItem },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating budget item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update budget item' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const { id } = context.params;

    await connectDB();

    const budgetItem = await BudgetItem.findByIdAndDelete(id);

    if (!budgetItem) {
      return NextResponse.json(
        { success: false, error: 'Budget item not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    console.error('Error deleting budget item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete budget item' },
      { status: 500 },
    );
  }
}
