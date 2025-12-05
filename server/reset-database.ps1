# Reset Database Script for PowerShell
Write-Host "Resetting Hostel Management Database..." -ForegroundColor Yellow

# Navigate to server directory
Set-Location "e:\bikram-project\hostel-management\server"

# Backup existing database if it exists
$dbPath = "hostel_management.db"
if (Test-Path $dbPath) {
    $backupPath = "hostel_management_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').db"
    Copy-Item $dbPath $backupPath
    Write-Host "Database backed up to: $backupPath" -ForegroundColor Green
    Remove-Item $dbPath -Force
    Write-Host "Old database removed" -ForegroundColor Green
}

# Run the reset script
Write-Host "Creating new database..." -ForegroundColor Yellow
node reset-db.js

Write-Host "`nDatabase reset complete!" -ForegroundColor Green
Write-Host "Please restart the server with: npm run dev" -ForegroundColor Cyan
