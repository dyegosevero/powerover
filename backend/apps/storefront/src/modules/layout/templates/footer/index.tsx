import { listCategories } from "@lib/data/categories";
import { listCollections } from "@lib/data/collections";
import { Text, clx } from "@modules/common/components/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

export default async function Footer() {
  const { collections } = await listCollections({ fields: "*products" });
  const productCategories = await listCategories();

  return (
    <footer className="border-t border-white/10 w-full bg-black text-white">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-20">
          <div>
            <LocalizedClientLink href="/" className="block">
              <img
                src="/logo-powerover.png"
                alt="PowerOver Motorsports Factory"
                style={{ height: 48, width: "auto", filter: "invert(1)", marginBottom: 8 }}
              />
              <p className="text-white/40 text-xs mt-2 tracking-widest uppercase">
                Alta Performance · Suspensão · Câmbio · Kit Ângulo
              </p>
            </LocalizedClientLink>
          </div>
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
            {productCategories && productCategories.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="text-xs tracking-widest uppercase text-white/50 mb-2">
                  Categorias
                </span>
                <ul className="grid grid-cols-1 gap-2" data-testid="footer-categories">
                  {productCategories.slice(0, 6).map((c) => {
                    if (c.parent_category) return null;
                    return (
                      <li key={c.id}>
                        <LocalizedClientLink
                          className="text-white/60 hover:text-white transition-colors text-sm"
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="text-xs tracking-widest uppercase text-white/50 mb-2">
                  Coleções
                </span>
                <ul className="grid grid-cols-1 gap-2">
                  {collections.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="text-white/60 hover:text-white transition-colors text-sm"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <span className="text-xs tracking-widest uppercase text-white/50 mb-2">Contato</span>
              <ul className="grid grid-cols-1 gap-y-2 text-sm">
                <li>
                  <a href="https://www.powerover.com.br" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors">
                    Site Oficial
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com/powerovermotorsport" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <LocalizedClientLink href="/store" className="text-white/60 hover:text-white transition-colors">
                    Todos os Produtos
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/contato" className="text-white/60 hover:text-white transition-colors">
                    Fale Conosco
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/rastreamento" className="text-white/60 hover:text-white transition-colors">
                    Rastrear Pedido
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="text-xs tracking-widest uppercase text-white/50 mb-2">Legal</span>
              <ul className="grid grid-cols-1 gap-y-2 text-sm">
                <li>
                  <LocalizedClientLink href="/politica-de-trocas" className="text-white/60 hover:text-white transition-colors">
                    Trocas e Devoluções
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/termos-de-uso" className="text-white/60 hover:text-white transition-colors">
                    Termos de Uso
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/termos-de-uso" className="text-white/60 hover:text-white transition-colors">
                    Privacidade (LGPD)
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex w-full mb-10 justify-between text-white/30 border-t border-white/10 pt-6">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} Powerover Motorsport. Todos os direitos reservados.
          </Text>
          <Text className="txt-compact-small">
            <style>{`.footer-dev-link { color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s; } .footer-dev-link:hover { color: #51c020; }`}</style>
            Desenvolvido por{" "}
            <a href="https://instagram.com/justdyego" target="_blank" rel="noopener noreferrer" className="footer-dev-link">Dyego</a>
            {" "}do{" "}
            <a href="https://efkz.com.br" target="_blank" rel="noopener noreferrer" className="footer-dev-link">Coletivo Efkz!</a>
          </Text>
        </div>
      </div>
    </footer>
  );
}
