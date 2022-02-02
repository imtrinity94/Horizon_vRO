﻿/**
 * @function getAssignedMachine
 * @version 
 * @param {string} poolId 
 * @param {string} podAlias 
 * @param {string} userName 
 * @param {ConfigurationElement} podConfiguration 
 * @returns {Any}
 */
function getAssignedMachine(poolId,podAlias,userName,podConfiguration) {
	try{
		var pod = System.getModule("com.vmware.library.view.configuration").getPodDataObject(podAlias, podConfiguration);
		var desktopData = VwDesktopDataUtils.queryDesktopByDesktopId(pod, poolId);
		var userInfo = System.getModule("com.vmware.library.view.util").parseUser(userName);
		return VwDesktopDataUtils.getAssignedMachine(pod ,desktopData , userInfo.userName, userInfo.domain);
	}catch(err){
	    System.error('Error occurred while trying to find an assgined machine for user ' + userName + ', and the error is ' + err);
	    return null;
	}
};
