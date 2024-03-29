﻿/**
 * @function getAllDesktopsForAUser
 * @version 0.0.0
 * @param {string} daUser 
 * @param {string} podName 
 * @param {string} username 
 * @returns {Array/string}
 */
function getAllDesktopsForAUser(daUser,podName,username) {
	// daUser String
	//podName=HorizonPod string
	//username string for which desktops has to be found
	var DAConfiguration = System.getModule("com.daimler.actions").getDAConfigurationElement();
	var podConfiguration = System.getModule("com.daimler.actions").getPodConfigurationElement();
	var cache = JSON.parse(System.getModule("com.vmware.library.view.cache").getDAConfigCache(DAConfiguration));
	var flag = false;
	var userDesktops = [];
	
	for each(var i in cache) {
	    System.log(i.dn);
	    if (i.dn == daUser)
	        flag = true;
	}
	
	if (flag) {
	    var podAlias = System.getModule("com.vmware.library.view.configuration").getDefaultOrFirstPod(DAConfiguration, daUser);
	    var pools = System.getModule("com.vmware.library.view.configuration").getAllDAPoolsOfPod(podAlias, DAConfiguration, 'desktop', daUser);
	    //System.log(pools);
	} else throw "Delegated Administrator " + daUser + " not found in  Config Cache. Cannot Proceed!";
	
	for each(var _pool in pools) {
	
	    var machine = System.getModule("com.vmware.library.view.assignment").getAssignedMachine(_pool, podName, username, podConfiguration);
	    if (machine)
	        userDesktops.push(machine.name);
	
	}
	
	return userDesktops;
};
