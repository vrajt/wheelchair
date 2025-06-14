export interface User {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  kycStatus: 'Pending' | 'Verified' | 'Rejected';
  avatarUrl?: string;
  registrationDate: string;
}

export interface Wheelchair {
  id: string;
  name: string;
  category: string;
  status: 'Available' | 'Rented' | 'Maintenance';
  imageUrl?: string;
  dataAiHint?: string;
  description: string;
  dailyRate: number;
  reviewsCount?: number;
  averageRating?: number;
}

export interface Rental {
  id: string;
  userId: string;
  userName: string;
  wheelchairId: string;
  wheelchairName: string;
  startDate: string;
  endDate: string;
  status: 'Ongoing' | 'Completed' | 'Cancelled';
  totalAmount: number;
}

export interface Transaction {
  id: string;
  rentalId: string;
  userId: string;
  userName: string;
  amount: number;
  date: string;
  status: 'Success' | 'Pending' | 'Failed';
  paymentMethod: string;
  // For GenAI feature
  transactionData: string;
  transactionVolume: number;
  userLocation: string;
  historicalTransactionData: string;
  anomalyReport?: {
    isAnomalous: boolean;
    explanation: string;
    riskScore: number;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name as string
}

export interface City {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

// For table pagination and search
export interface DataTableState<T> {
  currentPage: number;
  searchTerm: string;
  filteredData: T[];
  paginatedData: T[];
  totalPages: number;
}
