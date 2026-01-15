import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useRoutes } from "react-router-dom";
import { defaultInputSmBlack } from "../constants/defaultStyles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "../Pagination/Pagination";
function Project_cost() {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState(() => {
    return sessionStorage.getItem("searchTerm") || "";
  });
  const [selectedDays, setSelectedDays] = useState(
    () => sessionStorage.getItem("selectedDays") || ""
  );
  const [paymentStatus, setPaymentStatus] = useState(
    () => sessionStorage.getItem("paymentStatus") || ""
  );
  const [duplicateFilter, setDuplicateFilter] = useState(
    () => sessionStorage.getItem("duplicateFilter") || ""
  );
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = invoices.slice(indexOfFirstItem, indexOfLastItem);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("");
const Router  = useNavigate();
  const [openItemId, setOpenItemId] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const dropdownRef = useRef(null);

  const handleToggleDropdown = (itemId) => {
    if (openItemId === itemId) {
      setOpenItemId(null);
    } else {
      setOpenItemId(itemId);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSort = (columnName) => {
    if (sortColumn === columnName) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnName);
      setSortOrder("asc");
    }
  };

  const sortedItems = currentItems.sort((a, b) => {
    if (sortColumn === "clientName") {
      return sortOrder === "asc"
        ? a.clientName.localeCompare(b.clientName)
        : b.clientName.localeCompare(a.clientName);
    } else if (sortColumn === "company") {
      return sortOrder === "asc"
        ? a.company.localeCompare(b.company)
        : b.company.localeCompare(a.company);
    }
    return sortOrder === "asc"
      ? a.clientName.localeCompare(b.clientName)
      : b.clientName.localeCompare(a.clientName);
  });

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // reset to page 1 when items per page changes
  };
  // const handleStartDateChange = (date) => {
  //     setStartDate(date);
  // };

  // const handleEndDateChange = (date) => {
  //     setEndDate(date);
  // };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    sessionStorage.setItem("startDate", date?.toISOString() || "");
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    sessionStorage.setItem("endDate", date?.toISOString() || "");
  };

  useEffect(() => {
    const savedStartDate = sessionStorage.getItem("startDate");
    const savedEndDate = sessionStorage.getItem("endDate");

    if (savedStartDate && savedEndDate) {
      const start = new Date(savedStartDate);
      const end = new Date(savedEndDate);
      setStartDate(start);
      setEndDate(end);
      fetchInvoicesWithDates(start, end); // Call with actual values
    } else {
      fetchInvoices(); // fallback if no filter
    }
  }, [searchTerm, selectedDays, duplicateFilter, paymentStatus]);

  const fetchInvoicesWithDates = (start, end) => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    let apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/get-invoices`;
    let fromDate;

    if (selectedDays) {
      fromDate = new Date();
      switch (selectedDays) {
        case "7":
          fromDate.setDate(fromDate.getDate() - 7);
          break;
        case "30":
          fromDate.setMonth(fromDate.getMonth() - 1);
          break;
        case "90":
          fromDate.setMonth(fromDate.getMonth() - 3);
          break;
        case "180":
          fromDate.setMonth(fromDate.getMonth() - 6);
          break;
        case "365":
          fromDate.setFullYear(fromDate.getFullYear() - 1);
          break;
      }
      const formattedFromDate = `${fromDate
        .getDate()
        .toString()
        .padStart(2, "0")}/${(fromDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${fromDate.getFullYear()}`;
      apiUrl += `?fromDate=${formattedFromDate}`;
    }

    if (paymentStatus) {
      apiUrl += apiUrl.includes("?")
        ? `&paymentStatus=${paymentStatus}`
        : `?paymentStatus=${paymentStatus}`;
    }

    if (start && end) {
      const formattedStartDate = start.toISOString();
      const formattedEndDate = end.toISOString();
      apiUrl += apiUrl.includes("?")
        ? `&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
        : `?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    }

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const filteredData = response?.data?.data?.filter((item) => {
          const invoiceDate = new Date(item.selectDate);
          const selectDate = new Date(item.selectDate);
          return (
            (!searchTerm ||
              item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.accNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.bankNamed.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.accName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.mobileNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.tradeName
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) &&
            (!selectedDays || invoiceDate >= fromDate) &&
            (!start || invoiceDate >= start) &&
            (!end || selectDate <= end) &&
            (!duplicateFilter || item.duplicate === duplicateFilter)
          );
        });
        setInvoices(filteredData.reverse());
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
      });
  };

  const handleResetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchTerm("");
    setSelectedDays("");
    setDuplicateFilter("");
    setPaymentStatus("");
    sessionStorage.removeItem("startDate");
    sessionStorage.removeItem("endDate");
    sessionStorage.removeItem("searchTerm");
    sessionStorage.removeItem("selectedDays");
    sessionStorage.removeItem("paymentStatus");
    sessionStorage.removeItem("duplicateFilter");
    fetchInvoicesWithDates();
  };
  // const handleDuplicate = (duplicateId) => {
  //     const invoiceToDuplicate = invoices.find((item) => item._id === duplicateId);
  //     if (invoiceToDuplicate) {
  //         const duplicatedInvoice = { ...invoiceToDuplicate };
  //         duplicatedInvoice.selectDate = new Date().toISOString();
  //         axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/add-clientBank`, duplicatedInvoice)
  //             .then(response => {
  //                 fetchInvoices();
  //             })
  //             .catch(error => {
  //                 console.error('Error duplicating invoice:', error);
  //             });
  //     }
  // };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    sessionStorage.setItem("searchTerm", value);
  };
  const handleDuplicate = (duplicateId) => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    const headers = {
      Authorization: `Bearer ${token}`, // Use the token from localStorage
      "Content-Type": "application/json", // Add any other headers if needed
    };
    const invoiceToDuplicate = invoices.find(
      (item) => item._id === duplicateId
    );
    if (invoiceToDuplicate) {
      const duplicatedInvoice = { ...invoiceToDuplicate };
      delete duplicatedInvoice._id;
      duplicatedInvoice.selectDate = new Date().toISOString();
      duplicatedInvoice.duplicate = "Duplicated";
      axios
        .post(
          `${process.env.REACT_APP_API_BASE_URL}/api/add-clientBank`,
          duplicatedInvoice,
          { headers }
        )
        .then((response) => {
          fetchInvoices();
        })
        .catch((error) => {
          console.error("Error duplicating invoice:", error);
        });
    }
  };

  const fetchInvoices = () => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    const headers = {
      Authorization: `Bearer ${token}`, // Use the token from localStorage
      "Content-Type": "application/json", // Add any other headers if needed
    };
    let apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/get-invoices`;
    let fromDate;
    if (selectedDays) {
      fromDate = new Date();
      switch (selectedDays) {
        case "7":
          fromDate.setDate(fromDate.getDate() - 7);
          break;
        case "30":
          fromDate.setMonth(fromDate.getMonth() - 1);
          break;
        case "90":
          fromDate.setMonth(fromDate.getMonth() - 3);
          break;
        case "180":
          fromDate.setMonth(fromDate.getMonth() - 6);
          break;
        case "365":
          fromDate.setFullYear(fromDate.getFullYear() - 1);
          break;
        default:
          break;
      }
      const formattedFromDate = `${fromDate
        .getDate()
        .toString()
        .padStart(2, "0")}/${(fromDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${fromDate.getFullYear()}`;
      apiUrl += `?fromDate=${formattedFromDate}`;
    }
    if (paymentStatus) {
      apiUrl += apiUrl.includes("?")
        ? `&paymentStatus=${paymentStatus}`
        : `?paymentStatus=${paymentStatus}`;
    }

    // if (startDate && endDate) {
    //     const formattedStartDate = startDate.toISOString();
    //     const formattedEndDate = endDate.toISOString();
    //     apiUrl += `?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    // }
    // if (startDate && endDate) {
    //     const formattedStartDate = startDate.toISOString();
    //     const formattedEndDate = endDate.toISOString();
    //     apiUrl += apiUrl.includes('?') ? `&startDate=${formattedStartDate}&endDate=${formattedEndDate}` : `?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    // }
    // axios.get(apiUrl)
    //     .then((response) => {
    //         const filteredData = response?.data?.data?.filter(item => {
    //             const invoiceDateParts = item.InvoiceDate.split('/');
    //             const invoiceDate = new Date(`${invoiceDateParts[1]}/${invoiceDateParts[0]}/${invoiceDateParts[2]}`);
    //             return (!searchTerm || item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //                 item.accNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //                 item.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //                 item.project.toLowerCase().includes(searchTerm.toLowerCase())) && (!selectedDays || invoiceDate >= fromDate);
    //         });
    //         setInvoices(filteredData.reverse());
    //     })
    if (startDate && endDate) {
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();
      apiUrl += apiUrl.includes("?")
        ? `&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
        : `?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    }

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const filteredData = response?.data?.data?.filter((item) => {
          const invoiceDate = new Date(item.selectDate);
          const selectDate = new Date(item.selectDate);
          return (
            (!searchTerm ||
              item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.accNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.bankNamed.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.accName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.mobileNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.tradeName
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) &&
            (!selectedDays || invoiceDate >= fromDate) &&
            (!startDate || invoiceDate >= startDate) &&
            (!endDate || selectDate <= endDate) &&
            (!duplicateFilter || item.duplicate === duplicateFilter)
          );
        });
        setInvoices(filteredData.reverse());
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
      });
  };

  const handleDelete = (deleteId) => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    const headers = {
      Authorization: `Bearer ${token}`, // Use the token from localStorage
      "Content-Type": "application/json", // Add any other headers if needed
    };
    const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/delete-invoice/${deleteId}`;
    axios.delete(apiUrl, { headers });
    setInvoices(invoices.filter((item) => item._id !== deleteId));
  };

  // const handleDuplicateFilterChange = (e) => {
  //   setDuplicateFilter(e.target.value);
  // };

  // const handleSelectChange = (e) => {
  //   setSelectedDays(e.target.value);
  // };
  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedDays(value);
    sessionStorage.setItem("selectedDays", value);
  };

  const handlePaymentStatusChange = (e) => {
    const value = e.target.value;
    setPaymentStatus(value);
    sessionStorage.setItem("paymentStatus", value);
  };

  const handleDuplicateFilterChange = (e) => {
    const value = e.target.value;
    setDuplicateFilter(value);
    sessionStorage.setItem("duplicateFilter", value);
  };
  const handleSearch = () => {
    fetchInvoices();
  };
  // const handlePaymentStatusChange = (e) => {
  //   setPaymentStatus(e.target.value);
  // };
  const paidInvoicesLength = invoices.filter(
    (item) => item.paymentStatus === "paid"
  ).length;
  const unpaidInvoicesLength = invoices.filter(
    (item) => item.paymentStatus === "unpaid"
  ).length;
  const draftInvoicesLength = invoices.filter(
    (item) => item.paymentStatus === "draft"
  ).length;
  const totalAUD = invoices.filter((item) => item.currency === "AUD").length;
  const totalCAD = invoices.filter((item) => item.currency === "CAD").length;
  const totalINR = invoices.filter((item) => item.currency === "INR").length;
  const totalUSD = invoices.filter((item) => item.currency === "USD").length;
  const DuplicateData = invoices.filter(
    (item) => item.duplicate === "Duplicated" && item.paymentStatus === "paid"
  ).length;

  const totalAUDCr = invoices
    .filter(
      (item) =>
        item.currency === "AUD" &&
        item.amount !== "" &&
        item.paymentStatus === "paid"
    )
    .reduce((total, item) => total + parseFloat(item.amount), 0);

  const totalCADCr = invoices
    .filter(
      (item) =>
        item.currency === "CAD" &&
        item.amount !== "" &&
        item.paymentStatus === "paid"
    )
    .reduce((total, item) => total + parseFloat(item.amount), 0);

  const totalINRCr = invoices
    .filter(
      (item) =>
        item.currency === "INR" &&
        item.amount !== "" &&
        item.paymentStatus === "paid"
    )
    .reduce((total, item) => total + parseFloat(item.amount), 0);

  const totalUSDCr = invoices
    .filter(
      (item) =>
        item.currency === "USD" &&
        item.amount !== "" &&
        item.paymentStatus === "paid"
    )
    .reduce((total, item) => total + parseFloat(item.amount), 0);

  const getStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case "paid":
        return "paid-row";
      case "unpaid":
        return "unpaid-row";
      default:
        return "";
    }
  };
  return (
    <div>
      <div style={{ display: "flex", gap: "14px" }}>
        <p>
          <span className="font-black"> Paid:</span> {paidInvoicesLength}
        </p>
      </div>
      <div style={{ display: "flex", gap: "14px" }}>
        <p>
          <span className="font-black">All Project Cost</span>
        </p>
        <p>
          {" "}
          <span className="font-black">AUD:</span> {totalAUDCr}
        </p>
        <p>
          <span className="font-black"> CAD:</span> {totalCADCr}
        </p>
        <p>
          {" "}
          <span className="font-black">INR:</span> {totalINRCr}
        </p>
        <p>
          <span className="font-black"> USD:</span> {totalUSDCr}
        </p>
      </div>
      <h1>
        <span className="font-black">Duplicated:</span>
        {DuplicateData}
      </h1>
      <div style={{ display: "flex", gap: "3px" }}>
        <div className="client-form-wrapper">
          <input
            type="text"
            placeholder="Search"
            className="inputStyle"
            value={searchTerm}
            onChange={handleSearchChange}
            // onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="inputStyle"
            value={selectedDays === "" ? "" : `${selectedDays}`}
            onChange={handleSelectChange}
          >
            <option value="">Select date range</option>
            <option value="7">Last 1 week</option>
            <option value="30">Last 1 month</option>
            <option value="90">Last 3 months</option>
            <option value="180">Last 6 months</option>
            <option value="365">Last 1 year</option>
          </select>
        </div>
        <div>
          <select
            className="inputStyle"
            value={paymentStatus}
            onChange={handlePaymentStatusChange}
          >
            <option value="">Payment status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div>
          <select
            value={duplicateFilter}
            onChange={handleDuplicateFilterChange}
            className="inputStyle"
          >
            <option value="">Filter by Duplicate Status</option>
            <option value="Duplicated">Duplicated</option>
            <option value="">Not Duplicated</option>
          </select>
        </div>
        <div className="date-range-picker" style={{ display: "flex" }}>
          <DatePicker
            className="inputStyle"
            selected={startDate}
            onChange={handleStartDateChange}
            placeholderText="Select start date"
          />
          <span className="toRange">to</span>
          <DatePicker
            className="inputStyle"
            selected={endDate}
            onChange={handleEndDateChange}
            placeholderText="Select end date"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Go
        </button>
        <button
          type="button"
          onClick={handleResetFilters}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Reset
        </button>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th
                scope="col"
                className="px-6 py-3"
                onClick={() => handleSort("clientName")}
              >
                Client Name
                <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
              </th>
              <th
                scope="col"
                className="px-6 py-3"
                onClick={() => handleSort("company")}
              >
                Company
                <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Bank Name
              </th>
              <th scope="col" className="px-6 py-3">
                Acc. No
              </th>
              <th>Original</th>
              {/* <th scope="col" className="px-6 py-3">
                                Advance Amount
                            </th> */}
              <th scope="col" className="px-6 py-3">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedItems
              .filter((item) => item.paymentStatus === "paid")
              .map((item) => (
                // <Link to={`/proCosting/${item._id}`}>
                  <tr
                    className={`bg-white cursor-pointer dark:bg-gray-800 dark:border-gray-700 border-black border-b ${getStatusColor(
                      item?.paymentStatus
                    )}`}
                    key={item._id}
                    onClick={()=>Router(`/proCosting/${item._id}`)}
                  >
                    <td className="px-6 py-4">{item.client || "N/A"}</td>
                    <td className="px-6 py-4">{item.company || "N/A"}</td>
                    <td className="px-6 py-4">{item.paymentStatus || "N/A"}</td>
                    <td className="px-6 py-4">{item.bankNamed || "N/A"}</td>
                    <td className="px-6 py-4">{item.accNo || "N/A"}</td>
                    <td>
                      {item.duplicate && (
                        <span class="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                          {item.duplicate}
                        </span>
                      )}
                    </td>
                    {/* <td className="px-6 py-4">{item.currency} {item.amount}</td> */}
                    <td className="px-6 py-4">
                      {item.selectDate ? item.selectDate.split("T")[0] : "N/A"}
                    </td>
                  </tr>
                // </Link>
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
            {currentPage} of {totalPages}
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
}

export default Project_cost;
