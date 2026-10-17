import { useState } from 'react';
import { Users } from 'lucide-react';
import { PatientForm } from '../../components/PatientForm';
import { PatientList } from '../../components/PatientList';

export default function Patients() {
  //  Dados simulados que logo mais serão alimentados pela API NestJS!
  const [patients, setPatients] = useState([
    { id: '1', name: 'Mariana Costa', cpf: '222.222.222-22', whatsapp: '11977777777', createdAt: '2026-10-17' },
    { id: '2', name: 'Rodrigo Silva', cpf: '333.333.333-33', whatsapp: '11988888888', createdAt: '2026-10-17' }
  ]);

  // Handler inteligente que recebe os dados do PatientForm e atualiza a listagem de forma reativa
  const handleAddPatient = (newPatientData: { name: string; cpf: string; whatsapp: string }) => {
    const newPatient = {
      id: (patients.length + 1).toString(),
      name: newPatientData.name,
      cpf: newPatientData.cpf,
      whatsapp: newPatientData.whatsapp,
      createdAt: new Date().toISOString().split('T')[0] // Carimba com a data atual (AAAA-MM-DD)
    };

    // Insere o novo paciente no topo da lista
    setPatients([newPatient, ...patients]);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Título e Descrição da Tela */}
      <div>
        <h1 className="text-3xl font-extrabold text-deep-obsidian tracking-tight flex items-center gap-3">
          <Users className="text-mint-clean" size={32} /> Patients Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Cadastre novos pacientes e acesse o histórico clínico integrado de forma isolada e segura.
        </p>
      </div>

      {/* Formulário de Cadastro Rápido */}
      <PatientForm onAddPatient={handleAddPatient} />

      {/* Tabela de Listagem e Filtro Inteligente */}
      <PatientList patients={patients} />

    </div>
  );
}
