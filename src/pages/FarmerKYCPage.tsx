import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FarmerKYC from '@/components/farmer/FarmerKYC';

const FarmerKYCPage: React.FC = () => {
  return (
    <DashboardLayout title="KYC Verification">
      <div className="max-w-2xl mx-auto">
        <FarmerKYC />
      </div>
    </DashboardLayout>
  );
};

export default FarmerKYCPage;
