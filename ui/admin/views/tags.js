import { slugify } from '../utils'

import { createResourceConnector } from '../connectors'
import continuousPagination from '../connectors/middleware/continuousPagination'

const tagFields = '_id, name, slug'
const tags = createResourceConnector('tags', tagFields)
.use(continuousPagination(20))
const entries = createResourceConnector('entries', '_id')

//-------------------------------------------------------------------
var listView = {
    path: 'tags',
    title: 'Tags',
    actions: {
        /* counting the entries requires an additional API call per row. please note that the
        number of entries could be added at the database level, removing this additional call. */
        list: function (req) {
            return tags.read(req)
            .then(res => {
                let promises = res.map(item => entries.read(crudl.req().filter('tags', item._id)))
                return Promise.all(promises)
                .then(itemEntries => {
                    res.forEach((item, index) => {
                        item.counterEntries = itemEntries[index].length
                    })
                    return res
                })
            })
		}
    },
    // bulkActions: {
    //     delete: {
    //         description: 'Delete selected',
    //         modalConfirm: {
    //             message: "All the selected items will be deleted. This action cannot be reversed!",
    //             modalType: 'modal-delete',
    //             labelConfirm: "Delete All",
    //         },
    //         action: (selection) => {
    //             return Promise.all(selection.map(
    //                 item => tags(item._id).delete(crudl.req()))
    //             )
    //             .then(() => crudl.successMessage(`All items (${selection.length}) were deleted`))
    //         },
    //     },
    // },
}

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

listView.filters = {
    fields: [
        {
            name: 'name',
            label: 'Search',
            field: 'Search',
            helpText: 'Name',
        },
    ]
}

//-------------------------------------------------------------------
var changeView = {
    path: 'tags/:_id',
    title: 'Tag',
    actions: {
        get: function (req) { return tags(crudl.path._id).read(req) },
        delete: function (req) { return tags(crudl.path._id).delete(req) },
        save: function (req) { return tags(crudl.path._id).update(req) },
    },
}

changeView.fields = [
    {
        name: 'name',
        label: 'Name',
        field: 'String',
    },
    {
        name: 'slug',
        label: 'Slug',
        field: 'String',
        readOnly: true,
        onChange: {
            in: 'name',
            setInitialValue: (name) => slugify(name.value),
        },
        helpText: `Slug is automatically generated when saving the Tag.`,
    },
]

//-------------------------------------------------------------------
var addView = {
    path: 'tags/new',
    title: 'New Tag',
    fields: changeView.fields,
    actions: {
        add: function (req) { return tags.create(req) },
    },
}


module.exports = {
    listView,
    changeView,
    addView,
}
