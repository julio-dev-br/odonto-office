import { Navigate, Outlet } from 'react-router-dom';

export function SuperAdminRoute() {
  // Pega o token e o usuário salvos no login
  const token = localStorage.getItem('@OdontoOffice:token');
  const userStr = localStorage.getItem('@OdontoOffice:user');
  
  // Se não houver token ou usuário, volta pro login
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  // 🛡️ A MÁGICA ACONTECE AQUI: Se a role não for SUPER_ADMIN, bloqueia o acesso
  if (user.role !== 'SUPER_ADMIN') {
    // Se for um dentista comum tentando acessar /admin, manda ele de volta pro dashboard dele
    return <Navigate to="/dashboard" replace />;
  }

  // Se for Super Admin, permite que a rota filha (o Dashboard Admin) carregue
  return <Outlet />;
}