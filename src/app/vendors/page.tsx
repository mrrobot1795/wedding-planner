'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { IVendor } from '@/models/Vendor';
import { VendorModal } from '@/components/modals';
import { useVendors } from '@/lib/api';

const VendorsPage = () => {
  const { vendors, isLoading, error, addVendor, updateVendor, deleteVendor } =
    useVendors();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState<IVendor | undefined>(
    undefined,
  );
  // Define a type for vendors with MongoDB _id
  type VendorWithId = IVendor & {
    _id: string;
  };

  const handleVendorSubmit = async (vendorData: Partial<IVendor>) => {
    try {
      if (currentVendor && '_id' in currentVendor) {
        // Update existing vendor
        await updateVendor((currentVendor as VendorWithId)._id, vendorData);
      } else {
        // Add new vendor
        await addVendor(vendorData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting vendor:', error);
      // You could set an error state here to show to the user
    }
  };

  // Extracted conditional rendering logic to avoid nested ternaries
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
      <div className="bg-gradient-to-b from-teal-900 to-teal-700 text-white p-4 rounded-md border border-teal-600 shadow-md">
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
          <p className="text-teal-50">{error}</p>
        </div>
      </div>
    );
  } else if (vendors.length === 0) {
    content = (
      <div className="bg-gradient-to-b from-teal-900 to-teal-700 p-10 rounded-lg shadow-md text-center border border-teal-600">
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-teal-200 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="text-teal-50 mb-4">No vendors added yet.</p>{' '}
          <button
            className="bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white px-5 py-2 rounded-md shadow-md transition-all transform hover:scale-105 border border-teal-300"
            onClick={() => {
              setCurrentVendor(undefined);
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
              <span>Add Your First Vendor</span>
            </div>
          </button>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor, index) => (
          <div
            key={vendor._id?.toString() ?? `vendor-${index}`}
            className="bg-gradient-to-b from-teal-900 to-teal-700 p-6 rounded-lg shadow-md border border-teal-600 hover:shadow-xl transition-all duration-300 hover:border-teal-300 transform hover:-translate-y-1 hover:from-teal-800 hover:to-teal-600"
          >
            {' '}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {vendor.name}
                </h3>
                <p className="text-sm text-teal-200 font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {vendor.category}
                </p>
              </div>
              <span
                className={`px-3 py-1 ${vendor.contractSigned ? 'bg-gradient-to-r from-teal-500 to-teal-400' : 'bg-teal-800'} text-white text-xs font-semibold rounded-full flex items-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {vendor.contractSigned ? 'Confirmed' : 'Pending'}
              </span>
            </div>
            <div className="flex flex-col space-y-2 mb-4">
              <div className="flex items-center">
                {' '}
                <span className="w-24 text-sm text-teal-200 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-teal-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Contact:
                </span>
                <span className="text-white">
                  {vendor.contactName || 'N/A'}
                </span>
              </div>
              <div className="flex items-center">
                {' '}
                <span className="w-24 text-sm text-teal-200 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-teal-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email:
                </span>
                <span className="text-white hover:text-teal-300 transition-colors">
                  {vendor.email || 'N/A'}
                </span>
              </div>
              <div className="flex items-center">
                {' '}
                <span className="w-24 text-sm text-teal-200 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-teal-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Phone:
                </span>
                <span className="text-white">{vendor.phone || 'N/A'}</span>
              </div>
            </div>{' '}
            <div className="pt-4 border-t border-teal-600 flex space-x-2">
              <button
                className="bg-teal-700 hover:bg-teal-600 text-white px-3 py-2 rounded-md text-sm transition-colors flex-1 flex items-center justify-center border border-teal-500"
                onClick={() => {
                  setCurrentVendor(vendor);
                  setIsModalOpen(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </button>
              <button
                className="bg-teal-800 hover:bg-teal-700 text-teal-100 px-3 py-2 rounded-md text-sm transition-colors flex-1 flex items-center justify-center border border-teal-500"
                onClick={() => {
                  const vendorId = vendor._id?.toString();
                  if (
                    vendorId &&
                    confirm('Are you sure you want to delete this vendor?')
                  ) {
                    deleteVendor(vendorId);
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete
              </button>
            </div>{' '}
          </div>
        ))}
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <VendorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          vendor={currentVendor}
          onSubmit={handleVendorSubmit}
        />
        <div className="flex justify-between items-center p-5 bg-gradient-to-b from-teal-900 to-teal-700 rounded-xl shadow-sm mb-6 border border-teal-600">
          <h1 className="text-3xl font-bold text-white">Vendor Management</h1>{' '}
          <button
            className="bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white px-4 py-2 rounded-md shadow-md transition-all transform hover:scale-105 border border-teal-300"
            onClick={() => {
              setCurrentVendor(undefined);
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
              <span>Add Vendor</span>
            </div>
          </button>
        </div>
        {content}
      </div>
    </Layout>
  );
};

export default VendorsPage;
