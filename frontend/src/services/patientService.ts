import axiosInstance from "../config/axiosConfig";
import Patient from "../types/Patient"; // Assume you have a `Patient` type/interface defined.

// Add a patient
export const addPatient = async (patient: Patient): Promise<Patient> => {
    const response = await axiosInstance.post<Patient>("/addPatient", patient);
    return response.data;
  };
  
  // Get all patients
  export const getPatients = async (): Promise<Patient[]> => {
    const response = await axiosInstance.get<Patient[]>("/getPatient");
    return response.data;
  };
  
  // Search patients
  export const searchPatients = async (query: string): Promise<Patient[]> => {
    const response = await axiosInstance.get<Patient[]>("/searchPatients", { params: { query } });
    return response.data;
  };
  
  // Get patient by ID
  export const getPatientById = async (id: number): Promise<Patient> => {
    const response = await axiosInstance.get<Patient>(`/getPatient/${id}`);
    return response.data;
  };
  
  // Update patient
  export const updatePatient = async (patient: Patient): Promise<Patient> => {
    const response = await axiosInstance.patch<Patient>("/updatePatient", patient);
    return response.data;
  };
  
  // Delete patient
  export const deletePatient = async (id: number): Promise<string> => {
    const response = await axiosInstance.delete<string>(`/deletePatient/${id}`);
    return response.data;
  };