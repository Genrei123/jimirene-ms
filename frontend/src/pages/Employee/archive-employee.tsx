import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface ArchiveEmployeeProps {
  employeeId: string;
  employeeName: string;
}

function ArchiveEmployee({ employeeId, employeeName }: ArchiveEmployeeProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleArchive = async () => {
    try {
      // Here you would implement the actual archive logic
      // For example, making an API call to update the employee status
      console.log(`Archiving employee ${employeeId}`);
      
      // Close the confirmation dialog
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error archiving employee:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmation(true)}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center"
      >
        <Trash2 className="w-5 h-5 mr-2" />
        Archive Employee
      </button>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Archive</h2>
            <p className="mb-6">Are you sure you want to archive {employeeName}?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors duration-200"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                onClick={handleArchive}
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ArchiveEmployee;