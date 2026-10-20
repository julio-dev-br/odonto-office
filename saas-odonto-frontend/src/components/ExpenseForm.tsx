import React, { useState } from 'react';
import { ArrowDownCircle, Plus, DollarSign } from 'lucide-react';

interface ExpenseFormProps {
  onAddExpense: (expense: any) => void;
}

export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !dueDate) return;

    // Dispara a payload limpa de saída que o nosso backend espera ler
    onAddExpense({
      description,
      amount: Number(amount),
      type: 'EXPENSE', // Cravado como saída!
      dueDate: new Date(dueDate).toISOString()
    });

    // Limpa os campos do formulário pós-envio
    setDescription('');
    setAmount('');
    setDueDate('');
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-fit">
      <h2 className="text-base font-bold text-deep-obsidian mb-4 flex items-center gap-2">
        <Plus size={18} className="text-red-500" /> Registrar Despesa / Saída
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Descrição do Custo */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Descrição do Gasto
          </label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Conta de Luz, Fornecedor de Luvas..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-red-400 focus:bg-white transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Valor Monetário */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <DollarSign size={12} /> Valor (R$)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-red-400 focus:bg-white transition-all font-mono"
            />
          </div>

          {/* Vencimento */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Data de Vencimento
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-red-400 focus:bg-white transition-all cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <ArrowDownCircle size={16} /> Lançar Saída de Caixa
        </button>
      </form>
    </div>
  );
}
