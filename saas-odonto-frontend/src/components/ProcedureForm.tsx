import React, { useState } from 'react';
import { Plus, Sparkles, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

export function ProcedureForm() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 🛡️ Captura o cabeçalho obrigatório Multi-Tenant do seu cofre local
    const tenantIdHeader = localStorage.getItem('@OdontoOffice:tenantId') || '1';

    const handleRegisterProcedure = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !basePrice) return; // Mantém a validação local do input

        try {
            setIsSubmitting(true);

            // 🛡️ SINTONIZADO: Envia as propriedades exatas que o seu backend espera receber!
            await api.post('/dental-procedures', {
                name,
                description: description || 'Nenhuma descrição informada.',
                price: Number(basePrice), // 🚀 CORRIGIDO: Agora envia como 'price' exigido pelo seu banco!
                estimatedMin: 60,         // 🚀 ADICIONADO: Define o tempo estimado padrão de 60 minutos
                active: true
            }, {
                headers: { 'X-Tenant-ID': tenantIdHeader }
            });

            toast.success('Novo procedimento adicionado ao catálogo!');
            setName('');
            setDescription('');
            setBasePrice('');
        } catch (err: any) {
            console.error(err);
            const apiMessage = err.response?.data?.message;
            toast.error(typeof apiMessage === 'string' ? apiMessage : 'Erro ao cadastrar procedimento.');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-deep-obsidian mb-4 flex items-center gap-2">
                <Plus size={18} className="text-dentistry-teal" /> Adicionar Procedimento ao Catálogo
            </h3>

            <form onSubmit={handleRegisterProcedure} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nome do Procedimento */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles size={12} /> Nome do Tratamento
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Profilaxia, Clareamento a Laser..."
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all"
                        />
                    </div>

                    {/* Preço Base */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            <DollarSign size={12} /> Preço Base (R$)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={basePrice}
                            onChange={(e) => setBasePrice(e.target.value)}
                            placeholder="0,00"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all font-mono"
                        />
                    </div>
                </div>

                {/* Descrição / Notas */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Descrição Detalhada</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Informe observações clínicas padrão do procedimento, tempo estimado ou materiais recomendados..."
                        rows={3}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all resize-none"
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-dentistry-teal text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-lg hover:bg-dentistry-teal/90 transition-all cursor-pointer disabled:opacity-50"
                    >
                        {isSubmitting ? 'Salvando...' : 'Cadastrar Procedimento'}
                    </button>
                </div>
            </form>
        </div>
    );
}
