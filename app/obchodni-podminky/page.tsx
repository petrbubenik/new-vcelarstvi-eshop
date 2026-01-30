import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Obchodní podmínky | Včelařské potřeby Bubeník",
  description: "Obchodní podmínky pro nákup včelařských potřeb",
};

export default function ObchodniPodminkyPage() {
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
        Obchodní podmínky
      </h1>

      <div className="prose prose-stone max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900">
            VŠEOBECNÉ OBCHODNÍ PODMÍNKY
          </h2>
          <p className="text-stone-700">
            Provozovatelem internetového obchodu{" "}
            <strong>vcelarstvi-bubenik.cz</strong> je fyzická osoba{" "}
            <strong>Petr Bubeník</strong>, se sídlem{" "}
            <strong>Bohdíkovská 3444/118, 787 01 Šumperk</strong>, IČO:{" "}
            <strong>08252734</strong>, DIČ: <strong>CZ6307021919</strong>, e-mail:{" "}
            <strong>obchod@vcelarstvi-bubenik.cz</strong>, telefonní číslo{" "}
            <strong>+420 777 553 319</strong> („Prodávající“).
          </p>
          <p className="text-stone-700">
            Tyto všeobecné obchodní podmínky upravují vzájemná práva a povinnosti
            kupujících a Prodávajícího vzniklá v souvislosti s kupní smlouvou
            uzavírané prostřednictvím E-shopu na webových stránkách
            shop.vcelarstvi-bubenik.cz.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900">1. Některé definice</h2>
          <ul className="list-disc space-y-2 text-stone-700 pl-6">
            <li>
              <strong>Cena</strong> je finanční částka, kterou budete hradit za
              Zboží
            </li>
            <li>
              <strong>Cena za dopravu</strong> je finanční částka, kterou budete
              hradit za doručení Zboží
            </li>
            <li>
              <strong>Celková cena</strong> je součet Ceny a Ceny za dopravu
            </li>
            <li>
              <strong>Objednávka</strong> je Váš neodvolatelný návrh na uzavření
              Smlouvy o koupi Zboží
            </li>
            <li>
              <strong>Zboží</strong> je vše, co můžete nakoupit na E-shopu
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900">
            2. Uzavření smlouvy
          </h2>
          <p className="text-stone-700">
            Smlouvu je možné uzavřít pouze v českém jazyce. Smlouva je
            uzavírána na dálku prostřednictvím E-shopu. Odesláním Objednávky
            souhlasíte s tím, že prostředky komunikace na dálku využíváme.
          </p>
          <p className="text-stone-700">
            Vaši Objednávku Vám v co nejkratší době potvrdím zprávou odeslanou na
            Vaši e-mailovou adresu. Potvrzením Objednávky dochází k uzavření
            Smlouvy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900">
            3. Cenové a platební podmínky
          </h2>
          <p className="text-stone-700">
            Cena je vždy uvedena v rámci E-shopu. Celková cena je uvedena
            včetně DPH včetně veškerých poplatků stanovených zákonem.
          </p>
          <p className="text-stone-700">
            Platbu Celkové ceny můžete provést následujícími způsoby:
          </p>
          <ul className="list-disc space-y-2 text-stone-700 pl-6">
            <li>
              <strong>Bankovním převodem</strong> – Informace pro provedení platby
              Vám zašleme v rámci potvrzení Objednávky. Celková cena je splatná do
              10 pracovních dnů.
            </li>
            <li>
              <strong>Dobírkou</strong> – V takovém případě dojde k platbě při doručení
              Zboží. Příplatek za dobírku je 100 Kč.
            </li>
          </ul>
          <p className="text-stone-700">
            Faktura bude vystavena v elektronické podobě po uhrazení Celkové ceny
            a bude zaslána na Vaši e-mailovou adresu.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900">
            4. Doručení zboží
          </h2>
          <p className="text-stone-700">
            Zboží Vám bude doručeno způsobem dle Vaší volby:
          </p>
          <ul className="list-disc space-y-2 text-stone-700 pl-6">
            <li>
              <strong>Osobní odběr</strong> na provozovně – Polní 46, 789 61 Bludov
            </li>
            <li>
              <strong>Doručení prostřednictvím PPL</strong>
            </li>
          </ul>
          <p className="text-stone-700">
            Zboží je možné doručit pouze v rámci České republiky.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900">
            5. Práva z vadného plnění
          </h2>
          <p className="text-stone-700">
            V případě, že bude mít Zboží vadu, můžete Prodávajícímu takovou vadu
            oznámit a uplatnit práva z vadného plnění zasláním e-mailu na
            obchod@vcelarstvi-bubenik.cz.
          </p>
          <p className="text-stone-700">
            V případě, že jste spotřebitel, máte právo uplatnit práva z vadného
            plnění u vady, která se vyskytne u spotřebního Zboží ve lhůtě 24
            měsíců od převzetí Zboží.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900">
            6. Odstoupení od smlouvy
          </h2>
          <p className="text-stone-700">
            V případě, že jste spotřebitel, máte v souladu s ustanovením §1829
            občanského zákoníku právo odstoupit od Smlouvy bez udání důvodu ve
            lhůtě 14 dnů ode dne doručení Zboží.
          </p>
          <p className="text-stone-700">
            Ani jako spotřebitel však nemůžete od Smlouvy odstoupit v případech, kdy
            je předmětem Smlouvy zboží upravené podle Vašeho přání nebo pro Vaši
            osobu.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900">
            7. Řešení sporů
          </h2>
          <p className="text-stone-700">
            K mimosoudnímu řešení spotřebitelských sporů ze Smlouvy je příslušná
            Česká obchodní inspekce, se sídlem Štěpánská 567/15, 120 00 Praha 2,
            internetová adresa:{" "}
            <a
              href="http://www.coi.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 hover:underline"
            >
              www.coi.cz
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-stone-900">
            8. Závěrečná ustanovení
          </h2>
          <p className="text-stone-700">
            Tyto Podmínky nabývají účinnosti dnem 1.1.2025.
          </p>
        </section>
      </div>
    </main>
  );
}
