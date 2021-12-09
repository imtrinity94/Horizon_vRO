/*
@Auto Export Created by VRA4U.COM:
Input Parameters:

n        t      #cdata-section
-        -      --------------
poolName string               
username string               


*/
var DAConfiguration = System.getModule("com.daimler.actions").getDAConfigurationElement();
var podConfiguration = System.getModule("com.daimler.actions").getPodConfigurationElement();
var daUser = System.getModule("com.daimler.actions").getDA();
var podAlias = System.getModule("com.vmware.library.view.configuration").getDefaultOrFirstPod(DAConfiguration, daUser);
var machine = System.getModule("com.vmware.library.view.assignment").getAssignedMachine(poolName, podAlias, username, podConfiguration);
if (machine)
     return machine.name;
