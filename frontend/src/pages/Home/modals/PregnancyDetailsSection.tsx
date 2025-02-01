import React from 'react'

interface PregnancyDetails {
  gravida: number
  para: number
  term: number
  pre_term: number
  abortion: number
  living: number
  LMP: string
  edc: string
  tt_date: string
  menarche: string
}

interface PregnancyFormData {
  pregnancy: PregnancyDetails
}

interface PregnancyDetailsSectionProps {
  formData: PregnancyFormData
  setFormData: React.Dispatch<React.SetStateAction<PregnancyFormData>>
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
}

const PregnancyDetailsSection: React.FC<PregnancyDetailsSectionProps> = ({
  formData,
  handleInputChange,
}) => {
  const numericFields = [
    'gravida',
    'para',
    'term',
    'pre_term',
    'abortion',
    'living',
  ] as const

  const dateFields = [
    { label: 'LMP', name: 'lmp' },
    { label: 'EDC', name: 'edc' },
    { label: 'IT Date', name: 'tt_date' },
    { label: 'Menarche', name: 'menarche' },
  ] as const

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {numericFields.map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
              {field.toUpperCase()}
            </label>
            <input
              id={field}
              name={`pregnancy.${field}`}
              type="number"
              value={formData.pregnancy[field] || ''}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              min="0"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {dateFields.map(({ label, name }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              id={name}
              name={`pregnancy.${name}`}
              type="date"
              value={formData.pregnancy[name] || ''}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PregnancyDetailsSection