import React from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductTrace from '@/components/consumer/ProductTrace';

const ProductTracePage = () => {
  const [searchParams] = useSearchParams();
  const batchId = searchParams.get('batch');

  return (
    <DashboardLayout title="Product Trace">
      <ProductTrace batchId={batchId || undefined} />
    </DashboardLayout>
  );
};

export default ProductTracePage;