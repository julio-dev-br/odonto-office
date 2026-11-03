import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Settings as SettingsIcon, Users, Shield, Building, Key, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import { UserManagementForm } from '../../components/UserManagementForm';
import { ProcedureForm } from '../../components/ProcedureForm';

const profileSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
});

const clinicSchema = z.object({
  name: z.string().min(3, 'O nome da clínica deve ter pelo menos 3 caracteres'),
  plan: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type ClinicFormData = z.infer<typeof clinicSchema>;

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'procedures' | 'system'>('profile');
  const [isLoading, setIsLoading] = useState(true);
  const tenantIdHeader = localStorage.getItem('@OdontoOffice:tenantId') || '1';

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const {
    register: registerClinic,
    handleSubmit: handleSubmitClinic,
    reset: resetClinic,
    watch: watchClinic,
    formState: { errors: clinicErrors, isSubmitting: isClinicSubmitting },
  } = useForm<ClinicFormData>({
    resolver: zodResolver(clinicSchema),
  });

  const watchPlan = watchClinic('plan') || 'starter';

  const loadSettingsData = async () => {
    try {
      setIsLoading(true);
      const [profileRes, clinicRes] = await Promise.all([
        api.get('/auth/me', {
          headers: { 'x-tenant-id': tenantIdHeader }
        }),
        api.get('/tenants/current', {
          headers: { 'x-tenant-id': tenantIdHeader }
        }),
      ]);

      resetProfile({
        name: profileRes.data.name,
        email: profileRes.data.email,
      });

      resetClinic({
        name: clinicRes.data.name,
        plan: clinicRes.data.plan,
      });
    } catch (err) {
      console.error('Erro ao carregar dados de configuração:', err);
      toast.error('Não foi possível carregar as configurações do banco.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettingsData();
  }, []);

  const handleUpdateProfile = async (data: ProfileFormData) => {
    try {
      await api.put('/auth/profile', data, {
        headers: { 'x-tenant-id': tenantIdHeader } 
      });
      toast.success('Perfil atualizado com sucesso no cofre digital!');
      await loadSettingsData();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar informações do perfil.');
    }
  };

  const handleUpdateSystem = async (data: ClinicFormData) => {
    try {
      await api.put('/tenants/settings', data, {
        headers: { 'x-tenant-id': tenantIdHeader } 
      });
      toast.success('Configurações do consultório salvas com sucesso!');
      await loadSettingsData();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar os parâmetros da clínica.');
    }
  };


  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-deep-obsidian tracking-tight flex items-center gap-3">
          <SettingsIcon className="text-dentistry-teal" size={32} /> Configurações do Sistema
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie seu perfil pessoal, gerencie contas da equipe e configure os parâmetros clínicos e de procedimentos.
        </p>
      </div>

      {/* NAVEGAÇÃO POR ABAS PREMIUM (Tabs) */}
      <div className="flex border-b border-gray-100 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'profile' ? 'border-dentistry-teal text-dentistry-teal bg-gray-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
        >
          <User size={16} /> Meu Perfil
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'team' ? 'border-dentistry-teal text-dentistry-teal bg-gray-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
        >
          <Users size={16} /> Gestão da Equipe
        </button>

        <button
          onClick={() => setActiveTab('procedures')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'procedures' ? 'border-dentistry-teal text-dentistry-teal bg-gray-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
        >
          <Sparkles size={16} /> Catálogo de Procedimentos
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'system' ? 'border-dentistry-teal text-dentistry-teal bg-gray-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
        >
          <Building size={16} /> Dados do Consultório
        </button>
      </div>

      {/* RENDERIZAÇÃO CONDICIONAL */}
      <div className="space-y-6">

        {isLoading ? (
          <div className="p-12 text-center text-sm text-gray-400 font-medium animate-pulse">
            Carregando parâmetros de configuração do banco...
          </div>
        ) : (
          <>
            {/* ABA 1: MEU PERFIL */}
            {activeTab === 'profile' && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm max-w-2xl">
                <h3 className="text-base font-bold text-deep-obsidian mb-4 flex items-center gap-2">
                  <Key size={18} className="text-dentistry-teal" /> Informações Pessoais de Segurança
                </h3>
                <form onSubmit={handleSubmitProfile(handleUpdateProfile)} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Seu Nome Profissional</label>
                    <input
                      type="text"
                      {...registerProfile('name')}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-dentistry-teal focus:bg-white transition-all"
                    />
                    {profileErrors.name && <p className="text-xs text-rose-500 font-semibold">{profileErrors.name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Vinculado</label>
                    <input
                      type="email"
                      {...registerProfile('email')}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-dentistry-teal focus:bg-white transition-all font-mono"
                    />
                    {profileErrors.email && <p className="text-xs text-rose-500 font-semibold">{profileErrors.email.message}</p>}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isProfileSubmitting}
                      className="bg-dentistry-teal text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isProfileSubmitting ? 'Salvando...' : 'Salvar Meu Perfil'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ABA 2: GESTÃO DA EQUIPE */}
            {activeTab === 'team' && <UserManagementForm />}

            {/* ABA 3: PROCEDIMENTOS CLÍNICOS */}
            {activeTab === 'procedures' && <ProcedureForm />}

            {/* ABA 4: DADOS DO CONSULTÓRIO */}
            {activeTab === 'system' && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm max-w-2xl">
                <h3 className="text-base font-bold text-deep-obsidian mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-dentistry-teal" /> Parâmetros Corporativos Multi-Tenant
                </h3>
                <form onSubmit={handleSubmitClinic(handleUpdateSystem)} className="space-y-4">


                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome Comercial da Clínica</label>
                    <input
                      type="text"
                      {...registerClinic('name')}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-dentistry-teal focus:bg-white transition-all"
                    />
                    {clinicErrors.name && <p className="text-xs text-rose-500 font-semibold">{clinicErrors.name.message}</p>}
                  </div>
                  {/*Painel de Metadados 100% Dinâmico do Postgres */}
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium text-gray-500 space-y-1.5 animate-fade-in">
                    <p className="flex items-center gap-1.5">
                      <span className="font-black text-deep-obsidian uppercase tracking-wide">Plano Ativo:</span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider ${watchPlan === 'platinum' || watchPlan === 'platinum_enterprise'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-teal-50 text-dentistry-teal border border-teal-200'
                        }`}>
                        {watchPlan === 'starter' ? 'Plano Bronze Baselines' : watchPlan.replace('_', ' ')}
                      </span>
                    </p>
                    <p>
                      <span className="font-black text-deep-obsidian uppercase tracking-wide">Tenant ID Relacional:</span>
                      <span className="font-mono text-gray-600 bg-white px-1.5 py-0.5 border border-gray-200 rounded-md ml-1 shadow-sm">#{tenantIdHeader}</span>
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isClinicSubmitting}
                      className="bg-dentistry-teal text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isClinicSubmitting ? 'Salvando...' : 'Atualizar Dados Clínicos'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
