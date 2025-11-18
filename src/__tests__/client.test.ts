import { describe, expect, test } from 'vitest'
import { SPARQLClient } from '../client.js'

describe('SPARQLClient Class', () => {
  describe('constructor', () => {
    test('should set default SPARQL endpoint', () => {
      const client = new SPARQLClient()
      expect(client.endpoint).toBe('http://dbpedia.org/sparql')
    })

    test('should overwrite SPARQL endpoint', () => {
      const client = new SPARQLClient('https://example.com')
      expect(client.endpoint).toBe('https://example.com')
    })
  })

  describe('setQuery and getQuery', () => {
    test('should set and get query', () => {
      const client = new SPARQLClient()
      const query = 'SELECT * WHERE { ?s ?p ?o } LIMIT 10'
      client.setQuery(query)
      expect(client.getQuery()).toBe(query)
    })

    test('should return undefined when query is not set', () => {
      const client = new SPARQLClient()
      expect(client.getQuery()).toBeUndefined()
    })
  })

  describe('execQuery', () => {
    test('should throw error when query is not set', async () => {
      const client = new SPARQLClient()
      await expect(client.execQuery()).rejects.toThrow('Query is not set. Call setQuery() first.')
    })
  })

  describe('query type detection', () => {
    test('should detect SELECT queries', () => {
      const client = new SPARQLClient()
      client.setQuery('SELECT * WHERE { ?s ?p ?o }')
      // @ts-expect-error - accessing private method for testing
      expect(client.detectQueryType(client.getQuery())).toBe('SELECT')
    })

    test('should detect CONSTRUCT queries', () => {
      const client = new SPARQLClient()
      client.setQuery('CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }')
      // @ts-expect-error - accessing private method for testing
      expect(client.detectQueryType(client.getQuery())).toBe('CONSTRUCT')
    })

    test('should detect ASK queries', () => {
      const client = new SPARQLClient()
      client.setQuery('ASK { ?s ?p ?o }')
      // @ts-expect-error - accessing private method for testing
      expect(client.detectQueryType(client.getQuery())).toBe('ASK')
    })

    test('should detect DESCRIBE queries', () => {
      const client = new SPARQLClient()
      client.setQuery('DESCRIBE <http://example.org/resource>')
      // @ts-expect-error - accessing private method for testing
      expect(client.detectQueryType(client.getQuery())).toBe('DESCRIBE')
    })

    test('should handle queries with prefixes', () => {
      const client = new SPARQLClient()
      const query = `
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        SELECT ?name WHERE { ?person foaf:name ?name }
      `
      client.setQuery(query)
      // @ts-expect-error - accessing private method for testing
      expect(client.detectQueryType(client.getQuery())).toBe('SELECT')
    })

    test('should default to SELECT for unrecognized queries', () => {
      const client = new SPARQLClient()
      client.setQuery('INVALID QUERY')
      // @ts-expect-error - accessing private method for testing
      expect(client.detectQueryType(client.getQuery())).toBe('SELECT')
    })
  })
})
