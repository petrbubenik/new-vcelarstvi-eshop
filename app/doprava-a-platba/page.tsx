import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Doprava a platba | Včelařské potřeby Bubeník",
  description: "Informace o dopravě a platbě při nákupu včelařských potřeb. PPL doprava po celé ČR, osobní odběr v Bludově. Platba bankovním převodem, dobírkou nebo v hotovosti.",
  openGraph: {
    title: "Doprava a platba | Včelařské potřeby Bubeník",
    description: "Informace o dopravě a platbě při nákupu včelařských potřeb.",
    url: "https://shop.vcelarstvi-bubenik.cz/doprava-a-platba",
    type: "website",
  },
};

export default function DopravaAPlatbaPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center text-sm text-amber-700 hover:text-amber-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Zpět na hlavní stránku
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-stone-900">
        Doprava a platba
      </h1>

      <div className="prose prose-stone max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900">
            Možnosti a ceny dopravy
          </h2>

          <div className="mb-6 overflow-hidden rounded-lg border border-stone-200">
            <table className="w-full text-left">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-stone-900">
                    PPL
                  </th>
                  <th className="px-4 py-3 font-semibold text-stone-900">
                    Celková objednávka
                  </th>
                  <th className="px-4 py-3 font-semibold text-stone-900">
                    Cena dopravy
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="px-4 py-3" rowSpan={2}></td>
                  <td className="px-4 py-3 text-stone-700">
                    do 2 500 Kč
                  </td>
                  <td className="px-4 py-3 font-semibold text-amber-700">
                    129 Kč
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-stone-700">
                    nad 2 500 Kč
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-700">
                    ZDARMA
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900">
            Osobní odběr
          </h2>
          <p className="text-stone-700">
            Po obdržení potvrzovacího e-mailu si můžete zboží vyzvednout na adrese
            provozovny – <strong>Polní 46, 789 61 Bludov</strong>. Zboží bude pro
            Vás rezervované po dobu 5 pracovních dnů. Osobní odběr je vždy{" "}
            <strong>zdarma</strong>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900">
            Možnosti platby
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-stone-900">
                Převodem z bankovního účtu
              </h3>
              <p className="text-stone-700">
                Při zvolení platby převodem z účtu Vám budou po zadání objednávky
                obratem zaslány platební údaje e-mailem. Zásilku odesíláme v okamžiku,
                kdy je celková částka připsána na náš bankovní účet.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-stone-900">
                Dobírkou
              </h3>
              <p className="text-stone-700">
                Dobírkou je možné hradit zásilky zajišťované společností PPL. Příplatek
                za dobírku je <strong>100 Kč</strong>. Zboží skladem je ihned po objednání
                expedováno.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <h3 className="mb-2 font-semibold text-stone-900">
            Kontakt pro dotazy ohledně objednávek
          </h3>
          <p className="text-stone-700">
            Máte-li jakékoli dotazy k dopravě nebo platbě, kontaktujte mě na{" "}
            <a
              href="mailto:obchod@vcelarstvi-bubenik.cz"
              className="font-semibold text-amber-700 hover:underline"
            >
              obchod@vcelarstvi-bubenik.cz
            </a>{" "}
            nebo telefonicky na{" "}
            <a
              href="tel:+420777553319"
              className="font-semibold text-amber-700 hover:underline"
            >
              +420 777 553 319
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
