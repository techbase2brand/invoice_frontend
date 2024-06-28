import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Link } from 'react-router-dom';
import Pagination from '../Pagination/Pagination';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { defaultInputSmBlack } from '../constants/defaultStyles';
const WagesList = () => {
  const [data, setData] = useState([]);
  const [itemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDays, setSelectedDays] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);


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

  const handleSelectChange = (e) => {
    setSelectedDays(e.target.value);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  useEffect(() => {
    const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/get-wages`;
    axios.get(apiUrl)
      .then((response) => {
        const wagesData = response.data.data.map((item) => {
          const formattedChooseDate = new Date(item.chooseDate).toISOString().split('T')[0];
          const formattedJoinDate = new Date(item.joinDate).toISOString().split('T')[0];
          return {
            ...item,
            chooseDate: formattedChooseDate,
            joinDate: formattedJoinDate,
            signature: `http://localhost:8000${item.signature}`
          }
        });
        setData(wagesData.reverse())
      })
      .catch((error) => {
        console.error('Error fetching invoices:', error);
      });
  }, []);
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/delted-wages/${id}`);
      setData(data.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting bank detail:', error);
    }
  };
  const calculateSum = (item) => {
    const fields = ['basic', 'med', 'children', 'house', 'conveyance', 'earning', 'arrear', 'reimbursement', 'health', 'epf', 'tds'];
    return fields.reduce((sum, field) => sum + parseFloat(item[field] || 0), 0);
  };
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
                  {item?.chooseDate?.split("T")[0] || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {item.employeeName || "N/A"}
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
                  {calculateSum(item)}
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
        </div>
      </div>
    </div>
  )
}

export default WagesList