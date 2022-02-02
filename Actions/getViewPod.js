﻿/**
 * @function getViewPod
 * @version 1.0.688
 * @returns {string}
 */
function getViewPod() {
	var viewPodConfigurationElement =  System.getModule("com.daimler.actions").getPodConfigurationElement() ;
	var viewPodConfigurations = viewPodConfigurationElement.attributes;
	var length = viewPodConfigurations.length;
	var i = 0;
	var viewServerHosts = [];
	for (i = 0; i < length; i++) {
		System.log(viewPodConfigurations[i]);
		viewServerHosts.push(viewPodConfigurations[i].name);
	}
	return viewServerHosts[0];
};
