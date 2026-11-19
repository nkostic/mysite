---
title: Turborepo with Svelte
date: 2022-04-17
---

Updated April 22, 2022.

Turborepo organizes JavaScript applications and shared packages in one repository. It can run tasks across the repository, reuse build output, and cache work locally or through Vercel.

I built a small example with two SvelteKit sites and a shared Svelte component library. The code is available in the [sites example repository](https://github.com/nkostic/sites-example).

Start with the Turborepo template.

```bash
npx create-turbo@latest
```

The template separates applications into `apps` and shared code into `packages`. I added two SvelteKit sites named `nkostic.dev` and `tehnika8x8.com` under `apps`. I also added a small component package named `uikit` under `packages`.

Every shared package needs its own `package.json` so applications can import it.

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

The root `turbo.json` tells Turborepo which output folders belong to each task. My original SvelteKit setup used this configuration.

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

An application can import the shared Svelte component like any other package.

```svelte
<script>
  import Button from "uikit";
</script>

<Button>Test Button</Button>
```

I assigned each application a different development port so both could run at once.

```json
{
  "scripts": {
    "dev": "svelte-kit dev --port 3003"
  }
}
```

Run commands from the root of the repository. Turborepo finds the relevant applications and packages.

```sh
npm run dev
npm run build
```

The most useful feature is caching. Sign in and link the repository to enable Vercel's remote cache.

```sh
npx turbo login
npx turbo link
```

<img src="/turborepo-link-step1.png" alt="Turborepo login prompt">

Vercel asks you to authorize the connection with a GitHub or Google account.

<img src="/turborepo-link.png" alt="Turborepo account authorization">

After linking the repository, repeated tasks can reuse cached output instead of running again.

```sh
npm run build
```

<img src="/turborepo-cached.png" alt="Turborepo cached build output">

You can also run a task without adding a root script.

```sh
npx turbo run dev
npx turbo run build
```

The [Turborepo documentation](https://turborepo.org/docs) covers configuration and remote caching. [Monorepo Tools](https://monorepo.tools/) is a useful comparison of the available approaches.
