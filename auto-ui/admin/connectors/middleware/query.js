import { canResolveQuery, resolveQuery } from '../utils'
import uuid from 'uuid'
import get from 'lodash/get'

/**
* Register a graphQL query for a crud method. If the query can be resolved
* it will be resolved and any subsequent registered query will just pass the
* request (and the response) further.
*
* Suppose q0 requires zero parameters and q1 requires one parameter. You can then
* create a connector like this:
*   const c = createGraphQLConnector().use(query('read', q0)).use(query('read', q1))
*   c.read()                // q0 will be executed
*   c('someParam').read()   // q1 will be executed
*
* Note that the order of the registered queries matter. Queries with fewer required
* parameters should be registered before queries with more required parameters.
*/
export default function query(methodName, queryString, pathData, pathError) {
    if (!methodName || !queryString || !pathData) {
        throw new Error('query: methodName, queryString and pathData are required!')
    }
    return function queryMiddleware(next) {
        return {
            [methodName]: function (req) {
                if (!req.resolved && canResolveQuery(queryString, req)) {
                    return next[methodName](Object.assign(req, {
                        resolved: true,
                        data: {
                            query: resolveQuery(queryString, req),
                            variables: {
                                //input: Object.assign({ clientMutationId: uuid.v4() }, req.data),
                                input: Object.assign(req.data),
                            },
                        }
                    }))
                    .then((res) => {
                        if (pathError) {
                            const errors = get(res.data.data, pathError)
                            if (errors) {
                                throw errors
                            }
                        }
                        res.data = get(res.data.data, pathData)
                        return res
                    })
                }
                return next[methodName](req)
            }
        }
    }
}
