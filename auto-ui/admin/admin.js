import React from 'react'
import CustomDashboard from './custom/Dashboard'
//import { schema as schemaConnector } from './connectors'

import {generateView} from './views'

var guests = require('./views/guests')
var { login, logout } = require('./auth')
var { graphql, buildSchema } = require('graphql')

var schemaText = ""+
"type Query {"+
"    guest(email: String): Guest"+
"    allGuests: [Guest]"+
"}"+
""+
"type Guest {"+
"    email: String!"+
"    firstName: String"+
"    lastName: String"+
"    address: String"+
"    phone: String"+
"    tableName: String"+
"    rsvp: Boolean"+
"}"
""+
"input GuestInput {"+
"    email: String!"+
"    firstName: String"+
"    lastName: String"+
"    address: String"+
    "phone: String"+
    "tableName: String"+
    "rsvp: Boolean"+
"}"+
""+
"type Mutation {"+
    "guest(guestInfo: GuestInput): Guest"+
    "deleteGuest(email: String): String"+
"}"+
"schema {"+
"    query: Query"+
"    mutation: Mutation"+
"}"+
""

var schema = buildSchema(schemaText);

//Start with the query types and split into queries that return Lists or Object types

var queryTypes = schema.getQueryType().getFields()

var objectQueries = [];
var listQueries = [];

for (var key in queryTypes) {
    var queryType = queryTypes[key];
    // objects have names
    if (queryType.type.name !== undefined){
        objectQueries.push(queryType)
    }else{
        listQueries.push(queryType)
    }
}

var viewData = generateView(objectQueries, listQueries)

const OPTIONS = {
    debug: true,
    basePath: '/crudl/',
    baseURL: '/',
}

var admin = {}
admin.title = 'CRUDL GraphQL UI',
admin.options = OPTIONS
admin.views = viewData
//admin.views = { guests }
admin.auth = { login, logout }
admin.custom = { dashboard: CustomDashboard }
admin.id = 'crudl'
admin.messages = {
    'login.button': 'Sign in',
    'logout.button': 'Sign out',
    'logout.affirmation': 'Have a nice day!',
    'pageNotFound': 'Sorry, page not found',
}


export default admin
