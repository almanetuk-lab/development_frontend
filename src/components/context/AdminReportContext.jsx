import { createContext, useContext, useMemo, useState } from "react";

const AdminReportContext = createContext(null);

export const AdminReportProvider = ({ children }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [report, setReport] = useState(null);

  const value = useMemo(
    () => ({
      fromDate,
      setFromDate,
      toDate,
      setToDate,
      report,
      setReport,
    }),
    [fromDate, toDate, report]
  );

  return (
    <AdminReportContext.Provider value={value}>
      {children}
    </AdminReportContext.Provider>
  );
};

export const useAdminReport = () => {
  const ctx = useContext(AdminReportContext);
  if (!ctx) {
    throw new Error("useAdminReport must be used inside AdminReportProvider");
  }
  return ctx;
};