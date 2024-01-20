---
title: The best of 2023
date: 2023-12-31
---

<img src="/picaso-dalle-2023.webp" alt="2023">
<div style="font-style: italic; display: flex; justify-content: center;">Image above is made by DALL-E</div>

Some years are crazier than others, 2023 was wild in my book. Here's a brief rundown of the things I found very exciting in 2023 as a professional web developer!

## Svelte and Sveltekit

<img src="/rundown2023/svelte.png" alt="svelte background">

JavaScript is awesome whatever anyone else say. NextJS and React ecosystem is mind blowing, Vue, Angular and Qwik are awesome! I love them all but I am spoiled with Svelte. Svelte remains my favorite ui making library!

Mid-summer 2023 we witnessed the release of Svelte 4 after four years. The library's evolution brought fewer dependencies, smaller package sizes, and faster builds. The IDE Author experience has been enhanced and websites are refreshed.

Check out the upgraded websites: [svelte.dev](https://svelte.dev) and [kit.svelte.dev](https://kit.svelte.dev). New REPLs are available [here](https://learn.svelte.dev/). Kudos to svelte community!

```bash
npx svelte-migrate@latest svelte-4
```

Svelte 5's announcement was made as part of Svelte 4 release notes and the preview arrived later in the year, introducing 'Runes' – a feature akin to signals. Experience it [here](https://svelte-5-preview.vercel.app/docs/introduction). Anyone remember how great KnockoutJS was!

SvelteKit 2.0 is out! Among many upgrades new version integrates Vite 5 and is now offering shallow routing with [pushState](https://kit.svelte.dev/docs/modules#$app-navigation-pushstate) and [replaceState](https://kit.svelte.dev/docs/modules#$app-navigation-replacestate).

```sh
npx svelte-migrate sveltekit-2
```


<img src="/rundown2023/sveltekit.png" alt="sveltekit logo">

Use shallow routing toi improve navigation experience especially in mobile devices!

```html
<script>
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Modal from './Modal.svelte';

	function showModal() {
		pushState('', {
			showModal: true
		});
	}
</script>

{#if $page.state.showModal}
	<Modal close={() => history.back()} />
{/if}
```

## Vite 5

<div style="display: flex; justify-content: center;">
    <img src="/rundown2023/vite.png" alt="vite logo" width="50%">
</div>

Vite continues to be great and choice of many JavaScript projects because of its simplicity and speed when building and optimizing web apps! 

[Vite 5](https://vitejs.dev/blog/announcing-vite5) is out less than one year apart from release 4 and among many improvements around error handling, typescript support improvements and rollup 4 upgrade, announcement was made that rollup will soon be replaced with it's rusty clone!

## TypeScript

Developers love types! Especially when flexible and powerful as typescript. Typescript transformed Microsoft and its transforming many other companies and developers into shipping more reliable JavaScript code. I love it!

Documentary that came out last year describes it well, Check it out if you haven't had a chance to do so yet!

<div style="display: flex; justify-content: center;">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/U6s2pdxebSo?si=DjIFBZkquLex8zSE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

[Typescript 5.0](https://www.typescriptlang.org/) is out since march 2023 and it now supports decorators.

Example, what if you could add console log enter and exit ot every method ?
```ts
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    greet() {
        console.log("LOG: Entering method.");

        console.log(`Hello, my name is ${this.name}.`);

        console.log("LOG: Exiting method.")
    }
}
```
We can write this method:
```ts
function loggedMethod(originalMethod: any, _context: any) {

    function replacementMethod(this: any, ...args: any[]) {
        console.log("LOG: Entering method.")
        const result = originalMethod.call(this, ...args);
        console.log("LOG: Exiting method.")
        return result;
    }

    return replacementMethod;
}

```
Hm wait why any?
Because now:
```ts

class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    @loggedMethod
    greet() {
        console.log(`Hello, my name is ${this.name}.`);
    }
}

const p = new Person("I");
p.greet();

// Output:
//
//   LOG: Entering method.
//   Hello, my name is I.
//   LOG: Exiting method.
```

Examples from [Daniel Rosenwasser Blog Post](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/). You can read in depth [Axel Rauschmayer’s summary](https://2ality.com/2022/10/javascript-decorators.html) or check out the [pull request](https://github.com/microsoft/TypeScript/pull/50820).

## Playwright

<div style="display: flex; justify-content: center;">
    <img src="/rundown2023/playwright.png" alt="typescript logo" >
</div>

[Playwright is awesome!](https://playwright.dev/) I use it for automation of my ui components in real browser. Writing the ui unit tests as well as full blown end to end test suites is so much more fun than anything I tried before in this arena! New --ui tool  was released in 2023 and I love it! Superb website and documentation. I am looking forward to see what team will do next!

<div style="display: flex; justify-content: center;">
    <img src="/rundown2023/playwrightui.png" alt="typescript logo" >
</div>

## Browsers: Arc, Brave, Edge, Webkit, Firefox and Chrome

<img src="/rundown2023/Browsers2023.png" alt="browsers logos 2023" >

Browsers for work, browsers for development, browsers for everyone! 

I love [Arc](https://arc.net/)! It helps me stay organized and so refreshing to use with its innovation's. 

Brave is still on my favorites list and I use it a lot to research stuff because its not eavesdropping as much as others do. 

Development, believe it or not, I do in Edge most of time even in my linux machine.

Webkit had a fantastic year. I use it to test my apps as well on my iphone more than previous years. Check out this great video on a what is new in css and webkit by Jen Simmons form this year WWDC23 [here](https://developer.apple.com/videos/play/wwdc2023/10121/)

 Chrome and Firefox continue to play significant part in my day to day work.

<div style="display: flex; justify-content: center;">
    <img src="/rundown2023/split-view.png" alt="typescript logo" >
</div>
<div style="font-style: italic; display: flex; justify-content: center;">Split View in Arc browser</div>

## Tailwind and Shadcn UI

<div style="display: flex; justify-content: center;">
<img src="/rundown2023/Tailwind_logo.png" alt="Tailwind logo" width="30%">
</div>

[shadcn ui](https://ui.shadcn.com/) is now my favorite tool for making library components with [Tailwind](https://play.tailwindcss.com/) ! There is also [a svelte version](https://www.shadcn-svelte.com/) thanks to awesome svelte community!

<img src="/rundown2023/shadcn.png" alt="browsers logos 2023" >

## Figma and Adobe Photoshop

<div style="display:flex; justify-content: center;">
<img src="/rundown2023/figmap.png" alt="browsers logos 2023" >
</div>

Figma still myu choice for UI design and prototyping. Lots of new updates and features that bridge the gap from design to implementation. I hope divorce with Adobe's short marriage will ensure this product stays independent and innovative!

Adobe Photoshop's integration with AI and latest updates made me rethink decision to ditch it for cheaper alternative. I must admit I prolonged my subscription.

## Node and Bun

<div style="display:flex; justify-content: center;">
    <img src="/rundown2023/nodejs-logo-svgrepo-com.svg" alt="nodo logo" width="50%">
</div>

While Node.js versions 14, 16, 17, and 19 reached EOL, versions 18 and 20+ remain in use every day!

Bun 1.0 is out and has become my preferred runtime for new projects. it is very fast and I enjoy using it very much! Its my go to runtime at the moment for all my new projects!
Kudos for Sqlite, Typescript native support and for the speed!

<div style="display:flex; justify-content: center;">
    <img src="/rundown2023/bunlogo.svg" width="50%" alt="bun logo" >
</div>

## Github VSCode and Copilot


<div style="display:flex; justify-content: center;">
    <img src="/rundown2023/githubcopilot.webp" alt="browsers logos 2023" >
</div>

[Github](https://github.com/) remains the best website in the world in my opinion! learn anything you want! 

VSCode still my top choice when it comes to coding editor and IDE! 
 I recommend the:
- [neovim plugin to build healthy habits](https://github.com/vscode-neovim/vscode-neovim)
- [github copilot](https://copilot.github.com/) to boost your productivity!

<div style="display:flex; justify-content: center;">
    <img src="/rundown2023/vscode.png" width="50%" alt="vscode logo" >
</div>

## LLVM's AI and AGI

<div style="display:flex; justify-content: center;">
    <img src="/rundown2023/chatgpt.png" width="50%" alt="chat gpt logo" >
</div>

Although Moore's Law in its traditional sense may not be as relevant today, we are currently witnessing significant hardware advancements. These improvements have played a crucial role in making technologies like Large Language Models (LLMs) feasible today.

OpenAI's Chat GPT, DALL-E and recently released GPT's made profound impact to my life and work and it seams to everything around me. I use them daily and they are great aside hallucinations that are less frequent! I love their IOS app!

Kudos to Meta for opening documents on LLaMA - A foundational, 65-billion-parameter large language model. You need approximately 140GB of hard drive to download the ~10TB of the compressed internet. What is mind-blowing to me is how all humanity's knowledge can be compressed in ~160GB of data!

Check Out this great 1h talk about large Language models by Andrej Karpathy

<div style="display:flex; justify-content: center;">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/zjkBMFhNj_g?si=q7uxfkdjAiZMQrY1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## Happy New 2024!

There were many more exciting things in 2023 but I will stop myself here. I hope you enjoyed this brief rundown of my favorite things in 2023. I am looking forward to 2024 and I hope you are too!

<div style="display:flex; justify-content: center;">
    <img src="/rundown2023/happy-new-year2024.png" width="100%" alt="chat gpt logo" >
</div>