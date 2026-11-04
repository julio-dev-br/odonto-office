import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Building2, Users, DollarSign, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await api.get('/admin/stats');
        setData(response.data);
      } catch (error) {
        toast.error('Erro ao carregar as métricas do sistema.');
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) return null;

  const { metrics, tenants } = data;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Visão Geral do SaaS</h1>
        <p className="text-sm text-slate-500 mt-1">Acompanhe o crescimento e a saúde financeira do OdontoOffice.</p>
      </div>

      {/* Cartões de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total de Clínicas */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Building2 size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Total de Clínicas</p>
            <h2 className="text-3xl font-black text-slate-900">{metrics.totalTenants}</h2>
          </div>
        </div>

        {/* Clínicas Ativas */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Clínicas Ativas</p>
            <h2 className="text-3xl font-black text-slate-900">{metrics.activeTenants}</h2>
          </div>
        </div>

        {/* Faturamento MRR */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Faturamento Estimado (MRR)</p>
            <h2 className="text-3xl font-black text-slate-900">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.mrr)}
            </h2>
          </div>
        </div>

      </div>

      {/* Tabela de Clientes */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Clínicas Cadastradas</h3>
          <p className="text-sm text-slate-500">Lista de todos os clientes do sistema.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Clínica</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Plano</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Usuários</th>
                <th className="px-6 py-4 text-center">Pacientes</th>
                <th className="px-6 py-4">Data de Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {tenants.map((tenant: any) => (
                <tr key={tenant.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{tenant.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{tenant.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                      tenant.plan.toLowerCase() === 'platinum' ? 'bg-purple-100 text-purple-700' : 
                      tenant.plan.toLowerCase() === 'pro' ? 'bg-blue-100 text-blue-700' : 
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {tenant.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                      tenant.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${tenant.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {tenant.status === 'active' ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-medium">
                    <div className="flex items-center justify-center gap-1 text-slate-500">
                      <Users size={14} /> {tenant._count.users}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-medium">
                    {tenant._count.patients}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(tenant.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
              
              {tenants.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    Nenhuma clínica cadastrada ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}