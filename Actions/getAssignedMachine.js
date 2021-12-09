/*
@Auto Export Created by VRA4U.COM:
Input Parameters:

n                t                    #cdata-section
-                -                    --------------
poolId           string                             
podAlias         string                             
userName         string                             
podConfiguration ConfigurationElement               


*/
try{
	var pod = System.getModule("com.vmware.library.view.configuration").getPodDataObject(podAlias, podConfiguration);
	var desktopData = VwDesktopDataUtils.queryDesktopByDesktopId(pod, poolId);
	var userInfo = System.getModule("com.vmware.library.view.util").parseUser(userName);
	return VwDesktopDataUtils.getAssignedMachine(pod ,desktopData , userInfo.userName, userInfo.domain);
}catch(err){
    System.error('Error occurred while trying to find an assgined machine for user ' + userName + ', and the error is ' + err);
    return null;
}
