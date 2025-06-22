'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useGuests, useVendors, useBudget, useChecklist } from '@/lib/api';

interface DashboardCardProps {
  title: string;
  value: string;
  text: string;
  href: string;
  color: string;
  hoverColor: string;
  icon: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  text,
  href,
  color,
  hoverColor,
  icon,
}) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className={`${color} ${hoverColor} p-6 rounded-lg shadow-md transition-all hover:scale-105 hover:shadow-lg cursor-pointer w-full text-left flex items-start justify-between border border-teal-700`}
      aria-label={`View ${title}`}
    >
      <div>
        <h3 className="text-lg font-medium text-teal-50">{title}</h3>
        <p className="text-3xl font-bold mt-2 text-white">{value}</p>
        <p className="text-sm text-teal-100 mt-1">{text}</p>
      </div>
      <div className="text-teal-200 opacity-80">{icon}</div>
    </button>
  );
};

export default function Dashboard() {
  const router = useRouter();

  // Use API hooks to get real data
  const { guests } = useGuests();
  const { totalSpent, totalBudget } = useBudget();
  const { vendors } = useVendors();
  const { tasks } = useChecklist();

  // Calculate stats
  const confirmedGuests = guests.filter(
    (guest) => guest.rsvpStatus === 'confirmed',
  ).length;
  const confirmedVendors = vendors.filter(
    (vendor) => vendor.contractSigned,
  ).length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  // Wedding date
  const weddingDate = new Date('2025-11-07');
  const today = new Date();
  const daysLeft = Math.ceil(
    (weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <Layout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-r from-teal-800/90 to-teal-600/90 rounded-xl shadow-md border border-olive-700 p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-olive-50">
                Wedding Dashboard
              </h1>
              <p className="text-olive-200 mt-1">
                Plan your perfect day with ease
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-200/90 to-blue-200/90 p-5 rounded-lg shadow-md border border-olive-200 relative z-10">
              <p className="text-sm text-olive-700 font-medium">Wedding Date</p>
              <p className="text-2xl font-bold text-olive-900">
                November 7, 2025
              </p>
              <p className="text-sm text-olive-700 mt-1">
                {daysLeft} days to go!
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-5">
            <svg
              width="200"
              height="200"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path d="M18.7 19.5c1-.4 1.7-1.2 2-2.2.4-1 .3-2-.2-3l-1.4-3.2c-1-2.2-3.1-3.6-5.6-3.6h-2.8c-2.5 0-4.7 1.4-5.6 3.6L3.6 14.3c-.4 1-.5 2-.2 3 .3 1 1 1.8 2 2.2 1 .4 2.1.3 3-.2l1.4-.7c1-.4 2-.4 2.9 0l1.4.7c.5.2 1 .4 1.6.4.6 0 1.2-.1 1.8-.4zM12 14c-.8 0-1.5-.3-2.1-.8-.5-.5-.9-1.3-.9-2.1 0-1.7 1.3-3 3-3s3 1.3 3 3c0 .8-.3 1.6-.9 2.1-.6.5-1.3.8-2.1.8zm10-8.2C22 2.7 19.3 0 16.2 0c-1.4 0-2.8.5-3.9 1.5-.4.4-1.1.4-1.6 0C9.6.5 8.2 0 6.8 0 3.7 0 1 2.7 1 6c0 1 .2 1.9.7 2.8.2.3.5.4.8.4.4 0 .8-.3.9-.7.1-.4 0-.8-.2-1.1-.3-.6-.5-1.2-.5-1.8 0-2 1.6-3.6 3.6-3.6 1 0 1.9.4 2.6 1.1.7.7 1.9.7 2.7 0 .7-.7 1.6-1.1 2.6-1.1 2 0 3.6 1.6 3.6 3.6 0 .6-.1 1.2-.4 1.8-.2.3-.3.7-.2 1.1.1.4.5.7.9.7.3 0 .6-.1.8-.4C21.8 7.9 22 7 22 6c0 0 0-.1 0-.2z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Guests"
            value={`${confirmedGuests}`}
            text={`of ${guests.length} Confirmed`}
            href="/guests"
            color="bg-gradient-to-br from-teal-900 to-teal-700"
            hoverColor="hover:from-teal-800 hover:to-teal-600"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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
          />
          <DashboardCard
            title="Budget"
            value={`${totalSpent.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
            })}`}
            text={`of ${totalBudget.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
            })} spent`}
            href="/budget"
            color="bg-gradient-to-br from-teal-900 to-teal-700"
            hoverColor="hover:from-teal-800 hover:to-teal-600"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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
          />
          <DashboardCard
            title="Vendors"
            value={`${confirmedVendors}`}
            text={`of ${vendors.length} Confirmed`}
            href="/vendors"
            color="bg-gradient-to-br from-teal-900 to-teal-700"
            hoverColor="hover:from-teal-800 hover:to-teal-600"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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
          />
          <DashboardCard
            title="Tasks"
            value={`${completedTasks}`}
            text={`of ${tasks.length} Completed`}
            href="/checklist"
            color="bg-gradient-to-br from-teal-900 to-teal-700"
            hoverColor="hover:from-teal-800 hover:to-teal-600"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-b from-teal-900 to-teal-700 p-6 rounded-lg shadow-md border border-teal-700 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Upcoming Tasks</h2>
              <button
                className="text-teal-200 hover:text-white text-sm font-medium transition-colors"
                onClick={() => router.push('/checklist')}
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {tasks.filter((task) => !task.completed).length > 0 ? (
                tasks
                  .filter((task) => !task.completed)
                  .sort(
                    (a, b) =>
                      new Date(a.dueDate).getTime() -
                      new Date(b.dueDate).getTime(),
                  )
                  .slice(0, 3)
                  .map((task, index) => (
                    <div
                      key={task._id?.toString() ?? `task-${index}`}
                      className="bg-teal-800/30 p-3 rounded-md border border-teal-600"
                    >
                      <h3 className="text-white font-medium">{task.title}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-teal-200 text-sm">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${(() => {
                            if (task.priority === 'high') {
                              return 'bg-teal-700 text-teal-100 border border-teal-500';
                            } else if (task.priority === 'medium') {
                              return 'bg-yellow-100 text-yellow-800';
                            } else {
                              return 'bg-teal-600 text-white border border-teal-500';
                            }
                          })()}`}
                        >
                          {task.priority.charAt(0).toUpperCase() +
                            task.priority.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-teal-100 text-center py-6 italic">
                  No upcoming tasks
                </p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-b from-teal-900 to-teal-700 p-6 rounded-lg shadow-md border border-teal-700 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-teal-800/30 p-3 rounded-md border border-teal-600">
                <h3 className="text-white font-medium">Budget Updated</h3>
                <p className="text-teal-200 text-sm mt-1">
                  Budget items tracked: ${totalSpent.toLocaleString()}
                </p>
              </div>

              <div className="bg-teal-800/30 p-3 rounded-md border border-teal-600">
                <h3 className="text-white font-medium">Guest List</h3>
                <p className="text-teal-200 text-sm mt-1">
                  {guests.length} total guests, {confirmedGuests} confirmed
                </p>
              </div>

              <div className="bg-teal-800/30 p-3 rounded-md border border-teal-600">
                <h3 className="text-white font-medium">Vendors</h3>
                <p className="text-teal-200 text-sm mt-1">
                  {vendors.length} vendors, {confirmedVendors} confirmed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
