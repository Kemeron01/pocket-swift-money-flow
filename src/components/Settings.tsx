
import React from 'react';
import { ArrowLeft, Shield, Bell, Eye, CreditCard, HelpCircle, LogOut } from 'lucide-react';
import { MockDataType } from '../types';

interface SettingsProps {
  mockData: MockDataType;
  setMockData: (data: MockDataType) => void;
  setCurrentView: (view: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ mockData, setMockData, setCurrentView }) => {
  const toggleAutoTopUp = () => {
    setMockData({
      ...mockData,
      autoTopUp: !mockData.autoTopUp
    });
  };

  const toggleProfileVisibility = () => {
    setMockData({
      ...mockData,
      privacySettings: {
        ...mockData.privacySettings,
        profileVisible: !mockData.privacySettings.profileVisible
      }
    });
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
        <h1 className="text-xl font-bold ml-3">Settings</h1>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Account & Security</h3>
          </div>
          
          <div className="p-4 space-y-4">
            <button className="w-full flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <span>Security Settings</span>
              </div>
              <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
            </button>
            
            <button className="w-full flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span>Payment Methods</span>
              </div>
              <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Preferences</h3>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <span>Notifications</span>
              </div>
              <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform"></div>
              </button>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-gray-600" />
                <span>Profile Visible</span>
              </div>
              <button 
                onClick={toggleProfileVisibility}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  mockData.privacySettings.profileVisible ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  mockData.privacySettings.profileVisible ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span>Auto Top-up</span>
              </div>
              <button 
                onClick={toggleAutoTopUp}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  mockData.autoTopUp ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  mockData.autoTopUp ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Support</h3>
          </div>
          
          <div className="p-4 space-y-4">
            <button className="w-full flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <span>Help Center</span>
              </div>
              <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
            </button>
            
            <button className="w-full flex items-center justify-between py-3 text-red-600">
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
