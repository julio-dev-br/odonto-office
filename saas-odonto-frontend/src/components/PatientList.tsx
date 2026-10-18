import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Search, Printer } from 'lucide-react';
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
}

export function PatientList({ patients }: PatientListProps) {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  // Referência física oculta para o injetor de PDF ler as tags HTML
  const componentRef = useRef<HTMLDivElement>(null);

  // Gatilho inteligente do react-to-print
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Ficha_Clinica_${selectedPatient?.name || 'Paciente'}`,
  });

  const handleTriggerPrint = (patient: Patient) => {
    // Simula a coleta de consultas vinculadas a esse paciente no banco (pode acoplar Axios depois)
    const simulatedAppointments = [
      { id: '1', type: 'Clareamento Laser', startAt: '14:30', professionalName: 'Dr. Anderson Silva', notes: 'Procedimento finalizado com sucesso absoluto. Sem queixas.' }
    ];

    setSelectedPatient(patient);
    
    // Aguarda o estado carregar o paciente e dispara a impressão nativa em lote!
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.cpf.includes(search)
  );

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      
      {/* Barra de Busca */}
      <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
        <h3 className="text-sm font-bold text-deep-obsidian uppercase tracking-wider">
          Pacientes Cadastrados ({filteredPatients.length})
        </h3>
        
        <div className="relative w-full sm:w-64 ml-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou CPF..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Tabela Física */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase bg-gray-50/20">
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Nome</th>
              <th className="py-4 px-6">CPF</th>
              <th className="py-4 px-6">WhatsApp</th>
              <th className="py-4 px-6">Data Cadastro</th>
              <th className="py-4 px-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm font-medium text-deep-obsidian">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 text-gray-400 text-xs">#{patient.id}</td>
                <td className="py-4 px-6 font-bold">{patient.name}</td>
                <td className="py-4 px-6 text-gray-500 font-mono text-xs">{patient.cpf}</td>
                <td className="py-4 px-6 text-gray-500 font-mono text-xs">{patient.whatsapp}</td>
                <td className="py-4 px-6 text-gray-400 text-xs">{patient.createdAt}</td>
                <td className="py-4 px-6 text-right flex justify-end gap-4">
                  <button 
                    onClick={() => handleTriggerPrint(patient)}
                    className="text-xs font-bold text-mint-clean hover:underline cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer size={14} /> Imprimir Ficha (PDF)
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CONTÊNER OCULTO: Esse div fica invisível na tela, mas acende na folha A4 do PDF! */}
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
