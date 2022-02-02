﻿/**
 * @function findOneAvailableMachine
 * @version 1.0.688
 * @param {string} podAlias 
 * @param {string} poolId 
 * @param {ConfigurationElement} podConfiguration 
 * @returns {Any}
 */
function findOneAvailableMachine(podAlias,poolId,podConfiguration) {
	var pod = System.getModule("com.vmware.library.view.configuration").getPodDataObject(podAlias, podConfiguration);
	var desktopData = VwDesktopDataUtils.queryDesktopByDesktopId(pod, poolId);
	var machineData = VwMachineDataUtils.queryAllUnassignedMachines(pod, desktopData);
	
	if (!machineData || machineData.length == 0)
	{
	    throw new Error('Cannot find an unassigned machine in pod ' + podAlias + ' , pool ' + poolId);
	}
	else
	{
	    return machineData[0];
	}
};
