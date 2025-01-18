import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../config/axiosConfig";
import { Service } from "../../types/Service";
import { Branch } from "../../types/Branch";
import { RenderedService } from "../../types/RenderedService";
import { RenderedServiceDetail } from "../../types/RenderedServiceDetail";
import { ChartData } from "../../types/ChartData";

// Interface for Item (Medicine)
interface Item {
  itemID: number;
  status: string;
  branch: Branch;
  item_name: string;
  item_quantity: number;
  item_price: number;
  item_stock: number;
  manufacture_date: string;
  exp_date: string;
}

const Report: React.FC = () => {
  const [serviceData, setServiceData] = useState<ChartData[]>([]);
  const [medicineData, setMedicineData] = useState<ChartData[]>([]);
  const [stockData, setStockData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesResponse, renderedServicesResponse, itemsResponse] =
          await Promise.all([
            axiosInstance.get<Service[]>("/service/getServices"),
            axiosInstance.get<RenderedService[]>("/service/getRenderedServices"),
            axiosInstance.get<Item[]>("/items"),
          ]);
    
        setServices(servicesResponse.data);
        aggregateData(renderedServicesResponse.data, itemsResponse.data);
      } catch (err: any) {
        console.error("Error fetching data:", err);

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const aggregateData = (
    renderedServices: RenderedService[],
    items: Item[]
  ) => {
    const serviceCountMap: { [key: string]: number } = {};
    const medicineCountMap: { [key: string]: number } = {};
    const stockMap: { [key: string]: number } = {};

    // Initialize stockMap and medicineCountMap
    items.forEach((item) => {
      stockMap[item.item_name] = item.item_stock;
      // “Sold” = initial item_quantity - current item_stock
      medicineCountMap[item.item_name] =
        (medicineCountMap[item.item_name] || 0) +
        (item.item_quantity - item.item_stock);
    });

    // Aggregate services
    renderedServices.forEach((renderedService) => {
      renderedService.services.forEach((service) => {
        serviceCountMap[service.serviceName] =
          (serviceCountMap[service.serviceName] || 0) + 1;
      });
    });

    // Convert maps to ChartData
    setServiceData(
      Object.entries(serviceCountMap).map(([name, value]) => ({
        name,
        value,
      }))
    );
    setMedicineData(
      Object.entries(medicineCountMap).map(([name, value]) => ({
        name,
        value,
      }))
    );
    setStockData(
      Object.entries(stockMap).map(([name, value]) => ({
        name,
        value,
      }))
    );
  };

  /**
   * Combine medicineData (sold) and stockData into a single array
   * so that each row can show: Medicine Name | Sold | Current Stock
   */
  const combinedMedicineData = medicineData.map((medicine) => {
    const stock = stockData.find((s) => s.name === medicine.name);
    return {
      name: medicine.name,
      sold: medicine.value,
      stock: stock ? stock.value : 0,
    };
  });

  /** 
   * For your pie charts, calculates the conic-gradient style
   */
  const calculateGradient = (data: ChartData[]) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    let cumulativePercentage = 0;
    return (
      "conic-gradient(" +
      data
        .map((item, index) => {
          const start = (cumulativePercentage / total) * 100;
          cumulativePercentage += item.value;
          const end = (cumulativePercentage / total) * 100;
          return `${getColor(index)} ${start}% ${end}%`;
        })
        .join(", ") +
      ")"
    );
  };

  /**
   * Helper to pick colors for the segments
   */
  const getColor = (index: number) => {
    const colors = [
      "#4EAACB",
      "#FF1E1E",
      "#54FB3E",
      "#FFA500",
      "#800080",
      "#FFB6C1",
      "#8A2BE2",
    ];
    return colors[index % colors.length];
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <Navbar />

        <main className="p-6 space-y-6">
          {/* Services Table */}
          <section className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Services Rendered</h2>
            <table className="w-full text-left table-auto border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Service Name</th>
                  <th className="px-4 py-2">Times Rendered</th>
                </tr>
              </thead>
              <tbody>
                {serviceData.map((service, index) => (
                  <tr
                    key={service.name}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="border px-4 py-2">{service.name}</td>
                    <td className="border px-4 py-2">{service.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Medicines Table */}
          <section className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Medicines</h2>
            <table className="w-full text-left table-auto border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Medicine Name</th>
                  <th className="px-4 py-2">Sold</th>
                  <th className="px-4 py-2">Current Stock</th>
                </tr>
              </thead>
              <tbody>
                {combinedMedicineData.map((med, index) => (
                  <tr
                    key={med.name}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="border px-4 py-2">{med.name}</td>
                    <td className="border px-4 py-2">{med.sold}</td>
                    <td className="border px-4 py-2">{med.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Pie Charts Section */}
          <section className="grid grid-cols-2 gap-6">
            {/* Services Pie Chart */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Services Rendered</h2>
              <div className="flex items-center justify-center">
                <div
                  className="pie-chart"
                  style={{
                    background: calculateGradient(serviceData),
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                  }}
                ></div>
              </div>
              <ul className="mt-6">
                {serviceData.map((item, index) => (
                  <li key={index} className="flex items-center mb-2">
                    <span
                      className="w-4 h-4 inline-block mr-2"
                      style={{ backgroundColor: getColor(index) }}
                    ></span>
                    {item.name}: {item.value}
                  </li>
                ))}
              </ul>
            </div>

            {/* Medicines Pie Chart */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Medicines Sold</h2>
              <div className="flex items-center justify-center">
                <div
                  className="pie-chart"
                  style={{
                    background: calculateGradient(medicineData),
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                  }}
                ></div>
              </div>
              <ul className="mt-6">
                {medicineData.map((item, index) => (
                  <li key={index} className="flex items-center mb-2">
                    <span
                      className="w-4 h-4 inline-block mr-2"
                      style={{ backgroundColor: getColor(index) }}
                    ></span>
                    {item.name}: {item.value}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Report;

// This function can be used to process or store the services data if needed
const setServices = (data: Service[]) => {
  console.log("Services data:", data);
};
