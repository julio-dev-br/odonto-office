import React, { useState, useEffect } from 'react';
import { ClipboardList, UserCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import { getActiveSession } from '../../utils/auth';
import { ClinicalTimeline } from '../../components/ClinicalTimeline';
import { ClinicalQueue } from '../../components/ClinicalQueue'; 
import { ClinicalAnamnese } from '../../components/ClinicalAnamnese'; 

export default function DentistPanel() {
  const [waitingPatients, setWaitingPatients] = useState<any[]>([]);
  const [activePatient, setActivePatient] = useState<any>(null);
  const [historyRecords, setHistoryRecords] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<any[]>([]);
  
  const [selectedProcedureId, setSelectedProcedureId] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado reativo para controlar se é apenas avaliação/orçamento!
  const [isBudget, setIsBudget] = useState(false);

  const { professionalId: loggedProfessionalId, tenantId: tenantIdHeader } = getActiveSession();
  const config = { headers: { 'X-Tenant-ID': tenantIdHeader } };

  const loadClinicalQueue = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/appointments/queue', config);
      const filtered = response.data.map((item: any) => ({
        ...item,
        id: item.id.toString(),
        patientId: item.patientId.toString()
      })).filter((item: any) => item.status === 'waiting' || item.status === 'in_attendance');
      
      setWaitingPatients(filtered);
    } catch (err) {
      console.error(err);
      toast.error('Falha ao carregar fila clínica.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClinicalQueue();
    api.get('/dental-procedures', config).then(res => setProcedures(res.data || []));
  }, []);

  const loadPatientHistory = async (patientId: string) => {
    try {
      const response = await api.get(`/medical-records/patient/${patientId}`, config);
      const formatted = response.data.map((r: any) => ({ ...r, id: r.id.toString() }));
      setHistoryRecords(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCallPatient = async (ap: any) => {
    try {
      await api.patch(`/appointments/${ap.id}/status`, { status: 'in_attendance' }, config);
      toast.success(`Paciente ${ap.patient.name} chamado para a cadeira clínica!`);
      setActivePatient(ap);
      await loadPatientHistory(ap.patientId);
      await loadClinicalQueue();
    } catch (err) {
      toast.error('Erro ao chamar paciente.');
    }
  };

  const handleOpenActiveRecord = (ap: any) => {
    setActivePatient(ap);
    loadPatientHistory(ap.patientId);
  };

  const handleSaveEvolução = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient || !selectedProcedureId || !description || isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      //  Passa a flag isBudget para o NestJS decidir se gera ou não o caixa!
      await api.post('/medical-records', {
        patientId: activePatient.patientId,
        procedureId: selectedProcedureId,
        professionalId: loggedProfessionalId,
        description,
        isBudget 
      }, config);

      toast.success(
        isBudget 
          ? 'Orçamento/Avaliação salva! Paciente liberado para saída.' 
          : 'Evolução assinada com sucesso! Lançamento enviado para o caixa.'
      );
      
      setDescription('');
      setSelectedProcedureId('');
      setIsBudget(false); 
      setActivePatient(null); 
      
      await loadClinicalQueue(); // Sincroniza a fila lateral imediatamente!
    } catch (err: any) {
      const apiMessage = err.response?.data?.message;
      toast.error(typeof apiMessage === 'string' ? apiMessage : 'Erro ao assinar prontuário.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-deep-obsidian tracking-tight flex items-center gap-3">
          <ClipboardList className="text-mint-clean" size={32} /> Painel Clínico do Dentista
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerenciamento de fila de cadeira, ficha de anamnese ativa e linha do tempo de evolução histórica por paciente.
        </p>
      </div>

      {/* Mudado para grid-cols-4 para dar vazão simétrica à mesa clínica */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* COLUNA ESQUERDA MODULAR: FILA CLÍNICA */}
        <div className="lg:col-span-1">
          <ClinicalQueue
            isLoading={isLoading}
            waitingPatients={waitingPatients}
            activePatientId={activePatient?.id}
            onCallPatient={handleCallPatient}
            onOpenRecord={handleOpenActiveRecord}
          />
        </div>

        {/* COLUNA CENTRAL E DIREITA MODULAR: MESA DE TRABALHO CLÍNICO */}
        <div className="lg:col-span-3 space-y-6">
          {!activePatient ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center gap-3">
              <div className="p-4 bg-gray-50 text-gray-400 rounded-full"><UserCheck size={32} /></div>
              <p className="text-sm font-bold text-gray-400 italic">Selecione ou chame um paciente da lista lateral para carregar a mesa de operações clínicas.</p>
            </div>
          ) : (
            /*  Renderiza as 3 frentes lado a lado com perfeição */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/*FORMULÁRIO DE EVOLUÇÃO */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 h-fit">
                <div className="border-b border-gray-50 pb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Paciente Ativo na Cadeira</span>
                  <h2 className="text-base font-black text-deep-obsidian mt-0.5">{activePatient.patient?.name}</h2>
                </div>

                <form onSubmit={handleSaveEvolução} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Procedimento Executado</label>
                    <select
                      required
                      value={selectedProcedureId}
                      onChange={(e) => setSelectedProcedureId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="">Selecione o tratamento...</option>
                      {procedures.map(p => (
                        <option key={p.id?.toString()} value={p.id?.toString()}>{p.name} (R$ {Number(p.price).toFixed(2)})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Evolução Clínica / Anotações</label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descreva detalhadamente a evolução clínica, materiais utilizados ou orientações pós-operatórias dadas..."
                      rows={5}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all resize-none text-xs leading-relaxed"
                    />
                  </div>

                  {/*  Checkbox de controle de orçamento dinâmico */}
                  <label className="flex items-center gap-2 p-2.5 bg-gray-50 hover:bg-gray-100/50 rounded-xl transition-all cursor-pointer text-xs font-bold text-gray-500 select-none">
                    <input
                      type="checkbox"
                      checked={isBudget}
                      onChange={(e) => setIsBudget(e.target.checked)}
                      className="w-4 h-4 text-dentistry-teal rounded border-gray-300 focus:ring-mint-clean accent-dentistry-teal transition-all cursor-pointer"
                    />
                    <span>Apenas Avaliação / Orçamento (Não gera cobrança)</span>
                  </label>

                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full bg-dentistry-teal text-white font-bold py-2.5 rounded-xl text-sm shadow-md hover:shadow-lg hover:bg-dentistry-teal/90 transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} /> Assinar Atendimento
                  </button>
                </form>
              </div>

              {/* REPOSICIONAMENTO DA ANAMNESE INTERATIVA */}
              <ClinicalAnamnese patientId={activePatient.patientId} />

              {/* BLOCO 3: TIMELINE HISTÓRICA DE PROCEDIMENTOS */}
              <ClinicalTimeline records={historyRecords} />
              
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

