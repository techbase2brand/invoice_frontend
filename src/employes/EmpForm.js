import React, { useEffect, useState } from 'react'
import { defaultInputSmStyle, validError } from '../constants/defaultStyles'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const EmpForm = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    empName: '',
    familyMember: '',
    joinDate: '',
    department: '',
    designation: '',
    empCode: '',
    companyName: '',
  });
  const [error, setError] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      fetchBankDetail(id);
    }
  }, [id]);

  const fetchBankDetail = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-emp-data/${id}`);
      const bankDetailData = response.data.data;
      bankDetailData.joinDate = bankDetailData.joinDate ? new Date(bankDetailData.joinDate) : null;
      setFormData(bankDetailData);
      setSelectedDate(bankDetailData.joinDate);
    } catch (error) {
      console.error('Error fetching bank detail:', error);
    }
  };

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'joinDate') {
      setFormData({ ...formData, [name]: selectedDate });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };


  const handleDateChange = (date) => {
    const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    setSelectedDate(date);
    setFormData({ ...formData, joinDate: adjustedDate });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = {};
    const fieldsToValidate = ["empName", "empCode"];

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
        const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
        const updatedFormData = { ...formData, joinDate: formattedDate };

        if (id) {
          response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/update-emp-data/${id}`, updatedFormData);
        } else {
          response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/add-emp-data`, updatedFormData);
        }
        if (response.status === 201 || response.status === 200) {
          navigate('/emp-data');
        }
      } catch (error) {
        console.error('Error in Axios request:', error);
      }
    }
  };


  return (
    <div>
      <div className="flex-1">
        <div className="font-title font-bold text-sm my-3">Add Employee</div>
        <form onSubmit={handleSubmit}>
          <div className="client-form-wrapper sm:w-1/2">
            <div
              className="text-sm mb-4"
            >
              <label className="block text-sm font-medium text-gray-700">Emp.Name</label>
              <input
                name="empName"
                value={formData.empName}
                placeholder="Emp. Name"
                className={`${defaultInputSmStyle} ${error.empName && validError}`}
                onChange={handleChange}
              />

            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">F/H Name</label>
              <input

                name="familyMember"
                value={formData.familyMember}
                placeholder="F/H Name"
                className={`${defaultInputSmStyle} ${error.familyMember && validError}`}
                onChange={handleChange}
              />
            </div>
            <div className="text-sm mb-4"
            >
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <input
                name="designation"
                value={formData.designation}
                placeholder="Designation"
                className={`${defaultInputSmStyle} ${error.designation && validError}`}
                onChange={handleChange}
              />

            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
              <DatePicker
                selected={selectedDate}
                placeholderText='Date of Joining'
                onChange={handleDateChange}
                className={defaultInputSmStyle}
              />
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">Dept.</label>
              <input
                name="department"
                value={formData.department}
                placeholder="Department"
                className={`${defaultInputSmStyle} ${error.department && validError}`}
                onChange={handleChange}
              />
            </div>

            <div className="text-sm mb-4"
            >
              <label className="block text-sm font-medium text-gray-700">Employee Code</label>
              <input
                name="empCode"
                value={formData.empCode}
                placeholder="Employee Code"
                className={`${defaultInputSmStyle} ${error.empCode && validError}`}
                onChange={handleChange}
              />
            </div>

            <div className="text-sm mb-4"
            >
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                name="companyName"
                value={formData.companyName}
                placeholder="Company Name"
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

export default EmpForm