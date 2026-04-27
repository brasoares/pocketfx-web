# PocketFX Web

Frontend for the PocketFX multi-asset analysis tool. Displays investment experiments under three analytical lenses: counterfactual retrospective, present vs. 90-day moving average, and Monte Carlo projection.

Developed as the MVP for the **Advanced Backend Development** course — Full Stack Post-Graduation, PUC-Rio.

## Overview

PocketFX lets users explore hypothetical investment experiments ("what if I had put X into BTC 6 months ago?") through an interactive dashboard with three lenses per experiment:

- **Retrospective**: what the investment would be worth today.
- **Present**: current price vs. 90-day moving average with directional signal.
- **Projection**: Monte Carlo fan chart (pessimistic p5 / median p50 / optimistic p95) over 90 days.

## Stack

- Next.js 16 (Pages Router, JavaScript)
- Bootstrap 5 + react-bootstrap
- react-i18next + i18next — 7 languages with cultural number formatting via `Intl.NumberFormat`
- Recharts — LineChart and AreaChart
- Docker

## Supported Languages

| Code | Language |
|------|----------|
| en | English |
| pt-BR | Português |
| es | Español |
| fr | Français |
| de | Deutsch |
| ja | 日本語 |
| zh | 中文 |

Number formatting changes automatically per locale (e.g. `1,234.56` in `en`, `1.234,56` in `pt-BR`, `1 234,56` in `fr`).

## Local Setup

Prerequisites: Node.js LTS, Git. The [PocketFX API](https://github.com/brasoares/pocketfx-api) must be running on `http://localhost:8000`.

```bash
# Clone the repository
git clone https://github.com/brasoares/pocketfx-web.git
cd pocketfx-web

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open `http://localhost:3000` in your browser.

## Running with Docker

```bash
# Build the image
docker build -t pocketfx-web .

# Run the container
docker run -p 3000:3000 pocketfx-web
```

## Project Structure

```
pocketfx-web/
├── components/
│   ├── Navbar.js            # top navigation with language selector
│   └── LanguageSelector.js  # locale switcher (7 languages)
├── lib/
│   ├── i18n.js              # i18next configuration
│   └── formatNumber.js      # Intl.NumberFormat helpers
├── pages/
│   ├── _app.js              # global layout, Bootstrap, i18n init
│   ├── index.js             # redirects to /experiments
│   ├── experiments.js       # experiment list
│   └── experiments/
│       └── [id].js          # experiment detail — three lenses
├── public/
│   └── locales/             # translation files (en, pt-BR, es, fr, de, ja, zh)
├── styles/
│   └── globals.css
├── Dockerfile
└── next.config.mjs
```

## Disclaimer

Projection scenarios displayed in the Monte Carlo lens are statistical simulations based on historical volatility. **They do not constitute market forecasts or investment recommendations.**

## License

Apache 2.0 — see `LICENSE` file.

## Author

Henoc Soares Freire — [github.com/brasoares](https://github.com/brasoares)