import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { api } from '../../services/api'; 
import { AgendaForm } from '../../components/AgendaForm';
import { AgendaTimeline } from '../../components/AgendaTimeline';

export default function Agenda() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await api.get('/appointments');
      
      const formatted = response.data.map((appt: any) => {
        const startDate = new Date(appt.startAt);
        const endDate = new Date(appt.endAt);
        
        return {
          id: appt.id.toString(),
          patientName: appt.patient?.name || 'Paciente Geral',
          professionalName: appt.professional?.name || 'Dentista Clínico',
          startAt: startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }),
          endAt: endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }),
          type: appt.type || 'Consulta Geral',
          status: appt.status,
          notes: appt.notes
        };
      });

      setAppointments(formatted);
    } catch (err: any) {
      console.error(err);
      setError('Não foi possível carregar a agenda clínica.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAddAppointment = async (newAppt: any) => {
    try {
      setError('');
      
      const localDate = new Date();
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;

      const localStart = new Date(`${todayStr}T${newAppt.startAt}:00`);
      const localEnd = new Date(`${todayStr}T${newAppt.endAt}:00`);

      await api.post('/appointments', {
        patientId: newAppt.patientId.toString(),
        professionalId: newAppt.professionalId.toString(),
        startAt: localStart.toISOString(),
        endAt: localEnd.toISOString(),
        type: newAppt.type, 
        notes: newAppt.notes
      });

      await fetchAppointments();
    } catch (err: any) {
      console.error(err);
      const apiMessage = err.response?.data?.message;
      alert(typeof apiMessage === 'string' ? apiMessage : 'Erro ao processar agendamento.');
    }
  };


  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-deep-obsidian tracking-tight flex items-center gap-3">
          <Calendar className="text-mint-clean" size={32} /> Clinical Schedule
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie os horários de atendimento dos dentistas e controle o status das consultas em tempo real.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <AgendaForm onAddAppointment={handleAddAppointment} />
        </div>
        <div className="lg:col-span-8">
          {isLoading ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm text-sm text-gray-400 font-medium animate-pulse h-full flex items-center justify-center">
              Sincronizando grade de horários da clínica...
            </div>
          ) : (
            <AgendaTimeline appointments={appointments} />
          )}
        </div>
      </div>
    </div>
  );
}
