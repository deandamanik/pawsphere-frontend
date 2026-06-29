import { useEffect, useState, useCallback } from "react";
import {
  LuPlus, LuTrash2, LuPawPrint, LuInbox, LuImagePlus, LuCheck,
} from "react-icons/lu";
import {
  getShelterAnimals, createAnimal, updateAnimalStatus, deleteAnimal,
  getShelterApplications, updateApplicationStatus,
} from "../../services/adoption.service";

const ANIMAL_STATUS = {
  available: { label: "Tersedia", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pending: { label: "Proses", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  adopted: { label: "Diadopsi", cls: "bg-slate-100 text-slate-600 border-slate-200" },
};

const APP_FLOW = ["submitted", "review", "contacted", "survey", "done"];
const APP_LABEL = {
  submitted: "Masuk", review: "Ditinjau", contacted: "Dihubungi",
  survey: "Survei", done: "Selesai", rejected: "Ditolak",
};

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
  name: "", species: "Anjing", breed: "", age: "", gender: "Jantan",
  description: "", is_vaccinated: false, is_sterilized: false, image_url: null,
};

export default function ShelterAdoptionPanel() {
  const [animals, setAnimals] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const [a, ap] = await Promise.all([getShelterAnimals(), getShelterApplications()]);
      setAnimals(a);
      setApps(ap);
    } catch {
      setAnimals([]);
      setApps([]);
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
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    try {
      const url = await fileToResizedDataUrl(file);
      setField("image_url", url);
    } catch {
      alert("Gagal memproses gambar.");
    }
    e.target.value = "";
  };

  const submitAnimal = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await createAnimal(form);
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      alert(err.message || "Gagal menambah hewan.");
    } finally {
      setSaving(false);
    }
  };

  const setAnimalStatus = async (id, status) => {
    try {
      await updateAnimalStatus(id, status);
      load();
    } catch (err) {
      alert(err.message || "Gagal mengubah status.");
    }
  };

  const removeAnimal = async (id) => {
    if (!window.confirm("Hapus data hewan ini?")) return;
    try {
      await deleteAnimal(id);
      load();
    } catch (err) {
      alert(err.message || "Gagal menghapus.");
    }
  };

  const setAppStatus = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      load();
    } catch (err) {
      alert(err.message || "Gagal mengubah status.");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-10 text-center text-slate-500">
        Memuat data adopsi...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ---- Manage animals ---- */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <LuPawPrint className="w-5 h-5 text-brand-blue-normal" />
            <h2 className="text-lg font-bold text-slate-800">Hewan Adopsi ({animals.length})</h2>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 bg-brand-blue-dark hover:bg-brand-blue-normal text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <LuPlus className="w-4 h-4" />
            {showForm ? "Tutup" : "Tambah Hewan"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={submitAnimal} className="bg-white rounded-2xl shadow-card border border-slate-100 p-5 mb-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                {form.image_url ? (
                  <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <LuImagePlus className="w-7 h-7 text-slate-400" />
                )}
              </div>
              <label className="text-sm font-semibold text-brand-blue-normal cursor-pointer hover:underline">
                Unggah Foto
                <input type="file" accept="image/*" onChange={pickPhoto} className="hidden" />
              </label>
            </div>

            <Field label="Nama">
              <input required value={form.name} onChange={(e) => setField("name", e.target.value)} className={inp} />
            </Field>
            <Field label="Jenis">
              <select value={form.species} onChange={(e) => setField("species", e.target.value)} className={inp}>
                <option>Anjing</option>
                <option>Kucing</option>
                <option>Kelinci</option>
                <option>Lainnya</option>
              </select>
            </Field>
            <Field label="Ras">
              <input value={form.breed} onChange={(e) => setField("breed", e.target.value)} className={inp} />
            </Field>
            <Field label="Usia">
              <input value={form.age} onChange={(e) => setField("age", e.target.value)} placeholder="mis. 2 Tahun" className={inp} />
            </Field>
            <Field label="Kelamin">
              <select value={form.gender} onChange={(e) => setField("gender", e.target.value)} className={inp}>
                <option>Jantan</option>
                <option>Betina</option>
              </select>
            </Field>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.is_vaccinated} onChange={(e) => setField("is_vaccinated", e.target.checked)} />
                Vaksin
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.is_sterilized} onChange={(e) => setField("is_sterilized", e.target.checked)} />
                Steril
              </label>
            </div>
            <div className="sm:col-span-2">
              <Field label="Deskripsi">
                <textarea rows={2} value={form.description} onChange={(e) => setField("description", e.target.value)} className={inp + " resize-none"} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={saving} className="bg-brand-blue-dark hover:bg-brand-blue-normal disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
                {saving ? "Menyimpan..." : "Simpan Hewan"}
              </button>
            </div>
          </form>
        )}

        {animals.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-8 text-center text-slate-500">
            Belum ada hewan. Klik "Tambah Hewan" untuk memulai.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {animals.map((a) => (
              <div key={a.id} className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden flex flex-col">
                <img src={a.image} alt="" className="h-36 w-full object-cover" />
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-800">{a.name}</p>
                    <span className={"text-[11px] px-2 py-0.5 rounded-full border " + (ANIMAL_STATUS[a.adoption_status]?.cls || "")}>
                      {ANIMAL_STATUS[a.adoption_status]?.label || a.adoption_status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{a.type} - {a.breed} - {a.gender}</p>
                  <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    {a.adoption_status !== "adopted" ? (
                      <button onClick={() => setAnimalStatus(a.id, "adopted")} className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg">
                        <LuCheck className="w-3.5 h-3.5" /> Tandai Diadopsi
                      </button>
                    ) : (
                      <button onClick={() => setAnimalStatus(a.id, "available")} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 rounded-lg">
                        Jadikan Tersedia
                      </button>
                    )}
                    <button onClick={() => removeAnimal(a.id)} className="px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg">
                      <LuTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---- Applications ---- */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <LuInbox className="w-5 h-5 text-brand-blue-normal" />
          <h2 className="text-lg font-bold text-slate-800">Permohonan Adopsi ({apps.length})</h2>
        </div>

        {apps.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-8 text-center text-slate-500">
            Belum ada permohonan adopsi.
          </div>
        ) : (
          <div className="space-y-3">
            {apps.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl shadow-card border border-slate-100 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-slate-800">{app.full_name}</p>
                    <p className="text-xs text-slate-500">
                      Untuk: {app.animal?.name} ({app.animal?.type}) - {app.phone} - {app.email}
                    </p>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full border bg-brand-blue-light text-brand-blue-dark border-brand-blue-light-active">
                    {APP_LABEL[app.status] || app.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-2"><span className="font-semibold">Alamat:</span> {app.address}</p>
                {app.experience && <p className="text-sm text-slate-600"><span className="font-semibold">Pengalaman:</span> {app.experience}</p>}
                {app.reason && <p className="text-sm text-slate-600"><span className="font-semibold">Alasan:</span> {app.reason}</p>}

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="text-xs text-slate-400">Ubah status:</span>
                  {APP_FLOW.map((st) => (
                    <button
                      key={st}
                      onClick={() => setAppStatus(app.id, st)}
                      className={"text-xs px-2.5 py-1 rounded-lg border transition-colors " + (app.status === st ? "bg-brand-blue-normal text-white border-brand-blue-normal" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50")}
                    >
                      {APP_LABEL[st]}
                    </button>
                  ))}
                  <button
                    onClick={() => setAppStatus(app.id, "rejected")}
                    className={"text-xs px-2.5 py-1 rounded-lg border transition-colors " + (app.status === "rejected" ? "bg-red-600 text-white border-red-600" : "bg-white text-red-600 border-red-200 hover:bg-red-50")}
                  >
                    Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
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