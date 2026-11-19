---
title: A new site
date: 2021-07-15
---

I launched this site today. I had postponed the work for far too long, but it is finally online.

Jokull Solberg wrote about the original setup in [his SvelteKit blog post](https://www.solberg.is/sveltekit-blog). I had started assembling a similar stack when I found his repository. It already did what I needed, so I forked it and made [my version](https://github.com/nkostic/mysite).

The new site replaces Gatsby and React with [SvelteKit](https://kit.svelte.dev/). It uses [Tailwind CSS](https://tailwindcss.com/) for styling, [Cloudflare Workers](https://developers.cloudflare.com/) for hosting, and [MDsveX](https://mdsvex.com/) for articles.

Publishing a post takes three steps.

1. Write the article in Markdown.
2. Build the site.

```sh
npm run build
```

3. Publish it.

```sh
wrangler publish
```

That small workflow makes writing here enjoyable again.

<img src="/svelte-kit-machine.png" alt="SvelteKit development machine">
