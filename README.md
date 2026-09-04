# sparql-builder

[![npm version](https://badge.fury.io/js/sparql-builder.svg)](https://badge.fury.io/js/sparql-builder)

Type-safe SPARQL query builder and client for JavaScript/TypeScript. Query RDF data from SPARQL endpoints like DBpedia, Wikidata, and others with a fluent, type-safe API.

## Features

- 🔧 **Type-safe Query Builder** - Fluent API for building SPARQL queries
- 🌐 **SPARQL Client** - Execute queries against any SPARQL endpoint
- 🔷 **Full TypeScript Support** - Complete type definitions included
- 📦 **ESM and CommonJS** - Works in Node.js and browsers
- 🚀 **Lightweight** - Built with Vite for optimal bundle size
- ✅ **Well Tested** - Comprehensive test coverage with Vitest

## Installation

```bash
npm install sparql-builder
```

## Quick Start

### Building Queries

```typescript
import { QueryBuilder } from 'sparql-builder'

const query = new QueryBuilder()
  .prefix('foaf', 'http://xmlns.com/foaf/0.1/')
  .select('?name', '?email')
  .where('?person', 'foaf:name', '?name')
  .where('?person', 'foaf:mbox', '?email')
  .filter('regex(?name, "John", "i")')
  .orderBy('?name', 'ASC')
  .limit(10)
  .build()

console.log(query)
// PREFIX foaf: <http://xmlns.com/foaf/0.1/>
// SELECT ?name ?email
// WHERE {
//   ?person foaf:name ?name .
//   ?person foaf:mbox ?email .
//   FILTER(regex(?name, "John", "i"))
// }
// ORDER BY ASC(?name)
// LIMIT 10
```

### Executing Queries

```typescript
import { SPARQLClient, QueryBuilder } from 'sparql-builder'

const query = new QueryBuilder()
  .select('?name')
  .where('?person', 'foaf:name', '?name')
  .limit(10)
  .build()

const client = new SPARQLClient('https://dbpedia.org/sparql')
client.setQuery(query)
const results = await client.get()

console.log(results) // Array of bindings
```

### Simple Function API

```typescript
import { execSparqlQuery } from 'sparql-builder'

const results = await execSparqlQuery(
  'SELECT ?name WHERE { ?person foaf:name ?name } LIMIT 10',
  'https://dbpedia.org/sparql'
)
```

## Query Builder API

### Basic Methods

- **`prefix(prefix: string, iri: string)`** - Add PREFIX declaration
- **`select(...vars: string[])`** - Add SELECT variables
- **`distinct()`** - Set DISTINCT modifier
- **`where(subject: string, predicate: string, object: string)`** - Add triple pattern
- **`filter(expression: string)`** - Add FILTER expression
- **`limit(n: number)`** - Set LIMIT
- **`offset(n: number)`** - Set OFFSET
- **`orderBy(variable: string, direction?: 'ASC' | 'DESC')`** - Set ORDER BY
- **`build()`** - Build the SPARQL query string

### Advanced Features

#### OPTIONAL Patterns

```typescript
const query = new QueryBuilder()
  .select('?name', '?email')
  .where('?person', 'foaf:name', '?name')
  .optional(qb => {
    qb.where('?person', 'foaf:mbox', '?email')
  })
  .build()
```

#### GROUP BY and Aggregation

```typescript
const query = new QueryBuilder()
  .select('?category')
  .count('?item', '?count')
  .where('?item', 'rdf:type', '?category')
  .groupBy('?category')
  .build()
```

#### Complex Queries

```typescript
const query = new QueryBuilder()
  .prefix('foaf', 'http://xmlns.com/foaf/0.1/')
  .prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
  .distinct()
  .select('?name', '?age')
  .where('?person', 'rdf:type', 'foaf:Person')
  .where('?person', 'foaf:name', '?name')
  .where('?person', 'foaf:age', '?age')
  .optional(qb => {
    qb.where('?person', 'foaf:mbox', '?email')
  })
  .filter('?age >= 18')
  .orderBy('?age', 'DESC')
  .limit(20)
  .offset(10)
  .build()
```

## SPARQL Client API

### SPARQLClient Class

```typescript
import { SPARQLClient } from 'sparql-builder'

// Create client with default endpoint (DBpedia)
const client = new SPARQLClient()

// Or specify custom endpoint
const client = new SPARQLClient('https://query.wikidata.org/sparql')

// Set query and execute
client.setQuery('SELECT * WHERE { ?s ?p ?o } LIMIT 10')
const results = await client.get()
```

### Methods

- **`setQuery(query: string)`** - Set the SPARQL query
- **`getQuery()`** - Get the current query
- **`execQuery()`** - Execute query and get full results
- **`get()`** - Execute query and get bindings array

## TypeScript Support

Full type definitions are included:

```typescript
import {
  QueryBuilder,
  SPARQLClient,
  type SparqlBinding,
  type SparqlResults,
  type QueryType,
  type OrderDirection
} from 'sparql-builder'
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build
npm run build

# Lint
npm run lint
```

## License

MIT

## Author

Hidetaka Okamoto <info@wp-kyoto.net> (<https://wp-kyoto.net>)
