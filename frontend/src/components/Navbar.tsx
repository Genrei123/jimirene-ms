import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Search, X } from "lucide-react";
import CalendarModal from "./modals/CalendarModal";
import SettingsModal from "./modals/SettingsModal";
import NotificationsModal from "./modals/NotificationsModal";
import LogoutModal from "./modals/LogoutModal";
import { searchPatients } from "../services/patientService";
import Patient from "../types/Patient";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleViewClick = (id: number) => {
    navigate(`/patient/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setFilteredPatients([]);
    setError(null);

    if (query.trim() === "") {
      setFilteredPatients([]);
      return;
    }

    setLoading(true);
    try {
      const result = await searchPatients(query);
      if (result.length === 0) {
        setError("No results found.");
      } else {
        setFilteredPatients(result);
      }
    } catch (err: any) {
      console.error("Search error:", err);
      setError("No patient matches " + query + " Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-2 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Search Results Dropdown */}
          {(filteredPatients.length > 0 || error || loading) && (
            <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg">
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Search Results:
                  </h3>
                  <button
                    onClick={() => {
                      setFilteredPatients([]);
                      setError(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {loading && (
                  <p className="text-sm text-gray-600 text-center">
                    Searching...
                  </p>
                )}
                {!loading && error && (
                  <p className="text-sm text-gray-600 text-center">{error}</p>
                )}
                {!loading && !error && (
                  <ul className="divide-y divide-gray-200">
                    {filteredPatients.map((patient) => (
                      <li
                        key={patient.clientID}
                        className="py-3 flex justify-between items-center hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                      >
                        <div>
                          <span className="font-medium text-gray-800">
                            {patient.lastName + " " + patient.givenName}
                          </span>
                          <p className="text-sm text-gray-600">
                            {patient.sex}, Age: {patient.age}
                          </p>
                        </div>
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-full text-xs transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                          onClick={() => handleViewClick(patient.clientID)}
                        >
                          View
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <NavbarButton
            onClick={() => setIsLogoutModalOpen(true)}
            icon={LogOut}
            label="Logout"
          />
        </div>
      </nav>

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

interface NavbarButtonProps {
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

const NavbarButton: React.FC<NavbarButtonProps> = ({
  onClick,
  icon: Icon,
  label,
}) => (
  <button
    onClick={onClick}
    className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
    aria-label={label}
  >
    <Icon className="h-6 w-6" />
  </button>
);

export default Navbar;
