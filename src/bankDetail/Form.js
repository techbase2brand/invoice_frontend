import React, { useEffect, useState } from 'react'
import { defaultInputSmStyle, validError } from '../constants/defaultStyles'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Form = () => {
    const [formData, setFormData] = useState({
        bankName: '',
        accNo: '',
        accType: '',
        BranchName: '',
        ifscCode: '',
        swiftCode: '',
        accName: '',
        tradeName: '',
    });
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError((prevErrors) => ({ ...prevErrors, [e.target.name]: '' }));
    };
    useEffect(() => {
        if (id) {
            fetchBankDetail(id);
        }
    }, [id]);

    const fetchBankDetail = async (id) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-bank-data/${id}`);
            const bankDetailData = response.data.data;
            setFormData(bankDetailData);
        } catch (error) {
            console.error('Error fetching bank detail:', error);
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const formErrors = {};
    //     const fieldsToValidate = ["bankName", "accNo", "accType", "BranchName", "ifscCode"];

    //     // Check only specific fields for validation
    //     fieldsToValidate.forEach((field) => {
    //         if (!formData[field].trim()) {
    //             formErrors[field] = `Please add ${field}`;
    //         }
    //     });

    //     if (Object.keys(formErrors).length > 0) {
    //         setError(formErrors);
    //         console.log("kkk");
    //     } else {
    //         console.log("yes");
    //         try {
    //             const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/bank-detail`, formData);
    //             if (response.status === 201) {
    //                 navigate('/bank-Detail');
    //             }
    //         } catch (error) {
    //             console.error('Error in Axios request:', error);
    //         }
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = {};
        const fieldsToValidate = ["bankName", "accNo", "accType", "BranchName", "ifscCode"];

        fieldsToValidate.forEach((field) => {
            if (!formData[field].trim()) {
                formErrors[field] = `Please add ${field}`;
            }
        });

        if (Object.keys(formErrors).length > 0) {
            setError(formErrors);
        } else {
            try {
                let response;
                if (id) {
                    response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/update-bank-data/${id}`, formData);
                } else {
                    response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/bank-detail`, formData);
                }

                if (response.status === 201 || response.status === 200) {
                    navigate('/bank-Detail');
                }
            } catch (error) {
                console.error('Error in Axios request:', error);
            }
        }
    };

    return (
        <div>
            <div className="flex-1">
                <div className="font-title font-bold text-sm my-3">Bank Form</div>
                <form onSubmit={handleSubmit}>
                    <div className="client-form-wrapper sm:w-1/2">
                        <div
                            className="text-sm mb-4"
                        >
                            <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                            <input
                                name="bankName"
                                value={formData.bankName}
                                placeholder="Bank Name"
                                className={`${defaultInputSmStyle} ${error.bankName && validError}`}
                                onChange={handleChange}
                            />

                        </div>
                        <div className="text-sm mb-4"
                        >
                            <label className="block text-sm font-medium text-gray-700">Acc. Name</label>
                            <input
                                name="accName"
                                value={formData.accName}
                                placeholder="Acc. Name"
                                className={defaultInputSmStyle}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="text-sm mb-4">
                            <label className="block text-sm font-medium text-gray-700">Acc. No</label>
                            <input

                                name="accNo"
                                value={formData.accNo}
                                placeholder="Acc No."
                                className={`${defaultInputSmStyle} ${error.accNo && validError}`}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="text-sm mb-4"
                        >
                            <label className="block text-sm font-medium text-gray-700">Ifsc Code</label>
                            <input
                                name="ifscCode"
                                value={formData.ifscCode}
                                placeholder="Ifsc Code"
                                className={`${defaultInputSmStyle} ${error.ifscCode && validError}`}
                                onChange={handleChange}
                            />

                        </div>
                        <div className="text-sm mb-4"
                        >
                            <label className="block text-sm font-medium text-gray-700">Acc. Type</label>
                            <input
                                name="accType"
                                value={formData.accType}
                                placeholder="Acc. Type"
                                className={`${defaultInputSmStyle} ${error.accType && validError}`}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="text-sm mb-4">
                            <label className="block text-sm font-medium text-gray-700">Branch Name</label>
                            <input
                                name="BranchName"
                                value={formData.BranchName}
                                placeholder="Branch Name"
                                className={`${defaultInputSmStyle} ${error.BranchName && validError}`}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="text-sm mb-4"
                        >
                            <label className="block text-sm font-medium text-gray-700">Swift Code</label>
                            <input
                                name="swiftCode"
                                value={formData.swiftCode}
                                placeholder="Swift Code"
                                className={defaultInputSmStyle}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="text-sm mb-4"
                        >
                            <label className="block text-sm font-medium text-gray-700">Trade Name</label>
                            <input
                                name="tradeName"
                                value={formData.tradeName}
                                placeholder="Trade Name"
                                className={defaultInputSmStyle}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-3">
                            <button type="submit" class="primary-background-color w-full text-white   hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" >{id ? "Update" : "Submit"}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Form