/**
 * Calculation utilities for the Payout Elasticity Simulator
 */

// Number formatting function for European format
function formatCurrency(amount) {
    return '€' + amount.toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatPercent(value) {
    return value.toLocaleString('de-DE', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }) + '%';
}

function formatRatio(value) {
    return value.toLocaleString('de-DE', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }) + ':1';
}

/**
 * Calculate commission based on monthly sales and FTE
 * Now supports 3-month rolling average
 */
function calculateCommission(monthlySales, fte, useRollingAverage, month, previousMonths, allMonthlySales) {
    if (fte <= 0.7) return 0;
    
    let salesValue = monthlySales;
    
    // Apply 3-month rolling average if enabled
    if (useRollingAverage) {
        if (month === 0) {
            // January: Average with previous Nov and Dec
            salesValue = (monthlySales + previousMonths[0] + previousMonths[1]) / 3;
        } else if (month === 1) {
            // February: Average with previous Dec and current Jan
            salesValue = (monthlySales + previousMonths[1] + allMonthlySales[0]) / 3;
        } else {
            // All other months: Average with previous 2 months
            salesValue = (monthlySales + allMonthlySales[month-1] + allMonthlySales[month-2]) / 3;
        }
    }
    
    // Get commission thresholds from inputs
    const thresholds = [];
    for (let i = 1; i <= 3; i++) {
        thresholds.push({
            threshold: parseFloat(document.getElementById(`commThreshold${i}`).value),
            upTo: i < 3 ? parseFloat(document.getElementById(`commThresholdUpto${i}`).value) : Infinity,
            percentage: parseFloat(document.getElementById(`commPercentage${i}`).value) / 100
        });
    }
    
    // Sort thresholds by threshold value
    thresholds.sort((a, b) => a.threshold - b.threshold);
    
    let commission = 0;
    
    // Calculate commission based on thresholds
    for (let i = 0; i < thresholds.length; i++) {
        const tier = thresholds[i];
        
        if (salesValue > tier.threshold) {
            const tierAmount = Math.min(salesValue, tier.upTo) - tier.threshold;
            commission += tierAmount * tier.percentage;
        }
    }
    
    return commission;
}

/**
 * Calculate quarterly bonus based on achievement percentage and FTE
 */
function calculateQuarterlyBonus(achievementPercentage, fte) {
    // Get thresholds from inputs
    const thresholds = [];
    for (let i = 1; i <= 5; i++) {
        thresholds.push({
            threshold: parseFloat(document.getElementById(`qThreshold${i}`).value),
            upTo: i < 5 ? parseFloat(document.getElementById(`qThresholdUpto${i}`).value) : Infinity,
            bonus: parseFloat(document.getElementById(`qBonus${i}`).value)
        });
    }
    
    // Sort thresholds by threshold value
    thresholds.sort((a, b) => a.threshold - b.threshold);
    
    // Find applicable bonus
    let bonus = 0;
    for (const tier of thresholds) {
        if (achievementPercentage >= tier.threshold && achievementPercentage <= tier.upTo) {
            bonus = tier.bonus;
            break;
        }
    }
    
    return bonus * fte;
}

/**
 * Calculate continuity bonus when target is achieved for two consecutive quarters
 */
function calculateContinuityBonus(prevAchievement, currentAchievement, fte) {
    const continuityThreshold = parseFloat(document.getElementById('continuityThreshold').value);
    
    if (prevAchievement < continuityThreshold || currentAchievement < continuityThreshold) return 0;
    
    // Get thresholds from inputs
    const thresholds = [];
    for (let i = 1; i <= 4; i++) {
        thresholds.push({
            threshold: parseFloat(document.getElementById(`cThreshold${i}`).value),
            upTo: i < 4 ? parseFloat(document.getElementById(`cThresholdUpto${i}`).value) : Infinity,
            bonus: parseFloat(document.getElementById(`cBonus${i}`).value)
        });
    }
    
    // Sort thresholds by threshold value
    thresholds.sort((a, b) => a.threshold - b.threshold);
    
    // Find applicable bonus
    let bonus = 0;
    for (const tier of thresholds) {
        if (currentAchievement >= tier.threshold && currentAchievement <= tier.upTo) {
            bonus = tier.bonus;
            break;
        }
    }
    
    return bonus * fte;
}

/**
 * Calculate total payout with all components
 */
function calculateTotalPayout(quarterlies, monthlySales, fte) {
    // Get rolling average option
    const useRollingAverage = document.getElementById('useRollingAverage').checked;
    
    // Get previous months data
    const previousMonths = [
        parseFloat(document.getElementById('previousMonth1').value),
        parseFloat(document.getElementById('previousMonth2').value)
    ];
    
    // Calculate quarterly bonuses
    const quarterlyBonuses = quarterlies.map(q => calculateQuarterlyBonus(q, fte));
    
    // Calculate continuity bonuses
    const continuityBonuses = [0];
    for (let i = 1; i < quarterlies.length; i++) {
        continuityBonuses.push(calculateContinuityBonus(quarterlies[i-1], quarterlies[i], fte));
    }
    
    // Calculate monthly commissions - pass full monthlySales array
    const commissions = monthlySales.map((m, index) => 
        calculateCommission(m, fte, useRollingAverage, index, previousMonths, monthlySales));
    
    // Total quarterly bonuses
    const totalQuarterlyBonus = quarterlyBonuses.reduce((sum, q) => sum + q, 0);
    
    // Total continuity bonuses
    const totalContinuityBonus = continuityBonuses.reduce((sum, c) => sum + c, 0);
    
    // Total commissions
    const totalCommission = commissions.reduce((sum, c) => sum + c, 0);
    
    // Grand total
    const totalPayout = totalQuarterlyBonus + totalContinuityBonus + totalCommission;
    
    // Average yearly achievement
    const avgAchievement = quarterlies.reduce((sum, q) => sum + q, 0) / quarterlies.length;
    
    // Calculate yearly revenue (sum of monthly sales)
    const yearlyRevenue = monthlySales.reduce((sum, m) => sum + m, 0);
    
    return {
        quarterlyBonuses,
        continuityBonuses,
        commissions,
        totalQuarterlyBonus,
        totalContinuityBonus,
        totalCommission,
        totalPayout,
        avgAchievement,
        yearlyRevenue
    };
}

/**
 * Simulate elasticity across achievement levels
 */
function simulateElasticity() {
    const fte = parseFloat(document.getElementById('fte').value);
    const results = [];
    
    // Get base monthly sales
    const baseMonthlySales = [];
    for (let j = 1; j <= 12; j++) {
        const salesInput = document.getElementById(`m${j}Sales`);
        baseMonthlySales.push(parseFloat(salesInput.value));
    }
    
    // Get rolling average option
    const useRollingAverage = document.getElementById('useRollingAverage').checked;
    
    // Get previous months data
    const previousMonths = [
        parseFloat(document.getElementById('previousMonth1').value),
        parseFloat(document.getElementById('previousMonth2').value)
    ];
    
    // Simulate from 0% to 200% in 5% increments
    for (let i = 0; i <= 40; i++) {
        const achievement = i * 5;
        
        // Scale monthly sales by achievement percentage
        const scaledMonthlySales = baseMonthlySales.map(sales => sales * achievement / 100);
        
        // Calculate quarterly bonus for this achievement level
        const quarterlyBonus = calculateQuarterlyBonus(achievement, fte) * 4; // For 4 quarters
        
        // Calculate commission for the scaled sales - pass full scaledMonthlySales array
        const commissionsForElasticity = scaledMonthlySales.map((m, index) => 
            calculateCommission(m, fte, useRollingAverage, index, previousMonths, scaledMonthlySales));
            
        const totalCommission = commissionsForElasticity.reduce((sum, c) => sum + c, 0);
        
        // Total excluding continuity bonus
        const totalExcludingContinuity = quarterlyBonus + totalCommission;
        
        results.push({
            achievement,
            commission: totalCommission,
            quarterlyBonus: quarterlyBonus,
            totalExcludingContinuity
        });
    }
    
    return results;
}

/**
 * Simulate ROI across achievement levels
 */
function simulateROI() {
    const yearlyTarget = parseFloat(document.getElementById('yearlyTarget').value);
    const fte = parseFloat(document.getElementById('fte').value);
    const results = [];
    
    // Get rolling average option
    const useRollingAverage = document.getElementById('useRollingAverage').checked;
    
    // Get previous months data
    const previousMonths = [
        parseFloat(document.getElementById('previousMonth1').value),
        parseFloat(document.getElementById('previousMonth2').value)
    ];
    
    // Simulate from 0% to 200% in 10% increments
    for (let i = 0; i <= 20; i++) {
        const achievement = i * 10;
        
        // Calculate revenue based on achievement
        const revenue = yearlyTarget * (achievement / 100);
        
        // Calculate payout for this achievement level
        const quarterlyBonus = calculateQuarterlyBonus(achievement, fte) * 4; // For 4 quarters
        
        // Get base monthly sales
        const baseMonthlySales = [];
        for (let j = 1; j <= 12; j++) {
            const salesInput = document.getElementById(`m${j}Sales`);
            baseMonthlySales.push(parseFloat(salesInput.value));
        }
        
        // Scale monthly sales by achievement percentage
        const scaledMonthlySales = baseMonthlySales.map(sales => sales * achievement / 100);
        
        // Calculate commission for the scaled sales - pass full scaledMonthlySales array
        const commissionsForElasticity = scaledMonthlySales.map((m, index) => 
            calculateCommission(m, fte, useRollingAverage, index, previousMonths, scaledMonthlySales));
            
        const totalCommission = commissionsForElasticity.reduce((sum, c) => sum + c, 0);
        
        // Total excluding continuity bonus
        const totalPayout = quarterlyBonus + totalCommission;
        
        // Calculate ROI
        const roi = totalPayout > 0 ? revenue / totalPayout : 0;
        
        results.push({
            achievement,
            revenue,
            payout: totalPayout,
            roi
        });
    }
    
    return results;
}

/**
 * Calculate elasticity per achievement range
 */
function calculateElasticityPerRange() {
    const elasticityData = simulateElasticity();
    const rangeResults = {};
    
    // Define ranges
    const ranges = [
        { name: '0to40', start: 0, end: 40 },
        { name: '41to70', start: 41, end: 70 },
        { name: '71to89', start: 71, end: 89 },
        { name: '90to99', start: 90, end: 99 },
        { name: '100to104', start: 100, end: 104 },
        { name: '105to114', start: 105, end: 114 },
        { name: '115to129', start: 115, end: 129 },
        { name: '130plus', start: 130, end: 200 }
    ];
    
    ranges.forEach(range => {
        // Find data points in this range
        const pointsInRange = elasticityData.filter(d => 
            d.achievement >= range.start && d.achievement <= range.end);
        
        if (pointsInRange.length >= 2) {
            const firstPoint = pointsInRange[0];
            const lastPoint = pointsInRange[pointsInRange.length - 1];
            
            const achievementDiff = lastPoint.achievement - firstPoint.achievement;
            const payoutDiff = lastPoint.totalExcludingContinuity - firstPoint.totalExcludingContinuity;
            
            const elasticity = achievementDiff > 0 ? payoutDiff / achievementDiff : 0;
            
            // Calculate revenue impact per percentage point
            const yearlyTarget = parseFloat(document.getElementById('yearlyTarget').value);
            const revenuePerPoint = yearlyTarget / 100;
            
            rangeResults[range.name] = {
                elasticity: elasticity,
                revenuePerPoint: revenuePerPoint,
                roi: revenuePerPoint > 0 ? revenuePerPoint / elasticity : 0
            };
        } else {
            rangeResults[range.name] = {
                elasticity: 0,
                revenuePerPoint: 0,
                roi: 0
            };
        }
    });
    
    return rangeResults;
}

/**
 * Generate elasticity insight text based on data analysis
 */
function generateElasticityInsight(elasticityData) {
    // Find key inflection points
    const thresholds = [40, 70, 90, 100, 105, 115, 130];
    const inflectionPoints = thresholds.map(threshold => {
        return elasticityData.find(d => d.achievement >= threshold);
    }).filter(Boolean);
    
    // Calculate slopes at different regions
    const slopes = [];
    const ranges = [
        { name: '0-40%', start: 0, end: 40 },
        { name: '41-70%', start: 41, end: 70 },
        { name: '71-89%', start: 71, end: 89 },
        { name: '90-99%', start: 90, end: 99 },
        { name: '100-104%', start: 100, end: 104 },
        { name: '105-114%', start: 105, end: 114 },
        { name: '115-129%', start: 115, end: 129 },
        { name: '≥130%', start: 130, end: 200 }
    ];
    
    ranges.forEach(range => {
        // Find data points in this range
        const pointsInRange = elasticityData.filter(d => 
            d.achievement >= range.start && d.achievement <= range.end);
        
        if (pointsInRange.length >= 2) {
            const firstPoint = pointsInRange[0];
            const lastPoint = pointsInRange[pointsInRange.length - 1];
            
            const achievementDiff = lastPoint.achievement - firstPoint.achievement;
            const payoutDiff = lastPoint.totalExcludingContinuity - firstPoint.totalExcludingContinuity;
            
            const slope = achievementDiff > 0 ? payoutDiff / achievementDiff : 0;
            
            slopes.push({
                range: range.name,
                start: range.start,
                end: range.end,
                slope: slope
            });
        }
    });
    
    // Find steepest slope
    let steepestSlope = slopes.reduce((prev, current) => 
        (prev.slope > current.slope) ? prev : current, { slope: 0 });
        
    // Find optimal achievement point (highest payout per percentage point)
    const payoutPerPoint = elasticityData.map(d => ({
        achievement: d.achievement,
        ratio: d.achievement > 0 ? d.totalExcludingContinuity / d.achievement : 0
    }));
    
    const optimalPoint = payoutPerPoint.reduce((prev, current) => 
        (current.ratio > prev.ratio) ? current : prev, { ratio: 0 });
    
    // Generate insight text
    let insightHtml = `
        <h3>Payout Elasticity Analysis</h3>
        <p>The payout model shows <span class="insight-highlight">different elasticity levels</span> at various achievement thresholds:</p>
        <ul>
    `;
    
    // Add insights about each threshold change
    slopes.forEach(slope => {
        insightHtml += `<li>Achievement ${slope.range}: Payout increases by <span class="insight-highlight">~${Math.round(slope.slope)} €</span> per percentage point</li>`;
    });
    
    insightHtml += `</ul>`;
    
    // Add commission method info
    const useRollingAverage = document.getElementById('useRollingAverage').checked;
    if (useRollingAverage) {
        insightHtml += `
            <p><span class="insight-highlight">Commission calculation:</span> Using 3-month rolling average method, which stabilizes monthly commissions and helps prevent sales manipulation.</p>
        `;
    }
    
    // Add recommendation
    insightHtml += `
        <p><span class="insight-highlight">Key observation:</span> The steepest increase in payout occurs in the ${steepestSlope.range} range, where each additional percentage point of achievement yields approximately ${Math.round(steepestSlope.slope)} € in additional payout.</p>
        <p><span class="insight-highlight">Recommendation:</span> For maximum payout efficiency, target achievement should be at least ${Math.max(90, optimalPoint.achievement)}%, as this provides the best return on performance. Achieving continuity bonuses by maintaining performance above ${document.getElementById('continuityThreshold').value}% for consecutive quarters further enhances payout.</p>
    `;
    
    return insightHtml;
}

/**
 * Calculate total yearly revenue from monthly sales
 */
function calculateYearlyRevenue() {
    let total = 0;
    for (let i = 1; i <= 12; i++) {
        const sales = parseFloat(document.getElementById(`m${i}Sales`).value) || 0;
        total += sales;
    }
    return total;
}

/**
 * Generate risk assessment based on different performance scenarios
 */
function generateRiskAssessment() {
    const yearlyTarget = parseFloat(document.getElementById('yearlyTarget').value);
    const fte = parseFloat(document.getElementById('fte').value);
    
    // Calculate payouts at different risk levels
    const lowRiskScenario = calculateTotalPayout([80, 80, 80, 80], Array(12).fill(20000 * 0.8), fte);
    const targetScenario = calculateTotalPayout([100, 100, 100, 100], Array(12).fill(20000), fte);
    const highRiskScenario = calculateTotalPayout([150, 150, 150, 150], Array(12).fill(20000 * 1.5), fte);
    
    // Calculate revenue at different levels
    const lowRiskRevenue = yearlyTarget * 0.8;
    const targetRevenue = yearlyTarget;
    const highRiskRevenue = yearlyTarget * 1.5;
    
    // Calculate profit margins (assuming 30% margin)
    const profitMargin = 0.3;
    const lowRiskProfit = lowRiskRevenue * profitMargin;
    const targetProfit = targetRevenue * profitMargin;
    const highRiskProfit = highRiskRevenue * profitMargin;
    
    // Calculate compensation as percentage of profit
    const lowRiskCompRatio = lowRiskScenario.totalPayout / lowRiskProfit * 100;
    const targetCompRatio = targetScenario.totalPayout / targetProfit * 100;
    const highRiskCompRatio = highRiskScenario.totalPayout / highRiskProfit * 100;
    
    let riskRating;
    let recommendation;
    
    if (highRiskCompRatio > 30) {
        riskRating = "High";
        recommendation = "The current compensation structure presents significant financial risk at high achievement levels. Consider capping bonuses or implementing a declining rate structure for achievements above 130%.";
    } else if (targetCompRatio > 20) {
        riskRating = "Medium";
        recommendation = "The compensation structure is moderately risky at target achievement. Consider optimizing the threshold levels to better align with business margins.";
    } else {
        riskRating = "Low";
        recommendation = "The compensation structure is well balanced with good alignment between performance and payout. The risk to company profitability is minimal even at high achievement levels.";
    }
    
    return {
        lowRiskPayout: lowRiskScenario.totalPayout,
        targetPayout: targetScenario.totalPayout,
        highRiskPayout: highRiskScenario.totalPayout,
        riskRating,
        recommendation,
        payoutPercentages: {
            lowRisk: lowRiskCompRatio,
            target: targetCompRatio,
            highRisk: highRiskCompRatio
        }
    };
}

/**
 * Run a comparison between payout structures and performance profiles
 */
function runComparison(structures, performances) {
    const results = [];
    
    // For each payout structure
    structures.forEach(structure => {
        // Apply the payout structure settings
        applyPayoutStructure(structure);
        
        // For each performance profile
        performances.forEach(performance => {
            // Apply the performance profile settings
            applyPerformanceProfile(performance);
            
            // Calculate the results
            const quarterlies = [
                parseFloat(document.getElementById('q1Achievement').value),
                parseFloat(document.getElementById('q2Achievement').value),
                parseFloat(document.getElementById('q3Achievement').value),
                parseFloat(document.getElementById('q4Achievement').value)
            ];
            
            const monthlySales = [];
            for (let i = 1; i <= 12; i++) {
                monthlySales.push(parseFloat(document.getElementById(`m${i}Sales`).value));
            }
            
            const fte = parseFloat(document.getElementById('fte').value);
            
            // Calculate the results
            const calculationResults = calculateTotalPayout(quarterlies, monthlySales, fte);
            
            // Store the results with structure and performance names
            results.push({
                structureName: structure.name,
                performanceName: performance.name,
                results: calculationResults
            });
        });
    });
    
    return results;
}

/**
 * Apply payout structure settings from a saved structure
 */
function applyPayoutStructure(structure) {
    // Commission settings
    document.getElementById('useRollingAverage').checked = structure.useRollingAverage;
    document.getElementById('previousMonth1').value = structure.previousMonths[0];
    document.getElementById('previousMonth2').value = structure.previousMonths[1];
    
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`commThreshold${i}`).value = structure.commissionThresholds[i-1].threshold;
        if (i < 3) {
            document.getElementById(`commThresholdUpto${i}`).value = structure.commissionThresholds[i-1].upTo;
        }
        document.getElementById(`commPercentage${i}`).value = structure.commissionThresholds[i-1].percentage;
    }
    
    // Quarterly bonus settings
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`qThreshold${i}`).value = structure.quarterlyThresholds[i-1].threshold;
        if (i < 5) {
            document.getElementById(`qThresholdUpto${i}`).value = structure.quarterlyThresholds[i-1].upTo;
        }
        document.getElementById(`qBonus${i}`).value = structure.quarterlyThresholds[i-1].bonus;
    }
    
    // Continuity bonus settings
    document.getElementById('continuityThreshold').value = structure.continuityThreshold;
    
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`cThreshold${i}`).value = structure.continuityThresholds[i-1].threshold;
        if (i < 4) {
            document.getElementById(`cThresholdUpto${i}`).value = structure.continuityThresholds[i-1].upTo;
        }
        document.getElementById(`cBonus${i}`).value = structure.continuityThresholds[i-1].bonus;
    }
    
    // Quarterly weights
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`q${i}Weight`).value = structure.quarterlyWeights[i-1];
    }
    
    // Toggle display of previous months input based on rolling average setting
    if (structure.useRollingAverage) {
        document.getElementById('previousMonthsContainer').style.display = 'block';
    } else {
        document.getElementById('previousMonthsContainer').style.display = 'none';
    }
}

/**
 * Apply performance profile settings from a saved profile
 */
function applyPerformanceProfile(profile) {
    // FTE
    document.getElementById('fte').value = profile.fte;
    
    // Quarterly achievements
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`q${i}Achievement`).value = profile.quarterlyAchievements[i-1];
    }
    
    // Monthly sales
    for (let i = 1; i <= 12; i++) {
        document.getElementById(`m${i}Sales`).value = profile.monthlySales[i-1];
    }
    
    // Update yearly target (hidden)
    document.getElementById('yearlyTarget').value = profile.yearlyTarget;
    document.getElementById('yearlyTargetDisplay').value = profile.yearlyTarget.toLocaleString('de-DE');
}