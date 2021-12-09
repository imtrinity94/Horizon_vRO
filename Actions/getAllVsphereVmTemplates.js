/*
@Auto Export Created by VRA4U.COM:
Input Parameters:
*/
var vms = VcPlugin.allVirtualMachines;
var templates = []; // templates will be stored into this array
for each (var vm in vms) {
 if (vm.config != null && vm.config.template) {
   templates.push(vm.name);
  }
}

return templates;


