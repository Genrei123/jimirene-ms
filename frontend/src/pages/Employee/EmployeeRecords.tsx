import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Search,
  RefreshCw,
} from "lucide-react";
import { getEmployees } from "../../services/employeeService"; // Adjust the path if necessary
import { Employee } from "../../types/Employee";

const EmployeeRecords: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState(""); // State for filtering by role
  const [filterEmail, setFilterEmail] = useState(""); // State for filtering by email
  const [viewArchived, setViewArchived] = useState(false); // If applicable
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 10;

  const navigate = useNavigate();

  // Fetch employees from the backend
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const data = await getEmployees();
        console.log(data);
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    

    fetchEmployees();
  }, []);

  // Filter employees based on search term, role, email, and viewArchived
  const filteredEmployees = employees
    
    .filter(
      (employee) =>
        `${employee.username || ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((employee) => (filterRole ? employee.role === filterRole : true))
    .filter((employee) => (filterEmail ? employee.email.includes(filterEmail) : true))
    // Sort the filtered results by employeeID or any other field
    .sort((a, b) => a.employeeID - b.employeeID);

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewClick = (id: number) => {
    navigate(`/employee/${id}`); // Ensure you have a route set up for employee details
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-green-500 to-green-600">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Users className="mr-2" />
                  {viewArchived ? "Archived Employee Records" : "Employee Records"}
                </h2>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search employees..."
                      className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  </div>
                  <div className="flex space-x-2">
                    
                    
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                      onClick={() => window.location.reload()}
                    >
                      <RefreshCw className="mr-2" size={18} />
                      Refresh
                    </button>
                    
                  </div>
                </div>
                {loading ? (
                  <div className="text-center py-10">Loading employees...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <th className="px-6 py-3">ID</th>
                          <th className="px-6 py-3">Username</th>
                          <th className="px-6 py-3">Email</th>
                          <th className="px-6 py-3">Role</th>
                          <th className="px-6 py-3">Last Login</th>
                          
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedEmployees.map((employee) => (
                          <tr
                            key={employee.id}
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">{employee.employeeID}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{employee.username}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{employee.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {employee.loginTimeStamp
                                ? employee.loginTimeStamp[0] + "/" + employee.loginTimeStamp[1]  + "/" + employee.loginTimeStamp[2]
                                : "Never"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * rowsPerPage, filteredEmployees.length)}
                    </span>{" "}
                    of <span className="font-medium">{filteredEmployees.length}</span> results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium ${
                          currentPage === page
                            ? "bg-green-500 text-white"
                            : "text-gray-700 bg-white hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
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

export default EmployeeRecords;