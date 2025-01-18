import React, { useState } from "react";
import Modal from "react-modal";
import QrScanner from "react-qr-scanner";
import { useNavigate } from "react-router-dom";

interface QRCodeScannerModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onScan: (data: any) => void;
}

const QRCodeScannerModal: React.FC<QRCodeScannerModalProps> = ({
  isOpen,
  onRequestClose,
}) => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleScan = (data: any) => {
    if (data) {
      console.log("QR Code Data:", data.text);
      navigate(`/patient/${data.text}`);
      onRequestClose();
    }
  };

  const handleError = (err: any) => {
    console.error("QR Code Scan Error:", err);
    if (err.name === "NotAllowedError") {
      setErrorMsg("Camera access was denied. Please allow camera access and try again.");
    } else if (err.name === "NotFoundError") {
      setErrorMsg("No camera found. Please connect a camera and try again.");
    } else {
      setErrorMsg("An unexpected error occurred while scanning the QR code.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Scan QR Code"
      ariaHideApp={false} // Set to true in production and set app element for accessibility
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "500px",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
        },
      }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Scan QR Code</h2>
      {errorMsg && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {errorMsg}
        </div>
      )}
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
      />
      <button
        onClick={onRequestClose}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Cancel
      </button>
    </Modal>
  );
};

export default QRCodeScannerModal;
