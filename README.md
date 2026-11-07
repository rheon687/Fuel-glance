# Fuel Glance v2.3.1
Security-hardened static PWA. Main view switches between E10 petrol and B7S standard diesel while preserving the compact glance layout. Price order, price colour and freshness colour follow the selected fuel. Bottom centre combined pump+magnifier opens station management. Station selection avoids duplicate postcode display. Favourites and selected fuel remain device-local. No accounts, analytics or secrets.


## v2.2.1
- Fixes Safari/iOS URL constructor failure caused by the data URL constant shadowing the built-in URL constructor. Uses DATA_URL plus globalThis.URL explicitly.


## v2.2.2
- Fixes duplicate postcode display in the existing-stations Manage/Edit list as well as postcode search results.


## v2.3.0
- E10/B7 grade labels added.
- Pump and magnifier separated by a visible gap in one Manage Stations control.
- URL and both postcode duplication fixes retained.


## v2.3.1
- Main-screen Manage control is petrol-pump only; magnifier removed.
- Your stations secondary text now guarantees a postcode is rendered once when no distinct trading name exists.
