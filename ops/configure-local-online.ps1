param(
    [string]$VpsHost = '177.136.229.136',
    [string]$SshKey = "$env:TEMP\opencode\conectovolt-vps-ed25519",
    [string]$RemoteEnv = '/home/conectovolt/app/backend/.env.production.local',
    [string]$LocalEnv = "$PSScriptRoot\..\backend\.env"
)

$ErrorActionPreference = 'Stop'
$sshArgs = @('-i', $SshKey, '-o', 'IdentitiesOnly=yes', '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=accept-new', "root@$VpsHost", "grep '^DATABASE_URL=' $RemoteEnv")
$line = & ssh.exe @sshArgs
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($line)) {
    throw 'Nao foi possivel ler DATABASE_URL do ambiente remoto.'
}

$remoteUrl = ($line -replace '^DATABASE_URL=', '').Trim().Trim('"')
if ($remoteUrl -notmatch '^mysql://') { throw 'O banco remoto nao usa MySQL.' }
$localUrl = $remoteUrl -replace '127\.0\.0\.1:3306', '127.0.0.1:3307' -replace 'localhost:3306', '127.0.0.1:3307'

$lines = if (Test-Path -LiteralPath $LocalEnv) { @(Get-Content -LiteralPath $LocalEnv) } else { @() }
$lines = @($lines | Where-Object { $_ -notmatch '^DB_PROVIDER=' -and $_ -notmatch '^DATABASE_URL=' })
$lines += "DB_PROVIDER=mysql"
$lines += "DATABASE_URL=`"$localUrl`""
Set-Content -LiteralPath $LocalEnv -Value $lines -Encoding utf8
Write-Output 'Local backend configured to use the VPS database through SSH tunnel port 3307.'
