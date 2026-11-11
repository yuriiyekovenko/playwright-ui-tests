# Playwright UI Testing Practice

A hands-on project for practising UI test automation with Playwright and TypeScript.

The tests cover [SauceDemo](https://www.saucedemo.com), a public demo web shop, and demonstrate:

- Page Object Model
- custom Playwright fixtures
- parameterized tests
- data-driven sorting validation
- positive and negative test scenarios
- expected failures for known defects
- download and PDF content validation
- GitHub Actions CI
- Chromium and Firefox execution
- HTML reporting

## Setup

Create a `.env` file and install dependencies:

```bash
npm ci
```

Required variables:

```
BASE_URL=https://www.saucedemo.com
USERNAME=standard_user
LOCKED_OUT_USERNAME=locked_out_user
PASSWORD=secret_sauce
```

Set `TEST_ENV=<name>` to load `.env.<name>` instead of `.env`.

## Run locally

```bash
npm test
```

## Other commands

```bash
npm run typecheck
npm run test:ui
npm run test:headed
```
