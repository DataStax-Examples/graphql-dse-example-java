import { slugify, select } from '../utils'
import React from 'react'

import { createResourceConnector, createOptionsConnector } from '../connectors'

const categoryFields = '_id, name, slug, section { _id, name }'
const categories = createResourceConnector('categories', categoryFields)
const entries = createResourceConnector('entries', '_id')
const sectionOptions = createOptionsConnector('sections', '_id', 'name')

//-------------------------------------------------------------------
var listView = {
    path: 'categories',
    title: 'Categories',
    actions: {
        /* counting the entries requires an additional API call per row. please note that the
        number of entries could be added at the database level, removing this additional call. */
        list: function (req) {
            return categories.read(req)
            .then(res => {
                let promises = res.map(item => entries.read(crudl.req().filter('category', item._id)))
                return Promise.all(promises)
                .then(itemEntries => {
                    return res.map((item, index) => {
                        item.counterEntries = itemEntries[index].length
                        return item
                    })
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
    //         action: selection => Promise.all(selection.map(
    //             item => categories(item._id).delete(crudl.req()).then(
    //                 () => crudl.successMessage(`Deleted ${selection.length} items.`)
    //             )
    //         ))
    //     },
    //     changeSection: {
    //         description: 'Change Section',
    //         before: (selection) => ({ onProceed, onCancel }) => (
    //             <div>
    //                 {crudl.createForm({
    //                     id: 'select-section',
    //                     title: 'Select Section',
    //                     fields: [{
    //                         name: 'section',
    //                         label: 'Section',
    //                         field: 'Select',
    //                         lazy: () => sectionOptions.read(crudl.req()),
    //                     }],
    //                     onSubmit: values => onProceed(
    //                         selection.map(s => Object.assign({}, s, { section: values.section }))
    //                     ),
    //                     onCancel,
    //                 })}
    //             </div>
    //         ),
    //         action: (selection) => {
    //             return Promise.all(selection.map(
    //                 item => categories(item._id).update(crudl.req({ section: item.section })))
    //             ).then(() => crudl.successMessage('Successfully changed the sections'))
    //         },
    //     },
    // }
}

listView.fields = [
    {
        name: '_id',
        label: 'ID',
    },
    {
        name: 'section',
        getValue: select('section.name'),
        label: 'Section',
        sortable: true,
        sorted: 'ascending',
        sortpriority: '1',
    },
    {
        name: 'name',
        label: 'Name',
        main: true,
        sortable: true,
        sorted: 'ascending',
        sortpriority: '2',
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
        {
            name: 'section',
            label: 'Section',
            field: 'Select',
            lazy: () => sectionOptions.read(crudl.req()),
            initialValue: '',
        },
    ]
}

//-------------------------------------------------------------------
var changeView = {
    path: 'categories/:_id',
    title: 'Category',
    actions: {
        get: function (req) { return categories(crudl.path._id).read(req) },
        delete: function (req) { return categories(crudl.path._id).delete(req) },
        save: function (req) { return categories(crudl.path._id).update(req) },
    },
}

changeView.fields = [
    {
        name: 'section',
        getValue: select('section._id'),
        label: 'Section',
        field: 'Select',
        required: true,
        lazy: () => sectionOptions.read(crudl.req()),
    },
    {
        name: 'name',
        label: 'Name',
        field: 'String',
        required: true,
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
    },
]

//-------------------------------------------------------------------
var addView = {
    path: 'categories/new',
    title: 'New Category',
    fields: changeView.fields,
    actions: {
        add: function (req) { return categories.create(req) },
    },
}


module.exports = {
    listView,
    changeView,
    addView,
}
