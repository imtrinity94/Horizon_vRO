Connect-HVServer -server horizon_fqdn -user admin@dom.ain -password password -Domain dom.ain
$poolName = $args[0]
$pattern = $args[1]
$maxMachine = $args[2]
$template = $args[3]
$custSpec = $args[4]
(get-content C:\Users\tempUser\Documents\vRAExecutionSetup\fullCloneTemplate.json) | foreach-object {$_ -replace "#poolName", $poolName} |  foreach-object {$_ -replace "#pattern", $pattern} |  foreach-object {$_ -replace "#maxMachine", $maxMachine} | foreach-object {$_ -replace "#template", $template} | foreach-object {$_ -replace "#custSpec", $custSpec} | set-content C:\Users\tempUser\Documents\TempFiles\createPool.json
New-HVPool -Spec C:\TempFiles\createPool.json -Confirm:$false
