
const StatCard = ({ title, value, onClick }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyPress={onClick}
      className="bg-white rounded shadow p-4 cursor-pointer
                 hover:shadow-lg hover:bg-blue-50 transition
                 active:scale-95"
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default StatCard;
