/*   
   Copyright 2011-2012 The Cassandra Consortium (cassandra-fp7.eu)


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
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import eu.cassandra.server.mongo.MongoDemographics;
import eu.cassandra.server.mongo.util.PrettyJSONPrinter;

@Path("demog/{demog_id: [a-z0-9][a-z0-9]*}")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class Demographic {

	@GET
	public String getDemographic(@PathParam("demog_id") String demog_id) {
		return PrettyJSONPrinter.prettyPrint(new MongoDemographics().getDemographic(demog_id));
	}

	@PUT
	public String updateDemographic(@PathParam("demog_id") String demog_id, String message) {
		return  PrettyJSONPrinter.prettyPrint(new MongoDemographics().updateDemographics(demog_id,message));
	}

	@DELETE
	public String deleteDemographic(@PathParam("demog_id") String demog_id) {
		return PrettyJSONPrinter.prettyPrint(new MongoDemographics().deleteDemographics(demog_id));
	}

}
