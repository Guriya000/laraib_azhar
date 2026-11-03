# Laraib Azhar — Developer Portfolio

A responsive portfolio built with HTML5, CSS, Tailwind CSS, and vanilla JavaScript. Tailwind utilities are compiled locally; no framework runtime or CDN is loaded by the website.

## Build and run locally

Install dependencies and compile the stylesheet:

```powershell
npm install
npm run build
```

Then open `index.html` in a browser, or serve the project directory with Python:

```powershell
py -m http.server 8000
```

Then visit `http://localhost:8000`.

Use `npm run dev` while editing to rebuild the Tailwind stylesheet automatically.

## Project contents

- `index.html`, `styles.css`, `tailwind.input.css`, and `script.js` contain the website source.
- `compiled.css` is the generated Tailwind and site stylesheet served by the page.
- `assets/cv/Laraib-Azhar-CV.png` is the CV image provided with the project brief and is available from the Download CV links.
- `assets/project pic/` contains the project showcase images used in the portfolio.
- `assets/certifications/` contains the certificate images shown in the credentials gallery.
- `portfolio/` retains additional project screenshots and supporting files.

The contact section uses direct email, phone, GitHub, and LinkedIn links; there is no contact form or backend.
