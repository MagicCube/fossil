package com.sap.nic.fossil.web.service;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

@Path("taxon")
public class TaxonService
{
	@GET
	public JSONArray getTaxons() throws JSONException
	{
		JSONArray taxons = new JSONArray();
		JSONObject taxon = new JSONObject();
		taxon.put("name", false);
		taxon.put("fullName", false);
		taxon.put("cls", false);
		taxon.put("genus", false);
		taxon.put("rank", false);
		taxon.put("start", false);
		taxon.put("end", false);
		taxon.put("author", false);
		taxon.put("year", false);
		return taxons;
	}
	
	
	@GET
	@Path("{id}/section")
	public JSONArray getTaxonSectionList(
			@PathParam("id") String p_id
			) throws JSONException
	{
		JSONArray result = new JSONArray();
		return result;
	}
}
