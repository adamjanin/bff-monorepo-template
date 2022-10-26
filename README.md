# bff-monorepo-template

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/896ff23b2b0c4e12ab4c27218e7fecb8)](https://app.codacy.com/gh/adamjanin/bff-monorepo-template?utm_source=github.com&utm_medium=referral&utm_content=adamjanin/bff-monorepo-template&utm_campaign=Badge_Grade_Settings)

BFF monorepo template (PNPM, NestJS, GRPC, GraphQL, PrismaJS)

backend :

1. nestJs
2. graphql
3. GRPC for microservices
4. prismaJS for DB ORM
5. MongoDb as data storage


## How to install a dependency for a package

Run `pnpm --workspace @adamjanin/bff add graphql` (Add `-D` after _add_ for devDependencies)

## How to build all packages

Run `pnpm --stream -r build`

## How to start all packages

1. Ensure _.env_ file is created for relevant services or define environment variables in terminal.
1. Run `pnpm --stream -r start`

## How to start all packages in local

Run `pnpm --stream -r start:dev`


## Notes

1. pnpm --filter bff start
1. Add `filter` parameter to run script for single package only. For example `pnpm --filter bff start`
