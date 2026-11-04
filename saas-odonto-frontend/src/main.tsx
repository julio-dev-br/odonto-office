import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import MySite from './pages/dashboard/MySite';
import PublicSite from './pages/PublicSite'; // 🚀 1. Importação da Vitrine

import './index.css'

// Importações de Segurança, Layouts e Páginas
import LandingPage from './pages/LandingPage'
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DashboardLayout } from './layouts/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Patients from './pages/dashboard/Patients'
import Agenda from './pages/dashboard/Agenda'
import Financial from './pages/dashboard/Financial'
import Anamnese from './pages/dashboard/Anamnese'
import Settings from './pages/dashboard/Settings';
import ReceptionQueue from './pages/dashboard/ReceptionQueue'
import DentistPanel from './pages/dashboard/DentistPanel'

// 🚀 NOVAS IMPORTAÇÕES DO ADMIN
import { SuperAdminRoute } from './components/SuperAdminRoute';
import { AdminLayout } from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';

// 🚀 2. Lógica de detecção de subdomínio
const hostname = window.location.hostname;
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
const isRootDomain = hostname === 'odontooffice.com.br' || hostname === 'www.odontooffice.com.br';
// Se não for localhost e não for o domínio raiz, é um subdomínio
const isSubdomain = !isLocalhost && !isRootDomain;

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/terms',
    element: <Terms />,
  },
  {
    path: '/privacy',
    element: <Privacy />,
  },
  {
    element: <SuperAdminRoute />, // O Guard que verifica se é SUPER_ADMIN
    children: [
      {
        path: '/admin',
        element: <AdminLayout />, // O Layout escuro exclusivo do Admin
        children: [
          { path: '', element: <AdminDashboard /> }, // A tela de Visão Geral
          // Futuramente, você adicionará as outras telas aqui:
          // { path: 'tenants', element: <AdminTenants /> },
          // { path: 'financial', element: <AdminFinancial /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          { path: '', element: <Overview /> },
          { path: 'patients', element: <Patients /> },
          { path: 'agenda', element: <Agenda /> },
          { path: 'financial', element: <Financial /> },
          { path: 'anamnese', element: <Anamnese />, },
          { path: 'settings', element: <Settings /> },
          { path: 'queue', element: <ReceptionQueue /> },
          { path: 'dentist-panel', element: <DentistPanel /> },
          { path: 'my-site', element: <MySite /> }
        ],
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
    {/* O Toaster gerencia os balões de notificação de forma invisível */}
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        className: 'font-sans text-xs font-bold rounded-2xl border transition-all duration-300 shadow-2xl backdrop-blur-md px-4 py-3 flex items-center gap-2',

        success: {
          iconTheme: {
            primary: '#10B981',
            secondary: '#FFFFFF',
          },
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#0F172A',
            borderColor: '#E2E8F0',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FFFFFF',
          },
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#0F172A',
            borderColor: '#FEE2E2',
          },
        },
      }}
    />

    {/* 🚀 3. Renderização Condicional */}
    {isSubdomain ? (
      <PublicSite /> // Renderiza a vitrine do paciente
    ) : (
      <RouterProvider router={router} /> // Renderiza o sistema completo (Landing, Login, Dashboard)
    )}
  </StrictMode>,
)