# Deploy via cPanel UAPI - compativel com PowerShell 5
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }

$cpanelUser = "kryontecnologic"
$cpanelPass = 'ZQ(~{Y?9de&;DqYA'
$cpanelHost = "pro122.dnspro.com.br:2083"

$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${cpanelUser}:${cpanelPass}"))
$headers = @{
    "Authorization" = "Basic $base64Auth"
}

Write-Host "=== Testando conexao com cPanel UAPI ===" -ForegroundColor Cyan

try {
    $resp = Invoke-RestMethod -Uri "https://${cpanelHost}/execute/Fileman/list_files?dir=%2Fhome%2Fkryontecnologic" `
        -Headers $headers -Method GET
    Write-Host "Conectado ao cPanel!" -ForegroundColor Green
    Write-Host ($resp | ConvertTo-Json -Depth 2)
} catch {
    Write-Host "Erro UAPI Fileman: $($_.Exception.Message)" -ForegroundColor Red
}

# Tentar listar via Stats API
try {
    $resp2 = Invoke-RestMethod -Uri "https://${cpanelHost}/execute/StatsBar/get_stats?display=diskusage" `
        -Headers $headers -Method GET
    Write-Host "Stats API OK:" -ForegroundColor Green
    Write-Host ($resp2 | ConvertTo-Json -Depth 2)
} catch {
    Write-Host "Erro Stats API: $($_.Exception.Message)" -ForegroundColor Red
}

# Tentar executar via cPanel Terminal (Corectl)
Write-Host "`n=== Tentando Terminal via cPanel API ===" -ForegroundColor Cyan
try {
    $body = "command=cd+%2Fhome%2Fkryontecnologic%2Fconectovolt+%26%26+git+pull+origin+master+%26%26+echo+DEPLOY_OK"
    $resp3 = Invoke-WebRequest -Uri "https://${cpanelHost}/execute/Terminal/run" `
        -Headers $headers -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"
    Write-Host "Terminal OK:" -ForegroundColor Green
    Write-Host $resp3.Content
} catch {
    Write-Host "Terminal API erro: $($_.Exception.Message)" -ForegroundColor Yellow
}
