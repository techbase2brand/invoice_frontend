import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, Phone, Globe, MapPin } from "lucide-react";

const AppointmentLetter = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const targetRef = useRef();
  const [data, setData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    if (id) {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/appointment-get/${id}`;
      axios
        .get(apiUrl, { headers })
        .then((response) => {
          const invoiceData = response.data.data;
          setData(invoiceData);
        })
        .catch((error) => {
          console.error("Error fetching appointment details:", error);
        });
    }
  }, [id]);

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const companyLogo = data?.companyLogo;

  const getCompanyColors = () => {
    if (companyLogo === "/uploads/SAI LOGO copy [Recovered]-01 2.png") {
      return { primary: "#ef7e50", secondary: "#ffa726" };
    } else if (companyLogo === "/uploads/ks-01.png") {
      return { primary: "#1F8C97", secondary: "#26a69a" };
    } else if (
      companyLogo === "/uploads/Campus-logo-design-Trademark-1024x334 1.png"
    ) {
      return { primary: "#154880", secondary: "#1976d2" };
    }
    return { primary: "#164980", secondary: "#F27B53" }; // Default yellow/orange
  };

  const colors = getCompanyColors();

  const goBack = () => {
    navigate(-1);
  };

  const handleDownloadPDF = () => {
    html2canvas(targetRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      pdf.save("appointment-letter.pdf");
    });
  };

  const getCompanyWebsite = () => {
    if (companyLogo === "/uploads/SAI LOGO copy [Recovered]-01 2.png") {
      return "www.sailegalassociates.com";
    } else if (companyLogo === "/uploads/ks-01.png") {
      return "www.ksnetworkingsolutions.com";
    } else if (
      companyLogo === "/uploads/Campus-logo-design-Trademark-1024x334 1.png"
    ) {
      return "www.b2bcampus.com";
    } else if (companyLogo === "/uploads/31-31.png") {
      return "https://www.base2brand.com";
    }
    return "www.Aashuenterprises.com";
  };

  const getCompanyEmail = () => {
    if (companyLogo === "/uploads/SAI LOGO copy [Recovered]-01 2.png") {
      return "hello@sailegalassociates.com";
    } else if (companyLogo === "/uploads/ks-01.png") {
      return "hello@ksnetworkingsolutions.com";
    } else if (
      companyLogo === "/uploads/Campus-logo-design-Trademark-1024x334 1.png"
    ) {
      return "hello@base2brand.com";
    } else if (companyLogo === "/uploads/31-31.png") {
      return "hello@base2brand.com";
    }
    return "hello@Aashuenterprises.com";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-4xl mx-auto">
        <button
          onClick={goBack}
          className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg"
        >
          <Download size={20} />
          Download PDF
        </button>
      </div>

      {/* Letter Container */}
      <div className="max-w-4xl mx-auto">
        <div
          ref={targetRef}
          className="bg-white shadow-2xl relative overflow-hidden"
          style={{ minHeight: "1200px" }}
        >
          {/* Decorative Border Elements */}
          <div
            className="absolute top-0 right-0 w-32 h-32 transform rotate-45 translate-x-16 -translate-y-16"
            style={{ backgroundColor: colors.primary }}
          />
          <div
            className="absolute top-2 right-8 w-20 h-1"
            style={{ backgroundColor: colors.secondary }}
          />
          <div
            className="absolute top-5 right-8 w-16 h-1"
            style={{ backgroundColor: colors.secondary }}
          />
          <div
            className="absolute top-8 right-8 w-12 h-1"
            style={{ backgroundColor: colors.secondary }}
          />

          {/* Left Border Accent */}
          <div
            className="absolute left-0 top-0 w-1 h-full"
            style={{ backgroundColor: colors.primary }}
          />
          <div
            className="absolute left-2 top-0 w-0.5 h-full opacity-50"
            style={{ backgroundColor: colors.secondary }}
          />

          {/* Header Section */}
          <div className="relative z-10 pt-8 pb-4 px-4 md:px-12">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <img
                  src="/images.png"
                  alt="Company Logo"
                  className="h-16 md:h-20 w-auto object-contain"
                />
              </div>
              <div className="text-center md:text-right">
                <h1
                  className="text-2xl md:text-3xl font-bold mb-2"
                  style={{ color: colors.primary }}
                >
                  APPOINTMENT LETTER
                </h1>
                <div className="text-sm text-gray-600 font-bold">
                  <p>
                    Date:{" "}
                    {data.appointmentDate
                      ? formatDate(data.appointmentDate)
                      : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Reference Number */}
            <span className="text-2xl font-bold underline" style={{ color: "#164980" }}>
              Ref No. {data.refNo}
            </span>
          </div>

          {/* Main Content */}
          <div className="px-4 md:px-12 pb-2">
            <div
              className="text-gray-700 font-normal"
              style={{ fontSize: "17px", lineHeight: "22px" }}
              dangerouslySetInnerHTML={{ __html: data.appointMentData }}
            />
          </div>

          {/* Bottom Decorative Elements */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="h-2" style={{ backgroundColor: colors.primary }} />
            <div
              className="h-1"
              style={{ backgroundColor: colors.secondary }}
            />
          </div>

          {/* Footer */}
          <div
            className="relative p-6 text-white"
            style={{ backgroundColor: colors.primary }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone size={18} className="flex-shrink-0" />
                <div>
                  <p className="font-medium">+919872084850</p>
                  <p>+918360116967</p>
                </div>
              </div>

              {/* Website & Email */}
              <div className="flex items-center gap-3">
                <Globe size={18} className="flex-shrink-0" />
                <div>
                  <p className="font-medium">{getCompanyWebsite()}</p>
                  <p>{getCompanyEmail()}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex  gap-3  items-center">
                <MapPin size={18} className="flex-shrink-0" />
                <div>
                  <p>
                    F-209, Phase 8B, Industrial Area, Sector 74, Sahibzada Ajit
                    Singh Nagar, Punjab 160074
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentLetter;
