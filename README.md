<a href="https://www.codefactor.io/repository/github/adamjanin/bff-monorepo-template"><img src="https://www.codefactor.io/repository/github/adamjanin/bff-monorepo-template/badge" alt="CodeFactor" /></a>
<a href="https://www.codacy.com/gh/adamjanin/bff-monorepo-template/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=adamjanin/bff-monorepo-template&amp;utm_campaign=Badge_Grade"><img src="https://app.codacy.com/project/badge/Grade/6a691d3adbaf4b218e25db25deb9fabd"/></a>

# bff-monorepo-template
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
