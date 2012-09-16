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
package eu.cassandra.sim;

import java.util.Collection;
import java.util.HashMap;
import java.util.Vector;
import java.util.concurrent.PriorityBlockingQueue;

import org.apache.log4j.Logger;
import org.bson.types.ObjectId;

import com.mongodb.BasicDBList;
import com.mongodb.DBObject;
import com.mongodb.util.JSON;

import eu.cassandra.server.mongo.MongoResults;
import eu.cassandra.sim.entities.appliances.Appliance;
import eu.cassandra.sim.entities.appliances.ConsumptionModel;
import eu.cassandra.sim.entities.installations.Installation;
import eu.cassandra.sim.entities.people.Activity;
import eu.cassandra.sim.entities.people.Person;
import eu.cassandra.sim.math.Gaussian;
import eu.cassandra.sim.math.GaussianMixtureModels;
import eu.cassandra.sim.math.ProbabilityDistribution;
import eu.cassandra.sim.math.Uniform;
import eu.cassandra.sim.utilities.Constants;
import eu.cassandra.sim.utilities.RNG;
import eu.cassandra.sim.utilities.Utils;

/**
 * The Simulation class can simulate up to 4085 years of simulation.
 * 
 * @author Kyriakos C. Chatzidimitriou (kyrcha [at] iti [dot] gr)
 * 
 */
public class Simulation implements Runnable {
	static Logger logger = Logger.getLogger(Simulation.class);

	private Vector<Installation> installations;

	private PriorityBlockingQueue<Event> queue;

	private int tick = 0;

	private int endTick;
  
	private MongoResults m;

	private SimulationWorld simulationWorld;
	
	private String scenario;

	public Collection<Installation> getInstallations () {
		return installations;
	}

	public Installation getInstallation (int index) {
		return installations.get(index);
	}

	public int getCurrentTick () {
		return tick;
	}

	public int getEndTick () {
		return endTick;
	}
  
	public Simulation(String ascenario) {
		scenario = ascenario;
  		RNG.init();
	}
  
  	public SimulationWorld getSimulationWorld () {
  		return simulationWorld;
  	}

  	public void run () {
  		while (tick < endTick) {
  			System.out.println(tick);
  			// If it is the beginning of the day create the events
  			if (tick % Constants.MIN_IN_DAY == 0) {
  				System.out.println("Day " + ((tick / Constants.MIN_IN_DAY) + 1));
  				for (Installation installation: installations) {
  					System.out.println(installation.getName());
  					installation.updateDailySchedule(tick, queue);
  				}
  				System.out.println("Daily queue size: " + queue.size() + "(" + 
  				simulationWorld.getSimCalendar().isWeekend(tick) + ")");
  			}

  			Event top = queue.peek();
  			while (top != null && top.getTick() == tick) {
  				Event e = queue.poll();
  				e.apply();
  				top = queue.peek();
  			}

  			/*
  			 *  Calculate the total power for this simulation step for all the
  			 *  installations.
  			 */
  			float sumPower = 0;
  			for(Installation installation: installations) {
  				installation.nextStep(tick);
  				double power = installation.getCurrentPower();
  				sumPower += power;
  				String name = installation.getName();
  				logger.info("Tick: " + tick + " \t " + "Name: " + name + " \t " 
  				+ "Power: " + power);
  				System.out.println("Tick: " + tick + " \t " + "Name: " + name + " \t " 
  		  				+ "Power: " + power);
  			}
  			tick++;
  		}
  	}

  	public void setup() throws Exception {
  		logger.info("Simulation setup started.");
  		installations = new Vector<Installation>();
    
  		/* TODO  Change the Simulation Calendar initialization */
  		simulationWorld = new SimulationWorld();
    
  		DBObject jsonScenario = (DBObject) JSON.parse(scenario);
  		DBObject scenarioDoc = (DBObject) jsonScenario.get("scenario");
  		DBObject simParamsDoc = (DBObject) jsonScenario.get("sim_params");
    
  		int numOfDays = ((Integer)simParamsDoc.get("numberOfDays")).intValue();

  		endTick = Constants.MIN_IN_DAY * numOfDays;

  		// Check type of setup
  		String setup = (String)scenarioDoc.get("setup"); 
  		if(setup.equalsIgnoreCase("static")) {
  			staticSetup(jsonScenario);
  		} else if(setup.equalsIgnoreCase("dynamic")) {
  			dynamicSetup(jsonScenario);
  		} else {
  			throw new Exception("Problem with setup property");
  		}
  		logger.info("Simulation setup finished.");
  	}

  	public void staticSetup (DBObject jsonScenario) {
	    int numOfInstallations = ((Integer)jsonScenario.get("instcount")).intValue();
	    queue = new PriorityBlockingQueue<Event>(2 * numOfInstallations);
	    for (int i = 1; i <= numOfInstallations; i++) {
	    	DBObject instDoc = (DBObject)jsonScenario.get("inst"+i);
	    	String id = ((ObjectId)instDoc.get("_id")).toString();
	    	String name = (String)instDoc.get("name");
	    	String description = (String)instDoc.get("description");
	    	String type = (String)instDoc.get("type");
	    	Installation inst = new Installation.Builder(
	    			id, name, description, type).build();
	    	int appcount = ((Integer)instDoc.get("appcount")).intValue();
	    	// Create the appliances
	    	HashMap<String,Appliance> existing = new HashMap<String,Appliance>();
	    	for (int j = 1; j <= appcount; j++) {
	    		DBObject applianceDoc = (DBObject)instDoc.get("app"+j);
	    		String appid = ((ObjectId)applianceDoc.get("_id")).toString();
	    		String appname = (String)applianceDoc.get("name");
		    	String appdescription = (String)applianceDoc.get("description");
		    	String apptype = (String)applianceDoc.get("type");
		    	double standy = ((Double)applianceDoc.get("standy_consumption")).doubleValue();
		    	boolean base = ((Boolean)applianceDoc.get("base")).booleanValue();
		    	DBObject consModDoc = (DBObject)applianceDoc.get("consmod");
		    	ConsumptionModel consmod = new ConsumptionModel(consModDoc.get("model").toString());
	    		Appliance app = new Appliance.Builder(
	    				appid,
	    				appname,
	    				appdescription,
	    				apptype, 
	    				inst,
	    				consmod,
	    				standy,
	            		base).build();
	    		existing.put(appid, app);
	    		inst.addAppliance(app);
	    	}
	    	DBObject personDoc = (DBObject)instDoc.get("person");
	    	String personid = ((ObjectId)personDoc.get("_id")).toString();
    		String personName = (String)personDoc.get("name");
	    	String personDescription = (String)personDoc.get("description");
	    	String personType = (String)personDoc.get("type");
	    	Person person = new Person.Builder(
	    	        		  personid,
	    	        		  personName, 
	    	        		  personDescription,
	    	                  personType, inst).build();
	    	inst.addPerson(person);
	    	int actcount = ((Integer)personDoc.get("activitycount")).intValue();
	    	System.out.println("Act-Count: " + actcount);
	    	for (int j = 1; j <= actcount; j++) {
	    		DBObject activityDoc = (DBObject)personDoc.get("activity"+j);
	    		String activityName = (String)activityDoc.get("name");
	    		String activityType = (String)activityDoc.get("type");
	    		int actmodcount = ((Integer)activityDoc.get("actmodcount")).intValue();
	    		System.out.println("Act-Mod-Count: " + actmodcount);
	    		Activity act = new Activity.Builder(activityName, "", 
	    				activityType, simulationWorld).build();
	    		ProbabilityDistribution startDist;
	    		ProbabilityDistribution durDist;
	    		ProbabilityDistribution timesDist;
	    		for (int k = 1; k <= actmodcount; k++) {
	    			DBObject actmodDoc = (DBObject)activityDoc.get("actmod"+k);
	    			String actmodName = (String)actmodDoc.get("name");
	    			String actmodType = (String)actmodDoc.get("type");
	    			String actmodDayType = (String)actmodDoc.get("day_type");
	    			DBObject duration = (DBObject)actmodDoc.get("duration");
	    			durDist = json2dist(duration);
	    			System.out.println(durDist.getPrecomputedBin());
	    			DBObject start = (DBObject)actmodDoc.get("start");
	    			startDist = json2dist(start);
	    			System.out.println(startDist.getPrecomputedBin());
	    			DBObject rep = (DBObject)actmodDoc.get("repetitions");
	    			timesDist = json2dist(rep);
	    			System.out.println(timesDist.getPrecomputedBin());
	    			act.addDuration(actmodDayType, durDist);
	    			act.addStartTime(actmodDayType, startDist);
	    			act.addTimes(actmodDayType, timesDist);
	    			// add appliances
		    		BasicDBList containsAppliances = (BasicDBList)actmodDoc.get("containsAppliances");
		    		for(int l = 0; l < containsAppliances.size(); l++) {
		    			String containAppId = (String)containsAppliances.get(l);
		    			Appliance app  = existing.get(containAppId);
		    			act.addAppliance(actmodDayType,app,1.0/containsAppliances.size());
		    		}
	    		}
	    		person.addActivity(act);
	    	}
	    	installations.add(inst);
	    }
  }

  	public void dynamicSetup(DBObject jsonScenario) {
  		DBObject demog = (DBObject)jsonScenario.get("demog");
  		BasicDBList generators = (BasicDBList) demog.get("generators");
  		// Initialize simulation variables
  		int numOfInstallations = ((Integer)demog.get("numberOfEntities")).intValue();
  		System.out.println(numOfInstallations+"");
  		queue = new PriorityBlockingQueue<Event>(2 * numOfInstallations);
  		for (int i = 1; i <= numOfInstallations; i++) {
	    	DBObject instDoc = (DBObject)jsonScenario.get("inst"+1);
	    	String id = i+"";
	    	String name = (String)instDoc.get("name");
	    	String description = (String)instDoc.get("description");
	    	String type = (String)instDoc.get("type");
	    	Installation inst = new Installation.Builder(
	    			id, name, description, type).build();
	    	int appcount = ((Integer)instDoc.get("appcount")).intValue();
	    	// Create the appliances
	    	HashMap<String,Appliance> existing = new HashMap<String,Appliance>();
	    	for (int j = 1; j <= appcount; j++) {
	    		DBObject applianceDoc = (DBObject)instDoc.get("app"+j);
	    		String appid = ((ObjectId)applianceDoc.get("_id")).toString();
	    		String appname = (String)applianceDoc.get("name");
		    	String appdescription = (String)applianceDoc.get("description");
		    	String apptype = (String)applianceDoc.get("type");
		    	double standy = ((Double)applianceDoc.get("standy_consumption")).doubleValue();
		    	boolean base = ((Boolean)applianceDoc.get("base")).booleanValue();
		    	DBObject consModDoc = (DBObject)applianceDoc.get("consmod");
		    	ConsumptionModel consmod = new ConsumptionModel(consModDoc.get("model").toString());
	    		Appliance app = new Appliance.Builder(
	    				appid,
	    				appname,
	    				appdescription,
	    				apptype, 
	    				inst,
	    				consmod,
	    				standy,
	            		base).build();
	    		existing.put(appid, app);
	    	}
	    	for (int j = 1; j <= appcount; j++) {
	    		for(int k = 0; k < generators.size(); k++) {
	    			DBObject generator = (DBObject)generators.get(k);
	    			String entityId = (String)generator.get("entity_id");
	    			double prob = ((Double)generator.get("probability")).doubleValue();
	    			if(existing.containsKey(entityId)) {
	    				if(RNG.nextDouble() < prob) {
	    			    	inst.addAppliance(existing.get(entityId));
	    			    	System.out.println(existing.get(entityId).getName());
	    				}
	    			}
	    		}
	    	}

	    	int personcount = ((Integer)instDoc.get("personcount")).intValue();
	    	// Create the appliances
	    	HashMap<String,Person> existingPersons = new HashMap<String,Person>();
	    	for (int j = 1; j <= personcount; j++) {
	    		DBObject personDoc = (DBObject)instDoc.get("person"+j);
		    	String personid = ((ObjectId)personDoc.get("_id")).toString();
	    		String personName = (String)personDoc.get("name");
		    	String personDescription = (String)personDoc.get("description");
		    	String personType = (String)personDoc.get("type");
		    	Person person = new Person.Builder(
		    	        		  personid,
		    	        		  personName, 
		    	        		  personDescription,
		    	                  personType, inst).build();
		    	inst.addPerson(person);
		    	int actcount = ((Integer)personDoc.get("activitycount")).intValue();
		    	System.out.println("Act-Count: " + actcount);
		    	for (int k = 1; k <= actcount; k++) {
		    		DBObject activityDoc = (DBObject)personDoc.get("activity"+k);
		    		String activityName = (String)activityDoc.get("name");
		    		String activityType = (String)activityDoc.get("type");
		    		int actmodcount = ((Integer)activityDoc.get("actmodcount")).intValue();
		    		System.out.println("Act-Mod-Count: " + actmodcount);
		    		Activity act = new Activity.Builder(activityName, "", 
		    				activityType, simulationWorld).build();
		    		ProbabilityDistribution startDist;
		    		ProbabilityDistribution durDist;
		    		ProbabilityDistribution timesDist;
		    		for (int l = 1; l <= actmodcount; l++) {
		    			DBObject actmodDoc = (DBObject)activityDoc.get("actmod"+l);
		    			String actmodName = (String)actmodDoc.get("name");
		    			String actmodType = (String)actmodDoc.get("type");
		    			String actmodDayType = (String)actmodDoc.get("day_type");
		    			DBObject duration = (DBObject)actmodDoc.get("duration");
		    			durDist = json2dist(duration);
		    			System.out.println(durDist.getPrecomputedBin());
		    			DBObject start = (DBObject)actmodDoc.get("start");
		    			startDist = json2dist(start);
		    			System.out.println(startDist.getPrecomputedBin());
		    			DBObject rep = (DBObject)actmodDoc.get("repetitions");
		    			timesDist = json2dist(rep);
		    			System.out.println(timesDist.getPrecomputedBin());
		    			act.addDuration(actmodDayType, durDist);
		    			act.addStartTime(actmodDayType, startDist);
		    			act.addTimes(actmodDayType, timesDist);
		    			// add appliances
			    		BasicDBList containsAppliances = (BasicDBList)actmodDoc.get("containsAppliances");
			    		for(int m = 0; m < containsAppliances.size(); m++) {
			    			String containAppId = (String)containsAppliances.get(m);
			    			Appliance app  = existing.get(containAppId);
			    			act.addAppliance(actmodDayType,app,1.0/containsAppliances.size());
			    		}
		    		}
		    		person.addActivity(act);
		    	}
		    	existingPersons.put(personid, person);
	    	}
	    	
	    	double roulette = RNG.nextDouble();
	    	double sum = 0;
	    	for(int k = 0; k < generators.size(); k++) {
	    		DBObject generator = (DBObject)generators.get(k);
	    		String entityId = (String)generator.get("entity_id");
	    		double prob = ((Double)generator.get("probability")).doubleValue();
	    		sum += prob;
	    		if(existingPersons.containsKey(entityId)) {
	    			if(roulette < sum) {
	    				inst.addPerson(existingPersons.get(entityId));
	    				System.out.println(existingPersons.get(entityId).getName());
	    				break;
	    			}
	    		}
	    	}
	    	
	    	installations.add(inst);
	    }
  		
  	}
  
	public static ProbabilityDistribution json2dist(DBObject distribution) {
  		String distType = (String)distribution.get("distrType");
  		switch (distType) {
  		case ("normal"):
  			BasicDBList normalList = (BasicDBList)distribution.get("parameters");
  			DBObject normalDoc = (DBObject)normalList.get(0);
  			double mean = ((Double)normalDoc.get("mean")).doubleValue();
  			double std = ((Double)normalDoc.get("std")).doubleValue();
  			Gaussian normal = new Gaussian(mean, std);
  			normal.precompute(0, 1439, 1440);
  			System.out.println("A");
  			return normal;
        case ("uniform"):
   			BasicDBList unifList = (BasicDBList)distribution.get("parameters");
   			DBObject unifDoc = (DBObject)unifList.get(0);
   			double from = ((Double)unifDoc.get("from")).doubleValue();
   			double to = ((Double)unifDoc.get("to")).doubleValue();
   			Uniform uniform = new Uniform(from, to);
   			uniform.precompute(from, to, (int) to + 1);
   			System.out.println("B");
   			return uniform;
   		case ("mixture"):
        	 BasicDBList mixList = (BasicDBList)distribution.get("parameters");
   			int length = mixList.size();
   			double[] w = new double[length];
         	double[] means = new double[length];
         	double[] stds = new double[length];
         	for(int i = 0; i < mixList.size(); i++) {
         		DBObject tuple = (DBObject)mixList.get(i);
         		w[i] = ((Double)tuple.get("w")).doubleValue();
         		means[i] = ((Double)tuple.get("mean")).doubleValue();
         		stds[i] = ((Double)tuple.get("std")).doubleValue();
    		} 
         	GaussianMixtureModels gmm = new GaussianMixtureModels(length, w, means, stds);
         	System.out.println("C");
         	gmm.precompute(0, 1439, 1440);
         	return gmm;
        default:
        	System.out.println("Non existing start time distribution type");
        }
  		System.out.println("NULLLLLLLL");
  		return null;
  	}

}