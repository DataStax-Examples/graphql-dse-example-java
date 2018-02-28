
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


function buildQueryString(req, options) {
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
    return `query 
        ${options.name} ${args} {
            allGuests { ${options.fields} }}
        
    `
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
export default function listQuery(namePl, fields, args) {
    const NamePl = namePl.charAt(0).toUpperCase() + namePl.slice(1);
    const options = { name: `all${NamePl}`, fields, args }

    return function listQueryMiddleware(next) {
        return {
            read: function (req) {
                if (req.resolved) {
                    return next.read(req)
                }

                // Build the query
                req.data = { query: buildQueryString(req, options) }

                return next.read(req).then((res) => {
                    res.data = res.data.data.allGuests
                    return res
                })
            }
        }
    }
}
