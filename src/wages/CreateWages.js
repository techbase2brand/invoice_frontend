import React, { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import PageTitle from "../components/Common/PageTitle";
import InvoiceIcon from "../components/Icons/InvoiceIcon";
import WagesList from "./WagesList";
import Swal from "sweetalert2";
import axios from "axios";
import Papa from 'papaparse';
function CreateWages() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedEmployeesData, setSelectedEmployeesData] = useState([]);

   const handleSelectedEmployeesChange = useCallback((selectedData) => {
    setSelectedEmployeesData(selectedData);
  }, []);
    const goToNewInvoice = useCallback(() => {
        navigate("/wages-form");
    }, [navigate]);

 const handleImportClick = () => {
    fileInputRef.current.click();
  };


   const sendEmail = async () => {
    if (selectedEmployeesData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Employees Selected",
        text: "Please select at least one employee to send mail.",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

  const payload = {
  selectedEmployees: selectedEmployeesData.map(emp => ({
    employeeId: emp.empCode || emp["Employee Code"] || emp.empCode || "",
    employeeName: emp.empName || emp["Employee Name"] || emp.employeeName || "",
    name: emp.empName || emp["Employee Name"] || emp.employeeName || "",
    fatherName: emp.familyMember || emp["F/H Name"] || emp.fatherName || "",
    email: emp.email || emp.Email || "",   // Make sure email is present in CSV or data
    dateOfJoining: emp.joinDate || emp["Date of Joining"] || emp.chooseDate || "",
    department: emp.department || "",
    designation: emp.designation || "",
    companyName: emp.companyName || emp["Company Name"] || "",
    grossSalary: Number(emp.grossSalary || emp["Gross Salary"] || 0),
    basics: Number(emp.basics || emp["Basics"] || 0),
    medical: Number(emp.med || emp["Med."] || 0),
    childEduAllowance: Number(emp.childEduAllowance || emp["children education allowance"] || 0),
    houseRentAllowance: Number(emp.houseRentAllowance || emp["House Rent allowance"] || 0),
    conveyenceAllowance: Number(emp.conveyenceAllowance || emp["Conveyence allowance"] || 0),
    otherEarning: Number(emp.otherEarning || emp["other earning"] || 0),
    arrear: Number(emp.arrear || emp["Arrear"] || 0),
    reimbursement: Number(emp.reimbursement || emp["Reimbusrement"] || 0),
    netSalary: Number(emp.netsalary || emp["Net salary"] || 0),
    totalLeaves: Number(emp.totalLeaves || emp["Total Leaves"] || 0),
    quarterlyLeavesTaken: Number(emp.quarterlyLeavesTaken || emp["Quarterly Leaves Taken"] || 0),
    leavesRemaining: Number(emp.leavesRemaining || 0),
    chooseDate: emp.joinDate || emp["Choose Date"] || emp.chooseDate || "",
    date: emp.joinDate || emp["Choose Date"] || emp.chooseDate || "",
  }))
};


      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/excel/send-email`,
        payload,
        { headers }
      );

      if (response.data) {
        setRefreshKey(prev => prev + 1);
        Swal.fire({
          icon: "success",
          title: "Emails Sent",
          text: `Successfully sent emails to ${selectedEmployeesData.length} employees.`,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        setRefreshKey(prev => prev + 1);
          localStorage.removeItem("csvData");
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Failed to send emails.",
        });
      }
    } catch (error) {
      console.error("Error sending mails:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error occurred while sending mails.",
      });
    } finally {
      setLoading(false);
    }
  };

   const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    complete: (results) => {
      // Save parsed CSV data to localStorage
      localStorage.setItem("csvData", JSON.stringify(results.data));
      // Proceed with upload if needed
        Swal.fire({
        icon: "success",
        title: "CSV Import Successfully",
        text: `CSV Import Successfully.`,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      setRefreshKey(prev => prev + 1);
    },
    error: (error) => {
      console.error("Parsing error:", error);
      alert("Error parsing CSV file.");
    }
  });
};
 
    return (
        <div>
            <div className="flex justify-between p-4">
                <div className="sm:mr-4">
                    <PageTitle title="Wages" />
                </div> 
                    <div className="flex gap-3">
                    <Button
                        onClick={sendEmail}
                        block={1}
                        size="sm"
                        style={{ width: "100px", height: "40px" }}
                        disabled={loading}
                        >
                    {loading ? "Sending..." : "Send Mail"}
                    </Button>
                    <div>
                    <Button
                        onClick={handleImportClick}
                        block={1}
                        size="sm"
                        style={{ width: "100px", height: "40px" }}
                    >
                        + Import
                    </Button>
                    <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    </div> 
                    <Button onClick={goToNewInvoice} block={1} size="sm" style={{
                        width: 'fit-content', height:'40px'
                        
                    }}>
                        <InvoiceIcon />
                        <span className="inline-block ml-2">Create Wages</span>
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap">
                <div className="w-full px-4 mb-4 sm:mb-1">
                    <WagesList showAdvanceSearch refreshKey={refreshKey} onSelectionChange={handleSelectedEmployeesChange}/>
                </div>
            </div>
        </div>
    );
}

export default CreateWages;
