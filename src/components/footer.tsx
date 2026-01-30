import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-amber-100 bg-amber-50/50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-3 font-semibold text-amber-900">
              Včelařské potřeby Bubeník
            </h3>
            <p className="mb-2 text-sm text-stone-600">
              Kvalitní včelařské potřeby přímo od výrobce
            </p>
            <p className="text-sm text-stone-600">
              Výroba včelařských potřeb od roku 2010. Mateří mřížky,
              odvíčkovací talíře, nádoby pod medomet a další.
            </p>
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-amber-900">Kontakt</h3>
            <ul className="space-y-2 text-sm text-stone-600">
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
              <li>
                <strong className="font-medium text-stone-700">IČ:</strong> 08252734　<strong className="font-medium text-stone-700 ml-4">DIČ:</strong> CZ6307021919
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-amber-200 pt-6 text-center text-xs text-stone-500">
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
