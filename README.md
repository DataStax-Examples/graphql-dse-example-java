# GraphQL Cassandra Example Application
[GraphQL](https://graphql.org/) is an emerging web service technology with significant momentum in the developer community.
Aside from its growing popularity, there are several technical reasons why GraphQL is a good fit for a Apache Cassandra™ or DataStax Enterprise backed application.

This application shows how to build a working application on Cassandra or DSE with GraphQL and a modern javascript based frontend.

Contributor(s): [Sebastián Estévez](https://github.com/phact)

## Objectives
- Demonstrate how to build a GraphQL API with Cassandra and DSE

### Project Layout
The asset includes both frontend and backend components:

* [API project](src/main/java/com/syllogistic/eightfour) - Java application that uses [Dropwizard](https://www.dropwizard.io/en/stable/) to generate a GraphQL web service that writes and reads data in Cassandra or DSE
* [index.html](src/main/resources/assets/index.htm) - Javascript single page app hosted by the java app that interacts with the GraphQL service to perform CRUD operations (based on [CRUDL.io](https://crudl.io/))

## How this Sample Works

### Take Aways

This asset looks to improve outcomes for projects that involve custom built Cassandra or DSE Applications by:

* **reducing the learning curve** required to build an GraphQL app that interacts with Cassandra or DSE
* **accelerating time to value** by providing a quick way to build a UI that leverages a Cassandra or DSE backend
* **minimize project risk** by encouraging developers to follow application building best practices such as by only sending the data needed to paint the UI
* **future proof** their applications by handling application changes and new requirements seamlessly through leveraging relationships in the GraphQL schema

#### GraphQL

* GraphQL requires developers to lay out their logical data models and access patterns up front in a strongly typed structure known as the GraphQL schema. This is makes it a great match for Cassandra or DSE, since we tend to create data models based on access patterns.
* GraphQL does not make any assumptions about the persistence layer. Instead it allows developers to generate a custom Data Access Object for each access pattern.

#### CRUDL

CRUDL is a javascript library that leverages React and Redux to build a single page admin UI for REST or GraphQL frontends.

#### Dropwizard

Dropwizard is a Java framework that focuses on production readiness and ships out of the box with metrics, multi-threading, etc. so that developers can focus on their business logic. This is a popular tool to build microservices and is more performant and production ready than many alternatives including spring.

## Setup and Running

### Prerequisites

* Java 8
* A Cassandra, DDAC, DSE cluster or Apollo database ( docker is a nice option for local install - [see docs](https://docs.datastax.com/en/docker/doc/docker/dockerQuickStart.html) )

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
