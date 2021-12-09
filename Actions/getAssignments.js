/*
@Auto Export Created by VRA4U.COM:
Input Parameters:

n        t      #cdata-section
-        -      --------------
podAlias string               
poolId   string               


*/
var podConfiguration = System.getModule("com.daimler.actions").getPodConfigurationElement();
var machines = System.getModule("com.vmware.library.view.machine").getMachinesData(podAlias,poolId,podConfiguration);

var result = [];

for(var i=0; i<machines.length; i++)
{
    if(machines[i].user)
    {
        result.push(System.getModule("com.vmware.library.view.util").pairToString(machines[i].user, machines[i].machineName));
    }
}

return result;
