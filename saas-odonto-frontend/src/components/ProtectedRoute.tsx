import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  //  Verifica se o token JWT real do login existe no navegador
  const token = localStorage.getItem('@OdontoOffice:token');

  // Se o cofre estiver vazio, barra o acesso e chuta o invasor para o /login!
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se o token existir, libera a renderização das páginas filhas da Dashboard
  return <Outlet />;
}
