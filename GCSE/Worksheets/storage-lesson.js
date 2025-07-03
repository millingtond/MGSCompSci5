// Global variables
let currentXP = 0;
let currentLevel = 1;
let completedSections = new Set();
let earnedAchievements = new Set();
let xpActions = new Set(); // Track XP-earning actions to prevent duplicates
let currentSection = 0;
let ramPrograms = [];
let vmPrograms = { ram: [], disk: [] };
let draggedElement = null;
let bootDraggedElement = null;
let canvas, ctx;
let isDrawing = false;
let selectedExtensionTopic = '';
let fontSize = 16;

// XP requirements per level
const xpPerLevel = [0, 20, 50, 90, 140, 200];

// Define all functions on window object for global access
window.initializeLesson = function() {
    // Set up navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item, index) => {
        item.addEventListener('click', () => navigateToSection(index));
    });

    // Initialize progress dots
    const sectionProgress = document.getElementById('sectionProgress');
    const totalSections = document.querySelectorAll('.section').length;
    for (let i = 0; i < totalSections; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        sectionProgress.appendChild(dot);
    }
}

window.preventPaste = function() {
    document.addEventListener('paste', function(e) {
        e.preventDefault();
        showShameMode();
        return false;
    });

    // Also prevent context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Prevent drag and drop of text
    document.addEventListener('drop', function(e) {
        if (e.dataTransfer.types.includes('text/plain')) {
            e.preventDefault();
            showShameMode();
        }
    });
}

window.showShameMode = function() {
    document.body.classList.add('shame-mode');
    document.getElementById('shameMessage').style.display = 'block';
    
    // Make it permanent by saving to a flag
    localStorage.setItem('shameModeActivated', 'true');
}

window.addXP = function(amount, action) {
    // Check if this action has already earned XP
    if (xpActions.has(action)) {
        return;
    }
    
    xpActions.add(action);
    currentXP += amount;
    
    // Check for level up
    let newLevel = 1;
    for (let i = 1; i < xpPerLevel.length; i++) {
        if (currentXP >= xpPerLevel[i]) {
            newLevel = i;
        }
    }
    
    if (newLevel > currentLevel) {
        currentLevel = newLevel;
        showAchievement('Level Up!', `You've reached Level ${currentLevel}!`);
    }
    
    updateXPDisplay();
}

window.updateXPDisplay = function() {
    const xpFill = document.getElementById('xpFill');
    const xpText = document.getElementById('xpText');
    const levelBadge = document.getElementById('levelBadge');
    
    const currentLevelXP = xpPerLevel[currentLevel];
    const nextLevelXP = xpPerLevel[Math.min(currentLevel + 1, xpPerLevel.length - 1)];
    const progressXP = currentXP - currentLevelXP;
    const neededXP = nextLevelXP - currentLevelXP;
    const percentage = (progressXP / neededXP) * 100;
    
    xpFill.style.width = percentage + '%';
    xpFill.textContent = currentXP + ' XP';
    xpText.textContent = `${currentXP} / ${nextLevelXP} XP`;
    levelBadge.textContent = `Level ${currentLevel}`;
}

window.unlockAchievement = function(achievementId) {
    if (earnedAchievements.has(achievementId)) {
        return;
    }
    
    earnedAchievements.add(achievementId);
    const achievementIcon = document.querySelector(`[data-achievement="${achievementId}"]`);
    if (achievementIcon) {
        achievementIcon.classList.add('unlocked');
    }
    
    const achievements = {
        'starter': { title: 'Quick Starter', description: 'Completed the starter activity!' },
        'memory-master': { title: 'Memory Master', description: 'Mastered memory concepts!' },
        'quiz-champion': { title: 'Quiz Champion', description: 'Scored 100% on a quiz!' },
        'simulator': { title: 'Simulation Expert', description: 'Completed all simulations!' },
        'exam-ready': { title: 'Exam Ready', description: 'Completed practice exam questions!' }
    };
    
    const achievement = achievements[achievementId];
    if (achievement) {
        showAchievement(achievement.title, achievement.description);
        addXP(10, `achievement_${achievementId}`);
    }
}

window.showAchievement = function(title, description) {
    const popup = document.getElementById('achievementPopup');
    document.getElementById('achievementTitle').textContent = title;
    document.getElementById('achievementDescription').textContent = description;
    
    popup.style.display = 'block';
    createParticles();
    
    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000);
}

window.createParticles = function() {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = Math.random() * window.innerHeight + 'px';
        particle.innerHTML = ['⭐', '✨', '🎉', '🎊'][Math.floor(Math.random() * 4)];
        particle.style.setProperty('--dx', (Math.random() - 0.5) * 200 + 'px');
        particle.style.setProperty('--dy', (Math.random() - 0.5) * 200 + 'px');
        particle.style.animation = 'particle-animation 1s ease-out forwards';
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

// Navigation functions
window.navigateToSection = function(index) {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-item');
    const dropdownItems = document.querySelectorAll('.nav-dropdown-item');
    
    sections.forEach(s => s.classList.remove('active'));
    navItems.forEach(n => n.classList.remove('active'));
    dropdownItems.forEach(n => n.classList.remove('active'));
    
    sections[index].classList.add('active');
    navItems[index].classList.add('active');
    dropdownItems[index].classList.add('active');
    currentSection = index;
    
    // Update dropdown button text
    const sectionNames = ['Learning Outcomes', 'Starter Activity', 'Primary Storage', 'RAM Deep Dive', 
                         'ROM Exploration', 'Storage Comparison', 'Virtual Memory', 'Performance',
                         'Real World', 'Common Mistakes', 'Exam Practice', 'Extension', 'Videos'];
    document.getElementById('currentSectionName').textContent = sectionNames[index];
    
    // Close dropdown
    document.getElementById('navDropdownContent').classList.remove('show');
    
    updateSectionProgress();
}

window.toggleNavDropdown = function() {
    const dropdown = document.getElementById('navDropdownContent');
    dropdown.classList.toggle('show');
}

window.nextSection = function() {
    const totalSections = document.querySelectorAll('.section').length;
    if (currentSection < totalSections - 1) {
        completedSections.add(currentSection);
        navigateToSection(currentSection + 1);
    }
}

window.previousSection = function() {
    if (currentSection > 0) {
        navigateToSection(currentSection - 1);
    }
}

window.updateSectionProgress = function() {
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        if (completedSections.has(index)) {
            dot.classList.add('completed');
        }
    });
    
    // Update nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item, index) => {
        if (completedSections.has(index)) {
            item.classList.add('completed');
        }
    });
}

// Starter Activity Functions
window.checkStarterAnswer = function(element, questionId) {
    const options = document.querySelectorAll(`#${questionId} .quiz-option`);
    options.forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
        opt.onclick = null;
    });
    
    element.classList.add('selected');
    const isCorrect = element.getAttribute('data-correct') === 'true';
    
    setTimeout(() => {
        if (isCorrect) {
            element.classList.add('correct');
            addXP(2, `starter_${questionId}`);
        } else {
            element.classList.add('incorrect');
        }
    }, 300);
    
    // Check if all starter questions answered correctly
    checkStarterCompletion();
}

window.checkStarterFill = function(input) {
    const answer = input.value.toLowerCase().trim();
    const correct = answer === 'primary';
    
    if (correct) {
        input.style.color = 'green';
        addXP(2, 'starter_fill');
        checkStarterCompletion();
    }
}

window.checkStarterCompletion = function() {
    const q1Correct = document.querySelector('#starter-q1 .correct');
    const q2Correct = document.querySelector('#starter-q2 .correct');
    const fillCorrect = document.getElementById('starter-fill').value.toLowerCase().trim() === 'primary';
    
    if (q1Correct && q2Correct && fillCorrect) {
        unlockAchievement('starter');
    }
}

window.resetStarterActivity = function() {
    document.querySelectorAll('#starter .quiz-option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
        opt.onclick = function() { checkStarterAnswer(this, this.parentElement.id); };
    });
    document.getElementById('starter-fill').value = '';
    document.getElementById('starter-fill').style.color = '';
}

// Drag and Drop Functions
window.initializeDragAndDrop = function() {
    // Initialize all draggable elements
    document.querySelectorAll('.draggable').forEach(draggable => {
        draggable.addEventListener('dragstart', handleDragStart);
        draggable.addEventListener('dragend', handleDragEnd);
    });
    
    // Initialize all drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragleave', handleDragLeave);
    });
    
    // Initialize boot sequence items
    const bootItems = document.querySelectorAll('.boot-sequence-item');
    bootItems.forEach(item => {
        item.addEventListener('dragstart', handleBootDragStart);
        item.addEventListener('dragend', handleBootDragEnd);
        item.addEventListener('dragover', handleBootDragOver);
        item.addEventListener('drop', handleBootDrop);
        item.addEventListener('dragleave', handleBootDragLeave);
        item.addEventListener('dragenter', e => e.preventDefault());
    });
}

window.handleDragStart = function(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

window.handleDragEnd = function(e) {
    e.target.classList.remove('dragging');
}

window.handleDragOver = function(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    e.target.classList.add('drag-over');
    return false;
}

window.handleDragLeave = function(e) {
    e.target.classList.remove('drag-over');
}

window.handleDrop = function(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    e.preventDefault();
    
    e.target.classList.remove('drag-over');
    
    if (draggedElement && e.target.classList.contains('drop-zone')) {
        const answer = draggedElement.getAttribute('data-answer');
        const dropType = e.target.getAttribute('data-type');
        const matchType = e.target.getAttribute('data-match');
        
        if (answer && dropType) {
            // Primary/Secondary storage activity
            if (answer === dropType) {
                e.target.appendChild(draggedElement);
                e.target.classList.add('correct');
                addXP(2, `drag_drop_${answer}_${draggedElement.textContent}`);
            } else {
                e.target.classList.add('incorrect');
                setTimeout(() => e.target.classList.remove('incorrect'), 1000);
            }
        } else if (matchType) {
            // Performance matching activity
            const dragMatch = draggedElement.getAttribute('data-match');
            if (dragMatch === matchType) {
                e.target.appendChild(draggedElement);
                e.target.classList.add('correct');
                addXP(2, `performance_match_${matchType}`);
            } else {
                e.target.classList.add('incorrect');
                setTimeout(() => e.target.classList.remove('incorrect'), 1000);
            }
        }
    }
    
    return false;
}

// Boot sequence drag and drop handlers
window.handleBootDragStart = function(e) {
    bootDraggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

window.handleBootDragEnd = function(e) {
    e.target.classList.remove('dragging');
    const items = document.querySelectorAll('.boot-sequence-item');
    items.forEach(item => item.classList.remove('over'));
}

window.handleBootDragOver = function(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    
    const afterElement = getDragAfterElement(document.getElementById('boot-sequence'), e.clientY);
    const dragging = document.querySelector('.dragging');
    
    if (afterElement == null) {
        document.getElementById('boot-sequence').appendChild(dragging);
    } else {
        document.getElementById('boot-sequence').insertBefore(dragging, afterElement);
    }
    
    e.target.classList.add('over');
    return false;
}

window.handleBootDragLeave = function(e) {
    e.target.classList.remove('over');
}

window.handleBootDrop = function(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    e.preventDefault();
    e.target.classList.remove('over');
    return false;
}

window.getDragAfterElement = function(container, y) {
    const draggableElements = [...container.querySelectorAll('.boot-sequence-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

window.resetDragDrop = function() {
    const container = document.getElementById('characteristics-container');
    const draggables = document.querySelectorAll('#primary-drop .draggable, #secondary-drop .draggable');
    
    draggables.forEach(draggable => {
        container.appendChild(draggable);
    });
    
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('correct', 'incorrect');
    });
}

// RAM Simulation Functions
window.initializeRAMGrid = function() {
    const grid = document.getElementById('ram-grid');
    if (!grid) return;
    
    grid.innerHTML = ''; // Clear existing cells
    for (let i = 0; i < 8; i++) {
        const cell = document.createElement('div');
        cell.className = 'memory-cell';
        cell.setAttribute('data-gb', i);
        cell.textContent = 'Free';
        cell.title = `Memory Block ${i + 1} (1GB)`;
        grid.appendChild(cell);
    }
}

window.loadProgram = function(name, size) {
    const totalRAM = 8;
    const usedRAM = ramPrograms.reduce((sum, prog) => sum + prog.size, 0);
    
    if (usedRAM + size > totalRAM) {
        alert(`Not enough RAM! ${name} needs ${size}GB but only ${totalRAM - usedRAM}GB free.`);
        addXP(3, 'ram_overflow_discovered');
        
        // Visual feedback for overflow
        const cells = document.querySelectorAll('#ram-grid .memory-cell');
        cells.forEach((cell, index) => {
            setTimeout(() => {
                cell.style.animation = 'shake 0.5s';
            }, index * 30);
        });
        
        setTimeout(() => {
            cells.forEach(cell => {
                cell.style.animation = '';
            });
        }, 1000);
        
        return;
    }
    
    ramPrograms.push({ name, size });
    
    // Animate the loading
    const cells = document.querySelectorAll('#ram-grid .memory-cell');
    const startIndex = usedRAM;
    
    for (let i = 0; i < size && startIndex + i < cells.length; i++) {
        setTimeout(() => {
            cells[startIndex + i].style.animation = 'pulse 0.5s ease';
        }, i * 100);
    }
    
    setTimeout(() => {
        updateRAMDisplay();
    }, size * 100);
    
    addXP(2, `ram_load_${name}`);
}

window.updateRAMDisplay = function() {
    const cells = document.querySelectorAll('#ram-grid .memory-cell');
    let cellIndex = 0;
    
    // Clear all cells
    cells.forEach(cell => {
        cell.textContent = 'Free';
        cell.classList.remove('active');
        cell.style.background = '#333';
        cell.style.color = 'white';
    });
    
    // Fill cells with programs
    const colors = {
        'Browser': '#3498db',
        'Game': '#e74c3c',
        'Video Editor': '#9b59b6',
        'Music Player': '#f39c12'
    };
    
    ramPrograms.forEach(program => {
        for (let i = 0; i < program.size && cellIndex < cells.length; i++) {
            cells[cellIndex].textContent = program.name;
            cells[cellIndex].classList.add('active');
            cells[cellIndex].style.background = colors[program.name] || '#2ecc71';
            cells[cellIndex].style.color = 'white';
            cellIndex++;
        }
    });
    
    const usedRAM = ramPrograms.reduce((sum, prog) => sum + prog.size, 0);
    const freeRAM = 8 - usedRAM;
    const percentage = (usedRAM / 8) * 100;
    
    document.getElementById('ram-used').textContent = usedRAM;
    
    // Update free RAM if element exists
    const freeElement = document.getElementById('ram-free');
    if (freeElement) {
        freeElement.textContent = freeRAM;
    }
    
    // Update percentage if element exists
    const percentageElement = document.getElementById('ram-percentage');
    if (percentageElement) {
        percentageElement.textContent = Math.round(percentage) + '%';
    }
    
    // Update bar fill if element exists
    const barFillElement = document.getElementById('ram-bar-fill');
    if (barFillElement) {
        barFillElement.style.width = percentage + '%';
        
        // Update bar color based on usage
        if (percentage > 75) {
            barFillElement.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)';
        } else if (percentage > 50) {
            barFillElement.style.background = 'linear-gradient(to right, #f39c12, #d68910)';
        } else {
            barFillElement.style.background = 'linear-gradient(to right, #2ecc71, #27ae60)';
        }
    }
    
    // Update loaded programs list if element exists
    const loadedList = document.getElementById('loaded-programs-list');
    if (loadedList) {
        loadedList.innerHTML = '';
        ramPrograms.forEach(program => {
            const item = document.createElement('div');
            item.className = 'loaded-program-item';
            item.style.animation = 'fadeIn 0.3s ease';
            item.innerHTML = `
                <span>${program.name}</span>
                <span>${program.size}GB</span>
            `;
            loadedList.appendChild(item);
        });
    }
}

window.clearRAM = function() {
    // Animate clearing
    const cells = document.querySelectorAll('#ram-grid .memory-cell.active');
    cells.forEach((cell, index) => {
        setTimeout(() => {
            cell.classList.remove('active');
            cell.textContent = 'Free';
            cell.style.background = '#333';
            cell.style.animation = 'fadeOut 0.3s ease';
        }, index * 50);
    });
    
    setTimeout(() => {
        ramPrograms = [];
        updateRAMDisplay();
        
        // Clear any remaining animations
        const allCells = document.querySelectorAll('#ram-grid .memory-cell');
        allCells.forEach(cell => {
            cell.style.animation = '';
        });
    }, cells.length * 50 + 300);
}

window.checkRAMReflection = function() {
    const reflection = document.getElementById('ram-reflection').value.trim();
    const keywords = ['full', 'not enough', 'overflow', 'error', 'warning'];
    
    if (reflection.length > 50) {
        const hasKeyword = keywords.some(keyword => 
            reflection.toLowerCase().includes(keyword)
        );
        
        if (hasKeyword) {
            addXP(5, 'ram_reflection');
            alert('Great observation! When RAM is full, programs cannot be loaded.');
        } else {
            alert('Good effort! Try to mention what happens when RAM becomes full.');
        }
    } else {
        alert('Please write a more detailed reflection.');
    }
}

// Fill in the blank functions
window.checkFillBlank = function(input) {
    const answers = input.getAttribute('data-answer').split(',');
    const userAnswer = input.value.toLowerCase().trim();
    
    const correct = answers.some(answer => {
        const cleanAnswer = answer.toLowerCase().trim();
        return userAnswer === cleanAnswer || 
               (userAnswer.length > 3 && cleanAnswer.includes(userAnswer));
    });
    
    if (correct) {
        input.style.color = 'green';
        input.style.borderBottomColor = 'green';
        addXP(2, `fill_blank_${input.id || Math.random()}`);
    } else if (userAnswer.length > 2) {
        input.style.color = 'red';
        input.style.borderBottomColor = 'red';
    }
}

// ROM Functions
window.checkBootSequence = function() {
    const items = document.querySelectorAll('#boot-sequence .boot-sequence-item');
    let correct = true;
    let currentOrder = 1;
    
    items.forEach(item => {
        const expectedOrder = parseInt(item.getAttribute('data-order'));
        if (expectedOrder !== currentOrder) {
            correct = false;
        }
        currentOrder++;
    });
    
    if (correct) {
        alert('Perfect! You understand the boot sequence!');
        addXP(5, 'boot_sequence_correct');
        
        // Add visual feedback
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.background = '#2ecc71';
                item.style.borderColor = '#27ae60';
            }, index * 100);
        });
    } else {
        alert('Not quite right. Think about what needs to happen first when a computer starts.');
        
        // Add visual feedback
        items.forEach(item => {
            item.style.animation = 'shake 0.5s';
        });
        setTimeout(() => {
            items.forEach(item => {
                item.style.animation = '';
            });
        }, 500);
    }
}

window.resetBootSequence = function() {
    const container = document.getElementById('boot-sequence');
    const items = Array.from(container.children);
    
    // Reset visual styles
    items.forEach(item => {
        item.style.background = '';
        item.style.borderColor = '';
    });
    
    // Shuffle the items
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        container.appendChild(items[j]);
    }
}

window.checkROMImportance = function() {
    const answer = document.getElementById('rom-importance').value.trim();
    const keywords = ['boot', 'start', 'power', 'BIOS', 'permanent', 'instructions'];
    
    if (answer.length > 30) {
        const keywordCount = keywords.filter(keyword => 
            answer.toLowerCase().includes(keyword)
        ).length;
        
        if (keywordCount >= 2) {
            addXP(5, 'rom_importance');
            alert('Excellent! You understand why ROM needs to be non-volatile.');
        } else if (keywordCount >= 1) {
            alert('Good start! Think about what happens when the computer is turned on.');
        } else {
            alert('Try mentioning boot instructions or BIOS in your answer.');
        }
    } else {
        alert('Please provide a more detailed answer.');
    }
}

// Storage Comparison Functions
window.checkComparison = function() {
    const correct = {
        'ram-volatile': 'yes',
        'rom-volatile': 'no',
        'secondary-volatile': 'no',
        'ram-writable': 'yes',
        'rom-writable': 'no',
        'secondary-writable': 'yes',
        'ram-speed': 'fast',
        'rom-speed': 'fast',
        'secondary-speed': 'slow'
    };
    
    let allCorrect = true;
    let correctCount = 0;
    
    Object.keys(correct).forEach(id => {
        const select = document.getElementById(id);
        if (select.value === correct[id]) {
            select.style.borderColor = 'green';
            correctCount++;
        } else if (select.value !== '') {
            select.style.borderColor = 'red';
            allCorrect = false;
        }
    });
    
    const feedback = document.getElementById('comparison-feedback');
    if (allCorrect && correctCount === 9) {
        feedback.innerHTML = '<p style="color: green;">Perfect! You understand the differences between storage types!</p>';
        addXP(10, 'comparison_complete');
        unlockAchievement('memory-master');
    } else if (correctCount >= 6) {
        feedback.innerHTML = '<p style="color: orange;">Good progress! Check the incorrect answers.</p>';
    }
}

window.resetComparison = function() {
    const selects = document.querySelectorAll('#comparison select');
    selects.forEach(select => {
        select.value = '';
        select.style.borderColor = '';
    });
    document.getElementById('comparison-feedback').innerHTML = '';
}

// Virtual Memory Simulation
window.initializeVMSimulation = function() {
    const ramGrid = document.getElementById('vm-ram');
    const diskGrid = document.getElementById('vm-disk');
    
    if (ramGrid) {
        ramGrid.innerHTML = ''; // Clear existing cells
        for (let i = 0; i < 4; i++) {
            const cell = document.createElement('div');
            cell.className = 'memory-cell';
            cell.textContent = 'Free';
            cell.title = `RAM Block ${i + 1} (1GB)`;
            ramGrid.appendChild(cell);
        }
    }
    
    if (diskGrid) {
        diskGrid.innerHTML = ''; // Clear existing cells
        for (let i = 0; i < 8; i++) {
            const cell = document.createElement('div');
            cell.className = 'memory-cell';
            cell.textContent = 'Free';
            cell.title = `Virtual Memory Block ${i + 1} (1GB)`;
            diskGrid.appendChild(cell);
        }
    }
}

window.vmLoadProgram = function(name, size) {
    const ramCapacity = 4;
    const ramUsed = vmPrograms.ram.reduce((sum, prog) => sum + prog.size, 0);
    const diskUsed = vmPrograms.disk.reduce((sum, prog) => sum + prog.size, 0);
    
    if (ramUsed + size <= ramCapacity) {
        // Fits in RAM
        vmPrograms.ram.push({ name, size });
        
        // Animate RAM loading
        const cells = document.querySelectorAll('#vm-ram .memory-cell');
        const startIndex = ramUsed;
        
        for (let i = 0; i < size && startIndex + i < cells.length; i++) {
            setTimeout(() => {
                cells[startIndex + i].style.animation = 'pulse 0.5s ease';
            }, i * 100);
        }
        
        setTimeout(() => {
            updateVMDisplay();
            updateVMPerformance();
        }, size * 100);
    } else {
        // Need to use virtual memory
        const ramSpace = ramCapacity - ramUsed;
        const diskSpace = size - ramSpace;
        
        if (ramSpace > 0) {
            vmPrograms.ram.push({ name: name, size: ramSpace });
        }
        vmPrograms.disk.push({ name: name + ' (VM)', size: diskSpace });
        
        // Animate swapping
        const arrow = document.querySelector('.vm-arrow');
        if (arrow) {
            arrow.style.color = '#e74c3c';
            arrow.style.fontSize = '30px';
            setTimeout(() => {
                arrow.style.color = '';
                arrow.style.fontSize = '';
            }, 1000);
        }
        
        // Animate disk loading
        const diskCells = document.querySelectorAll('#vm-disk .memory-cell');
        const diskStartIndex = diskUsed;
        
        for (let i = 0; i < diskSpace && diskStartIndex + i < diskCells.length; i++) {
            setTimeout(() => {
                diskCells[diskStartIndex + i].style.animation = 'pulse 0.5s ease';
            }, i * 100 + 500);
        }
        
        setTimeout(() => {
            updateVMDisplay();
            updateVMPerformance();
        }, (diskSpace * 100) + 600);
        
        addXP(5, 'vm_swapping_observed');
    }
}

window.updateVMDisplay = function() {
    // Update RAM display
    const ramCells = document.querySelectorAll('#vm-ram .memory-cell');
    let ramIndex = 0;
    ramCells.forEach(cell => {
        cell.textContent = 'Free';
        cell.classList.remove('active');
        cell.style.background = '#333';
        cell.style.color = 'white';
    });
    
    const colors = {
        'Chrome': '#4285f4',
        'Photoshop': '#31a8ff',
        'Game': '#e74c3c',
        'VS Code': '#007acc'
    };
    
    vmPrograms.ram.forEach(program => {
        for (let i = 0; i < program.size && ramIndex < ramCells.length; i++) {
            ramCells[ramIndex].textContent = program.name;
            ramCells[ramIndex].classList.add('active');
            ramCells[ramIndex].style.background = colors[program.name.replace(' (VM)', '')] || '#2ecc71';
            ramCells[ramIndex].style.color = 'white';
            ramIndex++;
        }
    });
    
    // Update disk display
    const diskCells = document.querySelectorAll('#vm-disk .memory-cell');
    let diskIndex = 0;
    diskCells.forEach(cell => {
        cell.textContent = 'Free';
        cell.classList.remove('active');
        cell.style.background = '#333';
        cell.style.color = 'white';
        cell.style.opacity = '1';
    });
    
    vmPrograms.disk.forEach(program => {
        for (let i = 0; i < program.size && diskIndex < diskCells.length; i++) {
            diskCells[diskIndex].textContent = program.name;
            diskCells[diskIndex].classList.add('active');
            diskCells[diskIndex].style.background = '#e74c3c';
            diskCells[diskIndex].style.opacity = '0.7';
            diskCells[diskIndex].style.color = 'white';
            diskIndex++;
        }
    });
    
    const ramUsed = vmPrograms.ram.reduce((sum, prog) => sum + prog.size, 0);
    const diskUsed = vmPrograms.disk.reduce((sum, prog) => sum + prog.size, 0);
    const ramPercentage = (ramUsed / 4) * 100;
    const diskPercentage = diskUsed > 0 ? (diskUsed / 8) * 100 : 0;
    
    document.getElementById('vm-ram-used').textContent = ramUsed;
    document.getElementById('vm-disk-used').textContent = diskUsed;
    
    // Update percentages if elements exist
    const ramPercentElement = document.getElementById('vm-ram-percentage');
    if (ramPercentElement) {
        ramPercentElement.textContent = Math.round(ramPercentage) + '%';
    }
    
    const diskPercentElement = document.getElementById('vm-disk-percentage');
    if (diskPercentElement) {
        diskPercentElement.textContent = Math.round(diskPercentage) + '%';
    }
    
    // Update bar fills if elements exist
    const ramBarFill = document.getElementById('vm-ram-bar-fill');
    if (ramBarFill) {
        ramBarFill.style.width = ramPercentage + '%';
        
        // Update RAM bar color
        if (ramPercentage === 100) {
            ramBarFill.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)';
        } else if (ramPercentage > 75) {
            ramBarFill.style.background = 'linear-gradient(to right, #f39c12, #d68910)';
        } else {
            ramBarFill.style.background = 'linear-gradient(to right, #2ecc71, #27ae60)';
        }
    }
    
    const diskBarFill = document.getElementById('vm-disk-bar-fill');
    if (diskBarFill) {
        diskBarFill.style.width = diskPercentage + '%';
    }
}

window.updateVMPerformance = function() {
    const diskUsed = vmPrograms.disk.reduce((sum, prog) => sum + prog.size, 0);
    const performanceElement = document.getElementById('vm-performance');
    const performanceBarFill = document.getElementById('performance-bar-fill');
    
    if (diskUsed === 0) {
        performanceElement.textContent = 'System running smoothly';
        performanceElement.style.color = '#2ecc71';
        if (performanceBarFill) {
            performanceBarFill.style.width = '100%';
            performanceBarFill.style.background = 'linear-gradient(to right, #2ecc71, #27ae60)';
        }
    } else if (diskUsed <= 2) {
        performanceElement.textContent = 'Some slowdown due to virtual memory use';
        performanceElement.style.color = '#f39c12';
        if (performanceBarFill) {
            performanceBarFill.style.width = '60%';
            performanceBarFill.style.background = 'linear-gradient(to right, #f39c12, #d68910)';
        }
    } else {
        performanceElement.textContent = 'Significant performance impact - thrashing may occur!';
        performanceElement.style.color = '#e74c3c';
        if (performanceBarFill) {
            performanceBarFill.style.width = '30%';
            performanceBarFill.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)';
        }
        unlockAchievement('simulator');
    }
}

window.clearVM = function() {
    // Animate clearing
    const ramCells = document.querySelectorAll('#vm-ram .memory-cell.active');
    const diskCells = document.querySelectorAll('#vm-disk .memory-cell.active');
    
    ramCells.forEach((cell, index) => {
        setTimeout(() => {
            cell.classList.remove('active');
            cell.textContent = 'Free';
            cell.style.background = '#333';
            cell.style.animation = 'fadeOut 0.3s ease';
        }, index * 50);
    });
    
    diskCells.forEach((cell, index) => {
        setTimeout(() => {
            cell.classList.remove('active');
            cell.textContent = 'Free';
            cell.style.background = '#333';
            cell.style.opacity = '1';
            cell.style.animation = 'fadeOut 0.3s ease';
        }, (ramCells.length + index) * 50);
    });
    
    setTimeout(() => {
        vmPrograms = { ram: [], disk: [] };
        updateVMDisplay();
        updateVMPerformance();
        
        // Clear any remaining animations
        const allCells = document.querySelectorAll('#vm-ram .memory-cell, #vm-disk .memory-cell');
        allCells.forEach(cell => {
            cell.style.animation = '';
        });
    }, (ramCells.length + diskCells.length) * 50 + 300);
}

window.checkDefinition = function(inputId, term) {
    const input = document.getElementById(inputId);
    const answer = input.value.toLowerCase().trim();
    
    const definitions = {
        'swapping': ['moving', 'transfer', 'ram to disk', 'virtual memory', 'process'],
        'thrashing': ['constant', 'excessive', 'swap', 'slow', 'performance']
    };
    
    const keywords = definitions[term];
    const matchCount = keywords.filter(keyword => answer.includes(keyword)).length;
    
    if (matchCount >= 2) {
        input.style.borderColor = 'green';
        addXP(3, `definition_${term}`);
        alert('Correct! Good understanding of the term.');
    } else if (matchCount >= 1) {
        input.style.borderColor = 'orange';
        alert('Partial understanding. Try to be more specific.');
    } else {
        input.style.borderColor = 'red';
        alert('Not quite. Think about what happens with memory management.');
    }
}

// Performance Section Functions
window.resetPerformanceMatch = function() {
    const upgradesList = document.getElementById('upgrades-list');
    const draggables = document.querySelectorAll('#performance .drop-zone .draggable');
    
    draggables.forEach(draggable => {
        upgradesList.appendChild(draggable);
    });
    
    document.querySelectorAll('#performance .drop-zone').forEach(zone => {
        zone.classList.remove('correct');
    });
}

// Drawing Canvas Functions
window.initializeCanvas = function() {
    canvas = document.getElementById('drawingCanvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
}

window.startDrawing = function(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

window.draw = function(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
}

window.stopDrawing = function() {
    isDrawing = false;
}

window.handleTouch = function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                    e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

window.showDrawingCanvas = function() {
    document.getElementById('canvasContainer').style.display = 'block';
    addXP(2, 'canvas_opened');
}

window.hideDrawingCanvas = function() {
    document.getElementById('canvasContainer').style.display = 'none';
}

window.clearCanvas = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.checkVMCalculation = function() {
    const answer = parseFloat(document.getElementById('vm-calculation').value);
    if (answer === 2) {
        alert('Correct! 6GB needed - 4GB RAM = 2GB virtual memory required.');
        addXP(5, 'vm_calculation');
    } else {
        alert('Not quite. Remember: Virtual Memory = Total Needed - Available RAM');
    }
}

// Real World Section Functions
window.checkScenarioAnswer = function() {
    const answer = document.getElementById('scenario-answer').value.trim();
    const keywords = ['RAM', 'memory', '16GB', '32GB', 'upgrade', 'SSD', 'virtual'];
    
    if (answer.length > 50) {
        const keywordCount = keywords.filter(keyword => 
            answer.toLowerCase().includes(keyword.toLowerCase())
        ).length;
        
        if (keywordCount >= 3) {
            alert('Excellent recommendation! You considered the specific needs of video editing.');
            addXP(8, 'scenario_analysis');
        } else if (keywordCount >= 2) {
            alert('Good analysis! Consider mentioning specific RAM amounts for 4K video editing.');
        } else {
            alert('Think about what uses the most resources when editing video.');
        }
    } else {
        alert('Please provide a more detailed recommendation.');
    }
}

// Common Mistakes Functions
window.checkMistakeQuiz = function(element, isCorrect) {
    const options = element.parentElement.querySelectorAll('.quiz-option');
    options.forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
        opt.onclick = null;
    });
    
    element.classList.add('selected');
    
    setTimeout(() => {
        if (isCorrect) {
            element.classList.add('correct');
            addXP(5, 'mistakes_quiz');
        } else {
            element.classList.add('incorrect');
        }
    }, 300);
}

// Exam Questions Functions
window.showMarkScheme = function(questionId, marks) {
    const textarea = document.getElementById(questionId);
    const marksInput = document.getElementById(`${questionId}-marks`);
    const scheme = document.getElementById(`${questionId}-scheme`);
    
    const answer = textarea.value.trim();
    const predictedMarks = parseInt(marksInput.value) || 0;
    
    // Check minimum answer length based on marks
    const minLength = marks * 30; // Rough estimate: 30 chars per mark
    
    if (answer.length < minLength) {
        alert("You haven't written enough for this question. Try to expand your answer.");
        return;
    }
    
    if (predictedMarks < 0 || predictedMarks > marks) {
        alert(`Please enter a valid predicted mark between 0 and ${marks}.`);
        return;
    }
    
    scheme.classList.add('visible');
    
    // Award XP based on attempting the question
    addXP(marks * 2, `exam_${questionId}`);
    
    // Check if all exam questions attempted
    const allAttempted = ['exam-q1', 'exam-q2', 'exam-q3', 'exam-q4'].every(q => {
        return document.getElementById(q).value.trim().length > 50;
    });
    
    if (allAttempted) {
        unlockAchievement('exam-ready');
    }
}

// Extension Activities Functions
window.selectExtensionTopic = function(element, topic) {
    document.querySelectorAll('#extension .quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
    selectedExtensionTopic = topic;
    addXP(2, `extension_topic_${topic}`);
}

window.submitExtension = function() {
    const hierarchy = document.getElementById('extension-hierarchy').value.trim();
    const cache = document.getElementById('extension-cache').value.trim();
    const future = document.getElementById('extension-future').value.trim();
    
    let totalScore = 0;
    
    if (hierarchy.length > 100) {
        totalScore += 5;
        alert('Great work on the memory hierarchy!');
    }
    
    if (cache.length > 100) {
        totalScore += 5;
        alert('Excellent research on cache memory!');
    }
    
    if (future.length > 100 && selectedExtensionTopic) {
        totalScore += 5;
        alert(`Fascinating insights on ${selectedExtensionTopic}!`);
    }
    
    if (totalScore > 0) {
        addXP(totalScore, 'extension_activities');
    }
}

// Video Section Functions
window.saveVideoNotes = function() {
    const notes = document.getElementById('video-notes').value.trim();
    if (notes.length > 20) {
        addXP(3, 'video_notes');
        alert('Notes saved! Great job engaging with the video content.');
    } else {
        alert('Please write more detailed notes about what you learned.');
    }
}

window.finishLesson = function() {
    completedSections.add(currentSection);
    updateSectionProgress();
    
    // Calculate completion percentage
    const totalSections = document.querySelectorAll('.section').length;
    const completionPercentage = (completedSections.size / totalSections) * 100;
    
    if (completionPercentage >= 90) {
        showAchievement('Lesson Complete!', `You've completed ${Math.round(completionPercentage)}% of the lesson!`);
        addXP(20, 'lesson_complete');
    }
    
    // Show summary
    alert(`
        🎉 Congratulations! 🎉
        
        You've reached the end of the lesson!
        
        Final Stats:
        - Level: ${currentLevel}
        - XP: ${currentXP}
        - Sections Completed: ${completedSections.size}/${totalSections}
        - Achievements: ${earnedAchievements.size}/5
        
        Great work on learning about Primary and Secondary Storage!
    `);
}

// Accessibility Functions
window.initializeAccessibility = function() {
    // Add ARIA labels
    document.querySelectorAll('.draggable').forEach(el => {
        el.setAttribute('role', 'button');
        el.setAttribute('aria-grabbed', 'false');
    });
    
    document.querySelectorAll('.drop-zone').forEach(el => {
        el.setAttribute('role', 'region');
        el.setAttribute('aria-dropeffect', 'move');
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

window.handleKeyboardNavigation = function(e) {
    if (e.key === 'Tab') {
        // Allow default tab behavior
        return;
    }
    
    if (e.key === 'ArrowRight' && e.ctrlKey) {
        nextSection();
    } else if (e.key === 'ArrowLeft' && e.ctrlKey) {
        previousSection();
    }
}

window.adjustFontSize = function(change) {
    fontSize += change;
    fontSize = Math.max(12, Math.min(24, fontSize));
    document.body.style.fontSize = fontSize + 'px';
    addXP(1, 'accessibility_font_adjusted');
}

window.toggleHighContrast = function() {
    document.body.classList.toggle('high-contrast');
    const icon = document.getElementById('contrastIcon');
    icon.textContent = document.body.classList.contains('high-contrast') ? '☀️' : '🌓';
    addXP(1, 'accessibility_contrast_toggled');
}

window.toggleDyslexiaFont = function() {
    document.body.classList.toggle('dyslexia-font');
    addXP(1, 'accessibility_dyslexia_font_toggled');
}

// Vibration for mobile (haptic feedback)
window.vibrate = function(duration = 50) {
    if ('vibrate' in navigator) {
        navigator.vibrate(duration);
    }
}

// Add haptic feedback to correct answers
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('correct')) {
        vibrate(100);
    }
});

// Check if shame mode was previously activated
if (localStorage.getItem('shameModeActivated') === 'true') {
    showShameMode();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeLesson();
    preventPaste();
    initializeDragAndDrop();
    initializeAccessibility();
    initializeCanvas();
    initializeRAMGrid();
    initializeVMSimulation();
    updateSectionProgress();
    resetBootSequence(); // Shuffle boot sequence on load
    
    // Initialize VM performance display
    updateVMPerformance();
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-dropdown')) {
            const dropdown = document.getElementById('navDropdownContent');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        }
    });
});