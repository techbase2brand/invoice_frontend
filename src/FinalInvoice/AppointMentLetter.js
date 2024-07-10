import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import generatePDF from "react-to-pdf";
import numberToWords from 'number-to-words';
const AppointMentLetter = () => {
    const { id } = useParams();
    const targetRef = useRef();
    const [data, setData] = useState({});
    console.log("id", id);
    useEffect(() => {
        if (id) {
            const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/appointment-get/${id}`;
            axios.get(apiUrl)
                .then((response) => {
                    const invoiceData = response.data.data;
                    setData(invoiceData);
                })
                .catch((error) => {
                    console.error('Error fetching Wages details:', error);
                });
        }
    }, [id]);

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    return (
        <div>
            <button type="button" class="center_btn_ph mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => generatePDF(targetRef, { filename: 'page.pdf' })}>Pdf Download</button>
            <div className="invoice" id="PDF_Download" ref={targetRef}>
                <img className='logo_invoice_overlap' src='/b2b-icon.png' />
                {/* <img src='/header_invoice.png' className='w-full header_invoice' /> */}
                <div className="appoinment_logo">
                    <img src="/logo-b2b.png" alt="Company Logo" style={{ width: 'unset' }} />
                </div>
                <div className='appoint_section_new'>
                    <div className="form-head">
                        <span>Ref No. {data.refNo}</span>
                        <span>Date:- {data.appointmentDate ? formatDate(data.appointmentDate) : ''}</span>
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: data.appointMentData }} />
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

export default AppointMentLetter