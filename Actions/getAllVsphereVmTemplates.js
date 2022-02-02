﻿/**
 * @function getAllVsphereVmTemplates
 * @version 0.0.0
 * @returns {Array/string}
 */
function getAllVsphereVmTemplates() {
	var vms = VcPlugin.allVirtualMachines;
	var templates = []; // templates will be stored into this array
	for each (var vm in vms) {
	 if (vm.config != null && vm.config.template) {
	   templates.push(vm.name);
	  }
	}
	
	return templates;
	
	
};
