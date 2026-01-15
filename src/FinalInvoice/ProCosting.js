import React, { useEffect, useState, useMemo } from "react";
import {
  FileText,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle2,
  Receipt,
  ChevronDown,
  Check,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toWords } from "number-to-words";

/**
 * Design Philosophy: Modern Financial Dashboard with Interactive Features
 * - Progressive Disclosure: Summary by default, expand for details
 * - Interactive Feedback: Immediate visual and numerical updates
 * - Data Hierarchy: Project totals prominent, tasks secondary
 * - Animations: Smooth transitions for all state changes (0.3-0.4s ease)
 * - API Integration: Fetches real data from backend
 * - FULLY RESPONSIVE: Optimized for mobile (320px+), tablet (768px+), and desktop (1024px+)
 */

const ProCosting = () => {
  const { id } = useParams();
  const [billingData, setBillingData] = useState(null);
  const [currencyRate, setCurrencyRate] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [selectedProjects, setSelectedProjects] = useState(new Set());

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        if (id) {
          const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/invoice-get/${id}`;
          const response = await axios.get(apiUrl, { headers });
          const invoiceData = response.data?.data;

          if (invoiceData) {
            // Transform API data to include projects with selection state
            const projects = invoiceData.project.map((projectName) => ({
              name: projectName,
              tasks: (invoiceData.description[projectName] || []).map(
                (desc, idx) => ({
                  description: desc,
                  amount: invoiceData.amounts[projectName]?.[idx] || 0,
                })
              ),
              isSelected: true, // All projects selected by default
            }));

            const transformedData = {
              ...invoiceData,
              projects,
            };

            setBillingData(transformedData);
            // Initialize selected projects
            setSelectedProjects(new Set(invoiceData.project.map((p) => p)));
          }
        }
      } catch (err) {
        console.error("Error fetching invoice details:", err);
        setError("Failed to load invoice data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchLiveRate = async () => {
      try {
        if (!billingData?.currency) return;

        if (billingData.currency === "INR") {
          setCurrencyRate(1);
          return;
        }

        const res = await fetch(
          `https://api.frankfurter.app/latest?from=${billingData.currency}&to=INR`
        );

        const data = await res.json();

        if (data?.rates?.INR) {
          setCurrencyRate(data.rates.INR);
        }
      } catch (err) {
        console.error("Currency fetch failed", err);
        setCurrencyRate(1); // fallback
      }
    };

    fetchLiveRate();
  }, [billingData?.currency]);

  // Toggle project selection
  const toggleProject = (projectName) => {
    setSelectedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectName)) {
        newSet.delete(projectName);
      } else {
        newSet.add(projectName);
      }
      return newSet;
    });
  };

  // Toggle project expansion
  const toggleExpand = (projectName) => {
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectName)) {
        newSet.delete(projectName);
      } else {
        newSet.add(projectName);
      }
      return newSet;
    });
  };

  // Calculate totals based on selected projects
  const calculations = useMemo(() => {
    if (!billingData) return { subtotal: 0, cgst: 0, sgst: 0, total: 0 };

    const subtotal = billingData.projects
      .filter((p) => selectedProjects.has(p.name))
      .reduce(
        (sum, project) =>
          sum +
          project.tasks.reduce((pSum, task) => pSum + Number(task.amount), 0),
        0
      );

    const cgst = Math.round(subtotal * (billingData.cgstper / 100));
    const sgst = Math.round(subtotal * (billingData.sgstper / 100));
    const total = subtotal + cgst + sgst;

    return { subtotal, cgst, sgst, total };
  }, [billingData, selectedProjects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium text-sm sm:text-base">
            Loading invoice details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !billingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="text-center bg-white p-6 sm:p-8 rounded-2xl shadow-lg max-w-sm w-full">
          <p className="text-red-600 font-semibold text-sm sm:text-base">
            {error || "No data available"}
          </p>
        </div>
      </div>
    );
  }
  const subtotalINR = Math.round(Number(calculations.subtotal) * currencyRate);

  const advanceINR = Math.round(Number(billingData.amount) * currencyRate);

  const subtotalINRWords = `${toWords(subtotalINR)} only`;
const advanceINRWords = `${toWords(advanceINR)} only`;
console.log("subtotalINRWords",subtotalINRWords);
console.log("advanceINRWords",advanceINRWords);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-2 sm:mb-2">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-4 sm:px-6 lg:px-8 py-2 sm:py-2 lg:py-2 text-white">
              <div className="flex gap-2 sm:gap-6 justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight uppercase break-words">
                    {billingData.trade}
                  </h1>
                  <p className="mt-2 text-blue-100 flex items-center gap-2 text-xs sm:text-sm">
                    <Receipt size={16} className="flex-shrink-0" />
                    <span className="break-all">
                      Invoice #{billingData.invoiceNo}
                    </span>
                  </p>
                </div>
                <div className="sm:text-right">
                  <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md w-fit">
                    <CheckCircle2 size={14} className="mr-1.5 flex-shrink-0" />
                    {billingData.paymentStatus.toUpperCase()}
                  </div>
                  <p className="mt-2 sm:mt-3 text-blue-100 flex items-center justify-start sm:justify-end gap-2 text-xs sm:text-sm">
                    <Calendar size={14} className="flex-shrink-0" />
                    {billingData.InvoiceDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Client & Company Info */}
            <div className="p-4 sm:p-6 lg:p-4 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 border-b border-slate-200">
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
                  <User size={14} className="flex-shrink-0" /> Client Details
                </h2>
                <div className="space-y-3">
                  <p className="text-lg sm:text-xl font-bold text-slate-900 break-words">
                    {billingData.client}
                  </p>
                  <div className="space-y-2 text-slate-600 text-xs sm:text-sm">
                    <p className="flex items-center gap-2 break-all">
                      {billingData.clientName}
                    </p>
                    <p className="flex items-center gap-2 break-all">
                      <Mail
                        size={14}
                        className="text-slate-400 flex-shrink-0"
                      />
                      {billingData.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone
                        size={14}
                        className="text-slate-400 flex-shrink-0"
                      />
                      {billingData.mobileNo}
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin
                        size={14}
                        className="text-slate-400 mt-0.5 flex-shrink-0"
                      />
                      <span className="break-words">
                        {billingData.clientAddress},{" "}
                        {billingData.clientAddress1},{" "}
                        {billingData.clientAddress2}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
                  <Building2 size={14} className="flex-shrink-0" /> Billed From
                </h2>
                <div className="space-y-3">
                  <p className="text-lg sm:text-xl font-bold text-slate-900 break-words">
                    {billingData.company}
                  </p>
                  <div className="space-y-2 text-slate-600 text-xs sm:text-sm">
                    <p className="flex items-start gap-2">
                      <MapPin
                        size={14}
                        className="text-slate-400 mt-0.5 flex-shrink-0"
                      />
                      <span className="break-words">
                        {billingData.companyAddress}
                      </span>
                    </p>
                    <div className="pt-2 sm:pt-3 border-t border-slate-200 mt-2 sm:mt-3 space-y-1">
                      <p className="break-all">
                        <span className="font-semibold text-slate-900">
                          GST No:
                        </span>{" "}
                        {billingData.gstNo}
                      </p>
                      <p className="break-all">
                        <span className="font-semibold text-slate-900">
                          GSTIN:
                        </span>{" "}
                        {billingData.gstin}
                      </p>
                      <p className="break-all">
                        <span className="font-semibold text-slate-900">
                          PAN:
                        </span>{" "}
                        {billingData.panNo}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Projects & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Projects List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-slate-200">
              <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText size={18} className="text-blue-600 flex-shrink-0" />
                  <span className="break-words">Project Breakdown</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-2">
                  Check/uncheck projects to update the total amount
                </p>
              </div>

              <div className="divide-y divide-slate-200">
                {billingData.projects.map((project) => {
                  const projectTotal = project.tasks.reduce(
                    (sum, task) => sum + Number(task.amount),
                    0
                  );
                  const isExpanded = expandedProjects.has(project.name);
                  const isSelected = selectedProjects.has(project.name);
                  return (
                    <div
                      key={project.name}
                      className="transition-all duration-300"
                    >
                      {/* Project Header */}
                      <div className="p-3 sm:p-4 lg:p-6 hover:bg-slate-50 transition-colors duration-200">
                        <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-4">
                          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                            {/* Checkbox */}
                            <button
                              onClick={() => toggleProject(project.name)}
                              className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 transition-all duration-300 flex items-center justify-center ${
                                isSelected
                                  ? "bg-emerald-500 border-emerald-500 shadow-md"
                                  : "border-slate-300 hover:border-slate-400"
                              }`}
                              aria-label={`Toggle ${project.name}`}
                            >
                              {isSelected && (
                                <Check size={14} className="text-white" />
                              )}
                            </button>

                            {/* Project Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-900 truncate text-sm sm:text-base">
                                {project.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-500">
                                {project.tasks.length} task
                                {project.tasks.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>

                          {/* Amount & Expand Button */}
                          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            <div className="text-right">
                              <p className="text-base sm:text-lg font-bold text-slate-900 break-words">
                                {billingData.currency}
                                {projectTotal.toLocaleString()}
                              </p>
                              <p
                                className={`text-xs font-medium transition-colors duration-300 ${
                                  isSelected
                                    ? "text-emerald-600"
                                    : "text-slate-400"
                                }`}
                              >
                                {isSelected ? "Selected" : "Unselected"}
                              </p>
                            </div>

                            <button
                              onClick={() => toggleExpand(project.name)}
                              className="flex-shrink-0 p-1.5 sm:p-2 hover:bg-slate-200 rounded-lg transition-all duration-300"
                              aria-label={`${
                                isExpanded ? "Collapse" : "Expand"
                              } ${project.name}`}
                            >
                              <ChevronDown
                                size={18}
                                className={`text-slate-600 transition-transform duration-300 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Tasks */}
                      {isExpanded && (
                        <div className="bg-slate-50 border-t border-slate-200 divide-y divide-slate-200 overflow-hidden">
                          {project.tasks.map((task, idx) => (
                            <div
                              key={idx}
                              className="p-3 sm:p-4 lg:p-6 pl-8 sm:pl-10 lg:pl-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-slate-100 transition-colors duration-200 animate-in fade-in slide-in-from-top-2 duration-300"
                            >
                              <p className="text-slate-700 text-xs sm:text-sm lg:text-base break-words flex-1">
                                {task.description}
                              </p>
                              <p className="font-mono font-semibold text-slate-900 text-xs sm:text-sm lg:text-base flex-shrink-0">
                                {billingData.currency}
                                {task.amount.toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary Panel - Fixed on Desktop, Sticky on Mobile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-slate-200 lg:sticky lg:top-8">
              <div className="p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Billing Summary
                </h3>
              </div>

              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-slate-200 gap-2">
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    Subtotal
                  </span>
                  <span className="font-mono text-base sm:text-lg font-semibold text-slate-900 break-words">
                    {billingData.currency}
                    {calculations.subtotal.toLocaleString()}
                  </span>
                </div>
                <p className="font-bold text-xs sm:text-sm text-red-600 mt-1 sm:mt-2 underline">
                  {subtotalINRWords}
                </p>
                {/* CGST */}
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-600 text-xs sm:text-sm">
                    CGST ({billingData.cgstper}%)
                  </span>
                  <span className="font-mono font-semibold text-slate-900 text-xs sm:text-sm lg:text-base break-words">
                    {billingData.currency}
                    {calculations.cgst.toLocaleString()}
                  </span>
                </div>

                {/* SGST */}
                <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-slate-200 gap-2">
                  <span className="text-slate-600 text-xs sm:text-sm">
                    SGST ({billingData.sgstper}%)
                  </span>
                  <span className="font-mono font-semibold text-slate-900 text-xs sm:text-sm lg:text-base break-words">
                    {billingData.currency}
                    {calculations.sgst.toLocaleString()}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-2 sm:pt-3 bg-gradient-to-r from-emerald-50 to-emerald-100 p-3 sm:p-4 rounded-lg gap-2">
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    Advance
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-emerald-600 break-words">
                    {billingData.currency}
                    {billingData.amount.toLocaleString()}
                  </span>
                </div>
                <p className="font-bold text-xs sm:text-sm text-red-600 mt-1 sm:mt-2 underline">
                  {advanceINRWords}.
                </p>

                {/* Payment Method */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">
                    <CreditCard size={14} className="flex-shrink-0" /> Payment
                    Method
                  </h4>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-slate-600">
                    <p className="break-all">
                      <span className="font-medium text-slate-900">
                        Method:
                      </span>{" "}
                      {billingData.payMethod.toUpperCase()}
                    </p>
                    <p className="break-all">
                      <span className="font-medium text-slate-900">Name:</span>{" "}
                      {billingData.paytmName}
                    </p>
                    <p className="break-all">
                      <span className="font-medium text-slate-900">ID:</span>{" "}
                      {billingData.PaytmId}
                    </p>
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

export default ProCosting;
