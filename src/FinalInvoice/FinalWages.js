import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import generatePDF from "react-to-pdf";
import numberToWords from "number-to-words";
import blobToBase64 from "blob-to-base64";
const FinalWages = () => {
  const [formData, setFormData] = useState({});
  const { id } = useParams();
  const targetRef = useRef();
  const totalRateAmount =
    parseInt(formData.basic || "0") +
    parseInt(formData.med || "0") +
    parseInt(formData.children || "0") +
    parseInt(formData.house || "0") +
    parseInt(formData.conveyance || "0") +
    parseInt(formData.earning || "0") +
    parseInt(formData.arrear || "0") +
    parseInt(formData.reimbursement || "0");

  const deduction =
    parseInt(formData.health || "0") +
    parseInt(formData.epf || "0") +
    parseInt(formData.tds || "0") +
    parseInt(formData.proftax || "0");

  //salary-deduction
  const finalAmount = Math.abs(parseInt(formData.netsalary || "0"));

  //Net Salary in words................
  const amountInWords =
    numberToWords.toWords(finalAmount).charAt(0).toUpperCase() +
    numberToWords.toWords(finalAmount).slice(1);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    const headers = {
      Authorization: `Bearer ${token}`, // Use the token from localStorage
      "Content-Type": "application/json", // Add any other headers if needed
    };
    if (id) {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/wages-get/${id}`;
      axios
        .get(apiUrl, { headers })
        .then((response) => {
          const invoiceData = response.data.data;
          setFormData(invoiceData);
        })
        .catch((error) => {
          console.error("Error fetching Wages details:", error);
        });
    }
  }, [id]);

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const formatChooseDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear().toString();
    return `${day}-${month}-${year}`;
  };

  const formatChoose = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getUTCDate().toString().padStart(2, "0");
    return `${month}-${day}`;
  };
  const companyLogo = formData?.companylogo;

  return (
    <div>
      <button
        type="button"
        className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={() => generatePDF(targetRef, { filename: "page.pdf" })}
      >
        Pdf Download
      </button>
      <div className="invoice" id="PDF_Download" ref={targetRef}>
        <div className="wages_header">
          <img
            src={`https://invoice-backend.base2brand.com${formData.companylogo}`}
            className="com_logo"
            alt="Company Logo"
          />
          {/* <img className='com_logo' src='/b2b-icon.png' /> */}

          <h3
            style={{
              color: `${
                companyLogo === "/uploads/SAI LOGO copy [Recovered]-01 2.png"
                  ? "#ef7e50"
                  : companyLogo === "/uploads/ks-01.png"
                  ? "#1F8C97"
                  : companyLogo ===
                    "/uploads/Campus-logo-design-Trademark-1024x334 1.png"
                  ? "#154880"
                  : "#042DA0"
              }`,
            }}
          >
            Salary Slip
          </h3>
        </div>
        <div className="p-5 w-full">
          <img
            className="logo_invoice_overlap width_add"
            src={`https://invoice-backend.base2brand.com${formData.companylogo}`}
          />

          <div className="salary-slip">
            <h2 className="company-name">
              {/* <img src={`http://localhost:8000${formData.companylogo}`} className='com_logo' alt="Company Logo" /> */}

              {/* {formData.companyName} */}
            </h2>
            <table style={{ width: "100%" }}>
              <tbody className="table-body">
                <tr>
                  <td className="sal-advice">Salary Advice for The Month</td>
                  <td className="sal-advice bold_data">
                    {formatChoose(formData?.chooseDate)}
                  </td>
                  <td className="sal-advice bold_data">
                    {formatChooseDate(formData?.chooseDate)}
                  </td>
                </tr>
                <tr className="bot-border">
                  <td>
                    Emp. Name
                    <span className="table-row">{formData.employeeName}</span>
                  </td>
                  <td>Dept. </td>
                  <td className="bold_data">{formData.department}</td>
                </tr>
                <tr className="bot-border">
                  <td>
                    F/H Name
                    <span className="table-row">{formData.familyMember}</span>
                  </td>
                  <td>Designation</td>
                  <td className="bold_data">{formData.designation}</td>
                </tr>
                <tr className="bot-border">
                  {/* <td >Date Of Joining<span className='table-row'>{formData.joinDate}</span></td> */}
                  <td>
                    Date Of Joining
                    <span className="table-row">
                      {formatDate(formData.joinDate)}
                    </span>
                  </td>

                  <td>Employee Code</td>
                  <td className="bold_data">{formData.empCode}</td>
                </tr>
                <tr className="bot-border">
                  <td className="section-header">Rate of salary/Wages</td>
                  <td className="section-header">Deduction</td>
                  <td className="section-header">Attendance/Leave</td>
                </tr>
                <tr>
                  <td>
                    Basic<span className="table-row">{formData.basic}</span>
                  </td>
                  <td>
                    Health Insurar
                    <span className="table-row">{formData.health}</span>
                  </td>
                  <td>
                    Days of this month
                    <span className="table-row">{formData.daysMonth}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    Med.<span className="table-row">{formData.med}</span>
                  </td>
                  <td>
                    EPF<span className="table-row">{formData.epf}</span>
                  </td>
                  <td>
                    Working Days
                    <span className="table-row">{formData.workingDays}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    Children education Allowance
                    <span className="table-row">{formData.children}</span>
                  </td>
                  <td>
                    Prof. Tax
                    <span className="table-row">{formData.proftax}</span>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    Conveyance Allowance
                    <span className="table-row">{formData.conveyance}</span>
                  </td>
                  <td>
                    TDS<span className="table-row">{formData.tds}</span>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    House Rent Allowance
                    <span className="table-row">{formData.house}</span>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    Other Earnings
                    <span className="table-row">{formData.earning}</span>
                  </td>
                  <td></td>
                  <td>
                    Casual Leave
                    <span className="table-row">{formData.causelLeave}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    Arrear<span className="table-row">{formData.arrear}</span>
                  </td>
                  <td></td>
                  <td>
                    Medical Leave
                    <span className="table-row">{formData.medicalLeave}</span>
                  </td>
                </tr>
                <tr style={{ borderBottom: "2px solid" }}>
                  <td>
                    Reimbursement
                    <span className="table-row">{formData.reimbursement}</span>
                  </td>
                  <td></td>
                  <td>
                    Absent<span className="table-row">{formData.absent}</span>
                  </td>
                </tr>
                <tr>
                  <td className="total">
                    Gross Salary
                    <span className="table-row">{totalRateAmount}</span>
                  </td>
                  <td className="total">
                    Total<span className="table-row">{deduction}</span>
                  </td>
                  <td className="total">
                    Net Salary<span className="table-row">{finalAmount}</span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" className="total">
                    Net Salary (in words)
                  </td>
                  <td className="net-salary amount">{amountInWords} Only/-</td>
                </tr>
              </tbody>
            </table>
            <div className="admin-sign">
              <h1 className="company-head">
                This is a system genrated Pdf sign not required.
              </h1>
              {/* <img src={`http://localhost:8000${formData.signature}`} alt="Uploaded" className='image-adjust' /> */}
            </div>
            <div
              style={{
                width: "100%",
                marginTop: "20px",
                background: `${
                  companyLogo === "/uploads/SAI LOGO copy [Recovered]-01 2.png"
                    ? "#ef7e50"
                    : companyLogo === "/uploads/ks-01.png"
                    ? "#1F8C97"
                    : companyLogo ===
                      "/uploads/Campus-logo-design-Trademark-1024x334 1.png"
                    ? "#154880"
                    : "#042DA0"
                }`,
              }}
              //   className="main-footer"
            >
              <div className="footer">
                <div className="middle">
                  <div className="icon-text">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-telephone-fill"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"
                        />
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-globe"
                        viewBox="0 0 16 16"
                      >
                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z" />
                      </svg>
                    </span>
                    <div>
                      <p>
                        {companyLogo ===
                        "/uploads/SAI LOGO copy [Recovered]-01 2.png"
                          ? "www.sailegalassociates.com"
                          : companyLogo === "/uploads/ks-01.png"
                          ? "www.ksnetworkingsolutions.com"
                          : companyLogo ===
                            "/uploads/Campus-logo-design-Trademark-1024x334 1.png"
                          ? "www.b2bcampus.com"
                          : "www.Aashuenterprises.com"}
                      </p>
                      <p>
                        {companyLogo ===
                        "/uploads/SAI LOGO copy [Recovered]-01 2.png"
                          ? "hello@sailegalassociates.com"
                          : companyLogo === "/uploads/ks-01.png"
                          ? "hello@ksnetworkingsolutions.com"
                          : companyLogo ===
                            "/uploads/Campus-logo-design-Trademark-1024x334 1.png"
                          ? "hello@base2brand.com"
                          : "hello@Aashuenterprises.com"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="address">
                  <div className="icon-text-2">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-geo-alt-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                      </svg>
                    </span>
                    <div>
                      <p>
                        F-209, Phase 8B, Industrial Area, Sector 74, Sahibzada
                        Ajit Singh Nagar, Punjab 160074
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalWages;
