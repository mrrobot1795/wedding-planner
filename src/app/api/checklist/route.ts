/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ChecklistItem from '@/models/ChecklistItem';
import { emailService } from '@/lib/email-service';
import mongoose from 'mongoose';

// We'll need to import authOptions from the NextAuth route
// For now, let's create a basic auth check
async function getUserFromSession() {
  // This is a simplified version - in a real app you'd want proper session handling
  // For now, we'll just return a mock user ID with a proper ObjectId
  return {
    id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    email: 'user@example.com',
    name: 'Test User',
  };
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    await connectDB();

    const checklistItems = await ChecklistItem.find({ userId: user.id });

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
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const body = await req.json();

    await connectDB();

    // Add userId to the checklist item
    const checklistItemData = {
      ...body,
      userId: user.id,
    };

    // If assigning to someone and email is provided, set assignment fields
    if (body.assignedTo && body.assignedToEmail) {
      checklistItemData.assignedBy = user.name || user.email;
      checklistItemData.assignedAt = new Date();
    }

    const checklistItem = await ChecklistItem.create(checklistItemData);

    // Send email notification if task is assigned to someone
    if (
      checklistItem.assignedTo &&
      checklistItem.assignedToEmail &&
      emailService.isEmailServiceConfigured()
    ) {
      try {
        const emailSent = await emailService.sendTaskAssignmentEmail(
          checklistItem.assignedToEmail,
          {
            taskTitle: checklistItem.title,
            taskDescription: checklistItem.description,
            dueDate: checklistItem.dueDate,
            priority: checklistItem.priority,
            category: checklistItem.category,
            assignerName: user.name || user.email || 'Wedding Planner',
            taskUrl: `${process.env.NEXTAUTH_URL}/checklist`,
          },
        );

        if (emailSent) {
          // Update the checklist item to mark email as sent
          await ChecklistItem.findByIdAndUpdate(checklistItem._id, {
            emailSent: true,
            emailSentAt: new Date(),
          });
        }
      } catch (emailError) {
        console.error('Failed to send assignment email:', emailError);
        // Don't fail the request if email fails
      }
    }

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
