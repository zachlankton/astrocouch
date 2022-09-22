#!/bin/bash

# this script is to instrument the src folder to be used for collecting code coverage

rm -rf astro-api-coverage
rsync -avh ./src ./INSTRUMENTED_SRC
npx tsc --noEmit false --outDir ./INSTRUMENTED_SRC --inlineSourceMap true
rm -rf INSTRUMENTED_SRC/INSTRUMENTED_SRC
rm -rf INSTRUMENTED_SRC/tests_playwright
rm INSTRUMENTED_SRC/playwright.config.js
find ./INSTRUMENTED_SRC -name "*.ts" -delete
npx nyc instrument INSTRUMENTED_SRC --in-place

# npx nyc -t test1 astro dev --config astro.config.test.mjs
npx nyc --nycrc-path .nycrc.playwright.json astro dev --config astro.config.test.mjs