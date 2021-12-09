Connect-HVServer -server s365d1vrexmc01.in365.corpintra.net -user a365_s_osdeploy@apac.corpdir.net -password D!cv@dm!N%9876543210 -Domain apac.corpdir.net
$poolName = $args[0]
$pattern = $args[1]
$maxMachine = $args[2]
$template = $args[3]
$custSpec = $args[4]
(get-content C:\Users\a365_s_osdeploy\Documents\vRAExecutionSetup\fullCloneTemplate.json) | foreach-object {$_ -replace "#poolName", $poolName} |  foreach-object {$_ -replace "#pattern", $pattern} |  foreach-object {$_ -replace "#maxMachine", $maxMachine} | foreach-object {$_ -replace "#template", $template} | foreach-object {$_ -replace "#custSpec", $custSpec} | set-content C:\Users\a365_s_osdeploy\Documents\TempFiles\createPool.json
New-HVPool -Spec C:\Users\a365_s_osdeploy\Documents\TempFiles\createPool.json -Confirm:$false
