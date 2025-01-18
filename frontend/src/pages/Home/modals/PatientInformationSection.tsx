import React, { useEffect } from 'react';
import axiosInstance from '../../../config/axiosConfig';
import { useState } from 'react';


interface PatientFormData {
  birthday: string
  patientID: string
  lastName: string
  givenName: string
  middleName: string
  address: string
  religion: string
  occupation: string
  age: number
  sex: string
  contactNumber: string;
  branch: {
    branchID: number
  };
}

interface PatientInformationSectionProps {
  formData: PatientFormData
  setFormData: React.Dispatch<React.SetStateAction<PatientFormData>>
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
}

type FormField = {
  label: string
  name: keyof PatientFormData
  type?: 'text' | 'number' | 'date'
}

const PatientInformationSection: React.FC<PatientInformationSectionProps> = ({
  formData,
  setFormData,
  handleInputChange,
}) => {
  const calculateAge = (birthday: string): number => {
    const birthDate = new Date(birthday)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const isBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate())
    return isBirthdayPassed ? age : age - 1
  }

  const formFields: FormField[] = [
    
    { label: 'Patient ID', name: 'patientID' },
    { label: 'Last Name', name: 'lastName' },
    { label: 'Given Name', name: 'givenName' },
    { label: 'Middle Name', name: 'middleName' },
    { label: 'Address', name: 'address' },
    { label: 'Religion', name: 'religion' },
    { label: 'Occupation', name: 'occupation' },
    { label: 'Birthday', name: 'birthday', type: 'date' },
    { label: 'Age', name: 'age', type: 'number' },
    { label: 'Contact Number', name: 'contactNumber', type: 'number' },
  ]

  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches'); // API endpoint for branches
        setBranches(response.data); // Assuming response contains branch data
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };
    fetchBranches();

  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formFields.map(({ label, name, type = 'text' }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium mb-1">
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              value={name === 'branch' ? formData.branch.branchID : formData[name]}
              onChange={
                name === 'birthday'
                  ? (e) => {
                      handleInputChange(e)
                      const updatedAge = calculateAge(e.target.value)
                      setFormData((prev) => ({ ...prev, age: updatedAge }))
                    }
                  : handleInputChange
              }
              className="w-full border rounded-lg p-2"
            />
          </div>
        ))}

        <div>
          <label htmlFor="sex" className="block text-sm font-medium mb-1">
            Sex
          </label>
          <select
            id="sex"
            name="sex"
            value={formData.sex}
            onChange={handleInputChange}
            className="w-full border rounded-lg p-2 bg-white"
          >
            <option value="" disabled>
              Select...
            </option>
            <option value="M">M</option>
            <option value="F">F</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="branch">
            Branch
          </label>
          <select
            id="branch"
            name="branch.branchID"
            value={formData.branch.branchID}
            onChange={handleInputChange}
            className="w-full border rounded-lg p-2 bg-white"
          >
            <option value="" disabled>
              Select...
            </option>
            {branches.map((branch) => (
              <option key={branch.branchID} value={branch.branchID}>
                {branch.branch_name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default PatientInformationSection