---
title: Najbolje iz 2023.
date: 2023-12-31
---

<img src="/picaso-dalle-2023.webp" alt="Apstraktni portret koji je generisao DALL-E">
<div style="font-style: italic; display: flex; justify-content: center;">Slika je napravljena pomoću DALL-E.</div>

Neke godine donesu više promena od drugih. Za mene je 2023. bila jedna od njih. Ovo su alati i ideje koji su mi privukli pažnju kao web programeru.

## Svelte i SvelteKit

<img src="/rundown2023/svelte.png" alt="Svelte logo na narandžastoj pozadini">

Volim širinu JavaScript sveta. React, Vue, Angular i Qwik imaju dobre ideje, ali Svelte je i dalje biblioteka koju najviše volim da koristim.

Svelte 4 stigao je u junu sa manje zavisnosti, manjim paketima i bržim build-ovima. Tim je takođe osvežio dokumentaciju i alate za učenje na [svelte.dev](https://svelte.dev), [kit.svelte.dev](https://kit.svelte.dev) i [learn.svelte.dev](https://learn.svelte.dev/).

```bash
npx svelte-migrate@latest svelte-4
```

Prvi pregled Sveltea 5 uveo je runes, Svelteov pristup eksplicitnoj reaktivnosti. Podsetio me je na delove KnockoutJS-a koji su u svoje vreme bili ispred vremena.

SvelteKit 2 je takođe stigao sa podrškom za Vite 5 i plitkim rutiranjem (shallow routing) pomoću `pushState` i `replaceState`.

```sh
npx svelte-migrate sveltekit-2
```

<img src="/rundown2023/sveltekit.png" alt="SvelteKit logo">

Plitko rutiranje može da unapredi interfejse poput dijaloga na mobilnim uređajima jer ažurira istoriju pregledača bez učitavanja nove stranice.

```html
<script>
  import { pushState } from '$app/navigation';
  import { page } from '$app/stores';
  import Modal from './Modal.svelte';

  function showModal() {
    pushState('', { showModal: true });
  }
</script>

{#if $page.state.showModal}
  <Modal close={() => history.back()} />
{/if}
```

## Vite 5

<div style="display: flex; justify-content: center;">
  <img src="/rundown2023/vite.png" alt="Vite logo" width="50%">
</div>

Vite je brz, jednostavan za podešavanje i koristan u mnogim JavaScript projektima. Verzija 5 donela je Rollup 4, bolju podršku za TypeScript i strože rukovanje greškama.

## TypeScript

TypeScript mi pomaže da uhvatim greške pre nego što stignu do pregledača. Verzija 5 dodala je standardne dekoratore, koji olakšavaju izražavanje obrazaca kao što je logovanje metoda.

```ts
function loggedMethod(originalMethod: any, _context: any) {
  function replacementMethod(this: any, ...args: any[]) {
    console.log("LOG: Entering method.");
    const result = originalMethod.call(this, ...args);
    console.log("LOG: Exiting method.");
    return result;
  }

  return replacementMethod;
}

class Person {
  constructor(public name: string) {}

  @loggedMethod
  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}
```

[Najava TypeScripta 5.0](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/) Daniela Rosenwassera detaljno objašnjava promenu. Axel Rauschmayer je takođe napisao koristan [pregled dekoratora](https://2ality.com/2022/10/javascript-decorators.html).

## Playwright

<img src="/rundown2023/playwright.png" alt="Playwright logo">

[Playwright](https://playwright.dev/) je moj omiljeni alat za automatizaciju pregledača. Koristim ga za testove komponenti i potpune end-to-end skupove testova. Vizuelni pokretač testova dodat 2023. znatno je olakšao debagovanje.

<img src="/rundown2023/playwrightui.png" alt="Playwright pokretač testova">

## Pregledači

<img src="/rundown2023/Browsers2023.png" alt="Logotipi pregledača koje sam koristio 2023.">

Arc sam koristio za organizovanje svakodnevnog pregledanja, Brave za istraživanje, a Edge za veći deo razvoja. Chrome i Firefox ostali su neophodne ciljne platforme za testiranje. WebKit je takođe imao jaku godinu, naročito zahvaljujući novoj podršci za CSS.

Jen Simmons je pokrila najkorisnije promene u WebKitu u svojoj [WWDC23 sesiji](https://developer.apple.com/videos/play/wwdc2023/10121/).

<img src="/rundown2023/split-view.png" alt="Podeljeni prikaz u Arc pregledaču">

## Tailwind i shadcn/ui

<img src="/rundown2023/Tailwind_logo.png" alt="Tailwind CSS logo">

[shadcn/ui](https://ui.shadcn.com/) postao je moj omiljeni način za pravljenje ponovo upotrebljivih komponenti uz [Tailwind CSS](https://tailwindcss.com/). Takođe mi je bilo drago što je Svelte zajednica napravila [shadcn-svelte](https://www.shadcn-svelte.com/).

<img src="/rundown2023/shadcn.png" alt="shadcn/ui sajt">

## Figma i Photoshop

<img src="/rundown2023/figmap.png" alt="Figma interfejs">

Figma je ostala moj glavni alat za dizajn i prototipove. Photoshopovi novi AI alati su me takođe ubedili da zadržim pretplatu, iako sam razmišljao da ga zamenim.

## Node i Bun

<img src="/rundown2023/nodejs-logo-svgrepo-com.svg" alt="Node.js logo">

Nekoliko starih Node.js izdanja dostiglo je kraj podrške 2023, dok su verzije 18 i 20 postale praktičan izbor za aktuelne projekte.

Stigao je i Bun 1.0. Brzina pokretanja, ugrađena podrška za TypeScript i integracija sa SQLiteom učinili su ga zabavnim za male eksperimente.

<img src="/rundown2023/bunlogo.svg" alt="Bun logo">

## GitHub, VS Code i Copilot

<img src="/rundown2023/githubcopilot.webp" alt="GitHub Copilot interfejs">

GitHub je i dalje jedno od mojih omiljenih mesta na webu jer mogu da učim direktno iz radnog koda. VS Code je i dalje moj glavni editor. Koristim [VSCode Neovim ekstenziju](https://github.com/vscode-neovim/vscode-neovim) za vežbanje uređivanja pomoću tastature, a [GitHub Copilot](https://copilot.github.com/) za repetitivan kod.

<img src="/rundown2023/vscode.png" alt="Visual Studio Code logo">

## Veliki jezički modeli

<img src="/rundown2023/chatgpt.png" alt="ChatGPT interfejs">

Veliki jezički modeli su 2023. prešli iz istraživačkih demonstracija u moj svakodnevni rad. ChatGPT sam koristio za pisanje nacrta, debagovanje i istraživanje nepoznatih tema. Bio je koristan, ali zbog njegovih samouverenih grešaka i dalje sam morao pažljivo da proveravam rezultate.

Metino izdanje LLaMA takođe je učinilo sposobne jezičke modele dostupnijim većem broju istraživača i programera. [Uvod u velike jezičke modele](https://www.youtube.com/watch?v=zjkBMFhNj_g) Andreja Karpathyja odlično objašnjava kako oni rade.

## Na putu ka 2024.

Ova lista je mogla biti mnogo duža, ali ovo su delovi 2023. koji su mi ostali u sećanju. Zanima me koji će od njih i dalje biti važni za godinu dana.

<img src="/rundown2023/happy-new-year2024.png" alt="Ilustracija Srećna Nova 2024. godina">
