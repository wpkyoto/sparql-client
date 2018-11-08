/**
 * Client class to call a SPARQL endpoint
 */
class Client {
  /**
   * @constructor
   * @param {string} endpoint 
   * @param {SparqlHttp} [SparqlHttp=require('sparql-http-client')] npm client
   * @param {fetch} [fetch=require('isomorphic-fetch')] fetch client
   */
  constructor (endpoint = 'http://dbpedia.org/sparql', SparqlHttp = require('sparql-http-client'), fetch = require('isomorphic-fetch')) {
    this.endpoint = endpoint
    SparqlHttp.fetch = fetch
    this.client = new SparqlHttp({ endpointUrl: endpoint })
  }
  /**
   * Set sparql query
   * @param {string} query SPARQL Query
   */
  setQuery (query) {
    this.query = query
  }
  /**
   * Get sparql query
   * @return {string} SPARQL query
   */
  getQuery () {
    return this.query
  }
  /**
   * Call API to get resources by SPARQL
   * @return {Promise<{object}>} fetch result
   */
  execQuery () {
    const query = this.getQuery()
    return new Promise((resolve, reject) => {
      this.client.selectQuery(query)
        .then(res => res.text())
        .then(body => {
          const { results } = JSON.parse(body)
          return resolve(results)
        }).catch(err => reject(err))
    })
  }
  /**
   * Get query result items
   * @return {Promise<{}>} fetch result body 
   */
  get () {
    return this.execQuery().then(({bindings}) => bindings)
  }
}
module.exports = Client
