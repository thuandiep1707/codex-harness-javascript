# Icons, Images, and Assets

Load this rule only when the canonical router in `../frontend-coding.md` matches an icon, SVG, image,
logo, marker, or visual-asset decision. Use only the relevant internal mode: **general icon**,
**specialized/custom asset**, or **application image**. Load `atomic-components.md` only when the
asset decision also creates or changes a component contract.

This rule owns asset source selection, icon fidelity, SVG escalation, image metadata, and accessible
asset text. It does not own component placement, interactive-control semantics, or third-party
adoption approval.

## Design-provider output

Treat provider icon/SVG/image/code/CSS as design evidence. Map it to an approved component, library,
or asset source; never copy SVG markup, adopt its icon package as convention, or bypass ownership,
licensing, security, design-system, and approval requirements.

## General-purpose icon source

Lucide, as configured in `components.json`, is the only approved general-purpose interface icon library.

- Search existing repository usage and Lucide before proposing another icon implementation.
- Do not install, import, vendor, or copy from a second general-purpose icon library.
- Prefer consistency with the repository's Lucide set over pixel-level fidelity to a design when the candidate preserves the intended meaning.
- Do not use emoji, text glyphs, or unrelated icons as substitutes for a missing icon.

This general-purpose rule does not select or govern logo and brand assets, map symbols, drone markers, or operational symbols. Route those assets to their separately approved specialized source or library. A specialized exception does not authorize a second general-purpose icon library; if no specialized source is approved, record the decision as unresolved.

## Lucide matching assessment

Use a Lucide candidate when it preserves approximately 80% or more of design intent. This is a
review threshold, not numeric similarity. Confirm the same object/action/destination/state,
recognizable silhouette, meaning-preserving orientation, low ambiguity, only nonessential stroke or
proportion differences, and coherence with adjacent Lucide icons.

Reject the candidate when visual similarity masks a semantic difference. When a choice is ambiguous, record the design intent, inspected candidates, assessment, and selected or unresolved result in the task evidence.

## SVG policy

Do not author or embed inline `<svg>` markup in application source.

- Do not convert a design SVG into a React component or paste its paths into JSX.
- A custom SVG is a final option and requires explicit developer approval after Lucide and the applicable specialized sources have been inspected.
- Store an approved custom SVG as a file under the asset location owned by its shared layer or bounded context. Do not place a module-owned symbol in a global asset folder merely for convenience.
- Preserve the SVG as an external asset. Its consumption must follow an existing approved asset-loading contract; do not invent a loader, component wrapper, or new folder convention while adding the asset.

Before requesting custom-SVG approval, report its meaning/location and design reference, inspected
Lucide or specialized candidates and rejection reasons, proposed owner/consumers, and accessibility,
licensing, provenance, and maintenance implications.

## Missing-icon workflow

A missing icon is a local unresolved item, not a reason to stop independent issue work.

Do not create an SVG, add a library, or choose a misleading approximation. Continue independent
work. A visible text label may replace only a decorative icon when the approved contract still
holds; an icon-only control may use visible text only when its approved control and layout permit it.
Otherwise keep the dependent UI unresolved and never leave an empty control.

Use the shared unresolved record in `../frontend-coding.md`, adding a stable `snake_case` inventory
identifier, UI location, intended meaning, design reference, candidates inspected, and proposed icon
or custom-asset decision.

Do not claim the dependent UI is complete while a required icon remains unresolved.

## Icon accessibility

- An icon that repeats adjacent visible text or provides no additional information is decorative and must use `aria-hidden="true"`.
- Place the accessible name on the interactive control, not on its nested icon.
- An icon-only control must have a natural-language accessible name that describes its action or destination, such as `aria-label="Open settings"`.
- Do not use an icon name, filename, `snake_case` inventory identifier, or words such as "icon" and "button" as the accessible name.
- When color or an icon communicates state, provide an equivalent accessible text or approved semantic state; do not rely on the visual alone.

Read `semantics-accessibility.md` for the complete semantic control contract.

## Application images

Use `Image` from `next/image` for images rendered by application UI. Do not use raw `<img>` elements in project-authored application code.

Every `Image` must provide:

- an `alt` value;
- intrinsic `width` and `height`, or an approved `fill` layout;
- an explicit `quality` value;
- layout classes and `sizes` where required by the approved responsive image contract.

Use `quality={75}` unless the current Next.js configuration explicitly allows and the approved task specifies another value. Do not change `images.qualities` merely to support an agent-selected value.

### Alternative text

Choose `alt` from the image's purpose in context, not only its visual appearance.

1. Use an approved product description when one exists.
2. Otherwise infer the purpose from the design layer or node name and surrounding UI.
3. If those are unavailable, derive natural-language text from a meaningful asset filename by removing its path, extension, separators, and technical suffixes.
4. If the filename is opaque or still does not communicate the image's purpose, record the meaningful image as unresolved rather than inventing a description.
5. Use `alt=""` for a purely decorative image that adds no information and is not an interactive target.

Do not repeat adjacent captions, include file extensions, preserve `snake_case`, or begin alternative text with phrases such as "Image of".

### Dimensions and layout

- Treat `width` and `height` as intrinsic dimensions used to preserve aspect ratio, not as permission to fix the rendered page layout.
- Prefer dimensions supplied by a static import. Otherwise inspect the actual local asset metadata or the approved remote-source contract; do not guess.
- Use `fill` only when the parent layout contract is approved. The parent must provide positioning through approved utilities, and the image must provide an accurate `sizes` value.
- Keep rendered sizing fluid with approved design-system and standard Tailwind utilities where the surrounding layout is fluid.
- Inspect the current Next.js configuration before using a remote image. Do not broaden remote patterns or disable optimization without an approved configuration change.
- Do not add `unoptimized` merely to bypass an image configuration, metadata, or optimization problem.

Images rendered and owned internally by an approved map, video, canvas, or other specialized runtime follow that integration's contract. The exception must remain inside the approved integration boundary and must not establish an application-wide image convention.

## Completion evidence

Add to the shared completion record: inspected Lucide or specialized sources, selected or ambiguous
mappings, asset ownership, `next/image` alt/dimension/`fill`/`sizes`/quality decisions, and approved
exceptions.
