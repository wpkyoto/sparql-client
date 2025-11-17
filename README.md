# Simple SPARQL Client

[![npm version](https://badge.fury.io/js/@hideokamoto/simple-sparql-client.svg)](https://badge.fury.io/js/@hideokamoto/simple-sparql-client)

A modern TypeScript SPARQL client for querying RDF data from SPARQL endpoints like DBpedia, Wikidata, and others.

## Features

- 🔷 Full TypeScript support with type definitions
- 📦 ESM and CommonJS support
- 🚀 Built with Vite for optimal bundle size
- ✅ Tested with Vitest
- 🎨 Linted and formatted with Biome

## Installation

```bash
npm install @hideokamoto/simple-sparql-client
```

## Usage

### As a Function (Recommended)

#### TypeScript / ESM

```typescript
import { execSparqlQuery } from '@hideokamoto/simple-sparql-client'

// Using async/await
const bindings = await execSparqlQuery('SELECT DISTINCT * WHERE { ?s ?p ?o } LIMIT 100')
console.log(bindings)

// Using Promise
execSparqlQuery('SELECT DISTINCT * WHERE { ?s ?p ?o } LIMIT 100')
  .then(bindings => console.log(bindings))
  .catch(err => console.error(err))
```

#### CommonJS

```javascript
const { execSparqlQuery } = require('@hideokamoto/simple-sparql-client')

const bindings = await execSparqlQuery('SELECT DISTINCT * WHERE { ?s ?p ?o } LIMIT 100')
console.log(bindings)
```

### As a Class

```typescript
import { SPARQLClient } from '@hideokamoto/simple-sparql-client'

// Create a client with default endpoint (DBpedia)
const client = new SPARQLClient()

// Or specify a custom endpoint
const client = new SPARQLClient('https://query.wikidata.org/sparql')

// Set query and execute
client.setQuery('SELECT DISTINCT * WHERE { ?s ?p ?o } LIMIT 100')
const bindings = await client.get()
console.log(bindings)
```

### Type Definitions

The library exports TypeScript types for better development experience:

```typescript
import type { SparqlBinding, SparqlResults } from '@hideokamoto/simple-sparql-client'

// SparqlBinding represents a single result row
// SparqlResults contains the full result set
```

## API

### `execSparqlQuery(query: string, endpoint?: string): Promise<SparqlBinding[]>`

Execute a SPARQL query and return the bindings.

- `query`: SPARQL query string
- `endpoint`: SPARQL endpoint URL (default: `http://dbpedia.org/sparql`)
- Returns: Promise with array of result bindings

### `SPARQLClient`

#### Constructor

```typescript
new SPARQLClient(endpoint?: string)
```

- `endpoint`: SPARQL endpoint URL (default: `http://dbpedia.org/sparql`)

#### Methods

- `setQuery(query: string): void` - Set the SPARQL query
- `getQuery(): string | undefined` - Get the current query
- `execQuery(): Promise<SparqlResults>` - Execute the query and get full results
- `get(): Promise<SparqlBinding[]>` - Execute the query and get bindings

## Development

```bash
# Clone the repository
git clone https://github.com/hideokamoto/sparql-client.git
cd sparql-client

# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format

# Build
npm run build
```

## Contributing

Contributions are welcome! Please ensure the following before submitting a PR:

```bash
npm run lint    # All lint checks pass
npm test        # All tests pass
npm run build   # Build succeeds
```

## License

MIT
