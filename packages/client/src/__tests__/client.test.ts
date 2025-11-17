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
})
