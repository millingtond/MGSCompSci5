// Global variables
let currentSection = 0;
let totalSections = 12;
let userXP = 0;
let userLevel = 1;
let completedTasks = new Set();
let achievements = new Set();
let sortingInterval = null;
let isPaused = false;

// XP requirements for each level
const levelThresholds = [0, 20, 40, 60, 80, 100];
const levelNames = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Expert'];

// Keywords for text analysis
const bubbleSortKeywords = ['compare', 'adjacent', 'swap', 'pass', 'largest', 'end', 'repeat'];
const insertionSortKeywords = ['insert', 'correct', 'position', 'sorted', 'portion', 'shift'];
const mergeSortKeywords = ['divide', 'merge', 'half', 'combine', 'recursive', 'conquer'];

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    initializeLesson();
    preventPaste();
    initializeDragAndDrop();
    initializeAccessibility();
    generateSectionIndicators();
    initializeSortVisualizers();
    initializeSpeedControls();
});

// Initialize speed controls
function initializeSpeedControls() {
    // Add event listeners to update speed labels
    const speedControls = [
        { id: 'bubbleSpeed', labelId: 'bubbleSpeedValue' },
        { id: 'insertionSpeed', labelId: 'insertionSpeedValue' },
        { id: 'mergeSpeed', labelId: 'mergeSpeedValue' }
    ];
    
    speedControls.forEach(control => {
        const slider = document.getElementById(control.id);
        const label = document.getElementById(control.labelId);
        
        if (slider && label) {
            slider.addEventListener('input', function() {
                const value = parseInt(this.value);
                if (value <= 3) label.textContent = 'Slow';
                else if (value <= 7) label.textContent = 'Medium';
                else label.textContent = 'Fast';
            });
        }
    });
}

// Convert speed slider value to delay in milliseconds
function getSpeedDelay(sliderValue) {
    // Map 1-10 to delays: 1=2000ms (slowest) to 10=100ms (fastest)
    const delays = {
        1: 2000, 2: 1600, 3: 1300, 4: 1000, 5: 800,
        6: 600, 7: 400, 8: 300, 9: 200, 10: 100
    };
    return delays[sliderValue] || 800;
}

// Prevent paste functionality
function preventPaste() {
    document.addEventListener('paste', function(e) {
        e.preventDefault();
        showShameMessage();
        document.body.classList.add('shame-mode');
        awardXP('shame', -10); // Deduct XP for trying to cheat
        return false;
    });

    // Also prevent on individual inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            showShameMessage();
            return false;
        });
    });
}

function showShameMessage() {
    const shameMsg = document.getElementById('shameMessage');
    shameMsg.style.display = 'block';
    setTimeout(() => {
        shameMsg.style.display = 'none';
    }, 5000);
}

// Navigation
function navigateSection(direction) {
    const newSection = currentSection + direction;
    if (newSection >= 0 && newSection < totalSections) {
        showSection(newSection);
    }
}

function showSection(index) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(`section-${index}`).classList.add('active');
    currentSection = index;

    // Update navigation buttons
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').disabled = index === totalSections - 1;

    // Update indicators
    updateSectionIndicators();

    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
    
    // Re-highlight code blocks in the new section
    setTimeout(() => {
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    }, 100);
}

function generateSectionIndicators() {
    const container = document.querySelector('.section-indicators');
    for (let i = 0; i < totalSections; i++) {
        const dot = document.createElement('button');
        dot.className = 'section-dot';
        dot.setAttribute('aria-label', `Go to section ${i + 1}`);
        dot.onclick = () => showSection(i);
        container.appendChild(dot);
    }
    updateSectionIndicators();
}

function updateSectionIndicators() {
    const dots = document.querySelectorAll('.section-dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentSection) {
            dot.classList.add('active');
        }
    });
}

// XP and Achievement System
function awardXP(taskId, points) {
    if (completedTasks.has(taskId) && points > 0) {
        return; // Task already completed, no XP
    }
    
    if (points > 0) {
        completedTasks.add(taskId);
    }
    
    userXP = Math.max(0, userXP + points); // Don't go below 0
    updateXPDisplay();
    checkLevelUp();
    
    // Create particle effect only if there's an event
    if (points > 0 && window.event && window.event.target) {
        createParticles(window.event.target);
    }
}

function updateXPDisplay() {
    const xpFill = document.getElementById('xpFill');
    const xpText = document.getElementById('xpText');
    const percentage = (userXP / 100) * 100;
    
    xpFill.style.width = percentage + '%';
    xpText.textContent = `${userXP} / 100 XP`;
}

function checkLevelUp() {
    const newLevel = calculateLevel();
    if (newLevel > userLevel) {
        userLevel = newLevel;
        showAchievement(`Level Up! You're now Level ${userLevel} - ${levelNames[userLevel - 1]}!`, '🎉');
        updateLevelBadge();
    }
}

function calculateLevel() {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
        if (userXP >= levelThresholds[i]) {
            return i + 1;
        }
    }
    return 1;
}

function updateLevelBadge() {
    const badge = document.getElementById('levelBadge');
    badge.textContent = `Level ${userLevel} - ${levelNames[userLevel - 1]}`;
}

function showAchievement(text, emoji = '🏆') {
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `${emoji} ${text}`;
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 4000);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
    }
}

function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#32CD32'];
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.transform = `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 50}px)`;
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

// Section 0: Introduction
function completeIntro() {
    awardXP('intro', 5);
    showSection(1);
}

// Section 1: Starter Activity
function checkStarterApproach() {
    const approach = document.getElementById('starterApproach').value.toLowerCase();
    const feedback = document.getElementById('starterFeedback');
    
    if (approach.length < 20) {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Please describe your approach in more detail.';
        feedback.style.display = 'block';
        return;
    }
    
    // Check for key concepts
    const sortingConcepts = ['compare', 'order', 'move', 'smallest', 'largest', 'position', 'arrange', 'sort'];
    const hasRelevantContent = sortingConcepts.some(concept => approach.includes(concept));
    
    if (hasRelevantContent) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Good thinking! There are different ways to sort - you might compare pairs, insert cards one by one, or even split and merge. Let\'s explore these methods!';
        feedback.style.display = 'block';
        awardXP('starterApproach', 10);
        
        // Show next task
        setTimeout(() => {
            document.getElementById('starterTask2').style.display = 'block';
        }, 1000);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Think about how you would organize the cards from smallest (3) to largest (K=13).';
        feedback.style.display = 'block';
    }
}

// Drag and Drop functionality
function initializeDragAndDrop() {
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);
    document.addEventListener('dragend', handleDragEnd);
}

let draggedElement = null;

function handleDragStart(e) {
    if (!e.target.classList.contains('drag-item')) return;
    
    draggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    e.dataTransfer.dropEffect = 'move';
    
    if (e.target.classList.contains('drop-zone')) {
        e.target.classList.add('drag-over');
    }
    
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (e.target.classList.contains('drop-zone') && draggedElement) {
        e.target.appendChild(draggedElement);
    }
    
    return false;
}

function handleDragEnd(e) {
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(zone => zone.classList.remove('drag-over'));
    
    const dragging = document.querySelectorAll('.dragging');
    dragging.forEach(el => el.classList.remove('dragging'));
}

function checkStarterSort() {
    const dropZone = document.getElementById('starterDropZone');
    const items = dropZone.querySelectorAll('.drag-item');
    const feedback = document.getElementById('starterSortFeedback');
    
    // Check if all items have been moved to the drop zone
    if (items.length !== 5) {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Please drag all numbers into the drop zone first!';
        feedback.style.display = 'block';
        return;
    }
    
    const values = Array.from(items).map(item => parseInt(item.getAttribute('data-value')));
    const sorted = [...values].sort((a, b) => a - b);
    const isCorrect = JSON.stringify(values) === JSON.stringify(sorted);
    
    if (isCorrect) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Perfect! You\'ve sorted the numbers correctly: 3, 17, 42, 65, 89';
        feedback.style.display = 'block';
        awardXP('starterSort', 10);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Not quite right. Remember: ascending order means smallest to largest!';
        feedback.style.display = 'block';
    }
}

function resetStarterSort() {
    const container = document.getElementById('starterNumbers');
    const dropZone = document.getElementById('starterDropZone');
    const items = dropZone.querySelectorAll('.drag-item');
    
    items.forEach(item => container.appendChild(item));
    document.getElementById('starterSortFeedback').style.display = 'none';
}

// Sorting Visualizers
function initializeSortVisualizers() {
    createBars('bubbleBars', [8, 3, 5, 4, 7, 6, 1, 2]);
    createBars('insertionBars', [6, 2, 8, 4, 9, 1, 5, 3]);
    createBars('mergeBars', [7, 3, 9, 1, 5, 8, 2, 6]);
}

function createBars(containerId, array) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    const maxValue = Math.max(...array);
    
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${(value / maxValue) * 180}px`;
        bar.textContent = value;
        bar.setAttribute('data-value', value);
        bar.setAttribute('data-index', index);
        container.appendChild(bar);
    });
}

// Bubble Sort Visualization
async function startBubbleSort() {
    const bars = document.querySelectorAll('#bubbleBars .bar');
    const speedSlider = document.getElementById('bubbleSpeed');
    const n = bars.length;
    isPaused = false;
    
    for (let i = 0; i < n - 1 && !isPaused; i++) {
        for (let j = 0; j < n - i - 1 && !isPaused; j++) {
            // Get current speed each iteration to allow real-time speed changes
            const speed = getSpeedDelay(parseInt(speedSlider.value));
            
            // Highlight comparing elements
            bars[j].classList.add('comparing');
            bars[j + 1].classList.add('comparing');
            
            await sleep(speed);
            
            const value1 = parseInt(bars[j].getAttribute('data-value'));
            const value2 = parseInt(bars[j + 1].getAttribute('data-value'));
            
            if (value1 > value2) {
                // Swap
                await swapBars(bars[j], bars[j + 1]);
            }
            
            bars[j].classList.remove('comparing');
            bars[j + 1].classList.remove('comparing');
        }
        
        // Mark as sorted
        bars[n - i - 1].classList.add('sorted');
    }
    
    if (!isPaused) {
        bars[0].classList.add('sorted');
        awardXP('bubbleSortVisualize', 5);
        showAchievement('Bubble Sort Mastered!', '🫧');
    }
}

function pauseBubbleSort() {
    isPaused = true;
}

function resetBubbleSort() {
    isPaused = true;
    createBars('bubbleBars', [8, 3, 5, 4, 7, 6, 1, 2]);
}

// Insertion Sort Visualization
async function startInsertionSort() {
    const bars = document.querySelectorAll('#insertionBars .bar');
    const speedSlider = document.getElementById('insertionSpeed');
    const n = bars.length;
    isPaused = false;
    
    // First element is already sorted
    bars[0].classList.add('sorted');
    
    for (let i = 1; i < n && !isPaused; i++) {
        const key = parseInt(bars[i].getAttribute('data-value'));
        bars[i].classList.add('pivot');
        
        let j = i - 1;
        
        while (j >= 0 && parseInt(bars[j].getAttribute('data-value')) > key && !isPaused) {
            const speed = getSpeedDelay(parseInt(speedSlider.value));
            bars[j].classList.add('comparing');
            await sleep(speed);
            
            // Shift element
            const temp = bars[j + 1].style.height;
            const tempText = bars[j + 1].textContent;
            const tempValue = bars[j + 1].getAttribute('data-value');
            
            bars[j + 1].style.height = bars[j].style.height;
            bars[j + 1].textContent = bars[j].textContent;
            bars[j + 1].setAttribute('data-value', bars[j].getAttribute('data-value'));
            
            bars[j].style.height = temp;
            bars[j].textContent = tempText;
            bars[j].setAttribute('data-value', tempValue);
            
            bars[j].classList.remove('comparing');
            j--;
        }
        
        bars[i].classList.remove('pivot');
        
        // Mark sorted portion
        for (let k = 0; k <= i; k++) {
            bars[k].classList.add('sorted');
        }
        
        await sleep(getSpeedDelay(parseInt(speedSlider.value)));
    }
    
    if (!isPaused) {
        awardXP('insertionSortVisualize', 5);
        showAchievement('Insertion Sort Mastered!', '🎴');
    }
}

function pauseInsertionSort() {
    isPaused = true;
}

function resetInsertionSort() {
    isPaused = true;
    createBars('insertionBars', [6, 2, 8, 4, 9, 1, 5, 3]);
}

// Merge Sort Visualization
async function startMergeSort() {
    const bars = document.querySelectorAll('#mergeBars .bar');
    const speedSlider = document.getElementById('mergeSpeed');
    const stepDisplay = document.getElementById('mergeStepDisplay');
    isPaused = false;
    
    const array = Array.from(bars).map(bar => parseInt(bar.getAttribute('data-value')));
    
    // Clear step display
    stepDisplay.innerHTML = '<strong>Starting merge sort...</strong><br>';
    
    await mergeSortVisualize(array, 0, array.length - 1, bars, speedSlider, 0);
    
    if (!isPaused) {
        // Mark all as sorted
        bars.forEach(bar => bar.classList.add('sorted'));
        stepDisplay.innerHTML += '<br><strong>✓ Sorting complete!</strong>';
        stepDisplay.scrollTop = stepDisplay.scrollHeight;
        awardXP('mergeSortVisualize', 5);
        showAchievement('Merge Sort Mastered!', '🔀');
    }
}

async function mergeSortVisualize(array, left, right, bars, speedSlider, depth) {
    if (left >= right || isPaused) return;
    
    const mid = Math.floor((left + right) / 2);
    const speed = getSpeedDelay(parseInt(speedSlider.value));
    const stepDisplay = document.getElementById('mergeStepDisplay');
    
    // Show splitting step
    const indent = '  '.repeat(depth);
    const subArray = array.slice(left, right + 1);
    stepDisplay.innerHTML += `${indent}Splitting: [${subArray.join(', ')}]<br>`;
    stepDisplay.scrollTop = stepDisplay.scrollHeight; // Auto-scroll to bottom
    
    // Highlight dividing
    for (let i = left; i <= right; i++) {
        bars[i].classList.add('pivot');
    }
    await sleep(speed);
    
    for (let i = left; i <= right; i++) {
        bars[i].classList.remove('pivot');
    }
    
    // Recursively sort left and right halves
    await mergeSortVisualize(array, left, mid, bars, speedSlider, depth + 1);
    await mergeSortVisualize(array, mid + 1, right, bars, speedSlider, depth + 1);
    
    // Show merging step
    await mergeVisualize(array, left, mid, right, bars, speedSlider, depth);
}

async function mergeVisualize(array, left, mid, right, bars, speedSlider, depth) {
    const leftArray = array.slice(left, mid + 1);
    const rightArray = array.slice(mid + 1, right + 1);
    const stepDisplay = document.getElementById('mergeStepDisplay');
    const indent = '  '.repeat(depth);
    
    stepDisplay.innerHTML += `${indent}Merging: [${leftArray.join(', ')}] + [${rightArray.join(', ')}]<br>`;
    stepDisplay.scrollTop = stepDisplay.scrollHeight;
    
    let i = 0, j = 0, k = left;
    const merged = [];
    
    while (i < leftArray.length && j < rightArray.length && !isPaused) {
        const speed = getSpeedDelay(parseInt(speedSlider.value));
        bars[k].classList.add('comparing');
        await sleep(speed);
        
        if (leftArray[i] <= rightArray[j]) {
            array[k] = leftArray[i];
            merged.push(leftArray[i]);
            bars[k].style.height = `${(leftArray[i] / 9) * 180}px`;
            bars[k].textContent = leftArray[i];
            bars[k].setAttribute('data-value', leftArray[i]);
            i++;
        } else {
            array[k] = rightArray[j];
            merged.push(rightArray[j]);
            bars[k].style.height = `${(rightArray[j] / 9) * 180}px`;
            bars[k].textContent = rightArray[j];
            bars[k].setAttribute('data-value', rightArray[j]);
            j++;
        }
        
        bars[k].classList.remove('comparing');
        k++;
    }
    
    while (i < leftArray.length && !isPaused) {
        array[k] = leftArray[i];
        merged.push(leftArray[i]);
        bars[k].style.height = `${(leftArray[i] / 9) * 180}px`;
        bars[k].textContent = leftArray[i];
        bars[k].setAttribute('data-value', leftArray[i]);
        i++;
        k++;
    }
    
    while (j < rightArray.length && !isPaused) {
        array[k] = rightArray[j];
        merged.push(rightArray[j]);
        bars[k].style.height = `${(rightArray[j] / 9) * 180}px`;
        bars[k].textContent = rightArray[j];
        bars[k].setAttribute('data-value', rightArray[j]);
        j++;
        k++;
    }
    
    stepDisplay.innerHTML += `${indent}Result: [${merged.join(', ')}]<br>`;
    stepDisplay.scrollTop = stepDisplay.scrollHeight;
}

function pauseMergeSort() {
    isPaused = true;
    const stepDisplay = document.getElementById('mergeStepDisplay');
    if (stepDisplay) {
        stepDisplay.innerHTML += '<br><strong>⏸️ Paused</strong>';
        stepDisplay.scrollTop = stepDisplay.scrollHeight;
    }
}

function resetMergeSort() {
    isPaused = true;
    createBars('mergeBars', [7, 3, 9, 1, 5, 8, 2, 6]);
    const stepDisplay = document.getElementById('mergeStepDisplay');
    if (stepDisplay) {
        stepDisplay.innerHTML = 'Click "Start Sort" to see the step-by-step process...';
    }
}

// Utility functions
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function swapBars(bar1, bar2) {
    const temp = bar1.style.height;
    const tempText = bar1.textContent;
    const tempValue = bar1.getAttribute('data-value');
    
    bar1.style.height = bar2.style.height;
    bar1.textContent = bar2.textContent;
    bar1.setAttribute('data-value', bar2.getAttribute('data-value'));
    
    bar2.style.height = temp;
    bar2.textContent = tempText;
    bar2.setAttribute('data-value', tempValue);
}

// Section 2: Bubble Sort
function checkBubbleTrace() {
    const answer = document.getElementById('bubbleTraceAnswer').value.trim();
    const feedback = document.getElementById('bubbleTraceFeedback');
    
    // After first pass: [3, 5, 1, 8]
    const correctAnswers = ['3, 5, 1, 8', '3,5,1,8', '[3, 5, 1, 8]', '[3,5,1,8]'];
    
    if (correctAnswers.includes(answer)) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Correct! After the first pass, 8 has bubbled to the end: [3, 5, 1, 8]';
        feedback.style.display = 'block';
        awardXP('bubbleTrace', 10);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Not quite. Remember: bubble sort moves the largest element to the end in each pass.';
        feedback.style.display = 'block';
    }
}

// Section 3: Insertion Sort
function checkInsertionPractice() {
    const answer = document.getElementById('insertionPractice').value.trim();
    const feedback = document.getElementById('insertionPracticeFeedback');
    
    // After inserting 9: [2, 6, 9]
    const correctAnswers = ['2, 6, 9', '2,6,9', '[2, 6, 9]', '[2,6,9]', '2 6 9'];
    
    if (correctAnswers.includes(answer)) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Correct! After inserting 9, the sorted portion is [2, 6, 9] with 4 still to be inserted.';
        feedback.style.display = 'block';
        awardXP('insertionPractice', 10);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Not quite. Remember: by step 3, we have sorted [6, 2] to [2, 6], then insert 9 at the end.';
        feedback.style.display = 'block';
    }
}

// Section 4: Merge Sort
function checkMergeTree() {
    const feedback = document.getElementById('mergeTreeFeedback');
    
    const left1 = document.getElementById('mergeLeft1').value.trim();
    const right1 = document.getElementById('mergeRight1').value.trim();
    const ll = document.getElementById('mergeLL').value.trim();
    const lr = document.getElementById('mergeLR').value.trim();
    const rl = document.getElementById('mergeRL').value.trim();
    const rr = document.getElementById('mergeRR').value.trim();
    const sortedLeft = document.getElementById('mergeSortedLeft').value.trim();
    const sortedRight = document.getElementById('mergeSortedRight').value.trim();
    const finalAnswer = document.getElementById('mergeFinal').value.trim();
    
    // Check all parts
    const isLeftCorrect = left1.replace(/[\[\]\s]/g, '') === '8,3';
    const isRightCorrect = right1.replace(/[\[\]\s]/g, '') === '5,1';
    const isLLCorrect = ll === '8';
    const isLRCorrect = lr === '3';
    const isRLCorrect = rl === '5';
    const isRRCorrect = rr === '1';
    const isSortedLeftCorrect = sortedLeft.replace(/[\[\]\s]/g, '') === '3,8';
    const isSortedRightCorrect = sortedRight.replace(/[\[\]\s]/g, '') === '1,5';
    const isFinalCorrect = finalAnswer.replace(/[\[\]\s]/g, '') === '1,3,5,8';
    
    const allCorrect = isLeftCorrect && isRightCorrect && isLLCorrect && isLRCorrect && 
                      isRLCorrect && isRRCorrect && isSortedLeftCorrect && 
                      isSortedRightCorrect && isFinalCorrect;
    
    if (allCorrect) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Perfect! You\'ve correctly traced through the entire merge sort algorithm.';
        feedback.style.display = 'block';
        awardXP('mergeTree', 15);
    } else {
        let hints = [];
        if (!isLeftCorrect) hints.push('Left half should be 8,3');
        if (!isRightCorrect) hints.push('Right half should be 5,1');
        if (!isSortedLeftCorrect) hints.push('Sorted left should be 3,8');
        if (!isSortedRightCorrect) hints.push('Sorted right should be 1,5');
        if (!isFinalCorrect) hints.push('Final array should be 1,3,5,8');
        
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = `❌ Not quite complete. ${hints.length > 0 ? '<br>Hints: ' + hints.join('; ') : 'Check individual elements too.'}`;
        feedback.style.display = 'block';
    }
}

// Section 5: Algorithm Comparison
function startAlgorithmRace() {
    // Reset any existing race first
    resetRace();
    
    const size = parseInt(document.getElementById('raceSizeSelect').value);
    const results = document.getElementById('raceResults');
    
    results.innerHTML = '<p>Race in progress...</p>';
    
    // Simulate sorting times
    const bubbleTime = size * size * 10; // O(n²)
    const insertionTime = size * size * 7; // O(n²) but faster
    const mergeTime = size * Math.log2(size) * 20; // O(n log n)
    
    // Animate progress bars
    animateProgress('bubbleProgress', bubbleTime);
    animateProgress('insertionProgress', insertionTime);
    animateProgress('mergeProgress', mergeTime);
    
    // Show results
    setTimeout(() => {
        results.innerHTML = `
            <h4>Race Results for ${size} elements:</h4>
            <p>🥇 Merge Sort: ${mergeTime}ms (O(n log n) = ${size} × ${Math.ceil(Math.log2(size))} operations)</p>
            <p>🥈 Insertion Sort: ${insertionTime}ms (O(n²) = ${size}² operations, but optimized)</p>
            <p>🥉 Bubble Sort: ${bubbleTime}ms (O(n²) = ${size}² operations)</p>
        `;
        awardXP('algorithmRace', 8);
    }, Math.max(bubbleTime, insertionTime, mergeTime) + 500);
}

function animateProgress(barId, duration) {
    const bar = document.getElementById(barId);
    let width = 0;
    const interval = setInterval(() => {
        width += 100 / (duration / 50);
        if (width >= 100) {
            width = 100;
            clearInterval(interval);
        }
        bar.style.width = width + '%';
    }, 50);
}

function resetRace() {
    document.getElementById('bubbleProgress').style.width = '0%';
    document.getElementById('insertionProgress').style.width = '0%';
    document.getElementById('mergeProgress').style.width = '0%';
    document.getElementById('raceResults').innerHTML = '';
}

function checkAlgorithmMatch() {
    const bubbleZone = document.getElementById('bubbleDropZone');
    const insertionZone = document.getElementById('insertionDropZone');
    const mergeZone = document.getElementById('mergeDropZone');
    const feedback = document.getElementById('matchFeedback');
    
    let correct = 0;
    let total = 0;
    
    // Check each zone
    [bubbleZone, insertionZone, mergeZone].forEach(zone => {
        const items = zone.querySelectorAll('.drag-item');
        items.forEach(item => {
            total++;
            if (item.getAttribute('data-algorithm') === zone.getAttribute('data-algorithm')) {
                correct++;
            }
        });
    });
    
    if (correct === 4 && total === 4) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Perfect! You understand when to use each algorithm.';
        feedback.style.display = 'block';
        awardXP('algorithmMatch', 10);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = `❌ ${correct}/4 correct. Think about the characteristics of each algorithm.`;
        feedback.style.display = 'block';
    }
}

function resetAlgorithmMatch() {
    const container = document.querySelector('.drag-container');
    const zones = ['bubbleDropZone', 'insertionDropZone', 'mergeDropZone'];
    
    zones.forEach(zoneId => {
        const zone = document.getElementById(zoneId);
        const items = zone.querySelectorAll('.drag-item');
        items.forEach(item => container.appendChild(item));
    });
    
    document.getElementById('matchFeedback').style.display = 'none';
}

// Section 6: Real-World Context
function checkScenarioAnswers() {
    const answer1 = document.getElementById('scenarioAnswer1').value.toLowerCase();
    const answer2 = document.getElementById('scenarioAnswer2').value.toLowerCase();
    const feedback = document.getElementById('scenarioFeedback');
    
    let points = 0;
    let response = '';
    
    if (answer1.includes('merge') && (answer1.includes('efficient') || answer1.includes('large'))) {
        points += 8;
        response += '✅ Good choice! Merge sort is efficient for large datasets. ';
    } else {
        response += '❌ Consider merge sort for large datasets. ';
    }
    
    if (answer2.includes('insertion') && (answer2.includes('sorted') || answer2.includes('nearly'))) {
        points += 8;
        response += '✅ Excellent! Insertion sort is perfect for nearly sorted data.';
    } else {
        response += '❌ Insertion sort works best on nearly sorted data.';
    }
    
    feedback.className = points > 8 ? 'feedback correct' : 'feedback incorrect';
    feedback.innerHTML = response;
    feedback.style.display = 'block';
    
    if (points > 0) {
        awardXP('scenarioAnalysis', points);
    }
}

function submitUserChallenge() {
    const challenge = document.getElementById('userChallenge').value;
    const algorithm = document.getElementById('userAlgorithmChoice').value;
    const reasoning = document.getElementById('userReasoning').value;
    const feedback = document.getElementById('challengeFeedback');
    
    if (!challenge || !algorithm || !reasoning || challenge.length < 20 || reasoning.length < 20) {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Please complete all fields with detailed answers.';
        feedback.style.display = 'block';
        return;
    }
    
    feedback.className = 'feedback correct';
    feedback.innerHTML = '✅ Great real-world application! You\'re thinking like a computer scientist.';
    feedback.style.display = 'block';
    awardXP('userChallenge', 10);
}

// Section 7: Common Mistakes
function checkMistake1(button, answer) {
    const feedback = document.getElementById('mistake1Feedback');
    const options = button.parentElement.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.classList.remove('selected'));
    button.classList.add('selected');
    
    if (answer === 'B') {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Correct! The inner loop goes to n, but array[j+1] will be out of bounds. Should be j < n-1.';
        feedback.style.display = 'block';
        awardXP('mistake1', 8);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Look at the inner loop carefully. What happens when j = n-1?';
        feedback.style.display = 'block';
    }
}

function checkMistake2() {
    const answer = document.getElementById('mistake2Answer').value.toLowerCase();
    const feedback = document.getElementById('mistake2Feedback');
    
    const keywords = ['small', 'simple', 'easy', 'understand', 'teaching'];
    const hasKeywords = keywords.some(keyword => answer.includes(keyword));
    
    if (answer.length > 30 && hasKeywords) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Correct! Bubble sort is simple and good for teaching or very small datasets.';
        feedback.style.display = 'block';
        awardXP('mistake2', 10);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Think about when simplicity might be more important than efficiency.';
        feedback.style.display = 'block';
    }
}

// Section 8: Exam Questions
function checkExamQ1() {
    const answer = document.getElementById('examQ1').value;
    const marks = parseInt(document.getElementById('examQ1Marks').value);
    const feedback = document.getElementById('examQ1Feedback');
    const markScheme = document.getElementById('examQ1MarkScheme');
    
    if (answer.length < 50) {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Your answer is too short. Write more detail to earn marks.';
        feedback.style.display = 'block';
        return;
    }
    
    if (isNaN(marks)) {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Please predict your marks before viewing the mark scheme.';
        feedback.style.display = 'block';
        return;
    }
    
    // Check for key concepts
    let hits = 0;
    bubbleSortKeywords.forEach(keyword => {
        if (answer.toLowerCase().includes(keyword)) hits++;
    });
    
    const earnedXP = Math.min(hits * 2, 8);
    awardXP('examQ1', earnedXP);
    
    markScheme.style.display = 'block';
    feedback.className = 'feedback correct';
    feedback.innerHTML = `✅ Mark scheme revealed. Self-assess your answer carefully.`;
    feedback.style.display = 'block';
}

function checkExamQ2() {
    const answer = document.getElementById('examQ2').value;
    const marks = parseInt(document.getElementById('examQ2Marks').value);
    const feedback = document.getElementById('examQ2Feedback');
    const markScheme = document.getElementById('examQ2MarkScheme');
    
    if (answer.length < 50) {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Show all steps of the insertion sort process.';
        feedback.style.display = 'block';
        return;
    }
    
    if (isNaN(marks)) {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Please predict your marks before viewing the mark scheme.';
        feedback.style.display = 'block';
        return;
    }
    
    // Check for array states
    const arrayStates = ['5, 2', '2, 5', '2, 5, 8', '1, 2, 5, 8', '1, 2, 5, 8, 9'];
    let hits = 0;
    arrayStates.forEach(state => {
        if (answer.includes(state)) hits++;
    });
    
    const earnedXP = Math.min(hits * 2, 10);
    awardXP('examQ2', earnedXP);
    
    markScheme.style.display = 'block';
    feedback.className = 'feedback correct';
    feedback.innerHTML = `✅ Mark scheme revealed. Self-assess your answer carefully.`;
    feedback.style.display = 'block';
}

function checkExamQ3() {
    const answer = document.getElementById('examQ3').value;
    const marks = parseInt(document.getElementById('examQ3Marks').value);
    const feedback = document.getElementById('examQ3Feedback');
    const markScheme = document.getElementById('examQ3MarkScheme');
    
    if (answer.length < 40) {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Provide more detail about efficiency differences.';
        feedback.style.display = 'block';
        return;
    }
    
    if (isNaN(marks)) {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Please predict your marks before viewing the mark scheme.';
        feedback.style.display = 'block';
        return;
    }
    
    const keywords = ['log', 'n²', 'divide', 'complexity'];
    let hits = 0;
    keywords.forEach(keyword => {
        if (answer.toLowerCase().includes(keyword)) hits++;
    });
    
    const earnedXP = Math.min(hits * 3, 9);
    awardXP('examQ3', earnedXP);
    
    markScheme.style.display = 'block';
    feedback.className = 'feedback correct';
    feedback.innerHTML = `✅ Mark scheme revealed. Self-assess your answer carefully.`;
    feedback.style.display = 'block';
}

// Section 9: Extension Activities
function checkQuickSort() {
    const answer = document.getElementById('quickSortAnswer').value.toLowerCase();
    const feedback = document.getElementById('quickSortFeedback');
    
    const keywords = ['pivot', 'partition', 'recursive', 'average', 'worst'];
    const hits = keywords.filter(k => answer.includes(k)).length;
    
    if (answer.length > 50 && hits >= 2) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Excellent research! Quick sort uses a pivot and partitioning approach.';
        feedback.style.display = 'block';
        awardXP('quickSort', 15);
        
        if (!achievements.has('researcher')) {
            achievements.add('researcher');
            showAchievement('Research Excellence: Beyond the Spec!', '🔬');
        }
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Include more details about how quick sort works.';
        feedback.style.display = 'block';
    }
}

function checkStability() {
    const answer = document.getElementById('stabilityAnswer').value.toLowerCase();
    const feedback = document.getElementById('stabilityFeedback');
    
    const hasCorrect = (answer.includes('insertion') || answer.includes('merge')) && 
                       answer.includes('stable');
    
    if (answer.length > 40 && hasCorrect) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Correct! Insertion and merge sort are stable, bubble sort can be made stable.';
        feedback.style.display = 'block';
        awardXP('stability', 12);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Consider which algorithms maintain the order of equal elements.';
        feedback.style.display = 'block';
    }
}

function checkOptimization() {
    const answer = document.getElementById('optimizationAnswer').value.toLowerCase();
    const feedback = document.getElementById('optimizationFeedback');
    
    const keywords = ['flag', 'swap', 'early', 'stop', 'sorted'];
    const hasKeywords = keywords.some(k => answer.includes(k));
    
    if (answer.length > 40 && hasKeywords) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Great optimization! Using a flag to check if any swaps occurred can stop early.';
        feedback.style.display = 'block';
        awardXP('optimization', 15);
        
        if (!achievements.has('optimizer')) {
            achievements.add('optimizer');
            showAchievement('Optimization Expert!', '⚡');
        }
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Think about how to detect when the list is already sorted.';
        feedback.style.display = 'block';
    }
}

// Drawing Canvas
function showDrawingCanvas(canvasId) {
    const container = document.getElementById(canvasId + 'Container');
    if (!container) {
        console.error('Canvas container not found:', canvasId + 'Container');
        return;
    }
    container.style.display = 'block';
    initCanvas(canvasId);
}

function hideCanvas(canvasId) {
    const container = document.getElementById(canvasId + 'Container');
    if (container) {
        container.style.display = 'none';
    }
}

function initCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        if (e.touches) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        } else {
            return {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };
        }
    }
    
    function startDrawing(e) {
        isDrawing = true;
        const coords = getCoordinates(e);
        lastX = coords.x;
        lastY = coords.y;
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        e.preventDefault();
        const coords = getCoordinates(e);
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(coords.x, coords.y);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        lastX = coords.x;
        lastY = coords.y;
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
}

function clearCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Accessibility
function initializeAccessibility() {
    // Check for saved preferences
    const savedContrast = localStorage.getItem('highContrast');
    const savedFont = localStorage.getItem('dyslexiaFont');
    const savedFontSize = localStorage.getItem('fontSize');
    
    if (savedContrast === 'true') {
        document.getElementById('highContrastToggle').checked = true;
        toggleHighContrast();
    }
    
    if (savedFont === 'true') {
        document.getElementById('dyslexiaFontToggle').checked = true;
        toggleDyslexiaFont();
    }
    
    if (savedFontSize) {
        document.getElementById('fontSizeSlider').value = savedFontSize;
        changeFontSize(savedFontSize);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' && e.ctrlKey) {
            navigateSection(1);
        } else if (e.key === 'ArrowLeft' && e.ctrlKey) {
            navigateSection(-1);
        }
    });
}

function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
}

function toggleDyslexiaFont() {
    document.body.classList.toggle('dyslexia-font');
    localStorage.setItem('dyslexiaFont', document.body.classList.contains('dyslexia-font'));
}

function changeFontSize(size) {
    document.documentElement.style.setProperty('--font-size', size + 'px');
    localStorage.setItem('fontSize', size);
}

// Summary functions
function generateCertificate() {
    const summary = document.getElementById('achievementSummary');
    
    const achievementList = Array.from(achievements).map(a => 
        `<li>🏆 ${a.charAt(0).toUpperCase() + a.slice(1)}</li>`
    ).join('');
    
    summary.innerHTML = `
        <h4>🎉 Congratulations!</h4>
        <p>You've completed the Sorting Algorithms lesson!</p>
        <p><strong>Final Stats:</strong></p>
        <ul>
            <li>📊 Total XP: ${userXP}</li>
            <li>🎯 Level Reached: ${userLevel}</li>
            <li>✅ Tasks Completed: ${completedTasks.size}</li>
        </ul>
        <p><strong>Achievements Unlocked:</strong></p>
        <ul>${achievementList || '<li>Complete more challenges to unlock achievements!</li>'}</ul>
    `;
    
    showAchievement('Course Complete! You\'re a Sorting Algorithm Expert!', '🎓');
    
    if (userLevel >= 5) {
        showAchievement('Perfect Score! You\'ve mastered everything!', '💯');
    }
}

// Initialize lesson
function initializeLesson() {
    console.log('Sorting Algorithms Lesson Initialized');
    updateXPDisplay();
    updateLevelBadge();
}