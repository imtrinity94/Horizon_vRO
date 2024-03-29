﻿/**
 * @function attachCustomizationSpecs
 * @version 0.0.0
 * @param {VC:VirtualMachine} VMtocustomize 
 * @param {string} specName Name of the customization Specification to look for
 * @returns {VC:Task}
 */
function attachCustomizationSpecs(VMtocustomize,specName) {
	var custspec = new VcCustomizationSpec();
	var con = VcPlugin.allSdkConnections[0];
	var cms = con.customizationSpecManager;
	var customSpecExists = cms.doesCustomizationSpecExist(specName);
	if (customSpecExists) {
	    var customSpecItem = cms.getCustomizationSpec(specName);
	    System.debug("got custSpecItem: " + customSpecItem);
	    custspec = customSpecItem.spec;
	    System.debug("contents custSpec: " + custspec);
	    VMtocustomize.customizeVM_Task(custspec);
	    //let it sleep so it is ready
	    System.sleep(10 * 1000);
	    //Start the VM
	    return VMtocustomize.powerOnVM_Task(null);
	} else System.error(specName + "customization specification not found in vSphere. Please check!");
	return null;
};
