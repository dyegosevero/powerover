import { Metadata } from "next"
import Breadcrumb from "@modules/common/components/breadcrumb"

export const metadata: Metadata = {
  title: "Termos de Uso e Privacidade | PowerOver Motorsports",
  description: "Termos de uso, política de privacidade e conformidade com a LGPD da PowerOver Motorsports.",
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "#111" }}>{title}</h2>
    <div style={{ fontSize: 14, color: "#444", lineHeight: 1.7 }}>{children}</div>
  </div>
)

export default function TermosDeUsoPage() {
  return (
    <div className="content-container" style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#111", fontFamily: "var(--font-anton, Anton, sans-serif)" }}>
          Termos de Uso e Política de Privacidade
        </h1>
        <Breadcrumb crumbs={[
          { label: "Home", href: "/" },
          { label: "Termos de Uso e Privacidade" },
        ]} />
        <p style={{ fontSize: 13, color: "#999", marginTop: 12 }}>Última atualização: junho de 2026</p>
      </div>

      <Section title="1. Sobre a PowerOver Motorsports">
        <p>
          A PowerOver Motorsports é uma empresa brasileira especializada em peças e acessórios para drift e track,
          com sede em Petrópolis – RJ. CNPJ: a informar. Para contato: <a href="mailto:contato@powerover.com.br" style={{ color: "#51c020" }}>contato@powerover.com.br</a>.
        </p>
      </Section>

      <Section title="2. Uso do Site">
        <p>
          Ao acessar e utilizar este site, você concorda com os presentes Termos de Uso. O site é destinado a
          maiores de 18 anos ou menores sob supervisão de responsável legal.
        </p>
        <p style={{ marginTop: 8 }}>
          É vedado utilizar o site para fins ilícitos, transmitir conteúdo ofensivo, ou tentar comprometer a
          segurança do sistema.
        </p>
      </Section>

      <Section title="3. Produtos e Preços">
        <p>
          Todos os preços são em Reais (BRL) e incluem impostos aplicáveis. Nos reservamos o direito de alterar
          preços sem aviso prévio. Em caso de erro de preço, entraremos em contato antes de processar o pedido.
        </p>
        <p style={{ marginTop: 8 }}>
          As imagens dos produtos são meramente ilustrativas. Especificações técnicas devem ser verificadas com
          nossa equipe antes da compra para garantir compatibilidade com seu veículo.
        </p>
      </Section>

      <Section title="4. Política de Privacidade e LGPD">
        <p>
          A PowerOver Motorsports trata seus dados pessoais em conformidade com a <strong>Lei Geral de Proteção de Dados
          (LGPD – Lei nº 13.709/2018)</strong>.
        </p>

        <h3 style={{ fontSize: 14, fontWeight: 700, marginTop: 16, marginBottom: 8 }}>4.1 Dados coletados</h3>
        <ul style={{ paddingLeft: 20, listStyle: "disc" }}>
          <li>Nome, e-mail, telefone e endereço (para cadastro e entrega)</li>
          <li>Dados de navegação (cookies técnicos para funcionamento do site)</li>
          <li>Histórico de compras (para suporte e garantia)</li>
        </ul>

        <h3 style={{ fontSize: 14, fontWeight: 700, marginTop: 16, marginBottom: 8 }}>4.2 Finalidade do tratamento</h3>
        <ul style={{ paddingLeft: 20, listStyle: "disc" }}>
          <li>Processar e entregar pedidos</li>
          <li>Enviar atualizações sobre seu pedido</li>
          <li>Cumprir obrigações legais e fiscais</li>
          <li>Melhorar nossos produtos e serviços</li>
        </ul>

        <h3 style={{ fontSize: 14, fontWeight: 700, marginTop: 16, marginBottom: 8 }}>4.3 Compartilhamento de dados</h3>
        <p>
          Compartilhamos seus dados apenas com parceiros necessários para execução do serviço (transportadoras,
          processadores de pagamento como MercadoPago, e prestadores de serviços de TI). Não vendemos seus dados
          a terceiros.
        </p>

        <h3 style={{ fontSize: 14, fontWeight: 700, marginTop: 16, marginBottom: 8 }}>4.4 Seus direitos</h3>
        <p>Conforme a LGPD, você tem direito a:</p>
        <ul style={{ paddingLeft: 20, listStyle: "disc", marginTop: 8 }}>
          <li>Confirmar e acessar seus dados pessoais</li>
          <li>Corrigir dados incompletos ou desatualizados</li>
          <li>Solicitar anonimização, bloqueio ou eliminação de dados</li>
          <li>Revogar consentimento a qualquer momento</li>
          <li>Solicitar portabilidade dos dados</li>
        </ul>
        <p style={{ marginTop: 8 }}>
          Para exercer seus direitos, entre em contato pelo e-mail <a href="mailto:contato@powerover.com.br" style={{ color: "#51c020" }}>contato@powerover.com.br</a>.
        </p>
      </Section>

      <Section title="5. Cookies">
        <p>
          Utilizamos cookies estritamente necessários para o funcionamento do carrinho de compras e autenticação.
          Não utilizamos cookies de rastreamento de terceiros ou publicidade.
        </p>
      </Section>

      <Section title="6. Propriedade Intelectual">
        <p>
          Todo o conteúdo do site (textos, imagens, logotipos, design) é propriedade da PowerOver Motorsports ou
          licenciado de terceiros. É proibida a reprodução sem autorização prévia por escrito.
        </p>
      </Section>

      <Section title="7. Limitação de Responsabilidade">
        <p>
          A PowerOver Motorsports não se responsabiliza por danos causados por instalação incorreta de peças,
          uso em condições além das especificadas pelo fabricante, ou modificações realizadas pelo cliente.
        </p>
      </Section>

      <Section title="8. Foro e Lei Aplicável">
        <p>
          Estes termos são regidos pela legislação brasileira. Eventuais litígios serão resolvidos no foro da
          comarca de Petrópolis – RJ.
        </p>
      </Section>

      <Section title="9. Contato">
        <p>
          Dúvidas sobre estes termos ou sobre o tratamento dos seus dados:<br />
          E-mail: <a href="mailto:contato@powerover.com.br" style={{ color: "#51c020" }}>contato@powerover.com.br</a><br />
          Ou acesse nossa <a href="/contato" style={{ color: "#51c020" }}>página de contato</a>.
        </p>
      </Section>
    </div>
  )
}
