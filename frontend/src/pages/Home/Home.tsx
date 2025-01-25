import type React from "react"
import { useState, useEffect } from "react"
import Sidebar from "../../components/Sidebar"
import Navbar from "../../components/Navbar"
import PatientProfileModal from "./PatientProfileModal"
import useModal from "./useModal"
import { Maximize2, Minimize2 } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import type Patient from "../../types/Patient"
import { createEmptyPatient } from "../../utils/Patient"
import { getPatients } from "../../services/patientService"
import { getServices } from "../../services/serviceService"

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { isModalOpen, openModal, closeModal } = useModal()
  const [formData, setFormData] = useState<Patient>(createEmptyPatient())
  const [fullscreenTable, setFullscreenTable] = useState<"services" | "patients" | null>(null)
  const [patients, setPatients] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [loadingPatients, setLoadingPatients] = useState<boolean>(true)
  const [loadingServices, setLoadingServices] = useState<boolean>(true)
  const [token, setToken] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<{
    services: number
    patients: number
  }>({
    services: 1,
    patients: 1,
  })
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedRole = localStorage.getItem("userRole")
    const storedName = localStorage.getItem("username")

    if (storedToken) {
      setToken(storedName)
    }

    if (!storedToken || !storedRole) {
      navigate("/login")
      return
    }

    const fetchPatients = async () => {
      try {
        const response = await getPatients()
        setPatients(response)
      } catch (error) {
        console.error("Error fetching patients:", error)
      } finally {
        setLoadingPatients(false)
      }
    }

    const fetchServices = async () => {
      try {
        const response = await getServices()
        const formattedServices = response.data.map((service: any) => ({
          name: service.service_name,
          branch: service.branch.branch_name || "Main Branch",
          price: service.service_price,
        }))
        setServices(formattedServices)
      } catch (error) {
        console.error("Error fetching services:", error)
      } finally {
        setLoadingServices(false)
      }
    }

    fetchPatients()
    fetchServices()
  }, [navigate])

  const toggleFullscreen = (table: "services" | "patients") => {
    setFullscreenTable(fullscreenTable === table ? null : table)
  }

  const handleViewClick = (id: number) => {
    navigate(`/patient/${id}`)
  }

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = Number.parseInt(e.target.value, 10)
    setItemsPerPage(newItemsPerPage)
    setCurrentPage({ services: 1, patients: 1 })
  }

  const extractClientID = (data: string): string | null => {
    try {
      const url = new URL(data)
      const pathname = url.pathname
      const segments = pathname.split("/")

      if (segments.length >= 3 && segments[1] === "patient") {
        return segments[2]
      }

      if (/^\d+$/.test(data)) {
        return data
      }

      return null
    } catch (error) {
      if (/^\d+$/.test(data)) {
        return data
      }
      return null
    }
  }

  const handleQRCodeScan = (data: string | null) => {
    if (data) {
      const clientID = extractClientID(data)
      if (clientID) {
        navigate(`/patient/${clientID}`)
      } else {
        alert("Invalid QR Code format. Please try again.")
      }
    }
  }

  const renderTable = (tableType: "services" | "patients") => {
    const isFullscreen = fullscreenTable === tableType
    const tableClass = `bg-white rounded-lg shadow-md overflow-hidden ${
      isFullscreen ? "fixed inset-0 z-50 flex flex-col" : ""
    }`

    const data = tableType === "services" ? services : patients
    const currentPageData = data.slice(
      (currentPage[tableType] - 1) * itemsPerPage,
      currentPage[tableType] * itemsPerPage,
    )
    const totalPages = Math.ceil(data.length / itemsPerPage)

    const handlePageChange = (newPage: number) => {
      setCurrentPage((prev) => ({ ...prev, [tableType]: newPage }))
    }

    return (
      <div className={tableClass}>
        <div className="px-6 py-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
          <h2 className={`font-semibold text-gray-800 ${isFullscreen ? "text-2xl lg:text-3xl" : "text-xl"}`}>
            {tableType === "services" ? "Services" : "Recent Patients"}
          </h2>
          <button
            onClick={() => toggleFullscreen(tableType)}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
          </button>
        </div>
        <div className={`p-6 ${isFullscreen ? "flex-grow overflow-auto" : ""}`}>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-base lg:text-lg">
              <thead>
                <tr className="bg-gray-50 text-gray-700 uppercase leading-normal">
                  {tableType === "services" ? (
                    <>
                      <th className="py-4 px-6 text-left font-semibold">Service Name</th>
                      <th className="py-4 px-6 text-left font-semibold">Branch</th>
                      <th className="py-4 px-6 text-right font-semibold">Price</th>
                    </>
                  ) : (
                    <>
                      <th className="py-4 px-6 text-center font-semibold">No</th>
                      <th className="py-4 px-6 text-left font-semibold">Name</th>
                      <th className="py-4 px-6 text-center font-semibold">Gender</th>
                      <th className="py-4 px-6 text-center font-semibold">Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {tableType === "services" ? (
                  loadingServices ? (
                    <tr>
                      <td colSpan={3} className="text-center py-4">
                        Loading...
                      </td>
                    </tr>
                  ) : currentPageData.length > 0 ? (
                    currentPageData.map((service, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-4 px-6 text-left">{service.name}</td>
                        <td className="py-4 px-6 text-left">{service.branch}</td>
                        <td className="py-4 px-6 text-right">PHP {service.price}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-4">
                        No services available.
                      </td>
                    </tr>
                  )
                ) : loadingPatients ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : Array.isArray(currentPageData) && currentPageData.length > 0 ? (
                  currentPageData.map((patient, index) => (
                    <tr key={patient.patientID} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-6 text-center">{index + 1}</td>
                      <td className="py-4 px-6 text-left">{`${patient.givenName} ${patient.lastName}`}</td>
                      <td className="py-4 px-6 text-center">{patient.sex === "M" ? "Male" : "Female"}</td>
                      <td className="py-4 px-6 text-center">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-base transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                          onClick={() => handleViewClick(patient.clientID)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div>
              <span className="text-gray-700 text-lg">
                Page {currentPage[tableType]} of {totalPages || 1}
              </span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handlePageChange(currentPage[tableType] - 1)}
                disabled={currentPage[tableType] === 1}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-base font-medium hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage[tableType] + 1)}
                disabled={currentPage[tableType] === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-base font-medium hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-4xl font-semibold text-gray-800 mb-6">Welcome, {token}!</h1>
            <div className="flex justify-end space-x-4 mb-8">
              <button
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg text-lg"
                onClick={openModal}
              >
                Create Patient Profile
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {renderTable("services")}
              {renderTable("patients")}
            </div>
          </div>
        </main>
      </div>
      <PatientProfileModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}

export default Home;

