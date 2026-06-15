import { useLocation } from "react-router-dom";
import BackButton from "../charts/BackButton";
const MessagesDetails = () => {
  const { state } = useLocation();
  const total = state?.total ?? 0;
  const data = state?.val ?? [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-4">
        <BackButton fallback="/" label="← Back to Report" />
      </div>

      <h2 className="text-2xl font-bold mb-2">Messages</h2>
      <p className="text-gray-700 mb-4">
        Total Messages: <b>{total}</b>
      </p>

      {!data.length ? (
        <p className="text-gray-600">No messages found</p>
      ) : (
        <div className="overflow-x-auto bg-white border rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">S. No.</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Sender</th>
                <th className="p-3 text-left">Receiver</th>
                <th className="p-3 text-left">Content</th>
                <th className="p-3 text-left">Attachment</th>
              </tr>
            </thead>
            <tbody>
              {data.map((m, index) => (
                <tr key={m.id ?? index} className="border-t">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{new Date(m.created_at).toLocaleString()}</td>
                  <td className="p-3">
                    {m.sender_name} <div className="text-gray-500">{m.sender_email}</div>
                  </td>
                  <td className="p-3">
                    {m.receiver_name || "N/A"}{" "}
                    <div className="text-gray-500">{m.receiver_email || ""}</div>
                  </td>
                  {/* <td className="p-3">{m.topic || "-"}</td> */}
                  <td className="p-3">{m.content || "-"}</td>
                  <td className="p-3">
                    {m.attachment_url ? (
                      <a className="text-blue-600 underline" href={m.attachment_url} target="_blank">
                        View
                      </a>
                    ) : (
                      "-"
                    )}
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

export default MessagesDetails;