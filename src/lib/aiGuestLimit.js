// ============================================================
// Guest AI limit helpers (sisi client).
// - guestId stabil di localStorage (menandai pengunjung anonim
//   supaya backend bisa meter 5 sesi gratisnya).
// - Mirror ringan sisa kuota untuk UX instan; backend tetap
//   sumber kebenaran.
// ============================================================

const GUEST_ID_KEY = "pawsphere_guest_id";
const GUEST_REMAINING_KEY = "pawsphere_ai_guest_remaining";

export const GUEST_FREE_LIMIT = 5;

// Id anonim stabil; dibuat saat pertama kali dipakai.
export function getGuestId() {
  try {
    let id = localStorage.getItem(GUEST_ID_KEY);
    if (!id) {
      id =
        (typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `g_${Date.now()}_${Math.random().toString(36).slice(2)}`);
      localStorage.setItem(GUEST_ID_KEY, id);
    }
    return id;
  } catch {
    // localStorage diblokir (mode privat): fallback id per-load.
    return `g_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }
}

// Sisa sesi terakhir yang diketahui (mirror nilai server). Default penuh.
export function getGuestRemaining() {
  try {
    const raw = localStorage.getItem(GUEST_REMAINING_KEY);
    if (raw === null) return GUEST_FREE_LIMIT;
    const n = Number(raw);
    return Number.isFinite(n) ? n : GUEST_FREE_LIMIT;
  } catch {
    return GUEST_FREE_LIMIT;
  }
}

export function setGuestRemaining(n) {
  try {
    localStorage.setItem(GUEST_REMAINING_KEY, String(Math.max(0, n)));
  } catch {
    /* abaikan */
  }
}