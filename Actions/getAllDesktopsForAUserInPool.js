﻿/**
 * @function getAllDesktopsForAUserInPool
 * @version 0.0.0
 * @param {string} poolName 
 * @param {string} username 
 * @returns {string}
 */
function getAllDesktopsForAUserInPool(poolName,username) {
	var DAConfiguration = System.getModule("com.daimler.actions").getDAConfigurationElement();
	var podConfiguration = System.getModule("com.daimler.actions").getPodConfigurationElement();
	var daUser = System.getModule("com.daimler.actions").getDA();
	var podAlias = System.getModule("com.vmware.library.view.configuration").getDefaultOrFirstPod(DAConfiguration, daUser);
	var machine = System.getModule("com.vmware.library.view.assignment").getAssignedMachine(poolName, podAlias, username, podConfiguration);
	if (machine)
	     return machine.name;
};
