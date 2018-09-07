import React from 'react'
import SplitDateTimeField from '../fields/SplitDateTimeField'

import { createResourceConnector } from '../connectors'

const userFields = 'email, firstName, lastName, rsvp, tableName, address, phone'
const guests = createResourceConnector('guests', userFields)

//-------------------------------------------------------------------
var listView = {
    path: 'guests',
    title: 'Guests',
    actions: {
        list: function (req) {
            return guests.read(req)
        },
    },
    normalize: (list) => list.map(item => {
        return item
    })
}

listView.fields = [
    {
        name: 'email',
        label: 'Email Address',
        main: true,
    },
    {
        name: 'firstName',
        label: 'First Name',
    },
    {
        name: 'lastName',
        label: 'Last Name',
    },
    {
        name: 'phone',
        label: 'phone',
    },
    {
        name: 'address',
        label: 'Address',
    },
    {
        name: 'tableName',
        label: 'Table',
    },
    {
        name: 'rsvp',
        label: 'RSVP',
        render: 'boolean'
    }
]

//-------------------------------------------------------------------
var changeView = {
    path: 'guests/:email',
    title: 'User',
    actions: {
        get: function (req) { return guests(crudl.path.email).read(req) },
        save: function (req) { return guests(crudl.path.email).update(req) },
	delete: function (req) { return guests(crudl.path.email).delete(req) },
    },
    normalize: (get) => {
        return get
    },
    denormalize: (data) => {
        return data
    }
}

changeView.fieldsets = [
    {
        fields: [
            {
                name: 'email',
                label: 'Email',
                field: 'String',
            },
            {
                name: 'firstName',
                label: 'Name',
                field: 'String',
            },
            {
                name: 'lastName',
                label: 'Last Name',
                field: 'String',
            },
            {
                name: 'phone',
                label: 'Phone',
                field: 'String',
            },
            {
                name: 'address',
                label: 'Address',
                field: 'String',
            },
            {
                name: 'tableName',
                label: 'Table',
                field: 'String',
            },
            {
                name: 'rsvp',
                label: 'RSVP',
                field: 'Checkbox',
                initialValue: false,
            },
        ],
    },
]

//-------------------------------------------------------------------
var addView = {
    path: 'guests/new',
    title: 'New User',
    denormalize: changeView.denormalize,
    actions: {
        add: function (req) { return guests.create(req) },
    },
}

addView.fieldsets = [
    {
        fields: [
            {
                name: 'email',
                label: 'Email',
                field: 'String',
            },
            {
                name: 'firstName',
                label: 'Name',
                field: 'String',
            },
            {
                name: 'lastName',
                label: 'Last Name',
                field: 'String',
            },
            {
                name: 'phone',
                label: 'Phone',
                field: 'String',
            },
            {
                name: 'address',
                label: 'Address',
                field: 'String',
            },
            {
                name: 'tableName',
                label: 'Table',
                field: 'String',
            },
            {
                name: 'rsvp',
                label: 'RSVP',
                field: 'Checkbox',
                initialValue: false,
            },
        ],
    },
]

module.exports = {
    listView,
    changeView,
    addView,
}
