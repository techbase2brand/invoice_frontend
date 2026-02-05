import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * CostDetailPage Component
 * Fetches client costing data from API and displays it in a professional, compact dashboard.
 * Built with React, React Router, and Tailwind CSS.
 */

const CostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const headers = getAuthHeaders();
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/costing-get/${id}`,{ headers });
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-slate-300 mt-4 font-medium">Loading costing details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 max-w-md">
          <p className="text-red-400 font-semibold">Error Loading Data</p>
          <p className="text-red-300 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // ----- overall totals (recomputed from payments so values are always correct) -----
  const totalCost = data.projects.reduce(
    (sum, p) => sum + (parseFloat(p.cost) || 0),
    0
  );

  const totalPaidFromPayments = data.projects.reduce((sum, p) => {
    const projectPaid = (p.payments || []).reduce(
      (s, pay) => s + (parseFloat(pay.paid) || 0),
      0
    );
    return sum + projectPaid;
  }, 0);

  const totalPaid = totalPaidFromPayments;
  const totalPending = Math.max(totalCost - totalPaid, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header + Back */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate("/project-cost")}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-slate-200 text-xs font-medium hover:bg-slate-700 hover:border-slate-500 transition-colors"
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
              <span>Back to Project Cost</span>
            </button>

            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${
                  data.paymentStatus === "paid"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                }`}
              >
                ✓ {data.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm hover:border-blue-500/60 transition-all">
            <p className="text-xs text-blue-300 uppercase font-bold tracking-wider mb-1">Total Cost</p>
            <p className="text-2xl font-black text-blue-300">{data.currency} {totalCost.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-xl p-4 backdrop-blur-sm hover:border-emerald-500/60 transition-all">
            <p className="text-xs text-emerald-300 uppercase font-bold tracking-wider mb-1">Paid</p>
            <p className="text-2xl font-black text-emerald-300">{data.currency} {totalPaid.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-xl p-4 backdrop-blur-sm hover:border-amber-500/60 transition-all">
            <p className="text-xs text-amber-300 uppercase font-bold tracking-wider mb-1">Pending</p>
            <p className="text-2xl font-black text-amber-300">{data.currency} {totalPending.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm hover:border-purple-500/60 transition-all">
            <p className="text-xs text-purple-300 uppercase font-bold tracking-wider mb-1">Projects</p>
            <p className="text-2xl font-black text-purple-300">{data.projects.length}</p>
          </div>
        </div>

        {/* Client Info Bar */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold mb-1">Client</p>
              <p className="font-semibold capitalize">{data.clientName}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold mb-1">Email</p>
              <p className="font-semibold text-blue-300 truncate">{data.email}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold mb-1">Phone</p>
              <p className="font-semibold">{data.mobileNo}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold mb-1">Location</p>
              <p className="font-semibold capitalize">{data.address.primary}</p>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-4">
          {data.projects.map((project, idx) => {
            const projectCost = parseFloat(project.cost) || 0;
            const projectPaid = (project.payments || []).reduce(
              (s, pay) => s + (parseFloat(pay.paid) || 0),
              0
            );
            const projectPending = Math.max(projectCost - projectPaid, 0);
            const completion =
              projectCost > 0
                ? ((projectCost - projectPending) / projectCost) * 100
                : 0;
            const completionPct = completion.toFixed(0);
            const recentPayment =
              project.payments && project.payments.length
                ? project.payments[project.payments.length - 1]
                : null;

            return (
              <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm hover:border-slate-600/80 transition-all group">
                
                {/* Project Header */}
                <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 p-4 border-b border-slate-700/50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">{project.name}</h3>
                      <p className="text-xs text-red-400 mt-1">
                        Start Date - {project.startDate} → End Date - {project.endDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 uppercase font-bold">Total Cost</p>
                      <p className="text-xl font-black text-blue-300">
                        {data.currency} {projectCost.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Project Stats */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-700/50">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-2">Advance</p>
                    <p className="text-lg font-bold text-slate-200">
                      {data.currency}{" "}
                      {(parseFloat(project.advance) || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-2">Pending</p>
                    <p
                      className={`text-lg font-bold ${
                        projectPending > 0 ? "text-amber-300" : "text-emerald-300"
                      }`}
                    >
                      {data.currency} {projectPending.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-2">Completion</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${completionPct}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-blue-300 min-w-fit">
                          {completionPct}%
                        </span>
                      </div>
                  </div>
                </div>

                {/* Payments */}
                <div className="p-4">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-3">Recent Payment</p>
                  {recentPayment ? (
                    <div className="bg-slate-700/30 rounded-lg p-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">{recentPayment.date}</span>
                        <span className="font-bold text-emerald-300">
                          {data.currency}{" "}
                          {(parseFloat(recentPayment.paid) || 0).toLocaleString()}{" "}
                          paid
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
                        <span>
                          Received (INR): ₹{" "}
                          {(parseFloat(recentPayment.receivedAmount) || 0).toLocaleString()}
                        </span>
                        <span>
                          Pending: {data.currency}{" "}
                          {(parseFloat(recentPayment.pending) || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm">No payments recorded</p>
                  )}
                  
                  {project.payments.length > 1 && (
                    <div className="mt-3 cursor-default">
                      <p className="text-xs text-blue-400 font-bold mb-1">
                        View all {project.payments.length} payments
                      </p>
                      <div className="mt-3 space-y-2 bg-slate-700/20 rounded-lg p-3">
                        {/* header row */}
                        <div className="grid grid-cols-3 gap-2 items-center text-[11px] text-slate-400 font-semibold pb-2 border-b border-slate-700/60">
                          <span>Paid Date</span>
                          <span className="text-right">Paid Amount ({data.currency})</span>
                          <span className="text-right">Received (INR)</span>
                        </div>

                        {project.payments.map((payment, pIdx) => (
                          <div
                            key={pIdx}
                            className="grid grid-cols-3 gap-2 items-center text-xs text-slate-300 border-b border-slate-700/30 py-2 last:border-0"
                          >
                            <span>{payment.date}</span>
                            <span className="font-semibold text-emerald-300 text-right">
                              {data.currency}{" "}
                              {(parseFloat(payment.paid) || 0).toLocaleString()}
                            </span>
                            <span className="text-emerald-200 text-right">
                              ₹{" "}
                              {(parseFloat(payment.receivedAmount) || 0).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-700/50 text-center text-xs text-slate-400">
          <p>Last updated: {new Date(data.timestamp).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CostDetailPage;
