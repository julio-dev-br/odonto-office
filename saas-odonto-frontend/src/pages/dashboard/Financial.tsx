import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, ArrowDownCircle, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast'; 
import { api } from '../../services/api';
import { BentoCard } from '../../components/BentoCard';
import { ExpenseForm } from '../../components/ExpenseForm'; 
interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  status: 'pending' | 'paid';
  dueDate: string;
  paymentMethod?: string;
}

export default function Financial() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const handleCreateExpense = async (expenseData: any) => {
    try {
      await api.post('/financial-transactions', {
        ...expenseData,
        status: 'paid',
        paymentMethod: 'pix'
      });

      toast.success('Despesa operada e debitada do caixa!');
      await fetchFinancialData(); 
    } catch (err) {
      console.error('Erro ao registrar despesa avulsa:', err);
      toast.error('Não foi possível processar lançamento de custo.');
    }
  };

  const handleProcessPayout = async (id: string) => {
    try {
      await api.put(`/financial-transactions/${id}/pay`, { paymentMethod: 'pix' });
      toast.success('Pagamento liquidado com sucesso!');
      await fetchFinancialData();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao registrar baixa.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-deep-obsidian tracking-tight flex items-center gap-3">
          <DollarSign className="text-mint-clean" size={32} /> Financial Ledger & Cash Flow
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Controle de entradas por prontuário e lançamento integrado de saídas e custos fixos.
        </p>
      </div>

      {/* INDICADORES EM TEMPO REAL DO POSTGRES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BentoCard title="Faturamento Bruto (Entradas)" value={`R$ ${balance.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} description="Receitas operacionais ativas" type="income" icon={<TrendingUp size={20} />} />
        <BentoCard title="Despesas Operacionais (Saídas)" value={`R$ ${balance.totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} description="Custos e saídas avulsas" type="expense" icon={<ArrowDownCircle size={20} />} />
        <BentoCard title="Saldo Líquido em Caixa" value={`R$ ${balance.netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} description="Balanço consolidado dinâmico" type={balance.netBalance >= 0 ? 'income' : 'expense'} icon={<DollarSign size={20} />} />
      </div>

      {/* GRID DA SPRINT: Formulário de Entrada + Tabela Lado a Lado */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Coluna do Form (4 Módulos) */}
        <div className="lg:col-span-4">
          <ExpenseForm onAddExpense={handleCreateExpense} />
        </div>

        {/* Coluna da Tabela de Movimentações (8 Módulos) */}
        <div className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden h-fit">
          <div className="p-5 border-b border-gray-50 bg-gray-50/50">
            <h3 className="text-sm font-bold text-deep-obsidian uppercase tracking-wider">
              Extrato de Contas e Lançamentos ({transactions.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-sm text-gray-400 font-medium animate-pulse">
              Sincronizando extrato bancário...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase bg-gray-50/20">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Descrição</th>
                    <th className="py-4 px-6">Valor</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Vencimento</th>
                    <th className="py-4 px-6 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm font-medium text-deep-obsidian">
                  {transactions.map((tx) => {
                    const isPaid = tx.status === 'paid';
                    const isIncome = tx.type === 'INCOME';
                    return (
                      <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 text-gray-400 text-xs">#{tx.id}</td>
                        <td className="py-4 px-6 font-bold">{tx.description}</td>
                        <td className={`py-4 px-6 font-mono text-xs ${isIncome ? 'text-mint-clean font-bold' : 'text-red-500'}`}>
                          {isIncome ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit ${
                            isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-400 text-xs">{tx.dueDate}</td>
                        <td className="py-4 px-6 text-right">
                          {!isPaid && isIncome && (
                            <button onClick={() => handleProcessPayout(tx.id)} className="bg-mint-clean text-deep-obsidian text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-sm hover:bg-mint-clean/90 transition-all cursor-pointer">
                              Receber
                            </button>
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

    </div>
  );
}
