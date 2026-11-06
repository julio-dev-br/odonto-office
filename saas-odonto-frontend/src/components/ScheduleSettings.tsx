import { useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { Save, Clock, CalendarDays } from 'lucide-react';

// Lista fixa dos dias da semana para renderizar a tabela
const WEEK_DAYS = [
  { id: 1, name: 'Segunda-feira' },
  { id: 2, name: 'Terça-feira' },
  { id: 3, name: 'Quarta-feira' },
  { id: 4, name: 'Quinta-feira' },
  { id: 5, name: 'Sexta-feira' },
  { id: 6, name: 'Sábado' },
  { id: 0, name: 'Domingo' },
];

export function ScheduleSettings() {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [selectedProfId, setSelectedProfId] = useState<string>('');
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Busca a lista de profissionais da clínica ao abrir a tela
  useEffect(() => {
    async function loadProfessionals() {
      try {
        const response = await api.get('/professionals'); // Rota padrão do seu backend
        setProfessionals(response.data);
        if (response.data.length > 0) {
          setSelectedProfId(response.data[0].id.toString());
        }
      } catch (error) {
        toast.error('Erro ao carregar a lista de profissionais.');
      }
    }
    loadProfessionals();
  }, []);

  // 2. Busca os horários sempre que o profissional selecionado mudar
  useEffect(() => {
    if (!selectedProfId) return;

    async function loadSchedules() {
      setIsLoading(true);
      try {
        const response = await api.get(`/schedules/professional/${selectedProfId}`);
        setSchedules(response.data);
      } catch (error) {
        toast.error('Erro ao carregar os horários.');
      } finally {
        setIsLoading(false);
      }
    }
    loadSchedules();
  }, [selectedProfId]);

  // 3. Função para salvar/atualizar um dia específico
  const handleSaveDay = async (dayOfWeek: number, data: any) => {
    try {
      await api.post(`/schedules/professional/${selectedProfId}`, {
        dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        breakStart: data.breakStart || undefined,
        breakEnd: data.breakEnd || undefined,
        active: data.active,
      });
      toast.success('Horário atualizado com sucesso!');
      
      // Atualiza a lista local após salvar
      const response = await api.get(`/schedules/professional/${selectedProfId}`);
      setSchedules(response.data);
    } catch (error) {
      toast.error('Erro ao salvar o horário. Verifique os campos.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Seletor de Profissional */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-deep-obsidian mb-4 flex items-center gap-2">
          <CalendarDays size={18} className="text-dentistry-teal" />
          Configuração de Horários
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Selecione um profissional para configurar os dias e horários de atendimento dele.
        </p>

        <div className="max-w-md space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Profissional</label>
          <select
            value={selectedProfId}
            onChange={(e) => setSelectedProfId(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all"
          >
            <option value="" disabled>Selecione um profissional</option>
            {professionals.map((prof) => (
              <option key={prof.id} value={prof.id}>{prof.name} ({prof.specialty || 'Clínico Geral'})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grade de Horários */}
      {selectedProfId && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {isLoading ? (
             <div className="p-10 text-center text-gray-500">Carregando horários...</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {WEEK_DAYS.map((day) => {
                // Procura se este dia já está configurado no banco
                const existingSchedule = schedules.find(s => s.dayOfWeek === day.id);
                
                return (
                  <DayRow 
                    key={day.id} 
                    day={day} 
                    initialData={existingSchedule} 
                    onSave={handleSaveDay} 
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// COMPONENTE INTERNO: Uma linha (dia) da tabela
// ==========================================
function DayRow({ day, initialData, onSave }: { day: any, initialData: any, onSave: any }) {
  const [isActive, setIsActive] = useState(initialData?.active || false);
  const [startTime, setStartTime] = useState(initialData?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialData?.endTime || '18:00');
  const [breakStart, setBreakStart] = useState(initialData?.breakStart || '');
  const [breakEnd, setBreakEnd] = useState(initialData?.breakEnd || '');

  // Atualiza o estado interno se os dados iniciais mudarem (ex: trocou de profissional)
  useEffect(() => {
    setIsActive(initialData?.active || false);
    setStartTime(initialData?.startTime || '09:00');
    setEndTime(initialData?.endTime || '18:00');
    setBreakStart(initialData?.breakStart || '');
    setBreakEnd(initialData?.breakEnd || '');
  }, [initialData]);

  const handleSave = () => {
    onSave(day.id, { active: isActive, startTime, endTime, breakStart, breakEnd });
  };

  return (
    <div className="p-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
      
      {/* Toggle do Dia */}
      <div className="flex items-center gap-3 w-full sm:w-48">
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isActive ? 'bg-mint-clean' : 'bg-gray-200'
          }`}
        >
          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isActive ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </button>
        <span className={`text-sm font-bold ${isActive ? 'text-deep-obsidian' : 'text-gray-400'}`}>
          {day.name}
        </span>
      </div>

      {/* Inputs de Horário */}
      <div className={`flex flex-wrap items-center gap-2 flex-1 ${!isActive ? 'opacity-40 pointer-events-none' : ''}`}>
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
          <Clock size={14} className="text-gray-400" />
          <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="bg-transparent text-sm font-medium focus:outline-none" />
          <span className="text-gray-400 text-xs">até</span>
          <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="bg-transparent text-sm font-medium focus:outline-none" />
        </div>

        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
          <span className="text-xs text-gray-500 font-semibold uppercase">Almoço</span>
          <input type="time" value={breakStart} onChange={e => setBreakStart(e.target.value)} className="bg-transparent text-sm font-medium focus:outline-none w-20" />
          <span className="text-gray-400 text-xs">às</span>
          <input type="time" value={breakEnd} onChange={e => setBreakEnd(e.target.value)} className="bg-transparent text-sm font-medium focus:outline-none w-20" />
        </div>
      </div>

      {/* Botão Salvar */}
      <button
        onClick={handleSave}
        disabled={!isActive}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
          isActive 
            ? 'bg-deep-obsidian text-white hover:bg-opacity-90 cursor-pointer' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        <Save size={14} />
        Salvar
      </button>
    </div>
  );
}