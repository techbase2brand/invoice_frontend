import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../Pagination/Pagination";
import "react-datepicker/dist/react-datepicker.css";
import { defaultInputSmBlack } from "../constants/defaultStyles";
import { Link } from "react-router-dom";

const CreditList = () => {
  const [data, setData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      const headers = {
        Authorization: `Bearer ${token}`, // Use the token from localStorage
        "Content-Type": "application/json", // Add any other headers if needed
      };
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/credit-history`,
          { headers }
        );
        if (response.data.success) {
          setData(response.data.data.reverse());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = currentItems.filter(
    (item) =>
      item.accNo.includes(searchTerm) ||
      item.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.stateMentDate.includes(searchTerm) ||
      item.dueDate.includes(searchTerm)
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // reset to page 1 when items per page changes
  };
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    const headers = {
      Authorization: `Bearer ${token}`, // Use the token from localStorage
      "Content-Type": "application/json", // Add any other headers if needed
    };
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/delete-credit-data/${id}`,
        { headers }
      );
      setData(data.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting bank detail:", error);
    }
  };
  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div style={{ display: "flex", gap: "3px" }}>
          <div className="client-form-wrapper" style={{ width: "12%" }}>
            <input
              type="text"
              placeholder="Search"
              className={defaultInputSmBlack}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Acc. No
              </th>
              <th scope="col" className="px-6 py-3">
                Bank Name
              </th>
              <th scope="col" className="px-6 py-3">
                Statement Date
              </th>
              <th scope="col" className="px-6 py-3">
                Due Date
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={item._id}
              >
                <td className="px-6 py-4">{item.accNo}</td>
                <td className="px-6 py-4">{item.bankName}</td>
                <td className="px-6 py-4">
                  {item.stateMentDate?.split("T")[0]}
                </td>
                <td className="px-6 py-4">{item.dueDate?.split("T")[0]}</td>
                <td style={{ display: "flex", gap: "1rem" }}>
                  <Link to={`/credit-form/${item._id}`}>
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="feather feather-edit"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </span>
                  </Link>
                  <span onClick={() => handleDelete(item._id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="24"
                      height="24"
                      viewBox="0 0 16 16"
                    >
                      <path d="M 6.496094 1 C 5.675781 1 5 1.675781 5 2.496094 L 5 3 L 2 3 L 2 4 L 3 4 L 3 12.5 C 3 13.328125 3.671875 14 4.5 14 L 10.5 14 C 11.328125 14 12 13.328125 12 12.5 L 12 4 L 13 4 L 13 3 L 10 3 L 10 2.496094 C 10 1.675781 9.324219 1 8.503906 1 Z M 6.496094 2 L 8.503906 2 C 8.785156 2 9 2.214844 9 2.496094 L 9 3 L 6 3 L 6 2.496094 C 6 2.214844 6.214844 2 6.496094 2 Z M 5 5 L 6 5 L 6 12 L 5 12 Z M 7 5 L 8 5 L 8 12 L 7 12 Z M 9 5 L 10 5 L 10 12 L 9 12 Z"></path>
                    </svg>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <button
            className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="flex items-center justify-center mx-4">
            Page {currentPage} of {totalPages}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
          <button
            className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ml-2"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <div className="mb-4 ml-20">
            <label htmlFor="itemsPerPage" className="mr-2 font-medium">
              Items per page:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border rounded px-2 py-1"
            >
              {[10, 20, 30, 40, 50, 80, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditList;
