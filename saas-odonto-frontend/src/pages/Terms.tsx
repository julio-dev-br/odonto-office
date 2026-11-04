import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Cabeçalho */}
        <div className="mb-12 border-b border-slate-200 pb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar para a Home
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Termos de Uso</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Última atualização: 01/11/2026</p>
        </div>

        {/* Conteúdo */}
        <div className="space-y-10 text-slate-600 leading-relaxed text-justify">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Aceitação dos Termos</h2>
            <p>
              Estes Termos de Uso regulam o acesso e a utilização da plataforma OdontoOffice, disponibilizada por GUSTAVO FERREIRA LOPES DESENVOLVIMENTO DE SOFTWARE CUSTOMIZAVEL LTDA (nome fantasia GFL SISTEMAS), inscrita no CNPJ sob o nº 69.482.034/0001-66, com sede na Rua Pais Leme, 215, Conjunto 1713, Pinheiros, São Paulo/SP, CEP 05424-150 ("nós" ou "Plataforma"). Ao criar uma conta, contratar um plano ou utilizar qualquer funcionalidade, você ("Usuário") declara ter lido, compreendido e aceito integralmente estes Termos, bem como a nossa Política de Privacidade.
            </p>
            <p className="mt-4">
              Caso não concorde com qualquer disposição, o Usuário não deverá utilizar a Plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Descrição do Serviço</h2>
            <p>
              O OdontoOffice é uma plataforma de software como serviço (SaaS) que permite a profissionais e estabelecimentos odontológicos gerenciarem sua agenda, profissionais, pacientes, prontuários e finanças, além de disponibilizar uma página pública personalizada acessível por subdomínio próprio, sem necessidade de cadastro pelos pacientes finais.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Cadastro e Conta</h2>
            <ul className="list-disc pl-6 space-y-3 mt-4">
              <li><strong>3.1.</strong> Para utilizar a Plataforma, o Usuário deverá criar uma conta fornecendo informações verdadeiras, completas e atualizadas.</li>
              <li><strong>3.2.</strong> O Usuário é o único responsável pela veracidade das informações fornecidas, bem como pela guarda e sigilo de suas credenciais de acesso.</li>
              <li><strong>3.3.</strong> É vedado o compartilhamento da conta com terceiros. Toda atividade realizada com as credenciais do Usuário será considerada de sua responsabilidade.</li>
              <li><strong>3.4.</strong> O Usuário deve ter no mínimo 18 anos e capacidade civil plena para contratar os serviços.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Planos, Pagamentos e Cancelamento</h2>
            <ul className="list-disc pl-6 space-y-3 mt-4">
              <li><strong>4.1.</strong> A Plataforma oferece planos de assinatura cujos valores, recursos e formas de pagamento estão descritos na página de planos.</li>
              <li><strong>4.2.</strong> Os pagamentos são processados por terceiros (gateways de pagamento). Ao contratar, o Usuário concorda com os termos do respectivo provedor.</li>
              <li><strong>4.3.</strong> O período de teste, quando oferecido, permite o uso gratuito por prazo determinado. Após esse prazo, o plano escolhido será cobrado automaticamente.</li>
              <li><strong>4.4.</strong> O Usuário pode cancelar a assinatura a qualquer momento. O acesso permanece ativo até o fim do período já pago.</li>
              <li><strong>4.5.</strong> Não haverá reembolso proporcional por cancelamento antecipado, salvo disposição legal em contrário.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Obrigações do Usuário</h2>
            <p className="mb-2">O Usuário se compromete a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Utilizar a Plataforma em conformidade com a legislação vigente.</li>
              <li>Não utilizar o serviço para fins ilícitos, fraudulentos ou que violem direitos de terceiros.</li>
              <li>Não inserir conteúdo ofensivo, ilegal, discriminatório ou que infrinja direitos autorais.</li>
              <li>Obter as devidas autorizações dos pacientes ao coletar e inserir seus dados na Plataforma.</li>
              <li>Manter seus dados cadastrais atualizados.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Proteção de Dados Pessoais</h2>
            <ul className="list-disc pl-6 space-y-3 mt-4">
              <li><strong>6.1.</strong> O tratamento de dados pessoais realizado na Plataforma é regido pela nossa Política de Privacidade, elaborada em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD).</li>
              <li><strong>6.2.</strong> Em relação aos dados dos pacientes cadastrados pelo Usuário na Plataforma, o Usuário atua na condição de Controlador e o OdontoOffice na condição de Operador, nos termos do art. 5º da LGPD.</li>
              <li><strong>6.3.</strong> O Usuário se compromete a manter base legal adequada para o tratamento dos dados pessoais de seus pacientes, bem como a fornecer a eles as informações exigidas pela LGPD.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Propriedade Intelectual</h2>
            <ul className="list-disc pl-6 space-y-3 mt-4">
              <li><strong>7.1.</strong> Todo o conteúdo, código-fonte, marca, layout e funcionalidades da Plataforma são de propriedade exclusiva de GUSTAVO FERREIRA LOPES DESENVOLVIMENTO DE SOFTWARE CUSTOMIZAVEL LTDA (nome fantasia GFL SISTEMAS), sendo vedada a reprodução, distribuição ou uso não autorizado.</li>
              <li><strong>7.2.</strong> Os dados inseridos pelo Usuário (informações do estabelecimento, profissionais, procedimentos e pacientes) permanecem de propriedade do Usuário.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Disponibilidade e Suporte</h2>
            <ul className="list-disc pl-6 space-y-3 mt-4">
              <li><strong>8.1.</strong> Nos esforçamos para manter a Plataforma disponível continuamente, mas não garantimos operação ininterrupta e livre de erros. Podem ocorrer manutenções programadas ou indisponibilidades temporárias.</li>
              <li><strong>8.2.</strong> O suporte é oferecido conforme o plano contratado.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Limitação de Responsabilidade</h2>
            <ul className="list-disc pl-6 space-y-3 mt-4">
              <li><strong>9.1.</strong> A Plataforma é fornecida "como está". Não nos responsabilizamos por lucros cessantes, perda de dados decorrente de uso indevido, ou danos indiretos.</li>
              <li><strong>9.2.</strong> Não nos responsabilizamos pela relação comercial entre o Usuário e seus pacientes, incluindo comparecimento, cancelamento, qualidade do serviço prestado ou inadimplência.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Suspensão e Encerramento</h2>
            <ul className="list-disc pl-6 space-y-3 mt-4">
              <li><strong>10.1.</strong> Podemos suspender ou encerrar contas que violem estes Termos, a legislação vigente ou que apresentem risco à segurança da Plataforma.</li>
              <li><strong>10.2.</strong> O Usuário pode solicitar o encerramento da conta a qualquer momento pelos canais de atendimento.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Alterações dos Termos</h2>
            <p>
              Podemos atualizar estes Termos periodicamente. Alterações relevantes serão comunicadas com antecedência razoável. O uso contínuo da Plataforma após a atualização implica concordância com os novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Legislação Aplicável e Foro</h2>
            <p>
              Estes Termos são regidos pelas leis brasileiras. Eventuais controvérsias serão resolvidas no foro da comarca de São Paulo/SP, salvo disposição legal aplicável ao consumidor.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Contato</h2>
            <p>
              Em caso de dúvidas sobre estes Termos, entre em contato pelo e-mail <a href="mailto:contato@odontooffice.com.br" className="text-emerald-600 font-bold hover:underline">contato@odontooffice.com.br</a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}