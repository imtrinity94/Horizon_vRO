/*
@Auto Export Created by VRA4U.COM:
Input Parameters:
*/
var DAConfiguration = System.getModule("com.daimler.actions").getDAConfigurationElement();
var cache = JSON.parse(System.getModule("com.vmware.library.view.cache").getDAConfigCache(DAConfiguration));
return cache[0].dn;

