## GraphQL DSE ExampltByEmail($email: String) {


    mvn package

    java -jar target/eightfour-graphql-1.0-SNAPSHOT.jar server ./conf/eightfour.yaml


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


