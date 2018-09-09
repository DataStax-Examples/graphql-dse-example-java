import React from 'react'
import SplitDateTimeField from '../fields/SplitDateTimeField'

import { createResourceConnector } from '../connectors'

export function generateView(objectQueries, listQueries){
    var views = {}
    var i = 0
    objectQueries.forEach(function(query){
        const name = query.name;
        const fields = query.type.getFields();
        const fieldNames = Object.keys(fields).join();

        const connector = createResourceConnector(name, fieldNames);

        //-------------------------------------------------------------------
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

        //-------------------------------------------------------------------
        //-------------------------------------------------------------------
        listView.fields = []

        var changeView = {}
        changeView.fieldsets = []
        changeView.fieldsets[i]={fields : []}

        var addView = {}
        addView.fieldsets = []
        addView.fieldsets[i]={fields : []}
        i++
        var requiredFields = []
        Object.keys(fields).forEach(function(key){
            const fieldName = fields[key].name
            const isMain = fields[key].type.name == undefined
            var fieldType
            var initialValue
            if (fields[key].type == "Boolean"){
                fieldType = "Checkbox"
                initialValue = false
            }else {
                if (fields[key].type.ofType != undefined){
                    fieldType =  fields[key].type.ofType.name
                }else {
                    fieldType =  fields[key].type.name
                }
            }
            if (isMain) {requiredFields.push(fields[key].name) }

            //-------------------------------------------------------------------
            listView.fields.push(
                {
                    name: fieldName,
                    label: fieldName,
                    main: isMain,
                }
            )

            var thisField

            if (initialValue != undefined){
                thisField =
                {
                    name: fieldName,
                    label: fieldName,
                    field: fieldType,
                    initialValue: initialValue,
                }
            } else{
                thisField =
                {
                    name: fieldName,
                    label: fieldName,
                    field: fieldType,
                }
            }
            changeView.fieldsets[0].fields.push(thisField)
            addView.fieldsets[0].fields.push(thisField)
        })

        changeView = Object.assign({
            //TODO: figure out how to work with compound keys
            path: name+ "/:" + requiredFields[0],
            title: 'Change ' + name,
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
        }, changeView)

        //-------------------------------------------------------------------
        addView = Object.assign({
            path: name+'/new',
            title: 'New ' + name,
            denormalize: changeView.denormalize,
            actions: {
                add: function (req) { return connector.create(req) },
            },
        }, addView)

        views[name] = { listView, changeView, addView}

    })

    //-------------------------------------------------------------------
    return views

}
