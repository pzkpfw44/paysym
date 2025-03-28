/**
 * Scenario management functionality
 */

// Maintain arrays of saved structures and performance profiles
let payoutStructures = [];
let performanceProfiles = [];

// Currently selected items for comparison
let selectedStructures = [];
let selectedPerformances = [];

/**
 * Initialize scenarios from localStorage
 */
function initializeScenarios() {
    payoutStructures = JSON.parse(localStorage.getItem('payoutStructures') || '[]');
    performanceProfiles = JSON.parse(localStorage.getItem('performanceProfiles') || '[]');
    
    updateStructureList();
    updatePerformanceList();
    updateSelectors();
}

/**
 * Update the payout structure list in the UI
 */
function updateStructureList() {
    const structureList = document.getElementById('structureList');
    structureList.innerHTML = '';
    
    if (payoutStructures.length === 0) {
        structureList.innerHTML = '<p>No saved payout structures.</p>';
        return;
    }
    
    payoutStructures.forEach((structure, index) => {
        const structureItem = document.createElement('div');
        structureItem.className = 'scenario-item';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'scenario-name';
        nameSpan.textContent = structure.name;
        
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'scenario-buttons';
        
        const loadButton = document.createElement('button');
        loadButton.className = 'scenario-button';
        loadButton.textContent = 'Load';
        loadButton.addEventListener('click', () => loadPayoutStructure(index));
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'scenario-button';
        deleteButton.style.backgroundColor = '#d2004b';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deletePayoutStructure(index));
        
        buttonGroup.appendChild(loadButton);
        buttonGroup.appendChild(deleteButton);
        
        structureItem.appendChild(nameSpan);
        structureItem.appendChild(buttonGroup);
        
        structureList.appendChild(structureItem);
    });
}

/**
 * Update the performance profile list in the UI
 */
function updatePerformanceList() {
    const performanceList = document.getElementById('performanceList');
    performanceList.innerHTML = '';
    
    if (performanceProfiles.length === 0) {
        performanceList.innerHTML = '<p>No saved performance profiles.</p>';
        return;
    }
    
    performanceProfiles.forEach((profile, index) => {
        const profileItem = document.createElement('div');
        profileItem.className = 'scenario-item';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'scenario-name';
        nameSpan.textContent = profile.name;
        
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'scenario-buttons';
        
        const loadButton = document.createElement('button');
        loadButton.className = 'scenario-button';
        loadButton.textContent = 'Load';
        loadButton.addEventListener('click', () => loadPerformanceProfile(index));
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'scenario-button';
        deleteButton.style.backgroundColor = '#d2004b';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deletePerformanceProfile(index));
        
        buttonGroup.appendChild(loadButton);
        buttonGroup.appendChild(deleteButton);
        
        profileItem.appendChild(nameSpan);
        profileItem.appendChild(buttonGroup);
        
        performanceList.appendChild(profileItem);
    });
}

/**
 * Update selectors for scenario comparison
 */
function updateSelectors() {
    // Update structure selector
    const structureSelector = document.getElementById('structureSelector');
    structureSelector.innerHTML = '';
    
    if (payoutStructures.length === 0) {
        structureSelector.innerHTML = '<p class="empty-message">No payout structures saved</p>';
    } else {
        payoutStructures.forEach((structure, index) => {
            const item = document.createElement('div');
            item.className = 'selector-item';
            item.dataset.index = index;
            item.textContent = structure.name;
            
            // Check if this structure is selected
            if (selectedStructures.includes(index)) {
                item.classList.add('selected');
            }
            
            item.addEventListener('click', () => toggleStructureSelection(index, item));
            
            structureSelector.appendChild(item);
        });
    }
    
    // Update performance selector
    const performanceSelector = document.getElementById('performanceSelector');
    performanceSelector.innerHTML = '';
    
    if (performanceProfiles.length === 0) {
        performanceSelector.innerHTML = '<p class="empty-message">No performance profiles saved</p>';
    } else {
        performanceProfiles.forEach((profile, index) => {
            const item = document.createElement('div');
            item.className = 'selector-item';
            item.dataset.index = index;
            item.textContent = profile.name;
            
            // Check if this profile is selected
            if (selectedPerformances.includes(index)) {
                item.classList.add('selected');
            }
            
            item.addEventListener('click', () => togglePerformanceSelection(index, item));
            
            performanceSelector.appendChild(item);
        });
    }
    
    // Update visibility of comparison elements
    if (payoutStructures.length === 0 || performanceProfiles.length === 0) {
        document.getElementById('noScenariosMessage').style.display = 'block';
        document.getElementById('scenarioComparison').style.display = 'none';
    } else {
        document.getElementById('noScenariosMessage').style.display = 'none';
    }
}

/**
 * Toggle selection of a payout structure
 */
function toggleStructureSelection(index, element) {
    const position = selectedStructures.indexOf(index);
    
    if (position === -1) {
        // Only allow up to 3 selections
        if (selectedStructures.length >= 3) {
            alert('You can select a maximum of 3 payout structures');
            return;
        }
        
        // Add to selected
        selectedStructures.push(index);
        element.classList.add('selected');
    } else {
        // Remove from selected
        selectedStructures.splice(position, 1);
        element.classList.remove('selected');
    }
}

/**
 * Toggle selection of a performance profile
 */
function togglePerformanceSelection(index, element) {
    const position = selectedPerformances.indexOf(index);
    
    if (position === -1) {
        // Only allow up to 12 selections
        if (selectedPerformances.length >= 12) {
            alert('You can select a maximum of 12 performance profiles');
            return;
        }
        
        // Add to selected
        selectedPerformances.push(index);
        element.classList.add('selected');
    } else {
        // Remove from selected
        selectedPerformances.splice(position, 1);
        element.classList.remove('selected');
    }
}

/**
 * Save current payout structure settings
 */
function savePayoutStructure() {
    const name = document.getElementById('structureName').value.trim();
    if (!name) {
        alert('Please enter a structure name');
        return;
    }
    
    // Get commission settings
    const useRollingAverage = document.getElementById('useRollingAverage').checked;
    const previousMonths = [
        parseFloat(document.getElementById('previousMonth1').value),
        parseFloat(document.getElementById('previousMonth2').value)
    ];
    
    // Get commission thresholds
    const commissionThresholds = [];
    for (let i = 1; i <= 3; i++) {
        commissionThresholds.push({
            threshold: parseFloat(document.getElementById(`commThreshold${i}`).value),
            upTo: i < 3 ? parseFloat(document.getElementById(`commThresholdUpto${i}`).value) : Infinity,
            percentage: parseFloat(document.getElementById(`commPercentage${i}`).value)
        });
    }
    
    // Get quarterly bonus thresholds
    const quarterlyThresholds = [];
    for (let i = 1; i <= 5; i++) {
        quarterlyThresholds.push({
            threshold: parseFloat(document.getElementById(`qThreshold${i}`).value),
            upTo: i < 5 ? parseFloat(document.getElementById(`qThresholdUpto${i}`).value) : Infinity,
            bonus: parseFloat(document.getElementById(`qBonus${i}`).value)
        });
    }
    
    // Get continuity bonus thresholds
    const continuityThresholds = [];
    for (let i = 1; i <= 4; i++) {
        continuityThresholds.push({
            threshold: parseFloat(document.getElementById(`cThreshold${i}`).value),
            upTo: i < 4 ? parseFloat(document.getElementById(`cThresholdUpto${i}`).value) : Infinity,
            bonus: parseFloat(document.getElementById(`cBonus${i}`).value)
        });
    }
    
    // Get quarterly weights
    const quarterlyWeights = [
        parseFloat(document.getElementById('q1Weight').value),
        parseFloat(document.getElementById('q2Weight').value),
        parseFloat(document.getElementById('q3Weight').value),
        parseFloat(document.getElementById('q4Weight').value)
    ];
    
    const structure = {
        name,
        useRollingAverage,
        previousMonths,
        commissionThresholds,
        quarterlyThresholds,
        continuityThreshold: parseFloat(document.getElementById('continuityThreshold').value),
        continuityThresholds,
        quarterlyWeights
    };
    
    payoutStructures.push(structure);
    localStorage.setItem('payoutStructures', JSON.stringify(payoutStructures));
    
    document.getElementById('structureName').value = '';
    updateStructureList();
    updateSelectors();
    
    // Show comparison tab
    document.querySelector('.tab[data-tab="comparison"]').click();
}

/**
 * Save current performance profile settings
 */
function savePerformanceProfile() {
    const name = document.getElementById('performanceName').value.trim();
    if (!name) {
        alert('Please enter a performance profile name');
        return;
    }
    
    const quarterlyAchievements = [
        parseFloat(document.getElementById('q1Achievement').value),
        parseFloat(document.getElementById('q2Achievement').value),
        parseFloat(document.getElementById('q3Achievement').value),
        parseFloat(document.getElementById('q4Achievement').value)
    ];
    
    const fte = parseFloat(document.getElementById('fte').value);
    
    // Get monthly sales
    const monthlySales = [];
    for (let i = 1; i <= 12; i++) {
        monthlySales.push(parseFloat(document.getElementById(`m${i}Sales`).value));
    }
    
    // Calculate yearly target
    const yearlyTarget = calculateYearlyRevenue();
    
    const profile = {
        name,
        fte,
        quarterlyAchievements,
        monthlySales,
        yearlyTarget
    };
    
    performanceProfiles.push(profile);
    localStorage.setItem('performanceProfiles', JSON.stringify(performanceProfiles));
    
    document.getElementById('performanceName').value = '';
    updatePerformanceList();
    updateSelectors();
    
    // Show comparison tab
    document.querySelector('.tab[data-tab="comparison"]').click();
}

/**
 * Load a saved payout structure
 */
function loadPayoutStructure(index) {
    const structure = payoutStructures[index];
    applyPayoutStructure(structure);
    
    // Trigger calculation
    document.getElementById('calculateBtn').click();
}

/**
 * Load a saved performance profile
 */
function loadPerformanceProfile(index) {
    const profile = performanceProfiles[index];
    applyPerformanceProfile(profile);
    
    // Trigger calculation
    document.getElementById('calculateBtn').click();
}

/**
 * Delete a saved payout structure
 */
function deletePayoutStructure(index) {
    if (confirm(`Are you sure you want to delete "${payoutStructures[index].name}"?`)) {
        // Remove from selected if it was selected
        const selectedIndex = selectedStructures.indexOf(index);
        if (selectedIndex !== -1) {
            selectedStructures.splice(selectedIndex, 1);
        }
        
        // Adjust indices of other selections
        for (let i = 0; i < selectedStructures.length; i++) {
            if (selectedStructures[i] > index) {
                selectedStructures[i]--;
            }
        }
        
        payoutStructures.splice(index, 1);
        localStorage.setItem('payoutStructures', JSON.stringify(payoutStructures));
        updateStructureList();
        updateSelectors();
    }
}

/**
 * Delete a saved performance profile
 */
function deletePerformanceProfile(index) {
    if (confirm(`Are you sure you want to delete "${performanceProfiles[index].name}"?`)) {
        // Remove from selected if it was selected
        const selectedIndex = selectedPerformances.indexOf(index);
        if (selectedIndex !== -1) {
            selectedPerformances.splice(selectedIndex, 1);
        }
        
        // Adjust indices of other selections
        for (let i = 0; i < selectedPerformances.length; i++) {
            if (selectedPerformances[i] > index) {
                selectedPerformances[i]--;
            }
        }
        
        performanceProfiles.splice(index, 1);
        localStorage.setItem('performanceProfiles', JSON.stringify(performanceProfiles));
        updatePerformanceList();
        updateSelectors();
    }
}

/**
 * Run comparison between selected structures and performances
 */
function runScenarioComparison() {
    if (selectedStructures.length === 0 || selectedPerformances.length === 0) {
        alert('Please select at least one payout structure and one performance profile to compare');
        return;
    }
    
    // Get selected structures and performances
    const structures = selectedStructures.map(index => payoutStructures[index]);
    const performances = selectedPerformances.map(index => performanceProfiles[index]);
    
    // Run comparison
    const results = runComparison(structures, performances);
    
    // Show comparison results
    document.getElementById('scenarioComparison').style.display = 'block';
    
    // Update comparison chart
    updateComparisonChart(results);
    
    // Update comparison table
    updateComparisonTable(results);
    
    // Store original form state to restore after comparison
    const originalState = saveCurrentState();
    
    // Restore original state after comparison
    restoreState(originalState);
}

/**
 * Update comparison chart with results
 */
function updateComparisonChart(results) {
    // Create labels combining structure and performance names
    const labels = results.map(r => `${r.structureName} / ${r.performanceName}`);
    
    // Extract commission, quarterly bonus, and continuity bonus data
    const commissionData = results.map(r => r.results.totalCommission);
    const quarterlyBonusData = results.map(r => r.results.totalQuarterlyBonus);
    const continuityBonusData = results.map(r => r.results.totalContinuityBonus);
    
    // Update chart data
    comparisonChart.data.labels = labels;
    comparisonChart.data.datasets[0].data = commissionData;
    comparisonChart.data.datasets[1].data = quarterlyBonusData;
    comparisonChart.data.datasets[2].data = continuityBonusData;
    comparisonChart.update();
}

/**
 * Update comparison table with results
 */
function updateComparisonTable(results) {
    const tbody = document.getElementById('comparisonTableBody');
    tbody.innerHTML = '';
    
    results.forEach(result => {
        const row = document.createElement('tr');
        
        const structureCell = document.createElement('td');
        structureCell.textContent = result.structureName;
        
        const performanceCell = document.createElement('td');
        performanceCell.textContent = result.performanceName;
        
        const achievementCell = document.createElement('td');
        achievementCell.textContent = formatPercent(result.results.avgAchievement);
        
        const totalPayoutCell = document.createElement('td');
        totalPayoutCell.textContent = formatCurrency(result.results.totalPayout);
        
        const commissionCell = document.createElement('td');
        commissionCell.textContent = formatCurrency(result.results.totalCommission);
        
        const quarterlyBonusCell = document.createElement('td');
        quarterlyBonusCell.textContent = formatCurrency(result.results.totalQuarterlyBonus);
        
        const continuityBonusCell = document.createElement('td');
        continuityBonusCell.textContent = formatCurrency(result.results.totalContinuityBonus);
        
        row.appendChild(structureCell);
        row.appendChild(performanceCell);
        row.appendChild(achievementCell);
        row.appendChild(totalPayoutCell);
        row.appendChild(commissionCell);
        row.appendChild(quarterlyBonusCell);
        row.appendChild(continuityBonusCell);
        
        tbody.appendChild(row);
    });
}

/**
 * Save current form state (for restoration after comparison)
 */
function saveCurrentState() {
    const state = {
        useRollingAverage: document.getElementById('useRollingAverage').checked,
        previousMonth1: document.getElementById('previousMonth1').value,
        previousMonth2: document.getElementById('previousMonth2').value,
        fte: document.getElementById('fte').value,
        quarterlyAchievements: [],
        monthlySales: [],
        commissionThresholds: [],
        quarterlyThresholds: [],
        continuityThreshold: document.getElementById('continuityThreshold').value,
        continuityThresholds: [],
        quarterlyWeights: []
    };
    
    // Save quarterly achievements
    for (let i = 1; i <= 4; i++) {
        state.quarterlyAchievements.push(document.getElementById(`q${i}Achievement`).value);
        state.quarterlyWeights.push(document.getElementById(`q${i}Weight`).value);
    }
    
    // Save monthly sales
    for (let i = 1; i <= 12; i++) {
        state.monthlySales.push(document.getElementById(`m${i}Sales`).value);
    }
    
    // Save commission thresholds
    for (let i = 1; i <= 3; i++) {
        const threshold = {
            threshold: document.getElementById(`commThreshold${i}`).value
        };
        
        if (i < 3) {
            threshold.upTo = document.getElementById(`commThresholdUpto${i}`).value;
        }
        
        threshold.percentage = document.getElementById(`commPercentage${i}`).value;
        state.commissionThresholds.push(threshold);
    }
    
    // Save quarterly thresholds
    for (let i = 1; i <= 5; i++) {
        const threshold = {
            threshold: document.getElementById(`qThreshold${i}`).value
        };
        
        if (i < 5) {
            threshold.upTo = document.getElementById(`qThresholdUpto${i}`).value;
        }
        
        threshold.bonus = document.getElementById(`qBonus${i}`).value;
        state.quarterlyThresholds.push(threshold);
    }
    
    // Save continuity thresholds
    for (let i = 1; i <= 4; i++) {
        const threshold = {
            threshold: document.getElementById(`cThreshold${i}`).value
        };
        
        if (i < 4) {
            threshold.upTo = document.getElementById(`cThresholdUpto${i}`).value;
        }
        
        threshold.bonus = document.getElementById(`cBonus${i}`).value;
        state.continuityThresholds.push(threshold);
    }
    
    return state;
}

/**
 * Restore form state from saved state
 */
function restoreState(state) {
    document.getElementById('useRollingAverage').checked = state.useRollingAverage;
    document.getElementById('previousMonth1').value = state.previousMonth1;
    document.getElementById('previousMonth2').value = state.previousMonth2;
    document.getElementById('fte').value = state.fte;
    document.getElementById('continuityThreshold').value = state.continuityThreshold;
    
    // Restore quarterly achievements and weights
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`q${i}Achievement`).value = state.quarterlyAchievements[i-1];
        document.getElementById(`q${i}Weight`).value = state.quarterlyWeights[i-1];
    }
    
    // Restore monthly sales
    for (let i = 1; i <= 12; i++) {
        document.getElementById(`m${i}Sales`).value = state.monthlySales[i-1];
    }
    
    // Restore commission thresholds
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`commThreshold${i}`).value = state.commissionThresholds[i-1].threshold;
        if (i < 3) {
            document.getElementById(`commThresholdUpto${i}`).value = state.commissionThresholds[i-1].upTo;
        }
        document.getElementById(`commPercentage${i}`).value = state.commissionThresholds[i-1].percentage;
    }
    
    // Restore quarterly thresholds
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`qThreshold${i}`).value = state.quarterlyThresholds[i-1].threshold;
        if (i < 5) {
            document.getElementById(`qThresholdUpto${i}`).value = state.quarterlyThresholds[i-1].upTo;
        }
        document.getElementById(`qBonus${i}`).value = state.quarterlyThresholds[i-1].bonus;
    }
    
    // Restore continuity thresholds
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`cThreshold${i}`).value = state.continuityThresholds[i-1].threshold;
        if (i < 4) {
            document.getElementById(`cThresholdUpto${i}`).value = state.continuityThresholds[i-1].upTo;
        }
        document.getElementById(`cBonus${i}`).value = state.continuityThresholds[i-1].bonus;
    }
    
    // Update visibility of previous months container
    if (state.useRollingAverage) {
        document.getElementById('previousMonthsContainer').style.display = 'block';
    } else {
        document.getElementById('previousMonthsContainer').style.display = 'none';
    }
    
    // Update yearly target
    updateYearlyTarget();
}