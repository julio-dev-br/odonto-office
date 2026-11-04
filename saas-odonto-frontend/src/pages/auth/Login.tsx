import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Key, Mail, Building2 } from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

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

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: Number(tenantId),
          email,
          password
        })
      });

      // 🚀 AQUI ESTÁ A DECLARAÇÃO DA VARIÁVEL DATA
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Credenciais inválidas.');
      }

      // Salvando no localStorage
      localStorage.setItem('@OdontoOffice:token', data.access_token);

      // 🚀 Como o Super Admin pode não ter um tenantId fixo, só salvamos se ele existir
      if (data.user.tenantId) {
        localStorage.setItem('@OdontoOffice:tenantId', data.user.tenantId);
      }

      localStorage.setItem('@OdontoOffice:user', JSON.stringify(data.user));

      toast.success('Login realizado com sucesso!');

      // 🚀 Redirecionamento Inteligente baseado na Role
      if (data.user.role === 'SUPER_ADMIN') {
        navigate('/admin'); // Se for você, vai para o Backoffice
      } else {
        navigate('/dashboard'); // Se for o dentista, vai para a clínica
      }

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white font-sans antialiased">

      {/* O Formulário de Autenticação Clean */}
      <div className="lg:col-span-5 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white">
        <div className="w-full max-w-md mx-auto space-y-8">

          {/* Logo Link para Home */}
          <Link to="/" className="inline-flex items-center gap-2 mb-10 transition-opacity hover:opacity-80 cursor-pointer">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Odonto<span className="text-emerald-500">Office</span>
            </span>
          </Link>

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

            <div className="mt-8 flex flex-col items-center gap-4 text-sm text-slate-500 font-medium">
              <p>
                Ainda não tem uma conta?{' '}
                <Link to="/register" className="text-emerald-600 font-bold hover:underline transition-all">
                  Cadastre sua clínica
                </Link>
              </p>

              {/* 🚀 Novo link para voltar à Landing Page */}
              <Link
                to="/"
                className="text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar para a página inicial
              </Link>
            </div>
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
