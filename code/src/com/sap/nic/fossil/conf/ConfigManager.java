package com.sap.nic.fossil.conf;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class ConfigManager
{
	private static ConfigManager instance = null;
	private Properties properties = null;

	private ConfigManager()
	{
		_loadConfig();
	}

	public static ConfigManager getInstance()
	{
		if (instance == null)
		{
			synchronized (ConfigManager.class)
			{
				instance = new ConfigManager();
			}
		}
		return instance;
	}

	public Properties getConfig()
	{
		return properties;
	}

	private void _loadConfig()
	{
		InputStream in = null;
		try
		{
			in = new BufferedInputStream(new FileInputStream(this.getClass().getResource("/").getFile() + "fossil.properties"));
		}
		catch (FileNotFoundException e)
		{
			e.printStackTrace();
		}
		try
		{
			properties = new Properties();
			properties.load(in);
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		finally
		{
			try
			{
				if (in != null)
				{
					in.close();
				}
			}
			catch (IOException e)
			{
				e.printStackTrace();
			}
		}

	}
}
