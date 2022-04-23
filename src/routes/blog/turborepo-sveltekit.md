---
title: Turborepo with Svelte
date: 2022-04-17
---

Updated 2022-04-22

What is Turborepo and why you might need it?

Its a toolkit to organize and maintain your JavaScript projects. Want to do something good for your machine, planet earth and your JavaScript code? Try turborepo. Do it like a pro!

Turborepo was recently released by Jared Palmer and fine folks from Vercel. Turborepo brings a
breeze of fresh air in the javascript tools ecosystem. Simplicity of setup with the great benefits!
Reuse node_modules for all your projects and libs, reuse your configurations, mock api, on top of
that link effortlessly your cloud account and cache 3rd party dependencies; this will save you some
money and make you a good citizen of earth.

More in detail of this great product in their super awesome [website](https://turborepo.org/).

As advertised in the title I whipped up the example using svelte and sveltekit with turborepo. This
code can be found [here](https://github.com/nkostic/sites-example).

In a nutshell:

Create a new project using turborepo starter:

```bash
npx create-turbo@latest
```

"apps" and "packages" is where our repositories shall be kept.

I went ahead and added two sveltekit sites called nkostic.dev and tehnika8x8.com into "apps" folder
and as well as small svelte stub library which I named uikit and placed in "packages" folder.

Note: When adding packages make sure they follow npm package guidelines and have package.json so it
can be imported in apps. Here is the example of package.json for my stub svelte library uikit:

```json
{
    “name”: “uikit”,
    “version”: “0.0.0",
    “main”: “./index.svelte”,
    “types”: “./index.svelte”,
    “devDependencies”: {
        “svelte”: “^3.44.0”
    }
}
```

After adding apps and packages we need to configure turbo config located in turbo.json. I only had
to append the svelte-kit command in the outputs for build:

```sh
{
  “pipeline”: {
    “build”: {
      “dependsOn”: [“^build”],
      “outputs”: [“dist/**“, “.next/**“, “svelte-kit/**“]
    },
    “lint”: {
      “outputs”: []
    },
    “dev”: {
      “cache”: false
    }
  }
}
```

Take a look into index.svelte in routes of "tehnika8x8.com" website where you can see how "uikit"
components are being imported:

```js
<script>
    import Button from “uikit”
</script>
<Button> Test Button </Button>
```

Next we need to set up different ports for each repository from "apps" folder so we can ran all the
sites simultaneously. This might be quite handy for some use cases. Update dev command script
located in the root of the site in their respective package.json:

```json
  “scripts”: {
    “dev”: “svelte-kit dev --port 3003”,
    ...
```

That is it we are now ready to start developing!

```sh
npm run dev
```

This will spawn all of the apps in the project on their designated ports.

```sh
npm run build
```

You must be wandering where do you run this commands since each lib or app will have its own
package.json?

Run all the commands in the root of the monorepo. Turborepo is taking care of it.

I have kept the original examples made with turborepo starter in the Gitlab example provided. This
examples are built with React and NextJs.

Turborepo will keep all node_modules required for the packages and apps in the root of monorepo.

Now the best part; caching!

first login than link:

```
npx turbo login
# and then link
npx turbo link
```

Read more about turborepo [here](https://turborepo.org/docs) and definitely check out
[this](https://monorepo.tools/) great online resource that goes more into the monorepos world and
what options are out there.

Big thanks too Jared Palmer and Vercel for making Turborepo!
