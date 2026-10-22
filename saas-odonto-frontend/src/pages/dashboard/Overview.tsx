import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, ArrowDownCircle, Users, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import { BentoCard } from '../../components/BentoCard';
import { FinancialChart } from '../../components/FinancialChart';

export default function Overview() {
  const navigate = useNavigate();

  const [balance, setBalance] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });
  const [patients, setPatients] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedProcedureId, setSelectedProcedureId] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [chartData, setChartData] = useState<any[]>([]);

  const token = localStorage.getItem('@OdontoOffice:token');
  const tenantIdHeader = localStorage.getItem('@OdontoOffice:tenantId') || '1';
  
  let loggedProfessionalId: string | null = null;

  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const payload = JSON.parse(jsonPayload);
      
      if (payload.sub && payload.sub.toString() === "3") {
        loggedProfessionalId = "1"; 
      } else {
        loggedProfessionalId = payload.professionalId ? payload.professionalId.toString() : "1";
      }
    } catch (e) {
      console.error('Erro ao decodificar token de sessão:', e);
    }
  }

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const config = {
        headers: { 'X-Tenant-ID': tenantIdHeader }
      };

      const balanceResponse = await api.get('/financial-transactions/balance', config);
      setBalance({
        totalIncome: Number(balanceResponse.data.totalIncome || 0),
        totalExpense: Number(balanceResponse.data.totalExpense || 0),
        netBalance: Number(balanceResponse.data.netBalance || 0)
      });

      const patientsResponse = await api.get('/patients', config);
      setPatients(patientsResponse.data);

      const proceduresResponse = await api.get('/dental-procedures', config);
      setProcedures(proceduresResponse.data);

      const chartResponse = await api.get('/financial-transactions/chart', config);
      setChartData(chartResponse.data || []);

    } catch (err) {
      console.error('Erro ao consolidar indicadores da dashboard:', err);
      toast.error('Falha ao sincronizar indicadores com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !loggedProfessionalId) {
      toast.error('Sessão expirada ou inválida. Por favor, refaça o login.');
      localStorage.clear();
      navigate('/login');
    }
  }, [token, loggedProfessionalId, navigate]);

  useEffect(() => {
    if (token && loggedProfessionalId) {
      fetchDashboardData();
    }
  }, [token, loggedProfessionalId]);


  const handleSignMedicalRecord = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loggedProfessionalId) {
      toast.error('Assinatura digital bloqueada por falta de credenciais.');
      navigate('/login');
      return;
    }

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
        professionalId: loggedProfessionalId,
        description: description
      }, {
        headers: { 'X-Tenant-ID': tenantIdHeader }
      });

      toast.success('Prontuário assinado e faturamento injetado!');
      setDescription('');
      setSelectedPatientId('');
      setSelectedProcedureId('');

      await fetchDashboardData();
    } catch (err: any) {
      console.error('Erro ao salvar evolução clínica:', err);
      const apiMessage = err.response?.data?.message;
      toast.error(typeof apiMessage === 'string' ? apiMessage : 'Erro ao processar assinatura.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header */}
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
        /* Indicators Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <BentoCard title="Faturamento Total" value={`R$ ${balance.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} description="Gatilhos de prontuário ativos" type="income" icon={<TrendingUp size={20} />} />
          <BentoCard title="Despesas Operacionais" value={`R$ ${balance.totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} description="Custo de saída corporativo" type="expense" icon={<ArrowDownCircle size={20} />} />
          <BentoCard title="Saldo Líquido em Caixa" value={`R$ ${balance.netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} description="Balanço líquido de caixa" type={balance.netBalance >= 0 ? 'income' : 'expense'} icon={<DollarSign size={20} />} />
          <BentoCard title="Pacientes Ativos" value={patients.length} description="Registros no Postgres" icon={<Users size={20} />} />
        </div>
      )}

      {/* GRÁFICO DE EVOLUÇÃO FINANCEIRA */}
      {!isLoading && <FinancialChart data={chartData} />}

      {/* REGISTRO CLÍNICO AUTOMATIZADO */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-deep-obsidian mb-4 flex items-center gap-2">
          <FileSpreadsheet size={18} className="text-dentistry-teal" /> Assinar Evolução Clínica (Prontuário Eletrônico)
        </h3>

        <form onSubmit={handleSignMedicalRecord} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Paciente Atendido
              </label>
              <select required value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all cursor-pointer">
                <option value="">-- Selecione o Paciente Atendido --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id.toString()}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Procedimento Concluído
              </label>
              <select required value={selectedProcedureId} onChange={(e) => setSelectedProcedureId(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all cursor-pointer">
                <option value="">-- Selecione o Procedimento Realizado --</option>
                {procedures.map((proc) => (
                  <option key={proc.id} value={proc.id.toString()}>{proc.name} — R$ {Number(proc.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Evolução e Diagnóstico Clínico
            </label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva detalhadamente o tratamento efetuado no paciente..." rows={3} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all resize-none" />
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={isSubmitting || patients.length === 0} className="bg-dentistry-teal text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-lg hover:bg-dentistry-teal/90 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2">
              {isSubmitting ? 'Assinando Digitalmente...' : 'Assinar e Registrar Prontuário'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
