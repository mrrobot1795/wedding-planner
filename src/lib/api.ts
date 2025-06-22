'use client';

import { useState, useEffect, useCallback } from 'react';
import { IGuest } from '@/models/Guest';
import { IBudgetItem } from '@/models/BudgetItem';
import { IVendor } from '@/models/Vendor';
import { IChecklist } from '@/models/ChecklistItem';

// Guest API Service
export const useGuests = () => {
  const [guests, setGuests] = useState<IGuest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchGuests = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/guests');
      if (!res.ok) throw new Error('Failed to fetch guests');
      const data = await res.json(); // Ensure all numeric fields are properly handled
      const processedGuests = (data.data ?? []).map((guest: IGuest) => ({
        ...guest,
        additionalGuests:
          guest.additionalGuests !== undefined
            ? Number(guest.additionalGuests)
            : 0,
      }));

      setGuests(processedGuests);
      console.log('Fetched guests:', processedGuests);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    // Fetch the guests when the component mounts
    fetchGuests();
  }, [fetchGuests]);

  const addGuest = async (guestData: Partial<IGuest>) => {
    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guestData),
      });
      if (!res.ok) throw new Error('Failed to add guest');
      const data = await res.json();

      // Ensure additionalGuests is properly handled
      const newGuest = {
        ...data.data,
        additionalGuests:
          data.data.additionalGuests !== undefined
            ? Number(data.data.additionalGuests)
            : 0,
      };

      setGuests([...guests, newGuest]);
      return newGuest;
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
      throw err;
    }
  };

  const updateGuest = async (id: string, guestData: Partial<IGuest>) => {
    try {
      const res = await fetch(`/api/guests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guestData),
      });
      if (!res.ok) throw new Error('Failed to update guest');
      const data = await res.json();

      // Ensure additionalGuests is properly handled
      const updatedGuest = {
        ...data.data,
        additionalGuests:
          data.data.additionalGuests !== undefined
            ? Number(data.data.additionalGuests)
            : 0,
      };

      setGuests(guests.map((g) => (g._id === id ? updatedGuest : g)));
      return data.data;
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
      throw err;
    }
  };

  const deleteGuest = async (id: string) => {
    try {
      const res = await fetch(`/api/guests/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete guest');
      setGuests(guests.filter((g) => g._id !== id));
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
      throw err;
    }
  };
  return {
    guests,
    isLoading,
    error,
    fetchGuests,
    addGuest,
    updateGuest,
    deleteGuest,
  };
};

// Budget API Service
export const useBudget = () => {
  const [budgetItems, setBudgetItems] = useState<IBudgetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalBudget] = useState(4000000); // Set default budget
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalEstimated, setTotalEstimated] = useState(0);
  const calculateTotals = useCallback((items: IBudgetItem[]) => {
    const spent = items.reduce(
      (sum: number, item) => sum + (item.actualCost ?? 0),
      0,
    );
    const estimated = items.reduce(
      (sum: number, item) => sum + (item.estimatedCost ?? 0),
      0,
    );
    setTotalSpent(spent);
    setTotalEstimated(estimated);
  }, []);
  const fetchBudgetItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/budget');
      if (!res.ok) throw new Error('Failed to fetch budget items');
      const data = await res.json();
      setBudgetItems(data.data ?? []);
      calculateTotals(data.data ?? []);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  }, [calculateTotals]);
  useEffect(() => {
    // Fetch budget items when the component mounts
    fetchBudgetItems();
  }, [fetchBudgetItems]);
  // Add a budget item
  const addBudgetItem = async (budgetItemData: Partial<IBudgetItem>) => {
    try {
      const res = await fetch('/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetItemData),
      });
      if (!res.ok) throw new Error('Failed to add budget item');
      const data = await res.json();

      // Update the local state with the new budget item
      const newBudgetItems = [...budgetItems, data.data];
      setBudgetItems(newBudgetItems);
      calculateTotals(newBudgetItems);

      return data.data;
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
      throw err;
    }
  };

  // Update a budget item
  const updateBudgetItem = async (
    id: string,
    budgetItemData: Partial<IBudgetItem>,
  ) => {
    try {
      const res = await fetch(`/api/budget/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetItemData),
      });
      if (!res.ok) throw new Error('Failed to update budget item');
      const data = await res.json();

      // Update the local state with the updated budget item
      const newBudgetItems = budgetItems.map((item) =>
        item._id === id ? data.data : item,
      );
      setBudgetItems(newBudgetItems);
      calculateTotals(newBudgetItems);

      return data.data;
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
      throw err;
    }
  };

  // Delete a budget item
  const deleteBudgetItem = async (id: string) => {
    try {
      const res = await fetch(`/api/budget/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete budget item');

      // Update the local state by removing the deleted budget item
      const newBudgetItems = budgetItems.filter((item) => item._id !== id);
      setBudgetItems(newBudgetItems);
      calculateTotals(newBudgetItems);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
      throw err;
    }
  };

  return {
    budgetItems,
    isLoading,
    error,
    totalBudget,
    totalSpent,
    totalEstimated,
    fetchBudgetItems,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
  };
};

// Vendor API Service
export const useVendors = () => {
  const [vendors, setVendors] = useState<IVendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchVendors = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/vendors');
      if (!res.ok) throw new Error('Failed to fetch vendors');
      const data = await res.json();
      setVendors(data.data ?? []);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    // Fetch vendors when the component mounts
    fetchVendors();
  }, [fetchVendors]);
  // Add a vendor
  const addVendor = async (vendorData: Partial<IVendor>) => {
    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorData),
      });
      if (!res.ok) throw new Error('Failed to add vendor');
      const data = await res.json();

      // Update the local state with the new vendor
      setVendors([...vendors, data.data]);

      return data.data;
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
      throw err;
    }
  };

  // Update a vendor
  const updateVendor = async (id: string, vendorData: Partial<IVendor>) => {
    try {
      const res = await fetch(`/api/vendors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorData),
      });
      if (!res.ok) throw new Error('Failed to update vendor');
      const data = await res.json();

      // Update the local state with the updated vendor
      setVendors(vendors.map((v) => (v._id === id ? data.data : v)));

      return data.data;
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
      throw err;
    }
  };

  // Delete a vendor
  const deleteVendor = async (id: string) => {
    try {
      const res = await fetch(`/api/vendors/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete vendor');

      // Update the local state by removing the deleted vendor
      setVendors(vendors.filter((v) => v._id !== id));
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
      throw err;
    }
  };

  return {
    vendors,
    isLoading,
    error,
    fetchVendors,
    addVendor,
    updateVendor,
    deleteVendor,
  };
};

// Checklist API Service
export const useChecklist = () => {
  const [tasks, setTasks] = useState<IChecklist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/checklist');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data.data ?? []);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    // Fetch tasks when the component mounts
    fetchTasks();
  }, [fetchTasks]);
  // Add a task
  const addTask = async (taskData: Partial<IChecklist>) => {
    try {
      const res = await fetch('/api/checklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      if (!res.ok) throw new Error('Failed to add task');
      const data = await res.json();

      // Update the local state with the new task
      setTasks([...tasks, data.data]);

      return data.data;
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
      throw err;
    }
  };

  // Update a task
  const updateTask = async (id: string, taskData: Partial<IChecklist>) => {
    try {
      const res = await fetch(`/api/checklist/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      if (!res.ok) throw new Error('Failed to update task');
      const data = await res.json();

      // Update the local state with the updated task
      setTasks(tasks.map((t) => (t._id === id ? data.data : t)));

      return data.data;
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
      throw err;
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/checklist/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete task');

      // Update the local state by removing the deleted task
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
      throw err;
    }
  };

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
  };
};
