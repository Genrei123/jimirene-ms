import React, { useState } from "react";

interface Patient {
  clientID: number;
  lastName: string;
  givenName: string;
  middleInitial: string | null;
  address: string;
  age: number;
  birthday: string;
  religion: string;
  occupation: string;
  lastDelivery: string | null;
  philhealthID: string;
}

const SearchPatientModal: React.FC<{ onClose: () => void; onSelect: (patient: Patient | null) => void }> = ({
  onClose,
  onSelect,
}) => {
  const [lastName, setLastName] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPatients = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate fetching data
      const mockPatients = [
        { clientID: 1, lastName: "Smith", givenName: "John", middleInitial: "A", address: "123 Elm St", age: 30, birthday: "1993-01-01", religion: "Christianity", occupation: "Teacher", lastDelivery: null, philhealthID: "PH12345" },
        { clientID: 2, lastName: "Smith", givenName: "Jane", middleInitial: null, address: "456 Oak St", age: 28, birthday: "1995-02-01", religion: "Christianity", occupation: "Nurse", lastDelivery: "2023-06-01", philhealthID: "PH67890" },
      ];
      setPatients(mockPatients.filter((p) => p.lastName.toLowerCase().includes(lastName.toLowerCase())));
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Search Patient</h2>
        <input
          type="text"
          className="w-full border p-2 rounded mb-4"
          placeholder="Enter Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={fetchPatients}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
        <div className="mt-4">
          {patients.map((patient) => (
            <div key={patient.clientID} className="p-2 border-b flex justify-between items-center">
              <span>
                {patient.givenName} {patient.middleInitial ? `${patient.middleInitial}. ` : ""}{patient.lastName}
              </span>
              <button
                className="bg-green-500 text-white px-2 py-1 rounded"
                onClick={() => onSelect(patient)}
              >
                Select
              </button>
            </div>
          ))}
          {patients.length === 0 && !loading && (
            <p className="text-gray-500">No patients found. <button onClick={() => onSelect(null)} className="text-blue-500 underline">Create Now</button></p>
          )}
        </div>
        <button className="text-red-500 underline mt-4" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SearchPatientModal;
