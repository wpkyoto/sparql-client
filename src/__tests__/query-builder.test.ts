import { describe, expect, test } from 'vitest'
import { QueryBuilder } from '../index.js'

describe('QueryBuilder', () => {
  test('should build basic SELECT query', () => {
    const query = new QueryBuilder().select('?name', '?email').build()

    expect(query).toBe('SELECT ?name ?email')
  })

  test('should build SELECT with WHERE clause', () => {
    const query = new QueryBuilder().select('?name').where('?person', 'foaf:name', '?name').build()

    expect(query).toContain('SELECT ?name')
    expect(query).toContain('WHERE {')
    expect(query).toContain('?person foaf:name ?name .')
  })

  test('should build SELECT with multiple WHERE clauses', () => {
    const query = new QueryBuilder()
      .select('?name', '?email')
      .where('?person', 'foaf:name', '?name')
      .where('?person', 'foaf:mbox', '?email')
      .build()

    expect(query).toContain('?person foaf:name ?name .')
    expect(query).toContain('?person foaf:mbox ?email .')
  })

  test('should add PREFIX declarations', () => {
    const query = new QueryBuilder()
      .prefix('foaf', 'http://xmlns.com/foaf/0.1/')
      .prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
      .select('?name')
      .where('?person', 'foaf:name', '?name')
      .build()

    expect(query).toContain('PREFIX foaf: <http://xmlns.com/foaf/0.1/>')
    expect(query).toContain('PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>')
  })

  test('should add FILTER expression', () => {
    const query = new QueryBuilder()
      .select('?name', '?age')
      .where('?person', 'foaf:name', '?name')
      .where('?person', 'foaf:age', '?age')
      .filter('?age > 18')
      .build()

    expect(query).toContain('FILTER(?age > 18)')
  })

  test('should add LIMIT', () => {
    const query = new QueryBuilder().select('?s', '?p', '?o').limit(10).build()

    expect(query).toContain('LIMIT 10')
  })

  test('should add OFFSET', () => {
    const query = new QueryBuilder().select('?s', '?p', '?o').offset(20).build()

    expect(query).toContain('OFFSET 20')
  })

  test('should add ORDER BY', () => {
    const query = new QueryBuilder().select('?name').orderBy('?name', 'ASC').build()

    expect(query).toContain('ORDER BY ASC(?name)')
  })

  test('should add ORDER BY DESC', () => {
    const query = new QueryBuilder().select('?name').orderBy('?name', 'DESC').build()

    expect(query).toContain('ORDER BY DESC(?name)')
  })

  test('should add DISTINCT', () => {
    const query = new QueryBuilder().distinct().select('?name').build()

    expect(query).toContain('SELECT DISTINCT ?name')
  })

  test('should add OPTIONAL block', () => {
    const query = new QueryBuilder()
      .select('?name', '?email')
      .where('?person', 'foaf:name', '?name')
      .optional((qb) => {
        qb.where('?person', 'foaf:mbox', '?email')
      })
      .build()

    expect(query).toContain('OPTIONAL { ?person foaf:mbox ?email . }')
  })

  test('should add GROUP BY', () => {
    const query = new QueryBuilder()
      .select('?category')
      .count('?item', '?count')
      .where('?item', 'rdf:type', '?category')
      .groupBy('?category')
      .build()

    expect(query).toContain('GROUP BY ?category')
  })

  test('should handle variables without ? prefix', () => {
    const query = new QueryBuilder()
      .select('name', 'email')
      .where('person', 'foaf:name', 'name')
      .build()

    expect(query).toContain('SELECT ?name ?email')
    expect(query).toContain('person foaf:name name')
  })

  test('should build complete complex query', () => {
    const query = new QueryBuilder()
      .prefix('foaf', 'http://xmlns.com/foaf/0.1/')
      .prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
      .distinct()
      .select('?name', '?email')
      .where('?person', 'rdf:type', 'foaf:Person')
      .where('?person', 'foaf:name', '?name')
      .optional((qb) => {
        qb.where('?person', 'foaf:mbox', '?email')
      })
      .filter('regex(?name, "John", "i")')
      .orderBy('?name', 'ASC')
      .limit(10)
      .offset(5)
      .build()

    expect(query).toContain('PREFIX foaf:')
    expect(query).toContain('PREFIX rdf:')
    expect(query).toContain('SELECT DISTINCT ?name ?email')
    expect(query).toContain('WHERE {')
    expect(query).toContain('?person rdf:type foaf:Person .')
    expect(query).toContain('OPTIONAL')
    expect(query).toContain('FILTER(regex(?name, "John", "i"))')
    expect(query).toContain('ORDER BY ASC(?name)')
    expect(query).toContain('LIMIT 10')
    expect(query).toContain('OFFSET 5')
  })

  test('toString() should be alias for build()', () => {
    const qb = new QueryBuilder().select('?name').where('?person', 'foaf:name', '?name')

    expect(qb.toString()).toBe(qb.build())
  })
})
