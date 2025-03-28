/**
 * Compensation Philosophy Analysis and Recommendations
 * This module handles the advanced analysis of compensation models
 */

let philosophyRadarChart, prizeLadderChart, distributionChart, psychologyChart, recommendationComparisonChart;

/**
 * Initialize the philosophy charts
 */
function initializePhilosophyCharts() {
    // Philosophy Radar Chart
    philosophyRadarChart = new Chart(
        document.getElementById('philosophyRadarChart'),
        {
            type: 'radar',
            data: {
                labels: ['Size of Prize', 'Below Target Support', 'At Target Incentive', 'Above Target Stretch', 'Near-Miss Psychology', 'Psychological Distance'],
                datasets: [{
                    label: 'Current Model',
                    data: [0, 0, 0, 0, 0, 0],
                    fill: true,
                    backgroundColor: 'rgba(85, 85, 85, 0.2)',
                    borderColor: 'rgb(85, 85, 85)',
                    pointBackgroundColor: 'rgb(85, 85, 85)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(85, 85, 85)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 10,
                        ticks: {
                            stepSize: 2
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
                                const dimension = context.chart.data.labels[context.dataIndex];
                                let description = '';
                                
                                switch (dimension) {
                                    case 'Size of Prize':
                                        description = 'Overall magnitude of potential variable compensation';
                                        break;
                                    case 'Below Target Support':
                                        description = 'Incentives available for underperforming periods';
                                        break;
                                    case 'At Target Incentive':
                                        description = 'Strength of motivation to hit 100% exactly';
                                        break;
                                    case 'Above Target Stretch':
                                        description = 'Reward for exceeding target expectations';
                                        break;
                                    case 'Near-Miss Psychology':
                                        description = 'Psychological tension when approaching target';
                                        break;
                                    case 'Psychological Distance':
                                        description = 'Optimal spacing between achievement thresholds';
                                        break;
                                }
                                
                                return [
                                    context.dataset.label + ': ' + context.raw + '/10',
                                    description
                                ];
                            }
                        }
                    }
                }
            }
        }
    );
    
    // Prize Ladder Chart
    prizeLadderChart = new Chart(
        document.getElementById('prizeLadderChart'),
        {
            type: 'bar',
            data: {
                labels: ['≤70%', '71-89%', '90-99%', '100%', '101-104%', '105-114%', '115-129%', '≥130%'],
                datasets: [
                    {
                        label: 'Payout at Level',
                        data: Array(8).fill(0),
                        backgroundColor: [
                            '#ffcccc',
                            '#ffdddd',
                            '#ffeeee',
                            '#d2004b',
                            '#ffeecc',
                            '#ffddaa',
                            '#ffcc88',
                            '#ffbb66'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Achievement Level'
                        }
                    },
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
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return formatCurrency(context.raw);
                            }
                        }
                    }
                }
            }
        }
    );
    
    // Distribution Chart
    distributionChart = new Chart(
        document.getElementById('distributionChart'),
        {
            type: 'pie',
            data: {
                labels: ['Below Target (<100%)', 'At Target (100%)', 'Above Target (>100%)'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: [
                        '#ffaaaa',
                        '#d2004b',
                        '#ff9900'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? Math.round(value / total * 100) : 0;
                                return `${label}: ${percentage}%`;
                            }
                        }
                    }
                }
            }
        }
    );
    
    // Psychology Chart - IMPROVED VERSION
    psychologyChart = new Chart(
        document.getElementById('psychologyChart'),
        {
            type: 'bar',
            data: {
                labels: ['90%', '91%', '92%', '93%', '94%', '95%', '96%', '97%', '98%', '99%', '100%', '101%', '102%', '103%', '104%', '105%'],
                datasets: [{
                    label: 'Incremental Payout',
                    data: Array(16).fill(0),
                    backgroundColor: function(context) {
                        const index = context.dataIndex;
                        // Highlight key thresholds
                        if (index === 10) return '#d2004b'; // 100%
                        if (index === 5) return '#ff8866';  // 95%
                        if (index === 15) return '#ff8866'; // 105%
                        return '#9966cc';
                    },
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Achievement Level'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Incremental Payout (€)'
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
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return context[0].label + ' Achievement';
                            },
                            label: function(context) {
                                return 'Additional payout: ' + formatCurrency(context.raw);
                            },
                            afterLabel: function(context) {
                                const index = context.dataIndex;
                                if (index === 10) { // 100%
                                    return 'Key target threshold';
                                }
                                if (index === 5 || index === 15) { // 95% or 105%
                                    return 'Quarterly bonus threshold';
                                }
                                return '';
                            }
                        }
                    },
                    annotation: {
                        annotations: {
                            targetLine: {
                                type: 'line',
                                xMin: 9.5,
                                xMax: 9.5,
                                borderColor: 'rgba(210, 0, 75, 0.3)',
                                borderWidth: 2,
                                borderDash: [6, 6],
                                label: {
                                    enabled: false
                                }
                            }
                        }
                    }
                }
            }
        }
    );
    
    // Recommendation Comparison Chart - IMPROVED VERSION
    recommendationComparisonChart = new Chart(
        document.getElementById('recommendationComparisonChart'),
        {
            type: 'line',
            data: {
                labels: Array.from({length: 41}, (_, i) => (i * 5) + '%'),
                datasets: [
                    {
                        label: 'Current Model',
                        data: Array(41).fill(0),
                        borderColor: '#555555',
                        backgroundColor: 'rgba(85, 85, 85, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Recommended Model',
                        data: Array(41).fill(0),
                        borderColor: '#d2004b',
                        backgroundColor: 'rgba(210, 0, 75, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1
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
                            text: 'Achievement (%)'
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
                                    // For difference dataset
                                    const value = context.raw;
                                    label += (value >= 0 ? '+' : '') + formatCurrency(value);
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
    
    // Add "Experimental" badge to psychology tab
    setTimeout(function() {
        const psychologyTab = document.querySelector('.philosophy-tabs .tab[data-tab="psychologyAnalysis"]');
        if (psychologyTab) {
            const badge = document.createElement('span');
            badge.className = 'experimental-badge';
            badge.textContent = 'EXPERIMENTAL';
            psychologyTab.appendChild(badge);
        }
    }, 100);
    
    // Show model comparison container initially but hide chart until we have recommendations
    document.getElementById('modelComparisonContainer').style.display = 'block';
}

/**
 * Initialize philosophy tab event listeners
 * UPDATED VERSION: Moves optimization goal to top
 */
function initializePhilosophyEvents() {
    // Philosophy tab navigation
    document.querySelectorAll('.philosophy-tabs .tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.philosophy-tabs .tab').forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab content
            document.querySelectorAll('.philosophy-analysis-section .tab-content').forEach(content => content.classList.remove('active'));
            
            // Show selected tab content
            document.getElementById(this.dataset.tab + 'Tab').classList.add('active');
        });
    });
    
    // Apply recommendations button
    document.getElementById('applyRecommendationsBtn').addEventListener('click', applyRecommendations);
    
    // Deep Analysis button
    document.getElementById('deepAnalysisBtn').addEventListener('click', () => {
        // Switch to philosophy tab
        document.querySelector('.tabs:not(.philosophy-tabs):not(.scenario-tabs) .tab[data-tab="effectiveness"]').click();
        
        // Perform deep analysis
        performDeepAnalysis();
    });
    
    // Recommendation goal dropdown
    document.getElementById('recommendationGoal').addEventListener('change', function() {
        // Regenerate recommendations with new goal focus
        const elasticityData = simulateElasticity();
        const riskAssessment = generateRiskAssessment();
        const philosophyMetrics = calculatePhilosophyMetrics(elasticityData, riskAssessment);
        
        // Generate goal-specific recommendations
        const recommendations = generateRecommendations(philosophyMetrics, elasticityData, this.value);
        
        // Update recommendations UI
        updateRecommendationsUI(recommendations);
        
        // Update radar chart for expected outcomes
        updateRecommendationRadarChart(philosophyMetrics, this.value);
    });
    
    // Add tooltips to the radar chart legend items
    // This adds interactive explanation for each dimension
    document.querySelectorAll('#radarChartLegend li').forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'rgba(210, 0, 75, 0.1)';
        });
        item.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'transparent';
        });
    });
    
    // Add support for loading the optimization goal selector properly
    // when the Recommendations tab is shown
    setTimeout(function() {
        // Add event listener to the recommendations tab
        const recommendationsTab = document.querySelector('.philosophy-tabs .tab[data-tab="recommendations"]');
        if (recommendationsTab) {
            recommendationsTab.addEventListener('click', function() {
                // Update the radar chart based on the selected goal
                const goalSelect = document.getElementById('recommendationGoal');
                if (goalSelect) {
                    const metrics = calculatePhilosophyMetrics(
                        simulateElasticity(), 
                        generateRiskAssessment()
                    );
                    updateRecommendationRadarChart(metrics, goalSelect.value);
                }
            });
        }
    }, 500);
}

/**
 * IMPROVED: Calculate philosophy metrics with correct understanding of thresholds
 * This version properly handles the non-stacking nature of bonuses and includes 
 * commission and continuity bonuses in the analysis
 */
function calculatePhilosophyMetrics(elasticityData, riskAssessment) {
    // Get base salary
    const baseSalary = parseFloat(document.getElementById('baseSalary').value) || 0;
    
    // Find payouts at key achievement levels - from elasticity data
    const payoutAt70 = elasticityData.find(d => d.achievement === 70)?.totalExcludingContinuity || 0;
    const payoutAt90 = elasticityData.find(d => d.achievement === 90)?.totalExcludingContinuity || 0;
    const payoutAt95 = elasticityData.find(d => d.achievement === 95)?.totalExcludingContinuity || 0;
    const payoutAt99 = elasticityData.find(d => d.achievement === 99)?.totalExcludingContinuity || 0;
    const payoutAt100 = elasticityData.find(d => d.achievement === 100)?.totalExcludingContinuity || 0;
    const payoutAt105 = elasticityData.find(d => d.achievement === 105)?.totalExcludingContinuity || 0;
    const payoutAt115 = elasticityData.find(d => d.achievement === 115)?.totalExcludingContinuity || 0;
    const payoutAt130 = elasticityData.find(d => d.achievement === 130)?.totalExcludingContinuity || 0;
    const maxPayout = elasticityData[elasticityData.length - 1].totalExcludingContinuity;
    
    // Get quarterly thresholds from settings
    const qThresholds = [];
    for (let i = 1; i <= 5; i++) {
        qThresholds.push(parseFloat(document.getElementById(`qThreshold${i}`).value));
    }
    qThresholds.sort((a, b) => a - b);
    
    // Calculate size of prize metrics
    const targetPayout = payoutAt100;
    const targetMultiple = targetPayout > 0 ? maxPayout / targetPayout : 0;
    
    // Calculate threshold spacing and psychological metrics
    // Analyze actual threshold effect based on elasticity data, not just settings
    const jumps = [
        { from: 95, to: 100, change: payoutAt100 - payoutAt95 },
        { from: 99, to: 100, change: payoutAt100 - payoutAt99 },
        { from: 100, to: 105, change: payoutAt105 - payoutAt100 },
        { from: 105, to: 115, change: payoutAt115 - payoutAt105 }
    ];
    
    // Find the most significant jumps
    jumps.sort((a, b) => b.change - a.change);
    const primaryJump = jumps[0];
    
    // If target jump is the primary jump, that's good for psych impact
    const isTargetJumpPrimary = primaryJump.from === 99 && primaryJump.to === 100;
    
    // Calculate the actual jump percentages (relative increases)
    const jumpPercentages = {};
    jumps.forEach(jump => {
        const fromValue = elasticityData.find(d => d.achievement === jump.from)?.totalExcludingContinuity || 0;
        if (fromValue > 0) {
            jumpPercentages[`${jump.from}_${jump.to}`] = (jump.change / fromValue) * 100;
        } else {
            jumpPercentages[`${jump.from}_${jump.to}`] = 0;
        }
    });
    
    // The target jump is the 99% to 100% jump
    const targetJump = payoutAt100 - payoutAt99;
    const targetJumpPercentage = payoutAt99 > 0 ? (targetJump / payoutAt99) * 100 : 0;
    
    // Calculate threshold gaps based on actual payouts, not just settings
    const thresholdPoints = [90, 100, 105, 115, 130];
    const actualGaps = [];
    
    for (let i = 1; i < thresholdPoints.length; i++) {
        const prevPoint = thresholdPoints[i-1];
        const currPoint = thresholdPoints[i];
        actualGaps.push(currPoint - prevPoint);
    }
    
    const avgGap = actualGaps.length > 0 ? 
        actualGaps.reduce((sum, gap) => sum + gap, 0) / actualGaps.length : 0;
    
    // Calculate distribution metrics
    // We want to analyze what percentage of "potential" is available at each range
    const belowTargetPotential = payoutAt90;
    const atTargetPotential = payoutAt100 - payoutAt90;
    const aboveTargetPotential = maxPayout - payoutAt100;
    const totalPotential = maxPayout;
    
    // Calculate percentages
    const belowTargetShare = totalPotential > 0 ? (belowTargetPotential / totalPotential) * 100 : 0;
    const atTargetShare = totalPotential > 0 ? (atTargetPotential / totalPotential) * 100 : 0;
    const aboveTargetShare = totalPotential > 0 ? (aboveTargetPotential / totalPotential) * 100 : 0;
    
    // Calculate pay mix ratios
    const targetTotalCompensation = baseSalary + targetPayout;
    const payMixRatio = baseSalary > 0 ? (targetPayout / baseSalary) * 100 : 0;
    
    // Calculate yearly target revenue percentage
    const yearlyTarget = parseFloat(document.getElementById('yearlyTarget').value);
    const targetPayoutPercentage = yearlyTarget > 0 ? (targetPayout / yearlyTarget) * 100 : 0;
    
    // SCORE CALCULATION - More balanced approach
    
    // Size of Prize score (1-10)
    let sizeOfPrizeScore = 5; // Default
    
    // If target multiple is very low, penalize
    if (targetMultiple < 1.5) sizeOfPrizeScore -= 2;
    else if (targetMultiple < 2) sizeOfPrizeScore -= 1;
    
    // If target multiple is in good range, bonus
    if (targetMultiple >= 2 && targetMultiple <= 3) sizeOfPrizeScore += 2;
    else if (targetMultiple > 3) sizeOfPrizeScore += 1;
    
    // Consider payout as percentage of revenue
    if (targetPayoutPercentage > 5) sizeOfPrizeScore -= 1;
    else if (targetPayoutPercentage < 1) sizeOfPrizeScore -= 1;
    else if (targetPayoutPercentage >= 1.5 && targetPayoutPercentage <= 3) sizeOfPrizeScore += 1;
    
    // Distribution score (1-10)
    let distributionScore = 5; // Default
    
    // Balance between below/at/above target
    if (belowTargetShare < 15) distributionScore -= 2;
    else if (belowTargetShare < 25) distributionScore -= 1;
    else if (belowTargetShare > 50) distributionScore -= 2;
    else if (belowTargetShare >= 25 && belowTargetShare <= 40) distributionScore += 1;
    
    if (atTargetShare < 10) distributionScore -= 1;
    else if (atTargetShare >= 15 && atTargetShare <= 25) distributionScore += 1;
    
    if (aboveTargetShare < 30) distributionScore -= 2;
    else if (aboveTargetShare < 40) distributionScore -= 1;
    else if (aboveTargetShare >= 40 && aboveTargetShare <= 60) distributionScore += 2;
    
    // Near-miss incentive score (1-10)
    let nearMissScore = 5; // Default
    
    // If target jump is significant, increase score
    if (targetJumpPercentage >= 15) nearMissScore += 2;
    else if (targetJumpPercentage >= 10) nearMissScore += 1;
    else if (targetJumpPercentage < 5) nearMissScore -= 2;
    else if (targetJumpPercentage < 10) nearMissScore -= 1;
    
    // If target jump is primary, that's good
    if (isTargetJumpPrimary) nearMissScore += 1;
    
    // Psychological distance score (1-10)
    let psychDistanceScore = 5; // Default
    
    // Optimal threshold spacing is 10-15%
    if (avgGap >= 10 && avgGap <= 15) psychDistanceScore += 2;
    else if (avgGap < 5) psychDistanceScore -= 2;
    else if (avgGap < 10) psychDistanceScore -= 1;
    else if (avgGap > 25) psychDistanceScore -= 2;
    else if (avgGap > 15) psychDistanceScore -= 1;
    
    // Cap scores between 1-10
    sizeOfPrizeScore = Math.max(1, Math.min(10, sizeOfPrizeScore));
    distributionScore = Math.max(1, Math.min(10, distributionScore));
    nearMissScore = Math.max(1, Math.min(10, nearMissScore));
    psychDistanceScore = Math.max(1, Math.min(10, psychDistanceScore));
    
    // Overall psychological mechanisms score
    const psychMechanismsScore = Math.round((nearMissScore + psychDistanceScore) / 2);
    
    // Evaluate typicality indicators
    const targetMultipleTypicality = getTypicalityIndicator(targetMultiple, 2, 3);
    const relativeSizeTypicality = getTypicalityIndicator(targetPayoutPercentage, 1, 3);
    const payMixTypicality = getTypicalityIndicator(payMixRatio, 15, 35);
    const belowTargetTypicality = getTypicalityIndicator(belowTargetShare, 20, 40);
    const atTargetTypicality = getTypicalityIndicator(atTargetShare, 10, 25);
    const aboveTargetTypicality = getTypicalityIndicator(aboveTargetShare, 40, 60);
    const targetJumpTypicality = getTypicalityIndicator(targetJumpPercentage, 10, 20);
    
    return {
        // Size of Prize metrics
        sizeOfPrize: {
            score: sizeOfPrizeScore,
            label: getSizeOfPrizeLabel(sizeOfPrizeScore),
            maxPotential: maxPayout,
            targetPayout: targetPayout,
            targetMultiple: targetMultiple,
            relativeSizePercentage: targetPayoutPercentage,
            targetMultipleTypicality: targetMultipleTypicality,
            relativeSizeTypicality: relativeSizeTypicality
        },
        
        // Pay Mix metrics
        payMix: {
            baseSalary: baseSalary,
            targetVariable: targetPayout,
            targetTotal: targetTotalCompensation,
            ratio: payMixRatio,
            typicality: payMixTypicality
        },
        
        // Distribution metrics
        distribution: {
            score: distributionScore,
            label: getDistributionLabel(distributionScore),
            belowTargetShare: belowTargetShare,
            atTargetShare: atTargetShare,
            aboveTargetShare: aboveTargetShare,
            belowTargetTypicality: belowTargetTypicality,
            atTargetTypicality: atTargetTypicality,
            aboveTargetTypicality: aboveTargetTypicality
        },
        
        // Psychological metrics
        psychology: {
            score: psychMechanismsScore,
            label: getPsychologyLabel(psychMechanismsScore),
            nearMiss: {
                score: nearMissScore,
                label: getNearMissLabel(nearMissScore),
                targetJump: targetJump,
                targetJumpPercentage: targetJumpPercentage,
                targetJumpTypicality: targetJumpTypicality,
                isTargetJumpPrimary: isTargetJumpPrimary,
                primaryJump: primaryJump
            },
            psychDistance: {
                score: psychDistanceScore,
                label: getPsychDistanceLabel(psychDistanceScore),
                avgGap: avgGap,
                thresholdGaps: actualGaps
            }
        },
        
        // Radar chart data
        radarData: [
            sizeOfPrizeScore,
            Math.min(10, belowTargetShare / 5), // Scale to 0-10
            Math.min(10, atTargetShare / 3),    // Scale to 0-10
            Math.min(10, aboveTargetShare / 6), // Scale to 0-10
            nearMissScore,
            psychDistanceScore
        ]
    };
}

/**
 * Update the philosophy analysis based on current model
 * IMPROVED VERSION: Ensures radar chart shows current state properly
 */
function updatePhilosophyAnalysis() {
    // Get elasticity data
    const elasticityData = simulateElasticity();
    
    // Get risk assessment data
    const riskAssessment = generateRiskAssessment();
    
    // Calculate philosophy metrics
    const philosophyMetrics = calculatePhilosophyMetrics(elasticityData, riskAssessment);
    
    // Update UI with metrics
    updatePhilosophyUI(philosophyMetrics, elasticityData);
    
    // Generate executive summary
    const executiveSummary = generateExecutiveSummary(philosophyMetrics, elasticityData);
    document.getElementById('executiveSummary').innerHTML = executiveSummary;
}

/**
 * Update the UI with philosophy metrics
 * IMPROVED VERSION: Ensures the radar chart shows before/after
 */
function updatePhilosophyUI(metrics, elasticityData) {
    // Size of Prize
    document.getElementById('sizeOfPrizeScore').textContent = metrics.sizeOfPrize.score;
    document.getElementById('sizeOfPrizeLabel').textContent = metrics.sizeOfPrize.label;
    document.getElementById('sizeOfPrizeDescription').textContent = getSizeOfPrizeDescription(metrics.sizeOfPrize.score);
    
    document.getElementById('maxPotentialValue').textContent = formatCurrency(metrics.sizeOfPrize.maxPotential);
    document.getElementById('targetMultipleValue').textContent = metrics.sizeOfPrize.targetMultiple.toFixed(1) + 'x';
    document.getElementById('relativeSizeValue').textContent = metrics.sizeOfPrize.relativeSizePercentage.toFixed(1) + '%';
    
    // Update typicality indicators
    document.getElementById('targetMultipleTypicality').textContent = getTypicalityText(metrics.sizeOfPrize.targetMultipleTypicality);
    document.getElementById('targetMultipleTypicality').className = 'typicality-indicator typicality-' + metrics.sizeOfPrize.targetMultipleTypicality;
    
    document.getElementById('relativeSizeTypicality').textContent = getTypicalityText(metrics.sizeOfPrize.relativeSizeTypicality);
    document.getElementById('relativeSizeTypicality').className = 'typicality-indicator typicality-' + metrics.sizeOfPrize.relativeSizeTypicality;
    
    // Pay Mix section
    document.getElementById('baseSalaryValue').textContent = formatCurrency(metrics.payMix.baseSalary);
    document.getElementById('targetVariableValue').textContent = formatCurrency(metrics.payMix.targetVariable);
    document.getElementById('targetTotalCompValue').textContent = formatCurrency(metrics.payMix.targetTotal);
    document.getElementById('payMixRatioValue').textContent = metrics.payMix.ratio.toFixed(1) + '%';
    
    document.getElementById('payMixTypicality').textContent = getTypicalityText(metrics.payMix.typicality);
    document.getElementById('payMixTypicality').className = 'typicality-indicator typicality-' + metrics.payMix.typicality;
    
    // Generate prize ladder analysis
    const prizeLadderText = generatePrizeLadderAnalysis(metrics, elasticityData);
    document.getElementById('prizeLadderAnalysis').innerHTML = prizeLadderText;
    
    // Prize Ladder Chart
    const prizeLabels = ['≤70%', '71-89%', '90-99%', '100%', '101-104%', '105-114%', '115-129%', '≥130%'];
    
    // Extract payout at each level with improved granularity
    const prizeLadderData = [
        elasticityData.find(d => d.achievement === 70)?.totalExcludingContinuity || 0,
        elasticityData.find(d => d.achievement === 85)?.totalExcludingContinuity || 0,
        elasticityData.find(d => d.achievement === 95)?.totalExcludingContinuity || 0,
        elasticityData.find(d => d.achievement === 100)?.totalExcludingContinuity || 0,
        elasticityData.find(d => d.achievement === 102)?.totalExcludingContinuity || 0, // 101-104% range
        elasticityData.find(d => d.achievement === 110)?.totalExcludingContinuity || 0,
        elasticityData.find(d => d.achievement === 120)?.totalExcludingContinuity || 0,
        elasticityData.find(d => d.achievement === 150)?.totalExcludingContinuity || 0
    ];
    
    prizeLadderChart.data.labels = prizeLabels;
    prizeLadderChart.data.datasets[0].data = prizeLadderData;
    prizeLadderChart.update();
    
    // Distribution metrics
    document.getElementById('rewardDistributionScore').textContent = metrics.distribution.score;
    document.getElementById('rewardDistributionLabel').textContent = metrics.distribution.label;
    document.getElementById('rewardDistributionDescription').textContent = getDistributionDescription(metrics.distribution.score);
    
    document.getElementById('belowTargetShare').textContent = metrics.distribution.belowTargetShare.toFixed(1) + '%';
    document.getElementById('atTargetShare').textContent = metrics.distribution.atTargetShare.toFixed(1) + '%';
    document.getElementById('aboveTargetShare').textContent = metrics.distribution.aboveTargetShare.toFixed(1) + '%';
    
    // Update typicality indicators for distribution
    document.getElementById('belowTargetTypicality').textContent = getTypicalityText(metrics.distribution.belowTargetTypicality);
    document.getElementById('belowTargetTypicality').className = 'typicality-indicator typicality-' + metrics.distribution.belowTargetTypicality;
    
    document.getElementById('atTargetTypicality').textContent = getTypicalityText(metrics.distribution.atTargetTypicality);
    document.getElementById('atTargetTypicality').className = 'typicality-indicator typicality-' + metrics.distribution.atTargetTypicality;
    
    document.getElementById('aboveTargetTypicality').textContent = getTypicalityText(metrics.distribution.aboveTargetTypicality);
    document.getElementById('aboveTargetTypicality').className = 'typicality-indicator typicality-' + metrics.distribution.aboveTargetTypicality;
    
    // Distribution Chart
    distributionChart.data.datasets[0].data = [
        metrics.distribution.belowTargetShare,
        metrics.distribution.atTargetShare,
        metrics.distribution.aboveTargetShare
    ];
    distributionChart.update();
    
    // Generate distribution insight
    const distributionInsight = generateDistributionInsight(metrics);
    document.getElementById('distributionInsight').innerHTML = distributionInsight;
    
    // Psychological metrics
    document.getElementById('psychMechanismsScore').textContent = metrics.psychology.score;
    document.getElementById('psychMechanismsLabel').textContent = metrics.psychology.label;
    document.getElementById('psychMechanismsDescription').textContent = getPsychologyDescription(metrics.psychology.score);
    
    document.getElementById('nearMissValue').textContent = metrics.psychology.nearMiss.label;
    document.getElementById('targetJumpValue').textContent = formatCurrency(metrics.psychology.nearMiss.targetJump);
    document.getElementById('psychDistanceValue').textContent = metrics.psychology.psychDistance.label;
    
    // Update target jump typicality
    document.getElementById('targetJumpTypicality').textContent = getTypicalityText(metrics.psychology.nearMiss.targetJumpTypicality);
    document.getElementById('targetJumpTypicality').className = 'typicality-indicator typicality-' + metrics.psychology.nearMiss.targetJumpTypicality;
    
    // Prepare complete psychology chart data - explicitly calculate ALL incremental payouts
    updatePsychologyChartData(elasticityData);
    
    // Generate psychology insight
    const psychologyInsight = generatePsychologyInsight(metrics);
    document.getElementById('psychologyInsight').innerHTML = psychologyInsight;
    
    // Update radar chart with just the current model data (recommendations will add projected data)
    philosophyRadarChart.data.datasets = [{
        label: 'Current Model',
        data: metrics.radarData,
        fill: true,
        backgroundColor: 'rgba(85, 85, 85, 0.2)',
        borderColor: 'rgb(85, 85, 85)',
        pointBackgroundColor: 'rgb(85, 85, 85)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(85, 85, 85)'
    }];
    philosophyRadarChart.update();
    
    // Update prize insight
    const prizeInsight = generatePrizeInsight(metrics);
    document.getElementById('prizeInsightText').innerHTML = prizeInsight;
    
    // Initialize recommendations based on current goal selection
    const goalSelect = document.getElementById('recommendationGoal');
    const recommendations = generateRecommendations(metrics, elasticityData, goalSelect.value);
    updateRecommendationsUI(recommendations);
    updateRecommendationRadarChart(metrics, goalSelect.value);
}

/**
 * Update psychology chart with accurate incremental payout data
 * IMPROVED VERSION: Better visualization of the threshold effect
 */
function updatePsychologyChartData(elasticityData) {
    if (!psychologyChart) return;
    
    // We need to analyze the payout jumps more precisely
    // For each percentage point from 90% to 105%, calculate the incremental payout
    const psychLabels = Array.from({length: 16}, (_, i) => (i + 90) + '%');
    const psychData = [];
    
    // Ensure we have complete elasticity data
    for (let i = 0; i < 16; i++) {
        const achievement = i + 90;
        
        // Find the current point and previous point
        const currentPoint = elasticityData.find(d => d.achievement === achievement);
        const prevPoint = elasticityData.find(d => d.achievement === (achievement - 1));
        
        if (currentPoint && prevPoint) {
            // Calculate the incremental increase
            psychData.push(currentPoint.totalExcludingContinuity - prevPoint.totalExcludingContinuity);
        } else {
            // If we don't have exact data, interpolate or use a placeholder
            // This shouldn't happen with our complete elasticity data, but just in case
            psychData.push(0);
        }
    }
    
    // Update the psychology chart
    psychologyChart.data.datasets[0].data = psychData;
    
    // Update chart colors to highlight key thresholds
    psychologyChart.data.datasets[0].backgroundColor = function(context) {
        const index = context.dataIndex;
        const achievement = index + 90;
        
        // Check if this is a key threshold from settings
        const isKeyThreshold = [90, 100, 105, 115].includes(achievement);
        
        // Special coloring for 100% achievement (10th index, which is 100%)
        if (achievement === 100) {
            return '#d2004b'; // Primary color for the 100% mark
        } else if (isKeyThreshold) {
            return '#ff8866'; // Highlight other key thresholds
        }
        
        return '#9966cc'; // Default color
    };
    
    psychologyChart.update();
}

/**
 * Generate executive summary with improved phrasing
 */
function generateExecutiveSummary(metrics, elasticityData) {
    // Calculate yearly target
    const yearlyTarget = parseFloat(document.getElementById('yearlyTarget').value);
    
    let summary = '<p>The current compensation model has the following key characteristics:</p><ul>';
    
    // Size of Prize summary
    summary += `<li><strong>Overall Incentive: ${metrics.sizeOfPrize.label}</strong> - `;
    if (metrics.sizeOfPrize.score >= 7) {
        summary += `With a maximum potential of ${metrics.sizeOfPrize.targetMultiple.toFixed(1)}x target, the model provides strong incentives for high achievement. At target (100%), the variable compensation represents ${metrics.sizeOfPrize.relativeSizePercentage.toFixed(1)}% of revenue.`;
    } else if (metrics.sizeOfPrize.score <= 3) {
        summary += `With only ${metrics.sizeOfPrize.targetMultiple.toFixed(1)}x target as maximum potential, the model may not sufficiently motivate exceptional performance. At target, variable compensation is ${metrics.sizeOfPrize.relativeSizePercentage.toFixed(1)}% of revenue.`;
    } else {
        summary += `The model offers a moderate ${metrics.sizeOfPrize.targetMultiple.toFixed(1)}x multiple from target to maximum payout. At target, variable compensation is ${metrics.sizeOfPrize.relativeSizePercentage.toFixed(1)}% of revenue.`;
    }
    summary += '</li>';
    
    // Distribution summary
    summary += `<li><strong>Reward Distribution: ${metrics.distribution.label}</strong> - `;
    if (metrics.distribution.belowTargetShare < 20) {
        summary += `With only ${metrics.distribution.belowTargetShare.toFixed(1)}% of potential below target, the model creates high tension around achieving 100%.`;
    } else if (metrics.distribution.belowTargetShare > 50) {
        summary += `With ${metrics.distribution.belowTargetShare.toFixed(1)}% of potential below target, the model provides strong support for underperformance periods.`;
    } else {
        summary += `The model balances risk and reward with ${metrics.distribution.belowTargetShare.toFixed(1)}% of potential below target and ${metrics.distribution.aboveTargetShare.toFixed(1)}% above.`;
    }
    summary += '</li>';
    
    // Psychological mechanisms summary
    summary += `<li><strong>Psychological Mechanisms: ${metrics.psychology.label}</strong> - `;
    if (metrics.psychology.nearMiss.score <= 3) {
        summary += `The jump at target is relatively small (${metrics.psychology.nearMiss.targetJumpPercentage.toFixed(1)}% increase), creating insufficient tension to reach exactly 100%.`;
    } else if (metrics.psychology.nearMiss.score >= 7) {
        summary += `The substantial jump at target (${metrics.psychology.nearMiss.targetJumpPercentage.toFixed(1)}% increase) creates effective psychological tension to reach 100%.`;
    } else {
        summary += `The moderate jump at target (${metrics.psychology.nearMiss.targetJumpPercentage.toFixed(1)}% increase) provides reasonable motivation to achieve exactly 100%.`;
    }
    
    // Add note about threshold spacing
    const avgGap = metrics.psychology.psychDistance.avgGap;
    if (avgGap < 8) {
        summary += ` Threshold spacing is quite narrow (${avgGap.toFixed(1)}% apart on average).`;
    } else if (avgGap > 20) {
        summary += ` Threshold spacing is quite wide (${avgGap.toFixed(1)}% apart on average).`;
    } else {
        summary += ` Threshold spacing is reasonable (${avgGap.toFixed(1)}% apart on average).`;
    }
    summary += '</li>';
    
    // Primary improvement area
    summary += '<li><strong>Primary Improvement Area:</strong> ';
    const lowestScore = Math.min(
        metrics.sizeOfPrize.score, 
        metrics.distribution.score, 
        metrics.psychology.score
    );
    
    if (lowestScore === metrics.sizeOfPrize.score) {
        summary += 'Enhancing the overall incentive potential would provide the greatest improvement.';
    } else if (lowestScore === metrics.distribution.score) {
        summary += 'Rebalancing the distribution of rewards across achievement levels would optimize the model.';
    } else {
        summary += 'Strengthening the psychological mechanisms, especially around target achievement, would make the model more effective.';
    }
    summary += '</li>';
    
    // Financial impact
    summary += `<li><strong>Financial Perspective:</strong> `;
    if (metrics.sizeOfPrize.relativeSizePercentage > 5) {
        summary += `At ${metrics.sizeOfPrize.relativeSizePercentage.toFixed(1)}% of revenue, this model allocates a relatively high portion of revenue to variable compensation (typical range is 1-3%).`;
    } else if (metrics.sizeOfPrize.relativeSizePercentage < 1) {
        summary += `At ${metrics.sizeOfPrize.relativeSizePercentage.toFixed(1)}% of revenue, this model allocates a relatively low portion of revenue to variable compensation (typical range is 1-3%).`;
    } else {
        summary += `At ${metrics.sizeOfPrize.relativeSizePercentage.toFixed(1)}% of revenue, this model falls within typical industry ranges for variable compensation (1-3% of revenue).`;
    }
    summary += '</li>';
    
    summary += '</ul>';
    
    return summary;
}

/**
 * Generate the prize ladder analysis text
 */
function generatePrizeLadderAnalysis(metrics, elasticityData) {
    // Find key percentage point jumps
    const jump90to100 = (elasticityData.find(d => d.achievement === 100)?.totalExcludingContinuity || 0) - 
                        (elasticityData.find(d => d.achievement === 90)?.totalExcludingContinuity || 0);
    
    const jump100to130 = (elasticityData.find(d => d.achievement === 130)?.totalExcludingContinuity || 0) - 
                         (elasticityData.find(d => d.achievement === 100)?.totalExcludingContinuity || 0);
    
    const largestJump = Math.max(jump90to100, jump100to130);
    const targetPayout = elasticityData.find(d => d.achievement === 100)?.totalExcludingContinuity || 0;
    const maxPayout = elasticityData[elasticityData.length - 1].totalExcludingContinuity;
    
    // Get yearly target from input
    const yearlyTarget = parseFloat(document.getElementById('yearlyTarget').value);
    
    let analysis = '<p>This visualization shows the total payout at different achievement levels.</p>';
    
    // Size of prize analysis
    if (metrics.sizeOfPrize.score >= 7) {
        analysis += `<p>The model provides a <strong>strong overall incentive</strong> with a maximum potential payout of ${formatCurrency(maxPayout)} 
        at 200% achievement, which is ${metrics.sizeOfPrize.targetMultiple.toFixed(1)}x the target payout.</p>`;
    } else if (metrics.sizeOfPrize.score <= 3) {
        analysis += `<p>The model provides a <strong>limited overall incentive</strong> with a maximum potential of only ${metrics.sizeOfPrize.targetMultiple.toFixed(1)}x 
        the target payout.</p>`;
    } else {
        analysis += `<p>The model provides a <strong>moderate overall incentive</strong> with a maximum potential of ${formatCurrency(maxPayout)}, 
        which is ${metrics.sizeOfPrize.targetMultiple.toFixed(1)}x the target payout.</p>`;
    }
    
    // Financial analysis
    analysis += `<p>At target performance (100%), the variable compensation represents approximately ${(targetPayout / yearlyTarget * 100).toFixed(1)}% 
    of revenue. Industry benchmarks typically range from 1% to 3% for most sales roles.</p>`;
    
    // Comment on the largest jump
    if (jump90to100 > jump100to130) {
        analysis += `<p>The largest payout increase (${formatCurrency(jump90to100)}) occurs when moving from 90% to 100% achievement, 
        creating a strong incentive to reach target exactly.</p>`;
    } else {
        analysis += `<p>The largest payout increase (${formatCurrency(jump100to130)}) occurs when moving from 100% to 130% achievement, 
        creating a stronger incentive for above-target performance.</p>`;
    }
    
    // Pay mix analysis
    const baseSalary = parseFloat(document.getElementById('baseSalary').value) || 0;
    if (baseSalary > 0) {
        const targetTotalComp = baseSalary + targetPayout;
        const variablePercentage = (targetPayout / targetTotalComp * 100).toFixed(1);
        
        analysis += `<p>The pay mix shows variable compensation representing ${variablePercentage}% of target total compensation. `;
        
        if (parseFloat(variablePercentage) < 20) {
            analysis += `This is relatively low for a sales role, where variable typically represents 25-40% of total compensation.</p>`;
        } else if (parseFloat(variablePercentage) > 40) {
            analysis += `This is relatively high for a sales role, creating a high-risk, high-reward environment.</p>`;
        } else {
            analysis += `This is within the typical range for sales roles (25-40% variable).</p>`;
        }
    }
    
    return analysis;
}

/**
 * Generate the prize insight text
 */
function generatePrizeInsight(metrics) {
    let insight = '';
    
    // Overall size of prize assessment
    if (metrics.sizeOfPrize.score >= 7) {
        insight += `The compensation model offers <strong>substantial incentive potential</strong> with a ${metrics.sizeOfPrize.targetMultiple.toFixed(1)}x multiple from target to maximum payout. `;
        insight += `This creates strong motivation for exceptional performance and helps attract and retain top talent.`;
    } else if (metrics.sizeOfPrize.score <= 3) {
        insight += `The compensation model offers <strong>limited incentive potential</strong> with only a ${metrics.sizeOfPrize.targetMultiple.toFixed(1)}x multiple from target to maximum payout. `;
        insight += `This may not create sufficient motivation for exceptional performance or help attract top talent.`;
    } else {
        insight += `The compensation model offers <strong>moderate incentive potential</strong> with a ${metrics.sizeOfPrize.targetMultiple.toFixed(1)}x multiple from target to maximum payout. `;
        insight += `This creates reasonable motivation for above-target performance, though there may be room for enhancement.`;
    }
    
    // Pay mix assessment
    if (metrics.payMix.baseSalary > 0) {
        insight += `<br><br>The pay mix shows variable compensation at ${metrics.payMix.ratio.toFixed(1)}% of base salary. `;
        
        if (metrics.payMix.typicality === 'below') {
            insight += `This is below the typical range (15-35%) for most sales roles, potentially limiting motivation for target achievement.`;
        } else if (metrics.payMix.typicality === 'above') {
            insight += `This is above the typical range (15-35%) for most sales roles, creating a higher-risk, higher-reward environment.`;
        } else {
            insight += `This falls within the typical range (15-35%) for most sales roles, balancing security and motivation.`;
        }
    }
    
    return insight;
}

/**
 * Generate the distribution insight text
 */
function generateDistributionInsight(metrics) {
    let insight = '<h4>Reward Distribution Insights</h4>';
    
    if (metrics.distribution.belowTargetShare < 20) {
        insight += `<p>The current model provides <strong>minimal incentives below target</strong>, with only ${metrics.distribution.belowTargetShare.toFixed(1)}% 
        of potential compensation available below 100% achievement. This creates a high-risk environment where underperformance is severely penalized.</p>`;
    } else if (metrics.distribution.belowTargetShare > 50) {
        insight += `<p>The current model provides <strong>substantial compensation below target</strong>, with ${metrics.distribution.belowTargetShare.toFixed(1)}% 
        of potential compensation available below 100% achievement. This creates a low-risk environment but may reduce motivation to achieve 100%.</p>`;
    } else {
        insight += `<p>The current model has a <strong>balanced distribution</strong> with ${metrics.distribution.belowTargetShare.toFixed(1)}% of potential 
        available below target, providing reasonable support for underperformers while still incentivizing target achievement.</p>`;
    }
    
    if (metrics.distribution.atTargetShare < 10) {
        insight += `<p>The <strong>small jump at target</strong> (only ${metrics.distribution.atTargetShare.toFixed(1)}% of potential) may weaken the psychological 
        impact of reaching 100% achievement.</p>`;
    } else if (metrics.distribution.atTargetShare > 25) {
        insight += `<p>The <strong>substantial jump at target</strong> (${metrics.distribution.atTargetShare.toFixed(1)}% of potential) creates a powerful 
        psychological incentive to reach exactly 100% achievement.</p>`;
    }
    
    if (metrics.distribution.aboveTargetShare < 30) {
        insight += `<p>With only ${metrics.distribution.aboveTargetShare.toFixed(1)}% of potential available above target, the model provides <strong>limited 
        upside potential</strong> for top performers.</p>`;
    } else if (metrics.distribution.aboveTargetShare > 60) {
        insight += `<p>With ${metrics.distribution.aboveTargetShare.toFixed(1)}% of potential available above target, the model provides <strong>substantial 
        upside potential</strong> for top performers, which may drive exceptional achievement.</p>`;
    }
    
    // Add industry benchmark comparison
    insight += `<p><strong>Industry benchmark comparison:</strong><br>
    Typical models allocate 25-40% below target, 15-25% at target, and 40-60% above target. 
    This model's distribution is ${getDistributionComparisonText(metrics)}.</p>`;
    
    return insight;
}

/**
 * Get distribution comparison text
 */
function getDistributionComparisonText(metrics) {
    const belowStatus = metrics.distribution.belowTargetTypicality;
    const atStatus = metrics.distribution.atTargetTypicality;
    const aboveStatus = metrics.distribution.aboveTargetTypicality;
    
    if (belowStatus === 'typical' && atStatus === 'typical' && aboveStatus === 'typical') {
        return 'well aligned with industry benchmarks';
    }
    
    let issues = [];
    
    if (belowStatus === 'below') {
        issues.push('less support below target');
    } else if (belowStatus === 'above') {
        issues.push('more support below target');
    }
    
    if (atStatus === 'below') {
        issues.push('weaker target incentive');
    } else if (atStatus === 'above') {
        issues.push('stronger target incentive');
    }
    
    if (aboveStatus === 'below') {
        issues.push('less upside potential');
    } else if (aboveStatus === 'above') {
        issues.push('more upside potential');
    }
    
    if (issues.length === 0) {
        return 'generally aligned with industry benchmarks';
    }
    
    return 'notable for ' + issues.join(' and ') + ' compared to typical models';
}

/**
 * Generate the psychology insight text
 * IMPROVED VERSION: More accurate insights about threshold effects
 */
function generatePsychologyInsight(metrics) {
    let insight = '<h4>Psychological Mechanism Insights</h4>';
    
    // Near-miss psychology - focus on accurate payout mechanics
    const targetJumpPercentage = metrics.psychology.nearMiss.targetJumpPercentage;
    
    insight += `<p>When transitioning from 99% to 100% achievement, the payout increases by ${targetJumpPercentage.toFixed(1)}%. `;
    
    if (metrics.psychology.nearMiss.score <= 3) {
        insight += `This <strong>relatively small jump</strong> may not create sufficient psychological tension to drive exact target attainment. Research in behavioral economics suggests that meaningful threshold jumps (10-20%) create stronger motivation to reach key milestones.</p>`;
    } else if (metrics.psychology.nearMiss.score >= 7) {
        insight += `This <strong>substantial jump</strong> creates effective psychological tension to reach exactly 100%. Behavioral economics research shows that meaningful threshold jumps (10-20%) create strong motivation to reach key milestones.</p>`;
    } else {
        insight += `This <strong>moderate jump</strong> creates reasonable tension to reach exactly 100%. Behavioral research suggests that threshold jumps of 10-20% are most effective at motivating target achievement.</p>`;
    }
    
    // Is target jump the primary jump?
    const primaryJump = metrics.psychology.nearMiss.primaryJump;
    if (!metrics.psychology.nearMiss.isTargetJumpPrimary) {
        insight += `<p>Note that the <strong>largest payout increase</strong> actually occurs between ${primaryJump.from}% and ${primaryJump.to}% achievement, potentially shifting focus away from the 100% target.</p>`;
    } else {
        insight += `<p>The jump at 100% achievement is the <strong>largest single increase</strong> in the model, which helps focus attention on reaching exactly 100%.</p>`;
    }
    
    // Psychological distance
    const avgGap = metrics.psychology.psychDistance.avgGap;
    insight += `<p>The threshold spacing (average gap: ${avgGap.toFixed(1)}%) `;
    
    if (metrics.psychology.psychDistance.score <= 3) {
        insight += `creates <strong>sub-optimal psychological distances</strong> between achievement levels. `;
        
        if (avgGap < 7) {
            insight += `The thresholds are too close together, potentially making each level feel like an insufficient achievement step.`;
        } else if (avgGap > 20) {
            insight += `The thresholds are too far apart, potentially making higher levels feel unattainable.`;
        }
    } else if (metrics.psychology.psychDistance.score >= 7) {
        insight += `creates <strong>optimal psychological distances</strong> between achievement levels, making each next threshold feel attainable yet meaningful.`;
    } else {
        insight += `creates <strong>reasonable psychological distances</strong> between achievement levels, though there may be room for optimization.`;
    }
    insight += `</p>`;
    
    // Threshold understanding note
    insight += `<p><strong>Important note:</strong> In this model, bonuses are applied based on which threshold is reached, not stacked. This means that at each achievement level, the person receives only the bonus for that specific level, not cumulative bonuses from all lower levels. This structure creates clear "steps" in the compensation curve.</p>`;
    
    // Industry benchmarks for psychology
    insight += `<p><strong>Industry benchmarks:</strong><br>
    Effective models typically show a 10-20% payout increase at the 100% threshold, creating clear psychological tension. 
    Optimal threshold spacing is typically 10-15%, which creates the right balance between achievability and meaningful progress.</p>`;
    
    // The power of continuity bonuses
    const continuityThreshold = parseFloat(document.getElementById('continuityThreshold').value);
    insight += `<p>The continuity bonus mechanism that rewards sustained performance above ${continuityThreshold}% leverages the <strong>psychological principle of consistency</strong>, 
    encouraging persistent high performance rather than inconsistent peaks.</p>`;
    
    return insight;
}

/**
 * NEW FUNCTION: Update recommendation radar chart to show current vs recommended
 */
function updateRecommendationRadarChart(metrics, goalFocus) {
    // Only update if there is a radar chart available
    if (!philosophyRadarChart) return;
    
    // Get current values
    const currentData = metrics.radarData;
    
    // Create projected values based on goal focus
    let projectedData = [...currentData]; // Start with a copy
    
    // Adjust projections based on goal focus
    switch(goalFocus) {
        case 'target':
            // Improve at-target incentive and near-miss psychology
            projectedData[2] = Math.min(10, currentData[2] * 1.3); // At Target Incentive
            projectedData[4] = Math.min(10, currentData[4] * 1.3); // Near-Miss Psychology
            break;
        
        case 'topPerformers':
            // Improve size of prize and above-target stretch
            projectedData[0] = Math.min(10, currentData[0] * 1.2); // Size of Prize
            projectedData[3] = Math.min(10, currentData[3] * 1.4); // Above Target Stretch
            break;
        
        case 'balance':
            // Improve below-target support and distribution balance
            projectedData[1] = Math.min(10, currentData[1] * 1.3); // Below Target Support
            // Make other dimensions more balanced
            projectedData = projectedData.map(val => {
                if (val < 4) return Math.min(10, val * 1.2);
                return val;
            });
            break;
        
        case 'overall':
        default:
            // Improve the lowest dimensions
            const minScore = Math.min(...currentData);
            projectedData = projectedData.map(val => {
                if (val === minScore) return Math.min(10, val * 1.3);
                return val;
            });
            break;
    }
    
    // Update radar chart to include both current and projected values
    philosophyRadarChart.data.datasets = [
        {
            label: 'Current Model',
            data: currentData,
            fill: true,
            backgroundColor: 'rgba(85, 85, 85, 0.2)',
            borderColor: 'rgb(85, 85, 85)',
            pointBackgroundColor: 'rgb(85, 85, 85)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(85, 85, 85)'
        },
        {
            label: 'Projected with Recommendations',
            data: projectedData,
            fill: true,
            backgroundColor: 'rgba(210, 0, 75, 0.2)',
            borderColor: 'rgb(210, 0, 75)',
            pointBackgroundColor: 'rgb(210, 0, 75)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(210, 0, 75)'
        }
    ];
    
    philosophyRadarChart.update();
}

/**
 * Update model comparison chart
 * IMPROVED VERSION: Better visualization of differences between models
 */
function updateModelComparisonChart(currentData, newData) {
    // First ensure we have both datasets with the same length and points
    const achievementPoints = Array.from({length: 41}, (_, i) => i * 5);
    
    // Normalize data points to ensure we're comparing the same achievement levels
    const normalizedCurrent = [];
    const normalizedNew = [];
    const differenceData = [];
    
    achievementPoints.forEach(achievement => {
        // Find current model value at this achievement
        const currentPoint = currentData.find(d => d.achievement === achievement)?.totalExcludingContinuity || 0;
        normalizedCurrent.push(currentPoint);
        
        // Find new model value at this achievement
        const newPoint = newData.find(d => d.achievement === achievement)?.totalExcludingContinuity || 0;
        normalizedNew.push(newPoint);
        
        // Calculate difference (for a separate dataset showing the delta)
        differenceData.push(newPoint - currentPoint);
    });
    
    // Update the comparison chart
    recommendationComparisonChart.data.labels = achievementPoints.map(a => a + '%');
    
    recommendationComparisonChart.data.datasets = [
        {
            label: 'Current Model',
            data: normalizedCurrent,
            borderColor: '#555555',
            backgroundColor: 'rgba(85, 85, 85, 0.1)',
            borderWidth: 2,
            fill: false
        },
        {
            label: 'Recommended Model',
            data: normalizedNew,
            borderColor: '#d2004b',
            backgroundColor: 'rgba(210, 0, 75, 0.1)',
            borderWidth: 2,
            fill: false
        }
    ];
    
    // Add the difference chart if there are meaningful differences
    const maxDiff = Math.max(...differenceData.map(d => Math.abs(d)));
    if (maxDiff > 50) { // Only show if there's a meaningful difference
        recommendationComparisonChart.data.datasets.push({
            label: 'Difference',
            data: differenceData,
            borderColor: '#0066cc',
            backgroundColor: 'rgba(0, 102, 204, 0.3)',
            borderWidth: 1,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: true,
            yAxisID: 'y1'
        });
        
        // Update chart options to include second y-axis for difference
        recommendationComparisonChart.options.scales.y1 = {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
                drawOnChartArea: false
            },
            title: {
                display: true,
                text: 'Difference (€)'
            },
            ticks: {
                callback: function(value) {
                    return (value >= 0 ? '+' : '') + '€' + value.toLocaleString('de-DE');
                }
            }
        };
    } else {
        // If difference is not significant, ensure we don't have a second y-axis
        if (recommendationComparisonChart.options.scales.y1) {
            delete recommendationComparisonChart.options.scales.y1;
        }
    }
    
    // Highlight key achievement points
    recommendationComparisonChart.options.plugins.annotation = {
        annotations: {
            target100Line: {
                type: 'line',
                xMin: '100%',
                xMax: '100%',
                borderColor: 'rgba(210, 0, 75, 0.5)',
                borderWidth: 2,
                borderDash: [6, 6],
                label: {
                    content: 'Target (100%)',
                    enabled: true,
                    position: 'top'
                }
            }
        }
    };
    
    recommendationComparisonChart.update();
}

/**
 * Update elasticity comparison chart
 * IMPROVED VERSION: Better comparison between different models
 */
function updateElasticityComparisonChart(elasticityComparison) {
    // Clear existing datasets
    elasticityComparisonChart.data.datasets = [];
    
    // Define colors with better contrast
    const colors = [
        { color: '#d2004b', light: 'rgba(210, 0, 75, 0.1)' },
        { color: '#009988', light: 'rgba(0, 153, 136, 0.1)' },
        { color: '#0066cc', light: 'rgba(0, 102, 204, 0.1)' }
    ];
    
    // Add datasets with improved visualization
    elasticityComparison.forEach((data, index) => {
        const colorSet = colors[index % colors.length];
        
        // Ensure we have data points at standard intervals for better comparison
        const standardizedData = [];
        for (let achievement = 0; achievement <= 200; achievement += 5) {
            // Find closest match in the data
            const point = data.elasticity.find(d => d.achievement === achievement);
            if (point) {
                standardizedData.push(point.totalExcludingContinuity);
            } else {
                // Interpolate between points
                const lowerPoints = data.elasticity.filter(d => d.achievement < achievement);
                const upperPoints = data.elasticity.filter(d => d.achievement > achievement);
                
                if (lowerPoints.length > 0 && upperPoints.length > 0) {
                    const lowerPoint = lowerPoints.reduce((a, b) => a.achievement > b.achievement ? a : b);
                    const upperPoint = upperPoints.reduce((a, b) => a.achievement < b.achievement ? a : b);
                    
                    const range = upperPoint.achievement - lowerPoint.achievement;
                    const position = (achievement - lowerPoint.achievement) / range;
                    
                    const interpolatedValue = lowerPoint.totalExcludingContinuity + 
                        (upperPoint.totalExcludingContinuity - lowerPoint.totalExcludingContinuity) * position;
                    
                    standardizedData.push(interpolatedValue);
                } else if (lowerPoints.length > 0) {
                    // Use the highest available point
                    standardizedData.push(lowerPoints.reduce((a, b) => a.achievement > b.achievement ? a : b).totalExcludingContinuity);
                } else if (upperPoints.length > 0) {
                    // Use the lowest available point
                    standardizedData.push(upperPoints.reduce((a, b) => a.achievement < b.achievement ? a : b).totalExcludingContinuity);
                } else {
                    standardizedData.push(0); // Fallback
                }
            }
        }
        
        elasticityComparisonChart.data.datasets.push({
            label: data.structureName,
            data: standardizedData,
            borderColor: colorSet.color,
            backgroundColor: colorSet.light,
            borderWidth: 2,
            fill: false,
            pointRadius: 0,
            tension: 0.1
        });
    });
    
    // Add annotations for key targets
    elasticityComparisonChart.options.plugins.annotation = {
        annotations: {
            target100Line: {
                type: 'line',
                xMin: 20, // 100% achievement will be the 20th data point (0, 5, 10, ..., 100)
                xMax: 20,
                borderColor: 'rgba(0, 0, 0, 0.3)',
                borderWidth: 1,
                borderDash: [6, 6]
            }
        }
    };
    
    // Update chart
    elasticityComparisonChart.update();
    
    // Show the container
    document.getElementById('elasticityComparisonContainer').style.display = 'block';
    
    // Add a comparison summary if we have multiple structures
    if (elasticityComparison.length > 1) {
        // Get key metrics for comparison
        const comparisons = elasticityComparison.map(data => {
            const payoutAt100 = data.elasticity.find(d => d.achievement === 100)?.totalExcludingContinuity || 0;
            const payoutAt150 = data.elasticity.find(d => d.achievement === 150)?.totalExcludingContinuity || 0;
            const maxPayout = data.elasticity[data.elasticity.length - 1].totalExcludingContinuity;
            
            return {
                name: data.structureName,
                payoutAt100,
                payoutAt150,
                maxPayout,
                ratioMax: payoutAt100 > 0 ? maxPayout / payoutAt100 : 0
            };
        });
        
        // Create comparison table
        const comparisonTable = document.createElement('table');
        comparisonTable.className = 'comparison-table';
        comparisonTable.innerHTML = `
            <thead>
                <tr>
                    <th>Structure</th>
                    <th>Target Payout (100%)</th>
                    <th>High Payout (150%)</th>
                    <th>Max Multiple</th>
                </tr>
            </thead>
            <tbody>
                ${comparisons.map(c => `
                    <tr>
                        <td>${c.name}</td>
                        <td>${formatCurrency(c.payoutAt100)}</td>
                        <td>${formatCurrency(c.payoutAt150)}</td>
                        <td>${c.ratioMax.toFixed(1)}x</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        
        // Add table to the container
        const container = document.getElementById('elasticityComparisonContainer');
        
        // Remove existing table if present
        const existingTable = container.querySelector('table');
        if (existingTable) {
            container.removeChild(existingTable);
        }
        
        container.appendChild(comparisonTable);
    }
}

/**
 * Update the recommendations UI
 * IMPROVED VERSION: Adds radar chart explanation and moves goal selector
 */
function updateRecommendationsUI(recommendations) {
    const container = document.getElementById('recommendationsContainer');
    container.innerHTML = '';
    
    // Add explanation for the radar chart comparison
    const radarExplanation = document.createElement('div');
    radarExplanation.className = 'recommendation-explanation';
    radarExplanation.innerHTML = `
        <p>The radar chart above shows your current model (gray) compared to the projected impact of applying 
        these recommendations (pink). No compensation model will achieve perfect scores in all dimensions, 
        as optimizing for one goal often requires trade-offs in other areas.</p>
    `;
    container.appendChild(radarExplanation);
    
    // Show the radar comparison
    document.getElementById('modelComparisonContainer').style.display = 'block';
    
    if (recommendations.length === 0) {
        container.innerHTML += '<p>No specific recommendations at this time. The current compensation structure appears well-optimized for your selected goal.</p>';
        return;
    }
    
    // Add recommendations
    recommendations.forEach((rec, index) => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.dataset.index = index;
        
        const header = document.createElement('div');
        header.className = 'recommendation-header';
        
        const title = document.createElement('h3');
        title.className = 'recommendation-title';
        title.textContent = rec.title;
        
        const impact = document.createElement('span');
        impact.className = `recommendation-impact impact-${rec.impact}`;
        impact.textContent = rec.impact.charAt(0).toUpperCase() + rec.impact.slice(1) + ' Impact';
        
        header.appendChild(title);
        header.appendChild(impact);
        
        const content = document.createElement('div');
        content.className = 'recommendation-content';
        
        const reasoning = document.createElement('p');
        reasoning.className = 'recommendation-reasoning';
        reasoning.textContent = rec.reasoning;
        
        const details = document.createElement('div');
        details.className = 'recommendation-details';
        
        // Generate details table
        let detailsHTML = '<table><tr><th>Setting</th><th>Current</th><th>Recommended</th></tr>';
        
        rec.changes.forEach(change => {
            let fieldName = '';
            let oldValueDisplay = '';
            let newValueDisplay = '';
            
            // Format based on field type
            if (change.type === 'commission') {
                const thresholdIndex = change.field.replace('commPercentage', '');
                fieldName = `Commission Tier ${thresholdIndex}`;
                oldValueDisplay = change.oldValue + '%';
                newValueDisplay = change.newValue.toFixed(1) + '%';
            } else if (change.type === 'quarterlyBonus') {
                const bonusIndex = change.field.replace(/^q/, '').replace(/Threshold|Bonus/g, '');
                
                if (change.field.includes('Threshold')) {
                    fieldName = `Q-Bonus Threshold ${bonusIndex}`;
                    oldValueDisplay = change.oldValue + '%';
                    newValueDisplay = change.newValue + '%';
                } else if (change.field.includes('Upto')) {
                    fieldName = `Q-Bonus Upper Limit ${bonusIndex}`;
                    oldValueDisplay = change.oldValue + '%';
                    newValueDisplay = change.newValue + '%';
                } else {
                    fieldName = `Q-Bonus Amount ${bonusIndex}`;
                    oldValueDisplay = formatCurrency(change.oldValue);
                    newValueDisplay = formatCurrency(change.newValue);
                }
            } else if (change.type === 'rollingAverage') {
                fieldName = '3-Month Rolling Average';
                oldValueDisplay = change.oldValue ? 'Enabled' : 'Disabled';
                newValueDisplay = change.newValue ? 'Enabled' : 'Disabled';
            }
            
            detailsHTML += `<tr><td>${fieldName}</td><td>${oldValueDisplay}</td><td>${newValueDisplay}</td></tr>`;
        });
        
        detailsHTML += '</table>';
        details.innerHTML = detailsHTML;
        
        const actions = document.createElement('div');
        actions.className = 'recommendation-actions';
        
        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply This Recommendation';
        applyButton.className = 'button-secondary';
        applyButton.addEventListener('click', () => applySingleRecommendation(index));
        
        const explanation = document.createElement('p');
        explanation.className = 'recommendation-explanation';
        explanation.textContent = getRecommendationExplanation(rec.type);
        
        actions.appendChild(applyButton);
        
        content.appendChild(reasoning);
        content.appendChild(details);
        
        card.appendChild(header);
        card.appendChild(content);
        card.appendChild(actions);
        card.appendChild(explanation);
        
        container.appendChild(card);
    });
}

/**
 * Function to handle applying a recommendation then updating the radar chart
 */
function applySingleRecommendation(index) {
    const goalSelect = document.getElementById('recommendationGoal');
    
    // Store current state for comparison
    const currentElasticityData = simulateElasticity();
    const currentMetrics = calculatePhilosophyMetrics(
        currentElasticityData, 
        generateRiskAssessment()
    );
    
    // Get the recommendations
    const recommendations = generateRecommendations(
        currentMetrics,
        currentElasticityData,
        goalSelect.value
    );
    
    const recommendation = recommendations[index];
    
    // Apply changes
    recommendation.changes.forEach(change => {
        if (change.field === 'useRollingAverage') {
            document.getElementById(change.field).checked = change.newValue;
            if (change.newValue) {
                document.getElementById('previousMonthsContainer').style.display = 'block';
            } else {
                document.getElementById('previousMonthsContainer').style.display = 'none';
            }
        } else {
            document.getElementById(change.field).value = change.newValue;
        }
    });
    
    // Recalculate and update UI
    document.getElementById('calculateBtn').click();
    
    // Get new elasticity data
    const newElasticityData = simulateElasticity();
    
    // Update model comparison
    updateModelComparisonChart(currentElasticityData, newElasticityData);
    
    // Show model comparison
    document.getElementById('modelComparisonContainer').style.display = 'block';
    
    // Update radar chart
    const newMetrics = calculatePhilosophyMetrics(
        newElasticityData, 
        generateRiskAssessment()
    );
    
    // Update philosophy analysis
    updatePhilosophyAnalysis();
    
    // Add a summary of what was changed
    const changes = recommendation.changes.map(change => {
        let fieldName = '';
        let oldValueDisplay = '';
        let newValueDisplay = '';
        
        // Format based on field type
        if (change.type === 'commission') {
            const thresholdIndex = change.field.replace('commPercentage', '');
            fieldName = `Commission Tier ${thresholdIndex}`;
            oldValueDisplay = change.oldValue + '%';
            newValueDisplay = change.newValue.toFixed(1) + '%';
        } else if (change.type === 'quarterlyBonus') {
            const bonusIndex = change.field.replace(/^q/, '').replace(/Threshold|Bonus/g, '');
            
            if (change.field.includes('Threshold')) {
                fieldName = `Q-Bonus Threshold ${bonusIndex}`;
                oldValueDisplay = change.oldValue + '%';
                newValueDisplay = change.newValue + '%';
            } else if (change.field.includes('Upto')) {
                fieldName = `Q-Bonus Upper Limit ${bonusIndex}`;
                oldValueDisplay = change.oldValue + '%';
                newValueDisplay = change.newValue + '%';
            } else {
                fieldName = `Q-Bonus Amount ${bonusIndex}`;
                oldValueDisplay = formatCurrency(change.oldValue);
                newValueDisplay = formatCurrency(change.newValue);
            }
        } else if (change.type === 'rollingAverage') {
            fieldName = '3-Month Rolling Average';
            oldValueDisplay = change.oldValue ? 'Enabled' : 'Disabled';
            newValueDisplay = change.newValue ? 'Enabled' : 'Disabled';
        }
        
        return `${fieldName}: ${oldValueDisplay} → ${newValueDisplay}`;
    }).join('<br>');
    
    // Create a summary of changes
    const summaryContainer = document.createElement('div');
    summaryContainer.className = 'model-comparison-summary';
    summaryContainer.innerHTML = `
        <h3>Applied Changes</h3>
        <p>Successfully applied "${recommendation.title}" recommendation.</p>
        <div class="recommendation-details" style="margin-top: 10px; margin-bottom: 10px;">
            ${changes}
        </div>
        <p>You can apply more recommendations or click "Apply All Recommendations" for a complete solution.</p>
    `;
    
    // Check if there's already a summary and replace it
    const existingContainer = document.getElementById('modelComparisonContainer').querySelector('.model-comparison-summary');
    if (existingContainer) {
        existingContainer.replaceWith(summaryContainer);
    } else {
        // Insert before the first child
        document.getElementById('modelComparisonContainer').insertBefore(
            summaryContainer, 
            document.getElementById('modelComparisonContainer').firstChild
        );
    }
}

/**
 * Apply all recommendations
 * IMPROVED VERSION: Shows better comparison of changes
 */
function applyRecommendations() {
    const goalSelect = document.getElementById('recommendationGoal');
    const recommendations = generateRecommendations(
        calculatePhilosophyMetrics(
            simulateElasticity(), 
            generateRiskAssessment()
        ),
        simulateElasticity(),
        goalSelect.value
    );
    
    // Store current elasticity data
    const currentElasticityData = simulateElasticity();
    const currentMetrics = calculatePhilosophyMetrics(
        currentElasticityData, 
        generateRiskAssessment()
    );
    
    // Apply all changes
    recommendations.forEach(recommendation => {
        recommendation.changes.forEach(change => {
            if (change.field === 'useRollingAverage') {
                document.getElementById(change.field).checked = change.newValue;
                if (change.newValue) {
                    document.getElementById('previousMonthsContainer').style.display = 'block';
                } else {
                    document.getElementById('previousMonthsContainer').style.display = 'none';
                }
            } else {
                document.getElementById(change.field).value = change.newValue;
            }
        });
    });
    
    // Recalculate and update UI
    document.getElementById('calculateBtn').click();
    
    // Get new elasticity data
    const newElasticityData = simulateElasticity();
    const newMetrics = calculatePhilosophyMetrics(
        newElasticityData, 
        generateRiskAssessment()
    );
    
    // Update model comparison
    updateModelComparisonChart(currentElasticityData, newElasticityData);
    
    // Show model comparison
    document.getElementById('modelComparisonContainer').style.display = 'block';
    
    // Add metrics summary to comparison
    const summaryContainer = document.createElement('div');
    summaryContainer.className = 'model-comparison-summary';
    summaryContainer.innerHTML = `<h3>Changes Summary</h3>
        <p>The recommended changes have the following impacts:</p>`;
    
    // Create metrics comparison grid
    const metricsGrid = document.createElement('div');
    metricsGrid.className = 'comparison-metrics';
    
    // Add key metrics
    const targetPayout = {
        title: 'Target Payout (100%)',
        oldValue: currentMetrics.sizeOfPrize.targetPayout,
        newValue: newMetrics.sizeOfPrize.targetPayout,
        format: 'currency'
    };
    
    const maxPayout = {
        title: 'Maximum Payout (200%)',
        oldValue: currentMetrics.sizeOfPrize.maxPotential,
        newValue: newMetrics.sizeOfPrize.maxPotential,
        format: 'currency'
    };
    
    const targetJump = {
        title: 'Jump at 100%',
        oldValue: currentMetrics.psychology.nearMiss.targetJumpPercentage,
        newValue: newMetrics.psychology.nearMiss.targetJumpPercentage,
        format: 'percent'
    };
    
    const metrics = [targetPayout, maxPayout, targetJump];
    
    metrics.forEach(metric => {
        const metricDiv = document.createElement('div');
        metricDiv.className = 'comparison-metric';
        
        const change = metric.newValue - metric.oldValue;
        const changePercent = metric.oldValue ? (change / metric.oldValue) * 100 : 0;
        
        let formattedOld, formattedNew, formattedChange;
        if (metric.format === 'currency') {
            formattedOld = formatCurrency(metric.oldValue);
            formattedNew = formatCurrency(metric.newValue);
            formattedChange = (changePercent >= 0 ? '+' : '') + changePercent.toFixed(1) + '%';
        } else {
            formattedOld = metric.oldValue.toFixed(1) + '%';
            formattedNew = metric.newValue.toFixed(1) + '%';
            formattedChange = (change >= 0 ? '+' : '') + change.toFixed(1) + ' pts';
        }
        
        metricDiv.innerHTML = `
            <div class="comparison-metric-title">${metric.title}</div>
            <div class="comparison-metric-value">${formattedNew}</div>
            <div class="comparison-metric-change ${change >= 0 ? 'change-positive' : 'change-negative'}">
                ${formattedChange} (was ${formattedOld})
            </div>
        `;
        
        metricsGrid.appendChild(metricDiv);
    });
    
    summaryContainer.appendChild(metricsGrid);
    
    // Insert summary before the chart
    const comparisonContainer = document.getElementById('modelComparisonContainer');
    comparisonContainer.insertBefore(summaryContainer, comparisonContainer.firstChild);
}

/**
 * Generate recommendations based on philosophy metrics
 * IMPROVED VERSION: More accurate analysis of threshold effects
 */
function generateRecommendations(metrics, elasticityData, goalFocus = 'overall') {
    const recommendations = [];
    
    // Filter recommendations based on goal focus
    const filterByGoal = (rec) => {
        if (goalFocus === 'overall') return true;
        if (goalFocus === 'target' && (rec.type === 'psychology' || rec.title.includes('Target'))) return true;
        if (goalFocus === 'topPerformers' && (rec.type === 'sizeOfPrize' || (rec.type === 'distribution' && rec.title.includes('Above Target')))) return true;
        if (goalFocus === 'balance' && (rec.type === 'distribution' || rec.type === 'structure')) return true;
        return false;
    };
    
    // Size of Prize recommendations
    if (metrics.sizeOfPrize.score <= 4) {
        // If overall package is too small
        if (metrics.sizeOfPrize.targetMultiple < 1.5) {
            recommendations.push({
                title: "Increase upside potential",
                impact: "medium",
                reasoning: `The current model has limited upside with only a ${metrics.sizeOfPrize.targetMultiple.toFixed(1)}x multiple from target to maximum payout. Increasing the commission rates and/or bonuses for high achievement would create stronger incentives for top performance.`,
                type: "sizeOfPrize",
                changes: [
                    {
                        type: "commission",
                        field: "commPercentage3",
                        oldValue: parseFloat(document.getElementById('commPercentage3').value),
                        newValue: Math.min(10, parseFloat(document.getElementById('commPercentage3').value) * 1.33)
                    },
                    {
                        type: "quarterlyBonus",
                        field: "qBonus5",
                        oldValue: parseFloat(document.getElementById('qBonus5').value),
                        newValue: parseFloat(document.getElementById('qBonus5').value) * 1.25
                    }
                ]
            });
        }
    }
    
    // Add recommendation for strengthening above-target rewards if above-target share is low
    if (metrics.distribution.aboveTargetShare < 30) {
        recommendations.push({
            title: "Enhance above-target incentives",
            impact: "medium",
            reasoning: `Only ${metrics.distribution.aboveTargetShare.toFixed(1)}% of potential compensation is available above target, limiting motivation for exceptional performance. Increasing rewards for achievements above 105% would create stronger incentives for top performers.`,
            type: "distribution",
            changes: [
                {
                    type: "quarterlyBonus",
                    field: "qBonus4",
                    oldValue: parseFloat(document.getElementById('qBonus4').value),
                    newValue: parseFloat(document.getElementById('qBonus4').value) * 1.2
                },
                {
                    type: "quarterlyBonus",
                    field: "qBonus5",
                    oldValue: parseFloat(document.getElementById('qBonus5').value),
                    newValue: parseFloat(document.getElementById('qBonus5').value) * 1.3
                }
            ]
        });
    }
    
    // Distribution recommendations
    if (metrics.distribution.belowTargetShare < 20) {
        // If too little below target
        recommendations.push({
            title: "Improve below-target support",
            impact: "medium",
            reasoning: `Only ${metrics.distribution.belowTargetShare.toFixed(1)}% of potential compensation is available below target, creating high stress and potentially punitive environment. Adding a lower tier commission and/or quarterly bonus would provide better support for people having difficult periods.`,
            type: "distribution",
            changes: [
                {
                    type: "quarterlyBonus",
                    field: "qThreshold1",
                    oldValue: parseFloat(document.getElementById('qThreshold1').value),
                    newValue: Math.max(70, parseFloat(document.getElementById('qThreshold1').value) - 15)
                },
                {
                    type: "quarterlyBonus",
                    field: "qBonus1",
                    oldValue: parseFloat(document.getElementById('qBonus1').value),
                    newValue: parseFloat(document.getElementById('qBonus1').value) * 0.7
                }
            ]
        });
    } else if (metrics.distribution.belowTargetShare > 50) {
        // If too much below target
        recommendations.push({
            title: "Strengthen target achievement incentives",
            impact: "high",
            reasoning: `${metrics.distribution.belowTargetShare.toFixed(1)}% of potential compensation is available below target, which may reduce motivation to reach 100%. Shifting some compensation from below-target to at-target would create stronger incentives to reach the full goal.`,
            type: "distribution",
            changes: [
                {
                    type: "quarterlyBonus",
                    field: "qBonus1",
                    oldValue: parseFloat(document.getElementById('qBonus1').value),
                    newValue: parseFloat(document.getElementById('qBonus1').value) * 0.8
                },
                {
                    type: "quarterlyBonus",
                    field: "qBonus2",
                    oldValue: parseFloat(document.getElementById('qBonus2').value),
                    newValue: parseFloat(document.getElementById('qBonus2').value) * 1.3
                }
            ]
        });
    }
    
    // Psychological recommendations
    if (metrics.psychology.nearMiss.score <= 4) {
        // If near-miss psychology is weak - create proper stepped progression
        recommendations.push({
            title: "Enhance target achievement incentive",
            impact: "high",
            reasoning: `The current payout increase at 100% achievement is only ${metrics.psychology.nearMiss.targetJumpPercentage.toFixed(1)}%, creating weak psychological tension. Creating a significant but graduated increase around 100% would create a stronger psychological incentive to reach target.`,
            type: "psychology",
            changes: [
                {
                    type: "quarterlyBonus",
                    field: "qThreshold2",
                    oldValue: parseFloat(document.getElementById('qThreshold2').value),
                    newValue: 100
                },
                {
                    type: "quarterlyBonus",
                    field: "qThresholdUpto2",
                    oldValue: parseFloat(document.getElementById('qThresholdUpto2').value),
                    newValue: 102 // graduated progression
                },
                {
                    type: "quarterlyBonus",
                    field: "qBonus2",
                    oldValue: parseFloat(document.getElementById('qBonus2').value),
                    newValue: parseFloat(document.getElementById('qBonus2').value) * 1.25
                }
            ]
        });
    }
    
    if (metrics.psychology.psychDistance.score <= 4) {
        // If psychological distance is suboptimal
        const avgGap = metrics.psychology.psychDistance.avgGap;
        
        if (avgGap > 20) {
            // If gaps are too large
            recommendations.push({
                title: "Optimize threshold spacing",
                impact: "medium",
                reasoning: `The current average gap between thresholds (${avgGap.toFixed(1)}%) is too wide, potentially making higher levels feel unattainable. Adding intermediate thresholds would create a more motivating ladder of achievement.`,
                type: "psychology",
                changes: [
                    {
                        type: "quarterlyBonus",
                        field: "qThreshold3",
                        oldValue: parseFloat(document.getElementById('qThreshold3').value),
                        newValue: Math.round((parseFloat(document.getElementById('qThreshold2').value) + parseFloat(document.getElementById('qThreshold3').value)) / 2)
                    },
                    {
                        type: "quarterlyBonus",
                        field: "qThresholdUpto3",
                        oldValue: parseFloat(document.getElementById('qThresholdUpto3').value),
                        newValue: parseFloat(document.getElementById('qThreshold4').value) - 1
                    },
                    {
                        type: "quarterlyBonus",
                        field: "qBonus3",
                        oldValue: parseFloat(document.getElementById('qBonus3').value),
                        newValue: Math.round((parseFloat(document.getElementById('qBonus2').value) + parseFloat(document.getElementById('qBonus4').value)) / 2)
                    }
                ]
            });
        } else if (avgGap < 5) {
            // If gaps are too small
            recommendations.push({
                title: "Optimize threshold spacing",
                impact: "low",
                reasoning: `The current average gap between thresholds (${avgGap.toFixed(1)}%) is too narrow, potentially making threshold achievements feel trivial. Spacing thresholds further apart would create more meaningful achievement milestones.`,
                type: "psychology",
                changes: [
                    {
                        type: "quarterlyBonus",
                        field: "qThreshold3",
                        oldValue: parseFloat(document.getElementById('qThreshold3').value),
                        newValue: parseFloat(document.getElementById('qThreshold3').value) + 5
                    },
                    {
                        type: "quarterlyBonus",
                        field: "qThreshold4",
                        oldValue: parseFloat(document.getElementById('qThreshold4').value),
                        newValue: parseFloat(document.getElementById('qThreshold4').value) + 10
                    }
                ]
            });
        }
    }
    
    // If rolling average is not used
    if (!document.getElementById('useRollingAverage').checked) {
        recommendations.push({
            title: "Implement 3-month rolling average",
            impact: "medium",
            reasoning: "Using monthly sales data without averaging can lead to incentive for end-of-month or end-of-quarter sales manipulation. A 3-month rolling average would smooth out performance and reduce undesirable sales tactics.",
            type: "structure",
            changes: [
                {
                    type: "rollingAverage",
                    field: "useRollingAverage",
                    oldValue: false,
                    newValue: true
                }
            ]
        });
    }
    
    // Filter recommendations based on goal focus and return
    return recommendations.filter(filterByGoal);
}

/**
 * Get typicality indicator for a value
 * @param {number} value - The value to check
 * @param {number} lowerBound - Lower bound of typical range
 * @param {number} upperBound - Upper bound of typical range
 * @returns {string} - 'below', 'typical', or 'above'
 */
function getTypicalityIndicator(value, lowerBound, upperBound) {
    if (value < lowerBound) return 'below';
    if (value > upperBound) return 'above';
    return 'typical';
}

/**
 * Return typicality text
 */
function getTypicalityText(typicality) {
    switch(typicality) {
        case 'below': return '(below typical range)';
        case 'above': return '(above typical range)';
        default: return '(within typical range)';
    }
}

/**
 * Get recommendation explanation based on type
 */
function getRecommendationExplanation(type) {
    switch(type) {
        case 'sizeOfPrize':
            return 'This recommendation is designed to improve the overall compensation opportunity, creating stronger motivation for high performance.';
        case 'distribution':
            return 'This recommendation helps balance the compensation available across different performance levels to better match your business objectives.';
        case 'psychology':
            return 'This recommendation enhances the psychological mechanisms that drive motivation and target achievement behaviors.';
        case 'structure':
            return 'This recommendation improves the fundamental structure of the compensation model to better align with compensation best practices.';
        default:
            return 'This recommendation is designed to optimize your compensation model.';
    }
}

// Helper functions for labels and descriptions

function getSizeOfPrizeLabel(score) {
    if (score <= 3) return 'Limited';
    if (score <= 5) return 'Moderate';
    if (score <= 7) return 'Substantial';
    return 'Exceptional';
}

function getDistributionLabel(score) {
    if (score <= 3) return 'Imbalanced';
    if (score <= 5) return 'Somewhat Balanced';
    if (score <= 7) return 'Well Balanced';
    return 'Optimally Balanced';
}

function getPsychologyLabel(score) {
    if (score <= 3) return 'Weak';
    if (score <= 5) return 'Moderate';
    if (score <= 7) return 'Effective';
    return 'Highly Effective';
}

function getNearMissLabel(score) {
    if (score <= 3) return 'Weak';
    if (score <= 5) return 'Moderate';
    if (score <= 7) return 'Strong';
    return 'Very Strong';
}

function getPsychDistanceLabel(score) {
    if (score <= 3) return 'Poor';
    if (score <= 5) return 'Moderate';
    if (score <= 7) return 'Good';
    return 'Optimal';
}

function getSizeOfPrizeDescription(score) {
    if (score <= 3) return 'Limited overall compensation potential that may not strongly motivate exceptional performance';
    if (score <= 5) return 'Moderate compensation package that provides reasonable incentives for achievement';
    if (score <= 7) return 'Substantial compensation package with strong incentives for high performance';
    return 'Exceptional compensation potential that creates powerful incentives for outstanding performance';
}

function getDistributionDescription(score) {
    if (score <= 3) return 'Imbalanced allocation between below-target, at-target, and above-target performance';
    if (score <= 5) return 'Somewhat balanced reward distribution across performance levels';
    if (score <= 7) return 'Well-balanced reward distribution that supports multiple performance scenarios';
    return 'Optimally balanced distribution that creates the perfect tension between support and stretch';
}

function getPsychologyDescription(score) {
    if (score <= 3) return 'Limited use of psychological motivators to drive desired behaviors';
    if (score <= 5) return 'Moderate implementation of behavioral psychology principles';
    if (score <= 7) return 'Effective use of psychological mechanisms to drive target achievement';
    return 'Sophisticated implementation of behavioral psychology principles for maximum motivation';
}