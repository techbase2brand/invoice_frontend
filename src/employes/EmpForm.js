import React, { useEffect, useState } from 'react'
import { defaultInputSmStyle, validError } from '../constants/defaultStyles'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import dayjs from 'dayjs';
const EmpForm = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedleavingDate, setSelectedLeavingDate] = useState(null);
  const [formData, setFormData] = useState({
    empName: '',
    email: '',
    mobileNo: '',
    familyMember: '',
    joinDate: '',
    leavingDate: '',
    tenure: '',
    department: '',
    designation: '',
    empCode: '',
    companyName: '',
    companylogo: '',
  });
  console.log("formDatra", formData);
  const [error, setError] = useState(false);
  const [img, setImg] = useState(false);
  const { id } = useParams();
  const [tenure1, setTenure] = useState();
  useEffect(() => {
    if (id) {
      fetchBankDetail(id);
      setImg(false);
    }
  }, [id]);

  const fetchBankDetail = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/get-emp-data/${id}`);
      const bankDetailData = response.data.data;
      bankDetailData.joinDate = bankDetailData.joinDate && moment(bankDetailData.joinDate).isValid() ? moment(bankDetailData.joinDate).toDate() : null;
      bankDetailData.leavingDate = bankDetailData.leavingDate && moment(bankDetailData.leavingDate).isValid() ? moment(bankDetailData.leavingDate).toDate() : null;
      setFormData(bankDetailData);
      setSelectedDate(bankDetailData.joinDate);
      setSelectedLeavingDate(bankDetailData.leavingDate);
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
    const localDate = moment(date).startOf('day').toDate();
    setSelectedDate(localDate);
    setFormData({ ...formData, joinDate: adjustedDate });
  };
  const handleLeaveDateChange = (date) => {
    const adjustDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const localDates = moment(date).startOf('day').toDate();
    setSelectedLeavingDate(localDates);
    setFormData({ ...formData, leavingDate: adjustDate });
  }


  // Date based get days
  useEffect(() => {
    if (selectedDate && selectedleavingDate) {
      const date1 = new Date(selectedDate);
      const date2 = new Date(selectedleavingDate);
      const timeDifference = Math.abs(date2.getTime() - date1.getTime());
      const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      setFormData((prevFormData) => ({
        ...prevFormData,
        tenure: dayDifference,
      }));
    }
  }, [selectedDate, selectedleavingDate]);

  useEffect(() => {
    if (formData.leavingDate) {
      const calculateTenure = () => {
        const today = dayjs();
        const leavingDate = dayjs(formData.leavingDate);
        return leavingDate.diff(today, 'day');
      };
      setTenure(calculateTenure());
    }
  }, [formData.leavingDate]);

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
        // const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
        const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
        const livingDate = moment(selectedleavingDate).format('YYYY-MM-DD');
        const updatedFormData = { ...formData, joinDate: formattedDate, leavingDate: livingDate, tenure:tenure1 };

        if (id) {
          response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/update-emp-data/${id}`, updatedFormData);
        } else {
          response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/add-emp-data`, updatedFormData);
        }
        if (response.status === 201 || response.status === 200) {
          navigate('/emp-data');
        }
      } catch (error) {
        console.error('Error in Axios request:', error);
      }
    }
  };
  // const handleLogoUpload = async (e) => {
  //   setImg(true);
  //   const file = e.target.files[0];
  //   const formData = new FormData();
  //   formData.append('image', file);

  //   try {
  //     const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/upload-wages-logo`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });
  //     const imageUrl = response.data.imageUrl;
  //     setFormData(prevFormData => ({ ...prevFormData, companylogo: imageUrl }));
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //   }
  // };


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
            <div
              className="text-sm mb-4"
            >
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                value={formData.email}
                placeholder="Email"
                className={`${defaultInputSmStyle} ${error.email && validError}`}
                onChange={handleChange}
              />

            </div>
            <div className="text-sm mb-4"
            >
              <label className="block text-sm font-medium text-gray-700">Mobile No</label>
              <input
                type='number'
                placeholder="mobile no"
                name='mobileNo'
                value={formData.mobileNo}
                className={defaultInputSmStyle}
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
              <div className='flex_date_tenure'>
                <div className='DateOf'>
                  <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
                  <DatePicker
                    selected={selectedDate}
                    placeholderText='Date of Joining'
                    onChange={handleDateChange}
                    className={defaultInputSmStyle}
                    showYearDropdown
                    showMonthDropdown
                    dateFormat="yyyy-MM-dd"
                    yearDropdownItemNumber={15}
                    scrollableYearDropdown
                  />
                </div>
                <div className='DateOf'>
                  <label className="block text-sm font-medium text-gray-700">Leaving Date</label>
                  <DatePicker
                    selected={selectedleavingDate}
                    placeholderText='Leaving Date'
                    onChange={handleLeaveDateChange}
                    className={defaultInputSmStyle}
                    showYearDropdown
                    showMonthDropdown
                    dateFormat="yyyy-MM-dd"
                    yearDropdownItemNumber={15}
                    scrollableYearDropdown
                  />
                </div>

                <div className='tenure'>
                  <label className="block text-sm font-medium text-gray-700">Tenure</label>
                  <input
                    name="tenure"
                    value={tenure1}
                    placeholder="tenure"
                    className={`${defaultInputSmStyle} ${error.tenure && validError}`}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">Dept.</label>
              <select name="department" value={formData.department} className={`${defaultInputSmStyle} ${error.department && validError}`} onChange={handleChange} >
                <option selected>Select Department</option>
                <option value='web-development & Design'>Web Development & Design</option>
                <option value='graphic-design'>Graphic Design</option>
                <option value='digital-marketing'>Digital Marketing</option>
                <option value='business-development'>Business Development</option>
                <option value='HR & Admin'>HR & Admin</option>
              </select>
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
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <select name="companyName" value={formData.companyName} className={`${defaultInputSmStyle} ${error.companyName && validError}`} onChange={handleChange} >
                <option selected>Select Company Name</option>
                <option value='KS NETWORKING SOLUTIONS'>KS NETWORKING SOLUTIONS</option>
                <option value='SAI LEGAL ASSOCIATES'>SAI LEGAL ASSOCIATES</option>
                <option value='Base2Brand Infotech Private Limited'>Base2Brand Infotech Private Limited</option>
                <option value='B2B Campus'>B2B Campus</option>
                <option value='AASHU ENTERPRISES'>AASHU ENTERPRISES</option>
              </select>
            </div>

            {/* <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">Company logo</label>
              {formData && formData.companylogo && (
                <div className="mb-2">
                  {!img &&
                    <img src={`http://localhost:8000${formData.companylogo}`} alt="Current Signature" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                  }
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </div> */}
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