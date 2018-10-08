import React from 'react'
import CustomDashboard from './custom/Dashboard'

import {generateView} from './views'
import { createCustomQueryConnector } from './auto-connectors'

var guests  = require('./views/guests.js')
var { login, logout } = require('./auth')
var { graphql, buildSchema, getIntrospectionQuery, introspectionQuery } = require('graphql')

/*
var schemaText = ""+
    "scalar DateTime scalar UUID  type Customer {   birthdate: DateTime   firstName: String   id: UUID!   lastName: String   purchases(orderBy: [OrderByInput!], pageSize: Int = 10, pageState: String): ProductPurchasePage!   views(orderBy: [OrderByInput!], pageSize: Int = 10, pageState: String): ProductViewPage! }  type CustomerPage {   data: [Customer!]!   pagingInfo: PagingInfo! }  type CustomerUpdated {   eventData: CustomerUpdatedData!   time: DateTime }  type CustomerUpdatedData {   birthdate: DateTime   firstName: String   id: UUID!   lastName: String }  type CustomerUpdatedResult {   errors: [String!]   event: CustomerUpdated }  type Mutation {   customerUpdated(event: CustomerUpdatedInput!, eventData: CustomerUpdatedDataInput!): CustomerUpdatedResult!   productCategoryUpdated(event: ProductCategoryUpdatedInput!, eventData: ProductCategoryUpdatedDataInput!): ProductCategoryUpdatedResult!   productPurchased(event: ProductPurchasedInput!, eventData: ProductPurchasedDataInput!): ProductPurchasedResult!   productUpdated(event: ProductUpdatedInput!, eventData: ProductUpdatedDataInput!): ProductUpdatedResult!   productViewed(eventData: ProductViewedDataInput!): ProductViewedResult! }  type PagingInfo {   hasNextPage: Boolean!   pageState: String }  type Product {   category: ProductCategory!   description: String   id: UUID!   name: String! }  type ProductCategory {   id: UUID!   name: String!   products(orderBy: [OrderByInput!], pageSize: Int = 10, pageState: String): ProductPage!   subCategories(orderBy: [OrderByInput!], pageSize: Int = 10, pageState: String): ProductCategoryPage!   superCategory: ProductCategory }  type ProductCategoryPage {   data: [ProductCategory!]!   pagingInfo: PagingInfo! }  type ProductCategoryUpdated {   eventData: ProductCategoryUpdatedData!   time: DateTime }  type ProductCategoryUpdatedData {   id: UUID!   name: String!   superCategory: ProductCategoryUpdatedDataSuperCategory }  type ProductCategoryUpdatedDataSuperCategory {   id: UUID! }  type ProductCategoryUpdatedResult {   errors: [String!]   event: ProductCategoryUpdated }  type ProductPage {   data: [Product!]!   pagingInfo: PagingInfo! }  type ProductPurchase {   amount: Float!   customer: Customer!   id: UUID!   product: Product!   time: DateTime }  type ProductPurchasePage {   data: [ProductPurchase!]!   pagingInfo: PagingInfo! }  type ProductPurchased {   eventData: ProductPurchasedData!   time: DateTime }  type ProductPurchasedData {   amount: Float!   customer: ProductPurchasedDataCustomer   id: UUID!   product: ProductPurchasedDataProduct   time: DateTime }  type ProductPurchasedDataCustomer {   id: UUID! }  type ProductPurchasedDataProduct {   id: UUID! }  type ProductPurchasedResult {   errors: [String!]   event: ProductPurchased }  type ProductUpdated {   eventData: ProductUpdatedData!   time: DateTime }  type ProductUpdatedData {   category: ProductUpdatedDataCategory   description: String   id: UUID!   name: String! }  type ProductUpdatedDataCategory {   id: UUID! }  type ProductUpdatedResult {   errors: [String!]   event: ProductUpdated }  type ProductView {   customer: Customer!   duration: Int!   product: Product!   time: DateTime! }  type ProductViewPage {   data: [ProductView!]!   pagingInfo: PagingInfo! }  type ProductViewed {   eventData: ProductViewedData! }  type ProductViewedData {   customer: ProductViewedDataCustomer   duration: Int!   product: ProductViewedDataProduct   time: DateTime! }  type ProductViewedDataCustomer {   id: UUID! }  type ProductViewedDataProduct {   id: UUID! }  type ProductViewedResult {   errors: [String!]   event: ProductViewed }  type Query {   customerById(id: UUID): Customer   customers(orderBy: [OrderByInput!], pageSize: Int = 10, pageState: String): CustomerPage!   productById(id: UUID): Product   productCategories(orderBy: [OrderByInput!], pageSize: Int = 10, pageState: String): ProductCategoryPage!   productCategoryById(id: UUID): ProductCategory   productPurchaseById(id: UUID): ProductPurchase   productPurchases(orderBy: [OrderByInput!], pageSize: Int = 10, pageState: String): ProductPurchasePage!   productViews(orderBy: [OrderByInput!], pageSize: Int = 10, pageState: String): ProductViewPage!   products(orderBy: [OrderByInput!], pageSize: Int = 10, pageState: String): ProductPage! }  type Subscription {   customerUpdated: CustomerUpdated!   productCategoryUpdated: ProductCategoryUpdated!   productPurchased: ProductPurchased!   productUpdated: ProductUpdated!   productViewed: ProductViewed! }  enum OrderByDirection {   ASC   DESC }  input CustomerUpdatedDataInput {   birthdate: DateTime   firstName: String   id: UUID!   lastName: String }  input CustomerUpdatedInput {   time: DateTime }  input OrderByInput {   direction: OrderByDirection!   field: String! }  input ProductCategoryUpdatedDataInput {   id: UUID!   name: String!   superCategory: ProductCategoryUpdatedDataInputSuperCategory }  input ProductCategoryUpdatedDataInputSuperCategory {   id: UUID! }  input ProductCategoryUpdatedInput {   time: DateTime }  input ProductPurchasedDataInput {   amount: Float!   customer: ProductPurchasedDataInputCustomer   id: UUID!   product: ProductPurchasedDataInputProduct   time: DateTime }  input ProductPurchasedDataInputCustomer {   id: UUID! }  input ProductPurchasedDataInputProduct {   id: UUID! }  input ProductPurchasedInput {   time: DateTime }  input ProductUpdatedDataInput {   category: ProductUpdatedDataInputCategory   description: String   id: UUID!   name: String! }  input ProductUpdatedDataInputCategory {   id: UUID! }  input ProductUpdatedInput {   time: DateTime }  input ProductViewedDataInput {   customer: ProductViewedDataInputCustomer   duration: Int!   product: ProductViewedDataInputProduct   time: DateTime! }  input ProductViewedDataInputCustomer {   id: UUID! }  input ProductViewedDataInputProduct {   id: UUID! } "
*/
/*
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
*/

//var schema = buildSchema(schemaText);
var schemaConnector = createCustomQueryConnector("read", getIntrospectionQuery(),"__schema")
var schemaPromise = schemaConnector().read()

schemaPromise.then(res => {
    var schemaText = res;
    var schema = buildSchema(schemaText);
    console.log(schema)

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
});

const OPTIONS = {
    debug: true,
    basePath: '/crudl/',
    baseURL: '/',
}

var admin = {}
admin.title = 'CRUDL GraphQL UI',
admin.options = OPTIONS
//admin.views = viewData
admin.views = { guests: guests }
admin.auth = { login, logout }
admin.custom = { dashboard: CustomDashboard }
admin.id = 'crudl'
admin.messages = {
    'login.button': 'Sign in',
    'logout.button': 'Sign out',
    'logout.affirmation': 'Have a nice day!',
    'pageNotFound': 'Sorry, page not found',
}


crudl.render(admin)
