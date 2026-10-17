import React from 'react';

interface BentoCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  type?: 'income' | 'expense' | 'neutral';
}

// 🚀 CERTIFIQUE-SE DE QUE ESTÁ "export function" OU COLOQUE O "export default" NO FINAL
export function BentoCard({ title, value, description, icon, type = 'neutral' }: BentoCardProps) {
  const highlightColor = 
    type === 'income' ? 'text-mint-clean' : 
    type === 'expense' ? 'text-red-500' : 'text-dentistry-teal';

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className={`p-2 bg-gray-50 rounded-xl ${highlightColor}`}>
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-3xl font-bold text-deep-obsidian tracking-tight">
          {value}
        </h3>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
}
