package com.sap.nic.fossil.conf;

public class Config
{
	public static String getString(String key)
	{
		return ConfigManager.getInstance().getConfig().getProperty(key);
	}
	
	public static int getInt(String key)
	{
		return Integer.parseInt(ConfigManager.getInstance().getConfig().getProperty(key));
	}	
}
