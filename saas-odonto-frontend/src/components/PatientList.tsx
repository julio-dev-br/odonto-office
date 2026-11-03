import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import { PatientRecordPDF } from './PatientRecordPDF';

interface Patient {
  id: string;
  name: string;
  cpf: string;
  whatsapp: string;
  createdAt: string;
}

interface PatientListProps {
  patients: Patient[];
  currentPage: number;
  totalPages: number;
  sortOrder: 'asc' | 'desc';
  onPageChange: (page: number) => void;
  onToggleSort: () => void;
}

export function PatientList({ 
  patients, 
  currentPage, 
  totalPages, 
  sortOrder, 
  onPageChange, 
  onToggleSort  
}: PatientListProps) {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Ficha_Clinica_${selectedPatient?.name || 'Paciente'}`,
  });

  const handleTriggerPrint = (patient: Patient) => {

    setSelectedPatient(patient);
    
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      
      {/* Cabeçalho da Tabela Clean */}
      <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h3 className="text-sm font-bold text-deep-obsidian uppercase tracking-wider">
          Prontuários Clínicos Ativos ({patients.length})
        </h3>
      </div>

      {/* Tabela Física */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase bg-gray-50/20">
              <th className="py-4 px-6">ID</th>
              
              {/* 🚀 BOTÃO DE ORDENAÇÃO DINÂMICA: Altera o fluxo A-Z / Z-A direto no Postgres */}
              <th className="py-4 px-6">
                <button 
                  onClick={onToggleSort}
                  className="flex items-center gap-1 hover:text-dentistry-teal transition-colors font-semibold uppercase tracking-wider cursor-pointer text-left"
                >
                  Nome {sortOrder === 'asc' ? '🔼' : '🔽'}
                </button>
              </th>
              
              <th className="py-4 px-6">CPF</th>
              <th className="py-4 px-6">WhatsApp</th>
              <th className="py-4 px-6">Data Cadastro</th>
              <th className="py-4 px-6 text-right">Ações de Prontuário</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm font-medium text-deep-obsidian">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 text-gray-400 text-xs font-mono">#{patient.id}</td>
                <td className="py-4 px-6 font-bold text-gray-900">{patient.name}</td>
                <td className="py-4 px-6 text-gray-500 font-mono text-xs">{patient.cpf}</td>
                <td className="py-4 px-6 text-gray-500 font-mono text-xs">{patient.whatsapp}</td>
                <td className="py-4 px-6 text-gray-400 text-xs font-mono">{patient.createdAt}</td>
                <td className="py-4 px-6 text-right">
                  <button 
                    onClick={() => handleTriggerPrint(patient)}
                    className="ml-auto text-xs font-bold bg-gray-50 border border-gray-200 text-gray-700 hover:text-dentistry-teal hover:border-dentistry-teal px-3 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 justify-end"
                  >
                    <Printer size={13} /> Ficha Clínica (PDF)
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🚀 NOVO COMPONENTE: Painel e Pílulas de Paginação sob Demanda */}
      <div className="p-4 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between gap-4">
        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
          Página {currentPage} de {totalPages}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Botão: Voltar Página */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Renderização das pílulas numéricas com Verde Padrão */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                currentPage === page
                  ? 'bg-dentistry-teal text-white border border-dentistry-teal' // 🚀 VERDE PADRÃO AQUI!
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Botão: Avançar Página */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <ChevronRight size={16} />
          </button>
        </div>

      </div>

      {/* CONTÊNER OCULTO: Injetor físico invisível na tela, que acende no A4 do PDF */}
      <div className="hidden">
        <div ref={componentRef}>
          <PatientRecordPDF 
            patient={selectedPatient} 
            appointments={selectedPatient ? [
              { id: '1', type: 'Clareamento Laser', startAt: '14:30', professionalName: 'Dr. Anderson Silva', notes: 'Procedimento finalizado com sucesso absoluto. Sem queixas.' }
            ] : []} 
          />
        </div>
      </div>

    </div>
  );
}
