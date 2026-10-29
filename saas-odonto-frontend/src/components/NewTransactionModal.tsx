import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, DollarSign, Calendar, FileText, Layers, User, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

// 🛡️ ESQUEMA DE VALIDAÇÃO ZOD ATUALIZADO COM OS RELACIONAMENTOS DO POSTGRES
const transactionSchema = z.object({
  description: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  amount: z.coerce.number().positive('O valor deve ser maior que zero'),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1, 'Selecione uma categoria'),
  dueDate: z.string().min(1, 'Insira a data de vencimento'),
  status: z.enum(['pending', 'paid']),
  paymentMethod: z.string().optional().nullable(),
  totalInstallments: z.coerce.number().min(1, 'Mínimo de 1 parcela').default(1),
  patientId: z.string().optional().nullable(),   // ID real do paciente no Postgres
  treatmentId: z.string().optional().nullable(), // ID real do procedimento no Postgres
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => Promise<void> | void;
}

export function NewTransactionModal({ isOpen, onClose, onSuccess }: NewTransactionModalProps) {
  // 🚀 ESTADOS DE CARGA DE DADOS DO BACKEND
  const [patients, setPatients] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<any[]>([]);
  const [searchPatientTerm, setSearchPatientTerm] = useState('');

  const [showPatientDropdown, setShowPatientDropdown] = useState(false);


  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      type: 'INCOME',
      status: 'pending',
      totalInstallments: 1,
      category: 'treatment',
      paymentMethod: '',
      patientId: '',
      treatmentId: '',
    },
  });

  const watchType = watch('type');
  const watchStatus = watch('status');

  // 📥 CARGA DINÂMICA: Puxa os dados dos nossos novos serviços NestJS homologados
  useEffect(() => {
    if (isOpen) {
      const loadModalData = async () => {
        try {
          const [patientsRes, proceduresRes] = await Promise.all([
            api.get('/financial-transactions/search/patients'),
            api.get('/financial-transactions/search/procedures')
          ]);
          setPatients(patientsRes.data);
          setProcedures(proceduresRes.data);
        } catch (err) {
          console.error('Erro ao carregar dados do modal financeiro:', err);
        }
      };
      loadModalData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: TransactionFormData) => {
    try {
      await onSuccess(data);
      reset();
      onClose();
      setSearchPatientTerm('');
    } catch (err) {
      console.error('Erro ao submeter formulário financeiro:', err);
    }
  };

  // 🔍 FILTRO REATIVO: Filtra os pacientes digitados em tempo real na tela
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchPatientTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-gray-100 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Cabeçalho */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-deep-obsidian flex items-center gap-2">
              <DollarSign className={watchType === 'INCOME' ? 'text-emerald-500' : 'text-rose-500'} size={22} />
              Novo Lançamento Financeiro
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Mapeamento inteligente de receitas clínicas e despesas DRE.</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Corpo do Formulário com Scroll Interno caso precise */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Seletor de Tipo Transação */}
          <div className="grid grid-cols-2 gap-4">
            <label className={`p-3 border rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider cursor-pointer transition-all ${
              watchType === 'INCOME' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'border-gray-200 text-gray-400'
            }`}>
              <input type="radio" value="INCOME" {...register('type')} onClick={() => setValue('category', 'treatment')} className="hidden" />
              📈 Receita / Entrada
            </label>
            <label className={`p-3 border rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider cursor-pointer transition-all ${
              watchType === 'EXPENSE' ? 'bg-rose-50 border-rose-300 text-rose-700' : 'border-gray-200 text-gray-400'
            }`}>
              <input type="radio" value="EXPENSE" {...register('type')} onClick={() => setValue('category', 'rent')} className="hidden" />
              📉 Despesa / Saída
            </label>
          </div>
          {/* 🔍 SEÇÃO CONDICIONAL: SE FOR RECEITA (INCOME), ABRE VÍNCULO DE PACIENTE E TRATAMENTO */}
          {watchType === 'INCOME' && (
            <div className="space-y-4 border border-emerald-100 bg-emerald-50/20 p-4 rounded-2xl animate-fade-in">
              
              {/* Select Dinâmico com Input de Busca para Pacientes */}
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-wide flex items-center gap-1">
                  <User size={12} /> Vincular Paciente (Opcional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Digite para buscar o paciente..."
                    value={searchPatientTerm}
                    onChange={(e) => {
                      setSearchPatientTerm(e.target.value);
                      setShowPatientDropdown(true); // 🔓 Abre a lista ao digitar
                    }}
                    onFocus={() => setShowPatientDropdown(true)} // Abre ao focar no campo
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-dentistry-teal transition-all mb-1"
                  />
                  
                  {/* 🚀 INTELIGÊNCIA DE CORTE: Só exibe se houver texto E o gatilho estiver ativo */}
                  {/* 🚀 INTELIGÊNCIA DE CORTE: Posicionamento absoluto calibrado para cair reto abaixo do input */}
                  {showPatientDropdown && searchPatientTerm.length > 0 && (
                    <select
                      {...register('patientId')}
                      size={Math.min(filteredPatients.length + 1, 4)}
                      className="absolute left-0 top-full z-20 w-full bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-dentistry-teal p-1 shadow-xl max-h-32 overflow-y-auto mt-1"
                      onChange={(e) => {
                        const selectedPatient = filteredPatients.find(p => p.id.toString() === e.target.value);
                        if (selectedPatient) {
                          setSearchPatientTerm(selectedPatient.name);
                          setShowPatientDropdown(false); // Fecha a lista
                        }
                      }}
                    >
                      {filteredPatients.map((p) => (
                        <option key={p.id} value={p.id.toString()} className="p-2 cursor-pointer hover:bg-slate-50 rounded-lg">
                          {p.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              {/* Select de Procedimento Cobrado */}
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-wide flex items-center gap-1">
                  <ShieldCheck size={12} /> Procedimento Odontológico Cadastrado
                </label>
                <select
                  {...register('treatmentId')}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-dentistry-teal transition-all"
                  onChange={(e) => {
                    const proc = procedures.find(p => p.id.toString() === e.target.value);
                    if (proc) {
                      setValue('amount', Number(proc.price)); // 🚀 CORRIGIDO!
                      setValue('description', `Tratamento: ${proc.name}`);
                    }
                  }}
                >
                  <option value="">-- Selecione o Procedimento --</option>
                  {procedures.map((proc) => (
                    <option key={proc.id} value={proc.id.toString()}>
                      {proc.name} (R$ {Number(proc.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) {/* 🚀 CORRIGIDO! */}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {/* Input: Descrição da Transação */}
          <div className="space-y-1">
            <label className="text-xs font-black text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <FileText size={12} /> Descrição / Histórico do Lançamento
            </label>
            <input 
              type="text" 
              {...register('description')} 
              placeholder="Ex: Aluguel da Sala Comercial ou Tratamento Clínico" 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-dentistry-teal transition-all" 
            />
            {errors.description && <p className="text-xs text-rose-500 font-semibold">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Input: Valor Total */}
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-wide flex items-center gap-1">
                <DollarSign size={12} /> Valor Total (R$)
              </label>
              <input 
                type="number" 
                step="0.01" 
                {...register('amount')} 
                placeholder="0.00" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-dentistry-teal transition-all" 
              />
              {errors.amount && <p className="text-xs text-rose-500 font-semibold">{errors.amount.message}</p>}
            </div>
            {/* Input: Número de Parcelas */}
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-wide flex items-center gap-1">
                <Layers size={12} /> Número de Parcelas
              </label>
              <input 
                type="number" 
                {...register('totalInstallments')} 
                min="1" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-dentistry-teal transition-all" 
              />
              {errors.totalInstallments && <p className="text-xs text-rose-500 font-semibold">{errors.totalInstallments.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* CATEGORIAS CONDICIONAIS DE ACORDO COM O TIPO (DRE INTELLIGENT) */}
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-wide">Categoria DRE</label>
              <select {...register('category')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-dentistry-teal transition-all">
                {watchType === 'INCOME' ? (
                  <>
                    <option value="treatment">📈 Tratamento Clínico</option>
                    <option value="rent_income">📈 Sublocação de Sala</option>
                    <option value="outros">📈 Outras Receitas</option>
                  </>
                ) : (
                  <>
                    <option value="rent">📉 Aluguel / Condomínio</option>
                    <option value="utilities">📉 Água / Luz / Internet</option>
                    <option value="materials">📉 Materiais Odontológicos</option>
                    <option value="salaries">📉 Salários / Comissões</option>
                    <option value="marketing">📉 Campanhas / Redes Sociais</option>
                    <option value="outros">📉 Outras Despesas</option>
                  </>
                )}
              </select>
            </div>

            {/* Input: Vencimento */}
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-wide flex items-center gap-1">
                <Calendar size={12} /> Vencimento
              </label>
              <input 
                type="date" 
                {...register('dueDate')} 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-dentistry-teal transition-all" 
              />
              {errors.dueDate && <p className="text-xs text-rose-500 font-semibold">{errors.dueDate.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Select: Situação */}
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-wide">Situação</label>
              <select {...register('status')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-dentistry-teal transition-all">
                <option value="pending">🟡 Pendente / Em Aberto</option>
                <option value="paid">🟢 Pago / Liquidado</option>
              </select>
            </div>

            {/* Select: Forma de Liquidação */}
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-wide">Forma de Recebimento</label>
              <select 
                {...register('paymentMethod')} 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-dentistry-teal transition-all"
              >
                <option value="">Selecione...</option>
                <option value="pix">Pix</option>
                <option value="credit_card">Cartão de Crédito</option>
                <option value="debit_card">Cartão de Débito</option>
                <option value="cash">Dinheiro em Espécie</option>
                <option value="boleto">Boleto Bancário</option>
              </select>
            </div>
          </div>

          {/* Rodapé do Formulário / Ações */}
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-2 shrink-0">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-deep-obsidian text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-5 py-2 bg-dentistry-teal hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
            >
              {isSubmitting ? 'Registrando...' : 'Confirmar Lançamento'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
