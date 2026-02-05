import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

/**
 * CostForm - Create + Edit
 * - Create: POST  /api/save-costing
 * - Edit:   GET   /api/costing-get/:id
 *           PUT   /update-costing/:id
 *
 * IMPORTANT:
 * - Active Projects list comes from GET /api/get-clients (client.project[])
 * - If costing projects are not present in client.project[], we merge them in UI so checkboxes appear.
 */

const CostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingCosting, setLoadingCosting] = useState(false);
 const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientAddress1, setClientAddress1] = useState("");
  const [clientAddress2, setClientAddress2] = useState("");
  const [mobileNo, setMobileNo] = useState("");

  const [currency, setCurrency] = useState("INR");
  const [payStatus, setPayStatus] = useState("");

  const [selectedProject, setSelectedProject] = useState([]);
  const [amounts, setAmounts] = useState({});

  // Premium styling constants
  const labelStyle =
    "block text-xs font-semibold text-slate-700 uppercase tracking-widest mb-2.5 ml-0.5";

  const inputBaseStyle = `
    w-full px-4 py-3 
    bg-white
    text-slate-900 text-sm font-medium
    focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 
    transition-all duration-300 outline-none 
    placeholder:text-slate-400 border border-slate-300 rounded-xl
    hover:border-slate-400 focus:bg-slate-50
  `;

  const readOnlyStyle = `
    w-full px-4 py-3 
    bg-slate-50 border border-slate-300
    text-slate-700 text-sm font-medium
    cursor-default rounded-xl
  `;

  const cardStyle =
    "bg-white p-5 md:p-7 rounded-2xl shadow-md border border-slate-200 hover:shadow-lg transition-all duration-300";

  /* ================== AUTH ================== */
  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  /* ================= HELPERS ================= */
  const getCurrencySymbol = (curr) => {
    const symbols = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      INR: "₹",
      AUD: "A$",
      CAD: "C$",
    };
    return symbols[curr] || curr || "$";
  };

  // Remaining amount if we add one more empty payment row
  // Here we treat ONLY payments as reductions (advance is just a label)
  const computeRemainingPending = (projectData) => {
    const cost = Number(projectData?.cost) || 0;
    const totalPaid = (projectData?.payments || []).reduce(
      (sum, p) => sum + (Number(p.paid) || 0),
      0
    );
    return Math.max(cost - totalPaid, 0);
  };

  // Calculate pending balance for each payment row individually
  // Each row shows the remaining balance AFTER that row's payment is applied
  const updateAllPendingBalances = (projectData) => {
    const payments = Array.isArray(projectData?.payments)
      ? [...projectData.payments]
      : [];

    if (payments.length === 0) {
      return {
        ...projectData,
        payments: [{ paid: "", pending: 0, date: "", receivedAmount: "" }],
      };
    }

    const cost = Number(projectData?.cost) || 0;

    // Calculate pending for each row: cost - sum of all payments UP TO this row
    let cumulativePaid = 0;
    payments.forEach((payment, index) => {
      cumulativePaid += Number(payment.paid) || 0;
      const pending = Math.max(cost - cumulativePaid, 0);
      payments[index] = { ...payment, pending };
    });

    return { ...projectData, payments };
  };

  const updateOnlyLastPending = (projectData) => {
    return updateAllPendingBalances(projectData);
  };

  /* ================= FETCH CLIENTS ================= */
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoadingClients(true);
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "";
        const response = await axios.get(`${apiBaseUrl}/api/get-clients`, {
          headers: getHeaders(),
        });
        setClients(response.data.data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast.error("Failed to load clients");
        setClients([]);
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  /* ================= FETCH COSTING BY ID (EDIT) ================= */
  useEffect(() => {
    const fetchCostingById = async () => {
      if (!id) return; // create mode
      if (!clients.length) return; // wait clients to load

      try {
        setLoadingCosting(true);
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "";

        // ✅ GET /api/costing-get/:id
        const res = await axios.get(`${apiBaseUrl}/api/costing-get/${id}`, {
          headers: getHeaders(),
        });

        const data = res?.data?.data;
        if (!data) {
          toast.error("Costing not found");
          return;
        }

        // Prefill client & fields
        setSelectedClient(data.clientId || "");
        setCompanyName(data.companyName || "");
        setEmail(data.email || "");
        setMobileNo(data.mobileNo || "");
        setClientAddress(data?.address?.primary || "");
        setClientAddress1(data?.address?.secondary || "");
        setClientAddress2(data?.address?.tertiary || "");
        setCurrency(data.currency || "INR");
        setPayStatus(data.paymentStatus || "");

        // Prefill projects
        const projArr = Array.isArray(data.projects) ? data.projects : [];
        const names = projArr.map((p) => p.name).filter(Boolean);
        setSelectedProject(names);

        // Prefill amounts map
        const newAmounts = {};
        projArr.forEach((p) => {
          const safePayments =
            Array.isArray(p.payments) && p.payments.length
              ? p.payments.map((x) => ({
                  paid: x.paid ?? "",
                  pending: x.pending ?? 0,
                  date: x.date ?? "",
                  receivedAmount: x.receivedAmount ?? "",
                }))
              : [{ paid: "", pending: 0, date: "", receivedAmount: "" }];

          newAmounts[p.name] = updateOnlyLastPending({
            cost: p.cost ?? "",
            advance: p.advance ?? "",
            startDate: p.startDate ?? "",
            endDate: p.endDate ?? "",
            payments: safePayments,
          });
        });
        setAmounts(newAmounts);

        // ✅ ensure Active Projects list contains these projects so checkboxes show
        setClients((prev) =>
          prev.map((c) => {
            if (c._id !== data.clientId) return c;
            const existing = Array.isArray(c.project) ? c.project : [];
            const merged = Array.from(new Set([...existing, ...names]));
            return { ...c, project: merged };
          })
        );

        toast.success("Costing loaded for edit");
      } catch (err) {
        console.error("Error fetching costing:", err);
        toast.error("Failed to load costing");
      } finally {
        setLoadingCosting(false);
      }
    };

    fetchCostingById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, clients.length]);

  /* ================= CLIENT CHANGE ================= */
  const handleClientChange = (e) => {
    const clientId = e.target.value;
    setSelectedClient(clientId);

    // reset project selection & amounts
    setSelectedProject([]);
    setAmounts({});

    if (!clientId) {
      setCompanyName("");
      setEmail("");
      setClientAddress("");
      setClientAddress1("");
      setClientAddress2("");
      setMobileNo("");
      return;
    }

    const c = clients.find((i) => i._id === clientId);
    if (c) {
      setCompanyName(c.company || "");
      setEmail(c.email || "");
      setClientAddress(c.clientAddress || "");
      setClientAddress1(c.clientAddress1 || "");
      setClientAddress2(c.clientAddress2 || "");
      setMobileNo(c.mobileNo || "");
    }
  };

  /* ================= PROJECT CHECKBOX ================= */
  const handleProjectChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedProject((prev) => [...prev, value]);
      setAmounts((a) => ({
        ...a,
        [value]: updateOnlyLastPending({
          cost: "",
          advance: "",
          startDate: "",
          endDate: "",
          payments: [{ paid: "", pending: 0, date: "", receivedAmount: "" }],
        }),
      }));
    } else {
      setSelectedProject((prev) => prev.filter((p) => p !== value));
      setAmounts((a) => {
        const copy = { ...a };
        delete copy[value];
        return copy;
      });
    }
  };

  /* ================= DYNAMIC PAYMENT ENTRIES ================= */
  const addPaymentEntry = (project) => {
    setAmounts((prev) => {
      const projectData = prev[project];
      if (!projectData) return prev;

      const remaining = computeRemainingPending(projectData);
      const updated = {
        ...projectData,
        payments: [
          ...(projectData.payments || []),
          { paid: "", pending: remaining, date: "", receivedAmount: "" },
        ],
      };

      return { ...prev, [project]: updated };
    });
  };

  const removePaymentEntry = (project, index) => {
    setAmounts((prev) => {
      const projectData = prev[project];
      if (!projectData) return prev;

      const payments = [...(projectData.payments || [])];
      payments.splice(index, 1);

      const safePayments =
        payments.length > 0
          ? payments
          : [{ paid: "", pending: 0, date: "", receivedAmount: "" }];

      const updated = updateOnlyLastPending({
        ...projectData,
        payments: safePayments,
      });

      return { ...prev, [project]: updated };
    });
  };

  /* ================= FIELD UPDATES ================= */
  const handleCostChange = (project, value) => {
    setAmounts((prev) => {
      const projectData = prev[project];
      if (!projectData) return prev;
      return { ...prev, [project]: updateOnlyLastPending({ ...projectData, cost: value }) };
    });
  };

  const handleAdvanceChange = (project, value) => {
    setAmounts((prev) => {
      const projectData = prev[project];
      if (!projectData) return prev;
      
      const advanceValue = value || "";
      const payments = Array.isArray(projectData.payments) ? [...projectData.payments] : [];
      
      // Ensure at least one payment entry exists
      if (payments.length === 0) {
        payments.push({ paid: "", pending: 0, date: "", receivedAmount: "" });
      }
      
      // Auto-populate first payment's paid amount with advance
      // If advance is cleared, clear the first payment's paid amount too
      if (payments.length > 0) {
        payments[0] = { 
          ...payments[0], 
          paid: advanceValue // Auto-populate with advance (or empty if cleared)
        };
      }
      
      const updated = updateAllPendingBalances({
        ...projectData,
        advance: advanceValue,
        payments,
      });
      
      return { ...prev, [project]: updated };
    });
  };

  const handlePaymentChange = (project, index, field, value) => {
    setAmounts((prev) => {
      const projectData = prev[project];
      if (!projectData) return prev;

      const payments = [...(projectData.payments || [])];
      payments[index] = { ...payments[index], [field]: value };

      // If first payment's paid amount is manually changed and advance exists, sync advance
      if (index === 0 && field === "paid" && projectData.advance) {
        // Don't allow manual change if advance is set - it should be synced
        // But if user clears it, we should allow
        return { ...prev, [project]: updateAllPendingBalances({ ...projectData, payments }) };
      }

      return { ...prev, [project]: updateAllPendingBalances({ ...projectData, payments }) };
    });
  };

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    if (!selectedClient) {
      toast.error("Please select a client");
      const selectEl = document.querySelector('select[data-field="client"]');
      if (selectEl) {
        selectEl.focus();
        selectEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    if (!payStatus) {
      toast.error("Please select payment status");
      const payStatusSelect = document.querySelector('select[data-field="paymentStatus"]');
      if (payStatusSelect) {
        payStatusSelect.focus();
        payStatusSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    if (selectedProject.length === 0) {
      toast.error("Please select at least one project");
      return false;
    }

    for (const project of selectedProject) {
      const projectData = amounts[project];
      if (!projectData) continue;

      if (!projectData.cost || Number(projectData.cost) <= 0) {
        toast.error(`Project "${project}": Total cost is required`);
        const costInput = document.querySelector(`input[data-project="${project}"][data-field="cost"]`);
        if (costInput) {
          costInput.focus();
          costInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return false;
      }

      if (
        projectData.advance &&
        Number(projectData.advance) > Number(projectData.cost)
      ) {
        toast.error(`Project "${project}": Advance cannot exceed total cost`);
        const advanceInput = document.querySelector(`input[data-project="${project}"][data-field="advance"]`);
        if (advanceInput) {
          advanceInput.focus();
          advanceInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return false;
      }

      for (let i = 0; i < (projectData.payments || []).length; i++) {
        const payment = projectData.payments[i];

        if (!payment.paid || Number(payment.paid) <= 0) {
          toast.error(`Project "${project}": Payment ${i + 1} amount is required`);
          const paidInput = document.querySelector(`input[data-project="${project}"][data-payment-index="${i}"][data-field="paid"]`);
          if (paidInput) {
            paidInput.focus();
            paidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return false;
        }

        if (!payment.date) {
          toast.error(`Project "${project}": Payment ${i + 1} date is required`);
          const dateInput = document.querySelector(`input[data-project="${project}"][data-payment-index="${i}"][data-field="date"]`);
          if (dateInput) {
            dateInput.focus();
            dateInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return false;
        }

        if (!payment.receivedAmount || Number(payment.receivedAmount) <= 0) {
          toast.error(
            `Project "${project}": Payment ${i + 1} receiver amount (INR) is required`
          );
          const receivedInput = document.querySelector(`input[data-project="${project}"][data-payment-index="${i}"][data-field="receivedAmount"]`);
          if (receivedInput) {
            receivedInput.focus();
            receivedInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return false;
        }
      }
    }

    return true;
  };

  /* ================= PAYLOAD ================= */
  const generatePayload = () => {
    if (!validateForm()) return null;

    const payload = {
      clientId: selectedClient,

      // use clientName from API result if possible else fallback from selected client
      clientName:
        clients.find((c) => c._id === selectedClient)?.clientName || "",

      companyName,
      email,
      mobileNo,
      address: {
        primary: clientAddress,
        secondary: clientAddress1,
        tertiary: clientAddress2,
      },
      currency,
      paymentStatus: payStatus,
      projects: selectedProject.map((projectName) => {
        const p = amounts[projectName];
        const totalPaid = (p.payments || []).reduce(
          (sum, x) => sum + Number(x.paid || 0),
          0
        );
        const totalPending = Math.max(
          Number(p.cost || 0) - Number(p.advance || 0) - totalPaid,
          0
        );

        return {
          name: projectName,
          cost: p.cost,
          advance: p.advance,
          startDate: p.startDate,
          endDate: p.endDate,
          payments: p.payments || [],
          totalPending,
        };
      }),
      timestamp: new Date().toISOString(),
    };

    return payload;
  };

  /* ================= SAVE / UPDATE ================= */
  const handleSave = async () => {
     if (isSubmitting) return; 
    const payload = generatePayload();
    if (!payload) return;

    try {
       setIsSubmitting(true);
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "";

      if (id) {
        // ✅ PUT /update-costing/:id
        await axios.put(`${apiBaseUrl}/api/update-costing/${id}`, payload, {
          headers: getHeaders(),
        });
        toast.success("Costing updated successfully!");
        navigate("/project-cost");
      } else {
        // ✅ POST /api/save-costing
        await axios.post(`${apiBaseUrl}/api/save-costing`, payload, {
          headers: getHeaders(),
        });
        toast.success("Costing saved successfully!");
        setSelectedClient("");
        setCompanyName("");
        setEmail("");
        setMobileNo("");
        setClientAddress("");
        setClientAddress1("");
        setClientAddress2("");
        setCurrency("INR");
        setPayStatus("");
        setSelectedProject([]);
        setAmounts({});

        // ✅ navigate after create
        navigate("/project-cost");
      }

      // optional redirect
      // navigate("/project-costing");
    } catch (error) {
      console.error("Error saving/updating:", error);
      toast.error(id ? "Failed to update costing" : "Failed to save costing");
    }finally {
      setIsSubmitting(false);
    }
  };

  /* ================= LOADING UI ================= */
  if (loadingClients || loadingCosting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full animate-spin"></div>
              <div className="absolute inset-1 bg-white rounded-full"></div>
            </div>
          </div>
          <p className="mt-6 text-slate-700 font-medium">
            {loadingCosting ? "Loading costing..." : "Loading clients..."}
          </p>
        </div>
      </div>
    );
  }

  const selectedClientObj = clients.find((c) => c._id === selectedClient);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 md:p-8 lg:p-12 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* HEADER + BACK BUTTON */}
        <div className="mb-8 md:mb-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/project-cost")}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium bg-white hover:bg-slate-50 hover:border-slate-400 shadow-sm transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back to Project Costs</span>
            </button>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-slate-900 via-indigo-700 to-emerald-700 bg-clip-text text-transparent">
                {id ? "Edit Project Costing" : "Project Costing"}
              </span>
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN - CLIENT INFO */}
          <div className="lg:col-span-4 space-y-6">
            {/* CLIENT DETAILS CARD */}
            <div className={cardStyle}>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Client Details
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Select and manage client information
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelStyle}>Select Client</label>
                  <select
                    className={inputBaseStyle}
                    value={selectedClient}
                    data-field="client"
                    onChange={handleClientChange}
                    disabled={!!id} // optional: lock client in edit mode
                  >
                    <option value="">Choose a client...</option>
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.clientName}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedClient && (
                  <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in duration-500">
                    <div>
                      <label className={labelStyle}>Company</label>
                      <div className={readOnlyStyle}>
                        {companyName || "N/A"}
                      </div>
                    </div>
                    <div>
                      <label className={labelStyle}>Email</label>
                      <div className={readOnlyStyle}>{email || "N/A"}</div>
                    </div>
                    <div>
                      <label className={labelStyle}>Phone</label>
                      <div className={readOnlyStyle}>{mobileNo || "N/A"}</div>
                    </div>
                    <div>
                      <label className={labelStyle}>Address</label>
                      <div className="space-y-2">
                        <div className={readOnlyStyle}>
                          {clientAddress || "N/A"}
                        </div>
                        {clientAddress1 && (
                          <div className={readOnlyStyle}>{clientAddress1}</div>
                        )}
                        {clientAddress2 && (
                          <div className={readOnlyStyle}>{clientAddress2}</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* BILLING SETTINGS CARD */}
            <div className={cardStyle}>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Billing</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Configure payment settings
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelStyle}>Currency</label>
                  <select
                    className={inputBaseStyle}
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>

                <div>
                  <label className={labelStyle}>Payment Status</label>
                  <select
                    className={inputBaseStyle}
                    value={payStatus}
                    data-field="paymentStatus"
                    onChange={(e) => setPayStatus(e.target.value)}
                  >
                    <option value="">Select Status</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - PROJECTS */}
          <div className="lg:col-span-8">
            {!selectedClient ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-300 p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6 border border-indigo-300">
                  <svg
                    className="w-8 h-8 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  No Client Selected
                </h3>
                <p className="text-slate-600 max-w-xs mx-auto">
                  Select a client from the left panel to start managing project
                  records.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Active Projects
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Manage and track project costs
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-emerald-100 text-slate-900 text-xs font-bold uppercase tracking-widest rounded-full border border-indigo-300">
                    {selectedClientObj?.project?.length || 0} Projects
                  </div>
                </div>

                {clients
                  .filter((c) => c._id === selectedClient)
                  .map((c) => (
                    <div key={c._id} className="space-y-4">
                      {(c.project || []).map((project) => (
                        <div
                          key={project}
                          className={`group transition-all duration-300 rounded-2xl border ${
                            selectedProject.includes(project)
                              ? "bg-indigo-50 border-indigo-300 shadow-lg"
                              : "bg-white border-slate-300 hover:border-slate-400 hover:shadow-md"
                          }`}
                        >
                          {/* PROJECT TOGGLE & ADD BUTTON */}
                          <div className="flex items-center justify-between p-5 md:p-6">
                            <label className="flex items-center gap-4 cursor-pointer select-none flex-1">
                              <div className="relative flex items-center">
                                <input
                                  type="checkbox"
                                  className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-400 checked:border-indigo-500 checked:bg-gradient-to-br checked:from-indigo-500 checked:to-indigo-600 transition-all duration-300 shadow-sm"
                                  value={project}
                                  checked={selectedProject.includes(project)}
                                  onChange={handleProjectChange}
                                />
                                <svg
                                  className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none left-1.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="4"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <span
                                className={`text-lg font-bold transition-colors duration-200 ${
                                  selectedProject.includes(project)
                                    ? "text-indigo-900"
                                    : "text-slate-800"
                                }`}
                              >
                                {project}
                              </span>
                            </label>

                            {selectedProject.includes(project) && (
                              <button
                                onClick={() => addPaymentEntry(project)}
                                className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl flex items-center justify-center shadow-md transition-all duration-300 transform hover:scale-110 active:scale-95 flex-shrink-0"
                                title="Add Payment Entry"
                                type="button"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>

                          {/* PROJECT FORM GRID */}
                          {selectedProject.includes(project) && (
                            <div className="p-5 md:p-6 pt-0 border-t border-indigo-200 animate-in slide-in-from-top-2 duration-300">
                              {/* COST + ADVANCE + DATES */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div>
                                  <label className={labelStyle}>
                                    Total Project Cost
                                  </label>
                                  <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-sm group-focus-within:text-indigo-600 transition-colors">
                                      {currency || "$"}
                                    </span>
                                    <input
                                      type="number"
                                      className={`${inputBaseStyle} pl-12`}
                                      placeholder="0.00"
                                      value={amounts[project]?.cost || ""}
                                      data-project={project}
                                      data-field="cost"
                                      onChange={(e) =>
                                        handleCostChange(project, e.target.value)
                                      }
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className={labelStyle}>Advance</label>
                                  <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-sm group-focus-within:text-indigo-600 transition-colors">
                                      {currency || "$"}
                                    </span>
                                    <input
                                      type="number"
                                      className={`${inputBaseStyle} pl-12`}
                                      placeholder="0.00"
                                      value={amounts[project]?.advance || ""}
                                      data-project={project}
                                      data-field="advance"
                                      onChange={(e) =>
                                        handleAdvanceChange(project, e.target.value)
                                      }
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className={labelStyle}>Start Date</label>
                                  <input
                                    type="date"
                                    className={inputBaseStyle}
                                    value={amounts[project]?.startDate || ""}
                                    onChange={(e) =>
                                      setAmounts((prev) => ({
                                        ...prev,
                                        [project]: {
                                          ...prev[project],
                                          startDate: e.target.value,
                                        },
                                      }))
                                    }
                                  />
                                </div>

                                <div>
                                  <label className={labelStyle}>End Date</label>
                                  <input
                                    type="date"
                                    className={inputBaseStyle}
                                    value={amounts[project]?.endDate || ""}
                                    onChange={(e) =>
                                      setAmounts((prev) => ({
                                        ...prev,
                                        [project]: {
                                          ...prev[project],
                                          endDate: e.target.value,
                                        },
                                      }))
                                    }
                                  />
                                </div>
                              </div>

                              {/* PAYMENT ENTRIES */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-emerald-500 rounded-full"></div>
                                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                                    Payment History
                                  </span>
                                </div>

                                {(amounts[project]?.payments || []).map((payment, idx) => (
                                  <div
                                    key={idx}
                                    className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-5 bg-slate-50 rounded-xl border border-slate-300 hover:border-slate-400 group/entry transition-all duration-300"
                                  >
                                    {/* REMOVE ENTRY BUTTON */}
                                    {(amounts[project]?.payments || []).length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removePaymentEntry(project, idx)}
                                        className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 active:scale-95"
                                      >
                                        <svg
                                          className="w-3.5 h-3.5"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="3"
                                            d="M6 18L18 6M6 6l12 12"
                                          />
                                        </svg>
                                      </button>
                                    )}

                                    <div>
                                      <label className={labelStyle}>Paid Amount</label>
                                      <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-sm group-focus-within:text-indigo-600 transition-colors">
                                          {currency || "$"}
                                        </span>
                                        <input
                                          type="number"
                                          className={`${inputBaseStyle} pl-12 ${idx === 0 && amounts[project]?.advance ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                                          placeholder="0.00"
                                          value={payment.paid}
                                          data-project={project}
                                          data-payment-index={idx}
                                          data-field="paid"
                                          disabled={idx === 0 && amounts[project]?.advance && Number(amounts[project]?.advance) > 0 ? true : false}
                                          onChange={(e) =>
                                            handlePaymentChange(
                                              project,
                                              idx,
                                              "paid",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className={labelStyle}>Pending Balance</label>
                                      <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-700 font-bold text-sm">
                                          {currency || "$"}
                                        </span>
                                        <input
                                          type="number"
                                          className={`${inputBaseStyle} pl-12 bg-amber-50 border-amber-300 text-amber-900`}
                                          placeholder="0.00"
                                          value={payment.pending}
                                          readOnly
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className={labelStyle}>
                                        Receiver Amount (INR)
                                      </label>
                                      <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700 font-bold text-sm group-focus-within:text-emerald-600 transition-colors">
                                          ₹
                                        </span>
                                        <input
                                          type="number"
                                          className={`${inputBaseStyle} pl-12 bg-emerald-50 border-emerald-300 text-emerald-900 focus:bg-emerald-100`}
                                          placeholder="0.00"
                                          value={payment.receivedAmount}
                                          data-project={project}
                                          data-payment-index={idx}
                                          data-field="receivedAmount"
                                          onChange={(e) =>
                                            handlePaymentChange(
                                              project,
                                              idx,
                                              "receivedAmount",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                    </div>

                                    <div className="sm:col-span-2 lg:col-span-1">
                                      <label className={labelStyle}>Paid Date</label>
                                      <input
                                        type="date"
                                        className={inputBaseStyle}
                                        value={payment.date}
                                        data-project={project}
                                        data-payment-index={idx}
                                        data-field="date"
                                        onChange={(e) =>
                                          handlePaymentChange(project, idx, "date", e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                {/* SAVE BUTTON */}
                <div className="flex justify-end pt-6">
                  <button
                    onClick={handleSave}
                    className="group relative px-8 md:px-10 py-3.5 md:py-4 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 overflow-hidden"
                    type="button"
                    disabled={isSubmitting}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {id ? "Update Changes" : "Save Changes"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostForm;
