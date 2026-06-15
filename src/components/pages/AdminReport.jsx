import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DateRangePicker from "../charts/DateRangePicker";
import StatCard from "../charts/StatCard";
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

  //  Not Renewed count for StatCard
  const [notRenewedCount, setNotRenewedCount] = useState(0);
const [notRenewedLoading, setNotRenewedLoading] = useState(false);
  // useEffect(() => {
  //   const fetchNotRenewedCount = async () => {
  //     try {
  //       const res = await fetchNotRenewedUsers(); // returns response.data
  //       setNotRenewedCount((res?.data || []).length);
  //     } catch (e) {
  //       console.error("Not renewed count error:", e);
  //       setNotRenewedCount(0);
  //     }
  //   };

  //   fetchNotRenewedCount();
  // }, []);

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
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold">Admin Usage Report</h1>

      <DateRangePicker
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        onGenerate={handleGenerate}
      />

      {loading && <p className="text-blue-600">Loading report...</p>}

      {!loading && report && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Users"
              value={report.summary.users.total_users}
              onClick={() => navigate("/admin/users/all")} 
                          />
            <StatCard
              title="Approved Users"
              value={report.summary.users.approved_users}
              onClick={() => navigate("/admin/users/approved")}
             
            />
            <StatCard
              title="Hold Users"
              value={report.summary.users.hold_users}
               onClick={() => navigate("/admin/users/hold")}
            />
            <StatCard
              title="In-process Users"
              value={report.summary.users.in_process_users}
              onClick={() => navigate("/admin/users/process")}
              
            />

            <StatCard
              title="Deactivated Users"
              value={report.summary.users.deactivated_users}
              onClick={() => navigate("/admin/users/deactivated")}
            />

            <StatCard
              title="Subscriptions"
              value={report.summary.subscriptions.total_subscriptions}
              onClick={() =>
                navigate("/admin/subscribe", {
                  state: {
                    val: report.users_activity,
                    expired_not_renewed:
                      report.summary.subscriptions.expired_not_renewed,
                  },
                })
              }
            />

            <StatCard
              title="Total Messages"
              value={report.summary.messages.total_messages}
              onClick={() =>
                navigate("/admin/messages", {
                  state: {
                    total: report.summary.messages.total_messages,
                    val: report.messages_activity || [],
                  },
                })
              }
            />

            {/* <StatCard
              title="Not Renewed Users"
              value={notRenewedCount}
              onClick={() => navigate("/admin/users/not-renewed")}
            /> */}

            <StatCard
              title="Not Renewed Users"
              value={notRenewedLoading ? "..." : notRenewedCount}
              onClick={() => navigate("/admin/users/not-renewed")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="min-w-0">
              <BarChart
                title="Users Growth"
                data={report.timeline.users.map((u) => ({
                  label: formatDate(u.period),
                  value: Number(u.total_users),
                }))}
              />
            </div>

            <div className="min-w-0">
              <LineChart
                title="Messages Trend"
                data={report.timeline.messages.map((m) => ({
                  label: formatDate(m.period),
                  value: Number(m.total_messages),
                }))}
              />
            </div>

            <div className="min-w-0">
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

            <div className="min-w-0">
              <StackedBarChart
                title="Plan Purchases"
                data={processPlanData(report.timeline.plans)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReport;