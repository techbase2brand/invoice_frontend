import React, { useEffect, useState } from 'react';
import { defaultInputSmStyle, validError } from '../constants/defaultStyles';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const FormCli = () => {
    const [formData, setFormData] = useState({
        TradeName: '',
        ifsc: '',
        gstNo: '',
        mobileNo: '',
    });
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetchClientDetail(id);
        }
    }, [id]);

    const fetchClientDetail = async (id) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-client-data/${id}`);
            const bankDetailData = response.data.data;
            setFormData(bankDetailData);
        } catch (error) {
            console.error('Error fetching bank detail:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError((prevErrors) => ({ ...prevErrors, [e.target.name]: '' }));
    };

 

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const formErrors = {};
    //     const fieldsToValidate = ["clientName"];
    //     fieldsToValidate.forEach((field) => {
    //         if (!formData[field].trim()) {
    //             formErrors[field] = `Please add ${field}`;
    //         }
    //     });

    //     if (Object.keys(formErrors).length > 0) {
    //         setError(formErrors);
    //     } else {
    //         try {
    //             let response;
    //             if (id) {
    //                 response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/update-client/${id}`, formData);
    //             } else {
    //                 response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/client-detail`, formData);
    //             }
    //             if (response.status === 201 || response.status === 200) {
    //                 navigate("/client-Detail")
    //             }
    //         } catch (error) {
    //             console.error('Error in Axios request:', error);
    //         }
    //     }
    // };


    return (
        <div>
            <div className="flex-1">
                <div className="font-title font-bold text-sm my-3">Add Client Detail</div>
                <form onSubmit={handleSubmit}>
                    <div className="client-form-wrapper sm:w-1/2">
                        <div
                            className="text-sm mb-4"
                        >
                            <label className="block text-sm font-medium text-gray-700">Client Name</label>
                            <input
                                type='text'
                                placeholder="Client Name"
                                name='clientName'
                                value={formData.clientName}
                                className={`${defaultInputSmStyle} ${error.clientName && validError}`}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="text-sm mb-4">
                            <label className="block text-sm font-medium text-gray-700">Company Name</label>
                            <input
                                type='text'
                                placeholder="Company Name"
                                name='company'
                                value={formData.company}
                                className={defaultInputSmStyle}
                                onChange={handleChange}
                            />

                        </div>
                        <div className="text-sm mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                placeholder="email"
                                name='email'
                                value={formData.email}
                                className={defaultInputSmStyle}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="text-sm mb-4"
                        >
                            <label className="block text-sm font-medium text-gray-700">Mobile No</label>
                            <input
                                type='text'
                                placeholder="mobile no"
                                name='mobileNo'
                                value={formData.mobileNo}
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

export default FormCli;