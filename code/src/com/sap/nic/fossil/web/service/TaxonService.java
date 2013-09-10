package com.sap.nic.fossil.web.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.sap.nic.fossil.db.DbConnectionPool;

@Path("taxon")
public class TaxonService
{
	private static final Logger _logger = Logger.getLogger(TaxonService.class);

	@GET
	public JSONArray getTaxons() throws JSONException, SQLException
	{
		ResultSet resultSet = executeSql("call fossil.FS_PROC_SQL_GET_SPECIES_LIVE_TIME()");
		
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
			
			
			int start = resultSet.getInt("STARTPOS");
			int end = resultSet.getInt("ENDPOS");
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
		return taxons;
	}

	@GET
	@Path("{id}/section")
	public JSONArray getTaxonSectionList(@PathParam("id") String p_id) throws JSONException, SQLException
	{
		JSONArray result = new JSONArray();
		return result;
	}

	public ResultSet executeSql(String p_sql, Object... p_parameters) throws SQLException
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
		_logger.info("Executing SQL: " + convertedSQL);

		Connection connection = null;
		while (connection == null)
		{
			connection = DbConnectionPool.getDefaultConnectionPool().getConnection();
		}

		try
		{
			PreparedStatement statement = connection.prepareStatement(p_sql);
			for (int i = 0; i < p_parameters.length; i++)
			{
				Object param = p_parameters[i];
				statement.setObject(i + 1, param);
			}

			statement.execute();

			ResultSet rs = statement.getResultSet();

			_logger.info("Finish running SQL: " + convertedSQL);
			return rs;
		}
		finally
		{
			DbConnectionPool.getDefaultConnectionPool().returnConnection(connection);
		}
	}

	public static void main(String[] args) throws JSONException, SQLException
	{
		System.out.println(new TaxonService().getTaxons().toString());
	}
}
