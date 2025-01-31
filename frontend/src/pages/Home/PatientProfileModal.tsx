import React, { useState, useEffect } from "react";
import Patient from "../../types/Patient";
import { addPatient } from "../../services/patientService";
import { addPatientLog } from "../../services/visitService";
import { AlertCircle, CheckCircle, X, Search, UserPlus, QrCode } from "lucide-react";
import { createEmptyPatient } from "../../utils/Patient";
import PatientInformationSection from "./modals/PatientInformationSection";
import MedicalHistorySection from "./modals/MedicalHistorySection";
import ConsultationDetailsSection from "./modals/ConsultationDetailsSection";
import PregnancyDetailsSection from "./modals/PregnancyDetailsSection";
import SpouseDetailsSection from "./modals/SpouseDetailsSection";
import QRCodeModal from "../../components/QRCodeModal";
import ConfirmationModal from "./ConfirmationModal";
import axiosInstance from "../../config/axiosConfig";
import SuccessAlert from "../../components/SuccessAlert";

interface PatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<Patient>(createEmptyPatient());
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  /**
   * handleInputChange
   * A generic function to handle any input field changes.
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const parsedValue = value === "" ? "" : isNaN(Number(value)) ? value : Number(value);


    if (name.includes(".")) {
      
      // Nested field (e.g., "spouse.spouseName")
      const [parent, child] = name.split(".");
      console.log("Nested field:", name);
      setFormData((prev) => {
        const parentObj = prev[parent as keyof Patient];
        const existingNested =
          parentObj && typeof parentObj === "object" ? { ...parentObj } : {};

        return {
          ...prev,
          [parent]: {
            ...existingNested,
            [child]: parsedValue,
          },
        };
      });
    } else {
      // Top-level field
      setFormData((prev) => ({ ...prev, [name]: parsedValue}));
    }
  };

  /**
   * validateCurrentStep
   * - Step 0 (Patient Information) is mandatory.
   * - Steps 1-4 are optional and can be skipped.
   */
  const validateCurrentStep = () => {
    // If the user is on the first step (index 0), validate required fields
    if (currentStep === 0) {
      const requiredFields = ["patientID", "lastName", "givenName", "age", "sex"];
      const missing = requiredFields.filter((field) => !formData[field]);
  
      if (missing.length > 0) {
        setMissingFields(missing); // Update missing fields state
        setErrorMessage(
          `Please fill in the required fields: ${missing.join(", ").toUpperCase()}`
        );
        return false;
      }
    }
    setMissingFields([]); // Clear missing fields if validation passes
    return true; // All other steps are optional
  };

  /**
   * skipStep
   * Allows skipping any step except the first one.
   * Applies the same male-pregnancy skip logic as nextStep (optional).
   */
  const skipStep = () => {
    if (currentStep === 0) {
      // Cannot skip the first step
      return;
    }

    // If not on the last step, skip to the next
    if (currentStep < steps.length - 1) {
      // If patient is male and skipping from Medical History (index 2) => skip Pregnancy (index 3)
      if (formData.sex === "M" && currentStep === 2) {
        setCurrentStep((prev) => prev + 2); // Goes directly to step 4 (Consultation)
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  /**
   * nextStep
   * Moves user to the next step if current step is valid.
   */
  const nextStep = () => {
    if (!validateCurrentStep()) return; // Validate current step first

    // If not on the last step, go to the next
    if (currentStep < steps.length - 1) {
      // If patient is male and currently on Medical History (index 2), skip Pregnancy (index 3)
      if (formData.sex === "M" && currentStep === 2) {
        setCurrentStep((prev) => prev + 2);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
    setErrorMessage(null); // Clear error if any
  };

  /**
   * prevStep
   * Moves user to the previous step.
   */
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setErrorMessage(null);
    }
    // If patient is male and we are on Consultation (index 4), skip back from pregnancy (index 3)
    if (formData.sex === "M" && currentStep === 4) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  /**
   * handleSubmitConfirmed
   * Called after user confirms the review in ConfirmationModal.
   * Responsible for final patient creation, logs, and generating QR code.
   */
  const handleSubmitConfirmed = async () => {
    try {
      const newPatient = await addPatient(formData);
      await addPatientLog(Number(newPatient.clientID), "Initial Check-up");

      // Generate QR code
      const qrResponse = await axiosInstance.get(
        `/generateqr?clientID=${newPatient.clientID}`,
        {
          responseType: "blob",
        }
      );

      const qrURL = URL.createObjectURL(qrResponse.data);
      setQrCode(qrURL);

      setSuccessMessage(
        `Patient profile for ${newPatient.lastName}, ${newPatient.givenName} (ID: ${newPatient.clientID}) was successfully created. Initial check-up logged and QR code generated.`
      );
      alert("Successfully created patient profile.");
      onClose();
    } catch (error) {
      console.error("Error creating patient:", error);
      setErrorMessage(
        "An error occurred while creating the patient profile. Please try again."
      );
      alert("An error occurred while creating the patient profile. Please try again.");
      onClose();
      setFormData(createEmptyPatient());
    } finally {
      setIsModalOpen(false);
      setFormData(createEmptyPatient()); // Reset form data after submission
    }

    window.location.reload();
  };

  const steps = [
    {
      title: "Patient Information",
      icon: UserPlus,
      component: (
        <PatientInformationSection
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
        />
      ),
    },
    {
      title: "Spouse Information",
      icon: UserPlus,
      component: (
        <SpouseDetailsSection
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
        />
      ),
    },
    {
      title: "Medical History",
      icon: Search,
      component: (
        <MedicalHistorySection
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
        />
      ),
    },
    {
      title: "Pregnancy Details",
      icon: UserPlus,
      component: (
        <PregnancyDetailsSection
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
        />
      ),
    },
    {
      title: "Consultation Details",
      icon: UserPlus,
      component: (
        <ConsultationDetailsSection
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
        />
      ),
    },
  ];

  useEffect(() => {
    // Reset error messages whenever formData or currentStep changes
    setErrorMessage(null);
  }, [formData, currentStep]);

  useEffect(() => {
    // Auto-clear success message after 5 seconds
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (!isOpen) return null;

  return (
    
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl h-[80vh] relative flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {steps[currentStep].title}
        </h2>

        <div className="flex-1 overflow-y-auto">{steps[currentStep].component}</div>

        {errorMessage && (
          <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
        )}
        
        <div className="flex justify-between mt-4">
          {/* Previous Button */}
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>

          {/* If not on the last step, show Next & Skip */}
          {currentStep < steps.length - 1 ? (
            <div className="flex space-x-2">
              {/* Next Button */}
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Next
              </button>
              {/* Skip Button (Hide on first step) */}
              {currentStep !== 0 && (
                <button
                  onClick={skipStep}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Skip
                </button>
              )}
            </div>
          ) : (
            // If on the last step, show "Review & Submit"
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Review & Submit
            </button>
          )}

          {/* Confirmation Modal for final review */}
          <ConfirmationModal
            isOpen={isModalOpen}
            data={formData}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleSubmitConfirmed}
          />

          {/* QR Code Modal */}
          <QRCodeModal
            isOpen={!!qrCode}
            qrCode={qrCode}
            onClose={() => setQrCode(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientProfileModal;