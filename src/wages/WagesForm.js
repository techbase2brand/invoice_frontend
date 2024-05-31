import React, { useEffect, useState } from 'react'
import { defaultInputSmBlack, defaultInputSmStyle } from '../constants/defaultStyles'
import Button from '../components/Button/Button'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
const ProForm = () => {
  const [empName, setEmpName] = useState('');
  const [familyMember, setFamilyMember] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [empCode, setEmpCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [logo, setLogo] = useState('')
  const [state, setState] = useState('');
  const [client, setClient] = useState([]);
  const [wages, setWages] = useState(null);
  const [basic, setBasic] = useState('');
  const [med, setMed] = useState('');
  const [children, setChildren] = useState('');
  const [house, setHouse] = useState('');
  const [conveyance, setConveyance] = useState('');
  const [earning, setEarning] = useState('');
  const [arrear, setArrear] = useState('');
  const [reimbursement, setReimbursement] = useState('');
  const [health, setHealth] = useState('');
  const [epf, setEPF] = useState('');
  const [tds, setTds] = useState('');
  const [daysMonth, setDaysMonth] = useState('');
  const [workingDays, setWorkingDays] = useState('');
  const [causelLeave, setCauselLeave] = useState('');
  const [medicalLeave, setmedicalLeave] = useState('');
  const [absent, setAbsent] = useState('');
  const [chooseDate, setChooseDate] = useState(null);
  const [sign, setSign] = useState('')
  const navigate = useNavigate();
  const { id } = useParams();
  const [img, setImg] = useState(false);
  const [companyLogos, setCompanyLogos] = useState([]);
  const [selectedLogo, setSelectedLogo] = useState('');
  // const [signatures, setSignatures] = useState([]);
  // const signaturePayload = signatures.map(signature => signature.signature);


  const totalAmount = parseInt(basic || "0") + parseInt(med || "0") + parseInt(children || "0") + parseInt(house || "0")
    + parseInt(conveyance || "0") + parseInt(earning || "0") + parseInt(arrear || "0") + parseInt(reimbursement || "0") + parseInt(health || "0")
    + parseInt(epf || "0") + parseInt(tds || "0");

  console.log("basic", totalAmount);

  useEffect(() => {
    if (id) {
      fetchInvoiceDetail(id);
      setImg(false);
    }
  }, [id]);

  // useEffect(() => {
  //   fetch(`${process.env.REACT_APP_API_BASE_URL}/get-signature`)
  //     .then(response => response.json())
  //     .then(data => {
  //       if (data.success) {
  //         setSignatures(data.data);
  //       } else {
  //         console.error('Failed to fetch signatures:', data.message);
  //       }
  //     })
  //     .catch(error => console.error('Error fetching signatures:', error));
  // }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/get-companyLogo`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setCompanyLogos(data.data);
        } else {
          console.error('Failed to fetch company logos:', data.message);
        }
      })
      .catch(error => console.error('Error fetching company logos:', error));
  }, []);

  useEffect(() => {
    const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/get-empData`;
    axios.get(apiUrl)
      .then((response) => {
        setClient(response.data.data)
      })
      .catch((error) => {
        console.error('Error fetching invoices:', error);
      });
  }, []);

  const fetchInvoiceDetail = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/wages-get/${id}`);
      const bankDetailData = response.data.data;
      setWages(bankDetailData);
    } catch (error) {
      console.error('Error fetching bank detail:', error);
    }
  };

  useEffect(() => {
    if (wages) {
      setEmpName(wages.empName);
      setFamilyMember(wages.familyMember);
      setJoinDate(wages.joinDate);
      setDepartment(wages.department);
      setDesignation(wages.designation);
      setEmpCode(wages.empCode);
      setCompanyName(wages.companyName);
      setSelectedLogo(wages.companylogo)
      setState(wages.empName);
      setBasic(wages.basic)
      setMed(wages.med)
      setChildren(wages.children)
      setHouse(wages.house)
      setConveyance(wages.conveyance)
      setEarning(wages.earning)
      setArrear(wages.arrear)
      setReimbursement(wages.reimbursement)
      setHealth(wages.health)
      setEPF(wages.epf)
      setTds(wages.tds)
      setDaysMonth(wages.daysMonth)
      setWorkingDays(wages.workingDays)
      setCauselLeave(wages.causelLeave)
      setmedicalLeave(wages.medicalLeave)
      setAbsent(wages.absent);
      setChooseDate(new Date(wages.chooseDate));
      setSign(wages.setSign)
    }
  }, [wages]);
  const handleClientChange = (event) => {
    if (!event.target.value) {
      setFamilyMember("");
      setJoinDate("");
      setDepartment("");
      setDesignation("")
      setEmpCode("")
      setCompanyName("")
      setLogo("");
    }
    const selectedClientId = event.target.value;
    setState(selectedClientId);
    setEmpName(selectedClientId);
    const selectedClient = client.find(client => client._id === selectedClientId);
    if (selectedClient) {
      setFamilyMember(selectedClient.familyMember);
      setJoinDate(selectedClient.joinDate);
      setDepartment(selectedClient.department);
      setDesignation(selectedClient.designation)
      setEmpCode(selectedClient.empCode)
      setCompanyName(selectedClient.companyName);
      setLogo(selectedClient.companylogo)
    }
  };

  const handleSubmit = () => {
    const selectedEmpName = client.find(item => item._id === empName)?.empName || '';
    const formattedDate = moment(chooseDate).format('YYYY-MM-DD');
    const formData = {
      empName: state,
      familyMember: familyMember,
      joinDate: joinDate,
      department: department,
      designation: designation,
      empCode: empCode,
      companyName: companyName,
      employeeName: selectedEmpName,
      basic: basic,
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
      daysMonth: daysMonth,
      workingDays: workingDays,
      causelLeave: causelLeave,
      medicalLeave: medicalLeave,
      absent: absent,
      chooseDate: formattedDate,
      // signature: signaturePayload[0],
      companylogo: selectedLogo
    };

    if (id) {
      axios.put(`${process.env.REACT_APP_API_BASE_URL}/update-wages/${id}`, formData)
        .then(response => {
          navigate("/wages-detail")
        })
        .catch(error => {
          console.error('Error updating form data:', error);
        });
    } else {
      axios.post(`${process.env.REACT_APP_API_BASE_URL}/created-wages`, formData)
        .then(response => {
          navigate("/wages-detail")
        })
        .catch(error => {
          console.error('Error submitting form data:', error);
          toast.error("Error submitting form data", {
            position: "bottom-center",
            autoClose: 2000,
          });
        });
    }
  };
  const handleSelectChange = (event) => {
    setSelectedLogo(event.target.value);
  };

  const handlePaymentStatus = (event) => {
    setDaysMonth(event.target.value)
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
        workingDays = ''; // Handle other cases as needed
    }

    setWorkingDays(workingDays.toString());
  };

  const handleDateChange = (date) => {
    const localDate = moment(date).startOf('day').toDate();
    setChooseDate(localDate);
  };
  // const handleImageUpload = async (e) => {
  //   setImg(true);
  //   const file = e.target.files[0];
  //   const formData = new FormData();
  //   formData.append('image', file);
  //   try {
  //     const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/upload-sign`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });
  //     const imageUrl = response.data.imageUrl;
  //     setSign(prevFormData => ({ ...prevFormData, signature: imageUrl }));
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //   }
  // };
  return (
    <div>
      <div
        className={"flex flex-row pt-2 px-8"} >
        <div className="flex-1">
          <div className='flexer'>
            <div className='adjust-width'>
              <div className="flex flex-row mb-2">
                <div className="font-title font-bold">Emp. Detail</div>
              </div>
              <div className="client-form-wrapper sm:w-1/2" style={{ width: '100%' }}>
                <div
                  className="text-sm mb-4"
                >
                  <select
                    className={defaultInputSmBlack}
                    value={state}
                    onChange={handleClientChange}
                  >
                    <option value={""}>Select Emp. Name</option>
                    {client.sort((a, b) => a.empName.localeCompare(b.empName)).map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.empName}
                      </option>
                    ))}
                  </select>
                </div>
                {empName &&
                  <>
                    <div className="text-sm mb-4">
                      <label className="block text-sm font-medium text-gray-700">F/H Name</label>
                      <input
                        name="familyMember"
                        placeholder="F/H Name"
                        className={defaultInputSmStyle}
                        value={familyMember}
                        onChange={(event) => setFamilyMember(event.target.value)}
                      />
                    </div>
                    <div className="text-sm mb-4">
                      <label className="block text-sm font-medium text-gray-700">Date Of Joining</label>
                      <input
                        type="joinDate"
                        placeholder="Date Of Joining"
                        name='joinDate'
                        value={joinDate}
                        className={defaultInputSmStyle}
                        onChange={(event) => setJoinDate(event.target.value)}
                      />
                    </div>
                    <div className="text-sm mb-4"
                    >
                      <label className="block text-sm font-medium text-gray-700">Department</label>
                      <input
                        type='text'
                        placeholder="Department"
                        name='department'
                        value={department}
                        className={defaultInputSmStyle}
                        onChange={(event) => setDepartment(event.target.value)}
                      />
                    </div>
                    <div className="text-sm mb-4"
                    >
                      <label className="block text-sm font-medium text-gray-700">Designation</label>
                      <input
                        type='text'
                        placeholder="Designation"
                        name='designation'
                        value={designation}
                        className={defaultInputSmStyle}
                        onChange={(event) => setDesignation(event.target.value)}
                      />
                    </div>
                    <div className="text-sm mb-4"
                    >
                      <label className="block text-sm font-medium text-gray-700">Emp. Code</label>
                      <input
                        type='text'
                        placeholder="Emp. Code"
                        name='empCode'
                        value={empCode}
                        className={defaultInputSmStyle}
                        onChange={(event) => setEmpCode(event.target.value)}
                      />
                    </div>
                    <div className="text-sm mb-4"
                    >
                      <label className="block text-sm font-medium text-gray-700">Company Name</label>
                      <input
                        type='text'
                        placeholder="Company Nam"
                        name='companyName'
                        value={companyName}
                        className={defaultInputSmStyle}
                        onChange={(event) => setCompanyName(event.target.value)}
                      />
                    </div>
                    {/* <div className="text-sm mb-4">
                      <label className="block text-sm font-medium text-gray-700">Company Logo</label>
                      <img src={`http://localhost:8000${logo}`} alt="Company Logo" style={{ width: '20%' }} />
                    </div> */}
                  </>
                }
              </div>
              <div className="flex flex-row mb-2">
                <div className="font-title font-bold">Rate of Baisc/wages</div>
              </div>
              <div className="text-sm mb-4"
              >
                <label className="block text-sm font-medium text-gray-700">Basic</label>
                <input
                  type='number'
                  placeholder="Basic"
                  name='basic'
                  value={basic}
                  className={defaultInputSmStyle}
                  onChange={(event) => setBasic(event.target.value)}
                />
              </div>
              <div className="text-sm mb-4"
              >
                <label className="block text-sm font-medium text-gray-700">Med.</label>
                <input
                  type='number'
                  placeholder="Med."
                  name='med'
                  value={med}
                  className={defaultInputSmStyle}
                  onChange={(event) => setMed(event.target.value)}
                />
              </div>
              <div className="text-sm mb-4"
              >
                <label className="block text-sm font-medium text-gray-700">children education allowance</label>
                <input
                  type='number'
                  placeholder="children education allowance"
                  name='children'
                  value={children}
                  className={defaultInputSmStyle}
                  onChange={(event) => setChildren(event.target.value)}
                />
              </div>
              <div className="text-sm mb-4"
              >
                <label className="block text-sm font-medium text-gray-700">House Rent allowance</label>
                <input
                  type='number'
                  placeholder="House Rent allowance"
                  name='house'
                  value={house}
                  className={defaultInputSmStyle}
                  onChange={(event) => setHouse(event.target.value)}
                />
              </div>
              <div className="text-sm mb-4"
              >
                <label className="block text-sm font-medium text-gray-700">Conveyance allowance</label>
                <input
                  type='number'
                  placeholder="Conveyance allowance"
                  name='conveyance'
                  value={conveyance}
                  className={defaultInputSmStyle}
                  onChange={(event) => setConveyance(event.target.value)}
                />
              </div>
              <div className="text-sm mb-4"
              >
                <label className="block text-sm font-medium text-gray-700">other Earning</label>
                <input
                  type='number'
                  placeholder="other Earning"
                  name='earning'
                  value={earning}
                  className={defaultInputSmStyle}
                  onChange={(event) => setEarning(event.target.value)}
                />
              </div>
              <div className="text-sm mb-4"
              >
                <label className="block text-sm font-medium text-gray-700">Arrear</label>
                <input
                  type='number'
                  placeholder="Arrear"
                  name='arrear'
                  value={arrear}
                  className={defaultInputSmStyle}
                  onChange={(event) => setArrear(event.target.value)}
                />
              </div>
              <div className="text-sm mb-4"
              >
                <label className="block text-sm font-medium text-gray-700">Reimbursement</label>
                <input
                  type='number'
                  placeholder="Reimbursement"
                  name='reimbursement'
                  value={reimbursement}
                  className={defaultInputSmStyle}
                  onChange={(event) => setReimbursement(event.target.value)}
                />
              </div>
            </div>
            <div className='adjust-width'>
              <div className="flex flex-row mb-2">
                <div className="font-title font-bold">Deduction</div>
              </div>
              <div className="client-form-wrapper sm:w-1/2" style={{ width: '100%' }}>
                <div className="text-sm mb-4"
                >
                  <label className="block text-sm font-medium text-gray-700">Health</label>
                  <input
                    type='number'
                    placeholder="Health"
                    name='health'
                    value={health}
                    className={defaultInputSmStyle}
                    onChange={(event) => setHealth(event.target.value)}
                  />
                </div>
                <div className="text-sm mb-4"
                >
                  <label className="block text-sm font-medium text-gray-700">EPF.</label>
                  <input
                    type='number'
                    placeholder="EPF."
                    name='epf'
                    value={epf}
                    className={defaultInputSmStyle}
                    onChange={(event) => setEPF(event.target.value)}
                  />
                </div>
                <div className="text-sm mb-4"
                >
                  <label className="block text-sm font-medium text-gray-700">TDS.</label>
                  <input
                    type='number'
                    placeholder="TDS."
                    name='tds'
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
                <div className="text-sm mb-4"
                >
                  <label className="block text-sm font-medium text-gray-700">Working Days</label>
                  <input
                    type='number'
                    placeholder="Working Days"
                    name='workingDays'
                    value={workingDays}
                    className={defaultInputSmStyle}
                    onChange={(event) => setWorkingDays(event.target.value)}
                    disabled={!daysMonth || daysMonth}
                  />
                </div>
                <div className="text-sm mb-4"
                >
                  <label className="block text-sm font-medium text-gray-700">Casual Leave</label>
                  <input
                    type='number'
                    placeholder="Casual Leave"
                    name='causelLeave'
                    value={causelLeave}
                    className={defaultInputSmStyle}
                    onChange={(event) => setCauselLeave(event.target.value)}
                  />
                </div>
                <div className="text-sm mb-4"
                >
                  <label className="block text-sm font-medium text-gray-700">Medical Leave</label>
                  <input
                    type='number'
                    placeholder="Medical Leave"
                    name='medicalLeave'
                    value={medicalLeave}
                    className={defaultInputSmStyle}
                    onChange={(event) => setmedicalLeave(event.target.value)}
                  />
                </div>
                <div className="text-sm mb-4"
                >
                  <label className="block text-sm font-medium text-gray-700">Absent</label>
                  <input
                    type='number'
                    placeholder="Absent"
                    name='absent'
                    value={absent}
                    className={defaultInputSmStyle}
                    onChange={(event) => setAbsent(event.target.value)}
                  />
                </div>
                <div className="text-sm mb-4">
                  <label className="block text-sm font-medium text-gray-700">Choose Date</label>
                  <DatePicker
                    selected={chooseDate}
                    placeholderText='Date'
                    onChange={handleDateChange}
                    className={defaultInputSmStyle}
                  />

                </div>
                <div className="text-sm mb-4"
                >
                  <label className="block text-sm font-medium text-gray-700">Total Rupess</label>
                  <input
                    type='text'
                    placeholder="Amount"
                    name='AdvanceAmount'
                    value={totalAmount}
                    className={defaultInputSmStyle}
                    disabled={totalAmount || !totalAmount}
                  />
                </div>
                <div className="text-sm mb-4">
                  <select
                    className={defaultInputSmBlack}
                    value={selectedLogo}
                    onChange={handleSelectChange}
                  >
                    <option value="">Select Company Logo</option>
                    {companyLogos.map(logo => (
                      <option key={logo._id} value={logo.companylogo}>{logo.name}</option>
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
              <div className="mt-3 px-10">
                <Button block={1} onClick={handleSubmit}>
                  <span className="inline-block ml-2"> {id ? "Update" : "Submit"} </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProForm;