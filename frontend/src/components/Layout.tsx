import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Briefcase, CheckSquare, Users, LogOut, Menu, X } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Projects', icon: Briefcase, path: '/projects' },
    { name: 'My Tasks', icon: CheckSquare, path: '/my-tasks' },
  ];

  if (user?.role === 'ADMIN') navItems.push({ name: 'Team', icon: Users, path: '/team' });

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="hidden md:flex flex-col w-64 bg-[#030303] border-r border-[#27272a]">
        <div className="p-6 mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2 tracking-tight">
            <div className="w-6 h-6 bg-white text-black flex items-center justify-center font-bold text-sm">E</div>
            Ethara
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors text-[13px] ${isActive ? 'bg-[#1a1a1a] text-white font-medium' : 'text-[#767d88] hover:bg-[#1a1a1a] hover:text-white'}`}>
                <item.icon size={16} />
                <span className="uppercase tracking-[0.05em] text-[11px] font-[450]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#27272a]">
          <div className="flex items-center gap-3 p-2 mb-2">
            <div className="w-8 h-8 rounded-md bg-[#1a1a1a] border border-[#27272a] flex items-center justify-center text-white font-[450] text-xs">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-[13px] text-white truncate">{user?.name}</p>
              <p className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88] truncate">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-[#767d88] hover:text-white hover:bg-[#1a1a1a] rounded-md transition-colors text-[11px] uppercase tracking-[0.35px]">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="md:hidden flex items-center justify-between p-4 bg-[#030303] border-b border-[#27272a]">
          <h1 className="text-xl font-bold tracking-tight">Ethara</h1>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[#767d88] hover:text-white">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-12 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
