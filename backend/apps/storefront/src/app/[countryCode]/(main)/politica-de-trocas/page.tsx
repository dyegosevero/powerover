import { Metadata } from "next"
import Breadcrumb from "@modules/common/components/breadcrumb"

export const metadata: Metadata = {
  title: "Política de Trocas e Devoluções | PowerOver Motorsports",
  description: "Conheça nossa política de trocas e devoluções. Garantimos a qualidade de todos os produtos.",
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "#111" }}>{title}</h2>
    <div style={{ fontSize: 14, color: "#444", lineHeight: 1.7 }}>{children}</div>
  </div>
)

export default function PoliticaDeTrocasPage() {
  return (
    <div className="content-container" style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#111", fontFamily: "var(--font-anton, Anton, sans-serif)" }}>
          Política de Trocas e Devoluções
        </h1>
        <Breadcrumb crumbs={[
          { label: "Home", href: "/" },
          { label: "Política de Trocas e Devoluções" },
        ]} />
        <p style={{ fontSize: 13, color: "#999", marginTop: 12 }}>Última atualização: junho de 2026</p>
      </div>

      <Section title="1. Prazo para Trocas e Devoluções">
        <p>
          De acordo com o Código de Defesa do Consumidor (Lei nº 8.078/90), o cliente tem até <strong>7 dias corridos</strong> após o
          recebimento do produto para solicitar a devolução por arrependimento, sem necessidade de justificativa.
        </p>
        <p style={{ marginTop: 8 }}>
          Para produtos com defeito de fabricação, o prazo é de <strong>30 dias para produtos não duráveis</strong> e <strong>90 dias para produtos duráveis</strong>, contados a partir do recebimento.
        </p>
      </Section>

      <Section title="2. Condições para Troca ou Devolução">
        <ul style={{ paddingLeft: 20, listStyle: "disc" }}>
          <li>Produto na embalagem original, sem sinais de uso indevido</li>
          <li>Acompanhado de nota fiscal e todos os acessórios incluídos</li>
          <li>Não ter sido instalado ou modificado pelo cliente</li>
          <li>Solicitação feita dentro dos prazos estabelecidos</li>
        </ul>
        <p style={{ marginTop: 8 }}>
          Produtos com desgaste por uso inadequado, instalação incorreta ou danos causados pelo cliente não são elegíveis para troca ou devolução.
        </p>
      </Section>

      <Section title="3. Como Solicitar">
        <p>
          Entre em contato conosco pelo e-mail <a href="mailto:contato@powerover.com.br" style={{ color: "#51c020" }}>contato@powerover.com.br</a> ou
          acesse a <a href="/contato" style={{ color: "#51c020" }}>página de contato</a> informando:
        </p>
        <ul style={{ paddingLeft: 20, listStyle: "disc", marginTop: 8 }}>
          <li>Número do pedido</li>
          <li>Produto(s) que deseja trocar ou devolver</li>
          <li>Motivo da solicitação</li>
          <li>Fotos do produto (em caso de defeito)</li>
        </ul>
        <p style={{ marginTop: 8 }}>
          Respondemos em até <strong>2 dias úteis</strong> com as instruções para envio.
        </p>
      </Section>

      <Section title="4. Custos de Envio">
        <p>
          Em caso de <strong>arrependimento</strong>: o frete de devolução é de responsabilidade do cliente.
        </p>
        <p style={{ marginTop: 8 }}>
          Em caso de <strong>defeito de fabricação ou erro nosso</strong>: nós cobrimos o custo do frete de devolução e do reenvio do produto correto.
        </p>
      </Section>

      <Section title="5. Reembolso">
        <p>
          Após recebermos e analisarmos o produto devolvido (prazo de até 5 dias úteis), o reembolso será processado:
        </p>
        <ul style={{ paddingLeft: 20, listStyle: "disc", marginTop: 8 }}>
          <li><strong>Cartão de crédito:</strong> estorno em até 2 faturas, conforme operadora</li>
          <li><strong>Pix / boleto:</strong> depósito em conta em até 5 dias úteis</li>
        </ul>
      </Section>

      <Section title="6. Peças de Competição">
        <p>
          Peças classificadas como "uso em pista" ou "competição" podem ter política diferenciada explicitada na página do produto.
          Essas peças são vendidas para uso específico e o cliente assume total responsabilidade pela instalação e uso adequado.
        </p>
      </Section>

      <Section title="7. Contato">
        <p>
          Dúvidas? Fale conosco:<br />
          E-mail: <a href="mailto:contato@powerover.com.br" style={{ color: "#51c020" }}>contato@powerover.com.br</a><br />
          Ou acesse nossa <a href="/contato" style={{ color: "#51c020" }}>página de contato</a>.
        </p>
      </Section>
    </div>
  )
}
