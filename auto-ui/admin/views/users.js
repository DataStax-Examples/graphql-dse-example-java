import React from 'react'
import SplitDateTimeField from '../fields/SplitDateTimeField'

import { createResourceConnector } from '../connectors'

const userFields = '_id, username, first_name, last_name, email, is_active, is_staff, date_joined'
const users = createResourceConnector('users', userFields)

//-------------------------------------------------------------------
var listView = {
    path: 'users',
    title: 'Users',
    actions: {
        list: function (req) {
            return users.read(req)
        },
    },
    normalize: (list) => list.map(item => {
        if (!item.last_name) {
            item.full_name = item.first_name
        } else if (!item.first_name) {
            item.full_name = <span><b>{item.last_name}</b></span>
        } else {
            item.full_name = <span><b>{item.last_name}</b>, {item.first_name}</span>
        }
        return item
    })
}

listView.fields = [
    {
        name: '_id',
        label: 'ID',
    },
    {
        name: 'username',
        label: 'Username',
        sortable: false,
        sorted: 'ascending',
        main: true,
    },
    {
        name: 'full_name',
        label: 'Full name',
    },
    {
        name: 'email',
        label: 'Email address',
    },
    {
        name: 'is_active',
        label: 'Active',
        render: 'boolean',
    },
    {
        name: 'is_staff',
        label: 'Staff member',
        render: 'boolean',
    },
]

//-------------------------------------------------------------------
var changeView = {
    path: 'users/:_id',
    title: 'User',
    actions: {
        get: function (req) { return users(crudl.path._id).read(req) },
        save: function (req) { return users(crudl.path._id).update(req) },
    },
    normalize: (get) => {
        let date = new Date(get.date_joined)
        get.date_joined = date.toJSON()
        return get
    },
    denormalize: (data) => {
        /* prevent unknown field ... with query */
        delete(data.date_joined)
        delete(data.password_confirm)
        return data
    }
}

changeView.fieldsets = [
    {
        fields: [
            {
                name: 'username',
                label: 'Username',
                field: 'String',
            },
        ],
    },
    {
        fields: [
            {
                name: 'first_name',
                label: 'Name',
                field: 'String',
            },
            {
                name: 'last_name',
                label: 'Last Name',
                field: 'String',
            },
            {
                name: 'email',
                label: 'Email address',
                field: 'String',
                readOnly: () => crudl.auth.user !== crudl.path._id,
            }
        ],
    },
    {
        title: 'Roles',
        expanded: true,
        description: () => {
            if (crudl.auth.user == crudl.path._id) {
                return <span style={{color: '#CC293C'}}>WARNING: If you remove crudl access for the currently logged-in user, you will be logged out and unable to login with this user again.</span>
            }
        },
        fields: [
            {
                name: 'is_active',
                label: 'Active',
                field: 'Checkbox',
                initialValue: true,
                helpText: 'Designates whether this user should be treated as active. Unselect this instead of deleting accounts.',
            },
            {
                name: 'is_staff',
                label: 'Staff member',
                field: 'Checkbox',
                helpText: 'Designates whether the user can log into crudl.',
            },
        ],
    },
    {
        title: 'More...',
        expanded: false,
        description: 'This is an example of a custom field (see admin/fields/SplitDateTimeField.jsx).',
        fields: [
            {
                name: 'date_joined',
                label: 'Date joined',
                readOnly: true,
                field: SplitDateTimeField,
                getTime: (date) => {
                    let T = date.indexOf('T')
                    return date.slice(T+1, T+6)
                },
                getDate: (date) => {
                    let T = date.indexOf('T')
                    return date.slice(0, T)
                },
            },
        ],
    },
    {
        title: 'Password',
        expanded: false,
        // Hide this fieldset if the logged-in user is not the owner
        hidden: () => crudl.auth.user !== crudl.path._id,
        description: "Raw passwords are not stored, so there is no way to see this user's password, but you can set a new password.",
        fields: [
            {
                name: 'password',
                label: 'Password',
                field: 'Password',
            },
            {
                name: 'password_confirm',
                label: 'Password (Confirm)',
                field: 'Password',
                validate: (value, allValues) => {
                    if (value != allValues.password) {
                        return 'The passwords do not match.'
                    }
                }
            },
        ]
    }
]

//-------------------------------------------------------------------
var addView = {
    path: 'users/new',
    title: 'New User',
    denormalize: changeView.denormalize,
    actions: {
        add: function (req) { return users.create(req) },
    },
}

addView.fieldsets = [
    {
        fields: [
            {
                name: 'username',
                label: 'Username',
                field: 'String',
            },
        ],
    },
    {
        fields: [
            {
                name: 'first_name',
                label: 'Name',
                field: 'String',
            },
            {
                name: 'last_name',
                label: 'Last Name',
                field: 'String',
            },
            {
                name: 'email',
                label: 'Email address',
                field: 'String',
            }
        ],
    },
    {
        title: 'Roles',
        expanded: true,
        fields: [
            {
                name: 'is_active',
                label: 'Active',
                field: 'Checkbox',
                initialValue: true,
                helpText: 'Designates whether this user should be treated as active. Unselect this instead of deleting accounts.',
            },
            {
                name: 'is_staff',
                label: 'Staff member',
                field: 'Checkbox',
                helpText: 'Designates whether the user can log into crudl.',
            },
        ],
    },
    {
        title: 'Password',
        expanded: true,
        fields: [
            {
                name: 'password',
                label: 'Password',
                field: 'Password',
            },
            {
                name: 'password_confirm',
                label: 'Password (Confirm)',
                field: 'Password',
                validate: (value, allValues) => {
                    if (value != allValues.password) {
                        return 'The passwords do not match.'
                    }
                }
            },
        ]
    }
]


module.exports = {
    listView,
    changeView,
    addView,
}
