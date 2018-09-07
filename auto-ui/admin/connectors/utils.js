import { consumeParams } from '@crudlio/crudl-connectors-base'


/**
 * Get all parameter names contained in the query.
 * A parameter is a string prefixed with '%', for example:
 *  {
 *    user (id: "%id")
 *    { id, username, first_name, last_name }
 *  }
 * @return an array of the query's parameter names.
 */
export function getParamNames(query) {
    const re = /%(\w+)/g
    let m = re.exec(query)
    const names = []
    while (m) {
        if (names.indexOf(m[1]) < 0) {
            names.push(m[1])
        }
        m = re.exec(query)
    }
    return names
}

/**
 * Resolves the given query against the request's parameters.
 */
export function resolveQuery(query, req) {
    const paramNames = getParamNames(query)
    const params = consumeParams(req, paramNames.length)
    let resolved = query

    // Replace each parameter
    paramNames.forEach((name, index) => {
        const value = params[index]
        if (typeof value === 'undefined') {
            throw new Error(`Missing parameter ${name}`)
        }
        resolved = query.replace(new RegExp(`%${name}`, 'g'), `${value}`)
    })

    return resolved
}

export function canResolveQuery(query, req) {
    const paramNames = getParamNames(query)
    return paramNames.length <= req.params.length
}
