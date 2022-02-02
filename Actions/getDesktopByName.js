﻿/**
 * @function getDesktopByName
 * @version 0.0.0
 * @param {string} desktopName 
 * @returns {Array/string}
 */
function getDesktopByName(desktopName) {
	var DAConfiguration = System.getModule("com.daimler.actions").getDAConfigurationElement();
	var podConfiguration = System.getModule("com.daimler.actions").getPodConfigurationElement();
	var cache = System.getModule("com.vmware.library.view.cache").getDAConfigCache(DAConfiguration);
	var daUser = System.getModule("com.daimler.actions").getDA();
	var allMachines = [];
	var flag = false;
	cache = JSON.parse(cache);
	for each(var i in cache) {
	    System.log(i.dn);
	    if (i.dn == daUser)
	        flag = true;
	}
	
	if (flag) {
	    var podAlias = System.getModule("com.vmware.library.view.configuration").getDefaultOrFirstPod(DAConfiguration, daUser);
	    var pools = System.getModule("com.vmware.library.view.configuration").getAllDAPoolsOfPod(podAlias, DAConfiguration, 'desktop', daUser);
	    System.log(pools);
	} else throw "Delegated Administrator " + daUser + " not found in  Config Cache";
	for each(_pool in pools) {
	    var pod = System.getModule("com.vmware.library.view.configuration").getPodDataObject(podAlias, podConfiguration); //Convert "HorizonPOd" to PodClassObject
	    var desktopData = VwDesktopDataUtils.queryDesktopByDesktopId(pod, _pool);
	    var machines = VwMachineDataUtils.queryAllMachines(pod, desktopData, false);
	    for each(machine in machines)
	    	allMachines.push(machine);
	}
	var arrayOfMachineNames = [];
	for each(var mach in allMachines) {
	    if(mach.name.toLowerCase().match(desktopName.toLowerCase())){
			arrayOfMachineNames.push(mach.name);
		}
	}
	return arrayOfMachineNames;
};
