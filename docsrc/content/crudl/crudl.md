---
weight: 30
title: CRUDL
menu:
  main:
      parent: CRUDL
      identifier: crudl
      weight: 301
---

### What?

[CRUDL](crudl.io) is a small open source project that seeks to make it easy to create admin UIs for existing REST or GraphQL services with minimal effort.
CRUDL leverages modern javascript libraries (react and redux) to accomplish this.

CRUDL is hosted by the same dropwizard powered web application that runs the GraphQL service and hosts GraphiQL.
To access crudl on the machine running this asset hit `http://<host>:8080/crudl` on your web browser.

The default credentials are demo / i love puppies

### How?

In order to generate the admin UI for a particular GraphQL application, crudl relies on an some javascript objects found in the [admin directory](https://github.com/phact/graphql-dse-example/tree/master/ui/admin) of this project.
Details on the different objects represented in admin.js can be found in the [crudl documentation](https://github.com/crudlio/crudl).
When the admin project is ready, the project uses `watchify` to generate the static admin ui site that interacts with our graphql service.
