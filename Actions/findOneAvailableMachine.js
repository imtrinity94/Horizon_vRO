/*
@author Mayank Goyal [mayankgoyalmax@gmail.com]
Input Parameters:

n                t                    #cdata-section
-                -                    --------------
podAlias         string                             
poolId           string                             
podConfiguration ConfigurationElement               


*/
var pod = System.getModule("com.vmware.library.view.configuration").getPodDataObject(podAlias, podConfiguration);
var desktopData = VwDesktopDataUtils.queryDesktopByDesktopId(pod, poolId);
var machineData = VwMachineDataUtils.queryAllUnassignedMachines(pod, desktopData);

if (!machineData || machineData.length == 0)
{
    throw new Error('Cannot find an unassigned machine in pod ' + podAlias + ' , pool ' + poolId);
}
else
{
    return machineData[0];
}
