import React, { useState } from 'react';
import Modal from '@/components/Modal';
import { FormInput, FormButton } from '@/components/FormElements';
import { IBudgetItem } from '@/models/BudgetItem';

interface BudgetItemFormProps {
  budgetItem?: IBudgetItem;
  onSubmit: (budgetData: Partial<IBudgetItem>) => void;
  onCancel: () => void;
}

const BudgetItemForm: React.FC<BudgetItemFormProps> = ({
  budgetItem,
  onSubmit,
  onCancel,
}) => {
  const isEditMode = Boolean(budgetItem?._id);
  interface FormDataState extends Omit<Partial<IBudgetItem>, 'paymentDate'> {
    paymentDate?: string;
  }

  const [formData, setFormData] = useState<FormDataState>({
    category: budgetItem?.category ?? 'Venue',
    description: budgetItem?.description ?? '',
    estimatedCost: budgetItem?.estimatedCost ?? 0,
    actualCost: budgetItem?.actualCost ?? 0,
    paid: budgetItem?.paid ?? false,
    paymentDate: budgetItem?.paymentDate
      ? new Date(budgetItem.paymentDate).toISOString().split('T')[0]
      : '',
    notes: budgetItem?.notes ?? '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert the date string back to a Date object if it exists
    const submissionData = {
      ...formData,
      paymentDate: formData.paymentDate
        ? new Date(formData.paymentDate)
        : undefined,
    };

    onSubmit(submissionData);
  };

  const categoryOptions = [
    'Venue',
    'Catering',
    'Photography',
    'Videography',
    'Attire',
    'Flowers',
    'Music',
    'Decor',
    'Transportation',
    'Stationery',
    'Gifts',
    'Other',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        id="category"
        label="Category"
        type="select"
        value={formData.category ?? 'Venue'}
        onChange={handleChange}
        options={categoryOptions.map((cat) => ({ value: cat, label: cat }))}
        required
      />

      <FormInput
        id="description"
        label="Description"
        value={formData.description ?? ''}
        onChange={handleChange}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id="estimatedCost"
          label="Estimated Cost ($)"
          type="number"
          value={formData.estimatedCost?.toString() ?? '0'}
          onChange={handleChange}
          required
        />

        <FormInput
          id="actualCost"
          label="Actual Cost ($)"
          type="number"
          value={formData.actualCost?.toString() ?? '0'}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center mb-4">
        <input
          id="paid"
          name="paid"
          type="checkbox"
          checked={!!formData.paid}
          onChange={handleChange}
          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-teal-300 rounded"
        />
        <label htmlFor="paid" className="ml-2 block text-sm text-teal-100">
          Payment Completed
        </label>
      </div>

      <FormInput
        id="paymentDate"
        label="Payment Date"
        type="date"
        value={formData.paymentDate ?? ''}
        onChange={handleChange}
      />

      <FormInput
        id="notes"
        label="Notes"
        multiline
        value={formData.notes ?? ''}
        onChange={handleChange}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <FormButton onClick={onCancel} variant="secondary">
          Cancel
        </FormButton>
        <FormButton type="submit" variant="primary">
          {isEditMode ? 'Update Budget Item' : 'Add Budget Item'}
        </FormButton>
      </div>
    </form>
  );
};

interface BudgetItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetItem?: IBudgetItem;
  onSubmit: (budgetData: Partial<IBudgetItem>) => void;
}

const BudgetItemModal: React.FC<BudgetItemModalProps> = ({
  isOpen,
  onClose,
  budgetItem,
  onSubmit,
}) => {
  const title = budgetItem?._id ? 'Edit Budget Item' : 'Add New Budget Item';

  const handleSubmit = (budgetData: Partial<IBudgetItem>) => {
    onSubmit(budgetData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <BudgetItemForm
        budgetItem={budgetItem}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default BudgetItemModal;
