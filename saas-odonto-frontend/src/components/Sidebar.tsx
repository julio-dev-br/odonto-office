import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  FileText,
  LogOut,
  Shield,
  SettingsIcon
} from 'lucide-react';

export function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/dashboard/patients', name: 'Pacientes', icon: <Users size={20} /> },
    { path: '/dashboard/agenda', name: 'Agenda', icon: <Calendar size={20} /> },
    { path: '/dashboard/anamnese', name: 'Anamnese', icon: <FileText size={20} /> },
    { path: '/dashboard/financial', name: 'Financeiro', icon: <DollarSign size={20} /> },
    { path: '/dashboard/settings', name: 'Settings', icon: <SettingsIcon size={20} /> },

  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-deep-obsidian h-screen text-slate-400 flex flex-col justify-between border-r border-slate-800 shrink-0 font-sans">

      {/* Topo / Logo da Plataforma */}
      <div className="p-6">
        <div className="flex items-center gap-2 text-white">
          <div className="p-2 bg-mint-clean/10 text-mint-clean rounded-xl">
            <Shield size={20} />
          </div>
          <h2 className="text-lg font-black tracking-wider uppercase">
            Odonto<span className="text-mint-clean">Office</span>
          </h2>

        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4 mt-4">
          <span>SaaS Plataforma v1.0</span>
        </div>

        {/* Links de Rota Dinâmicos */}
        <nav className="mt-8 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-150 ${isActive
                  ? 'bg-mint-clean text-deep-obsidian shadow-lg shadow-mint-clean/10'
                  : 'hover:bg-slate-800/50 hover:text-white'
                  }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Rodapé / Botão de Logout Corporativo */}
      <div className="p-6 border-t border-slate-800/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
