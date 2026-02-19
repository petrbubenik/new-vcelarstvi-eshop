# Včelařství Bubeník E-shop (Next.js)

Minimalistický e‑shop pro český trh postavený na Next.js (App Router), TypeScriptu, Tailwind CSS, Shadcn UI a Prisma.

## Požadavky

- Node.js **20+** (doporučeno LTS)
- npm (součást Node.js)

Tip (macOS):
- Homebrew: `brew install node@20`
- Nebo instalátor z webu Node.js

## Bootstrap (Phase 1: Setup & Configuration)

Spusť v této složce projektu:

```bash
npx create-next-app@latest . \
  --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" \
  --use-npm
```

Pak inicializuj Shadcn UI:

```bash
npx shadcn-ui@latest init
```

## Spuštění

```bash
npm run dev
```

## Poznámky k SEO

Budeme používat Next.js Metadata API (globální `metadata` + dynamické `generateMetadata` na detailu produktu).

## Produkty, objednávky a platby (scope)

- 3–5 produktů
- Bez registrace / přihlášení (guest checkout)
- Platby: bankovní převod / dobírka (bez platební brány)

