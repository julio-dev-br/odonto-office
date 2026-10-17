import React, { useState } from 'react';
import { Clock, User, UserCheck, Plus } from 'lucide-react';

interface AgendaFormProps {
  onAddAppointment: (appointment: any) => void;
}

export function AgendaForm({ onAddAppointment }: AgendaFormProps) {
  const [patientId, setPatientId] = useState('1');
  const [professionalId, setProfessionalId] = useState('1');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [type, setType] = useState('Profilaxia (Limpeza)');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startAt || !endAt) return;

    onAddAppointment({
      patientName: patientId === '1' ? 'Mariana Costa (Simulado)' : 'Rodrigo Silva (Simulado)',
      professionalName: 'Dr. Anderson Silva',
      startAt,
      endAt,
      type,
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
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <User size={12} /> Selecionar Paciente
          </label>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all"
          >
            <option value="1">Mariana Costa (ID: 1)</option>
            <option value="2">Rodrigo Silva (ID: 2)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <UserCheck size={12} /> Dentista Responsável
          </label>
          <select
            value={professionalId}
            onChange={(e) => setProfessionalId(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all"
          >
            <option value="1">Dr. Anderson Silva (ID: 1)</option>
          </select>
        </div>

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

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            Tipo de Atendimento
          </label>
          <input
            type="text"
            required
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Ex: Profilaxia (Limpeza)"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            Notas da Agenda
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observações ou queixas do paciente..."
            rows={2}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-mint-clean text-deep-obsidian font-bold py-3 px-4 rounded-xl text-sm shadow-md hover:shadow-lg hover:bg-mint-clean/90 transition-all cursor-pointer"
        >
          Confirmar Agendamento
        </button>
      </form>
    </div>
  );
}
