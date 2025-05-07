import React, { useEffect, useState } from "react";
import {
  defaultInputSmStyle,
  validError,
  defaultInputSmBlack,
} from "../constants/defaultStyles";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import dayjs from "dayjs";
const EmpForm = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedleavingDate, setSelectedLeavingDate] = useState(null);
  const [grosssalary, setgrosssalary] = useState("");
  const [netsalary, setnetSalary] = useState("");
  const [basic, setBasic] = useState("");
  const [med, setMed] = useState("");
  const [children, setChildren] = useState("");
  const [house, setHouse] = useState("");
  const [conveyance, setConveyance] = useState("");
  const [earning, setEarning] = useState("");
  const [arrear, setArrear] = useState("");
  const [reimbursement, setReimbursement] = useState("");
  const [health, setHealth] = useState("");
  const [proftax, setProfTax] = useState("");
  const [epf, setEPF] = useState("");
  const [tds, setTds] = useState("");
  const [daysMonth, setDaysMonth] = useState("");
  const [workingDays, setWorkingDays] = useState("");
  const [causelLeave, setCauselLeave] = useState("");
  const [medicalLeave, setmedicalLeave] = useState("");
  const [absent, setAbsent] = useState("");
  const [chooseDate, setChooseDate] = useState(null);
  const [sign, setSign] = useState("");
  const [companyLogos, setCompanyLogos] = useState([]);
  const [selectedLogo, setSelectedLogo] = useState("");
  const [basicCut, setBasicCut] = useState(0);
  const [grossSalaryDeduction, setGrossSalaryDeduction] = useState(0);
  const formattedDate = moment(chooseDate).format("YYYY-MM-DD");
  const [formData, setFormData] = useState({
    empName: "",
    email: "",
    mobileNo: "",
    familyMember: "",
    joinDate: "",
    leavingDate: "",
    tenure: "",
    department: "",
    designation: "",
    empCode: "",
    companyName: "",
    companylogo: "",
  });

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

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/get-companyLogo`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCompanyLogos(data.data);
        } else {
          console.error("Failed to fetch company logos:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching company logos:", error));
  }, []);

  const handleSelectChange = (event) => {
    setSelectedLogo(event.target.value);
  };

  const handlePaymentStatus = (event) => {
    setDaysMonth(event.target.value);
    const selectedDays = parseInt(event.target.value);
    let workingDays;
    switch (selectedDays) {
      case 31:
        workingDays = 23;
        break;
      case 30:
        workingDays = 22;
        break;
      case 28:
        workingDays = 19;
        break;
      case 29:
        workingDays = 20;
        break;
      default:
        workingDays = ""; // Handle other cases as needed
    }

    setWorkingDays(workingDays.toString());
  };
  const fetchBankDetail = async (id) => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    const headers = {
      Authorization: `Bearer ${token}`, // Use the token from localStorage
      "Content-Type": "application/json", // Add any other headers if needed
    };
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/get-emp-data/${id}`,
        { headers }
      );
      const bankDetailData = response.data.data;
      bankDetailData.joinDate =
        bankDetailData.joinDate && moment(bankDetailData.joinDate).isValid()
          ? moment(bankDetailData.joinDate).toDate()
          : null;
      bankDetailData.leavingDate =
        bankDetailData.leavingDate &&
        moment(bankDetailData.leavingDate).isValid()
          ? moment(bankDetailData.leavingDate).toDate()
          : null;
      setFormData(bankDetailData);
      setSelectedDate(bankDetailData.joinDate);
      setSelectedLeavingDate(bankDetailData.leavingDate);
    } catch (error) {
      console.error("Error fetching bank detail:", error);
    }
  };

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "joinDate") {
      setFormData({ ...formData, [name]: selectedDate });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleDateChange = (date) => {
    const adjustedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    const localDate = moment(date).startOf("day").toDate();
    setSelectedDate(localDate);
    setFormData({ ...formData, joinDate: adjustedDate });
  };
  const handleLeaveDateChange = (date) => {
    const adjustDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    const localDates = moment(date).startOf("day").toDate();
    setSelectedLeavingDate(localDates);
    setFormData({ ...formData, leavingDate: adjustDate });
  };

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
        return leavingDate.diff(today, "day");
      };
      setTenure(calculateTenure());
    }
  }, [formData.leavingDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    const headers = {
      Authorization: `Bearer ${token}`, // Use the token from localStorage
      "Content-Type": "application/json", // Add any other headers if needed
    };
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
        const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
        const livingDate = moment(selectedleavingDate).format("YYYY-MM-DD");
        const updatedFormData = {
          ...formData,
          joinDate: formattedDate,
          leavingDate: livingDate,
          tenure: tenure1,
          basic: basic,
          grosssalary: grosssalary,
          netsalary: netsalary,
          med: med,
          children: children,
          house: house,
          conveyance: conveyance,
          earning: earning,
          arrear: arrear,
          reimbursement: reimbursement,
          health: health,
          epf: epf,
          tds: tds,
          proftax: proftax || null,
          daysMonth: daysMonth,
          workingDays: workingDays,
          causelLeave: causelLeave,
          medicalLeave: medicalLeave,
          absent: absent,
          chooseDate: formattedDate === "Invalid date" ? null : formattedDate,
          // signature: signaturePayload[0],
          companylogo: selectedLogo,
          netsalary: netsalary,
        };

        if (id) {
          response = await axios.put(
            `${process.env.REACT_APP_API_BASE_URL}/api/update-emp-data/${id}`,
            updatedFormData,
            { headers }
          );
        } else {
          response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/api/add-emp-data`,
            updatedFormData,
            { headers }
          );
        }
        if (response.status === 201 || response.status === 200) {
          navigate("/emp-data");
        }
      } catch (error) {
        console.error("Error in Axios request:", error);
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
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <button style={{ fontSize: "40px" }} onClick={goBack}>
        ←
      </button>
      <div className="flex-1">
        <div className="font-title font-bold text-sm my-3">Add Employee</div>
        <form onSubmit={handleSubmit}>
          <div className="client-form-wrapper sm:w-1/2">
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Emp.Name
              </label>
              <input
                name="empName"
                value={formData.empName}
                placeholder="Emp. Name"
                className={`${defaultInputSmStyle} ${
                  error.empName && validError
                }`}
                onChange={handleChange}
              />
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                value={formData.email}
                placeholder="Email"
                className={`${defaultInputSmStyle} ${
                  error.email && validError
                }`}
                onChange={handleChange}
              />
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Mobile No
              </label>
              <input
                type="number"
                placeholder="mobile no"
                name="mobileNo"
                value={formData.mobileNo}
                className={defaultInputSmStyle}
                onChange={handleChange}
              />
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                F/H Name
              </label>
              <input
                name="familyMember"
                value={formData.familyMember}
                placeholder="F/H Name"
                className={`${defaultInputSmStyle} ${
                  error.familyMember && validError
                }`}
                onChange={handleChange}
              />
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Designation
              </label>
              <input
                name="designation"
                value={formData.designation}
                placeholder="Designation"
                className={`${defaultInputSmStyle} ${
                  error.designation && validError
                }`}
                onChange={handleChange}
              />
            </div>
            <div className="text-sm mb-4">
              <div className="flex_date_tenure">
                <div className="DateOf">
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Joining
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    placeholderText="Date of Joining"
                    onChange={handleDateChange}
                    className={defaultInputSmStyle}
                    showYearDropdown
                    showMonthDropdown
                    dateFormat="yyyy-MM-dd"
                    yearDropdownItemNumber={15}
                    scrollableYearDropdown
                  />
                </div>
                <div className="DateOf">
                  <label className="block text-sm font-medium text-gray-700">
                    Leaving Date
                  </label>
                  <DatePicker
                    selected={selectedleavingDate}
                    placeholderText="Leaving Date"
                    onChange={handleLeaveDateChange}
                    className={defaultInputSmStyle}
                    showYearDropdown
                    showMonthDropdown
                    dateFormat="yyyy-MM-dd"
                    yearDropdownItemNumber={15}
                    scrollableYearDropdown
                  />
                </div>

                <div className="tenure">
                  <label className="block text-sm font-medium text-gray-700">
                    Tenure
                  </label>
                  <input
                    name="tenure"
                    value={tenure1}
                    placeholder="tenure"
                    className={`${defaultInputSmStyle} ${
                      error.tenure && validError
                    }`}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Dept.
              </label>
              <select
                name="department"
                value={formData.department}
                className={`${defaultInputSmStyle} ${
                  error.department && validError
                }`}
                onChange={handleChange}
              >
                <option selected>Select Department</option>
                <option value="web-development & Design">
                  Web Development & Design
                </option>
                <option value="graphic-design">Graphic Design</option>
                <option value="digital-marketing">Digital Marketing</option>
                <option value="business-development">
                  Business Development
                </option>
                <option value="HR & Admin">HR & Admin</option>
              </select>
            </div>

            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Employee Code
              </label>
              <input
                name="empCode"
                value={formData.empCode}
                placeholder="Employee Code"
                className={`${defaultInputSmStyle} ${
                  error.empCode && validError
                }`}
                onChange={handleChange}
              />
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <select
                name="companyName"
                value={formData.companyName}
                className={`${defaultInputSmStyle} ${
                  error.companyName && validError
                }`}
                onChange={handleChange}
              >
                <option selected>Select Company Name</option>
                <option value="KS NETWORKING SOLUTIONS">
                  KS NETWORKING SOLUTIONS
                </option>
                <option value="SAI LEGAL ASSOCIATES">
                  SAI LEGAL ASSOCIATES
                </option>
                <option value="Base2Brand Infotech Private Limited">
                  Base2Brand Infotech Private Limited
                </option>
                <option value="B2B Campus">B2B Campus</option>
                <option value="AASHU ENTERPRISES">AASHU ENTERPRISES</option>
              </select>
            </div>

            <div className="flex flex-row mb-2">
              <div className="font-title font-bold">Rate of Baisc/wages</div>
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Gross Salary
              </label>
              <input
                type="number"
                placeholder="Gross Salary"
                name="grosssalary"
                value={grosssalary}
                className={defaultInputSmStyle}
                onChange={(event) => setgrosssalary(event.target.value)}
              />
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Basic
              </label>
              <input
                type="number"
                placeholder="Basic"
                name="basic"
                value={basic}
                className={defaultInputSmStyle}
                onChange={(event) => setBasic(event.target.value)}
              />
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Med.
              </label>
              <input
                type="number"
                placeholder="Med."
                name="med"
                value={med}
                className={defaultInputSmStyle}
                onChange={(event) => setMed(event.target.value)}
              />
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                children education allowance
              </label>
              <input
                type="number"
                placeholder="children education allowance"
                name="children"
                value={children}
                className={defaultInputSmStyle}
                onChange={(event) => setChildren(event.target.value)}
              />
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                House Rent allowance
              </label>
              <input
                type="number"
                placeholder="House Rent allowance"
                name="house"
                value={house}
                className={defaultInputSmStyle}
                onChange={(event) => setHouse(event.target.value)}
              />
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Conveyance allowance
              </label>
              <input
                type="number"
                placeholder="Conveyance allowance"
                name="conveyance"
                value={conveyance}
                className={defaultInputSmStyle}
                onChange={(event) => setConveyance(event.target.value)}
              />
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                other Earning
              </label>
              <input
                type="number"
                placeholder="other Earning"
                name="earning"
                value={earning}
                className={defaultInputSmStyle}
                onChange={(event) => setEarning(event.target.value)}
              />
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Arrear
              </label>
              <input
                type="number"
                placeholder="Arrear"
                name="arrear"
                value={arrear}
                className={defaultInputSmStyle}
                onChange={(event) => setArrear(event.target.value)}
              />
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Reimbursement
              </label>
              <input
                type="number"
                placeholder="Reimbursement"
                name="reimbursement"
                value={reimbursement}
                className={defaultInputSmStyle}
                onChange={(event) => setReimbursement(event.target.value)}
              />
            </div>
          </div>
          <div className="adjust-width">
            <div className="flex flex-row mb-2">
              <div className="font-title font-bold">Deduction</div>
            </div>
            <div
              className="client-form-wrapper sm:w-1/2"
              style={{ width: "100%" }}
            >
              <div className="text-sm mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Health
                </label>
                <input
                  type="number"
                  placeholder="Health"
                  name="health"
                  value={health}
                  className={defaultInputSmStyle}
                  onChange={(event) => setHealth(event.target.value)}
                />
              </div>
              <div className="text-sm mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Prof. Tax
                </label>
                <input
                  type="number"
                  placeholder="professional tax"
                  name="proftax"
                  value={proftax}
                  className={defaultInputSmStyle}
                  onChange={(event) => setProfTax(event.target.value)}
                />
              </div>
              <div className="text-sm mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  EPF.
                </label>
                <input
                  type="number"
                  placeholder="EPF."
                  name="epf"
                  value={epf}
                  className={defaultInputSmStyle}
                  onChange={(event) => setEPF(event.target.value)}
                />
              </div>
              <div className="text-sm mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  TDS.
                </label>
                <input
                  type="number"
                  placeholder="TDS."
                  name="tds"
                  value={tds}
                  className={defaultInputSmStyle}
                  onChange={(event) => setTds(event.target.value)}
                />
              </div>
              <div className="flex flex-row mb-2">
                <div className="font-title font-bold">Attendance/Leave</div>
              </div>

              <div className="text-sm mb-4">
                <select
                  className={defaultInputSmBlack}
                  value={daysMonth}
                  onChange={handlePaymentStatus}
                >
                  <option value="">Days of this month</option>
                  <option value="31">31</option>
                  <option value="30">30</option>
                  <option value="28">28</option>
                  <option value="29">29</option>
                </select>
              </div>
              <div className="text-sm mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Working Days
                </label>
                <input
                  type="number"
                  placeholder="Working Days"
                  name="workingDays"
                  value={workingDays}
                  className={defaultInputSmStyle}
                  onChange={(event) => setWorkingDays(event.target.value)}
                  disabled={!daysMonth || daysMonth}
                />
              </div>
              <div className="text-sm mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Casual Leave
                </label>
                <input
                  type="number"
                  placeholder="Casual Leave"
                  name="causelLeave"
                  value={causelLeave}
                  className={defaultInputSmStyle}
                  onChange={(event) => setCauselLeave(event.target.value)}
                />
              </div>
              <div className="text-sm mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Medical Leave
                </label>
                <input
                  type="number"
                  placeholder="Medical Leave"
                  name="medicalLeave"
                  value={medicalLeave}
                  className={defaultInputSmStyle}
                  onChange={(event) => setmedicalLeave(event.target.value)}
                />
              </div>
              <div className="text-sm mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Absent
                </label>
                <input
                  type="number"
                  placeholder="Absent"
                  name="absent"
                  value={absent}
                  className={defaultInputSmStyle}
                  onChange={(event) => setAbsent(event.target.value)}
                />
              </div>
              <div className="text-sm mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Total Leave
                </label>
                <input
                  type="text"
                  placeholder="Total Leave"
                  name="TotalLeave"
                  value={
                    parseInt(causelLeave || "0") +
                    parseInt(medicalLeave || "0") +
                    parseInt(absent || "0")
                  }
                  className={defaultInputSmStyle}
                  disabled={true}
                />
              </div>
              <div className="text-sm mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Choose Date
                </label>
                <DatePicker
                  selected={chooseDate}
                  placeholderText="Date"
                  onChange={handleDateChange}
                  className={defaultInputSmStyle}
                  showYearDropdown
                  showMonthDropdown
                  dateFormat="yyyy-MM-dd"
                  yearDropdownItemNumber={15}
                  scrollableYearDropdown
                />
              </div>
              <div className="text-sm mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Net Salary
                </label>

                {/* {!shouldShowNetSalaryInput() && (
                    <input
                      type='text'
                      placeholder="Amount"
                      name='AdvanceAmount'
                      value={grossSalary}
                      className={defaultInputSmStyle}
                      disabled={grossSalary || !grossSalary}
                    />
                  )} */}

                <input
                  type="number"
                  placeholder="Amount"
                  name="netSalary"
                  value={netsalary}
                  className={defaultInputSmStyle}
                  onChange={(e) => {
                    // Allow only numbers
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setnetSalary(value); // Update state if the input is valid
                    }
                  }}
                  // disabled={netSalary || !netSalary}
                />
              </div>
              <div className="text-sm mb-4">
                <select
                  className={defaultInputSmBlack}
                  value={selectedLogo}
                  onChange={handleSelectChange}
                >
                  <option value="">Select Company Logo</option>
                  {companyLogos.map((logo) => (
                    <option key={logo._id} value={logo.companylogo}>
                      {logo.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* <div className="text-sm mb-4">
                  <label className="block text-sm font-medium text-gray-700">Signature</label>
                  {wages && wages.signature && (
                    <div className="mb-2">
                      {!img &&
                        <img src={`http://localhost:8000${wages.signature}`} alt="Current Signature" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                      }
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div> */}
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
              <button
                type="submit"
                class="primary-background-color w-full text-white   hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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

export default EmpForm;
