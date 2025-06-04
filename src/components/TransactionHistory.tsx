
import React, { useState } from 'react';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Filter, Search } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
  setCurrentView: (view: string) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, setCurrentView }) => {
  const [filter, setFilter] = useState<'all' | 'send' | 'receive'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = searchTerm === '' || 
      (transaction.from && transaction.from.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.to && transaction.to.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold ml-3">Transaction History</h1>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'send', label: 'Sent' },
              { key: 'receive', label: 'Received' }
            ].map(option => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === option.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredTransactions.map(transaction => (
            <div key={transaction.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'receive' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'receive' ? 
                      <ArrowDownLeft className="w-5 h-5 text-green-600" /> : 
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.type === 'receive' ? transaction.from : transaction.to}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.method}</p>
                    <p className="text-xs text-gray-400">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'receive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'receive' ? '+' : '-'}${transaction.amount}
                  </p>
                  {transaction.message && (
                    <p className="text-xs text-gray-400 mt-1">{transaction.message}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
