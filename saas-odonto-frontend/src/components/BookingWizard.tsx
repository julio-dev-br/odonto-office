import { useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { X, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, User, CheckCircle2 } from 'lucide-react';

interface BookingWizardProps {
  slug: string;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingWizard({ slug, isOpen, onClose }: BookingWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Dados vindos da API
  const [data, setData] = useState<any>({ professionals: [], procedures: [] });

  // Estados do Formulário
  const [selectedProcedure, setSelectedProcedure] = useState<string>('');
  const [selectedProfessional, setSelectedProfessional] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  
  // Dados do Paciente
  const [patientName, setPatientName] = useState('');
  const [patientWhatsapp, setPatientWhatsapp] = useState('');
  const [patientCpf, setPatientCpf] = useState('');

  // 1. Carrega os dados iniciais (Profissionais e Procedimentos)
  useEffect(() => {
    if (isOpen) {
      api.get(`/public-booking/${slug}/data`)
        .then(res => setData(res.data))
        .catch(() => toast.error('Erro ao carregar dados da clínica.'));
    }
  }, [isOpen, slug]);

  // 2. Busca os horários sempre que mudar a data, profissional ou procedimento (no passo 3)
  useEffect(() => {
    if (step === 3 && selectedDate && selectedProfessional && selectedProcedure) {
      setLoading(true);
      api.get(`/public-booking/${slug}/availability`, {
        params: {
          professionalId: selectedProfessional,
          procedureId: selectedProcedure,
          date: selectedDate
        }
      })
      .then(res => setAvailableSlots(res.data.availableSlots))
      .catch(() => toast.error('Erro ao buscar horários.'))
      .finally(() => setLoading(false));
    }
  }, [step, selectedDate, selectedProfessional, selectedProcedure, slug]);

  if (!isOpen) return null;

  // Lógica para avançar e voltar
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  // Função final de agendamento
  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/public-booking/${slug}/book`, {
        name: patientName,
        whatsapp: patientWhatsapp,
        cpf: patientCpf || undefined,
        professionalId: selectedProfessional,
        procedureId: selectedProcedure,
        date: selectedDate,
        time: selectedTime,
      });
      toast.success('Agendamento confirmado com sucesso!');
      setStep(5); // Vai para a tela de sucesso
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao agendar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Filtra os profissionais que fazem o procedimento selecionado
  const filteredProfessionals = data.professionals.filter((prof: any) => 
    prof.procedures.includes(selectedProcedure)
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Agendar Consulta</h2>
            <p className="text-sm text-slate-500">Passo {step > 4 ? 4 : step} de 4</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Modal (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* PASSO 1: Procedimento */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Qual procedimento você precisa?</h3>
              {data.procedures.map((proc: any) => (
                <button
                  key={proc.id}
                  onClick={() => { setSelectedProcedure(proc.id); nextStep(); }}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group cursor-pointer"
                >
                  <div>
                    <span className="block font-bold text-slate-900">{proc.name}</span>
                    <span className="text-xs text-slate-500">Duração: {proc.estimatedMin} min</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-300 group-hover:text-emerald-500" />
                </button>
              ))}
            </div>
          )}

          {/* PASSO 2: Profissional */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Com quem você quer agendar?</h3>
              {filteredProfessionals.map((prof: any) => (
                <button
                  key={prof.id}
                  onClick={() => { setSelectedProfessional(prof.id); nextStep(); }}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <User size={20} />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-900">{prof.name}</span>
                      <span className="text-xs text-slate-500">{prof.specialty}</span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-300 group-hover:text-emerald-500" />
                </button>
              ))}
              <button onClick={prevStep} className="mt-4 flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800">
                <ChevronLeft size={16} /> Voltar
              </button>
            </div>
          )}

          {/* PASSO 3: Data e Hora */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Escolha a data</h3>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }}
                  min={new Date().toISOString().split('T')[0]} // Bloqueia datas passadas no calendário
                  className="w-full p-4 border border-gray-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {selectedDate && (
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Escolha o horário</h3>
                  {loading ? (
                     <p className="text-sm text-slate-500">Buscando horários...</p>
                  ) : availableSlots.length === 0 ? (
                     <p className="text-sm text-orange-500 bg-orange-50 p-3 rounded-xl">Nenhum horário disponível para este dia.</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {availableSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => { setSelectedTime(slot); nextStep(); }}
                          className="py-2.5 rounded-lg border border-gray-200 text-sm font-bold text-slate-700 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors cursor-pointer"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <button onClick={prevStep} className="mt-4 flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800">
                <ChevronLeft size={16} /> Voltar
              </button>
            </div>
          )}

          {/* PASSO 4: Dados do Paciente */}
          {step === 4 && (
            <form onSubmit={handleConfirm} className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Seus dados</h3>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input type="text" required value={patientName} onChange={e => setPatientName(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Seu nome" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp *</label>
                <input type="text" required value={patientWhatsapp} onChange={e => setPatientWhatsapp(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="(11) 99999-9999" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CPF (Opcional)</label>
                <input type="text" value={patientCpf} onChange={e => setPatientCpf(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="000.000.000-00" />
              </div>

              <div className="pt-4 border-t border-gray-100 mt-6 flex gap-3">
                <button type="button" onClick={prevStep} className="px-4 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                  Voltar
                </button>
                <button type="submit" disabled={loading} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg transition-colors disabled:opacity-50">
                  {loading ? 'Confirmando...' : 'Confirmar Agendamento'}
                </button>
              </div>
            </form>
          )}

          {/* PASSO 5: Tela de Sucesso */}
          {step === 5 && (
            <div className="text-center py-8 space-y-4 animate-fade-in">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Tudo certo!</h3>
              <p className="text-slate-500">
                Seu agendamento foi confirmado. Enviaremos um lembrete no WhatsApp.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl text-left border border-slate-200 mt-6 space-y-2">
                <p className="text-sm"><strong className="text-slate-700">Data:</strong> {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')} às {selectedTime}</p>
                <p className="text-sm"><strong className="text-slate-700">Profissional:</strong> {data.professionals.find((p: any) => p.id === selectedProfessional)?.name}</p>
              </div>
              <button onClick={onClose} className="mt-8 w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
                Fechar
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}