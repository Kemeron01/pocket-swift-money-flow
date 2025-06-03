
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
  Minus
} from 'lucide-react';

// Mock data and types
interface Transaction {
  id: number;
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  category: string;
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
}

interface MockData {
  user: UserData;
  accounts: Account[];
  transactions: Transaction[];
  payees: Payee[];
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
    { id: 4, date: "2024-05-31", type: "debit", amount: 45.67, description: "Gas Station", category: "Transportation" },
    { id: 5, date: "2024-05-30", type: "credit", amount: 150.00, description: "Cashback Reward", category: "Income" },
    { id: 6, date: "2024-05-29", type: "debit", amount: 234.56, description: "Online Shopping", category: "Shopping" },
    { id: 7, date: "2024-05-28", type: "debit", amount: 67.89, description: "Restaurant", category: "Food" }
  ],
  payees: [
    { id: 1, name: "Electric Company", accountNumber: "12345" },
    { id: 2, name: "Water Department", accountNumber: "67890" },
    { id: 3, name: "Internet Provider", accountNumber: "54321" }
  ],
  settings: {
    darkMode: false,
    fontSize: 'medium',
    notifications: true,
    biometricLogin: false,
    showBalance: true,
    showRecentTransactions: true
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
  const [showBalance, setShowBalance] = useState(true);
  const totalBalance = data.accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const spendingData = service.getSpendingByCategory();
  const recentTransactions = data.transactions.slice(0, 5);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      {/* Account Balance Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Total Balance</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="text-white hover:bg-white/20"
              aria-label={showBalance ? "Hide balance" : "Show balance"}
            >
              {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
          </div>
          <div className="text-3xl font-bold">
            {showBalance ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
          </div>
          <div className="flex gap-4 mt-4">
            {data.accounts.map(account => (
              <div key={account.id} className="bg-white/20 rounded-lg p-3 flex-1">
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

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Send className="mx-auto mb-2 text-blue-600" size={24} />
            <div className="font-medium">Transfer</div>
            <div className="text-sm text-gray-600">Send money</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <CreditCard className="mx-auto mb-2 text-blue-600" size={24} />
            <div className="font-medium">Pay Bills</div>
            <div className="text-sm text-gray-600">Manage payments</div>
          </CardContent>
        </Card>
      </div>

      {/* Spending Summary */}
      {Object.keys(spendingData).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} />
              Monthly Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(spendingData).slice(0, 4).map(([category, amount]) => (
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

  // Navigation items following Hick's Law (max 5 options)
  const navigation = [
    { key: 'dashboard', label: 'Home', icon: Home },
    { key: 'transfer', label: 'Transfer', icon: Send },
    { key: 'history', label: 'History', icon: History },
    { key: 'bills', label: 'Bills', icon: CreditCard },
    { key: 'more', label: 'More', icon: Settings },
  ];

  return (
    <div className={`min-h-screen ${data.settings.darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">SwiftBank</h1>
          <div className="text-sm opacity-90">
            Welcome, {data.user.name.split(' ')[0]}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20 min-h-screen">
        {renderPage()}
      </main>

      {/* Bottom Navigation - Following Fitts's Law with large touch targets */}
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-10" 
        role="navigation" 
        aria-label="Main navigation"
      >
        <div className="max-w-md mx-auto flex">
          {navigation.map((item) => (
            <button
              key={item.key}
              onClick={() => setCurrentPage(item.key)}
              className={`flex-1 p-3 text-center transition-colors duration-200 ${
                currentPage === item.key || 
                (currentPage === 'settings' && item.key === 'more') || 
                (currentPage === 'account' && item.key === 'more')
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
              aria-label={`Navigate to ${item.label}`}
              style={{ minHeight: '60px', minWidth: '44px' }} // Fitts's Law compliance
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
