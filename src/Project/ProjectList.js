import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
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
    const [duplicateFilter, setDuplicateFilter] = useState("");
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
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

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
    console.log("sortedItems", sortedItems)

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

    const handleDuplicate = (duplicateId) => {
        const invoiceToDuplicate = invoices.find((item) => item._id === duplicateId);
        if (invoiceToDuplicate) {
            const duplicatedInvoice = { ...invoiceToDuplicate };
            delete duplicatedInvoice._id;
            duplicatedInvoice.selectDate = new Date().toISOString();
            duplicatedInvoice.duplicate = "Duplicated";
            axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/add-clientBank`, duplicatedInvoice)
                .then(response => {
                    fetchInvoices();
                })
                .catch(error => {
                    console.error('Error duplicating invoice:', error);
                });
        }
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
                    return (!searchTerm || item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.accNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.bankNamed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.accName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.mobileNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.tradeName.toLowerCase().includes(searchTerm.toLowerCase())
                    ) &&
                        (!selectedDays || invoiceDate >= fromDate) &&
                        (!startDate || invoiceDate >= startDate) &&
                        (!endDate || selectDate <= endDate) &&
                        (!duplicateFilter || item.duplicate === duplicateFilter);
                });
                setInvoices(filteredData.reverse());
            })
            .catch((error) => {
                console.error('Error fetching invoices:', error);
            });
    };

    const handleDelete = (deleteId) => {
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/delete-invoice/${deleteId}`;
        axios.delete(apiUrl);
        setInvoices(invoices.filter((item) => item._id !== deleteId));
    };

    const handleDuplicateFilterChange = (e) => {
        setDuplicateFilter(e.target.value);
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
    const DuplicateData = invoices.filter(item => item.duplicate === 'Duplicated').length;

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
            <h1 className="font-black">Invoices: {invoices.length}</h1>
            <div style={{ display: 'flex', gap: '14px' }}>

                <p><span className="font-black"> Paid:</span> {paidInvoicesLength}</p>
                <p> <span className="font-black">Unpaid:</span> {unpaidInvoicesLength}</p>
                <p><span className="font-black">Draft:</span> {draftInvoicesLength}</p>
                <p><span className="font-black"> AUD:</span> {totalAUD}</p>
                <p> <span className="font-black">CAD:</span> {totalCAD}</p>
                <p> <span className="font-black">INR:</span> {totalINR}</p>
                <p> <span className="font-black">USD:</span> {totalUSD}</p>
            </div>
            <div style={{ display: 'flex', gap: '14px' }}>
                <p><span className="font-black">Total Amount</span></p>
                <p> <span className="font-black">AUD:</span> {totalAUDCr}</p>
                <p><span className="font-black"> CAD:</span> {totalCADCr}</p>
                <p> <span className="font-black">INR:</span> {totalINRCr}</p>
                <p><span className="font-black"> USD:</span> {totalUSDCr}</p>
            </div>
            <h1><span className="font-black">Duplicated:</span>{DuplicateData}</h1>
            <div style={{ display: 'flex', gap: '3px' }}>
                <div className="client-form-wrapper">
                    <input
                        type="text"
                        placeholder="Search"
                        className='inputStyle'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div>
                    <select
                        className='inputStyle'
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
                        className='inputStyle'
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
                    <select value={duplicateFilter} onChange={handleDuplicateFilterChange} className='inputStyle'>
                        <option value="">Filter by Duplicate Status</option>
                        <option value="Duplicated">Duplicated</option>
                        <option value="">Not Duplicated</option>
                    </select>
                </div>
                <div className="date-range-picker" style={{ display: 'flex' }}>
                    <DatePicker
                        className='inputStyle'
                        selected={startDate}
                        onChange={handleStartDateChange}
                        placeholderText="Select start date"
                    />
                    <span className="toRange">to</span>
                    <DatePicker
                        className='inputStyle'
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
                            <th>
                                Status
                            </th>
                            {/* <th scope="col" className="px-6 py-3">
                                Advance Amount
                            </th> */}
                            <th scope="col" className="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                            {/* <th scope="col" className="px-6 py-3">
                                Create
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Duplicate
                            </th>
                            <th></th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedItems.map((item) => (
                            <tr className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${getStatusColor(item?.paymentStatus)}`} key={item._id}>
                                <td className="px-6 py-4">{item.client || "N/A"}</td>
                                <td className="px-6 py-4">{item.company || "N/A"}</td>
                                <td className="px-6 py-4">{item.bankNamed || "N/A"}</td>
                                <td className="px-6 py-4">{item.accNo || "N/A"}</td>
                                <td>
                                    {item.duplicate &&
                                        <span class="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">{item.duplicate}</span>
                                    }
                                </td>
                                {/* <td className="px-6 py-4">{item.currency} {item.amount}</td> */}
                                <td className="px-6 py-4">{item.selectDate ? item.selectDate.split("T")[0] : "N/A"}</td>
                                <td className="p-0">
                                    <div key={item._id} className="">
                                        <button
                                            id={`menuButton-${item._id}`}
                                            type="button"
                                            className="rounded-full p-2 bg-gray-300"
                                            onClick={() => handleToggleDropdown(item._id)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                            </svg>
                                        </button>
                                        {openItemId === item._id && (
                                            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                                <div className="py-1 flex flex-col space-y-2" role="menu" aria-orientation="vertical" aria-labelledby={`menuButton-${item._id}`}>
                                                    <Link to={`/project/${item._id}`} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100" role="menuitem">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="feather feather-edit w-6 h-6 mr-2" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                        Edit
                                                    </Link>
                                                    <button className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none" onClick={() => handleDelete(item._id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 16 16" className="w-6 h-6 mr-2">
                                                            <path d="M 6.496094 1 C 5.675781 1 5 1.675781 5 2.496094 L 5 3 L 2 3 L 2 4 L 3 4 L 3 12.5 C 3 13.328125 3.671875 14 4.5 14 L 10.5 14 C 11.328125 14 12 13.328125 12 12.5 L 12 4 L 13 4 L 13 3 L 10 3 L 10 2.496094 C 10 1.675781 9.324219 1 8.503906 1 Z M 6.496094 2 L 8.503906 2 C 8.785156 2 9 2.214844 9 2.496094 L 9 3 L 6 3 L 6 2.496094 C 6 2.214844 6.214844 2 6.496094 2 Z M 5 5 L 6 5 L 6 12 L 5 12 Z M 7 5 L 8 5 L 8 12 L 7 12 Z M 9 5 L 10 5 L 10 12 L 9 12 Z"></path>
                                                        </svg>
                                                        Delete
                                                    </button>
                                                    <Link to={`/invoice-detail/${item._id}`} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="feather feather-file w-6 h-6 mr-2" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M15.25 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /><path d="M15.25 2v4.75h4.75" /></svg>
                                                        Download PDF
                                                    </Link>
                                                    <button className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none" onClick={() => handleDuplicate(item._id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="feather feather-file w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                                        </svg>
                                                        Duplicate
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

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
    );
}

export default ProjectList;
