const assert = require('power-assert')
// target
const packages = require('../index')

describe('entrypoint', () => {
  const keys = Object.keys(packages)
  test('should exists SPARQLClient class', () => {
    assert.notEqual(keys.indexOf('SPARQLClient'), -1)
  })
  test('should exists execSparqlQuery()', () => {
    assert.notEqual(keys.indexOf('execSparqlQuery'), -1)
  })
})