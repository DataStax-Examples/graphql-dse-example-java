package com.syllogistic.eightfour;

import com.syllogistic.eightfour.managed.Cassandra;
import com.syllogistic.eightfour.managed.GuestDAO;

public class ServiceRegistry {
    public static GraphQLDseConfiguration getConfiguration() {
        return configuration;
    }

    private static GraphQLDseConfiguration configuration;
    private static Cassandra cassandra;
    private static GuestDAO guestDAO;

    public synchronized static void setConfiguration(GraphQLDseConfiguration configuration)
    {
        if (ServiceRegistry.configuration != null)
            throw new RuntimeException("Configuration already set");

        ServiceRegistry.configuration = configuration;
    }

    public synchronized static void setCassandra(Cassandra cassandra)
    {
        if (ServiceRegistry.cassandra != null)
            throw new RuntimeException("Cassandra already exists");

        ServiceRegistry.cassandra = cassandra;
    }


    public static Cassandra getCassandra() {
        return cassandra;
    }

    public static void setGuestDAO(GuestDAO guestDAO) {
        ServiceRegistry.guestDAO = guestDAO;
    }

    public static GuestDAO getGuestDAO() {
        return guestDAO;
    }
}
