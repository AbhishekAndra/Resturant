# Stackly 🍛

A complete restaurant & food ordering website built with vanilla HTML5, CSS3, and JavaScript — no frameworks, no build step.

## Pages

| Page | Description |
|---|---|
| `index.html` | Homepage — hero, about, featured dishes, testimonials, CTA |
| `menu.html` | Full menu with category filters, veg toggle, add-to-cart |
| `about.html` | Restaurant story, mission/vision, stats |
| `contact.html` | Contact form (validated), info, embedded map |
| `cart.html` | Cart with quantity controls and live totals |
| `checkout.html` | Delivery address form + mock payment + order summary |
| `login.html` / `signin.html` | Login and sign in / create account |
| `order-confirmation.html` | Order summary + mock delivery countdown |
| `customer-dashboard.html` | Order history, tracking, account, change password |
| `admin-dashboard.html` | Order management, menu availability toggles |
| `404.html` | Not found page with search + quick links |

## Demo credentials

Stored (commented) in [js/data.js](js/data.js):

- **Customer:** `demo@restaurant.in` / `demo1234`
- **Admin:** `admin@restaurant.in` / `admin1234`

You can also create a new account from the "Create Account" tab on `signin.html` — it's stored locally in the browser.

## Data & persistence

This is a fully static front-end demo — there is no backend or database. All state (cart, orders, session, account changes, menu availability) is stored in the browser's `localStorage`. Clearing site data resets everything.

## Local development

No build step is required. Serve the folder with any static file server, for example:

```bash
npx serve .
# or
python -m http.server 8080
```

Then open `http://localhost:PORT/index.html`.

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`, choose the `main` branch and `/ (root)` folder.
4. Save — GitHub will publish the site at `https://<username>.github.io/<repo-name>/`.

The included `.nojekyll` file disables Jekyll processing so all files are served as-is.

## Folder structure

```
/css      global + per-page stylesheets
/js       shared data/auth/cart engine + per-page scripts
/images   SVG logo, hero art, illustrations (no external image dependencies)
*.html    one file per page, at the project root (required for GitHub Pages)
```
