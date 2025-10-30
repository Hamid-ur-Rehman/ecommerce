$body = @{
    email = "admin@example.com"
    password = "admin123"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "Testing login with:"
Write-Host "Email: admin@example.com"
Write-Host "Password: admin123"
Write-Host "Body: $body"
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method POST -Body $body -Headers $headers
    Write-Host "✅ Login successful!"
    Write-Host "Access Token: $($response.access_token)"
    Write-Host "User: $($response.user.email)"
    Write-Host "Role: $($response.user.role.name)"
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
}

