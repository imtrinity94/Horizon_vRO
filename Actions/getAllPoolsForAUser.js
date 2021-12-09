/*
@Auto Export Created by VRA4U.COM:
Input Parameters:

n        t      #cdata-section
-        -      --------------
username string               


*/
var DAConfiguration = System.getModule("com.daimler.actions").getDAConfigurationElement();
var podConfiguration = System.getModule("com.daimler.actions").getPodConfigurationElement();
var cache = JSON.parse(System.getModule("com.vmware.library.view.cache").getDAConfigCache(DAConfiguration));
var daUser = System.getModule("com.daimler.actions").getDA();
var flag = false;
var userPools = [];

for each(var i in cache) {
    System.log(i.dn);
    if (i.dn == daUser)
        flag = true;
}

if (flag) {
    var podAlias = System.getModule("com.vmware.library.view.configuration").getDefaultOrFirstPod(DAConfiguration, daUser);
    var pools = System.getModule("com.vmware.library.view.configuration").getAllDAPoolsOfPod(podAlias, DAConfiguration, 'desktop', daUser);
    //System.log(pools);
} else throw "Delegated Administrator " + daUser + " not found in  Config Cache. Cannot Proceed!";

for each(var _pool in pools) {

    var machine = System.getModule("com.vmware.library.view.assignment").getAssignedMachine(_pool, podAlias, username, podConfiguration);
    if (machine)
        userPools.push(_pool);

}

return userPools;
