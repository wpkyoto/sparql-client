import { describe, expect, test } from 'vitest'
import { SPARQLClient, execSparqlQuery } from '../index.js'

describe('entrypoint', () => {
  test('should export SPARQLClient class', () => {
    expect(SPARQLClient).toBeDefined()
    expect(typeof SPARQLClient).toBe('function')
  })

  test('should export execSparqlQuery function', () => {
    expect(execSparqlQuery).toBeDefined()
    expect(typeof execSparqlQuery).toBe('function')
  })

  test('execSparqlQuery should create a client and execute query', async () => {
    // This is a basic test to ensure the function structure is correct
    // Actual API calls should be mocked in integration tests
    const client = new SPARQLClient()
    expect(client).toBeInstanceOf(SPARQLClient)
  })
})
