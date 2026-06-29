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

import ProtectedRoute from './ProtectedRoute';
import VetDashboard from '../pages/dashboard/VetDashboard';
import ShelterDashboard from '../pages/dashboard/ShelterDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import Profile from '../pages/profile/Profile';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public app (shared navbar + footer) */}
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
        <Route path="/Selesai" element={<Selesai />} />

        {/* Any logged-in user (all roles) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Auth pages (no navbar/footer) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Role-restricted dashboards. Each guard allows exactly one role;
          a logged-in user with the wrong role is redirected to their own
          home, and a guest is sent to /login. */}
      <Route element={<ProtectedRoute allow={['vet']} />}>
        <Route path="/dashboard/vet" element={<VetDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allow={['shelter']} />}>
        <Route path="/dashboard/shelter" element={<ShelterDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allow={['admin']} />}>
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div className="flex items-center justify-center h-screen">404 - Halaman Tidak Ditemukan</div>} />
    </Routes>
  );
};

export default AppRouter;