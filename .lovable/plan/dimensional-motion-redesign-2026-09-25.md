# Dimensional Motion Redesign

## Goal
Turn the portfolio into a cinematic, “4D” experience from the first second, while preserving every video, price, contact option, and enquiry flow.

## What will change
- Add a short opening sequence with a virtual camera rush, animated Scaleup Haldwani identity, depth rings, scan lines, and a dramatic reveal into the page.
- Rebuild the opening screen as a layered perspective stage that reacts subtly to pointer movement and scroll.
- Give the project grid true spatial motion: perspective tilt, depth shadows, light sweeps, chromatic edges, and varied scroll reveals rather than identical fade-ups.
- Add section transitions using cinematic wipes, depth shifts, and text masks across Pricing, Process, About, and Contact.
- Add a lightweight custom cursor and ambient motion on capable desktop devices.
- Keep mobile smooth by using simpler GPU-friendly transforms, limiting effects to visible content, and respecting reduced-motion settings.

## Technical details
- Use the existing Framer Motion stack and CSS 3D transforms; no heavy 3D engine or large new download.
- Animate only transform, opacity, clip-path, and lightweight pseudo-elements where possible.
- Prevent the opening from blocking navigation after it finishes and provide a reduced-motion instant reveal.
- Verify the opening, video playback, scrolling, pricing links, and enquiry controls on desktop and mobile.
