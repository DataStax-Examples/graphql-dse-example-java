import toPath from 'lodash/toPath'
import get from 'lodash/get'

//-------------------------------------------------------------------
export function continuousPagination(res) {
    let key = Object.keys(res.data.data)[0]
    let hasNext = res.data.data[key].pageInfo.hasNextPage
    let next = hasNext && {
        after: res.data.data[key].pageInfo.endCursor
    }
    return {
        type: 'continuous',
        next,
        resultsTotal: res.data.data[key].totalCount,
        filteredTotal: res.data.data[key].filteredCount
    }
}

//-------------------------------------------------------------------
function objectToArgs(object) {
    let args = Object.getOwnPropertyNames(object).map(name => {
        return `${name}: ${JSON.stringify(object[name])}`
    }).join(', ')
    return args ? `(${args})` : ''
}

function sorting(req) {
    if (req.sorting && req.sorting.length > 0) {
        return {
            orderBy: req.sorting.map(field => {
                let prefix = field.sorted == 'ascending' ? '' : '-'
                return prefix + field.sortKey
            }).join(',')
        }
    }
    return {}
}

export function listQuery(options) {
    if (Object.prototype.toString.call(options.fields) === '[object Array]') {
        options.fields = options.fields.join(', ')
    }
    return (req) => {
        let args = objectToArgs(Object.assign({},
            options.args,
            req.page,
            req.filters,
            sorting(req)
        ))
        return `{
            ${options.name} ${args} {
                totalCount, filteredCount,
                pageInfo { hasNextPage, hasPreviousPage, startCursor, endCursor }
                edges { node { ${options.fields} }}
            }
        }`
    }
}

//-------------------------------------------------------------------
export function join(p1, p2, var1, var2, defaultValue={}) {
    return Promise.all([p1, p2])
    .then(responses => {
        return responses[0].set('data', responses[0].data.map(item => {
            item[var1] = responses[1].data.find(obj => obj[var2] == item[var1])
            if (!item[var1]) {
                item[var1] = defaultValue
            }
            return item
        }))
    })
}

// Credits for this function go to https://gist.github.com/mathewbyrne
export function slugify(text) {
    if (typeof text !== 'undefined') {
        return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
    }
    return undefined
}

export function formatDate(date) {
    return date.toJSON().slice(0, 10)
}

export function formatStringToDate(dateStr) {
    let date = new Date(dateStr)
    return date.toJSON().slice(0, 10)
}

/* transform mongoose error to redux-form (object) error
mongoose:
[
    "__all__": "message",
    "key": "message"
]
redux-form:
[
    "_error": "message",
    "key": "message"
]
*/
export function transformErrors(errors) {
    const errorsObj = {}
    if (errors !== null && Array === errors.constructor) {
        for (let i = 0; i < errors.length - 1; i = i + 2) {
            const name = errors[i] === '__all__' ? '_error' : errors[i]
            errorsObj[name] = errors[i + 1]
        }
        return errorsObj
    }
    return errors
}

/**
* Works like lodash.get() with an extra feature: '[*]' selects
* the complete array. For example:
*
*      let object = { name: 'Abc', tags: [ {id: 1, name: 'javascript'}, {id: 2, name: 'select'} ]}
*      let names = select(object, 'tags[*].name')
*      console.log(names)
*      > ['javascript', 'select']
*
*/
export function select(pathSpec, defaultValue) {
    const _select = (data, pathSpec, defaultValue) => {
        if (!data || !pathSpec) {
            return defaultValue
        }
        const path = toPath(pathSpec)
        const pos = path.indexOf('*')
        if (pos >= 0) {
            // Break the path at '*' and do select() recursively on
            // every element of the first path part
            return get(data, path.slice(0, pos)).map(
                item => _select(item, path.slice(pos + 1), defaultValue)
            )
        }
        return get(data, path, defaultValue)
    }
    return (data) => _select(data, pathSpec, defaultValue)
}
