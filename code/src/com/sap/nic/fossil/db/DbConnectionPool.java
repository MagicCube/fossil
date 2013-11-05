package com.sap.nic.fossil.db;

import java.sql.Connection;

public interface DbConnectionPool
{
	public Connection getConnection() throws Exception;
	public void putBackConnection(Connection conn) throws Exception;
}
