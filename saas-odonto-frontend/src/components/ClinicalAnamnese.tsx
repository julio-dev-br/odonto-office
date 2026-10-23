import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, HeartPulse } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

interface ClinicalAnamneseProps {
  patientId: string;
}

export function ClinicalAnamnese({ patientId }: ClinicalAnamneseProps) {
  const [hasHypertension, setHasHypertension] = useState(false);
  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [hasAllergy, setHasAllergy] = useState(false);
  const [allergyDetails, setAllergyDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const tenantIdHeader = localStorage.getItem('@OdontoOffice:tenantId') || '1';
  const config = { headers: { 'X-Tenant-ID': tenantIdHeader } };

  // 🔍 BUSCA ANAMNESE EXISTENTE: Se o paciente já tiver ficha no Postgres, carrega os dados!
  useEffect(() => {
    if (!patientId) return;

    const fetchAnamnese = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/anamnese/patient/${patientId}`, config);
        
        if (response.data) {
          setHasHypertension(!!response.data.hasHypertension);
          setHasDiabetes(!!response.data.hasDiabetes);
          setHasAllergy(!!response.data.hasAllergy);
          setAllergyDetails(response.data.allergyDetails || '');
        } else {
          // Reseta o formulário se for uma ficha nova/virgem
          setHasHypertension(false);
          setHasDiabetes(false);
          setHasAllergy(false);
          setAllergyDetails('');
        }
      } catch (err) {
        console.error('Erro ao carregar anamnese:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnamnese();
  }, [patientId]);

  // 🚀 SALVA OU ATUALIZA A ANAMNESE
  const handleSaveAnamnese = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post('/anamnese', {
        patientId,
        hasHypertension,
        hasDiabetes,
        hasAllergy,
        allergyDetails: hasAllergy ? allergyDetails : ''
      }, config);

      toast.success('Ficha de Anamnese salva e atualizada no prontuário!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar anamnese do paciente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-xs text-gray-400 font-bold animate-pulse">Sincronizando ficha médica...</div>;
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 h-fit">
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
        <HeartPulse size={14} className="text-red-500" /> Ficha de Anamnese Interativa
      </h3>

      <form onSubmit={handleSaveAnamnese} className="space-y-4 text-xs font-semibold text-deep-obsidian">
        {/* Checkbox Hipertensão */}
        <label className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100/70 transition-all cursor-pointer">
          <input
            type="checkbox"
            checked={hasHypertension}
            onChange={(e) => setHasHypertension(e.target.checked)}
            className="w-4 h-4 rounded text-dentistry-teal focus:ring-mint-clean border-gray-300 accent-dentistry-teal"
          />
          <div>
            <p className="font-bold">Paciente é Hipertenso?</p>
            <p className="text-[10px] text-gray-400 font-medium">Requer monitoramento de pressão antes de anestesia.</p>
          </div>
        </label>

        {/* Checkbox Diabetes */}
        <label className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100/70 transition-all cursor-pointer">
          <input
            type="checkbox"
            checked={hasDiabetes}
            onChange={(e) => setHasDiabetes(e.target.checked)}
            className="w-4 h-4 rounded text-dentistry-teal focus:ring-mint-clean border-gray-300 accent-dentistry-teal"
          />
          <div>
            <p className="font-bold">Paciente possui Diabetes?</p>
            <p className="text-[10px] text-gray-400 font-medium">Atenção redobrada à velocidade de cicatrização tecidual.</p>
          </div>
        </label>

        {/* Checkbox Alergias */}
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100/70 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={hasAllergy}
              onChange={(e) => setHasAllergy(e.target.checked)}
              className="w-4 h-4 rounded text-dentistry-teal focus:ring-mint-clean border-gray-300 accent-dentistry-teal"
            />
            <div>
              <p className="font-bold">Possui Alergia a Medicamentos / Substâncias?</p>
              <p className="text-[10px] text-gray-400 font-medium">Sinaliza restrições para prescrição de antibióticos ou anestésicos.</p>
            </div>
          </label>

          {hasAllergy && (
            <input
              type="text"
              required
              value={allergyDetails}
              onChange={(e) => setAllergyDetails(e.target.value)}
              placeholder="Especifique: Ex: Alergia a Penicilina, Dipirona, Látex..."
              className="w-full px-3 py-2 bg-red-50/30 border border-red-100 rounded-xl text-xs font-semibold text-deep-obsidian focus:outline-none focus:border-red-400 transition-all"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gray-900 text-white font-bold py-2 rounded-xl text-xs shadow-md hover:bg-gray-800 transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
        >
          <CheckCircle2 size={14} /> Salvar Ficha Médica
        </button>
      </form>
    </div>
  );
}
