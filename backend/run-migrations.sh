#!/bin/sh
# Run all migrations
npx ts-node ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts

