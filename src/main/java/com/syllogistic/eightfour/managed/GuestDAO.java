package com.syllogistic.eightfour.managed;

import com.datastax.driver.core.Statement;
import com.datastax.driver.mapping.Mapper;
import com.datastax.driver.mapping.MappingManager;
import com.datastax.driver.mapping.Result;
import com.datastax.driver.mapping.annotations.Accessor;
import com.datastax.driver.mapping.annotations.Param;
import com.datastax.driver.mapping.annotations.Query;
import com.syllogistic.eightfour.api.Guest;
import io.dropwizard.lifecycle.Managed;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

public class GuestDAO implements Managed{
    final Cassandra cassandra;
    Mapper<Guest> guestMapper;
    GuestAccessor guestAccessor;

    public GuestDAO(Cassandra cassandra) {
        this.cassandra = cassandra;
    }

    public List<Guest> getAllGuests() {
        Result<Guest> result = guestAccessor.getAll();

        List<Guest> guests = new ArrayList<Guest>();
        for (Guest guest : result){
            guests.add(guest);
        }
        return guests;
    }

    public void deleteGuest(String email) {
        guestMapper.delete(email);
    }

    @Accessor
    private interface GuestAccessor{
        @Query("INSERT INTO guests (email, first_name, last_name, address, phone, table_name, rsvp) VALUES (:email, :first_name, :last_name, :address, :phone, :table_name, :rsvp) IF NOT EXISTS")
        Statement addGuest(@Param("email") String email, @Param("first_name") String firstName, @Param("last_name") String lastName,
                          @Param("address") String address, @Param("phone") int phone, @Param("table_name") String tableName,
                          @Param("rsvp") boolean rsvp);

        @Query("SELECT * FROM guests where email= :email")
        Statement getGuest(@Param("email") String email);

        @Query("SELECT * FROM guests")
        Result<Guest> getAll();
    }


    public void addGuest(Guest guest)
    {
        guestMapper.save(guest);

    }

    public Guest getGuest(String email){

        Guest result = guestMapper.get(email);

        return result;

    }

    @Override
    public void start() throws Exception {
        guestMapper = new MappingManager(cassandra.get()).mapper(Guest.class);
        guestAccessor = new MappingManager(cassandra.get()).createAccessor(GuestAccessor.class);

    }

    @Override
    public void stop() throws Exception {

    }
}
