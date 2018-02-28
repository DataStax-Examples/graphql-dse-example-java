package com.syllogistic.eightfour;

import graphql.schema.GraphQLSchema;
import graphql.servlet.GraphQLServlet;
import graphql.servlet.SimpleGraphQLServlet;
import io.dropwizard.Configuration;
import io.dropwizard.ConfiguredBundle;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

public abstract class GraphQLBundle<C extends Configuration>
            implements ConfiguredBundle<C>, GraphQLConfiguration<C> {

    @Override
    public void initialize(Bootstrap<?> bootstrap) {
        bootstrap.addBundle(new AssetsBundle("/assets/", "/"));
    }

    @Override
    public void run(final C configuration, final Environment environment)
            throws Exception {
        final GraphQLFactory factory = getGraphQLFactory(configuration);

        final GraphQLSchema schema = factory.build();
        final GraphQLServlet servlet = SimpleGraphQLServlet.builder(schema)
                .withInstrumentation(factory.getInstrumentations()).build();

        environment.servlets().addServlet("graphql", servlet)
                .addMapping("/graphql", "/schema.json");
    }
}
