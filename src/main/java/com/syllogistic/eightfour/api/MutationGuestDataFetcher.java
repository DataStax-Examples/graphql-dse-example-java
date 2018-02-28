package com.syllogistic.eightfour.api;

/**
 * Created by tato on 1/28/18.
 */

import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import com.syllogistic.eightfour.ServiceRegistry;
import com.syllogistic.eightfour.managed.GuestDAO;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;

public class MutationGuestDataFetcher implements DataFetcher<Guest> {

    public MutationGuestDataFetcher() {
    }

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

    private Object getOrNull(String key, LinkedHashMap<String, Object> map){
        if (map.get(key) != null){
            return map.get(key);
        }
        return null;
    }

}
