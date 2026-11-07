# Fuel Glance v2.0.0

Fuel Glance is an installable, account-free Progressive Web App for comparing E10 prices and price freshness across favourite UK forecourts.

## v2 behaviour
- Keeps the established black glance screen and pull-to-refresh.
- Adds a bottom-centre petrol-pump control that opens station management.
- Users can add a station by exact postcode, select from all matching Fuel Finder forecourts, and assign a friendly name.
- Users can rename or remove stations.
- Up to six favourites are stored only in the browser on that device. No account or backend database is used.
- Existing users are migrated to the established Esso, Morrisons, Tesco and Work defaults automatically.
- Price and freshness rankings remain independent: best green, worst red, all intermediate values orange; ties share rank.

## Architecture
- `logic.js`: CSV parsing, postcode matching, station selection, ranking, validation and default configuration.
- `app.js`: data retrieval, local persistence, view workflow, rendering, refresh and failure/cache handling.
- `styles.css`: glance and station-management presentation.
- `sw.js`: offline shell caching and update activation.
- `tests.mjs`: regression coverage for defaults, matching, sorting colours, ties, limits and station selection.

## Data
The app reads the public UK Fuel Finder CSV mirror at `matthewgall/fuelfinder-archive`. No credentials or secrets are used.

## Run and test
Serve over HTTP, for example `python -m http.server 8080`. Run tests with `node tests.mjs`.

## Known limitation
Favourite stations are device-local. A user's iPhone and PC do not automatically share configuration. Clearing browser/site data removes the saved list and restores the four defaults.
