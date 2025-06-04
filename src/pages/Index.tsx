
import React, { useState } from 'react';
import { toast } from 'sonner';
import Achievements from '../components/Achievements';
import Dashboard from '../components/Dashboard';
import MobileHeader from '../components/MobileHeader';
import MobileNavigation from '../components/MobileNavigation';
import SendMoney from '../components/SendMoney';
import RequestMoney from '../components/RequestMoney';
import SplitBill from '../components/SplitBill';
import ScanQR from '../components/ScanQR';
import TransactionHistory from '../components/TransactionHistory';
import Settings from '../components/Settings';
import { MockDataType, Transaction, Notification } from '../types';

const BankingApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [mockData, setMockData] = useState<MockDataType>({
    balance: 15420.50,
    savings: 8750.00,
    monthlySpending: 3240.80,
    totalAchievementPoints: 0,
    recentTransactions: [
      { id: 1, type: 'receive', amount: 250.00, from: 'John Doe', date: '2024-06-03', method: 'P2P' },
      { id: 2, type: 'send', amount: 45.80, to: 'Coffee Shop', date: '2024-06-03', method: 'PayCode' },
      { id: 3, type: 'receive', amount: 1200.00, from: 'Salary', date: '2024-06-01', method: 'Bank Transfer' },
      { id: 4, type: 'send', amount: 89.50, to: 'Alice Chen', date: '2024-05-31', method: 'Split Bill' },
      { id: 5, type: 'send', amount: 120.00, to: 'Utility Bill', date: '2024-05-30', method: 'Business Payment' }
    ],
    friends: [
      { id: 1, name: 'John Doe', avatar: '👨', status: 'online' },
      { id: 2, name: 'Alice Chen', avatar: '👩', status: 'offline' },
      { id: 3, name: 'Mike Wong', avatar: '👨‍💼', status: 'online' },
      { id: 4, name: 'Sarah Liu', avatar: '👩‍💻', status: 'online' }
    ],
    redEnvelopes: [
      { id: 1, amount: 88.00, from: 'Mom', message: 'Happy Birthday!', date: '2024-06-01' },
      { id: 2, amount: 168.00, from: 'Uncle Tom', message: 'Congratulations!', date: '2024-05-28' }
    ],
    autoTopUp: true,
    privacySettings: {
      transactionVisibility: 'friends',
      profileVisible: true
    }
  });

  const [balanceVisible, setBalanceVisible] = useState(true);
  const [notifications] = useState<Notification[]>([
    { id: 1, message: 'Payment received from John Doe', type: 'success', time: '2 min ago' },
    { id: 2, message: 'Auto top-up successful', type: 'info', time: '1 hour ago' },
    { id: 3, message: 'New red envelope received', type: 'success', time: '2 hours ago' }
  ]);

  const showNotificationMessage = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (type === 'success') toast.success(message);
    else if (type === 'error') toast.error(message);
    else toast.info(message);
  };

  const handleSendMoney = (recipient: string, amount: number, message?: string) => {
    if (amount > mockData.balance) {
      showNotificationMessage('Insufficient balance', 'error');
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      type: 'send',
      amount,
      to: recipient,
      date: new Date().toISOString().split('T')[0],
      method: 'P2P',
      message
    };

    setMockData(prev => ({
      ...prev,
      balance: prev.balance - amount,
      recentTransactions: [newTransaction, ...prev.recentTransactions]
    }));

    showNotificationMessage(`Successfully sent $${amount} to ${recipient}`);
    setCurrentView('dashboard');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard': 
        return (
          <Dashboard 
            mockData={mockData}
            balanceVisible={balanceVisible}
            setBalanceVisible={setBalanceVisible}
            setCurrentView={setCurrentView}
          />
        );
      case 'send':
        return (
          <SendMoney 
            friends={mockData.friends}
            onSendMoney={handleSendMoney}
            setCurrentView={setCurrentView}
          />
        );
      case 'request':
        return (
          <RequestMoney 
            friends={mockData.friends}
            setCurrentView={setCurrentView}
          />
        );
      case 'split':
        return (
          <SplitBill 
            friends={mockData.friends}
            setCurrentView={setCurrentView}
          />
        );
      case 'scan':
        return <ScanQR setCurrentView={setCurrentView} />;
      case 'history':
        return (
          <TransactionHistory 
            transactions={mockData.recentTransactions}
            setCurrentView={setCurrentView}
          />
        );
      case 'settings':
        return (
          <Settings 
            mockData={mockData}
            setMockData={setMockData}
            setCurrentView={setCurrentView}
          />
        );
      case 'achievements': 
        return (
          <Achievements 
            mockData={mockData} 
            setMockData={setMockData} 
            showNotificationMessage={showNotificationMessage} 
          />
        );
      default: 
        return (
          <div className="p-4 text-center">
            <h2 className="text-xl font-semibold mb-2">Feature Coming Soon</h2>
            <p className="text-gray-600">This feature is under development</p>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-sm mx-auto relative">
      <MobileHeader 
        totalAchievementPoints={mockData.totalAchievementPoints || 0}
        notifications={notifications}
        setCurrentView={setCurrentView}
      />

      <div className="flex-1 pb-20 overflow-y-auto">
        {renderCurrentView()}
      </div>

      <MobileNavigation 
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
    </div>
  );
};

export default BankingApp;
