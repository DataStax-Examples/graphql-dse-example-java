package com.syllogistic.eightfour;

import io.dropwizard.Configuration;

@FunctionalInterface
public interface GraphQLConfiguration<C extends Configuration> {
    GraphQLFactory getGraphQLFactory(C configuration);
}
