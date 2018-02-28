package com.syllogistic.eightfour;

/**
 * Created by tato on 1/28/18.
 */
import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.syllogistic.eightfour.managed.Cassandra;
import io.dropwizard.Configuration;

public class EightFourConfiguration extends Configuration{

    public String getCassandraHost() {
        return cassandraHost;
    }

    public void setCassandraHost(String cassandraHost) {
        this.cassandraHost = cassandraHost;
    }

    public Integer getCassandraPort() {
        return cassandraPort;
    }

    public void setCassandraPort(Integer cassandraPort) {
        this.cassandraPort = cassandraPort;
    }

    public String getKeyspace() {
        return keyspace;
    }

    public void setKeyspace(String keyspace) {
        this.keyspace = keyspace;
    }

    @JsonProperty(required = true)
    private String cassandraHost = Cassandra.embeddedMode;

    @Min(1)
    @Max(65535)
    @JsonProperty(required = true)
    private Integer cassandraPort = 9042;

    @JsonProperty(required = true)
    private String keyspace = "dev";


    public String getPassword() {
        return password;
    }

    @JsonProperty(required = true)
    private String password = "ilovepuppies";

    @NotNull
    @Valid
    public final GraphQLFactory graphql = new GraphQLFactory();

    @JsonProperty
    public GraphQLFactory getGraphQLFactory(EightFourConfiguration configuration) {
        return graphql;
    }
}
