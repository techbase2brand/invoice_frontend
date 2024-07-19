import React, { useCallback, useEffect, useState } from "react";
import PageTitle from "../components/Common/PageTitle";
import axios from "axios";
import Button from "../components/Button/Button";
import { defaultInputSmBlack } from "../constants/defaultStyles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "../Pagination/Pagination";
import { Link, useNavigate } from "react-router-dom";
import moment from 'moment';
import InvoiceIcon from "../components/Icons/InvoiceIcon";
import WagesList from "../wages/WagesList";
function DashboardScreen() {
  const [paymentStatus, setPaymentStatus] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [selectedDays, setSelectedDays] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [itemsPerPage] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = invoices.slice(indexOfFirstItem, indexOfLastItem);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortColumn, setSortColumn] = useState('');
  const [living, setLiving] = useState([]);
  console.log("living", living)
  const navigate = useNavigate();

  const goToNewInvoice = (step) => {
    if (step === "step1") {
      navigate("/company")
    } else if (step === "step2") {
      navigate("/add-data")
    } else if (step === "step3") {
      navigate("/add-Client")
    } else if (step === "step4") {
      navigate("/project")
    }
  };

  const handleSelectChange = (e) => {
    setSelectedDays(e.target.value);
  };

  const handleSearch = () => {
    fetchInvoices();
  };
  const handlePaymentStatusChange = (e) => {
    setPaymentStatus(e.target.value);
  };


  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const getStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return 'paid-row';
      case 'unpaid':
        return 'unpaid-row';
      default:
        return '';
    }
  };
  const handleSort = (columnName) => {
    if (sortColumn === columnName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnName);
      setSortOrder('asc');
    }
  };

  const sortedItems = currentItems.sort((a, b) => {
    if (sortColumn === 'clientName') {
      return sortOrder === 'asc' ? a.clientName.localeCompare(b.clientName) : b.clientName.localeCompare(a.clientName);
    } else if (sortColumn === 'company') {
      return sortOrder === 'asc' ? a.company.localeCompare(b.company) : b.company.localeCompare(a.company);
    }
    return sortOrder === 'asc' ? a.clientName.localeCompare(b.clientName) : b.clientName.localeCompare(a.clientName);
  });

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const fetchInvoices = () => {
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
      const formattedFromDate = `${fromDate.getDate().toString().padStart(2, '0')}/${(fromDate.getMonth() + 1).toString().padStart(2, '0')}/${fromDate.getFullYear()}`;
      apiUrl += `?fromDate=${formattedFromDate}`;
    }
    if (paymentStatus) {
      apiUrl += apiUrl.includes('?') ? `&paymentStatus=${paymentStatus}` : `?paymentStatus=${paymentStatus}`;
    }
    if (startDate && endDate) {
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();
      apiUrl += apiUrl.includes('?') ? `&startDate=${formattedStartDate}&endDate=${formattedEndDate}` : `?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    }

    axios.get(apiUrl)
      .then((response) => {
        const filteredData = response?.data?.data?.filter(item => {
          const invoiceDate = new Date(item.selectDate);
          const selectDate = new Date(item.selectDate);
          return (!searchTerm || item.client.toLowerCase().includes(searchTerm.toLowerCase()) || item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.accNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.bankNamed.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.project.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (!selectedDays || invoiceDate >= fromDate) &&
            (!startDate || invoiceDate >= startDate) &&
            (!endDate || selectDate <= endDate);
        });
        setInvoices(filteredData.reverse());
      })
      .catch((error) => {
        console.error('Error fetching invoices:', error);
      });
  };
  useEffect(() => {
    fetchInvoices();
  }, []);


  const paidInvoicesLength = invoices.filter(item => item.paymentStatus === 'paid').length;
  const unpaidInvoicesLength = invoices.filter(item => item.paymentStatus === 'unpaid').length;
  const draftInvoicesLength = invoices.filter(item => item.paymentStatus === 'draft').length;
  const totalAUD = invoices.filter(item => item.currency === 'AUD').length
  const totalCAD = invoices.filter(item => item.currency === 'CAD').length
  const totalINR = invoices.filter(item => item.currency === 'INR').length
  const totalUSD = invoices.filter(item => item.currency === 'USD').length



  const totalAUDCr = invoices
    .filter(item => item.currency === 'AUD' && item.amount !== '')
    .reduce((total, item) => total + parseFloat(item.amount), 0);

  const totalCADCr = invoices
    .filter(item => item.currency === 'CAD' && item.amount !== '')
    .reduce((total, item) => total + parseFloat(item.amount), 0);

  const totalINRCr = invoices
    .filter(item => item.currency === 'INR' && item.amount !== '')
    .reduce((total, item) => total + parseFloat(item.amount), 0);

  const totalUSDCr = invoices
    .filter(item => item.currency === 'USD' && item.amount !== '')
    .reduce((total, item) => total + parseFloat(item.amount), 0);

  const handleGo = () => {
    fetchInvoices();
  };

  useEffect(() => {
    const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/get-empData`;
    axios.get(apiUrl)
      .then((response) => {
        setLiving(response.data.data.reverse())
      })
      .catch((error) => {
        console.error('Error fetching invoices:', error);
      });
  }, []);

  const calculateDaysLeft = (leavingDate) => {
    const today = moment();
    const leaveDate = moment(leavingDate);
    return leaveDate.diff(today, 'days');
  };

  useEffect(() => {
    living.forEach(item => {
      const daysLeft = calculateDaysLeft(item.leavingDate);
      if (daysLeft < 60) {
        alert(`Alert: 60 days left for employee ${item.empName}`);
      }
    });
  }, [living]);

  return (
    <div>
      <div className="p-4">
        <PageTitle title="Dashboard" />
      </div>
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
            className={defaultInputSmBlack}
            value={paymentStatus}
            onChange={handlePaymentStatusChange}
          >
            <option value="">Payment status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="draft">Draft</option>
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
        <button type="button" onClick={handleSearch} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Go</button>
      </div>
      <div className="flex flex-wrap" style={{ gap: '5rem', marginBottom: '3rem' }}>
        <div class=" max-w-md p-2 bg-white border border-red-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Payment Status</h5>
          </div>
          <div class="flow-root">
            <ul role="list" class="divide-y divide-red-200 dark:divide-gray-700">
              {['Paid', 'Unpaid', 'Draft'].map((status, index) => (
                <li key={index} >
                  <div class="flex items-center">
                    <div class="flex-1 min-w-0 ms-4">
                      <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {status}
                      </p>
                    </div>
                    <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      {status === 'Paid' ? paidInvoicesLength : status === 'Unpaid' ? unpaidInvoicesLength : draftInvoicesLength}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div class="flex items-center justify-between mb-4">
              <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Total Amount</h5>
            </div>
            <div class="flow-root">
              <ul role="list" class="divide-y divide-red-200 dark:divide-gray-700">
                {[
                  { currency: 'INR', total: totalINR, totalCr: totalINRCr },
                  { currency: 'AUD', total: totalAUD, totalCr: totalAUDCr },
                  { currency: 'USD', total: totalUSD, totalCr: totalUSDCr },
                  { currency: 'CAD', total: totalCAD, totalCr: totalCADCr }
                ].map((item, index) => (
                  <li key={index}>
                    <div class="flex items-center">
                      <div class="flex-1 min-w-0 ms-4">
                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {item.currency}
                        </p>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                          {item.total}
                        </p>
                      </div>
                      <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        {item.totalCr}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div class=" mb-8 border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 md:mb-12 md:grid-cols-2 bg-white dark:bg-gray-800">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3" onClick={() => handleSort('clientName')}>
                  Client Name
                  <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                </th>
                <th scope="col" className="px-6 py-3" onClick={() => handleSort('company')}>
                  Company
                  <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                </th>
                <th scope="col" className="px-6 py-3">
                  Bank Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Acc. No
                </th>
                <th scope="col" className="px-6 py-3">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => (
                <tr className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${getStatusColor(item?.paymentStatus)}`} key={item._id}>
                  <td className="px-6 py-4">{item.client || "N/A"}</td>
                  <td className="px-6 py-4">{item.company || "N/A"}</td>
                  <td className="px-6 py-4">{item.bankNamed || "N/A"}</td>
                  <td className="px-6 py-4">{item.accNo || "N/A"}</td>
                  <td className="px-6 py-4">{`${item.currency} ${item.amount}`}</td>
                  <td className="px-6 py-4">{item.selectDate ? item.selectDate.split("T")[0] : "N/A"}</td>
                  <td>
                    <Link to={`/invoice-detail/${item._id}`}>
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
              {currentPage} of {totalPages}
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
      <h2 className="font-title text-2xl ">Employee list</h2>
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              Emp. Name
            </th>
            <th scope="col" class="px-6 py-3">
              F/H Name
            </th>
            <th scope="col" class="px-6 py-3">
              Date of Joining
            </th>
            <th scope="col" class="px-6 py-3">
              Date of Living
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
          </tr>
        </thead>
        <tbody>
          {living?.map((item) => {
            const daysLeft = calculateDaysLeft(item.leavingDate);
            console.log(`Days left for ${item.empName}: ${daysLeft}`); // Log days left for debugging

            return (
              <tr
                className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${daysLeft + 1 == 60 ? 'bg-red-200' : ''}`}
                key={item._id}
              >
                <td className="px-6 py-4">
                  {item.empName || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {item.familyMember || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {item?.joinDate?.split("T")[0] || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {item?.leavingDate?.split("T")[0] || "N/A"}
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
              </tr>
            )
          })}

        </tbody>
      </table>
    </div>
  );
}

export default DashboardScreen;
