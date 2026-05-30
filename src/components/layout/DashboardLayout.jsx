import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Settings, LogOut, Menu, X, Languages } from 'lucide-react';
import logoImg from '../../assets/logo.jpg';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from 'react-i18next';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.toUpperCase();

  const toggleLanguage = () => {
    const nextLang = currentLang.startsWith("VI") ? "en" : "vi";
    i18n.changeLanguage(nextLang);
    localStorage.setItem('i18nextLng', nextLang);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: t('sidebar.dashboard'), icon: LayoutDashboard, path: '/dashboard' },
    { name: t('sidebar.my_events'), icon: Calendar, path: '/events' },
  ];

  return (
    <div className="flex h-screen bg-[#FDFBF7] font-sans overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#173846] text-white flex items-center justify-between px-4 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="DANAEventSpark" className="w-8 h-8 rounded object-cover" />
          <span className="text-lg font-bold tracking-wide">DANAEventSpark</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 focus:outline-none">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#173846] text-white flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div>
          {/* Logo */}
          <div className="p-6 flex items-center gap-3">
            <img src={logoImg} alt="DANAEventSpark Logo" className="w-10 h-10 rounded object-cover" />
            <span className="text-xl font-bold tracking-wide">DANAEventSpark</span>
          </div>

          {/* Menu */}
          <div className="px-4 py-2">
            <p className="text-xs text-gray-500 font-semibold mb-4 px-2 uppercase tracking-wider">{t('sidebar.menu')}</p>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-white/20 text-[#e96a52] font-medium border-l-4 border-[#e96a52]'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon size={20} className={isActive ? "text-[#e96a52]" : ""} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Account */}
          <div className="px-4 mt-8">
            <p className="text-xs text-gray-500 font-semibold mb-4 px-2 uppercase tracking-wider">{t('sidebar.account')}</p>
            <nav className="space-y-2">
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-white/80 hover:bg-white/10 hover:text-white text-left active:scale-95 cursor-pointer"
              >
                <Languages size={20} />
                <span>{currentLang}</span>
              </button>
              <Link
                to="/settings"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === '/settings'
                    ? 'bg-white/20 text-[#e96a52] font-medium border-l-4 border-[#e96a52]'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Settings size={20} />
                {t('sidebar.settings')}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-white/80 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <LogOut size={20} />
                {t('sidebar.logout')}
              </button>
            </nav>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-white/10 m-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#e96a52] text-white flex items-center justify-center font-bold text-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'O'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'Organizer'}</p>
            <p className="text-xs text-gray-400">Organizer</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 w-full">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
