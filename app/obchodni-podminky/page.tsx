import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Obchodní podmínky | Včelařské potřeby Bubeník",
  description: "Obchodní podmínky pro nákup včelařských potřeb. Reklamační práva, vrácení zboží, doručování, platby a další důležité informace.",
  openGraph: {
    title: "Obchodní podmínky | Včelařské potřeby Bubeník",
    description: "Obchodní podmínky pro nákup včelařských potřeb.",
    url: "https://vcelarstvi-bubenik.cz/obchodni-podminky",
    type: "website",
  },
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
          <p className="text-stone-700 mt-6">
            Tyto všeobecné obchodní podmínky (dále jen „Obchodní podmínky") jsou vydané dle § 1751 a násl. zákona č. 89/2012 Sb., občanský zákoník (dále jen „Občanský zákoník"):
          </p>
          <p className="text-stone-700 mt-6">
            <strong>Petr Bubeník</strong><br />
            Místo podnikání: <strong>Bohdíkovská 3444/118, 787 01 Šumperk</strong><br />
            IČO: <strong>08252734</strong><br />
            DIČ: <strong>CZ6307021919</strong><br />
            E-mail: <strong>obchod@vcelarstvi-bubenik.cz</strong><br />
            Telefon: <strong>+420 777 553 319</strong><br />
            Web: <strong>vcelarstvi-bubenik.cz</strong><br />
            (dále jen „Prodávající")
          </p>
          <p className="text-stone-700 mt-6">
            Tyto Obchodní podmínky upravují vzájemná práva a povinnosti Prodávajícího a fyzické osoby, která uzavírá kupní smlouvu mimo svou podnikatelskou činnost jako spotřebitel, nebo v rámci své podnikatelské činnosti (dále jen: „Kupující") prostřednictvím webového rozhraní umístěného na webové stránce dostupné na internetové adrese vcelarstvi-bubenik.cz (dále jen „Internetový obchod").
          </p>
          <p className="text-stone-700 mt-6">
            Ustanovení Obchodních podmínek jsou nedílnou součástí kupní smlouvy. Odchylná ujednání v kupní smlouvě mají přednost před ustanoveními těchto Obchodních podmínek.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900">II. Uzavření kupní smlouvy</h2>
          <p className="text-stone-700 mt-6">
            Veškerá prezentace zboží umístěná v Internetovém obchodě je informativního charakteru a Prodávající není povinen uzavřít kupní smlouvu ohledně tohoto zboží.
          </p>
          <p className="text-stone-700 mt-6">
            Internetový obchod obsahuje informace o zboží, a to včetně uvedení cen jednotlivého zboží a nákladů za navrácení zboží, jestliže toto zboží ze své podstaty nemůže být vráceno obvyklou poštovní cestou. Ceny zboží jsou uvedeny včetně daně z přidané hodnoty a všech souvisejících poplatků.
          </p>
          <p className="text-stone-700 mt-6">
            Pro objednání zboží vyplní Kupující objednávkový formulář. Objednávkový formulář obsahuje zejména informace o:
          </p>
          <ul className="list-disc space-y-2 text-stone-700 pl-6">
            <li>objednávaném zboží (vloží "do košíku"),</li>
            <li>způsobu úhrady kupní ceny zboží, údaje o požadovaném způsobu doručení,</li>
            <li>informace o nákladech spojených s dodáním zboží.</li>
          </ul>
          <p className="text-stone-700 mt-6">
            Před odesláním objednávky je Kupujícímu umožněno zkontrolovat a měnit údaje, které do objednávky vložil. Objednávku odešle Kupující Prodávajícímu kliknutím na tlačítko s textem „Objednat s povinností platby" (nebo jinou obdobnou jednoznačnou formulací).
          </p>
          <p className="text-stone-700 mt-6">
            Prodávající neprodleně po obdržení objednávky toto obdržení Kupujícímu potvrdí elektronickou poštou na adresu elektronické pošty Kupujícího uvedenou v objednávce (dále jen „Elektronická adresa kupujícího").
          </p>
          <p className="text-stone-700 mt-6">
            Smluvní vztah mezi Prodávajícím a Kupujícím vzniká doručením přijetí objednávky (akceptací), jež je Prodávajícím zaslano Kupujícímu na Elektronickou adresu kupujícího.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900">III. Cena zboží a Platební podmínky</h2>
          <p className="text-stone-700 mt-6">
            Cenu zboží a případné náklady spojené s dodáním zboží dle kupní smlouvy může Kupující uhradit Prodávajícímu následujícími způsoby:
          </p>
          <ul className="list-disc space-y-2 text-stone-700 pl-6">
            <li>bezhotovostně bankovním převodem na účet Prodávajícího;</li>
            <li>dobírkou v hotovosti při předání zboží;</li>
            <li>hotově při osobním vyzvednutí zboží.</li>
          </ul>
          <p className="text-stone-700 mt-6">
            Společně s kupní cenou je Kupující povinen zaplatit Prodávajícímu také náklady spojené s balením a dodáním zboží ve smluvené výši.
          </p>
          <p className="text-stone-700 mt-6">
            V případě bezhotovostní platby je závazek Kupujícího uhradit kupní cenu splněn okamžikem připsání příslušné částky na účet Prodávajícího.
          </p>
          <p className="text-stone-700 mt-6">
            Prodávající vystaví ohledně plateb prováděných na základě kupní smlouvy Kupujícímu daňový doklad – fakturu.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900">IV. Odstoupení od smlouvy (Vrácení zboží)</h2>
          <p className="text-stone-700 mt-6">
            Kupující bere na vědomí, že dle § 1837 Občanského zákoníku nelze mimo jiné odstoupit od kupní smlouvy o dodávce zboží, které bylo upraveno podle přání Kupujícího nebo pro jeho osobu, od kupní smlouvy o dodávce zboží, které podléhá rychlé zkáze, jakož i zboží, které bylo po dodání nenávratně smíseno s jiným zbožím, a od kupní smlouvy o dodávce zboží v uzavřeném obalu, které Kupující z obalu vyňal a z hygienických důvodů jej není možné vrátit (např. otevřené potraviny/med).
          </p>
          <p className="text-stone-700 mt-6">
            Nejedná-li se o případ uvedený v předchozím odstavci, má Kupující v souladu s § 1829 odst. 1 Občanského zákoníku právo od kupní smlouvy odstoupit, a to do čtrnácti (14) dnů od převzetí zboží.
          </p>
          <p className="text-stone-700 mt-6">
            Odstoupení od kupní smlouvy musí být Prodávajícímu odesláno ve lhůtě uvedené v předchozím odstavci. Pro odstoupení od kupní smlouvy může Kupující využít vzorový formulář poskytovaný Prodávajícím.
          </p>
          <p className="text-stone-700 mt-6">
            V případě odstoupení od smlouvy vrátí Prodávající peněžní prostředky přijaté od Kupujícího do 14 dnů od odstoupení od kupní smlouvy, a to stejným způsobem, jakým je přijal. Prodávající není povinen vrátit přijaté peněžní prostředky Kupujícímu dříve, než mu Kupující zboží vrátí nebo prokáže, že zboží Prodávajícímu odeslal.
          </p>
          <p className="text-stone-700 mt-6">
            Náklady spojené s vrácením zboží nese Kupující.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900">V. Práva z vadného plnění (Reklamace)</h2>
          <p className="text-stone-700 mt-6">
            Práva a povinnosti smluvních stran ohledně práv z vadného plnění se řídí příslušnými obecně závaznými právními předpisy (zejména § 1914 až 1925, § 2099 až 2117 a § 2161 až 2174b Občanského zákoníku a zákonem o ochraně spotřebitele).
          </p>
          <p className="text-stone-700 mt-6">
            Prodávající odpovídá Kupujícímu, že věc při převzetí nemá vady. Zejména Prodávající odpovídá Kupujícímu, že v době, kdy Kupující věc převzal:
          </p>
          <ul className="list-disc space-y-2 text-stone-700 pl-6">
            <li>odpovídá dohodnutému popisu, druhu a množství, jakož i jakosti, funkčnosti a jiným vlastnostem;</li>
            <li>je vhodná k účelu, pro který ji Kupující požaduje a s nímž Prodávající souhlasil;</li>
            <li>je dodána s dohodnutým příslušenstvím a pokyny k použití.</li>
          </ul>
          <p className="text-stone-700 mt-6">
            Kupující může vytknout vadu, která se na věci projeví v době dvou let od převzetí (pokud není u potravin uvedeno datum spotřeby jinak).
          </p>
          <p className="text-stone-700 mt-6">
            Má-li věc vadu, může Kupující požadovat její odstranění. Podle své volby může požadovat dodání nové věci bez vady nebo opravu věci, ledaže je zvolený způsob odstranění vady nemožný nebo ve srovnání s druhým nepřiměreně nákladný.
          </p>
          <p className="text-stone-700 mt-6">
            Kupující může požadovat přiměřenou slevu nebo odstoupit od smlouvy, pokud:
          </p>
          <ul className="list-disc space-y-2 text-stone-700 pl-6">
            <li>Prodávající vadu neodstranil,</li>
            <li>se vada projeví opakovaně,</li>
            <li>je vada podstatným porušením smlouvy.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900">VI. Doručování</h2>
          <p className="text-stone-700 mt-6">
            <strong>Možnosti doručení:</strong>
          </p>
          <ul className="list-disc space-y-2 text-stone-700 pl-6">
            <li><strong>Osobní odběr:</strong> Polní 46, 789 61 Bludov</li>
            <li><strong>Dopravní společnost (PPL CZ)</strong></li>
          </ul>
          <p className="text-stone-700 mt-6">
            Zboží je doručováno pouze v rámci ČR.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-stone-900">VII. Závěrečná ustanovení</h2>
          <p className="text-stone-700 mt-6">
            K mimosoudnímu řešení spotřebitelských sporů z kupní smlouvy je příslušná Česká obchodní inspekce, se sídlem Štěpánská 567/15, 120 00 Praha 2, IČ: 000 20 869, internetová adresa:{" "}
            <a
              href="https://adr.coi.cz/cs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 hover:underline"
            >
              https://adr.coi.cz/cs
            </a>.
          </p>
          <p className="text-stone-700 mt-6">
            Tyto obchodní podmínky nabývají účinnosti dnem 1. 2. 2026.
          </p>
        </section>
      </div>
    </main>
  );
}
