import type { Readable } from 'node:stream'
import type { Quad, Term } from '@rdfjs/types'
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
 * Convert RDF/JS Term to SPARQL binding value format
 * @param term - RDF/JS Term object
 * @returns SPARQL binding value
 */
function termToBinding(term: Term): SparqlBinding[string] {
  const binding: SparqlBinding[string] = {
    type: term.termType.toLowerCase(),
    value: term.value,
  }

  // Add language tag for literals
  if ('language' in term && term.language) {
    binding['xml:lang'] = term.language
  }

  // Add datatype for typed literals
  if ('datatype' in term && term.datatype) {
    binding.datatype = term.datatype.value
  }

  return binding
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
   * Consume SELECT query stream and convert to bindings
   * @param stream - Readable stream of ResultRow objects
   * @returns Promise with bindings array
   */
  private async streamToBindings(stream: Readable): Promise<SparqlBinding[]> {
    const bindings: SparqlBinding[] = []
    return new Promise((resolve, reject) => {
      stream.on('data', (row: Record<string, Term>) => {
        const binding: SparqlBinding = {}
        for (const [variable, term] of Object.entries(row)) {
          binding[variable] = termToBinding(term)
        }
        bindings.push(binding)
      })
      stream.on('end', () => resolve(bindings))
      stream.on('error', (error: Error) => reject(error))
    })
  }

  /**
   * Consume CONSTRUCT/DESCRIBE query stream and convert to bindings
   * @param stream - Readable stream of RDF/JS Quads
   * @returns Promise with bindings representing triples
   */
  private async streamToTriples(stream: Readable): Promise<SparqlBinding[]> {
    const bindings: SparqlBinding[] = []
    return new Promise((resolve, reject) => {
      stream.on('data', (quad: Quad) => {
        // Convert quad to binding format with subject, predicate, object
        const binding: SparqlBinding = {
          subject: termToBinding(quad.subject),
          predicate: termToBinding(quad.predicate),
          object: termToBinding(quad.object),
        }
        // Add graph if present
        if (quad.graph.termType !== 'DefaultGraph') {
          binding.graph = termToBinding(quad.graph)
        }
        bindings.push(binding)
      })
      stream.on('end', () => resolve(bindings))
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
      switch (queryType) {
        case 'SELECT': {
          // SELECT returns a stream of ResultRow objects (Record<string, Term>)
          const stream = await this.client.query.select(query)
          const bindings = await this.streamToBindings(stream)
          return { bindings }
        }
        case 'CONSTRUCT':
        case 'DESCRIBE': {
          // CONSTRUCT and DESCRIBE return RDF/JS quad streams
          const stream = await this.client.query.construct(query)
          const bindings = await this.streamToTriples(stream)
          return { bindings }
        }
        case 'ASK': {
          // ASK returns a Promise<boolean>
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
