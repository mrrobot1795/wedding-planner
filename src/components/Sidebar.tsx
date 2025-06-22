'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer text-left w-full ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-700 hover:text-white'}`}
    >
      {children}
    </button>
  );
};

const Sidebar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-full fixed left-0 top-0 flex flex-col justify-between">
      <div className="p-5">
        <h2 className="text-2xl font-bold mb-6">Wedding Planner</h2>
        <nav className="flex flex-col space-y-1">
          <NavLink href="/">Dashboard</NavLink>
          <NavLink href="/guests">Guest Management</NavLink>
          <NavLink href="/budget">Budget Tracking</NavLink>
          <NavLink href="/vendors">Vendor Management</NavLink>
          <NavLink href="/checklist">Checklist</NavLink>
        </nav>
      </div>

      <div className="p-5 border-t border-gray-700">
        {status === 'authenticated' ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? 'User'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-medium text-sm text-teal-300">
                  {session.user?.name}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="w-full px-3 py-2 text-sm bg-teal-700 hover:bg-teal-600 rounded-md transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
