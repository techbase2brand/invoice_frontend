import React, { useEffect, useState } from "react";
import PageTitle from "../components/Common/PageTitle";
import axios from "axios";
import { defaultInputSmBlack } from "../constants/defaultStyles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreditCardHistory = () => {
    const [data, setData] = useState([]);
    console.log("data", data);
    const [bankAccountOptions, setBankAccountOptions] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [filterData, setFilterData] = useState('');
    console.log("filterData", filterData);
    const [file, setFile] = useState(null);

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
                `${process.env.REACT_APP_API_BASE_URL}/importUser`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {
                // Optionally, fetch updated data after successful upload
                fetchData();
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/credit-history`
            );
            if (response.data.success) {
                const fetchedData = response.data.data.reverse();
                // Create bank account options with bank name and account number
                const options = fetchedData.map(item => ({
                    value: item._id, // Use _id as the value
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
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/csv-history`);
            if (response.data.success) {
                const fetchedData = response.data.data;
                const filteredData = fetchedData.filter(item => item.accountId === filterData);

                setData(filteredData);
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
    }, [filterData]);

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
                    {selectedAccount &&
                        <>
                            <div class="flex  items-center justify-center bg-grey-lighter">
                                <label class="w-64 flex flex-col items-center px-4  bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue ">
                                    <svg class="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                    </svg>
                                    {!file ?
                                        <span class="mt-2 text-base leading-normal">Select a CSV file</span>
                                        :
                                        <span class="mt-2 text-base leading-normal">Selected successfully</span>
                                    }
                                    <span className="text-red-500">{file?.name}</span>
                                    <input type='file' class="hidden" onChange={handleFileChange} />
                                </label>
                            </div>
                            <button onClick={handleFileUpload} className="flex gap-1 px-12 py-2 rounded-full bg-[#1ED760] font-bold text-white  transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200">
                                <svg class="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                </svg>
                                <span>Upload CSV</span>
                            </button>
                        </>
                    }
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
                </div>
                <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                    <div style={{ display: 'flex', gap: '3px' }} className="justify-center mb-3">
                        <div className="client-form-wrapper" style={{ width: '12%' }}>
                            <input
                                type="text"
                                placeholder="Search"
                                className={defaultInputSmBlack}
                            />
                        </div>
                        <div>
                            <select
                                className={defaultInputSmBlack}
                            // onChange={handleSelectChange}
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
                                // selected={startDate}
                                // onChange={handleStartDateChange}
                                placeholderText="Select start date"
                            />
                            <span className=" text-gray-500">to</span>
                            <DatePicker
                                className={defaultInputSmBlack}
                                // selected={endDate}
                                // onChange={handleEndDateChange}
                                placeholderText="Select end date"
                            />
                        </div>
                    </div>
                    <div className="w-[100%] flex justify-center">
                    <button type="button" class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-16 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Go</button>
                    </div>
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Date
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Description
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Debit
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Credit
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4">
                                    sd
                                </td>
                                <td className="px-6 py-4">
                                    sdf
                                </td>
                                <td className="px-6 py-4">
                                    sdf
                                </td>
                                <td className="px-6 py-4">
                                    dsf
                                </td>
                                <td className="px-6 py-4">
                                    sdf
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {/* <div className="flex justify-center mt-4">
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
                </div> */}
                </div>
            </div>
        </div>
    );
};

export default CreditCardHistory;
