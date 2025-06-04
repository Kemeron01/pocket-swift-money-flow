
import React, { useState } from 'react';
import { ArrowLeft, Users, DollarSign, Plus, Minus } from 'lucide-react';
import { Friend } from '../types';

interface SplitBillProps {
  friends: Friend[];
  setCurrentView: (view: string) => void;
}

const SplitBill: React.FC<SplitBillProps> = ({ friends, setCurrentView }) => {
  const [totalAmount, setTotalAmount] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const [description, setDescription] = useState('');

  const toggleFriend = (friend: Friend) => {
    setSelectedFriends(prev => 
      prev.find(f => f.id === friend.id)
        ? prev.filter(f => f.id !== friend.id)
        : [...prev, friend]
    );
  };

  const splitAmount = totalAmount && selectedFriends.length > 0 
    ? (parseFloat(totalAmount) / (selectedFriends.length + 1)).toFixed(2)
    : '0.00';

  const handleSplit = () => {
    if (!totalAmount || selectedFriends.length === 0) return;
    
    alert(`Bill split: $${splitAmount} each among ${selectedFriends.length + 1} people`);
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
        <h1 className="text-xl font-bold ml-3">Split Bill</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Total Amount</h3>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              placeholder="0.00"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Description</h3>
          <input
            type="text"
            placeholder="e.g., Dinner at restaurant"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Split with Friends</h3>
          <div className="space-y-3">
            {friends.map(friend => (
              <button
                key={friend.id}
                onClick={() => toggleFriend(friend)}
                className={`w-full p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                  selectedFriends.find(f => f.id === friend.id)
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-xl">{friend.avatar}</div>
                  <div className="text-left">
                    <div className="font-medium">{friend.name}</div>
                    <div className={`text-xs ${friend.status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                      {friend.status}
                    </div>
                  </div>
                </div>
                {selectedFriends.find(f => f.id === friend.id) ? (
                  <Minus className="w-5 h-5 text-purple-600" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {selectedFriends.length > 0 && totalAmount && (
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-2">Split Summary</h3>
            <p className="text-purple-700">
              Total: ${totalAmount} ÷ {selectedFriends.length + 1} people
            </p>
            <p className="text-lg font-bold text-purple-800">
              ${splitAmount} per person
            </p>
          </div>
        )}

        <button
          onClick={handleSplit}
          disabled={!totalAmount || selectedFriends.length === 0}
          className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
        >
          <Users className="w-5 h-5" />
          <span>Split Bill</span>
        </button>
      </div>
    </div>
  );
};

export default SplitBill;
