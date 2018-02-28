package com.syllogistic.eightfour.api;

/**
 * Created by tato on 1/28/18.
 */

import com.datastax.driver.mapping.Result;
import com.syllogistic.eightfour.ServiceRegistry;
import com.syllogistic.eightfour.managed.GuestDAO;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;

import java.util.List;

public class AllGuestDataFetcher implements DataFetcher<List<Guest>> {

    public AllGuestDataFetcher() {
    }

    public List<Guest> get(DataFetchingEnvironment environment) {

        GuestDAO guestDAO = ServiceRegistry.getGuestDAO();
        List<Guest> guests = guestDAO.getAllGuests();

        return guests;
    }

}
