import { useEffect, useState, useCallback } from "react";
import { LuPlus, LuTrash2, LuHeartHandshake, LuImagePlus, LuUsers } from "react-icons/lu";
import {
  getShelterCampaigns, createCampaign, updateCampaignStatus, deleteCampaign,
} from "../../services/donation.service";

const STATUS_META = {
  active: { label: "Aktif", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  closed: { label: "Ditutup", cls: "bg-slate-100 text-slate-600 border-slate-200" },
};

const URGENCY_LABEL = { normal: "Normal", mendesak: "Mendesak", kritis: "Kritis" };

const fileToResizedDataUrl = (file, max = 800) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const emptyForm = {
  title: "", description: "", target_amount: "", urgency: "normal",
  deadline_days: "", image_url: null,
};

export default function ShelterDonationPanel() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setCampaigns(await getShelterCampaigns());
    } catch {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const pickPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    try {
      setField("image_url", await fileToResizedDataUrl(file));
    } catch {
      alert("Gagal memproses gambar.");
    }
    e.target.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await createCampaign({
        title: form.title,
        description: form.description,
        target_amount: parseInt(form.target_amount, 10) || 0,
        urgency: form.urgency,
        deadline_days: form.deadline_days ? parseInt(form.deadline_days, 10) : undefined,
        image_url: form.image_url,
      });
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      alert(err.message || "Gagal membuat kampanye.");
    } finally {
      setSaving(false);
    }
  };

  const close = async (id) => {
    try {
      await updateCampaignStatus(id, "closed");
      load();
    } catch (err) {
      alert(err.message || "Gagal menutup kampanye.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Hapus kampanye ini?")) return;
    try {
      await deleteCampaign(id);
      load();
    } catch (err) {
      alert(err.message || "Gagal menghapus.");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-10 text-center text-slate-500">
        Memuat kampanye donasi...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <LuHeartHandshake className="w-5 h-5 text-brand-blue-normal" />
          <h2 className="text-lg font-bold text-slate-800">Kampanye Donasi ({campaigns.length})</h2>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 bg-brand-blue-dark hover:bg-brand-blue-normal text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <LuPlus className="w-4 h-4" />
          {showForm ? "Tutup" : "Buat Kampanye"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white rounded-2xl shadow-card border border-slate-100 p-5 mb-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 flex items-center gap-4">
            <div className="w-24 h-16 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
              {form.image_url ? (
                <img src={form.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <LuImagePlus className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <label className="text-sm font-semibold text-brand-blue-normal cursor-pointer hover:underline">
              Unggah Gambar Kampanye
              <input type="file" accept="image/*" onChange={pickPhoto} className="hidden" />
            </label>
          </div>

          <div className="sm:col-span-2">
            <Field label="Judul">
              <input required value={form.title} onChange={(e) => setField("title", e.target.value)} className={inp} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Deskripsi">
              <textarea rows={3} required value={form.description} onChange={(e) => setField("description", e.target.value)} className={inp + " resize-none"} />
            </Field>
          </div>
          <Field label="Target Dana (Rp)">
            <input required type="number" min="1000" value={form.target_amount} onChange={(e) => setField("target_amount", e.target.value)} className={inp} placeholder="contoh: 15000000" />
          </Field>
          <Field label="Tingkat Urgensi">
            <select value={form.urgency} onChange={(e) => setField("urgency", e.target.value)} className={inp}>
              <option value="normal">Normal</option>
              <option value="mendesak">Mendesak</option>
              <option value="kritis">Kritis</option>
            </select>
          </Field>
          <Field label="Durasi (hari)">
            <input type="number" min="1" max="365" value={form.deadline_days} onChange={(e) => setField("deadline_days", e.target.value)} className={inp} placeholder="contoh: 30" />
          </Field>
          <div className="flex items-end">
            <button type="submit" disabled={saving} className="bg-brand-blue-dark hover:bg-brand-blue-normal disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
              {saving ? "Menyimpan..." : "Simpan Kampanye"}
            </button>
          </div>
        </form>
      )}

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-8 text-center text-slate-500">
          Belum ada kampanye. Klik "Buat Kampanye" untuk memulai.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {campaigns.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden flex flex-col">
              <img src={c.image} alt="" className="h-36 w-full object-cover" />
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-slate-800 leading-snug">{c.title}</p>
                  <span className={"text-[11px] px-2 py-0.5 rounded-full border shrink-0 " + (STATUS_META[c.status]?.cls || "")}>
                    {STATUS_META[c.status]?.label || c.status}
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full">
                  <div className="h-2 rounded-full bg-brand-blue-normal" style={{ width: c.progress + "%" }} />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span><span className="font-bold text-brand-blue-normal">{c.collected}</span> / {c.target}</span>
                  <span className="flex items-center gap-1"><LuUsers className="w-3.5 h-3.5" /> {c.donors}</span>
                </div>
                <p className="text-[11px] text-slate-400">Urgensi: {URGENCY_LABEL[c.urgency?.toLowerCase()] || c.urgency} - {c.daysLeft} hari lagi</p>

                <div className="flex gap-2 mt-auto pt-2">
                  {c.status === "active" && (
                    <button onClick={() => close(c.id)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 rounded-lg">
                      Tutup Kampanye
                    </button>
                  )}
                  <button onClick={() => remove(c.id)} className="px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg">
                    <LuTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inp = "w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 outline-none focus:border-brand-blue-normal focus:bg-white transition-all";

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-700">{label}</label>
      {children}
    </div>
  );
}