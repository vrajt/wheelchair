import type { User, Wheelchair, Rental, Transaction, Category, City, Notification } from '@/types';

export const mockUsers: User[] = Array.from({ length: 25 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: i % 3 === 0 ? 'Inactive' : 'Active',
  kycStatus: i % 4 === 0 ? 'Pending' : i % 4 === 1 ? 'Verified' : 'Rejected',
  avatarUrl: `https://placehold.co/40x40.png?text=U${i+1}`,
  registrationDate: new Date(2023, i % 12, (i % 28) + 1).toISOString(),
}));

export const mockWheelchairs: Wheelchair[] = Array.from({ length: 15 }, (_, i) => ({
  id: `wheelchair-${i + 1}`,
  name: `Wheelchair Model ${String.fromCharCode(65 + i)}`,
  category: i % 3 === 0 ? 'Standard' : i % 3 === 1 ? 'Electric' : 'Pediatric',
  status: i % 4 === 0 ? 'Rented' : i % 4 === 1 ? 'Maintenance' : 'Available',
  imageUrl: `https://placehold.co/100x80.png?text=W${i+1}`,
  dataAiHint: 'wheelchair product',
  description: `This is a high-quality wheelchair model ${String.fromCharCode(65 + i)}.`,
  dailyRate: 20 + i * 2,
  reviewsCount: Math.floor(Math.random() * 50),
  averageRating: Math.round((3 + Math.random() * 2) * 10) / 10,
}));

export const mockRentals: Rental[] = Array.from({ length: 30 }, (_, i) => {
  const user = mockUsers[i % mockUsers.length];
  const wheelchair = mockWheelchairs[i % mockWheelchairs.length];
  const startDate = new Date(2024, i % 12, (i % 28) + 1);
  const endDate = new Date(startDate.getTime() + (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000);
  return {
    id: `rental-${i + 1}`,
    userId: user.id,
    userName: user.name,
    wheelchairId: wheelchair.id,
    wheelchairName: wheelchair.name,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    status: i % 3 === 0 ? 'Ongoing' : i % 3 === 1 ? 'Completed' : 'Cancelled',
    totalAmount: wheelchair.dailyRate * ((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)),
  };
});

export const mockTransactions: Transaction[] = mockRentals.map((rental, i) => ({
  id: `txn-${i + 1}`,
  rentalId: rental.id,
  userId: rental.userId,
  userName: rental.userName,
  amount: rental.totalAmount,
  date: new Date(new Date(rental.endDate).getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Transaction a day after rental ends
  status: i % 4 === 0 ? 'Pending' : i % 4 === 1 ? 'Failed' : 'Success',
  paymentMethod: i % 2 === 0 ? 'Credit Card' : 'PayPal',
  // For GenAI feature
  transactionData: `User: ${rental.userName}, Wheelchair: ${rental.wheelchairName}, Amount: ${rental.totalAmount.toFixed(2)}`,
  transactionVolume: rental.totalAmount,
  userLocation: i % 2 === 0 ? "New York, USA" : "London, UK",
  historicalTransactionData: `Previous transactions for ${rental.userName}: 5 transactions, total $${(Math.random()*500).toFixed(2)}, no previous anomalies.`,
}));

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Standard', icon: 'Armchair' },
  { id: 'cat-2', name: 'Electric', icon: 'Zap' },
  { id: 'cat-3', name: 'Pediatric', icon: 'Baby' },
  { id: 'cat-4', name: 'Sport', icon: 'Bike' },
];

export const mockCities: City[] = [
  { id: 'city-1', name: 'New York', status: 'Active' },
  { id: 'city-2', name: 'Los Angeles', status: 'Active' },
  { id: 'city-3', name: 'Chicago', status: 'Inactive' },
  { id: 'city-4', name: 'London', status: 'Active' },
];

export const mockNotifications: Notification[] = Array.from({length: 5}, (_, i) => ({
    id: `notif-${i+1}`,
    title: i % 2 === 0 ? `New User Registration: ${mockUsers[i].name}` : `Rental Completed: ${mockRentals[i].id}`,
    message: i % 2 === 0 ? `${mockUsers[i].name} has registered and is awaiting KYC verification.` : `Rental ${mockRentals[i].id} for ${mockWheelchairs[i].name} by ${mockUsers[i].name} has been completed.`,
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    read: i % 3 === 0,
}))
