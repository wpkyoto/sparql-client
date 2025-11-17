# SPARQL Client Monorepo

[![npm version](https://badge.fury.io/js/@hideokamoto/simple-sparql-client.svg)](https://badge.fury.io/js/@hideokamoto/simple-sparql-client)

Modern TypeScript SPARQL tools for querying RDF data from SPARQL endpoints like DBpedia, Wikidata, and others.

## Packages

This monorepo contains two packages:

### [@hideokamoto/sparql-query-builder](./packages/query-builder)

Type-safe SPARQL query builder for JavaScript/TypeScript.

```typescript
import { QueryBuilder } from '@hideokamoto/sparql-query-builder'

const query = new QueryBuilder()
  .prefix('foaf', 'http://xmlns.com/foaf/0.1/')
  .select('?name', '?email')
  .where('?person', 'foaf:name', '?name')
  .where('?person', 'foaf:mbox', '?email')
  .filter('regex(?name, "John", "i")')
  .limit(10)
  .build()
```

### [@hideokamoto/simple-sparql-client](./packages/client)

SPARQL client with built-in query builder support.

```typescript
import { SPARQLClient, QueryBuilder } from '@hideokamoto/simple-sparql-client'

// Using query builder
const query = new QueryBuilder()
  .select('?name')
  .where('?person', 'foaf:name', '?name')
  .limit(10)
  .build()

const client = new SPARQLClient()
client.setQuery(query)
const results = await client.get()
```

## Installation

```bash
# Install client (includes query builder)
npm install @hideokamoto/simple-sparql-client

# Or install query builder separately
npm install @hideokamoto/sparql-query-builder
```

## Development

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

## Features

- 🔷 Full TypeScript support
- 📦 ESM and CommonJS support
- 🚀 Built with Vite for optimal bundle size
- ✅ Tested with Vitest
- 🎨 Linted and formatted with Biome
- 🔧 Type-safe query builder with fluent API
- 🌐 Support for PREFIX, SELECT, WHERE, FILTER, OPTIONAL, GROUP BY, ORDER BY

## License

MIT
