import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Bell, Sun, Moon, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';

export function DashboardLayout() {
  const navigate = useNavigate();

  // ESTADOS DE INTERFACE: Controlam a abertura dos menus e a troca visual do tema
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true); // Controla a bolinha vermelha do sino

  const handleLogout = () => {
    localStorage.clear(); // Limpa as chaves e o token do cofre com segurança total
    navigate('/login');
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-soft-platinum text-deep-obsidian'}`}>

      {/*  Menu Lateral Fixo */}
      <Sidebar />

      {/*  Espaço de Conteúdo da Tela Selecionada */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">

        {/*  TOPBAR CORPORATIVA ATUALIZADA (Sininho + Dropdown + Tema) */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm relative z-50">

          {/* Lado Esquerdo: Contexto Ativo da Clínica */}
          <span className="text-sm font-medium text-gray-500">
            Active System Context • <span className="text-mint-clean font-semibold">Sorriso Perfeito Clinic</span>
          </span>

          {/* Lado Direito: Ações Globais de Controle */}
          <div className="flex items-center gap-6">

            {/*  BOTÃO DE TEMA (Sol e Lua HTML/CSS) */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-400 hover:text-deep-obsidian dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              title={isDarkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
            >
              {isDarkMode ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} />}
            </button>


            {/*  SININHO DE NOTIFICAÇÕES (Com Badge Ativa) */}
            <button
              onClick={() => setHasNotifications(false)} // Limpa a bolinha ao clicar
              className="p-2 text-gray-400 hover:text-deep-obsidian hover:bg-gray-50 rounded-xl transition-all relative cursor-pointer"
            >
              <Bell size={20} />
              {hasNotifications && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Separador sutil */}
            <div className="h-6 w-px bg-gray-200" />

            {/*  DROPDOWN DE PERFIL COM AVATAR DO CLIENTE */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 p-1.5 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
              >
                {/* Avatar Circular */}
                <div className="w-8 h-8 rounded-full bg-deep-obsidian text-white flex items-center justify-center font-bold text-xs border border-gray-200 shadow-sm">
                  AS
                </div>
                {/* Nome do Dentista e Seta */}
                <div className="hidden sm:flex flex-col items-start text-left">
                  <span className="text-xs font-bold text-deep-obsidian leading-none">Dr. Anderson</span>
                  <span className="text-[10px] text-gray-400 font-medium mt-0.5">Administrator</span>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Caixa Flutuante do Menu Dropdown (HTML/CSS) */}
              {isProfileOpen && (
                <>
                  {/* Backdrop invisível para fechar o menu ao clicar fora */}
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />

                  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-400 font-medium">Conectado como</p>
                      <p className="text-xs font-bold text-deep-obsidian truncate">anderson@sorrisoperfeito.com</p>
                    </div>

                    <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-deep-obsidian transition-colors text-left cursor-pointer">
                      <User size={14} className="text-gray-400" /> Meu Perfil
                    </button>

                    <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-deep-obsidian transition-colors text-left cursor-pointer">
                      <Settings size={14} className="text-gray-400" /> Configurações
                    </button>

                    <div className="border-t border-gray-50 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-b-xl transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={14} /> Sair do Sistema
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </header>

        {/*  Conteúdo dinâmico das páginas */}
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
