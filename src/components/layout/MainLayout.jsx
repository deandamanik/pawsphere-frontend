import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from '../ScrollToTop';
import { useAuth } from '../../context/AuthContext';

const MainLayout = () => {
  const { isAuthenticated, role, logout, user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Sembunyikan Footer saat berada di halaman /clinic atau /paw-alert
  const hideFooterPaths = ['/clinic', '/paw-alert'];
  const normalizedPathname = pathname.toLowerCase();
  const isClinicMap = normalizedPathname === '/clinic';
  const isFullScreenPage = isClinicMap || normalizedPathname.startsWith('/paw-alert');
  const shouldHideFooter = hideFooterPaths.some((path) =>
    normalizedPathname.startsWith(path)
  );

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className={
      isClinicMap
        ? 'flex flex-col h-dvh overflow-hidden'
        : isFullScreenPage
        ? 'flex flex-col min-h-screen overflow-hidden'
        : 'flex flex-col min-h-screen'
    }
    >
      <ScrollToTop />
      <Navbar
        isLoggedIn={isAuthenticated}
        role={role}
        user={user}
        handleLogout={handleLogout}
      />
      <main className={isFullScreenPage ? 'flex-1 flex flex-col min-h-0 overflow-hidden' : 'grow'}>
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default MainLayout;