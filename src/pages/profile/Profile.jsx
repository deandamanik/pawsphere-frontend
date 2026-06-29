import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LuUser,
  LuMail,
  LuPhone,
  LuShieldCheck,
  LuArrowLeft,
  LuCamera,
  LuTrash2,
  LuLock,
  LuKeyRound,
} from "react-icons/lu";
import { useAuth } from "../../context/AuthContext";
import { updateMe, changePassword } from "../../services/auth.service";
import { homeForRole } from "../../config/roles";

const ROLE_LABEL = {
  user: "Pemilik Hewan / Relawan",
  vet: "Dokter Hewan",
  shelter: "Pengelola Shelter",
  admin: "Administrator",
};

// Resize/compress an image File into a small JPEG data URL so it fits
// comfortably in the database and loads fast in the navbar.
const fileToResizedDataUrl = (file, max = 256) =>
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
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const Avatar = ({ src, name, size = "w-24 h-24", text = "text-3xl" }) =>
  src ? (
    <img
      src={src}
      alt={name}
      className={`${size} rounded-full object-cover border-4 border-white shadow-md`}
    />
  ) : (
    <div
      className={`${size} ${text} rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-white font-bold`}
    >
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );

const Profile = () => {
  const { user, role, updateUser } = useAuth();
  const fileRef = useRef(null);

  // Profile info
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [avatar, setAvatar] = useState(user?.avatarUrl || null);
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoMsg, setInfoMsg] = useState(null);

  // Password
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState(null);

  const dashboardPath = role && role !== "user" ? homeForRole(role) : null;

  const pickPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setInfoMsg({ type: "err", text: "File harus berupa gambar." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setInfoMsg({ type: "err", text: "Ukuran gambar maksimal 5 MB." });
      return;
    }
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      setAvatar(dataUrl);
      setInfoMsg(null);
    } catch {
      setInfoMsg({ type: "err", text: "Gagal memproses gambar." });
    }
    e.target.value = ""; // allow re-selecting the same file
  };

  const saveInfo = async (e) => {
    e.preventDefault();
    setInfoMsg(null);
    setSavingInfo(true);
    try {
      const updated = await updateMe({
        name: name.trim(),
        phone_number: phone.trim() || undefined,
        avatar_url: avatar, // data URL or null
      });
      updateUser(updated);
      setInfoMsg({ type: "ok", text: "Profil berhasil disimpan." });
    } catch (err) {
      setInfoMsg({ type: "err", text: err.message || "Gagal menyimpan profil." });
    } finally {
      setSavingInfo(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    if (newPw !== confirmPw) {
      setPwMsg({ type: "err", text: "Konfirmasi password baru tidak cocok." });
      return;
    }
    setSavingPw(true);
    try {
      await changePassword({ current_password: currentPw, new_password: newPw });
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setPwMsg({ type: "ok", text: "Password berhasil diubah." });
    } catch (err) {
      setPwMsg({ type: "err", text: err.message || "Gagal mengubah password." });
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="font-poppins bg-slate-50 min-h-[calc(100vh-4rem)] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-brand-blue-normal font-semibold hover:underline mb-5"
        >
          <LuArrowLeft className="w-4 h-4" />
          Kembali ke Home
        </Link>

        {/* ---- Card: account info ---- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden mb-6"
        >
          {/* Banner with avatar */}
          <div className="bg-brand-blue-dark px-6 py-8 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative shrink-0">
              <Avatar src={avatar} name={user?.name} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-brand-orange text-white flex items-center justify-center border-2 border-brand-blue-dark hover:opacity-90 transition-all cursor-pointer"
                title="Ganti foto"
              >
                <LuCamera className="w-4 h-4" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={pickPhoto}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left text-white">
              <h1 className="text-2xl font-bold leading-tight">{user?.name}</h1>
              <span className="inline-flex items-center gap-1.5 mt-2 text-xs bg-white/15 px-2.5 py-1 rounded-full">
                <LuShieldCheck className="w-3.5 h-3.5" />
                {ROLE_LABEL[role] || role}
              </span>
              {avatar && (
                <button
                  type="button"
                  onClick={() => setAvatar(null)}
                  className="flex items-center gap-1.5 mx-auto sm:mx-0 mt-3 text-xs text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  <LuTrash2 className="w-3.5 h-3.5" />
                  Hapus foto
                </button>
              )}
            </div>
          </div>

          <form onSubmit={saveInfo} className="p-6 flex flex-col gap-5">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wide">
              Informasi Akun
            </h2>

            {infoMsg && <Banner msg={infoMsg} />}

            <Field label="Nama Lengkap" icon={LuUser}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
                placeholder="Nama kamu"
              />
            </Field>

            <Field label="Email" icon={LuMail}>
              <input
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-sm text-slate-500 cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Email tidak dapat diubah.
              </p>
            </Field>

            <Field label="Nomor Handphone" icon={LuPhone}>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputCls}
                placeholder="08xxxxxxxxxx"
              />
            </Field>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={savingInfo}
                className={primaryBtn(savingInfo)}
              >
                {savingInfo ? "Menyimpan…" : "Simpan Perubahan"}
              </button>
              {dashboardPath && (
                <Link to={dashboardPath} className={secondaryBtn}>
                  Ke Dashboard
                </Link>
              )}
            </div>
          </form>
        </motion.div>

        {/* ---- Card: change password ---- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl shadow-card border border-slate-100 p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <LuLock className="w-4 h-4 text-brand-blue-normal" />
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wide">
              Ubah Password
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-5">
            Pastikan password baru minimal 6 karakter.
          </p>

          <form onSubmit={savePassword} className="flex flex-col gap-5">
            {pwMsg && <Banner msg={pwMsg} />}

            <Field label="Password Saat Ini" icon={LuKeyRound}>
              <input
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className={inputCls}
                placeholder="••••••••"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Password Baru" icon={LuLock}>
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className={inputCls}
                  placeholder="••••••••"
                />
              </Field>
              <Field label="Konfirmasi Password Baru" icon={LuLock}>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className={inputCls}
                  placeholder="••••••••"
                />
              </Field>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={savingPw}
                className={primaryBtn(savingPw)}
              >
                {savingPw ? "Menyimpan…" : "Ubah Password"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const inputCls =
  "w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 outline-none focus:border-brand-blue-normal focus:bg-white transition-all";

const primaryBtn = (loading) =>
  `px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${
    loading
      ? "bg-brand-blue-normal/60 cursor-not-allowed"
      : "bg-brand-blue-dark hover:bg-brand-blue-normal cursor-pointer"
  }`;

const secondaryBtn =
  "px-6 py-2.5 rounded-xl text-sm font-semibold border border-brand-blue-normal text-brand-blue-normal hover:bg-brand-blue-light transition-all";

const Banner = ({ msg }) => (
  <div
    className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
      msg.type === "ok"
        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
        : "bg-red-50 text-red-600 border border-red-200"
    }`}
  >
    {msg.text}
  </div>
);

const Field = ({ label, icon: Icon, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
      <Icon className="w-4 h-4 text-brand-blue-normal" />
      {label}
    </label>
    {children}
  </div>
);

export default Profile;