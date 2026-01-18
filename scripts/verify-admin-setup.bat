@echo off
REM Admin Panel Verification Script for Windows
REM This script helps verify that the admin panel is set up correctly

echo.
echo Verifying Admin Panel Setup...
echo.

REM Check if .env file exists
if exist .env (
    echo [OK] .env file found
) else (
    echo [ERROR] .env file not found
    echo    Create .env with DATABASE_URL
    exit /b 1
)

REM Check if DATABASE_URL is set
findstr /C:"DATABASE_URL" .env >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] DATABASE_URL configured
) else (
    echo [ERROR] DATABASE_URL not found in .env
    exit /b 1
)

REM Check if node_modules exists
if exist node_modules (
    echo [OK] Dependencies installed
) else (
    echo [ERROR] Dependencies not installed
    echo    Run: npm install
    exit /b 1
)

REM Check if Prisma client is generated
if exist node_modules\.prisma\client (
    echo [OK] Prisma client generated
) else (
    echo [WARNING] Prisma client not generated
    echo    Run: npx prisma generate
)

echo.
echo Checking API Routes...

set routes=src\app\api\admin\categories\route.ts src\app\api\admin\categories\[id]\route.ts src\app\api\admin\brands\route.ts src\app\api\admin\brands\[id]\route.ts src\app\api\admin\products\route.ts src\app\api\admin\products\[id]\route.ts src\app\api\admin\inventory\route.ts src\app\api\admin\inventory\[id]\route.ts src\app\api\admin\customers\route.ts src\app\api\admin\customers\[id]\route.ts src\app\api\admin\orders\route.ts src\app\api\admin\orders\[id]\route.ts

for %%r in (%routes%) do (
    if exist %%r (
        echo [OK] %%r
    ) else (
        echo [ERROR] %%r missing
    )
)

echo.
echo Checking Admin Pages...

set pages=src\app\admin\categories\page.tsx src\app\admin\brands\page.tsx src\app\admin\inventory\page.tsx src\app\admin\customers\page.tsx src\app\admin\orders\page.tsx

for %%p in (%pages%) do (
    if exist %%p (
        echo [OK] %%p
    ) else (
        echo [ERROR] %%p missing
    )
)

echo.
echo Checking Removed Files...

set old_files=src\app\admin\categories-new.tsx src\app\admin\brands-new.tsx

for %%f in (%old_files%) do (
    if not exist %%f (
        echo [OK] %%f removed
    ) else (
        echo [WARNING] %%f still exists (should be removed^)
    )
)

echo.
echo Setup Verification Complete!
echo.
echo Next Steps:
echo 1. Update database schema: copy prisma\schema-updated.prisma prisma\schema.prisma
echo 2. Run migration: npx prisma migrate dev --name remove_coupons
echo 3. Generate Prisma client: npx prisma generate
echo 4. Start dev server: npm run dev
echo 5. Test admin panel at: http://localhost:3000/admin
echo.
echo Read ADMIN_PANEL_GUIDE.md for detailed testing instructions
