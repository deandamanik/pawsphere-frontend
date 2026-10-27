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
  const shouldHideFooter = hideFooterPaths.some((path) =>
    pathname.toLowerCase().startsWith(path)
  );

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar
        isLoggedIn={isAuthenticated}
        role={role}
        user={user}
        handleLogout={handleLogout}
      />
      <main className="grow">
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default MainLayout;