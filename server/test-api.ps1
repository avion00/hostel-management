# Test User Management API
$headers = @{}

# Login first
Write-Host "Testing login..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@hostel.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.accessToken
    $headers["Authorization"] = "Bearer $token"
    Write-Host "Login successful!" -ForegroundColor Green
} catch {
    Write-Host "Login failed: $_" -ForegroundColor Red
    exit
}

# Test user stats
Write-Host "`nTesting /api/admin/users/stats..." -ForegroundColor Yellow
try {
    $statsResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/users/stats" -Headers $headers -Method Get
    Write-Host "Stats endpoint works!" -ForegroundColor Green
    $statsResponse | ConvertTo-Json
} catch {
    Write-Host "Stats endpoint failed: $_" -ForegroundColor Red
}

# Test users list
Write-Host "`nTesting /api/admin/users..." -ForegroundColor Yellow
try {
    $usersResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/users?page=1&limit=10" -Headers $headers -Method Get
    Write-Host "Users list endpoint works!" -ForegroundColor Green
    Write-Host "Found $($usersResponse.data.Count) users"
} catch {
    Write-Host "Users list endpoint failed: $_" -ForegroundColor Red
}
