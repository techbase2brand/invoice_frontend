import React, { useEffect, useState } from 'react'
import { defaultInputSmBlack, defaultInputSmStyle } from '../constants/defaultStyles'
import Button from '../components/Button/Button'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
const ProForm = () => {
    const [client, setClient] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [state, setState] = useState('');
    const [selectedProject, setSelectedProject] = useState();
    const [companyName, setCompanyName] = useState('');
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
    const [invoicelist, setInvoiceList] = useState(null);
    const [enableGST, setEnableGST] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [description, setDescription] = useState(['']);
    const [company, setCompanyData] = useState([]);
    const [selectCompany, setSelectCompany] = useState('');
    const [comGst, setComGst] = useState('');
    const [comIfsc, setComIfsc] = useState('');
    const [comPanNo, setComPanNo] = useState('');
    const [signature, setSignature] = useState('');
    const [trade, setTrade] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetchInvoiceDetail(id);
        }
    }, [id]);

    useEffect(() => {
        const apiUrl = `http://localhost:3000/api/get-companyData`;
        axios.get(apiUrl)
            .then((response) => {
                setCompanyData(response.data.data)
            })
            .catch((error) => {
                console.error('Error fetching invoices:', error);
            });
    }, []);

    const handleCheckboxChange = (event) => {
        setEnableGST(event.target.checked);
    };
    const fetchInvoiceDetail = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/invoice-get/${id}`);
            const bankDetailData = response.data.data;
            setInvoiceList(bankDetailData);
        } catch (error) {
            console.error('Error fetching bank detail:', error);
        }
    };
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        if (invoicelist) {
            console.log("invoicelist", invoicelist);
            setSelectedClient(invoicelist?.clientName);
            setState(invoicelist?.clientName);
            setCompanyName(invoicelist.company);
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
            setPayStatus(invoicelist.paymentStatus);
            setCurrency(invoicelist.currency);
            setSelectCompany(invoicelist.trade);
            setComIfsc(invoicelist.ifsc);
            setComPanNo(invoicelist.panNo);
            setSignature(invoicelist.signature);
            setComGst(invoicelist.CompanygstNo);
            setPayStatus(invoicelist.paymentStatus);
            setDescription(invoicelist.description);
            setPaymentMethod(invoicelist.payMethod)
            setEnableGST(invoicelist.enableGST);
            setAccName(invoicelist.accName);
            setTradeName(invoicelist.tradeName);
            setTrade(invoicelist.tradde)
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
        const apiUrl = `http://localhost:3000/api/get-clients`;
        axios.get(apiUrl)
            .then((response) => {
                console.log("Client data:", response.data.data);
                setClient(response.data.data)
            })
            .catch((error) => {
                console.error('Error fetching invoices:', error);
            });
    }, []);

    useEffect(() => {
        const apiUrl = `http://localhost:3000/api/bank-data`;
        axios.get(apiUrl)
            .then((response) => {
                setData(response.data.data)
            })
            .catch((error) => {
                console.error('Error fetching invoices:', error);
            });
    }, []);

    const handleClientChange = (event) => {
        console.log("gggg");
        if (!event.target.value) {
            setCompanyName("");
            setEmail("");
            setMobileNo("");
        }
        const selectedClientId = event.target.value;
        setState(selectedClientId)
        setSelectedClient(selectedClientId);
        const selectedClient = client.find(client => client._id === selectedClientId);
        if (selectedClient) {
            setCompanyName(selectedClient.company);
            setEmail(selectedClient.email);
            setMobileNo(selectedClient.mobileNo);
        }
    };
    const handleProjectChange = (event) => {
        if (!event.target.value) {
            setSelectedProject("");
        }
        const selectedProjectId = event.target.value;
        setSelectedProject(selectedProjectId);
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
        setSelectCompany(selectedCompanyId);
        const selectedCompany = company.find(item => item._id === selectedCompanyId);
        if (selectedCompany) {
            setComGst(selectedCompany.gstNo);
            setComIfsc(selectedCompany.ifsc);
            setComPanNo(selectedCompany.panNo);
            setSignature(selectedCompany.signature);

        }
    };
    const handleSubmit = () => {
        // if (!selectedClient) {
        //     toast.error("Please select a client.", {
        //         position: "bottom-center",
        //         autoClose: 2000,
        //     });
        //     return;
        // }

        // if (!selectedProject) {
        //     toast.error("Please select a project.", {
        //         position: "bottom-center",
        //         autoClose: 2000,
        //     });
        //     return;
        // }

        // if (!paymentMethod) {
        //     toast.error("Please select a payment method.", {
        //         position: "bottom-center",
        //         autoClose: 2000,
        //     });
        //     return;
        // }
        // if (!amount) {
        //     toast.error("Please Add Amount.", {
        //         position: "bottom-center",
        //         autoClose: 2000,
        //     });
        //     return;
        // }

        const selectedClientName = client.find(item => item._id === selectedClient)?.clientName || '';
        const selectedBankName = data.find(item => item._id === selectBank)?.bankName || '';
        const selectedTradeName = company.find(item => item._id === selectCompany)?.trade || '';
        const formData = {
            clientName: state,
            company: companyName,
            email: email,
            mobileNo: mobileNo,
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
            selectDate: selectedDate,
            currency: currency,
            description: description,
            trade: selectedTradeName,
            ifsc: comIfsc,
            panNo: comPanNo,
            CompanygstNo: comGst,
            signature: signature,
            paymentStatus: payStatus,
            payMethod: paymentMethod,
            enableGST: enableGST,
            client: selectedClientName,
            tradde: trade,
            bankNamed: selectedBankName
        };

        if (id) {
            axios.put(`http://localhost:3000/api/update-invoice/${id}`, formData)
                .then(response => {
                    console.log('Form data updated successfully:', response.data);
                    navigate("/project-Detail")
                })
                .catch(error => {
                    console.error('Error updating form data:', error);
                });
        } else {
            axios.post('http://localhost:3000/api/add-clientBank', formData)
                .then(response => {
                    console.log('Form data submitted successfully:', response.data);
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

    const handleAddDescription = () => {
        setDescription([...description, '']);
    };

    const handleRemoveDescription = (index) => {
        const updatedDescriptions = [...description];
        updatedDescriptions.splice(index, 1);
        setDescription(updatedDescriptions);
    };

    const handleDescriptionChange = (value, index) => {
        const updatedDescriptions = [...description];
        updatedDescriptions[index] = value;
        setDescription(updatedDescriptions);
    };
    return (
        <div>
            <div
                className={"flex flex-row pt-2 px-8"} >
                <div className="flex-1">
                    <div className="flex flex-row mb-2">
                        <div className="font-title font-bold">Client Detail</div>
                    </div>
                    <div className="client-form-wrapper sm:w-1/2">
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
                        <div className="text-sm mb-4">
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
                        </div>
                    </div>
                    <div className="client-form-wrapper sm:w-1/2">
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
                    </div>
                    {paymentMethod === "bank" &&
                        <>
                            <div className="flex flex-row mb-2">
                                <div className="font-title font-bold">Bank Detail</div>
                            </div>
                            <div className="client-form-wrapper sm:w-1/2">
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
                            <div className="client-form-wrapper sm:w-1/2">
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
                            <div className="client-form-wrapper sm:w-1/2">
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
                            <div className="client-form-wrapper sm:w-1/2">
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
                            <div className="client-form-wrapper sm:w-1/2">
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


                    <div className="client-form-wrapper sm:w-1/2">
                        <div className="text-sm mb-4"
                        >
                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                            <input
                                type='text'
                                placeholder="Amount"
                                name='amount'
                                value={amount}
                                className={defaultInputSmStyle}
                                onChange={(event) => setAmount(event.target.value)}
                            />
                        </div>
                        <div className="text-sm mb-4">
                            <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
                            <DatePicker
                                selected={selectedDate}
                                placeholderText='select Date'
                                onChange={handleDateChange}
                                className={defaultInputSmStyle}
                            />
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
                            </select>
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
                        ))}


                    </div>
                    <div className="client-form-wrapper sm:w-1/2">
                        <label className="block text-sm font-medium text-gray-700">ADD GST</label>
                        {!id &&
                            <input type='checkbox' onChange={handleCheckboxChange} checked={enableGST} />}
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
                    </div>
                    <div className="client-form-wrapper sm:w-1/2">
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
                        {selectCompany &&
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
                                <div className="text-sm mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Signature</label>
                                    <img src={`http://localhost:3000${signature}`} alt="signature" style={{ width: '20%' }} />
                                </div>
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

                    </div>

                    <div className="mt-3" style={{ width: '20%' }}>
                        <Button block={1} onClick={handleSubmit}>
                            <span className="inline-block ml-2"> {id ? "Update" : "Submit"} </span>
                        </Button>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default ProForm;