import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, Mail, Building2 } from 'lucide-react';
import { api } from '../../services/api';

export default function Login() {
  const navigate = useNavigate();
  
  // Captura as credenciais mapeadas com o nosso backend
  const [tenantId, setTenantId] = useState('1'); // Padrão: Clínica Alfa ou Sorriso Perfeito
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        tenantId,
        email,
        password,
      });

      // Se a API nos devolver o token, salvamos no navegador e liberamos a entrada
      if (response.data?.access_token) {
        localStorage.setItem('@OdontoOffice:token', response.data.access_token);
        localStorage.setItem('@OdontoOffice:tenantId', tenantId);
        
        setIsLoading(false);
        navigate('/dashboard'); // Joga o dentista para dentro da fortaleza!
      } else {
        throw new Error('Authentication token not received.');
      }
    } catch (err: any) {
      setIsLoading(false);
      // Captura a mensagem de erro vinda diretamente do filtro do NestJS ou estouro de conexão
      const apiMessage = err.response?.data?.message;
      setError(
        typeof apiMessage === 'string' 
          ? apiMessage 
          : 'Invalid credentials or connection refused. Please check if backend is running.'
      );
    }
  };


  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white font-sans antialiased">
      
      {/* O Formulário de Autenticação Clean */}
      <div className="lg:col-span-5 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white">
        <div className="w-full max-w-md mx-auto space-y-8">
          
          {/* Logo / Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-deep-obsidian">
              <div className="p-2 bg-mint-clean/10 text-mint-clean rounded-xl">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-black tracking-wider uppercase">
                Odonto<span className="text-mint-clean">Office</span>
              </h2>
            </div>
            <h1 className="text-3xl font-extrabold text-deep-obsidian tracking-tight pt-4">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500">
              Insira as credenciais de segurança para acessar sua clínica.
            </p>
          </div>

          {/* Alerta de Erro */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Campo: Tenant ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={14} /> Clinic Token (Tenant ID)
              </label>
              <input
                type="number"
                required
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                placeholder="Ex: 1"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all duration-150"
              />
            </div>

            {/* Campo: Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Mail size={14} /> Corporate Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dr.anderson@sorrisoperfeito.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all duration-150"
              />
            </div>

            {/* Campo: Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Key size={14} /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all duration-150"
              />
            </div>

            {/* Botão de Envio (Mint Clean Button) */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-mint-clean text-deep-obsidian font-bold py-3.5 px-4 rounded-xl text-sm shadow-lg shadow-mint-clean/20 hover:shadow-xl hover:shadow-mint-clean/30 active:scale-[0.99] transition-all duration-150 flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? 'Authenticating access...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>

      {/* O Visual Premium High-Tech */}
      <div className="hidden lg:col-span-7 bg-deep-obsidian lg:flex flex-col justify-between p-12 relative overflow-hidden border-l border-slate-800">
        {/* Detalhe geométrico de fundo translúcido */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-mint-clean/5 rounded-full filter blur-3xl pointer-events-none" />
        
        {/* Top Tag */}
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-mint-clean animate-pulse" />
          System Operational & Secure
        </div>

        {/* Mensagem Central (Design Bento Box / Vercel style) */}
        <div className="max-w-xl space-y-4">
          <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            A nova era digital para clínicas odontológicas de alta performance.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Isolamento de dados multi-tenant, prontuário relacional eletrônico e automação completa de fluxo de caixa em uma única plataforma indestrutível.
          </p>
        </div>

        {/* Footer Comercial */}
        <div className="text-xs text-slate-500 font-medium">
          Powered by OdontoOffice SaaS © 2026 • All rights reserved.
        </div>
      </div>

    </div>
  );
}
