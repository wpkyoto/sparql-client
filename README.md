# Simple SPARQL Client
[![Build Status](https://travis-ci.org/hideokamoto/sparql-client.svg?branch=master)](https://travis-ci.org/hideokamoto/sparql-client)
[![npm version](https://badge.fury.io/js/simple-sparql-client.svg)](https://badge.fury.io/js/simple-sparql-client)

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

## Contributing

```
$ git clone https://github.com/hideokamoto/sparql-client.git
$ cd sparql-client
$ npm i
```

### Before PR

Please pass following check before make your Pull Request.

```
$ npm run lint
$ npm test
```