import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ScanAndUpdate from '@/components/distributor/ScanAndUpdate';

const ScanUpdatePage = () => {
  return (
    <DashboardLayout title="Scan & Update">
      <ScanAndUpdate />
    </DashboardLayout>
  );
};

export default ScanUpdatePage;