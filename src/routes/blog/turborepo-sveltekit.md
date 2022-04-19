---
title: Turborepo with Svelte
date: 2022-04-17
---

What a time for web development. Jobs are in demand and tools are getting faster and more efficient each day. 

Turborepo is one of these tools that was recently released by Jared Palmer and
fine folks from Vercel. Turborepo brings a breeze of fresh air in the javascript tools ecosystem. It
makes working with a large javascript codebase simple and it might save some energy and money!

Turborepo is a goto solution for javascript monorepos at the moment. Read more about what monorepo is and why you might need it or what it can bring to a developer toolkit [here](https://monorepo.tools/) and [here](https://turborepo.org/).

As advertised in the title I whipped up the example using svelte and sveltekit with turborepo. This code can be found [here](https://github.com/nkostic/sites-example).

In a nutshell:

Create a new project using turborepo starter:
  
  ```bash
  npx create-turbo@latest
  ```

Now you have to follow simple rule, apps and sites go to apps folder and libraries and configs go to packages folder.

I went ahead and added two sveltekit apps called nkostic.dev and tehnika8x8.com and I also created small svelte stub library named uikit.

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

After adding apps and packages we need to configure turbo config located in turbo.json. I only had to append the svelte-kit command in the outputs for build:

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

Take a look into index.svelte in routes of tehnika8x8.com website where you can see how uikit components are being imported:

```js
<script>
    import Button from “uikit”
</script>
<Button> Test Button </Button>
```

Note: Because we now have 2 sveltekit sites we want to make sure they run on different ports so we
can simultaneously work on both.

This is as simple as specifying the port for each sveltkit site by updating the dev command script
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

You must be wandering where do you run this commands since each lib or app will have its own package.json? 

Run all the commands in the root of the monorepo. Turborepo is taking care of it, well actually we did when we configured the pipeline in the turbo.json file above.

I have kept the original examples made with turborepo starter in the Gitlab example provided. This examples are built with React and NextJs.

Turborepo will keep all node_modules required for the packages and apps in the root of monorepo.

Now the best part; caching!

first login than link:

```
npx turbo login
# and then link
npx turbo link
```

Sweet!

Read more about it in turborepo [docs](https://turborepo.org/docs) and definitely check out
[this](https://monorepo.tools/) online resource that goes more into the monorepos world and what
options are out there.

Big thanks too Jared Palmer and Vercel for making Turborepo!
