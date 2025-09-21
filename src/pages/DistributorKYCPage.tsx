import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DistributorKYC from '@/components/distributor/DistributorKYC';

const DistributorKYCPage: React.FC = () => {
  return (
    <DashboardLayout title="KYC Verification">
      <div className="max-w-2xl mx-auto">
        <DistributorKYC />
      </div>
    </DashboardLayout>
  );
};

export default DistributorKYCPage;
