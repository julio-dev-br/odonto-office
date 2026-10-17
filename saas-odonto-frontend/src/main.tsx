import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'

// Importações de Segurança, Layouts e Páginas
import Login from './pages/auth/Login'
import { ProtectedRoute } from './components/ProtectedRoute' 
import { DashboardLayout } from './layouts/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Patients from './pages/dashboard/Patients'
import Agenda from './pages/dashboard/Agenda'
import Financial from './pages/dashboard/Financial'

// Configuração do Roteador Sênior Protegido (Nested Protected Routes)
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    //  Qualquer rota interna abaixo exige o passaporte do token!
    element: <ProtectedRoute />, 
    children: [
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          {
            path: '', // Rota /dashboard
            element: <Overview />,
          },
          {
            path: 'patients', // Rota /dashboard/patients
            element: <Patients />,
          },
          {
            path: 'agenda', // Rota /dashboard/agenda
            element: <Agenda />,
          },
          {
            path: 'financial', // Rota /dashboard/financial
            element: <Financial />,
          },
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
    <RouterProvider router={router} />
  </StrictMode>,
)
