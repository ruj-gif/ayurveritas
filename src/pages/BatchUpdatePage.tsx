import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BatchUpdateForm from '@/components/distributor/BatchUpdateForm';

const BatchUpdatePage = () => {
  return (
    <DashboardLayout title="Update Batch">
      <BatchUpdateForm />
    </DashboardLayout>
  );
};

export default BatchUpdatePage;