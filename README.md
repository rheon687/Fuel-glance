# Fuel Glance

## Version
1.0.3 adds Shell Guide Bridge (OL7 0NS) with user-facing label `Work`, using the existing four-station ranking logic.

1.0.2 fixes the Morrisons forecourt postcode to the Fuel Finder identifier SK3 0RL.

1.0.1 fixed station matching for the live Fuel Finder CSV field `forecourts.location.postcode`.

A small installable Progressive Web App showing E10 prices for three configured UK forecourts, ordered cheapest first.

## Stations
- Esso, 83A Stockport Road, Cheadle, SK8 2AJ
- Morrisons, Edgeley Road, Stockport, SK3 0RL
- Tesco, Tiviot Way, Stockport, SK1 2BT
- Work (Shell Guide Bridge), 188 Stockport Road, Ashton-under-Lyne, OL7 0NS

The UI deliberately shows only Esso, Morrisons, Tesco and Work. Station matching is isolated in `logic.js` and currently uses exact postcodes.

## Data
The app reads the public `data.csv` mirror in `matthewgall/fuelfinder-archive`, which republishes UK Government Fuel Finder open data under the Open Government Licence v3.0. Replace `DATA_URL` in `app.js` with the official downloadable CSV URL when a stable browser-readable URL is confirmed.

## Behaviour
- Sorts available stations by E10 price ascending.
- Price colours: cheapest green, highest red, intermediate unique values orange; ties share the same rank.
- Freshness colours are calculated independently: newest green, oldest red, intermediate unique values orange.
- Pull down on touch devices to refresh. Press R on desktop.
- Falls back to the last successful local copy if the live request fails.

## Run locally
Serve the folder over HTTP, for example `python -m http.server 8080`, then open `http://localhost:8080`. Service workers and installability do not work reliably from `file://`.

## Tests
Run `node tests.mjs`.

## Handoff notes
Core parsing, matching, ranking and formatting are in `logic.js`. UI/data orchestration is in `app.js`. The main operational dependency is the external CSV URL and its schema. No credentials are stored.
