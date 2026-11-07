# Fuel Glance v2.2.1
Security-hardened static PWA. Main view switches between E10 petrol and B7S standard diesel while preserving the compact glance layout. Price order, price colour and freshness colour follow the selected fuel. Bottom centre combined pump+magnifier opens station management. Station selection avoids duplicate postcode display. Favourites and selected fuel remain device-local. No accounts, analytics or secrets.


## v2.2.1
- Fixes Safari/iOS URL constructor failure caused by the data URL constant shadowing the built-in URL constructor. Uses DATA_URL plus globalThis.URL explicitly.
