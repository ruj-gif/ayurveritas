import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RegisterHarvest from '@/components/farmer/RegisterHarvest';

const RegisterHarvestPage = () => {
  return (
    <DashboardLayout title="Register Harvest">
      <RegisterHarvest />
    </DashboardLayout>
  );
};

export default RegisterHarvestPage;