/*
@author Mayank Goyal [mayankgoyalmax@gmail.com]
Input Parameters:

n                t                    #cdata-section
-                -                    --------------
podAlias         string                             
poolId           string                             
machineName      string                             
podConfiguration ConfigurationElement               


*/
var podObject = System.getModule("com.vmware.library.view.configuration").getPodDataObject(podAlias, podConfiguration);
var desktopData = VwDesktopDataUtils.queryDesktopByDesktopId(podObject, poolId);
var machineData = VwMachineDataUtils.queryMachineFromDesktopByMachineName(podObject, desktopData, machineName);
System.log('repristineMachine - podAlias = ' + podAlias + ', poolId=' + poolId + ', machine name = ' + machineName);
VwDesktopDataUtils.refreshMachinesOfDesktop(podObject, desktopData, [machineData], true);
