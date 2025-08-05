export interface User {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  kycStatus: 'Pending' | 'Verified' | 'Rejected' | string;
  avatarUrl?: string;
  registrationDate: string;
  documents?: Array<{
    type: "Passport" | "Driver's License" | "Proof of Address";
    url: string;
  }>;
  kyc_document_url?: string;
}

export interface Wheelchair {
  id: string;
  name: string;
  category_id: number;
  description: string;
  information: string;
  is_globally_available: boolean;
  average_rating: string;
  total_reviews: number;
  model?: string;
  manufacturer?: string;
  category?: {
    id: number;
    name: string;
  };
  images?: { url: string }[];
}

export interface WheelchairCategory {
  id: number;
  name: string;
  description: string;
}


export interface RentalTransaction {
    id: number;
    transaction_id: string;
    payment_gateway: string;
    transaction_status: string;
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
  rent_transactions?: RentalTransaction[];
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
  id:string;
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
