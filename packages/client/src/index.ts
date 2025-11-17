import { type QueryType, SPARQLClient, type SparqlBinding, type SparqlResults } from './client.js'

// Re-export QueryBuilder from query-builder package
export { QueryBuilder, type OrderDirection } from '@hideokamoto/sparql-query-builder'

/**
 * Execute SPARQL query as a simple function
 * @param query - SPARQL query string or QueryBuilder instance
 * @param endpoint - SPARQL endpoint URL (default: DBpedia)
 * @returns Promise with query result bindings
 */
export const execSparqlQuery = async (
  query: string,
  endpoint = 'http://dbpedia.org/sparql',
): Promise<SparqlBinding[]> => {
  const client = new SPARQLClient(endpoint)
  client.setQuery(query)
  return client.get()
}

export { SPARQLClient, type QueryType, type SparqlBinding, type SparqlResults }
