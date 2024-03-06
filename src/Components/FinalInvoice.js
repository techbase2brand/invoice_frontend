import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './index.css';

const FinalInvoice = () => {
    const pdfContentRef = useRef(null);

    const downloadPdf = async () => {
        const element = pdfContentRef.current;

        if (element) {
            const canvas = await html2canvas(element);
            const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
            pdf.save('invoice.pdf');
        }
    };

    return (
        <div>
            <div className="invoice" ref={pdfContentRef}>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={downloadPdf}
                >
                    Pdf Download
                </button>
                <div className="logo">
                    <img src="https://www.base2brand.com/wp-content/uploads/2021/01/logo-svg-01.png" alt="Company Logo" />
                    <p className="form-num">U72900PB2021PTC053750</p>
                </div>
                <h2 className="tax-in">TAX INVOICE</h2>
                <div className="form-head">
                    <span className="bill-head">Bill To</span>
                    <span className="bill-head">ORIGINAL FOR RECIPIENT</span>
                </div>
                <div className="invoice-body">
                    <div className="invoice-details">
                        <label>Company Name</label>
                        <span><input type="text" placeholder="add company" /></span>
                        <label>Company Address.</label>
                        <span><input type="text" placeholder="add company Name" /></span>
                        <label>country</label>
                        <span><input type="text" value="Australia" placeholder="ctry." /></span>

                        <label>Pin Code
                        </label>
                        <span><input type="text" value="123" placeholder="pin" /></span>

                        <label>Phone
                        </label>
                        <span><input type="text" value="4545" placeholder="ph..." /></span>
                    </div>
                    <div className="invoice-details">
                        <label>Invoice No.</label>
                        <span><input type="text" value="B2B/2022-23/007" /></span>

                        <label>Invoice Date</label>
                        <span><input type="text" value="22/02/2024" /></span>

                        <label>BPlace of Supply</label>
                        <span><input type="text" value="Australia" /></span>

                        <label>State
                        </label>
                        <span><input type="text" value="state" /></span>

                        <label>State Code
                        </label>
                        <span><input type="text" value="code" /></span>

                        <label>Gst No.</label>
                        <span><input type="text" value="charge" /></span>

                    </div>
                </div>
                <table className='table-in'>
                    <thead>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Description of Services</th>
                            <th>SAC</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Website Work</td>
                            <td>Balance</td>
                            <td>AUD 500</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>In Words: Five hundred Aud Only.</td>
                            <td>Total Value </td>
                            <td>AUD 500</td>
                        </tr>
                    </tbody>
                </table>
                <div className="form-head">
                    <span className="bill-head">Bank Detail</span>
                    <span className="bill-head">Company Detail</span>
                </div>
                <div className="invoice-body">
                    <div className="invoice-details">
                        <label>Bank</label>
                        <span><input type="text" value="" placeholder="Bank Name" /></span>
                        <label>Branch</label>
                        <span><input type="text" value="" placeholder="Branch Name" /></span>
                        <label>Account No.</label>
                        <span><input type="text" value="Australia" placeholder="Acc." /></span>

                        <label>Account Name
                        </label>
                        <span><input type="text" value="" placeholder="Acc. Name" /></span>

                        <label>Account Type
                        </label>
                        <span><input type="text" value="" placeholder="Acc. Type" /></span>
                    </div>
                    <div className="invoice-details">
                        <label>Trade Name </label>
                        <span><input type="text" value="abc" /></span>
                        <label>Ifsc Code</label>
                        <span><input type="text" value="" placeholder="ifsc" /></span>
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
                                    <p>info@base2brand.com</p>
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
                                    <p>G301,SECTOR 115, IMPERIAL HEIGHTS,NEAR BBSB WAR MEMORIAL,KHARAR, Mohali, Punjab, India,
                                        140301</p>
                                    <p>hello@base2brand.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FinalInvoice