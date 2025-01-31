import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import { ArrowLeft } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

import CSF from "../../assets/pdf/CSF.pdf";
import ClaimForm1 from "../../assets/pdf/CF1.pdf";
import ClaimForm2 from "../../assets/pdf/CF2.pdf";

import axiosInstance from "../../config/axiosConfig";
import Patient from "../../types/Patient";

type PatientType = "Parent" | "Child";

const GeneratePDF: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formType, setFormType] = useState<string>(
    searchParams.get("form") || "CSF"
  );
  const [patientType, setPatientType] = useState<PatientType>("Parent");
  const patientId = searchParams.get("patientId");
  const [loading, setLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<Patient | null>(null);

  useEffect(() => {
    setSearchParams((params) => {
      params.set("form", formType);
      return params;
    });
    console.log("Form Type:", formType);
  }, [formType, setSearchParams]);

  // Function to fetch patient data
  const fetchPatientData = async () => {
    try {
      const response = await axiosInstance.get("/getPatient", {
        params: { patientId },
      });
      console.log("Patient data:", response.data);
      if (response.data && response.data.length > 0) {
        return response.data[Number(patientId) - 1] as Patient;
      } else {
        throw new Error("No patient data found.");
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
      throw error;
    }
  };

  // Mapping function
  const getFieldMappings = (formType: string, patient: Patient) => {
    const textFields: { [key: string]: any } = {};
    const checkBoxFields: { [key: string]: any } = {};

    // Common Text Fields
    if (formType === "CF1") {
      textFields["MI_last_name"] = patient.lastName;
      textFields["MI_first_name"] = patient.givenName;
      textFields["MI_middle_name"] = patient.middleName;
      textFields["EC_Contact_Number"] = "0" + patient.contactNumber;
      textFields["Member_Date_of_Birth_1"] = "0";
      textFields["Member_Date_of_Birth_2"] = "9";
      textFields["Member_Date_of_Birth_3"] = "1";
      textFields["Member_Date_of_Birth_4"] = "9";
      textFields["Member_Date_of_Birth_5"] = "2";
      textFields["Member_Date_of_Birth_6"] = "0";
      textFields["Member_Date_of_Birth_7"] = "0";
      textFields["Member_Date_of_Birth_8"] = "3";
    }

    else if (formType === "Claim Form 1") {
      textFields["MI_last_name"] = patient.lastName;
      textFields["MI_first_name"] = patient.givenName;
      textFields["MI_middle_name"] = patient.middleName;
      textFields["MI_mobile_no"] = "0" + patient.contactNumber;
      textFields["Member_Date_of_Birth_1"] = "0";
      textFields["Member_Date_of_Birth_2"] = "9";
      textFields["Member_Date_of_Birth_3"] = "1";
      textFields["Member_Date_of_Birth_4"] = "9";
      textFields["Member_Date_of_Birth_5"] = "2";
      textFields["Member_Date_of_Birth_6"] = "0";
      textFields["Member_Date_of_Birth_7"] = "0";
      textFields["Member_Date_of_Birth_8"] = "3";
    }

    else if (formType === "Claim Form 2") {
      textFields["PI_last_name"] = patient.lastName;
      textFields["PI_first_name"] = patient.givenName;
      textFields["PI_middle_name"] = patient.middleName;
    }

    return { textFields, checkBoxFields };
  };

  const getPDFFile = () => {
    switch (formType) {
      case "CSF":
        return CSF;
      case "Claim Form 1":
        return ClaimForm1;
      case "Claim Form 2":
        return ClaimForm2;
      default:
        return CSF;
    }
  };

  const handleIframeLoad = () => setLoading(false);

  const getPrefilledPDFFile = async () => {
    if (!patientData) return null;

    try {
      // Fetch the PDF file as array buffer using fetch
      const pdfBytes = await fetch(getPDFFile()).then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const form = pdfDoc.getForm();

      // Log all text fields in the PDF
    const fields = form.getFields();
    fields.forEach((field) => {
      
      console.log(`Field Name: ${field.getName()}, Value: ${field.getName()}`);
      
    });

      const { textFields, checkBoxFields } = getFieldMappings(
        formType,
        patientData
      );

      // Set Text Fields
      Object.entries(textFields).forEach(([fieldName, value]) => {
        try {
          const textField = form.getTextField(fieldName);
          if (textField) {
            textField.setText(value.toString());
          } else {
            console.warn(`Text field "${fieldName}" not found in the PDF.`);
          }
        } catch (error) {
          console.error(`Error setting text field "${fieldName}":`, error);
        }
      });

      // Set Checkboxes
      Object.entries(checkBoxFields).forEach(([fieldName, value]) => {
        try {
          const checkbox = form.getCheckBox(fieldName);
          if (checkbox) {
            if (value.toString().toLowerCase() === "yes") {
              checkbox.check();
            } else {
              checkbox.uncheck();
            }
          } else {
            console.warn(`Checkbox field "${fieldName}" not found in the PDF.`);
          }
        } catch (error) {
          console.error(`Error setting checkbox field "${fieldName}":`, error);
        }
      });

      const updatedPdfBytes = await pdfDoc.save();
      const blob = new Blob([updatedPdfBytes], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error pre-filling PDF:", error);
      return getPDFFile(); // Return original PDF if error occurs
    }
  };

  useEffect(() => {
    const loadPrefilledPDF = async () => {
      if (!patientId) {
        console.error("No patient ID provided.");
        return;
      }

      try {
        setLoading(true);
        const data = await fetchPatientData();
        setPatientData(data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPrefilledPDF();
  }, [patientId]);

  useEffect(() => {
    const generatePDF = async () => {
      if (!patientData) return;

      setLoading(true);
      const prefilledPDFUrl = await getPrefilledPDFFile();
      if (prefilledPDFUrl) {
        setPdfUrl(prefilledPDFUrl);
        setIframeKey((prevKey) => prevKey + 1);
      }
      setLoading(false);
    };

    generatePDF();
  }, [formType, patientType, patientData]);

  const handleFormChange = (newFormType: string) => {
    setFormType(newFormType);
  };

  const handlePatientTypeChange = (newPatientType: PatientType) => {
    setPatientType(newPatientType);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center">
                <Link
                  onClick={() => setPatientData(null)}
                  to={`/patient/${patientId}`}
                  className="mr-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200 flex items-center"
                  aria-label="Go back to Patient Records"
                >
                  <ArrowLeft className="h-6 w-6" />
                </Link>
                <h2 className="text-3xl font-bold">Generate PDF</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-700">
                      Patient ID:
                    </span>
                    <span className="bg-gray-200 px-3 py-1 rounded-full text-gray-700">
                      {patientId}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 col-span-2">
                    <span className="font-semibold text-gray-700">
                      Form Type:
                    </span>
                    <div className="flex space-x-2">
                      {["CSF", "Claim Form 1", "Claim Form 2"].map((type) => (
                        <button
                          key={type}
                          onClick={() => handleFormChange(type)}
                          className={`px-4 py-2 rounded-md transition duration-300 ease-in-out ${
                            formType === type
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="font-semibold text-gray-700 mr-2">
                    Patient Type:
                  </span>
                  <div
                    className="inline-flex rounded-md shadow-sm"
                    role="group"
                  >
                    <button
                      type="button"
                      onClick={() => handlePatientTypeChange("Parent")}
                      className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                        patientType === "Parent"
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      } border border-gray-200`}
                    >
                      Parent
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePatientTypeChange("Child")}
                      className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                        patientType === "Child"
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      } border border-gray-200`}
                    >
                      Child
                    </button>
                  </div>
                </div>

                <div
                  className="relative rounded-lg overflow-hidden shadow-md"
                  style={{ height: "70vh" }}
                >
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                      <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                    </div>
                  )}
                  {pdfUrl && (
                    <iframe
                      key={iframeKey}
                      src={pdfUrl}
                      title="PDF Viewer"
                      width="100%"
                      height="100%"
                      onLoad={handleIframeLoad}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GeneratePDF;
