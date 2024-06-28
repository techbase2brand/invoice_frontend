import React, { useEffect, useState } from 'react';
import { defaultInputSmStyle, validError } from '../constants/defaultStyles';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const FormCli = () => {
    const [formData, setFormData] = useState({
        clientName: '',
        company: '',
        email: '',
        mobileNo: '',
        project: [''],
        invoiceDate: new Date()
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
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/get-client-data/${id}`);
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

    // const handleDateChange = (date) => {
    //     setFormData({ ...formData, invoiceDate: date });
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = {};
        const fieldsToValidate = ["clientName"];
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
                    response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/update-client/${id}`, formData);
                } else {
                    response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/client-detail`, formData);
                }
                if (response.status === 201 || response.status === 200) {
                    navigate("/client-Detail")
                }
            } catch (error) {
                console.error('Error in Axios request:', error);
            }
        }
    };

    const handleProjectChange = (value, index) => {
        const updatedProjects = [...formData.project];
        updatedProjects[index] = value;
        setFormData({ ...formData, project: updatedProjects });
    };

    const handleAddProject = () => {
        setFormData({ ...formData, project: [...formData.project, ''] });
    };

    const handleRemoveProject = (index) => {
        const updatedProjects = [...formData.project];
        updatedProjects.splice(index, 1);
        setFormData({ ...formData, project: updatedProjects });
    };

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
                        {/* <div className="text-sm mb-4">
                            <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
                            <DatePicker
                                className={defaultInputSmStyle}
                                selected={formData.invoiceDate}
                                onChange={handleDateChange}
                            />
                        </div> */}
                        {formData.project.map((project, index) => (
                            <div key={index} className="text-sm mb-4">
                                <label className="block text-sm font-medium text-gray-700">Task</label>
                                <input
                                    type='text'
                                    placeholder={`Task Name ${index + 1}`}
                                    name={`project-${index}`}
                                    value={project}
                                    className={defaultInputSmStyle}
                                    onChange={(e) => handleProjectChange(e.target.value, index)}
                                />
                                {index !== 0 && (
                                    <div style={{ float: 'right' }} onClick={() => handleRemoveProject(index)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 1024 1024"><path fill="currentColor" d="M696 480H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8" /><path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372" /></svg>
                                    </div>
                                )}
                                {index === formData.project.length - 1 && (
                                    <div style={{ float: 'right' }} onClick={handleAddProject}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8" /><path fill="currentColor" d="M15 11h-2V9a1 1 0 0 0-2 0v2H9a1 1 0 0 0 0 2h2v2a1 1 0 0 0 2 0v-2h2a1 1 0 0 0 0-2" /></svg>
                                    </div>
                                )}
                            </div>
                        ))}
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