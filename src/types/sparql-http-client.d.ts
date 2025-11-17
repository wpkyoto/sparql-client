declare module 'sparql-http-client' {
  interface SparqlClientOptions {
    endpointUrl: string
    updateUrl?: string
    user?: string
    password?: string
    headers?: Record<string, string>
  }

  interface QueryResponse {
    text(): Promise<string>
    json(): Promise<unknown>
  }

  interface QueryClient {
    select(query: string): Promise<QueryResponse>
    construct(query: string): Promise<QueryResponse>
    ask(query: string): Promise<QueryResponse>
    describe(query: string): Promise<QueryResponse>
  }

  class SparqlClient {
    constructor(options: SparqlClientOptions)
    query: QueryClient
  }

  export default SparqlClient
}
