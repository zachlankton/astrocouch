#!/bin/bash

# this script is to instrument the src folder to be used for collecting code coverage

rsync -avh ./src ./ASDF
npx tsc --noEmit false --outDir ./ASDF --inlineSourceMap true
rm -rf ASDF/ASDF
find ./ASDF -name "*.ts" -delete
npx nyc instrument ASDF --in-place

npx nyc astro dev --config astro.config.test.mjs