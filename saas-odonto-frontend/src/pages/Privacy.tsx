import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Cabeçalho */}
        <div className="mb-12 border-b border-slate-200 pb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar para a Home
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Política de Privacidade</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Última atualização: 01/11/2026</p>
        </div>

        {/* Conteúdo */}
        <div className="space-y-10 text-slate-600 leading-relaxed text-justify">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Quem somos</h2>
            <p>
              Esta Política de Privacidade descreve como GUSTAVO FERREIRA LOPES DESENVOLVIMENTO DE SOFTWARE CUSTOMIZAVEL LTDA (nome fantasia GFL SISTEMAS), inscrita no CNPJ sob o nº 69.482.034/0001-66, com sede na Rua Pais Leme, 215, Conjunto 1713, Pinheiros, São Paulo/SP, CEP 05424-150, realiza o tratamento de dados pessoais na plataforma OdontoOffice, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Definições</h2>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Titular:</strong> pessoa natural a quem se referem os dados pessoais.</li>
              <li><strong>Controlador:</strong> quem decide sobre o tratamento dos dados pessoais.</li>
              <li><strong>Operador:</strong> quem realiza o tratamento em nome do Controlador.</li>
              <li><strong>Encarregado (DPO):</strong> pessoa indicada para atuar como canal de comunicação entre o Controlador, os Titulares e a ANPD.</li>
              <li><strong>ANPD:</strong> Autoridade Nacional de Proteção de Dados.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Quais dados coletamos</h2>
            <div className="mt-4 space-y-4">
              <div>
                <p className="font-bold text-slate-800">3.1. Dados do Usuário (responsável pelo estabelecimento):</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Nome completo, e-mail, senha (armazenada em formato criptografado) e telefone.</li>
                  <li>Dados do estabelecimento: nome, subdomínio, endereço, procedimentos, profissionais e horários.</li>
                  <li>Dados de pagamento processados exclusivamente pelo gateway de pagamento (não armazenamos dados de cartão).</li>
                  <li>Dados de acesso: endereço IP, data/hora, navegador e dispositivo.</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-slate-800">3.2. Dados dos Pacientes (inseridos pelo Usuário):</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Nome e contato (telefone e/ou e-mail).</li>
                  <li>Histórico de agendamentos (procedimento, profissional, data e hora).</li>
                  <li>Dados clínicos e de anamnese inseridos no prontuário eletrônico.</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-slate-800">3.3. Cookies e tecnologias similares:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Cookies essenciais para autenticação e funcionamento da plataforma.</li>
                  <li>Cookies analíticos (mediante consentimento) para melhorar a experiência.</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Finalidades e bases legais</h2>
            <p className="mb-2">O tratamento de dados pessoais é realizado com base nas hipóteses legais previstas no art. 7º da LGPD:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Execução de contrato:</strong> para fornecer a plataforma de gestão contratada.</li>
              <li><strong>Cumprimento de obrigação legal ou regulatória:</strong> quando exigido por lei (ex: fiscais).</li>
              <li><strong>Legítimo interesse:</strong> para segurança, prevenção a fraudes e melhoria dos serviços.</li>
              <li><strong>Consentimento:</strong> para comunicações de marketing e cookies não essenciais.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Papéis: Controlador e Operador</h2>
            <ul className="list-disc pl-6 space-y-3 mt-4">
              <li><strong>5.1.</strong> Em relação aos dados do Usuário (responsável pelo estabelecimento), o OdontoOffice atua como Controlador.</li>
              <li><strong>5.2.</strong> Em relação aos dados dos Pacientes inseridos pelo Usuário, o Usuário atua como Controlador e o OdontoOffice atua como Operador. Nesse caso:
                <ul className="list-circle pl-6 space-y-2 mt-2">
                  <li>O Usuário é responsável por obter base legal adequada para o tratamento.</li>
                  <li>O Usuário deve informar seus pacientes sobre a coleta e uso dos dados.</li>
                  <li>O OdontoOffice tratará tais dados apenas conforme instruções do Usuário.</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Compartilhamento de dados</h2>
            <p className="mb-2">Podemos compartilhar dados pessoais com terceiros estritamente necessários à prestação do serviço, na qualidade de operadores/subprocessadores:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provedores de infraestrutura em nuvem (hospedagem do banco de dados e aplicação).</li>
              <li>Gateways de pagamento (para processar assinaturas).</li>
              <li>Serviços de envio de e-mail transacional.</li>
              <li>Ferramentas de análise e monitoramento (mediante consentimento quando aplicável).</li>
            </ul>
            <p className="mt-4">
              Todos os terceiros são contratualmente obrigados a manter a confidencialidade e a conformidade com a LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Transferência internacional de dados</h2>
            <p>
              Caso ocorra transferência internacional de dados, ela será realizada apenas para países que ofereçam grau de proteção adequado ou mediante garantias contratuais específicas, conforme arts. 33 a 36 da LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Retenção de dados</h2>
            <p className="mb-2">Os dados são armazenados apenas pelo tempo necessário ao cumprimento das finalidades para as quais foram coletados, observados os prazos legais de retenção:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Dados da conta:</strong> enquanto a conta estiver ativa ou pelo prazo legal aplicável.</li>
              <li><strong>Dados de agendamento:</strong> por até 5 (cinco) anos após o último uso, salvo obrigação legal diversa.</li>
              <li><strong>Registros de acesso:</strong> pelo prazo mínimo de 6 meses, conforme o art. 15 do Marco Civil da Internet.</li>
              <li><strong>Dados fiscais:</strong> pelo prazo exigido pela legislação tributária.</li>
            </ul>
            <p className="mt-4">Após o prazo, os dados são anonimizados ou eliminados de forma segura.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Direitos do Titular</h2>
            <p className="mb-2">Nos termos do art. 18 da LGPD, o Titular pode, a qualquer momento, solicitar:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Confirmação da existência de tratamento.</li>
              <li>Acesso aos dados.</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos.</li>
              <li>Portabilidade dos dados a outro fornecedor.</li>
              <li>Eliminação dos dados tratados com base no consentimento.</li>
              <li>Informação sobre entidades com as quais compartilhamos dados.</li>
              <li>Informação sobre a possibilidade de não fornecer consentimento e as consequências.</li>
              <li>Revogação do consentimento.</li>
              <li>Oposição a tratamentos realizados sem consentimento, quando houver descumprimento da LGPD.</li>
            </ul>
            <p className="mt-4">
              As solicitações podem ser feitas pelo e-mail <a href="mailto:privacidade@odontooffice.com.br" className="text-emerald-600 font-bold hover:underline">privacidade@odontooffice.com.br</a>. Responderemos em até 15 dias, salvo prazo diverso previsto em regulamentação da ANPD.
            </p>
            
            <div className="mt-6 bg-slate-100 p-6 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-900 mb-2">Exclusão de conta (self-service)</p>
              <p className="text-sm mb-2">
                Se você possui uma conta de acesso à plataforma (administrador de estabelecimento), pode solicitar a exclusão imediata dos seus dados pessoais diretamente pelo painel, sem precisar enviar e-mail:
              </p>
              <ol className="list-decimal pl-6 space-y-1 text-sm">
                <li>Acesse Meu Perfil no painel.</li>
                <li>Role até a seção "Zona de perigo".</li>
                <li>Clique em "Excluir minha conta".</li>
                <li>Digite EXCLUIR no campo de confirmação e finalize.</li>
              </ol>
              <p className="text-sm mt-2">
                Após a confirmação, seus dados pessoais (nome, e-mail, senha) serão anonimizados imediatamente. Registros de auditoria são mantidos por 365 dias por obrigação legal (art. 16 da LGPD e art. 15 do Marco Civil da Internet). Esta ação é irreversível.
              </p>
              <p className="text-sm mt-2">
                Se o Titular for paciente de um estabelecimento cadastrado na plataforma, recomendamos que entre em contato diretamente com o estabelecimento, que atua como Controlador.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Segurança dos dados</h2>
            <p className="mb-2">Adotamos medidas técnicas e administrativas para proteger os dados pessoais, incluindo:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Criptografia de senhas com algoritmo bcrypt.</li>
              <li>Comunicação via HTTPS/TLS.</li>
              <li>Autenticação por token JWT.</li>
              <li>Isolamento lógico de dados por tenant (multi-tenancy).</li>
              <li>Controle de acesso por papéis (RBAC).</li>
              <li>Backups periódicos e monitoramento de segurança.</li>
            </ul>
            <p className="mt-4">
              Nenhum sistema é 100% imune a incidentes. Em caso de incidente de segurança relevante, comunicaremos os Titulares e a ANPD conforme o art. 48 da LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Cookies</h2>
            <p>
              Utilizamos cookies essenciais para o funcionamento da plataforma (como autenticação) e, mediante consentimento, cookies analíticos para entender como os usuários utilizam o serviço. O usuário pode gerenciar cookies nas configurações do navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Encarregado de Dados (DPO)</h2>
            <p>
              Nosso Encarregado de Proteção de Dados (DPO) é Gustavo Ferreira Lopes, que pode ser contatado pelo e-mail <a href="mailto:privacidade@odontooffice.com.br" className="text-emerald-600 font-bold hover:underline">privacidade@odontooffice.com.br</a> para assuntos relacionados à LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Alterações desta Política</h2>
            <p>
              Esta Política pode ser atualizada periodicamente. Recomendamos revisão regular. Alterações relevantes serão comunicadas na plataforma ou por e-mail.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Autoridade Nacional de Proteção de Dados</h2>
            <p>
              Caso o Titular entenda que suas solicitações não foram atendidas adequadamente, poderá apresentar reclamação à ANPD, por meio do site oficial www.gov.br/anpd.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">15. Contato</h2>
            <p>
              Dúvidas sobre esta Política podem ser enviadas para <a href="mailto:contato@odontooffice.com.br" className="text-emerald-600 font-bold hover:underline">contato@odontooffice.com.br</a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}