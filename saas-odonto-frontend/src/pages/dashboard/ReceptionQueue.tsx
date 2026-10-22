import { useState, useEffect } from 'react';
import { Users, Clock, Play, CheckCircle2, UserCheck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../services/api';

interface AppointmentQueue {
  id: string;
  startAt: string;
  type: string;
  status: 'scheduled' | 'waiting' | 'in_attendance' | 'completed' | string;
  notes?: string;
  patient: {
    name: true;
    whatsapp: string;
  };
}

export default function ReceptionQueue() {
  const [queue, setQueue] = useState<AppointmentQueue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Captura o cabeçalho obrigatório Multi-Tenant do seu cofre local
  const tenantIdHeader = localStorage.getItem('@OdontoOffice:tenantId') || '1';

  const fetchQueueData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/appointments/queue', {
        headers: { 'X-Tenant-ID': tenantIdHeader }
      });
      
      const formatted = response.data.map((item: any) => ({
        ...item,
        id: item.id.toString(),
        startHour: new Date(item.startAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }));
      
      setQueue(formatted);
    } catch (err) {
      console.error('Erro ao carregar fila do dia:', err);
      toast.error('Falha ao sincronizar painel de triagem.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
  }, []);

  //Altera o estado do paciente em tempo real no Postgres!
  const handleStatusChange = async (id: string, nextStatus: string, message: string) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status: nextStatus }, {
        headers: { 'X-Tenant-ID': tenantIdHeader }
      });
      toast.success(message);
      await fetchQueueData(); // Recarrega o painel reativamente na hora!
    } catch (err) {
      console.error('Erro ao atualizar status clínico:', err);
      toast.error('Não foi possível alterar o status do paciente.');
    }
  };

  // Separadores lógicos de contagem para os Bento Cards superiores
  const countWaiting = queue.filter(q => q.status === 'waiting').length;
  const countInAttendance = queue.filter(q => q.status === 'in_attendance').length;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-deep-obsidian tracking-tight flex items-center gap-3">
            <Users className="text-mint-clean" size={32} /> Painel Operacional da Recepção
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Controle de fluxo de pacientes do dia, triagem expressa e gerenciamento de fila de espera em tempo real.
          </p>
        </div>
        <button onClick={fetchQueueData} className="w-fit flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-deep-obsidian text-xs font-bold rounded-xl transition-all cursor-pointer">
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Atualizar Fila
        </button>
      </div>

      {/* MINI INDICADORES METROLÓGICOS DA RECEPÇÃO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Clock size={20} /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Agendados Hoje</p>
            <h3 className="text-2xl font-black text-deep-obsidian">{queue.length}</h3>
          </div>
        </div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl animate-pulse"><UserCheck size={20} /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Aguardando na Sala</p>
            <h3 className="text-2xl font-black text-deep-obsidian">{countWaiting}</h3>
          </div>
        </div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Play size={20} /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Em Atendimento</p>
            <h3 className="text-2xl font-black text-deep-obsidian">{countInAttendance}</h3>
          </div>
        </div>
      </div>

      {/* LISTAGEM DA FILA OPERACIONAL */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-gray-50/50">
          <h3 className="text-sm font-bold text-deep-obsidian uppercase tracking-wider">
            Linha do Tempo de Atendimentos do Dia ({queue.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-sm text-gray-400 font-medium animate-pulse">
            Sincronizando fila de pacientes com o Postgres...
          </div>
        ) : queue.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400 font-medium italic">
            Nenhuma consulta agendada ou registrada para a data de hoje.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase bg-gray-50/20">
                  <th className="py-4 px-6">Horário</th>
                  <th className="py-4 px-6">Paciente</th>
                  <th className="py-4 px-6">Procedimento</th>
                  <th className="py-4 px-6">Status na Fila</th>
                  <th className="py-4 px-6 text-right">Ações Rápidas de Triagem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-medium text-deep-obsidian">
                {queue.map((item: any) => {
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-dentistry-teal font-bold">{item.startHour}</td>
                      <td className="py-4 px-6 font-bold">{item.patient?.name || 'Paciente Não Identificado'}</td>
                      <td className="py-4 px-6 text-xs text-gray-500">{item.type}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit ${
                          item.status === 'completed' ? 'bg-green-100 text-green-700' :
                          item.status === 'in_attendance' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                          item.status === 'waiting' ? 'bg-amber-100 text-amber-700 font-black' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {item.status === 'scheduled' ? 'Agendado' :
                           item.status === 'waiting' ? 'Na Recepção' :
                           item.status === 'in_attendance' ? 'No Consultório' : 'Finalizado'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right flex items-center justify-end gap-2">
                        
                        {/* BOTÃO 1: DAR CHECK-IN (Agendado -> Na Recepção) */}
                        {item.status === 'scheduled' && (
                          <button onClick={() => handleStatusChange(item.id, 'waiting', 'Paciente deu entrada e está na sala de espera!')} className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1">
                            <UserCheck size={14} /> Dar Entrada
                          </button>
                        )}

                        {/* BOTÃO 2: CHAMAR PRO CONSULTÓRIO (Na Recepção -> Em Atendimento) */}
                        {item.status === 'waiting' && (
                          <button onClick={() => handleStatusChange(item.id, 'in_attendance', 'Paciente chamado para a cadeira clínica!')} className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1">
                            <Play size={14} /> Chamar Dentista
                          </button>
                        )}

                        {/* BOTÃO 3: FINALIZAR ATENDIMENTO (Em Atendimento -> Concluído) */}
                        {item.status === 'in_attendance' && (
                          <button onClick={() => handleStatusChange(item.id, 'completed', 'Consulta finalizada com sucesso!')} className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1">
                            <CheckCircle2 size={14} /> Finalizar
                          </button>
                        )}

                        {item.status === 'completed' && (
                          <span className="text-xs font-bold text-gray-400 italic flex items-center gap-1">
                            <CheckCircle2 size={14} className="text-green-500" /> Atendido
                          </span>
                        )}

                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
