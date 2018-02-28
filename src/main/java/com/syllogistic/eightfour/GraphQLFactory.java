package com.syllogistic.eightfour;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import graphql.execution.AsyncExecutionStrategy;
import graphql.execution.AsyncSerialExecutionStrategy;
import graphql.execution.ExecutionStrategy;
import graphql.execution.SubscriptionExecutionStrategy;
import graphql.execution.batched.BatchedExecutionStrategy;
import graphql.execution.instrumentation.ChainedInstrumentation;
import graphql.execution.instrumentation.Instrumentation;
import graphql.execution.instrumentation.tracing.TracingInstrumentation;
import graphql.schema.GraphQLSchema;
import graphql.schema.idl.RuntimeWiring;
import graphql.schema.idl.SchemaGenerator;
import graphql.schema.idl.SchemaParser;
import graphql.schema.idl.TypeDefinitionRegistry;
import graphql.schema.idl.errors.SchemaProblem;
import io.dropwizard.validation.OneOf;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.List;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.NotEmpty;

public class GraphQLFactory {
    @NotEmpty
    private String schemaFile = "";

    @NotEmpty
    @OneOf({ "async", "async_serial", "subscription", "batched" })
    private String executionStrategy = "async";

    @NotNull
    private List<String> blockedFields = Collections.emptyList();

    @NotNull
    private List<Instrumentation> instrumentations = Collections
            .singletonList(new TracingInstrumentation());

    @NotNull
    private RuntimeWiring runtimeWiring = RuntimeWiring.newRuntimeWiring()
            .build();

    @JsonProperty
    public BufferedReader getSchemaFile() throws URISyntaxException {
        InputStream in = getClass().getClassLoader().getResourceAsStream(schemaFile);
        BufferedReader reader = new BufferedReader(new InputStreamReader(in));
        return reader;
    }

    @JsonProperty
    public void setSchemaFile(final String file) {
        this.schemaFile = file;
    }

    @JsonProperty
    public ExecutionStrategy getExecutionStrategy() {
        switch (executionStrategy) {
            case "batched":
                return new BatchedExecutionStrategy();
            case "async_serial":
                return new AsyncSerialExecutionStrategy();
            case "subscription":
                return new SubscriptionExecutionStrategy();
            case "async":
            default:
                return new AsyncExecutionStrategy();
        }
    }

    @JsonProperty
    public void setExecutionStrategy(final String strategy) {
        this.executionStrategy = strategy;
    }

    @JsonIgnore
    public RuntimeWiring getRuntimeWiring() {
        return runtimeWiring;
    }

    @JsonIgnore
    public void setRuntimeWiring(final RuntimeWiring wiring) {
        this.runtimeWiring = wiring;
    }

    @JsonProperty
    public List<String> getBlockedFields() {
        return blockedFields;
    }

    @JsonProperty
    public void setBlockedFields(final List<String> fields) {
        this.blockedFields = fields;
    }

    @JsonIgnore
    public ChainedInstrumentation getInstrumentations() {
        return new ChainedInstrumentation(instrumentations);
    }

    @JsonIgnore
    public void setInstrumentations(List<Instrumentation> instrumentations) {
        this.instrumentations = instrumentations;
    }

    public GraphQLSchema build() throws SchemaProblem, URISyntaxException {
        final SchemaParser parser = new SchemaParser();
        final TypeDefinitionRegistry registry = parser.parse(getSchemaFile());

        final SchemaGenerator generator = new SchemaGenerator();
        final GraphQLSchema schema = generator.makeExecutableSchema(registry,
                runtimeWiring);
        return schema;
    }
}
