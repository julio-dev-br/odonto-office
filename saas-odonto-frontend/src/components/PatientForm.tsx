
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPlus, Fingerprint, Phone } from 'lucide-react';
import { maskCPF, maskPhone } from '../utils/masks';

const patientFormSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  cpf: z.string().min(14, 'CPF inválido (digite os 11 números)'),
  whatsapp: z.string().min(14, 'WhatsApp inválido (digite DDD + número)'),
});

type PatientFormData = z.infer<typeof patientFormSchema>;

interface PatientFormProps {
  onAddPatient: (data: PatientFormData) => Promise<void> | void;
}

export function PatientForm({ onAddPatient }: PatientFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: '',
      cpf: '',
      whatsapp: '',
    },
  });

  const handleFormSubmit = async (data: PatientFormData) => {
    try {
      await onAddPatient(data);
      reset(); 
    } catch (err) {
      console.error('Erro na submissão do formulário de pacientes:', err);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-bold text-deep-obsidian mb-4 flex items-center gap-2">
        <UserPlus size={18} className="text-dentistry-teal" /> Novo Cadastro de Prontuário
      </h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        
        {/* Campo: Nome Completo */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Nome Completo
          </label>
          <input
            type="text"
            placeholder="Ex: Mariana Costa"
            {...register('name')}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-dentistry-teal focus:bg-white transition-all"
          />
          {errors.name && <p className="text-xs text-rose-500 font-semibold">{errors.name.message}</p>}
        </div>

        {/* Campo: CPF com Máscara Reativa Dinâmica */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Fingerprint size={12} /> CPF
          </label>
          <input
            type="text"
            placeholder="000.000.000-00"
            {...register('cpf', {
              onChange: (e) => {
                setValue('cpf', maskCPF(e.target.value));
              }
            })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-dentistry-teal focus:bg-white transition-all font-mono"
          />
          {errors.cpf && <p className="text-xs text-rose-500 font-semibold">{errors.cpf.message}</p>}
        </div>

        {/* Campo: WhatsApp com Máscara Reativa Dinâmica */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Phone size={12} /> WhatsApp
          </label>
          <input
            type="text"
            placeholder="(11) 99999-9999"
            {...register('whatsapp', {
              onChange: (e) => {
                setValue('whatsapp', maskPhone(e.target.value));
              }
            })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-dentistry-teal focus:bg-white transition-all font-mono"
          />
          {errors.whatsapp && <p className="text-xs text-rose-500 font-semibold">{errors.whatsapp.message}</p>}
        </div>

        {/* Botão de Envio com Estado de Bloqueio de cliques duplicados */}
        <div className="md:col-span-3 flex justify-end mt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-dentistry-teal text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-lg hover:bg-teal-700 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Paciente'}
          </button>
        </div>

      </form>
    </div>
  );
}
