import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import toast from 'react-hot-toast';

// 🚀 DADOS DAS FUNCIONALIDADES
const featuresData = [
  {
    title: "Agenda e Painel",
    description: "Gestão da fila de recepção em tempo real, controle de cadeira e acompanhamento clínico.",
    color: "emerald",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  },
  {
    title: "Gestão Financeira",
    description: "Controle de fluxo de caixa, gestão de despesas, receitas e automação de recorrências.",
    color: "blue",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  },
  {
    title: "Prontuário Eletrônico",
    description: "Anamnese, histórico de evolução clínica e documentação completa do paciente.",
    color: "purple",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  },
  {
    title: "Procedimentos",
    description: "Catálogo personalizado com precificação e tempo estimado de cadeira por procedimento.",
    color: "orange",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  }
];

// 🚀 DADOS DOS PLANOS ATUALIZADOS
const plansData = [
  {
    name: "Starter",
    description: "Ideal para dentistas autônomos começando.",
    price: "99",
    features: ["1 Usuário", "Agenda e Pacientes", "Prontuário Básico"],
    isPopular: false,
    buttonText: "Assine Agora",
  },
  {
    name: "Pro",
    description: "Ideal para clínicas em crescimento.",
    price: "199",
    features: ["Até 5 Usuários", "Gestão Financeira Completa", "Criador de Sites Exclusivo", "Anamnese Digital"],
    isPopular: true,
    buttonText: "Assine Agora",
  },
  {
    name: "Platinum",
    description: "Para grandes operações e múltiplas cadeiras.",
    price: "349",
    features: ["Usuários Ilimitados", "Painel Clínico Avançado", "Automação de Recorrência", "Suporte Prioritário"],
    isPopular: false,
    buttonText: "Assine Agora",
  }
];

// 🚀 DADOS DO FAQ
const faqData = [
  {
    question: "Preciso instalar algum programa para usar o OdontoOffice?",
    answer: "Não. O OdontoOffice é uma plataforma 100% online (SaaS). Você só precisa de um navegador de internet e pode acessar de qualquer computador, tablet ou celular, de qualquer lugar do mundo."
  },
  {
    question: "Como funciona o Criador de Sites da clínica?",
    answer: "É uma ferramenta integrada no painel. Você escolhe as cores, faz o upload do seu logo e preenche suas informações de contato. O sistema gera automaticamente uma página pública bonita e pronta para você compartilhar com seus pacientes."
  },
  {
    question: "Meus dados e os dados dos meus pacientes estão seguros?",
    answer: "Sim. Utilizamos uma arquitetura multi-tenant de nível bancário. Isso significa que os dados da sua clínica ficam totalmente isolados dos dados de outras clínicas na mesma plataforma. Além disso, todas as senhas são criptografadas e a navegação é protegida por HTTPS."
  },
  {
    question: "Posso cancelar a assinatura quando quiser?",
    answer: "Com certeza. Não temos fidelidade. Você pode cancelar a sua assinatura diretamente pelo painel a qualquer momento. O seu acesso continuará ativo até o final do período já pago."
  }
];

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // 🚀 NOVOS ESTADOS PARA O FORMULÁRIO DE CONTATO
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactWebsite, setContactWebsite] = useState(''); // Honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
      const sections = ['funcionalidades', 'criador', 'planos'];
      let currentSection = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            currentSection = section;
          }
        }
      }
      setActiveSection(currentSection);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
          website: contactWebsite, // 🛡️ Enviando o Honeypot
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem.');
      }

      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');

      // Limpa o formulário após o envio
      setContactName('');
      setContactEmail('');
      setContactMessage('');

    } catch (error) {
      toast.error('Ocorreu um erro ao enviar. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLinkClass = (sectionId: string) => {
    const baseClass = "text-sm font-bold transition-colors cursor-pointer ";
    return activeSection === sectionId
      ? baseClass + "text-emerald-600"
      : baseClass + "text-slate-500 hover:text-slate-900";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 relative">
      {/* NAVBAR, HERO, FUNCIONALIDADES, CRIADOR DE SITES permanecem iguais */}
      {/* ... (código da Navbar, Hero, Funcionalidades, Criador) ... */}
      {/* Vou omitir para não ficar muito longo, mas o código é o mesmo que você me mandou. 
          Apenas a seção de Planos foi alterada abaixo. */}

      {/* NAVBAR */}
      <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={scrollToTop}>
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Odonto<span className="text-emerald-500">Office</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#funcionalidades" onClick={(e) => handleScrollToSection(e, 'funcionalidades')} className={getLinkClass('funcionalidades')}>Funcionalidades</a>
            <a href="#criador" onClick={(e) => handleScrollToSection(e, 'criador')} className={getLinkClass('criador')}>Criador de Sites</a>
            <a href="#planos" onClick={(e) => handleScrollToSection(e, 'planos')} className={getLinkClass('planos')}>Planos</a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-slate-900 px-4 py-2 transition-colors">Login</Link>
            <Link to="/register" className="text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/30">Começar Grátis</Link>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl py-4 px-6 flex flex-col gap-4">
            <a href="#funcionalidades" onClick={(e) => handleScrollToSection(e, 'funcionalidades')} className="text-sm font-bold text-slate-700 cursor-pointer">Funcionalidades</a>
            <a href="#criador" onClick={(e) => handleScrollToSection(e, 'criador')} className="text-sm font-bold text-slate-700 cursor-pointer">Criador de Sites</a>
            <a href="#planos" onClick={(e) => handleScrollToSection(e, 'planos')} className="text-sm font-bold text-slate-700 cursor-pointer">Planos</a>
            <hr className="border-slate-100" />
            <Link to="/login" className="text-sm font-bold text-slate-700">Login</Link>
            <Link to="/register" className="text-sm font-bold text-white bg-emerald-500 text-center px-6 py-3 rounded-xl">Começar Grátis</Link>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <Reveal className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              A nova era digital para clínicas
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Gerencie sua clínica e crie sua própria <span className="text-emerald-500">página de recepção</span>.
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto lg:mx-0">
              Centralize agenda, prontuários e finanças em um só lugar. Personalize as cores, logo e informações do seu mini site para encantar seus pacientes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-500/30 hover:-translate-y-1 text-center">
                Começar Grátis Agora
              </Link>
              <a href="#planos" onClick={(e) => handleScrollToSection(e, 'planos')} className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-2xl transition-all text-center cursor-pointer">
                Conhecer os Planos
              </a>
            </div>
          </Reveal>
          <Reveal delay={200} className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-3xl transform rotate-3 scale-105 blur-lg"></div>
            <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 flex gap-4">
              <div className="w-1/3 bg-slate-50 rounded-2xl p-4 flex flex-col gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-100 mb-2"></div>
                <div className="h-2 w-full bg-slate-200 rounded"></div>
                <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                <div className="h-2 w-5/6 bg-slate-200 rounded"></div>
              </div>
              <div className="w-2/3 space-y-4">
                <div className="h-32 bg-slate-100 rounded-2xl w-full"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-emerald-50 rounded-2xl w-full"></div>
                  <div className="h-20 bg-slate-100 rounded-2xl w-full"></div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section id="funcionalidades" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">O ecossistema completo da sua clínica</h2>
            <p className="text-slate-500 text-lg">Tudo o que você precisa para abandonar as planilhas e elevar o nível do seu atendimento.</p>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuresData.map((feature, index) => (
              <Reveal key={feature.title} delay={100 * (index + 1)}>
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-shadow h-full">
                  <div className={`w-12 h-12 bg-${feature.color}-100 text-${feature.color}-600 rounded-2xl flex items-center justify-center mb-6`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {feature.icon}
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAL: CRIADOR DE SITES */}
      <section id="criador" className="py-24 bg-slate-900 text-white overflow-hidden scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 rounded-full"></div>
            <div className="relative bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-2xl">
              <div className="flex gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center font-bold text-white shadow-lg">Logo</div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900"></div>
                    <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-slate-900"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-32 bg-slate-700/50 rounded-xl w-full"></div>
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2"></div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={200} className="order-1 lg:order-2 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wide border border-emerald-500/30">
              Exclusivo OdontoOffice
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight">Sua clínica com a sua própria cara.</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Não gaste fortunas com agências. Com o nosso construtor integrado, você altera as cores, adiciona o seu logo e disponibiliza seus contatos em uma página linda e pronta para receber novos pacientes.
            </p>
            <ul className="space-y-4 pt-4">
              <li className="flex items-center gap-3">
                <svg className="w-6 h-6 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-300">Personalização de cores e identidade visual</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-6 h-6 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-300">Links diretos para WhatsApp e redes sociais</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-6 h-6 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-300">Sem escrever uma única linha de código</span>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 🚀 PLANOS ATUALIZADOS 🚀 */}
      <section id="planos" className="py-24 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Planos que cabem no seu momento</h2>
            <p className="text-slate-500 text-lg">Escolha a melhor opção para a sua clínica e mude de plano quando quiser.</p>
          </Reveal>

          {/* items-stretch garante que todos os cards tenham a mesma altura */}
          <div className="grid lg:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {plansData.map((plan, index) => (
              <Reveal key={plan.name} delay={100 * (index + 1)} className="h-full">
                {/* O grupo 'group' serve para aplicar o hover no botão quando o mouse passa no card */}
                <div className={`group p-8 rounded-3xl border flex flex-col h-full bg-white transition-all duration-300 relative hover:border-emerald-500 hover:shadow-2xl ${plan.isPopular ? 'border-2 border-emerald-500 shadow-xl' : 'border-slate-200'}`}>

                  {plan.isPopular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                      Mais Popular
                    </div>
                  )}

                  <h3 className="text-xl font-bold mb-2 text-slate-900">{plan.name}</h3>
                  <p className="text-sm mb-6 text-slate-500">{plan.description}</p>
                  <div className="text-4xl font-extrabold mb-6 text-slate-900">
                    R$ {plan.price}<span className="text-lg font-medium text-slate-500">/mês</span>
                  </div>

                  {/* flex-1 faz a lista ocupar o espaço restante, empurrando o botão para baixo */}
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-slate-600">
                        <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* 🚀 Adicionado o ?plan=${plan.name.toLowerCase()} para passar o plano pela URL */}
                  <Link to={`/register?plan=${plan.name.toLowerCase()}`} className="block text-center w-full py-3 rounded-xl font-bold transition-colors bg-slate-900 text-white group-hover:bg-emerald-500 group-hover:text-white">
                    {plan.buttonText}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ... (código do FAQ, Contato, Footer e Botão Voltar ao topo continuam iguais) ... */}

      {/* FAQ SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Perguntas Frequentes</h2>
            <p className="text-slate-500 text-lg">Ainda tem dúvidas? Nós temos as respostas.</p>
          </Reveal>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Reveal key={index} delay={50 * index}>
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white transition-all hover:border-emerald-200">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="font-bold text-slate-900">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                  >
                    <p className="text-slate-500 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-emerald-500 overflow-hidden">
        <Reveal className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight">Pronto para transformar a gestão da sua clínica?</h2>
          <p className="text-lg text-emerald-50 max-w-2xl mx-auto">Junte-se aos profissionais que já economizam horas de trabalho por dia e encantam seus pacientes.</p>
          <Link to="/register" className="inline-block px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1">
            Criar Minha Conta Grátis
          </Link>
        </Reveal>
      </section>

      {/* SEÇÃO DE CONTATO E MAPA */}
      <section id="contato" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Fale com a nossa equipe</h2>
            <p className="text-slate-500 text-lg">Tire suas dúvidas, agende uma demonstração ou visite nosso escritório.</p>
          </Reveal>
          <div className="grid lg:grid-cols-2 gap-8 bg-white p-4 rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="h-[400px] lg:h-auto w-full rounded-2xl overflow-hidden bg-slate-200">
              <iframe
                src="https://maps.google.com/maps?q=Rua%20Pais%20Leme,%20215,%20Conjunto%201713,%20Pinheiros,%20S%C3%A3o%20Paulo,%20SP,%2005424-150&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Endereço OdontoOffice"
              ></iframe>
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-8 space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-sm font-medium">Rua Pais Leme, 215, Conjunto 1713, Pinheiros, São Paulo/SP</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span className="text-sm font-medium">contato@odontooffice.com.br</span>
                </div>
              </div>
              <form className="space-y-4" onSubmit={handleContactSubmit}>
                {/* 🛡️ HONEYPOT: Campo invisível para humanos, mas visível para robôs */}
                <input
                  type="text"
                  name="website"
                  value={contactWebsite}
                  onChange={(e) => setContactWebsite(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Nome</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-slate-50"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">E-mail</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-slate-50"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Mensagem</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-slate-50 resize-none"
                    placeholder="Como podemos ajudar?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 pt-16 pb-8 text-slate-300 font-sans border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={scrollToTop}>
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  ODONTO<span className="text-emerald-500">OFFICE</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
                A plataforma definitiva para gestão de clínicas odontológicas. Centralize sua agenda, prontuários, finanças e crie a sua própria página de recepção.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Produto</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#funcionalidades" onClick={(e) => handleScrollToSection(e, 'funcionalidades')} className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">Funcionalidades</a></li>
                <li><a href="#criador" onClick={(e) => handleScrollToSection(e, 'criador')} className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">Criador de Sites</a></li>
                <li><a href="#planos" onClick={(e) => handleScrollToSection(e, 'planos')} className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">Planos e Preços</a></li>
                <li><a href="#contato" onClick={(e) => handleScrollToSection(e, 'contato')} className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Legal e Acesso</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/terms" className="text-slate-400 hover:text-emerald-400 transition-colors">Termos de Uso</Link></li>
                <li><Link to="/privacy" className="text-slate-400 hover:text-emerald-400 transition-colors">Política de Privacidade</Link></li>
                <li><Link to="/login" className="text-slate-400 hover:text-emerald-400 transition-colors">Acessar Painel</Link></li>
                <li><a href="mailto:contato@odontooffice.com.br" className="text-slate-400 hover:text-emerald-400 transition-colors">contato@odontooffice.com.br</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <div className="text-center md:text-left">&copy; 2026 GFL SISTEMAS. CNPJ 69.482.034/0001-66. Todos os direitos reservados.</div>
            <div className="text-center md:text-right flex items-center gap-1">Desenvolvido para clínicas de alta performance.</div>
          </div>
        </div>
      </footer>

      {/* BOTÃO VOLTAR AO TOPO */}
      <button
        onClick={scrollToTop}
        aria-label="Voltar ao topo"
        className={`fixed bottom-8 right-8 p-3 bg-slate-900 text-white rounded-xl shadow-lg transition-all duration-300 z-50 cursor-pointer hover:bg-emerald-500 hover:scale-110 hover:shadow-xl hover:shadow-emerald-500/40 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}