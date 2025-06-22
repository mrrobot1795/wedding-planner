'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import Layout from '@/components/Layout';
import { useSearchParams } from 'next/navigation';

// Create a client component that safely uses useSearchParams
function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') ?? '/';
  const errorType = searchParams?.get('error');
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

  const handleGoogleSignIn = () => {
    try {
      setIsLoading(true);
      setError('');

      // Start the Google OAuth sign-in process with redirect
      // When redirect is true, we shouldn't try to handle the result as this code won't execute
      // after the redirect happens
      signIn('google', {
        callbackUrl,
        redirect: true,
      });

      // The code below won't be executed due to the redirect
      // No need for error handling here as the page will be redirected to Google
    } catch (error) {
      // This will only run if there's an exception before the redirect happens
      setIsLoading(false);
      setError('Failed to start authentication process');
      console.error('Sign in initialization error:', error);
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
                    <g transform="matrix(1, 0, 0, 1, 0, 0)">
                      <path
                        d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29v-3.09h-3.98c-.8 1.6-1.26 3.41-1.26 5.38s.46 3.78 1.26 5.38l3.98-3.09z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42c-2.08-1.94-4.8-3.13-8.02-3.13-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                        fill="#EA4335"
                      />
                    </g>
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

// Export the main LoginPage component with Suspense
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Layout requireAuth={false}>
          <div className="min-h-[70vh] flex items-center justify-center">
            <div className="bg-gradient-to-b from-teal-900 to-teal-700 p-8 rounded-xl shadow-lg max-w-md w-full border border-teal-600">
              <div className="text-center">
                <p className="text-teal-200">Loading...</p>
              </div>
            </div>
          </div>
        </Layout>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
