---
title: AI tools in 2026
date: 2026-08-22
---

<script>
  import { SiAnthropic, SiCursor, SiGithubcopilot } from "@icons-pack/svelte-simple-icons";
  import TechnologyStrip from "$lib/TechnologyStrip.svelte";

  const personalTools = [
    { name: "Codex", href: "https://openai.com/codex/", mark: "CX" },
    { name: "GitHub Copilot", href: "https://github.com/features/copilot", icon: SiGithubcopilot },
    { name: "VS Code", href: "https://code.visualstudio.com/", mark: "VS" },
    { name: "cmux", href: "https://cmux.com/", mark: "cm" },
    { name: "T3 Code", href: "https://github.com/pingdotgg/t3code", mark: "T3" },
  ];

  const workTools = [
    { name: "Claude Code", href: "https://claude.com/product/claude-code", icon: SiAnthropic },
    { name: "Claude Cowork", href: "https://claude.com/product/cowork", mark: "CW" },
    { name: "Cursor", href: "https://www.cursor.com/", icon: SiCursor },
  ];
</script>

This is the list of AI tools I use in 2026. I have to qualify that sentence because the list changes so quickly that I can barely keep up. A new model lands, an app changes its workflow, and suddenly part of my setup needs another look.

The tools save me time. Keeping up with them has also become work. Some weeks that work takes a surprising amount of daylight, then follows me into the evening.

## My personal setup

I still use [VS Code](https://code.visualstudio.com/) as my editor. [GitHub Copilot](https://github.com/features/copilot) stays close to the code for completions and smaller edits. [Codex](https://openai.com/codex/) takes on larger jobs where I want an agent to inspect a project, make changes, run the checks, and show me what it did.

For terminals I use [Herd](https://herd.laravel.com/) and [cmux](https://cmux.com/). More often than not, though, I am now inside [T3 Code](https://github.com/pingdotgg/t3code), the Codex desktop app, or another agent interface. The terminal is still there. It is just no longer where every piece of work begins.

<TechnologyStrip tools={personalTools} label="Personal development tools" />

My personal machine is a MacBook Pro with an M4. All my coding still happens on the machine in front of me. I have not gone down the rabbit hole of installing several Linux boxes and wiring them into a local agent setup. I can see the appeal, and it is on my list. For now, one capable Mac is enough machinery to maintain.

## What I use at work

At work I use [Claude Code](https://claude.com/product/claude-code), [Claude Cowork](https://claude.com/product/cowork), and [Cursor](https://www.cursor.com/). Claude Code handles codebase work from the terminal and editor. Cursor is useful when I want the editor and agent in the same place. Cowork fits the tasks around the code, including research, files, and work spread across connected services.

<TechnologyStrip tools={workTools} label="Work AI tools" />

My work machine is a MacBook Pro with an M5. I use that Mac for the work itself rather than sending jobs to a collection of machines elsewhere. This is less ambitious than some of the setups I see online. It is also understandable when something breaks.

## The expensive part is attention

The main fatigue I feel these days does not come from typing code. It comes from switching context and reading enormous amounts of text. Agents produce plans, summaries, diffs, logs, review notes, and more questions. Even when the output is useful, I still have to understand it well enough to make a decision.

I also write far more Markdown than I used to. I liked Markdown before the current AI wave because it was plain, portable, and stayed out of the way. It is funny to see a format from the pre-AI web become the lingua franca of development. Instructions, plans, skills, project memory, agent files, and handoffs now arrive as `.md` files.

The connected desktop apps have changed the shape of the work too. I can sit in Codex, T3 Code, or Claude with services such as Google, X, and Slack connected. That reduces some copying between windows, but it also puts more kinds of work into the same window. The context switching did not disappear. It became harder to see.

## The harness needs maintenance

Setting up my personal harness has become real preparation for work. The models matter, but so do the instructions, permissions, skills, tools, project notes, and checks around them. A capable model inside a careless setup still creates a mess quickly.

I use the analytics shipped with these tools to see where sessions stall, where I repeat instructions, and which skills need work. I tune the harness almost every week. That sounds excessive until a small instruction saves the same review comment across ten sessions.

I briefly experimented with [Hermes Agent](https://github.com/NousResearch/hermes-agent), and I keep testing new Claude Code workflows as they appear. The experiments are useful, but there is a limit. Following every vendor, tool, and stronger model can become a second job.

So this is my setup today. Codex, Copilot, and VS Code for personal work. Claude Code, Cowork, and Cursor at work. cmux, Herd, and T3 Code move in and out depending on the task. Two Macs do the actual work.

I expect this list to age quickly. That may be the most accurate part of it.
