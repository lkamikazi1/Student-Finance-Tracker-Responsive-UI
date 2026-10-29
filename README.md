# Student Finance Tracker

A responsive web app to track student spending. It is built with plain HTML, CSS and JavaScript.

Live site: https://jdcb5nvk-5500.inc1.devtunnels.ms/#about 
Demo video:

Features
- Add, edit and delete spending records
- Sort records by date, description or amount
- Live regex search with highlighted matches (case-insensitive option)
- Dashboard: total records, total spent, top category, last 7 days chart
- Spending cap with a message that updates automatically (polite when under, assertive when over)
- Settings: cap, base currency and manual exchange rates (USD, RWF, EUR)
- Data saves automatically in the browser (`localStorage`)
- Import and export data as JSON (the file is checked before loading)

##Sections
 About, Dashboard, Records, Add/Edit, Settings

## Regex rules
| Field | Pattern | Example |
|---|---|---|
| Description | `^\S(?:.*\S)?$` | "Lunch" (no spaces at the start or end) |
| Amount | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | 12 or 12.50 |
| Date | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` | 2025-09-29 |
| Category | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | "Fast-food" |
| Duplicate word (advanced, back-reference) | `\b(\w+)\s+\1\b` | "the the" |

## Accessibility
- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`) and proper headings
- Skip-to-content link and visible focus outlines
- Labels linked to every input
- Status and error messages use `aria-live` / `role="status"`
- Works with keyboard only
- Mobile-first design with breakpoints at 360px, 768px and 1024px

## Project structure
```
index.html
tests.html
seed.json
StyleSheets.css
Scripts/
  main.js        connects everything
  nav.js         shows one section at a time
  state.js       records and settings
  storage.js     localStorage + JSON import/export
  validators.js  regex rules
  search.js      regex search + highlight
  ui.js          draws the table, stats and errors
```
