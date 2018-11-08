# Simple SPARQL Client

## Getting started

```
$ npm i -S simple-sparql-client
```

### As a function

#### Promise

```
execSparqlQuery('select distinct * where { ?s ?p ?o .  } LIMIT 100')
  .then(bindings => console.log(bindings))
```

#### Async / Await

```
const bindings = await execSparqlQuery('select distinct * where { ?s ?p ?o .  } LIMIT 100')
console.log(bindings)
```

### As a Class

#### Promise

```
const client = new Client(endpoint)
client.setQuery(query)
client.get()
  .then(bindings => console.log(bindings))
```
#### Async / Await

```
const client = new Client(endpoint)
client.setQuery(query)
const bindings = await client.get()
console.log(bindings)
```