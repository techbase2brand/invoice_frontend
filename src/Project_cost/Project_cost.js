import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "../Pagination/Pagination";

function Project_cost() {
  const [costings, setCostings] = useState([]);
  const [searchTerm, setSearchTerm] = useState(() => {
    return sessionStorage.getItem("searchTerm") || "";
  });
  const [selectedDays, setSelectedDays] = useState(
    () => sessionStorage.getItem("selectedDays") || ""
  );
  const [paymentStatus, setPaymentStatus] = useState(
    () => sessionStorage.getItem("paymentStatus") || ""
  );

  // NOTE: Your new costing response doesn't have "duplicate"
  // We keep the filter in UI (as you asked "baaki sare filter"), but it won't affect anything unless backend adds it.
  const [duplicateFilter, setDuplicateFilter] = useState(
    () => sessionStorage.getItem("duplicateFilter") || ""
  );

  const [startDate, setStartDate] = useState(() => {
    const saved = sessionStorage.getItem("startDate");
    return saved ? new Date(saved) : null;
  });
  const [endDate, setEndDate] = useState(() => {
    const saved = sessionStorage.getItem("endDate");
    return saved ? new Date(saved) : null;
  });

  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("");

  const Router = useNavigate();

  // dropdown refs (kept as in your code)
  const [openItemId, setOpenItemId] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const dropdownRef = useRef(null);

  const handleToggleDropdown = (itemId) => {
    setOpenItemId(openItemId === itemId ? null : itemId);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ---------- helpers ----------
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const computeFromDate = (days) => {
    if (!days) return null;
    const from = new Date();
    switch (days) {
      case "7":
        from.setDate(from.getDate() - 7);
        break;
      case "30":
        from.setMonth(from.getMonth() - 1);
        break;
      case "90":
        from.setMonth(from.getMonth() - 3);
        break;
      case "180":
        from.setMonth(from.getMonth() - 6);
        break;
      case "365":
        from.setFullYear(from.getFullYear() - 1);
        break;
      default:
        return null;
    }
    return from;
  };

  const normalize = (v) => (v ?? "").toString().toLowerCase();

  // Your costing has:
  // timestamp, clientName, companyName, email, mobileNo, currency, paymentStatus, projects[]
  const matchSearch = (item, term) => {
    if (!term) return true;
    const t = term.toLowerCase();

    const baseFields =
      normalize(item.clientName).includes(t) ||
      normalize(item.companyName).includes(t) ||
      normalize(item.email).includes(t) ||
      normalize(item.mobileNo).includes(t) ||
      normalize(item.currency).includes(t) ||
      normalize(item.paymentStatus).includes(t);

    const projectFields = (item.projects || []).some((p) => {
      return (
        normalize(p.name).includes(t) ||
        normalize(p.cost).includes(t) ||
        normalize(p.advance).includes(t) ||
        normalize(p.totalPending).includes(t) ||
        normalize(p.startDate).includes(t) ||
        normalize(p.endDate).includes(t) ||
        (p.payments || []).some((pay) => {
          return (
            normalize(pay.date).includes(t) ||
            normalize(pay.paid).includes(t) ||
            normalize(pay.pending).includes(t) ||
            normalize(pay.receivedAmount).includes(t)
          );
        })
      );
    });

    return baseFields || projectFields;
  };

  // ---------- filters persistence ----------
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    sessionStorage.setItem("searchTerm", value);
  };

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

  const handleStartDateChange = (date) => {
    setStartDate(date);
    sessionStorage.setItem("startDate", date?.toISOString() || "");
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    sessionStorage.setItem("endDate", date?.toISOString() || "");
  };

  // ---------- API: GET /api/get-costings ----------
  const fetchCostings = async () => {
    try {
      const headers = getAuthHeaders();

      // IMPORTANT:
      // Since you said "go ke upr filter", we apply filtering on frontend after fetching.
      // If backend later supports query params, we can pass them too.
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/get-costings`;
      const res = await axios.get(apiUrl, { headers });

      const rows = Array.isArray(res?.data?.data) ? res.data.data : [];

      // Apply filters in UI (on Go)
      const fromDate = computeFromDate(selectedDays);

      const filtered = rows.filter((item) => {
        const ts = item.timestamp ? new Date(item.timestamp) : null;

        const inSelectedDays = !fromDate || (ts && ts >= fromDate);
        const inStart = !startDate || (ts && ts >= startDate);
        const inEnd = !endDate || (ts && ts <= endDate);

        const statusOk = !paymentStatus || item.paymentStatus === paymentStatus;

        // duplicate filter not applicable here unless your costing model has duplicate field
        const duplicateOk =
          !duplicateFilter ||
          (item.duplicate && item.duplicate === duplicateFilter);

        const searchOk = matchSearch(item, searchTerm);

        return inSelectedDays && inStart && inEnd && statusOk && duplicateOk && searchOk;
      });

      // latest first
      filtered.sort((a, b) => {
        const da = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const db = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return db - da;
      });

      setCostings(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching costings:", error);
    }
  };

  // run once on mount to load initial data with saved filters
  useEffect(() => {
    fetchCostings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    fetchCostings();
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

    fetchCostings();
  };

  // ---------- DELETE /delete-costing/:id ----------
  const handleDelete = async (deleteId) => {
    try {
      const headers = getAuthHeaders();
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/delete-costing/${deleteId}`;
      await axios.delete(apiUrl, { headers });

      setCostings((prev) => prev.filter((x) => x._id !== deleteId));
    } catch (error) {
      console.error("Error deleting costing:", error);
      alert("Delete failed");
    }
  };

  // ---------- sort + pagination ----------
  const handleSort = (columnName) => {
    if (sortColumn === columnName) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnName);
      setSortOrder("asc");
    }
  };

  const totalPages = Math.ceil(costings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = costings.slice(indexOfFirstItem, indexOfLastItem);

  const sortedItems = [...currentItems].sort((a, b) => {
    const aClient = a.clientName || "";
    const bClient = b.clientName || "";
    const aCompany = a.companyName || "";
    const bCompany = b.companyName || "";

    if (sortColumn === "clientName") {
      return sortOrder === "asc"
        ? aClient.localeCompare(bClient)
        : bClient.localeCompare(aClient);
    }
    if (sortColumn === "companyName") {
      return sortOrder === "asc"
        ? aCompany.localeCompare(bCompany)
        : bCompany.localeCompare(aCompany);
    }
    if (sortColumn === "timestamp") {
      const da = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const db = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return sortOrder === "asc" ? da - db : db - da;
    }
    // default
    return sortOrder === "asc"
      ? aClient.localeCompare(bClient)
      : bClient.localeCompare(aClient);
  });

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  // ---------- totals (based on response) ----------
  const paidLength = costings.filter((x) => x.paymentStatus === "paid").length;
  const unpaidLength = costings.filter((x) => x.paymentStatus === "unpaid").length;
  const draftLength = costings.filter((x) => x.paymentStatus === "draft").length;

  const sumPaidByCurrency = (cur) =>
    costings
      .filter((x) => x.currency === cur && x.paymentStatus === "paid")
      .reduce((total, x) => {
        // If you want sum of "projects cost", sum projects[].cost
        const projectsTotal = (x.projects || []).reduce(
          (t, p) => t + (parseFloat(p.cost) || 0),
          0
        );
        return total + projectsTotal;
      }, 0);

  const totalAUDCr = sumPaidByCurrency("AUD");
  const totalCADCr = sumPaidByCurrency("CAD");
  const totalINRCr = sumPaidByCurrency("INR");
  const totalUSDCr = sumPaidByCurrency("USD");

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "paid-row";
      case "unpaid":
        return "unpaid-row";
      default:
        return "";
    }
  };

  // ---------- action buttons ----------
  const onEdit = (id) => {
    // you can change route as per your app
    Router(`/project-cost-form/${id}`);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "14px" }}>
        <p>
          <span className="font-black">Paid:</span> {paidLength}
        </p>
        <p>
          <span className="font-black">Unpaid:</span> {unpaidLength}
        </p>
        <p>
          <span className="font-black">Draft:</span> {draftLength}
        </p>
      </div>

      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        <p>
          <span className="font-black">All Project Cost (Paid)</span>
        </p>
        <p>
          <span className="font-black">AUD:</span> {totalAUDCr}
        </p>
        <p>
          <span className="font-black">CAD:</span> {totalCADCr}
        </p>
        <p>
          <span className="font-black">INR:</span> {totalINRCr}
        </p>
        <p>
          <span className="font-black">USD:</span> {totalUSDCr}
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
        <div className="client-form-wrapper">
          <input
            type="text"
            placeholder="Search"
            className="inputStyle"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* <div>
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
        </button> */}
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th
                scope="col"
                className="px-6 py-3"
                onClick={() => handleSort("clientName")}
                style={{ cursor: "pointer" }}
              >
                Client Name <span>{sortColumn === "clientName" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</span>
              </th>

              <th
                scope="col"
                className="px-6 py-3"
                onClick={() => handleSort("companyName")}
                style={{ cursor: "pointer" }}
              >
                Company <span>{sortColumn === "companyName" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</span>
              </th>

              <th scope="col" className="px-6 py-3">
                Status
              </th>

              <th scope="col" className="px-6 py-3">
                Currency
              </th>

              <th
                scope="col"
                className="px-6 py-3"
                onClick={() => handleSort("timestamp")}
                style={{ cursor: "pointer" }}
              >
                Date <span>{sortColumn === "timestamp" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</span>
              </th>

              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedItems
              // .filter((item) => item.paymentStatus === "paid")
              .map((item) => (
                <tr
                  className={`bg-white dark:bg-gray-800 dark:border-gray-700 border-black border-b cursor-pointer ${getStatusColor(
                    item?.paymentStatus
                  )}`}
                  key={item._id}
                  onClick={()=>Router(`/CostDetailPage/${item._id}`)}
                >
                  <td
                    className="px-6 py-4 cursor-pointer"
                    // onClick={() => Router(`/proCosting/${item._id}`)}
                  >
                    {item.clientName || "N/A"}
                  </td>

                  <td
                    className="px-6 py-4 cursor-pointer"
                    // onClick={() => Router(`/proCosting/${item._id}`)}
                  >
                    {item.companyName || "N/A"}
                  </td>

                  <td className="px-6 py-4">{item.paymentStatus || "N/A"}</td>
                  <td className="px-6 py-4">{item.currency || "N/A"}</td>

                  <td className="px-6 py-4">
                    {item.timestamp ? item.timestamp.split("T")[0] : "N/A"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(item._id);
                        }}
                        className="px-3 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("Are you sure you want to delete?")) {
                            handleDelete(item._id);
                          }
                        }}
                        className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <div className="flex items-center justify-center mx-4">
            {currentPage} of {totalPages || 1}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages || 1} paginate={paginate} />

          <button
            className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ml-2"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
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
