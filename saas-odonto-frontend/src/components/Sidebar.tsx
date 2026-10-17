import { LayoutDashboard, Users, Calendar, DollarSign, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Lista estática dos menus internos do nosso ecossistema SaaS
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Patients', path: '/dashboard/patients', icon: <Users size={20} /> },
    { name: 'Agenda', path: '/dashboard/agenda', icon: <Calendar size={20} /> },
    { name: 'Financial', path: '/dashboard/financial', icon: <DollarSign size={20} /> },
  ];

  // Limpa o cofre por completo e protege as chaves da clínica!
  const handleLogout = () => {
    // Apaga o token de acesso JWT
    localStorage.removeItem('@OdontoOffice:token');

    // Apaga o ID do Tenant para não deixar rastro de contexto de dados
    localStorage.removeItem('@OdontoOffice:tenantId');

    // Se você quiser limpar absolutamente tudo do app de uma vez (opção sênior mais rápida):
    // localStorage.clear();

    // Redireciona o usuário para a porta da fortaleza com segurança máxima
    navigate('/login');
  };


  return (
    <aside className="w-64 bg-deep-obsidian text-slate-300 flex flex-col min-h-screen border-r border-slate-800">
      {/* Brand / Logo */}
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-black text-white tracking-wider uppercase">
          Odonto<span className="text-mint-clean">Office</span>
        </h2>
        <span className="text-xs text-slate-500 font-medium">SaaS Platform v1.0</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${isActive
                  ? 'bg-mint-clean text-deep-obsidian font-bold shadow-lg shadow-mint-clean/20'
                  : 'hover:bg-slate-800 hover:text-white'
                }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout Section */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-150"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
