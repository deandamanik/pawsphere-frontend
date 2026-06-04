import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/home/Home';
import Adoption from '../pages/adoption/Adoption';
import Login from '../pages/auth/Login';
import AiDiagnose from '../pages/ai-diagnose/AiDiagnose';
import Donation from '../pages/donation/Donation';
import VetConnect from '../pages/vet-connect/VetConnect';
import Register from '../pages/auth/Register';
import Marketplace from '../pages/marketplace/Marketplace';
import PawAlert from '../pages/paw-alert/Paw-alert';
import Keranjang from '../pages/marketplace/Keranjang';
import Pembayaran from '../pages/marketplace/Pembayaran';
import Selesai from '../pages/marketplace/Selesai';

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/adoption" element={<Adoption />} />
        <Route path="/ai-diagnose" element={<AiDiagnose />} /> 
        <Route path="/donation" element={<Donation />} />
        <Route path="/vet-connect" element={<VetConnect />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/paw-alert" element={<PawAlert />} />
        <Route path="/Keranjang" element={<Keranjang />} />
        <Route path="/Pembayaran" element={<Pembayaran />} />
        <Route path="/Selesai" element={<Selesai/>} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Group 3: Halaman 404 (Opsional) */}
      <Route path="*" element={<div className="flex items-center justify-center h-screen">404 - Halaman Tidak Ditemukan</div>} />
    </Routes>
  );
};

export default AppRouter; 