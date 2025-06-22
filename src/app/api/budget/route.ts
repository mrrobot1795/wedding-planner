/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BudgetItem from '@/models/BudgetItem';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const budgetItems = await BudgetItem.find({}).populate('vendor', 'name');

    return NextResponse.json(
      { success: true, data: budgetItems },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching budget items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budget items' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    await connectDB();

    const budgetItem = await BudgetItem.create(body);

    return NextResponse.json(
      { success: true, data: budgetItem },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating budget item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create budget item' },
      { status: 500 },
    );
  }
}
