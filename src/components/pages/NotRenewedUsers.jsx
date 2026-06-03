
import { useEffect, useState } from "react";
import BackButton from "../charts/BackButton";
import { fetchNotRenewedUsers } from "../services/adminReport.api";
import { useAdminReport } from "../context/AdminReportContext";

const NotRenewedUsers = () => {
  const { fromDate, toDate } = useAdminReport();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        const res = await fetchNotRenewedUsers(fromDate, toDate);
        setData(res?.data || []);
      } catch (e) {
        console.error(e);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [fromDate, toDate]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-4">
        <BackButton fallback="/" label="← Back" />
      </div>

      <h2 className="text-2xl font-bold mb-1">Not Renewed Users</h2>

      <p className="text-gray-700 font-semibold mb-4">
        Not Renewed Users: {loading ? "Loading..." : data.length}
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="overflow-x-auto bg-white border rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">S. No.</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Last Plan</th>
                <th className="p-3 text-left">Expired On</th>
              </tr>
            </thead>

            <tbody>
              {data.map((u, index) => (
                <tr key={u.user_id ?? index} className="border-t">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.phone}</td>
                  <td className="p-3">{u.last_plan || "-"}</td>
                  <td className="p-3">
                    {u.last_expires_at
                      ? new Date(u.last_expires_at).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NotRenewedUsers;