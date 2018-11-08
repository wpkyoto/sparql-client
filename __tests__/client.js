const assert = require('power-assert')
// target
const Client = require('../libs/client')

describe('Client Class', () => {
  describe('constructor', () => {
    test('should set default SPARQL endpoint', () => {
      const c = new Client()
      assert.equal(c.endpoint, 'http://dbpedia.org/sparql')
    })
    test('should overwrite SPARQL endpoint', () => {
      const c = new Client('https://example.com')
      assert.equal(c.endpoint, 'https://example.com')
    })
  })
})