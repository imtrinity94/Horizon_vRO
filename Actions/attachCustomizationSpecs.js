/*
@Auto Export Created by VRA4U.COM:
Input Parameters:

n             t                 #cdata-section                                     
-             -                 --------------                                     
VMtocustomize VC:VirtualMachine                                                    
specName      string            Name of the customization Specification to look for


*/
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
