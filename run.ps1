# Install dependencies if they don't exist
if (!(Test-Path "backend\node_modules")) {
    Write-Host "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
}

if (!(Test-Path "frontend\node_modules")) {
    Write-Host "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
}

# Run frontend and backend in separate windows
Write-Host "Starting backend..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd backend; npm run dev`""

Write-Host "Starting frontend..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd frontend; npm run dev`""
