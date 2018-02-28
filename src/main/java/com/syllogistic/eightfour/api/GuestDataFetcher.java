package com.syllogistic.eightfour.api;

/**
 * Created by tato on 1/28/18.
 */

import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import com.syllogistic.eightfour.ServiceRegistry;
import com.syllogistic.eightfour.managed.Cassandra;
import com.syllogistic.eightfour.managed.GuestDAO;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;

public class GuestDataFetcher implements DataFetcher<Guest> {

    public GuestDataFetcher() {
    }

    public Guest get(DataFetchingEnvironment environment) {
        final Optional<String> name = Optional
                .ofNullable(environment.getArgument("email"));
        GuestDAO guestDAO = ServiceRegistry.getGuestDAO();

        final String email= String.format(name.orElse(""));

        Guest guest = guestDAO.getGuest(email);

        return guest;
    }

}
