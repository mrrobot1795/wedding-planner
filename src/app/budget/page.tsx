'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useBudget } from '@/lib/api';
import { IBudgetItem } from '@/models/BudgetItem';
import { BudgetItemModal } from '@/components/modals';

const BudgetPage = () => {
  // Define a type for budget items with MongoDB _id
  type BudgetItemWithId = IBudgetItem & {
    _id: string;
  };
  const {
    budgetItems: rawBudgetItems,
    isLoading,
    error,
    totalBudget,
    totalSpent,
    totalEstimated,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
  } = useBudget();
  const budgetItems = rawBudgetItems as BudgetItemWithId[];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBudgetItem, setCurrentBudgetItem] = useState<
    BudgetItemWithId | undefined
  >(undefined);
  const handleBudgetItemSubmit = async (
    budgetItemData: Partial<IBudgetItem>,
  ) => {
    try {
      if (currentBudgetItem?._id) {
        // Update existing budget item
        await updateBudgetItem(currentBudgetItem._id, budgetItemData);
      } else {
        // Add new budget item
        await addBudgetItem(budgetItemData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting budget item:', error);
      // You could set an error state here to show to the user
    }
  };

  let content;
  if (isLoading) {
    content = <p>Loading budget items...</p>;
  } else if (error) {
    content = (
      <p className="bg-gradient-to-b from-teal-900 to-teal-700 text-white p-4 rounded-md border border-teal-600 shadow-md">
        {error}
      </p>
    );
  } else if (budgetItems.length === 0) {
    content = (
      <div className="bg-gradient-to-b from-teal-900 to-teal-700 p-6 rounded-lg shadow text-center border border-teal-600">
        <p className="text-teal-50">
          No budget items added yet. Click &quot;Add Budget Item&quot; to add
          your first item.
        </p>
      </div>
    );
  } else {
    content = (
      <div className="bg-gradient-to-b from-teal-900 to-teal-700 rounded-lg shadow overflow-hidden border border-teal-600">
        <table className="min-w-full divide-y divide-teal-600">
          <thead className="bg-teal-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-teal-100 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-teal-100 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-teal-100 uppercase tracking-wider">
                Estimated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-teal-100 uppercase tracking-wider">
                Actual
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-teal-100 uppercase tracking-wider">
                Paid
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-teal-100 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gradient-to-b from-teal-800 to-teal-700 divide-y divide-teal-600 text-white">
            {budgetItems.map((item, index) => (
              <tr
                key={item._id ?? `temp-${index}`}
                className="hover:bg-teal-700"
              >
                <td className="px-6 py-4 whitespace-nowrap text-teal-50">
                  {item.category}
                </td>
                <td className="px-6 py-4 text-teal-50">{item.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-teal-50">
                  {item.estimatedCost.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-teal-50">
                  {item.actualCost
                    ? item.actualCost.toLocaleString('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                      })
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.paid ? 'bg-teal-600 text-white' : 'bg-teal-900 text-teal-200'} border border-teal-500`}
                  >
                    {item.paid ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-4 justify-end">
                    <button
                      className="text-teal-300 hover:text-teal-100"
                      onClick={() => {
                        setCurrentBudgetItem(item);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => {
                        if (
                          window.confirm(
                            'Are you sure you want to delete this budget item?',
                          )
                        ) {
                          deleteBudgetItem(item._id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <Layout>
      <div className="space-y-6">
        <BudgetItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          budgetItem={currentBudgetItem}
          onSubmit={handleBudgetItemSubmit}
        />
        <div className="flex justify-between items-center p-4 bg-gradient-to-b from-teal-900 to-teal-700 rounded-lg shadow-sm mb-6 border border-teal-600">
          <h1 className="text-3xl font-bold text-white">Budget Tracking</h1>
          <button
            className="bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white px-4 py-2 rounded-md shadow-md transition-all border border-teal-300"
            onClick={() => {
              setCurrentBudgetItem(undefined);
              setIsModalOpen(true);
            }}
          >
            Add Budget Item
          </button>
        </div>
        {/* Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-b from-teal-900 to-teal-700 p-6 rounded-lg shadow border border-teal-600">
            <h3 className="text-teal-200 text-sm">Total Budget</h3>
            <p className="text-2xl font-bold text-white">
              {totalBudget.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
              })}
            </p>
          </div>
          <div className="bg-gradient-to-b from-teal-900 to-teal-700 p-6 rounded-lg shadow border border-teal-600">
            <h3 className="text-teal-200 text-sm">Total Estimated</h3>
            <p className="text-2xl font-bold text-white">
              {totalEstimated.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
              })}
            </p>
          </div>
          <div className="bg-gradient-to-b from-teal-900 to-teal-700 p-6 rounded-lg shadow border border-teal-600">
            <h3 className="text-teal-200 text-sm">Total Spent</h3>
            <p className="text-2xl font-bold text-white">
              {totalSpent.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
              })}
            </p>
            <div className="w-full bg-teal-800 rounded-full mt-2 h-2.5">
              <div
                className="bg-teal-400 h-2.5 rounded-full"
                style={{
                  width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
        {content}
      </div>
    </Layout>
  );
};

export default BudgetPage;
