import axios from 'axios';

// Conecta diretamente na porta do nosso backend NestJS local
export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Injeta as credenciais de segurança em cada requisição de forma invisível
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@OdontoOffice:token');
  const tenantId = localStorage.getItem('@OdontoOffice:tenantId') || '1'; // Fallback seguro para a clínica 1

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Carimba o ID da clínica para o isolamento Multi-Tenant do banco de dados!
  config.headers['x-tenant-id'] = tenantId;

  return config;
});
