try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api" -Method GET
    Write-Host "Swagger endpoint is accessible"
} catch {
    Write-Host "Swagger test failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    }
}

