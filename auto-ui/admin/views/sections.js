import { slugify } from '../utils'
import React from 'react'

import { createResourceConnector } from '../connectors'

const sectionFields = '_id, name, slug, position'
const sections = createResourceConnector('sections', sectionFields)
const entries = createResourceConnector('entries', '_id')

//-------------------------------------------------------------------
var listView = {
    path: 'sections',
    title: 'Sections',
    actions: {
        /* counting the entries requires an additional API call per row. please note that the
        number of entries could be added at the database level, removing this additional call. */
        list: function (req) {
            return sections.read(req)
            .then(res => {
                let promises = res.map(item => entries.read(crudl.req().filter('section', item._id)))
                return Promise.all(promises)
                .then(itemEntries => {
                    res.forEach((item, index) => {
                        item.counterEntries = itemEntries[index].length
                    })
                    return res
                })
            })
		}
    }
}

// listView.bulkActions = {
//     delete: {
//         description: 'Delete selected',
//         modalConfirm: {
//             message: "All the selected items will be deleted. This action cannot be reversed!",
//             modalType: 'modal-delete',
//             labelConfirm: "Delete All",
//         },
//         action: (selection) => {
//             return Promise.all(selection.map(
//                 item => sections(item._id).delete(crudl.req()))
//             )
//             .then(() => crudl.successMessage(`All items (${selection.length}) were deleted`))
//         },
//     }
// }

listView.fields = [
    {
        name: '_id',
        label: 'ID',
    },
    {
        name: 'name',
        label: 'Name',
        main: true,
        sortable: true,
        sorted: 'ascending',
        sortpriority: '1',
        sortKey: 'slug',
    },
    {
        name: 'slug',
        label: 'Slug',
        sortable: true,
    },
    {
        name: 'counterEntries',
        label: 'No. Entries',
    },
]

//-------------------------------------------------------------------
var changeView = {
    path: 'sections/:_id',
    title: 'Section',
    actions: {
        get: function (req) { return sections(crudl.path._id).read(req) },
        delete: function (req) { return sections(crudl.path._id).delete(req) },
        save: function (req) { return sections(crudl.path._id).update(req) },
    },
}

changeView.fields = [
    {
        name: 'name',
        label: 'Name',
        field: 'String',
        required: true
    },
    {
        name: 'slug',
        label: 'Slug',
        field: 'String',
        onChange: {
            in: 'name',
            setInitialValue: (name) => slugify(name.value),
        },
        helpText: <span>If left blank, the slug will be automatically generated.
            More about slugs <a href="http://en.wikipedia.org/wiki/Slug" target="_blank">here</a>.</span>,
    }
]

//-------------------------------------------------------------------
var addView = {
    path: 'sections/new',
    title: 'New Section',
    fields: changeView.fields,
    actions: {
        add: function (req) { return sections.create(req) },
    },
}


module.exports = {
    listView,
    changeView,
    addView,
}
