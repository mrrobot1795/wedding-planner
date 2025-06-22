import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import ProtectedRoute from './ProtectedRoute';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, icon }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-teal-700 text-teal-50'
          : 'hover:bg-teal-600 hover:text-teal-50 text-teal-200'
      }`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{children}</span>
    </Link>
  );
};

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { data: session } = useSession();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-teal-800 text-teal-100 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
        >
          {sidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          className="fixed inset-0 backdrop-blur-sm bg-teal-900/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
          tabIndex={0}
        />
      )}
      {/* Sidebar */}
      <div
        className={`
        w-64 bg-gradient-to-b from-teal-900 to-teal-700 text-teal-50 h-full fixed left-0 top-0 shadow-lg z-30
        transition-transform duration-300 ease-in-out transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      >
        <div className="p-5">
          <div className="flex items-center justify-center mb-8 pt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mr-2 text-teal-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <h2 className="text-2xl font-bold text-white">Wedding Planner</h2>
          </div>
          <nav className="flex flex-col space-y-2">
            <NavLink
              href="/"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              href="/guests"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              }
            >
              Guest Management
            </NavLink>
            <NavLink
              href="/budget"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              }
            >
              Budget Tracking
            </NavLink>
            <NavLink
              href="/vendors"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              }
            >
              Vendor Management
            </NavLink>
            <NavLink
              href="/checklist"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              }
            >
              Checklist
            </NavLink>
          </nav>

          {/* User profile section */}
          <div className="mt-6 pt-6 border-t border-teal-700">
            {session ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 px-2">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? 'User'}
                      width={32}
                      height={32}
                      className="rounded-full border border-teal-500"
                    />
                  )}
                  <div>
                    <p className="font-medium text-sm text-teal-200">
                      {session.user?.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full text-left px-4 py-2 rounded-md text-sm text-teal-200 hover:bg-teal-700 transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block w-full text-center px-4 py-2 rounded-md text-sm bg-teal-600 text-white hover:bg-teal-500 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default function Layout({
  children,
  requireAuth = true,
}: Readonly<{
  children: React.ReactNode;
  requireAuth?: boolean;
}>) {
  // Wrap with ProtectedRoute if authentication is required
  const content = (
    <div className="flex min-h-screen bg-gradient-to-br from-olive-800 via-olive-700 to-olive-600">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-64 p-4 sm:p-6 md:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );

  return requireAuth ? <ProtectedRoute>{content}</ProtectedRoute> : content;
}
