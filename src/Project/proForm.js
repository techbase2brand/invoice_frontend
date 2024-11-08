import React, { useEffect, useState } from 'react'
import { defaultInputSmBlack, defaultInputSmStyle, validError } from '../constants/defaultStyles'
import Button from '../components/Button/Button'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import moment from 'moment';
const ProForm = () => {
    const [client, setClient] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [state, setState] = useState('');
    const [selectedProject, setSelectedProject] = useState([]);
    const [projectDescriptions, setProjectDescriptions] = useState({});

    const [companyName, setCompanyName] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [clientAddress1, setClientAddress1] = useState('');
    const [clientAddress2, setClientAddress2] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [data, setData] = useState([]);
    
    const [selectBank, setSelectBank] = useState('');
    const [bank, setBank] = useState('');
    const [accNo, setAccNo] = useState('');
    const [accType, setAccType] = useState('');
    const [branch, setBranch] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [swift, setSwift] = useState('');
    const [accName, setAccName] = useState('');
    const [tradeName, setTradeName] = useState('');
    const [gstNo, setGstNo] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [currency, setCurrency] = useState('');
    const [payStatus, setPayStatus] = useState('');
    const [paytmName, setPaytmName] = useState('');
    const [PaytmId, setPaytmId] = useState('');
    const [payPalName, setPayPalName] = useState('');
    const [payPalId, setPayPalId] = useState('');
    const [gstin, setGstIn] = useState('');
    const [wise, setWise] = useState('');
    const [wiseId, setWiseId] = useState('');
    const [payOneer, setPayOneer] = useState('');
    const [payoneerId, setPayoneerId] = useState('');
    const [amount, setAmount] = useState('');
    const [advanceAmount, setAdvanceAmount] = useState('');
    const [cgst, setCgst] = useState('');
    const [sgst, setSgst] = useState('');
    const [cgstper, setCgstper] = useState('');
    const [sgstper, setSgstper] = useState('');

    const [invoicelist, setInvoiceList] = useState(null);
    const [enableGST, setEnableGST] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [description, setDescription] = useState(['']);
    const [company, setCompanyData] = useState([]);
    const [selectCompany, setSelectCompany] = useState('');
    const [amounts, setAmounts] = useState({});

    const [comGst, setComGst] = useState('');
    const [comIfsc, setComIfsc] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [comPanNo, setComPanNo] = useState('');
    const [signature, setSignature] = useState('');
    const [logo, setLogo] = useState('');
    const [trade, setTrade] = useState('');
    const [companyLogos, setCompanyLogos] = useState([]);
    const [selectedLogo, setSelectedLogo] = useState('');
    const [signatures, setSignatures] = useState([]);
    const signaturePayload = signatures.map(signature => signature.signature);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetchInvoiceDetail(id);
        }
    }, [id]);

    // const calculateTotalAmount = (amounts) => {
    //     let total = 0;
    //     for (const task in amounts) {
    //         const values = amounts[task];
    //         for (const key in values) {
    //             total += parseInt(values[key]);
    //         }
    //     }
    //     return total;
    // };

    const calculateTotalAmount = (amounts) => {
        let total = 0;
        for (const task in amounts) {
            const values = amounts[task];
            for (const key in values) {
                const value = parseInt(values[key], 10);
                if (!isNaN(value)) {
                    total += value;
                }
            }
        }
        return total;
    };
    

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/get-signature`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setSignatures(data.data);
                } else {
                    console.error('Failed to fetch signatures:', data.message);
                }
            })
            .catch(error => console.error('Error fetching signatures:', error));
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/get-companyLogo`)
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


    const totalAmount = calculateTotalAmount(amounts);
    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const headers = {
            'Authorization': `Bearer ${token}`,  // Use the token from localStorage
            'Content-Type': 'application/json',  // Add any other headers if needed
        };
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/get-companyData`;
        axios.get(apiUrl, { headers })
            .then((response) => {
                setCompanyData(response.data.data)
            })
            .catch((error) => {
                console.error('Error fetching invoices:', error);
            });
    }, []);
    const handleSelectChange = (event) => {
        setSelectedLogo(event.target.value);
    };
    const handleCheckboxChange = (event) => {
        setEnableGST(event.target.checked);
        if (!event.target.checked) {
            setGstNo("");
            setGstIn("");
        }
    };
    const fetchInvoiceDetail = async (id) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const headers = {
                'Authorization': `Bearer ${token}`,  // Use the token from localStorage
                'Content-Type': 'application/json',  // Add any other headers if needed
            };
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/invoice-get/${id}`, { headers });
            const bankDetailData = response.data.data;
            console.log("bankDetailData", bankDetailData);

            setInvoiceList(bankDetailData);
        } catch (error) {
            console.error('Error fetching bank detail:', error);
        }
    };

    const handleAmountChange = (value, index, projectName) => {
        setAmounts(prevAmounts => ({
            ...prevAmounts,
            [projectName]: {
                ...prevAmounts[projectName],
                [index]: value
            }
        }));
        console.log("error");
    };

    // const handleAmountChange = (value, index, projectName) => {
    //     console.log("value", projectName);

    //     // Only update amounts if the project name matches the selected project
    //     if (projectName === selectedProject) {
    //         setAmounts(prevAmounts => ({
    //             ...prevAmounts,
    //             [projectName]: {
    //                 ...prevAmounts[projectName],
    //                 [index]: value
    //             }
    //         }));
    //     } else {
    //         console.log("Project not selected for update:", projectName);
    //     }
    // };

    const handleDateChange = (date) => {
        const localDate = moment(date).startOf('day').toDate();
        setSelectedDate(localDate);
    };

    useEffect(() => {
        if (invoicelist) {

            setSelectedClient(invoicelist?.clientName);
            setState(invoicelist?.clientName);
            setCompanyName(invoicelist.company);
            setClientAddress(invoicelist?.clientAddress);
            setClientAddress1(invoicelist?.clientAddress1);
            setClientAddress2(invoicelist?.clientAddress2);
            setEmail(invoicelist.email);
            setMobileNo(invoicelist.mobileNo);
            setSelectedProject(invoicelist.project);
            setSelectBank(invoicelist.bankName);
            setBank(invoicelist.bankName);
            setAccNo(invoicelist.accNo);
            setAccType(invoicelist.accType);
            setBranch(invoicelist.BranchName);
            setIfsc(invoicelist.ifscCode);
            setSwift(invoicelist.swiftCode);
            setPaytmName(invoicelist.paytmName);
            setPaytmId(invoicelist.PaytmId);
            setPayPalName(invoicelist.payPalName);
            setPayPalId(invoicelist.payPalId);
            setWise(invoicelist.wise);
            setWiseId(invoicelist.wiseId);
            setPayOneer(invoicelist.payOneer);
            setPayoneerId(invoicelist.payoneerId);
            setGstNo(invoicelist.gstNo);
            setGstIn(invoicelist.gstin);
            setAmount(invoicelist.amount);
            setAdvanceAmount(invoicelist.AdvanceAmount);
            setCgst(invoicelist.cgst)
            setSgst(invoicelist.sgst)
            setCgstper(invoicelist.cgstper)
            setSgstper(invoicelist.sgstper)

            setPayStatus(invoicelist.paymentStatus);
            setCurrency(invoicelist.currency);
            setSelectCompany(invoicelist.trade);
            setComIfsc(invoicelist.ifsc);
            setCompanyAddress(invoicelist.companyAddress);
            setComPanNo(invoicelist.panNo);
            setSignature(invoicelist.signature);
            setLogo(invoicelist.companylogo)
            setComGst(invoicelist.CompanygstNo);
            setPayStatus(invoicelist.paymentStatus);
            setPaymentMethod(invoicelist.payMethod)
            const enableGSTValue = invoicelist.enableGST === "true";
            setEnableGST(enableGSTValue);
            setAccName(invoicelist.accName);
            setTradeName(invoicelist.tradeName);
            setTrade(invoicelist.tradde);
            setDescription(invoicelist.description);
            setProjectDescriptions(invoicelist.description);
            setAmounts(invoicelist.amounts)
            setSelectedLogo(invoicelist.companylogo)
        }
    }, [invoicelist]);
    useEffect(() => {
        if (invoicelist && invoicelist.selectDate) {
            const date = new Date(invoicelist.selectDate);
            if (!isNaN(date.getTime())) {
                setSelectedDate(date);
            } else {
                console.error('Invalid date format:', invoicelist.selectDate);
            }
        }
    }, [invoicelist]);


    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const headers = {
            'Authorization': `Bearer ${token}`,  // Use the token from localStorage
            'Content-Type': 'application/json',  // Add any other headers if needed
        };
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/get-clients`;
        axios.get(apiUrl, { headers })
            .then((response) => {
                setClient(response.data.data)
            })
            .catch((error) => {
                console.error('Error fetching invoices:', error);
            });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,  // Use the token from localStorage
            'Content-Type': 'application/json',  // Add any other headers if needed
        };
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/bank-data`;
        axios.get(apiUrl,{headers})
            .then((response) => {
                console.log("res",response);
                
                setData(response.data.data)
            })
            .catch((error) => {
                console.error('Error fetching invoices:', error);
            });
    }, []);

    const handleClientChange = (event) => {
        if (!event.target.value) {
            setCompanyName("");
            setClientAddress("");
            setClientAddress1("");
            setClientAddress2("");
            setEmail("");
            setMobileNo("");
        }
        const selectedClientId = event.target.value;
        setState(selectedClientId)
        setSelectedClient(selectedClientId);
        const selectedClient = client.find(client => client._id === selectedClientId);
        if (selectedClient) {
            setCompanyName(selectedClient.company);
            setClientAddress(selectedClient.clientAddress);
            setClientAddress1(selectedClient.clientAddress1);
            setClientAddress2(selectedClient.clientAddress2);
            setEmail(selectedClient.email);
            setMobileNo(selectedClient.mobileNo);
        }
    };
    const handleProjectChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedProject((prevProjects) => [...prevProjects, value]);
        } else {
            setSelectedProject((prevProjects) =>
                prevProjects.filter((project) => project !== value)
            );
            setProjectDescriptions((prevDescriptions) => {
                const updatedDescriptions = { ...prevDescriptions };
                if (updatedDescriptions[value]) {
                    delete updatedDescriptions[value];
                }
                return updatedDescriptions;
            });
    
            setAmounts((prevAmounts) => {
                const updatedAmounts = { ...prevAmounts };
                if (updatedAmounts[value]) {
                    delete updatedAmounts[value];
                }
                return updatedAmounts;
            });
        }
    };

    const handleBankChange = (event) => {
        if (!event.target.value) {
            setAccNo("");
            setAccType("");
            setBranch("");
            setIfsc("");
            setSwift("");
            setAccName("");
            setTradeName("");
            setAmount("");
        }
        const selectedBankId = event.target.value;
        setSelectBank(selectedBankId);
        setBank(selectedBankId)
        const selectedBank = data.find(bank => bank._id === selectedBankId);

        if (selectedBank) {
            setAccNo(selectedBank.accNo);
            setAccType(selectedBank.accType);
            setBranch(selectedBank.BranchName);
            setIfsc(selectedBank.ifscCode);
            setSwift(selectedBank.swiftCode);
            setAccName(selectedBank.accName);
            setTradeName(selectedBank.tradeName);
        }
    };

    const handleCompanyChange = (event) => {
        const selectedCompanyId = event.target.value;
        setTrade(selectedCompanyId);
        // if (!selectedCompanyId) {
        //     setSelectCompany("");
        // }
        // setSelectCompany(selectedCompanyId);
        const selectedCompany = company.find(item => item._id === selectedCompanyId);
        if (selectedCompany) {
            setComGst(selectedCompany.gstNo);
            setComIfsc(selectedCompany.ifsc);
            setCompanyAddress(selectedCompany.companyAddress);
            setComPanNo(selectedCompany.panNo);
            setSignature(selectedCompany.signature);
            setLogo(selectedCompany.companylogo)
        }
    };
    const handleSubmit = () => {
        if (!selectedClient) {
            toast.error("Please select a client.", {
                position: "bottom-center",
                autoClose: 2000,
            });
            return;
        }

        if (!selectedProject) {
            toast.error("Please select a project.", {
                position: "bottom-center",
                autoClose: 2000,
            });
            return;
        }
        if (!selectedDate) {
            toast.error("Please select a date.", {
                position: "bottom-center",
                autoClose: 2000,
            });
            return;
        }
        if (!paymentMethod) {
            toast.error("Please select a payment method.", {
                position: "bottom-center",
                autoClose: 2000,
            });
            return;
        }
        if (!currency) {
            toast.error("Please select currency.", {
                position: "bottom-center",
                autoClose: 2000,
            });
            return;
        }
        const cleanedAmounts = {};
        Object.keys(amounts).forEach((key) => {
            const isNonEmpty = Object.values(amounts[key]).some(value => value.trim() !== '');
            if (isNonEmpty) {
                cleanedAmounts[key] = amounts[key];
            }
        });

        const cleanedProjectDescriptions = {};
        Object.keys(projectDescriptions).forEach((key) => {
            const descriptions = projectDescriptions[key];
            if (descriptions.some(desc => desc.trim() !== '')) {
                cleanedProjectDescriptions[key] = descriptions;
            }
        });
        const selectedClientName = client.find(item => item._id === selectedClient)?.clientName || '';
        const selectedBankName = data.find(item => item._id === selectBank)?.bankName || '';
        const selectedTradeName = company.find(item => item._id === trade)?.trade || '';
        const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
        const formData = {
            clientName: state,
            company: companyName,
            email: email,
            mobileNo: mobileNo,
            clientAddress: clientAddress,
            clientAddress1: clientAddress1,
            clientAddress2: clientAddress2,
            project: selectedProject,
            bankName: bank,
            accNo: accNo,
            accType: accType,
            tradeName: tradeName,
            BranchName: branch,
            ifscCode: ifsc,
            swiftCode: swift,
            accName: accName,
            paytmName: paytmName,
            PaytmId: PaytmId,
            payPalName: payPalName,
            payPalId: payPalId,
            wise: wise,
            wiseId: wiseId,
            payOneer: payOneer,
            payoneerId: payoneerId,
            gstNo: gstNo,
            gstin: gstin,
            amount: amount,
            selectDate: formattedDate,
            currency: currency,
            description: cleanedProjectDescriptions,
            trade: selectedTradeName,
            ifsc: comIfsc,
            companyAddress: companyAddress,
            panNo: comPanNo,
            CompanygstNo: comGst,
            signature: signaturePayload[0],
            paymentStatus: payStatus || "draft",
            payMethod: paymentMethod,
            enableGST: enableGST,
            client: selectedClientName,
            tradde: trade,
            bankNamed: selectedBankName,
            AdvanceAmount:totalAmount,
            amounts: cleanedAmounts,
            companylogo: selectedLogo,
            sgst: sgst,
            cgst: cgst,
            sgstper: sgstper,
            cgstper: cgstper
        };
        
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const headers = {
            'Authorization': `Bearer ${token}`,  // Use the token from localStorage
            'Content-Type': 'application/json',  // Add any other headers if needed
        };
        if (id) {
            axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/update-invoice/${id}`, formData, { headers })
                .then(response => {
                    navigate("/project-Detail")
                })
                .catch(error => {
                    console.error('Error updating form data:', error);
                });
        } else {
            axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/add-clientBank`, formData, { headers })
                .then(response => {
                    navigate("/project-Detail")
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
    // const handlePaymentMethodChange = (event) => {
    //     setPaymentMethod(event.target.value);
    // };

    const handlePaymentMethodChange = (event) => {
        const newPaymentMethod = event.target.value;
        setPaymentMethod(newPaymentMethod);

        switch (paymentMethod) {
            case 'bank':
                setSelectBank('');
                setAccNo('');
                setAccType('');
                setBranch('');
                setIfsc('');
                setSwift('');
                setAccName('');
                setTradeName('');
                setGstNo('');
                setGstIn('');
                break;
            case 'paytm':
                setPaytmName('');
                setPaytmId('');
                break;
            case 'paypal':
                setPayPalName('');
                setPayPalId('');
                break;
            case 'wise':
                setWise('');
                setWiseId('');
                break;
            case 'payOneer':
                setPayOneer('');
                setPayoneerId('');
                break;
            default:
                break;
        }
    };

    const handleCurrencyAdd = (event) => {
        setCurrency(event.target.value)
    }
    const handlePaymentStatus = (event) => {
        setPayStatus(event.target.value)
    }

    const handleAddDescription = (project) => {
        setProjectDescriptions((prevDescriptions) => ({
            ...prevDescriptions,
            [project]: [...(prevDescriptions[project] || []), ''],
        }));
    };

    // const handleRemoveDescription = (index, project) => {
    //     setProjectDescriptions((prevDescriptions) => ({
    //         ...prevDescriptions,
    //         [project]: prevDescriptions[project].filter((_, i) => i !== index),
    //     }));
    // };
    const handleRemoveDescription = (index, project) => {
        setProjectDescriptions((prevDescriptions) => {
            const updatedDescriptions = { ...prevDescriptions };
            updatedDescriptions[project] = updatedDescriptions[project].filter((_, i) => i !== index);
    
            // Remove the project from the state if it has no descriptions left
            if (updatedDescriptions[project].length === 0) {
                delete updatedDescriptions[project];
            }
    
            return updatedDescriptions;
        });
    
        setAmounts((prevAmounts) => {
            const updatedAmounts = { ...prevAmounts };
            if (updatedAmounts[project]) {
                updatedAmounts[project] = Object.fromEntries(
                    Object.entries(updatedAmounts[project]).filter(([key]) => parseInt(key) !== index)
                );
    
                // Remove the project from the state if it has no amounts left
                if (Object.keys(updatedAmounts[project]).length === 0) {
                    delete updatedAmounts[project];
                }
            }
    
            return updatedAmounts;
        });
    };
    
    const handleDescriptionChange = (value, index, project) => {
        setProjectDescriptions((prevDescriptions) => ({
            ...prevDescriptions,
            [project]: prevDescriptions[project].map((desc, i) =>
                i === index ? value : desc
            ),
        }));
    };
    return (
        <div>
            <div
                className={"flex flex-row pt-2 px-8"} >
                <div className="flex-1">
                    <div className='flexer'>
                        <div className='adjust-width'>
                            <div className="flex flex-row mb-2">
                                <div className="font-title font-bold">Client Detail</div>
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
                                        <option value={""}>Select Client</option>
                                        {client.sort((a, b) => a.clientName.localeCompare(b.clientName)).map((item) => (
                                            <option key={item._id} value={item._id}>
                                                {item.clientName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {selectedClient &&
                                    <>
                                        <div className="text-sm mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                            <input
                                                name="company"
                                                placeholder="Company Name"
                                                className={defaultInputSmStyle}
                                                value={companyName}
                                                onChange={(event) => setCompanyName(event.target.value)}
                                            />
                                        </div>
                                        <div className="text-sm mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                placeholder="email"
                                                name='email'
                                                value={email}
                                                className={defaultInputSmStyle}
                                                onChange={(event) => setEmail(event.target.value)}
                                            />
                                        </div>
                                        <div className="text-sm mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Address</label>
                                            <input
                                                type="text"
                                                placeholder="Address"
                                                name='clientAddress'
                                                value={clientAddress}
                                                className={defaultInputSmStyle}
                                                onChange={(event) => setClientAddress(event.target.value)}
                                            />
                                        </div>
                                        <div className="text-sm mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Address 1</label>
                                            <input
                                                type="text"
                                                placeholder="Address 1"
                                                name='clientAddress1'
                                                value={clientAddress1}
                                                className={defaultInputSmStyle}
                                                onChange={(event) => setClientAddress1(event.target.value)}
                                            />
                                        </div>
                                        <div className="text-sm mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Address 2</label>
                                            <input
                                                type="text"
                                                placeholder="Address 2"
                                                name='clientAddress2'
                                                value={clientAddress2}
                                                className={defaultInputSmStyle}
                                                onChange={(event) => setClientAddress2(event.target.value)}
                                            />
                                        </div>
                                        <div className="text-sm mb-4"
                                        >
                                            <label className="block text-sm font-medium text-gray-700">Mobile No</label>
                                            <input
                                                type='text'
                                                placeholder="mobile no"
                                                name='mobileNo'
                                                value={mobileNo}
                                                className={defaultInputSmStyle}
                                                onChange={(event) => setMobileNo(event.target.value)}
                                            />
                                        </div>
                                    </>
                                }
                                {/* <div className="text-sm mb-4">
                                    <select
                                        className={defaultInputSmBlack}
                                        value={selectedProject}
                                        onChange={handleProjectChange}
                                    >
                                        <option value="">Select Project</option>
                                        {client
                                            .filter(item => item._id === selectedClient)
                                            .map((item) => (
                                                item.project.map((projectName, index) => (
                                                    <option key={index} value={projectName}>
                                                        {projectName}
                                                    </option>
                                                ))
                                            ))
                                        }
                                    </select>
                                </div> */}
                                {/* <div className="text-sm mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Select Project</label>
                                    {client
                                        .filter((item) => item._id === selectedClient)
                                        .map((item) => (
                                            <div key={item._id}>
                                                {item.project.map((projectName, index) => (
                                                    <div key={index} style={{
                                                        display: 'flex',
                                                        gap: '2rem'
                                                    }}>
                                                        <input
                                                            type="checkbox"
                                                            id={projectName}
                                                            value={projectName}
                                                            onChange={handleProjectChange}
                                                            checked={selectedProject.includes(projectName)}
                                                        />
                                                        <label htmlFor={projectName}>{projectName}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                </div>

                                {description.map((desc, index) => (
                                    <div key={index} className="text-sm mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Add Description</label>
                                        <input
                                            type='text'
                                            placeholder={`Description ${index + 1}`}
                                            value={desc}
                                            className={defaultInputSmStyle}
                                            onChange={(e) => handleDescriptionChange(e.target.value, index)}
                                        />
                                        {index !== 0 && (
                                            <div style={{ float: 'right' }} onClick={() => handleRemoveDescription(index)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 1024 1024"><path fill="currentColor" d="M696 480H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8" /><path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372" /></svg>
                                            </div>
                                        )}
                                        {index === description.length - 1 && (
                                            <div style={{ float: 'right' }} onClick={handleAddDescription}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8" /><path fill="currentColor" d="M15 11h-2V9a1 1 0 0 0-2 0v2H9a1 1 0 0 0 0 2h2v2a1 1 0 0 0 2 0v-2h2a1 1 0 0 0 0-2" /></svg>
                                            </div>
                                        )}
                                    </div>
                                ))} */}
                                <div className="text-sm mb-4">

                                    {client
                                        .filter((item) => item._id === selectedClient)
                                        .map((item) => (

                                            <div key={item._id}>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Select Project
                                                </label>
                                                {item.project.map((projectName, index) => (
                                                    <div key={index} className='project-ch'>
                                                        <div className='check-pro'>
                                                            <input
                                                                type="checkbox"
                                                                id={projectName}
                                                                value={projectName}
                                                                onChange={handleProjectChange}
                                                                checked={selectedProject.includes(projectName)}
                                                                style={{ width: '20px' }}
                                                            />
                                                            <label htmlFor={projectName}>{projectName}</label>
                                                        </div>
                                                        {selectedProject?.includes(projectName) && (
                                                            <>
                                                                {projectDescriptions[projectName] &&
                                                                    projectDescriptions[projectName]?.map((desc, descIndex) => (
                                                                        <div key={descIndex} className="text-sm mb-4">
                                                                            <label className="block text-sm font-medium text-gray-700">
                                                                                Description {descIndex + 1}
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                placeholder={`Description ${descIndex + 1}`}
                                                                                value={(projectDescriptions[projectName] && projectDescriptions[projectName][descIndex]) || desc}
                                                                                className={defaultInputSmStyle}
                                                                                onChange={(e) =>
                                                                                    handleDescriptionChange(
                                                                                        e.target.value,
                                                                                        descIndex,
                                                                                        projectName
                                                                                    )
                                                                                }
                                                                            />
                                                                            <label className="block text-sm font-medium text-gray-700">
                                                                                Amount
                                                                            </label>
                                                                            <input
                                                                                type="number"
                                                                                placeholder={`Amount ${descIndex + 1}`}
                                                                                value={(amounts[projectName] && amounts[projectName][descIndex]) || ''}
                                                                                className={defaultInputSmStyle}
                                                                                onChange={(e) =>
                                                                                    handleAmountChange(
                                                                                        e.target.value,
                                                                                        descIndex,
                                                                                        projectName
                                                                                    )
                                                                                }
                                                                            />
                                                                            {descIndex !== 0 && (
                                                                                <div style={{ float: 'right' }} onClick={() => handleRemoveDescription(descIndex,
                                                                                    projectName)}>
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 1024 1024"><path fill="currentColor" d="M696 480H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8" /><path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372" /></svg>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                <div style={{ float: 'right', marginTop: '-16px' }} onClick={() => handleAddDescription(projectName)}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8" /><path fill="currentColor" d="M15 11h-2V9a1 1 0 0 0-2 0v2H9a1 1 0 0 0 0 2h2v2a1 1 0 0 0 2 0v-2h2a1 1 0 0 0 0-2" /></svg>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                </div>
                                <div className="text-sm mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
                                    <DatePicker
                                        selected={selectedDate}
                                        placeholderText='select Date'
                                        onChange={handleDateChange}
                                        className={defaultInputSmStyle}
                                        showYearDropdown
                                        showMonthDropdown
                                        dateFormat="yyyy-MM-dd"
                                        yearDropdownItemNumber={15}
                                        scrollableYearDropdown
                                    />
                                </div>
                                <label className="block text-sm font-medium text-gray-700">ADD GST</label>
                                <input type='checkbox' style={{ width: '20px' }} name="enableGST" value={enableGST} onChange={handleCheckboxChange} checked={enableGST === true} />
                                {enableGST &&
                                    <>
                                        <div className="text-sm mb-4"
                                        >
                                            <label className="block text-sm font-medium text-gray-700">gst No</label>
                                            <input
                                                type='text'
                                                placeholder="Gst No"
                                                name='gstNo'
                                                value={gstNo}
                                                className={defaultInputSmStyle}
                                                onChange={(event) => setGstNo(event.target.value)}
                                            />
                                        </div>
                                        <div className="text-sm mb-4"
                                        >
                                            <label className="block text-sm font-medium text-gray-700">GSTIN</label>
                                            <input
                                                type='text'
                                                placeholder="GSTIN"
                                                name='gstin'
                                                value={gstin}
                                                className={defaultInputSmStyle}
                                                onChange={(event) => setGstIn(event.target.value)}
                                            />
                                        </div>
                                    </>
                                }
                                <div
                                    className="text-sm mb-4"
                                >
                                    <div className="font-title font-bold">Select Company</div>
                                    <select
                                        className={defaultInputSmBlack}
                                        value={trade}
                                        onChange={handleCompanyChange}
                                    >
                                        <option value="">Select company</option>
                                        {company.map((item) => (
                                            <option key={item._id} value={item._id}>
                                                {item.trade}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="text-sm mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Company Address</label>
                                    <input
                                        name="companyAddress"
                                        placeholder="Company Address"
                                        value={companyAddress}
                                        className={defaultInputSmStyle}
                                        onChange={(event) => setCompanyAddress(event.target.value)}
                                    />
                                </div>
                                {trade &&
                                    <>
                                        <div className="text-sm mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Ifsc</label>
                                            <input
                                                name="comIfscNo"
                                                placeholder="ifsc"
                                                value={comIfsc}
                                                className={defaultInputSmStyle}
                                                onChange={(event) => setComIfsc(event.target.value)}
                                            />
                                        </div>
                                        <div className="text-sm mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Pan. No</label>
                                            <input
                                                name="comPanNo"
                                                placeholder="Pan No"
                                                value={comPanNo}
                                                className={defaultInputSmStyle}
                                                onChange={(event) => setComPanNo(event.target.value)}
                                            />
                                        </div>
                                        {/* <div className="text-sm mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Signature</label>
                                            <img src={`http://localhost:8000${signature}`} alt="signature" style={{ width: '20%' }} />
                                        </div>
                                        <div className="text-sm mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Company Logo</label>
                                            <img src={`http://localhost:8000${logo}`} alt="Company Logo" style={{ width: '20%' }} />
                                        </div> */}
                                        <div className="text-sm mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Gst</label>
                                            <input
                                                name="comGst"
                                                placeholder="comGst"
                                                value={comGst}
                                                className={defaultInputSmStyle}
                                                onChange={(event) => setComGst(event.target.value)}
                                            />
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className='adjust-width'>
                            <div className="client-form-wrapper sm:w-1/2" style={{ width: '100%' }}>
                                <div className="flex flex-row mb-2">
                                    <div className="font-title font-bold">Please Select payment Method</div>
                                </div>
                                <div className="text-sm mb-4">
                                    <select
                                        className={defaultInputSmBlack}
                                        value={paymentMethod}
                                        onChange={handlePaymentMethodChange}
                                    >
                                        <option value="">Select Payment Method</option>
                                        <option value="paytm">Paytm</option>
                                        <option value="paypal">PayPal</option>
                                        <option value="wise">Wise</option>
                                        <option value="payOneer">PayOneer</option>
                                        <option value="bank">Bank</option>
                                    </select>
                                </div>

                                {paymentMethod === "bank" &&
                                    <>
                                        <div className="flex flex-row mb-2">
                                            <div className="font-title font-bold">Bank Detail</div>
                                        </div>
                                        <div className="">
                                            <div
                                                className="text-sm mb-4"
                                            >
                                                <div className="font-title font-bold">Select Bank</div>
                                                <select
                                                    className={defaultInputSmBlack}
                                                    value={selectBank}
                                                    onChange={handleBankChange}
                                                >
                                                    <option value="">Select Bank</option>
                                                    {data.map((item) => (
                                                        <option key={item._id} value={item._id}>
                                                            {item.bankName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="text-sm mb-4">
                                                <label className="block text-sm font-medium text-gray-700">Acc. No</label>
                                                <input
                                                    name="accNo"
                                                    placeholder="Acc No."
                                                    value={accNo}
                                                    className={defaultInputSmStyle}
                                                    onChange={(event) => setAccNo(event.target.value)}
                                                />
                                            </div>
                                            <div className="text-sm mb-4"
                                            >
                                                <label className="block text-sm font-medium text-gray-700">Acc. Type</label>
                                                <input
                                                    name="accType"
                                                    placeholder="Acc. Type"
                                                    value={accType}
                                                    className={defaultInputSmStyle}
                                                    // onChange={handleChange}
                                                    onChange={(event) => setAccType(event.target.value)}
                                                />
                                            </div>
                                            <div className="text-sm mb-4">
                                                <label className="block text-sm font-medium text-gray-700">Branch Name</label>
                                                <input
                                                    name="BranchName"
                                                    placeholder="Branch Name"
                                                    value={branch}
                                                    className={defaultInputSmStyle}
                                                    onChange={(event) => setBranch(event.target.value)}
                                                />
                                            </div>
                                            <div className="text-sm mb-4"
                                            >
                                                <label className="block text-sm font-medium text-gray-700">Ifsc Code</label>
                                                <input
                                                    name="ifscCode"
                                                    placeholder="Ifsc Code"
                                                    value={ifsc}
                                                    className={defaultInputSmStyle}
                                                    onChange={(event) => setIfsc(event.target.value)}
                                                />

                                            </div>
                                            <div className="text-sm mb-4"
                                            >
                                                <label className="block text-sm font-medium text-gray-700">Swift Code</label>
                                                <input
                                                    name="swiftCode"
                                                    placeholder="Swift Code"
                                                    value={swift}
                                                    className={defaultInputSmStyle}
                                                    onChange={(event) => setSwift(event.target.value)}
                                                />
                                            </div>
                                            <div className="text-sm mb-4"
                                            >
                                                <label className="block text-sm font-medium text-gray-700">Acc. Name</label>
                                                <input
                                                    type='text'
                                                    placeholder="Acc. Name"
                                                    name='accName'
                                                    value={accName}
                                                    className={defaultInputSmStyle}
                                                    onChange={(event) => setAccName(event.target.value)}
                                                />
                                            </div>
                                            <div className="text-sm mb-4"
                                            >
                                                <label className="block text-sm font-medium text-gray-700">Trade Name</label>
                                                <input
                                                    type='text'
                                                    placeholder="Trade Name"
                                                    name='tradeName'
                                                    value={tradeName}
                                                    className={defaultInputSmStyle}
                                                    onChange={(event) => setTradeName(event.target.value)}
                                                />
                                            </div>

                                        </div>
                                    </>
                                }
                                {paymentMethod === "paytm" &&
                                    <>
                                        <div className="flex flex-row mb-2">
                                            <div className="font-title font-bold">Paytm</div>
                                        </div>
                                        <div className="">
                                            <div className="text-sm mb-4">
                                                <input
                                                    name="paytmName"
                                                    placeholder="Paytm Name"
                                                    value={paytmName}
                                                    className={defaultInputSmStyle}
                                                    onChange={(event) => setPaytmName(event.target.value)}
                                                />
                                            </div>
                                            <div className="text-sm mb-4">
                                                <input
                                                    name="PaytmId"
                                                    placeholder="Paytm Id"
                                                    value={PaytmId}
                                                    className={defaultInputSmStyle}
                                                    onChange={(event) => setPaytmId(event.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </>
                                }
                                {paymentMethod === "paypal" &&
                                    <>
                                        <div className="flex flex-row mb-2">
                                            <div className="font-title font-bold">Paypal</div>
                                        </div>
                                        <div className="">
                                            <div className="text-sm mb-4">
                                                <input
                                                    name="payPalName"
                                                    placeholder="Paytm Name"
                                                    value={payPalName}
                                                    className={defaultInputSmStyle}
                                                    onChange={(event) => setPayPalName(event.target.value)}
                                                />
                                            </div>
                                            <div className="text-sm mb-4">
                                                <input
                                                    name="payPalId"
                                                    placeholder="Paytm Id"
                                                    value={payPalId}
                                                    className={defaultInputSmStyle}
                                                    onChange={(event) => setPayPalId(event.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </>
                                }
                                {paymentMethod === "wise" &&
                                    <>
                                        <div className="flex flex-row mb-2">
                                            <div className="font-title font-bold">Wise</div>
                                        </div>
                                        <div className="">
                                            <div className="text-sm mb-4">
                                                <input
                                                    name="wise"
                                                    placeholder="Wise Name"
                                                    value={wise}
                                                    className={defaultInputSmStyle}
                                                    onChange={(event) => setWise(event.target.value)}
                                                />
                                            </div>
                                            <div className="text-sm mb-4">
                                                <input
                                                    name="wiseId"
                                                    placeholder="Wise Id"
                                                    value={wiseId}
                                                    className={defaultInputSmStyle}
                                                    onChange={(event) => setWiseId(event.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </>
                                }
                                {paymentMethod === "payOneer" &&
                                    <>
                                        <div className="flex flex-row mb-2">
                                            <div className="font-title font-bold">PayOneer</div>
                                        </div>
                                        <div className="">
                                            <div className="text-sm mb-4">
                                                <input
                                                    name="payOneer"
                                                    placeholder="PayOneer Name"
                                                    value={payOneer}
                                                    className={defaultInputSmStyle}
                                                    onChange={(event) => setPayOneer(event.target.value)}
                                                />
                                            </div>
                                            <div className="text-sm mb-4">
                                                <input
                                                    name="payoneerId"
                                                    placeholder="Wise Id"
                                                    value={payoneerId}
                                                    className={defaultInputSmStyle}
                                                    onChange={(event) => setPayoneerId(event.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                            <div className="text-sm mb-4">
                                <select
                                    className={defaultInputSmBlack}
                                    value={currency}
                                    onChange={handleCurrencyAdd}
                                >
                                    <option value="">Select Currency</option>
                                    <option value="AUD">AUD</option>
                                    <option value="USD">USD</option>
                                    <option value="INR">INR</option>
                                    <option value="CAD">CAD</option>
                                    <option value="GBP">GBP</option>
                                </select>
                            </div>


                            <div className="text-sm mb-4" style={{ display: 'flex', gap: '10px' }}
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">CGST</label>
                                    <input
                                        type='text'
                                        placeholder="CGST"
                                        name='cgst'
                                        value={cgst}
                                        className={defaultInputSmStyle}
                                        onChange={(event) => setCgst(event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">CGST%</label>
                                    <input
                                        type='text'
                                        placeholder="CGST%"
                                        name='cgstper'
                                        value={cgstper}
                                        className={defaultInputSmStyle}
                                        onChange={(event) => setCgstper(event.target.value)}
                                    />
                                </div>

                            </div>
                            <div className="text-sm mb-4" style={{ display: 'flex', gap: '10px' }}
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">SGST</label>
                                    <input
                                        type='text'
                                        placeholder="SGST"
                                        name='sgst'
                                        value={sgst}
                                        className={defaultInputSmStyle}
                                        onChange={(event) => setSgst(event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">SGST%</label>
                                    <input
                                        type='text'
                                        placeholder="SGST%"
                                        name='sgstper'
                                        value={sgstper}
                                        className={defaultInputSmStyle}
                                        onChange={(event) => setSgstper(event.target.value)}
                                    />
                                </div>
                            </div>


                            {
                                !amount &&
                                <div className="text-sm mb-4"
                                >
                                    <label className="block text-sm font-medium text-gray-700">Advance</label>
                                    <input
                                        type='text'
                                        placeholder="Amount"
                                        name='AdvanceAmount'
                                        value={totalAmount}
                                        className={defaultInputSmStyle}
                                        onChange={(event) => setAdvanceAmount(event.target.value)}
                                        disabled={!advanceAmount || advanceAmount}
                                    />
                                </div>}
                            <div className="text-sm mb-4"
                            >
                                <label className="block text-sm font-medium text-gray-700">Full</label>
                                <input
                                    type='number'
                                    placeholder="Amount"
                                    name='amount'
                                    value={amount}
                                    className={defaultInputSmStyle}
                                    onChange={(event) => setAmount(event.target.value)}
                                />
                            </div>
                            <div className="text-sm mb-4">
                                <select
                                    className={defaultInputSmBlack}
                                    value={payStatus}
                                    onChange={handlePaymentStatus}
                                >
                                    <option value="">Payment status</option>
                                    <option value="paid">Paid</option>
                                    <option value="unpaid">Unpaid</option>
                                    <option value="draft">Draft</option>
                                </select>
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