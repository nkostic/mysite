---
title: Turborepo sa Svelteom
date: 2022-04-17
---

Ažurirano 22. aprila 2022.

Turborepo organizuje JavaScript aplikacije i zajedničke pakete u jednom repozitorijumu. Može da pokreće zadatke kroz ceo repozitorijum, ponovo koristi rezultate build-a i kešira posao lokalno ili preko Vercela.

Napravio sam mali primer sa dva SvelteKit sajta i zajedničkom bibliotekom Svelte komponenti. Kod je dostupan u [repozitorijumu sa primerom sajtova](https://github.com/nkostic/sites-example).

Počnite od Turborepo šablona.

```bash
npx create-turbo@latest
```

Šablon razdvaja aplikacije u `apps`, a zajednički kod u `packages`. U `apps` sam dodao dva SvelteKit sajta, `nkostic.dev` i `tehnika8x8.com`. U `packages` sam dodao mali paket komponenti pod nazivom `uikit`.

Svaki zajednički paket mora da ima sopstveni `package.json` kako bi ga aplikacije mogle uvoziti.

```json
{
  "name": "uikit",
  "version": "0.0.0",
  "main": "./index.svelte",
  "types": "./index.svelte",
  "devDependencies": {
    "svelte": "^3.44.0"
  }
}
```

Koreni `turbo.json` govori Turborepou koji izlazni folderi pripadaju kom zadatku. Moje originalno SvelteKit podešavanje koristilo je ovu konfiguraciju.

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "svelte-kit/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false
    }
  }
}
```

Aplikacija može da uveze zajedničku Svelte komponentu kao bilo koji drugi paket.

```svelte
<script>
  import Button from "uikit";
</script>

<Button>Test Button</Button>
```

Svakoj aplikaciji sam dodelio drugačiji port za razvoj kako bi obe mogle da rade istovremeno.

```json
{
  "scripts": {
    "dev": "svelte-kit dev --port 3003"
  }
}
```

Komande pokrećite iz korena repozitorijuma. Turborepo sam pronalazi odgovarajuće aplikacije i pakete.

```sh
npm run dev
npm run build
```

Najkorisnija funkcija je keširanje. Prijavite se i povežite repozitorijum da biste uključili Vercelov udaljeni keš.

```sh
npx turbo login
npx turbo link
```

<img src="/turborepo-link-step1.png" alt="Turborepo zahtev za prijavu">

Vercel traži da odobrite vezu pomoću GitHub ili Google naloga.

<img src="/turborepo-link.png" alt="Turborepo autorizacija naloga">

Nakon povezivanja repozitorijuma, ponovljeni zadaci mogu da koriste keširani rezultat umesto da se ponovo izvršavaju.

```sh
npm run build
```

<img src="/turborepo-cached.png" alt="Turborepo izlaz keširanog build-a">

Zadatak možete pokrenuti i bez dodavanja skripte u korenu.

```sh
npx turbo run dev
npx turbo run build
```

[Turborepo dokumentacija](https://turborepo.org/docs) pokriva konfiguraciju i udaljeno keširanje. [Monorepo Tools](https://monorepo.tools/) je korisno poređenje dostupnih pristupa.
