package com.syllogistic.eightfour.managed;


import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.exceptions.InvalidQueryException;
import com.syllogistic.eightfour.EightFourConfiguration;
import io.dropwizard.lifecycle.Managed;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.concurrent.TimeUnit;

/**
 */
public class Cassandra implements Managed
{
    public static final String embeddedMode = "_embedded_";

    Cluster cluster;
    Session session;
    final String host;
    final int port;
    final String keyspace;
    final EightFourConfiguration conf;

    public Cassandra(EightFourConfiguration conf)
    {
        this.conf = conf;
        this.port = conf.getCassandraPort();
        this.keyspace = conf.getKeyspace();
        this.host = conf.getCassandraHost();
    }

    @Override
    public void start() throws Exception
    {

        cluster =  new Cluster.Builder()
                .addContactPoint(host)
                .withPort(port)
                .build();

        session = cluster.connect();
        createSchema();
        try
        {
            session.execute(String.format("USE %s;", keyspace));
        } catch (InvalidQueryException e)
        {
            throw new RuntimeException("Schema missing from this C* cluster");
        }
    }

    /**
     * Executes DDL
     */
    private void createSchema()
    {
        try
        {
            InputStream cql = Cassandra.class.getClassLoader().getResourceAsStream("schema.cql");
            if (cql == null)
                throw new RuntimeException("Missing schema.cql file.");

            session.execute(String.format("CREATE KEYSPACE IF NOT EXISTS %s WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};", keyspace));
            session.execute(String.format("USE %s", keyspace));

            BufferedReader lines = new BufferedReader(new InputStreamReader(cql));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = lines.readLine()) != null)
            {
                if (line.trim().startsWith("#") || line.trim().isEmpty())
                    continue;

                sb.append(line);

                if (line.trim().endsWith(";"))
                {
                    session.execute(sb.toString());
                    sb = new StringBuilder();
                }
            }
        }
        catch (Exception e)
        {
            e.printStackTrace();
            System.exit(2); //Fail hard
        }
    }

    @Override
    public void stop() throws Exception
    {
        session.close();
        cluster.close();

    }

    public Session get()
    {
        return session;
    }
}
