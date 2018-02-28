package com.syllogistic.eightfour.api;

/**
 * Created by tato on 1/28/18.
 */

import com.syllogistic.eightfour.ServiceRegistry;
import com.syllogistic.eightfour.managed.GuestDAO;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;

import java.util.LinkedHashMap;
import java.util.Optional;

public class DeleteGuestDataFetcher implements DataFetcher<Guest> {

    public DeleteGuestDataFetcher() {
    }

    public Guest get(DataFetchingEnvironment environment) {
        final Optional<String> name = Optional
                .ofNullable(environment.getArgument("email"));
        GuestDAO guestDAO = ServiceRegistry.getGuestDAO();

        final String email= String.format(name.orElse(""));

        guestDAO.deleteGuest(email);

        return new Guest();
    }

}
