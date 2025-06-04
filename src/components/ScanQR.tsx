
import React, { useState } from 'react';
import { ArrowLeft, QrCode, Camera, Upload } from 'lucide-react';

interface ScanQRProps {
  setCurrentView: (view: string) => void;
}

const ScanQR: React.FC<ScanQRProps> = ({ setCurrentView }) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate QR scanning
    setTimeout(() => {
      setIsScanning(false);
      alert('QR Code scanned successfully!');
      setCurrentView('dashboard');
    }, 2000);
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
        <h1 className="text-xl font-bold ml-3">Scan QR Code</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
          <div className="w-64 h-64 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
            {isScanning ? (
              <div className="absolute inset-0 bg-blue-600 opacity-20 animate-pulse"></div>
            ) : null}
            <QrCode className="w-32 h-32 text-gray-400" />
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-1 bg-red-500 animate-bounce"></div>
              </div>
            )}
          </div>
          
          <p className="text-gray-600 mb-4">
            {isScanning ? 'Scanning...' : 'Position QR code within the frame'}
          </p>
          
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            <Camera className="w-5 h-5" />
            <span>{isScanning ? 'Scanning...' : 'Start Scanning'}</span>
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Upload QR Image</h3>
          <button className="w-full border-2 border-dashed border-gray-300 rounded-lg py-8 px-4 text-center hover:border-gray-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Tap to upload QR code image</p>
          </button>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">What can you scan?</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Payment QR codes</li>
            <li>• Friend contact codes</li>
            <li>• Business payment codes</li>
            <li>• Transfer request codes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScanQR;
