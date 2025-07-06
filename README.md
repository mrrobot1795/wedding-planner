# Wedding Planner Dashboard

A comprehensive wedding planning application built with Next.js, TypeScript, Tailwind CSS, and MongoDB/Mongoose.

## Project Structure

- `/src/app`: Next.js 14 app directory structure
  - `/api`: API routes for CRUD operations
  - `/guests`, `/budget`, etc.: Main application pages
  - `/login`: Authentication page
- `/src/components`: Reusable UI components
- `/src/lib`: Utility functions and services
  - `db.ts`: MongoDB connection
  - `api.ts`: API service hooks
  - `mongodb.ts`: MongoDB client for NextAuth
- `/src/models`: Mongoose models for MongoDB

## Features

- **Authentication**: Google OAuth integration with NextAuth.js
- **Dashboard Overview**: Quick view of wedding planning progress
- **Guest Management**: Track RSVPs, dietary restrictions, and plus ones
- **Budget Tracking**: Monitor estimated and actual costs
- **Vendor Management**: Keep track of all wedding vendors and contacts
- **Wedding Checklist**: Tasks and to-dos for wedding planning
- **Email Notifications**: Automatic email notifications for task assignments and completions

## Features

- **Dashboard Overview**: Quick view of wedding planning progress
- **Guest Management**: Track RSVPs, dietary restrictions, and plus ones
- **Budget Tracking**: Monitor estimated and actual costs
- **Vendor Management**: Keep track of all wedding vendors and contacts
- **Wedding Checklist**: Tasks and to-dos for wedding planning
- **Email Notifications**:
  - Automatic email notifications when tasks are assigned to team members
  - Completion notifications when tasks are marked as done
  - Email status tracking (sent/pending) in the UI

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, and Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with Google OAuth

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables in `.env.local` (see `.env.local.example` for template):

   ```
   MONGODB_URI=your_mongodb_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # Email service configuration for task notifications
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com
   EMAIL_FROM_NAME=Wedding Planner App
   ```

4. Set up Google OAuth credentials (see `AUTH_SETUP.md` for detailed instructions)

5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Email Notification Setup

The wedding planner now includes automatic email notifications for task assignments and completions. To set up email notifications:

1. **Configure your email service** in `.env.local`:

   - For Gmail: Enable 2FA and create an App Password
   - For other services: Use your SMTP settings

2. **Test the email functionality**:

   - Visit `/test-email` to send a test notification
   - Create a task with an assigned email to test assignment notifications

3. **Email features include**:
   - Task assignment notifications with due dates and details
   - Task completion notifications to the assigner
   - Email status tracking in the checklist UI
   - Automatic retry logic for failed emails

## Production Build and Deployment

### Building for Production

```bash
npm run build
```

### Running in Production Mode

This project uses Next.js `output: 'standalone'` configuration for optimized production deployment.

You have two options to run the production build:

1. **Using our helper script (recommended):**

   ```bash
   npm run start:standalone
   ```

2. **Using the standalone server directly:**
   ```bash
   node .next/standalone/server.js
   ```

> **Note:** The regular `npm start` command doesn't work with `output: standalone` configuration.

## Project Structure

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
