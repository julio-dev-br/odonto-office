import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, Mail, Lock, Users, CheckCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

export function UserManagementForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('RECEPTIONIST');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 🚀 ESTADO DA LISTAGEM VIVA DA EQUIPE
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  // 🛡️ Captura o cabeçalho obrigatório Multi-Tenant do seu cofre local
  const tenantIdHeader = localStorage.getItem('@OdontoOffice:tenantId') || '1';
  const config = { headers: { 'X-Tenant-ID': tenantIdHeader } };

  // 📥 FUNÇÃO DE LEITURA (Busca os usuários isolados da clínica no Postgres)
  const loadUsers = async () => {
    try {
      setIsLoadingList(true);
      // Bate no endpoint GET /users do seu módulo de usuários do NestJS
      const response = await api.get('/users', config);
      setUsersList(response.data || []);
    } catch (err) {
      console.error('Erro ao carregar lista de colaboradores:', err);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !role) return;

    try {
      setIsSubmitting(true);
      await api.post('/users', { name, email, password, role }, config);
      
      toast.success('Novo colaborador cadastrado com sucesso!');
      setName('');
      setEmail('');
      setPassword('');
      
      // 🚀 ATUALIZAÇÃO REATIVA: Recarrega a tabela no mesmo milissegundo!
      await loadUsers();
    } catch (err: any) {
      console.error(err);
      const apiMessage = err.response?.data?.message;
      toast.error(typeof apiMessage === 'string' ? apiMessage : 'Erro ao cadastrar colaborador.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* CARD DE FORMULÁRIO DE CADASTRO */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-deep-obsidian mb-4 flex items-center gap-2">
          <UserPlus size={18} className="text-dentistry-teal" /> Cadastrar Novo Colaborador (Acesso)
        </h3>

        <form onSubmit={handleRegisterUser} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Dra. Roberta Souza"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Mail size={12} /> Email de Acesso</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="roberta@clinic.com"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Lock size={12} /> Senha Inicial</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Shield size={12} /> Perfil / Permissão</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all cursor-pointer"
              >
                <option value="RECEPTIONIST">Recepcionista (Acesso à Agenda/Caixa)</option>
                <option value="DENTIST">Dentista (Acesso Clínico/Prontuário)</option>
                <option value="ADMIN">Administrador (Controle Total do SaaS)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-dentistry-teal text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-lg hover:bg-dentistry-teal/90 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Cadastrar Colaborador'}
            </button>
          </div>
        </form>
      </div>

      {/* 🚀 TABELA DE LISTAGEM DA EQUIPE LOGADA */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
          <Users size={16} className="text-gray-400" />
          <h3 className="text-xs font-bold text-deep-obsidian uppercase tracking-wider">
            Colaboradores Ativos na Clínica ({usersList.length})
          </h3>
        </div>

        {isLoadingList ? (
          <div className="p-8 text-center text-xs font-medium text-gray-400 animate-pulse">
            Sincronizando quadro de funcionários...
          </div>
        ) : usersList.length === 0 ? (
          <div className="p-8 text-center text-xs font-medium text-gray-400 italic">
            Nenhum colaborador registrado além do administrador mestre.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase bg-gray-50/20">
                  <th className="py-3 px-5">Nome do Profissional</th>
                  <th className="py-3 px-5">E-mail Corporativo</th>
                  <th className="py-3 px-5">Nível de Acesso</th>
                  <th className="py-3 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium text-deep-obsidian">
                {usersList.map((user: any) => (
                  <tr key={user.id?.toString()} className="hover:bg-gray-50/30 transition-colors">
                    <td className="py-3 px-5 font-bold text-deep-obsidian">{user.name}</td>
                    <td className="py-3 px-5 font-mono text-gray-500 text-[11px]">{user.email}</td>
                    <td className="py-3 px-5">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'DENTIST' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {user.role === 'ADMIN' ? 'Administrador' :
                         user.role === 'DENTIST' ? 'Dentista' : 'Recepcionista'}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <CheckCircle size={10} /> Ativo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
