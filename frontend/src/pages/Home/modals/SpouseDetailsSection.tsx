import React from "react";

interface SpouseDetails {
  spouse_name: string;
  spouse_birthday: string;
  spouse_religion: string;
  spouse_occupation: string;
  spouse_contact_number: string;
  spouse_age: number;
}

interface SpouseFormData {
  spouse: SpouseDetails;
}

interface SpouseDetailsSectionProps {
  formData: SpouseFormData;
  setFormData: React.Dispatch<React.SetStateAction<SpouseFormData>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SpouseDetailsSection: React.FC<SpouseDetailsSectionProps> = ({
  formData,
  handleInputChange,
  setFormData,
}) => {
  const calculateAge = (birthday: string): number => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const isBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());
    return isBirthdayPassed ? age : age - 1;
  };

  const spouseFields = [
    { label: "Spouse Name", name: "spouse_name", type: "text" },
    { label: "Spouse Birthday", name: "spouse_birthday", type: "date" },
    { label: "Spouse Age", name: "spouse_age", type: "number" },
    { label: "Spouse Religion", name: "spouse_religion", type: "text" },
    { label: "Spouse Occupation", name: "spouse_occupation", type: "text" },
    {
      label: "Spouse Contact Number",
      name: "spouse_contact_number",
      type: "tel",
    },
    
  ] as const;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {spouseFields.map(({ label, name, type }) => (
          <div key={name}>
            <label
              htmlFor={name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {label}
            </label>
            <input
              id={name}
              name={`spouse.${name}`}
              type={type}
              value={formData.spouse[name] || ""}
              onChange={
                name === "spouse_birthday"
                  ? (e) => {
                      handleInputChange(e);
                      const age = calculateAge(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        spouse: { ...prev.spouse, spouseAge: age },
                      }));
                    }
                  : handleInputChange
              }
              className="w-full border rounded-lg p-2"
              min={type === "number" ? "0" : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpouseDetailsSection;
