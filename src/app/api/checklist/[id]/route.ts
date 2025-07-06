import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ChecklistItem from '@/models/ChecklistItem';
import { emailService } from '@/lib/email-service';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import { Adapter } from 'next-auth/adapters';

// Auth options configuration (matching the main NextAuth config)
const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: 'wedding-planner',
  }) as Adapter,
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({
      session,
      token,
    }: {
      session: {
        user?: { id?: string; name?: string | null; email?: string | null };
      };
      token: { sub?: string };
    }) {
      if (token && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn() {
      return true;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Get user from NextAuth session
async function getUserFromSession() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return null;
    }

    // Convert user ID to ObjectId for MongoDB
    const userId = session.user.id
      ? new mongoose.Types.ObjectId(session.user.id)
      : new mongoose.Types.ObjectId();

    return {
      id: userId,
      email: session.user.email ?? 'unknown@example.com',
      name: session.user.name ?? 'Unknown User',
    };
  } catch (error) {
    console.error('Error getting user from session:', error);
    return null;
  }
}

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
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await request.json();

    await connectDB();

    // Get the current checklist item to check for assignment changes
    const currentItem = await ChecklistItem.findById(id);
    if (!currentItem) {
      return NextResponse.json(
        { success: false, error: 'Checklist item not found' },
        { status: 404 },
      );
    }

    // Check if task is being marked as completed
    const wasCompleted = currentItem.completed;
    const isBeingCompleted = body.completed && !wasCompleted;

    // Add completion timestamp if task is being completed
    if (isBeingCompleted) {
      body.completedAt = new Date();
    }

    // Check if task is being assigned to a new person
    const isNewAssignment =
      body.assignedTo &&
      body.assignedToEmail &&
      (body.assignedTo !== currentItem.assignedTo ||
        body.assignedToEmail !== currentItem.assignedToEmail);

    if (isNewAssignment) {
      body.assignedBy = user.name ?? user.email;
      body.assignedAt = new Date();
      body.emailSent = false; // Reset email status for new assignment
    }

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

    // Send email notifications
    try {
      // Send assignment email for new assignments
      if (isNewAssignment && emailService.isEmailServiceConfigured()) {
        const emailSent = await emailService.sendTaskAssignmentEmail(
          checklistItem.assignedToEmail,
          {
            taskTitle: checklistItem.title,
            taskDescription: checklistItem.description,
            dueDate: checklistItem.dueDate,
            priority: checklistItem.priority,
            category: checklistItem.category,
            assignerName: user.name ?? user.email ?? 'Wedding Planner',
            taskUrl: `${process.env.NEXTAUTH_URL}/checklist`,
          },
        );

        if (emailSent) {
          await ChecklistItem.findByIdAndUpdate(id, {
            emailSent: true,
            emailSentAt: new Date(),
          });
        }
      }

      // Send completion notification to assigner
      if (
        isBeingCompleted &&
        currentItem.assignedBy &&
        emailService.isEmailServiceConfigured()
      ) {
        // Try to find assigner's email - in a real app you'd look this up from user database
        const assignerEmail = user.email; // Simplified - should be the actual assigner's email

        await emailService.sendTaskCompletionEmail(assignerEmail, {
          taskTitle: checklistItem.title,
          completedBy: user.name ?? user.email ?? 'Unknown',
          completionDate: new Date(),
        });
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
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
