@echo off
echo Setting up Hostel Management Database...

REM Backup existing database
if exist hostel_management.db (
    echo Backing up existing database...
    copy hostel_management.db hostel_management_backup.db
    del hostel_management.db
)

REM Create upload directories
if not exist uploads\temp mkdir uploads\temp
if not exist uploads\properties mkdir uploads\properties

REM Run the reset script
echo Creating new database...
node reset-db.js

echo.
echo Setup complete!
echo You can now run: npm run dev
pause
