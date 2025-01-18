import React, { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosConfig";
import { useNavigate } from "react-router-dom";

interface PatientDetailsModalProps {
  isOpen: boolean;
  data?: { [key: string]: any }; // Make `data` optional
  onClose: () => void;
}

const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  isOpen,
  data = {}, // Default to empty object
  onClose,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(data);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [status, setStatus] = useState(data?.status || "active");

  // Friendly terms mapping
  const friendlyTerms: { [key: string]: string } = {
    patientID : "Patient ID",
    varcharID : "Patient ID",
    lastName: "Last Name",
    givenName: "First Name",
    middleName: "Middle Name",
    sex: "Sex",
    address: "Address",
    age: "Age",
    birthday: "Date of Birth",
    religion: "Religion",
    occupation: "Occupation",
    lastDelivery: "Last Delivery Date",
    philhealthID: "PhilHealth ID",
    spouse: "Spouse Information",
    pregnancy: "Pregnancy Information",
    consultation: "Consultation Information",
    medicalHistory: "Medical History",
    contactNumber: "Contact Number",
    // Nested spouse keys
    spouse_id: "Spouse ID",
    spouse_name: "Spouse Name",
    spouse_birthday: "Spouse's Date of Birth",
    spouse_religion: "Spouse's Religion",
    spouse_occupation: "Spouse's Occupation",
    spouse_contact_number: "Spouse's Contact Number",
    spouse_age: "Spouse's Age",
    // Pregnancy keys
    pregnancy_id: "Pregnancy ID",
    gravida: "Number of Pregnancies",
    para: "Number of Births",
    term: "Full-term Births",
    pre_term: "Pre-term Births",
    abortion: "Number of Abortions",
    living: "Living Children",
    lmp: "Last Menstrual Period",
    edc: "Estimated Due Date",
    it_date: "Initial Treatment Date",
    menarche: "Age at First Menstruation",
    // Consultation keys
    consultation_id: "Medical History ID",
    consultation_date: "Consultation Date",
    aog: "Age of Gestation (weeks)",
    bp: "Blood Pressure",
    weight: "Weight",
    fh: "Fundal Height",
    fht: "Fetal Heart Tone",
    remarks: "Remarks",
    // Medical history keys
    medical_history_id: "Medical History ID",
    smoking: "Smoker",
    allergies: "Allergies",
    drug_intake: "Taking Medications",
    bleeding_anemia: "History of Bleeding/Anemia",
    diabetes_congenital_anomalies: "Diabetes or Congenital Anomalies",
    previous_C_section: "Previous C-Section",
    consectuive_miscarriages: "Consecutive Miscarriages",
    post_partum_hemorrhage: "Postpartum Hemorrhage",
    forcep_delivery: "Forceps Delivery",
    hypertension: "Hypertension",
    // Branch keys
    branch: "Branch Information",
    branchID: "Branch ID",
    branch_name: "Branch Name",
    branch_address: "Branch Address",
    branch_contact: "Branch Contact Number",
    
  };

  useEffect(() => {
    if (isOpen && data) {
      setFormData(data);
      setStatus(data.status || "active");
      setExpandedSections([]);
    }
  }, [isOpen, data]);

  const handleArchive = async () => {
    try {
      await axiosInstance.patch(`/archivePatient/${formData.clientID}`);
      setIsArchiveModalOpen(false);
      setStatus("archived");
      onClose();
      alert("Patient archived successfully.");
      navigate("/patientrecords");
    } catch (error) {
      console.error("Error archiving patient:", error);
      alert("An error occurred while archiving the patient.");
    }
  };

  const handleUnarchive = async () => {
    try {
      await axiosInstance.patch(`/unarchivePatient/${formData.clientID}`);
      setIsArchiveModalOpen(false);
      setStatus("active");
      onClose();
      alert("Patient unarchived successfully.");
      navigate("/patientrecords");
    } catch (error) {
      console.error("Error unarchiving patient:", error);
      alert("An error occurred while unarchiving the patient.");
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const renderValue = (value: any, keyPath: string = ""): React.ReactNode => {
    // Determine the patient's sex from formData
    const patientSex = formData.sex?.toLowerCase();

    if (typeof value === "object" && value !== null) {
      // Handle the 'spouse' section
      if (keyPath.toLowerCase() === "spouse_id") {
        const hasSpouse =
          value &&
          Object.keys(value).some(
            (subKey) =>
              value[subKey] !== null &&
              value[subKey] !== undefined &&
              value[subKey] !== ""
          );

        if (!hasSpouse) {
          return <span>No Spouse</span>;
        }
      }

      // Handle the 'pregnancy' section
      if (keyPath.toLowerCase() === "pregnancy") {
        if (patientSex !== "female" && patientSex !== "f") {
          return <span>N/A</span>;
        }
      }


      return (
        <div className="ml-4">
          {Object.entries(value).map(([subKey, subValue]) => {
            const fullKeyPath = keyPath ? `${keyPath}.${subKey}` : subKey;
            const isExpandable =
              typeof subValue === "object" && subValue !== null;

            return (
              <div key={fullKeyPath} className="mb-2">
                {isExpandable ? (
                  <div>
                    <button
                      className="text-left w-full flex justify-between items-center focus:outline-none"
                      onClick={() => toggleSection(fullKeyPath)}
                    >
                      <span className="font-medium">
                        {friendlyTerms[subKey] || subKey}
                      </span>
                      <span>
                        {expandedSections.includes(fullKeyPath) ? "-" : "+"}
                      </span>
                    </button>
                    {expandedSections.includes(fullKeyPath) && (
                      <div className="ml-4">
                        {renderValue(subValue, fullKeyPath)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex">
                    <span className="font-medium w-1/3 text-right pr-2">
                      {friendlyTerms[subKey] || subKey}:
                    </span>
                    <span className="w-2/3">
                      {renderValue(subValue, fullKeyPath)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    } else if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    } else {
      return value?.toString() || "N/A";
    }
  };

  if (!isOpen) return null;

  

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Patient Details</h2>
          <div className="space-y-6 mb-8">
            <table className="w-full table-auto border-collapse">
              <tbody>
                {Object.entries(formData)
                  .filter(([key]) => key !== "imagePath" && key !== "clientID" && key !== "status" && key !== "middleInitial" && key !== "varcharID" && key !== "it_date")
                  
                  .map(([key, value]) => (
                    
                    <tr key={key} className="border-b border-gray-200 last:border-b-0">
                      <td className="py-3 pr-6 font-medium text-right align-top w-1/4">
                        {friendlyTerms[key] || key}:
                      </td>
                      <td className="py-3 pl-6 text-left align-top">

                        
                        
                        {renderValue(value, key)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end space-x-6 pt-6 border-t border-gray-200">
            <button
              className={`${
                status === "archived" ? "bg-green-500" : "bg-yellow-500"
              } text-white px-8 py-3 rounded-lg text-lg hover:${
                status === "archived" ? "bg-green-600" : "bg-yellow-600"
              } transition-colors duration-200`}
              onClick={() => setIsArchiveModalOpen(true)}
            >
              {status === "archived" ? "Unarchive" : "Archive"}
            </button>
            <button
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg text-lg hover:bg-gray-300 transition-colors duration-200"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Archive/Unarchive Confirmation Modal */}
      {isArchiveModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-gray-800">
              Confirm {status === "archived" ? "Unarchive" : "Archive"}
            </h3>
            <p className="text-gray-600 my-4">
              Are you sure you want to {status === "archived" ? "unarchive" : "archive"} this patient?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                onClick={() => setIsArchiveModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`${
                  status === "archived" ? "bg-green-500" : "bg-yellow-500"
                } text-white px-4 py-2 rounded-lg hover:${
                  status === "archived" ? "bg-green-600" : "bg-yellow-600"
                }`}
                onClick={status === "archived" ? handleUnarchive : handleArchive}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientDetailsModal;

