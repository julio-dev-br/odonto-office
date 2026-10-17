import React, { useState } from 'react';
import { UserPlus, Fingerprint, Phone } from 'lucide-react';

interface PatientFormProps {
  onAddPatient: (patient: { name: string; cpf: string; whatsapp: string }) => void;
}

export function PatientForm({ onAddPatient }: PatientFormProps) {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cpf || !whatsapp) return;

    // Envia os dados limpos para o componente pai salvar
    onAddPatient({ name, cpf, whatsapp });

    // Limpa os campos para o próximo cadastro
    setName('');
    setCpf('');
    setWhatsapp('');
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-bold text-deep-obsidian mb-4 flex items-center gap-2">
        <UserPlus size={18} className="text-dentistry-teal" /> Novo Cadastro
      </h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Campo: Nome */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Nome Completo
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Mariana Costa"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all"
          />
        </div>

        {/* Campo: CPF */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Fingerprint size={12} /> CPF
          </label>
          <input
            type="text"
            required
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="000.000.000-00"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all"
          />
        </div>

        {/* Campo: WhatsApp */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Phone size={12} /> WhatsApp
          </label>
          <input
            type="text"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="11999999999"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all"
          />
        </div>

        {/* Botão de Envio */}
        <div className="md:col-span-3 flex justify-end mt-2">
          <button
            type="submit"
            className="bg-mint-clean text-deep-obsidian font-bold py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-lg hover:bg-mint-clean/90 transition-all cursor-pointer"
          >
            Salvar Paciente
          </button>
        </div>
      </form>
    </div>
  );
}
