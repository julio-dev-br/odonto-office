import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  professionalName: string;
  startAt: string;
  endAt: string;
  type: string;
  status: string;
  notes?: string;
}

interface AgendaTimelineProps {
  appointments: Appointment[];
}

export function AgendaTimeline({ appointments }: AgendaTimelineProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* Topo da Timeline */}
        <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-6">
          <h3 className="text-sm font-bold text-deep-obsidian uppercase tracking-wider">
            Horários do Dia • Hoje
          </h3>
          <span className="text-xs font-semibold text-gray-400 font-mono">
            {new Date().toLocaleDateString('pt-BR')}
          </span>
        </div>

        {/* Lista Dinâmica de Compromissos */}
        <div className="space-y-4">
          {appointments.map((appt) => {
            const isCompleted = appt.status === 'completed';
            return (
              <div
                key={appt.id}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-gray-50/50 border-gray-100 opacity-70'
                    : 'bg-white border-gray-100 shadow-sm hover:border-mint-clean/30'
                }`}
              >
                {/* Bloco de Horário Fixo */}
                <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 min-w-70px font-mono">
                  <span className="text-xs font-bold text-deep-obsidian">{appt.startAt}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{appt.endAt}</span>
                </div>

                {/* Dados Clínicos Cruzados */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-extrabold text-deep-obsidian">{appt.patientName}</h4>

                    {/* Status Badges Condicionais */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      isCompleted
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-mint-clean/10 text-mint-clean'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                      {appt.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-medium">
                    <span className="text-dentistry-teal font-semibold">{appt.type}</span>
                    <span className="text-gray-400">•</span>
                    <span>{appt.professionalName}</span>
                  </div>

                  {appt.notes && (
                    <p className="text-xs text-gray-400 bg-gray-50/50 p-2 rounded-lg border border-gray-50 mt-1 flex items-start gap-1">
                      <AlertCircle size={12} className="text-gray-400 mt-0.5 shrink-0" />
                      <span className="italic">{appt.notes}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {appointments.length === 0 && (
            <div className="text-center py-12 text-sm text-gray-400 font-medium italic">
              Nenhuma consulta agendada para o dia de hoje.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
