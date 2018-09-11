import { proxyWrap } from './query'

function buildArgs(object) {
    let args = Object.getOwnPropertyNames(object).map(name => {
        return `${name}: ${JSON.stringify(object[name])}`
    }).join(', ')
    return args ? `(${args})` : ''
}

function buildOrderBy(req) {
    if (req.sorting && req.sorting.length > 0) {
        return {
            orderBy: req.sorting.map(field => {
                let prefix = field.sorted === 'ascending' ? '' : '-'
                return prefix + field.sortKey
            }).join(',')
        }
    }
    return {}
}


function buildQueryString(req, options, queryName) {
    if (Object.prototype.toString.call(options.fields) === '[object Array]') {
        options.fields = options.fields.join(', ')
    }

    let args = buildArgs(Object.assign({},
        options.args,
        req.page,
        req.filters,
        buildOrderBy(req),
        req.args
    ))
    return proxyWrap(`query
        ${options.name} ${args} {
            ${queryName}{ ${options.fields} }
        }
    `)
}

/**
* Use it like this:
*   const users = createGraphQLConnector().use(listQuery('users', 'id, username, email'))
*   users.read() // resolves to [ {id: '1', username: 'joe', email: 'joe@xyz.com' }, {...}, ... ]
*
* The list query does not require any parameters. So you can overload a connector with another read query:
*   users.use(query('read', '{ user (id: "%id") {id, username, email} }'))
*
* then you can do: `users.read()` to obtain a list of all users and `users(1).read()` to get the detail
* info of user with the id '1'
*/
export default function listQuery(queryName, fields, args) {
    const NamePl = queryName.charAt(0).toUpperCase() + queryName.slice(1);
    const options = { name: `all${queryName}`, fields, args }

    return function listQueryMiddleware(next) {
        return {
            read: function (req) {
                if (req.resolved) {
                    return next.read(req)
                }

                // Build the query
                //req.data = { query: buildQueryString(req, options) }
                req.data = buildQueryString(req, options, queryName)

                return next.read(req).then((res) => {
                    //TODO: this is only for the proxy
                    if (res.data.data.project){
                    res.data = res.data.data.project.devEndpoint.fetch

                    res.data = JSON.parse(res.data).data


                    if (res.data){
                        var resultArray = []
                        Object.keys(res.data).forEach(key => { resultArray.push(res.data[key])})
                        res.data = resultArray
                        return res
                    }

                    else{
                        console.log("no data returned from appstax")
                        console.log(res)
                        return res
                    }
                    }
                    else{
                        console.log("syntax error tech-concepts")
                        console.log(res)
                        return res
                    }

                })
            }
        }
    }
}
