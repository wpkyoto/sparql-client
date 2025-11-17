# @hideokamoto/sparql-query-builder

Type-safe SPARQL query builder for JavaScript/TypeScript.

## Installation

```bash
npm install @hideokamoto/sparql-query-builder
```

## Usage

### Basic SELECT Query

```typescript
import { QueryBuilder } from '@hideokamoto/sparql-query-builder'

const query = new QueryBuilder()
  .select('?name', '?email')
  .where('?person', 'foaf:name', '?name')
  .where('?person', 'foaf:mbox', '?email')
  .build()

console.log(query)
// SELECT ?name ?email
// WHERE {
//   ?person foaf:name ?name .
//   ?person foaf:mbox ?email .
// }
```

### With PREFIX Declarations

```typescript
const query = new QueryBuilder()
  .prefix('foaf', 'http://xmlns.com/foaf/0.1/')
  .prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
  .select('?name')
  .where('?person', 'rdf:type', 'foaf:Person')
  .where('?person', 'foaf:name', '?name')
  .build()
```

### FILTER, LIMIT, and ORDER BY

```typescript
const query = new QueryBuilder()
  .select('?name', '?age')
  .where('?person', 'foaf:name', '?name')
  .where('?person', 'foaf:age', '?age')
  .filter('?age > 18')
  .orderBy('?name', 'ASC')
  .limit(10)
  .build()
```

### OPTIONAL Patterns

```typescript
const query = new QueryBuilder()
  .select('?name', '?email')
  .where('?person', 'foaf:name', '?name')
  .optional((qb) => {
    qb.where('?person', 'foaf:mbox', '?email')
  })
  .build()
```

### DISTINCT and Aggregation

```typescript
const query = new QueryBuilder()
  .prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
  .distinct()
  .select('?category')
  .count('?item', '?count')
  .where('?item', 'rdf:type', '?category')
  .groupBy('?category')
  .build()
```

### Complex Query

```typescript
const query = new QueryBuilder()
  .prefix('foaf', 'http://xmlns.com/foaf/0.1/')
  .prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
  .distinct()
  .select('?name', '?email', '?age')
  .where('?person', 'rdf:type', 'foaf:Person')
  .where('?person', 'foaf:name', '?name')
  .where('?person', 'foaf:age', '?age')
  .optional((qb) => {
    qb.where('?person', 'foaf:mbox', '?email')
  })
  .filter('?age >= 18')
  .filter('regex(?name, "^J", "i")')
  .orderBy('?age', 'DESC')
  .limit(20)
  .offset(10)
  .build()
```

## API

### Methods

- **`prefix(prefix: string, iri: string)`** - Add PREFIX declaration
- **`select(...vars: string[])`** - Add SELECT variables
- **`distinct()`** - Set DISTINCT modifier
- **`count(variable: string, alias?: string)`** - Add COUNT aggregation
- **`where(subject: string, predicate: string, object: string)`** - Add WHERE triple pattern
- **`filter(expression: string)`** - Add FILTER expression
- **`optional(builder: (qb: QueryBuilder) => void)`** - Add OPTIONAL block
- **`limit(n: number)`** - Set LIMIT
- **`offset(n: number)`** - Set OFFSET
- **`orderBy(variable: string, direction?: 'ASC' | 'DESC')`** - Set ORDER BY
- **`groupBy(...vars: string[])`** - Set GROUP BY
- **`build()`** - Build the SPARQL query string
- **`toString()`** - Alias for build()

## TypeScript Support

Full TypeScript support with type definitions included.

```typescript
import { QueryBuilder, type OrderDirection } from '@hideokamoto/sparql-query-builder'

const direction: OrderDirection = 'ASC'
const query = new QueryBuilder().select('?name').orderBy('?name', direction).build()
```

## License

MIT
