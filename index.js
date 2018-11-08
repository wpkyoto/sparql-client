const Client = require('./libs/client')

/**
 * Fetch API as simple function
 * @param {string} query SPARQL query
 * @param {string} endpoint endpoint
 */
const execSparqlQuery = (query, endpoint = 'http://dbpedia.org/sparql') => {
  const client = new Client(endpoint)
  client.setQuery(query)
  return client.get()
}

module.exports = {
  execSparqlQuery,
  SPARQLClient: Client
}
