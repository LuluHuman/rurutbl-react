# Rurutbl 
## Overview
Rurutbl is a [Next.js](https://nextjs.org/) webapp that uses the converted output from [RuruTbl Scanner](https://github.com/rurutbl/rurutbl-scanner)  which transforms [aSc Timetables](https://www.asctimetables.com/) to a more glanceable page

Website: https://rurutbl.luluhoy.tech/

Other Rurutbl Repos
* API Repo: https://github.com/rurutbl/rurutbl-api
* Scanner: https://github.com/rurutbl/rurutbl-scanner
* Legacy site: https://github.com/rurutbl/rurutbl-static

### Features
* **Timer:** Countdown towards next subject
* **Only your class:** your selected class without going through 23 pages in a PDF file
* **Just today and tommorow:** Focuses on current/next day
* **Bus Arrival:** Bus Arrival timings using LTA's [Datamall](https://datamall.lta.gov.sg/) API


# Installation

You'll need NodeJS to install Rurutbl.  Get node.js from here: http://nodejs.org/.

run `npm i` to install all packages

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

Run the following to get a static site in the  `out` folder

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

# Contribution
If you find bugs or have ideas, please share them in via GitHub Issues