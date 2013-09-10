package com.sap.nic.fossil.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.sap.nic.fossil.conf.Config;

public class DbConnectionPool
{
	private ArrayList<Connection> _connections = new ArrayList<Connection>();

	private DbConnectionPool(String p_dbName)
	{
		_dbName = p_dbName;

		try
		{
			Class.forName("com.sap.db.jdbc.Driver");
		}
		catch (ClassNotFoundException e)
		{
			throw new RuntimeException("SAP HANA's JDBC driver is not found.");
		}

		String value = null;
		try
		{
			value = Config.getString("db." + _dbName + ".url");
		}
		catch (Exception e)
		{
		}
		if (value == null)
		{
			throw new RuntimeException("'" + p_dbName + "' is not found in itraffic-virtual-labs.properties.");
		}

		for (int i = 0; i < getInitialPoolSize(); i++)
		{
			try
			{
				Connection connection = DriverManager.getConnection(getUrl(), getUserName(), getPassword());
				_connections.add(connection);
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
	}

	private static Map<String, DbConnectionPool> _connectionPools = new HashMap<String, DbConnectionPool>();

	public static DbConnectionPool getConnectionPool(String p_dbName)
	{
		if (!_connectionPools.containsKey(p_dbName))
		{
			DbConnectionPool connectionPool = new DbConnectionPool(p_dbName);
			_connectionPools.put(p_dbName, connectionPool);
		}
		return _connectionPools.get(p_dbName);
	}

	public static DbConnectionPool getDefaultConnectionPool()
	{
		return getConnectionPool("default");
	}

	private String _dbName = null;

	public String getDbName()
	{
		return _dbName;
	}

	public String getUrl()
	{
		return Config.getString("db." + _dbName + ".url");
	}

	public String getUserName()
	{
		return Config.getString("db." + _dbName + ".username");
	}

	public String getPassword()
	{
		return Config.getString("db." + _dbName + ".password");
	}

	private int _initialPoolSize = -1;

	public int getInitialPoolSize()
	{
		if (_initialPoolSize == -1)
		{
			try
			{
				_initialPoolSize = Config.getInt("db." + _dbName + ".poolsize");
			}
			catch (Exception e)
			{
				_initialPoolSize = 10;
			}
		}
		return _initialPoolSize;
	}

	public synchronized Connection getConnection()
	{
		Connection connection = null;
		while (_connections.size() == 0)
		{
			try
			{
				wait();
			}
			catch (InterruptedException e)
			{
				e.printStackTrace();
			}
		}
		connection = _connections.get(0);
		_connections.remove(0);
		return connection;
	}

	public synchronized void returnConnection(Connection connection)
	{
		_connections.add(connection);
		notifyAll();
	}
	
	public void test()
	{
		try
		{
			Connection conn = getConnection();
			ResultSet rs = conn.createStatement().executeQuery("SELECT COUNT(*) FROM M_TABLES");
			while (rs.next())
			{
				
			}
			System.out.println("The connection pool '" + getDbName() + "' is now working properly.");
			returnConnection(conn);
		}
		catch (SQLException e)
		{
			e.printStackTrace();
		}
	}


	public static void main(String[] args)
	{
		DbConnectionPool.getDefaultConnectionPool().test();
	}

}
