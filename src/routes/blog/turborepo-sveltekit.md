---
title: Turborepo with Svelte
date: 2022-04-17
---

What a good time for web development. Turborepo is one of these tools that were recently released by
fine folks from Vercel. Turborepo brings a breeze of fresh air in the javascript tools ecosystem. It
makes working with a large javascript codebase much simpler!

It is a goto solution for javascript monorepos. If you want to manage your javascript codebase on
large projects and even the simple ones. and use all the benefits of cashing the dependencies while
bundling; turborepo is it!

Read more about turborepo [here](https://turborepo.org/).

I made an example using my favourite front-end library, svelte, with turborepo. You can check out
the example repo I made [here](https://github.com/nkostic/sites-example).

Let me explain what I did:

After following through with setting up the initial repo using turborepo starter there were only a
few steps to configure any js library:

Add sites or apps to apps folder Add libs that you wish to reuse into packages folder

In this example I made a stub library in Svelte and 2 stub websites made with sveltkit: nkostic.dev
and tehnika8x8.com

Note: When adding packages make sure they follow npm package guidelines and have package.json so it
can be imported in apps. Here is the example of package.json for my simple svelte library uikit:

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

After adding apps and packages I updated turbo.json by adding svelte-kit in outputs for build:

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

Now if we peek into index.svelte in routes of tehnika8x8.com website you will see how we import the
button from uikit svelte library:

```js
<script>
    import Button from “uikit”
</script>
<Button> Test Button </Button>
```

Note: Because we now have 2 sveltekit sites we want to make sure they run on different ports so we
can simultaneously work on both.

The key here is to specify the port for each sveltkit site by updating the dev command script
located in the root of the site in their respective package.json:

```json
  “scripts”: {
    “dev”: “svelte-kit dev --port 3003”,
    ...
```

Now in the root of the project in console do

```sh
npm run dev
```

This will spawn all of the apps in the project on their designated ports.

```sh
npm run build
```

This one will build all of the repos (apps and packages) at once.

In the gitlab example provided I have kept the original examples made with ReactJs and NextJs
powered with typescript that came from the turborepo starter.

Turborepo will keep all node_modules required for the packages and apps in the root of monorepo.

Now the best part is yet to come; cashing, you could cash the build and rebuild only when change has
been made and save lots of money for your company or your business.

For this you need to login:

```
npx turbo login
# and then link
npx turbo link
```

Read more about it in turborepo [docs](https://turborepo.org/docs) and definitely check out
[this](https://monorepo.tools/) online resource that goes more into the monorepos world and what
options are out there.

Thanks Jared Palmer and Vercel for making Turborepo!
