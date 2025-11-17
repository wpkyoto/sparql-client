import { SPARQLClient, type SparqlBinding, type SparqlResults } from './client.js'

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

export { SPARQLClient, type SparqlBinding, type SparqlResults }
