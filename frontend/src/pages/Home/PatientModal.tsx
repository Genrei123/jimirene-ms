import React, { useState } from "react";
import Patient from "../../types/Patient";

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogVisit: (patient: Patient, purpose: string) => void;
}

const PatientModal: React.FC<PatientModalProps> = ({ isOpen, onClose, onLogVisit }) => {
  const [step, setStep] = useState(1);
  const [lastName, setLastName] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({});
  const [purpose, setPurpose] = useState("");

  const handleSearch = () => {
    // Mock fetch for patients by last name
  };

  const handleCreatePatient = () => {
    console.log("Creating new patient:", newPatient);
    onClose();
  };

  const handleLogVisit = () => {
    if (selectedPatient && purpose) {
      console.log("Logging visit for:", selectedPatient, "Purpose:", purpose);
      onLogVisit(selectedPatient, purpose);
      onClose();
    }
  };

  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Search for Patient</h2>
            <input
              type="text"
              placeholder="Enter Last Name"
              className="border p-2 w-full mb-4"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSearch}>
              Search
            </button>
            {patients.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mt-4">Search Results</h3>
                {patients.map((patient) => (
                  <div key={patient.patientID} className="border p-2 mb-2 flex justify-between items-center">
                    <span>
                      {patient.givenName} {patient.lastName} ({patient.age} years old)
                    </span>
                    <button className="text-blue-500" onClick={() => setSelectedPatient(patient)}>
                      Select
                    </button>
                  </div>
                ))}
              </div>
            )}
            {patients.length === 0 && (
              <button className="bg-green-500 text-white px-4 py-2 rounded mt-4" onClick={() => setStep(2)}>
                Create Now
              </button>
            )}
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Create Patient Profile</h2>
            <input
              type="text"
              placeholder="Last Name"
              className="border p-2 w-full mb-2"
              onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
            />
            {/* Add other fields similarly */}
            <button className="bg-green-500 text-white px-4 py-2 rounded mt-4" onClick={handleCreatePatient}>
              Save
            </button>
          </div>
        )}
        {selectedPatient && step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Log Visit</h2>
            <p>Selected Patient: {selectedPatient.givenName} {selectedPatient.lastName}</p>
            <input
              type="text"
              placeholder="Enter Purpose"
              className="border p-2 w-full mb-4"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleLogVisit}>
              Log Visit
            </button>
          </div>
        )}
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default PatientModal;