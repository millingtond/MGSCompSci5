// Global variables
let currentSection = 0;
let totalSections = 8;
let xp = 0;
let level = 0;
let achievements = [];
let completedTasks = new Set();
let draggedElement = null;
let filePosition = 0;
let virtualHighScore = 0;
let virtualNotepad = '';
let canvases = {};

// XP thresholds for levels
const levelThresholds = [0, 40, 80, 120, 160];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeLesson();
    preventPaste();
    initializeAccessibility();
    initializeDragDrop();
    initializeCanvases();
    
    // Mobile support
    if ('ontouchstart' in window) {
        initializeTouchSupport();
    }
});

// Initialize lesson
function initializeLesson() {
    updateProgressBar();
    updateXPDisplay();
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Keyboard navigation
function handleKeyboardNavigation(e) {
    if (e.key === 'ArrowLeft' && currentSection > 0) {
        navigateToSection(currentSection - 1);
    } else if (e.key === 'ArrowRight' && currentSection < totalSections - 1) {
        navigateToSection(currentSection + 1);
    }
}

// Navigation
function navigateToSection(sectionIndex) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`section${sectionIndex}`).classList.add('active');
    
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach((btn, index) => {
        btn.classList.toggle('active', index === sectionIndex);
    });
    
    currentSection = sectionIndex;
    updateProgressBar();
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Announce for screen readers
    announceSection(sectionIndex);
}

// Screen reader announcement
function announceSection(index) {
    const sectionNames = ['Starter Activity', 'Introduction', 'Opening Files', 
                         'Reading Files', 'Writing Files', 'Real World Applications', 
                         'Exam Questions', 'Extension'];
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.textContent = `Now viewing: ${sectionNames[index]}`;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
}

// XP and Achievement System
function awardXP(amount, taskId) {
    if (completedTasks.has(taskId)) return; // Prevent multiple XP for same task
    
    completedTasks.add(taskId);
    xp += amount;
    updateXPDisplay();
    checkLevelUp();
    
    // Create particle effect
    createParticles();
}

function updateXPDisplay() {
    document.getElementById('xpCount').textContent = xp;
    document.getElementById('levelCount').textContent = level;
}

function checkLevelUp() {
    const newLevel = levelThresholds.findIndex((threshold, index) => 
        xp >= threshold && (index === levelThresholds.length - 1 || xp < levelThresholds[index + 1])
    );
    
    if (newLevel > level) {
        level = newLevel;
        showAchievement('Level Up!', `You reached Level ${level}!`, 'fa-level-up-alt');
    }
}

function showAchievement(title, description, icon = 'fa-trophy') {
    const popup = document.getElementById('achievementPopup');
    document.getElementById('achievementTitle').textContent = title;
    document.getElementById('achievementDesc').textContent = description;
    popup.querySelector('i').className = `fas ${icon}`;
    
    popup.classList.add('show');
    
    // Haptic feedback for mobile
    if ('vibrate' in navigator) {
        navigator.vibrate(200);
    }
    
    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000);
}

// Progress bar
function updateProgressBar() {
    const progress = ((currentSection + 1) / totalSections) * 100;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
    
    // Update ARIA attributes
    document.querySelector('.progress-bar').setAttribute('aria-valuenow', progress);
}

// Prevent paste
function preventPaste() {
    document.addEventListener('paste', function(e) {
        e.preventDefault();
        showShameMessage();
        return false;
    });
    
    // Also prevent for all input fields
    document.querySelectorAll('input, textarea').forEach(element => {
        element.addEventListener('paste', function(e) {
            e.preventDefault();
            showShameMessage();
            return false;
        });
    });
}

function showShameMessage() {
    document.getElementById('shameMessage').style.display = 'block';
    document.body.classList.add('shame-mode');
    
    // Remove after 5 seconds
    setTimeout(() => {
        document.getElementById('shameMessage').style.display = 'none';
        document.body.classList.remove('shame-mode');
    }, 5000);
}

// Section 0: Starter Activity
function checkDataPersistence(answer) {
    const feedback = document.getElementById('persistenceFeedback');
    
    if (answer === 'lost') {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Correct! Variables in RAM are lost when the program ends. That\'s why we need files!';
        awardXP(5, 'persistence');
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '<i class="fas fa-times-circle"></i> Not quite. Variables are stored in RAM (volatile memory) and disappear when the program closes.';
    }
}

// Drag and Drop functionality
function initializeDragDrop() {
    const draggables = document.querySelectorAll('.draggable');
    const dropZones = document.querySelectorAll('.drop-zone');
    
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', handleDragStart);
        draggable.addEventListener('dragend', handleDragEnd);
        
        // Touch support
        draggable.addEventListener('touchstart', handleTouchStart, {passive: false});
        draggable.addEventListener('touchmove', handleTouchMove, {passive: false});
        draggable.addEventListener('touchend', handleTouchEnd);
    });
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    draggedElement = e.target;
    e.target.style.opacity = '0.5';
}

function handleDragEnd(e) {
    e.target.style.opacity = '';
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
    
    if (draggedElement) {
        const droppedItem = e.currentTarget.querySelector('.dropped-item');
        droppedItem.textContent = draggedElement.textContent;
        droppedItem.dataset.operation = draggedElement.dataset.operation;
    }
}

// Touch support for drag and drop
function handleTouchStart(e) {
    draggedElement = e.target;
    e.target.style.opacity = '0.5';
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (elementBelow && elementBelow.classList.contains('drop-zone')) {
        elementBelow.classList.add('drag-over');
    }
}

function handleTouchEnd(e) {
    e.target.style.opacity = '';
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (elementBelow && elementBelow.classList.contains('drop-zone')) {
        const droppedItem = elementBelow.querySelector('.dropped-item');
        droppedItem.textContent = draggedElement.textContent;
        droppedItem.dataset.operation = draggedElement.dataset.operation;
        elementBelow.classList.remove('drag-over');
    }
}

function checkDragDrop() {
    const dropZones = document.querySelectorAll('.drop-zone');
    let correct = 0;
    
    dropZones.forEach(zone => {
        const answer = zone.dataset.answer;
        const droppedOperation = zone.querySelector('.dropped-item').dataset.operation;
        
        if (answer === droppedOperation) {
            correct++;
        }
    });
    
    const feedback = document.getElementById('dragDropFeedback');
    if (correct === 4) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Perfect! You understand the file operations!';
        awardXP(10, 'dragdrop');
        
        if (!achievements.includes('File Explorer')) {
            achievements.push('File Explorer');
            showAchievement('File Explorer', 'Mastered the basic file operations!');
        }
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = `<i class="fas fa-times-circle"></i> You got ${correct}/4 correct. Try again!`;
    }
}

function resetDragDrop() {
    document.querySelectorAll('.dropped-item').forEach(item => {
        item.textContent = '';
        item.dataset.operation = '';
    });
    document.getElementById('dragDropFeedback').innerHTML = '';
}

// Section 1: Filing Cabinet
function openDrawer(drawer, type) {
    // Close other drawers
    document.querySelectorAll('.drawer').forEach(d => d.classList.remove('open'));
    
    // Open clicked drawer
    drawer.classList.add('open');
    
    const info = document.getElementById('drawerInfo');
    const messages = {
        'open': '<strong>OPEN:</strong> Use open() to access a file. Like opening a drawer to see what\'s inside!',
        'readwrite': '<strong>READ/WRITE:</strong> Use readline() to read or write() to add data. Like reading or adding papers to a folder!',
        'close': '<strong>CLOSE:</strong> Always use close() when done. Like closing the drawer to keep everything safe!'
    };
    
    info.innerHTML = `<div class="info-box">${messages[type]}</div>`;
    awardXP(5, `drawer_${type}`);
}

// Section 2: File Modes
function selectMode(mode) {
    // Update visual selection
    document.querySelectorAll('.mode-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.mode-option').classList.add('selected');
    
    const explanation = document.getElementById('modeExplanation');
    const simulator = document.getElementById('modeSimulator');
    const content = document.getElementById('simulatorContent');
    
    simulator.style.display = 'block';
    
    const explanations = {
        'r': {
            text: '<strong>Read Mode (\'r\'):</strong> Opens file for reading only. File must exist or you\'ll get an error!',
            demo: 'Original content here\n[Reading only - no changes allowed]'
        },
        'w': {
            text: '<strong>Write Mode (\'w\'):</strong> Creates a new file or OVERWRITES existing file completely!',
            demo: '[Previous content DELETED]\nNew content goes here'
        },
        'a': {
            text: '<strong>Append Mode (\'a\'):</strong> Adds new content to the END of existing file without deleting.',
            demo: 'Original content here\nNew line added at the end'
        }
    };
    
    explanation.innerHTML = `<div class="info-box">${explanations[mode].text}</div>`;
    content.textContent = explanations[mode].demo;
    
    awardXP(5, `mode_${mode}`);
}

function checkModeQuiz() {
    const q1 = document.getElementById('modeQ1').value;
    const q2 = document.getElementById('modeQ2').value;
    const q3 = document.getElementById('modeQ3').value;
    
    let correct = 0;
    if (q1 === 'r') correct++;
    if (q2 === 'w') correct++;
    if (q3 === 'a') correct++;
    
    const feedback = document.getElementById('modeQuizFeedback');
    
    if (correct === 3) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Excellent! You understand when to use each mode!';
        awardXP(15, 'modequiz');
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = `<i class="fas fa-times-circle"></i> You got ${correct}/3 correct. Remember: r=read, w=write(overwrite), a=append`;
    }
}

// Section 3: File Reading
let fileLines = ['Alice,85', 'Bob,92', 'Charlie,78', 'David,88', 'Eve,95'];
let currentLine = 0;

function readNextLine() {
    const output = document.getElementById('readOutput');
    
    if (currentLine < fileLines.length) {
        const line = fileLines[currentLine];
        output.textContent += `\nline = file.readline()  # Returns: "${line}"`;
        currentLine++;
        
        awardXP(2, `readline_${currentLine}`);
        
        if (currentLine === fileLines.length) {
            output.textContent += '\n\n# End of file reached!';
            
            if (!achievements.includes('Data Reader')) {
                achievements.push('Data Reader');
                showAchievement('Data Reader', 'Read all lines from a file!');
            }
        }
    }
}

function resetFileReader() {
    currentLine = 0;
    document.getElementById('readOutput').textContent = '# Output will appear here';
}

function checkReadingReflection() {
    const answer = document.getElementById('readingReflection').value.trim();
    const feedback = document.getElementById('readingReflectionFeedback');
    
    const keywords = ['memory', 'large', 'efficient', 'process', 'one at a time', 'ram', 'size'];
    const usedKeywords = keywords.filter(keyword => 
        answer.toLowerCase().includes(keyword)
    ).length;
    
    if (answer.length > 30 && usedKeywords >= 2) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Excellent! Line-by-line reading is more memory efficient for large files.';
        awardXP(10, 'readreflection');
    } else if (answer.length > 30) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Good point! It helps manage memory usage.';
        awardXP(5, 'readreflection');
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '<i class="fas fa-times-circle"></i> Try to expand your answer with more detail about memory efficiency.';
    }
}

// Section 4: File Writing
function writeToFile(mode) {
    const input = document.getElementById('notepadInput').value;
    const content = document.getElementById('notepadContent');
    
    if (!input) {
        alert('Please type something to write!');
        return;
    }
    
    if (mode === 'w') {
        virtualNotepad = input + '\n';
        content.textContent = virtualNotepad;
        content.style.color = '#f39c12';
        setTimeout(() => content.style.color = '', 500);
    } else if (mode === 'a') {
        if (virtualNotepad === '' || content.textContent === '[Empty file]') {
            virtualNotepad = input + '\n';
        } else {
            virtualNotepad += input + '\n';
        }
        content.textContent = virtualNotepad;
        content.style.color = '#2ecc71';
        setTimeout(() => content.style.color = '', 500);
    }
    
    document.getElementById('notepadInput').value = '';
    awardXP(5, `write_${mode}_${virtualNotepad.length}`);
    
    if (!achievements.includes('Data Writer') && virtualNotepad.split('\n').length > 3) {
        achievements.push('Data Writer');
        showAchievement('Data Writer', 'Successfully wrote multiple lines to a file!');
    }
}

function clearNotepad() {
    virtualNotepad = '';
    document.getElementById('notepadContent').textContent = '[Empty file]';
}

function checkWriteBlanks() {
    const blank1 = document.getElementById('writeBlank1').value.trim();
    const blank2 = document.getElementById('writeBlank2').value.trim();
    const blank3 = document.getElementById('writeBlank3').value.trim();
    
    const feedback = document.getElementById('writeBlanksFeedback');
    
    // Check for correct answers (accepting variations)
    const openCorrect = blank1.includes('open') && blank1.includes('"') && (blank1.includes('w') || blank1.includes('a'));
    const writeCorrect = blank2.toLowerCase() === 'write';
    const closeCorrect = blank3.toLowerCase() === 'close()' || blank3.toLowerCase() === 'close';
    
    if (openCorrect && writeCorrect && closeCorrect) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Perfect! You\'ve got the complete file writing process!';
        awardXP(15, 'writeblanks');
    } else {
        let hints = [];
        if (!openCorrect) hints.push('First blank needs open("filename", "mode")');
        if (!writeCorrect) hints.push('Second blank needs write');
        if (!closeCorrect) hints.push('Third blank needs close()');
        
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = `<i class="fas fa-times-circle"></i> Not quite right. Hints: ${hints.join(', ')}`;
    }
}

// Section 5: Real World
function saveHighScore() {
    const score = parseInt(document.getElementById('scoreInput').value);
    const display = document.getElementById('scoreDisplay');
    
    if (!score || score < 0) {
        display.textContent = 'Please enter a valid score!';
        display.style.color = '#f5365c';
        return;
    }
    
    virtualHighScore = score;
    display.textContent = `High score saved: ${score}`;
    display.style.color = '#2dce89';
    
    document.getElementById('scoreInput').value = '';
    awardXP(5, 'highscore_save');
}

function loadHighScore() {
    const display = document.getElementById('scoreDisplay');
    
    if (virtualHighScore === 0) {
        display.textContent = 'No high score saved yet!';
        display.style.color = '#fb6340';
    } else {
        display.textContent = `Current high score: ${virtualHighScore}`;
        display.style.color = '#5e72e4';
    }
    
    awardXP(5, 'highscore_load');
}

// Section 6: Exam Questions
function showMarkScheme(questionNum) {
    const answers = {
        1: {
            a: document.getElementById('q1a').value,
            b: document.getElementById('q1b').value,
            c: document.getElementById('q1c').value
        },
        2: {
            a: document.getElementById('q2a').value,
            b: document.getElementById('q2b').value
        },
        3: document.getElementById('q3').value
    };
    
    // Check minimum answer length
    let totalLength = 0;
    if (questionNum === 1) {
        totalLength = answers[1].a.length + answers[1].b.length + answers[1].c.length;
    } else if (questionNum === 2) {
        totalLength = answers[2].a.length + answers[2].b.length;
    } else {
        totalLength = answers[3].length;
    }
    
    if (totalLength < 40) {
        alert("Please write more detailed answers before viewing the mark scheme.");
        return;
    }
    
    document.getElementById(`markScheme${questionNum}`).style.display = 'block';
    awardXP(20, `examQ${questionNum}`);
    
    // Check for exam completion achievement
    const completedExams = Array.from(completedTasks).filter(task => task.startsWith('examQ')).length;
    if (completedExams === 3 && !achievements.includes('Problem Solver')) {
        achievements.push('Problem Solver');
        showAchievement('Problem Solver', 'Completed all exam questions!');
    }
}

// Canvas functionality
function initializeCanvases() {
    for (let i = 1; i <= 3; i++) {
        const canvas = document.getElementById(`drawingCanvas${i}`);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            canvases[i] = { canvas, ctx, isDrawing: false };
            
            canvas.addEventListener('mousedown', (e) => startDrawing(e, i));
            canvas.addEventListener('mousemove', (e) => draw(e, i));
            canvas.addEventListener('mouseup', () => stopDrawing(i));
            canvas.addEventListener('mouseout', () => stopDrawing(i));
            
            // Touch support
            canvas.addEventListener('touchstart', (e) => handleTouch(e, i, 'start'));
            canvas.addEventListener('touchmove', (e) => handleTouch(e, i, 'move'));
            canvas.addEventListener('touchend', () => stopDrawing(i));
        }
    }
}

function startDrawing(e, canvasNum) {
    const rect = canvases[canvasNum].canvas.getBoundingClientRect();
    canvases[canvasNum].isDrawing = true;
    canvases[canvasNum].ctx.beginPath();
    canvases[canvasNum].ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e, canvasNum) {
    if (!canvases[canvasNum].isDrawing) return;
    
    const rect = canvases[canvasNum].canvas.getBoundingClientRect();
    const ctx = canvases[canvasNum].ctx;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#5e72e4';
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
}

function stopDrawing(canvasNum) {
    canvases[canvasNum].isDrawing = false;
}

function handleTouch(e, canvasNum, type) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvases[canvasNum].canvas.getBoundingClientRect();
    
    if (type === 'start') {
        canvases[canvasNum].isDrawing = true;
        canvases[canvasNum].ctx.beginPath();
        canvases[canvasNum].ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    } else if (type === 'move' && canvases[canvasNum].isDrawing) {
        const ctx = canvases[canvasNum].ctx;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#5e72e4';
        ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
        ctx.stroke();
    }
}

function showCanvas(questionNum) {
    document.getElementById(`canvasContainer${questionNum}`).style.display = 'block';
}

function hideCanvas(questionNum) {
    document.getElementById(`canvasContainer${questionNum}`).style.display = 'none';
}

function clearCanvas(questionNum) {
    const ctx = canvases[questionNum].ctx;
    ctx.clearRect(0, 0, canvases[questionNum].canvas.width, canvases[questionNum].canvas.height);
}

// Section 7: Extension activities
function checkExtension1() {
    const code = document.getElementById('extension1').value;
    const feedback = document.getElementById('extension1Feedback');
    
    const hasOpen = code.includes('open');
    const hasReadline = code.includes('readline');
    const hasSplit = code.includes('split');
    const hasClose = code.includes('close');
    
    if (hasOpen && hasReadline && hasSplit && hasClose) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Excellent! You\'ve discovered how to process CSV files by splitting lines!';
        awardXP(15, 'extension1');
    } else {
        feedback.className = 'feedback incorrect';
        let missing = [];
        if (!hasSplit) missing.push('split()');
        if (!hasReadline) missing.push('readline()');
        feedback.innerHTML = `<i class="fas fa-times-circle"></i> Consider using: ${missing.join(', ')} to process CSV data.`;
    }
}

function checkExtension2() {
    const code = document.getElementById('extension2').value;
    const feedback = document.getElementById('extension2Feedback');
    
    const hasTry = code.includes('try');
    const hasExcept = code.includes('except');
    const hasFileNotFound = code.toLowerCase().includes('filenotfound') || code.includes('IOError');
    
    if (hasTry && hasExcept) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Great error handling! This prevents crashes when files don\'t exist.';
        awardXP(15, 'extension2');
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '<i class="fas fa-times-circle"></i> Research try/except blocks to handle missing files gracefully.';
    }
}

function checkExtension3() {
    const code = document.getElementById('extension3').value;
    const feedback = document.getElementById('extension3Feedback');
    
    const hasOpen = code.includes('open');
    const hasLoop = code.includes('for') || code.includes('while');
    const hasCounter = code.includes('count') || code.includes('+=');
    const hasReadline = code.includes('readline');
    
    if (hasOpen && hasLoop && (hasCounter || hasReadline)) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Perfect line counting program! This is useful for analyzing text files.';
        awardXP(15, 'extension3');
        
        // Final achievement check
        if (xp >= 160 && !achievements.includes('File Master')) {
            achievements.push('File Master');
            showAchievement('File Master', 'Completed the entire file handling lesson!', 'fa-crown');
        }
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '<i class="fas fa-times-circle"></i> Think about using a loop to count each line in the file.';
    }
}

// Accessibility controls
function initializeAccessibility() {
    // Font size control
    const fontSizeControl = document.getElementById('fontSizeControl');
    fontSizeControl.addEventListener('input', function() {
        document.documentElement.style.setProperty('--font-size-base', `${this.value}px`);
        document.getElementById('fontSizeValue').textContent = `${this.value}px`;
    });
    
    // High contrast toggle
    const highContrastToggle = document.getElementById('highContrastToggle');
    highContrastToggle.addEventListener('change', function() {
        document.body.classList.toggle('high-contrast', this.checked);
    });
    
    // Dyslexia font toggle
    const dyslexiaFontToggle = document.getElementById('dyslexiaFontToggle');
    dyslexiaFontToggle.addEventListener('change', function() {
        document.body.classList.toggle('dyslexia-font', this.checked);
    });
}

// Touch support
function initializeTouchSupport() {
    // Swipe gestures for section navigation
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50 && currentSection < totalSections - 1) {
            navigateToSection(currentSection + 1);
        }
        if (touchEndX > touchStartX + 50 && currentSection > 0) {
            navigateToSection(currentSection - 1);
        }
    }
}

// Particle effects
function createParticles() {
    const colors = ['#5e72e4', '#11cdef', '#2dce89', '#fb6340'];
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.width = particle.style.height = Math.random() * 10 + 5 + 'px';
        particle.style.borderRadius = '50%';
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 3000);
    }
}

// Prevent text selection on double click
document.addEventListener('selectstart', function(e) {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
});

// Add console warning
console.log('%cSTOP!', 'color: red; font-size: 50px; font-weight: bold;');
console.log('%cThis is a browser feature intended for developers. Do not paste any code here!', 
            'color: red; font-size: 16px;');