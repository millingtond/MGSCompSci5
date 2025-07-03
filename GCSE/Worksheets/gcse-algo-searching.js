// Global variables
let currentSection = 0;
let totalSections = 11;
let userXP = 0;
let userLevel = 1;
let completedTasks = new Set();
let achievements = new Set();
let searchInterval = null;

// XP requirements for each level
const levelThresholds = [0, 20, 40, 60, 80, 100];
const levelNames = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Expert'];

// Keywords for text analysis
const linearSearchKeywords = ['first', 'sequential', 'each', 'every', 'one by one', 'iterate', 'loop', 'unsorted', 'compare', 'next'];
const binarySearchKeywords = ['middle', 'half', 'sorted', 'divide', 'discard', 'efficient', 'logarithmic', 'faster'];

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    initializeLesson();
    preventPaste();
    initializeDragAndDrop();
    initializeAccessibility();
    generateSectionIndicators();
    initializeArrayVisualizers();
    
    // Initialize syntax highlighting if Prism is loaded
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
});

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
function checkStarterQuiz(button, answer) {
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.classList.remove('selected'));
    button.classList.add('selected');
    
    const feedback = document.getElementById('starterFeedback');
    if (answer === 'B') {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Correct! This describes the binary search approach - much more efficient for sorted data!';
        feedback.style.display = 'block';
        awardXP('starterQuiz', 10);
        
        // Show next task
        setTimeout(() => {
            document.getElementById('starterTask2').style.display = 'block';
        }, 1000);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Not quite. Think about which method would eliminate the most options quickly.';
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

function checkStarterDragDrop() {
    const dropZone = document.getElementById('starterDropZone');
    const items = dropZone.querySelectorAll('.drag-item');
    const feedback = document.getElementById('starterDragFeedback');
    
    const correctOrder = ['start', 'check', 'found', 'next'];
    const userOrder = Array.from(items).map(item => item.getAttribute('data-value'));
    
    const isCorrect = JSON.stringify(correctOrder) === JSON.stringify(userOrder);
    
    if (isCorrect) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Perfect! You understand the basic steps of searching through a list.';
        feedback.style.display = 'block';
        awardXP('starterDragDrop', 10);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Not quite right. Think about the logical order: where do you start, and what happens at each step?';
        feedback.style.display = 'block';
    }
}

function resetStarterDragDrop() {
    const container = document.getElementById('starterDragItems');
    const dropZone = document.getElementById('starterDropZone');
    const items = dropZone.querySelectorAll('.drag-item');
    
    items.forEach(item => container.appendChild(item));
    document.getElementById('starterDragFeedback').style.display = 'none';
}

// Section 2: Linear Search
function initializeArrayVisualizers() {
    // Linear search array
    const linearArray = [3, 7, 2, 9, 1, 5, 8, 4, 6, 10];
    displayArray('linearArrayDisplay', linearArray);
    
    // Binary search array (sorted)
    const binaryArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    displayArray('binaryArrayDisplay', binaryArray);
}

function displayArray(elementId, array) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    
    array.forEach((value, index) => {
        const element = document.createElement('div');
        element.className = 'array-element';
        element.textContent = value;
        element.setAttribute('data-index', index);
        element.setAttribute('data-value', value);
        container.appendChild(element);
    });
}

function startLinearSearch() {
    const target = parseInt(document.getElementById('linearSearchTarget').value);
    const elements = document.querySelectorAll('#linearArrayDisplay .array-element');
    const status = document.getElementById('linearSearchStatus');
    
    // Reset
    elements.forEach(el => {
        el.classList.remove('highlighted', 'found', 'discarded');
    });
    
    let index = 0;
    let comparisons = 0;
    
    searchInterval = setInterval(() => {
        if (index > 0) {
            elements[index - 1].classList.remove('highlighted');
            if (parseInt(elements[index - 1].getAttribute('data-value')) !== target) {
                elements[index - 1].classList.add('discarded');
            }
        }
        
        if (index < elements.length) {
            elements[index].classList.add('highlighted');
            comparisons++;
            status.textContent = `Checking position ${index}: value = ${elements[index].getAttribute('data-value')} | Comparisons: ${comparisons}`;
            
            if (parseInt(elements[index].getAttribute('data-value')) === target) {
                elements[index].classList.add('found');
                status.textContent = `Found ${target} at position ${index}! Total comparisons: ${comparisons}`;
                clearInterval(searchInterval);
                awardXP('linearSearchVisualize', 5);
            }
            
            index++;
        } else {
            status.textContent = `Value ${target} not found. Total comparisons: ${comparisons}`;
            clearInterval(searchInterval);
        }
    }, 800);
}

function resetLinearSearch() {
    clearInterval(searchInterval);
    const elements = document.querySelectorAll('#linearArrayDisplay .array-element');
    elements.forEach(el => {
        el.classList.remove('highlighted', 'found', 'discarded');
    });
    document.getElementById('linearSearchStatus').textContent = '';
}

function checkLinearTrace() {
    const answer = parseInt(document.getElementById('linearTraceAnswer').value);
    const feedback = document.getElementById('linearTraceFeedback');
    
    if (answer === 6) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Correct! Linear search would check: 3, 7, 2, 9, 1, 5 - making 6 comparisons to find 5.';
        feedback.style.display = 'block';
        awardXP('linearTrace', 10);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Not quite. Count how many elements you need to check before finding 5 in position 6.';
        feedback.style.display = 'block';
    }
}

// Section 3: Binary Search
function startBinarySearch() {
    const target = parseInt(document.getElementById('binarySearchTarget').value);
    const elements = document.querySelectorAll('#binaryArrayDisplay .array-element');
    const status = document.getElementById('binarySearchStatus');
    
    // Reset
    elements.forEach(el => {
        el.classList.remove('highlighted', 'found', 'discarded');
    });
    
    let low = 0;
    let high = elements.length - 1;
    let comparisons = 0;
    let steps = [];
    
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const midValue = parseInt(elements[mid].getAttribute('data-value'));
        comparisons++;
        
        steps.push({low, high, mid, midValue});
        
        if (midValue === target) {
            steps.push({found: true, index: mid});
            break;
        } else if (midValue < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    
    if (low > high) {
        steps.push({found: false});
    }
    
    // Animate the steps
    let stepIndex = 0;
    searchInterval = setInterval(() => {
        if (stepIndex < steps.length) {
            const step = steps[stepIndex];
            
            if (step.found !== undefined) {
                if (step.found) {
                    elements[step.index].classList.add('found');
                    status.textContent = `Found ${target} at position ${step.index}! Total comparisons: ${comparisons}`;
                    awardXP('binarySearchVisualize', 5);
                } else {
                    status.textContent = `Value ${target} not found. Total comparisons: ${comparisons}`;
                }
                clearInterval(searchInterval);
            } else {
                // Clear previous highlights
                elements.forEach(el => el.classList.remove('highlighted'));
                
                // Highlight current range
                for (let i = step.low; i <= step.high; i++) {
                    if (i === step.mid) {
                        elements[i].classList.add('highlighted');
                    }
                }
                
                // Mark discarded elements
                for (let i = 0; i < elements.length; i++) {
                    if (i < step.low || i > step.high) {
                        elements[i].classList.add('discarded');
                    }
                }
                
                status.textContent = `Checking middle position ${step.mid}: value = ${step.midValue} | Range: [${step.low}, ${step.high}] | Comparisons: ${stepIndex + 1}`;
            }
            
            stepIndex++;
        }
    }, 1000);
}

function resetBinarySearch() {
    clearInterval(searchInterval);
    const elements = document.querySelectorAll('#binaryArrayDisplay .array-element');
    elements.forEach(el => {
        el.classList.remove('highlighted', 'found', 'discarded');
    });
    document.getElementById('binarySearchStatus').textContent = '';
}

function updateBinaryDecisionTree() {
    const decision1 = document.getElementById('binaryDecision1').value;
    const nextSection = document.getElementById('binaryDecisionNext');
    
    if (decision1 === 'yes') {
        nextSection.style.display = 'block';
    } else if (decision1 === 'no') {
        nextSection.style.display = 'none';
        const feedback = document.getElementById('binaryDecisionFeedback');
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Binary search cannot be used on unsorted data! You must use linear search instead.';
        feedback.style.display = 'block';
    }
}

function updateBinaryDecision2() {
    const decision2 = document.getElementById('binaryDecision2').value;
    const resultSection = document.getElementById('binaryDecisionResult');
    
    if (decision2) {
        resultSection.style.display = 'block';
    }
}

function checkBinaryDecisionTree() {
    const decision1 = document.getElementById('binaryDecision1').value;
    const decision2 = document.getElementById('binaryDecision2').value;
    const decision3 = document.getElementById('binaryDecision3').value;
    const feedback = document.getElementById('binaryDecisionFeedback');
    
    if (decision1 === 'yes' && decision2 && decision3) {
        let correct = false;
        let message = '';
        
        if (decision2 === 'equal' && decision3 === 'found') {
            correct = true;
            message = '✅ Perfect! When middle equals target, we\'ve found our value!';
        } else if (decision2 === 'less' && decision3 === 'searchUpper') {
            correct = true;
            message = '✅ Correct! When middle < target, we search the upper half (discard lower half).';
        } else if (decision2 === 'greater' && decision3 === 'searchLower') {
            correct = true;
            message = '✅ Correct! When middle > target, we search the lower half (discard upper half).';
        } else {
            message = '❌ Not quite. Think about what happens based on the comparison result.';
        }
        
        feedback.className = correct ? 'feedback correct' : 'feedback incorrect';
        feedback.innerHTML = message;
        feedback.style.display = 'block';
        
        if (correct) {
            awardXP('binaryDecisionTree', 8);
        }
    }
}

function checkBinaryMaxComparisons() {
    const answer = parseInt(document.getElementById('binaryMaxComparisons').value);
    const feedback = document.getElementById('binaryMaxFeedback');
    
    if (!feedback) {
        console.error('Binary max feedback element not found');
        return;
    }
    
    if (answer === 10) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Excellent! 2^10 = 1024, so we need at most 10 comparisons for 1000 elements.';
        feedback.style.display = 'block';
        awardXP('binaryMaxComparisons', 10);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Not quite. Think about powers of 2.';
        feedback.style.display = 'block';
    }
}

// Section 4: Comparing Algorithms
function checkComparisonDragDrop() {
    const linearZone = document.getElementById('linearDropZone');
    const binaryZone = document.getElementById('binaryDropZone');
    const feedback = document.getElementById('comparisonFeedback');
    
    const linearItems = linearZone.querySelectorAll('.drag-item');
    const binaryItems = binaryZone.querySelectorAll('.drag-item');
    
    let correct = true;
    
    linearItems.forEach(item => {
        if (item.getAttribute('data-algorithm') !== 'linear') {
            correct = false;
        }
    });
    
    binaryItems.forEach(item => {
        if (item.getAttribute('data-algorithm') !== 'binary') {
            correct = false;
        }
    });
    
    if (correct && linearItems.length === 2 && binaryItems.length === 2) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Perfect! You understand when to use each algorithm.';
        feedback.style.display = 'block';
        awardXP('comparisonDragDrop', 10);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Not quite. Remember: Binary search needs sorted data (like dictionaries), linear search works on any data.';
        feedback.style.display = 'block';
    }
}

function resetComparisonDragDrop() {
    const container = document.querySelector('.drag-container');
    const items = document.querySelectorAll('#linearDropZone .drag-item, #binaryDropZone .drag-item');
    
    items.forEach(item => {
        container.appendChild(item);
    });
    
    document.getElementById('comparisonFeedback').style.display = 'none';
}

function calculateEfficiency() {
    const size = parseInt(document.getElementById('arraySizeInput').value);
    const results = document.getElementById('efficiencyResults');
    
    const linearWorst = size;
    const binaryWorst = Math.ceil(Math.log2(size));
    
    // Calculate efficiency gain more accurately
    const efficiencyGain = linearWorst > 0 ? ((linearWorst - binaryWorst) / linearWorst * 100).toFixed(1) : 0;
    
    results.innerHTML = `
        <h4>Results for array size ${size}:</h4>
        <p><strong>Linear Search:</strong></p>
        <ul>
            <li>Best case: 1 comparison (first element)</li>
            <li>Worst case: ${linearWorst} comparisons</li>
            <li>Average case: ${Math.ceil(size / 2)} comparisons</li>
        </ul>
        <p><strong>Binary Search:</strong></p>
        <ul>
            <li>Best case: 1 comparison (middle element)</li>
            <li>Worst case: ${binaryWorst} comparisons</li>
            <li>Efficiency gain: ${efficiencyGain}% fewer comparisons in worst case!</li>
        </ul>
    `;
    
    awardXP('efficiencyCalculator', 5);
    
    // Initialize the graph if it hasn't been already
    updateComparisonGraph();
}

// New function for the comparison graph
function updateComparisonGraph() {
    const slider = document.getElementById('graphSlider');
    const sliderValue = document.getElementById('sliderValue');
    const canvas = document.getElementById('comparisonGraph');
    
    if (!canvas || !slider || !sliderValue) return; // Canvas not yet created
    
    const ctx = canvas.getContext('2d');
    const maxSize = parseInt(slider.value);
    sliderValue.textContent = maxSize;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up graph
    const padding = 40;
    const graphWidth = canvas.width - 2 * padding;
    const graphHeight = canvas.height - 2 * padding;
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Array Size', canvas.width / 2, canvas.height - 10);
    
    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Comparisons', 0, 0);
    ctx.restore();
    
    // Plot data
    const step = Math.max(1, Math.floor(maxSize / 50));
    
    // Linear search line
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let n = 1; n <= maxSize; n += step) {
        const x = padding + (n / maxSize) * graphWidth;
        const y = canvas.height - padding - (n / maxSize) * graphHeight;
        if (n === 1) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Binary search line
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let n = 1; n <= maxSize; n += step) {
        const x = padding + (n / maxSize) * graphWidth;
        const comparisons = Math.log2(n);
        const y = canvas.height - padding - (comparisons / maxSize) * graphHeight;
        if (n === 1) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Legend
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(canvas.width - 150, 20, 20, 10);
    ctx.fillStyle = '#333';
    ctx.fillText('Linear Search', canvas.width - 120, 30);
    
    ctx.fillStyle = '#10B981';
    ctx.fillRect(canvas.width - 150, 40, 20, 10);
    ctx.fillStyle = '#333';
    ctx.fillText('Binary Search', canvas.width - 120, 50);
    
    // Show current values
    const linearComparisons = maxSize;
    const binaryComparisons = Math.ceil(Math.log2(maxSize));
    
    ctx.font = '14px Arial';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'right';
    ctx.fillText(`At n=${maxSize}:`, canvas.width - 20, 80);
    ctx.fillText(`Linear: ${linearComparisons} comparisons`, canvas.width - 20, 100);
    ctx.fillText(`Binary: ${binaryComparisons} comparisons`, canvas.width - 20, 120);
}

// Section 5: Real-World Context
function checkStreamingScenario() {
    const linearAnswer = document.getElementById('streamingLinear').value.toLowerCase();
    const binaryAnswer = document.getElementById('streamingBinary').value.toLowerCase();
    const feedback = document.getElementById('streamingFeedback');
    
    const linearCorrect = linearAnswer.includes('10000000') || linearAnswer.includes('10 million');
    const binaryCorrect = binaryAnswer.includes('24') || (parseInt(binaryAnswer) >= 23 && parseInt(binaryAnswer) <= 24);
    
    if (linearCorrect && binaryCorrect) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Excellent! Linear: 10 million comparisons worst case. Binary: log₂(10,000,000) ≈ 24 comparisons. Huge difference!';
        feedback.style.display = 'block';
        awardXP('streamingScenario', 10);
    } else {
        feedback.className = 'feedback incorrect';
        let hint = '';
        if (!linearCorrect) hint += 'Linear search might need to check every song. ';
        if (!binaryCorrect) hint += 'For binary search, calculate log₂(10,000,000).';
        feedback.innerHTML = `❌ Not quite. ${hint}`;
        feedback.style.display = 'block';
    }
}

function submitUserScenario() {
    const scenario = document.getElementById('userScenario').value;
    const reason = document.getElementById('userScenarioReason').value;
    const feedback = document.getElementById('scenarioFeedback');
    
    if (scenario.length < 20 || reason.length < 20) {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Please provide more detail in your scenario and explanation.';
        feedback.style.display = 'block';
        return;
    }
    
    // Check for relevant keywords
    const hasLinearKeywords = linearSearchKeywords.some(keyword => 
        scenario.toLowerCase().includes(keyword) || reason.toLowerCase().includes(keyword)
    );
    const hasBinaryKeywords = binarySearchKeywords.some(keyword => 
        scenario.toLowerCase().includes(keyword) || reason.toLowerCase().includes(keyword)
    );
    
    if (hasLinearKeywords || hasBinaryKeywords) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Great scenario! You\'re thinking about real applications of search algorithms.';
        feedback.style.display = 'block';
        awardXP('userScenario', 8);
    } else {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Good effort! Consider mentioning whether the data is sorted or unsorted in your explanation.';
        feedback.style.display = 'block';
        awardXP('userScenario', 5);
    }
    
    // Show the real-world applications box now
    document.getElementById('realWorldApplications').style.display = 'block';
}

// Section 6: Common Mistakes
function checkMistake1(button, answer) {
    const feedback = document.getElementById('mistake1Feedback');
    
    if (answer === 'B') {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Correct! Array indices go from 0 to length-1. Using LENGTH(array) would cause an index out of bounds error.';
        feedback.style.display = 'block';
        awardXP('mistake1', 8);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Look carefully at the high variable initialization. What\'s the last valid index in an array?';
        feedback.style.display = 'block';
    }
}

function checkMistake2() {
    const answer = document.getElementById('mistake2Answer').value.toLowerCase();
    const feedback = document.getElementById('mistake2Feedback');
    
    const keywords = ['sorted', 'unsorted', 'small', 'overhead'];
    const hasKeywords = keywords.some(keyword => answer.includes(keyword));
    
    if (answer.length > 30 && hasKeywords) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Excellent! Binary search requires sorted data and has overhead that makes it inefficient for small datasets or when data is unsorted.';
        feedback.style.display = 'block';
        awardXP('mistake2', 10);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Think about: What does binary search require? When might linear search actually be better?';
        feedback.style.display = 'block';
    }
}

// Section 7: Exam Questions
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
    const keyPhrases = ['start', 'beginning', 'first', 'compare', 'next', 'found', 'not found', 'end'];
    let hits = 0;
    keyPhrases.forEach(phrase => {
        if (answer.toLowerCase().includes(phrase)) hits++;
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
    
    if (answer.length < 80) {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Show all steps of the binary search process for full marks.';
        feedback.style.display = 'block';
        return;
    }
    
    if (isNaN(marks)) {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Please predict your marks before viewing the mark scheme.';
        feedback.style.display = 'block';
        return;
    }
    
    // Check for specific values and steps
    const requiredValues = ['19', 'mid', 'low', 'high', '3', '0', '6'];
    let hits = 0;
    requiredValues.forEach(value => {
        if (answer.toLowerCase().includes(value)) hits++;
    });
    
    const earnedXP = Math.min(hits * 2, 12);
    awardXP('examQ2', earnedXP);
    
    markScheme.style.display = 'block';
    feedback.className = 'feedback correct';
    feedback.innerHTML = `✅ Mark scheme revealed. Self-assess your answer carefully.`;
    feedback.style.display = 'block';
}

function checkExamQ3() {
    const advantage = document.getElementById('examQ3Advantage').value;
    const disadvantage = document.getElementById('examQ3Disadvantage').value;
    const marks = parseInt(document.getElementById('examQ3Marks').value);
    const feedback = document.getElementById('examQ3Feedback');
    const markScheme = document.getElementById('examQ3MarkScheme');
    
    if (advantage.length < 10 || disadvantage.length < 10) {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Please provide both an advantage and disadvantage.';
        feedback.style.display = 'block';
        return;
    }
    
    if (isNaN(marks)) {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Please predict your marks before viewing the mark scheme.';
        feedback.style.display = 'block';
        return;
    }
    
    const advKeywords = ['fast', 'efficient', 'fewer', 'log'];
    const disKeywords = ['sorted', 'complex', 'order'];
    
    let points = 0;
    if (advKeywords.some(k => advantage.toLowerCase().includes(k))) points += 5;
    if (disKeywords.some(k => disadvantage.toLowerCase().includes(k))) points += 5;
    
    awardXP('examQ3', points);
    
    markScheme.style.display = 'block';
    feedback.className = 'feedback correct';
    feedback.innerHTML = `✅ Mark scheme revealed. Self-assess your answer carefully.`;
    feedback.style.display = 'block';
}

// Section 8: Extension Activities
function checkPerformanceAnalysis() {
    const answer = parseInt(document.getElementById('performanceAnswer').value);
    const feedback = document.getElementById('performanceFeedback');
    
    // Binary: 1ms * log₂(n), Linear: 0.1ms * n
    // They're equal when: log₂(n) = 0.1n
    // This occurs around n = 10
    
    if (answer >= 8 && answer <= 12) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Excellent analysis! Around 10 elements, the algorithms have similar performance given these timings.';
        feedback.style.display = 'block';
        awardXP('performanceAnalysis', 15);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Think about when 1ms × log₂(n) equals 0.1ms × n. Try graphing both functions.';
        feedback.style.display = 'block';
    }
}

function submitInterpolation() {
    const explanation = document.getElementById('interpolationExplain').value;
    const feedback = document.getElementById('interpolationFeedback');
    
    if (explanation.length < 40) {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Please provide a more detailed explanation of interpolation search.';
        feedback.style.display = 'block';
        return;
    }
    
    const keywords = ['estimate', 'position', 'distribution', 'uniform', 'predict'];
    const hasKeywords = keywords.some(k => explanation.toLowerCase().includes(k));
    
    if (hasKeywords) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Great research! Interpolation search estimates position based on value distribution.';
        feedback.style.display = 'block';
        awardXP('interpolation', 15);
        
        if (!achievements.has('researcher')) {
            achievements.add('researcher');
            showAchievement('Research Excellence: Advanced Algorithms!', '🔬');
        }
    } else {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Good effort! The key is that it predicts where the target might be based on its value.';
        feedback.style.display = 'block';
        awardXP('interpolation', 8);
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
        <p>You've completed the Search Algorithms lesson!</p>
        <p><strong>Final Stats:</strong></p>
        <ul>
            <li>📊 Total XP: ${userXP}</li>
            <li>🎯 Level Reached: ${userLevel}</li>
            <li>✅ Tasks Completed: ${completedTasks.size}</li>
        </ul>
        <p><strong>Achievements Unlocked:</strong></p>
        <ul>${achievementList || '<li>Complete more challenges to unlock achievements!</li>'}</ul>
    `;
    
    showAchievement('Course Complete! You\'re a Search Algorithm Expert!', '🎓');
    
    if (userLevel >= 5) {
        showAchievement('Perfect Score! You\'ve mastered everything!', '💯');
    }
}

// Initialize lesson
function initializeLesson() {
    console.log('Search Algorithms Lesson Initialized');
    updateXPDisplay();
    updateLevelBadge();
    
    // Initialize the comparison graph when on the right section
    setTimeout(() => {
        const canvas = document.getElementById('comparisonGraph');
        if (canvas) {
            updateComparisonGraph();
        }
    }, 100);
}