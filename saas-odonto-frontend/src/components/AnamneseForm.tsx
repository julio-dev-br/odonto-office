import React, { useState } from 'react';
import { ShieldAlert, Heart, Activity, AlertCircle, FileText } from 'lucide-react';

interface AnamneseFormProps {
  onSaveAnamnese: (data: any) => void;
}

export function AnamneseForm({ onSaveAnamnese }: AnamneseFormProps) {
  // ESTADOS CLÍNICOS: Mapeamento de patologias e riscos operacionais
  const [hasAllergy, setHasAllergy] = useState(false);
  const [allergyDetails, setAllergyDetails] = useState('');
  const [hasHeartDisease, setHasHeartDisease] = useState(false);
  const [isHypertensive, setIsHypertensive] = useState(false);
  const [continuousMedication, setContinuousMedication] = useState('');
  const [bleedingHistory, setBleedingHistory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Agrupa a payload atômica que será despachada para o Postgres
    onSaveAnamnese({
      hasAllergy,
      allergyDetails: hasAllergy ? allergyDetails : 'Nenhuma',
      hasHeartDisease,
      isHypertensive,
      continuousMedication: continuousMedication || 'Nenhum',
      bleedingHistory
    });

    // Limpa o formulário após o envio
    setAllergyDetails('');
    setContinuousMedication('');
    setHasAllergy(false);
    setHasHeartDisease(false);
    setIsHypertensive(false);
    setBleedingHistory(false);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-base font-bold text-deep-obsidian mb-6 flex items-center gap-2">
        <FileText size={18} className="text-dentistry-teal" /> Histórico Clínico Geral do Paciente
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 🛑 ALERTA 1: ALERGIAS SISTÊMICAS */}
        <div className="p-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-deep-obsidian flex items-center gap-2">
              <ShieldAlert size={16} className={hasAllergy ? 'text-red-500' : 'text-gray-400'} />
              O paciente possui algum tipo de alergia? (Ex: Penicilina, Anestésicos)
            </label>
            <input
              type="checkbox"
              checked={hasAllergy}
              onChange={(e) => setHasAllergy(e.target.checked)}
              className="w-4 h-4 text-mint-clean border-gray-300 rounded focus:ring-mint-clean cursor-pointer"
            />
          </div>
          {hasAllergy && (
            <input
              type="text"
              required
              value={allergyDetails}
              onChange={(e) => setAllergyDetails(e.target.value)}
              placeholder="Descreva detalhadamente as alergias do paciente..."
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean transition-all"
            />
          )}
        </div>

        {/* 🫀 ALERTA 2: SAÚDE CARDIOVASCULAR & PRESSÃO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-xl flex items-center justify-between">
            <label className="text-sm font-bold text-deep-obsidian flex items-center gap-2">
              <Heart size={16} className={hasHeartDisease ? 'text-red-500' : 'text-gray-400'} />
              Cardiopata? (Problemas cardíacos)
            </label>
            <input
              type="checkbox"
              checked={hasHeartDisease}
              onChange={(e) => setHasHeartDisease(e.target.checked)}
              className="w-4 h-4 text-mint-clean border-gray-300 rounded focus:ring-mint-clean cursor-pointer"
            />
          </div>

          <div className="p-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-xl flex items-center justify-between">
            <label className="text-sm font-bold text-deep-obsidian flex items-center gap-2">
              <Activity size={16} className={isHypertensive ? 'text-red-500' : 'text-gray-400'} />
              Hipertenso? (Pressão Alta)
            </label>
            <input
              type="checkbox"
              checked={isHypertensive}
              onChange={(e) => setIsHypertensive(e.target.checked)}
              className="w-4 h-4 text-mint-clean border-gray-300 rounded focus:ring-mint-clean cursor-pointer"
            />
          </div>
        </div>

        {/* 💊 ALERTA 3: MEDICAÇÃO CONTÍNUA & HEMORRAGIAS */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              Fáz uso de Medicamentos Contínuos?
            </label>
            <input
              type="text"
              value={continuousMedication}
              onChange={(e) => setContinuousMedication(e.target.value)}
              placeholder="Ex: Anticoagulantes, Insulina... (Deixe em branco se nenhum)"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all"
            />
          </div>

          <div className="p-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-xl flex items-center justify-between">
            <label className="text-sm font-bold text-deep-obsidian flex items-center gap-2">
              <AlertCircle size={16} className={bleedingHistory ? 'text-red-500' : 'text-gray-400'} />
              Histórico de Hemorragias em extrações dentárias anteriores?
            </label>
            <input
              type="checkbox"
              checked={bleedingHistory}
              onChange={(e) => setBleedingHistory(e.target.checked)}
              className="w-4 h-4 text-mint-clean border-gray-300 rounded focus:ring-mint-clean cursor-pointer"
            />
          </div>
        </div>

        {/* Botão de Gravação */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-mint-clean text-deep-obsidian font-bold py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-lg hover:bg-mint-clean/90 transition-all cursor-pointer"
          >
            Gravar Ficha de Anamnese
          </button>
        </div>
      </form>
    </div>
  );
}
