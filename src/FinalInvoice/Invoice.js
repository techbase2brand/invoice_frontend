import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import generatePDF from "react-to-pdf";
import numberToWords from 'number-to-words';
const Invoice = () => {
    const [formData, setFormData] = useState({});
    console.log("formData", formData)
    // const totalAmount = parseInt(formData.amount || "0") + parseInt(formData.AdvanceAmount || "0");
    const calculateTotalAmount = () => {
        let total = 0;
        for (const task in formData.amounts) {
            const amounts = formData.amounts[task];
            for (const key in amounts) {
                total += parseInt(amounts[key]);
            }
        }
        return total;
    };

    // Usage:
    const totalAmount = `${!formData.amount ? calculateTotalAmount() : formData.amount}`;
    const { id } = useParams();
    // const downloadPdf = async () => {
    //     const element = pdfContentRef.current;
    //     if (element) {
    //         const canvas = await html2canvas(element, { scale: 2 });
    //         const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

    //         pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
    //         pdf.save('invoice.pdf');
    //     }
    // };

    useEffect(() => {
        if (id) {
            const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/invoice-get/${id}`;
            axios.get(apiUrl)
                .then((response) => {
                    const invoiceData = response.data.data;
                    setFormData(invoiceData);
                })
                .catch((error) => {
                    console.error('Error fetching invoice details:', error);
                });
        }
    }, [id]);

    const targetRef = useRef();
    const amount = totalAmount || 0;
    const amountInWords = numberToWords.toWords(amount).charAt(0).toUpperCase() + numberToWords.toWords(amount).slice(1);

    // const printPDF = () => {
    //     window.print();
    // };

    // For Hiding Name.............................
    const checkboxes = document.querySelectorAll('.hide-checkbox');
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                e.target.parentNode.parentNode.style.display = 'none';
            } else {
                e.target.parentNode.parentNode.style.display = 'block';
            }
        });
    });

    const handlePdfDownload = () => {
        document.getElementById('chatbutton').style.display = "none";
        generatePDF(targetRef, { filename: 'page.pdf' });
    }

    const digitalMarketingAmounts = formData.amounts ? formData.amounts['ORM ShabadGuru'] : undefined;
    // const dataKey = Object.keys(formData.amounts).map((key) => key)
    // console.log("dataKey ::::", dataKey)

    const amounts = formData.amounts;
    let priceValues = [];
    if (amounts) {
        Object.keys(amounts).forEach((key) => {
            console.log(`Key: ${key}`);
            Object.values(amounts[key]).forEach((value, index) => {
                priceValues.push(value);
                // console.log(`Value ${index}: ${value}`);
                console.log('priceValues',priceValues)
            });
        });
    } else {
        console.log("No amounts data available");
    }

    let finalTotalAmount = parseFloat(totalAmount) || 0;

    if (formData.sgst) {
        finalTotalAmount += parseFloat(formData.sgst) || 0;
    }
    
    if (formData.cgst) {
        finalTotalAmount += parseFloat(formData.cgst) || 0;
    }


    return (
        <div>
            <button type="button" class="center_btn_ph mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={handlePdfDownload}>Pdf Download</button>
            {/* <button type="button" class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900" onClick={printPDF}>Print</button> */}
            <div className="invoice" id="PDF_Download" ref={targetRef}  >
                <img className='logo_invoice_overlap' src={`https://invoice-backend.base2brand.com${formData.companylogo}`} />
                <img src='/header_invoice.png' className='w-full header_invoice' />
                <div className="logo text_invoice">
                    {/* <img src="/logo-svg-01.png" alt="Company Logo" /> */}
                    <img src={`https://invoice-backend.base2brand.com${formData.companylogo}`} alt="Company Logo" />
                    {/* <p className="form-num">{formData.invoice}</p> */}
                    {/* <h2 className="tax-in">TAX INVOICE</h2> */}

                </div>
                <div className='invoice_section_new'>
                    <div className="form-head">
                        <span className="bill-head">Bill To</span>
                        <span className="bill-head">Original For Recipient</span>
                    </div>
                    <div className="invoice-body">
                        <div className="invoice-detail">
                            <b>{formData.client} <span><input type='checkbox' class='hide-checkbox' id='chatbutton' /></span> </b>
                            <p>{formData.company} </p>
                            <p> {formData.clientAddress} </p>
                            <p> {formData.clientAddress1} </p>
                            <p> {formData.clientAddress2} </p>
                            <p> {formData.email} </p>
                            <p>{formData.mobileNo} </p>
                            {/* <p>{formData.project} </p> */}
                        </div>
                        <div className="invoice-details_data">
                            <div>
                                <label>Invoice No.</label>
                                <span>{formData.invoiceNo}</span>
                            </div>
                            <div>
                                <label>Invoice Date</label>
                                <span>{formData.selectDate ? formData.selectDate.split("T")[0] : "N/A"}</span>
                            </div>
                            {formData.gstNo &&
                                <div>
                                    <label>GST Code</label>
                                    <span>{formData.gstNo}</span>
                                </div>
                            }
                        </div>
                    </div>

                    <div className='table_invoce'>
                        <div className='thead'>
                            <b>Sr. No.</b>
                            <b>Task</b>
                            <b className='space_desc'>Description</b>

                            <b>Amount</b>
                            {/* <b className='status_ph'>Status</b> */}
                        </div>

                        <div className='Invoice_data'>
                            {/* <div><b> {formData?.project?.map((item, i) => (
                            <p key={i}>{i + 1}</p>
                        ))}</b>
                        </div> */}
                            <div className='combine_div'>
                                {formData.description && Object.entries(formData.description).map(([key, value], index) => (
                                    <div className='deta_combine' key={index}>
                                        <p style={{ fontWeight: '600' }}>{index + 1}</p>
                                        <div className='task_combine'>
                                            <p style={{ fontWeight: '600' }}>{key}</p>
                                            <div className='desc_data PDF_Desc'>
                                                <div className='task_name'>
                                                    {value.map((val, valIndex) => (
                                                        <section className='amount_task'>
                                                            <p>{val}</p>
                                                            {/* {digitalMarketingAmounts[valIndex] && (
                                                <b>{digitalMarketingAmounts[valIndex]}</b>
                                                )} */}
                                                        {priceValues[valIndex] && priceValues[valIndex] !== "" && (
                                                            <b>{priceValues[valIndex]}</b>
                                                        )}
                                                        </section>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* <div className=' '>

                          

                                {formData.amount === "" ? <>
                                    {formData.amounts  && Object.entries(formData.amounts).map(([key, amountObj]) => {

                                        const descriptionArr = formData?.description[key] || [];
                                        return (
                                            <div className='task_desc right_amount' key={key}>
                                                <div className='desc_data right_amount'>
                                                    {descriptionArr && descriptionArr.map((desc, index) => (
                                                        <p key={index}>
                                                            {amountObj[index]}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                                    :
                                    <p>{formData.currency} {totalAmount}</p>
                                }
                            </div> */}
                            {/* <div className='status_ph'><p>{formData.amount === "" ? "Advance" : "Full"}</p></div> */}



                        </div>
                        <div className='sgst_per'>
                            {formData.sgst &&
                                <p>SGST ({formData.sgstper}%) : <b>{formData.sgst}</b></p>}
                            {formData.cgst &&
                                <p>CGST ({formData.cgstper}%) : <b>{formData.cgst}</b></p>
                            }
                        </div>
                        <div className='total_amount flex_ph'>
                            <div className='blank_ph'>
                            </div>
                            {/* <div className='blank_ph'>
                            </div> */}
                            <div className='ph_view'>
                                <p style={{ fontSize: '18px', fontWeight: '700' }}>Total Value</p>
                            </div>
                            <div className='border_total_amount text-right ph_view'>
                            <b>{formData.currency} {finalTotalAmount.toFixed(2)}</b>
                                {/* <b>{formData.currency} {totalAmount}</b> */}
                            </div>
                        </div>
                    </div>

                    <h3 className='word_amount'>In Words: {formData.currency} {amountInWords} Only /-</h3>
                    <div className="form-head">

                        <span className="bill-head full_ph">
                            {formData.payMethod === "bank" && "Bank Detail"}
                            {formData.payMethod === "paytm" && "Paytm Detail"}
                            {formData.payMethod === "paypal" && "PayPal Detail"}
                            {formData.payMethod === "wise" && "Wise Detail"}
                            {formData.payMethod === "payOneer" && "Payoneer Detail"}

                        </span>
                        <span className="bill-head ph_hide">Company Detail</span>
                    </div>
                    <div className="invoice-body ph_bill">
                        <div className="invoice_bank">
                            <div>
                                {formData.bankNamed &&
                                    <div className="bank_data main_bank_ph">
                                        <div>
                                            <label>Bank</label>
                                            <span>{formData.bankNamed}</span>
                                        </div>
                                        <div>
                                            <label>Branch</label>
                                            <span>{formData.BranchName} </span>
                                        </div>
                                        <div>
                                            <label>Account No.</label>
                                            <span>{formData.accNo}</span>
                                        </div>
                                        <div>
                                            <label>Account Name
                                            </label>
                                            <span>{formData.accName}</span>
                                        </div>
                                        <div>
                                            <label>Account Type
                                            </label>
                                            <span>{formData.accType}</span>
                                        </div>
                                        <div>
                                            <label>IFSC
                                            </label>
                                            <span>{formData.ifscCode}</span>
                                        </div>
                                        <div>
                                            <label>Swift Code
                                            </label>
                                            <span>{formData.swiftCode}</span>
                                        </div>

                                    </div>
                                }
                                <div className="bank_data">
                                    {formData.PaytmId &&
                                        <div>
                                            <label>Paytm Id
                                            </label>
                                            <span>{formData.PaytmId}</span>
                                        </div>
                                    }


                                    {formData.payPalId &&
                                        <div>
                                            <label>Paypal Id
                                            </label>
                                            <span>{formData.payPalId}</span>
                                        </div>
                                    }
                                    {formData.wiseId &&
                                        <div>
                                            <label>Wise Id
                                            </label>
                                            <span>{formData.wiseId}</span>
                                        </div>
                                    }
                                    {formData.payoneerId &&
                                        <div>
                                            <label>Payoneer Id
                                            </label>
                                            <span>{formData.payoneerId}</span>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="invoice_bank">
                            <div className='bank_data main_bank_ph'>
                                <span className="bill-head desc_hide">Company Detail</span>

                                <div>
                                    <label>Trade Name</label>
                                    <span>{formData.trade}</span>
                                </div>
                                {formData.gstNo &&
                                    <div>
                                        <label>Ifsc Code</label>
                                        <span>{formData.ifsc}</span>
                                    </div>
                                }
                                <>
                                    <div>
                                        <label>GSTIN</label>
                                        <span>
                                            {formData.CompanygstNo}
                                            {/* <input type="text" className='transprent_gst' value={formData.CompanygstNo} /> */}
                                        </span>
                                    </div>

                                </>
                                {!formData.gstNo &&
                                    <div>
                                        <label>PAN</label>
                                        <span>{formData.panNo}</span>
                                    </div>
                                }

                                <div>
                                    <label>Address</label>
                                    <span>
                                        {formData.companyAddress}
                                        {/* <input type="text" className='transprent_gst' value={formData.companyAddress} /> */}
                                    </span>
                                </div>

                                <div>
                                    <label></label>
                                    <span>
                                        <img className='sign_mam' src={`https://invoice-backend.base2brand.com${formData.signature}`} alt="signature" style={{ width: '80px', height: "45px", objectFit: 'cover', marginTop: '5px' }} />
                                    </span>
                                </div>
                                <div>
                                    <label></label>
                                    <span>{formData.trade}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="main-footer">
                    <div className="footer">
                        <div className="middle">
                            <div className="icon-text">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        className="bi bi-telephone-fill" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd"
                                            d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                                    </svg>
                                </span>
                                <div>
                                    <p>+919872084850</p>
                                    <p className="bottom-margin">+918360116967</p>
                                </div>
                            </div>

                        </div>
                        <div className="middle">
                            <div className="icon-text">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        className="bi bi-globe" viewBox="0 0 16 16">
                                        <path
                                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z" />
                                    </svg>
                                </span>
                                <div>
                                    <p>www.base2brand.com</p>
                                    <p>hello@base2brand.com</p>
                                </div>
                            </div>

                        </div>
                        <div className="address">
                            <div className="icon-text-2">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                                    </svg>
                                </span>
                                <div>
                                    <p>F-209, Phase 8B, Industrial Area, Sector 74, Sahibzada Ajit Singh Nagar, Punjab 160074</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <img src='/invoice_banner.png' className='w-full ph_none_banner' />
            </div>
        </div>
    )
}

export default Invoice