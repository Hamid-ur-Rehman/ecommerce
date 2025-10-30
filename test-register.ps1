$body = @{
    email = "test@example.com"
    password = "test123"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "Testing register endpoint..."

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method POST -Body $body -Headers $headers
    Write-Host "✅ Register successful!"
    Write-Host "Access Token: $($response.access_token)"
    Write-Host "User: $($response.user.email)"
} catch {
    Write-Host "❌ Register failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
}

