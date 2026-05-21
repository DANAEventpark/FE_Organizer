import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, PlusSquare, Settings, LogOut } from 'lucide-react';
import logoImg from '../../assets/logo.jpg';
import { useAuthStore } from '../../store/authStore';

const DashboardLayout = ({ children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Sự kiện của tôi', icon: Calendar, path: '/events' },
    { name: 'Tạo sự kiện', icon: PlusSquare, path: '/events/create' },
  ];

  return (
    <div className="flex h-screen bg-[#FDFBF7] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#173846] text-white flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="p-6 flex items-center gap-3">
            <img src={logoImg} alt="DANAEventSpark Logo" className="w-10 h-10 rounded object-cover" />
            <span className="text-xl font-bold tracking-wide">DANAEventSpark</span>
          </div>

          {/* Menu */}
          <div className="px-4 py-2">
            <p className="text-xs text-gray-500 font-semibold mb-4 px-2 uppercase tracking-wider">Menu</p>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
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
            <p className="text-xs text-gray-500 font-semibold mb-4 px-2 uppercase tracking-wider">Tài khoản</p>
            <nav className="space-y-2">
              <Link
                to="/settings"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === '/settings'
                    ? 'bg-white/20 text-[#e96a52] font-medium border-l-4 border-[#e96a52]'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Settings size={20} />
                Cài đặt
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-white/80 hover:bg-white/10 hover:text-white"
              >
                <LogOut size={20} />
                Đăng xuất
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
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
