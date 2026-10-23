import { History, AlertCircle } from 'lucide-react';

interface TimelineRecord {
    id: string;
    createdAt: string;
    description: string;
    procedure?: {
        name: string;
        price: number;
    };
}

interface ClinicalTimelineProps {
    records: TimelineRecord[];
}

export function ClinicalTimeline({ records }: ClinicalTimelineProps) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 h-full max-h-[480px] overflow-y-auto">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <History size={14} className="text-dentistry-teal" /> Histórico Clínico (Linha do Tempo)
            </h3>

            {records.length === 0 ? (
                <div className="p-6 text-center text-xs font-bold text-gray-400 italic flex items-center justify-center gap-1 bg-gray-50 rounded-xl">
                    <AlertCircle size={14} /> Ficha limpa. Primeiro procedimento deste paciente na clínica.
                </div>
            ) : (
                <div className="relative border-l border-gray-100 pl-4 space-y-5 ml-2">
                    {records.map((rec) => (
                        <div key={rec.id} className="relative text-xs space-y-1 animate-fade-in">
                            {/* Pontinho conector vertical da timeline */}
                            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-dentistry-teal border-2 border-white shadow-sm" />

                            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                                <span>{new Date(rec.createdAt).toLocaleDateString('pt-BR')}</span>
                                <span className="font-mono text-dentistry-teal">ID: #{rec.id.slice(-4)}</span>
                            </div>

                            <h4 className="font-black text-deep-obsidian text-sm">
                                {rec.procedure?.name || 'Procedimento Clínico'}
                            </h4>

                            <p className="text-gray-500 font-medium leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-100 mt-1 block whitespace-pre-wrap">
                                {rec.description}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
