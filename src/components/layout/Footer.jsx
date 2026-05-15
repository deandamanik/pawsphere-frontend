import logoPawsphere from '../../assets/Logo-Pawsphere.svg';
import { FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';
import { LuMapPin, LuPhone, LuMail } from 'react-icons/lu';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: 'Home', path: '/' },
    { name: 'AI Diagnosis', path: '/ai-diagnose' },
    { name: 'Vet Connect', path: '/vet-connect' },
    { name: 'Paw Alert', path: '/paw-alert' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Adoption Catalog', path: '/adoption' },
  ];

  return (
    <footer className="bg-brand-blue-dark text-white font-poppins pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="flex flex-col items-start">
            <Link to="/" className="mb-6">
              <img 
                src={logoPawsphere} 
                alt="Pawsphere Logo" 
                className="h-10 w-auto hover:scale-105 transition-transform origin-left"
              />
            </Link>
            <p className="text-white/80 text-sm leading-relaxed max-w-70 mb-8 font-medium">
              One connected space for pet health, rescue, and care. Connecting pet owners, veterinarians, shelters, and volunteers.
            </p>
            <div className="flex gap-4">
              {[FaInstagram, FaTwitter, FaFacebookF].map((Icon, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">Services</h4>
            <ul className="space-y-4">
              {services.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    className="text-white/70 hover:text-brand-orange transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">About Us</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/faq" className="text-white/70 hover:text-brand-orange transition-colors text-sm">
                  FaQ
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/70 hover:text-brand-orange transition-colors text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">Contact</h4>
            <div className="space-y-6 text-sm text-white/70">
              <div className="flex items-start gap-4">
                <LuMapPin className="shrink-0 mt-1 w-5 h-5 text-white" />
                <p className="leading-relaxed">
                  Jl. Kampus Bukit Jimbaran<br />
                  Computer Science Building, Bali
                </p>
              </div>
              <div className="flex items-center gap-4">
                <LuPhone className="shrink-0 w-5 h-5 text-white" />
                <p>+62 812-3456-7890</p>
              </div>
              <div className="flex items-center gap-4">
                <LuMail className="shrink-0 w-5 h-5 text-white" />
                <p>hello@pawsphere.id</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-white/50 text-[10px] tracking-widest uppercase font-medium">
            © {currentYear} PawSphere. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;