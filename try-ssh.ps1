$host = 'pro122.dnspro.com.br'
$user = 'kryontecnologic'
$pass = 'ZQ(~{Y?9de&;DqYA'

# Testar com plink via senha (nao chave)
$ports = @(21098, 22, 2222, 26)

foreach ($port in $ports) {
    Write-Host "Tentando SSH na porta $port com senha..." -ForegroundColor Yellow
    $result = & 'C:\Program Files\PuTTY\plink.exe' -ssh -P $port -pw $pass -batch -noagent "$user@$host" "echo CONECTADO_PORTA_$port && whoami" 2>&1
    if ($result -match "CONECTADO") {
        Write-Host "SUCESSO na porta $port !" -ForegroundColor Green
        Write-Host $result
        break
    } else {
        Write-Host "Falhou porta $port : $result" -ForegroundColor Red
    }
}
