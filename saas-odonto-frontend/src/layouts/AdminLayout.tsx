import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, DollarSign, LogOut, ShieldCheck, ChevronRight } from 'lucide-react';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const user = JSON.parse(localStorage.getItem('@OdontoOffice:user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Menu exclusivo do Super Admin
  const menuItems = [
    { path: '/admin', name: 'Visão Geral', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/tenants', name: 'Clínicas (Clientes)', icon: <Building2 size={20} /> },
    { path: '/admin/financial', name: 'Financeiro SaaS', icon: <DollarSign size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      
      {/* SIDEBAR DO ADMIN */}
      <aside className={`bg-slate-900 text-slate-400 flex flex-col justify-between transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} shrink-0 border-r border-slate-800`}>
        <div>
          {/* Logo / Título */}
          <div className="h-20 flex items-center px-6 border-b border-slate-800/60">
            <div className="flex items-center gap-3 text-white overflow-hidden whitespace-nowrap">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
                <ShieldCheck size={24} />
              </div>
              {isSidebarOpen && (
                <div className="flex flex-col">
                  <span className="font-black tracking-wider uppercase text-sm">Super Admin</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Backoffice</span>
                </div>
              )}
            </div>
          </div>

          {/* Links de Navegação */}
          <nav className="p-4 space-y-2 mt-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-3 text-sm font-bold rounded-xl transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="shrink-0">{item.icon}</div>
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-slate-800/60">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 text-xs font-bold rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer whitespace-nowrap overflow-hidden"
          >
            <LogOut size={20} className="shrink-0" />
            {isSidebarOpen && <span>Sair do Backoffice</span>}
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER TOPO */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
              Sistema Principal <ChevronRight size={14} /> <span className="text-emerald-600">Painel Global</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user.name || 'Administrador'}</p>
              <p className="text-xs text-slate-500 font-medium">Acesso Total</p>
            </div>
            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold">
              {user.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* CONTEÚDO DA PÁGINA (Muda conforme a rota) */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}