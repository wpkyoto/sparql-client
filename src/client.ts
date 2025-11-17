import SparqlClient from 'sparql-http-client'

export interface SparqlBinding {
  [key: string]: {
    type: string
    value: string
    'xml:lang'?: string
    datatype?: string
  }
}

export interface SparqlResults {
  bindings: SparqlBinding[]
}

/**
 * Client class to call a SPARQL endpoint
 */
export class SPARQLClient {
  public readonly endpoint: string
  private client: SparqlClient
  private query?: string

  /**
   * @param endpoint - SPARQL endpoint URL
   */
  constructor(endpoint = 'http://dbpedia.org/sparql') {
    this.endpoint = endpoint
    this.client = new SparqlClient({ endpointUrl: endpoint })
  }

  /**
   * Set SPARQL query
   * @param query - SPARQL Query string
   */
  setQuery(query: string): void {
    this.query = query
  }

  /**
   * Get SPARQL query
   * @returns Current SPARQL query string
   */
  getQuery(): string | undefined {
    return this.query
  }

  /**
   * Execute SPARQL query and get results
   * @returns Promise with query results
   * @throws Error if query is not set
   */
  async execQuery(): Promise<SparqlResults> {
    const query = this.getQuery()
    if (!query) {
      throw new Error('Query is not set. Call setQuery() first.')
    }

    const res = await this.client.query.select(query)
    const body = await res.text()
    const data = JSON.parse(body)
    return data.results as SparqlResults
  }

  /**
   * Get query result bindings
   * @returns Promise with bindings array
   */
  async get(): Promise<SparqlBinding[]> {
    const results = await this.execQuery()
    return results.bindings
  }
}
