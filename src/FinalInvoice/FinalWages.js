import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import generatePDF from "react-to-pdf";
import numberToWords from 'number-to-words';
import blobToBase64 from 'blob-to-base64'
const FinalWages = () => {
    const [formData, setFormData] = useState({});
    const { id } = useParams();
    const targetRef = useRef();
    const totalRateAmount = parseInt(formData.basic || "0") + parseInt(formData.med || "0") + parseInt(formData.children || "0")
        + parseInt(formData.house || "0") + parseInt(formData.conveyance || "0") + parseInt(formData.earning || "0")
        + parseInt(formData.arrear || "0") + parseInt(formData.reimbursement || "0")

    const deduction = parseInt(formData.health || "0") + parseInt(formData.epf || "0") + parseInt(formData.tds || "0") + parseInt(formData.proftax || "0");

    //salary-deduction
    const finalAmount = Math.abs(parseInt(formData.netsalary || "0"));

    //Net Salary in words................
    const amountInWords = numberToWords.toWords(finalAmount).charAt(0).toUpperCase() + numberToWords.toWords(finalAmount).slice(1);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const headers = {
            'Authorization': `Bearer ${token}`,  // Use the token from localStorage
            'Content-Type': 'application/json',  // Add any other headers if needed
        };
        if (id) {
            const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/wages-get/${id}`;
            axios.get(apiUrl, { headers })
                .then((response) => {
                    const invoiceData = response.data.data;
                    setFormData(invoiceData);
                })
                .catch((error) => {
                    console.error('Error fetching Wages details:', error);
                });
        }
    }, [id]);

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    };

    const formatChooseDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear().toString();
        return `${day}-${month}-${year}`;
    };

    const formatChoose = (dateString) => {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getUTCDate().toString().padStart(2, '0');
        return `${month}-${day}`;
    };


    return (
        <div>
            <button type="button" className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => generatePDF(targetRef, { filename: 'page.pdf' })}>Pdf Download</button>
            <div className="invoice" id="PDF_Download" ref={targetRef}  >
                <div className='wages_header'>
                    <img src={`https://invoice-backend.base2brand.com${formData.companylogo}`} className='com_logo' alt="Company Logo" />
                    {/* <img className='com_logo' src='/b2b-icon.png' /> */}

                    <h3>Salary Slip</h3>
                </div>
                <div className="p-5 w-full">
                    <img className='logo_invoice_overlap width_add' src={`https://invoice-backend.base2brand.com${formData.companylogo}`} />


                    <div className="salary-slip">
                        <h2 className='company-name'>
                            {/* <img src={`http://localhost:8000${formData.companylogo}`} className='com_logo' alt="Company Logo" /> */}

                            {/* {formData.companyName} */}
                        </h2>
                        <table style={{ width: '100%' }}>
                            <tbody className='table-body'>
                                <tr>
                                    <td className='sal-advice'>Salary Advice for The Month</td>
                                    <td className='sal-advice bold_data'>{formatChoose(formData?.chooseDate)}</td>
                                    <td className='sal-advice bold_data'>{formatChooseDate(formData?.chooseDate)}</td>
                                </tr>
                                <tr className='bot-border'>
                                    <td >Emp. Name<span className='table-row'>{formData.employeeName}</span></td>
                                    <td  >Dept. </td>
                                    <td className='bold_data'>{formData.department}</td>

                                </tr>
                                <tr className='bot-border'>
                                    <td >F/H Name<span className='table-row'>{formData.familyMember}</span></td>
                                    <td >Designation</td>
                                    <td className='bold_data'>{formData.designation}</td>
                                </tr>
                                <tr className='bot-border'>
                                    {/* <td >Date Of Joining<span className='table-row'>{formData.joinDate}</span></td> */}
                                    <td>Date Of Joining<span className='table-row'>{formatDate(formData.joinDate)}</span></td>

                                    <td >Employee Code</td>
                                    <td className='bold_data'>{formData.empCode}</td>
                                </tr>
                                <tr className='bot-border'>
                                    <td className="section-header">Rate of salary/Wages</td>
                                    <td className="section-header">Deduction</td>
                                    <td className="section-header">Attendance/Leave</td>
                                </tr>
                                <tr>
                                    <td >Basic<span className='table-row'>{formData.basic}</span></td>
                                    <td >Health Insurar<span className='table-row'>{formData.health}</span></td>
                                    <td >Days of this month<span className='table-row'>{formData.daysMonth}</span></td>
                                </tr>
                                <tr>
                                    <td >Med.<span className='table-row'>{formData.med}</span></td>
                                    <td >EPF<span className='table-row'>{formData.epf}</span></td>
                                    <td >Working Days<span className='table-row'>{formData.workingDays}</span></td>
                                </tr>
                                <tr>
                                    <td>Children education Allowance<span className='table-row'>{formData.children}</span></td>
                                    <td >Prof. Tax<span className='table-row'>{formData.proftax}</span></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Conveyance Allowance<span className='table-row'>{formData.conveyance}</span></td>
                                    <td >TDS<span className='table-row'>{formData.tds}</span></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>House Rent Allowance<span className='table-row'>{formData.house}</span></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Other Earnings<span className='table-row'>{formData.earning}</span></td>
                                    <td></td>
                                    <td >Casual Leave<span className='table-row'>{formData.causelLeave}</span></td>

                                </tr>
                                <tr>
                                    <td>Arrear<span className='table-row'>{formData.arrear}</span></td>
                                    <td></td>
                                    <td >Medical Leave<span className='table-row'>{formData.medicalLeave}</span></td>

                                </tr>
                                <tr style={{ borderBottom: '2px solid' }}>
                                    <td>Reimbursement<span className='table-row'>{formData.reimbursement}</span></td>
                                    <td></td>
                                    <td >Absent<span className='table-row'>{formData.absent}</span></td>

                                </tr>
                                <tr>
                                    <td className="total" >Gross Salary<span className='table-row'>{totalRateAmount}</span></td>
                                    <td className="total" >Total<span className='table-row'>{deduction}</span></td>
                                    <td className="total" >Net Salary<span className='table-row'>{finalAmount}</span></td>
                                </tr>
                                <tr>
                                    <td colspan="2" className="total">Net Salary (in words)</td>
                                    <td className="net-salary amount">{amountInWords} Only/-</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='admin-sign'>
                            <h1 className="company-head" >This is a system genrated Pdf sign not required.</h1>
                            {/* <img src={`http://localhost:8000${formData.signature}`} alt="Uploaded" className='image-adjust' /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FinalWages