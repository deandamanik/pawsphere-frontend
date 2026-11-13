// src/context/DashboardSearchContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const DashboardSearchContext = createContext({
  query: "",
  setQuery: () => {},
});

// Hook dipakai DashboardShell (input) & tiap halaman dashboard (filter).
// Aman dipakai di luar provider (default query kosong).
export const useDashboardSearch = () => useContext(DashboardSearchContext);

/**
 * Provider dibungkus di sekitar route dashboard (lihat AppRouter).
 * Pencarian otomatis direset saat pindah halaman — UX lebih bersih.
 */
export default function DashboardSearchProvider() {
  const [query, setQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    setQuery("");
  }, [location.pathname]);

  return (
    <DashboardSearchContext.Provider value={{ query, setQuery }}>
      <Outlet />
    </DashboardSearchContext.Provider>
  );
}