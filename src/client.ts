import type { Readable } from 'node:stream'
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

export type QueryType = 'SELECT' | 'CONSTRUCT' | 'ASK' | 'DESCRIBE'

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
   * Detect query type from SPARQL query string
   * @param query - SPARQL query string
   * @returns Query type
   */
  private detectQueryType(query: string): QueryType {
    // Remove comments and normalize whitespace
    const normalizedQuery = query
      .replace(/#[^\n]*\n/g, ' ') // Remove line comments
      .trim()
      .toUpperCase()

    // Skip PREFIX declarations to find the actual query type
    const withoutPrefixes = normalizedQuery.replace(/PREFIX\s+\w*:\s*<[^>]*>\s*/gi, '')

    if (/^\s*SELECT\b/.test(withoutPrefixes)) return 'SELECT'
    if (/^\s*CONSTRUCT\b/.test(withoutPrefixes)) return 'CONSTRUCT'
    if (/^\s*ASK\b/.test(withoutPrefixes)) return 'ASK'
    if (/^\s*DESCRIBE\b/.test(withoutPrefixes)) return 'DESCRIBE'
    return 'SELECT' // Default to SELECT
  }

  /**
   * Read stream and convert to JSON
   * @param stream - Readable stream
   * @returns Promise with parsed JSON data
   */
  private async streamToJson(stream: Readable): Promise<unknown> {
    const chunks: Buffer[] = []
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk: Buffer) => chunks.push(chunk))
      stream.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf-8')
        try {
          const data = JSON.parse(body)
          resolve(data)
        } catch (error) {
          reject(
            new Error(
              `Failed to parse JSON from stream. Body: ${body.substring(0, 200)}... Error: ${error instanceof Error ? error.message : String(error)}`,
            ),
          )
        }
      })
      stream.on('error', (error: Error) => reject(error))
    })
  }

  /**
   * Execute SPARQL query and get results
   * @returns Promise with query results
   * @throws Error if query is not set or if parsing fails
   */
  async execQuery(): Promise<SparqlResults> {
    const query = this.getQuery()
    if (!query) {
      throw new Error('Query is not set. Call setQuery() first.')
    }

    const queryType = this.detectQueryType(query)

    try {
      // Call the appropriate method based on query type
      let stream: Readable

      switch (queryType) {
        case 'SELECT':
          stream = await this.client.query.select(query)
          break
        case 'CONSTRUCT':
        case 'DESCRIBE':
          // CONSTRUCT and DESCRIBE both return RDF triples via construct()
          stream = await this.client.query.construct(query)
          break
        case 'ASK': {
          // ASK returns a boolean, handle it separately
          const askResult = await this.client.query.ask(query)
          return {
            bindings: [
              {
                result: {
                  type: 'literal',
                  value: String(askResult),
                  datatype: 'http://www.w3.org/2001/XMLSchema#boolean',
                },
              },
            ],
          }
        }
        default:
          throw new Error(`Unsupported query type: ${queryType}`)
      }

      const data = await this.streamToJson(stream)

      // Runtime validation of response structure
      if (!data || typeof data !== 'object') {
        throw new Error(`Invalid response structure: expected object, got ${typeof data}`)
      }

      const responseData = data as Record<string, unknown>

      if (!responseData.results || typeof responseData.results !== 'object') {
        throw new Error(
          `Invalid response structure: missing or invalid 'results' property in ${queryType} query response`,
        )
      }

      const results = responseData.results as Record<string, unknown>

      if (!Array.isArray(results.bindings)) {
        throw new Error(
          `Invalid response structure: 'results.bindings' is not an array in ${queryType} query response`,
        )
      }

      return { bindings: results.bindings as SparqlBinding[] }
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('Query is not set')) {
        throw error
      }
      throw new Error(
        `Failed to execute ${queryType} query: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
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
