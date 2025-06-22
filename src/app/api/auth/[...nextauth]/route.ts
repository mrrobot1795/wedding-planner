import GoogleProvider from 'next-auth/providers/google';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import { Adapter } from 'next-auth/adapters';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// Define the auth options but don't export them directly
const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Detect the URL for auth callbacks automatically
  // This ensures it works in both local development and on Vercel
  useSecureCookies: process.env.NODE_ENV === 'production',
  callbacks: {
    async session({ session, token }) {
      // Add user id to the session
      if (token && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ account, profile }) {
      // Add detailed logging to help troubleshoot authentication issues
      console.log('SignIn callback executed');
      console.log('Account provider:', account?.provider);
      console.log('Profile email:', profile?.email);
      
      // Allow sign in with any OAuth account
      // This prevents the "OAuthAccountNotLinked" error
      return true;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to the login page with error messages
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Create the handler with the authOptions and export it directly as GET and POST
// This follows the correct pattern for Next.js App Router API routes
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
