try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000" -Method GET
    Write-Host "Server is responding: $response"
} catch {
    Write-Host "Server test failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody"
    }
}

