#!/bin/bash

npx nyc report --reporter json --report-dir astro-api-report -t astro-api-coverage
rm -rf INSTRUMENTED_SRC
rm -rf astro-api-coverage