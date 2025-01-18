// src/components/QRCodeModal.tsx

import React from "react";

interface QRCodeModalProps {
  isOpen: boolean;
  qrCode: string | null;
  onClose: () => void;
}



const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, qrCode, onClose }) => {
  if (!isOpen) return null;

  const downloadQrCode = () => {
    if (!qrCode) return;

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `patient_qr_code.png`; // You can customize the filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Patient QR Code</h2>
        {qrCode ? (
          <div className="flex flex-col items-center">
            <img src={qrCode} alt="Patient QR Code" className="w-48 h-48 mb-4" />
            <button
              onClick={downloadQrCode}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Download QR Code
            </button>
          </div>
        ) : (
          <p className="text-gray-600">Generating QR Code...</p>
        )}
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default QRCodeModal;
