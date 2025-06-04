
export interface Transaction {
  id: number;
  type: 'send' | 'receive';
  amount: number;
  from?: string;
  to?: string;
  date: string;
  method: string;
  message?: string;
}

export interface Friend {
  id: number;
  name: string;
  avatar: string;
  status: string;
}

export interface RedEnvelope {
  id: number;
  amount: number;
  from: string;
  message: string;
  date: string;
}

export interface Notification {
  id: number;
  message: string;
  type: string;
  time: string;
}

export interface MockDataType {
  balance: number;
  savings: number;
  monthlySpending: number;
  recentTransactions: Transaction[];
  friends: Friend[];
  redEnvelopes: RedEnvelope[];
  autoTopUp: boolean;
  privacySettings: {
    transactionVisibility: string;
    profileVisible: boolean;
  };
  totalAchievementPoints?: number;
}
