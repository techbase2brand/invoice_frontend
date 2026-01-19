import React, { useEffect, useState, useRef } from 'react'
import axios from "axios";
import { Link } from 'react-router-dom';
import Pagination from '../Pagination/Pagination';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { defaultInputSmBlack } from '../constants/defaultStyles';
const WagesList = ({ refreshKey, onSelectionChange  }) => {
  const [data, setData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDays, setSelectedDays] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [localCsvData, setLocalCsvData] = useState([]);
  const [apiData, setApiData] = useState([]);
   const prevSelectedEmployeesRef = useRef([]);
  // const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  // const combinedData = [...localCsvData, ...apiData];

  const currentItems = data
    .filter(item => {
      if (!searchTerm) return true;
      return (
        item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.familyMember.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .filter(item => {
      if (!selectedDays) return true;

      const today = new Date();
      let cutoffDate = new Date(today);

      switch (selectedDays) {
        case "7":
          cutoffDate.setDate(cutoffDate.getDate() - 7);
          break;
        case "30":
          cutoffDate.setMonth(cutoffDate.getMonth() - 1);
          break;
        case "90":
          cutoffDate.setMonth(cutoffDate.getMonth() - 3);
          break;
        case "180":
          cutoffDate.setMonth(cutoffDate.getMonth() - 6);
          break;
        case "365":
          cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
          break;
        default:
          return true; // Handle unexpected cases
      }

      const chooseDate = new Date(item.chooseDate);
      return chooseDate <= today && chooseDate >= cutoffDate;
    })

    .filter(item => {
      if (!startDate || !endDate) return true;
      const start = new Date(startDate);
      const end = new Date(endDate);
      const chooseDate = new Date(item.chooseDate);
      return chooseDate >= start && chooseDate <= end;
    })
    .slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (onSelectionChange) {
      const selectedEmployees = data.filter((item) =>
        selectedItems.includes(item._id)
      );
      // Prevent infinite loop by comparing prev and current selection
      const prev = prevSelectedEmployeesRef.current;
      const changed =
        JSON.stringify(prev) !== JSON.stringify(selectedEmployees);
      if (changed) {
        onSelectionChange(selectedEmployees);
        prevSelectedEmployeesRef.current = selectedEmployees;
      }
    }
  }, [selectedItems, data, onSelectionChange]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // reset to page 1 when items per page changes
  };
  const handleSelectChange = (e) => {
    setSelectedDays(e.target.value);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
function safeFormatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";  // invalid date
  return d.toISOString().split('T')[0];
}

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const headers = {
      'Authorization': `Bearer ${token}`,  // Use the token from localStorage
      'Content-Type': 'application/json',  // Add any other headers if needed
    };
    const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/get-wages`;

    axios.get(apiUrl, { headers })
      .then((response) => {

        const wagesData = response?.data?.data.map((item) => {
          // Date formatting 
          const formattedChooseDate = safeFormatDate(item?.chooseDate);
 
              

             const formattedJoinDate = safeFormatDate(item?.joinDate);
          // Constructing full URL for companylogo
          const companyLogoUrl = item?.companylogo ? `${process.env.REACT_APP_API_BASE_URL}${item?.companylogo}` : "";

          return {
            ...item,
            chooseDate: formattedChooseDate,
            joinDate: formattedJoinDate, 
            companylogo: companyLogoUrl
          };
        });
        setApiData(wagesData.reverse()); // Reverse if needed
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);


   // Load CSV data from localStorage on mount and when refreshKey changes
  useEffect(() => {
    const storedCsv = localStorage.getItem("csvData");
    if (storedCsv) {
      try {
        const parsedCsv = JSON.parse(storedCsv);
        const csvWithIds = parsedCsv.map((item, index) => ({
          _id: `csv-${index}`, // unique IDs for React keys
          // map CSV keys to your table keys if different:
          chooseDate: item["Choose Date"] || "",  // adapt to your CSV headers
          employeeName: item["Employee Name"] || "",
          empCode: item["Employee Code"] || "",
          familyMember: item["F/H Name"] || "",
          department: item["Department"] || "",
          designation: item["Designation"] || "",
          companyName: item["Company Name"] || "",
          netsalary: item["Net salary"] || "",
          // add other keys if needed
          ...item,
        }));
        setLocalCsvData(csvWithIds);
      } catch (error) {
        console.error("Error parsing CSV from localStorage", error);
        setLocalCsvData([]);
      }
    } else {
      setLocalCsvData([]);
    }
  }, [refreshKey]);

  // Combine local CSV data and API data (show CSV data on top)
  useEffect(() => {
    setData([...localCsvData, ...apiData]);
    setCurrentPage(1); // reset page on data change
  }, [localCsvData, apiData]);

  

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const headers = {
      'Authorization': `Bearer ${token}`,  // Use the token from localStorage
      'Content-Type': 'application/json',  // Add any other headers if needed
    };
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/delted-wages/${id}`, { headers });
      setData(data.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting bank detail:', error);
    }
  };

  const handleSelectAll = () => {
  setSelectAll(!selectAll);
  if (!selectAll) {
    setSelectedItems(currentItems.map((item) => item._id));
  } else {
    setSelectedItems([]);
  }
};

const handleSelectOne = (id) => {
  if (selectedItems.includes(id)) {
    setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
  } else {
    setSelectedItems([...selectedItems, id]);
  }
};
 
function parseDateString(dateStr) {
  if (!dateStr) return null;

  const cleanStr = dateStr.trim();

  // ISO format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleanStr)) {
    const d = new Date(cleanStr);
    if (!isNaN(d)) return d;
  }

  // DD-MM-YYYY format
  if (/^\d{2}-\d{2}-\d{4}$/.test(cleanStr)) {
    const [dd, mm, yyyy] = cleanStr.split("-");
    const d = new Date(yyyy, mm - 1, dd);
    if (!isNaN(d)) return d;
  }

  // fallback
  const parsed = Date.parse(cleanStr);
  if (!isNaN(parsed)) return new Date(parsed);

  return null;
}






  // const calculateSum = (item) => {
  //   const fields = ['basic', 'med', 'children', 'house', 'conveyance', 'earning', 'arrear', 'reimbursement', 'health', 'epf', 'tds'];
  //   return fields.reduce((sum, field) => sum + parseFloat(item[field] || 0), 0);
  // };
  return (
    <div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div style={{ display: 'flex', gap: '3px' }}>
          <div className="client-form-wrapper" style={{ width: '12%' }}>
            <input
              type="text"
              placeholder="Search"
              className={defaultInputSmBlack}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className={defaultInputSmBlack}
              value={selectedDays === '' ? '' : `${selectedDays}`}
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
          <div className="date-range-picker">
            <DatePicker
              className={defaultInputSmBlack}
              selected={startDate}
              onChange={handleStartDateChange}
              placeholderText="Select start date"
            />
            <span className=" text-gray-500">to</span>
            <DatePicker
              className={defaultInputSmBlack}
              selected={endDate}
              onChange={handleEndDateChange}
              placeholderText="Select end date"
            />
          </div>
        </div>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
               <th className="px-6 py-3">
                <input
                  type="checkbox"
                  className='w-5 h-5'
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th scope="col" class="px-6 py-3">
                Date
              </th>
              <th scope="col" class="px-6 py-3">
                Emp. Name
              </th>
              <th scope="col" class="px-6 py-3">
                F/H Name
              </th>
              <th scope="col" class="px-6 py-3">
                Dept.
              </th>
              <th scope="col" class="px-6 py-3">
                Designation
              </th>
              <th scope="col" class="px-6 py-3">
                Emp. Code
              </th>
              <th scope="col" class="px-6 py-3">
                Company Name
              </th>
              <th scope="col" class="px-6 py-3">
                RS
              </th>
              <th scope="col" class="px-6 py-3">
                Action
              </th>
              <th>Create</th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((item) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={item._id}>
                   <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className='w-5 h-5'
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleSelectOne(item._id)}
                    />
                  </td>
             <td className="px-6 py-4">
  {(() => {
    // Get raw date strings
    const chooseDateRaw = item?.chooseDate?.trim();
    const joinDateRaw = item?.joinDate?.trim();

    // Helper function to check if date string is valid after parsing
    const isValidDateStr = (dateStr) => {
      if (!dateStr || dateStr.toLowerCase() === "invalid date") return false;
      const parsed = parseDateString(dateStr);
      return parsed && !isNaN(parsed);
    };

    let dateStrToUse = "";

    if (isValidDateStr(chooseDateRaw)) {
      dateStrToUse = chooseDateRaw;
    } else if (isValidDateStr(joinDateRaw)) {
      dateStrToUse = joinDateRaw;
    } else {
      return "N/A";
    }

    const parsedDate = parseDateString(dateStrToUse);
    if (!parsedDate) return "N/A";

    return parsedDate.toISOString().split("T")[0];
  })()}
</td>







                <td className="px-6 py-4">
                    {item.employeeName || item.empName || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {item.familyMember || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {item.department || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {item.designation || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {item.empCode || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {item.companyName || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {item?.netsalary || "N/A"}
                </td>
                <td style={{ display: 'flex', gap: '20px' }}>
                  <Link to={`/wages-form/${item._id}`}>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="feather feather-edit" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </span>
                  </Link>
                  <span onClick={() => handleDelete(item._id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 16 16">
                      <path d="M 6.496094 1 C 5.675781 1 5 1.675781 5 2.496094 L 5 3 L 2 3 L 2 4 L 3 4 L 3 12.5 C 3 13.328125 3.671875 14 4.5 14 L 10.5 14 C 11.328125 14 12 13.328125 12 12.5 L 12 4 L 13 4 L 13 3 L 10 3 L 10 2.496094 C 10 1.675781 9.324219 1 8.503906 1 Z M 6.496094 2 L 8.503906 2 C 8.785156 2 9 2.214844 9 2.496094 L 9 3 L 6 3 L 6 2.496094 C 6 2.214844 6.214844 2 6.496094 2 Z M 5 5 L 6 5 L 6 12 L 5 12 Z M 7 5 L 8 5 L 8 12 L 7 12 Z M 9 5 L 10 5 L 10 12 L 9 12 Z"></path>
                    </svg>
                  </span>
                </td>
                <td>
                  <Link to={`/final-wages/${item._id}`}>
                    <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">pdf</button>
                  </Link>
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
          <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
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
  )
}

export default WagesList