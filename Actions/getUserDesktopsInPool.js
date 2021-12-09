/*
@author Mayank Goyal [mayankgoyalmax@gmail.com]
Input Parameters:

n        t      #cdata-section
-        -      --------------
poolId   string               
userName string               


*/
var DAConfiguration = System.getModule("com.daimler.actions").getDAConfigurationElement();
var podConfiguation = System.getModule("com.daimler.actions").getPodConfigurationElement();
var daUser = System.getModule("com.daimler.actions").getDA();
var podAlias = System.getModule("com.vmware.library.view.configuration").getDefaultOrFirstPod(DAConfiguration, daUser);
var machine = System.getModule("com.vmware.library.view.assignment").getAssignedMachine(poolId, podAlias, userName, podConfiguration);
if (machine)
    return machine.name;
else
    return null;
