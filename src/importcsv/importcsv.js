import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../Pagination/Pagination";
import Button from "../components/Button/Button";
import PageTitle from "../components/Common/PageTitle"; 
import Swal from "sweetalert2";

function ImportCSVPage() {
  const fileInputRef = useRef(null);
  const [data, setData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const sendEmail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/excel/map-fields`,
        { headers }
      );

      if (response.data) {
        const count = response.data.emailsSentCount;
        Swal.fire({
          icon: "success",
          title: "Emails Sent",
          text: `Successfully sent ${count} emails.`,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Failed to send emails.",
        });
      }
    } catch (error) {
      console.error("Error sending mails:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error occurred while sending mails.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const uploadResponse = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/excel/upload-excel`,
        formData,
        { headers }
      );

      if (uploadResponse.data.message) {
        setRefreshKey((prev) => prev + 1); // Trigger re-fetch of data
      } else {
        // You can alert here if you want to notify failure
      }
    } catch (error) {
      console.error("CSV upload error:", error);
      alert("Error uploading CSV file.");
    }

    e.target.value = null; // Reset file input
  };

  // Corrected fetchData function:
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/list/salary`,
        { headers }
      );

      if (response.data) {
        setData(response.data.data); // Assuming your data is in response.data.data
        setCurrentPage(1);
      } else {
        alert("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };
  return (
    <div>
      <div className="flex justify-between p-4">
        <div className="sm:mr-4">
          <PageTitle title="Import CSV" />
        </div>
        <div className="flex gap-3">
         <Button
            onClick={sendEmail}
            block={1}
            size="sm"
            style={{ width: "100px", height: "40px" }}
            disabled={loading}
            >
      {loading ? "Sending..." : "Send Mail"}
    </Button>
        <div>
          <Button
            onClick={handleImportClick}
            block={1}
            size="sm"
            style={{ width: "100px", height: "40px" }}
          >
            + Import
          </Button>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Employee Code</th>
                <th className="px-6 py-3">F/H Name</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Designation</th>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3">Gross Salary</th>
                <th className="px-6 py-3">Net Salary</th>
                <th className="px-6 py-3">Total Leave</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <tr
                    key={idx}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4">{item.employeeName || "N/A"}</td>
                    <td className="px-6 py-4">{item.email || "N/A"}</td>
                    <td className="px-6 py-4">{item.employeeCode || "N/A"}</td>
                    <td className="px-6 py-4">{item.fatherName || "N/A"}</td>
                    <td className="px-6 py-4">{item.department || "N/A"}</td>
                    <td className="px-6 py-4">{item.designation || "N/A"}</td>
                    <td className="px-6 py-4">{item.companyName || "N/A"}</td>
                    <td className="px-6 py-4">{item.grossSalary || "N/A"}</td>
                    <td className="px-6 py-4">{item.netSalary || "N/A"}</td>
                    <td className="px-6 py-4">{item.totalLeaves || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-center mt-4">
            <button
              className="px-3 py-1 border rounded mr-2"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="mx-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-3 py-1 border rounded ml-2"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>

            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="ml-6 border rounded px-2 py-1"
            >
              {[10, 20, 30, 40, 50, 80, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImportCSVPage;
