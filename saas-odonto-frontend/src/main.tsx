import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast' // 🚀 Novo container de alertas premium!
import './index.css'

// Importações de Segurança, Layouts e Páginas
import Login from './pages/auth/Login'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DashboardLayout } from './layouts/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Patients from './pages/dashboard/Patients'
import Agenda from './pages/dashboard/Agenda'
import Financial from './pages/dashboard/Financial'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
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
        
        // Configurações reativas específicas para cada gatilho clínico
        success: {
          iconTheme: {
            primary: '#10B981', // Verde Mint Clean brilhante no ícone nativo
            secondary: '#FFFFFF',
          },
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#0F172A', // Texto em Deep Obsidian no modo claro
            borderColor: '#E2E8F0',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444', // Vermelho cirúrgico nos alertas
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
    <RouterProvider router={router} />
  </StrictMode>,
)
