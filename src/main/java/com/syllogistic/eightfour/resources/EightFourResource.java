package com.syllogistic.eightfour.resources;

/**
 * Created by tato on 1/28/18.
 */

import java.util.Optional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import com.codahale.metrics.annotation.Timed;
import com.syllogistic.eightfour.EightFourConfiguration;
import com.syllogistic.eightfour.ServiceRegistry;
import com.syllogistic.eightfour.api.Creds;
import com.syllogistic.eightfour.api.Guest;

@Path("/")
@Produces(MediaType.APPLICATION_JSON)
public class EightFourResource {

    public EightFourResource() {
    }

    @GET
    @Timed
    @Path("/eightfour")
    public Guest getUser(@QueryParam("name") Optional<String> name) {
        final String value = name.orElse("");
        return new Guest(value);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Timed
    @Path("/login")
    public void login(Creds payload) throws Exception {
        //TODO: This is kinda gnarly. Please implement oauth / google auth IRL.
        EightFourConfiguration conf = ServiceRegistry.getConfiguration();
        if (payload.getPassword().equals(conf.getPassword())){
            return;
        }
        else{
            throw new Exception("bad creds");
        }
    }
}
