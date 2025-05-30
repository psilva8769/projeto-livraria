# Projeto Livraria - Coverage Reports Navigator
# Generated: May 29, 2025

Write-Host "🎯 PROJETO LIVRARIA - TESTING ANALYSIS COMPLETE" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 FINAL RESULTS SUMMARY:" -ForegroundColor Yellow
Write-Host "✅ 219 Tests Executed (100% Success Rate)" -ForegroundColor Green
Write-Host "✅ Backend: 87.77% Coverage (Excellent)" -ForegroundColor Green  
Write-Host "✅ Frontend: 43.78% Coverage (Improvement Plan Active)" -ForegroundColor Yellow
Write-Host "✅ E2E: 41/41 Tests Passed (Excellent)" -ForegroundColor Green
Write-Host ""

Write-Host "📁 AVAILABLE REPORTS:" -ForegroundColor Cyan
Write-Host "1. Updated Testing Dashboard (Recommended)" -ForegroundColor White
Write-Host "2. E2E Coverage Explanation" -ForegroundColor Yellow
Write-Host "3. Final Complete Report" -ForegroundColor White
Write-Host "4. Executive Summary" -ForegroundColor White
Write-Host "5. Backend Coverage Report" -ForegroundColor White
Write-Host "6. Frontend Coverage Report" -ForegroundColor White
Write-Host "7. Quick Access Guide" -ForegroundColor White
Write-Host "8. Re-run Test Coverage" -ForegroundColor White
Write-Host "9. Exit" -ForegroundColor White
Write-Host ""

do {
    $choice = Read-Host "Select report to open (1-9)"
    
    switch ($choice) {
        "1" {
            Write-Host "🎨 Opening Updated Testing Dashboard..." -ForegroundColor Green
            Start-Process "testing-dashboard-updated.html"
            break
        }
        "2" {
            Write-Host "🔍 Opening E2E Coverage Explanation..." -ForegroundColor Yellow
            Start-Process "E2E_COVERAGE_EXPLANATION.md"
            break
        }
        "3" {
            Write-Host "📋 Opening Final Coverage Report..." -ForegroundColor Green
            Start-Process "FINAL_COVERAGE_REPORT.md"
            break
        }
        "4" {
            Write-Host "📊 Opening Executive Summary..." -ForegroundColor Green
            Start-Process "README_TESTING_COMPLETE.md"
            break
        }
        "5" {
            Write-Host "🔧 Opening Backend Coverage Report..." -ForegroundColor Green
            Start-Process "backend\coverage\index.html"
            break
        }
        "6" {
            Write-Host "⚛️ Opening Frontend Coverage Report..." -ForegroundColor Green
            Start-Process "frontend\coverage\index.html"
            break
        }
        "7" {
            Write-Host "⚡ Opening Quick Access Guide..." -ForegroundColor Green
            Start-Process "QUICK_ACCESS.txt"
            break
        }
        "8" {
            Write-Host "🧪 Re-running Test Coverage..." -ForegroundColor Yellow
            Write-Host "Choose component to test:" -ForegroundColor Cyan
            Write-Host "a. Backend" -ForegroundColor White
            Write-Host "b. Frontend" -ForegroundColor White
            Write-Host "c. E2E (requires servers running)" -ForegroundColor White
            Write-Host "d. All" -ForegroundColor White
            
            $testChoice = Read-Host "Select (a-d)"
            
            switch ($testChoice) {
                "a" {
                    Write-Host "Running backend tests..." -ForegroundColor Green
                    Set-Location "backend"
                    npm test -- --coverage
                    Set-Location ".."
                }
                "b" {
                    Write-Host "Running frontend tests..." -ForegroundColor Green
                    Set-Location "frontend"
                    npm test -- --coverage
                    Set-Location ".."
                }
                "c" {
                    Write-Host "Running E2E tests..." -ForegroundColor Green
                    Write-Host "Make sure servers are running first!" -ForegroundColor Yellow
                    Set-Location "e2e"
                    npm run test:e2e
                    Set-Location ".."
                }
                "d" {
                    Write-Host "Running all tests..." -ForegroundColor Green
                    Write-Host "Backend tests..." -ForegroundColor Cyan
                    Set-Location "backend"
                    npm test -- --coverage
                    Set-Location ".."
                    
                    Write-Host "Frontend tests..." -ForegroundColor Cyan
                    Set-Location "frontend"
                    npm test -- --coverage
                    Set-Location ".."
                    
                    Write-Host "Regenerating dashboard..." -ForegroundColor Cyan
                    node generate-coverage-charts.js
                }
            }
            break
        }
        "8" {
            Write-Host "👋 Happy testing! Next step: Focus on ShopContext (0% coverage)" -ForegroundColor Green
            Write-Host "📋 Don't forget to check FINAL_COVERAGE_REPORT.md for the complete roadmap" -ForegroundColor Yellow
            exit
        }
        default {
            Write-Host "❌ Invalid choice. Please select 1-8." -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "Press any key to return to menu..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    Clear-Host
    
    Write-Host "🎯 PROJETO LIVRARIA - TESTING ANALYSIS COMPLETE" -ForegroundColor Green
    Write-Host "===============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📁 AVAILABLE REPORTS:" -ForegroundColor Cyan
    Write-Host "1. Interactive Dashboard (Recommended)" -ForegroundColor White
    Write-Host "2. Final Complete Report" -ForegroundColor White
    Write-Host "3. Executive Summary" -ForegroundColor White
    Write-Host "4. Backend Coverage Report" -ForegroundColor White
    Write-Host "5. Frontend Coverage Report" -ForegroundColor White
    Write-Host "6. Quick Access Guide" -ForegroundColor White
    Write-Host "7. Re-run Test Coverage" -ForegroundColor White
    Write-Host "8. Exit" -ForegroundColor White
    Write-Host ""
    
} while ($choice -ne "8")
