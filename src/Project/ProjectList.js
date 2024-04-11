import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { defaultInputSmBlack } from "../constants/defaultStyles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "../Pagination/Pagination";
function ProjectList() {
    const [invoices, setInvoices] = useState([]);
    const [selectedDays, setSelectedDays] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [itemsPerPage] = useState(50);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(invoices.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = invoices.slice(indexOfFirstItem, indexOfLastItem);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortColumn, setSortColumn] = useState('');

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

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };


    const handleEndDateChange = (date) => {
        setEndDate(date);
    };
    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleDuplicate = (duplicateId) => {
        const invoiceToDuplicate = invoices.find((item) => item._id === duplicateId);
        if (invoiceToDuplicate) {
            const duplicatedInvoice = { ...invoiceToDuplicate };
            duplicatedInvoice.selectDate = new Date().toISOString();
            axios.post('http://localhost:3000/api/add-clientBank', duplicatedInvoice)
                .then(response => {
                    fetchInvoices();
                })
                .catch(error => {
                    console.error('Error duplicating invoice:', error);
                });
        }
    };

    const fetchInvoices = () => {
        let apiUrl = "http://localhost:3000/api/get-invoices";
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

    const handleDelete = (deleteId) => {
        const apiUrl = `http://localhost:3000/api/delete-invoice/${deleteId}`;
        axios.delete(apiUrl);
        setInvoices(invoices.filter((item) => item._id !== deleteId));
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
    return (
        <div>

            <div style={{ display: 'flex', gap: '14px' }}>
                <h1 style={{ fontWeight: '700' }}>Total: {invoices.length}</h1>
                <p> Paid: {paidInvoicesLength}</p>
                <p> Unpaid: {unpaidInvoicesLength}</p>
                <p>Draft: {draftInvoicesLength}</p>
                <p> AUD: {totalAUD}</p>
                <p> CAD: {totalCAD}</p>
                <p> INR: {totalINR}</p>
                <p> USD: {totalUSD}</p>
            </div>
            <div style={{ display: 'flex', gap: '14px' }}>
                <p>Total Amount</p>
                <p> AUD: {totalAUDCr}</p>
                <p> CAD: {totalCADCr}</p>
                <p> INR: {totalINRCr}</p>
                <p> USD: {totalUSDCr}</p>
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
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                            <th scope="col" className="px-6 py-3">
                                Create
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Duplicate
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
                                <td style={{ display: 'flex', gap: '20px' }}>
                                    <Link to={`/project/${item._id}`}>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="feather feather-edit" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        </span>
                                    </Link>
                                    <span onClick={() => handleDelete(item._id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 16 16">
                                            <path d="M 6.496094 1 C 5.675781 1 5 1.675781 5 2.496094 L 5 3 L 2 3 L 2 4 L 3 4 L 3 12.5 C 3 13.328125 3.671875 14 4.5 14 L 10.5 14 C 11.328125 14 12 13.328125 12 12.5 L 12 4 L 13 4 L 13 3 L 10 3 L 10 2.496094 C 10 1.675781 9.324219 1 8.503906 1 Z M 6.496094 2 L 8.503906 2 C 8.785156 2 9 2.214844 9 2.496094 L 9 3 L 6 3 L 6 2.496094 C 6 2.214844 6.214844 2 6.496094 2 Z M 5 5 L 6 5 L 6 12 L 5 12 Z M 7 5 L 8 5 L 8 12 L 7 12 Z M 9 5 L 10 5 L 10 12 L 9 12 Z"></path>
                                        </svg>
                                    </span>
                                </td>
                                <td>
                                    <Link to={`/invoice-detail/${item._id}`}>
                                        <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">pdf</button>
                                    </Link>
                                </td>
                                <td>
                                    <button type="button" className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900" onClick={() => handleDuplicate(item._id)}>Duplicate</button>
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
    );
}

export default ProjectList;
