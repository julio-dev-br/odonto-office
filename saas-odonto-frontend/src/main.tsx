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
import Financial from './pages/dashboard/Financial'


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
        element: <Patients />, 
      },

      {
        path: 'agenda', // Vira /dashboard/agenda
        element: <Agenda />,
      },
      {
        path: 'financial', // Vira /dashboard/financial
        element: <Financial />,
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
