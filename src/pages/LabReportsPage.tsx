import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LabReportUpload from '@/components/distributor/LabReportUpload';

const LabReportsPage = () => {
  return (
    <DashboardLayout title="Lab Reports">
      <LabReportUpload />
    </DashboardLayout>
  );
};

export default LabReportsPage;