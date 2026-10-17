import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'

// Importações de Layouts e Páginas
import Login from './pages/auth/Login'
import { DashboardLayout } from './layouts/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Patients from './pages/dashboard/Patients'
import Agenda from './pages/dashboard/Agenda'

// Rascunhos rápidos para as novas abas que criamos na sidebar
// const PatientsPlaceholder = () => <div className="text-2xl font-bold text-deep-obsidian">Patients Management Module</div>;
// const AgendaPlaceholder = () => <div className="text-2xl font-bold text-deep-obsidian">Clinical Schedule Agenda</div>;
const FinancialPlaceholder = () => <div className="text-2xl font-bold text-deep-obsidian">Cash Flow & Financial Ledger</div>;

// Configuração das Rotas com Layout Aninhado (Nested Routes)
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />, // O layout abraça todas as rotas internas abaixo!
    children: [
      {
        path: '', // Rota padrão /dashboard
        element: <Overview />,
      },
      {
        path: 'patients', // Vira /dashboard/patients
        element: <Patients />, // 👈 Trocado para o componente real!
      },

      {
        path: 'agenda', // Vira /dashboard/agenda
        element: <Agenda />,
      },
      {
        path: 'financial', // Vira /dashboard/financial
        element: <FinancialPlaceholder />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
