import { useState, useEffect } from 'react';
import { TableSkeleton } from '../../components/TableSkeleton';
import { Search, Users } from 'lucide-react';
import { api } from '../../services/api';
import { PatientForm } from '../../components/PatientForm';
import { PatientList } from '../../components/PatientList';
import toast from 'react-hot-toast';

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

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 8;

  const handleToggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1); 
  };

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await api.get('/patients/paginated', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          sort: sortOrder,
        }
      });

      const rawItems = response.data.items || response.data;

      const formatted = rawItems.map((p: any) => ({
        id: p.id.toString(),
        name: p.name,
        cpf: p.cpf,
        whatsapp: p.whatsapp,
        createdAt: new Date(p.created_at || p.createdAt).toLocaleDateString('pt-BR')
      }));

      setPatients(formatted);

      if (response.data.meta?.totalPages) {
        setTotalPages(response.data.meta.totalPages);
      } else {
        setTotalPages(1);
      }
    } catch (err: any) {
      console.error(err);
      setError('Falha ao carregar a lista de pacientes da clínica.');
      toast.error('Erro de sincronização de prontuários.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [currentPage, sortOrder, searchTerm]);

  const handleAddPatient = async (newPatientData: { name: string; cpf: string; whatsapp: string }) => {
    try {
      setError('');
      await api.post('/patients', {
        name: newPatientData.name,
        cpf: newPatientData.cpf,
        whatsapp: newPatientData.whatsapp
      });

      toast.success('Prontuário clínico registrado com sucesso!');
      setCurrentPage(1); // Reseta para a primeira página para exibir o paciente novo
      await fetchPatients();
    } catch (err: any) {
      console.error(err);
      const apiMessage = err.response?.data?.message;
      toast.error(typeof apiMessage === 'string' ? apiMessage : 'Erro ao salvar novo paciente no banco.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Título e Descrição */}
      <div>
        <h1 className="text-3xl font-extrabold text-deep-obsidian tracking-tight flex items-center gap-3">
          <Users className="text-mint-clean" size={32} /> Gestão de Pacientes & Prontuários
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

      {/* Formulário de Cadastro Rápido com Validação e Máscaras */}
      <PatientForm onAddPatient={handleAddPatient} />

      {/* Barra de Controle, Pesquisa Dinâmica e Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 border border-gray-100 rounded-2xl shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar paciente por nome ou CPF..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reseta para a primeira página ao pesquisar
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-dentistry-teal focus:bg-white transition-all"
          />
        </div>

        {/* Contador rápido de registros da página */}
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Exibindo Página {currentPage} de {totalPages}
        </div>
      </div>

      {/* Tabela */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <PatientList
          patients={patients}
          currentPage={currentPage}
          totalPages={totalPages}
          sortOrder={sortOrder}
          onPageChange={setCurrentPage}
          onToggleSort={handleToggleSort}
        />
      )}
    </div>
  );
}

