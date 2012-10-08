package eu.cassandra.server.mongo;

import java.util.Vector;

import javax.ws.rs.core.HttpHeaders;

import org.bson.types.ObjectId;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

import eu.cassandra.server.mongo.util.DBConn;
import eu.cassandra.server.mongo.util.JSONValidator;
import eu.cassandra.server.mongo.util.MongoDBQueries;
import eu.cassandra.server.mongo.util.PrettyJSONPrinter;

public class MongoCopyEntities {

	public MongoCopyEntities(HttpHeaders httpHeaders) {
		
	}
	
	private void addInfoFroCascadedCopy(DBObject res,DBObject answer,String newID) {
		if(answer == null)
			answer = res;
		else {
			Object cascaded = answer.get("CascadedCopiedInstallations");
			if(cascaded == null) {
				Vector<String> vec = new Vector<String>();
				vec.add(newID);
				answer.put("CascadedCopiedInstallations",vec);
			}
			else {
				
				Object obj = answer.get("CascadedCopiedInstallations");
				@SuppressWarnings("unchecked")
				Vector<String> vec = (Vector<String>)obj;
				vec.add(newID);
				answer.put("CascadedCopiedInstallations",vec);
			}
			res = answer;
		}
	}
	
	/**
	 * 
	 * @param fromInstID
	 * @param toScnID
	 * @return
	 */
	public String copyInstallationToScenario(String instID, String toScnID ,DBObject answer) {
		DBObject fromObj = DBConn.getConn().getCollection(MongoInstallations.COL_INSTALLATIONS).findOne(new BasicDBObject("_id", new ObjectId(instID)));
		String oldInstallationID = ((ObjectId)fromObj.get("_id")).toString();
		fromObj.put(MongoInstallations.REF_SCENARIO, toScnID);

		DBObject res = new MongoDBQueries().insertData(MongoInstallations.COL_INSTALLATIONS ,fromObj.toString(),
				"Installation copied successfully", 
				new String[] {MongoScenarios.COL_SCENARIOS,MongoInstallations.COL_INSTALLATIONS} ,
				new String[] {"scenario_id","belongsToInstallation"},
				new boolean[] {false,true},JSONValidator.INSTALLATION_SCHEMA);
		String newID = ((DBObject)res.get("data")).get("_id").toString();

		addInfoFroCascadedCopy(res,answer,newID);

		//Copy Persons of the Installation
		DBObject q = new BasicDBObject(MongoPersons.REF_INSTALLATION, oldInstallationID);
		DBCursor cursorDoc = DBConn.getConn().getCollection(MongoPersons.COL_PERSONS).find(q);
		while (cursorDoc.hasNext()) {
			DBObject obj = cursorDoc.next();
			String childID = obj.get("_id").toString();
			copyPersonToInstallation(childID, newID,res);
		}

		//Copy Appliances of the Installation
		q = new BasicDBObject(MongoAppliances.REF_INSTALLATION, oldInstallationID);
		cursorDoc = DBConn.getConn().getCollection(MongoAppliances.COL_APPLIANCES).find(q);
		while (cursorDoc.hasNext()) {
			DBObject obj = cursorDoc.next();
			String childID = obj.get("_id").toString();
			copyApplianceToInstallation(childID, newID,res);
		}

		return PrettyJSONPrinter.prettyPrint(res);
	}

	/**
	 * 
	 * @param fromPersID
	 * @param toInstID
	 * @return
	 */
	public String copyPersonToInstallation(String persID, String toInstID, DBObject answer) {
		DBObject fromObj = DBConn.getConn().getCollection(
				MongoPersons.COL_PERSONS).findOne(new BasicDBObject("_id", new ObjectId(persID)));
		fromObj.put(MongoPersons.REF_INSTALLATION, toInstID);
		String oldID = ((ObjectId)fromObj.get("_id")).toString();

		DBObject res =  new MongoDBQueries().insertData(MongoPersons.COL_PERSONS ,fromObj.toString() ,
				"Person copied successfully", MongoInstallations.COL_INSTALLATIONS ,
				"inst_id",JSONValidator.PERSON_SCHEMA );
		String newID = ((DBObject)res.get("data")).get("_id").toString();

		addInfoFroCascadedCopy(res,answer,newID);
		
		//Copy Activities of the Person
		DBObject q = new BasicDBObject(MongoActivities.REF_PERSON, oldID);
		DBCursor cursorDoc = DBConn.getConn().getCollection(MongoActivities.COL_ACTIVITIES).find(q);
		while (cursorDoc.hasNext()) {
			DBObject obj = cursorDoc.next();
			String childID = obj.get("_id").toString();
			copyActivityToPerson(childID, newID,res);
		}

		return PrettyJSONPrinter.prettyPrint(res.toString());
	}

	/**
	 * 
	 * @param fromAppID
	 * @param toInstID
	 * @return
	 */
	public String copyApplianceToInstallation(String appID, String toInstID, DBObject answer) {
		DBObject fromObj = DBConn.getConn().getCollection(
				MongoAppliances.COL_APPLIANCES).findOne(new BasicDBObject("_id", new ObjectId(appID)));
		fromObj.put(MongoAppliances.REF_INSTALLATION, toInstID);
		String oldID = ((ObjectId)fromObj.get("_id")).toString();


		DBObject res =  new MongoDBQueries().insertData(MongoAppliances.COL_APPLIANCES ,fromObj.toString() ,
				"Appliance copied successfully", MongoInstallations.COL_INSTALLATIONS ,
				"inst_id",JSONValidator.APPLIANCE_SCHEMA );
		String newID = ((DBObject)res.get("data")).get("_id").toString();

		addInfoFroCascadedCopy(res,answer,newID);
		
		//Copy Consumption Model of the Appliance
		DBObject q = new BasicDBObject(MongoConsumptionModels.REF_APPLIANCE, oldID);
		DBCursor cursorDoc = DBConn.getConn().getCollection(MongoConsumptionModels.COL_CONSMODELS).find(q);
		while (cursorDoc.hasNext()) {
			DBObject obj = cursorDoc.next();
			String childID = obj.get("_id").toString();
			copyConsModelToAppliance(childID, newID,res);
		}

		return PrettyJSONPrinter.prettyPrint(res);
	}

	/**
	 * 
	 * @param fromActID
	 * @param toPersID
	 * @return
	 */
	public String copyActivityToPerson(String actID, String toPersID, DBObject answer) {
		DBObject fromObj = DBConn.getConn().getCollection(
				MongoActivities.COL_ACTIVITIES).findOne(new BasicDBObject("_id", new ObjectId(actID)));
		fromObj.put(MongoActivities.REF_PERSON, toPersID);
		String oldID = ((ObjectId)fromObj.get("_id")).toString();

		DBObject res =  new MongoDBQueries().insertData(MongoActivities.COL_ACTIVITIES ,fromObj.toString() ,
				"Activity copied successfully", MongoPersons.COL_PERSONS ,
				MongoActivities.REF_PERSON,JSONValidator.ACTIVITY_SCHEMA );
		String newID = ((DBObject)res.get("data")).get("_id").toString();

		addInfoFroCascadedCopy(res,answer,newID);
		
		//Copy Activity Models of the Activity
		DBObject q = new BasicDBObject(MongoActivityModels.REF_ACTIVITY, oldID);
		DBCursor cursorDoc = DBConn.getConn().getCollection(MongoActivityModels.COL_ACTMODELS).find(q);
		while (cursorDoc.hasNext()) {
			DBObject obj = cursorDoc.next();
			String childID = obj.get("_id").toString();
			copyActivityModelToActivity(childID, newID,res);
		}

		return PrettyJSONPrinter.prettyPrint(res);
	}

	/**
	 * 
	 * @param fromActmodID
	 * @param toActID
	 * @return
	 */
	public String copyActivityModelToActivity(String actmodID, String toActID, DBObject answer) {
		DBObject fromObj = DBConn.getConn().getCollection(
				MongoActivityModels.COL_ACTMODELS).findOne(new BasicDBObject("_id", new ObjectId(actmodID)));
		fromObj.put(MongoActivityModels.REF_ACTIVITY, toActID);
		String oldID = ((ObjectId)fromObj.get("_id")).toString();

		DBObject res =  new MongoDBQueries().insertData(MongoActivityModels.COL_ACTMODELS ,fromObj.toString() ,
				"Activity Model copied successfully", MongoActivities.COL_ACTIVITIES ,
				MongoActivityModels.REF_ACTIVITY,JSONValidator.ACTIVITYMODEL_SCHEMA );
		String newID = ((DBObject)res.get("data")).get("_id").toString();

		addInfoFroCascadedCopy(res,answer,newID);
		
		//Copy Distributions of the Activity Model
		DBObject q = new BasicDBObject(MongoDistributions.REF_ACTIVITYMODEL, oldID);
		DBCursor cursorDoc = DBConn.getConn().getCollection(MongoDistributions.COL_DISTRIBUTIONS).find(q);
		while (cursorDoc.hasNext()) {
			DBObject obj = cursorDoc.next();
			String childID = obj.get("_id").toString();
			copyDistributionToActivityModel(childID, newID,res);
		}

		return PrettyJSONPrinter.prettyPrint(res);
	}

	/**
	 * 
	 * @param fromConsmodID
	 * @param toAppID
	 * @return
	 */
	public String copyConsModelToAppliance(String consmodID, String toAppID, DBObject answer) {
		DBObject fromObj = DBConn.getConn().getCollection(
				MongoConsumptionModels.COL_CONSMODELS).findOne(new BasicDBObject("_id", new ObjectId(consmodID)));
		fromObj.put(MongoConsumptionModels.REF_APPLIANCE, toAppID);
		
		DBObject res =  new MongoDBQueries().insertData(MongoConsumptionModels.COL_CONSMODELS ,fromObj.toString() ,
				"Consumption Model copied successfully", MongoAppliances.COL_APPLIANCES ,
				MongoConsumptionModels.REF_APPLIANCE,JSONValidator.CONSUMPTIONMODEL_SCHEMA );
		String newID = ((DBObject)res.get("data")).get("_id").toString();

		addInfoFroCascadedCopy(res,answer,newID);

		return PrettyJSONPrinter.prettyPrint(res.toString());
	}
	
	/**
	 * 
	 * @param fromDistrID
	 * @param toActmodID
	 * @return
	 */
	public String copyDistributionToActivityModel(String distrID, String toActmodID, DBObject answer) {
		DBObject fromObj = DBConn.getConn().getCollection(
				MongoDistributions.COL_DISTRIBUTIONS).findOne(new BasicDBObject("_id", new ObjectId(distrID)));
		fromObj.put(MongoDistributions.REF_ACTIVITYMODEL, toActmodID);

		DBObject res =  new MongoDBQueries().insertData(MongoDistributions.COL_DISTRIBUTIONS ,fromObj.toString() ,
				"Distribution copied successfully", MongoActivityModels.COL_ACTMODELS ,
				MongoDistributions.REF_ACTIVITYMODEL,JSONValidator.DISTRIBUTION_SCHEMA );
		String newID = ((DBObject)res.get("data")).get("_id").toString();

		addInfoFroCascadedCopy(res,answer,newID);
		
		return PrettyJSONPrinter.prettyPrint(res.toString());
	}

	//	/**
	//	 * 
	//	 * @param fromDemogID
	//	 * @param toScnID
	//	 * @return
	//	 */
	//	private String copyDemographicsToScenario(String fromDemogID, String toScnID) {
	//		System.out.println(fromDemogID + "\t" + toScnID);
	//
	//		DBObject fromObj = DBConn.getConn().getCollection(
	//				MongoDemographics.COL_DEMOGRAPHICS).findOne(new BasicDBObject("_id", new ObjectId(fromDemogID)));
	//		System.out.println(PrettyJSONPrinter.prettyPrint(fromObj));
	//		String oldID = ((ObjectId)fromObj.get("_id")).toString();
	//		
	//		fromObj.put(MongoSimParam.REF_SCENARIO, toScnID);
	//		System.out.println(PrettyJSONPrinter.prettyPrint(fromObj));
	//
	//		DBObject res =  new MongoDBQueries().insertData(MongoDemographics.COL_DEMOGRAPHICS ,fromObj.toString() ,
	//				"Demographics copied successfully", MongoScenarios.COL_SCENARIOS, 
	//				MongoDemographics.REF_SCENARIO,JSONValidator.DEMOGRAPHICS_SCHEMA );
	//		String newID = ((DBObject)res.get("data")).get("_id").toString();
	//		System.out.println(PrettyJSONPrinter.prettyPrint(res));
	//
	//		//Copy Installations of Demographics
	//		DBObject q = new BasicDBObject(MongoDemographics.REF_ENTITY, oldID);
	//		System.out.println(PrettyJSONPrinter.prettyPrint(q));
	//		DBCursor cursorDoc = DBConn.getConn().getCollection(MongoDemographics.COL_DEMOGRAPHICS).find(q);
	//		while (cursorDoc.hasNext()) {
	//			DBObject obj = cursorDoc.next();
	//			String childID = obj.get("_id").toString();
	//			copyInstallationToScenario(childID, newID);
	//		}
	//
	//		return PrettyJSONPrinter.prettyPrint(res.toString());
	//	}


	public String copySimParamsToScenario(String smpID, String toScnID, DBObject answer) {
		DBObject fromObj = DBConn.getConn().getCollection(
				MongoSimParam.COL_SIMPARAM).findOne(new BasicDBObject("_id", new ObjectId(smpID)));
		fromObj.put(MongoSimParam.REF_SCENARIO, toScnID);

		DBObject res =  new MongoDBQueries().insertData(MongoSimParam.COL_SIMPARAM ,fromObj.toString() ,
				"Simulation Parameters copied successfully", MongoScenarios.COL_SCENARIOS, 
				MongoSimParam.REF_SCENARIO,JSONValidator.SIMPARAM_SCHEMA );
		String newID = ((DBObject)res.get("data")).get("_id").toString();

		addInfoFroCascadedCopy(res,answer,newID);

		return PrettyJSONPrinter.prettyPrint(res);
	}


	/**
	 * Copy Scenario
	 * 
	 * @param fromScnID
	 * @param toPrjID
	 * @return
	 */
	public String copyScenarioToProject(String scnID, String toPrjID) {
		DBObject fromObj = DBConn.getConn().getCollection(
				MongoScenarios.COL_SCENARIOS).findOne(new BasicDBObject("_id", new ObjectId(scnID)));
		fromObj.put(MongoScenarios.REF_PROJECT, toPrjID);
		String oldScenarioID = ((ObjectId)fromObj.get("_id")).toString();

		DBObject res =  new MongoDBQueries().insertData(MongoScenarios.COL_SCENARIOS ,fromObj.toString() ,
				"Scenario copied successfully", MongoProjects.COL_PROJECTS , MongoScenarios.REF_PROJECT,JSONValidator.SCENARIO_SCHEMA );
		String newID = ((DBObject)res.get("data")).get("_id").toString();
		
		//Copy Installations of the Scenario
		DBObject q = new BasicDBObject(MongoInstallations.REF_SCENARIO, oldScenarioID);
		DBCursor cursorDoc = DBConn.getConn().getCollection(MongoInstallations.COL_INSTALLATIONS).find(q);
		while (cursorDoc.hasNext()) {
			DBObject obj = cursorDoc.next();
			String childID = obj.get("_id").toString();
			copyInstallationToScenario(childID, newID,res);
		}

		//		//Copy Demographics of the Scenario
		//		q = new BasicDBObject(MongoDemographics.REF_SCENARIO, oldScenarioID);
		//		System.out.println(PrettyJSONPrinter.prettyPrint(q));
		//		cursorDoc = DBConn.getConn().getCollection(MongoDemographics.COL_DEMOGRAPHICS).find(q);
		//		while (cursorDoc.hasNext()) {
		//			DBObject obj = cursorDoc.next();
		//			String childID = obj.get("_id").toString();
		//			copyDemographicsToScenario(childID, newID);
		//		}

		//Copy Simulation Parameters of the Scenario
		q = new BasicDBObject(MongoSimParam.REF_SCENARIO, oldScenarioID);
		cursorDoc = DBConn.getConn().getCollection(MongoSimParam.COL_SIMPARAM).find(q);
		while (cursorDoc.hasNext()) {
			DBObject obj = cursorDoc.next();
			String childID = obj.get("_id").toString();
			copySimParamsToScenario(childID, newID,res);
		}

		return PrettyJSONPrinter.prettyPrint(res);
	}
}