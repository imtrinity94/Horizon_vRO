/*
@Auto Export Created by VRA4U.COM:
Input Parameters:
*/
try{
	var configurationCategory = Server.getConfigurationElementCategoryWithPath("Library/View");
	var configurationElementCount = configurationCategory.configurationElements.length;
	
	for(var i=0; i<configurationElementCount; i++){
	    if(configurationCategory.configurationElements[i].name.match(/.*DA.*/ig)){
	        return configurationCategory.configurationElements[i];
	    }
	}
}catch(err){
    System.error('Error occurred while getting pod configuration elements');
    return null;
}	

