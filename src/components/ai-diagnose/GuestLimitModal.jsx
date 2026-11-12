import { Link } from "react-router-dom";
import Mascot from "../ui/Mascot";

const GuestLimitModal = ({ open, onClose, limit = 5 }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-card border border-slate-100 p-8 max-w-md w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Mascot state="confirm" size={120} className="mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Sesi gratis kamu sudah habis
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Kamu sudah memakai {limit} sesi diagnosa gratis. Masuk atau daftar
          untuk melanjutkan mengobrol dengan PawSphere AI tanpa batas.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-xl bg-brand-blue-dark text-white text-sm font-semibold hover:bg-brand-blue-normal transition-all"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2.5 rounded-xl border border-brand-blue-normal text-brand-blue-normal text-sm font-semibold hover:bg-brand-blue-light transition-all"
          >
            Daftar
          </Link>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-xs text-slate-400 hover:text-slate-600"
        >
          Nanti saja
        </button>
      </div>
    </div>
  );
};

export default GuestLimitModal;