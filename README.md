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

## Features

- **Dashboard Overview**: Quick view of wedding planning progress
- **Guest Management**: Track RSVPs, dietary restrictions, and plus ones
- **Budget Tracking**: Monitor estimated and actual costs
- **Vendor Management**: Keep track of all wedding vendors and contacts
- **Wedding Checklist**: Tasks and to-dos for wedding planning

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
   ```
4. Set up Google OAuth credentials (see `AUTH_SETUP.md` for detailed instructions)

5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
