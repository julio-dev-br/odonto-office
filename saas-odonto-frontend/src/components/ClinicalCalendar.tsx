import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { api } from '../services/api';
import toast from 'react-hot-toast';

export function ClinicalCalendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tenantIdHeader = localStorage.getItem('@OdontoOffice:tenantId') || '1';
  const config = { headers: { 'X-Tenant-ID': tenantIdHeader } };

  const loadAppointmentsForCalendar = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/appointments/queue', config);

      const formattedEvents = response.data.map((ap: any) => {
        let eventColor = '#0d9488'; // dentistry-teal padrão
        if (ap.status === 'waiting') eventColor = '#f59e0b'; // Amarelo
        if (ap.status === 'in_attendance') eventColor = '#3b82f6'; // Azul
        if (ap.status === 'waiting_checkout') eventColor = '#8b5cf6'; // Roxo
        if (ap.status === 'completed') eventColor = '#10b981'; // Verde

        return {
          id: ap.id.toString(),
          title: `${ap.patient?.name || 'Paciente'} - ${ap.type}`,
          start: ap.startAt,
          end: ap.endAt,
          backgroundColor: eventColor,
          borderColor: eventColor,
          textColor: '#ffffff',
          extendedProps: { status: ap.status, notes: ap.notes }
        };
      });

      setEvents(formattedEvents);
    } catch (err) {
      console.error('❌ Erro no carregamento:', err);
      toast.error('Falha ao sincronizar grade de horários.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadAppointmentsForCalendar(); }, []);

  if (isLoading) {
    return (
      <div className="p-8 bg-white border border-gray-100 rounded-2xl animate-pulse text-xs text-gray-400 font-bold">
        Sincronizando grade do calendário...
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[700px] w-full block">
      <div className="w-full h-[650px] relative block">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek" 
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          locale="pt-br"
          // 🚀 INTERNACIONALIZAÇÃO: Força a tradução estrita dos botões do topo!
          buttonText={{
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia'
          }}
          events={events}
          slotMinTime="07:00:00" 
          slotMaxTime="21:00:00" 
          allDaySlot={false}
          height="100%"
          expandRows={true}
          nowIndicator={true}
          eventClick={(info) => {
            toast(`Status: ${info.event.extendedProps.status.toUpperCase()}`, {
              icon: '📅',
              style: { fontWeight: 'bold' }
            });
          }}
        />
      </div>
    </div>
  );
}
