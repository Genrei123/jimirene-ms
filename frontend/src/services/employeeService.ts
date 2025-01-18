import axiosInstance from "../config/axiosConfig";
import { Employee } from "../types/Employee";

export const getEmployees = async (): Promise<Employee[]> => {
    const response = await axiosInstance.get<Employee[]>(`/employees`);
    return response.data;
};
  
export const getEmployeeById = async (id: number): Promise<Employee> => {
    const response = await axiosInstance.get<Employee>(`/readEmployee/${id}`);
    return response.data;
};

