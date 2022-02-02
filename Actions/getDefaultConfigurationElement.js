﻿/**
 * @function getDefaultConfigurationElement
 * @version 1.0.688
 * @param {string} filter 
 * @returns {ConfigurationElement}
 */
function getDefaultConfigurationElement(filter) {
	try{
		var configurationCategory = Server.getConfigurationElementCategoryWithPath("Library/View");
		var configurationElementCount = configurationCategory.configurationElements.length;
		
		for(var i=0; i<configurationElementCount; i++){
		    if(configurationCategory.configurationElements[i].name.match(new RegExp('.*' + filter + '.*', 'gi'))){
		        return configurationCategory.configurationElements[i];
		    }
		}
	}catch(err){
	    System.error('Error occurred while getting pod configuration elements');
	    return null;
	}	
	
};
