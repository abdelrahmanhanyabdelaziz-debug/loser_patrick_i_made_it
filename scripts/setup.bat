@echo off
echo 🌤️ Setting up Weather Concierge Frontend...
echo ==========================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo 🔧 Creating environment file...
    (
        echo # Weather Concierge Environment Variables
        echo NEXT_PUBLIC_APP_NAME=Weather Concierge
        echo NEXT_PUBLIC_APP_VERSION=1.0.0
    ) > .env.local
    echo ✅ Environment file created
)

echo.
echo 🎉 Setup complete! You can now run:
echo    npm run dev    # Start development server
echo    npm run build  # Build for production
echo.
echo 🌤️ Happy weather planning!
pause
