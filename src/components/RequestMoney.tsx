
import React, { useState } from 'react';
import { ArrowLeft, ArrowDownLeft, User, DollarSign } from 'lucide-react';
import { Friend } from '../types';

interface RequestMoneyProps {
  friends: Friend[];
  setCurrentView: (view: string) => void;
}

const RequestMoney: React.FC<RequestMoneyProps> = ({ friends, setCurrentView }) => {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleRequest = () => {
    if (!selectedFriend || !amount || parseFloat(amount) <= 0) {
      return;
    }
    
    // Simulate request sent
    alert(`Request sent to ${selectedFriend.name} for $${amount}`);
    setCurrentView('dashboard');
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold ml-3">Request Money</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Request from Friend</h3>
          <div className="grid grid-cols-2 gap-3">
            {friends.map(friend => (
              <button
                key={friend.id}
                onClick={() => setSelectedFriend(friend)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedFriend?.id === friend.id 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{friend.avatar}</div>
                <div className="text-sm font-medium">{friend.name}</div>
                <div className={`text-xs ${friend.status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                  {friend.status}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Amount</h3>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-semibold"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Reason (Optional)</h3>
          <textarea
            placeholder="What's this for?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        <button
          onClick={handleRequest}
          disabled={!selectedFriend || !amount || parseFloat(amount) <= 0}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
        >
          <ArrowDownLeft className="w-5 h-5" />
          <span>Send Request</span>
        </button>
      </div>
    </div>
  );
};

export default RequestMoney;
