'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useChecklist } from '@/lib/api';
import { IChecklist } from '@/models/ChecklistItem';
import { ChecklistTaskModal } from '@/components/modals';

// Define a local interface that modifies IChecklist to have _id as optional
export interface ChecklistItemWithId {
  _id?: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  assignedToEmail?: string;
  assignedBy?: string;
  assignedAt?: Date;
  emailSent?: boolean;
  emailSentAt?: Date;
  completedAt?: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChecklistPage = () => {
  const {
    tasks: rawTasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
  } = useChecklist();
  const tasks = rawTasks as ChecklistItemWithId[];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<
    ChecklistItemWithId | undefined
  >(undefined);
  const handleTaskSubmit = async (taskData: Partial<IChecklist>) => {
    try {
      if (currentTask?._id) {
        // Update existing task
        await updateTask(currentTask._id, taskData);
      } else {
        // Add new task
        await addTask(taskData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting task:', error);
      // You could set an error state here to show to the user
    }
  };
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center p-5 bg-gradient-to-b from-teal-900 to-teal-700 rounded-xl shadow-sm mb-6 border border-teal-600">
          <div>
            <h1 className="text-3xl font-bold text-white">Wedding Checklist</h1>
            <p className="text-teal-100 mt-1">
              Keep track of your wedding planning tasks
            </p>
          </div>
          <button
            className="bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white px-4 py-2 rounded-md shadow-md transition-all hover:shadow-lg transform hover:scale-105 border border-teal-300"
            onClick={() => {
              setCurrentTask(undefined);
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
              <span>Add Task</span>
            </div>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-b from-teal-900 to-teal-700 p-5 rounded-lg shadow-md border border-teal-600 hover:shadow-lg transition-shadow hover:from-teal-800 hover:to-teal-600">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <div className="bg-teal-700 p-2 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-teal-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-teal-50">To Do</span>
            </h2>
            <div className="space-y-3">
              {(() => {
                if (isLoading) {
                  return (
                    <div className="flex justify-center py-4">
                      <svg
                        className="animate-spin h-6 w-6 text-teal-200"
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
                  return (
                    <div className="bg-red-50 p-3 rounded-md">
                      <p className="text-teal-100 text-sm">{error}</p>
                    </div>
                  );
                } else if (tasks.filter((t) => !t.completed).length === 0) {
                  return (
                    <div className="p-4 bg-gray-50 rounded-md text-center border border-dashed border-gray-200">
                      <p className="text-gray-500 text-sm">No pending tasks</p>
                    </div>
                  );
                } else {
                  return (
                    <div className="space-y-3">
                      {tasks
                        .filter((task) => !task.completed)
                        .map((task, index) => {
                          let priorityBadge;
                          if (task.priority === 'high') {
                            priorityBadge = (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-teal-700 text-teal-100 border border-teal-500">
                                High
                              </span>
                            );
                          } else if (task.priority === 'medium') {
                            priorityBadge = (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                Medium
                              </span>
                            );
                          } else {
                            priorityBadge = (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-teal-600 text-white border border-teal-500">
                                Low
                              </span>
                            );
                          }
                          return (
                            <div
                              key={task._id?.toString() ?? `temp-${index}`}
                              className="p-4 bg-gradient-to-b from-teal-900 to-teal-700 rounded-lg border border-teal-600 hover:border-teal-400 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 text-white"
                            >
                              <div className="flex justify-between items-start gap-3">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-teal-50 truncate">
                                    {task.title}
                                  </h3>
                                  <div className="flex items-center justify-between mt-1 gap-2">
                                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                                      <p className="text-xs text-teal-200 flex items-center truncate">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3 w-3 mr-1 flex-shrink-0"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        <span className="truncate">
                                          Due:
                                          {new Date(
                                            task.dueDate,
                                          ).toLocaleDateString()}
                                        </span>
                                      </p>
                                      <button
                                        className="text-teal-300 hover:text-teal-100 text-xs flex-shrink-0"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCurrentTask(task);
                                          setIsModalOpen(true);
                                        }}
                                      >
                                        Edit
                                      </button>
                                    </div>
                                    <div className="flex-shrink-0">
                                      {priorityBadge}
                                    </div>
                                  </div>
                                  {/* Assignment and Email Status */}
                                  {task.assignedTo && (
                                    <div className="mt-2 space-y-1">
                                      <div className="flex items-center text-xs text-teal-200 truncate">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3 w-3 mr-1 flex-shrink-0"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        <span className="truncate">
                                          Assigned to: {task.assignedTo}
                                        </span>
                                      </div>
                                      {task.assignedToEmail && (
                                        <div className="flex items-center text-xs text-teal-200 space-x-1">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3 w-3 flex-shrink-0"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                          >
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                          </svg>
                                          <span className="truncate flex-1 min-w-0">
                                            {task.assignedToEmail}
                                          </span>
                                          <div className="flex-shrink-0">
                                            {(() => {
                                              if (task.emailSent) {
                                                return (
                                                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 border border-green-200">
                                                    ✓ Sent
                                                  </span>
                                                );
                                              } else if (task.assignedToEmail) {
                                                return (
                                                  <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                    Pending
                                                  </span>
                                                );
                                              }
                                              return null;
                                            })()}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="flex space-x-2 flex-shrink-0">
                                  <button
                                    className="bg-teal-600 hover:bg-teal-500 text-teal-100 p-1.5 rounded-full text-xs transition-all transform hover:scale-110 hover:shadow-sm border border-teal-500"
                                    aria-label="Mark as complete"
                                    onClick={() => {
                                      if (task._id) {
                                        updateTask(task._id, {
                                          ...task,
                                          completed: true,
                                        });
                                      }
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    className="bg-teal-700 hover:bg-teal-600 text-teal-100 p-1.5 rounded-full text-xs transition-all transform hover:scale-110 hover:shadow-sm border border-teal-500"
                                    aria-label="Edit task"
                                    onClick={() => {
                                      setCurrentTask(task);
                                      setIsModalOpen(true);
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                  </button>
                                  <button
                                    className="bg-red-700 hover:bg-red-600 text-red-100 p-1.5 rounded-full text-xs transition-all transform hover:scale-110 hover:shadow-sm border border-red-500"
                                    aria-label="Delete task"
                                    onClick={() => {
                                      if (
                                        task._id &&
                                        window.confirm(
                                          'Are you sure you want to delete this task?',
                                        )
                                      ) {
                                        deleteTask(task._id);
                                      }
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  );
                }
              })()}
            </div>
          </div>
          <div className="bg-gradient-to-b from-teal-900 to-teal-700 p-5 rounded-lg shadow-md border border-teal-600 hover:shadow-lg transition-shadow hover:from-teal-800 hover:to-teal-600">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <div className="bg-teal-700 p-2 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-teal-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-teal-50">Coming Up (Next 30 Days)</span>
            </h2>
            <div className="space-y-2">
              {(() => {
                let upcomingContent;
                if (isLoading) {
                  upcomingContent = (
                    <div className="flex justify-center py-4">
                      <svg
                        className="animate-spin h-6 w-6 text-teal-200"
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
                  upcomingContent = <p className="text-teal-100">{error}</p>;
                } else {
                  // Filter tasks for those due in the next 30 days and not completed
                  const today = new Date();
                  const thirtyDaysFromNow = new Date();
                  thirtyDaysFromNow.setDate(today.getDate() + 30);

                  const upcomingTasks = tasks.filter(
                    (task) =>
                      !task.completed &&
                      new Date(task.dueDate) > today &&
                      new Date(task.dueDate) <= thirtyDaysFromNow,
                  );

                  if (upcomingTasks.length === 0) {
                    upcomingContent = (
                      <div className="p-4 bg-teal-800/30 rounded-md text-center border border-dashed border-teal-600">
                        <p className="text-teal-100 text-sm">
                          No upcoming tasks in the next 30 days
                        </p>
                      </div>
                    );
                  } else {
                    upcomingContent = (
                      <div className="space-y-2">
                        {upcomingTasks.map((task, index) => (
                          <div
                            key={task._id?.toString() ?? `upcoming-${index}`}
                            className="p-4 bg-gradient-to-b from-teal-900 to-teal-700 rounded-lg border border-teal-600 hover:border-teal-400 transition-all duration-300"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-teal-50">
                                  {task.title}
                                </h3>
                                <p className="text-xs text-teal-200">
                                  Due:
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                              </div>
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
                            <div className="mt-3 flex justify-end space-x-2">
                              <button
                                className="bg-teal-700 hover:bg-teal-600 text-teal-100 p-1.5 rounded-full text-xs transition-all transform hover:scale-110 hover:shadow-sm border border-teal-500"
                                aria-label="Edit task"
                                onClick={() => {
                                  setCurrentTask(task);
                                  setIsModalOpen(true);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button
                                className="bg-red-700 hover:bg-red-600 text-red-100 p-1.5 rounded-full text-xs transition-all transform hover:scale-110 hover:shadow-sm border border-red-500"
                                aria-label="Delete task"
                                onClick={() => {
                                  if (
                                    task._id &&
                                    window.confirm(
                                      'Are you sure you want to delete this task?',
                                    )
                                  ) {
                                    deleteTask(task._id);
                                  }
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }
                }
                return upcomingContent;
              })()}
            </div>
          </div>
          <div className="bg-gradient-to-b from-teal-900 to-teal-700 p-5 rounded-lg shadow-md border border-teal-600 hover:shadow-lg transition-shadow hover:from-teal-800 hover:to-teal-600">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <div className="bg-teal-700 p-2 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-teal-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-teal-50">Completed</span>
            </h2>
            <div className="space-y-2">
              {(() => {
                let completedContent;
                if (isLoading) {
                  completedContent = (
                    <div className="flex justify-center py-4">
                      <svg
                        className="animate-spin h-6 w-6 text-teal-200"
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
                  completedContent = <p className="text-teal-100">{error}</p>;
                } else if (tasks.filter((t) => t.completed).length === 0) {
                  completedContent = (
                    <div className="p-4 bg-teal-800/30 rounded-md text-center border border-dashed border-teal-600">
                      <p className="text-teal-100 text-sm">
                        No completed tasks
                      </p>
                    </div>
                  );
                } else {
                  completedContent = (
                    <div className="space-y-2">
                      {tasks
                        .filter((task) => task.completed)
                        .map((task, index) => (
                          <div
                            key={task._id?.toString() ?? `completed-${index}`}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-80"
                          >
                            <div className="flex justify-between items-start">
                              <div className="line-through text-gray-500">
                                <h3 className="font-medium">{task.title}</h3>
                                <p className="text-xs">
                                  Completed on
                                  {new Date(
                                    task.updatedAt,
                                  ).toLocaleDateString()}
                                </p>
                                {/* Assignment Info for Completed Tasks */}
                                {task.assignedTo && (
                                  <div className="mt-1 space-y-1">
                                    <div className="flex items-center text-xs text-gray-400">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3 mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      Assigned to: {task.assignedTo}
                                    </div>
                                    {task.assignedToEmail && (
                                      <div className="flex items-center text-xs text-gray-400">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3 w-3 mr-1"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                        Email: {task.assignedToEmail}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  className="bg-gray-300 hover:bg-gray-400 text-gray-600 p-1.5 rounded-full text-xs transition-all"
                                  aria-label="Edit task"
                                  onClick={() => {
                                    setCurrentTask(task);
                                    setIsModalOpen(true);
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                </button>
                                <button
                                  className="bg-gray-300 hover:bg-gray-400 text-gray-600 p-1.5 rounded-full text-xs transition-all"
                                  aria-label="Delete task"
                                  onClick={() => {
                                    if (
                                      task._id &&
                                      window.confirm(
                                        'Are you sure you want to delete this task?',
                                      )
                                    ) {
                                      deleteTask(task._id);
                                    }
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  );
                }
                return completedContent;
              })()}
            </div>
          </div>
        </div>
        <ChecklistTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={currentTask}
          onSubmit={handleTaskSubmit}
        />
      </div>
    </Layout>
  );
};

export default ChecklistPage;
