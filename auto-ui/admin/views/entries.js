import { formatDate, formatStringToDate, select } from '../utils'
import React from 'react'

import { createResourceConnector, createOptionsConnector } from '../connectors'
import continuousPagination from '../connectors/middleware/continuousPagination'

const entryFields = '_id, title, status, date, sticky ' +
                    'summary, body ' +
                    'createdate, updatedate ' +
                    'section{_id, name}, category{_id, name}, owner{_id, username}, tags{_id}'
const entries = createResourceConnector('entries', entryFields)
.use(continuousPagination(20)) // page limit 20

const links = createResourceConnector('entryLinks', '_id, title, url, entry{_id}')

const tags = createResourceConnector('tags', '_id, name')

const sectionOptions = createOptionsConnector('sections', '_id', 'name')
const categoryOptions = createOptionsConnector('categories', '_id', 'name')
const tagsOptions = createOptionsConnector('tags', '_id', 'name')

//-------------------------------------------------------------------
var listView = {
    path: 'entries',
    title: 'Blog Entries',
    actions: {
        list: function (req) {
            return entries.read(req)
            .then(res => {
                /* counting the links requires an additional API call per row. please note that the
                number of links could be added at the database level, removing this additional call. */
                let promises = res.map(item => links.read(crudl.req().filter('entry', item._id)))
                return Promise.all(promises)
                .then(entryLinks => {
                    res.forEach((item, index) => {
                        item.isOwner = item.owner && '_id' in item.owner ? crudl.auth.user == item.owner._id : false
                        item.counterTags = item.tags.length
                        item.counterLinks = entryLinks[index].length
                    })
                    return res
                })
            })
        }
    },
    normalize: (list) => list.map(item => {
        item.date = formatStringToDate(item.date)
        return item
    })
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
    },
    {
        name: 'category',
        getValue: select('category.name'),
        label: 'Category',
        sortable: true,
    },
    {
        name: 'title',
        label: 'Title',
        main: true,
        sortable: true,
    },
    {
        name: 'status',
        label: 'Status',
        sortable: true,
    },
    {
        name: 'date',
        label: 'Date',
        sortable: true,
        sorted: 'descending',
        sortpriority: '2',
    },
    {
        name: 'sticky',
        label: 'Sticky',
        render: 'boolean',
        sortable: true,
        sorted: 'descending',
        sortpriority: '1',
    },
    {
        name: 'isOwner',
        label: 'Owner',
        render: 'boolean',
    },
    {
        name: 'counterLinks',
        label: 'No. Links',
        render: 'number',
    },
    {
        name: 'counterTags',
        label: 'No. Tags',
        render: 'number',
    },
]

listView.filters = {
    fields: [
        {
            name: 'search',
            label: 'Search',
            field: 'Search',
            helpText: 'Title',
        },
        {
            name: 'section',
            label: 'Section',
            field: 'Select',
            lazy: () => sectionOptions.read(crudl.req()),
        },
        {
            name: 'category',
            label: 'Category',
            field: 'Select',
            /* this field depends on section (so we add a watch function in
            order to react to any changes on the field section). */
            onChange: [
                {
                    in: 'section',
                    setValue: (section) => (section.value !== section.initialValue) ? '' : undefined,
                    setProps: (section) => {
                        if (!section.value) {
                            return {
                                readOnly: true,
                                helpText: 'In order to select a category, you have to select a section first'
                            }
                        }
                        // Get the catogories options filtered by section
                        return categoryOptions.read(crudl.req().filter('section', section.value))
                        .then(res => {
                            if (res.options.length > 0) {
                                return {
                                    readOnly: false,
                                    helpText: 'Select a category',
                                    ...res,
                                }
                            } else {
                                return {
                                    readOnly: true,
                                    helpText: 'No categories available for the selected section.'
                                }
                            }
                        })
                    }
                }
            ],
        },
        {
            name: 'status',
            label: 'Status',
            field: 'Select',
            options: [
                {value: 'Draft', label: 'Draft'},
                {value: 'Online', label: 'Online'}
            ],
        },
        {
            name: 'date_gt',
            label: 'Published after',
            field: 'Date',
            /* simple date validation (please note that this is just a showcase,
            we know that it does not check for real dates) */
            validate: (value, allValues) => {
                const dateReg = /^\d{4}-\d{2}-\d{2}$/
                if (value && !value.match(dateReg)) {
                    return 'Please enter a date (YYYY-MM-DD).'
                }
            }
        },
        {
            name: 'sticky',
            label: 'Sticky',
            field: 'Select',
            options: [
                {value: 'true', label: 'True'},
                {value: 'false', label: 'False'}
            ],
            helpText: 'Note: We use Select in order to distinguish false and none.',
        },
        {
            name: 'search_summary',
            label: 'Search (Summary)',
            field: 'Search',
        },
    ]
}

//-------------------------------------------------------------------
var changeView = {
    path: 'entries/:_id',
    title: 'Blog Entry',
    tabtitle: 'Main',
    actions: {
        get: function (req) { return entries(crudl.path._id).read(req) },
        delete: function (req) { return entries(crudl.path._id).delete(req) },
        save: function (req) { return entries(crudl.path._id).update(req) },
    },
    normalize: (get) => {
        get.date = formatStringToDate(get.date)
        return get
    },
    denormalize: function (data) {
        /* prevent unknown field ... with query */
        delete(data.updatedate)
        delete(data.owner)
        delete(data.createdate)
        return data
    },
    validate: function (values) {
        if ((!values.category || values.category == "") && (!values.tags || values.tags.length == 0)) {
            return { _error: 'Either `Category` or `Tags` is required.' }
        }
    }
}

changeView.fieldsets = [
    {
        fields: [
            {
                name: '_id',
                hidden: true,
            },
            {
                name: 'title',
                label: 'Title',
                field: 'Text',
                required: true,
            },
            {
                name: 'status',
                label: 'Status',
                field: 'Select',
                required: true,
                initialValue: 'Draft',
                /* set options manually */
                options: [
                    {value: 'Draft', label: 'Draft'},
                    {value: 'Online', label: 'Online'}
                ],
            },
            {
                name: 'section',
                getValue: select('section._id'),
                label: 'Section',
                field: 'Select',
                /* we set required to false, although this field is actually
                required with the API. */
                required: false,
                lazy: () => sectionOptions.read(crudl.req()).then(res => ({
                    helpText: 'Select a section',
                    ...res,
                }))
            },
            {
                name: 'category',
                getValue: select('category._id'),
                label: 'Category',
                field: 'Select',
                required: false,
                helpText: 'Select a category',
                onChange: listView.filters.fields[2].onChange,
                lazy: () => categoryOptions.read(crudl.req()),
            },
        ],
    },
    {
        title: 'Content',
        expanded: true,
        fields: [
            {
                name: 'date',
                label: 'Date',
                field: 'Date',
                required: true,
                initialValue: () => formatDate(new Date()),
                formatDate: formatDate
            },
            {
                name: 'sticky',
                label: 'Sticky',
                field: 'Checkbox',
            },
            {
                name: 'summary',
                label: 'Summary',
                field: 'Textarea',
                validate: (value, allValues) => {
                    if (!value && allValues.status == 'Online') {
                        return 'The summary is required with status "Online".'
                    }
                }
            },
            {
                name: 'body',
                label: 'Body',
                field: 'Textarea',
                validate: (value, allValues) => {
                    if (!value && allValues.status == 'Online') {
                        return 'The summary is required with status "Online".'
                    }
                }
            },
            {
                name: 'tags',
                getValue: select('tags[*]._id'),
                label: 'Tags',
                field: 'AutocompleteMultiple',
                required: false,
                showAll: false,
                helpText: 'Select a tag',
                actions: {
                    search: (req) => {
                        return tagsOptions.read(req.filter('name', req.data.query.toLowerCase()))
                        .then(({ options }) => options)
                    },
                    select: (req) => Promise.all(req.data.selection.map(
                        item => tags(item.value).read(crudl.req()).then(
                            tag => ({ value: tag._id, label: tag.name, })
                        )
                    )),
                },
            }
        ]
    },
    {
        title: 'Internal',
        expanded: false,
        fields: [
            {
                name: 'createdate',
                label: 'Date (Create)',
                field: 'Datetime',
                readOnly: true
            },
            {
                name: 'updatedate',
                label: 'Date (Update)',
                field: 'Datetime',
                readOnly: true
            }
        ]
    }
]

changeView.tabs = [
    {
        title: 'Links',
        actions: {
            list: (req) => links.read(req.filter('entry', crudl.path._id)),
            add: (req) => links.create(req),
            save: (req) => links(req.data._id).update(req),
            delete: (req) => links(req.data._id).delete(req)
        },
        getItemTitle: (data) => `${data.url} (${data.title})`,
        fields: [
            {
                name: 'url',
                label: 'URL',
                field: 'URL',
                link: true,
            },
            {
                name: 'title',
                label: 'Title',
                field: 'String',
            },
            {
                name: '_id',
                hidden: true,
            },
            {
                name: 'entry',
                getValue: select('entry._id'),
                hidden: true,
                initialValue: () => crudl.context.data._id
            },
        ],
    },
]

//-------------------------------------------------------------------
var addView = {
    path: 'entries/new',
    title: 'New Blog Entry',
    fieldsets: changeView.fieldsets,
    validate: changeView.validate,
    actions: {
        add: function (req) { return entries.create(req) },
    },
    denormalize: (data) => {
        /* set owner on add  */
        if (crudl.auth.user) data.owner = crudl.auth.user
        return data
    }
}

//-------------------------------------------------------------------
module.exports = {
    listView,
    addView,
    changeView,
}
