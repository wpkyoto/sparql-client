export type OrderDirection = 'ASC' | 'DESC'

export interface Triple {
  subject: string
  predicate: string
  object: string
}

export interface Prefix {
  prefix: string
  iri: string
}

/**
 * Type-safe SPARQL query builder
 */
export class QueryBuilder {
  private prefixes: Prefix[] = []
  private selectVars: string[] = []
  private wherePatterns: string[] = []
  private filterExpressions: string[] = []
  private optionalPatterns: string[][] = []
  private limitValue?: number
  private offsetValue?: number
  private orderByClause?: { variable: string; direction: OrderDirection }
  private groupByVars: string[] = []
  private isDistinct = false

  /**
   * Add PREFIX declaration
   * @param prefix - Prefix name (e.g., 'foaf', 'rdf')
   * @param iri - IRI for the prefix
   */
  prefix(prefix: string, iri: string): this {
    this.prefixes.push({ prefix, iri })
    return this
  }

  /**
   * Add SELECT variables
   * @param vars - Variable names (with or without '?')
   */
  select(...vars: string[]): this {
    this.selectVars.push(...vars.map((v) => (v.startsWith('?') ? v : `?${v}`)))
    return this
  }

  /**
   * Set DISTINCT modifier
   */
  distinct(): this {
    this.isDistinct = true
    return this
  }

  /**
   * Add COUNT aggregation
   * @param variable - Variable to count
   * @param alias - Alias for the count result
   */
  count(variable: string, alias?: string): this {
    const varName = variable.startsWith('?') ? variable : `?${variable}`
    const aliasName = alias ? (alias.startsWith('?') ? alias : `?${alias}`) : '?count'
    this.selectVars.push(`(COUNT(${varName}) AS ${aliasName})`)
    return this
  }

  /**
   * Add WHERE clause triple pattern
   * @param subject - Subject (e.g., '?person', '<http://example.org/person1>')
   * @param predicate - Predicate (e.g., 'foaf:name', 'rdf:type')
   * @param object - Object (e.g., '?name', '"John"')
   */
  where(subject: string, predicate: string, object: string): this {
    this.wherePatterns.push(`${subject} ${predicate} ${object} .`)
    return this
  }

  /**
   * Add FILTER expression
   * @param expression - Filter expression (e.g., '?age > 18', 'regex(?name, "John")')
   */
  filter(expression: string): this {
    this.filterExpressions.push(expression)
    return this
  }

  /**
   * Add OPTIONAL block
   * @param builder - Callback function to build optional patterns
   */
  optional(builder: (qb: QueryBuilder) => void): this {
    const optionalQb = new QueryBuilder()
    builder(optionalQb)
    this.optionalPatterns.push(optionalQb.wherePatterns)
    return this
  }

  /**
   * Set LIMIT
   * @param n - Limit value
   */
  limit(n: number): this {
    this.limitValue = n
    return this
  }

  /**
   * Set OFFSET
   * @param n - Offset value
   */
  offset(n: number): this {
    this.offsetValue = n
    return this
  }

  /**
   * Set ORDER BY
   * @param variable - Variable to order by (with or without '?')
   * @param direction - Sort direction (ASC or DESC)
   */
  orderBy(variable: string, direction: OrderDirection = 'ASC'): this {
    const varName = variable.startsWith('?') ? variable : `?${variable}`
    this.orderByClause = { variable: varName, direction }
    return this
  }

  /**
   * Set GROUP BY
   * @param vars - Variables to group by
   */
  groupBy(...vars: string[]): this {
    this.groupByVars.push(...vars.map((v) => (v.startsWith('?') ? v : `?${v}`)))
    return this
  }

  /**
   * Build the SPARQL query string
   * @returns Complete SPARQL query
   */
  build(): string {
    const parts: string[] = []

    // PREFIX
    for (const { prefix, iri } of this.prefixes) {
      parts.push(`PREFIX ${prefix}: <${iri}>`)
    }

    // SELECT
    const distinctKeyword = this.isDistinct ? 'DISTINCT ' : ''
    const selectPart =
      this.selectVars.length > 0
        ? `SELECT ${distinctKeyword}${this.selectVars.join(' ')}`
        : 'SELECT *'
    parts.push(selectPart)

    // WHERE
    const whereClauses: string[] = []
    whereClauses.push(...this.wherePatterns)

    // FILTER
    for (const filter of this.filterExpressions) {
      whereClauses.push(`FILTER(${filter})`)
    }

    // OPTIONAL
    for (const optionalBlock of this.optionalPatterns) {
      whereClauses.push(`OPTIONAL { ${optionalBlock.join(' ')} }`)
    }

    if (whereClauses.length > 0) {
      parts.push('WHERE {')
      parts.push(`  ${whereClauses.join('\n  ')}`)
      parts.push('}')
    }

    // GROUP BY
    if (this.groupByVars.length > 0) {
      parts.push(`GROUP BY ${this.groupByVars.join(' ')}`)
    }

    // ORDER BY
    if (this.orderByClause) {
      parts.push(`ORDER BY ${this.orderByClause.direction}(${this.orderByClause.variable})`)
    }

    // LIMIT
    if (this.limitValue !== undefined) {
      parts.push(`LIMIT ${this.limitValue}`)
    }

    // OFFSET
    if (this.offsetValue !== undefined) {
      parts.push(`OFFSET ${this.offsetValue}`)
    }

    return parts.join('\n')
  }

  /**
   * Alias for build()
   */
  toString(): string {
    return this.build()
  }
}

export default QueryBuilder
