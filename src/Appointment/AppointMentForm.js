import React, { useEffect, useState } from "react";
import {
  defaultInputSmBlack,
  defaultInputSmStyle,
} from "../constants/defaultStyles";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AppointMentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [companyLogos, setCompanyLogos] = useState([]);
  const [selectedLogo, setSelectedLogo] = useState("");
  console.log(
    "companyLogoscompanyLogoscompanyLogos",
    companyLogos,
    selectedLogo
  );
  const [formData, setFormData] = useState({
    userName: "",
    refNo: "",
    appointmentDate: "",
    appointMentData: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (event) => {
    setSelectedLogo(event.target.value);
  };
  const generateRefNo = () => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const formattedRefNo = `B2B/${currentYear}-${nextYear
      .toString()
      .slice(-2)}/${Math.floor(1000 + Math.random() * 9000)}`;
    return formattedRefNo;
  };

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

  const fetchCreditDetail = async (id) => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    const headers = {
      Authorization: `Bearer ${token}`, // Use the token from localStorage
      "Content-Type": "application/json", // Add any other headers if needed
    };
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/appointment-get/${id}`,
        { headers }
      );
      if (response.data.success) {
        const { userName, refNo, appointmentDate, appointMentData } =
          response.data.data;
        setFormData({
          userName: userName || "",
          refNo: refNo || generateRefNo(),
          appointmentDate: appointmentDate || "",
          appointMentData: appointMentData || "",
        });
      }
    } catch (error) {
      console.error("Error fetching appointment detail:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCreditDetail(id);
    } else {
      // Set initial data for new entry
      setFormData({
        userName: "",
        refNo: generateRefNo(),
        appointmentDate: "",
        appointMentData: "",
      });

      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/get-appointmentLetter`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.data && data.data.length > 0) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              appointMentData: data.data[0].appointMentData,
            }));
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    const headers = {
      Authorization: `Bearer ${token}`, // Use the token from localStorage
      "Content-Type": "application/json", // Add any other headers if needed
    };
     // Add selectedLogo to formData
  const updatedFormData = {
    ...formData,
    companyLogo: selectedLogo, // ✅ Add logo here
  };
    try {
      if (id) {
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/api/appointment-update/${id}`,
          updatedFormData,
          { headers }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/add-appointment-data`,
          updatedFormData,
          { headers }
        );
      }

      setFormData({
        userName: "",
        refNo: generateRefNo(),
        appointmentDate: "",
        appointMentData: "",
      });
      navigate("/appointment-letter");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const goBack = () => {
    navigate(-1);
  };
  return (
    <div>
       <button style={{ fontSize: "40px" }} onClick={goBack}>
        ←
      </button>
      <div className="flex-1">
        <div className="font-title font-bold text-sm my-3">Add details</div>
        <form onSubmit={handleSubmit}>
          <div className="client-form-wrapper sm:w-1/2">
            <div className="text-sm mb-4">
              <select
                className={defaultInputSmBlack}
                value={selectedLogo}
                onChange={handleSelectChange}
              >
                <option value="">Select Company</option>
                {companyLogos.map((logo) => (
                  <option key={logo._id} value={logo.companylogo}>
                    {logo.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Name"
                className={defaultInputSmStyle}
              />
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Ref. No
              </label>
              <input
                type="text"
                name="refNo"
                value={formData.refNo}
                onChange={handleChange}
                placeholder="Ref. No"
                className={defaultInputSmStyle}
                readOnly
              />
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                className={defaultInputSmStyle}
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Appointment Letter
              </label>
              <CKEditor
                editor={ClassicEditor}
                data={formData.appointMentData}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    appointMentData: data,
                  }));
                }}
              />
            </div>
            <div className="mt-3">
              <button
                type="submit"
                className="primary-background-color w-full text-white hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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

export default AppointMentForm;
