/**
 * Scenario management functionality
 */

// Maintain arrays of saved structures and performance profiles
let payoutStructures = [];
let performanceProfiles = [];

// Currently selected items for comparison
let selectedStructures = [];
let selectedPerformances = [];

// Make these variables available globally for the philosophy analysis
window.payoutStructures = payoutStructures;
window.performanceProfiles = performanceProfiles;
window.selectedStructures = selectedStructures;
window.selectedPerformances = selectedPerformances;

/**
 * Initialize scenarios from localStorage
 */
function initializeScenarios() {
    payoutStructures = JSON.parse(localStorage.getItem('payoutStructures') || '[]');
    performanceProfiles = JSON.parse(localStorage.getItem('performanceProfiles') || '[]');
    
    // Update global variables
    window.payoutStructures = payoutStructures;
    window.performanceProfiles = performanceProfiles;
    
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
 * Update selectors for scenario comparison - IMPROVED VERSION
 */
function updateSelectors() {
    // Update structure selector
    const structureSelector = document.getElementById('structureSelector');
    structureSelector.innerHTML = '';
    
    if (payoutStructures.length === 0) {
        structureSelector.innerHTML = '<p class="empty-message">No payout structures saved</p>';
    } else {
        // Create a more compact list view container
        const listContainer = document.createElement('div');
        listContainer.className = 'selector-list-container';
        structureSelector.appendChild(listContainer);
        
        // Add header for the list
        const headerRow = document.createElement('div');
        headerRow.className = 'selector-header-row';
        headerRow.innerHTML = `
            <div class="selector-cell cell-select">Select</div>
            <div class="selector-cell cell-name">Structure Name</div>
            <div class="selector-cell cell-details">Details</div>
        `;
        listContainer.appendChild(headerRow);
        
        // Add items in a compact list format
        payoutStructures.forEach((structure, index) => {
            const item = document.createElement('div');
            item.className = 'selector-row' + (selectedStructures.includes(index) ? ' selected' : '');
            item.dataset.index = index;
            
            // Calculate some key metrics for display
            const comTopRate = Math.max(...structure.commissionThresholds.map(t => t.percentage));
            const qBonusMax = Math.max(...structure.quarterlyThresholds.map(t => t.bonus));
            
            item.innerHTML = `
                <div class="selector-cell cell-select">
                    <input type="checkbox" class="structure-checkbox" 
                           ${selectedStructures.includes(index) ? 'checked' : ''}>
                </div>
                <div class="selector-cell cell-name">${structure.name}</div>
                <div class="selector-cell cell-details">
                    <span class="detail-tag">${structure.useRollingAverage ? 'Rolling Avg' : 'Monthly'}</span>
                    <span class="detail-tag">Com: ${comTopRate}%</span>
                    <span class="detail-tag">QB: €${qBonusMax}</span>
                </div>
            `;
            
            // Add event listener to the checkbox
            const checkbox = item.querySelector('.structure-checkbox');
            checkbox.addEventListener('change', function(e) {
                e.stopPropagation(); // Prevent row click from being triggered
                toggleStructureSelection(index, item);
            });
            
            // Add event listener to the row
            item.addEventListener('click', function(e) {
                if (e.target.type !== 'checkbox') {
                    checkbox.checked = !checkbox.checked;
                    toggleStructureSelection(index, item);
                }
            });
            
            listContainer.appendChild(item);
        });
    }
    
    // Update performance selector
    const performanceSelector = document.getElementById('performanceSelector');
    performanceSelector.innerHTML = '';
    
    if (performanceProfiles.length === 0) {
        performanceSelector.innerHTML = '<p class="empty-message">No performance profiles saved</p>';
    } else {
        // Create a compact list view container
        const listContainer = document.createElement('div');
        listContainer.className = 'selector-list-container';
        performanceSelector.appendChild(listContainer);
        
        // Add header for the list
        const headerRow = document.createElement('div');
        headerRow.className = 'selector-header-row';
        headerRow.innerHTML = `
            <div class="selector-cell cell-select">Select</div>
            <div class="selector-cell cell-name">Profile Name</div>
            <div class="selector-cell cell-details">Performance</div>
            <div class="selector-cell cell-fte">FTE</div>
        `;
        listContainer.appendChild(headerRow);
        
        // Add a paging system if there are many profiles
        const itemsPerPage = 6;
        const totalPages = Math.ceil(performanceProfiles.length / itemsPerPage);
        
        // Add pagination controls if needed
        if (totalPages > 1) {
            const paginationContainer = document.createElement('div');
            paginationContainer.className = 'pagination-container';
            paginationContainer.innerHTML = `
                <button class="pagination-btn" id="prevPage" disabled>◀ Prev</button>
                <span class="page-indicator">Page <span id="currentPage">1</span> of ${totalPages}</span>
                <button class="pagination-btn" id="nextPage">Next ▶</button>
            `;
            performanceSelector.appendChild(paginationContainer);
            
            // Add pagination event listeners
            let currentPageNum = 1;
            
            document.getElementById('prevPage').addEventListener('click', function() {
                if (currentPageNum > 1) {
                    currentPageNum--;
                    updatePerformanceListPage(currentPageNum, listContainer, itemsPerPage);
                    document.getElementById('currentPage').textContent = currentPageNum;
                    document.getElementById('nextPage').disabled = false;
                    this.disabled = currentPageNum === 1;
                }
            });
            
            document.getElementById('nextPage').addEventListener('click', function() {
                if (currentPageNum < totalPages) {
                    currentPageNum++;
                    updatePerformanceListPage(currentPageNum, listContainer, itemsPerPage);
                    document.getElementById('currentPage').textContent = currentPageNum;
                    document.getElementById('prevPage').disabled = false;
                    this.disabled = currentPageNum === totalPages;
                }
            });
        }
        
        // Display first page of items
        updatePerformanceListPage(1, listContainer, itemsPerPage);
    }
    
    // Update visibility of comparison elements
    if (payoutStructures.length === 0 || performanceProfiles.length === 0) {
        document.getElementById('noScenariosMessage').style.display = 'block';
        document.getElementById('scenarioComparison').style.display = 'none';
    } else {
        document.getElementById('noScenariosMessage').style.display = 'none';
    }
    
    // Update global variables for selected items
    window.selectedStructures = selectedStructures;
    window.selectedPerformances = selectedPerformances;
}

/**
 * Update performance list for a specific page
 */
function updatePerformanceListPage(pageNum, container, itemsPerPage) {
    // Clear existing item rows (but keep the header)
    const header = container.querySelector('.selector-header-row');
    container.innerHTML = '';
    container.appendChild(header);
    
    // Calculate start and end indices
    const startIdx = (pageNum - 1) * itemsPerPage;
    const endIdx = Math.min(startIdx + itemsPerPage, performanceProfiles.length);
    
    // Add item rows for this page
    for (let i = startIdx; i < endIdx; i++) {
        const profile = performanceProfiles[i];
        
        const item = document.createElement('div');
        item.className = 'selector-row' + (selectedPerformances.includes(i) ? ' selected' : '');
        item.dataset.index = i;
        
        // Calculate average achievement
        const avgAchievement = profile.quarterlyAchievements.reduce((a, b) => a + b, 0) / 4;
        
        item.innerHTML = `
            <div class="selector-cell cell-select">
                <input type="checkbox" class="performance-checkbox" 
                       ${selectedPerformances.includes(i) ? 'checked' : ''}>
            </div>
            <div class="selector-cell cell-name">${profile.name}</div>
            <div class="selector-cell cell-details">
                <span class="detail-tag">Avg: ${avgAchievement.toFixed(0)}%</span>
                <span class="detail-tag">${profile.quarterlyAchievements.join('% | ')}%</span>
            </div>
            <div class="selector-cell cell-fte">${profile.fte}</div>
        `;
        
        // Add event listener to the checkbox
        const checkbox = item.querySelector('.performance-checkbox');
        checkbox.addEventListener('change', function(e) {
            e.stopPropagation(); // Prevent row click from being triggered
            togglePerformanceSelection(i, item);
        });
        
        // Add event listener to the row
        item.addEventListener('click', function(e) {
            if (e.target.type !== 'checkbox') {
                checkbox.checked = !checkbox.checked;
                togglePerformanceSelection(i, item);
            }
        });
        
        container.appendChild(item);
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
            // Make sure the checkbox is unchecked
            const checkbox = element.querySelector('.structure-checkbox');
            if (checkbox) checkbox.checked = false;
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
    
    // Update global variable
    window.selectedStructures = selectedStructures;
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
            // Make sure the checkbox is unchecked
            const checkbox = element.querySelector('.performance-checkbox');
            if (checkbox) checkbox.checked = false;
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
    
    // Update global variable
    window.selectedPerformances = selectedPerformances;
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
    
    // Update global variable
    window.payoutStructures = payoutStructures;
    
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
    
    // Update global variable
    window.performanceProfiles = performanceProfiles;
    
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
        
        // Update global variable
        window.payoutStructures = payoutStructures;
        window.selectedStructures = selectedStructures;
        
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
        
        // Update global variable
        window.performanceProfiles = performanceProfiles;
        window.selectedPerformances = selectedPerformances;
        
        updatePerformanceList();
        updateSelectors();
    }
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

/**
 * Fix the collapsible sections to properly show state
 */
function fixCollapsibleArrows() {
    document.querySelectorAll('.collapsible').forEach(collapsible => {
        const content = document.getElementById(collapsible.id.replace('Toggle', 'Content'));
        
        // If content is not expanded, mark as collapsed
        if (!content.classList.contains('expanded')) {
            collapsible.classList.add('collapsed');
        } else {
            collapsible.classList.remove('collapsed');
        }
        
        // Update handler to toggle classes properly
        collapsible.onclick = function() {
            this.classList.toggle('collapsed');
            const contentElement = document.getElementById(this.id.replace('Toggle', 'Content'));
            contentElement.classList.toggle('expanded');
        };
    });
}

// Call this function after the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize collapsible arrows correctly after a short delay
    setTimeout(fixCollapsibleArrows, 200);
});