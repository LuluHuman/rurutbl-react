# Rurutbl

## Overview

Rurutbl is a [Next.js](https://nextjs.org/) webapp that uses the converted output from [RuruTbl Scanner](https://github.com/rurutbl/rurutbl-scanner) which transforms [aSc Timetables](https://www.asctimetables.com/) to a more glanceable page

Website: https://rurutbl.luluhoy.tech/

Other Rurutbl Repos

-   API Repo: https://github.com/rurutbl/rurutbl-api
-   Scanner: https://github.com/rurutbl/rurutbl-scanner
-   Legacy site: https://github.com/rurutbl/rurutbl-static

### Features

-   **Timer:** Countdown towards next subject
-   **Only your class:** your selected class without going through 23 pages in a PDF file
-   **Just today and tommorow:** Focuses on current/next day
-   **Bus Arrival:** Bus Arrival timings using LTA's [Datamall](https://datamall.lta.gov.sg/) API

# Installation

You'll need NodeJS to install Rurutbl. Get node.js from here: http://nodejs.org/.

run `npm i` to install all packages

# Set up

### .env Variables

A `datamallkey` variable is required for bus APIs. Register the key at https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html

### semstartDate Varable

`semstartDate` is the date where semester starts. The date should be 2 days before Monday

### Bus Stop Refresh

Run `./tools/fetch_all_busstops.js` to refetch all avalable bus stops

### Class schedule

All the class schedule file are in the `./public/classes` directory

# Running Rurutbl

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Building Rurutbl

Run the following to get a static site in the `out` folder

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```
