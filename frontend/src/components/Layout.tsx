import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  Users, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Projects', icon: Briefcase, path: '/projects' },
    { name: 'My Tasks', icon: CheckSquare, path: '/my-tasks' },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ name: 'Team', icon: Users, path: '/team' });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-600 flex items-center gap-2">
            <Briefcase /> EtharaPM
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header - Mobile */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
          <h1 className="text-xl font-bold text-primary-600">EtharaPM</h1>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-white">
          <div className="p-4 flex justify-between items-center border-b">
            <h1 className="text-xl font-bold text-primary-600">EtharaPM</h1>
            <button onClick={() => setIsMobileMenuOpen(false)}><X /></button>
          </div>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-4 rounded-xl text-slate-700 font-medium active:bg-primary-50"
              >
                <item.icon size={24} />
                {item.name}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-4 text-red-600 font-medium"
            >
              <LogOut size={24} />
              Logout
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Layout;
