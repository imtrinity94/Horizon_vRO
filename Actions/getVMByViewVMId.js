﻿/**
 * @function getVMByViewVMId
 * @version 1.0.688
 * @param {string} machineId 
 * @param {string} podAlias 
 * @param {string} podConfiguration 
 * @returns {VC:VirtualMachine}
 */
function getVMByViewVMId(machineId,podAlias,podConfiguration) {
	    var validator = function(cond, err){
	       if(!cond){
	          throw new Error(err);
	       }
	    };
		var podData = System.getModule("com.vmware.library.view.configuration").getPodDataObject(podAlias, podConfiguration);
		validator(podData!=null, 'Cannot get pod data');
		var machineInfo = VwMachineDataUtils.getMachineInfo(podData, machineId);
		validator(machineInfo!=null, 'Cannot get view machine info');
		var managedMachineData = machineInfo.getManagedMachineData();
		validator(managedMachineData!=null, 'Cannot get view managed machine data');
		var virtualCenterData = managedMachineData.getVirtualCenterData();
		validator(virtualCenterData!=null, 'Cannot get view virtual center data');
		var path = virtualCenterData.getPath();
		var virtualCenterId = virtualCenterData.getVirtualCenter().getId();
		var hostName = virtualCenterData.getHostname();
		var virtualCenterName = VwVirtualCenterDataUtils.getVirtualCenterName(podData , virtualCenterId);
		var viewHostName = null;
		    try{ viewHostName = System.resolveIpAddress(hostName);}catch(err){}
		    var viewHostIP = null;
		    try{ viewHostIP = System.resolveHostName(hostName);}catch(err){}
		    var viewVirtualCenterHostName = null;
		    var viewVirtualCenterHostIP = null;
		    try{ viewVirtualCenterHostIP = System.resolveHostName(virtualCenterName);}catch(err){}
		    try{ viewVirtualCenterHostName = System.resolveIpAddress(virtualCenterName);}catch(err){}
		
		var viewMachineInfo = {path:path, hostName:hostName, virtualCenterName:virtualCenterName, name:machineInfo.getBase().getName(),
		    resolvedHostName:viewHostName, resolvedHostIP:viewHostIP, resolvedVCName:viewVirtualCenterHostName, resolvedVCIP:viewVirtualCenterHostIP};
		System.log('View machine info is ' + JSON.stringify(viewMachineInfo));
		
		var matchVirtualCenter = function(sdkConnection, viewMachineInfo){
		    var sdkConnectionName = sdkConnection.name;
		    System.log('Checking ' + sdkConnectionName);
		
		    var protocalIndex = sdkConnectionName.indexOf('://');
		
		    if(protocalIndex >=0 ){
		        sdkConnectionName = sdkConnectionName.substring(protocalIndex + '://'.length, sdkConnectionName.length);
		    }
		
		    var suffixIndex1 = sdkConnectionName.indexOf(':');
		    var suffixIndex2 = sdkConnectionName.indexOf('/');
		
		    if(suffixIndex1 > 0 && suffixIndex2 >0){
		        sdkConnectionName = sdkConnectionName.substring(0, Math.min(suffixIndex1, suffixIndex2));
		    }
		    else if(suffixIndex1 > 0){
		        sdkConnectionName = sdkConnectionName.substring(0, suffixIndex1);
		    }
		    else if(suffixIndex2 > 0){
		        sdkConnectionName = sdkConnectionName.substring(0, suffixIndex2);
		    }
		
		    System.log('Trying to extract host name for ' + sdkConnection.name + ', and the result is ' + sdkConnectionName);
		    
		    sdkConnectionName = sdkConnectionName.toLowerCase();
		    var viewVirtualCenterNames = [viewMachineInfo.resolvedVCName.toLowerCase(), viewMachineInfo.resolvedVCIP.toLowerCase(), viewMachineInfo.virtualCenterName.toLowerCase()];
		
		    System.log('Check virtual center name ' + JSON.stringify(viewVirtualCenterNames));
		
		    for(var i=0; i<viewVirtualCenterNames.length; i++){
		       if(sdkConnectionName == viewVirtualCenterNames[i]){
		           System.log('Match virtual center name ' + sdkConnectionName);
		           return true;
		       }
		    }
		
		    var hostSystems = sdkConnection.allHostSystems;
		
		    var viewHostNames = [viewMachineInfo.hostName.toLowerCase(), viewMachineInfo.resolvedHostName.toLowerCase(), viewMachineInfo.resolvedHostIP.toLowerCase()];
		    System.log('Check view host names ' + JSON.stringify(viewHostNames));
		
		    for(var j in hostSystems){
			   var hostName = hostSystems[j].name.toLowerCase();
			
			    for(var i=0; i<viewHostNames.length; i++){
			        if(hostName == viewHostNames[i]){
			            System.log('Match host name ' + hostName);
			            return true;
			        }
			    }
			}
			
			return false;
		};
		
		var sdkConnections = VcPlugin.allSdkConnections;
		
		for(var i=0; i<sdkConnections.length; i++){
		   var sdkConnection = sdkConnections[i];
		
		   try{
		        if(!matchVirtualCenter(sdkConnection, viewMachineInfo)){
		            continue;
		        }
		
				return sdkConnection.searchIndex.findByInventoryPath(viewMachineInfo.path);
			}
			catch(err){
			    try{
			       System.warn('Error occurred while trying to find machine in vCenter ' + sdkConnection.name + ', and the error is ' + err);
			    }catch(err){}
			}
		}
		
		throw new Error('Cannot find vCenter host for the View Machine, please configure the View Machine\'s host ' + virtualCenterName + ' as a vCenter host in vCO firstly');
	
};
