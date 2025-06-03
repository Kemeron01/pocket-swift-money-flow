import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  Send, 
  History, 
  CreditCard, 
  Settings, 
  User, 
  Eye, 
  EyeOff, 
  Filter, 
  Calendar,
  DollarSign,
  TrendingUp,
  Bell,
  Moon,
  Sun,
  Type,
  Fingerprint,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  QrCode,
  Users,
  Smartphone,
  Building2,
  Gift,
  Share2,
  Camera,
  UserPlus,
  Zap,
  Shield,
  Star,
  Heart,
  MessageCircle,
  Lock,
  Globe
} from 'lucide-react';

// Mock data and types
interface Transaction {
  id: number;
  date: string;
  type: 'credit' | 'debit' | 'request' | 'split' | 'laisee';
  amount: number;
  description: string;
  category: string;
  recipient?: string;
  sender?: string;
  status?: 'completed' | 'pending' | 'requested';
  social?: {
    message?: string;
    visibility: 'friends' | 'private';
    likes?: number;
    comments?: number;
  };
}

interface Account {
  id: number;
  type: string;
  balance: number;
  number: string;
}

interface Payee {
  id: number;
  name: string;
  accountNumber: string;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  accountNumber: string;
  accountType: string;
}

interface AppSettings {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  notifications: boolean;
  biometricLogin: boolean;
  showBalance: boolean;
  showRecentTransactions: boolean;
  autoTopUp: boolean;
  autoTopUpThreshold: number;
  socialVisibility: 'friends' | 'private';
}

interface Contact {
  id: number;
  name: string;
  phone: string;
  avatar: string;
  isFrequent: boolean;
}

interface Business {
  id: number;
  name: string;
  category: string;
  payCode: string;
  location: string;
  offers?: string;
}

interface SplitBill {
  id: number;
  title: string;
  totalAmount: number;
  participants: string[];
  createdBy: string;
  status: 'active' | 'completed';
  payments: { participant: string; amount: number; paid: boolean }[];
}

interface MockData {
  user: UserData;
  accounts: Account[];
  transactions: Transaction[];
  payees: Payee[];
  contacts: Contact[];
  businesses: Business[];
  splitBills: SplitBill[];
  settings: AppSettings;
}

// Initial mock data
const initialMockData: MockData = {
  user: {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    accountNumber: "****1234",
    accountType: "Premium Checking"
  },
  accounts: [
    { id: 1, type: "Checking", balance: 3247.56, number: "****1234" },
    { id: 2, type: "Savings", balance: 8932.11, number: "****5678" }
  ],
  transactions: [
    { id: 1, date: "2024-06-03", type: "credit", amount: 2500.00, description: "Salary Deposit", category: "Income" },
    { id: 2, date: "2024-06-02", type: "debit", amount: 89.32, description: "Grocery Store", category: "Food" },
    { id: 3, date: "2024-06-01", type: "debit", amount: 1200.00, description: "Rent Payment", category: "Bills" },
    { id: 4, date: "2024-05-31", type: "credit", amount: 50.00, description: "P2P from Mike", category: "P2P", sender: "Mike Chen", social: { message: "Thanks for dinner! 🍕", visibility: "friends", likes: 3 } },
    { id: 5, date: "2024-05-30", type: "debit", amount: 25.00, description: "Split Bill - Coffee", category: "Split", social: { message: "Great coffee meetup!", visibility: "friends", likes: 5, comments: 2 } },
    { id: 6, date: "2024-05-29", type: "laisee", amount: 88.00, description: "Red Envelope from Aunt", category: "Laisee", social: { message: "Happy Birthday! 🧧", visibility: "friends", likes: 12 } },
    { id: 7, date: "2024-05-28", type: "debit", amount: 67.89, description: "Starbucks - PayCode", category: "Business" }
  ],
  payees: [
    { id: 1, name: "Electric Company", accountNumber: "12345" },
    { id: 2, name: "Water Department", accountNumber: "67890" },
    { id: 3, name: "Internet Provider", accountNumber: "54321" }
  ],
  contacts: [
    { id: 1, name: "Mike Chen", phone: "+852 9876 5432", avatar: "👨‍💼", isFrequent: true },
    { id: 2, name: "Emily Wong", phone: "+852 8765 4321", avatar: "👩‍🎨", isFrequent: true },
    { id: 3, name: "David Lee", phone: "+852 7654 3210", avatar: "👨‍💻", isFrequent: false },
    { id: 4, name: "Lisa Zhang", phone: "+852 6543 2109", avatar: "👩‍🔬", isFrequent: true }
  ],
  businesses: [
    { id: 1, name: "Starbucks Central", category: "Coffee", payCode: "SB001", location: "Central", offers: "10% off with PayMe" },
    { id: 2, name: "McDonald's TST", category: "Fast Food", payCode: "MC002", location: "Tsim Sha Tsui" },
    { id: 3, name: "7-Eleven Causeway Bay", category: "Convenience", payCode: "711003", location: "Causeway Bay", offers: "Buy 2 Get 1 Free" }
  ],
  splitBills: [
    {
      id: 1,
      title: "Dinner at Italian Restaurant",
      totalAmount: 480.00,
      participants: ["Sarah Johnson", "Mike Chen", "Emily Wong", "David Lee"],
      createdBy: "Sarah Johnson",
      status: "active",
      payments: [
        { participant: "Sarah Johnson", amount: 120.00, paid: true },
        { participant: "Mike Chen", amount: 120.00, paid: true },
        { participant: "Emily Wong", amount: 120.00, paid: false },
        { participant: "David Lee", amount: 120.00, paid: false }
      ]
    }
  ],
  settings: {
    darkMode: false,
    fontSize: 'medium',
    notifications: true,
    biometricLogin: false,
    showBalance: true,
    showRecentTransactions: true,
    autoTopUp: false,
    autoTopUpThreshold: 100,
    socialVisibility: 'friends'
  }
};

// Simulated backend service
class BankingService {
  private data: MockData;

  constructor() {
    const stored = localStorage.getItem('bankingAppData');
    this.data = stored ? JSON.parse(stored) : initialMockData;
  }

  private save() {
    localStorage.setItem('bankingAppData', JSON.stringify(this.data));
  }

  async getData(): Promise<MockData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return { ...this.data };
  }

  async transfer(recipientName: string, amount: number, memo: string): Promise<{ success: boolean; message: string; transaction?: Transaction }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (amount <= 0) {
      return { success: false, message: "Amount must be positive" };
    }
    
    if (amount > this.data.accounts[0].balance) {
      return { success: false, message: "Insufficient funds" };
    }
    
    // Create transaction
    const transaction: Transaction = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: 'debit',
      amount: amount,
      description: `Transfer to ${recipientName}${memo ? ` - ${memo}` : ''}`,
      category: 'Transfer'
    };
    
    // Update balance and add transaction
    this.data.accounts[0].balance -= amount;
    this.data.transactions.unshift(transaction);
    this.save();
    
    return { 
      success: true, 
      message: `Transfer of $${amount.toFixed(2)} to ${recipientName} completed successfully`,
      transaction
    };
  }

  async p2pTransfer(recipientName: string, amount: number, message: string, type: string): Promise<{ success: boolean; message: string; transaction?: Transaction }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (amount <= 0) {
      return { success: false, message: "Amount must be positive" };
    }
    
    if (type === 'send' && amount > this.data.accounts[0].balance) {
      return { success: false, message: "Insufficient funds" };
    }
    
    const transaction: Transaction = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: type === 'request' ? 'request' : 'debit',
      amount: amount,
      description: `${type === 'send' ? 'Sent to' : type === 'request' ? 'Requested from' : 'Split with'} ${recipientName}`,
      category: 'P2P',
      recipient: recipientName,
      status: type === 'request' ? 'pending' : 'completed',
      social: {
        message: message,
        visibility: this.data.settings.socialVisibility || 'friends',
        likes: 0
      }
    };
    
    if (type === 'send') {
      this.data.accounts[0].balance -= amount;
    }
    
    this.data.transactions.unshift(transaction);
    this.save();
    
    return { 
      success: true, 
      message: `${type === 'send' ? 'Sent' : type === 'request' ? 'Requested' : 'Split created'} $${amount.toFixed(2)} ${type === 'send' ? 'to' : 'from'} ${recipientName}`,
      transaction
    };
  }

  async businessPayment(businessId: number, amount: number): Promise<{ success: boolean; message: string; transaction?: Transaction }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const business = this.data.businesses.find(b => b.id === businessId);
    if (!business) {
      return { success: false, message: "Business not found" };
    }
    
    if (amount <= 0) {
      return { success: false, message: "Amount must be positive" };
    }
    
    if (amount > this.data.accounts[0].balance) {
      return { success: false, message: "Insufficient funds" };
    }
    
    const transaction: Transaction = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: 'debit',
      amount: amount,
      description: `${business.name} - PayCode`,
      category: 'Business'
    };
    
    this.data.accounts[0].balance -= amount;
    this.data.transactions.unshift(transaction);
    this.save();
    
    return { 
      success: true, 
      message: `Payment of $${amount.toFixed(2)} to ${business.name} completed successfully`,
      transaction
    };
  }

  async sendLaisee(recipients: Contact[], amount: number, message: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const totalAmount = amount * recipients.length;
    
    if (totalAmount > this.data.accounts[0].balance) {
      return { success: false, message: "Insufficient funds" };
    }
    
    recipients.forEach(recipient => {
      const transaction: Transaction = {
        id: Date.now() + Math.random(),
        date: new Date().toISOString().split('T')[0],
        type: 'laisee',
        amount: amount,
        description: `Red Envelope to ${recipient.name}`,
        category: 'Laisee',
        recipient: recipient.name,
        social: {
          message: message,
          visibility: 'friends',
          likes: 0
        }
      };
      
      this.data.transactions.unshift(transaction);
    });
    
    this.data.accounts[0].balance -= totalAmount;
    this.save();
    
    return { 
      success: true, 
      message: `Sent ${recipients.length} red envelope(s) for $${totalAmount.toFixed(2)}` 
    };
  }

  async payBill(payeeId: number, amount: number, dueDate: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const payee = this.data.payees.find(p => p.id === payeeId);
    if (!payee) {
      return { success: false, message: "Invalid payee selected" };
    }
    
    if (amount <= 0) {
      return { success: false, message: "Amount must be positive" };
    }
    
    if (amount > this.data.accounts[0].balance) {
      return { success: false, message: "Insufficient funds" };
    }
    
    const transaction: Transaction = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: 'debit',
      amount: amount,
      description: `Bill Payment - ${payee.name}`,
      category: 'Bills'
    };
    
    this.data.accounts[0].balance -= amount;
    this.data.transactions.unshift(transaction);
    this.save();
    
    return { 
      success: true, 
      message: `Payment of $${amount.toFixed(2)} to ${payee.name} scheduled successfully`
    };
  }

  async updateSettings(newSettings: Partial<AppSettings>): Promise<void> {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
  }

  async updateUser(userData: Partial<UserData>): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.data.user = { ...this.data.user, ...userData };
    this.save();
    
    return { success: true, message: "Profile updated successfully" };
  }

  getSpendingByCategory(): { [key: string]: number } {
    const spending: { [key: string]: number } = {};
    this.data.transactions
      .filter(t => t.type === 'debit' && t.category !== 'Transfer')
      .forEach(t => {
        spending[t.category] = (spending[t.category] || 0) + t.amount;
      });
    return spending;
  }
}

// Dashboard Component
const Dashboard: React.FC<{ data: MockData; service: BankingService; onRefresh: () => void }> = ({ data, service, onRefresh }) => {
  const [showBalance, setShowBalance] = useState(data.settings.showBalance);
  const totalBalance = data.accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const recentTransactions = data.transactions.slice(0, 5);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      {/* Enhanced Balance Card */}
      <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <CardContent className="p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold opacity-90">Total Balance</h2>
              <div className="text-3xl font-bold">
                {showBalance ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="text-white hover:bg-white/20 rounded-full p-2"
            >
              {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            {data.accounts.map(account => (
              <div key={account.id} className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                <div className="text-sm opacity-90">{account.type}</div>
                <div className="text-lg font-semibold">
                  {showBalance ? `$${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
                </div>
                <div className="text-xs opacity-75">{account.number}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Send className="text-blue-600" size={20} />
            </div>
            <div className="text-sm font-medium">Send</div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <ArrowDownLeft className="text-green-600" size={20} />
            </div>
            <div className="text-sm font-medium">Request</div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <QrCode className="text-purple-600" size={20} />
            </div>
            <div className="text-sm font-medium">Scan</div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="text-red-600" size={20} />
            </div>
            <div className="text-sm font-medium">Split</div>
          </CardContent>
        </Card>
      </div>

      {/* Social Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="text-red-500" size={20} />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.transactions.filter(t => t.social).slice(0, 3).map(transaction => (
              <div key={transaction.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {transaction.type === 'laisee' ? '🧧' : 
                   transaction.type === 'split' ? '🍕' : '💸'}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{transaction.description}</div>
                  <div className="text-xs text-gray-500">{transaction.social?.message}</div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Heart size={12} /> {transaction.social?.likes || 0}
                    </span>
                    {transaction.social?.comments && (
                      <span className="flex items-center gap-1">
                        <MessageCircle size={12} /> {transaction.social.comments}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    transaction.type === 'credit' || transaction.type === 'laisee' ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {transaction.type === 'credit' || transaction.type === 'laisee' ? '+' : ''}${transaction.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">{transaction.date}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spending Summary */}
      {Object.keys(service.getSpendingByCategory()).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} />
              Monthly Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(service.getSpendingByCategory()).slice(0, 4).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{category}</span>
                  <span className="text-sm text-gray-600">${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      {data.settings.showRecentTransactions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <History className="text-blue-600" size={20} />
                Recent Transactions
              </span>
              <Button variant="ghost" size="sm" onClick={onRefresh}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map(transaction => (
                <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{transaction.description}</div>
                      <div className="text-xs text-gray-500">{transaction.date}</div>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// P2P Transfer Component
const P2PTransfer: React.FC<{ data: MockData; service: BankingService; onSuccess: (message: string) => void; onError: (message: string) => void }> = ({ data, service, onSuccess, onError }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transferType, setTransferType] = useState('send'); // send, request, split

  const frequentContacts = data.contacts.filter(c => c.isFrequent);

  const handleTransfer = async () => {
    setIsLoading(true);
    try {
      const recipientName = selectedContact ? selectedContact.name : recipient;
      const result = await service.p2pTransfer(recipientName, parseFloat(amount), message, transferType);
      if (result.success) {
        onSuccess(result.message);
        setRecipient('');
        setAmount('');
        setMessage('');
        setSelectedContact(null);
      } else {
        onError(result.message);
      }
    } catch (error) {
      onError("Transfer failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      {/* Transfer Type Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Button
              variant={transferType === 'send' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTransferType('send')}
              className="flex-1"
            >
              <Send size={16} className="mr-2" />
              Send
            </Button>
            <Button
              variant={transferType === 'request' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTransferType('request')}
              className="flex-1"
            >
              <ArrowDownLeft size={16} className="mr-2" />
              Request
            </Button>
            <Button
              variant={transferType === 'split' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTransferType('split')}
              className="flex-1"
            >
              <Users size={16} className="mr-2" />
              Split
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Frequent Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Frequent Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {frequentContacts.map(contact => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`text-center cursor-pointer p-3 rounded-lg transition-all ${
                  selectedContact?.id === contact.id ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="text-2xl mb-1">{contact.avatar}</div>
                <div className="text-xs font-medium truncate">{contact.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transfer Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {transferType === 'send' ? <Send className="text-blue-600" size={20} /> :
             transferType === 'request' ? <ArrowDownLeft className="text-green-600" size={20} /> :
             <Users className="text-purple-600" size={20} />}
            {transferType === 'send' ? 'Send Money' : 
             transferType === 'request' ? 'Request Money' : 'Split Bill'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedContact && (
            <div>
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter name or phone number"
              />
            </div>
          )}

          {selectedContact && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl">{selectedContact.avatar}</div>
              <div>
                <div className="font-medium">{selectedContact.name}</div>
                <div className="text-sm text-gray-500">{selectedContact.phone}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedContact(null)}
                className="ml-auto"
              >
                Change
              </Button>
            </div>
          )}

          <div>
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 text-gray-400" size={16} />
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's this for?"
            />
          </div>

          <Button 
            onClick={handleTransfer} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Processing..." : 
             transferType === 'send' ? "Send Money" :
             transferType === 'request' ? "Request Money" : "Create Split"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Business Payments Component
const BusinessPayments: React.FC<{ data: MockData; service: BankingService; onSuccess: (message: string) => void; onError: (message: string) => void }> = ({ data, service, onSuccess, onError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [payCode, setPayCode] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate QR code scanning
    setTimeout(() => {
      setIsScanning(false);
      const randomBusiness = data.businesses[Math.floor(Math.random() * data.businesses.length)];
      setSelectedBusiness(randomBusiness);
      setPayCode(randomBusiness.payCode);
      onSuccess(`Scanned ${randomBusiness.name} successfully!`);
    }, 2000);
  };

  const handlePayment = async () => {
    try {
      const business = selectedBusiness || data.businesses.find(b => b.payCode === payCode);
      if (!business) {
        onError("Invalid PayCode");
        return;
      }
      
      const result = await service.businessPayment(business.id, parseFloat(amount));
      if (result.success) {
        onSuccess(result.message);
        setAmount('');
        setPayCode('');
        setSelectedBusiness(null);
      } else {
        onError(result.message);
      }
    } catch (error) {
      onError("Payment failed. Please try again.");
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      {/* QR Scanner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="text-blue-600" size={20} />
            Pay with PayCode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Button
              onClick={handleScan}
              disabled={isScanning}
              className="w-full h-20"
              variant={isScanning ? "outline" : "default"}
            >
              {isScanning ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Scanning...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Camera size={24} />
                  Scan PayCode
                </div>
              )}
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">or</div>

          <div>
            <Label htmlFor="paycode">Enter PayCode Manually</Label>
            <Input
              id="paycode"
              value={payCode}
              onChange={(e) => setPayCode(e.target.value)}
              placeholder="Enter business PayCode"
            />
          </div>
        </CardContent>
      </Card>

      {/* Selected Business */}
      {selectedBusiness && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Building2 className="text-green-600" size={20} />
              </div>
              <div className="flex-1">
                <div className="font-semibold">{selectedBusiness.name}</div>
                <div className="text-sm text-gray-600">{selectedBusiness.location}</div>
                {selectedBusiness.offers && (
                  <div className="text-sm text-green-600 font-medium">
                    🎁 {selectedBusiness.offers}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Form */}
      {(selectedBusiness || payCode) && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Amount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 text-gray-400" size={16} />
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-10"
                />
              </div>
            </div>

            <Button 
              onClick={handlePayment}
              className="w-full"
              disabled={!amount || parseFloat(amount) <= 0}
            >
              Pay Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Nearby Businesses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="text-blue-600" size={20} />
            Nearby Businesses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.businesses.map(business => (
              <div
                key={business.id}
                onClick={() => {
                  setSelectedBusiness(business);
                  setPayCode(business.payCode);
                }}
                className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="text-blue-600" size={16} />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{business.name}</div>
                  <div className="text-sm text-gray-500">{business.category} • {business.location}</div>
                  {business.offers && (
                    <div className="text-sm text-green-600">🎁 {business.offers}</div>
                  )}
                </div>
                <ChevronRight className="text-gray-400" size={16} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Digital Red Envelope (Laisee) Component
const DigitalLaisee: React.FC<{ data: MockData; service: BankingService; onSuccess: (message: string) => void; onError: (message: string) => void }> = ({ data, service, onSuccess, onError }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

  const handleSendLaisee = async () => {
    try {
      const result = await service.sendLaisee(selectedContacts, parseFloat(amount), message);
      if (result.success) {
        onSuccess(result.message);
        setAmount('');
        setMessage('');
        setSelectedContacts([]);
      } else {
        onError(result.message);
      }
    } catch (error) {
      onError("Failed to send red envelope. Please try again.");
    }
  };

  const toggleContact = (contact: Contact) => {
    setSelectedContacts(prev => 
      prev.find(c => c.id === contact.id)
        ? prev.filter(c => c.id !== contact.id)
        : [...prev, contact]
    );
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="text-white" size={20} />
            Send Digital Red Envelope
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🧧</div>
            <div className="text-lg opacity-90">Share your blessings</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div>
            <Label htmlFor="laisee-amount">Amount per envelope</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 text-gray-400" size={16} />
              <Input
                id="laisee-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="88.00"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="laisee-message">Blessing Message</Label>
            <Input
              id="laisee-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Wishing you prosperity and happiness!"
            />
          </div>

          <div>
            <Label>Select Recipients</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {data.contacts.map(contact => (
                <div
                  key={contact.id}
                  onClick={() => toggleContact(contact)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedContacts.find(c => c.id === contact.id)
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="text-lg">{contact.avatar}</div>
                    <div className="text-sm font-medium">{contact.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedContacts.length > 0 && (
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-sm font-medium text-red-800">
                Total: ${(parseFloat(amount || '0') * selectedContacts.length).toFixed(2)}
              </div>
              <div className="text-xs text-red-600">
                {selectedContacts.length} recipient(s) selected
              </div>
            </div>
          )}

          <Button 
            onClick={handleSendLaisee}
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={!amount || selectedContacts.length === 0}
          >
            Send Red Envelopes 🧧
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Transfer Component
const Transfer: React.FC<{ service: BankingService; onSuccess: (message: string) => void; onError: (message: string) => void }> = ({ service, onSuccess, onError }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>({});

  const validateForm = () => {
    const newErrors: { recipient?: string; amount?: string } = {};
    
    if (!recipient.trim()) {
      newErrors.recipient = "Recipient name is required";
    }
    
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTransfer = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const result = await service.transfer(recipient, parseFloat(amount), memo);
      if (result.success) {
        onSuccess(result.message);
        setRecipient('');
        setAmount('');
        setMemo('');
      } else {
        onError(result.message);
      }
    } catch (error) {
      onError("Transfer failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="text-blue-600" size={20} />
            Transfer Money
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="recipient" className="text-sm font-medium">Recipient Name or Account</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter recipient name or account number"
              className={errors.recipient ? "border-red-500" : ""}
              aria-describedby={errors.recipient ? "recipient-error" : undefined}
            />
            {errors.recipient && (
              <p id="recipient-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.recipient}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="amount" className="text-sm font-medium">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 text-gray-400" size={16} />
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`pl-10 ${errors.amount ? "border-red-500" : ""}`}
                aria-describedby={errors.amount ? "amount-error" : undefined}
              />
            </div>
            {errors.amount && (
              <p id="amount-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.amount}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="memo" className="text-sm font-medium">Memo (Optional)</Label>
            <Input
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="What's this for?"
            />
          </div>

          <Button 
            onClick={handleTransfer} 
            disabled={isLoading}
            className="w-full"
            aria-label={isLoading ? "Processing transfer" : "Send transfer"}
          >
            {isLoading ? "Processing..." : "Send Transfer"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Transaction History Component
const TransactionHistory: React.FC<{ data: MockData }> = ({ data }) => {
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTransactions = data.transactions.filter(transaction => {
    const matchesType = filter === 'all' || transaction.type === filter;
    const matchesDate = !dateFilter || transaction.date.includes(dateFilter);
    return matchesType && matchesDate;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="text-blue-600" size={20} />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'credit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('credit')}
            >
              Credits
            </Button>
            <Button
              variant={filter === 'debit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('debit')}
            >
              Debits
            </Button>
          </div>

          {/* Date Filter */}
          <div className="mb-4">
            <Input
              type="month"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by month"
              className="max-w-48"
            />
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {paginatedTransactions.map(transaction => (
              <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-gray-500">{transaction.date} • {transaction.category}</div>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-3 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Bill Payment Component
const BillPay: React.FC<{ data: MockData; service: BankingService; onSuccess: (message: string) => void; onError: (message: string) => void }> = ({ data, service, onSuccess, onError }) => {
  const [selectedPayee, setSelectedPayee] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ payee?: string; amount?: string; date?: string }>({});

  const validateForm = () => {
    const newErrors: { payee?: string; amount?: string; date?: string } = {};
    
    if (!selectedPayee) {
      newErrors.payee = "Please select a payee";
    }
    
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    
    if (!dueDate) {
      newErrors.date = "Please select a due date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const result = await service.payBill(parseInt(selectedPayee), parseFloat(amount), dueDate);
      if (result.success) {
        onSuccess(result.message);
        setSelectedPayee('');
        setAmount('');
        setDueDate('');
      } else {
        onError(result.message);
      }
    } catch (error) {
      onError("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="text-blue-600" size={20} />
            Pay Bills
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="payee" className="text-sm font-medium">Select Payee</Label>
            <select
              id="payee"
              value={selectedPayee}
              onChange={(e) => setSelectedPayee(e.target.value)}
              className={`w-full p-2 border rounded-md ${errors.payee ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              aria-describedby={errors.payee ? "payee-error" : undefined}
            >
              <option value="">Choose a payee...</option>
              {data.payees.map(payee => (
                <option key={payee.id} value={payee.id.toString()}>
                  {payee.name} ({payee.accountNumber})
                </option>
              ))}
            </select>
            {errors.payee && (
              <p id="payee-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.payee}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="amount" className="text-sm font-medium">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 text-gray-400" size={16} />
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`pl-10 ${errors.amount ? "border-red-500" : ""}`}
                aria-describedby={errors.amount ? "amount-error" : undefined}
              />
            </div>
            {errors.amount && (
              <p id="amount-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.amount}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="due-date" className="text-sm font-medium">Due Date</Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={errors.date ? "border-red-500" : ""}
              aria-describedby={errors.date ? "date-error" : undefined}
            />
            {errors.date && (
              <p id="date-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.date}
              </p>
            )}
          </div>

          <Button 
            onClick={handlePayment} 
            disabled={isLoading}
            className="w-full"
            aria-label={isLoading ? "Processing payment" : "Schedule payment"}
          >
            {isLoading ? "Processing..." : "Schedule Payment"}
          </Button>
        </CardContent>
      </Card>

      {/* Saved Payees */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Payees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.payees.map(payee => (
              <div key={payee.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{payee.name}</div>
                  <div className="text-sm text-gray-500">Account: {payee.accountNumber}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPayee(payee.id.toString())}
                >
                  Select
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Settings Component
const AppSettings: React.FC<{ data: MockData; service: BankingService; onUpdate: () => void }> = ({ data, service, onUpdate }) => {
  const handleSettingChange = async (key: keyof AppSettings, value: any) => {
    await service.updateSettings({ [key]: value });
    onUpdate();
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="text-blue-600" size={20} />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Appearance */}
          <div>
            <h3 className="font-semibold mb-3">Appearance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {data.settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
                  <div>
                    <div className="font-medium">Dark Mode</div>
                    <div className="text-sm text-gray-500">Toggle dark theme</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSettingChange('darkMode', !data.settings.darkMode)}
                  aria-label={`${data.settings.darkMode ? 'Disable' : 'Enable'} dark mode`}
                >
                  {data.settings.darkMode ? 'On' : 'Off'}
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Type size={20} />
                  <div>
                    <div className="font-medium">Font Size</div>
                    <div className="text-sm text-gray-500">Adjust text size</div>
                  </div>
                </div>
                <select
                  value={data.settings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                  className="p-2 border rounded-md"
                  aria-label="Font size"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div>
            <h3 className="font-semibold mb-3">Privacy & Security</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Fingerprint size={20} />
                  <div>
                    <div className="font-medium">Biometric Login</div>
                    <div className="text-sm text-gray-500">Use fingerprint or face ID</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSettingChange('biometricLogin', !data.settings.biometricLogin)}
                  aria-label={`${data.settings.biometricLogin ? 'Disable' : 'Enable'} biometric login`}
                >
                  {data.settings.biometricLogin ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="font-semibold mb-3">Notifications</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Bell size={20} />
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-gray-500">Transaction alerts</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSettingChange('notifications', !data.settings.notifications)}
                  aria-label={`${data.settings.notifications ? 'Disable' : 'Enable'} notifications`}
                >
                  {data.settings.notifications ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          </div>

          {/* Dashboard Customization */}
          <div>
            <h3 className="font-semibold mb-3">Dashboard</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Show Recent Transactions</div>
                  <div className="text-sm text-gray-500">Display on dashboard</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSettingChange('showRecentTransactions', !data.settings.showRecentTransactions)}
                >
                  {data.settings.showRecentTransactions ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Account Management Component
const AccountManagement: React.FC<{ data: MockData; service: BankingService; onSuccess: (message: string) => void; onError: (message: string) => void }> = ({ data, service, onSuccess, onError }) => {
  const [email, setEmail] = useState(data.user.email);
  const [phone, setPhone] = useState(data.user.phone);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const result = await service.updateUser({ email, phone });
      if (result.success) {
        onSuccess(result.message);
      } else {
        onError("Update failed. Please try again.");
      }
    } catch (error) {
      onError("Update failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="text-blue-600" size={20} />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-500">Account Type</Label>
              <div className="font-medium">{data.user.accountType}</div>
            </div>
            <div>
              <Label className="text-sm text-gray-500">Account Number</Label>
              <div className="font-medium">{data.user.accountNumber}</div>
            </div>
          </div>
          
          <div>
            <Label className="text-sm text-gray-500">Full Name</Label>
            <div className="font-medium">{data.user.name}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>

          <Button 
            onClick={handleUpdate} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Updating..." : "Update Information"}
          </Button>
        </CardContent>
      </Card>

      {/* Account Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.accounts.map(account => (
              <div key={account.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{account.type}</div>
                  <div className="text-sm text-gray-500">{account.number}</div>
                </div>
                <div className="text-lg font-semibold">
                  ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// More Menu Component
const MoreMenu: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const menuItems = [
    { key: 'settings', label: 'Settings', icon: Settings, description: 'App preferences and security' },
    { key: 'account', label: 'Account Management', icon: User, description: 'View and edit account details' },
  ];

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      <Card>
        <CardHeader>
          <CardTitle>More Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {menuItems.map(item => (
              <Button
                key={item.key}
                variant="ghost"
                className="w-full justify-start h-auto p-4"
                onClick={() => onNavigate(item.key)}
              >
                <div className="flex items-center gap-3 w-full">
                  <item.icon className="text-blue-600" size={20} />
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                  <ChevronRight className="ml-auto text-gray-400" size={16} />
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Banking App Component
const BankingApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [data, setData] = useState<MockData>(initialMockData);
  const [isLoading, setIsLoading] = useState(true);
  const serviceRef = useRef(new BankingService());
  const { toast } = useToast();

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedData = await serviceRef.current.getData();
        setData(loadedData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load account data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [toast]);

  // Apply theme changes
  useEffect(() => {
    if (data.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply font size
    const root = document.documentElement;
    root.style.fontSize = data.settings.fontSize === 'large' ? '18px' : 
                         data.settings.fontSize === 'small' ? '14px' : '16px';
  }, [data.settings]);

  const refreshData = async () => {
    const newData = await serviceRef.current.getData();
    setData(newData);
  };

  const showSuccess = (message: string) => {
    toast({
      title: "Success",
      description: message,
    });
  };

  const showError = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive"
    });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard data={data} service={serviceRef.current} onRefresh={() => setCurrentPage('history')} />;
      case 'p2p':
        return <P2PTransfer data={data} service={serviceRef.current} onSuccess={showSuccess} onError={showError} />;
      case 'business':
        return <BusinessPayments data={data} service={serviceRef.current} onSuccess={showSuccess} onError={showError} />;
      case 'laisee':
        return <DigitalLaisee data={data} service={serviceRef.current} onSuccess={showSuccess} onError={showError} />;
      case 'transfer':
        return <Transfer service={serviceRef.current} onSuccess={showSuccess} onError={showError} />;
      case 'history':
        return <TransactionHistory data={data} />;
      case 'bills':
        return <BillPay data={data} service={serviceRef.current} onSuccess={showSuccess} onError={showError} />;
      case 'more':
        return <MoreMenu onNavigate={setCurrentPage} />;
      case 'settings':
        return <AppSettings data={data} service={serviceRef.current} onUpdate={refreshData} />;
      case 'account':
        return <AccountManagement data={data} service={serviceRef.current} onSuccess={showSuccess} onError={showError} />;
      default:
        return <Dashboard data={data} service={serviceRef.current} onRefresh={() => setCurrentPage('history')} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading SwiftBank...</div>
        </div>
      </div>
    );
  }

  // Enhanced navigation with P2P and business features
  const navigation = [
    { key: 'dashboard', label: 'Home', icon: Home },
    { key: 'p2p', label: 'P2P', icon: Send },
    { key: 'business', label: 'Pay', icon: QrCode },
    { key: 'laisee', label: 'Laisee', icon: Gift },
    { key: 'more', label: 'More', icon: Settings },
  ];

  return (
    <div className={`min-h-screen ${data.settings.darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Smartphone className="text-white" size={16} />
            </div>
            <h1 className="text-xl font-bold">PayMe</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
              <Bell size={16} />
            </Button>
            <div className="text-sm opacity-90">
              Hi, {data.user.name.split(' ')[0]}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20 min-h-screen">
        {renderPage()}
      </main>

      {/* Enhanced Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg backdrop-blur-lg bg-white/95" 
           role="navigation" aria-label="Main navigation">
        <div className="max-w-md mx-auto flex">
          {navigation.map((item) => (
            <button
              key={item.key}
              onClick={() => setCurrentPage(item.key)}
              className={`flex-1 p-3 text-center transition-all duration-200 ${
                currentPage === item.key || 
                (currentPage === 'settings' && item.key === 'more') || 
                (currentPage === 'account' && item.key === 'more')
                  ? 'text-blue-600 bg-blue-50 transform scale-105' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
              aria-label={`Navigate to ${item.label}`}
              style={{ minHeight: '60px', minWidth: '44px' }}
            >
              <item.icon className="mx-auto mb-1" size={20} />
              <div className="text-xs font-medium">{item.label}</div>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

// Main App Entry Point
const Index = () => {
  return <BankingApp />;
};

export default Index;
