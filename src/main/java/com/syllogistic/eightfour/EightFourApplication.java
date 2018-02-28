package com.syllogistic.eightfour;
/**
 * Created by tato on 1/28/18.
 */
import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration;

import com.syllogistic.eightfour.api.AllGuestDataFetcher;
import com.syllogistic.eightfour.api.DeleteGuestDataFetcher;
import com.syllogistic.eightfour.api.GuestDataFetcher;
import com.syllogistic.eightfour.api.MutationGuestDataFetcher;
import com.syllogistic.eightfour.managed.Cassandra;
import com.syllogistic.eightfour.managed.GuestDAO;
import com.syllogistic.eightfour.resources.EightFourResource;
import graphql.schema.GraphQLSchema;
import graphql.servlet.GraphQLServlet;
import graphql.servlet.SimpleGraphQLServlet;
import io.dropwizard.assets.AssetsBundle;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import graphql.schema.idl.RuntimeWiring;
import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

import java.util.EnumSet;

public class EightFourApplication
        extends Application<EightFourConfiguration> {

    public static void main(String[] args) throws Exception{
        new EightFourApplication().run(args);
    }

    @Override
    public String getName() {
        return "eightfour-app";
    }

    @Override
    public void initialize(Bootstrap<EightFourConfiguration> bootstrap) {

        //TODO: remove dependency on graphql-java, and add this
        bootstrap.addBundle(new AssetsBundle("/assets/", "/"));
        //bootstrap.addBundle(new AssetsBundle("/assets/crudl/*", "/index.htm"));


        final GraphQLBundle<EightFourConfiguration> bundle = new GraphQLBundle<EightFourConfiguration>() {
            @Override
            public GraphQLFactory getGraphQLFactory(
                    EightFourConfiguration configuration) {
                final GraphQLFactory factory = configuration
                        .getGraphQLFactory(configuration);
                // the RuntimeWiring must be configured prior to the run()
                // methods being called so the schema is connected properly.
                factory.setRuntimeWiring(buildWiring(configuration));
                return factory;
            }
        };
        bootstrap.addBundle(bundle);
    }

    @Override
    public void run(EightFourConfiguration configuration,
                    Environment environment) throws Exception {

        //GraphQl Factory Stuff
        final GraphQLFactory factory = configuration.getGraphQLFactory(configuration);

        final GraphQLSchema schema = factory.build();
        final GraphQLServlet servlet = SimpleGraphQLServlet.builder(schema)
                .withInstrumentation(factory.getInstrumentations()).build();

        environment.servlets().addServlet("graphql", servlet)
                .addMapping("/graphql", "/schema.json");

        /*
        ServletRegistration.Dynamic servlet = environment.servlets().addServlet(
                "assets", new AssetServlet("/public",
                        "/ui",
                        "index.html",
                        Charsets.UTF_8
                ));
        servlet.addMapping("/*");
        servlet.setInitParameter("useFileMappedBuffer", "false");
        */

        Cassandra cassandra = new Cassandra(configuration);


        GuestDAO guestDAO = new GuestDAO(cassandra);

        environment.lifecycle().manage(cassandra);
        environment.lifecycle().manage(guestDAO);

        // Enable CORS to allow GraphiQL on a separate port to reach the API
        final FilterRegistration.Dynamic cors = environment.servlets()
                .addFilter("cors", CrossOriginFilter.class);
        cors.setInitParameter("allowedOrigins", "*");
        cors.setInitParameter("allowedHeaders", "X-Requested-With,authorization,Content-Type,Accept,Origin");
        cors.setInitParameter("allowedMethods", "OPTIONS,GET,PUT,POST,DELETE,HEAD");

        cors.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), true,
                "/*");

        //REST
        final EightFourResource resource = new EightFourResource();
        environment.jersey().register(resource);

        ServiceRegistry.setGuestDAO(guestDAO);
        ServiceRegistry.setCassandra(cassandra);
        ServiceRegistry.setConfiguration(configuration);

    }

    private static RuntimeWiring buildWiring(
            EightFourConfiguration configuration) {

        final GuestDataFetcher fetcher = new GuestDataFetcher();
        final AllGuestDataFetcher allFetcher = new AllGuestDataFetcher();
        final MutationGuestDataFetcher mutationFetcher = new MutationGuestDataFetcher();
        final DeleteGuestDataFetcher deleteFetcher = new DeleteGuestDataFetcher();

        final RuntimeWiring wiring = RuntimeWiring.newRuntimeWiring()
                .type("Query",
                        typeWiring -> typeWiring.dataFetcher("guest", fetcher))
                .type("Query",
                        typeWiring -> typeWiring.dataFetcher("allGuests", allFetcher))
                .type("Mutation",
                        typeWiring -> typeWiring.dataFetcher("guest", mutationFetcher))
                .type("Mutation",
                        typeWiring -> typeWiring.dataFetcher("deleteGuest", deleteFetcher))
                .build();

        return wiring;
    }
}
