import { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosConfig';
import Sidebar from '../components/Sidebar';

export default function AccountBranches() {
  const [branches, setBranches] = useState<{ branchID: number; branch_name: string; branch_address: string; branch_contact: string }[]>([]);
  const [branchData, setBranchData] = useState({
    branchID: 0,
    branch_name: '',
    branch_address: '',
    branch_contact: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch branches from the backend
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      console.log(response.data);
      setBranches(response.data);

    } catch (error) {
      console.error('Error fetching branches:', error);
      setMessage('Failed to fetch branches.');
    }
  };

  const handleChange = (e) => {
    setBranchData({
      ...branchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update branch
        await axiosInstance.put(`/updateBranch/${branchData.branchID}`, branchData);
        setMessage('Branch updated successfully!');
      } else {
        // Add new branch
        await axiosInstance.post('/addBranch', branchData);
        setMessage('Branch added successfully!');
      }
      fetchBranches();
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving branch:', error);
      setMessage(error.response?.data?.message || 'An error occurred while saving the branch.');
    }
  };

  const handleEdit = (branch) => {
    setBranchData(branch);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.put(`/deleteBranch/${id}`);
      setBranches((prev) => prev.filter((branch) => branch.branchID !== id));
      setMessage('Branch deleted successfully!');
    } catch (error) {
      console.error('Error deleting branch:', error);
      setMessage('An error occurred while deleting the branch.');
    }
  };

  const resetForm = () => {
    setBranchData({
      branchID: 0,
      branch_name: '',
      branch_address: '',
      branch_contact: '',
    });
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Account Branches</h1>
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Branch
            </button>
          </div>
          {message && (
            <div
              className={`p-4 mb-6 rounded-md ${
                message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          {/* Branch List or Empty State */}
          {branches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch) => (
                <div key={branch.branchID} className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{branch.branch_name}</h3>
                  <p className="text-gray-600 mb-2">{branch.branch_address}</p>
                  <p className="text-gray-600 mb-4">{branch.branch_contact}</p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEdit(branch)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(branch.branchID)}
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
              <h2 className="text-xl font-semibold text-gray-700 mb-4">No branches available</h2>
              <p className="text-gray-600 mb-6">Start by adding a new branch to manage your locations effectively.</p>
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Your First Branch
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
              {isEditing ? 'Edit Branch' : 'Add New Branch'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="branch_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Name
                </label>
                <input
                  type="text"
                  id="branch_name"
                  name="branch_name"
                  value={branchData.branch_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="branch_address" className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Address
                </label>
                <input
                  type="text"
                  id="branch_address"
                  name="branch_address"
                  value={branchData.branch_address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="branch_contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Contact
                </label>
                <input
                  type="text"
                  id="branch_contact"
                  name="branch_contact"
                  value={branchData.branch_contact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isEditing ? 'Update Branch' : 'Add Branch'}
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