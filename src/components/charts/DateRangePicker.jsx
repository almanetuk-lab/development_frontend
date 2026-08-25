
import React from "react";

const DateRangePicker = ({ fromDate, toDate, setFromDate, setToDate, onGenerate }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-xs max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50/50 border border-slate-200/70 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none text-xs font-semibold text-slate-800 transition duration-150"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50/50 border border-slate-200/70 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none text-xs font-semibold text-slate-800 transition duration-150"
          />
        </div>

        <button
          type="button"
          onClick={onGenerate}
          className="bg-slate-900 hover:bg-slate-850 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition h-10 shadow-xs cursor-pointer"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;