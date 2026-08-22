
const StatCard = ({ title, value, onClick }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyPress={onClick}
      className="bg-white rounded-2xl border border-slate-200/60 p-5 cursor-pointer
                 hover:shadow-lg hover:border-[#FF2A6D]/20 hover:bg-slate-50/50 transition-all duration-200
                 active:scale-98 select-none focus:outline-none focus:ring-2 focus:ring-[#FF2A6D]"
    >
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-black text-[#002060]">{value}</p>
    </div>
  );
};

export default StatCard;
