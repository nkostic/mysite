---
title: Accessibility from the first component
date: 2026-08-25
---

<script>
  import MermaidDiagram from "$lib/MermaidDiagram.svelte";
  import TechnologyStrip from "$lib/TechnologyStrip.svelte";

  const adoptionFlow = `flowchart LR
    P[Product planning] --> D[Design and content]
    D --> C[Shared components]
    C --> F[Feature work]
    F --> A[Automated checks]
    A --> M[Manual testing]
    M --> R[Release and feedback]
    R --> P`;

  const resources = [
    { name: "WCAG 2.2", href: "https://www.w3.org/TR/WCAG22/", mark: "AA" },
    { name: "Course", href: "https://enterprise-accessibility.vercel.app/topics", mark: "EA" },
    { name: "Examples", href: "https://github.com/marcysutton/frontend-masters-enterprise-accessibility", mark: "GH" },
    { name: "ARIA APG", href: "https://www.w3.org/WAI/ARIA/apg/", mark: "APG" },
  ];
</script>

Accessibility is easiest when a team has not written the inaccessible version yet.

That sounds obvious. It is also the point many organizations miss. They build a product, add a design system, grow several teams, and eventually run an audit. The audit finds the same broken button, unlabeled field, weak focus state, and unreadable error message in dozens of places. At that point accessibility has become a repair project with a spreadsheet attached.

Starting earlier changes the economics. One accessible button in a shared library can prevent the same mistake across every product that uses it. One tested dialog can settle focus behavior before six teams invent six versions.

The goal is not to make every developer memorize a standards document. The goal is to give people components, examples, tests, and review habits that lead them toward the right implementation.

## Who should start from scratch

Any organization creating a new product or replacing a major interface should set an accessibility baseline before feature work accelerates. The exact program should match the size and risk of the organization.

A startup does not need an accessibility office before it has customers. It does need semantic controls, keyboard support, visible focus, useful labels, scalable text, sufficient contrast, and a small definition of done. Calling those things future polish creates debt during the cheapest moment to avoid it.

A larger organization with several product teams gets more value from shared components and written contracts. The design system can own interaction behavior while product teams own page structure, content, and complete workflows. This split prevents the accessibility team from becoming a queue that every release waits on.

Public services, education, healthcare, banking, insurance, transportation, and large commerce products should treat accessibility as a launch requirement. People may need these products to get paid, book care, submit school work, move money, or access government services. A blocked workflow can have a real cost beyond frustration.

Internal software belongs in the discussion too. Employees use screen readers, keyboard navigation, magnification, speech input, captions, and alternative input devices. An inaccessible internal tool can limit a person's ability to do the job they were hired to do.

A company with a large legacy product should not rebuild everything to claim a clean start. It should inventory common failures, fix the shared components that create them, and choose a few important journeys for manual testing. Replacing a working interface can introduce new problems. A measured repair program is often safer.

## Start with a minimum accessible product

The phrase "minimum accessible product" comes from Marcy Sutton Todd's [Enterprise Accessibility course](https://enterprise-accessibility.vercel.app/topics). I like it because it corrects a bad habit in product planning. An MVP still needs to work for disabled people. Accessibility is part of viability, not a later level of finish.

For a new web product, my first baseline would include:

- Native HTML elements whenever they provide the required behavior.
- A logical heading structure and document order.
- Complete keyboard operation with visible focus.
- Accessible names, roles, states, and error messages.
- Text and controls that survive zoom and larger system fonts.
- Color contrast that meets the chosen standard, with no meaning carried by color alone.
- Motion that respects reduced-motion preferences.
- Alternatives for pointer gestures and drag interactions.
- A way for users to report an accessibility problem.

For native mobile, the same intent applies through platform semantics. Controls need useful labels and states. Text needs to scale. Touch targets need room. VoiceOver and TalkBack need a sensible reading order. A gesture needs an alternative when the gesture is the only way to complete an action.

[WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/) is a practical baseline for customer-facing work. [WCAG2ICT](https://www.w3.org/TR/wcag2ict-22/) explains how WCAG guidance applies to non-web software and documents. Apple and Android guidance still matters because native controls and assistive technologies have platform behavior that a web checklist cannot describe.

<TechnologyStrip tools={resources} label="Accessibility standards and course materials" />

## Put the rules in the design system

The best design system API makes the accessible choice easy and the broken choice awkward.

An icon button should require an accessible name. A field component should connect its label, hint, required state, validation state, and error. A modal should move focus inside when it opens and restore focus when it closes. A toast should use the right announcement behavior instead of shouting every update through a live region.

The contract matters more than a checklist hidden in documentation. If a component cannot be used correctly without supplying a label, make the label required in its type. If loading changes what a screen reader should hear, make that state part of the component API.

Tokens carry part of the responsibility. Store approved foreground and background pairs rather than letting every screen invent a gray. Define a focus ring that works against supported surfaces. Keep spacing and type choices usable when text grows. Provide reduced-motion values instead of asking each animation author to remember the preference.

The [course repository](https://github.com/marcysutton/frontend-masters-enterprise-accessibility) includes base and completed React components used to teach semantic elements, accessible names, focus, visibility, and testing. I used that component-level approach here, then extended it to design-system contracts and cross-platform ownership.

## Keep ownership clear

A design system can provide a good button. It cannot decide whether "Continue" makes sense in a particular screen, whether the reading order matches the task, or whether a user can finish a checkout without getting trapped.

I would divide ownership this way:

- The design-system team owns tokens, component semantics, keyboard behavior, focus behavior, touch targets, documented examples, and component tests.
- Product designers own information order, contrast choices within approved tokens, nonvisual alternatives, motion intent, and states such as empty, loading, error, and success.
- Feature teams own labels, page structure, route focus, complete workflows, and regression coverage.
- Product and engineering leadership own time, training, release expectations, and a route for users to report problems.
- People with disabilities need a paid role in research and testing. Teams should not guess what assistive-technology users need from inside a conference room.

This is adapted from the course sections on [building organizational knowledge](https://enterprise-accessibility.vercel.app/topics/org-skill-building/tips-for-building-knowledge) and centering people with disabilities. The course argues that accessibility fails when responsibility sits with one specialist whose work can be undone by the next pull request. That matches what I have seen with every other engineering quality practice. Knowledge has to survive team changes.

<MermaidDiagram chart={adoptionFlow} label="Accessibility work moving through planning, design, shared components, feature development, testing, release, and user feedback" />

## Choose an adoption path that fits the organization

### A new product team

Start small and make the baseline real.

Choose the target standard. Write ten or fewer release checks. Build the first controls with semantic HTML or native platform controls. Test the first complete workflow with a keyboard and a screen reader before the product structure hardens.

Do not begin by creating a large accessibility scorecard. A team with three engineers needs working examples more than a governance program.

### A growing company with several teams

Create an accessibility working group with representatives from design, engineering, quality, and product. Give the group time to fix shared code, not only time to discuss it.

Inventory components across products. Pick the primitives that appear most often and replace them with tested versions. Add accessibility acceptance criteria to design and product templates. Train reviewers to spot native controls replaced by generic elements, missing labels, broken focus, and information carried only by color.

### A large organization

Publish one engineering standard and allow teams to document justified exceptions. Maintain a design system with clear accessibility contracts. Add specialist review for new complex interactions rather than asking specialists to inspect every routine screen.

Measure repeated failure patterns, not a single score. If twelve teams keep shipping unlabeled icon buttons, the organization has a component or training problem. Filing twelve separate bugs treats the symptom.

Procurement belongs here as well. Third-party products, embedded widgets, document generators, and vendor SDKs can block a workflow even when the organization's own components are sound. Accessibility requirements need to appear before a contract is signed.

### A legacy product

Begin with evidence. Combine automated scans, keyboard testing, screen-reader testing, customer reports, and a component inventory. Rank issues by user impact, reach, and frequency.

Fix shared causes first. Then test the workflows people cannot avoid, such as signing in, paying, submitting, searching, contacting support, and changing security settings. This usually produces more value than chasing a perfect score across rarely visited pages.

## Test in layers

Automation helps, but it cannot tell you whether a workflow makes sense when spoken aloud.

Static analysis and axe can catch missing names, invalid relationships, some contrast failures, and other machine-detectable problems. Component interaction tests can verify keyboard sequences, focus entry, focus restoration, expanded states, and error associations. Browser or device tests can prove that a complete workflow still exposes useful controls. Manual testing checks the experience that the tools cannot judge.

The course's [test automation section](https://enterprise-accessibility.vercel.app/topics) makes the same distinction between guidelines, automated checks, component testing, and continuous integration. The examples in the [course repository](https://github.com/marcysutton/frontend-masters-enterprise-accessibility) use Jest, Testing Library, Cypress, and axe. My reference notes adapted that layered idea to Storybook and Maestro for shared web and native components.

A reasonable testing stack looks like this:

1. Lint and unit tests catch cheap mistakes during development.
2. Storybook or an equivalent component workshop covers important states, long labels, errors, loading, large text, and reduced motion.
3. axe scans stable web component stories and important pages.
4. Interaction tests cover keyboard and focus behavior for dialogs, menus, tabs, comboboxes, and other complex controls.
5. Native smoke tests use semantic labels where possible, which proves that useful information reached the accessibility hierarchy.
6. Manual checks cover keyboard use, zoom, VoiceOver, TalkBack, and the workflows with the highest cost of failure.

Passing automation does not prove conformance. It proves that the failures encoded in those tests did not appear. That is useful, but smaller than the claim teams sometimes make from a green pipeline.

## Put accessibility in the definition of done

The course includes a section on the [definition of done](https://enterprise-accessibility.vercel.app/topics). The useful idea is simple. Accessibility work has to appear in the same planning and review process as security, tests, and product acceptance. Otherwise it remains optional when a deadline tightens.

I would keep the pull-request checklist short:

- Interactive controls have useful names and correct roles.
- Disabled, selected, checked, expanded, busy, and invalid states are exposed when they exist.
- The feature works with a keyboard on the web and shows focus.
- Text can grow without hiding content or controls.
- Errors identify the problem and connect to the relevant field.
- Important updates reach assistive technology without noisy announcements.
- Color is not the only way the interface communicates status.
- New interaction patterns have keyboard, focus, and screen-reader tests.
- The complete workflow has been tested, not only its components.

This list should change when the team learns something. A definition of done that never changes is probably not connected to actual defects.

## Measure progress without lying to yourself

An accessibility score can be useful for finding regressions. It is a poor description of whether a person can use the product.

Track things the organization can act on:

- The percentage of shared components with documented keyboard and screen-reader behavior.
- Important workflows tested manually during the release cycle.
- Accessibility defects caused by shared components versus feature code.
- Time between a user report and a verified fix.
- Repeated defect categories that point to missing training or components.
- Research sessions that include disabled participants.

The numbers should lead to a change in code, process, or ownership. If a metric only makes a dashboard look healthier, stop collecting it.

## What I would do in the first ninety days

During the first month, choose the standard, name owners, inspect the current product, and test two important workflows with disabled users or experienced assistive-technology testers. Write down the recurring problems.

In the second month, fix the shared controls behind those problems. Add component examples and automated checks. Publish a short definition of done and use it in real reviews.

In the third month, test the same workflows again. Add one or two more. Review procurement and product templates. Share what failed and what changed with the wider engineering organization.

That is enough to create momentum without pretending the work finishes after ninety days.

## Source notes

This article started from my internal notes on building accessibility into an Expo, React Native, and web design system. I removed the industry-specific workflows and expanded the organizational guidance.

The ideas of a minimum accessible product, shifting accessibility work earlier, testing at several levels, spreading knowledge beyond one specialist, centering people with disabilities, and adding accessibility to the definition of done come from Marcy Sutton Todd's [Enterprise Accessibility course materials](https://enterprise-accessibility.vercel.app/topics).

The component examples and testing approach are informed by the public [Frontend Masters Enterprise Accessibility repository](https://github.com/marcysutton/frontend-masters-enterprise-accessibility). The repository contains the course website source, component exercises, completed examples, Jest configuration, Cypress tests, and axe-related material.

The standards references come from [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [WCAG2ICT](https://www.w3.org/TR/wcag2ict-22/), [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/), and the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/).
