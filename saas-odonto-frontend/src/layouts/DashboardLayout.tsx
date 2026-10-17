import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-soft-platinum">
      {/*  Menu Lateral Fixo */}
      <Sidebar />

      {/*  Espaço de Conteúdo da Tela Selecionada */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
          <span className="text-sm font-medium text-gray-500">
            Active System Context • <span className="text-mint-clean font-semibold">Sorriso Perfeito Clinic</span>
          </span>
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-xs text-deep-obsidian">
            AS
          </div>
        </header>

        {/*  Aqui o miolo de cada página interna será injetado dinamicamente! */}
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
