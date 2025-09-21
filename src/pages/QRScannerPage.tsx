import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import QRScanner from '@/components/consumer/QRScanner';

const QRScannerPage = () => {
  return (
    <DashboardLayout title="QR Scanner">
      <QRScanner />
    </DashboardLayout>
  );
};

export default QRScannerPage;