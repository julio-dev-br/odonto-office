import React, { useState } from 'react';
import { UserPlus, Shield, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

export function UserManagementForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('RECEPTIONIST');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !role) return;

    try {
      setIsSubmitting(true);
      // Bate no endpoint padrão de criação de usuários do seu SaaS
      await api.post('/users', { name, email, password, role });
      
      toast.success('Novo usuário cadastrado com sucesso!');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error(err);
      const apiMessage = err.response?.data?.message;
      toast.error(typeof apiMessage === 'string' ? apiMessage : 'Erro ao cadastrar colaborador.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-base font-bold text-deep-obsidian mb-4 flex items-center gap-2">
        <UserPlus size={18} className="text-dentistry-teal" /> Cadastrar Novo Colaborador (Acesso)
      </h3>

      <form onSubmit={handleRegisterUser} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nome */}
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

          {/* Email */}
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
          {/* Senha */}
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

          {/* Nível de Acesso (Role) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Shield size={12} /> Perfil / Nível de Permissão</label>
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
  );
}
