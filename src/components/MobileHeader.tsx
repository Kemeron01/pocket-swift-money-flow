
import React from 'react';
import { Smartphone, Award, Bell, Settings } from 'lucide-react';
import { Notification } from '../types';

interface MobileHeaderProps {
  totalAchievementPoints: number;
  notifications: Notification[];
  setCurrentView: (view: string) => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  totalAchievementPoints, 
  notifications, 
  setCurrentView 
}) => (
  <div className="bg-white shadow-sm border-b px-4 py-3 sticky top-0 z-50">
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
          {totalAchievementPoints > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {Math.floor(totalAchievementPoints / 100)}
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
);

export default MobileHeader;
