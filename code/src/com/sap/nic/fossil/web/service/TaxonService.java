package com.sap.nic.fossil.web.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.Date;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.sap.nic.fossil.db.DbConnectionPoolFactory;

@Path("taxon")
public class TaxonService
{
	private static final Logger _logger = Logger.getLogger(TaxonService.class);
	
	
	@GET
	@Path("diversity/distribution")
	public Response getDistByClassYear(
			@QueryParam("className") String p_className,
			@QueryParam("yearSelected") Double p_year
			) throws Exception
	{
		JSONObject result = new JSONObject();
		
		PreparedStatement statement = createSqlStatement("CALL FOSSIL195.FS_PROC_SQL_TAXA_COUNT_MAIN(?, ?, ?, ?)", p_className, p_year);
		statement.execute();
		ResultSet resultSet = statement.getResultSet();
		
		JSONArray classes = new JSONArray();
		while (resultSet.next())
		{
			JSONObject cls = new JSONObject();
			cls.put("className", resultSet.getString("CLASS"));
			cls.put("count", resultSet.getInt("COUNT"));
			classes.put(cls);
		}
		result.put("classes", classes);
		
		if (statement.getMoreResults())
		{
			resultSet = statement.getResultSet();
			JSONArray sections = new JSONArray();
			while (resultSet.next())
			{
				JSONObject section = new JSONObject();
				section.put("sectionId", "s" + resultSet.getInt("SCTNUM"));
				section.put("count", resultSet.getInt("COUNT"));
				sections.put(section);
			}
			result.put("sections", sections);
		}
		
		ResponseBuilder builder = Response.ok(result);
		Calendar now = Calendar.getInstance();
		now.add(Calendar.YEAR, 1);
		builder.expires(now.getTime());
		
		DbConnectionPoolFactory.getInstance().putBackConnection(statement.getConnection());
		
		return builder.build();
	}

	
	
	
	@GET
	@Path("diversity/curve")
	public Response getDiversityCurve(
			@QueryParam("class") String p_className
			) throws Exception
	{
		ResultSet resultSet = null;
		resultSet = executeSql("CALL FOSSIL195.FS_PROC_SQL_DIVERSITY_CURVE(?, ?)", p_className, 0.0001);
		
		JSONArray result = new JSONArray();

		while (resultSet.next())
		{	
			JSONObject cls = new JSONObject();
			cls.put("ma", resultSet.getDouble("MA"));
			cls.put("count", resultSet.getInt(2));
			result.put(cls);
		}
		
		ResponseBuilder builder = Response.ok(result);
		Calendar now = Calendar.getInstance();
		now.add(Calendar.YEAR, 1);
		builder.expires(now.getTime());
		
		DbConnectionPoolFactory.getInstance().putBackConnection(resultSet.getStatement().getConnection());
		return builder.build();
	}
	
	@GET
	public JSONObject getTaxa() throws Exception
	{
		ResultSet resultSet = executeSql("call FOSSIL195.FS_PROC_SQL_TEST_MA()");
		
		JSONObject result = new JSONObject();
		JSONArray taxa = new JSONArray();
		result.put("taxa", taxa);
		int i = 0;
		while (resultSet.next())
		{
			double appear = resultSet.getDouble("APPEAR");
			double disappear = resultSet.getDouble("DISAPPEAR");
			
			if (i++ == 0)
			{
				result.put("first", appear);
			}
			
			JSONObject taxon = new JSONObject();
			taxon.put("id", "t" + resultSet.getInt("TAXAID"));
			taxon.put("author", resultSet.getString("AUTHOR"));
			taxon.put("genus", resultSet.getString("GENUS"));
			String name = resultSet.getString("SHORTNAME");
			name = name.replace(".1111", "").replace(".1", "");
			taxon.put("name", name);
			taxa.put(taxon);
			
			String cls = resultSet.getString("CLASS");
			if (cls.trim().equals("") || cls.equals("1") || cls.equals("1111"))
			{
				cls = null;
			} 
			taxon.put("cls", cls);
			String genus = resultSet.getString("GENUS");
			if (genus.trim().equals("") || genus.equals("1") || genus.equals("1111"))
			{
				genus = null;
			}
			taxon.put("genus", genus);
			
			String species = resultSet.getString("SPECIES");
			if (species.trim().equals("") || species.equals("1") || species.equals("1111"))
			{
				species = null;
			}
			taxon.put("species", species);
			
			String fullName = "";
			if (genus != null)
			{
				fullName = genus;
			}
			if (species != null)
			{
				if (fullName.equals(""))
				{
					fullName = species;
				}
				else
				{
					fullName += " " + species; 
				}
			}
			taxon.put("fullName", fullName);
			
			int start = resultSet.getInt("FAD");
			int end = resultSet.getInt("LAD");
			taxon.put("start", start < end ? start : end);
			taxon.put("end", start < end ? end : start);
			
			taxon.put("appear", appear);
			taxon.put("disappear", disappear);
			
			if (!result.has("last") || disappear < result.getDouble("last"))
			{
				result.put("last", disappear);
			}
		}
		
		DbConnectionPoolFactory.getInstance().putBackConnection(resultSet.getStatement().getConnection());
		return result;
	}

	//@GET
	public JSONArray getTaxons() throws Exception
	{
		ResultSet resultSet = executeSql("call fossil01.FS_PROC_SQL_GET_SPECIES_LIVE_TIME()");
		
		JSONArray taxons = new JSONArray();
		while (resultSet.next())
		{
			JSONObject taxon = new JSONObject();
			taxon.put("id", "t" + resultSet.getInt("TAXAID"));
			taxon.put("author", resultSet.getString("AUTHOR"));
			
			String name = resultSet.getString("SHORTNAME");
			name = name.replace(".1111", "").replace(".1", "");
			taxon.put("name", name);
			
			String cls = resultSet.getString("CLASS");
			if (cls.trim().equals("") || cls.equals("1") || cls.equals("1111"))
			{
				cls = null;
			} 
			taxon.put("cls", cls);
			
			String genus = resultSet.getString("GENUS");
			if (genus.trim().equals("") || genus.equals("1") || genus.equals("1111"))
			{
				genus = null;
			}
			taxon.put("genus", genus);
			String species = resultSet.getString("SPECIES");
			if (species.trim().equals("") || species.equals("1") || species.equals("1111"))
			{
				species = null;
			}
			taxon.put("species", species);
			String fullName = "";
			if (genus != null)
			{
				fullName = genus;
			}
			if (species != null)
			{
				if (fullName.equals(""))
				{
					fullName = species;
				}
				else
				{
					fullName += " " + species; 
				}
			}
			taxon.put("fullName", fullName);
			
			
			int start = resultSet.getInt("START_IDX");
			int end = resultSet.getInt("END_IDX");
			taxon.put("start", start < end ? start : end);
			taxon.put("end", start < end ? end : start);			
			
			if (!resultSet.getString("YEAR").equals("*") && !resultSet.getString("YEAR").equals("Nich"))
			{
				try
				{
					taxon.put("year", resultSet.getInt("YEAR"));
				}
				catch (Exception e)
				{
					taxon.put("year", 0);
				}
			}
			else
			{
				taxon.put("year", 0);
			}
			
			taxons.put(taxon);
		}
		
		DbConnectionPoolFactory.getInstance().putBackConnection(resultSet.getStatement().getConnection());
		return taxons;
	}

	@GET
	@Path("{id}/section")
	public JSONArray getTaxonSectionList(@PathParam("id") String p_id) throws JSONException, SQLException
	{
		JSONArray result = new JSONArray();
		return result;
	}
	
	@GET
	@Path("diversity")
	public JSONArray getTaxonDiversity(
			@QueryParam("from") int p_from,
			@QueryParam("to") int p_to) throws Exception
	{
		ResultSet resultSet = executeSql("CALL FOSSIL01.FS_PROC_SQL_GET_SECTION_COUNT(?, ?)", p_from, p_to);
		
		JSONArray result = new JSONArray();
		while (resultSet.next())
		{
			JSONObject time = new JSONObject();
			time.put("index", resultSet.getInt("RANKID"));
			time.put("sectionId", resultSet.getInt("SECTIONID"));
			time.put("taxonCount", resultSet.getInt("TAXACOUNT"));
			result.put(time);
		}
		
		DbConnectionPoolFactory.getInstance().putBackConnection(resultSet.getStatement().getConnection());
		return result;
	}

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	public PreparedStatement createSqlStatement(String p_sql, Object... p_parameters) throws Exception
	{
		String convertedSQL = p_sql;
		for (int i = 0; i < p_parameters.length; i++)
		{
			if (p_parameters[i] != null)
			{
				convertedSQL = convertedSQL.replaceFirst("\\?", p_parameters[i].toString());
			}
			else
			{
				convertedSQL = convertedSQL.replaceFirst("\\?", "null");
			}
		}
		_logger.info("SQL: " + convertedSQL);

		Connection connection = null;
		connection = DbConnectionPoolFactory.getInstance().getConnection();
		
		PreparedStatement statement = connection.prepareStatement(p_sql);
		for (int i = 0; i < p_parameters.length; i++)
		{
			Object param = p_parameters[i];
			statement.setObject(i + 1, param);
		}
		
		return statement;
	}
	
	
	
	public ResultSet executeSql(String p_sql, Object... p_parameters) throws Exception
	{
		PreparedStatement statement = createSqlStatement(p_sql, p_parameters);
		try
		{
			statement.execute();

			ResultSet rs = statement.getResultSet();
			return rs;
		}
		finally
		{
			
		}
	}

	public static void main(String[] args) throws Exception
	{
		//System.out.println(new TaxonService().getTaxons().toString());
//		System.out.println(new TaxonService().getDiversityCurve("").toString());
		System.out.println(new TaxonService().getDistByClassYear("", 280.09).toString());
	}
}
