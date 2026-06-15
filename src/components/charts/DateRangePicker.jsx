
import React from "react";

const DateRangePicker = ({ fromDate, toDate, setFromDate, setToDate, onGenerate }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          type="button"
          onClick={onGenerate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full h-10"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;