# Stops a running Skill Bridge (the API on port 4000 and the website port it started on).
Set-Location -Path $PSScriptRoot
$ports = @(4000)
if (Test-Path logs\dev.log) {
  $match = Select-String -Path logs\dev.log -Pattern '\[web\].*Local.*localhost:(?:\x1b\[[0-9;]*m)*(\d+)' | Select-Object -Last 1
  if ($match) { $ports += [int]$match.Matches[0].Groups[1].Value }
}
foreach ($port in ($ports | Select-Object -Unique)) {
  $owners = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($id in $owners) {
    $proc = Get-Process -Id $id -ErrorAction SilentlyContinue
    if ($proc -and $proc.ProcessName -eq 'node') {
      Write-Host "Stopping $($proc.ProcessName) (PID $id) on port $port"
      Stop-Process -Id $id -Force
    }
  }
}
Write-Host 'Skill Bridge stopped.'
Start-Sleep 2
