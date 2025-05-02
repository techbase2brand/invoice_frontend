import React, { useEffect, useState } from 'react';
import { defaultInputSmStyle } from '../constants/defaultStyles';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreditForm = () => {
    const [stateMentDate, setStateMentDate] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        accNo: '',
        bankName: '',
        stateMentDate: '',
        dueDate: '',
    });
    const [errors, setErrors] = useState({});

    //Getting data according to id
    const fetchCreditDetail = async (id) => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const headers = {
          'Authorization': `Bearer ${token}`,  // Use the token from localStorage
          'Content-Type': 'application/json',  // Add any other headers if needed
        };
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/update-credit-data/${id}`,{headers});
            const bankDetailData = response.data.data;
            // Check if dates are valid before setting them
            if (bankDetailData.stateMentDate) {
                setStateMentDate(new Date(bankDetailData.stateMentDate));
            } else {
                setStateMentDate(null);
            }

            if (bankDetailData.dueDate) {
                setDueDate(new Date(bankDetailData.dueDate));
            } else {
                setDueDate(null);
            }

            setFormData({
                accNo: bankDetailData.accNo || '',
                bankName: bankDetailData.bankName || '',
                stateMentDate: bankDetailData.stateMentDate || '',
                dueDate: bankDetailData.dueDate || '',
            });
        } catch (error) {
            console.error('Error fetching bank detail:', error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchCreditDetail(id);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleDateChange = (date, fieldName) => {
        const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        setFormData({ ...formData, [fieldName]: adjustedDate.toISOString() });

        if (fieldName === 'stateMentDate') {
            setStateMentDate(date);
        } else if (fieldName === 'dueDate') {
            setDueDate(date);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const headers = {
            'Authorization': `Bearer ${token}`,  // Use the token from localStorage
            'Content-Type': 'application/json',  // Add any other headers if needed
        };
        const newErrors = {};
        if (!formData.accNo) {
            newErrors.accNo = 'Acc. No is required';
        }

        if (!formData.bankName) {
            newErrors.bankName = 'Bank Name is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            if (id) {
                await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/update-detail/${id}`, formData, { headers });
            } else {
                await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/add-bank-data`, formData, { headers });
            }
            navigate('/credit-details');
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };
    const goBack = () => {
        navigate(-1);
      };
    return (
        <div>
             <button style={{ fontSize: "40px" }} onClick={goBack}>
        ←
      </button>
            <div className="flex-1">
                <div className="font-title font-bold text-sm my-3">Add details</div>
                <form onSubmit={handleSubmit}>
                    <div className="client-form-wrapper sm:w-1/2">
                        <div className="text-sm mb-4">
                            <label className="block text-sm font-medium text-gray-700">Acc. No</label>
                            <input
                                name="accNo"
                                value={formData.accNo}
                                placeholder="Acc. No"
                                className={defaultInputSmStyle}
                                onChange={handleChange}
                            />
                            {errors.accNo && <div className="text-red-500 text-sm">{errors.accNo}</div>}
                        </div>
                        <div className="text-sm mb-4">
                            <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                            <input
                                name="bankName"
                                value={formData.bankName}
                                placeholder="Bank Name"
                                className={defaultInputSmStyle}
                                onChange={handleChange}
                            />
                            {errors.bankName && <div className="text-red-500 text-sm">{errors.bankName}</div>}
                        </div>
                        <div className='flex justify-around'>
                            <div className="text-sm mb-4">
                                <label className="block text-sm font-medium text-gray-700">Statement Date</label>
                                <DatePicker
                                    selected={stateMentDate}
                                    placeholderText="Statement Date"
                                    onChange={(date) => handleDateChange(date, 'stateMentDate')}
                                    className={defaultInputSmStyle}
                                    showYearDropdown
                                    showMonthDropdown
                                    dateFormat="yyyy-MM-dd"
                                    yearDropdownItemNumber={15}
                                    scrollableYearDropdown
                                />
                            </div>
                            <div className="text-sm mb-4">
                                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                                <DatePicker
                                    selected={dueDate}
                                    placeholderText="Due Date"
                                    onChange={(date) => handleDateChange(date, 'dueDate')}
                                    className={defaultInputSmStyle}
                                    showYearDropdown
                                    showMonthDropdown
                                    dateFormat="yyyy-MM-dd"
                                    yearDropdownItemNumber={15}
                                    scrollableYearDropdown
                                />
                            </div>
                        </div>
                        <div className="mt-3">
                            <button
                                type="submit"
                                className="primary-background-color w-full text-white hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                {id ? "Update" : "Submit"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreditForm;
