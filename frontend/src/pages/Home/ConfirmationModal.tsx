import React, { useEffect } from "react";
import axiosInstance from "../../config/axiosConfig";

interface ConfirmationModalProps {
  isOpen: boolean;
  data: { [key: string]: any };
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  data,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const friendlyTerms: { [key: string]: string } = {
    patientID: "Patient ID",
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
    spouseName: "Spouse Name",
    spouseBirthday: "Spouse's Date of Birth",
    spouseReligion: "Spouse's Religion",
    spouseOccupation: "Spouse's Occupation",
    spouseContactNumber: "Spouse's Contact Number",
    spouseAge: "Spouse's Age",
    // Pregnancy keys
    gravida: "Number of Pregnancies",
    para: "Number of Births",
    term: "Full-term Births",
    pre_term: "Pre-term Births",
    abortion: "Number of Abortions",
    living: "Living Children",
    LMP: "Last Menstrual Period",
    edc: "Estimated Due Date",
    TT_date: "Tetanus",
    menarche: "Age at First Menstruation",
    // Consultation keys
    consultation_date: "Consultation Date",
    AOG: "Age of Gestation (weeks)",
    BP: "Blood Pressure",
    weight: "Weight",
    FH: "Fundal Height",
    FHT: "Fetal Heart Tone",
    remarks: "Remarks",
    // Medical history keys
    smoking: "Smoker",
    allergies: "Allergies",
    drugIntake: "Taking Medications",
    bleedingAnemia: "History of Bleeding/Anemia",
    diabetesCongenitalAnomalies: "Diabetes or Congenital Anomalies",
    previousCSection: "Previous C-Section",
    consecutiveMiscarriages: "Consecutive Miscarriages",
    postPartumHemorrhage: "Postpartum Hemorrhage",
    forcepDelivery: "Forceps Delivery",
    hypertension: "Hypertension",
  };

  useEffect(() => {
    const response = axiosInstance.get(`/generateqr?clientID=/${data.clientID}`);
    console.log(response);
  });

  const renderValue = (value: any): React.ReactNode => {
    if (typeof value === "object" && value !== null) {
      return (
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="flex">
              <span className="font-medium w-1/2 text-right pr-2">
                {friendlyTerms[key] || key}:
              </span>
              <span className="w-1/2">{renderValue(val)}</span>
            </div>
          ))}
        </div>
      );
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    return value?.toString() || "N/A";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Confirm Submission
        </h2>
        <p className="mb-8 text-lg text-gray-600">
          Please confirm if the following information is correct:
        </p>
        <div className="space-y-6 mb-8">
          <table className="w-full table-auto border-collapse">
            <tbody>
              {Object.entries(data)
                .filter(
                  ([key]) => key !== "imagePath" && key !== "clientID" && key !== "status" && key !== "branch" // Filter unused keys
                )
                .map(([key, value]) => (
                  <tr
                    key={key}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <td className="py-3 pr-6 font-medium text-right align-top w-1/4">
                      {friendlyTerms[key] || key}:
                    </td>
                    <td className="py-3 pl-6 text-left align-top">
                      {renderValue(value)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end space-x-6 pt-6 border-t border-gray-200">
          <button
            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg text-lg hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;