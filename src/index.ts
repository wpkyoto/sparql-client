// Re-export QueryBuilder
export { QueryBuilder, type OrderDirection, type Prefix, type Triple } from './query-builder.js'

// Re-export Client
export {
  SPARQLClient,
  type QueryType,
  type SparqlBinding,
  type SparqlResults,
} from './client.js'

// Import for local use
import { SPARQLClient, type SparqlBinding } from './client.js'

/**
 * Execute SPARQL query as a simple function
 * @param query - SPARQL query string
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
