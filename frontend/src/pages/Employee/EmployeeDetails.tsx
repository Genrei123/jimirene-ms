// src/pages/EmployeeDetail/EmployeeDetail.tsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import {
  Camera,
  Upload,
  FileText,
  UserCheck,
  Calendar,
  Clock,
  ChevronRight,
  Edit,
  Plus,
  Trash2,
} from "lucide-react";
import { getEmployeeById } from "../../services/employeeService"; // Implement this service
import { Employee } from "../../types/Employee";
import axiosInstance from "../../config/axiosConfig"; // If needed for image uploads

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [employeeImage, setEmployeeImage] = useState<string | null>(null);
  

  // Ref for hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        if (id) {
          const data = await getEmployeeById(Number(id));
          setEmployee(data);
          
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !employee) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setEmployeeImage(result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("employeeId", String(employee.employeeID));

      try {
        const response = await axiosInstance.post(
          "/uploadEmployeeImage",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          console.log("Image uploaded successfully:", response.data);
          if (response.data.imagePath) {
            setEmployeeImage(response.data.imagePath);
          }
        } else {
          console.error("Upload failed with status:", response.status);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    },
    [employee]
  );

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <p>Loading employee details...</p>
          </main>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <p>Employee not found.</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                <h2 className="text-3xl font-bold">
                  {employee.username}'s Profile
                </h2>
                <p className="mt-2 text-green-100">Employee ID: {employee.employeeID}</p>
              </div>

              {/* Main Content */}
              <div className="p-6 grid md:grid-cols-2 gap-6">
                {/* Profile Image and Basic Info */}
                <div className="space-y-6">
                  {/* Profile Image Upload */}
                  <div className="relative group">
                    <div className="w-64 h-64 mx-auto bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                      {employeeImage ? (
                        <img
                          src={employeeImage}
                          alt="Employee"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      id="employee-image-upload"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <label
                      htmlFor="employee-image-upload"
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    >
                      <Upload className="w-8 h-8 mr-2" />
                      Upload Image
                    </label>
                  </div>

                  {/* Employee Basic Information */}
                  <div className="bg-gray-50 p-4 rounded-lg shadow">
                    <p className="flex items-center text-gray-700">
                      <UserCheck className="w-5 h-5 mr-2 text-green-500" />
                      <span className="font-semibold mr-2">Employee ID:</span>{" "}
                      {employee.employeeID}
                    </p>
                    <p className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-2 text-green-500" />
                      <span className="font-semibold mr-2">Username:</span>{" "}
                      {employee.username}
                    </p>
                    <p className="flex items-center text-gray-700">
                      <FileText className="w-5 h-5 mr-2 text-green-500" />
                      <span className="font-semibold mr-2">Email:</span>{" "}
                      {employee.email}
                    </p>
                    <p className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 mr-2 text-green-500" />
                      <span className="font-semibold mr-2">Role:</span>{" "}
                      {employee.role}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg shadow">
                    <div className="space-y-4">
                      {/* Edit Employee Details */}
                      <button
                        
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center"
                      >
                        <Edit className="w-5 h-5 mr-2" />
                        Edit Details
                      </button>
                      {/* Additional Actions */}
                      <button
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Additional Info
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDetails;
