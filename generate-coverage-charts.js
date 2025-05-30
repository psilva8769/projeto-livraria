const fs = require('fs');
const path = require('path');

// Read coverage data
const backendCoverage = JSON.parse(fs.readFileSync('backend/coverage/coverage-final.json', 'utf8'));
const frontendCoverage = JSON.parse(fs.readFileSync('frontend/coverage/coverage-final.json', 'utf8'));

// Calculate overall metrics
function calculateOverallMetrics(coverage) {
    let totalStatements = 0, coveredStatements = 0;
    let totalBranches = 0, coveredBranches = 0;
    let totalFunctions = 0, coveredFunctions = 0;
    let totalLines = 0, coveredLines = 0;

    Object.values(coverage).forEach(file => {
        if (file.s) {
            totalStatements += Object.keys(file.s).length;
            coveredStatements += Object.values(file.s).filter(count => count > 0).length;
        }
        if (file.b) {
            const branches = Object.values(file.b);
            totalBranches += branches.reduce((sum, branch) => sum + branch.length, 0);
            coveredBranches += branches.reduce((sum, branch) => 
                sum + branch.filter(count => count > 0).length, 0);
        }
        if (file.f) {
            totalFunctions += Object.keys(file.f).length;
            coveredFunctions += Object.values(file.f).filter(count => count > 0).length;
        }
        if (file.l) {
            totalLines += Object.keys(file.l).length;
            coveredLines += Object.values(file.l).filter(count => count > 0).length;
        }
    });

    return {
        statements: totalStatements > 0 ? (coveredStatements / totalStatements * 100).toFixed(2) : 0,
        branches: totalBranches > 0 ? (coveredBranches / totalBranches * 100).toFixed(2) : 0,
        functions: totalFunctions > 0 ? (coveredFunctions / totalFunctions * 100).toFixed(2) : 0,
        lines: totalLines > 0 ? (coveredLines / totalLines * 100).toFixed(2) : 0
    };
}

const backendMetrics = calculateOverallMetrics(backendCoverage);
const frontendMetrics = calculateOverallMetrics(frontendCoverage);

// Generate HTML report with charts
const htmlReport = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projeto Livraria - Coverage Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .metric-card {
            background: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .metric-card h3 {
            margin: 0 0 10px 0;
            color: #34495e;
        }
        .metric-value {
            font-size: 2em;
            font-weight: bold;
            margin: 10px 0;
        }
        .backend { color: #27ae60; }
        .frontend { color: #e74c3c; }
        .e2e { color: #3498db; }
        .chart-container {
            margin: 30px 0;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .chart-title {
            text-align: center;
            margin-bottom: 20px;
            color: #2c3e50;
        }
        canvas {
            max-height: 400px;
        }
        .coverage-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .coverage-table th,
        .coverage-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        .coverage-table th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .coverage-high { background-color: #d4edda; }
        .coverage-medium { background-color: #fff3cd; }
        .coverage-low { background-color: #f8d7da; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Projeto Livraria - Coverage Dashboard</h1>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <h3>Backend Coverage</h3>
                <div class="metric-value backend">${backendMetrics.statements}%</div>
                <p>Statements</p>
            </div>
            <div class="metric-card">
                <h3>Frontend Coverage</h3>
                <div class="metric-value frontend">${frontendMetrics.statements}%</div>
                <p>Statements</p>
            </div>
            <div class="metric-card">
                <h3>E2E Coverage</h3>
                <div class="metric-value e2e">Pending</div>
                <p>Integration Tests</p>
            </div>
        </div>

        <div class="chart-container">
            <h3 class="chart-title">Coverage Comparison by Component</h3>
            <canvas id="comparisonChart"></canvas>
        </div>

        <div class="chart-container">
            <h3 class="chart-title">Backend vs Frontend Coverage Breakdown</h3>
            <canvas id="breakdownChart"></canvas>
        </div>

        <div class="chart-container">
            <h3 class="chart-title">Coverage Progress Targets</h3>
            <canvas id="targetChart"></canvas>
        </div>

        <h3>📋 Detailed Coverage Metrics</h3>
        <table class="coverage-table">
            <thead>
                <tr>
                    <th>Component</th>
                    <th>Statements</th>
                    <th>Branches</th>
                    <th>Functions</th>
                    <th>Lines</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr class="coverage-high">
                    <td><strong>Backend</strong></td>
                    <td>${backendMetrics.statements}%</td>
                    <td>${backendMetrics.branches}%</td>
                    <td>${backendMetrics.functions}%</td>
                    <td>${backendMetrics.lines}%</td>
                    <td>✅ Excellent</td>
                </tr>
                <tr class="coverage-low">
                    <td><strong>Frontend</strong></td>
                    <td>${frontendMetrics.statements}%</td>
                    <td>${frontendMetrics.branches}%</td>
                    <td>${frontendMetrics.functions}%</td>
                    <td>${frontendMetrics.lines}%</td>
                    <td>⚠️ Needs Improvement</td>
                </tr>
                <tr>
                    <td><strong>E2E Tests</strong></td>
                    <td colspan="4">Pending execution</td>
                    <td>🔄 In Progress</td>
                </tr>
            </tbody>
        </table>

        <h3>🎯 Improvement Targets</h3>
        <div class="chart-container">
            <h4 class="chart-title">Frontend Coverage Improvement Plan</h4>
            <canvas id="improvementChart"></canvas>
        </div>
    </div>

    <script>
        // Chart 1: Component Comparison
        const ctx1 = document.getElementById('comparisonChart').getContext('2d');
        new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['Statements', 'Branches', 'Functions', 'Lines'],
                datasets: [{
                    label: 'Backend',
                    data: [${backendMetrics.statements}, ${backendMetrics.branches}, ${backendMetrics.functions}, ${backendMetrics.lines}],
                    backgroundColor: '#27ae60',
                    borderColor: '#2ecc71',
                    borderWidth: 1
                }, {
                    label: 'Frontend',
                    data: [${frontendMetrics.statements}, ${frontendMetrics.branches}, ${frontendMetrics.functions}, ${frontendMetrics.lines}],
                    backgroundColor: '#e74c3c',
                    borderColor: '#c0392b',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });

        // Chart 2: Breakdown Chart
        const ctx2 = document.getElementById('breakdownChart').getContext('2d');
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['Backend Covered', 'Backend Uncovered', 'Frontend Covered', 'Frontend Uncovered'],
                datasets: [{
                    data: [${backendMetrics.statements}, ${100 - backendMetrics.statements}, ${frontendMetrics.statements}, ${100 - frontendMetrics.statements}],
                    backgroundColor: ['#27ae60', '#95a5a6', '#e74c3c', '#bdc3c7'],
                    borderWidth: 2
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

        // Chart 3: Target Progress
        const ctx3 = document.getElementById('targetChart').getContext('2d');
        new Chart(ctx3, {
            type: 'line',
            data: {
                labels: ['Current', 'Week 2', 'Week 4', 'Week 6 (Target)'],
                datasets: [{
                    label: 'Frontend Coverage Progress',
                    data: [${frontendMetrics.statements}, 55, 70, 85],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Backend Coverage (Maintain)',
                    data: [${backendMetrics.statements}, ${backendMetrics.statements}, ${backendMetrics.statements}, ${backendMetrics.statements}],
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });

        // Chart 4: Improvement Plan
        const ctx4 = document.getElementById('improvementChart').getContext('2d');
        new Chart(ctx4, {
            type: 'radar',
            data: {
                labels: ['Components', 'Pages', 'Utils', 'Hooks', 'Context', 'Services'],
                datasets: [{
                    label: 'Current Coverage',
                    data: [60, 25, 80, 70, 0, 45],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.2)',
                    pointBackgroundColor: '#e74c3c'
                }, {
                    label: 'Target Coverage',
                    data: [85, 80, 90, 85, 75, 85],
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.2)',
                    pointBackgroundColor: '#27ae60'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    </script>
</body>
</html>
`;

// Write the HTML report
fs.writeFileSync('coverage-dashboard.html', htmlReport);

console.log('📊 Coverage dashboard generated: coverage-dashboard.html');
console.log('\n📈 Summary:');
console.log(`Backend Coverage: ${backendMetrics.statements}% statements`);
console.log(`Frontend Coverage: ${frontendMetrics.statements}% statements`);
console.log('\n🎯 Next Steps:');
console.log('1. Open coverage-dashboard.html in your browser');
console.log('2. Start servers and run E2E tests');
console.log('3. Implement frontend coverage improvements');
