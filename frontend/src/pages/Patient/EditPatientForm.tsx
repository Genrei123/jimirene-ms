import React, { useState, useEffect } from 'react';
import { UserCheck } from 'lucide-react';
import { getPatientById, updatePatient } from '@/services/patientService';
import Patient from '@/types/Patient';

const EditPatientForm = ({ patientId, isOpen, onClose, onSuccess }) => {
  const [patient, setPatient] = useState<Patient>({
    clientID: 0,
    imagePath: '',
    status: '',
    patientID: '',
    lastName: '',
    givenName: '',
    middleName: '',
    sex: '',
    age: 0,
    address: '',
    contactNumber: '',
    birthday: '',
    religion: '',
    occupation: '',
    spouse: {
      spouse_name: "",
      spouse_birthday: "",
      spouse_religion: "",
      spouse_occupation: "",
      spouse_contact_number: "",
      spouse_age: 0,
    },
  
    pregnancy: {
      gravida: 0,
      para: 0,
      term: 0,
      pre_term: 0,
      abortion: 0,
      living: 0,
      LMP: '',
      edc: '',
      tt_date: '',
      menarche: '',
    },
  
    consultation: {
      consultation_date: '', // Corrected from `consultation_date`
      aog: 0,
      bp: 0,
      weight: 0,
      fh: 0,
      fht: 0,
      remarks: '',
    },
  
    medicalHistory: {
      smoking: false,
      allergies: '',
      drug_intake: false,
      bleeding_anemia: false,
      diabetes_congenital_anomalies: false,
      previous_C_section: false,
      consecutive_miscarriages: false, // Corrected from `consectuivemiscarriage`
      post_partum_hemorrhage: false,
      forcep_delivery: false,
      hypertension: false,
    },
    branch: {
      branchID: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && patientId) {
      fetchPatientData();
    }
  }, [isOpen, patientId]);

  const fetchPatientData = async () => {
    console.log(`Patient ID: ${patientId}`);
    try {
      const response = await getPatientById(patientId);
      if (response) {
        // Initialize nested objects if they don't exist
        const initializedData: Patient = {
          ...response,
          spouse: response.spouse || {
            spouse_name: "",
            spouse_birthday: "",
            spouse_religion: "",
            spouse_occupation: "",
            spouse_contact_number: "",
            spouse_age: 0,
          },
        
          pregnancy: response.pregnancy || {
            gravida: 0,
            para: 0,
            term: 0,
            pre_term: 0,
            abortion: 0,
            living: 0,
            LMP: '',
            edc: '',
            tt_date: '',
            menarche: '',
          },
        
          consultation: response.consultation || {
            consultation_date: '', // Corrected from `consultation_date`
            aog: 0,
            bp: 0,
            weight: 0,
            fh: 0,
            fht: 0,
            remarks: '',
          },
        
          medicalHistory: response.medicalHistory || {
            smoking: false,
            allergies: '',
            drug_intake: false,
            bleeding_anemia: false,
            diabetes_congenital_anomalies: false,
            previous_C_section: false,
            consecutive_miscarriages: false, // Corrected from `consectuivemiscarriage`
            post_partum_hemorrhage: false,
            forcep_delivery: false,
            hypertension: false,
          },
        };
        setPatient(initializedData);
      } else {
        console.error('Failed to fetch patient data');
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updatePatient(patient);
      if (response) {
        onSuccess?.();
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields (e.g., "spouse.spouse_name")
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPatient((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      // Handle top-level fields
      setPatient((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  if (!isOpen) return null;

return (
  <div className="fixed inset-0 flex items-center justify-center bg-opacity-75 z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl max-h-[100vh] overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <UserCheck className="w-5 h-5" />
          Edit Patient Information
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Patient ID</label>
              <input
                type="text"
                name="patientID"
                value={patient.patientID || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={patient.lastName || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Given Name</label>
              <input
                type="text"
                name="givenName"
                value={patient.givenName || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={patient.middleName || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sex</label>
              <input
                type="text"
                name="sex"
                value={patient.sex || ''}
                onChange={handleInputChange}
                maxLength={1}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={patient.age || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={patient.address || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={patient.contactNumber || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Birthday</label>
              <input
                type="date"
                name="birthday"
                value={patient.birthday ? new Date(patient.birthday).toISOString().split('T')[0] : ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Religion</label>
              <input
                type="text"
                name="religion"
                value={patient.religion || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Occupation</label>
              <input
                type="text"
                name="occupation"
                value={patient.occupation || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Spouse Information */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => toggleSection('spouse')}
              className="w-full text-left flex justify-between items-center focus:outline-none"
            >
              <h3 className="text-lg font-bold">Spouse Information</h3>
              <span>{expandedSections.includes('spouse') ? '-' : '+'}</span>
            </button>
            {expandedSections.includes('spouse') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Spouse Name</label>
                  <input
                    type="text"
                    name="spouse.spouse_name"
                    value={patient.spouse.spouse_name || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Spouse Birthday</label>
                  <input
                    type="date"
                    name="spouse.spouse_birthday"
                    value={patient.spouse.spouse_birthday ? new Date(patient.spouse.spouse_birthday).toISOString().split('T')[0] : ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Spouse Religion</label>
                  <input
                    type="text"
                    name="spouse.spouse_religion"
                    value={patient.spouse.spouse_religion || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Spouse Occupation</label>
                  <input
                    type="text"
                    name="spouse.spouse_occupation"
                    value={patient.spouse.spouse_occupation || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Spouse Contact Number</label>
                  <input
                    type="text"
                    name="spouse.spouse_contact_number"
                    value={patient.spouse.spouse_contact_number || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Spouse Age</label>
                  <input
                    type="number"
                    name="spouse.spouse_age"
                    value={patient.spouse.spouse_age || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pregnancy Information */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => toggleSection('pregnancy')}
              className="w-full text-left flex justify-between items-center focus:outline-none"
            >
              <h3 className="text-lg font-bold">Pregnancy Information</h3>
              <span>{expandedSections.includes('pregnancy') ? '-' : '+'}</span>
            </button>
            {expandedSections.includes('pregnancy') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Gravida</label>
                  <input
                    type="text"
                    name="pregnancy.gravida"
                    value={patient.pregnancy.gravida || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Para</label>
                  <input
                    type="text"
                    name="pregnancy.para"
                    value={patient.pregnancy.para || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Term</label>
                  <input
                    type="text"
                    name="pregnancy.term"
                    value={patient.pregnancy.term || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pre-term</label>
                  <input
                    type="text"
                    name="pregnancy.pre_term"
                    value={patient.pregnancy.pre_term || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Abortion</label>
                  <input
                    type="text"
                    name="pregnancy.abortion"
                    value={patient.pregnancy.abortion || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Living Children</label>
                  <input
                    type="text"
                    name="pregnancy.living"
                    value={patient.pregnancy.living || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Estimated Due Date</label>
                  <input
                    type="date"
                    name="pregnancy.edc"
                    value={patient.pregnancy.edc ? new Date(patient.pregnancy.edc).toISOString().split('T')[0] : ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tetanus</label>
                  <input
                    type="date"
                    name="pregnancy.tt_date"
                    value={patient.pregnancy.tt_date ? new Date(patient.pregnancy.tt_date).toISOString().split('T')[0] : ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Consultation Information */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => toggleSection('consultation')}
              className="w-full text-left flex justify-between items-center focus:outline-none"
            >
              <h3 className="text-lg font-bold">Consultation Information</h3>
              <span>{expandedSections.includes('consultation') ? '-' : '+'}</span>
            </button>
            {expandedSections.includes('consultation') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Consultation Date</label>
                  <input
                    type="date"
                    name="consultation.consultation_date"
                    value={patient.consultation.consultation_date ? new Date(patient.consultation.consultation_date).toISOString().split('T')[0] : ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Age of Gestation (weeks)</label>
                  <input
                    type="text"
                    name="consultation.aog"
                    value={patient.consultation.aog || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    name="consultation.bp"
                    value={patient.consultation.bp || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight</label>
                  <input
                    type="text"
                    name="consultation.weight"
                    value={patient.consultation.weight || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fundal Height</label>
                  <input
                    type="text"
                    name="consultation.fh"
                    value={patient.consultation.fh || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fetal Heart Tone</label>
                  <input
                    type="text"
                    name="consultation.fht"
                    value={patient.consultation.fht || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Remarks</label>
                  <input
                    type="text"
                    name="consultation.remarks"
                    value={patient.consultation.remarks || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Medical History */}
<div className="mt-6">
  <button
    type="button"
    onClick={() => toggleSection('medicalHistory')}
    className="w-full text-left flex justify-between items-center focus:outline-none"
  >
    <h3 className="text-lg font-bold">Medical History</h3>
    <span>{expandedSections.includes('medicalHistory') ? '-' : '+'}</span>
  </button>
  {expandedSections.includes('medicalHistory') && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {/* Smoking */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="medicalHistory.smoking"
          checked={patient.medicalHistory.smoking || false}
          onChange={(e) =>
            setPatient((prev) => ({
              ...prev,
              medicalHistory: {
                ...prev.medicalHistory,
                smoking: e.target.checked,
              },
            }))
          }
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">Smoking</label>
      </div>

      

      {/* Taking Medications */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="medicalHistory.drug_intake"
          checked={patient.medicalHistory.drug_intake || false}
          onChange={(e) =>
            setPatient((prev) => ({
              ...prev,
              medicalHistory: {
                ...prev.medicalHistory,
                drug_intake: e.target.checked,
              },
            }))
          }
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">Taking Medications</label>
      </div>

      {/* History of Bleeding/Anemia */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="medicalHistory.bleeding_anemia"
          checked={patient.medicalHistory.bleeding_anemia || false}
          onChange={(e) =>
            setPatient((prev) => ({
              ...prev,
              medicalHistory: {
                ...prev.medicalHistory,
                bleeding_anemia: e.target.checked,
              },
            }))
          }
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">History of Bleeding/Anemia</label>
      </div>

      {/* Diabetes or Congenital Anomalies */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="medicalHistory.diabetes_congenital_anomalies"
          checked={patient.medicalHistory.diabetes_congenital_anomalies || false}
          onChange={(e) =>
            setPatient((prev) => ({
              ...prev,
              medicalHistory: {
                ...prev.medicalHistory,
                diabetes_congenital_anomalies: e.target.checked,
              },
            }))
          }
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">Diabetes or Congenital Anomalies</label>
      </div>

      {/* Previous C-Section */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="medicalHistory.previous_C_section"
          checked={patient.medicalHistory.previous_C_section || false}
          onChange={(e) =>
            setPatient((prev) => ({
              ...prev,
              medicalHistory: {
                ...prev.medicalHistory,
                previous_C_section: e.target.checked,
              },
            }))
          }
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">Previous C-Section</label>
      </div>

      {/* Consecutive Miscarriages */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="medicalHistory.consecutive_miscarriages"
          checked={patient.medicalHistory.consecutive_miscarriages || false}
          onChange={(e) =>
            setPatient((prev) => ({
              ...prev,
              medicalHistory: {
                ...prev.medicalHistory,
                consectuive_miscarriages: e.target.checked,
              },
            }))
          }
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">Consecutive Miscarriages</label>
      </div>

      {/* Postpartum Hemorrhage */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="medicalHistory.post_partum_hemorrhage"
          checked={patient.medicalHistory.post_partum_hemorrhage || false}
          onChange={(e) =>
            setPatient((prev) => ({
              ...prev,
              medicalHistory: {
                ...prev.medicalHistory,
                post_partum_hemorrhage: e.target.checked,
              },
            }))
          }
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">Postpartum Hemorrhage</label>
      </div>

      {/* Forceps Delivery */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="medicalHistory.forcep_delivery"
          checked={patient.medicalHistory.forcep_delivery || false}
          onChange={(e) =>
            setPatient((prev) => ({
              ...prev,
              medicalHistory: {
                ...prev.medicalHistory,
                forcep_delivery: e.target.checked,
              },
            }))
          }
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">Forceps Delivery</label>
      </div>

      {/* Hypertension */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="medicalHistory.hypertension"
          checked={patient.medicalHistory.hypertension || false}
          onChange={(e) =>
            setPatient((prev) => ({
              ...prev,
              medicalHistory: {
                ...prev.medicalHistory,
                hypertension: e.target.checked,
              },
            }))
          }
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">Hypertension</label>
      </div>

      {/* Allergies */}
      <div>
        <label className="block text-sm font-medium mb-1">Allergies</label>
        <input
          type="text"
          name="medicalHistory.allergies"
          value={patient.medicalHistory.allergies || ''}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  )}
</div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  </div>
);


};

export default EditPatientForm;