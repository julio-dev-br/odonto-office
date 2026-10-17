import { DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import { BentoCard } from '../../components/BentoCard';
 

export default function Overview() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner de Boas-vindas */}
      <div>
        <h1 className="text-3xl font-extrabold text-deep-obsidian tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Acompanhe em tempo real os indicadores clínicos e o faturamento automatizado da sua clínica.
        </p>
      </div>

      {/* Bento Grid Layout — Renderizando os nossos Cards com a Tipografia Inter Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BentoCard 
          title="Faturamento Total" 
          value="R$ 850,00" 
          description="Gatilhos de prontuário hoje" 
          type="income"
          icon={<TrendingUp size={20} />}
        />
        <BentoCard 
          title="Despesas Operacionais" 
          value="R$ 0,00" 
          description="Nenhum custo avulso lançado" 
          type="expense"
          icon={<DollarSign size={20} />}
        />
        <BentoCard 
          title="Pacientes Atendidos" 
          value="1" 
          description="Mariana Costa cadastrada" 
          icon={<Users size={20} />}
        />
        <BentoCard 
          title="Consultas Agendadas" 
          value="0" 
          description="Grade vazia para este turno" 
          icon={<Calendar size={20} />}
        />
      </div>

      {/* Rascunho visual das próximas sessões de tabelas */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-deep-obsidian mb-2">Últimas Evoluções Clínicas</h3>
        <p className="text-sm text-gray-400">Os dados relacionais integrados ao backend via Axios aparecerão organizados aqui.</p>
      </div>
    </div>
  );
}
