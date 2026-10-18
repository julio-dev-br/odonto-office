import { useState, useEffect } from 'react';
import { TableSkeleton } from '../../components/TableSkeleton';
import { Users } from 'lucide-react';
import { api } from '../../services/api'; 
import { PatientForm } from '../../components/PatientForm';
import { PatientList } from '../../components/PatientList';

interface Patient {
  id: string;
  name: string;
  cpf: string;
  whatsapp: string;
  createdAt: string;
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  //  Busca os pacientes salvos no Postgres
  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await api.get('/patients');
      
      // Mapeia os dados convertendo propriedades se necessário e limpa a tipagem
      const formatted = response.data.map((p: any) => ({
        id: p.id.toString(),
        name: p.name,
        cpf: p.cpf,
        whatsapp: p.whatsapp,
        createdAt: new Date(p.createdAt).toLocaleDateString('pt-BR') // Formata a data para BR
      }));
      
      setPatients(formatted);
    } catch (err: any) {
      console.error(err);
      setError('Falha ao carregar a lista de pacientes da clínica.');
    } finally {
      setIsLoading(false);
    }
  };

  // Dispara a busca assim que o componente monta na tela
  useEffect(() => {
    fetchPatients();
  }, []);

  // Envia os dados do formulário para a API NestJS
  const handleAddPatient = async (newPatientData: { name: string; cpf: string; whatsapp: string }) => {
    try {
      setError('');
      
      // Dispara o POST real para a rota controlada por clínica do backend
      await api.post('/patients', {
        name: newPatientData.name,
        cpf: newPatientData.cpf,
        whatsapp: newPatientData.whatsapp
      });

      // Recarrega a tabela de forma limpa direto do banco para trazer os IDs gerados pelo Postgres!
      await fetchPatients();
    } catch (err: any) {
      console.error(err);
      const apiMessage = err.response?.data?.message;
      alert(typeof apiMessage === 'string' ? apiMessage : 'Erro ao salvar novo paciente no banco de dados.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Título e Descrição */}
      <div>
        <h1 className="text-3xl font-extrabold text-deep-obsidian tracking-tight flex items-center gap-3">
          <Users className="text-mint-clean" size={32} /> Patients Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Cadastre novos pacientes e acesse o histórico clínico integrado de forma isolada e segura.
        </p>
      </div>

      {/* Alerta de Erro de Conexão */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      {/*Formulário de Cadastro Rápido Real */}
      <PatientForm onAddPatient={handleAddPatient} />

      {/* Tabela com Feedback UX Sênior (Skeleton Screen!) */}
      {isLoading ? (
        <TableSkeleton /> 
      ) : (
        <PatientList patients={patients} />
      )}
    </div>
  );
}
