import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { AgendaForm } from '../../components/AgendaForm';
import { AgendaTimeline } from '../../components/AgendaTimeline';

export default function Agenda() {
  // 🔬 ESTADO CENTRAL DA AGENDA: Alinhado perfeitamente com os tipos do Postgres/Prisma!
  const [appointments, setAppointments] = useState([
    {
      id: '1',
      patientName: 'Mariana Costa',
      professionalName: 'Dr. Anderson Silva',
      startAt: '14:30',
      endAt: '15:30',
      type: 'Clareamento Laser',
      status: 'scheduled',
      notes: 'Paciente prefere atendimento sem anestesia.',
    },
    {
      id: '2',
      patientName: 'Rodrigo Silva',
      professionalName: 'Dr. Anderson Silva',
      startAt: '16:00',
      endAt: '17:00',
      type: 'Profilaxia (Limpeza)',
      status: 'completed',
      notes: 'Retorno de rotina de 6 meses.',
    },
  ]);

  // Handler inteligente que recebe o novo agendamento e insere na Timeline
  const handleAddAppointment = (newAppt: any) => {
    const formattedAppt = {
      id: (appointments.length + 1).toString(),
      patientName: newAppt.patientName,
      professionalName: newAppt.professionalName,
      startAt: newAppt.startAt,
      endAt: newAppt.endAt,
      type: newAppt.type,
      status: 'scheduled', // Todo agendamento nasce agendado/pendente
      notes: newAppt.notes,
    };

    // Adiciona e ordena automaticamente os horários por ordem cronológica (Mais cedo no topo!)
    setAppointments([...appointments, formattedAppt].sort((a, b) => a.startAt.localeCompare(b.startAt)));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Título e Subtítulo da Tela */}
      <div>
        <h1 className="text-3xl font-extrabold text-deep-obsidian tracking-tight flex items-center gap-3">
          <Calendar className="text-mint-clean" size={32} /> Clinical Schedule
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie os horários de atendimento dos dentistas e controle o status das consultas em tempo real.
        </p>
      </div>

      {/* Grid Principal: Formulário (Lado Esquerdo 4 colunas) e Timeline (Lado Direito 8 colunas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <AgendaForm onAddAppointment={handleAddAppointment} />
        </div>
        <div className="lg:col-span-8">
          <AgendaTimeline appointments={appointments} />
        </div>
      </div>
    </div>
  );
}
