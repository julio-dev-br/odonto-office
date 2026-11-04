import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Phone, MessageCircle, Clock, ChevronRight } from 'lucide-react';

export default function PublicSite() {
  const [siteData, setSiteData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hostname = window.location.hostname; 
    const parts = hostname.split('.');
    const slug = parts.length > 1 && parts[0] !== 'www' ? parts[0] : 'sorriso-perfeito'; 

    axios.get(`http://localhost:3000/clinic-sites/public/${slug}`)
      .then(response => {
        setSiteData(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Site não encontrado ou em manutenção.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Carregando clínica...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Ops, página não encontrada.</h1>
        <p className="text-slate-500 max-w-md">{error}</p>
      </div>
    );
  }

  const { settings, clinicName } = siteData;
  const branding = settings.branding;
  
  // Formata o número do whatsapp para o link
  const whatsappNumber = settings.whatsapp?.replace(/\D/g, '') || '';
  const whatsappLink = `https://wa.me/55${whatsappNumber}`;

  return (
    <div 
      className="min-h-screen font-sans flex flex-col"
      style={{ backgroundColor: branding.backgroundColor }}
    >
      
      {/* HEADER DA CLÍNICA */}
      <header className="w-full py-6 px-6 md:px-12 flex justify-between items-center shadow-sm" style={{ backgroundColor: branding.primaryColor }}>
        <div className="flex items-center gap-3">
          {settings.logo ? (
            <img src={settings.logo} alt={clinicName} className="h-12 w-auto object-contain bg-white rounded-lg p-1" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm">
              {clinicName.charAt(0)}
            </div>
          )}
          <span className="text-xl md:text-2xl font-bold text-white tracking-tight">{clinicName}</span>
        </div>
        
        <a 
          href={whatsappLink} 
          target="_blank" 
          rel="noreferrer"
          className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-transform hover:scale-105 shadow-lg"
          style={{ backgroundColor: branding.accentColor, color: '#fff' }}
        >
          <MessageCircle size={18} />
          Agendar Consulta
        </a>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        
        <div className="space-y-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-sm font-bold" style={{ color: branding.primaryColor }}>
            <Clock size={16} />
            Atendimento de Excelência
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight" style={{ color: branding.primaryColor }}>
            {settings.title || 'Bem-vindo à nossa clínica.'}
          </h1>
          
          <p className="text-lg md:text-xl opacity-80 leading-relaxed max-w-lg mx-auto md:mx-0" style={{ color: branding.primaryColor }}>
            {settings.description || 'Cuidando do seu sorriso com a tecnologia e o carinho que você merece. Agende sua avaliação.'}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
            <a 
              href={whatsappLink}
              target="_blank" 
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-xl"
              style={{ backgroundColor: branding.accentColor, color: '#fff' }}
            >
              <MessageCircle size={22} />
              Falar no WhatsApp
            </a>
            
            {settings.phone && (
              <a 
                href={`tel:${settings.phone}`}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 bg-white/50 backdrop-blur-sm border-2 transition-colors hover:bg-white/80"
                style={{ borderColor: branding.primaryColor, color: branding.primaryColor }}
              >
                <Phone size={22} />
                Ligar Agora
              </a>
            )}
          </div>
        </div>

        {/* MOCKUP VISUAL / FOTO */}
        <div className="relative hidden md:block">
          <div className="absolute inset-0 rounded-[3rem] transform rotate-3 scale-105 opacity-20 blur-xl" style={{ backgroundColor: branding.primaryColor }}></div>
          <div className="relative bg-white p-4 rounded-[2.5rem] shadow-2xl border border-black/5">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100 flex items-center justify-center relative">
              
              {/* Imagem ilustrativa genérica (pode ser trocada no futuro) */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundColor: branding.accentColor }}></div>
              <div className="text-center p-8 space-y-4 z-10">
                <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg" style={{ backgroundColor: branding.primaryColor }}>
                  {clinicName.charAt(0)}
                </div>
                <h3 className="font-bold text-xl" style={{ color: branding.primaryColor }}>{clinicName}</h3>
                <p className="text-sm opacity-60">Sua saúde bucal em boas mãos.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER PÚBLICO */}
      <footer className="w-full py-8 text-center text-sm border-t border-black/5 mt-auto" style={{ color: branding.primaryColor }}>
        <p className="font-medium opacity-70">
          &copy; {new Date().getFullYear()} {clinicName}. Todos os direitos reservados.
        </p>
        <p className="mt-2 text-xs opacity-50 flex items-center justify-center gap-1">
          Powered by OdontoOffice <ChevronRight size={12} />
        </p>
      </footer>

      {/* BOTÃO FLUTUANTE DO WHATSAPP (MOBILE) */}
      <a 
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="md:hidden fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-50 text-white animate-bounce"
        style={{ backgroundColor: '#25D366' }} // Cor oficial do WhatsApp
      >
        <MessageCircle size={32} />
      </a>

    </div>
  );
}