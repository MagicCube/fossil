package com.sap.nic.fossil.db;

import java.sql.Connection;

import javax.naming.InitialContext;

import org.apache.tomcat.dbcp.dbcp.BasicDataSource;


public class DbTomcatConnectionPool implements DbConnectionPool
{
    @Override
    public Connection getConnection() throws Exception
    {
        InitialContext ctx = new InitialContext();
        BasicDataSource ds = (BasicDataSource) ctx.lookup("java:comp/env/jdbc/hana");
        return ds.getConnection();
    }

    @Override
    public void putBackConnection(Connection conn) throws Exception
    {
        if (conn != null)
        {
            conn.close();
        }
    }
}
