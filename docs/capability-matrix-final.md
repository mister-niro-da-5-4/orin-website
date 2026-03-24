# Orin LXDS — Capability Matrix (Final)

Legend: ● Full | ◐ Partial | ○ None | ◑ Planned

---

## Architecture

| Capability | Orin | Sana Learn | Articulate 360 | Captivate | Lectora | iSpring | Elucidat |
|---|---|---|---|---|---|---|---|
| Graph-based course model | ● DAG with conditional edges | ○ Linear content blocks | ○ Linear slides | ○ Linear slides | ○ Linear slides | ○ PowerPoint plugin | ○ Template blocks |
| State machine engine | ● XState hierarchical actors | ○ | ○ | ○ | ○ | ○ | ○ |
| Spatial canvas authoring | ● Orbit → Module → Slide | ○ | ○ | ○ | ○ | ○ | ○ |

---

## Authoring

| Capability | Orin | Sana Learn | Articulate 360 | Captivate | Lectora | iSpring | Elucidat |
|---|---|---|---|---|---|---|---|
| Live WYSIWYG editing | ● Preview IS the editor | ◐ Block-based editor | ◐ Separate preview | ◐ Separate preview | ◐ Separate preview | ◐ Via PowerPoint | ● WYSIWYG |
| Branching scenarios | ● Graph edges with conditions | ◐ Basic paths, no rich scenarios | ◐ Storyline only, manual | ◐ Limited | ◐ Supported | ◐ Clunky, limited | ◐ Supported + role selectors |
| Custom interactive simulations | ● Sandboxed web components | ○ Template-bound | ◐ JS triggers | ◐ Screen recording | ◐ Custom HTML | ◐ Limited, no failure paths | ◐ Systems simulations + games |

---

## Intelligence

| Capability | Orin | Sana Learn | Articulate 360 | Captivate | Lectora | iSpring | Elucidat |
|---|---|---|---|---|---|---|---|
| Learning science engine | ● Mayer, Sweller, Bloom's, spaced repetition | ○ | ○ | ○ | ○ | ○ | ○ |
| Cognitive load analysis | ● Per-node, real-time | ○ | ○ | ○ | ○ | ○ | ○ |
| AI co-authoring | ● Ambient: validates, inspires, never overwrites | ● AI-native: generate from docs, AI tutor | ◐ Drafts, alt text, captions | ◐ Avatars, TTS, image gen | ◐ AI-assisted content | ◐ AI voiceover | ◐ Auto-translate |
| Domain-aware RAG pipeline | ● Brand, learners, domain, taste | ● RAG: org docs, Slack, manuals | ○ | ○ | ○ | ○ | ○ |

---

## Accessibility

| Capability | Orin | Sana Learn | Articulate 360 | Captivate | Lectora | iSpring | Elucidat |
|---|---|---|---|---|---|---|---|
| Ambient accessibility engine | ● Always-on WCAG 2.2 AA | ◐ Basic | ◐ Checker tool | ◐ Manual tools + checker, no ambient | ◐ Strong — 508 check tool + WCAG 2.2 | ◐ Basic | ◐ Basic |
| Visual accessibility overlay | ● Tab order badges, ARIA labels, focus indicators | ○ | ○ | ○ | ○ | ○ | ○ |

---

## Output & Data

| Capability | Orin | Sana Learn | Articulate 360 | Captivate | Lectora | iSpring | Elucidat |
|---|---|---|---|---|---|---|---|
| Auto xAPI telemetry | ● Zero-config, from state transitions | ◐ Platform analytics only | ◐ Custom xAPI triggers (Storyline) | ◐ Manual config | ◐ Manual config | ◐ Basic | ◐ xAPI labelling (2025) |
| First-class learning objectives | ● Per-node mastery tracking | ◐ AI-generated assessments | ○ | ○ | ◐ Supported | ○ | ○ |
| Output formats | ● SCORM 1.2, 2004, xAPI, LTI 1.3, standalone | ◐ Platform-locked, SCORM import | ● SCORM, xAPI, AICC, cmi5 | ● SCORM, xAPI, AICC | ● SCORM, xAPI, AICC, cmi5, HTML5 | ● SCORM, xAPI | ● SCORM, SCORM 2004, xAPI |

---

## Collaboration

| Capability | Orin | Sana Learn | Articulate 360 | Captivate | Lectora | iSpring | Elucidat |
|---|---|---|---|---|---|---|---|
| Real-time multiplayer | ● CRDTs, offline-first | ● Real-time collaborative authoring | ○ Review comments only | ○ Cloud review links | ○ | ○ | ◐ Cloud editing, not multiplayer |
| Stakeholder review surface | ● Dedicated — comment, flag, voice note | ◐ In-platform comments | ◐ Review 360 | ◐ Cloud review | ○ | ○ | ◐ Comments |
| Competitor file import | ◑ .story, Rise, Captivate | ◐ SCORM, PDF, image import | ○ | ◐ PowerPoint import | ○ | ◐ PowerPoint | ○ |

---

*ORIN LXDS — orinlxds.com — An Artie Ai Company — March 2026*
