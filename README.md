# richardangelomclean.com

Personal freelance site for Richard Angelo McLean. Single-page static site, hand-crafted HTML/CSS/vanilla JS. No build step. Deployed via GitHub → Netlify → Namecheap DNS.

## Project structure

```
richardangelomclean/
├── index.html                  The page
├── css/styles.css              All styles (hand-crafted, mobile-first)
├── js/carousel.js              Select Projects carousel logic
├── data/projects.json          Project entries — edit this to update the carousel
├── assets/
│   ├── headshot.jpg            Your About-section portrait (save here)
│   └── projects/               Project images and videos
└── README.md
```

## Updating the Select Projects carousel

All project data lives in `data/projects.json`. To add, edit, or remove a project, edit that one file — no HTML changes needed.

### To add a project with an image

1. Drop the image into `assets/projects/` (e.g. `my-project.jpg`). Recommended: 1600×900, under 300 KB (use [Squoosh](https://squoosh.app) to compress).
2. Open `data/projects.json` and add an entry to the `projects` array:

```json
{
  "id": "my-project",
  "title": "Project Title",
  "role": "Technical Director",
  "description": "One or two sentences describing the project and your contribution.",
  "media": {
    "type": "image",
    "src": "assets/projects/my-project.jpg",
    "alt": "Describe what's in the image for screen readers."
  }
}
```

### To add a project with a looping video

1. Drop an `.mp4` file into `assets/projects/` (e.g. `my-project.mp4`). Recommended: under 15 seconds, under 5 MB, 1280×720, H.264. Videos auto-play muted on loop.
2. Optionally add a poster image (a still frame shown before the video loads).
3. Add an entry:

```json
{
  "id": "my-project",
  "title": "Project Title",
  "role": "Technical Director",
  "description": "Description text.",
  "media": {
    "type": "video",
    "src": "assets/projects/my-project.mp4",
    "poster": "assets/projects/my-project-poster.jpg",
    "alt": "Describe what's in the video for screen readers."
  }
}
```

### To reorder, edit, or remove

Just edit or rearrange entries in the `projects` array. Order in the file = order in the carousel.

## Dropping in the Vimeo reel

When the reel is ready on Vimeo, open `index.html`, find the `<div class="hero__reel">` block, and replace the inner `<button>` with:

```html
<iframe src="https://player.vimeo.com/video/YOUR_VIMEO_ID?title=0&byline=0&portrait=0"
        title="Richard Angelo McLean reel"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen></iframe>
```

The CSS is already set up to make the iframe fill the frame cleanly.

## Deployment workflow

Once GitHub and Netlify are connected (see below), every update works like this:

1. Edit `projects.json` (or any other file).
2. Commit and push to GitHub.
3. Netlify detects the push and auto-deploys in ~30 seconds.
4. Changes are live at richardangelomclean.com.

## GitHub & Netlify setup (one-time)

See the deployment walkthrough we'll do together in the Cowork session. Short version:

1. Create a GitHub account (username: `richardangelomclean`).
2. Create a new public repo called `richardangelomclean`.
3. Upload this folder's contents to the repo.
4. Create a Netlify account (free tier).
5. Connect Netlify to the GitHub repo. Build command: none. Publish directory: `/`.
6. In Namecheap, update DNS to point `richardangelomclean.com` and `www.richardangelomclean.com` to Netlify.
7. Enable HTTPS in Netlify (automatic via Let's Encrypt).

## Browser support

Modern evergreen browsers (Chrome, Safari, Firefox, Edge). Uses CSS custom properties, `aspect-ratio`, and `clamp()`. No polyfills needed.

## Accessibility notes

- Semantic landmarks (`<nav>`, `<main>`, `<section>` with `aria-labelledby`, `<footer>`).
- Carousel buttons have `aria-label` and support keyboard arrow keys when focused.
- `aria-live="polite"` on the carousel content for screen reader announcements on card change.
- `prefers-reduced-motion` is respected.
- Focus rings are visible for keyboard users.

## License

All content © Richard Angelo McLean. All rights reserved.
