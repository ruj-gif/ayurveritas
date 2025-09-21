export interface Batch {
  id: string;
  farmerId: string;
  farmerName: string;
  herbType: string;
  quantity: number;
  unit: string;
  harvestDate: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'pending' | 'verified' | 'rejected';
  qrCode: string;
  photo?: string;
  verifiedBy?: string;
  verificationDate?: string;
  labReport?: string;
  blockchainHash?: string;
  price?: number;
  paymentStatus?: 'pending' | 'paid';
  rejectionReason?: string;
}

export interface Transaction {
  id: string;
  batchId: string;
  from: string;
  to: string;
  action: string;
  timestamp: string;
  blockchainHash: string;
}

export interface Payment {
  id: string;
  batchId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  date: string;
}

export const mockBatches: Batch[] = [
  {
    id: 'AYUR-2024-001',
    farmerId: '1',
    farmerName: 'Raj Kumar',
    herbType: 'Tulsi (Holy Basil)',
    quantity: 25,
    unit: 'kg',
    harvestDate: '2024-01-15T08:30:00Z',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Organic Farm, Gurgaon, Haryana'
    },
    status: 'verified',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    photo: '/api/placeholder/300/200',
    verifiedBy: 'Priya Sharma',
    verificationDate: '2024-01-16T10:15:00Z',
    labReport: 'Quality Grade: A+, Purity: 98.5%',
    blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890',
    price: 800,
    paymentStatus: 'paid'
  },
  {
    id: 'AYUR-2024-002',
    farmerId: '1',
    farmerName: 'Raj Kumar',
    herbType: 'Ashwagandha',
    quantity: 15,
    unit: 'kg',
    harvestDate: '2024-01-20T09:00:00Z',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Organic Farm, Gurgaon, Haryana'
    },
    status: 'pending',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    photo: '/api/placeholder/300/200',
    price: 1200,
    paymentStatus: 'pending'
  },
  {
    id: 'AYUR-2024-003',
    farmerId: '1',
    farmerName: 'Raj Kumar',
    herbType: 'Turmeric',
    quantity: 40,
    unit: 'kg',
    harvestDate: '2024-01-18T07:45:00Z',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Organic Farm, Gurgaon, Haryana'
    },
    status: 'rejected',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    photo: '/api/placeholder/300/200',
    rejectionReason: 'Quality does not meet grade A standards',
    price: 600,
    paymentStatus: 'pending'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 'TX-001',
    batchId: 'AYUR-2024-001',
    from: 'Raj Kumar',
    to: 'Blockchain',
    action: 'Batch Created',
    timestamp: '2024-01-15T08:30:00Z',
    blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890'
  },
  {
    id: 'TX-002',
    batchId: 'AYUR-2024-001',
    from: 'Priya Sharma',
    to: 'Blockchain',
    action: 'Batch Verified',
    timestamp: '2024-01-16T10:15:00Z',
    blockchainHash: '0x2b3c4d5e6f7890abcdef1234567890ab'
  }
];

export const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    batchId: 'AYUR-2024-001',
    amount: 800,
    currency: 'INR',
    status: 'paid',
    date: '2024-01-17T14:30:00Z'
  },
  {
    id: 'PAY-002',
    batchId: 'AYUR-2024-002',
    amount: 1200,
    currency: 'INR',
    status: 'pending',
    date: '2024-01-20T09:00:00Z'
  }
];

export const herbTypes = [
  'Tulsi (Holy Basil)',
  'Ashwagandha',
  'Turmeric',
  'Neem',
  'Aloe Vera',
  'Brahmi',
  'Shankhpushpi',
  'Giloy',
  'Amla',
  'Arjuna'
];