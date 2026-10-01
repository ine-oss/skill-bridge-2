# Installs packages, prepares the database and starts Skill Bridge (API + website).
# Output is also written to logs\setup.log and logs\dev.log.
# 'Continue': native tools (docker, npm) write progress to stderr, which Windows PowerShell 5 would otherwise treat as fatal.
# Failures are detected through exit codes instead.
$ErrorActionPreference = 'Continue'
Set-Location -Path $PSScriptRoot
New-Item -ItemType Directory -Force -Path logs | Out-Null
$Host.UI.RawUI.WindowTitle = 'Skill Bridge'

function Step($title, $command) {
  Write-Host "`n=== $title ===" -ForegroundColor Cyan
  "=== $title ===" | Out-File -FilePath logs\setup.log -Append -Encoding utf8
  cmd /c "$command 2>&1" | ForEach-Object { Write-Host $_; $_ | Out-File -FilePath logs\setup.log -Append -Encoding utf8 }
  if ($LASTEXITCODE -ne 0) {
    "FAILED: $title (exit $LASTEXITCODE)" | Out-File -FilePath logs\setup.log -Append -Encoding utf8
    Write-Host "`n$title failed - see the messages above." -ForegroundColor Red
    Read-Host 'Press Enter to close'
    exit 1
  }
}


function Test-Port($hostName, $port) {
  try { $client = New-Object System.Net.Sockets.TcpClient; $ok = $client.ConnectAsync($hostName, $port).Wait(1500); $client.Close(); return $ok } catch { return $false }
}
function Log($text) { Write-Host $text; $text | Out-File -FilePath logs\setup.log -Append -Encoding utf8 }

function Ensure-Database {
  Write-Host "`n=== Checking the database ===" -ForegroundColor Cyan
  "=== Checking the database ===" | Out-File -FilePath logs\setup.log -Append -Encoding utf8
  $line = (Get-Content backend\.env | Where-Object { $_ -match '^\s*DATABASE_URL\s*=' } | Select-Object -First 1)
  if (-not $line -or $line -notmatch 'postgres(?:ql)?://([^:]+):([^@]*)@([^:/]+):?(\d*)/([^?"]+)') { Log 'DATABASE_URL in backend\.env is missing or not a PostgreSQL URL.'; return $false }
  $dbUser = $Matches[1]; $dbPass = [uri]::UnescapeDataString($Matches[2]); $dbHost = $Matches[3]; $dbPort = if ($Matches[4]) { [int]$Matches[4] } else { 5432 }; $dbName = $Matches[5]
  if (Test-Port $dbHost $dbPort) { Log "Database is reachable at ${dbHost}:${dbPort}."; return $true }
  if ($dbHost -notin @('localhost', '127.0.0.1')) { Log "Cannot reach the database at ${dbHost}:${dbPort}."; return $false }
  if (-not (Get-Command docker -ErrorAction SilentlyContinue)) { Log 'PostgreSQL is not running and Docker is not installed. Start PostgreSQL, then run this again.'; return $false }

  # Make sure the Docker engine is up (start Docker Desktop if needed)
  cmd /c "docker info >nul 2>&1"
  if ($LASTEXITCODE -ne 0) {
    Log 'Starting Docker Desktop...'
    $desktop = Join-Path $env:LOCALAPPDATA 'Programs\DockerDesktop\Docker Desktop.exe'
    if (-not (Test-Path $desktop)) { $desktop = 'C:\Program Files\Docker\Docker\Docker Desktop.exe' }
    if (Test-Path $desktop) { Start-Process $desktop }
    for ($i = 0; $i -lt 60; $i++) { Start-Sleep 3; cmd /c "docker info >nul 2>&1"; if ($LASTEXITCODE -eq 0) { break } }
    if ($LASTEXITCODE -ne 0) { Log 'Docker did not start. Open Docker Desktop, wait until it says "Engine running", then run this again.'; return $false }
  }

  # Prefer an existing PostgreSQL container (keeps your data); otherwise create one from docker-compose.yml
  $containers = docker ps -a --format '{{.ID}}|{{.Image}}|{{.Names}}|{{.Ports}}|{{.Status}}' 2>$null
  Log ("Docker containers:`n" + ($containers -join "`n"))
  # Reuse the container mapped to this port (e.g. skillbridge-db); otherwise create it from docker-compose.yml
  $existing = $containers | Where-Object { ($_ -split '\|')[3] -match ":${dbPort}->5432/" } | Select-Object -First 1
  if ($existing) {
    $name = ($existing -split '\|')[2]
    Log "Starting existing PostgreSQL container '$name'..."
    cmd /c "docker start $name 2>&1" | Out-Null
  } else {
    Log "Creating the skillbridge-db container on port $dbPort..."
    $env:DB_USER = $dbUser; $env:DB_PASSWORD = $dbPass; $env:DB_NAME = $dbName; $env:DB_PORT = "$dbPort"
    cmd /c "docker compose up -d db 2>&1" | ForEach-Object { Write-Host $_; $_ | Out-File -FilePath logs\setup.log -Append -Encoding utf8 }
  }
  for ($i = 0; $i -lt 30; $i++) { if (Test-Port $dbHost $dbPort) { Start-Sleep 3; Log 'Database is up.'; return $true }; Start-Sleep 2 }
  Log "The database container started but nothing answers on port $dbPort."
  return $false
}

"Started $(Get-Date -Format s)" | Out-File -FilePath logs\setup.log -Encoding utf8
if (-not ((Test-Path node_modules) -and (Test-Path backend\node_modules\nodemailer) -and (Test-Path frontend\node_modules))) {
  Step 'Installing packages (first run takes a few minutes)' 'npm install'
}
if (-not (Ensure-Database)) { Write-Host "`nThe database is not available - see the message above." -ForegroundColor Red; Read-Host 'Press Enter to close'; exit 1 }
Step 'Updating the database tables' 'npm run db:deploy'
$dbKey = (Get-Content backend\.env | Where-Object { $_ -match '^\s*DATABASE_URL\s*=' } | Select-Object -First 1) -replace '://[^@]*@', '://'
$seeded = if (Test-Path 'logs\.seeded') { Get-Content 'logs\.seeded' } else { @() }
if ($seeded -notcontains $dbKey) {
  Step 'Loading demo data' 'npm run db:seed'
  $dbKey | Out-File -FilePath 'logs\.seeded' -Append -Encoding utf8
}
"SETUP OK" | Out-File -FilePath logs\setup.log -Append -Encoding utf8

Write-Host "`n=== Starting Skill Bridge ===  (stop it with stop-skill-bridge.bat or by closing this window)" -ForegroundColor Green
# Open the browser at whatever port the website actually starts on (5173, or the next free one)
Start-Job -ArgumentList $PSScriptRoot {
  param($root)
  for ($i = 0; $i -lt 90; $i++) {
    Start-Sleep 2
    $hit = Select-String -Path (Join-Path $root 'logs\dev.log') -Pattern '\[web\].*Local.*localhost:(?:\x1b\[[0-9;]*m)*(\d+)' -ErrorAction SilentlyContinue | Select-Object -Last 1
    if ($hit) { Start-Sleep 8; Start-Process ("http://localhost:" + $hit.Matches[0].Groups[1].Value); break }
  }
} | Out-Null
"" | Out-File -FilePath logs\dev.log -Encoding utf8
cmd /c "npm run dev 2>&1" | ForEach-Object { Write-Host $_; $_ | Out-File -FilePath logs\dev.log -Append -Encoding utf8 }
