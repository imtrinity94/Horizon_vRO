﻿/**
 * @function getAllDesktopPools
 * @version 0.0.0
 * @returns {Array/string}
 */
function getAllDesktopPools() {
	var DAConfiguration = System.getModule("com.daimler.actions").getDAConfigurationElement();
	var podConfiguation = System.getModule("com.daimler.actions").getPodConfigurationElement();
	var cache = System.getModule("com.vmware.library.view.cache").getDAConfigCache(DAConfiguration);
	var daUser = System.getModule("com.daimler.actions").getDA();
	System.log(cache);
	var flag = false;
	cache = JSON.parse(cache);
		for each(var i in cache){
		System.log(i.dn);
			if(i.dn == daUser) 
				flag = true;
		}
	
	if(flag){
	var podAlias = System.getModule("com.vmware.library.view.configuration").getDefaultOrFirstPod(DAConfiguration , daUser);
	var pools = System.getModule("com.vmware.library.view.configuration").getAllDAPoolsOfPod(podAlias , DAConfiguration, 'desktop', daUser );
	return pools;
	}
	else throw "Delegated Administrator "+daUser+" not found in  Config Cache";
	
	
};
