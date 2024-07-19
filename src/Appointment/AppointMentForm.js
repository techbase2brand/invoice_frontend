import React, { useEffect, useState } from 'react';
import { defaultInputSmStyle } from '../constants/defaultStyles';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom';

const AppointMentForm = () => {
    const [formData, setFormData] = useState({
        refNo: '',
        appointmentDate: '',
        appointMentData: ''
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/get-appointmentLetter`)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.data && data.data.length > 0) {
                    setFormData({
                        appointMentData: data.data[0].appointMentData,
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/add-appointmentLetter`, formData);
            console.log('Success:', response.data);

            setFormData({
                refNo: '',
                appointmentDate: '',
                appointMentData: ''
            });
            navigate('/appointment-letter')
        } catch (error) {
            console.error('Error submitting form:', error);
            // Handle error state
        }
    };

    return (
        <div>
            <div className="flex-1">
                <div className="font-title font-bold text-sm my-3">Add details</div>
                <form onSubmit={handleSubmit}>
                    <div className="client-form-wrapper sm:w-1/2">
                        <div className="text-sm mb-4">
                            <label className="block text-sm font-medium text-gray-700">Ref. No</label>
                            <input
                                type='text'
                                name="refNo"
                                value={formData.refNo}
                                onChange={handleChange}
                                placeholder="Ref. No"
                                className={defaultInputSmStyle}
                            />
                        </div>
                        <div className="text-sm mb-4">
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type='date'
                                name="appointmentDate"
                                value={formData.appointmentDate}
                                onChange={handleChange}
                                className={defaultInputSmStyle}
                            />
                        </div>
                        <div className="">
                            <label className="block text-sm font-medium text-gray-700">Appointment Letter</label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={formData.appointMentData}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setFormData({
                                        ...formData,
                                        appointMentData: data
                                    });
                                }}
                            />
                        </div>
                        <div className="mt-3">
                            <button
                                type="submit"
                                className="primary-background-color w-full text-white hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppointMentForm;
