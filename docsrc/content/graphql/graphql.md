---
weight: 20
title: GraphQL
menu:
  main:
      parent: GraphQL
      identifier: graphql
      weight: 201
---

## Backend

### Schema

On the backend, we define the graphql schema in a file found in the resources directory of the sample app. Here is the graphql schema for this asset:

```
schema {
    query: Query
    mutation: Mutation
}

type Query {
    guest(email: String): Guest
    allGuests: [Guest]
}

type Guest {
    email: String!
    firstName: String
    lastName: String
    address: String
    phone: String
    tableName: String
    rsvp: Boolean
}

input GuestInput {
    email: String!
    firstName: String
    lastName: String
    address: String
    phone: String
    tableName: String
    rsvp: Boolean
}

type Mutation {
    guest(guestInfo: GuestInput): Guest
    deleteGuest(email: String): String
}
```

{{< note title="GraphQL Schema Breakdown" >}}
Note that graphql schemas are made up of queries and mutations which are made up of types. Input types are a special kind of type used for mutations. GraphQl types can have nested elements that are instances of a graphql type or a base type (String, Boolean, Int, etc.).
{{< /note >}}

### DataFetchers and DAOs

In GraphQL each query, in order to persist or retrieve data, must have a corresponding DataFetcher that transforms your input type to the format required by your underlying database and performs the interaction with the database. For some backends, there are tools like [Prisma](https://www.prismagraphql.com/) that generate the underlying data models and DataFetchers for you.
In these example, we craft them by hand.

Here is an example of a simple DataFetcher (used in this asset) to persist guests:

```
    public Guest get(DataFetchingEnvironment environment) {
        LinkedHashMap<String, Object> guestInfo = environment.getArgument("guestInfo");

        GuestDAO guestDAO = ServiceRegistry.getGuestDAO();

        String email = (String) getOrNull("email", guestInfo);
        String firstName = (String) getOrNull("firstName", guestInfo);
        String lastName = (String) getOrNull("lastName", guestInfo);
        String phone = (String) getOrNull("phone", guestInfo);
        String table = (String) getOrNull("tableName", guestInfo);
        String address = (String) getOrNull("address", guestInfo);

        boolean rsvp = (boolean) getOrNull("rsvp", guestInfo);

        Guest guest = new Guest(email, firstName, lastName, address, phone, table, rsvp);

        guestDAO.addGuest(guest);

        return guest;
    }
```

Note, this DataFetcher relies on a GuestDAO object that actually persists to DSE. In this case, our GuestDAO wraps the DSE Java driver and uses the object mapper to persist Guests to the underlying Guest table:


```
CREATE TABLE if not exists guests(
    email text PRIMARY KEY,
    first_name text,
    last_name text,
    address text,
    phone text,
    table_name text,
    rsvp boolean
);
```

## Frontend / Dev Experience

### GraphiQL

GraphQL often ships with a developer tool called GraphiQL (pronounced graphical) which makes it easy for developers to design GraphQL queries.
GraphiQL is a full featured web ui which is available on port 8080 (hit http://<host>:8080/ on your web browser) of the machine running this asset.
It is possible to build tools like GraphiQL for GraphQL because the GraphQL schema is strongly typed and self describing.
The main features of GraphiQL include:

 - Auto generated schema documentation
 - Code auto completion
 - Query execution
 - Variable management

To get started with GraphiQL and this example, pull up the UI and paste the following queries in the query section on the left of the screen:

```
guest(email: $email) {
    email
    firstName
    lastName
    address
    phone
    tableName
    rsvp
  }
}

query getAllGuests {
  allGuests {
    email
    firstName
    lastName
    address
    phone
    tableName
    rsvp
  }
}

mutation deleteGuest{
  deleteGuest(email: "test")
}

mutation createGuest($guestInfo: GuestInput) {
  guest(guestInfo: $guestInfo) {
    email
    firstName
    lastName
    address
    phone
    tableName
    rsvp
  }
}

mutation addGuest($input: GuestInput) {
  guest(guestInfo: $input) {
    email
    firstName
    phone
    lastName
    address
    tableName
    rsvp
  }
}

query allGuests {
  allGuests {
    email
    firstName
    lastName
    rsvp
    tableName
    address
    phone
  }
}
```

Notice the variables that include a $, those are query variables which are bound to the query at runtime. GraphiQL has a variables pane you can expand by clicking on the bottom of the screen. Paste the following variables into the variable pane:

```
{
  "email": "test@gmail.com",
  "guestInfo": {
    "email": "test@gmail.com",
    "firstName": "Sebastian",
    "lastName": "Estevex",
    "phone": 9541234567,
    "address": "1 Freedom Circle, Santa Clara",
    "tableName": "1",
    "rsvp": true
  },
  "input": {
    "email": "test@gmail.com",
    "firstName": "Sebastián",
    "lastName": "Estévez",
    "tableName": "1"
  }
}
```

Proceed to execute queries by clicking the play button at the top of the screen.
