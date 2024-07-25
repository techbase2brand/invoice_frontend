import React, { useEffect, useState } from 'react';
import { defaultInputSmStyle } from '../constants/defaultStyles';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const LetterForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userName: '',
        refNo: '',
        letterHeadDate: '',
        letterHeadData: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const generateRefNo = () => {
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        const formattedRefNo = `B2B/${currentYear}-${nextYear.toString().slice(-2)}/${Math.floor(1000 + Math.random() * 9000)}`;
        return formattedRefNo;
    };

    const fetchCreditDetail = async (id) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/letter-get/${id}`);
            if (response.data.success) {
                const { userName, refNo, letterHeadDate, letterHeadData } = response.data.data;
                setFormData({
                    userName: userName || '',
                    refNo: refNo || generateRefNo(),
                    letterHeadDate: letterHeadDate || '',
                    letterHeadData: letterHeadData || ''
                });
            }
        } catch (error) {
            console.error('Error fetching appointment detail:', error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchCreditDetail(id);
        } else {
            // Set initial data for new entry
            setFormData({
                userName: '',
                refNo: generateRefNo(),
                letterHeadDate: '',
                letterHeadData: ''
            });

            fetch(`${process.env.REACT_APP_API_BASE_URL}/api/get-letter`)
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.data && data.data.length > 0) {
                        setFormData(prevFormData => ({
                            ...prevFormData,
                            letterHeadData: data.data[0].letterHeadData,
                        }));
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (id) {
                await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/letter-update/${id}`, formData);
            } else {
                await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/add-letter-data`, formData);
            }

            setFormData({
                userName: '',
                refNo: generateRefNo(),
                letterHeadDate: '',
                letterHeadData: ''
            });
            navigate('/letterHead-title');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div>
            <div className="flex-1">
                <div className="font-title font-bold text-sm my-3">Add details</div>
                <form onSubmit={handleSubmit}>
                    <div className="client-form-wrapper sm:w-1/2">
                        <div className="text-sm mb-4">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type='text'
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                placeholder="Name"
                                className={defaultInputSmStyle}
                            />
                        </div>
                        <div className="text-sm mb-4">
                            <label className="block text-sm font-medium text-gray-700">Ref. No</label>
                            <input
                                type='text'
                                name="refNo"
                                value={formData.refNo}
                                onChange={handleChange}
                                placeholder="Ref. No"
                                className={defaultInputSmStyle}
                                readOnly
                            />
                        </div>
                        <div className="text-sm mb-4">
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type='date'
                                name="letterHeadDate"
                                value={formData.letterHeadDate}
                                onChange={handleChange}
                                className={defaultInputSmStyle}
                            />
                        </div>
                        <div className="">
                            <label className="block text-sm font-medium text-gray-700">Appointment Letter</label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={formData.letterHeadData}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setFormData(prevFormData => ({
                                        ...prevFormData,
                                        letterHeadData: data
                                    }));
                                }}
                            />
                        </div>
                        <div className="mt-3">
                            <button
                                type="submit"
                                className="primary-background-color w-full text-white hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                {id ? 'Update' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LetterForm;
