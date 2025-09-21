import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MyBatches from '@/components/farmer/MyBatches';

const MyBatchesPage = () => {
  return (
    <DashboardLayout title="My Batches">
      <MyBatches />
    </DashboardLayout>
  );
};

export default MyBatchesPage;
