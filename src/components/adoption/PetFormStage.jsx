import { useState } from 'react';

const PetFormStage = ({ pet, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    nama: '', 
    email: '', 
    telepon: '', 
    alamat: '', 
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Formulir Adopsi - {pet.name}</h3>
        <p className="text-xs text-gray-400 mt-0.5">Isi data diri untuk mengajukan permohonan adopsi</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
          <input 
            required 
            type="text" 
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-blue-normal" 
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-700">No. Telepon</label>
          <input 
            required 
            type="tel" 
            name="telepon"
            value={formData.telepon}
            onChange={handleChange}
            className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-blue-normal" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-700">Email</label>
        <input 
          required 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-blue-normal" 
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-700">Alamat Lengkap</label>
        <input 
          required 
          type="text" 
          name="alamat"
          value={formData.alamat}
          onChange={handleChange}
          className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-blue-normal" 
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-700">Alasan / Pengalaman memelihara hewan</label>
        <textarea 
          rows={2} 
          required 
          name="alasan"
          value={formData.alasan}
          onChange={handleChange}
          className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-blue-normal resize-none" 
          placeholder="Ceritakan singkat pengalaman Anda..." 
        />
      </div>

      <div className="flex gap-3 mt-2">
        <button 
          type="button"
          onClick={onBack}
          className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-500 font-bold text-xs rounded-xl transition-colors"
        >
          Kembali
        </button>
        <button 
          type="submit"
          className="flex-1 py-2.5 bg-brand-blue-normal hover:bg-[#2e5d79] text-white font-bold text-xs rounded-xl transition-colors"
        >
          Kirim Permohonan
        </button>
      </div>
    </form>
  );
};

export default PetFormStage;