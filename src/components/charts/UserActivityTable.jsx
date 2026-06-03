
import { useState, useEffect } from "react";

const UserActivityTable = ({ data = [] }) => {
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const total = data.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    setTotalAmount(total);
  }, [data]);

  if (!data.length) {
    return (
      <p className="text-gray-500 text-center py-6">
        No user activity found
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 font-semibold text-gray-600">S. No.</th>
            <th className="px-6 py-3 font-semibold text-gray-600">User</th>
            <th className="px-6 py-3 font-semibold text-gray-600">Email</th>
            <th className="px-6 py-3 font-semibold text-gray-600">Plan</th>
            <th className="px-6 py-3 font-semibold text-gray-600">Status</th>
            <th className="px-6 py-3 font-semibold text-gray-600">Amount</th>
            <th className="px-6 py-3 font-semibold text-gray-600">Payment</th>
            <th className="px-6 py-3 font-semibold text-gray-600">
              Purchase Date
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-gray-800">{index + 1}</td>
              <td className="px-6 py-4 font-medium text-gray-800">
                {item.user_name}
              </td>

              <td className="px-6 py-4 text-gray-600">{item.email}</td>

              <td className="px-6 py-4 text-gray-700">{item.plan_name}</td>

              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    String(item.plan_status).toLowerCase() === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.plan_status}
                </span>
              </td>

              <td className="px-6 py-4 text-gray-700">
                {item.amount ? `${item.amount} ${item.currency}` : "-"}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    item.payment_status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.payment_status || "N/A"}
                </span>
              </td>

              <td className="px-6 py-4 text-gray-600">
                {item.plan_purchase_date
                  ? new Date(item.plan_purchase_date).toLocaleDateString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="font-semibold text-xl text-center">
        Total Amount : {totalAmount}
      </h3>
    </div>
  );
};

export default UserActivityTable;