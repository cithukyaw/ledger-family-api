# Agents Guide for ledger-family-api

This repository uses automated *agents* (subagents, skills, and helper agents) to assist with code exploration, generation, and maintenance. This document describes conventions, responsibilities, and safe usage patterns for agents working in this repo.

## Project Overview
This is the backend API for the LedgerFamily app. It exposes authenticated endpoints for expenses, ledgers, budgets, passive income, categories, users, and MCP ingestion. The service is built in TypeScript and uses Prisma ORM to access a PostgreSQL database.

## Tech Stack
- Node.js >= 20.9.0
- TypeScript
- Express.js
- Prisma ORM 6.19.x with PostgreSQL
- Passport.js JWT authentication
- Zod for request validation
- dotenv for environment configuration
- dayjs for date handling
- bcryptjs for password hashing
- cookie-parser and cors for HTTP middleware
- ts-node / nodemon for local development

## Setup
1. `npm install`
2. Ensure `.env` exists. The repository copies `.env.example` to `.env` on `postinstall` via `copy-env.ts`.
3. `npm run migrate`
4. `npm run seed`
5. `npm run dev` for local development

## Common Commands
- `npm run dev` - start development server with `nodemon`
- `npm run build` - compile TypeScript to `./build`
- `npm run migrate` - deploy Prisma migrations and generate client
- `npm run seed` - run Prisma seed script
- `npm run start` - build, migrate, seed, then run production server
- `npm run prod` - run compiled production build
- `npm run mcp:key -- <email>` - generate MCP API key for a user

## Code Style and Architecture
- Use TypeScript `strict` mode with `esModuleInterop` enabled.
- Keep request validation in `src/validations/*` using Zod.
- Keep DTO shapes in `src/dtos/*`.
- Keep API controllers in `src/controllers/*` and keep request/response handling there.
- Keep database logic in `src/services/*` using Prisma client instances.
- Keep Express route definitions in `src/routes/*`.
- Use `src/lib/*` for shared helpers, decorators, auth setup, and constants.
- Use `src/types/declarations.d.ts` for shared API response types.
- Follow the existing pattern of controllers → services → Prisma, with controllers delegating data operations to services.

## File and Naming Conventions
- `src/routes/*.ts` for Express route registration
- `src/controllers/*.controller.ts` for request handlers
- `src/services/*.service.ts` for Prisma/business logic
- `src/dtos/*.dto.ts` for request payload shapes and DTO definitions
- `src/validations/*.validation.ts` for Zod schemas
- `src/lib/*.ts` for reusable utilities and middleware
- `src/types/*.d.ts` for shared type declarations
- Use lower-kebab-case for file names and route files.
- Use PascalCase for controller class names and exported class defaults.
- Use camelCase for variables, function names, and DTO property names.

## Do's
- Do keep business logic inside services, not controllers.
- Do validate all incoming request data with Zod in controllers.
- Do use `apiValidationError` for consistent validation responses.
- Do protect routes with `authMiddleware` for authenticated APIs.
- Do keep soft-delete semantics consistent by filtering `deletedAt: null`.
- Do update ledgers via `syncLedger` when expenses or passive incomes change.
- Do preserve explicit route-level HTTP verbs and path structure.
- Do create agent artifacts that are human-reviewable and idempotent.

## Don'ts
- Don’t bypass validation or mutate request data without clear intent.
- Don’t implement Prisma queries directly in controllers; use service layer.
- Don’t hardcode secrets, credentials, or production config in source.
- Don’t perform destructive database schema changes without migrations.
- Don’t add new endpoints or features without following existing route/controller/service patterns.
- Don’t change architecture assumptions without verifying with the codebase first.

## Working Notes for Agents
- Agent changes should preserve the existing architecture and directory layout.
- Keep agent updates small, targeted, and easy to review.
- Prefer non-destructive modifications unless explicitly approved.
- If a task interacts with database schema, include migration guidance and review.
- When creating new agent files, include `name`, `purpose`, `inputs`, `outputs`, and `owner`.
- Use this guide as the reference for project conventions and agent behavior.

## Prisma Upgrade Notes
- Current version: Prisma ORM **6.19.x** (`prisma` + `@prisma/client`), using `prisma-client-js` and `@prisma/client` imports.
- A future upgrade to Prisma **7.9.x** is a separate, larger effort. It requires ESM (`"type": "module"`), `prisma.config.ts`, the `prisma-client` generator with a custom `output` path, PostgreSQL driver adapter (`@prisma/adapter-pg` + `pg`), and replacing `@prisma/client` imports with the generated client path. Do not start v7 migration unless explicitly requested.
- Prisma 8 is early access only; stay on v6 until v7 migration is planned and approved.

---
Last updated: 2026-08-15
