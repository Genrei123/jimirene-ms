import axiosInstance from "../config/axiosConfig";

export const addPatientLog = async (patientId: number, purpose: string) => {
return axiosInstance.post(`/addPatientLog`, null, {
    params: {
        patientId: patientId,
        purpose: purpose
    }
});
};

export const getPatientLogs = async (patientId: number) => {
return axiosInstance.get(`/getPatientLogs`, {
    params: {
        patientId: patientId
    }
});
};