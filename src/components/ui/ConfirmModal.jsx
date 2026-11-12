// src/components/ui/ConfirmModal.jsx
import Mascot from './Mascot';

/**
 * Pop-up konfirmasi reusable untuk aksi berbahaya / butuh persetujuan.
 * Dipakai untuk: logout, hapus data, edit data, simpan perubahan penting, dll.
 */
export default function ConfirmModal({
  open,
  title = 'Apakah kamu yakin?',
  message = '',
  confirmText = 'Ya, lanjutkan',
  cancelText = 'Batal',
  tone = 'default', // 'default' (oranye) | 'danger' (merah)
  mascot = 'confirm', // state maskot: 'confirm' | 'error' | 'success' | ...
  loading = false,
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  const confirmClasses =
    tone === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700'
      : 'bg-[#FF6B00] hover:bg-[#e66000]';

  return (
    <div
      onClick={loading ? undefined : onClose}
      className="fixed inset-0 z-[70] bg-[#1E3A4C]/40 backdrop-blur-[2px] flex items-center justify-center p-4 transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] bg-white rounded-[28px] p-7 md:p-8 shadow-[0_20px_50px_rgba(24,59,86,0.2)] border border-slate-100 text-center animate-[fadeIn_0.2s_ease-out]"
      >
        {/* Maskot */}
        <div className="flex justify-center mb-3">
          <Mascot state={mascot} size={144} />
        </div>

        {/* Judul & Pesan */}
        <h2 className="font-display text-lg md:text-xl font-extrabold text-[#1E3A4C] mb-2 leading-snug">
          {title}
        </h2>
        {message && (
          <p className="text-xs md:text-sm text-slate-500 leading-relaxed mb-6">
            {message}
          </p>
        )}

        {/* Tombol Aksi */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full bg-[#EBF2F7] hover:bg-[#dfe9f0] text-[#1E3A4C] font-bold py-3 px-4 rounded-xl text-xs md:text-sm transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`w-full ${confirmClasses} text-white font-bold py-3 px-4 rounded-xl text-xs md:text-sm transition shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading ? 'Memproses...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}