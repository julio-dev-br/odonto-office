import { useState, useEffect } from 'react';
import { FileText, User, ShieldAlert, Heart, Activity, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import { AnamneseForm } from '../../components/AnamneseForm';
import { TableSkeleton } from '../../components/TableSkeleton';

export default function Anamnese() {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [activeAnamnese, setActiveAnamnese] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // FUNÇÃO DE LEITURA: Busca a lista de pacientes e o histórico de anamnese
  const loadPatients = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (err) {
      console.error('Erro ao carregar pacientes para anamnese:', err);
      toast.error('Falha ao sincronizar prontuários da clínica.');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔍 BUSCA SE O PACIENTE SELECIONADO JÁ POSSUI FICHA SALVA NO BANCO
  const fetchPatientAnamnese = async (patientId: string) => {
    if (!patientId) {
      setActiveAnamnese(null);
      return;
    }
    try {
      // Bate na nossa rota relacional controlada por clínica do backend NestJS
     const response = await api.get(`/anamnese/patient/${patientId}`);
      setActiveAnamnese(response.data || null);
    } catch (err) {
      // Se retornar 404 significa que o paciente está limpo e sem ficha cadastrada ainda
      setActiveAnamnese(null);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    fetchPatientAnamnese(selectedPatientId);
  }, [selectedPatientId]);

  // 📤 FUNÇÃO DE GRAVAÇÃO REAL (POST): Grava a anamnese física no Postgres via Axios
  const handleSaveAnamnese = async (formData: any) => {
    if (!selectedPatientId) {
      toast.error('Por favor, selecione um paciente primeiro.');
      return;
    }

    try {
      await api.post('/anamnese', {
        patientId: selectedPatientId.toString(),
        ...formData
      });

      toast.success('Ficha de Anamnese gravada no Postgres!');
      // Recarrega o contexto clínico do paciente na mesma hora
      await fetchPatientAnamnese(selectedPatientId);
    } catch (err: any) {
      console.error(err);
      const apiMessage = err.response?.data?.message;
      toast.error(typeof apiMessage === 'string' ? apiMessage : 'Erro ao salvar ficha clínica.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-deep-obsidian tracking-tight flex items-center gap-3">
          <FileText className="text-mint-clean" size={32} /> Ficha de Anamnese Interativa
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Histórico médico e mapeamento de riscos sistêmicos para segurança do ato cirúrgico odontológico.
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LADO ESQUERDO: SELETOR DE CONTEXTO DO PACIENTE (4 Colunas) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <User size={14} /> Selecionar Paciente em Atendimento
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all cursor-pointer"
              >
                <option value="">-- Escolha o Paciente --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id.toString()}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* 🛡️ PAINEL OPERACIONAL DE RISCO: Alertas piscam aqui se o paciente tiver condições críticas! */}
            {activeAnamnese && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-deep-obsidian uppercase tracking-wider border-b border-gray-50 pb-2">
                  Alertas Críticos de Segurança
                </h4>
                
                <div className="space-y-2.5 text-xs font-bold">
                  {activeAnamnese.hasAllergy && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 animate-pulse">
                      <ShieldAlert size={16} /> Alergia Ativa: {activeAnamnese.allergyDetails}
                    </div>
                  )}
                  {activeAnamnese.isHypertensive && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-100">
                      <Activity size={16} /> Paciente Hipertenso (Risco de P.A)
                    </div>
                  )}
                  {activeAnamnese.hasHeartDisease && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl border border-red-100">
                      <Heart size={16} /> Cardiopata (Atenção Anestésica!)
                    </div>
                  )}
                  {activeAnamnese.bleedingHistory && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl border border-red-100">
                      <AlertTriangle size={16} /> Histórico de Hemorragias
                    </div>
                  )}
                  {activeAnamnese.continuousMedication !== 'Nenhum' && (
                    <div className="p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 font-medium">
                      <span className="font-bold">Uso Contínuo:</span> {activeAnamnese.continuousMedication}
                    </div>
                  )}
                  {!activeAnamnese.hasAllergy && !activeAnamnese.isHypertensive && !activeAnamnese.hasHeartDisease && !activeAnamnese.bleedingHistory && (
                    <div className="text-center py-4 text-emerald-600 bg-emerald-50 rounded-xl border border-emerald-100">
                      Paciente sem restrições sistêmicas relatadas.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* LADO DIREITO: INTERFACE FORMULÁRIO OU CONFIRMAÇÃO (8 Colunas) */}
          <div className="lg:col-span-8">
            {!selectedPatientId ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-sm text-gray-400 font-medium italic h-full flex items-center justify-center">
                Selecione um paciente na barra lateral para carregar ou preencher a Ficha de Anamnese.
              </div>
            ) : activeAnamnese ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center space-y-4 h-full flex flex-col items-center justify-center">
                <div className="p-4 bg-emerald-50 text-mint-clean rounded-2xl w-fit">
                  <FileText size={40} />
                </div>
                <h3 className="text-lg font-extrabold text-deep-obsidian">Anamnese já respondida e assinada!</h3>
                <p className="text-sm text-gray-400 max-w-sm mx-auto">
                  Este registro clínico foi consolidado e criptografado com chaves relacionais no Postgres. Os alertas operacionais estão ativos no menu lateral.
                </p>
              </div>
            ) : (
              <AnamneseForm onSaveAnamnese={handleSaveAnamnese} />
            )}
          </div>

        </div>
      )}

    </div>
  );
}
