import React from 'react';
import { Shield, Activity, Calendar, User } from 'lucide-react';

interface PatientRecordPDFProps {
  patient: any;
  appointments: any[];
}

// Formatado cirurgicamente para folhas A4
export const PatientRecordPDF = React.forwardRef<HTMLDivElement, PatientRecordPDFProps>(
  ({ patient, appointments }, ref) => {
    if (!patient) return null;

    return (
      <div ref={ref} className="p-12 bg-white text-slate-900 font-sans max-w-[210mm] min-h-[297mm] mx-auto print:p-8">
        
        {/* CABEÇALHO DO DOCUMENTO (Papel Timbrado Premium) */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500 text-white rounded-xl">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-wider uppercase leading-none">
                Odonto<span className="text-emerald-600">Office</span>
              </h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">
                SaaS Clinical Platform
              </span>
            </div>
          </div>
          
          <div className="text-right text-xs text-slate-500 font-medium">
            <p>Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
            <p>Contexto: Sorriso Perfeito Clinic</p>
          </div>
        </div>

        {/* SEÇÃO 1: DADOS CADASTRAIS DO PACIENTE */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <User size={14} /> Dados Cadastrais do Paciente
          </h3>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-xs text-slate-400 font-medium">Nome Completo</p>
              <p className="font-bold text-slate-800 text-base">{patient.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Documento de Identidade (CPF)</p>
              <p className="font-mono text-slate-700 font-semibold">{patient.cpf}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Contato Corporativo (WhatsApp)</p>
              <p className="font-mono text-slate-700 font-semibold">{patient.whatsapp}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Data de Registro no Sistema</p>
              <p className="text-slate-700 font-semibold">{patient.createdAt}</p>
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: HISTÓRICO DE EVOLUÇÕES CLÍNICAS / PROCEDIMENTOS */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Activity size={14} /> Histórico de Evoluções e Atendimentos
          </h3>
          
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <p className="text-sm text-slate-400 font-medium italic py-4">
                Nenhum registro clínico ou consulta agendada localizada para este paciente.
              </p>
            ) : (
              appointments.map((appt, idx) => (
                <div key={appt.id || idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 break-inside-avoid space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {appt.type}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Calendar size={12} /> {appt.startAt}
                    </span>
                  </div>
                  
                  <div className="text-xs text-slate-500 font-medium">
                    <span className="font-bold text-slate-700">Dentista Responsável:</span> {appt.professionalName}
                  </div>
                  
                  {appt.notes && (
                    <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-100/50 mt-1">
                      <p className="font-semibold text-slate-400 uppercase text-[9px] tracking-wider mb-1">Notas do Prontuário</p>
                      <p className="italic font-medium">"{appt.notes}"</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* RODAPÉ: Assinatura do Profissional Responsável */}
        <div className="mt-16 border-t border-dashed border-slate-300 pt-8 text-center max-w-xs mx-auto print:mt-12 break-inside-avoid">
          <div className="h-px bg-slate-400 w-full mb-2" />
          <p className="text-sm font-bold text-slate-800">Dr. Anderson Silva</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cirurgião-Dentista Responsável</p>
        </div>

      </div>
    );
  }
);

PatientRecordPDF.displayName = 'PatientRecordPDF';
