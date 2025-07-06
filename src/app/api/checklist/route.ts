/* eslint-disable @typescript-eslint/no-unused-vars */
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

    // Find tasks that the user either created OR are assigned to them
    const checklistItems = await ChecklistItem.find({
      $or: [
        { userId: user.id }, // Tasks created by the user
        { assignedToEmail: user.email }, // Tasks assigned to the user
      ],
    });

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
      checklistItemData.assignedBy = user.name ?? user.email;
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
            assignerName: user.name ?? user.email ?? 'Wedding Planner',
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
