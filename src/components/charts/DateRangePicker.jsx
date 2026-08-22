
import React from "react";

const DateRangePicker = ({ fromDate, toDate, setFromDate, setToDate, onGenerate }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002060] focus:border-transparent outline-none text-xs font-semibold text-slate-800 transition-all duration-150"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002060] focus:border-transparent outline-none text-xs font-semibold text-slate-800 transition-all duration-150"
          />
        </div>

        <button
          type="button"
          onClick={onGenerate}
          className="bg-[#002060] hover:bg-[#001740] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 h-10 shadow-xs"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;