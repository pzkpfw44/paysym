/**
 * Chart initialization and update functions
 */

// Initialize charts
let targetAchievementGauge, totalPayoutGauge, monthlyBreakdownChart, elasticityChart;
let comparisonChart, roiChart, riskChart;
let annualPayoutComposition, quarterlyComparisonChart;
let elasticityComparisonChart;

function initializeCharts() {
    // Target Achievement Gauge
    targetAchievementGauge = new Chart(
        document.getElementById('targetAchievementGauge'),
        {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [0, 100],
                    backgroundColor: [
                        '#d2004b',
                        '#eeeeee'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                cutout: '75%',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        enabled: false
                    },
                    legend: {
                        display: false
                    }
                }
            }
        }
    );
    
    // Total Payout Gauge
    totalPayoutGauge = new Chart(
        document.getElementById('totalPayoutGauge'),
        {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [0, 100],
                    backgroundColor: [
                        '#d2004b',
                        '#eeeeee'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                cutout: '75%',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        enabled: false
                    },
                    legend: {
                        display: false
                    }
                }
            }
        }
    );
    
    // Annual Payout Composition - NEW
    annualPayoutComposition = new Chart(
        document.getElementById('annualPayoutComposition'),
        {
            type: 'doughnut',
            data: {
                labels: ['Commission', 'Quarterly Bonus', 'Continuity Bonus'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: [
                        '#555555',
                        '#009988',
                        '#d2004b'
                    ],
                    borderWidth: 1,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '50%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                size: 14
                            },
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw;
                                const percentage = context.parsed;
                                const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                                const percentageValue = total > 0 ? (percentage / total * 100).toFixed(1) + '%' : '0%';
                                return `${label}: ${formatCurrency(value)} (${percentageValue})`;
                            }
                        }
                    }
                }
            }
        }
    );
    
    // Quarterly Performance Comparison - NEW
    quarterlyComparisonChart = new Chart(
        document.getElementById('quarterlyComparisonChart'),
        {
            type: 'bar',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [
                    {
                        type: 'bar',
                        label: 'Achievement',
                        data: [0, 0, 0, 0],
                        backgroundColor: '#009988',
                        borderColor: '#009988',
                        borderWidth: 1,
                        order: 2,
                        yAxisID: 'y'
                    },
                    {
                        type: 'line',
                        label: 'Payout',
                        data: [0, 0, 0, 0],
                        borderColor: '#d2004b',
                        backgroundColor: 'rgba(210, 0, 75, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1,
                        order: 1,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Achievement (%)'
                        },
                        min: 0
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        title: {
                            display: true,
                            text: 'Payout (€)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '€' + value.toLocaleString('de-DE');
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.dataset.yAxisID === 'y1') {
                                    label += formatCurrency(context.raw);
                                } else {
                                    label += context.raw.toFixed(1) + '%';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        }
    );
    
    // Monthly Breakdown Chart
    monthlyBreakdownChart = new Chart(
        document.getElementById('monthlyBreakdownChart'),
        {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Commission',
                        data: Array(12).fill(0),
                        backgroundColor: '#555555',
                        stack: 'stack1'
                    },
                    {
                        label: 'Quarterly Bonus',
                        data: Array(12).fill(0),
                        backgroundColor: '#009988',
                        stack: 'stack1'
                    },
                    {
                        label: 'Continuity Bonus',
                        data: Array(12).fill(0),
                        backgroundColor: '#d2004b',
                        stack: 'stack1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Payout (€)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '€' + value.toLocaleString('de-DE');
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += formatCurrency(context.raw);
                                return label;
                            }
                        }
                    }
                }
            }
        }
    );
    
    // Elasticity Chart
    elasticityChart = new Chart(
        document.getElementById('elasticityChart'),
        {
            type: 'line',
            data: {
                labels: Array.from({length: 41}, (_, i) => (i * 5) + '%'),
                datasets: [
                    {
                        label: 'Total Payout (excl. Continuity)',
                        data: Array(41).fill(0),
                        borderColor: '#d2004b',
                        backgroundColor: 'rgba(210, 0, 75, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.1
                    },
                    {
                        label: 'Commission Only',
                        data: Array(41).fill(0),
                        borderColor: '#555555',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1,
                        borderDash: [5, 5]
                    },
                    {
                        label: 'Quarterly Bonus Only',
                        data: Array(41).fill(0),
                        borderColor: '#009988',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1,
                        borderDash: [10, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Payout (€)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '€' + value.toLocaleString('de-DE');
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Target Achievement (%)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += formatCurrency(context.raw);
                                return label;
                            }
                        }
                    }
                }
            }
        }
    );
    
    // Comparison Chart
    comparisonChart = new Chart(
        document.getElementById('comparisonChart'),
        {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Commission',
                        data: [],
                        backgroundColor: '#555555'
                    },
                    {
                        label: 'Quarterly Bonus',
                        data: [],
                        backgroundColor: '#009988'
                    },
                    {
                        label: 'Continuity Bonus',
                        data: [],
                        backgroundColor: '#d2004b'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Payout (€)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '€' + value.toLocaleString('de-DE');
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += formatCurrency(context.raw);
                                return label;
                            }
                        }
                    }
                }
            }
        }
    );
    
    // Elasticity Comparison Chart
    elasticityComparisonChart = new Chart(
        document.getElementById('elasticityComparisonChart'),
        {
            type: 'line',
            data: {
                labels: Array.from({length: 41}, (_, i) => (i * 5) + '%'),
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Payout (€)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '€' + value.toLocaleString('de-DE');
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Target Achievement (%)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += formatCurrency(context.raw);
                                return label;
                            }
                        }
                    }
                }
            }
        }
    );
    
    // ROI Chart
    roiChart = new Chart(
        document.getElementById('roiChart'),
        {
            type: 'line',
            data: {
                labels: Array.from({length: 21}, (_, i) => (i * 10) + '%'),
                datasets: [
                    {
                        label: 'Revenue',
                        data: Array(21).fill(0),
                        borderColor: '#0066cc',
                        backgroundColor: 'rgba(0, 102, 204, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Payout',
                        data: Array(21).fill(0),
                        borderColor: '#d2004b',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'ROI Ratio',
                        data: Array(21).fill(0),
                        borderColor: '#00b347',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount (€)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '€' + value.toLocaleString('de-DE');
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'ROI Ratio'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Target Achievement (%)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.dataset.yAxisID === 'y1') {
                                    label += context.raw.toFixed(1) + ':1';
                                } else {
                                    label += formatCurrency(context.raw);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        }
    );
    
    // Risk Chart
    riskChart = new Chart(
        document.getElementById('riskChart'),
        {
            type: 'bar',
            data: {
                labels: ['Low (80%)', 'Below Target (90%)', 'Target (100%)', 'Above Target (110%)', 'High (120%)', 'Maximum (150%)'],
                datasets: [
                    {
                        label: 'Payout',
                        data: Array(6).fill(0),
                        backgroundColor: [
                            '#00b347',
                            '#83ca9d',
                            '#ffaa00',
                            '#ffcc66',
                            '#ff8866',
                            '#d2004b'
                        ],
                        borderWidth: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Payout (€)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '€' + value.toLocaleString('de-DE');
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Performance Scenario'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = 'Payout: ';
                                label += formatCurrency(context.raw);
                                return label;
                            }
                        }
                    }
                }
            }
        }
    );
    
    // Initialize philosophy charts
    if (typeof initializePhilosophyCharts === 'function') {
        initializePhilosophyCharts();
    }
}

/**
 * Update UI with calculation results
 */
function updateUI(results) {
    // Update achievement gauge
    targetAchievementGauge.data.datasets[0].data = [results.avgAchievement, 200 - results.avgAchievement];
    targetAchievementGauge.update();
    document.getElementById('targetAchievementValue').textContent = formatPercent(results.avgAchievement);
    
    // Update payout gauge (assume max payout of 40000€)
    const payoutPercentage = Math.min(results.totalPayout / 40000 * 100, 100);
    totalPayoutGauge.data.datasets[0].data = [payoutPercentage, 100 - payoutPercentage];
    totalPayoutGauge.update();
    document.getElementById('totalPayoutValue').textContent = formatCurrency(results.totalPayout);
    
    // Update annual payout composition chart
    annualPayoutComposition.data.datasets[0].data = [
        results.totalCommission,
        results.totalQuarterlyBonus,
        results.totalContinuityBonus
    ];
    annualPayoutComposition.update();
    
    // Update KPI cards
    updateKPIMetrics(results);
    
    // Update quarterly performance comparison chart
    const quarterlyAchievements = [
        parseFloat(document.getElementById('q1Achievement').value),
        parseFloat(document.getElementById('q2Achievement').value),
        parseFloat(document.getElementById('q3Achievement').value),
        parseFloat(document.getElementById('q4Achievement').value)
    ];
    
    // Calculate total payout per quarter
    const quarterlyPayouts = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
        // Sum of quarterly bonus, continuity bonus, and quarterly commission
        const qCommission = results.commissions.slice(i*3, (i+1)*3).reduce((sum, c) => sum + c, 0);
        quarterlyPayouts[i] = results.quarterlyBonuses[i] + results.continuityBonuses[i] + qCommission;
    }
    
    quarterlyComparisonChart.data.datasets[0].data = quarterlyAchievements;
    quarterlyComparisonChart.data.datasets[1].data = quarterlyPayouts;
    quarterlyComparisonChart.update();
    
    // Update summary cards
    document.getElementById('totalCommission').textContent = formatCurrency(results.totalCommission);
    document.getElementById('totalQuarterlyBonus').textContent = formatCurrency(results.totalQuarterlyBonus);
    document.getElementById('totalContinuityBonus').textContent = formatCurrency(results.totalContinuityBonus);
    document.getElementById('avgMonthlyCommission').textContent = formatCurrency(results.totalCommission / 12);
    
    // Update quarterly breakdowns
    for (let i = 0; i < 4; i++) {
        const q = i + 1;
        
        document.getElementById(`q${q}AchievementResult`).textContent = formatPercent(quarterlyAchievements[i]);
        document.getElementById(`q${q}Bonus`).textContent = formatCurrency(results.quarterlyBonuses[i]);
        document.getElementById(`q${q}Continuity`).textContent = formatCurrency(results.continuityBonuses[i]);
        
        // Calculate quarterly commission subtotal (3 months)
        const qCommission = results.commissions.slice(i*3, (i+1)*3).reduce((sum, c) => sum + c, 0);
        document.getElementById(`q${q}Total`).textContent = formatCurrency(results.quarterlyBonuses[i] + results.continuityBonuses[i] + qCommission);
    }
    
    // Update monthly breakdown chart
    // Create arrays for each dataset
    const commissionData = [...results.commissions];
    const quarterlyBonusData = Array(12).fill(0);
    const continuityBonusData = Array(12).fill(0);
    
    // Assign quarterly and continuity bonuses to the 3rd month of each quarter
    quarterlyBonusData[2] = results.quarterlyBonuses[0];  // March (Q1)
    quarterlyBonusData[5] = results.quarterlyBonuses[1];  // June (Q2)
    quarterlyBonusData[8] = results.quarterlyBonuses[2];  // September (Q3)
    quarterlyBonusData[11] = results.quarterlyBonuses[3]; // December (Q4)
    
    continuityBonusData[2] = results.continuityBonuses[0];  // March (Q1)
    continuityBonusData[5] = results.continuityBonuses[1];  // June (Q2)
    continuityBonusData[8] = results.continuityBonuses[2];  // September (Q3)
    continuityBonusData[11] = results.continuityBonuses[3]; // December (Q4)
    
    monthlyBreakdownChart.data.datasets[0].data = commissionData;
    monthlyBreakdownChart.data.datasets[1].data = quarterlyBonusData;
    monthlyBreakdownChart.data.datasets[2].data = continuityBonusData;
    monthlyBreakdownChart.update();
    
    // If philosophy analysis is available, update it
    if (typeof updatePhilosophyAnalysis === 'function') {
        updatePhilosophyAnalysis();
    }
}

/**
 * Update KPI metrics
 */
function updateKPIMetrics(results) {
    const yearlyTarget = parseFloat(document.getElementById('yearlyTarget').value);
    const yearlyRevenue = results.yearlyRevenue;
    
    // Revenue vs Target
    const revenueVsTarget = (yearlyRevenue / yearlyTarget * 100).toFixed(1) + '%';
    document.getElementById('revenueVsTarget').textContent = revenueVsTarget;
    
    // Payout % of Revenue
    const payoutPercentage = (results.totalPayout / yearlyRevenue * 100).toFixed(2) + '%';
    document.getElementById('payoutPercentage').textContent = payoutPercentage;
    
    // Next Threshold - Find the next quarterly bonus threshold
    const avgAchievement = results.avgAchievement;
    let nextThreshold = "N/A";
    
    // Get quarterly thresholds
    const thresholds = [];
    for (let i = 1; i <= 5; i++) {
        thresholds.push({
            threshold: parseFloat(document.getElementById(`qThreshold${i}`).value)
        });
    }
    
    // Sort thresholds
    thresholds.sort((a, b) => a.threshold - b.threshold);
    
    // Find next threshold
    for (const threshold of thresholds) {
        if (threshold.threshold > avgAchievement) {
            nextThreshold = threshold.threshold + "% (+" + (threshold.threshold - avgAchievement).toFixed(1) + "%)";
            break;
        }
    }
    
    document.getElementById('nextThreshold').textContent = nextThreshold;
    
    // Year-End Projection
    // Simple projection based on current trajectory
    // For a more sophisticated projection, you could use trend analysis
    const currentMonth = new Date().getMonth(); // 0-11
    
    let yearEndProjection = results.totalPayout;
    
    // If we're not at year end, project based on current performance
    if (currentMonth < 11) {
        // Calculate average monthly payout so far
        const monthsPassed = currentMonth + 1;
        const monthsRemaining = 12 - monthsPassed;
        const avgMonthlyPayout = results.totalPayout / 12; // Using simulation for full year
        
        // Project remaining months at current rate
        yearEndProjection = avgMonthlyPayout * 12;
    }
    
    document.getElementById('yearEndProjection').textContent = formatCurrency(yearEndProjection);
}

/**
 * Update elasticity chart
 */
function updateElasticityChart() {
    const elasticityData = simulateElasticity();
    
    elasticityChart.data.datasets[0].data = elasticityData.map(d => d.totalExcludingContinuity);
    elasticityChart.data.datasets[1].data = elasticityData.map(d => d.commission);
    elasticityChart.data.datasets[2].data = elasticityData.map(d => d.quarterlyBonus);
    elasticityChart.update();
    
    // Update elasticity insight
    document.getElementById('elasticityInsight').innerHTML = generateElasticityInsight(elasticityData);
    
    // Update elasticity ranges table
    const rangeResults = calculateElasticityPerRange();
    
    for (const range in rangeResults) {
        if (rangeResults.hasOwnProperty(range)) {
            document.getElementById(`elasticity${range}`).textContent = formatCurrency(rangeResults[range].elasticity);
            document.getElementById(`revenue${range}`).textContent = formatCurrency(rangeResults[range].revenuePerPoint);
            document.getElementById(`roi${range}`).textContent = formatRatio(rangeResults[range].roi);
        }
    }
}

/**
 * Update ROI analysis
 */
function updateROIAnalysis() {
    const roiData = simulateROI();
    
    // Update ROI chart
    roiChart.data.datasets[0].data = roiData.map(d => d.revenue);
    roiChart.data.datasets[1].data = roiData.map(d => d.payout);
    roiChart.data.datasets[2].data = roiData.map(d => d.roi);
    roiChart.update();
    
    // Update ROI metrics
    const targetData = roiData.find(d => d.achievement === 100) || { revenue: 0, payout: 0, roi: 0 };
    
    document.getElementById('revenuePerEuro').textContent = formatCurrency(targetData.roi);
    
    // Calculate marginal values
    const targetIndex = roiData.findIndex(d => d.achievement === 100);
    if (targetIndex > 0 && targetIndex < roiData.length - 1) {
        const prevPoint = roiData[targetIndex - 1];
        const nextPoint = roiData[targetIndex + 1];
        
        const marginalRevenue = (nextPoint.revenue - prevPoint.revenue) / 20; // 20% difference
        const marginalCompensation = (nextPoint.payout - prevPoint.payout) / 20;
        
        document.getElementById('marginalRevenue').textContent = formatCurrency(marginalRevenue);
        document.getElementById('marginalCompensation').textContent = formatCurrency(marginalCompensation);
    }
}

/**
 * Update risk analysis
 */
function updateRiskAnalysis() {
    const riskAssessment = generateRiskAssessment();
    
    // Update risk cards
    document.getElementById('lowRiskPayout').textContent = formatCurrency(riskAssessment.lowRiskPayout);
    document.getElementById('targetRiskPayout').textContent = formatCurrency(riskAssessment.targetPayout);
    document.getElementById('highRiskPayout').textContent = formatCurrency(riskAssessment.highRiskPayout);
    
    // Update risk assessment text
    document.getElementById('riskAssessment').innerHTML = `
        <p><strong>Risk Rating: ${riskAssessment.riskRating}</strong></p>
        <p>At target performance (100%), compensation represents ${riskAssessment.payoutPercentages.target.toFixed(1)}% of estimated profit.</p>
        <p>At high performance (150%), this increases to ${riskAssessment.payoutPercentages.highRisk.toFixed(1)}% of estimated profit.</p>
        <p><strong>Recommendation:</strong> ${riskAssessment.recommendation}</p>
    `;
    
    // Update risk chart
    const fte = parseFloat(document.getElementById('fte').value);
    const scenarioLevels = [80, 90, 100, 110, 120, 150];
    
    const riskPayouts = scenarioLevels.map(level => {
        const results = calculateTotalPayout(
            Array(4).fill(level),
            Array(12).fill(20000 * level / 100),
            fte
        );
        return results.totalPayout;
    });
    
    riskChart.data.datasets[0].data = riskPayouts;
    riskChart.update();
}

/**
 * Update comparison chart with elasticity data
 * @param {Array} elasticityComparison - Elasticity data for different structures
 */
function updateElasticityComparisonChart(elasticityComparison) {
    // Clear existing datasets
    elasticityComparisonChart.data.datasets = [];
    
    // Define colors
    const colors = [
        { color: '#d2004b', light: 'rgba(210, 0, 75, 0.1)' },
        { color: '#009988', light: 'rgba(0, 153, 136, 0.1)' },
        { color: '#0066cc', light: 'rgba(0, 102, 204, 0.1)' }
    ];
    
    // Add datasets
    elasticityComparison.forEach((data, index) => {
        const colorSet = colors[index % colors.length];
        
        elasticityComparisonChart.data.datasets.push({
            label: data.structureName,
            data: data.elasticity.map(d => d.totalExcludingContinuity),
            borderColor: colorSet.color,
            backgroundColor: colorSet.light,
            borderWidth: 2,
            fill: false
        });
    });
    
    // Update chart
    elasticityComparisonChart.update();
    
    // Show the container
    document.getElementById('elasticityComparisonContainer').style.display = 'block';
}