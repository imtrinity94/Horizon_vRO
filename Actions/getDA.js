﻿/**
 * @function getDA
 * @version 0.0.0
 * @returns {string}
 */
function getDA() {
	var DAConfiguration = System.getModule("com.daimler.actions").getDAConfigurationElement();
	var cache = JSON.parse(System.getModule("com.vmware.library.view.cache").getDAConfigCache(DAConfiguration));
	return cache[0].dn;
	
};
