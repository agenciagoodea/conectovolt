param(
    [string]$VpsHost = '177.136.229.136',
    [int]$LocalPort = 3307,
    [string]$SshKey = "$env:TEMP\opencode\conectovolt-vps-ed25519"
)

$ErrorActionPreference = 'Stop'
if (!(Test-Path -LiteralPath $SshKey)) { throw "SSH key not found: $SshKey" }

$existing = Get-NetTCPConnection -LocalPort $LocalPort -ErrorAction SilentlyContinue
if ($existing) {
    Write-Output "Database tunnel already listening on 127.0.0.1:$LocalPort"
    exit 0
}

$arguments = @(
    '-i', $SshKey,
    '-o', 'IdentitiesOnly=yes',
    '-o', 'BatchMode=yes',
    '-o', 'StrictHostKeyChecking=accept-new',
    '-o', 'ExitOnForwardFailure=yes',
    '-N',
    '-L', "$LocalPort`:127.0.0.1:3306",
    "root@$VpsHost"
)
Start-Process -FilePath 'ssh.exe' -ArgumentList $arguments | Out-Null
Start-Sleep -Seconds 2
if (!(Test-NetConnection -ComputerName 127.0.0.1 -Port $LocalPort -WarningAction SilentlyContinue).TcpTestSucceeded) {
    throw "SSH database tunnel did not start on port $LocalPort"
}
Write-Output "Database tunnel active on 127.0.0.1:$LocalPort"
