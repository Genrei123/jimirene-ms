import { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";
import Sidebar from "../components/Sidebar";

export default function AccountDetails() {
  const [accounts, setAccounts] = useState([]);
  const [accountData, setAccountData] = useState({
    employeeID: "",
    username: "",
    email: "",
    role: "",
    password: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch accounts from the backend
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axiosInstance.get("/users"); // Replace with your backend endpoint
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setMessage("Failed to fetch accounts.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountData((prevData) => ({
      ...prevData,
      [name]: name === "employeeID" ? Number(value) : value, // Ensure employeeID is a number
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        if (isEditing) {
            // Update account
            await axiosInstance.put(`/updateAccount/${accountData.employeeID}`, accountData, config);


            setMessage("Account updated successfully!");
        } else {
            // Add new account
            await axiosInstance.post("/add", accountData, config);

            setMessage("Account added successfully!");
        }

        fetchAccounts();
        resetForm();
        setIsModalOpen(false);
    } catch (error) {
        // Handle the structured error response
        if (error.response && error.response.data) {
            const { message, metadata } = error.response.data;
            console.error("Error details:", metadata);
            setMessage(`Error: ${message}`);
        } else {
            setMessage("An unexpected error occurred.");
        }
    }
};


  const handleEdit = (account) => {
    setAccountData(account);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (employeeID) => {
    console.log("Deleting employee with ID:", employeeID); // Debugging line
    try {
      await axiosInstance.delete(`/deleteAccount/${employeeID}`);
      setAccounts((prev) =>
        prev.filter((account) => account.employeeID !== employeeID)
      );
      setMessage("Account deleted successfully!");
    } catch (error) {
      console.error("Error deleting account:", error);
      setMessage("An error occurred while deleting the account.");
    }
  };
  
  
  

  const resetForm = () => {
    setAccountData({
      employeeID: "",
      username: "",
      email: "",
      role: "",
      password: "",
    });
    setIsEditing(false);
    setMessage("");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Account Details
            </h1>
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Account
            </button>
          </div>
          {message && (
            <div
              className={`p-4 mb-6 rounded-md ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Account List or Empty State */}
          {accounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <div
                  key={account.employeeID}
                  className="bg-white shadow-md rounded-lg p-6"
                >
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {account.username}
                  </h3>
                  <p className="text-gray-600 mb-4">Role: {account.role}</p>
                  <p className="text-gray-600 mb-4">Email: {account.email}</p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEdit(account)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    >
                      Edit
                    </button>
                    <button
  onClick={() => handleDelete(account.employeeID)}
  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
>
  Delete
</button>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                No accounts available
              </h2>
              <p className="text-gray-600 mb-6">
                Start by adding a new account to manage users effectively.
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Your First Account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {isEditing ? "Edit Account" : "Add New Account"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="employeeID"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Employee ID
                </label>
                <input
  type="number"
  id="employeeID"
  name="employeeID"
  value={accountData.employeeID}
  onChange={handleChange}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  required
/>

              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={accountData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={accountData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={accountData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {!isEditing && (
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={accountData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isEditing ? "Update Account" : "Add Account"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
