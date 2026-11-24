# Dougherty Valley Track/XC Camp

Responsive, multi-page static site. Start the preview with `python3 -m http.server 8000 --bind 0.0.0.0` from this directory.

## Pages

- `index.html` — camp overview and enrollment CTA
- `articles.html` — Field Notes index
- `running-benefits.html` — evidence-aware youth running and activity article (CDC source linked in-page)
- `college-running.html` — college varsity/club pathways overview (NCAA and NIRCA linked in-page)
- `track-vs-cross-country.html` — a plain-language guide to the two sports
- `team.html` — cofounders and CTO profile placeholders
- `assets/DV-Track-XC-Camp-Poster.pdf` — organizer-provided camp poster, linked for download on the homepage

## Camp details and publishing notes

Edit the content in `index.html` to update the interest form, contact information, Instagram posts, and program details. Dates/times, pricing, exact venue address, and final enrollment steps are still TBD. The interest form is an inquiry only, not confirmed enrollment.

The running photos in `assets/` are supporting editorial imagery, not photographs of the camp or its athletes. The camp poster PDF and its web preview are organizer-provided. Replace generic running photos with approved camp imagery if the organizers provide it. Article content is general information; check linked official sources for current health, eligibility, and financial-aid guidance.

`styles.css` holds the site-wide layout and responsive styles; `script.js` handles the accessible navigation, scroll reveals, article reading progress, and optional Web Audio UI ticks. The three training pillars are keyboard-accessible expandable cards with general workout examples and a youth-safety disclaimer. Sound is off by default and only plays after a visitor enables it. The header/footer branding is text-only. The Team page has replaceable portrait slots; names and titles are limited to the details provided by the organizer.

## Run it on your laptop

1. Install Python 3 if it is not already installed.
2. Open Terminal (macOS/Linux) or PowerShell (Windows), then change directory to this project folder. For example: `cd path/to/Dvtrackcamp`.
3. Start the local web server:
   - macOS/Linux: `python3 -m http.server 8000`
   - Windows: `py -m http.server 8000`
4. Open `http://localhost:8000` in your browser. Keep the terminal window open while you use the site; press `Ctrl+C` there to stop it.

This is a static site and needs no build step, package installation, or database. To share it publicly, upload the project files (including `assets/`) to a static hosting service such as GitHub Pages, Netlify, or Cloudflare Pages. The server command above is for your own laptop, not public hosting.
