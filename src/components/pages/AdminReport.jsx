import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import DateRangePicker from "../charts/DateRangePicker";
import BarChart from "../charts/BarChart";
import LineChart from "../charts/LineChart";
import PieChart from "../charts/PieChart";
import StackedBarChart from "../charts/StackedBarChart";
import { fetchAdminReport, fetchNotRenewedUsers } from "../services/adminReport.api";
import { useAdminReport } from "../context/AdminReportContext";


const AdminReport = () => {
  const navigate = useNavigate();

  //  moved to Context (so browser back doesn't reset)
  const { fromDate, setFromDate, toDate, setToDate, report, setReport } =
    useAdminReport();

  const [loading, setLoading] = useState(false);
  const [notRenewedCount, setNotRenewedCount] = useState(0);
  const [notRenewedLoading, setNotRenewedLoading] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      const element = document.getElementById("admin-report-content");
      if (!element) {
        setLoading(false);
        return;
      }

      // Hide elements with data-html2pdf-ignore="true" temporarily
      const ignoredElements = element.querySelectorAll('[data-html2pdf-ignore="true"]');
      ignoredElements.forEach((el) => {
        el.style.display = "none";
      });

      // Capture the element using html2canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Restore ignored elements visibility
      ignoredElements.forEach((el) => {
        el.style.display = "";
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const margin = 10;
      const contentWidth = pdfWidth - 2 * margin;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
      
      let heightLeft = contentHeight;
      let position = margin;

      // Add first page
      pdf.addImage(imgData, "JPEG", margin, position, contentWidth, contentHeight);
      heightLeft -= (pdfHeight - 2 * margin);

      // Handle multi-page PDF generation if needed
      while (heightLeft > 0) {
        position = heightLeft - contentHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", margin, position, contentWidth, contentHeight);
        heightLeft -= (pdfHeight - 2 * margin);
      }

      pdf.save(`Usage_Report_${fromDate}_to_${toDate}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Failed to generate PDF report.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch default report (last 30 days) on mount so it's not blank at start
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const init = async () => {
      let currentFrom = fromDate;
      let currentTo = toDate;

      if (!fromDate || !toDate) {
        setFromDate(thirtyDaysAgo);
        setToDate(today);
        currentFrom = thirtyDaysAgo;
        currentTo = today;
      }

      if (!report || !report.summary?.newsletter || !report.summary?.contacts) {
        try {
          setLoading(true);
          const response = await fetchAdminReport(currentFrom, currentTo);
          const actualData = response?.data?.data || response?.data || response;
          if (actualData?.summary) {
            setReport(actualData);
          }
        } catch (err) {
          console.error("Auto fetch report error:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    init();
  }, []);

  useEffect(() => {
  const fetchNotRenewedCount = async () => {
    //  report generate hone ke baad hi count fetch karo
    if (!report || !fromDate || !toDate) {
      setNotRenewedCount(0);
      return;
    }

    try {
      setNotRenewedLoading(true);

      //  IMPORTANT: dates pass karo
      const res = await fetchNotRenewedUsers(fromDate, toDate);
      setNotRenewedCount((res?.data || []).length);
    } catch (e) {
      console.error("Not renewed count error:", e);
      setNotRenewedCount(0);
    } finally {
      setNotRenewedLoading(false);
    }
  };

  fetchNotRenewedCount();
}, [report, fromDate, toDate]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const processPlanData = (plans = []) => {
    const grouped = {};
    plans.forEach((p) => {
      const key = formatDate(p.period);
      if (!grouped[key]) grouped[key] = { label: key };
      grouped[key][p.plan_name] = Number(p.count);
    });
    return Object.values(grouped);
  };

  const handleGenerate = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both dates");
      return;
    }

    try {
      setLoading(true);

      const response = await fetchAdminReport(fromDate, toDate);
      const actualData = response?.data?.data || response?.data || response;

      if (!actualData?.summary) {
        console.error("Invalid response:", response);
        alert("Invalid report data");
        return;
      }

      setReport(actualData);
    } catch (err) {
      console.error("API Error:", err);
      alert("Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Admin Usage Report</h1>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Generate granular timeline intelligence of platform growth and engagement metrics</p>
        </div>
        {!loading && report && (
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-file-pdf"></i>
            Export PDF
          </button>
        )}
      </div>

      <div data-html2pdf-ignore="true">
        <DateRangePicker
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          onGenerate={handleGenerate}
        />
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-[#FF2A6D] text-xs font-bold animate-pulse py-4">
          <div className="w-3.5 h-3.5 border-2 border-[#FF2A6D] border-t-transparent rounded-full animate-spin"></div>
          Compiling report timeline analytics...
        </div>
      )}

      {!loading && report && (
        <div id="admin-report-content" className="space-y-6 p-6 bg-slate-50/30 rounded-2xl border border-slate-200/40">
          <div className="pb-4 border-b border-slate-200 mb-4">
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">Usage Report Intelligence</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Timeline Range: {formatDate(fromDate)} to {formatDate(toDate)}</p>
          </div>
          {/* Metrics Section */}
          <div className="space-y-6">
            {/* Primary KPIs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Total Users Card */}
              <div
                onClick={() => navigate("/admin/users/all")}
                className="bg-white rounded-xl border border-slate-200/70 border-t-4 border-t-indigo-500 p-5 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-200 select-none group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Total Registrations</span>
                  <i className="fa-solid fa-users text-slate-400 group-hover:text-indigo-600 transition text-sm"></i>
                </div>
                <h3 className="text-3xl font-black text-slate-800 mt-3 tracking-tight">{report.summary.users.total_users}</h3>
                <p className="text-[10px] text-slate-400 font-medium mt-1">Total user sign-ups in date range</p>
              </div>

              {/* Subscriptions Card */}
              <div
                onClick={() =>
                  navigate("/admin/subscribe", {
                    state: {
                      val: report.users_activity,
                      expired_not_renewed: report.summary.subscriptions.expired_not_renewed,
                    },
                  })
                }
                className="bg-white rounded-xl border border-slate-200/70 border-t-4 border-t-emerald-500 p-5 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-200 select-none group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Premium Subscriptions</span>
                  <i className="fa-solid fa-credit-card text-slate-400 group-hover:text-emerald-600 transition text-sm"></i>
                </div>
                <h3 className="text-3xl font-black text-slate-800 mt-3 tracking-tight">{report.summary.subscriptions.total_subscriptions}</h3>
                <p className="text-[10px] text-slate-400 font-medium mt-1">Premium membership plans activated</p>
              </div>

              {/* Total Messages Card */}
              <div
                onClick={() =>
                  navigate("/admin/messages", {
                    state: {
                      total: report.summary.messages.total_messages,
                      val: report.messages_activity || [],
                    },
                  })
                }
                className="bg-white rounded-xl border border-slate-200/70 border-t-4 border-t-violet-500 p-5 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-200 select-none group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Messages Exchanged</span>
                  <i className="fa-solid fa-comments text-slate-400 group-hover:text-violet-600 transition text-sm"></i>
                </div>
                <h3 className="text-3xl font-black text-slate-800 mt-3 tracking-tight">{report.summary.messages.total_messages}</h3>
                <p className="text-[10px] text-slate-400 font-medium mt-1">Direct message exchange logs</p>
              </div>

              {/* Newsletter Subscribers Card */}
              <div
                onClick={() => navigate("/admin/newsletter")}
                className="bg-white rounded-xl border border-slate-200/70 border-t-4 border-t-pink-500 p-5 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-200 select-none group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Newsletter Subscribers</span>
                  <i className="fa-solid fa-paper-plane text-slate-400 group-hover:text-pink-600 transition text-sm"></i>
                </div>
                <h3 className="text-3xl font-black text-slate-800 mt-3 tracking-tight">{report.summary.newsletter?.total_newsletter_subscribers ?? 0}</h3>
                <p className="text-[10px] text-slate-400 font-medium mt-1">New newsletter list signups</p>
              </div>

              {/* Contact Inquiries Card */}
              <div
                onClick={() => navigate("/admin/contacts")}
                className="bg-white rounded-xl border border-slate-200/70 border-t-4 border-t-sky-500 p-5 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-200 select-none group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Support Inquiries</span>
                  <i className="fa-solid fa-envelope-open-text text-slate-400 group-hover:text-sky-600 transition text-sm"></i>
                </div>
                <h3 className="text-3xl font-black text-slate-800 mt-3 tracking-tight">{report.summary.contacts?.total_contacts ?? 0}</h3>
                <p className="text-[10px] text-slate-400 font-medium mt-1">Contact form inquires received</p>
              </div>

              {/* Not Renewed Users Card */}
              <div
                onClick={() => navigate("/admin/users/not-renewed")}
                className="bg-white rounded-xl border border-slate-200/70 border-t-4 border-t-rose-500 p-5 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-200 select-none group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Not Renewed</span>
                  <i className="fa-solid fa-triangle-exclamation text-slate-400 group-hover:text-rose-600 transition text-sm"></i>
                </div>
                <h3 className="text-3xl font-black text-slate-800 mt-3 tracking-tight">{notRenewedLoading ? "..." : notRenewedCount}</h3>
                <p className="text-[10px] text-slate-400 font-medium mt-1">Expired premium subscription drops</p>
              </div>
            </div>

            {/* User Directory Status Breakdown Card */}
            <div className="bg-slate-50/60 rounded-xl border border-slate-200/50 p-6">
              <div className="mb-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">User Directory Account Verification Status</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Summary of verification states for range registrations</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  onClick={() => navigate("/admin/users/approved")}
                  className="bg-white rounded-xl border border-slate-200/60 p-4 flex items-center justify-between cursor-pointer hover:border-emerald-500/40 hover:shadow-xs transition duration-200 select-none group"
                >
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Approved</p>
                    <p className="text-xl font-bold text-slate-800 mt-1">{report.summary.users.approved_users}</p>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs group-hover:bg-emerald-100 transition">
                    <i className="fa-solid fa-circle-check"></i>
                  </span>
                </div>

                <div
                  onClick={() => navigate("/admin/users/hold")}
                  className="bg-white rounded-xl border border-slate-200/60 p-4 flex items-center justify-between cursor-pointer hover:border-amber-500/40 hover:shadow-xs transition duration-200 select-none group"
                >
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">On Hold</p>
                    <p className="text-xl font-bold text-slate-800 mt-1">{report.summary.users.hold_users}</p>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xs group-hover:bg-amber-100 transition">
                    <i className="fa-solid fa-circle-pause"></i>
                  </span>
                </div>

                <div
                  onClick={() => navigate("/admin/users/process")}
                  className="bg-white rounded-xl border border-slate-200/60 p-4 flex items-center justify-between cursor-pointer hover:border-blue-500/40 hover:shadow-xs transition duration-200 select-none group"
                >
                  <div>
                    <p className="text-[9px] font-black text-slate-455 uppercase tracking-wider">In Process</p>
                    <p className="text-xl font-bold text-slate-800 mt-1">{report.summary.users.in_process_users}</p>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs group-hover:bg-blue-100 transition">
                    <i className="fa-solid fa-arrows-spin animate-spin-slow"></i>
                  </span>
                </div>

                <div
                  onClick={() => navigate("/admin/users/deactivated")}
                  className="bg-white rounded-xl border border-slate-200/60 p-4 flex items-center justify-between cursor-pointer hover:border-rose-500/40 hover:shadow-xs transition duration-200 select-none group"
                >
                  <div>
                    <p className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Deactivated</p>
                    <p className="text-xl font-bold text-slate-800 mt-1">{report.summary.users.deactivated_users}</p>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-xs group-hover:bg-rose-100 transition">
                    <i className="fa-solid fa-user-slash"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="min-w-0 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-sm transition">
              <BarChart
                title="Users Growth"
                data={report.timeline.users.map((u) => ({
                  label: formatDate(u.period),
                  value: Number(u.total_users),
                }))}
              />
            </div>

            <div className="min-w-0 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-sm transition">
              <LineChart
                title="Messages Trend"
                data={report.timeline.messages.map((m) => ({
                  label: formatDate(m.period),
                  value: Number(m.total_messages),
                }))}
              />
            </div>

            <div className="min-w-0 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-sm transition">
              <PieChart
                title="User Status"
                data={[
                  { label: "Approved", value: +report.summary.users.approved_users },
                  { label: "Hold", value: +report.summary.users.hold_users },
                  {
                    label: "In-process",
                    value: +report.summary.users.in_process_users,
                  },
                  {
                    label: "Deactivated",
                    value: +report.summary.users.deactivated_users,
                  },
                ]}
              />
            </div>

            <div className="min-w-0 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-sm transition">
              <StackedBarChart
                title="Plan Purchases"
                data={processPlanData(report.timeline.plans)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReport;