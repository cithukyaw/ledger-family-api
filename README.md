# LedgerFamily API

API backend for [LedgerFamily app](https://github.com/cithukyaw/ledger-family-app) which tracks expenses and manages budget effectively.

**Tech Stack:**
- [Express.js](https://expressjs.com/) + [Typescript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [Passport.js](https://www.passportjs.org/)
- [PostgreSQL](https://www.postgresql.org/)

## API Documentation

API documentation is available at [API_DOC.md](API_DOC.md).

## Setup

```sh
npm install
npm run migrate
npm run seed
```

## Development

```sh
npm run dev
```

## Production

```sh
npm start
````
or
```sh
npm run build
npm run prod
```

## API for Model Context Protocol (MCP) server

API for MCP server is available to register expenses in batch.

- API: [See documentation](API_DOC.md#mcp-model-context-protocol)
- MCP Server: https://github.com/cithukyaw/mcp-csv-forwarder

### Generate API key for MCP server

```sh
npm run mcp:key -- <user@example.com>
```