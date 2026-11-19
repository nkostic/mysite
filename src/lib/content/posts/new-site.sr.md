---
title: Novi sajt
date: 2021-07-15
---

Danas sam pokrenuo ovaj sajt. Predugo sam odlagao posao, ali je konačno na mreži.

Jokull Solberg je pisao o originalnom postavljanju u [svom blog tekstu o SvelteKitu](https://www.solberg.is/sveltekit-blog). Počeo sam da sklapam sličan stek kada sam naišao na njegov repozitorijum. Već je radio sve što mi treba, pa sam ga forkovao i napravio [svoju verziju](https://github.com/nkostic/mysite).

Novi sajt zamenjuje Gatsby i React [SvelteKitom](https://kit.svelte.dev/). Za stilizovanje koristi [Tailwind CSS](https://tailwindcss.com/), za hostovanje [Cloudflare Workers](https://developers.cloudflare.com/), a za članke [MDsveX](https://mdsvex.com/).

Objavljivanje teksta ima tri koraka.

1. Napišite članak u Markdownu.
2. Izgradite sajt.

```sh
npm run build
```

3. Objavite ga.

```sh
wrangler publish
```

Zbog ovako jednostavnog toka rada pisanje ovde ponovo prija.

<img src="/svelte-kit-machine.png" alt="SvelteKit razvojna mašina">
