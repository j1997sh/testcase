# Back Ben for Mayor — GitHub Pages Demo

Static pitch/demo theme for a personalised Cheshire & Warrington mayoral campaign.

## Homepage data capture
The homepage captures:
- First name
- Last name
- Email address
- Postcode

## Image filenames
Drop images into `assets/images/` using these names:
- `ben-hero.jpg` — homepage candidate image
- `ben-area.jpg` — homepage local campaign image

The rest of the site currently uses image placeholders so real campaign assets can be added later.

## Main pages
- index.html
- about.html
- plan.html
- news.html
- events.html
- volunteer.html
- donate.html
- hear-from-ben.html
- business.html
- area.html

## Targeted journeys
- journeys/crewe-transport.html
- journeys/warrington-business.html
- journeys/chester-housing.html


## Campaign logo
The supplied Back Ben for Mayor logo has been recreated at high resolution with a transparent background and wired into the full theme.

File:
- `assets/images/back-ben-logo.png`

It is used in the header across all pages and as the main homepage campaign lock-up.


## About Ben interactive prototype
The About Ben page now includes:
- Meet Ben image / biography layout
- Expandable Why I'm standing panel
- Interactive Q&A accordion
- Ben in 60 seconds facts
- Video placeholder
- Campaign mission section
- Interactive story timeline
- Ask Ben data-capture form
- Ben near you postcode section
- Final Get Involved CTA

All copy is placeholder / lorem ipsum until final biography and campaign content are supplied.

Homepage candidate image has been removed for now.


## My Plan interactive prototype
The My Plan page now includes:
- Four full-width campaign priority sections
- Image placeholders
- Expandable policy detail accordions
- Links into targeted transport / housing / business journeys
- Interactive postcode localisation demo
- Ben explains the plan video placeholder
- Help shape the plan survey
- First name, last name, email and postcode capture

All detailed policy copy remains placeholder until final campaign policy is supplied.


## News search and category filtering
The News page now has:
- live keyword search
- clickable category tabs
- live results count
- clear filters control
- responsive filtering on desktop and mobile

The prototype filters entirely in-browser with JavaScript. In a production NationBuilder build, the same interface can be connected to real blog/news content and tags.


## Mobile navigation update
- Replaced the oversized full-screen mobile menu with a compact dropdown.
- Added Volunteer and Donate actions inside the mobile menu.
- Mobile homepage campaign lock-up is now simplified to the campaign logo plus the regional tagline only.


## Homepage landing hero
Homepage hero rebuilt around a campaign-signup landing structure:
- BACK BEN kicker
- "Join Ben's campaign for Mayor of Cheshire & Warrington"
- First name / last name / email / postcode
- Join the campaign CTA
- Facebook / Instagram / X / TikTok social buttons
- Large candidate hero image placeholder
- Watch Ben video CTA
- Existing Back Ben red / navy / blue campaign styling retained


## Experience page
A new main-navigation Experience section has been added.

The page includes:
- large editorial introduction
- image placeholders
- filterable categories: Delivery / Business / Communities / Leadership
- expandable evidence/detail blocks
- proof-in-numbers section with placeholder figures
- leadership video placeholder
- route into My Plan

All substantive achievements and figures are deliberately placeholder content until verified campaign material is supplied.


## Header update
- Removed the campaign logo from the site header across all pages.


## Homepage refinement
Homepage reworked to:
- keep Volunteer / Donate only as boxed header actions
- make BACK BEN the dominant hero line
- reduce the campaign signup headline size
- stretch the hero image/video placeholder across the full hero background
- overlay the signup form over the hero
- replace the four-priority strip with a large image + short introduction + Learn More block
- make Ben in your area full width
- remove Follow the campaign
- add a stronger footer


## Homepage hero image
The supplied Ben photograph is now used as the real homepage hero background:
- `assets/images/ben-home-hero.jpg`
- desktop crop keeps Ben to the right with a dark readability gradient on the left
- mobile uses a higher crop with the signup content below the portrait


## About Ben editorial redesign
The About page has been rebuilt as a long-form editorial biography:
- large opening campaign statement
- flowing biography copy rather than card grids
- tilted photo / polaroid placeholders
- pull quote
- quick facts band
- Why I'm standing section
- video block
- Ask Ben form

The treatment is inspired by traditional political biography pages but uses Back Ben's navy/red/cream visual identity.


## Definitive hero/header fix
- Hero image is now rendered as a real `<img>` element rather than relying on CSS background loading.
- Desktop navigation can no longer show the mobile Volunteer / Donate duplicates.
- Mobile-only Volunteer / Donate actions are only created below 900px.


## V4 cache-bust fix
All pages now reference:
- `assets/css/style-v4.css`
- `assets/js/site-v4.js`

This forces GitHub Pages / Safari to load the latest current styling rather than a cached earlier `style-v3.css`.


## About page style update
- Removed the large blue gradient hero from About Ben.
- Replaced it with a cream editorial intro.
- About now flows directly into the long-form biography treatment.
