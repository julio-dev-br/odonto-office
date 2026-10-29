import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, ArrowDownCircle, CheckCircle2, Clock, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import { BentoCard } from '../../components/BentoCard';
import { NewTransactionModal } from '../../components/NewTransactionModal';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  status: 'pending' | 'paid' | 'overdue';
  category: string;
  installment: number;
  totalInstallments: number;
  dueDate: string;
  paymentMethod?: string;
}

export default function Financial() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // 🚀 ESTADO ADICIONADO: Controla a abertura do modal de lançamentos premium
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFinancialData = async () => {
    try {
      setIsLoading(true);

      const txResponse = await api.get('/financial-transactions');
      const formattedTx = txResponse.data.map((tx: any) => ({
        id: tx.id.toString(),
        description: tx.description,
        amount: Number(tx.amount),
        type: tx.type,
        status: tx.status,
        category: tx.category || 'outros',
        installment: tx.installment || 1,
        totalInstallments: tx.totalInstallments || 1,
        dueDate: new Date(tx.dueDate).toLocaleDateString('pt-BR'),
        paymentMethod: tx.paymentMethod || '-'
      }));
      setTransactions(formattedTx);

      const balanceResponse = await api.get('/financial-transactions/balance');
      setBalance({
        totalIncome: Number(balanceResponse.data.totalIncome || 0),
        totalExpense: Number(balanceResponse.data.totalExpense || 0),
        netBalance: Number(balanceResponse.data.netBalance || 0)
      });
    } catch (err) {
      console.error('Erro ao buscar fluxo de caixa:', err);
      toast.error('Falha ao sincronizar fluxo de caixa.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  // 🚀 FUNÇÃO CONECTADA: Dispara o payload do Zod direto para o motor de parcelamento do NestJS
  const handleCreateTransaction = async (formData: any) => {
    try {
      await api.post('/financial-transactions', formData);
      toast.success(
        formData.totalInstallments > 1
          ? `${formData.totalInstallments} parcelas geradas com sucesso!`
          : 'Lançamento financeiro operado com sucesso!'
      );
      await fetchFinancialData();
    } catch (err) {
      console.error('Erro ao processar transação:', err);
      toast.error('Não foi possível processar o lançamento financeiro.');
      throw err;
    }
  };

  const handleProcessPayout = async (id: string) => {
    try {
      await api.put(`/financial-transactions/${id}/pay`, { paymentMethod: 'pix' });
      toast.success('Lançamento liquidado com sucesso!');
      await fetchFinancialData();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao registrar baixa financeira.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header com Botão Mestre de Lançamentos */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-deep-obsidian tracking-tight flex items-center gap-3">
            <DollarSign className="text-mint-clean" size={32} /> Livro Razão & Fluxo de Caixa
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Controle integrado de receitas operacionais por tratamentos e lançamentos de despesas recorrentes.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-fit flex items-center gap-2 px-5 py-2.5 bg-dentistry-teal hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <PlusCircle size={16} /> Novo Lançamento
        </button>
      </div>

      {/* INDICADORES EM TEMPO REAL DO POSTGRES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BentoCard title="Faturamento Bruto (Entradas)" value={`R$ ${balance.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} description="Receitas operacionais ativas" type="income" icon={<TrendingUp size={20} />} />
        <BentoCard title="Despesas Operacionais (Saídas)" value={`R$ ${balance.totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} description="Custos e saídas avulsas" type="expense" icon={<ArrowDownCircle size={20} />} />
        <BentoCard title="Saldo Líquido em Caixa" value={`R$ ${balance.netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} description="Balanço consolidado dinâmico" type={balance.netBalance >= 0 ? 'income' : 'expense'} icon={<DollarSign size={20} />} />
      </div>
      {/* EXTRATO AMPLO DE MOVIMENTAÇÕES COMPLETO */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden w-full">
        <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-deep-obsidian uppercase tracking-wider">
            Extrato Consolidado de Contas e Lançamentos ({transactions.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-sm text-gray-400 font-medium animate-pulse">
            Sincronizando extrato bancário com o Postgres...
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400 font-medium italic">
            Nenhuma movimentação financeira registrada para esta clínica.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase bg-gray-50/20">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Descrição</th>
                  <th className="py-4 px-6">Categoria DRE</th>
                  <th className="py-4 px-6">Parcela</th>
                  <th className="py-4 px-6">Valor</th>
                  <th className="py-4 px-6">Forma</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Vencimento</th>
                  <th className="py-4 px-6 text-right">Ações de Caixa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-medium text-deep-obsidian">
                {transactions.map((tx) => {
                  const isPaid = tx.status === 'paid';
                  const isIncome = tx.type === 'INCOME';
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-gray-400 text-xs font-mono">#{tx.id}</td>
                      <td className="py-4 px-6 font-bold text-gray-900">{tx.description}</td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 capitalize">
                          {tx.category === 'treatment' ? 'Tratamento' :
                            tx.category === 'rent' ? 'Aluguel' :
                              tx.category === 'utilities' ? 'Água/Luz/Net' :
                                tx.category === 'materials' ? 'Materiais' :
                                  tx.category === 'salaries' ? 'Salários' : tx.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-500 font-mono">
                        {tx.totalInstallments > 1 ? `${tx.installment}/${tx.totalInstallments}` : 'À vista'}
                      </td>
                      <td className={`py-4 px-6 font-mono text-xs font-bold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isIncome ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-4 px-6 text-xs font-bold uppercase tracking-wide">
                        {tx.paymentMethod === 'pix' && <span className="text-teal-600">⚡ Pix</span>}
                        {tx.paymentMethod === 'credit_card' && <span className="text-blue-600">💳 C. Crédito</span>}
                        {tx.paymentMethod === 'debit_card' && <span className="text-indigo-600">🪪 C. Débito</span>}
                        {tx.paymentMethod === 'cash' && <span className="text-emerald-600">💵 Dinheiro</span>}
                        {tx.paymentMethod === 'boleto' && <span className="text-amber-600">📄 Boleto</span>}
                        {(!tx.paymentMethod || tx.paymentMethod === '-') && <span className="text-gray-400 font-normal italic">-</span>}
                      </td>

                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit ${isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                          {isPaid ? 'Pago' : 'Pendente'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-400 text-xs font-mono">{tx.dueDate}</td>
                      <td className="py-4 px-6 text-right">
                        {!isPaid ? (
                          <button
                            onClick={() => handleProcessPayout(tx.id)}
                            className={`text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer ${isIncome
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                : 'bg-rose-500 hover:bg-rose-600 text-white'
                              }`}
                          >
                            {isIncome ? 'Receber' : 'Pagar'}
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-gray-400 italic flex items-center justify-end gap-1">
                            <CheckCircle2 size={14} className="text-green-500" /> Liquidado
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

      {/* 🚀 COMPONENTE ACOPLADO: Modal Premium Reativo com Validação Zod */}
      <NewTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateTransaction}
      />

    </div>
  );
}
