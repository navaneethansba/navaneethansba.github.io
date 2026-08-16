# Dr. Navaneethan Srinivasan — Executive Technology Portfolio

A recruiter- and board-friendly executive portfolio site built as a lightweight static GitHub Pages repository.

## Positioning

**CIO · CDIO · CTO · GCC Leader · Enterprise Architect · Board Advisor**

**Build. Scale. Transform. Govern.**

The site highlights executive impact across GCC build-out, enterprise architecture, global technology operations, M&A integration, cloud, cybersecurity, AI, quantum computing and board advisory.

## Included

- Responsive one-page executive portfolio
- Professional headshot included in `assets/images/`
- Résumé included in `assets/documents/`
- Animated career-impact metrics
- Executive capability map
- Custom HTML5 Canvas leadership radar (no third-party library)
- Signature transformation case studies
- Research / AI / quantum section
- Career timeline
- Board & advisory section
- Mobile navigation and accessibility support
- No framework, no build step, no external dependency

## Repository structure

```text
.
├── index.html
├── README.md
├── .nojekyll
└── assets/
    ├── css/
    │   └── main.css
    ├── js/
    │   └── main.js
    ├── images/
    │   └── navaneethan-headshot.png
    └── documents/
        └── Navaneethan-Srinivasan-Resume.pdf
```

## Publish with GitHub Pages

### Option A — User site (cleanest URL)

1. Create a repository named exactly:
   `YOUR-GITHUB-USERNAME.github.io`
2. Upload all files in this repository to the root of that GitHub repository.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose `main` and `/ (root)`.
6. Save.
7. GitHub will publish the site at:
   `https://YOUR-GITHUB-USERNAME.github.io/`

### Option B — Project site

1. Create a repository such as `executive-portfolio`.
2. Upload these files to the repository root.
3. Enable GitHub Pages from the `main` branch and `/ (root)`.
4. The site will be available at:
   `https://YOUR-GITHUB-USERNAME.github.io/executive-portfolio/`

All internal asset links are relative, so the same repository works in either mode.

## Local preview

You can open `index.html` directly, or run a tiny local web server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Updating content

- Main content: `index.html`
- Styling: `assets/css/main.css`
- Interaction / counters / radar: `assets/js/main.js`
- Headshot: replace `assets/images/navaneethan-headshot.png` with a new image using the same filename
- Resume: replace `assets/documents/Navaneethan-Srinivasan-Resume.pdf` using the same filename

## Privacy note

The portfolio intentionally keeps the current defence-technology employer unnamed and describes the work at a capability/outcome level. Review all content before publishing to ensure it complies with contractual, NDA, customer and security obligations.

## License

Portfolio content and personal materials © Dr. Navaneethan Srinivasan. Code may be adapted for personal use by the portfolio owner.
