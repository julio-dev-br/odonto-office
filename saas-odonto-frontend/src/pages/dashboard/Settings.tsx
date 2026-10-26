import { useState } from 'react';
import { User, Settings as SettingsIcon, Users, Shield, Building, Key, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { UserManagementForm } from '../../components/UserManagementForm';
import { ProcedureForm } from '../../components/ProcedureForm'; // 🚀 IMPORTA O FORM NOVO!

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'procedures' | 'system'>('profile');

  // Captura a identificação da clínica ativa salva no seu cofre local para o JSX ler!
  const tenantIdHeader = localStorage.getItem('@OdontoOffice:tenantId') || '1';

  // Estados locais do perfil simulando dados da sessão logada
  const [profileName, setProfileName] = useState('Dr. Anderson Silva');
  const [profileEmail, setProfileEmail] = useState('anderson@sorrisoperfeito.com');
  const [clinicName, setClinicName] = useState('Sorriso Perfeito Clinic');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Perfil atualizado com sucesso no cofre digital!');
  };

  const handleUpdateSystem = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configurações do consultório salvas com sucesso!');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-deep-obsidian tracking-tight flex items-center gap-3">
          <SettingsIcon className="text-mint-clean" size={32} /> Configurações do Sistema
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie seu perfil pessoal, gerencie contas da equipe e configure os parâmetros clínicos e de procedimentos.
        </p>
      </div>

      {/* NAVEGAÇÃO POR ABAS PREMIUM (Tabs) */}
      <div className="flex border-b border-gray-100 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile' ? 'border-dentistry-teal text-dentistry-teal bg-gray-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <User size={16} /> Meu Perfil
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'team' ? 'border-dentistry-teal text-dentistry-teal bg-gray-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Users size={16} /> Gestão da Equipe
        </button>
        
        {/* ABA NOVA: PROCEDIMENTOS CLÍNICOS */}
        <button
          onClick={() => setActiveTab('procedures')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'procedures' ? 'border-dentistry-teal text-dentistry-teal bg-gray-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Sparkles size={16} /> Catálogo de Procedimentos
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'system' ? 'border-dentistry-teal text-dentistry-teal bg-gray-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Building size={16} /> Dados do Consultório
        </button>
      </div>

      {/* RENDERIZAÇÃO CONDICIONAL */}
      <div className="space-y-6">
        
        {/* ABA 1: MEU PERFIL */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm max-w-2xl">
            <h3 className="text-base font-bold text-deep-obsidian mb-4 flex items-center gap-2">
              <Key size={18} className="text-dentistry-teal" /> Informações Pessoais de Segurança
            </h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Seu Nome Profissional</label>
                <input type="text" required value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Vinculado</label>
                <input type="email" required value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all font-mono" />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-mint-clean text-deep-obsidian font-bold py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-lg transition-all cursor-pointer">Salvar Meu Perfil</button>
              </div>
            </form>
          </div>
        )}

        {/* ABA 2: GESTÃO DA EQUIPE */}
        {activeTab === 'team' && <UserManagementForm />}

        {/* ABA 3: PROCEDIMENTOS CLÍNICOS (Chama o componente novo!) */}
        {activeTab === 'procedures' && <ProcedureForm />}

        {/* ABA 4: DADOS DO CONSULTÓRIO */}
        {activeTab === 'system' && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm max-w-2xl">
            <h3 className="text-base font-bold text-deep-obsidian mb-4 flex items-center gap-2">
              <Shield size={18} className="text-dentistry-teal" /> Parâmetros Corporativos Multi-Tenant
            </h3>
            <form onSubmit={handleUpdateSystem} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome Comercial da Clínica</label>
                <input type="text" required value={clinicName} onChange={(e) => setClinicName(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all" />
              </div>
              <div className="p-4 bg-gray-50 rounded-xl text-xs font-medium text-gray-500 space-y-1">
                <p><span className="font-bold text-deep-obsidian">Plano Ativo:</span> PLATINUM ENTERPRISE</p>
                <p><span className="font-bold text-deep-obsidian">Tenant ID Relacional:</span> {tenantIdHeader}</p>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-dentistry-teal text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-lg transition-all cursor-pointer">Atualizar Dados Clínicos</button>
              </div>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
