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

    // Search only by client name (and company as helper)
    return (
      normalize(item.clientName).includes(t) ||
      normalize(item.companyName).includes(t)
    );
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
  // accepts optional overrides so reset ke time fresh filters se call kar saken
  const fetchCostings = async (overrides = {}) => {
    try {
      const headers = getAuthHeaders();

      // IMPORTANT:
      // Since you said "go ke upr filter", we apply filtering on frontend after fetching.
      // If backend later supports query params, we can pass them too.
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/get-costings`;
      const res = await axios.get(apiUrl, { headers });

      const rows = Array.isArray(res?.data?.data) ? res.data.data : [];

      // Effective filters: state se, ya overrides se
      const effSelectedDays =
        overrides.selectedDays !== undefined ? overrides.selectedDays : selectedDays;
      const effStartDate =
        overrides.startDate !== undefined ? overrides.startDate : startDate;
      const effEndDate =
        overrides.endDate !== undefined ? overrides.endDate : endDate;
      const effPaymentStatus =
        overrides.paymentStatus !== undefined ? overrides.paymentStatus : paymentStatus;
      const effDuplicateFilter =
        overrides.duplicateFilter !== undefined ? overrides.duplicateFilter : duplicateFilter;
      const effSearchTerm =
        overrides.searchTerm !== undefined ? overrides.searchTerm : searchTerm;

      // Helper: date-only string "YYYY-MM-DD" WITHOUT timezone shift
      const toDateOnly = (d) => {
        if (!d) return null;
        const dt = new Date(d);
        const year = dt.getFullYear();
        const month = String(dt.getMonth() + 1).padStart(2, "0");
        const day = String(dt.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      // Apply filters in UI (on Go)
      const fromDate = computeFromDate(effSelectedDays);
      const fromDateStr = fromDate ? toDateOnly(fromDate) : null;
      const startStr = effStartDate ? toDateOnly(effStartDate) : null;
      const endStr = effEndDate ? toDateOnly(effEndDate) : null;

      const filtered = rows.filter((item) => {
        const tsStr = item.timestamp
          ? item.timestamp.split("T")[0]
          : null;

        const inSelectedDays =
          !fromDateStr || (tsStr && tsStr >= fromDateStr);
        const inStart = !startStr || (tsStr && tsStr >= startStr);
        const inEnd = !endStr || (tsStr && tsStr <= endStr);

        const statusOk =
          !effPaymentStatus || item.paymentStatus === effPaymentStatus;

        // duplicate filter not applicable here unless your costing model has duplicate field
        const duplicateOk =
          !effDuplicateFilter ||
          (item.duplicate && item.duplicate === effDuplicateFilter);

        const searchOk = matchSearch(item, effSearchTerm);

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

    // fresh filters (all cleared) se data laao
    fetchCostings({
      startDate: null,
      endDate: null,
      searchTerm: "",
      selectedDays: "",
      paymentStatus: "",
      duplicateFilter: "",
    });
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

  // ---------- row + grand totals (based on filtered response) ----------
  const getRowTotals = (item) => {
    let totalCost = 0;
    let totalPaid = 0;
    let totalReceived = 0;

    (item.projects || []).forEach((p) => {
      totalCost += parseFloat(p.cost) || 0;

      (p.payments || []).forEach((pay) => {
        totalPaid += parseFloat(pay.paid) || 0;
        totalReceived += parseFloat(pay.receivedAmount) || 0;
      });
    });

    return { totalCost, totalPaid, totalReceived };
  };

  const grandTotals = costings.reduce(
    (acc, item) => {
      const { totalCost, totalPaid, totalReceived } = getRowTotals(item);
      acc.totalCost += totalCost;
      acc.totalPaid += totalPaid;
      acc.totalReceived += totalReceived;
      return acc;
    },
    { totalCost: 0, totalPaid: 0, totalReceived: 0 }
  );

  // ---------- header badges ----------
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

  // ---------- download single costing as CSV ----------
  const downloadCostingAsCSV = (item) => {
    if (!item) return;

    const rows = [];

    // summary block
    rows.push(["Client Name", item.clientName || ""]);
    rows.push(["Company", item.companyName || ""]);
    rows.push(["Email", item.email || ""]);
    rows.push(["Phone", item.mobileNo || ""]);
    rows.push(["Currency", item.currency || ""]);
    rows.push(["Payment Status", item.paymentStatus || ""]);
    rows.push([
      "Date",
      item.timestamp ? item.timestamp.split("T")[0] : "",
    ]);
    rows.push([]);

    // header for project + payments
    rows.push([
      "Project Name",
      "Start Date",
      "End Date",
      "Total Cost",
      "Advance",
      "Payment Date",
      `Paid Amount (${item.currency || ""})`,
      `Pending (${item.currency || ""})`,
      "Received Amount (INR)",
    ]);

    (item.projects || []).forEach((project) => {
      const payments =
        project.payments && project.payments.length
          ? project.payments
          : [
              {
                date: "",
                paid: "",
                pending: "",
                receivedAmount: "",
              },
            ];

      payments.forEach((payment) => {
        rows.push([
          project.name || "",
          project.startDate || "",
          project.endDate || "",
          project.cost || "",
          project.advance || "",
          payment.date || "",
          payment.paid || "",
          payment.pending || "",
          payment.receivedAmount || "",
        ]);
      });
    });

    const csvContent = rows
      .map((cols) =>
        cols
          .map((v) =>
            `"${(v ?? "")
              .toString()
              .replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileName = `project-cost-${
      (item.clientName || "client").replace(/\s+/g, "-")
    }-${item.timestamp ? item.timestamp.split("T")[0] : ""}.csv`;

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ---------- action buttons ----------
  const onEdit = (id) => {
    // you can change route as per your app
    Router(`/project-cost-form/${id}`);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
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

      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", marginTop: "8px" }}>
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
        <p>
          <span className="font-black">Total Cost:</span> {grandTotals.totalCost}
        </p>
        <p>
          <span className="font-black">Paid Amount:</span> {grandTotals.totalPaid}
        </p>
        <p>
          <span className="font-black">Received INR:</span> {grandTotals.totalReceived}
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center", marginTop: "10px" }}>
        <div className="client-form-wrapper">
          <input
            type="text"
            placeholder="Search"
            className="inputStyle"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="date-range-picker" style={{ display: "flex", alignItems: "center" }}>
          <DatePicker
            className="inputStyle"
            selected={startDate}
            onChange={handleStartDateChange}
            placeholderText="Start date"
            style={{ color: "#000", fontWeight: 500 }}
          />
          <span className="toRange" style={{ marginInline: "4px" }}>
            to
          </span>
          <DatePicker
            className="inputStyle"
            selected={endDate}
            onChange={handleEndDateChange}
            placeholderText="End date"
            style={{ color: "#000", fontWeight: 500 }}
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Go
        </button>

        <button
          type="button"
          onClick={handleResetFilters}
          className="text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
        >
          Reset
        </button>
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

              <th scope="col" className="px-6 py-3">
                Total Cost
              </th>

              <th scope="col" className="px-6 py-3">
                Paid Amount
              </th>

              <th scope="col" className="px-6 py-3">
                Received (INR)
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

                  {(() => {
                    const { totalCost, totalPaid, totalReceived } = getRowTotals(item);
                    return (
                      <>
                        <td className="px-6 py-4">{totalCost}</td>
                        <td className="px-6 py-4">{totalPaid}</td>
                        <td className="px-6 py-4">{totalReceived}</td>
                      </>
                    );
                  })()}

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

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadCostingAsCSV(item);
                        }}
                        className="px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700"
                      >
                        Download
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
