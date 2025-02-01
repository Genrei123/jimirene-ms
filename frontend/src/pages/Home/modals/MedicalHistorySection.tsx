import React from 'react';

interface MedicalHistory {
  smoking: boolean;
  drug_intake: boolean;
  bleeding_anemia: boolean;
  previous_C_section: boolean;
  consecutive_miscarriages: boolean; // Updated to match backend JSON
  diabetes_congenital_anomalies: boolean;
  post_partum_hemorrhage: boolean;
  forcep_delivery: boolean;
  hypertension: boolean;
  allergies: string;
}

interface MedicalHistoryFormData {
  medicalHistory: MedicalHistory;
}

interface MedicalHistorySectionProps {
  formData: MedicalHistoryFormData;
  setFormData: React.Dispatch<React.SetStateAction<MedicalHistoryFormData>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({
  formData,
  setFormData,
  handleInputChange,
}) => {
  const medicalHistoryFields = [
    { label: 'Smoking', name: 'smoking' },
    { label: 'Drug Intake', name: 'drug_intake' },
    { label: 'Bleeding Anemia', name: 'bleeding_anemia' },
    { label: 'Previous C Section', name: 'previous_C_section' },
    { label: 'Consecutive Miscarriages', name: 'consecutive_miscarriages' }, // Updated to match backend JSON
    { label: 'Diabetes Congenital Anomalies', name: 'diabetes_congenital_anomalies' },
    { label: 'Post Partum Hemorrhage', name: 'post_partum_hemorrhage' },
    { label: 'Forcep Delivery', name: 'forcep_delivery' },
    { label: 'Hypertension', name: 'hypertension' },
  ] as const;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [name]: checked,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {medicalHistoryFields.map(({ label, name }) => (
          <div key={name} className="flex items-center space-x-2">
            <input
              id={name}
              name={name}
              type="checkbox"
              checked={formData.medicalHistory[name]}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={name} className="text-sm font-medium text-gray-700">
              {label}
            </label>
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
          Allergies (Specify)
        </label>
        <input
          id="allergies"
          name="medicalHistory.allergies"
          type="text"
          value={formData.medicalHistory.allergies}
          onChange={handleInputChange}
          className="w-full border rounded-lg p-2"
          placeholder="Write allergies here"
        />
      </div>
    </div>
  );
};

export default MedicalHistorySection;