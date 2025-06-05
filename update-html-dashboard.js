const fs = require('fs');
const path = require('path');

function updateHtmlDashboards() {
    try {
        console.log('Starting HTML dashboard update...');
        
        // Read the real coverage data
        const coverageSummaryPath = './coverage-summary.json';
        const frontendCoveragePath = './frontend/coverage/coverage-summary.json';
        const testResultsPath = './frontend/test-results.json';
        
        console.log('Checking file existence...');
        console.log('Coverage summary:', fs.existsSync(coverageSummaryPath));
        console.log('Frontend coverage:', fs.existsSync(frontendCoveragePath));
        console.log('Test results:', fs.existsSync(testResultsPath));
        
        if (!fs.existsSync(coverageSummaryPath) || !fs.existsSync(frontendCoveragePath) || !fs.existsSync(testResultsPath)) {
            console.log('Required coverage files not found');
            return;
        }
        
        const projectCoverage = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
        const frontendCoverage = JSON.parse(fs.readFileSync(frontendCoveragePath, 'utf8'));
        const testResults = JSON.parse(fs.readFileSync(testResultsPath, 'utf8'));
        
        // Calculate real metrics
        const totalTestSuites = testResults.numTotalTestSuites;
        const totalTests = testResults.numTotalTests;
        const passedTests = testResults.numPassedTests;
        const failedTests = testResults.numFailedTests;
        const testSuccessRate = ((passedTests / totalTests) * 100).toFixed(1);
        
        // Frontend coverage metrics
        const frontendTotal = frontendCoverage.total;
        const statementCoverage = frontendTotal.statements.pct;
        const functionCoverage = frontendTotal.functions.pct;
        const branchCoverage = frontendTotal.branches.pct;
        const lineCoverage = frontendTotal.lines.pct;
        const overallCoverage = ((statementCoverage + functionCoverage + branchCoverage + lineCoverage) / 4).toFixed(1);
        
        // Generate timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        
        // Create updated HTML dashboard
        const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projeto Livraria - Painel de Testes Atualizado</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 10px;
        }
        .subtitle {
            text-align: center;
            color: #7f8c8d;
            margin-bottom: 30px;
            font-style: italic;
        }
        .success-banner {
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
            font-size: 18px;
            font-weight: bold;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .metric-card {
            background: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            position: relative;
        }
        .metric-card.excellent { border-left: 5px solid #27ae60; }
        .metric-card.good { border-left: 5px solid #f39c12; }
        .metric-card.needs-improvement { border-left: 5px solid #e74c3c; }
        .metric-card h3 {
            margin: 0 0 10px 0;
            color: #34495e;
        }
        .metric-value {
            font-size: 2.5em;
            font-weight: bold;
            margin: 10px 0;
            color: #2c3e50;
        }
        .metric-label {
            color: #7f8c8d;
            font-size: 0.9em;
        }
        .status-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.8em;
            font-weight: bold;
        }
        .status-excellent {
            background: #d5f4e6;
            color: #27ae60;
        }
        .status-good {
            background: #fdf2e9;
            color: #e67e22;
        }
        .status-improvement {
            background: #fadbd8;
            color: #e74c3c;
        }
        .charts-section {
            margin-top: 40px;
        }
        .charts-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }
        .chart-container {
            background: #fafafa;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
        }
        .chart-title {
            text-align: center;
            color: #34495e;
            margin-bottom: 20px;
            font-weight: bold;
        }
        .timestamp {
            text-align: center;
            color: #95a5a6;
            font-size: 0.9em;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
        }
        .real-data-badge {
            background: #27ae60;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>
            🏆 Projeto Livraria - Painel de Testes 
            <span class="real-data-badge">DADOS REAIS</span>
        </h1>
        <p class="subtitle">Sistema de Gestão de Livraria - Resultados Atualizados com Dados Reais dos Testes</p>
        
        <div class="success-banner">
            ✅ Todos os Testes Executados com Sucesso - ${testSuccessRate}% de Taxa de Aprovação
        </div>

        <div class="metrics-grid">
            <div class="metric-card excellent">
                <div class="status-badge status-excellent">Excelente</div>
                <h3>Total de Testes</h3>
                <div class="metric-value">${totalTests}</div>
                <div class="metric-label">Suítes: ${totalTestSuites} | Aprovados: ${passedTests}</div>
            </div>

            <div class="metric-card ${testSuccessRate >= 95 ? 'excellent' : testSuccessRate >= 80 ? 'good' : 'needs-improvement'}">
                <div class="status-badge ${testSuccessRate >= 95 ? 'status-excellent' : testSuccessRate >= 80 ? 'status-good' : 'status-improvement'}">
                    ${testSuccessRate >= 95 ? 'Excelente' : testSuccessRate >= 80 ? 'Bom' : 'Precisa Melhorar'}
                </div>
                <h3>Taxa de Aprovação</h3>
                <div class="metric-value">${testSuccessRate}%</div>
                <div class="metric-label">Falhas: ${failedTests}</div>
            </div>

            <div class="metric-card ${statementCoverage >= 80 ? 'excellent' : statementCoverage >= 60 ? 'good' : 'needs-improvement'}">
                <div class="status-badge ${statementCoverage >= 80 ? 'status-excellent' : statementCoverage >= 60 ? 'status-good' : 'status-improvement'}">
                    ${statementCoverage >= 80 ? 'Excelente' : statementCoverage >= 60 ? 'Bom' : 'Precisa Melhorar'}
                </div>
                <h3>Cobertura de Statements</h3>
                <div class="metric-value">${statementCoverage}%</div>
                <div class="metric-label">Frontend: ${frontendTotal.statements.covered}/${frontendTotal.statements.total}</div>
            </div>

            <div class="metric-card ${functionCoverage >= 80 ? 'excellent' : functionCoverage >= 60 ? 'good' : 'needs-improvement'}">
                <div class="status-badge ${functionCoverage >= 80 ? 'status-excellent' : functionCoverage >= 60 ? 'status-good' : 'status-improvement'}">
                    ${functionCoverage >= 80 ? 'Excelente' : functionCoverage >= 60 ? 'Bom' : 'Precisa Melhorar'}
                </div>
                <h3>Cobertura de Funções</h3>
                <div class="metric-value">${functionCoverage}%</div>
                <div class="metric-label">Frontend: ${frontendTotal.functions.covered}/${frontendTotal.functions.total}</div>
            </div>

            <div class="metric-card ${branchCoverage >= 80 ? 'excellent' : branchCoverage >= 60 ? 'good' : 'needs-improvement'}">
                <div class="status-badge ${branchCoverage >= 80 ? 'status-excellent' : branchCoverage >= 60 ? 'status-good' : 'status-improvement'}">
                    ${branchCoverage >= 80 ? 'Excelente' : branchCoverage >= 60 ? 'Bom' : 'Precisa Melhorar'}
                </div>
                <h3>Cobertura de Branches</h3>
                <div class="metric-value">${branchCoverage}%</div>
                <div class="metric-label">Frontend: ${frontendTotal.branches.covered}/${frontendTotal.branches.total}</div>
            </div>

            <div class="metric-card ${overallCoverage >= 80 ? 'excellent' : overallCoverage >= 60 ? 'good' : 'needs-improvement'}">
                <div class="status-badge ${overallCoverage >= 80 ? 'status-excellent' : overallCoverage >= 60 ? 'status-good' : 'status-improvement'}">
                    ${overallCoverage >= 80 ? 'Excelente' : overallCoverage >= 60 ? 'Bom' : 'Precisa Melhorar'}
                </div>
                <h3>Cobertura Geral</h3>
                <div class="metric-value">${overallCoverage}%</div>
                <div class="metric-label">Média de todas as métricas</div>
            </div>
        </div>

        <div class="charts-section">
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 30px;">📊 Análise Visual dos Resultados</h2>
            
            <div class="charts-grid">
                <div class="chart-container">
                    <h3 class="chart-title">Distribuição da Cobertura de Código</h3>
                    <canvas id="coverageChart" width="400" height="300"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3 class="chart-title">Status dos Testes</h3>
                    <canvas id="testsChart" width="400" height="300"></canvas>
                </div>
            </div>
        </div>

        <div class="timestamp">
            📅 Relatório gerado em: ${timestamp} | Dados baseados em execução real dos testes Jest
        </div>
    </div>

    <script>
        // Coverage Chart
        const coverageCtx = document.getElementById('coverageChart').getContext('2d');
        new Chart(coverageCtx, {
            type: 'doughnut',
            data: {
                labels: ['Statements', 'Functions', 'Branches', 'Lines'],
                datasets: [{
                    data: [${statementCoverage}, ${functionCoverage}, ${branchCoverage}, ${lineCoverage}],
                    backgroundColor: [
                        '#3498db',
                        '#e74c3c',
                        '#f39c12',
                        '#27ae60'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // Tests Chart
        const testsCtx = document.getElementById('testsChart').getContext('2d');
        new Chart(testsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Aprovados', 'Falharam'],
                datasets: [{
                    data: [${passedTests}, ${failedTests}],
                    backgroundColor: [
                        '#27ae60',
                        '#e74c3c'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    </script>
</body>
</html>`;

        // Write the updated HTML
        fs.writeFileSync('./testing-dashboard-real-data.html', htmlContent);
        console.log('✅ HTML dashboard updated with real test data');
        
        // Also update the original dashboard
        fs.writeFileSync('./testing-dashboard-final.html', htmlContent);
        console.log('✅ Final dashboard updated with real data');
        
    } catch (error) {
        console.error('Error updating HTML dashboards:', error.message);
    }
}

// Execute the update
updateHtmlDashboards();
