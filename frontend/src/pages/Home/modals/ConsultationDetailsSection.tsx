import React from 'react'

interface ConsultationDetails {
  consultation_date: string
  aog: number
  bp: number
  weight: number
  fh: number
  fht: number
  remarks: string
}

interface ConsultationFormData {
  consultation: ConsultationDetails
}

interface ConsultationDetailsSectionProps {
  formData: ConsultationFormData
  setFormData: React.Dispatch<React.SetStateAction<ConsultationFormData>>
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
}

const ConsultationDetailsSection: React.FC<ConsultationDetailsSectionProps> = ({
  formData,
  handleInputChange,
}) => {
  const consultationFields = [
    { label: 'Consultation Date', name: 'consultation_date', type: 'date' },
    { label: 'AOG', name: 'aog', type: 'number' },
    { label: 'BP', name: 'bp', type: 'text' },
    { label: 'Weight (in kg)', name: 'weight', type: 'number' },
    { label: 'FH', name: 'fh', type: 'number' },
    { label: 'FHT (in cm)', name: 'fht', type: 'number' },
    { label: 'Remarks', name: 'remarks', type: 'textarea' },
  ] as const

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {consultationFields.map(({ label, name, type }) => (
          <div key={name} className={type === 'textarea' ? 'md:col-span-2' : ''}>
            <label htmlFor={name} className="block text-sm font-medium mb-1">
              {label}
            </label>
            {type === 'textarea' ? (
              <textarea
                id={name}
                name={`consultation.${name}`}
                value={formData.consultation[name] || ''}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2 h-24 resize-none"
              />
            ) : (
              <input
                id={name}
                name={`consultation.${name}`}
                type={type}
                value={formData.consultation[name] || ''}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ConsultationDetailsSection