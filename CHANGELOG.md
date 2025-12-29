# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.8] - 2025-12-28

### Changed

- **Upgraded to ESLint 9**: Migrated from ESLint 7 to ESLint 9.39.2 with modern flat config format (`eslint.config.mjs`)
- **Upgraded TypeScript ESLint**: Updated `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` from 4.x to 8.50.1
- **Removed eslint-config-standard**: Removed old `eslint-config-standard` and related plugins (incompatible with ESLint 9), now using `@eslint/js` and `typescript-eslint` directly
- **Updated TypeScript**: Upgraded from 4.7.4 to 5.9.3
- **Updated Jest**: Upgraded from 27.5.1 to 30.2.0
- **Updated @types/jest**: Upgraded from 27.5.2 to 30.0.0
- **Updated @types/node**: Upgraded from 15.x to 25.0.3
- **Updated @types/sinon**: Upgraded from 9.x to 17.0.0
- **Updated sinon**: Upgraded from 9.x to 17.0.0
- **Updated ts-jest**: Upgraded from 27.1.5 to 29.4.6
- **Updated jest-junit**: Upgraded from 8.0.0 to 16.0.0
- **Updated TypeORM**: Upgraded from 0.3.15 to 0.3.28
- **Updated Node.js engines**: Changed to `>=18` to support Node 18, 20, and 22

### Added

- **GitHub Actions Workflows**: Added modern CI/CD workflows
  - `ci.yml`: Continuous integration testing on Node.js 18, 20, and 22
  - `publish-npm.yml`: Automated NPM publishing with OIDC trusted publishing (no tokens needed)
  - `dependabot-auto-merge.yml`: Auto-merge Dependabot PRs with automerge label
- **Dependabot**: Added configuration for automated dependency updates
- **CHANGELOG.md**: Added this changelog file to track version history

### Fixed

- **TypeORM 0.3.28+ Compatibility**: Updated mock methods to match TypeORM 0.3.28+ interface requirements
  - `deleteAll` now returns `Promise<DeleteResult>` instead of `Promise<void>`
  - `deleteAllBy` now returns `Promise<DeleteResult>`
  - `deleteQueryBatch` now returns `Promise<number>` (count of deleted items)
  - Added `changeTableComment` method to `MockQueryRunner`
  - Added `sql` method to `MockQueryRunner`
- **Function Type Issues**: Fixed deprecated `Function` type usage in favor of specific function signatures
- **Security vulnerabilities**: Resolved by upgrading dependencies
- **Removed .npmrc**: Eliminated private registry configuration that was causing installation issues
