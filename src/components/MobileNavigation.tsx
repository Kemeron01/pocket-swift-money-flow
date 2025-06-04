
import React from 'react';
import { Home, Send, QrCode, Building, Clock } from 'lucide-react';

interface MobileNavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentView, setCurrentView }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg safe-area-bottom">
    <div className="flex items-center justify-around py-2">
      <button 
        onClick={() => setCurrentView('dashboard')}
        className={`flex flex-col items-center py-2 px-4 transition-colors ${
          currentView === 'dashboard' ? 'text-blue-600' : 'text-gray-600'
        }`}
      >
        <Home className="w-6 h-6" />
        <span className="text-xs mt-1">Home</span>
      </button>
      
      <button 
        onClick={() => setCurrentView('send')}
        className={`flex flex-col items-center py-2 px-4 transition-colors ${
          ['send', 'request', 'split'].includes(currentView) ? 'text-blue-600' : 'text-gray-600'
        }`}
      >
        <Send className="w-6 h-6" />
        <span className="text-xs mt-1">Transfer</span>
      </button>
      
      <button 
        onClick={() => setCurrentView('scan')}
        className={`flex flex-col items-center py-2 px-4 transition-colors ${
          currentView === 'scan' ? 'text-blue-600' : 'text-gray-600'
        }`}
      >
        <QrCode className="w-6 h-6" />
        <span className="text-xs mt-1">Scan</span>
      </button>
      
      <button 
        onClick={() => setCurrentView('paycode')}
        className={`flex flex-col items-center py-2 px-4 transition-colors ${
          currentView === 'paycode' ? 'text-blue-600' : 'text-gray-600'
        }`}
      >
        <Building className="w-6 h-6" />
        <span className="text-xs mt-1">Business</span>
      </button>
      
      <button 
        onClick={() => setCurrentView('history')}
        className={`flex flex-col items-center py-2 px-4 transition-colors ${
          currentView === 'history' ? 'text-blue-600' : 'text-gray-600'
        }`}
      >
        <Clock className="w-6 h-6" />
        <span className="text-xs mt-1">History</span>
      </button>
    </div>
  </div>
);

export default MobileNavigation;
