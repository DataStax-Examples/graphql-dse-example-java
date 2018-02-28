package com.syllogistic.eightfour.api;

/**
 * Created by tato on 1/28/18.
 */

import com.datastax.driver.mapping.annotations.Column;
import com.datastax.driver.mapping.annotations.PartitionKey;
import com.datastax.driver.mapping.annotations.Table;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

@Table(name = "guests")
public class Guest {
    @PartitionKey
    private final String email;
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;
    @Column
    private String address;
    @Column
    private String phone;
    @Column(name = "table_name")
    private String tableName;
    @Column
    private boolean rsvp;

    public Guest(String email, String firstName, String lastName) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public Guest() {
        email = "";
    }


    public void setAddress(String address) {
        this.address = address;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public void setRsvp(boolean rsvp) {
        this.rsvp = rsvp;
    }

    public Guest(String email){
        this.email = email;
    }

    @JsonProperty
    public String getEmail() {
        return email;
    }

    @JsonProperty
    public String getFirstName() {
        return firstName;
    }

    @JsonProperty
    public String getLastName() {
        return lastName;
    }

    @JsonCreator
    public Guest(
            @JsonProperty String email,
            @JsonProperty String firstName,
            @JsonProperty String lastName,
            @JsonProperty String address,
            @JsonProperty String phone,
            @JsonProperty("tableName") String tableName,
            @JsonProperty boolean rsvp
    ) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.phone = phone;
        this.tableName = tableName;
        this.rsvp = rsvp;
    }

    public String getAddress() {
        return address;
    }

    public String getPhone() {
        return phone;
    }

    public String getTableName() {
        return tableName;
    }

    public boolean getRsvp() {
        return rsvp;
    }
}
