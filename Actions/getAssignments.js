﻿/**
 * @function getAssignments
 * @version 1.0.688
 * @param {string} podAlias 
 * @param {string} poolId 
 * @returns {Array/string}
 */
function getAssignments(podAlias,poolId) {
	var podConfiguration = System.getModule("com.daimler.actions").getPodConfigurationElement();
	var machines = System.getModule("com.vmware.library.view.machine").getMachinesData(podAlias,poolId,podConfiguration);
	
	var result = [];
	
	for(var i=0; i<machines.length; i++)
	{
	    if(machines[i].user)
	    {
	        result.push(System.getModule("com.vmware.library.view.util").pairToString(machines[i].user, machines[i].machineName));
	    }
	}
	
	return result;
};
