
import React, { useState } from 'react';
import { ArrowLeft, Send, User, DollarSign } from 'lucide-react';
import { Friend } from '../types';

interface SendMoneyProps {
  friends: Friend[];
  onSendMoney: (recipient: string, amount: number, message?: string) => void;
  setCurrentView: (view: string) => void;
}

const SendMoney: React.FC<SendMoneyProps> = ({ friends, onSendMoney, setCurrentView }) => {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [customRecipient, setCustomRecipient] = useState('');

  const handleSend = () => {
    const recipient = selectedFriend ? selectedFriend.name : customRecipient;
    const sendAmount = parseFloat(amount);
    
    if (!recipient || !sendAmount || sendAmount <= 0) {
      return;
    }
    
    onSendMoney(recipient, sendAmount, message);
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
        <h1 className="text-xl font-bold ml-3">Send Money</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Quick Send to Friends</h3>
          <div className="grid grid-cols-2 gap-3">
            {friends.map(friend => (
              <button
                key={friend.id}
                onClick={() => {
                  setSelectedFriend(friend);
                  setCustomRecipient('');
                }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedFriend?.id === friend.id 
                    ? 'border-blue-500 bg-blue-50' 
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
          <h3 className="font-semibold mb-3">Send to Someone Else</h3>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Enter name or phone number"
              value={customRecipient}
              onChange={(e) => {
                setCustomRecipient(e.target.value);
                setSelectedFriend(null);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
            />
          </div>
          
          <div className="flex gap-2 mt-3">
            {[10, 25, 50, 100].map(preset => (
              <button
                key={preset}
                onClick={() => setAmount(preset.toString())}
                className="flex-1 py-2 px-3 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                ${preset}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Message (Optional)</h3>
          <textarea
            placeholder="Add a note..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={(!selectedFriend && !customRecipient) || !amount || parseFloat(amount) <= 0}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          <Send className="w-5 h-5" />
          <span>Send Money</span>
        </button>
      </div>
    </div>
  );
};

export default SendMoney;
