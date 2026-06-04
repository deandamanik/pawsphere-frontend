import { useState } from 'react';

const PetFormStage = ({ pet, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    nama: '', 
    email: '', 
    telepon: '', 
    alamat: '', 
    pengalaman: '', 
    alasan: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-poppins text-slate-800 pb-2">
      <div>
        <h3 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight wrap-break-word">Formulir Adopsi - {pet?.name}</h3>
        <p className="text-xs md:text-sm text-gray-400 mt-0.5 font-medium">Isi data diri untuk mengajukan permohonan adopsi</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 px-0.5">Nama Lengkap</label>
          <input 
            required 
            type="text" 
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-blue-normal transition-all placeholder:text-gray-300" 
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 px-0.5">No. Telepon</label>
          <input 
            required 
            type="tel" 
            inputMode="numeric"
            pattern="[0-9]*"
            name="telepon"
            value={formData.telepon}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-blue-normal transition-all placeholder:text-gray-300" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700 px-0.5">Email</label>
        <input 
          required 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-blue-normal transition-all placeholder:text-gray-300" 
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700 px-0.5">Alamat Lengkap</label>
        <input 
          required 
          type="text" 
          name="alamat"
          value={formData.alamat}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-blue-normal transition-all placeholder:text-gray-300" 
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700 px-0.5">Pengalaman merawat hewan</label>
        <input 
          required 
          type="text" 
          name="pengalaman"
          value={formData.pengalaman}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-blue-normal transition-all placeholder:text-gray-300" 
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700 px-0.5">Alasan adopsi</label>
        <textarea 
          rows={3} 
          required 
          name="alasan"
          value={formData.alasan}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-blue-normal transition-all resize-none placeholder:text-gray-400 font-medium leading-relaxed" 
          placeholder="Ceritakan alasan dan kesiapanmu..." 
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-4 mt-2">
        <button 
          type="button"
          onClick={onBack}
          className="flex-1 py-3 border border-gray-300 text-slate-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all active:scale-[0.98]"
        >
          Kembali
        </button>
        <button 
          type="submit"
          className="flex-1 py-3 bg-brand-blue-normal hover:bg-[#2e5d79] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-slate-900/5 active:scale-[0.98]"
        >
          Kirim Permohonan
        </button>
      </div>
    </form>
  );
};

export default PetFormStage;