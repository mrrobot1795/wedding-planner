import React, { useState } from 'react';
import Modal from '@/components/Modal';
import { FormInput, FormButton } from '@/components/FormElements';
import { IVendor } from '@/models/Vendor';

interface VendorFormProps {
  vendor?: IVendor;
  onSubmit: (vendorData: Partial<IVendor>) => void;
  onCancel: () => void;
}

const VendorForm: React.FC<VendorFormProps> = ({
  vendor,
  onSubmit,
  onCancel,
}) => {
  const isEditMode = Boolean(vendor?._id);
  const [formData, setFormData] = useState<Partial<IVendor>>({
    name: vendor?.name ?? '',
    category: vendor?.category ?? 'Venue',
    contactName: vendor?.contactName ?? '',
    email: vendor?.email ?? '',
    phone: vendor?.phone ?? '',
    website: vendor?.website ?? '',
    address: vendor?.address ?? '',
    notes: vendor?.notes ?? '',
    contractSigned: vendor?.contractSigned ?? false,
    depositPaid: vendor?.depositPaid ?? false,
    finalPaymentPaid: vendor?.finalPaymentPaid ?? false,
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
    onSubmit(formData);
  };

  const categoryOptions = [
    'Venue',
    'Catering',
    'Photography',
    'Videography',
    'Florist',
    'Music',
    'Decor',
    'Transportation',
    'Stationery',
    'Bakery',
    'Attire',
    'Beauty',
    'Other',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        id="name"
        label="Vendor Name"
        value={formData.name ?? ''}
        onChange={handleChange}
        required
      />

      <FormInput
        id="category"
        label="Category"
        type="select"
        value={formData.category ?? 'Venue'}
        onChange={handleChange}
        options={categoryOptions.map((cat) => ({ value: cat, label: cat }))}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id="contactName"
          label="Contact Person"
          value={formData.contactName ?? ''}
          onChange={handleChange}
        />

        <FormInput
          id="phone"
          label="Phone Number"
          value={formData.phone ?? ''}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id="email"
          label="Email"
          type="email"
          value={formData.email ?? ''}
          onChange={handleChange}
        />

        <FormInput
          id="website"
          label="Website"
          value={formData.website ?? ''}
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

      <div className="grid grid-cols-1 gap-2">
        <div className="flex items-center">
          <input
            id="contractSigned"
            name="contractSigned"
            type="checkbox"
            checked={!!formData.contractSigned}
            onChange={handleChange}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-teal-300 rounded"
          />
          <label
            htmlFor="contractSigned"
            className="ml-2 block text-sm text-teal-100"
          >
            Contract Signed
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="depositPaid"
            name="depositPaid"
            type="checkbox"
            checked={!!formData.depositPaid}
            onChange={handleChange}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-teal-300 rounded"
          />
          <label
            htmlFor="depositPaid"
            className="ml-2 block text-sm text-teal-100"
          >
            Deposit Paid
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="finalPaymentPaid"
            name="finalPaymentPaid"
            type="checkbox"
            checked={!!formData.finalPaymentPaid}
            onChange={handleChange}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-teal-300 rounded"
          />
          <label
            htmlFor="finalPaymentPaid"
            className="ml-2 block text-sm text-teal-100"
          >
            Final Payment Paid
          </label>
        </div>
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
          {isEditMode ? 'Update Vendor' : 'Add Vendor'}
        </FormButton>
      </div>
    </form>
  );
};

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor?: IVendor;
  onSubmit: (vendorData: Partial<IVendor>) => void;
}

const VendorModal: React.FC<VendorModalProps> = ({
  isOpen,
  onClose,
  vendor,
  onSubmit,
}) => {
  const title = vendor?._id ? 'Edit Vendor' : 'Add New Vendor';

  const handleSubmit = (vendorData: Partial<IVendor>) => {
    onSubmit(vendorData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <VendorForm vendor={vendor} onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  );
};

export default VendorModal;
