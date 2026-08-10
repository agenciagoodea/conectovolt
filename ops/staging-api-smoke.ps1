param(
    [string]$BaseUrl = 'http://127.0.0.1:43004/api/v1',
    [string]$SeedPassword = 'Admin@123'
)

$ErrorActionPreference = 'Stop'

function Invoke-Api {
    param(
        [string]$Method,
        [string]$Path,
        [object]$Body = $null,
        [string]$Token = ''
    )

    $headers = @{}
    if ($Token) { $headers.Authorization = "Bearer $Token" }
    $params = @{
        Method = $Method
        Uri = "$BaseUrl$Path"
        Headers = $headers
        ContentType = 'application/json'
    }
    if ($null -ne $Body) { $params.Body = ($Body | ConvertTo-Json -Depth 10) }

    try {
        return [pscustomobject]@{
            Status = 200
            Data = Invoke-RestMethod @params
        }
    } catch {
        $status = 500
        if ($_.Exception.Response) { $status = [int]$_.Exception.Response.StatusCode }
        return [pscustomobject]@{ Status = $status; Data = $null }
    }
}

function Assert-Status($Response, [int]$Expected, [string]$Label) {
    if ($Response.Status -ne $Expected) {
        throw "${Label}: expected HTTP $Expected, received HTTP $($Response.Status)"
    }
    Write-Host "PASS $Label ($Expected)" -ForegroundColor Green
}

function Assert-True([bool]$Condition, [string]$Label) {
    if (!$Condition) { throw "FAIL $Label" }
    Write-Host "PASS $Label" -ForegroundColor Green
}

$health = Invoke-Api 'GET' '/health'
Assert-Status $health 200 'health'

$adminLogin = Invoke-Api 'POST' '/auth/login' @{ email = 'admin@conectovolt.com.br'; password = $SeedPassword }
Assert-Status $adminLogin 200 'admin login'
$adminToken = $adminLogin.Data.access_token

$registered = Invoke-Api 'POST' '/auth/register' @{ name = 'Smoke Customer'; email = "smoke-$([guid]::NewGuid())@example.com"; password = 'SmokePass123' }
Assert-Status $registered 200 'customer registration'

$companies = Invoke-Api 'GET' '/companies' $null $adminToken
Assert-Status $companies 200 'list companies'
$company1 = $companies.Data | Select-Object -First 1

$company2Response = Invoke-Api 'POST' '/companies' @{ name = 'Smoke Tenant 2'; document = "SMOKE-$([guid]::NewGuid())"; email = 'tenant2@example.com' } $adminToken
Assert-Status $company2Response 200 'create second company'
$company2 = $company2Response.Data

$user2Response = Invoke-Api 'POST' '/users' @{ name = 'Operator Two'; email = "operator2-$([guid]::NewGuid())@example.com"; password = 'Operator@123'; role = 'OPERATOR'; companyId = $company2.id } $adminToken
Assert-Status $user2Response 200 'create second operator'
$operator2Email = $user2Response.Data.email

$tariffs = Invoke-Api 'GET' "/tariffs?company_id=$($company1.id)" $null $adminToken
Assert-Status $tariffs 200 'list tariffs'
$tariff = $tariffs.Data | Select-Object -First 1

$stationResponse = Invoke-Api 'POST' '/stations' @{ name = 'Smoke Station'; companyId = $company1.id; address = 'Rua Smoke, 1'; city = 'Sao Paulo'; state = 'SP'; latitude = -23.55; longitude = -46.63; tariffId = $tariff.id } $adminToken
Assert-Status $stationResponse 200 'create station'
$station = $stationResponse.Data

$chargerResponse = Invoke-Api 'POST' '/chargers' @{ stationId = $station.id; serialNumber = "SMOKE-$([guid]::NewGuid())"; model = 'Smoke Charger'; powerKw = 60; ocppId = "SMOKE-OCPP-$([guid]::NewGuid())" } $adminToken
Assert-Status $chargerResponse 200 'create charger'
$charger = $chargerResponse.Data

$statusResponse = Invoke-Api 'PATCH' "/chargers/$($charger.id)/status" @{ status = 'ONLINE' } $adminToken
Assert-Status $statusResponse 200 'set charger online'

$connectorResponse = Invoke-Api 'POST' "/connectors/charger/$($charger.id)" @{ type = 'TYPE2'; powerKw = 22 } $adminToken
Assert-Status $connectorResponse 200 'create connector'
$connector = $connectorResponse.Data

$operatorLogin = Invoke-Api 'POST' '/auth/login' @{ email = 'operador@conectovolt.com.br'; password = $SeedPassword }
Assert-Status $operatorLogin 200 'operator login'
$operatorToken = $operatorLogin.Data.access_token

$operator2Login = Invoke-Api 'POST' '/auth/login' @{ email = $operator2Email; password = 'Operator@123' }
Assert-Status $operator2Login 200 'second operator login'
$operator2Token = $operator2Login.Data.access_token

$otherStation = Invoke-Api 'GET' "/stations/$($station.id)" $null $operator2Token
Assert-Status $otherStation 403 'tenant station isolation'
$otherChargers = Invoke-Api 'GET' '/chargers' $null $operator2Token
Assert-Status $otherChargers 200 'tenant charger listing'
Assert-True ($otherChargers.Data.Count -eq 0) 'tenant charger isolation'

$customerLogin = Invoke-Api 'POST' '/auth/login' @{ email = 'cliente@conectovolt.com.br'; password = $SeedPassword }
Assert-Status $customerLogin 200 'customer login'
$customerToken = $customerLogin.Data.access_token

$customerStations = Invoke-Api 'GET' '/stations' $null $customerToken
Assert-Status $customerStations 200 'customer station discovery'
Assert-True (@($customerStations.Data | Where-Object { $_.id -eq $station.id }).Count -ge 1) 'customer can locate station'

$vehicleResponse = Invoke-Api 'POST' '/vehicles' @{ brand = 'Smoke'; model = 'EV'; plate = "SMK-$([guid]::NewGuid().ToString().Substring(0, 6))"; batteryCapacity = 60 } $customerToken
Assert-Status $vehicleResponse 200 'create vehicle'
$vehicle = $vehicleResponse.Data

$startResponse = Invoke-Api 'POST' '/charging/start' @{ chargerId = $charger.id; stationId = $station.id; connectorId = $connector.id; vehicleId = $vehicle.id } $customerToken
Assert-Status $startResponse 200 'start charging session'
$session = $startResponse.Data

$energyResponse = Invoke-Api 'PATCH' "/charging/$($session.id)/energy" @{ energyKwh = 4 } $customerToken
Assert-Status $energyResponse 200 'receive telemetry'

$stopResponse = Invoke-Api 'POST' "/charging/$($session.id)/stop" @{ energyKwh = 4 } $customerToken
Assert-Status $stopResponse 200 'stop charging session'

$paymentResponse = Invoke-Api 'POST' '/payments' @{ sessionId = $session.id; gateway = 'PIX' } $customerToken
Assert-Status $paymentResponse 200 'create simulated PIX payment'
$paymentId = $paymentResponse.Data.payment.id

$paymentStatus = Invoke-Api 'GET' "/payments/$paymentId" $null $customerToken
Assert-Status $paymentStatus 200 'confirm simulated payment'
Assert-True ($paymentStatus.Data.status -eq 'APPROVED') 'payment approved'

$history = Invoke-Api 'GET' '/charging/history' $null $customerToken
Assert-Status $history 200 'charging history'
Assert-True ($history.Data.data.Count -ge 1) 'history contains completed session'

$negativeWithdrawal = Invoke-Api 'POST' '/wallet/withdraw' @{ amount = -10 } $operatorToken
Assert-Status $negativeWithdrawal 400 'negative withdrawal blocked'

Write-Host 'STAGING API SMOKE PASSED' -ForegroundColor Cyan

