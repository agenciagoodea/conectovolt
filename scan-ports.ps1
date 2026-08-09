$ports = @(21098, 22, 2222, 26, 2022, 8022, 4422, 22222)
foreach ($port in $ports) {
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $ar = $tcp.BeginConnect('pro122.dnspro.com.br', $port, $null, $null)
        $ok = $ar.AsyncWaitHandle.WaitOne(2000)
        if ($ok -and $tcp.Connected) {
            Write-Host "ABERTA: $port" -ForegroundColor Green
        } else {
            Write-Host "fechada: $port"
        }
        $tcp.Close()
    } catch {
        Write-Host "erro: $port - $($_.Exception.Message)"
    }
}
