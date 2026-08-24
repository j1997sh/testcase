# Ben for Mayor — Crewe Personalisation Prototype

This build keeps one website and one codebase.

## Added
- `assets/data/areas.js` — regional + Crewe campaign configuration
- `assets/js/personalisation.js` — URL context, localStorage, postcode mapping, issue context, UTM attribution, local content changes, form context, contextual thank-you logic
- site-wide form hidden fields intended for future NationBuilder mapping
- Crewe prioritisation for News and Events
- Crewe-aware Ben’s Plan and policy inserts
- Crewe-aware Tell Ben intelligence questions
- visible "Showing campaign updates for Crewe · Change area" control

## Current prototype postcode support
- CW1 → Crewe
- CW2 → Crewe

Other postcodes fall back to the regional Cheshire & Warrington experience.

## Example journeys
- `/?area=crewe`
- `/?area=crewe&issue=transport&utm_source=meta&utm_campaign=crewe_transport`
- `/plan.html?area=crewe`
- `/tell-ben.html?area=crewe&issue=transport`

## NationBuilder-ready hidden fields
Forms are automatically given:
- `ben_area`
- `ben_issue`
- `ben_area_source`
- `ben_postcode_context`
- `ben_utm_source`
- `ben_utm_medium`
- `ben_utm_campaign`
- `ben_utm_content`
- `ben_landing_page`
- original acquisition fields

These can later be mapped to NationBuilder custom fields/tags rather than rebuilding the front-end.

## Persistence model v2
- `?area=crewe` / advert-derived area is stored in `sessionStorage` and follows the visitor through that campaign journey.
- A clean visit to the plain homepage returns to the regional Cheshire & Warrington experience unless the visitor has explicitly chosen an area.
- Postcode/manual area selection is stored persistently in `localStorage`.
- Original acquisition attribution remains stored separately.
