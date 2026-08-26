# Icons, Images, and Assets

Load this rule only when the canonical router in `../frontend-coding.md` matches an icon, SVG, image, logo, marker, or visual-asset decision. Use only the relevant internal mode: **general icon**, **specialized/custom asset**, or **application image**. Load `atomic-components.md` only when the asset decision also creates or changes a component contract.

This rule owns asset source selection, icon fidelity, SVG escalation, image metadata, and accessible asset text. It does not own component placement, interactive-control semantics, or third-party adoption approval.

## Design-provider output

Treat provider icon/SVG/image/code/CSS as design evidence. Map it to an approved component, library, or asset source; never copy SVG markup, adopt its icon package as convention, or bypass ownership, licensing, security, design-system, and approval requirements.

## General-purpose icon source

Use the project's evidence-backed general-purpose icon library supplied through the current implementation environment / routed capability. Examples may include Lucide, MUI Icons, HeroUI-compatible icon usage, or another established project convention.

Rules:

- search existing repository usage and the routed icon source before proposing another implementation;
- do not install, import, vendor, or copy from a second general-purpose icon library unless dependency adoption is explicitly approved;
- prefer consistency with the project's established icon set over pixel-level fidelity when the candidate preserves intended meaning;
- do not use emoji, text glyphs, or unrelated icons as substitutes for a missing icon;
- if no general-purpose icon library is evidenced or approved, mark the choice unresolved instead of defaulting to Lucide or another package.

This general-purpose rule does not select or govern logo and brand assets, map symbols, drone markers, or operational symbols. Route those assets to separately approved specialized sources when present. A specialized exception does not authorize a second general-purpose icon convention.

## Icon matching assessment

Use a candidate from the approved/routed icon source when it preserves approximately 80% or more of design intent. This is a review threshold, not numeric similarity. Confirm the same object/action/destination/state, recognizable silhouette, meaning-preserving orientation, low ambiguity, and coherence with adjacent project icons.

Reject a candidate when visual similarity masks a semantic difference. When a choice is ambiguous, record the design intent, inspected candidates, assessment, and selected or unresolved result in task evidence.

## SVG policy

Do not author or embed inline `<svg>` markup in application source unless the established project/library contract explicitly owns such source and the handoff authorizes it.

- Do not convert a design SVG into a React component or paste its paths into JSX merely to bypass the routed icon/asset source.
- A custom SVG is a final option and requires explicit approval after the routed general-purpose and applicable specialized sources have been inspected.
- Store an approved custom SVG under the asset location owned by its shared layer or bounded context.
- Preserve the SVG as an external asset when that matches the project's approved asset-loading contract; do not invent a loader, wrapper, or global folder convention while adding it.

Before requesting custom-SVG approval, report meaning/location, design reference, routed/project sources inspected and rejection reasons, proposed owner/consumers, and accessibility/licensing/provenance/maintenance implications.

## Missing-icon workflow

A missing icon is a local unresolved item, not a reason to stop independent issue work.

Do not create an SVG, add a library, or choose a misleading approximation. Continue independent work. A visible text label may replace only a decorative icon when the approved contract still holds; an icon-only control may use visible text only when its approved control and layout permit it. Otherwise keep the dependent UI unresolved and never leave an empty control.

Use the shared unresolved record in `../frontend-coding.md`, adding a stable `snake_case` inventory identifier, UI location, intended meaning, design reference, candidates inspected, and proposed icon/custom-asset decision.

Do not claim dependent UI complete while a required icon remains unresolved.

## Icon accessibility

- An icon that repeats adjacent visible text or provides no additional information is decorative and must use `aria-hidden="true"`.
- Place the accessible name on the interactive control, not on its nested icon.
- An icon-only control must have a natural-language accessible name that describes its action or destination.
- Do not use an icon name, filename, `snake_case` inventory identifier, or words such as "icon" and "button" as the accessible name.
- When color or an icon communicates state, provide an equivalent accessible text or approved semantic state; do not rely on the visual alone.

Read `semantics-accessibility.md` for the complete semantic control contract.

## Application images

Use the image component/runtime already established by the detected framework and project configuration. For Next.js projects that use `next/image`, preserve that contract; do not generalize it to non-Next.js projects.

Every application image must satisfy the installed framework/library requirements for accessible text, intrinsic dimensions/aspect ratio, responsive sizing, and optimization. Do not invent project-wide image defaults from this rule when the current stack differs.

### Alternative text

Choose `alt`/equivalent accessible text from the image's purpose in context, not only its visual appearance.

1. Use an approved product description when one exists.
2. Otherwise infer the purpose from supplied design evidence and surrounding UI.
3. If those are unavailable, derive natural-language text from a meaningful asset filename when safe.
4. If the filename is opaque or still does not communicate purpose, record the meaningful image as unresolved rather than inventing a description.
5. Use the framework/library's decorative-image convention for a purely decorative image.

Do not repeat adjacent captions, include file extensions, preserve `snake_case`, or begin alternative text with phrases such as "Image of".

### Dimensions and layout

- Treat intrinsic dimensions as aspect-ratio evidence, not permission to freeze the rendered page layout.
- Prefer dimensions supplied by static imports/assets or actual metadata; do not guess.
- Use responsive/fill modes only when the parent layout contract is approved and required metadata is known.
- Inspect current framework configuration before using remote images; do not broaden remote-source/security/optimization settings without approved configuration change.

Images rendered and owned internally by an approved map, video, canvas, or other specialized runtime follow that integration's contract. The exception must remain inside the approved integration boundary and must not establish an application-wide image convention.

## Completion evidence

Add to the shared completion record: routed/project icon or asset sources inspected, selected or ambiguous mappings, asset ownership, image accessibility/layout decisions, and approved exceptions.
