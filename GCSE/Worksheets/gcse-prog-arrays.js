// Global variables
let currentSection = 0;
let totalSections = 7;
let xp = 0;
let level = 0;
let achievements = [];
let completedTasks = new Set();
let shoppingList = [];
let draggedElement = null;
let canvases = {};
let editor = null;
let editorInitialized = false;
let editorQ3 = null; // Editor for Question 3
let editorQ3Initialized = false; // Flag for Question 3 editor
let currentHintIndex = 0;
let ticTacToeBoard = [["", "", ""], ["", "", ""], ["", "", ""]];

// XP thresholds for levels
const levelThresholds = [0, 40, 80, 120, 160];

// Code hints
const codeHints = [
    "Use shopping_list.append('cheese') to add cheese to the list",
    "Use print(shopping_list[0]) to print the first item",
    "Use print(shopping_list[-1]) to print the last item"
];

// CRITICAL: Load Skulpt with multiple CDN fallbacks
async function loadSkulptWithFallbacks() {
    const skulptSources = [
        { name: 'CDNjs (Latest)', main: 'https://cdnjs.cloudflare.com/ajax/libs/skulpt/1.2.0/skulpt.min.js', stdlib: 'https://cdnjs.cloudflare.com/ajax/libs/skulpt/1.2.0/skulpt-stdlib.js' },
        { name: 'jsDelivr CDN', main: 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js', stdlib: 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js' },
        { name: 'Unpkg CDN', main: 'https://unpkg.com/skulpt@1.2.0/dist/skulpt.min.js', stdlib: 'https://unpkg.com/skulpt@1.2.0/dist/skulpt-stdlib.js' },
        { name: 'cdnjs (Stable 0.11.0)', main: 'https://cdnjs.cloudflare.com/ajax/libs/skulpt/0.11.0/skulpt.min.js', stdlib: 'https://cdnjs.cloudflare.com/ajax/libs/skulpt/0.11.0/skulpt-stdlib.js' }
    ];
    for (const source of skulptSources) {
        try {
            await loadScript(source.main);
            await loadScript(source.stdlib);
            if (typeof Sk !== 'undefined') {
                console.log(`Skulpt loaded from ${source.name}`);
                return true;
            }
        } catch (e) {
            console.warn(`Failed to load from ${source.name}:`, e);
        }
    }
    return false;
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.crossOrigin = 'anonymous';
        script.async = true;
        const timeoutId = setTimeout(() => {
            script.remove();
            reject(new Error(`Timeout loading ${src}`));
        }, 15000);
        script.onload = () => { clearTimeout(timeoutId); resolve(); };
        script.onerror = () => { clearTimeout(timeoutId); reject(new Error(`Failed to load ${src}`)); };
        document.head.appendChild(script);
    });
}

// CRITICAL: Visual input handling for Python input() function
function createInputPanel() {
    const panel = document.createElement('div');
    panel.className = 'input-panel active';
    const prompt = document.createElement('div');
    prompt.className = 'input-prompt';
    const inputField = document.createElement('input');
    inputField.className = 'input-field';
    inputField.type = 'text';
    const submitBtn = document.createElement('button');
    submitBtn.className = 'input-submit';
    submitBtn.textContent = 'Submit';
    panel.appendChild(prompt);
    panel.appendChild(inputField);
    panel.appendChild(submitBtn);
    return { panel, prompt, inputField, submitBtn };
}

// Starter code for the editor
const starterCode = `# Create a shopping list with 3 items
shopping_list = ["milk", "bread", "eggs"]

# Add "cheese" to the list using append
# YOUR CODE HERE

# Print the shopping list
print("Shopping list:", shopping_list)

# Print the first item
# YOUR CODE HERE

# Print the last item using negative indexing
# YOUR CODE HERE`;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeLesson();
    preventPaste();
    initializeAccessibility();
    initializeDragDrop();
    initialize2DGrid();
    initializeTicTacToe();
    initializeCanvases();
    
    // Mobile support
    if ('ontouchstart' in window) {
        initializeTouchSupport();
    }
});

// Add a separate initialization for when the document is ready
window.addEventListener('load', function() {
    // Check if we are on a section with an editor
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        if(activeSection.id === 'section6') {
             setTimeout(() => {
                initializePythonEditor().catch(err => {
                    console.error('Failed to initialize Python editor on load:', err);
                });
            }, 500);
        } else if(activeSection.id === 'section5') {
            setTimeout(() => {
                initializeQ3Editor().catch(err => {
                    console.error('Failed to initialize Q3 editor on load:', err);
                });
            }, 500);
        }
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
    if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
        return; // Don't navigate when typing
    }
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
    const targetSection = document.getElementById(`section${sectionIndex}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach((btn, index) => {
        btn.classList.toggle('active', index === sectionIndex);
    });

    currentSection = sectionIndex;
    updateProgressBar();

    // Initialize Python editors if they are in the current section and not already initialized
    if (sectionIndex === 6 && !editorInitialized) {
        initializePythonEditor();
    }
    if (sectionIndex === 5 && !editorQ3Initialized) {
        initializeQ3Editor();
    }


    // Scroll to top
    window.scrollTo(0, 0);

    // Announce for screen readers
    announceSection(sectionIndex);
}

// Screen reader announcement
function announceSection(index) {
    const sectionNames = ['Starter Activity', '1D Arrays', 'Array Manipulation', 
                         '2D Arrays', 'Real World Applications', 'Exam Questions', 'Extension'];
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
    const shameInputs = document.querySelectorAll('input, textarea');
    shameInputs.forEach(input => {
        // Allow pasting into non-exam textareas
        if (!input.id.includes('q') && !input.id.includes('extension')) {
             input.addEventListener('paste', function(e) {
                e.preventDefault();
                showShameMessage();
                return false;
            });
        }
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
        droppedItem.dataset.concept = draggedElement.dataset.concept;
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
        droppedItem.dataset.concept = draggedElement.dataset.concept;
        elementBelow.classList.remove('drag-over');
    }
}

// Check drag and drop answers
function checkDragDrop() {
    const dropZones = document.querySelectorAll('.drop-zone');
    let correct = 0;
    
    dropZones.forEach(zone => {
        const answer = zone.dataset.answer;
        const droppedConcept = zone.querySelector('.dropped-item').dataset.concept;
        
        if (answer === droppedConcept) {
            correct++;
        }
    });
    
    const feedback = document.getElementById('dragDropFeedback');
    if (correct === 4) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Excellent! All matches are correct!';
        awardXP(10, 'dragdrop');
        
        if (!achievements.includes('Array Apprentice')) {
            achievements.push('Array Apprentice');
            showAchievement('Array Apprentice', 'Completed the starter activity!');
        }
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = `<i class="fas fa-times-circle"></i> You got ${correct}/4 correct. Try again!`;
    }
}

function resetDragDrop() {
    document.querySelectorAll('.dropped-item').forEach(item => {
        item.textContent = '';
        item.dataset.concept = '';
    });
    document.getElementById('dragDropFeedback').innerHTML = '';
}

// Starter quiz
function checkStarterQuiz() {
    const answer = document.getElementById('starterQuizAnswer').value.trim().toLowerCase();
    const feedback = document.getElementById('starterQuizFeedback');
    
    if (answer === 'banana') {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Correct! fruits[1] accesses the second element, which is "banana".';
        awardXP(5, 'starterquiz');
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '<i class="fas fa-times-circle"></i> Not quite. Remember, Python uses 0-based indexing. Try again!';
    }
}

// Section 1: 1D Arrays
function showIndex(index, value) {
    const display = document.getElementById('indexDisplay');
    display.innerHTML = `<span style="background: var(--code-bg); color: var(--code-text); padding: 8px 15px; border-radius: 5px; display: inline-block;"><span class="keyword">fruits</span>[<span class="number">${index}</span>] <span class="operator">=</span> <span class="string">"${value}"</span></span>`;
    
    // Visual feedback
    event.target.classList.add('selected');
    setTimeout(() => {
        event.target.classList.remove('selected');
    }, 1000);
}

function checkAccessAnswer() {
    const answer = document.getElementById('accessAnswer').value.trim();
    const feedback = document.getElementById('accessFeedback');
    
    if (answer === 'colors[2]' || answer === 'colors[2]') {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Perfect! colors[2] gives us "blue".';
        awardXP(5, 'access1d');
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '<i class="fas fa-times-circle"></i> Not quite. Remember: red=0, green=1, blue=2';
    }
}

// Section 2: Shopping List
function addToShoppingList() {
    const item = document.getElementById('shoppingItem').value.trim();
    if (item) {
        shoppingList.push(item);
        updateShoppingDisplay();
        document.getElementById('shoppingItem').value = '';
        awardXP(2, `shopping_${shoppingList.length}`);
    }
}

function removeLastItem() {
    if (shoppingList.length > 0) {
        shoppingList.pop();
        updateShoppingDisplay();
    }
}

function clearShoppingList() {
    shoppingList = [];
    updateShoppingDisplay();
}

function updateShoppingDisplay() {
    const display = document.getElementById('shoppingListDisplay');
    if (shoppingList.length === 0) {
        display.innerHTML = '<span class="keyword">shopping_list</span> <span class="operator">=</span> []';
    } else {
        const items = shoppingList.map(item => `<span class="string">"${item}"</span>`).join(', ');
        display.innerHTML = `<span class="keyword">shopping_list</span> <span class="operator">=</span> [${items}]`;
    }
}

function checkFillBlanks() {
    const blank1 = document.getElementById('blank1').value.trim();
    const blank2 = document.getElementById('blank2').value.trim();
    const blank3 = document.getElementById('blank3').value.trim();
    const feedback = document.getElementById('fillBlanksFeedback');
    
    if (blank1 && blank2 && blank3) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = `<i class="fas fa-check-circle"></i> Great! Your favorite subjects are: ${blank1}, ${blank2}, and ${blank3}`;
        awardXP(5, 'fillblanks');
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '<i class="fas fa-times-circle"></i> Please fill in all three subjects!';
    }
}

// Section 3: 2D Arrays
function initialize2DGrid() {
    const grid = document.getElementById('grid2D');
    const values = [
        ['A', 'B', 'C', 'D'],
        ['E', 'F', 'G', 'H'],
        ['I', 'J', 'K', 'L'],
        ['M', 'N', 'O', 'P']
    ];
    
    grid.innerHTML = '';
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.textContent = values[row][col];
            cell.onclick = () => show2DAccess(row, col, values[row][col]);
            grid.appendChild(cell);
        }
    }
}

function show2DAccess(row, col, value) {
    const codeDisplay = document.getElementById('accessCode');
    codeDisplay.innerHTML = `<span class="keyword">grid</span>[<span class="number">${row}</span>][<span class="number">${col}</span>] <span class="operator">=</span> <span class="string">"'${value}'"</span>`;
    
    // Highlight the clicked cell
    event.target.classList.add('selected');
    setTimeout(() => {
        event.target.classList.remove('selected');
    }, 1000);
    
    // Award XP for exploration
    awardXP(1, `grid_${row}_${col}`);
    
    // Check for achievement
    const exploredCells = Array.from(completedTasks).filter(task => task.startsWith('grid_')).length;
    if (exploredCells >= 10 && !achievements.includes('2D Navigator')) {
        achievements.push('2D Navigator');
        showAchievement('2D Navigator', 'Explored 10 cells in the 2D grid!');
    }
}

function checkSeatAnswer() {
    const answer = document.getElementById('seatAnswer').value.trim();
    const feedback = document.getElementById('seatFeedback');
    
    if (answer.toLowerCase() === 'eve') {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Correct! Eve sits at classroom[1][1] - the middle position.';
        awardXP(10, 'seating');
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '<i class="fas fa-times-circle"></i> Not quite. The middle of a 3x3 grid is at position [1][1].';
    }
}

function checkReflection() {
    const answer = document.getElementById('reflectionAnswer').value.trim();
    const feedback = document.getElementById('reflectionFeedback');
    
    const keywords = ['rows', 'columns', 'grid', 'organize', 'position', 'layout', 'structure', 'visual'];
    const usedKeywords = keywords.filter(keyword => 
        answer.toLowerCase().includes(keyword)
    ).length;
    
    if (answer.length > 30 && usedKeywords >= 2) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Excellent reflection! You understand the benefits of 2D arrays.';
        awardXP(10, 'reflection');
    } else if (answer.length > 30) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Good thinking! 2D arrays help represent spatial relationships.';
        awardXP(5, 'reflection');
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '<i class="fas fa-times-circle"></i> Try to expand your answer with more detail.';
    }
}

// Section 4: Tic-Tac-Toe
function initializeTicTacToe() {
    const grid = document.getElementById('ticTacToe');
    grid.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.index = i;
        cell.onclick = () => playTicTacToe(i);
        grid.appendChild(cell);
    }
    
    updateTicTacToeArray();
}

let currentPlayer = 'X';
function playTicTacToe(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    
    if (ticTacToeBoard[row][col] === '') {
        ticTacToeBoard[row][col] = currentPlayer;
        const cell = document.querySelector(`#ticTacToe [data-index="${index}"]`);
        cell.textContent = currentPlayer;
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        awardXP(1, `tictactoe_${index}`);
        updateTicTacToeArray();
    }
}

function updateTicTacToeArray() {
    const arrayDisplay = document.getElementById('ticTacToeArray');
    let arrayStr = '<span class="keyword">board</span> <span class="operator">=</span> [\n';
    
    for (let i = 0; i < 3; i++) {
        arrayStr += '    [';
        for (let j = 0; j < 3; j++) {
            const value = ticTacToeBoard[i][j] || '';
            arrayStr += `<span class="string">"${value}"</span>`;
            if (j < 2) arrayStr += ', ';
        }
        arrayStr += ']';
        if (i < 2) arrayStr += ',';
        arrayStr += '\n';
    }
    arrayStr += ']';
    
    arrayDisplay.innerHTML = arrayStr;
}

function resetTicTacToe() {
    ticTacToeBoard = [["", "", ""], ["", "", ""], ["", "", ""]];
    initializeTicTacToe();
    currentPlayer = 'X';
}

// Section 5: Exam Questions
function showMarkScheme(questionNum) {
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
    ctx.strokeStyle = '#2c3e50';
    
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
        ctx.strokeStyle = '#2c3e50';
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

// Extension activities
function checkExtension1() {
    // This is now handled by the code editor
    const code = editor ? editor.getValue() : '';
    const feedback = document.getElementById('extension1Feedback');
    
    if (code.includes('append') && code.includes('shopping_list')) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Excellent work with array manipulation!';
        awardXP(25, 'extension1');
    }
}

function checkExtension2() {
    const code = document.getElementById('extension2').value;
    const feedback = document.getElementById('extension2Feedback');
    
    const hasBoard = code.includes('[[') && code.includes(']]');
    const has5x5 = (code.match(/\[/g) || []).length >= 10;
    const hasPlayer = code.includes('"P"') || code.includes("'P'");
    
    if (hasBoard && has5x5 && hasPlayer) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Excellent game board! You could add movement functions next.';
        awardXP(25, 'extension2');
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '<i class="fas fa-times-circle"></i> Make sure to create a 5x5 grid with a player "P" at position [2][2].';
    }
}

function checkExtension3() {
    const code = document.getElementById('extension3').value;
    const feedback = document.getElementById('extension3Feedback');
    
    const hasFunction = code.includes('def') || code.includes('function');
    const hasLoop = code.includes('for') || code.includes('while');
    const hasAddition = code.includes('+');
    
    if (hasFunction && hasLoop && hasAddition) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Great matrix addition function! This is the foundation of many graphics operations.';
        awardXP(25, 'extension3');
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '<i class="fas fa-times-circle"></i> Remember to use nested loops to add corresponding elements.';
    }
}

function checkExtension4() {
    const answer = document.getElementById('extension4').value.trim();
    const feedback = document.getElementById('extension4Feedback');
    
    if (answer.length > 20) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Great example! 3D arrays are used in video data, 3D graphics, and scientific simulations.';
        awardXP(25, 'extension4');
        
        // Check for expert achievement
        if (xp >= 160 && !achievements.includes('Array Expert')) {
            achievements.push('Array Expert');
            showAchievement('Array Expert', 'Reached Level 5 - You are an Array Expert!', 'fa-crown');
        }
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '<i class="fas fa-times-circle"></i> Try to provide more detail in your example.';
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
            navigateToSection(currentSection + 1);
        }
    }
}

// Particle effects
function createParticles() {
    const colors = ['#3498db', '#2ecc71', '#f39c12', '#e74c3c'];
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.width = particle.style.height = Math.random() * 10 + 5 + 'px';
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 3000);
    }
}

// Add at the end of the file to ensure global functions are available
window.initializePythonEditor = initializePythonEditor;

// Debug function to check status
window.checkPythonEnvironment = function() {
    console.log('=== Python Environment Status ===');
    console.log('Editor initialized:', editorInitialized);
    console.log('Editor object:', editor);
    console.log('Q3 Editor initialized:', editorQ3Initialized);
    console.log('Q3 Editor object:', editorQ3);
    console.log('Skulpt loaded:', typeof Sk !== 'undefined');
    console.log('Ace loaded:', typeof ace !== 'undefined');
};

// Add console warning
console.log('%cSTOP!', 'color: red; font-size: 50px; font-weight: bold;');
console.log('%cThis is a browser feature intended for developers. Do not paste any code here!', 
            'color: red; font-size: 16px;');

// Configure Skulpt with input handling
function configureSkulpt(outputFunc, inputFunc) {
    if (typeof Sk === 'undefined') {
        console.error('Skulpt not loaded');
        return false;
    }
    
    try {
        Sk.configure({
            output: outputFunc,
            read: function(x) {
                if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
                    throw "File not found: '" + x + "'";
                }
                return Sk.builtinFiles["files"][x];
            },
            inputfun: inputFunc,
            inputfunTakesPrompt: true,
            __future__: Sk.python3 || Sk.python2
        });
        
        // Set execution limit to prevent infinite loops
        Sk.execLimit = 10000; // 10 seconds
        return true;
    } catch (e) {
        console.error('Skulpt configuration error:', e);
        return false;
    }
}

// Format Python errors for student-friendly display
function formatPythonError(err) {
    let errorStr = err.toString();
    errorStr = errorStr.replace(/on line \d+ of <stdin>/g, '');
    errorStr = errorStr.replace(/File "<stdin>",/g, '');
    if (errorStr.includes('SyntaxError')) {
        errorStr = 'SyntaxError: Check your code syntax (missing colons, brackets, quotes, etc.)';
    } else if (errorStr.includes('IndentationError')) {
        errorStr = 'IndentationError: Check your code indentation (use consistent spaces)';
    } else if (errorStr.includes('NameError')) {
        const match = errorStr.match(/name '(\w+)' is not defined/);
        if (match) {
            errorStr = `NameError: '${match[1]}' is not defined. Check spelling or define it first.`;
        }
    } else if (errorStr.includes('TimeLimitError')) {
        errorStr = 'Your code took too long to run. Check for infinite loops.';
    }
    return errorStr;
}

// Generic code execution function
async function runCodeGeneric(editorInstance, outputElementId) {
    if (!editorInstance) {
        console.error("Editor not initialized. Cannot run code.");
        const out = document.getElementById(outputElementId);
        if(out) out.textContent = "Error: Editor is not ready.";
        return;
    }

    const outputElement = document.getElementById(outputElementId);
    outputElement.textContent = 'Running...';
    outputElement.classList.remove('error');

    const code = editorInstance.getValue();
    let fullOutput = "";
    const outputPanel = outputElement.closest('.output-panel');
    let inputPanelData = null;

    // Remove any previous input panel
    const existingPanel = outputPanel.nextElementSibling;
    if (existingPanel && existingPanel.classList.contains('input-panel')) {
        existingPanel.remove();
    }

    configureSkulpt(
        (text) => {
            fullOutput += text;
            outputElement.textContent = fullOutput;
        },
        (promptText) => {
            return new Promise((resolve) => {
                fullOutput += promptText;
                outputElement.textContent = fullOutput;

                inputPanelData = createInputPanel();
                inputPanelData.prompt.textContent = promptText;
                outputPanel.parentNode.insertBefore(inputPanelData.panel, outputPanel.nextSibling);

                inputPanelData.inputField.focus();

                const submitHandler = () => {
                    const value = inputPanelData.inputField.value;
                    fullOutput += value + '\n';
                    outputElement.textContent = fullOutput;
                    inputPanelData.panel.remove();
                    resolve(value);
                };

                inputPanelData.submitBtn.addEventListener('click', submitHandler);
                inputPanelData.inputField.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        submitHandler();
                    }
                });
            });
        }
    );

    try {
        await Sk.misceval.asyncToPromise(() =>
            Sk.importMainWithBody("<stdin>", false, code, true)
        );
        outputElement.textContent = fullOutput || '(No output)';
        return { code, output: fullOutput }; // Return results for testing
    } catch (err) {
        if (inputPanelData && inputPanelData.panel.parentNode) {
            inputPanelData.panel.remove();
        }
        outputElement.textContent = formatPythonError(err);
        outputElement.classList.add('error');
    }
    return null;
}


// Main code execution function (for extension activity)
async function runCode() {
    const result = await runCodeGeneric(editor, 'output');
    if(result) {
        runTestCases(result.code, result.output);
    }
}

// Q3 code execution function
async function runCodeQ3() {
    await runCodeGeneric(editorQ3, 'output-q3');
}


// Test case execution
function runTestCases(code, output) {
    const testResultsElement = document.getElementById('testResults');
    const testCasesDiv = document.getElementById('testCases');
    if (!testResultsElement || !testCasesDiv) return;

    let testsHtml = '';
    let passedTests = 0;
    const totalTests = 3;

    // Test 1: Check if 'cheese' was added and printed
    const hasAppend = /shopping_list\.append\s*\(\s*["']cheese["']\s*\)/.test(code);
    const outputIncludesCheese = /'cheese'/.test(output);
    if (hasAppend && outputIncludesCheese) {
        testsHtml += '<div class="test-case pass">✓ Test 1: "cheese" was successfully added to the list.</div>';
        passedTests++;
    } else {
        testsHtml += '<div class="test-case fail">✗ Test 1: Add "cheese" using `shopping_list.append("cheese")` and ensure the list is printed.</div>';
    }

    // Test 2: Check if first item is explicitly printed
    const hasFirstPrint = /print\s*\(\s*shopping_list\[0\]\s*\)/.test(code);
    if (hasFirstPrint) {
        testsHtml += '<div class="test-case pass">✓ Test 2: Code to print the first item was found.</div>';
        passedTests++;
    } else {
        testsHtml += '<div class="test-case fail">✗ Test 2: Use `print(shopping_list[0])` to print the first item.</div>';
    }

    // Test 3: Check if last item is explicitly printed
    const hasLastPrint = /print\s*\(\s*shopping_list\[-1\]\s*\)/.test(code);
    if (hasLastPrint) {
        testsHtml += '<div class="test-case pass">✓ Test 3: Code to print the last item with negative indexing was found.</div>';
        passedTests++;
    } else {
        testsHtml += '<div class="test-case fail">✗ Test 3: Use `print(shopping_list[-1])` to print the last item.</div>';
    }

    testResultsElement.innerHTML = testsHtml;
    testCasesDiv.style.display = 'block';

    if (passedTests === totalTests) {
        awardXP(25, 'coding_challenge1');
        if (!achievements.includes('Code Master')) {
            achievements.push('Code Master');
            showAchievement('Code Master', 'Completed the coding challenge!', 'fa-code');
        }
    }
}

// MODIFIED to accept editor ID
function initializeEditor(editorDivId, starterCode = '') {
    const editorDiv = document.getElementById(editorDivId);
    if (typeof ace === 'undefined') {
        console.error('Ace Editor not loaded, using fallback textarea');
        const fallbackId = `${editorDivId}-fallback`;
        editorDiv.innerHTML = `<textarea id="${fallbackId}" style="width: 100%; height: 100%; background: #272822; color: #f8f8f2; font-family: monospace; font-size: 14px; padding: 10px; border: none; resize: none; outline: none;"></textarea>`;
        const textarea = document.getElementById(fallbackId);
        textarea.value = starterCode;
        return {
            getValue: () => textarea.value,
            setValue: (val) => { textarea.value = val; },
            destroy: () => {},
            focus: () => { textarea.focus(); }
        };
    }

    const editor = ace.edit(editorDiv);
    editor.setTheme('ace/theme/monokai');
    editor.session.setMode('ace/mode/python');
    editor.setOptions({
        enableBasicAutocompletion: true, enableLiveAutocompletion: true, enableSnippets: true,
        showLineNumbers: true, tabSize: 4, useSoftTabs: true, fontSize: '14px',
        fontFamily: 'Consolas, Monaco, "Courier New", monospace', showPrintMargin: false,
        highlightActiveLine: true, wrap: true
    });
    editor.setValue(starterCode, -1);
    editor.focus();
    return editor;
}

// Initialize the editor for the Extension activity
async function initializePythonEditor() {
    if (editorInitialized) return true;

    console.log('Initializing Python editor...');
    const outputElement = document.getElementById('output');
    const runBtn = document.getElementById('run-btn');
    outputElement.innerHTML = 'Loading Python environment<span class="loading-indicator"></span>';

    const skulptLoaded = await loadSkulptWithFallbacks();

    if (!skulptLoaded) {
        document.getElementById('editor').innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--danger-color);"><h3>Error: Unable to Load Python Environment</h3><p>Please check your network connection and refresh.</p></div>`;
        outputElement.textContent = 'Initialization Failed.';
        outputElement.classList.add('error');
        if(runBtn) { runBtn.disabled = true; }
        return false;
    }

    editor = initializeEditor('editor', starterCode);
    editor.commands.addCommand({ name: 'runCode', bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter' }, exec: runCode, readOnly: true });

    if (runBtn) {
        runBtn.addEventListener('click', runCode);
        runBtn.disabled = false;
    }

    outputElement.textContent = 'Ready! Press Run or Ctrl+Enter to execute your code.';
    editorInitialized = true;
    console.log('Python editor initialized successfully');
    return true;
}


// Initialize the editor for Question 3
async function initializeQ3Editor() {
    if (editorQ3Initialized) return true;

    console.log('Initializing Q3 editor...');
    const outputElement = document.getElementById('output-q3');
    const runBtn = document.getElementById('run-btn-q3');
    outputElement.innerHTML = 'Loading Python environment<span class="loading-indicator"></span>';

    const skulptLoaded = (typeof Sk !== 'undefined') || await loadSkulptWithFallbacks();

    if (!skulptLoaded) {
        document.getElementById('editor-q3').innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--danger-color);"><h3>Error: Unable to Load Python Environment</h3><p>Please check your network connection and refresh.</p></div>`;
        outputElement.textContent = 'Initialization Failed.';
        outputElement.classList.add('error');
        if(runBtn) { runBtn.disabled = true; }
        return false;
    }

    const q3StarterCode = `# Write a program that:
# 1. Creates a 4x4 map with at least 2 of each terrain type.
#    (0 = Water, 1 = Land, 2 = Mountain)
# 2. Prints the entire map in a readable format.
# 3. Counts and prints how many water tiles there are.

# Your code here
`;

    editorQ3 = initializeEditor('editor-q3', q3StarterCode);
    editorQ3.commands.addCommand({ name: 'runCodeQ3', bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter' }, exec: runCodeQ3, readOnly: true });

    if (runBtn) {
        runBtn.addEventListener('click', runCodeQ3);
        runBtn.disabled = false;
    }

    outputElement.textContent = 'Ready! Write your solution and press "Run Code" or Ctrl+Enter.';
    editorQ3Initialized = true;
    console.log('Q3 editor initialized successfully.');
    return true;
}