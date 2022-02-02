﻿/**
 * @function repristineMachine
 * @version 1.0.688
 * @param {string} podAlias 
 * @param {string} poolId 
 * @param {string} machineName 
 * @param {ConfigurationElement} podConfiguration 
 * @returns {void}
 */
function repristineMachine(podAlias,poolId,machineName,podConfiguration) {
	var podObject = System.getModule("com.vmware.library.view.configuration").getPodDataObject(podAlias, podConfiguration);
	var desktopData = VwDesktopDataUtils.queryDesktopByDesktopId(podObject, poolId);
	var machineData = VwMachineDataUtils.queryMachineFromDesktopByMachineName(podObject, desktopData, machineName);
	System.log('repristineMachine - podAlias = ' + podAlias + ', poolId=' + poolId + ', machine name = ' + machineName);
	VwDesktopDataUtils.refreshMachinesOfDesktop(podObject, desktopData, [machineData], true);
};
