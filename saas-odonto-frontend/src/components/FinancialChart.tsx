import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FinancialChartProps {
  data: Array<{ month: string; faturamento: number; despesas: number }>;
}

export function FinancialChart({ data }: FinancialChartProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-[350px] w-full flex flex-col justify-between transition-all">
      {/* Topo do Bloco do Gráfico */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-deep-obsidian">Evolução Mensal do Caixa</h3>
        <p className="text-xs text-gray-400 mt-0.5">Balanço comparativo entre receitas automáticas e despesas lançadas.</p>
      </div>

      {/* Container Responsivo do Recharts */}
      <div className="flex-1 w-full text-xs font-medium font-mono">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            {/* Grid de fundo discreto */}
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" className="dark:stroke-slate-700/50" vertical={false} />
            
            {/* Eixos X e Y formatados */}
            <XAxis dataKey="month" stroke="#94A3B8" tickLine={false} axisLine={false} className="dark:fill-slate-400" />
            <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} tickFormatter={(v) => `R$ ${v}`} />
            
            {/* Caixa de Tooltip flutuante ao passar o mouse sobre as barras */}
            <Tooltip 
              cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }}
              contentStyle={{
                backgroundColor: 'var(--color-bg-white, #FFFFFF)',
                borderColor: 'var(--color-border-gray, #E2E8F0)',
                borderRadius: '0.75rem',
                fontSize: '11px',
                fontWeight: 'bold',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR')}`]}
            />
            
            {/* 💎 BARRA 1: FATURAMENTO (Injetado com a nossa cor Mint Clean!) */}
            <Bar dataKey="faturamento" fill="#10B981" radius={[4, 4, 0, 0]} barSize={24} name="Faturamento" />
            
            {/* 💎 BARRA 2: DESPESAS (Injetado com tom vermelho sutil) */}
            <Bar dataKey="despesas" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={24} name="Despesas" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
