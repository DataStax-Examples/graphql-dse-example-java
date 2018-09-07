import React from 'react'
import SplitDateTimeField from '../fields/SplitDateTimeField'

import { createResourceConnector } from '../connectors'

export function generateView(objectQueries, listQueries){
    var views = {}
    objectQueries.forEach(function(query){
        const name = query.name;
        const fields = query.type.getFields();
        const fieldNames = Object.keys(fields).join();

        const connector = createResourceConnector(name, fieldNames);
        var listView = {
            path: name,
            title: name,
            actions: {
                list: function (req) {
                    return connector.read(req)
                },
            },
            normalize: (list) => list.map(item => {
                return item
            })
        }

        listView.fields = []
        var requiredFields = []
        Object.keys(fields).forEach(function(key){
            const fieldName = fields[key].name
            const isMain = fields[key].type.name == undefined
            if (isMain) {requiredFields.push(fields[key].name) }
            listView.fields.push(
                {
                    name: fieldName,
                    label: fieldName,
                    main: isMain,
                }
            )
        })

        //-------------------------------------------------------------------
        var changeView = {
            //TODO: figure out compound keys
            path: name+ "/:" + requiredFields[0],
            title: name,
            actions: {
                get: function (req) { return connector(crudl.path[requiredFields[0]]).read(req) },
                save: function (req) { return connector(crudl.path[requiredFields[0]]).update(req) },
                delete: function (req) { return connector(crudl.path[requiredFields[0]]).delete(req) },
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

        views[name] = { listView, changeView, addView}

    })

    //-------------------------------------------------------------------
    return views

}
