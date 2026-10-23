import React from 'react';
import { Clock, Play } from 'lucide-react';

interface ClinicalQueueProps {
  isLoading: boolean;
  waitingPatients: any[];
  activePatientId: string | undefined;
  onCallPatient: (ap: any) => void;
  onOpenRecord: (ap: any) => void;
}

export function ClinicalQueue({
  isLoading,
  waitingPatients,
  activePatientId,
  onCallPatient,
  onOpenRecord,
}: ClinicalQueueProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
        <Clock size={14} /> Pacientes Prontos na Sala de Espera
      </h3>

      {isLoading ? (
        <div className="p-6 bg-white border border-gray-100 rounded-2xl animate-pulse text-xs text-gray-400 font-bold">
          Buscando triagem...
        </div>
      ) : waitingPatients.length === 0 ? (
        <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-400 italic text-center">
          Nenhum paciente aguardando atendimento agora.
        </div>
      ) : (
        <div className="space-y-3">
          {waitingPatients.map((ap: any) => (
            <div
              key={ap.id}
              className={`p-4 border rounded-2xl shadow-sm transition-all flex flex-col gap-3 ${
                activePatientId === ap.id ? 'bg-dentistry-teal/5 border-dentistry-teal' : 'bg-white border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-dentistry-teal">
                  {new Date(ap.startAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    ap.status === 'in_attendance' ? 'bg-blue-100 text-blue-700 animate-pulse' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {ap.status === 'in_attendance' ? 'Na Cadeira' : 'Aguardando'}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-black text-deep-obsidian">{ap.patient?.name}</h4>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Procedimento: {ap.type}</p>
              </div>
              {ap.status === 'waiting' && (
                <button
                  onClick={() => onCallPatient(ap)}
                  className="w-full bg-dentistry-teal text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow-md hover:bg-dentistry-teal/90 transition-all cursor-pointer"
                >
                  <Play size={12} /> Chamar para Atendimento
                </button>
              )}
              {ap.status === 'in_attendance' && activePatientId !== ap.id && (
                <button
                  onClick={() => onOpenRecord(ap)}
                  className="w-full bg-blue-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow-md hover:bg-blue-600 transition-all cursor-pointer"
                >
                  Abrir Prontuário Ativo
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
