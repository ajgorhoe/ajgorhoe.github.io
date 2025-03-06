
# Clones or updates all repositories in this container repository.
Write-Host "`n`nCloning / updating all repositories in this container ...`n"

# Get the script directory such that relative paths can be resolved:
$scriptPath = $MyInvocation.MyCommand.Path
$scriptDir = Split-Path $scriptPath -Parent
$scriptFilename = [System.IO.Path]::GetFileName($scriptPath)

Write-Host "Script directory: $scriptDir"

Write-Host "`nUpdating IGLibFramework:"
& $(Join-Path $scriptDir "UpdateRepo_IGLibFramework.ps1")

Write-Host "`nUpdating igor:"
& $(Join-Path $scriptDir "UpdateRepo_igor.ps1")

Write-Host "`nUpdating IGLibFrameworkCodedoc:"
& $(Join-Path $scriptDir "UpdateRepo_IGLibFrameworkCodedoc.ps1")

Write-Host "`nUpdating Inverse:"
& $(Join-Path $scriptDir "UpdateRepo_Inverse.ps1")


Write-Host "  ... updating all repositoris in this container completed.`n`n"

