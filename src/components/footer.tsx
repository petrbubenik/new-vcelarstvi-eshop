import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-amber-100 bg-amber-50/50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-base font-semibold text-amber-900 sm:text-lg">
              Poctivé včelařské řemeslo od roku 2010
            </h2>
            <p className="text-xs leading-relaxed text-stone-600 sm:text-sm">
              Už více než 15 let pro vás vyrábím vybavení, kterému věří stovky
              včelařů po celé zemi. Mé výrobky nejsou jen zboží, ale výsledek
              letité praxe a naslouchání vašim potřebám.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-base font-semibold text-amber-900 sm:text-lg">Kontakt</h2>
            <ul className="space-y-1 text-xs text-stone-600 sm:text-sm">
              <li className="font-semibold text-stone-900">Petr Bubeník</li>
              <li>
                <strong className="font-medium text-stone-700">Telefon:</strong>{" "}
                <a href="tel:+420777553319" className="hover:text-amber-700">
                  +420 777 553 319
                </a>
              </li>
              <li>
                <strong className="font-medium text-stone-700">E-mail:</strong>{" "}
                <a
                  href="mailto:obchod@vcelarstvi-bubenik.cz"
                  className="hover:text-amber-700"
                >
                  obchod@vcelarstvi-bubenik.cz
                </a>
              </li>
              <li className="flex flex-wrap gap-x-4">
                <span><strong className="font-medium text-stone-700">IČ:</strong> 08252734</span>
                <span><strong className="font-medium text-stone-700">DIČ:</strong> CZ6307021919</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 border-t border-amber-200 pt-4 text-center text-[10px] text-stone-500 sm:mt-8 sm:pt-6 sm:text-xs">
          <p>
            © {new Date().getFullYear()} Včelařské potřeby Bubeník. Všechna
            práva vyhrazena.
          </p>
          <p className="mt-1">
            Vytvořeno s láskou k včelařství. 🐝
          </p>
        </div>
      </div>
    </footer>
  );
}
