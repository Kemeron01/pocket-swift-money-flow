import React, { useState, useEffect } from 'react';
import { 
  Send, 
  QrCode, 
  CreditCard, 
  Users, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Smartphone, 
  Building, 
  Gift,
  Target,
  Award,
  Bell,
  Settings,
  User,
  Home,
  TrendingUp,
  Eye,
  EyeOff,
  Star,
  Shield,
  Camera,
  Scan,
  Clock,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import Achievements from '../components/Achievements';

interface Transaction {
  id: number;
  type: 'send' | 'receive';
  amount: number;
  from?: string;
  to?: string;
  date: string;
  method: string;
  message?: string;
}

interface MockDataType {
  balance: number;
  savings: number;
  monthlySpending: number;
  recentTransactions: Transaction[];
  friends: Array<{
    id: number;
    name: string;
    avatar: string;
    status: string;
  }>;
  redEnvelopes: Array<{
    id: number;
    amount: number;
    from: string;
    message: string;
    date: string;
  }>;
  autoTopUp: boolean;
  privacySettings: {
    transactionVisibility: string;
    profileVisible: boolean;
  };
  totalAchievementPoints?: number;
}

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
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [sendAmount, setSendAmount] = useState('');
  const [requestAmount, setRequestAmount] = useState('');
  const [splitAmount, setSplitAmount] = useState('');
  const [selectedSplitFriends, setSelectedSplitFriends] = useState<any[]>([]);
  const [payCodeAmount, setPayCodeAmount] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Payment received from John Doe', type: 'success', time: '2 min ago' },
    { id: 2, message: 'Auto top-up successful', type: 'info', time: '1 hour ago' },
    { id: 3, message: 'New red envelope received', type: 'success', time: '2 hours ago' }
  ]);

  const showNotificationMessage = (message: string, type = 'success') => {
    toast[type as keyof typeof toast](message);
  };

  const processP2PPayment = (type: string, amount: string, friend: any, message = '') => {
    const transaction: Transaction = {
      id: Date.now(),
      type: type === 'send' ? 'send' : 'receive',
      amount: parseFloat(amount),
      [type === 'send' ? 'to' : 'from']: friend.name,
      date: new Date().toISOString().split('T')[0],
      method: 'P2P',
      message
    };

    setMockData(prev => ({
      ...prev,
      recentTransactions: [transaction, ...prev.recentTransactions],
      balance: type === 'send' ? prev.balance - transaction.amount : prev.balance + transaction.amount
    }));

    showNotificationMessage(
      `${type === 'send' ? 'Sent' : 'Requested'} $${amount} ${type === 'send' ? 'to' : 'from'} ${friend.name}`,
      'success'
    );
  };

  const handleSendMoney = () => {
    if (selectedFriend && sendAmount) {
      processP2PPayment('send', sendAmount, selectedFriend);
      setSendAmount('');
      setSelectedFriend(null);
      setCurrentView('dashboard');
    }
  };

  const handleRequestMoney = () => {
    if (selectedFriend && requestAmount) {
      processP2PPayment('request', requestAmount, selectedFriend);
      setRequestAmount('');
      setSelectedFriend(null);
      setCurrentView('dashboard');
    }
  };

  const handleSplitBill = () => {
    if (splitAmount && selectedSplitFriends.length > 0) {
      const amountPerPerson = parseFloat(splitAmount) / (selectedSplitFriends.length + 1);
      
      selectedSplitFriends.forEach(friend => {
        processP2PPayment('request', amountPerPerson.toFixed(2), friend, 'Split bill');
      });
      
      setSplitAmount('');
      setSelectedSplitFriends([]);
      setCurrentView('dashboard');
      showNotificationMessage(`Split $${splitAmount} between ${selectedSplitFriends.length + 1} people`, 'success');
    }
  };

  const handlePayCodePayment = () => {
    if (payCodeAmount) {
      const transaction: Transaction = {
        id: Date.now(),
        type: 'send',
        amount: parseFloat(payCodeAmount),
        to: 'Merchant',
        date: new Date().toISOString().split('T')[0],
        method: 'PayCode'
      };

      setMockData(prev => ({
        ...prev,
        recentTransactions: [transaction, ...prev.recentTransactions],
        balance: prev.balance - transaction.amount
      }));

      setPayCodeAmount('');
      setCurrentView('dashboard');
      showNotificationMessage(`Paid $${payCodeAmount} via PayCode`, 'success');
    }
  };

  const handleTopUp = () => {
    if (topUpAmount) {
      const transaction: Transaction = {
        id: Date.now(),
        type: 'receive',
        amount: parseFloat(topUpAmount),
        from: 'Bank Account',
        date: new Date().toISOString().split('T')[0],
        method: 'Top Up'
      };

      setMockData(prev => ({
        ...prev,
        recentTransactions: [transaction, ...prev.recentTransactions],
        balance: prev.balance + transaction.amount
      }));

      setTopUpAmount('');
      setCurrentView('dashboard');
      showNotificationMessage(`Added $${topUpAmount} to your balance`, 'success');
    }
  };

  const handleScanPayCode = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setCurrentView('paycode');
      showNotificationMessage('PayCode scanned successfully!', 'success');
    }, 2000);
  };

  const sendRedEnvelope = (amount: string, message: string, recipients: any[]) => {
    recipients.forEach(friend => {
      const transaction: Transaction = {
        id: Date.now() + Math.random(),
        type: 'send',
        amount: parseFloat(amount),
        to: friend.name,
        date: new Date().toISOString().split('T')[0],
        method: 'Red Envelope',
        message
      };

      setMockData(prev => ({
        ...prev,
        recentTransactions: [transaction, ...prev.recentTransactions],
        balance: prev.balance - transaction.amount
      }));
    });

    showNotificationMessage(`Sent red envelope to ${recipients.length} friends`, 'success');
  };

  const Dashboard = ({ service }: { service: any }) => (
    <div className="fade-in p-4">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm">Available Balance</p>
            <div className="flex items-center space-x-2">
              <h2 className="text-3xl font-bold">
                {balanceVisible ? `$${mockData.balance.toLocaleString()}` : '****'}
              </h2>
              <button 
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="text-blue-100 hover:text-white transition-colors"
              >
                {balanceVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Savings</p>
            <p className="text-xl font-semibold">${mockData.savings.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={() => setCurrentView('topup')}
            className="flex-1 bg-white/20 rounded-lg p-3 text-center hover:bg-white/30 transition-colors scale-on-tap"
          >
            <Plus className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm">Top Up</span>
          </button>
          <button 
            onClick={() => setCurrentView('send')}
            className="flex-1 bg-white/20 rounded-lg p-3 text-center hover:bg-white/30 transition-colors scale-on-tap"
          >
            <Send className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm">Send</span>
          </button>
          <button 
            onClick={() => setCurrentView('scan')}
            className="flex-1 bg-white/20 rounded-lg p-3 text-center hover:bg-white/30 transition-colors scale-on-tap"
          >
            <QrCode className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm">Scan</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-3">
          <button 
            onClick={() => setCurrentView('send')}
            className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-all scale-on-tap text-center"
          >
            <Send className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <span className="text-xs text-gray-600">Send Money</span>
          </button>
          <button 
            onClick={() => setCurrentView('request')}
            className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-all scale-on-tap text-center"
          >
            <ArrowDownLeft className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <span className="text-xs text-gray-600">Request</span>
          </button>
          <button 
            onClick={() => setCurrentView('split')}
            className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-all scale-on-tap text-center"
          >
            <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <span className="text-xs text-gray-600">Split Bill</span>
          </button>
          <button 
            onClick={() => setCurrentView('red-envelope')}
            className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-all scale-on-tap text-center"
          >
            <Gift className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <span className="text-xs text-gray-600">Red Envelope</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Achievement Points</p>
              <p className="text-2xl font-bold">{mockData.totalAchievementPoints || 0}</p>
            </div>
            <button 
              onClick={() => setCurrentView('achievements')}
              className="bg-white/20 rounded-lg p-2 hover:bg-white/30 transition-colors scale-on-tap"
            >
              <Award className="w-6 h-6" />
            </button>
          </div>
          <button 
            onClick={() => setCurrentView('achievements')}
            className="w-full mt-3 bg-white/20 rounded-lg p-2 text-center hover:bg-white/30 transition-colors scale-on-tap"
          >
            <span className="text-sm">View All Achievements</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <button 
            onClick={() => setCurrentView('history')}
            className="text-blue-600 text-sm hover:text-blue-700 transition-colors"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {mockData.recentTransactions.slice(0, 3).map(transaction => (
            <div key={transaction.id} className="bg-white p-4 rounded-lg border flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'receive' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'receive' ? 
                    <ArrowDownLeft className="w-4 h-4 text-green-600" /> : 
                    <ArrowUpRight className="w-4 h-4 text-red-600" />
                  }
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.type === 'receive' ? transaction.from : transaction.to}
                  </p>
                  <p className="text-sm text-gray-500">{transaction.method} • {transaction.date}</p>
                </div>
              </div>
              <p className={`font-semibold ${
                transaction.type === 'receive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'receive' ? '+' : '-'}${transaction.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const P2PTransfer = () => (
    <div className="fade-in p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">P2P Transfer</h2>
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Send className="w-5 h-5 mr-2 text-blue-600" />
            Send Money
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Friend</label>
              <div className="grid grid-cols-2 gap-2">
                {mockData.friends.map(friend => (
                  <button
                    key={friend.id}
                    onClick={() => setSelectedFriend(friend)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      selectedFriend?.id === friend.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{friend.avatar}</span>
                      <div>
                        <p className="font-medium text-gray-900">{friend.name}</p>
                        <p className="text-xs text-gray-500">{friend.status}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleSendMoney}
              disabled={!selectedFriend || !sendAmount}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors scale-on-tap"
            >
              Send Money
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ArrowDownLeft className="w-5 h-5 mr-2 text-green-600" />
            Request Money
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={requestAmount}
                onChange={(e) => setRequestAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleRequestMoney}
              disabled={!selectedFriend || !requestAmount}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors scale-on-tap"
            >
              Request Money
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-600" />
            Split Bill
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
              <input
                type="number"
                value={splitAmount}
                onChange={(e) => setSplitAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Friends</label>
              <div className="grid grid-cols-2 gap-2">
                {mockData.friends.map(friend => (
                  <button
                    key={friend.id}
                    onClick={() => {
                      setSelectedSplitFriends(prev => 
                        prev.find(f => f.id === friend.id)
                          ? prev.filter(f => f.id !== friend.id)
                          : [...prev, friend]
                      );
                    }}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      selectedSplitFriends.find(f => f.id === friend.id)
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{friend.avatar}</span>
                      <div>
                        <p className="font-medium text-gray-900">{friend.name}</p>
                        <p className="text-xs text-gray-500">{friend.status}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {splitAmount && selectedSplitFriends.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-purple-700">
                  Each person pays: ${(parseFloat(splitAmount) / (selectedSplitFriends.length + 1)).toFixed(2)}
                </p>
              </div>
            )}

            <button
              onClick={handleSplitBill}
              disabled={!splitAmount || selectedSplitFriends.length === 0}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors scale-on-tap"
            >
              Split Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const BusinessPayments = () => (
    <div className="fade-in p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Business Payments</h2>
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <QrCode className="w-5 h-5 mr-2 text-blue-600" />
            PayCode Payment
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount</label>
              <input
                type="number"
                value={payCodeAmount}
                onChange={(e) => setPayCodeAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleScanPayCode}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors scale-on-tap flex items-center justify-center"
              >
                <Camera className="w-5 h-5 mr-2" />
                Scan PayCode
              </button>
              <button
                onClick={handlePayCodePayment}
                disabled={!payCodeAmount}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors scale-on-tap"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Merchants</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Starbucks', icon: '☕', category: 'Food & Drink' },
              { name: 'McDonald\'s', icon: '🍔', category: 'Food & Drink' },
              { name: 'Circle K', icon: '🏪', category: 'Convenience' },
              { name: 'Wellcome', icon: '🛒', category: 'Grocery' }
            ].map((merchant, index) => (
              <button
                key={index}
                onClick={() => {
                  setPayCodeAmount('50.00');
                  showNotificationMessage(`Selected ${merchant.name}`, 'info');
                }}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{merchant.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{merchant.name}</p>
                    <p className="text-xs text-gray-500">{merchant.category}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Consumption Voucher Scheme</h3>
          <p className="text-green-100 text-sm mb-4">Use your government vouchers at participating merchants</p>
          <button className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors scale-on-tap">
            View Eligible Merchants
          </button>
        </div>
      </div>
    </div>
  );

  const FundManagement = () => (
    <div className="fade-in p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Fund Management</h2>
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-green-600" />
            Top Up Balance
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <div className="space-y-2">
                <button className="w-full p-3 border border-gray-300 rounded-lg text-left hover:border-green-500 transition-colors flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span>HSBC Credit Card ****1234</span>
                </button>
                <button className="w-full p-3 border border-gray-300 rounded-lg text-left hover:border-green-500 transition-colors flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-600" />
                  <span>HSBC Bank Account ****5678</span>
                </button>
              </div>
            </div>

            <button
              onClick={handleTopUp}
              disabled={!topUpAmount}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors scale-on-tap"
            >
              Top Up Now
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-600" />
            Auto Top-Up Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Enable Auto Top-Up</p>
                <p className="text-sm text-gray-600">Automatically add funds when balance is low</p>
              </div>
              <button
                onClick={() => setMockData(prev => ({ ...prev, autoTopUp: !prev.autoTopUp }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  mockData.autoTopUp ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  mockData.autoTopUp ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
            
            {mockData.autoTopUp && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">Auto top-up $500 when balance falls below $100</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2 text-purple-600" />
            Transfer to Bank
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Amount</label>
              <input
                type="number"
                placeholder="0.00"
                max={mockData.balance}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-purple-700">Available balance: ${mockData.balance.toLocaleString()}</p>
            </div>

            <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors scale-on-tap">
              Transfer to Bank
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const SocialFeatures = () => (
    <div className="fade-in p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Social Features</h2>
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Gift className="w-5 h-5 mr-2" />
            Send Red Envelope
          </h3>
          
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Amount per envelope"
              className="w-full p-3 rounded-lg text-gray-900 placeholder-gray-500"
            />
            <input
              type="text"
              placeholder="Lucky message"
              className="w-full p-3 rounded-lg text-gray-900 placeholder-gray-500"
            />
            <button 
              onClick={() => {
                sendRedEnvelope('88.00', 'Good luck!', mockData.friends.slice(0, 2));
                setCurrentView('dashboard');
              }}
              className="w-full bg-white/20 text-white py-3 rounded-lg font-medium hover:bg-white/30 transition-colors scale-on-tap"
            >
              Send to Friends
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Received Red Envelopes</h3>
          <div className="space-y-3">
            {mockData.redEnvelopes.map(envelope => (
              <div key={envelope.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🧧</span>
                  <div>
                    <p className="font-medium text-gray-900">{envelope.from}</p>
                    <p className="text-sm text-gray-600">{envelope.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">+${envelope.amount}</p>
                  <p className="text-xs text-gray-500">{envelope.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Timeline</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Privacy Settings</p>
                <p className="text-sm text-gray-600">Control who can see your transactions</p>
              </div>
              <select 
                value={mockData.privacySettings.transactionVisibility}
                onChange={(e) => setMockData(prev => ({
                  ...prev,
                  privacySettings: { ...prev.privacySettings, transactionVisibility: e.target.value }
                }))}
                className="p-2 border border-gray-300 rounded-lg"
              >
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
                <option value="public">Public</option>
              </select>
            </div>
            
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Your social timeline will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Scanner = () => (
    <div className="fade-in p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Scan PayCode</h2>
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6">
        {isScanning ? (
          <div className="bg-black rounded-xl p-8 text-center">
            <div className="relative">
              <div className="w-64 h-64 mx-auto border-2 border-white rounded-lg relative">
                <div className="absolute inset-4 border border-white/50 rounded"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Scan className="w-12 h-12 text-white animate-pulse" />
                </div>
              </div>
              <p className="text-white mt-4">Scanning PayCode...</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <QrCode className="w-16 h-16 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Scan</h3>
            <p className="text-gray-600 mb-6">Point your camera at a PayCode to make a payment</p>
            <button
              onClick={handleScanPayCode}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors scale-on-tap"
            >
              Start Scanning
            </button>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My PayCode</h3>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <QrCode className="w-16 h-16 text-gray-600" />
            </div>
            <p className="text-gray-600">Share this code to receive payments</p>
          </div>
        </div>
      </div>
    </div>
  );

  const TransactionHistory = () => (
    <div className="fade-in p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        {mockData.recentTransactions.map(transaction => (
          <div key={transaction.id} className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'receive' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'receive' ? 
                    <ArrowDownLeft className="w-4 h-4 text-green-600" /> : 
                    <ArrowUpRight className="w-4 h-4 text-red-600" />
                  }
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.type === 'receive' ? transaction.from : transaction.to}
                  </p>
                  <p className="text-sm text-gray-500">{transaction.method}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'receive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'receive' ? '+' : '-'}${transaction.amount}
                </p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
            </div>
            {transaction.message && (
              <p className="text-sm text-gray-600 italic">"{transaction.message}"</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const Settings = () => (
    <div className="fade-in p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">John Doe</p>
                <p className="text-sm text-gray-600">john.doe@email.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Biometric Login</p>
                <p className="text-sm text-gray-600">Use fingerprint or face recognition</p>
              </div>
              <button className="w-12 h-6 bg-blue-600 rounded-full">
                <div className="w-5 h-5 bg-white rounded-full translate-x-6"></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Transaction Notifications</p>
                <p className="text-sm text-gray-600">Get notified of all transactions</p>
              </div>
              <button className="w-12 h-6 bg-blue-600 rounded-full">
                <div className="w-5 h-5 bg-white rounded-full translate-x-6"></div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Visibility</label>
              <select 
                value={mockData.privacySettings.transactionVisibility}
                onChange={(e) => setMockData(prev => ({
                  ...prev,
                  privacySettings: { ...prev.privacySettings, transactionVisibility: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
                <option value="public">Public</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-3">
            {notifications.map(notification => (
              <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const AchievementsDashboard = () => (
    <Achievements 
      mockData={mockData} 
      setMockData={setMockData} 
      showNotificationMessage={showNotificationMessage} 
    />
  );

  const renderCurrentView = () => {
    const service = { mockData, setMockData, showNotificationMessage };
    
    switch (currentView) {
      case 'dashboard': return <Dashboard service={service} />;
      case 'send': return <P2PTransfer />;
      case 'request': return <P2PTransfer />;
      case 'split': return <P2PTransfer />;
      case 'paycode': return <BusinessPayments />;
      case 'topup': return <FundManagement />;
      case 'scan': return <Scanner />;
      case 'history': return <TransactionHistory />;
      case 'settings': return <Settings />;
      case 'red-envelope': return <SocialFeatures />;
      case 'achievements': return <AchievementsDashboard />;
      default: return <Dashboard service={service} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">PayMe</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentView('achievements')}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors relative"
            >
              <Award className="w-6 h-6" />
              {(mockData.totalAchievementPoints || 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Math.floor((mockData.totalAchievementPoints || 0) / 100)}
                </span>
              )}
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors relative">
              <Bell className="w-6 h-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setCurrentView('settings')}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="pb-20">
        {renderCurrentView()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="flex items-center justify-around py-2">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center py-2 px-4 transition-colors scale-on-tap ${
              currentView === 'dashboard' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('send')}
            className={`flex flex-col items-center py-2 px-4 transition-colors scale-on-tap ${
              ['send', 'request', 'split'].includes(currentView) ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Send className="w-6 h-6" />
            <span className="text-xs mt-1">Transfer</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('scan')}
            className={`flex flex-col items-center py-2 px-4 transition-colors scale-on-tap ${
              currentView === 'scan' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <QrCode className="w-6 h-6" />
            <span className="text-xs mt-1">Scan</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('paycode')}
            className={`flex flex-col items-center py-2 px-4 transition-colors scale-on-tap ${
              currentView === 'paycode' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Building className="w-6 h-6" />
            <span className="text-xs mt-1">Business</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('history')}
            className={`flex flex-col items-center py-2 px-4 transition-colors scale-on-tap ${
              currentView === 'history' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Clock className="w-6 h-6" />
            <span className="text-xs mt-1">History</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankingApp;
