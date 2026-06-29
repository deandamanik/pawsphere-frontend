import { useState } from "react";
import { motion } from "framer-motion";
import { LuPlus, LuX, LuStethoscope } from "react-icons/lu";

const ANIMAL_CHIPS = ["Anjing", "Kucing", "Kelinci", "Burung", "Hamster"];
const COMMON_SYMPTOMS = [
  "Muntah",
  "Diare",
  "Lemas",
  "Tidak mau makan",
  "Demam",
  "Batuk",
  "Luka",
  "Gatal-gatal",
  "Kejang",
  "Sesak napas",
];

// Self-contained intake form. Calls onSubmit(payload) with snake_case keys
// matching the backend. Parent controls `submitting` and `error`.
const TriageForm = ({ onSubmit, submitting, error }) => {
  const [animalType, setAnimalType] = useState("");
  const [age, setAge] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [symptomInput, setSymptomInput] = useState("");
  const [duration, setDuration] = useState("");
  const [additional, setAdditional] = useState("");
  const [localError, setLocalError] = useState("");

  const toggleSymptom = (s) => {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const addCustomSymptom = () => {
    const s = symptomInput.trim();
    if (!s) return;
    if (!symptoms.includes(s)) setSymptoms((prev) => [...prev, s]);
    setSymptomInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!animalType.trim()) return setLocalError("Jenis hewan wajib diisi.");
    if (!age.trim()) return setLocalError("Usia hewan wajib diisi.");
    if (symptoms.length === 0)
      return setLocalError("Pilih atau tambahkan minimal satu gejala.");
    if (!duration.trim()) return setLocalError("Durasi gejala wajib diisi.");

    onSubmit({
      animal_type: animalType.trim(),
      age: age.trim(),
      symptoms,
      duration: duration.trim(),
      additional_condition: additional.trim() || undefined,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 max-w-2xl mx-auto w-full py-2"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-blue-normal flex items-center justify-center shrink-0">
          <LuStethoscope className="text-white w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
            Ceritakan kondisi hewanmu
          </h2>
          <p className="text-xs text-slate-500">
            Isi data berikut, AI akan memberi triase awal & pertolongan pertama.
          </p>
        </div>
      </div>

      {(localError || error) && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600 font-medium">
          {localError || error}
        </div>
      )}

      {/* Jenis hewan */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700">Jenis Hewan</label>
        <div className="flex flex-wrap gap-2">
          {ANIMAL_CHIPS.map((a) => (
            <button
              type="button"
              key={a}
              onClick={() => setAnimalType(a)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                animalType === a
                  ? "bg-brand-blue-normal text-white border-brand-blue-normal"
                  : "border-slate-200 text-slate-600 hover:border-brand-blue-normal"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
        <input
          value={animalType}
          onChange={(e) => setAnimalType(e.target.value)}
          placeholder="atau ketik jenis lain…"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 outline-none focus:border-brand-blue-normal focus:bg-white transition-all"
        />
      </div>

      {/* Usia + Durasi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">Usia Hewan</label>
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="contoh: 2 tahun / 3 bulan"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 outline-none focus:border-brand-blue-normal focus:bg-white transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">Durasi Gejala</label>
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="contoh: 2 hari / sejak pagi"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 outline-none focus:border-brand-blue-normal focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Gejala */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700">Gejala</label>
        <div className="flex flex-wrap gap-2">
          {COMMON_SYMPTOMS.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => toggleSymptom(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                symptoms.includes(s)
                  ? "bg-brand-blue-light text-brand-blue-dark border-brand-blue-normal font-semibold"
                  : "border-slate-200 text-slate-600 hover:border-brand-blue-normal"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-1">
          <input
            value={symptomInput}
            onChange={(e) => setSymptomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomSymptom();
              }
            }}
            placeholder="tambah gejala lain…"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 outline-none focus:border-brand-blue-normal focus:bg-white transition-all"
          />
          <button
            type="button"
            onClick={addCustomSymptom}
            className="w-10 h-10 rounded-xl bg-brand-blue-normal text-white flex items-center justify-center hover:bg-brand-blue-normal-hover transition-colors shrink-0 cursor-pointer"
          >
            <LuPlus className="w-4 h-4" />
          </button>
        </div>

        {symptoms.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {symptoms.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-brand-blue-normal text-white"
              >
                {s}
                <button
                  type="button"
                  onClick={() => toggleSymptom(s)}
                  className="hover:text-white/70 cursor-pointer"
                >
                  <LuX className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Kondisi tambahan */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700">
          Kondisi Tambahan <span className="text-slate-400 font-normal">(opsional)</span>
        </label>
        <textarea
          value={additional}
          onChange={(e) => setAdditional(e.target.value)}
          rows={3}
          placeholder="riwayat, perubahan perilaku, atau detail lain…"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 outline-none focus:border-brand-blue-normal focus:bg-white transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full py-3 rounded-xl text-sm font-semibold text-white transition-all ${
          submitting
            ? "bg-brand-blue-normal/60 cursor-not-allowed"
            : "bg-brand-blue-dark hover:bg-brand-blue-normal cursor-pointer"
        }`}
      >
        {submitting ? "Menganalisa…" : "Analisa Gejala"}
      </button>
    </motion.form>
  );
};

export default TriageForm;