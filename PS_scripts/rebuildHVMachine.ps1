Connect-HVServer -server horizon_fqdn -user admin@dom.ain -password password -Domain dom.ain
function Get-ViewAPIService {
  param(
    [Parameter(Mandatory = $false)]
    $HvServer
  )
  if ($null -ne $hvServer) {
    if ($hvServer.GetType().name -ne 'ViewServerImpl') {
      $type = $hvServer.GetType().name
      Write-Error "Expected hvServer type is ViewServerImpl, but received: [$type]"
      return $null
    }
    elseif ($hvServer.IsConnected) {
      return $hvServer.ExtensionData
    }
  } elseif ($global:DefaultHVServers.Length -gt 0) {
     $hvServer = $global:DefaultHVServers[0]
     return $hvServer.ExtensionData
  }
  return $null
}
function Find-HVMachine {
  [CmdletBinding()]
  param(
    [Parameter(Mandatory = $true)]
    $Param
  )

  $params = $Param

  try {
    if ($params['PoolName']) {
      $poolObj = Get-HVPoolSummary -poolName $params['PoolName'] -suppressInfo $true -hvServer $params['HvServer']
      if ($poolObj.Length -ne 1) {
        Write-Host "Failed to retrieve specific pool object with given PoolName : " $params['PoolName']
        break;
      } else {
        $desktopId = $poolObj.Id
      }
    }
  } catch {
    Write-Error "Make sure Get-HVPoolSummary advanced function is loaded, $_"
    break
  }
  #
  # This translates the function arguments into the View API properties that must be queried
  $machineSelectors = @{
    'PoolName' = 'base.desktop';
    'MachineName' = 'base.name';
    'DnsName' = 'base.dnsName';
    'State' = 'base.basicState';
  }


  $query_service_helper = New-Object VMware.Hv.QueryServiceService
  $query = New-Object VMware.Hv.QueryDefinition

  $wildCard = $false
  #Only supports wild card '*'
  if ($params['MachineName'] -and $params['MachineName'].contains('*')) {
    $wildcard = $true
  }
  if ($params['DnsName'] -and $params['DnsName'].contains('*')) {
    $wildcard = $true
  }
  # build the query values, MachineNamesView is having more info than
  # MachineSummaryView
  $query.queryEntityType = 'MachineNamesView'
  if (! $wildcard) {
    [VMware.Hv.queryfilter[]]$filterSet = @()
    foreach ($setting in $machineSelectors.Keys) {
      if ($null -ne $params[$setting]) {
        $equalsFilter = New-Object VMware.Hv.QueryFilterEquals
        $equalsFilter.memberName = $machineSelectors[$setting]
        if ($equalsFilter.memberName -eq 'base.desktop') {
            $equalsFilter.value = $desktopId
        } else {
            $equalsFilter.value = $params[$setting]
        }
        $filterSet += $equalsFilter
      }
    }
    if ($filterSet.Count -gt 0) {
      $andFilter = New-Object VMware.Hv.QueryFilterAnd
      $andFilter.Filters = $filterset
      $query.Filter = $andFilter
    }
    $machineList = @()
    $GetNext = $false
    $queryResults = $query_service_helper.QueryService_Create($services, $query)
    do {
      if ($GetNext) { $queryResults = $query_service_helper.QueryService_GetNext($services, $queryResults.id) }
      $machineList += $queryResults.results
      $GetNext = $true
    } while ($queryResults.remainingCount -gt 0)
    $query_service_helper.QueryService_Delete($services, $queryResults.id)
  }
  if ($wildcard -or [string]::IsNullOrEmpty($machineList)) {
    $query.Filter = $null
    $machineList = @()
    $GetNext = $false
    $queryResults = $query_service_helper.QueryService_Create($services,$query)
    do {
      if ($GetNext) { $queryResults = $query_service_helper.QueryService_GetNext($services, $queryResults.id) }
      $strFilterSet = @()
      foreach ($setting in $machineSelectors.Keys) {
        if ($null -ne $params[$setting]) {
          if ($wildcard -and (($setting -eq 'MachineName') -or ($setting -eq 'DnsName')) ) {
            $strFilterSet += '($_.' + $machineSelectors[$setting] + ' -like "' + $params[$setting] + '")'
          } else {
            $strFilterSet += '($_.' + $machineSelectors[$setting] + ' -eq "' + $params[$setting] + '")'
          }
        }
      }
      $whereClause =  [string]::Join(' -and ', $strFilterSet)
      $scriptBlock = [Scriptblock]::Create($whereClause)
      $machineList += $queryResults.results | Where-Object $scriptBlock
      $GetNext = $true
    } while ($queryResults.remainingCount -gt 0)
    $query_service_helper.QueryService_Delete($services, $queryResults.id)
  }
  return $machineList
}

function Rebuild-HVMachine {
	<#
	.Synopsis
	   Rebuilds Horizon View desktops.
	.DESCRIPTION
	   Queries and rebuilds virtual machines (create new cloned VM with same name from same template and applies same customization specification), the machines list would be determined
     based on queryable fields machineName. Use an asterisk (*) as wildcard. If the result has multiple machines all will be reset.
     Please note that on an Instant Clone Pool this will do the same as a recover of the machine.
	.PARAMETER MachineName
	   The name of the Machine(s) to query for.
	   This is a required value.
	.PARAMETER HvServer
		Reference to Horizon View Server to query the virtual machines from. If the value is not passed or null then
		first element from global:DefaultHVServers would be considered in-place of hvServer
	.EXAMPLE
	   rebuild-HVMachine -MachineName 'PowerCLIVM'
	   Queries VM(s) with given parameter machineName
	.EXAMPLE
	   rebuild-HVMachine -MachineName 'PowerCLIVM*'
	   Queries VM(s) with given parameter machinename with wildcard character *
	.NOTES
		Author                      : Mayank Goyal
		Author email                : mayankgoyalmax@gmail.com
		Version                     : 1.0
		===Tested Against Environment====
		Horizon View Server Version : 7.3.2
		PowerCLI Version            : PowerCLI 6.5, PowerCLI 6.5.1
		PowerShell Version          : 5.0
	#>

  <#
  [CmdletBinding(
  SupportsShouldProcess = $true,
  ConfirmImpact = 'High'
  )]
  #>

  param(

  [Parameter(Mandatory = $true)]
  [string]
  $MachineName,

  [Parameter(Mandatory = $false)]
  $HvServer = $null
  )

  Begin {

    $services = Get-ViewAPIService -hvServer $hvServer

    if ($null -eq $services) {
      Write-Error "Could not retrieve ViewApi services from connection object"
      break
    }

    $machineList = Find-HVMachine -Param $PSBoundParameters

    if (!$machineList) {
      Write-Host "Rebuild-HVMachine: No Virtual Machine(s) Found with given search parameters"
      break
    }
  }
  Process {
    if ($Force -or $PSCmdlet.ShouldProcess($MachineName)) {
      foreach ($machine in $machinelist){
        $services.machine.Machine_RebuildMachines($machine.id)
      }
    }
  }
  End {
    [System.gc]::collect()
  }
}
Rebuild-HVMachine -MachineName $args[0]
