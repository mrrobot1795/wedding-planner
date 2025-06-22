'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Layout from '@/components/Layout';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const errorType = searchParams.get('error');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(() => {
    // Handle authentication errors from the URL
    if (errorType === 'OAuthAccountNotLinked') {
      return 'The email is already associated with another account. Please sign in with the original provider.';
    } else if (errorType) {
      return 'An error occurred during authentication. Please try again.';
    }
    return '';
  });

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      // Start the Google OAuth sign-in process
      const result = await signIn('google', {
        callbackUrl,
        redirect: true,
      });
      // This won't be reached if redirect is true
      if (!result?.ok) {
        setError('Failed to sign in with Google');
      }
    } catch (error) {
      setError('An error occurred while signing in');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Layout requireAuth={false}>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-gradient-to-b from-teal-900 to-teal-700 p-8 rounded-xl shadow-lg max-w-md w-full border border-teal-600">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
            <p className="text-teal-200">
              Sign in to access your wedding planner
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-md border border-gray-300 shadow-sm flex items-center justify-center transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <svg
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                      fill="#4285F4"
                    />
                    <path
                      d="M0 11.449h4.826V6.085H0v5.364zm23.862-9.303v5.364h-3.359v-5.364h-5.364V.787h5.364V.787h3.359v1.359z"
                      fill="#34A853"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-teal-200 text-sm">
              By signing in, you agree to our privacy policy and terms of
              service.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
