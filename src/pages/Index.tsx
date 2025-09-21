import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FarmerDashboard from '@/components/farmer/FarmerDashboard';
import DistributorDashboard from '@/components/distributor/DistributorDashboard';
import ConsumerDashboard from '@/components/consumer/ConsumerDashboard';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin h-12 w-12 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Loading Ayur-Veritas...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const getDashboardTitle = () => {
    switch (user.role) {
      case 'farmer': return 'Farmer Dashboard';
      case 'distributor': return 'Distributor Dashboard';
      case 'consumer': return 'Consumer Dashboard';
      default: return 'Dashboard';
    }
  };

  const renderDashboard = () => {
    switch (user.role) {
      case 'farmer': return <FarmerDashboard />;
      case 'distributor': return <DistributorDashboard />;
      case 'consumer': return <ConsumerDashboard />;
      default: return <div>Role not recognized</div>;
    }
  };

  return (
    <DashboardLayout title={getDashboardTitle()}>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default Index;
