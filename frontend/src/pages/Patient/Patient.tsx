import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import {
  Camera,
  Upload,
  FileText,
  UserCheck,
  Calendar,
  Phone,
} from "lucide-react";
import { getPatientById } from "../../services/patientService";
import useModal from "../Home/useModal";
import RenderServicesModal from "./RenderServicesModal";
import PatientDetailsModal from "./PatientDetailsModal";
import axiosInstance from "../../config/axiosConfig";
import EditPatientForm from "./EditPatientForm";

interface Visit {
  visitDate: string;
  reason: string;
}

interface File {
  name: string;
  uploadDate: string;
  type: string;
}

interface ServiceItem {
  itemName: string;
  itemQuantity: number;
  itemPrice: number;
}

interface ServiceRendered {
  renderedDate: string;
  services: { serviceName: string; servicePrice: number }[];
  items?: ServiceItem[];
  totalCost: number;
  notes: string;
}

interface Patient {
  id: string;
  patientID: string;
  clientID: Number;
  name: string;
  sex: string;
  contactNumber: string;
  expectedDateConfinement?: string;
  visitHistory: Visit[];
  files: File[];
  renderedServices?: ServiceRendered[];
}

const Patient: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { isModalOpen, openModal, closeModal } = useModal();
  const {
    isModalOpen: isPatientModalOpen,
    openModal: openPatientModal,
    closeModal: closePatientModal,
  } = useModal();

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patientImage, setPatientImage] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<string>("");
  const [patientInfo, setPatientInfo] = useState<any>();
  const [patient, setPatient] = useState<Patient>({
    id: "",
    patientID: "",
    clientID: 0,
    name: "",
    expectedDateConfinement: "",
    sex: "",
    contactNumber: "",
    visitHistory: [],
    files: [],
    renderedServices: [],
  });

  // Ref for the hidden file input for multiple file uploads
  const multipleFilesInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patientInfo = await getPatientById(Number(id));
        setPatientInfo(patientInfo);

        // Initialize an empty array for services
        let servicesData = [];

        try {
          // Separate try-catch for services endpoint to handle potential 404
          const servicesResponse = await axiosInstance.get(
            `/service/getRenderedServicesByPatientId/${patientInfo.clientID}`
          );
          servicesData = servicesResponse.data;
        } catch (serviceError: any) {
          // Generic error handling for services fetch
          if (serviceError.response?.status === 404) {
            console.log(
              `No services found for patient ${patientInfo.clientID}`
            );
          } else {
            console.warn("Error fetching services:", serviceError);
          }
        }

        // Map services data (will be an empty array if fetch failed)
        const mappedRenderedServices = (servicesData || []).map((rs: any) => ({
          renderedDate: rs.renderedDate
            ? new Date(rs.renderedDate).toLocaleDateString()
            : "",
          services: rs.services || [],
          items: rs.items || [],
          notes: rs.notes || "",
          totalCost: rs.totalCost || 0,
        }));

        setPatient({
          id: patientInfo?.patientID || "",
          patientID: patientInfo?.patientID || "",
          clientID: patientInfo?.clientID || 0,
          sex: patientInfo?.sex || "",
          contactNumber: patientInfo?.contactNumber || "",
          name: patientInfo
            ? `${patientInfo.givenName || ""} ${patientInfo.middleName || ""} ${
                patientInfo.lastName || ""
              }`.trim()
            : "",
          expectedDateConfinement: patientInfo.pregnancy?.edc
            ? new Date(patientInfo.pregnancy.edc).toISOString().split("T")[0]
            : "",
          renderedServices: mappedRenderedServices,
          visitHistory: [],
          files: [], // Assuming we fetch files separately if needed
        });

        if (patientInfo?.imagePath) {
          setPatientImage(patientInfo.imagePath);
        } else {
          setPatientImage(null);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setPatient({
          id: "",
          patientID: "",
          clientID: 0,
          name: "",
          sex: "",
          contactNumber: "",
          expectedDateConfinement: "",
          visitHistory: [],
          files: [],
          renderedServices: [], // Added renderedServices to match initial state
        });
      }
    };

    fetchPatientData();
  }, [id]);

  const handleOtherFilesInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]); // 'files' must match @RequestParam on backend
      }
      formData.append("patientId", String(patientInfo.clientID));

      try {
        const response = await axiosInstance.post(
          "/uploadPatientFiles",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          console.log("Files uploaded successfully:", response.data);
          // Assume response.data contains an updated file list or the newly uploaded files
          if (response.data.files) {
            setPatient((prev) => ({
              ...prev,
              files: [...prev.files, ...response.data.files],
            }));
          }
        } else {
          console.error("Upload failed with status:", response.status);
        }
      } catch (error) {
        console.error("Error uploading files:", error);
      }
    },
    [patientInfo]
  );

  const handleGeneratePDF = useCallback(() => {
    if (!selectedForm) {
      alert("Please select a form to generate.");
      return;
    }
    navigate(
      `/generate-pdf?form=${selectedForm}&patientId=${patientInfo.clientID}`
    );
  }, [selectedForm, navigate, patient.id]);

  const handleServiceRender = () => {};

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <h2 className="text-3xl font-bold">
                  {patient.name}'s Medical Profile
                </h2>
                <p className="mt-2 text-blue-100">Patient ID: {patient.id}</p>
              </div>

              <div className="p-6 grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="relative group">
                    <div className="w-64 h-64 mx-auto bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                      {patientImage ? (
                        <img
                          src={patientImage}
                          alt="Patient"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg shadow">
                    <p className="flex items-center text-gray-700">
                      <UserCheck className="w-5 h-5 mr-2 text-blue-500" />
                      <span className="font-semibold mr-2">
                        Patient ID:
                      </span>{" "}
                      {patient.id}
                    </p>

                    {patient.sex === "F" ? (
                      <>
                        <p className="flex items-center text-gray-700">
                          <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                          <span className="font-semibold mr-2">
                            Expected Date of Confinement:
                          </span>
                          {patient.expectedDateConfinement}
                        </p>

                        <p className="flex items-cecnter text-gray-700">
                          <Phone className="w-5 h-5 mr-2 text-blue-500" />
                          <span className="font-semibold mr-2">
                            Contact Number:
                          </span>
                          {patient.contactNumber}
                        </p>
                      </>
                    ) : (
                      <>
                        <span className="font-semibold mr-2">
                          Contact Number:
                        </span>
                        {patient.contactNumber}
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg shadow">
                    <div className="space-y-4">
                      {/* Only female get a claim form */}
                      {patient.sex === "F" && (
                        <>
                          <div>
                            <label
                              htmlFor="claim-form"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Select Claim Form
                            </label>
                            <select
                              id="claim-form"
                              onChange={(e) => setSelectedForm(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select Claim Form</option>
                              <option value="CSF">CSF</option>
                              <option value="Claim Form 1">Claim Form 1</option>
                              <option value="Claim Form 2">Claim Form 2</option>
                            </select>
                          </div>

                          <button
                            onClick={handleGeneratePDF}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center"
                          >
                            <FileText className="w-5 h-5 mr-2" />
                            Generate PDF
                          </button>
                        </>
                      )}

                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        ref={multipleFilesInputRef}
                        className="hidden"
                        onChange={handleOtherFilesInputChange}
                      />
                      <button
                        onClick={openModal}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center"
                      >
                        <UserCheck className="w-5 h-5 mr-2" />
                        Render Services
                      </button>

                      <button
                        onClick={openPatientModal}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center"
                      >
                        <UserCheck className="w-5 h-5 mr-2" />
                        Patient Details
                      </button>

                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center"
                      >
                        <UserCheck className="w-5 h-5 mr-2" />
                        Edit Patient
                      </button>

                      <EditPatientForm
                        patientId={patientInfo?.clientID}
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onSuccess={() => {
                          // Refresh your patient list or handle successful update
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Rendered Services
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 p-2 text-left">
                          Services
                        </th>
                        <th className="border border-gray-200 p-2 text-left">
                          Items
                        </th>
                        <th className="border border-gray-200 p-2 text-left">
                          Total Cost
                        </th>
                        <th className="border border-gray-200 p-2 text-left">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {patient.renderedServices &&
                      patient.renderedServices.length > 0 ? (
                        patient.renderedServices.map(
                          (rs: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border border-gray-200 p-2">
                                <ul className="list-disc ml-5">
                                  {rs.services.map((s: any, sIndex: number) => (
                                    <li key={sIndex}>
                                      {s.serviceName} - PHP
                                      {s.servicePrice.toFixed(2)}
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td className="border border-gray-200 p-2">
                                {rs.items && rs.items.length > 0 ? (
                                  <ul className="list-disc ml-5">
                                    {rs.items.map(
                                      (item: any, iIndex: number) => (
                                        <li key={iIndex}>
                                          {item.itemName} @ PHP
                                          {item.itemPrice.toFixed(2)}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                ) : (
                                  <span>No items used</span>
                                )}
                              </td>
                              <td className="border border-gray-200 p-2">
                                PHP{rs.totalCost.toFixed(2)}
                              </td>
                              <td className="border border-gray-200 p-2">
                                {rs.notes}
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="border border-gray-200 p-2 text-center"
                          >
                            No rendered services found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <RenderServicesModal
        isOpen={isModalOpen}
        onClose={closeModal}
        patient={patient}
      />
      <PatientDetailsModal
        isOpen={isPatientModalOpen}
        onClose={closePatientModal}
        data={patientInfo}
      />
    </div>
  );
};

export default Patient;
