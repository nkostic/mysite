---
title: React Native and Expo, one stack that travels well
date: 2026-03-08
---

<script>
  import { SiReact, SiExpo, SiClerk, SiConvex, SiGithubcopilot, SiChatbot } from "@icons-pack/svelte-simple-icons";
  import TechnologyStrip from "$lib/TechnologyStrip.svelte";

  const appTools = [
    { name: "React Native", href: "https://reactnative.dev/", icon: SiReact },
    { name: "Expo", href: "https://expo.dev/", icon: SiExpo },
    { name: "Clerk", href: "https://clerk.com/", icon: SiClerk },
    { name: "Convex", href: "https://www.convex.dev/", icon: SiConvex },
  ];

  const personalTools = [
    { name: "GitHub Copilot", href: "https://github.com/features/copilot", icon: SiGithubcopilot },
    { name: "ChatGPT", href: "https://chatgpt.com/", icon: SiChatbot },
  ];
</script>

For the past year I have been working on a shared frontend stack for mobile and web with React Native and Expo. I expected a long list of compromises. Instead, I found a workflow that made me want to build small apps again.

Sharing code does not mean every screen should look identical on a phone and in a browser. It means I can keep the product logic, data access, authentication, and much of the interface in one TypeScript project. I can still make platform-specific choices when they improve the result.

## What each piece does

[React Native](https://reactnative.dev/) renders native interfaces with React. The components map to native platform views instead of HTML elements.

[Expo](https://expo.dev/) supplies the project tools and many of the native APIs I would otherwise have to wire up myself. Expo Router gives the app file-based navigation. React Native for Web lets the same project render in a browser.

[Clerk](https://clerk.com/docs/expo/getting-started/quickstart) handles sign-up, sign-in, sessions, social providers, and the less interesting security work that I do not want to rebuild for every experiment.

[Convex](https://docs.convex.dev/home) is the backend. It gives me a reactive database, TypeScript functions, file storage, scheduled jobs, and generated client types. When a mutation changes data, subscribed screens receive the update without a separate WebSocket service or cache layer that I have to maintain.

The result is a practical stack for personal ideas. Expo owns the clients. Clerk knows the user. Convex stores the application data and runs backend code.

<TechnologyStrip tools={appTools} label="Application technologies" />

## Starting a small app

I usually begin with an Expo project and add the other pieces only when the app needs them.

```sh
npx create-expo-app@latest my-idea
cd my-idea
npx expo install @clerk/clerk-expo
npm install convex
npx convex dev
```

The first useful screen can run on iOS, Android, and the web before I have spent a day creating separate projects. That quick feedback changes what I am willing to try. A strange idea can become a working toy before I talk myself out of it.

## What it costs

Prices change, so check the linked pricing pages before making a budget. I checked these figures on August 22, 2026.

[Clerk's Hobby plan](https://clerk.com/pricing) costs $0 and includes up to 50,000 monthly retained users per app. Pro costs $25 per month, or $20 per month when billed annually. Pro removes Clerk branding and adds features such as multifactor authentication and passkeys.

[Convex Free and Starter](https://www.convex.dev/pricing) can begin at $0. The free resources are enough for my prototypes. The Professional plan costs $25 per developer each month and adds larger limits, backups, log streaming, and support.

[Expo Application Services](https://expo.dev/pricing) has a $0 plan with up to 15 Android builds and 15 iOS builds. The Starter plan costs $19 per month plus usage and includes $45 of build credit. You do not need a paid EAS plan to begin.

Store accounts are separate. Apple charges [$99 USD each year](https://developer.apple.com/programs/) for the Apple Developer Program. Google charges a [$25 USD one-time registration fee](https://support.google.com/googleplay/android-developer/answer/6112435) for a Play Console developer account. Both companies may ask for identity or business verification.

You can learn and test much of the stack for free. Publishing to both stores starts with $124 USD in account fees during the first year, before taxes or paid service plans.

## My AI setup and an August update on Sonnet 5

My daily setup is [GitHub Copilot](https://github.com/features/copilot) in the editor and [ChatGPT](https://chatgpt.com/) beside it. Copilot is useful when I am already in the code. ChatGPT is where I work through a rough idea, compare approaches, or untangle a problem before I touch the project.

<TechnologyStrip tools={personalTools} label="Personal AI tools" />

[Claude Sonnet 5](https://www.anthropic.com/claude/sonnet) launched on June 30, after I first published this article. GitHub Copilot now offers it as one of its supported models. I have used it through that workflow to bootstrap a few of these breaking toys.

It can create the route structure, connect Clerk sessions to Convex, and write the first pass of a screen quickly. I still review the data model and authentication boundaries. Generated code has the same annoying habit as any rushed code. It looks finished before it is finished.

The speed is real, though. With a clear prompt and a small scope, I can move from an empty folder to an app running on my phone and in a browser during one sitting. Sonnet 5 API pricing is currently $2 per million input tokens and $10 per million output tokens. Prompt caching and batch processing can lower that cost.

## Where I would start

Build one screen with local data first. Then add Expo Router, Clerk, and Convex as the idea earns them. Run the app on a real phone early. Browser-only testing hides the small platform differences that matter later.

This stack will not remove product decisions or App Store work. It does remove a lot of setup, which gives me more time to find out whether the idea is any good.
