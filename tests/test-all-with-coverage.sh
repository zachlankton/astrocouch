#!/bin/bash

echo
echo "Running Jest Tests..."
npm run test:jest
TESTJESTRESULTS=$?
if ! [ $TESTJESTRESULTS = 0 ]
then
    exit $TESTJESTRESULTS
fi

echo
echo "Cleaning up any existing coverage files..."
rm -rf ./merge-coverage
mkdir merge-coverage 

echo
echo "Creating a copy of the src to instrument"
rsync -avh ./src ./INSTRUMENTED_SRC

echo
echo "Running Typescript Compiler..."
npx tsc --noEmit false --outDir ./INSTRUMENTED_SRC --inlineSourceMap true

echo
echo "Cleaning up the instrumented code folder..."
rm -rf INSTRUMENTED_SRC/INSTRUMENTED_SRC
rm -rf INSTRUMENTED_SRC/tests
find ./INSTRUMENTED_SRC -name "*.ts" -delete

echo
echo "Instrumenting the code..."
npx nyc instrument INSTRUMENTED_SRC --in-place

echo
echo "Setting up Test Environment..."
if ! [ -f ".env.dev.bak" ]
then
mv .env.development .env.dev.bak
cp ./tests/.env.test .env.development
fi

echo
echo "Starting the Dev Server for Testing..."
npx nyc --nycrc-path ./tests/.nycrc.playwright.json astro dev --config ./tests/astro.config.test.mjs &

echo
echo -n "Waiting for Server to come up"
SERVER_UP=`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`
while ! [ $SERVER_UP = 200 ]
do
    echo -n "."
    sleep 2
    SERVER_UP=`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`
done
sleep 2
echo " Server is up!"

echo
echo "Running PlayWright Tests..."
npx playwright test --reporter=dot --config ./tests/playwright.config.ts
TESTRESULTS=$?

SERVER_PID=`ps -aux | grep '/node_modules/.bin/astro dev --config ./tests/astro.config.test.mjs' | tail -n 2 | head -n 1 | awk '{print $2}'`
echo "Sending SIGINT to Server PID: $SERVER_PID"
kill -2 $SERVER_PID

echo
echo -n "Waiting for server to shutdown"
while ! [ -f "./astro-api-report/coverage-final.json" ]
do
    echo -n "."
    sleep 2
done
sleep 2
echo " Server has shutdown completely."

echo
echo "Moving jest and api coverage to merge-coverage..."
cp ./astro-api-report/coverage-final.json ./merge-coverage/astro-api.json
cp ./tests/coverage-jest/coverage-final.json ./merge-coverage/jest.json

echo
echo "Merging All Coverage..."
rm -rf ./.nyc_output
mkdir .nyc_output
npx nyc merge ./merge-coverage/ ./.nyc_output/coverage-final.json


echo
echo "Cleaning up Test Environment..."
rm .env.development
mv .env.dev.bak .env.development
rm -rf ./astro-api-coverage
rm -rf ./astro-api-report
rm -rf ./INSTRUMENTED_SRC
rm -rf ./tests/coverage-jest
rm -rf ./merge-coverage

echo
npx nyc report

echo
echo "DONE!!!"
echo

exit $TESTRESULTS