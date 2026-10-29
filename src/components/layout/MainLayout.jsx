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
  const isFullScreenMap = hideFooterPaths.some((path) =>
    pathname.toLowerCase().startsWith(path)
  );
  const isClinicPage = pathname.toLowerCase().startsWith('/clinic');

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className={
      isClinicPage
        ? 'flex flex-col h-dvh overflow-hidden'
        : isFullScreenMap
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
      <main className={isFullScreenMap ? 'flex-1 flex flex-col min-h-0 overflow-hidden' : 'grow'}>
        <Outlet />
      </main>
      {!isFullScreenMap && <Footer />}
    </div>
  );
};

export default MainLayout;