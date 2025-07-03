// Testing & Maintainability Interactive Lesson JavaScript

// Global variables
let currentSection = 0;
let xp = 0;
let level = 1;
let achievements = [];
let draggedItem = null;
let canvasDrawing = false;
let ctx = null;

// XP thresholds for each level
const levelThresholds = [0, 20, 50, 90, 140, 200];

// Achievements
const achievementList = {
    firstBug: { id: 'firstBug', title: 'Bug Hunter', desc: 'Found your first bug!', icon: '🐛', xp: 10 },
    errorMaster: { id: 'errorMaster', title: 'Error Expert', desc: 'Correctly sorted all error types', icon: '🎯', xp: 15 },
    testingPro: { id: 'testingPro', title: 'Testing Professional', desc: 'Completed the testing simulation', icon: '🧪', xp: 20 },
    dataWizard: { id: 'dataWizard', title: 'Data Wizard', desc: 'Mastered all test data types', icon: '📊', xp: 20 },
    cleanCoder: { id: 'cleanCoder', title: 'Clean Coder', desc: 'Successfully refactored code', icon: '✨', xp: 15 },
    examReady: { id: 'examReady', title: 'Exam Ready', desc: 'Completed all practice questions', icon: '📝', xp: 25 },
    completionist: { id: 'completionist', title: 'Completionist', desc: 'Finished the entire lesson!', icon: '🏆', xp: 30 },
    easterEgg: { id: 'easterEgg', title: 'Secret Finder', desc: 'Found the hidden easter egg!', icon: '🥚', xp: 10 }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeAccessibility();
    initializeNavigation();
    initializeDragAndDrop();
    initializeCanvas();
    preventPasting();
    updateXPDisplay();
});

// Accessibility Controls
function initializeAccessibility() {
    const accessBtn = document.getElementById('accessibility-btn');
    const accessPanel = document.getElementById('accessibility-panel');
    const fontSelect = document.getElementById('font-size-select');
    const contrastToggle = document.getElementById('high-contrast-toggle');
    const dyslexiaToggle = document.getElementById('dyslexia-font-toggle');
    const motionToggle = document.getElementById('reduce-motion-toggle');
    const resetBtn = document.getElementById('reset-accessibility-btn');

    accessBtn.addEventListener('click', () => {
        accessPanel.classList.toggle('show');
    });

    fontSelect.addEventListener('change', (e) => {
        document.body.className = document.body.className.replace(/font-\w+/g, '');
        document.body.classList.add(`font-${e.target.value}`);
    });

    contrastToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('high-contrast', e.target.checked);
    });

    dyslexiaToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('dyslexia-font', e.target.checked);
    });

    motionToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('reduce-motion', e.target.checked);
    });

    resetBtn.addEventListener('click', () => {
        document.body.className = 'font-medium';
        fontSelect.value = 'medium';
        contrastToggle.checked = false;
        dyslexiaToggle.checked = false;
        motionToggle.checked = false;
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && e.ctrlKey) {
            nextSection();
        } else if (e.key === 'ArrowLeft' && e.ctrlKey) {
            previousSection();
        }
    });
}

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        link.addEventListener('click', () => {
            showSection(index);
        });
    });
}

function showSection(index) {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    sections.forEach(section => section.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));
    
    if (sections[index]) {
        sections[index].classList.add('active');
        navLinks[index].classList.add('active');
        currentSection = index;
        
        // Add XP for progressing through sections
        if (index > 0 && !achievements.includes('progress' + index)) {
            addXP(2);
            achievements.push('progress' + index);
        }
    }
}

function nextSection() {
    if (currentSection < document.querySelectorAll('.section').length - 1) {
        showSection(currentSection + 1);
    }
}

function previousSection() {
    if (currentSection > 0) {
        showSection(currentSection - 1);
    }
}

// XP and Achievements System
function addXP(amount) {
    xp += amount;
    updateXPDisplay();
    checkLevelUp();
    createParticles();
}

function updateXPDisplay() {
    document.getElementById('xp-count').textContent = xp;
    const nextThreshold = levelThresholds[level] || levelThresholds[levelThresholds.length - 1];
    const currentThreshold = levelThresholds[level - 1] || 0;
    const progress = ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    document.getElementById('xp-fill').style.width = progress + '%';
    document.getElementById('level').textContent = level;
}

function checkLevelUp() {
    const newLevel = levelThresholds.findIndex(threshold => xp < threshold);
    if (newLevel > level || (newLevel === -1 && level < levelThresholds.length)) {
        level = newLevel === -1 ? levelThresholds.length : newLevel;
        showAchievement({
            title: `Level ${level} Reached!`,
            desc: `You've reached level ${level}!`,
            icon: '⭐'
        });
    }
}

function unlockAchievement(achievementId) {
    const achievement = achievementList[achievementId];
    if (achievement && !achievements.includes(achievementId)) {
        achievements.push(achievementId);
        addXP(achievement.xp);
        showAchievement(achievement);
        
        // Haptic feedback for mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(200);
        }
    }
}

function showAchievement(achievement) {
    const popup = document.getElementById('achievement-popup');
    document.getElementById('achievement-icon').textContent = achievement.icon;
    document.getElementById('achievement-title').textContent = achievement.title;
    document.getElementById('achievement-desc').textContent = achievement.desc;
    
    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000);
}

// Particle Effects
function createParticles() {
    const colors = ['#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9c27b0'];
    const particleCount = 10;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
        particle.style.setProperty('--x', (Math.random() - 0.5) * 100 + 'px');
        particle.style.setProperty('--y', (Math.random() - 0.5) * 100 + 'px');
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = Math.random() * window.innerHeight + 'px';
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

// Prevent Pasting
function preventPasting() {
    document.addEventListener('paste', (e) => {
        e.preventDefault();
        document.body.classList.add('shame-mode');
        document.getElementById('shame-popup').style.display = 'block';
        
        setTimeout(() => {
            document.body.classList.remove('shame-mode');
            document.getElementById('shame-popup').style.display = 'none';
        }, 3000);
        
        return false;
    });
}

// Section 1: Bug Hunt
function checkBugHunt() {
    const bug1Line = document.getElementById('bug1-line').value;
    const bug1Error = document.getElementById('bug1-error').value.toLowerCase();
    const bug2Line = document.getElementById('bug2-line').value;
    const bug2Error = document.getElementById('bug2-error').value.toLowerCase();
    const bug3Line = document.getElementById('bug3-line').value;
    const bug3Error = document.getElementById('bug3-error').value.toLowerCase();
    
    const feedback = document.getElementById('bug-feedback');
    const feedbackText = document.getElementById('bug-feedback-text');
    
    let correct = 0;
    let messages = [];
    
    // Check bug 1 (line 1 - missing colon)
    if (bug1Line === '1' && (bug1Error.includes('colon') || bug1Error.includes(':'))) {
        correct++;
        messages.push('✓ Bug 1: Correct! Missing colon after function definition');
    } else if (bug1Line === '1') {
        messages.push('✗ Bug 1: Right line, but the error is a missing colon (:)');
    }
    
    // Check bug 2 (line 3 - missing colon)
    if (bug2Line === '3' && (bug2Error.includes('colon') || bug2Error.includes(':'))) {
        correct++;
        messages.push('✓ Bug 2: Correct! Missing colon after for loop');
    } else if (bug2Line === '3') {
        messages.push('✗ Bug 2: Right line, but the error is a missing colon (:)');
    }
    
    // Check bug 3 (line 11 - type error)
    if (bug3Line === '11' && (bug3Error.includes('type') || bug3Error.includes('concatenat') || bug3Error.includes('string') || bug3Error.includes('str'))) {
        correct++;
        messages.push('✓ Bug 3: Correct! Cannot concatenate string with number');
    } else if (bug3Line === '11') {
        messages.push('✗ Bug 3: Right line, but the error is trying to concatenate string with number (need str(result))');
    }
    
    feedback.style.display = 'block';
    
    if (correct === 3) {
        feedbackText.innerHTML = `<strong>Perfect!</strong> You found all 3 bugs!<br>${messages.join('<br>')}`;
        addXP(10);
        unlockAchievement('firstBug');
    } else {
        feedbackText.innerHTML = `You found ${correct} out of 3 bugs correctly.<br>${messages.join('<br>')}<br><br>
        <strong>All bugs:</strong><br>
        - Line 1: Missing colon (:) after def calculate_average(numbers)<br>
        - Line 3: Missing colon (:) after for num in numbers<br>
        - Line 11: Type error - can't concatenate string with float (need str(result))`;
        if (correct > 0) addXP(correct * 3);
    }
}

function resetBugHunt() {
    document.getElementById('bug1-line').value = '';
    document.getElementById('bug1-error').value = '';
    document.getElementById('bug2-line').value = '';
    document.getElementById('bug2-error').value = '';
    document.getElementById('bug3-line').value = '';
    document.getElementById('bug3-error').value = '';
    document.getElementById('bug-feedback').style.display = 'none';
}

// Section 4: Drag and Drop for Error Types
function initializeDragAndDrop() {
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    
    dragItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    draggedItem = e.target;
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (draggedItem && e.currentTarget.classList.contains('drop-zone')) {
        e.currentTarget.appendChild(draggedItem);
        draggedItem = null;
    }
}

function checkErrorSort() {
    const syntaxDrop = document.getElementById('syntax-drop');
    const logicDrop = document.getElementById('logic-drop');
    
    const syntaxItems = syntaxDrop.querySelectorAll('.drag-item');
    const logicItems = logicDrop.querySelectorAll('.drag-item');
    
    let correct = 0;
    let total = syntaxItems.length + logicItems.length;
    
    syntaxItems.forEach(item => {
        if (item.dataset.type === 'syntax') {
            item.style.backgroundColor = '#e8f5e9';
            correct++;
        } else {
            item.style.backgroundColor = '#ffebee';
        }
    });
    
    logicItems.forEach(item => {
        if (item.dataset.type === 'logic') {
            item.style.backgroundColor = '#e8f5e9';
            correct++;
        } else {
            item.style.backgroundColor = '#ffebee';
        }
    });
    
    const feedback = document.getElementById('error-sort-feedback');
    const feedbackText = document.getElementById('error-sort-feedback-text');
    
    feedback.style.display = 'block';
    
    if (correct === total) {
        feedbackText.textContent = 'Excellent! You correctly sorted all error types!';
        addXP(15);
        unlockAchievement('errorMaster');
    } else {
        feedbackText.textContent = `You got ${correct} out of ${total} correct. Remember: Syntax errors prevent code from running, logic errors produce wrong results.`;
        if (correct > 0) addXP(correct * 2);
    }
}

function resetErrorSort() {
    const errorBank = document.getElementById('error-bank');
    const dragItems = document.querySelectorAll('.drag-item');
    
    dragItems.forEach(item => {
        item.style.backgroundColor = '';
        errorBank.appendChild(item);
    });
    
    document.getElementById('error-sort-feedback').style.display = 'none';
}

// Section 5: Testing Types Fill in the Blanks
function checkTestingBlanks() {
    const answers = {
        blank1: 'throughout',
        blank2: 'early',
        blank3: 'cheaper',
        blank4: 'end',
        blank5: 'late',
        blank6: 'expensive'
    };
    
    let correct = 0;
    const total = 6;
    
    for (let i = 1; i <= total; i++) {
        const select = document.getElementById(`blank${i}`);
        if (select.value === answers[`blank${i}`]) {
            correct++;
            select.style.backgroundColor = '#e8f5e9';
            select.style.borderColor = '#4caf50';
        } else {
            select.style.backgroundColor = '#ffebee';
            select.style.borderColor = '#f44336';
        }
    }
    
    const feedback = document.getElementById('testing-blanks-feedback');
    feedback.style.display = 'block';
    
    if (correct === total) {
        feedback.innerHTML = '<strong>Perfect!</strong> You understand the key differences between iterative and final testing!';
        addXP(15);
    } else {
        feedback.innerHTML = `You got ${correct} out of ${total} correct. Review the incorrect answers and try again!`;
        if (correct > 0) addXP(correct * 2);
    }
}

// Section 5: Testing Simulation
let simBugs = [];
let simInterval = null;

function runIterativeSim() {
    resetTestingSim();
    const timeline = document.getElementById('dev-timeline');
    const bugMarkers = document.getElementById('bug-markers');
    const progressBar = document.getElementById('progress-bar');
    const simStatus = document.getElementById('sim-status');
    const feedback = document.getElementById('testing-sim-feedback');
    
    // Create bugs at different development stages
    simBugs = [
        { position: 20, found: false, cost: 10 },
        { position: 40, found: false, cost: 20 },
        { position: 60, found: false, cost: 30 },
        { position: 80, found: false, cost: 40 }
    ];
    
    let progress = 0;
    let totalCost = 0;
    simStatus.textContent = 'Running iterative testing...';
    
    simInterval = setInterval(() => {
        progress += 2;
        progressBar.style.width = progress + '%';
        
        // Check for bugs at each stage
        simBugs.forEach(bug => {
            if (progress >= bug.position && !bug.found) {
                bug.found = true;
                const marker = document.createElement('div');
                marker.style.position = 'absolute';
                marker.style.left = bug.position + '%';
                marker.style.width = '20px';
                marker.style.height = '20px';
                marker.style.backgroundColor = '#4caf50';
                marker.style.borderRadius = '50%';
                marker.textContent = '✓';
                marker.style.color = 'white';
                marker.style.textAlign = 'center';
                marker.style.lineHeight = '20px';
                marker.style.transform = 'translateX(-50%)';
                bugMarkers.appendChild(marker);
                totalCost += bug.cost;
                simStatus.textContent = `Bug found at ${bug.position}% - Cost: ${bug.cost}`;
            }
        });
        
        if (progress >= 100) {
            clearInterval(simInterval);
            feedback.textContent = `Iterative Testing Complete! Bugs found early, total cost: ${totalCost}`;
            simStatus.textContent = 'Complete - All bugs found and fixed during development';
            addXP(10);
            unlockAchievement('testingPro');
        }
    }, 50);
}

function runFinalSim() {
    resetTestingSim();
    const timeline = document.getElementById('dev-timeline');
    const bugMarkers = document.getElementById('bug-markers');
    const progressBar = document.getElementById('progress-bar');
    const simStatus = document.getElementById('sim-status');
    const feedback = document.getElementById('testing-sim-feedback');
    
    // Same bugs but found at the end
    simBugs = [
        { position: 20, found: false, cost: 100 },
        { position: 40, found: false, cost: 150 },
        { position: 60, found: false, cost: 200 },
        { position: 80, found: false, cost: 250 }
    ];
    
    let progress = 0;
    let totalCost = 0;
    simStatus.textContent = 'Development in progress (no testing)...';
    
    simInterval = setInterval(() => {
        progress += 2;
        progressBar.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(simInterval);
            simStatus.textContent = 'Development complete - Starting final testing...';
            
            // Find all bugs at once
            setTimeout(() => {
                simBugs.forEach(bug => {
                    const marker = document.createElement('div');
                    marker.style.position = 'absolute';
                    marker.style.left = bug.position + '%';
                    marker.style.width = '20px';
                    marker.style.height = '20px';
                    marker.style.backgroundColor = '#f44336';
                    marker.style.borderRadius = '50%';
                    marker.textContent = '✗';
                    marker.style.color = 'white';
                    marker.style.textAlign = 'center';
                    marker.style.lineHeight = '20px';
                    marker.style.transform = 'translateX(-50%)';
                    bugMarkers.appendChild(marker);
                    totalCost += bug.cost;
                });
                
                feedback.textContent = `Final Testing Complete! Bugs found late, total cost: ${totalCost} (Much more expensive!)`;
                simStatus.textContent = 'All bugs found at the end - Expensive fixes needed!';
                addXP(10);
            }, 1000);
        }
    }, 50);
}

function resetTestingSim() {
    if (simInterval) clearInterval(simInterval);
    document.getElementById('bug-markers').innerHTML = '';
    document.getElementById('testing-sim-feedback').textContent = '';
    document.getElementById('progress-bar').style.width = '0%';
    document.getElementById('sim-status').textContent = 'Ready to simulate...';
}

// Section 6: Test Data Game
let selectedValue = null;

function setTestDataType(type) {
    if (selectedValue) {
        const button = document.querySelector(`.quiz-option[data-value="${selectedValue}"]`);
        if (button) {
            button.dataset.type = type;
            button.style.backgroundColor = getColorForType(type);
            button.classList.add('classified');
            
            // Clear selection
            selectedValue = null;
            document.querySelectorAll('#test-data-game .quiz-option').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Check if all are classified
            const allButtons = document.querySelectorAll('#test-data-game .quiz-option');
            const classifiedButtons = document.querySelectorAll('#test-data-game .quiz-option.classified');
            if (allButtons.length === classifiedButtons.length) {
                alert('All values classified! Click "Check All Answers" to see your results.');
            }
        }
    } else {
        alert('Please select a test value first!');
    }
}

function checkTestDataGame() {
    const buttons = document.querySelectorAll('#test-data-game .quiz-option');
    const correctAnswers = {
        '50': 'normal',
        '0': 'boundary',
        '100': 'boundary',
        '-10': 'invalid',
        '75': 'normal',
        'abc': 'erroneous',
        '101': 'invalid',
        '99': 'normal'
    };
    
    let correct = 0;
    let attempted = 0;
    
    buttons.forEach(button => {
        const value = button.dataset.value;
        const type = button.dataset.type;
        
        if (type !== '') {
            attempted++;
            if (type === correctAnswers[value]) {
                button.classList.add('correct');
                correct++;
            } else {
                button.classList.add('incorrect');
            }
        }
    });
    
    const feedback = document.getElementById('test-data-feedback');
    const feedbackText = document.getElementById('test-data-feedback-text');
    
    feedback.style.display = 'block';
    
    if (attempted < 8) {
        feedbackText.textContent = `Please classify all values before checking. You've classified ${attempted} out of 8.`;
        return;
    }
    
    if (correct === 8) {
        feedbackText.textContent = 'Perfect! You understand all test data types!';
        addXP(20);
        unlockAchievement('dataWizard');
    } else {
        feedbackText.innerHTML = `You got ${correct} out of 8 correct.<br>
        Remember:<br>
        - Normal: typical valid values (50, 75, 99)<br>
        - Boundary: edges of valid range (0, 100)<br>
        - Invalid: wrong value, right type (-10, 101)<br>
        - Erroneous: wrong type ("abc")`;
        if (correct > 0) addXP(correct * 2);
    }
}

function resetTestDataGame() {
    const buttons = document.querySelectorAll('#test-data-game .quiz-option');
    buttons.forEach(button => {
        button.classList.remove('correct', 'incorrect', 'selected', 'classified');
        button.dataset.type = '';
        button.style.backgroundColor = '';
    });
    selectedValue = null;
    document.getElementById('test-data-feedback').style.display = 'none';
}

// Click handler for test data game
document.addEventListener('click', (e) => {
    if (e.target.matches('#test-data-game .quiz-option')) {
        document.querySelectorAll('#test-data-game .quiz-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        e.target.classList.add('selected');
        selectedValue = e.target.dataset.value;
    }
});

function getColorForType(type) {
    const colors = {
        'normal': '#dcfce7',
        'boundary': '#fef3c7',
        'invalid': '#fee2e2',
        'erroneous': '#fecaca'
    };
    return colors[type] || '#f0f0f0';
}

// Section 7: Real World Context Flashcards
function flipCard(card) {
    card.style.transform = card.style.transform === 'rotateY(180deg)' ? 'rotateY(0deg)' : 'rotateY(180deg)';
    
    // Award XP first time each card is flipped
    const cardId = card.querySelector('.flashcard-front h3').textContent;
    if (!card.dataset.flipped) {
        card.dataset.flipped = 'true';
        addXP(2);
        
        // Check if all flashcards have been viewed
        const allCards = document.querySelectorAll('.flashcard');
        const flippedCards = document.querySelectorAll('.flashcard[data-flipped="true"]');
        if (flippedCards.length === allCards.length) {
            addXP(10);
            showAchievement({
                title: 'History Buff',
                desc: 'Learned from all real-world testing failures!',
                icon: '📚'
            });
        }
    }
}

function checkFlashcardAnswer(button, answer) {
    const buttons = button.parentElement.querySelectorAll('.quiz-option');
    buttons.forEach(btn => {
        btn.classList.remove('selected', 'correct', 'incorrect');
    });
    
    button.classList.add('selected');
    const feedback = document.getElementById('flashcard-feedback');
    feedback.style.display = 'block';
    
    if (answer === 'erroneous') {
        button.classList.add('correct');
        feedback.innerHTML = '<strong>Correct!</strong> Erroneous data (wrong units/types) would have caught the metric vs imperial conversion error.';
        addXP(5);
    } else {
        button.classList.add('incorrect');
        feedback.innerHTML = '<strong>Not quite.</strong> The Mars Climate Orbiter was lost due to a unit conversion error - this would be caught by testing with erroneous data (wrong data types/units).';
    }
}

// Section 8: Common Mistakes Flashcards - Uses same flipCard function

// Section 9: Exam Questions - Remove old section 9 functions

// Section 9: Exam Questions
function showMarkScheme(questionId) {
    const markScheme = document.getElementById(`ms-${questionId}`);
    const button = document.getElementById(`ms-btn-${questionId}`);
    
    if (markScheme.classList.contains('show')) {
        markScheme.classList.remove('show');
        button.textContent = 'Show Mark Scheme';
    } else {
        markScheme.classList.add('show');
        button.textContent = 'Hide Mark Scheme';
        
        // Award XP for viewing mark scheme (once per question)
        if (!button.dataset.viewed) {
            button.dataset.viewed = 'true';
            addXP(3);
            
            // Check if all mark schemes have been viewed
            const allButtons = document.querySelectorAll('[id^="ms-btn-"]');
            const viewedButtons = document.querySelectorAll('[id^="ms-btn-"][data-viewed="true"]');
            if (viewedButtons.length === allButtons.length) {
                unlockAchievement('examReady');
            }
        }
    }
}

// Enable mark scheme buttons when answer and marks are entered
document.addEventListener('input', (e) => {
    if (e.target.id.startsWith('exam-q')) {
        const qNum = e.target.id.replace('exam-q', '');
        const answer = document.getElementById(`exam-q${qNum}`).value;
        const marksInput = document.getElementById(`marks-q${qNum}`);
        const button = document.getElementById(`ms-btn-q${qNum}`);
        
        if (marksInput && button) {
            const marks = marksInput.value;
            if (answer.length > 20 && marks !== '') {
                button.disabled = false;
            }
        }
    }
    
    if (e.target.id.startsWith('marks-q')) {
        const qNum = e.target.id.replace('marks-q', '');
        const answerInput = document.getElementById(`exam-q${qNum}`);
        const marks = e.target.value;
        const button = document.getElementById(`ms-btn-q${qNum}`);
        
        if (answerInput && button) {
            const answer = answerInput.value;
            if (answer.length > 20 && marks !== '') {
                button.disabled = false;
            }
        }
    }
});

// Canvas Drawing
function initializeCanvas() {
    const canvas = document.getElementById('drawingCanvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    let drawing = false;
    let lastX = 0;
    let lastY = 0;
    
    function startDrawing(e) {
        drawing = true;
        [lastX, lastY] = getCoordinates(e);
    }
    
    function draw(e) {
        if (!drawing) return;
        
        const [currentX, currentY] = getCoordinates(e);
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        [lastX, lastY] = [currentX, currentY];
    }
    
    function stopDrawing() {
        drawing = false;
    }
    
    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        return [x, y];
    }
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrawing(e);
    });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e);
    });
    canvas.addEventListener('touchend', stopDrawing);
}

function clearCanvas() {
    const canvas = document.getElementById('drawingCanvas');
    if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function toggleCanvas(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    }
}

// Easter Egg
function activateEasterEgg() {
    unlockAchievement('easterEgg');
    alert('🎉 You found the secret! Keep exploring for more surprises!');
}

// Complete Lesson
function completeLesson() {
    unlockAchievement('completionist');
    
    // Update final statistics
    document.getElementById('final-xp').textContent = xp;
    document.getElementById('final-level').textContent = level;
    document.getElementById('achievement-count').textContent = achievements.length;
    
    // Check all outcomes
    const outcomes = document.querySelectorAll('[id^="outcome"]');
    let allChecked = true;
    outcomes.forEach(outcome => {
        if (!outcome.checked) allChecked = false;
    });
    
    if (allChecked) {
        addXP(20);
        alert('Congratulations! You\'ve mastered all learning outcomes!');
    }
    
    showSection(11); // Show summary
}

// Touch gesture support for mobile navigation
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swipe left - next section
        nextSection();
    }
    if (touchEndX > touchStartX + 50) {
        // Swipe right - previous section
        previousSection();
    }
}

// Auto-save progress to localStorage (not available in artifacts, but included for completeness)
function saveProgress() {
    const progress = {
        xp: xp,
        level: level,
        achievements: achievements,
        currentSection: currentSection,
        outcomes: []
    };
    
    // Save checkbox states
    const outcomes = document.querySelectorAll('[id^="outcome"]');
    outcomes.forEach(outcome => {
        progress.outcomes.push(outcome.checked);
    });
    
    // Note: localStorage not available in Claude artifacts
    // localStorage.setItem('testingLessonProgress', JSON.stringify(progress));
}

// Call saveProgress periodically
setInterval(saveProgress, 30000); // Every 30 seconds