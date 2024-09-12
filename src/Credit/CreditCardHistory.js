import React, { useEffect, useState } from "react";
import PageTitle from "../components/Common/PageTitle";
import axios from "axios";
import { defaultInputSmBlack } from "../constants/defaultStyles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreditCardHistory = () => {
    const [data, setData] = useState([]);
    console.log("data", data)
    const [bankAccountOptions, setBankAccountOptions] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [filterData, setFilterData] = useState('');
    const [file, setFile] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [dateRange, setDateRange] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("accountId", selectedAccount);
        const today = new Date().toISOString().split('T')[0];
        formData.append("created_at", today);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/importUser`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {
                fetchData();
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const headers = {
              'Authorization': `Bearer ${token}`,  // Use the token from localStorage
              'Content-Type': 'application/json',  // Add any other headers if needed
            };
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/api/credit-history`,{headers}
            );
            if (response.data.success) {
                const fetchedData = response.data.data.reverse();
                const options = fetchedData.map(item => ({
                    value: item._id,
                    label: `${item.bankName} (${item.accNo})`
                }));
                setBankAccountOptions(options);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const fetchFilterData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/csv-history`);
            if (response.data.success) {
                const fetchedData = response.data.data;
                const filteredData = fetchedData.filter(item => item.accountId === filterData);
                setData(filteredData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const handleGo = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/csv-history`);
            if (response.data.success) {
                let fetchedData = response.data.data;

                if (filterData) {
                    fetchedData = fetchedData.filter(item => item.accountId === filterData);
                }

                if (searchText) {
                    fetchedData = fetchedData.filter(item =>
                        item.csvData.some(csvItem =>
                            Object.values(csvItem).some(val =>
                                String(val).toLowerCase().includes(searchText.toLowerCase())
                            )
                        )
                    );
                }

                if (dateRange) {
                    const now = new Date();
                    const dateLimit = new Date();
                    dateLimit.setDate(now.getDate() - parseInt(dateRange));

                    fetchedData = fetchedData.filter(item =>
                        new Date(item.created_at) >= dateLimit
                    );
                }

                if (startDate && endDate) {
                    fetchedData = fetchedData.filter(item => {
                        const createdAt = new Date(item.created_at);
                        return createdAt >= startDate && createdAt <= endDate;
                    });
                }

                setData(fetchedData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchFilterData();
    }, [filterData, searchText, dateRange, startDate, endDate]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row flex-wrap p-4">
                <div className="sm:mr-4">
                    <PageTitle title="Upload CSV" />
                </div>
            </div>
            <div className="flex flex-wrap border-b-4 border-indigo-500">
                <div className="flex justify-around items-center w-full px-4 mb-4 sm:mb-1">
                    <div className="w-[30%] mb-2 sm:mb-0 relative">
                        <div className="font-bold text-center">Please Upload csv File here</div>
                        <div className="mb-2">
                            <select
                                className={defaultInputSmBlack}
                                value={selectedAccount}
                                onChange={(e) => setSelectedAccount(e.target.value)}
                            >
                                <option value="">Select</option>
                                {bankAccountOptions.map((option, index) => (
                                    <option key={index} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {selectedAccount && (
                        <>
                            <div className="flex items-center justify-center bg-grey-lighter">
                                <label className="w-64 flex flex-col items-center px-4 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue">
                                    <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                    </svg>
                                    {!file ?
                                        <span className="mt-2 text-base leading-normal">Select a CSV file</span> :
                                        <span className="mt-2 text-base leading-normal">Selected successfully</span>
                                    }
                                    <span className="text-red-500">{file?.name}</span>
                                    <input type='file' className="hidden" onChange={handleFileChange} />
                                </label>
                            </div>
                            <button onClick={handleFileUpload} className="flex gap-1 px-12 py-2 rounded-full bg-[#1ED760] font-bold text-white transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200">
                                <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                </svg>
                                <span>Upload CSV</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                <div className="sm:mr-4 text-center">
                    <h2 className="font-title text-2xl text-red-600">Please Select the bank for check history</h2>
                </div>
                <div className="w-[100%] flex flex-col justify-center items-center mb-2 sm:mb-0 relative border-b-4 border-indigo-500">
                    <div className="font-bold text-center">Please Select Bank</div>
                    <div className="mb-2">
                        <select
                            className={defaultInputSmBlack}
                            value={filterData}
                            onChange={(e) => setFilterData(e.target.value)}
                        >
                            <option value="">Select</option>
                            {bankAccountOptions.map((option, index) => (
                                <option key={index} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    {filterData &&
                    <>
                    <div style={{ display: 'flex', gap: '3px' }} className="justify-center mb-3">
                        <div className="client-form-wrapper" style={{ width: '12%' }}>
                            <input
                                type="text"
                                placeholder="Search"
                                className={defaultInputSmBlack}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                        <div>
                            <select
                                className={defaultInputSmBlack}
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                            >
                                <option value="">Select date range</option>
                                <option value="7">Last 1 week</option>
                                <option value="30">Last 1 month</option>
                                <option value="90">Last 3 months</option>
                                <option value="180">Last 6 months</option>
                                <option value="365">Last 1 year</option>
                            </select>
                        </div>
                        <div className="date-range-picker" style={{ display: 'flex' }}>
                            <DatePicker
                                className={defaultInputSmBlack}
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                placeholderText="Select start date"
                            />
                            <span className="text-gray-500">to</span>
                            <DatePicker
                                className={defaultInputSmBlack}
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                placeholderText="Select end date"
                            />
                        </div>
                    </div>
                    <div className="w-[100%] flex justify-center">
                        <button type="button" class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-16 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900" onClick={handleGo}>Go</button>
                    </div>
                    </>
}
                </div>
                {data.map((record, index) => {
                     const totalAmount = record.csvData.reduce((sum, item) => {
                        return sum + parseFloat(item.Total) || 0;
                    }, 0).toFixed(2);
                    return (
                    <div key={index} className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                        <div className="font-bold">Date :- {record.created_at}</div>
                        <div className="font-bold flex justify-end mr-[8rem]">Total :-{totalAmount} </div>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">

                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Description</th>
                                    <th scope="col" className="px-6 py-3">Debit</th>
                                    <th scope="col" className="px-6 py-3">Credit</th>
                                    <th scope="col" className="px-6 py-3">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {record.csvData.map((item, itemIndex) => (
                                    <tr key={itemIndex} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4">{item.Date}</td>
                                        <td className="px-6 py-4">{item.Description}</td>
                                        <td className="px-6 py-4">{item.Debit}</td>
                                        <td className="px-6 py-4">{item.Credit}</td>
                                        <td className="px-6 py-4">{item.Total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )})}
            </div>
        </div>
    );
};

export default CreditCardHistory;
