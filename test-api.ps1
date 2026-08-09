Start-Sleep 20
$urls = @('http://conectovolt.com.br', 'http://conectovolt.com.br/api/v1', 'http://conectovolt.com.br/api/v1/auth/login')
foreach ($url in $urls) {
    try {
        $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 15
        Write-Output "OK [$($r.StatusCode)] $url : $($r.Content.Substring(0, [Math]::Min(100, $r.Content.Length)))"
    } catch {
        Write-Output "ERRO $url : $($_.Exception.Message)"
    }
}
