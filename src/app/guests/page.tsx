'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useGuests } from '@/lib/api';
import { GuestModal } from '@/components/modals';
import { IGuest } from '@/models/Guest';

// RSVP Status Badge component
const RsvpBadge = ({ status }: { status: string }) => {
  let bgColor = '';

  switch (status) {
    case 'confirmed':
      bgColor = 'bg-teal-600 text-white';
      break;
    case 'declined':
      bgColor = 'bg-teal-900 text-teal-200';
      break;
    default:
      bgColor = 'bg-teal-700 text-teal-100';
  }

  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} border border-teal-500`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const GuestsPage = () => {
  const { guests, isLoading, error, addGuest, updateGuest, deleteGuest } =
    useGuests();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGuest, setCurrentGuest] = useState<IGuest | undefined>(
    undefined,
  );
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleGuestSubmit = async (guestData: Partial<IGuest>) => {
    try {
      if (
        currentGuest &&
        typeof currentGuest._id === 'string' &&
        currentGuest._id
      ) {
        // Edit existing guest
        await updateGuest(currentGuest._id, guestData);
        console.log('Guest updated successfully');
      } else {
        // Add new guest
        await addGuest(guestData);
        console.log('Guest added successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error handling guest submission:', error);
      // You could set an error state here to show to the user
    }
  };
  const handleDeleteGuest = async (id?: string) => {
    if (!id) return;

    if (window.confirm('Are you sure you want to delete this guest?')) {
      try {
        setIsDeleting(id);
        await deleteGuest(id);
        console.log('Guest deleted successfully');
      } catch (error) {
        console.error('Error deleting guest:', error);
        // You could set an error state here to show to the user
      } finally {
        setIsDeleting(null);
      }
    }
  };

  let content: React.ReactNode;

  if (isLoading) {
    content = (
      <div className="flex justify-center py-10">
        <svg
          className="animate-spin h-8 w-8 text-teal-500"
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
      </div>
    );
  } else if (error) {
    content = (
      <div className="bg-gradient-to-b from-teal-900 to-teal-700 p-4 rounded-md border border-teal-700">
        <div className="flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-teal-200 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-teal-100">{error}</p>
        </div>
      </div>
    );
  } else if (guests.length === 0) {
    content = (
      <div className="bg-gradient-to-b from-teal-900 to-teal-700 p-10 rounded-lg shadow-md border border-teal-700 text-center">
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-teal-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-teal-100 mb-4">No guests added yet.</p>
          <button
            className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-md transition-colors"
            onClick={() => {
              setCurrentGuest(undefined);
              setIsModalOpen(true);
            }}
          >
            Add Your First Guest
          </button>
        </div>
      </div>
    );
  } else {
    content = (
      <>
        <div className="bg-gradient-to-b from-teal-900 to-teal-700 p-4 rounded-lg shadow-md border border-teal-700">
          <div className="flex items-center relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-teal-300"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              className="pl-10 pr-4 py-2 border border-teal-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-teal-800/30 text-white placeholder-teal-300"
              type="text"
              placeholder="Search guests by name, email, or group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="bg-gradient-to-b from-teal-900 to-teal-700 rounded-lg shadow-md border border-teal-600 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-teal-600">
              <thead className="bg-teal-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-100 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-100 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-100 uppercase tracking-wider">
                    RSVP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-100 uppercase tracking-wider">
                    Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-100 uppercase tracking-wider">
                    Additional Guests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-100 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gradient-to-b from-teal-800 to-teal-700 divide-y divide-teal-600">
                {guests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-teal-200"
                    >
                      No guests found. Add your first guest by clicking the
                      &quot;Add Guest&quot; button above.
                    </td>
                  </tr>
                ) : (
                  (() => {
                    const filteredGuests = guests.filter(
                      (guest) =>
                        searchTerm === '' ||
                        guest.name
                          ?.toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        guest.email
                          ?.toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        guest.group
                          ?.toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                    );

                    if (filteredGuests.length === 0) {
                      return (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-8 text-center text-teal-200"
                          >
                            No guests match your search filter. Try a different
                            search term.
                          </td>
                        </tr>
                      );
                    }

                    return filteredGuests.map((guest) => (
                      <tr
                        key={guest._id?.toString()}
                        className="hover:bg-teal-700 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-teal-100">
                            {guest.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-teal-200">
                            {guest.email || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RsvpBadge status={guest.rsvpStatus} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-200">
                          {guest.group || 'Guest'}
                        </td>{' '}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-200">
                          {guest.additionalGuests !== undefined
                            ? Number(guest.additionalGuests)
                            : 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              className="text-teal-300 hover:text-teal-100"
                              onClick={() => {
                                setCurrentGuest(guest);
                                setIsModalOpen(true);
                              }}
                            >
                              Edit
                            </button>
                            <span className="text-teal-600">|</span>
                            <button
                              className="text-red-400 hover:text-red-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                              onClick={() =>
                                handleDeleteGuest(guest._id?.toString())
                              }
                              disabled={isDeleting === guest._id?.toString()}
                            >
                              {isDeleting === guest._id?.toString()
                                ? 'Deleting...'
                                : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ));
                  })()
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Guest Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your wedding guest list and RSVPs
            </p>
          </div>
          <button
            className="bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white px-4 py-2 rounded-md transition-colors shadow-md border border-teal-300"
            onClick={() => {
              setCurrentGuest(undefined);
              setIsModalOpen(true);
            }}
          >
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Add Guest</span>
            </div>
          </button>
        </div>
        {content}

        <GuestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          guest={currentGuest}
          onSubmit={handleGuestSubmit}
        />
      </div>
    </Layout>
  );
};

export default GuestsPage;
