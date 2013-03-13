/*   
   Copyright 2011-2013 The Cassandra Consortium (cassandra-fp7.eu)


   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
package eu.cassandra.server.api;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import eu.cassandra.server.mongo.MongoPersons;
import eu.cassandra.server.mongo.util.PrettyJSONPrinter;
import eu.cassandra.sim.utilities.Utils;

@Path("pers")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class Persons {
	
	/**
	 * 
	 * Gets the Persons under an installation
	 * @param message contains the inst_id to search the related installation
	 * @return
	 */
	@GET
	public Response getPersons(
			@QueryParam("inst_id") String inst_id,
			@QueryParam("scn_id") String scn_id,
			@QueryParam("count") boolean count,
			@QueryParam("pertype") boolean pertype,
			@Context HttpHeaders httpHeaders) {
		return Utils.returnResponse(PrettyJSONPrinter.prettyPrint(new MongoPersons().getPersons(httpHeaders,inst_id, scn_id, count,pertype)));
	}
	
	/**
	 * Create a Person
	 */
	@POST
	public Response create(String message) {
		return Utils.returnResponse(PrettyJSONPrinter.prettyPrint(new MongoPersons().createPerson(message)));
	}
}
