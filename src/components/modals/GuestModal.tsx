import React, { useState } from 'react';
import Modal from '@/components/Modal';
import { FormInput, FormButton } from '@/components/FormElements';
import { IGuest } from '@/models/Guest';

interface GuestFormProps {
  guest?: IGuest;
  onSubmit: (guestData: Partial<IGuest>) => void;
  onCancel: () => void;
}

const GuestForm: React.FC<GuestFormProps> = ({ guest, onSubmit, onCancel }) => {
  const isEditMode = Boolean(guest?._id); // Ensure additionalGuests is properly initialized as a number
  const [formData, setFormData] = useState<Partial<IGuest>>({
    name: guest?.name ?? '',
    email: guest?.email ?? '',
    phone: guest?.phone ?? '',
    address: guest?.address ?? '',
    additionalGuests:
      guest?.additionalGuests !== undefined
        ? Number(guest.additionalGuests)
        : 0,
    rsvpStatus: guest?.rsvpStatus ?? 'pending',
    dietaryRestrictions: guest?.dietaryRestrictions ?? '',
    group: guest?.group ?? 'Guest',
    notes: guest?.notes ?? '',
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
    } else if (name === 'additionalGuests') {
      // Make sure additionalGuests is parsed as a number
      const numValue = parseInt(value, 10);
      console.log(
        `Setting additionalGuests to: ${numValue}, original value: ${value}, type: ${typeof value}`,
      );
      setFormData({
        ...formData,
        [name]: isNaN(numValue) ? 0 : numValue, // Ensure it's a valid number
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

    // Ensure additionalGuests is explicitly a number
    const additionalGuestsValue =
      typeof formData.additionalGuests === 'string'
        ? parseInt(formData.additionalGuests, 10)
        : Number(formData.additionalGuests);

    const submissionData = {
      ...formData,
      additionalGuests: isNaN(additionalGuestsValue)
        ? 0
        : additionalGuestsValue,
    };

    console.log('Submitting guest with data:', submissionData);
    console.log(
      'additionalGuests type:',
      typeof submissionData.additionalGuests,
    );
    console.log('additionalGuests value:', submissionData.additionalGuests);
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        id="name"
        label="Guest Name"
        value={formData.name ?? ''}
        onChange={handleChange}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id="email"
          label="Email"
          type="email"
          value={formData.email ?? ''}
          onChange={handleChange}
        />

        <FormInput
          id="phone"
          label="Phone Number"
          value={formData.phone ?? ''}
          onChange={handleChange}
        />
      </div>

      <FormInput
        id="address"
        label="Address"
        multiline
        value={formData.address ?? ''}
        onChange={handleChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id="rsvpStatus"
          label="RSVP Status"
          type="select"
          value={formData.rsvpStatus ?? 'pending'}
          onChange={handleChange}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'declined', label: 'Declined' },
          ]}
        />

        <FormInput
          id="group"
          label="Group"
          value={formData.group ?? ''}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <FormInput
          id="additionalGuests"
          label="Additional Guests"
          type="select"
          value={
            formData.additionalGuests !== undefined
              ? String(formData.additionalGuests)
              : '0'
          }
          onChange={handleChange}
          options={[
            { value: '0', label: 'No additional guests' },
            { value: '1', label: '1 additional guest' },
            { value: '2', label: '2 additional guests' },
            { value: '3', label: '3 additional guests' },
            { value: '4', label: '4 additional guests' },
            { value: '5', label: '5 additional guests' },
            { value: '6', label: '6 additional guests' },
            { value: '7', label: '7 additional guests' },
            { value: '8', label: '8 additional guests' },
            { value: '9', label: '9 additional guests' },
            { value: '10', label: '10 additional guests' },
          ]}
        />
      </div>

      <FormInput
        id="dietaryRestrictions"
        label="Dietary Restrictions"
        multiline
        value={formData.dietaryRestrictions ?? ''}
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
          {isEditMode ? 'Update Guest' : 'Add Guest'}
        </FormButton>
      </div>
    </form>
  );
};

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest?: IGuest;
  onSubmit: (guestData: Partial<IGuest>) => void;
}

const GuestModal: React.FC<GuestModalProps> = ({
  isOpen,
  onClose,
  guest,
  onSubmit,
}) => {
  const title = guest?._id ? 'Edit Guest' : 'Add New Guest';

  const handleSubmit = (guestData: Partial<IGuest>) => {
    onSubmit(guestData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <GuestForm guest={guest} onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  );
};

export default GuestModal;
