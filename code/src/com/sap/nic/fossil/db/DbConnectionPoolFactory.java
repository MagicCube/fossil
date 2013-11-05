package com.sap.nic.fossil.db;

import java.sql.Connection;

public class DbConnectionPoolFactory implements DbConnectionPool {
	private static DbConnectionPool pool = null;

	private DbConnectionPoolFactory() {
	}

	public static DbConnectionPool getInstance() {
		if (pool == null) {
			pool = new DbTomcatConnectionPool();
		}
		return pool;
	}

	public void setConnection(DbConnectionPool p_pool) {
		this.pool = p_pool;
	}

	@Override
	public Connection getConnection() throws Exception {
		return pool.getConnection();
	}

	@Override
	public void putBackConnection(Connection conn) throws Exception {
		pool.putBackConnection(conn);
	}

}
