---
title: Working with AWS MediaTailor
date: 2025-04-11
---

<script>
  import { SiGo } from "@icons-pack/svelte-simple-icons";
  import MermaidDiagram from "$lib/MermaidDiagram.svelte";
  import TechnologyStrip from "$lib/TechnologyStrip.svelte";

  const adFlow = `flowchart LR
    P[Video player] -->|Requests manifest| MT[AWS MediaTailor]
    O[HLS or DASH origin] -->|Manifest with SCTE-35 markers| MT
    MT -->|Ad request| ADS[Go ad decision service on ECS]
    ADS -->|VAST response| MT
    MT -->|Personalized manifest| P
    P -->|Requests content and ad segments| CDN[CDN]`;

  const mediaTools = [
    { name: "MediaTailor", href: "https://aws.amazon.com/mediatailor/", mark: "AWS" },
    { name: "Go", href: "https://go.dev/", icon: SiGo },
    { name: "Amazon ECS", href: "https://aws.amazon.com/ecs/", mark: "ECS" },
    { name: "SCTE-35", href: "https://docs.aws.amazon.com/mediatailor/latest/ug/getting-started-ad-insertion.html", mark: "35" },
  ];
</script>

A quick update on some work I have enjoyed at Lumenalta. I have been implementing an ad decision service for streaming video, using Go, Amazon ECS, and AWS Elemental MediaTailor.

Advertising technology has a talent for turning a simple idea into a pile of acronyms. The basic job is still easy to describe. A video stream marks a place where an ad can run. A service picks the ad. MediaTailor puts the selected ad into the stream that reaches the viewer.

## What MediaTailor does

[AWS Elemental MediaTailor](https://docs.aws.amazon.com/mediatailor/) provides server-side ad insertion for HLS and DASH video. Instead of asking the mobile app, browser, or TV player to stop the content and load a separate ad player, MediaTailor changes the manifest on the server.

The viewer receives one personalized manifest containing URLs for content segments and ad segments. Playback still feels like one stream. This also keeps much of the ad logic out of every player implementation.

## SCTE-35 messages

[SCTE-35](https://docs.aws.amazon.com/mediatailor/latest/ug/getting-started-ad-insertion.html) carries timing signals for ad opportunities. In a live HLS stream, those signals may appear in the manifest as tags such as `EXT-X-CUE-OUT` and `EXT-X-CUE-IN`. DASH can carry splice insert or time signal events.

The marker does not contain the ad. It says an ad break starts here, provides timing information, and later signals the return to the program. MediaTailor sees that marker when the player requests a manifest.

## How an ad reaches the stream

<TechnologyStrip tools={mediaTools} label="MediaTailor article technologies" />

<MermaidDiagram chart={adFlow} label="Flow from the video player and content origin through MediaTailor and the Go ad decision service" />

MediaTailor calls the configured ad decision server when it finds an ad opportunity. The request can contain details about the playback session, the viewer, and the available break duration.

Our service was written in Go and ran on Amazon ECS. It applied the project's decision rules, selected an eligible ad, and returned a [VAST](https://docs.aws.amazon.com/mediatailor/latest/ug/ad-server-integration.html) response. VAST describes the creative files and tracking URLs that MediaTailor needs.

MediaTailor then prepares the ad if needed and writes its segment URLs into a personalized manifest. The player requests those segments through the CDN in the same way it requests program segments. Tracking beacons report events such as impressions, quartiles, and completion.

## Why Go and ECS worked well

An ad decision endpoint sits directly in the playback path. It needs predictable response times and clear failure behaviour. Go was a good fit because the service was small, concurrent, and easy to package as one binary.

ECS handled task deployment and scaling without forcing the service into a more complicated platform. We could run multiple tasks behind a load balancer, set health checks, and replace containers during a deployment.

The hard part was not returning XML. It was keeping decisions fast while handling missing inventory, malformed responses, timeouts, and retries without interrupting the video. AWS documents that MediaTailor can continue with content when the ad decision server fails. That fallback matters. Nobody wants an ad system to break the program they came to watch.

This project gave me a much better understanding of streaming manifests and ad measurement. I also gained respect for the amount of coordination hidden inside a normal commercial break.
