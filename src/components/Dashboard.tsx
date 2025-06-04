
import React from 'react';
import { 
  Plus, 
  Send, 
  QrCode, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Users, 
  Gift,
  Award,
  Eye,
  EyeOff
} from 'lucide-react';
import { MockDataType } from '../types';

interface DashboardProps {
  mockData: MockDataType;
  balanceVisible: boolean;
  setBalanceVisible: (visible: boolean) => void;
  setCurrentView: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  mockData, 
  balanceVisible, 
  setBalanceVisible, 
  setCurrentView 
}) => (
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
          className="flex-1 bg-white/20 rounded-lg p-3 text-center hover:bg-white/30 transition-colors"
        >
          <Plus className="w-5 h-5 mx-auto mb-1" />
          <span className="text-sm">Top Up</span>
        </button>
        <button 
          onClick={() => setCurrentView('send')}
          className="flex-1 bg-white/20 rounded-lg p-3 text-center hover:bg-white/30 transition-colors"
        >
          <Send className="w-5 h-5 mx-auto mb-1" />
          <span className="text-sm">Send</span>
        </button>
        <button 
          onClick={() => setCurrentView('scan')}
          className="flex-1 bg-white/20 rounded-lg p-3 text-center hover:bg-white/30 transition-colors"
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
          className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-all text-center"
        >
          <Send className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <span className="text-xs text-gray-600">Send Money</span>
        </button>
        <button 
          onClick={() => setCurrentView('request')}
          className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-all text-center"
        >
          <ArrowDownLeft className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <span className="text-xs text-gray-600">Request</span>
        </button>
        <button 
          onClick={() => setCurrentView('split')}
          className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-all text-center"
        >
          <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <span className="text-xs text-gray-600">Split Bill</span>
        </button>
        <button 
          onClick={() => setCurrentView('red-envelope')}
          className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-all text-center"
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
            className="bg-white/20 rounded-lg p-2 hover:bg-white/30 transition-colors"
          >
            <Award className="w-6 h-6" />
          </button>
        </div>
        <button 
          onClick={() => setCurrentView('achievements')}
          className="w-full mt-3 bg-white/20 rounded-lg p-2 text-center hover:bg-white/30 transition-colors"
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

export default Dashboard;
