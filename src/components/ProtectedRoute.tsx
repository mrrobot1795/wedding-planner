'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (!session) {
      // Redirect to login page if not authenticated
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    // Show loading spinner while session is being loaded
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!session) {
    // Don't render anything if not authenticated (will redirect in useEffect)
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
}
