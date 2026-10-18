import React, { useState, useEffect } from 'react';
import { Clock, User, UserCheck, Plus, Sparkles } from 'lucide-react';
import { api } from '../services/api'; 

interface AgendaFormProps {
  onAddAppointment: (appointment: any) => void;
}

export function AgendaForm({ onAddAppointment }: AgendaFormProps) {
  // Estados dinâmicos que vão receber os dados reais do Postgres
  const [patients, setPatients] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<any[]>([]); // 🚀 Nova lista de procedimentos!

  // Estados dos inputs mapeados com os IDs do banco
  const [patientId, setPatientId] = useState('');
  const [professionalId, setProfessionalId] = useState('');
  const [procedureId, setProcedureId] = useState(''); // 🚀 Guarda o ID real do procedimento
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [notes, setNotes] = useState('');

  // CAPTURA DE DADOS REAIS DO POSTGRESQL VIA AXIOS
  useEffect(() => {
    async function loadFormContext() {
      try {
        // 1. Busca os pacientes reais ativos da clínica
        const patientsRes = await api.get('/patients');
        setPatients(patientsRes.data);
        if (patientsRes.data.length > 0) setPatientId(patientsRes.data[0].id.toString());

        // 2. Busca os profissionais/dentistas reais cadastrados
        const professionalsRes = await api.get('/professionals');
        setProfessionals(professionalsRes.data);
        if (professionalsRes.data.length > 0) setProfessionalId(professionalsRes.data[0].id.toString());

        // 3. Busca o catálogo de procedimentos reais da clínica
        const proceduresRes = await api.get('/dental-procedures');
        setProcedures(proceduresRes.data);
        if (proceduresRes.data.length > 0) setProcedureId(proceduresRes.data[0].id.toString());

      } catch (err) {
        console.error('Erro ao carregar contexto do banco de dados para a agenda:', err);
      }
    }
    loadFormContext();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startAt || !endAt || !patientId || !professionalId || !procedureId) return;

    // Encontra o nome amigável do procedimento selecionado para exibir na Timeline provisória
    const selectedProc = procedures.find(p => p.id.toString() === procedureId);

    // Envia os dados limpos e amarrados com chaves relacionais para o Postgres!
    onAddAppointment({
      patientId,
      professionalId,
      procedureId, 
      startAt,
      endAt,
      type: selectedProc ? selectedProc.name : 'Consulta Geral', // Fallback amigável
      notes
    });

    setStartAt('');
    setEndAt('');
    setNotes('');
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-fit">
      <h2 className="text-base font-bold text-deep-obsidian mb-4 flex items-center gap-2">
        <Plus size={18} className="text-dentistry-teal" /> Agendar Consulta
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Seletor de Pacientes */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <User size={12} /> Selecionar Paciente
          </label>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all cursor-pointer"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id.toString()}>{p.name}</option>
            ))}
            {patients.length === 0 && <option value="">Nenhum paciente localizado</option>}
          </select>
        </div>

        {/* Seletor de Dentistas */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <UserCheck size={12} /> Dentista Responsável
          </label>
          <select
            value={professionalId}
            onChange={(e) => setProfessionalId(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all cursor-pointer"
          >
            {professionals.map((prof) => (
              <option key={prof.id} value={prof.id.toString()}>{prof.name} ({prof.specialty || 'Clínico'})</option>
            ))}
            {professionals.length === 0 && <option value="">Nenhum profissional localizado</option>}
          </select>
        </div>

        {/* 🚀 NOVO SELETOR: Catálogo de Procedimentos Reais do Postgres! */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={12} className="text-dentistry-teal" /> Procedimento Clínico
          </label>
          <select
            value={procedureId}
            onChange={(e) => setProcedureId(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all cursor-pointer"
          >
            {procedures.map((proc) => (
              <option key={proc.id} value={proc.id.toString()}>
                {proc.name} — R$ {Number(proc.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </option>
            ))}
            {procedures.length === 0 && <option value="">Nenhum procedimento no catálogo</option>}
          </select>
        </div>

        {/* Grid de Horários */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Clock size={12} /> Início
            </label>
            <input
              type="time"
              required
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Clock size={12} /> Término
            </label>
            <input
              type="time"
              required
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Observações */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Notas da Agenda
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observações ou restrições clínicas..."
            rows={2}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-mint-clean text-deep-obsidian font-bold py-3 px-4 rounded-xl text-sm shadow-md hover:shadow-lg hover:bg-mint-clean/90 transition-all cursor-pointer disabled:opacity-50"
          disabled={patients.length === 0 || professionals.length === 0 || procedures.length === 0}
        >
          Confirmar Agendamento
        </button>
      </form>
    </div>
  );
}
