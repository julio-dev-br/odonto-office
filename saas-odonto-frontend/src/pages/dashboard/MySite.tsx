import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { Globe, CheckCircle2, AlertCircle, Save, ExternalLink } from 'lucide-react';

export default function MySite() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [siteData, setSiteData] = useState<any>({
    title: '',
    description: '',
    logo: '',
    phone: '',
    whatsapp: '',
    primaryColor: '#0F172A',
    accentColor: '#10B981',
    backgroundColor: '#F8FAFC',
    isPublished: false
  });

  useEffect(() => {
    async function loadSite() {
      try {
        const response = await api.get('/clinic-sites/me');
        setSiteData(response.data);
      } catch (error) {
        toast.error('Erro ao carregar os dados do site.');
      } finally {
        setIsLoading(false);
      }
    }
    loadSite();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 🚀 Montamos um objeto apenas com os campos permitidos e forçamos minúsculo no tema
      const payload = {
        title: siteData.title,
        description: siteData.description,
        logo: siteData.logo,
        phone: siteData.phone,
        whatsapp: siteData.whatsapp,
        primaryColor: siteData.primaryColor,
        accentColor: siteData.accentColor,
        backgroundColor: siteData.backgroundColor,
        theme: siteData.theme?.toLowerCase() || 'light',
      };

      await api.put('/clinic-sites/settings', payload);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar as configurações.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      const newStatus = !siteData.isPublished;
      await api.patch('/clinic-sites/publish', { isPublished: newStatus });

      setSiteData({ ...siteData, isPublished: newStatus });
      toast.success(newStatus ? 'Site publicado com sucesso!' : 'Site desativado com sucesso.');
    } catch (error) {
      toast.error('Erro ao alterar o status do site.');
    }
  };

  if (isLoading) return <div className="text-sm text-gray-500">Carregando configurações...</div>;

  return (
    // 🚀 Mesmo container do Settings.tsx
    <div className="space-y-8 animate-fade-in">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-deep-obsidian tracking-tight flex items-center gap-3">
            <Globe className="text-mint-clean" size={32} />
            Meu Site
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Personalize a página pública da sua clínica e prepare-a para receber pacientes.
          </p>
        </div>

        {/* STATUS E BOTÃO DE PUBLICAÇÃO */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${siteData.isPublished ? 'bg-mint-clean/10 text-dentistry-teal border-mint-clean/30' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
            {siteData.isPublished ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {siteData.isPublished ? 'Publicado' : 'Rascunho'}
          </div>

          <button
            onClick={handleTogglePublish}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer ${siteData.isPublished
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                : 'bg-dentistry-teal hover:bg-dentistry-teal/90 shadow-dentistry-teal/30'
              }`}
          >
            <ExternalLink size={16} />
            {siteData.isPublished ? 'Desativar Site' : 'Publicar Site'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid lg:grid-cols-3 gap-8 items-start">

        {/* COLUNA ESQUERDA: FORMULÁRIO */}
        <div className="lg:col-span-2 space-y-6">

          {/* CARD: INFORMAÇÕES GERAIS */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-deep-obsidian mb-4 border-b border-gray-100 pb-3">
              Informações da Clínica
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Título Principal</label>
              <input
                type="text"
                value={siteData.title}
                onChange={e => setSiteData({ ...siteData, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all"
                placeholder="Ex: Sorriso Perfeito Clinic"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Descrição (Sobre a clínica)</label>
              <textarea
                rows={4}
                value={siteData.description || ''}
                onChange={e => setSiteData({ ...siteData, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all resize-none"
                placeholder="Descreva os diferenciais da sua clínica para os pacientes..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Telefone de Contato</label>
                <input
                  type="text"
                  value={siteData.phone || ''}
                  onChange={e => setSiteData({ ...siteData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all"
                  placeholder="(11) 3000-0000"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">WhatsApp (Agendamentos)</label>
                <input
                  type="text"
                  value={siteData.whatsapp || ''}
                  onChange={e => setSiteData({ ...siteData, whatsapp: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-deep-obsidian focus:outline-none focus:border-mint-clean focus:bg-white transition-all"
                  placeholder="(11) 90000-0000"
                />
              </div>
            </div>
          </div>

          {/* CARD: IDENTIDADE VISUAL */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-deep-obsidian mb-4 border-b border-gray-100 pb-3">
              Identidade Visual
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cor Primária</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={siteData.primaryColor} onChange={e => setSiteData({ ...siteData, primaryColor: e.target.value })} className="w-12 h-12 rounded-xl cursor-pointer border border-gray-200 p-1" />
                  <span className="text-sm font-mono text-gray-500 uppercase">{siteData.primaryColor}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cor de Destaque</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={siteData.accentColor} onChange={e => setSiteData({ ...siteData, accentColor: e.target.value })} className="w-12 h-12 rounded-xl cursor-pointer border border-gray-200 p-1" />
                  <span className="text-sm font-mono text-gray-500 uppercase">{siteData.accentColor}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cor de Fundo</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={siteData.backgroundColor} onChange={e => setSiteData({ ...siteData, backgroundColor: e.target.value })} className="w-12 h-12 rounded-xl cursor-pointer border border-gray-200 p-1" />
                  <span className="text-sm font-mono text-gray-500 uppercase">{siteData.backgroundColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTÃO SALVAR (Padrão Settings.tsx) */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-mint-clean text-deep-obsidian font-bold py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save size={18} />
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>

        </div>

        {/* COLUNA DIREITA: PREVIEW */}
        <div className="sticky top-8">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-deep-obsidian mb-2 flex items-center gap-2">
              Visualização
            </h3>
            <p className="text-xs text-gray-500 mb-6">É assim que seus pacientes verão a página.</p>

            {/* Celular Mockup */}
            <div className="w-full max-w-[280px] mx-auto bg-gray-100 rounded-[2rem] p-3 shadow-inner border-4 border-gray-200">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 h-[450px] flex flex-col">

                {/* Header do Site */}
                <div className="h-32 w-full flex flex-col items-center justify-center p-4 text-center" style={{ backgroundColor: siteData.primaryColor }}>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2 backdrop-blur-sm">
                    <Globe size={24} className="text-white" />
                  </div>
                  <h2 className="text-white font-bold truncate w-full px-2">{siteData.title || 'Nome da Clínica'}</h2>
                </div>

                {/* Corpo do Site */}
                <div className="p-5 flex-1 flex flex-col" style={{ backgroundColor: siteData.backgroundColor }}>
                  <h3 className="text-sm font-bold mb-2" style={{ color: siteData.primaryColor }}>Bem-vindo</h3>
                  <p className="text-xs text-gray-600 line-clamp-4 leading-relaxed mb-6">
                    {siteData.description || 'A descrição da sua clínica aparecerá aqui. Fale sobre seus diferenciais e tratamentos.'}
                  </p>

                  {/* Botão CTA do Site */}
                  <div className="mt-auto space-y-2">
                    <button type="button" className="w-full py-3 rounded-xl text-white font-bold text-xs shadow-md transition-transform hover:scale-105" style={{ backgroundColor: siteData.accentColor }}>
                      Agendar Consulta
                    </button>
                    <button type="button" className="w-full py-3 rounded-xl font-bold text-xs bg-white text-gray-700 border border-gray-200 shadow-sm transition-transform hover:scale-105">
                      Falar no WhatsApp
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}