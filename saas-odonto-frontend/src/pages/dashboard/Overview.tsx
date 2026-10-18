import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, ArrowDownCircle, Users, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast'; 
import { api } from '../../services/api';
import { BentoCard } from '../../components/BentoCard';

export default function Overview() {
  const [balance, setBalance] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });
  const [patients, setPatients] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados nascem vazios para forçar a secretária a escolher!
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedProcedureId, setSelectedProcedureId] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const balanceResponse = await api.get('/financial-transactions/balance');
      setBalance({
        totalIncome: Number(balanceResponse.data.totalIncome || 0),
        totalExpense: Number(balanceResponse.data.totalExpense || 0),
        netBalance: Number(balanceResponse.data.netBalance || 0)
      });

      const patientsResponse = await api.get('/patients');
      setPatients(patientsResponse.data);

      const proceduresResponse = await api.get('/dental-procedures');
      setProcedures(proceduresResponse.data);
    } catch (err) {
      console.error('Erro ao consolidar indicadores da dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSignMedicalRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de segurança extra para impedir envio das opções padrões vazias
    if (!selectedPatientId) {
      toast.error('Por favor, selecione um paciente válido.');
      return;
    }
    if (!selectedProcedureId) {
      toast.error('Por favor, selecione um procedimento do catálogo.');
      return;
    }
    if (isSubmitting || !description) return;

    try {
      setIsSubmitting(true);

      await api.post('/medical-records', {
        patientId: selectedPatientId.toString(),
        procedureId: selectedProcedureId.toString(),
        professionalId: "3", // ID do Dr. Anderson Silva
        description: description
      });

      // Balão flutuante de sucesso no topo direito!
      toast.success('Prontuário assinado e faturamento injetado!');
      setDescription('');
      
      // Reseta os seletores para o padrão limpo após salvar
      setSelectedPatientId('');
      setSelectedProcedureId('');
      
      await fetchDashboardData();
    } catch (err: any) {
      console.error('Erro ao salvar evolução clínica:', err);
      const apiMessage = err.response?.data?.message;
      
      // Balão flutuante vermelho de erro dinâmico da API!
      toast.error(typeof apiMessage === 'string' ? apiMessage : 'Erro ao processar assinatura.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div>
        <h1 className="text-3xl font-extrabold text-deep-obsidian tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back • <span className="font-semibold text-mint-clean">Sorriso Perfeito Clinic</span>
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl" />
          ))}
        </div>
      ) : (
        /* indicators grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <BentoCard title="Faturamento Total" value={`R$ ${balance.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} description="Gatilhos de prontuário ativos" type="income" icon={<TrendingUp size={20} />} />
          <BentoCard title="Despesas Operacionais" value={`R$ ${balance.totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} description="Custo de saída corporativo" type="expense" icon={<ArrowDownCircle size={20} />} />
          <BentoCard title="Saldo Líquido em Caixa" value={`R$ ${balance.netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} description="Balanço líquido de caixa" type={balance.netBalance >= 0 ? 'income' : 'expense'} icon={<DollarSign size={20} />} />
          <BentoCard title="Pacientes Ativos" value={patients.length} description="Registros no Postgres" icon={<Users size={20} />} />
        </div>
      )}

      {/* 🩺 REGISTRO CLÍNICO AUTOMATIZADO */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-deep-obsidian mb-4 flex items-center gap-2">
          <FileSpreadsheet size={18} className="text-dentistry-teal" /> Assinar Evolução Clínica (Prontuário Eletrônico)
        </h3>
        
        <form onSubmit={handleSignMedicalRecord} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Seletor de Paciente com Opção Padrão de Bloqueio */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Paciente Atendido
              </label>
              <select
                required
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all cursor-pointer"
              >
                <option value="">-- Selecione o Paciente Atendido --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id.toString()}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Seletor de Procedimento com Opção Padrão de Bloqueio */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Procedimento Concluído
              </label>
              <select
                required
                value={selectedProcedureId}
                onChange={(e) => setSelectedProcedureId(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all cursor-pointer"
              >
                <option value="">-- Selecione o Procedimento Realizado --</option>
                {procedures.map((proc) => (
                  <option key={proc.id} value={proc.id.toString()}>
                    {proc.name} — R\$ {Number(proc.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Evolução e Diagnóstico Clínico
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva detalhadamente o tratamento efetuado no paciente. A assinatura digital irá registrar os valores automaticamente..."
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || patients.length === 0}
              className="bg-dentistry-teal text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-lg hover:bg-dentistry-teal/90 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? 'Assinando Digitalmente...' : 'Assinar e Registrar Prontuário'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
