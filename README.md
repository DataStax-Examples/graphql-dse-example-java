# DSE GraphQL Sample App

This demonstrates how to build a working application on DSE with GraphQL and a modern javascript based frontend.

Contributor(s): [Sebastián Estévez](https://github.com/phact)

## Objectives
[GraphQL](https://graphql.org/) is an emerging web service technology with significant momentum in the developer community.
Aside from its growing popularity, there are several technical reasons why GraphQL is a good fit for a DSE backed application.
This asset provides a starting point for Builders who are looking to create GraphQL based applications on DSE.

### Project Layout
The asset includes both frontend and backend components:

* [API project](src/main/java/com/syllogistic/eightfour) - Java application that uses [Dropwizard](https://www.dropwizard.io/en/stable/) to generate a GraphQL web service that persists and accesses data in DSE
* [index.html](src/main/resources/assets/index.htm) - Javascript single page app hosted by the java app that interacts with the GraphQL service to perform CRUD operations (based on [CRUDL.io](https://crudl.io/))

## How this Sample Works

### Business Take Aways

This asset looks to improve business outcomes for projects that involve custom built DSE Applications by:

* **reducing the learning curve** required to build an app that interacts with DSE
* **accelerating time to value** by providing a quick way to built a UI that leverages a DSE backend
* **minimize project risk** by encouraging developers to follow application building best practices
* **future proof** their applications by handling application changes and new requirements seamlessly

Using GraphQL on DSE helps applications achieve the 5 dimensions by:

* Making the app **faster** by sending only the data needed to paint a UI
* Making the app more **contextual** by leveraging relationships in the GraphQL schema

### Technical Take Aways

#### GraphQL

GraphQL requires developers to lay out their logical data models and access patterns up front in a strongly typed structure known as the GraphQL schema.
This is makes it a great match for DSE, since we tend to create data models based on access patterns.
GraphQL does not make any assumptions about the persistence layer.
Instead it allows developers to generate a custom DAO for each access pattern.
In DSE, there are multiple ways of modeling a particular conceptual schema and access pattern.
This asset focuses on a simple example and aims to provide a basic pattern for developers to follow.

#### CRUDL

CRUDL is a javascript library that leverages React and Redux to build a single page admin UI for REST or GraphQL frontends.

#### Dropwizard

Dropwizard is a Java framework that focuses on production readiness and ships out of the box with metrics, multi-threading, etc. so that developers can focus on their business logic. This is a popular tool to build microservices and is more performant and production ready than many alternatives including spring.

## Setup and Running

### Prerequisites

* Java 8
* A DSE cluster with the connection information

This application requires that you specify and environment variable `IP` which is the contact point of your DSE cluster.
If you need to change this it is located in the [eightfour.yaml](conf/eightfour.yaml) file.

### Running
Once you load this file into IntelliJ their is a pre-configured configuration named `run`.  Once you start this then a scroll of 
text will go by and once you see a line similar to the following:

```
INFO  [2019-11-06 23:48:56,613] org.eclipse.jetty.server.Server: Started @3725ms
```

the server is now running.  It can be reached at:

`http://localhost:8080`