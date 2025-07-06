import React, { useState } from 'react';
import Modal from '@/components/Modal';
import { FormInput, FormButton } from '@/components/FormElements';
import { IChecklist } from '@/models/ChecklistItem';
import { ChecklistItemWithId } from '@/app/checklist/page';

interface ChecklistTaskFormProps {
  task?: ChecklistItemWithId;
  onSubmit: (taskData: Partial<IChecklist>) => void;
  onCancel: () => void;
}

const ChecklistTaskForm: React.FC<ChecklistTaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
}) => {
  const isEditMode = Boolean(task?._id);

  interface FormDataState extends Omit<Partial<IChecklist>, 'dueDate'> {
    dueDate?: string;
    assignedToEmail?: string;
  }

  const [formData, setFormData] = useState<FormDataState>({
    title: task?.title ?? '',
    description: task?.description ?? '',
    dueDate: task?.dueDate
      ? new Date(task.dueDate).toISOString().split('T')[0]
      : '',
    completed: task?.completed ?? false,
    category: task?.category ?? 'Venue',
    priority: task?.priority ?? 'medium',
    assignedTo: task?.assignedTo ?? '',
    assignedToEmail:
      (task as ChecklistItemWithId & { assignedToEmail?: string })
        ?.assignedToEmail ?? '',
    notes: task?.notes ?? '',
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
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
    };

    onSubmit(submissionData);
  };

  const categoryOptions = [
    'Venue',
    'Catering',
    'Beauty',
    'Attire',
    'Ceremony',
    'Reception',
    'Gifts',
    'Honeymoon',
    'Legal',
    'Other',
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        id="title"
        label="Task Title"
        value={formData.title ?? ''}
        onChange={handleChange}
        required
      />

      <FormInput
        id="description"
        label="Description"
        multiline
        value={formData.description ?? ''}
        onChange={handleChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          id="priority"
          label="Priority"
          type="select"
          value={formData.priority ?? 'medium'}
          onChange={handleChange}
          options={priorityOptions}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id="dueDate"
          label="Due Date"
          type="date"
          value={formData.dueDate ?? ''}
          onChange={handleChange}
        />

        <FormInput
          id="assignedTo"
          label="Assigned To"
          value={formData.assignedTo ?? ''}
          onChange={handleChange}
        />
      </div>

      <FormInput
        id="assignedToEmail"
        label="Assignee Email (for notifications)"
        type="email"
        value={formData.assignedToEmail ?? ''}
        onChange={handleChange}
        placeholder="Enter email to send task assignment notifications"
      />

      <div className="flex items-center mb-4">
        <input
          id="completed"
          name="completed"
          type="checkbox"
          checked={!!formData.completed}
          onChange={handleChange}
          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-teal-300 rounded"
        />
        <label htmlFor="completed" className="ml-2 block text-sm text-teal-100">
          Mark as Completed
        </label>
      </div>

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
          {isEditMode ? 'Update Task' : 'Add Task'}
        </FormButton>
      </div>
    </form>
  );
};

interface ChecklistTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: ChecklistItemWithId;
  onSubmit: (taskData: Partial<IChecklist>) => void;
}

const ChecklistTaskModal: React.FC<ChecklistTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onSubmit,
}) => {
  const title = task?._id ? 'Edit Task' : 'Add New Task';

  const handleSubmit = (taskData: Partial<IChecklist>) => {
    onSubmit(taskData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <ChecklistTaskForm
        task={task}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default ChecklistTaskModal;
