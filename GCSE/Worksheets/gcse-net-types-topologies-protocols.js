// Network Protocols Interactive Worksheet
// Features comprehensive randomization:
// - All multiple choice options are shuffled
// - Fill-in-the-blank dropdowns have randomized options with distractors
// - Drag-and-drop items appear in random order
// - True/False questions are randomly selected and ordered
// - Summary quiz questions and options are fully randomized
// - Reset buttons re-randomize all activities

// Global state
let state = {
    xp: 0,
    level: 0,
    achievements: [],
    currentSection: 0,
    completedTasks: new Set(),
    hintUsage: new Set(),
    summaryQuizAnswers: {},
    oddOneOutSelections: {},
    drawingData: []
};

// XP thresholds for levels
const levelThresholds = [0, 50, 120, 200, 300, 420];

// Achievements
const achievements = {
    firstStep: { name: "First Steps", desc: "Complete your first task", icon: "👣" },
    protocolMaster: { name: "Protocol Master", desc: "Complete all protocol matching", icon: "🎯" },
    simulationExpert: { name: "Simulation Expert", desc: "Run all simulations", icon: "🔬" },
    quizWhiz: { name: "Quiz Whiz", desc: "Score 80% or higher on summary quiz", icon: "🧠" },
    examReady: { name: "Exam Ready", desc: "Complete all practice questions", icon: "📝" },
    extensionExplorer: { name: "Extension Explorer", desc: "Complete extension activities", icon: "🚀" },
    perfectionist: { name: "Perfectionist", desc: "Complete a section without hints", icon: "💎" },
    speedRunner: { name: "Speed Runner", desc: "Complete 3 tasks in 5 minutes", icon: "⚡" }
};

// Global variables
let draggedElement = null;
let touchItem = null;
let touchOffset = {x: 0, y: 0};
let trueFalseAnswers = {};
let clientFiles = ['document.txt', 'image.jpg'];
let serverFiles = ['data.csv', 'backup.zip'];
let taskTimestamps = [];

// Utility function to shuffle array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Randomization Functions
function randomizeStarterActivity() {
    const protocolsContainer = document.getElementById('starterProtocols');
    const descriptionsContainer = document.getElementById('starterDescriptions');
    
    if (!protocolsContainer || !descriptionsContainer) return;
    
    const protocols = [
        {protocol: "HTTP", text: "HTTP"},
        {protocol: "HTTPS", text: "HTTPS"},
        {protocol: "TCP", text: "TCP"},
        {protocol: "IP", text: "IP"},
        {protocol: "POP", text: "POP"},
        {protocol: "IMAP", text: "IMAP"},
        {protocol: "FTP", text: "FTP"},
        {protocol: "SMTP", text: "SMTP"}
    ];
    
    const descriptions = [
        {answer: "HTTP", text: "Insecure protocol for web pages"},
        {answer: "HTTPS", text: "Secure protocol using encryption"},
        {answer: "TCP", text: "Sets up reliable connections"},
        {answer: "IP", text: "Routes packets around networks"},
        {answer: "POP", text: "Downloads and deletes emails"},
        {answer: "IMAP", text: "Accesses emails without deletion"},
        {answer: "FTP", text: "Transfers files to/from servers"},
        {answer: "SMTP", text: "Sends emails"}
    ];
    
    const shuffledProtocols = shuffleArray(protocols);
    const shuffledDescriptions = shuffleArray(descriptions);
    
    protocolsContainer.innerHTML = '';
    shuffledProtocols.forEach(item => {
        const div = document.createElement('div');
        div.className = 'draggable';
        div.draggable = true;
        div.setAttribute('data-protocol', item.protocol);
        div.textContent = item.text;
        protocolsContainer.appendChild(div);
    });
    
    descriptionsContainer.innerHTML = '';
    shuffledDescriptions.forEach(item => {
        const div = document.createElement('div');
        div.className = 'drop-zone';
        div.setAttribute('data-answer', item.answer);
        div.textContent = item.text;
        descriptionsContainer.appendChild(div);
    });
}

function randomizeEmailFeatures() {
    const featuresContainer = document.getElementById('emailFeatures');
    if (!featuresContainer) return;
    
    const features = [
        {category: "POP", text: "Deletes emails after download"},
        {category: "IMAP", text: "Synchronizes across devices"},
        {category: "SMTP", text: "Sends emails"},
        {category: "POP", text: "Downloads to one device"},
        {category: "IMAP", text: "Keeps emails on server"},
        {category: "SMTP", text: "Uses port 25"},
        {category: "IMAP", text: "Allows folder management"},
        {category: "POP", text: "Simple protocol"},
        {category: "SMTP", text: "Forwards emails"},
        {category: "IMAP", text: "Supports multiple folders"}
    ];
    
    const shuffled = shuffleArray(features);
    
    featuresContainer.innerHTML = '';
    shuffled.slice(0, 8).forEach(item => {
        const div = document.createElement('div');
        div.className = 'draggable';
        div.draggable = true;
        div.setAttribute('data-category', item.category);
        div.textContent = item.text;
        featuresContainer.appendChild(div);
    });
}

function randomizeFillInBlanks() {
    const blank1Options = [
        {value: "wrong1", text: "Hyper Text Markup Language"},
        {value: "correct", text: "Hypertext Transfer Protocol"},
        {value: "wrong2", text: "High Tech Transfer Process"},
        {value: "wrong3", text: "Host Terminal Transfer Protocol"},
        {value: "wrong4", text: "Home Transfer Protocol"},
        {value: "wrong5", text: "Hyper Transfer Process"}
    ];
    
    const blank2Options = [
        {value: "wrong1", text: "emails"},
        {value: "wrong2", text: "files"},
        {value: "correct", text: "web pages"},
        {value: "wrong3", text: "packets"},
        {value: "wrong4", text: "messages"},
        {value: "wrong5", text: "documents"}
    ];
    
    const blank3Options = [
        {value: "correct", text: "secure"},
        {value: "wrong1", text: "slower"},
        {value: "wrong2", text: "older"},
        {value: "wrong3", text: "simpler"},
        {value: "wrong4", text: "faster"},
        {value: "wrong5", text: "newer"}
    ];
    
    const blank4Options = [
        {value: "wrong1", text: "compression"},
        {value: "correct", text: "encryption"},
        {value: "wrong2", text: "conversion"},
        {value: "wrong3", text: "connection"},
        {value: "wrong4", text: "protection"},
        {value: "wrong5", text: "translation"}
    ];
    
    populateDropdown('blank1', shuffleArray(blank1Options));
    populateDropdown('blank2', shuffleArray(blank2Options));
    populateDropdown('blank3', shuffleArray(blank3Options));
    populateDropdown('blank4', shuffleArray(blank4Options));
}

function populateDropdown(id, options) {
    const select = document.getElementById(id);
    if (!select) return;
    
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        select.appendChild(option);
    });
}

function randomizeTrueFalse() {
    const container = document.getElementById('trueFalseQuestions');
    if (!container) return;
    
    const questions = [
        {id: 'tf1', text: "HTTP is considered secure for transmitting sensitive information like passwords.", answer: false},
        {id: 'tf2', text: "HTTPS uses SSL/TLS to encrypt data.", answer: true},
        {id: 'tf3', text: "HTTP stands for Hypertext Transfer Process.", answer: false},
        {id: 'tf4', text: "HTTPS is slower than HTTP due to encryption overhead.", answer: true},
        {id: 'tf5', text: "All websites should use HTTPS for better security.", answer: true}
    ];
    
    const shuffled = shuffleArray(questions).slice(0, 3);
    
    trueFalseAnswers = {};
    shuffled.forEach(q => {
        trueFalseAnswers[q.id] = q.answer;
    });
    
    container.innerHTML = shuffled.map((q, index) => {
        const trueFirst = Math.random() < 0.5;
        const options = trueFirst ? 
            [{value: 'true', text: 'True'}, {value: 'false', text: 'False'}] :
            [{value: 'false', text: 'False'}, {value: 'true', text: 'True'}];
        
        return `
        <div class="quiz-question">
            <p>${index + 1}. ${q.text}</p>
            ${options.map(opt => `
                <label class="quiz-option">
                    <input type="radio" name="${q.id}" value="${opt.value}"> ${opt.text}
                </label>
            `).join('')}
        </div>
        `;
    }).join('');
}

function randomizeFTPQuestions() {
    const ftp1Options = [
        {value: "A", text: "Fast Transfer Protocol"},
        {value: "B", text: "File Transfer Protocol"},
        {value: "C", text: "Full Text Protocol"},
        {value: "D", text: "Forward Transfer Process"}
    ];
    
    const ftp2Options = [
        {value: "A", text: "Peer-to-peer model"},
        {value: "B", text: "Client-server model"},
        {value: "C", text: "Distributed model"},
        {value: "D", text: "Centralized model"}
    ];
    
    updateRadioOptions('ftp1', shuffleArray(ftp1Options));
    updateRadioOptions('ftp2', shuffleArray(ftp2Options));
}

function updateRadioOptions(name, options) {
    const container = document.querySelector(`input[name="${name}"]`)?.closest('.quiz-question');
    if (!container) return;
    
    const labels = container.querySelectorAll(`label.quiz-option:has(input[name="${name}"])`);
    
    labels.forEach((label, index) => {
        if (index < options.length) {
            const radio = label.querySelector('input[type="radio"]');
            radio.value = options[index].value;
            const textNode = Array.from(label.childNodes).find(node => node.nodeType === 3);
            if (textNode) {
                textNode.textContent = ' ' + options[index].text;
            } else {
                label.appendChild(document.createTextNode(' ' + options[index].text));
            }
        }
    });
}

function randomizeSequenceItems() {
    const container = document.getElementById('sequenceContainer');
    if (!container) return;
    
    const sequenceItems = [
        {sequence: 1, text: "Client sends SYN to server"},
        {sequence: 2, text: "Server sends SYN-ACK to client"},
        {sequence: 3, text: "Client sends ACK to server"},
        {sequence: 4, text: "Connection established"}
    ];
    
    const allItems = [
        ...sequenceItems,
        {sequence: 0, text: "Server sends SYN to client"},
        {sequence: 0, text: "Client sends SYN-ACK to server"},
        {sequence: 0, text: "Server sends ACK to client"}
    ];
    
    const shuffled = shuffleArray(allItems).slice(0, 6);
    
    container.innerHTML = '';
    shuffled.forEach(item => {
        const div = document.createElement('div');
        div.className = 'draggable';
        div.draggable = true;
        div.setAttribute('data-sequence', item.sequence);
        div.textContent = item.text;
        container.appendChild(div);
    });
    
    const draggables = container.querySelectorAll('.draggable');
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', handleDragStart);
        draggable.addEventListener('dragend', handleDragEnd);
        draggable.addEventListener('touchstart', handleTouchStart, {passive: false});
        draggable.addEventListener('touchmove', handleTouchMove, {passive: false});
        draggable.addEventListener('touchend', handleTouchEnd);
    });
}

function randomizeScenarioOptions() {
    const scenario1Container = document.getElementById('scenario1Options');
    if (scenario1Container) {
        const options = [
            {value: "POP", text: "POP"},
            {value: "IMAP", text: "IMAP"},
            {value: "SMTP", text: "SMTP"},
            {value: "FTP", text: "FTP"},
            {value: "HTTP", text: "HTTP"}
        ];
        
        const shuffled = shuffleArray(options);
        
        scenario1Container.innerHTML = shuffled.slice(0, 4).map(opt => `
            <label class="quiz-option">
                <input type="radio" name="scenario1" value="${opt.value}"> ${opt.text}
            </label>
        `).join('');
    }
}

function randomizeEthernetActivity() {
    const speedsContainer = document.getElementById('ethernetSpeeds');
    const standardsContainer = document.getElementById('ethernetStandards');
    
    if (!speedsContainer || !standardsContainer) return;
    
    const speeds = [
        {speed: "10", text: "10 Mbps"},
        {speed: "100", text: "100 Mbps"},
        {speed: "1000", text: "1 Gbps"},
        {speed: "10000", text: "10 Gbps"}
    ];
    
    const standards = [
        {answer: "10", text: "Standard Ethernet"},
        {answer: "100", text: "Fast Ethernet"},
        {answer: "1000", text: "Gigabit Ethernet"},
        {answer: "10000", text: "10 Gigabit Ethernet"}
    ];
    
    const shuffledSpeeds = shuffleArray(speeds);
    const shuffledStandards = shuffleArray(standards);
    
    speedsContainer.innerHTML = '';
    shuffledSpeeds.forEach(item => {
        const div = document.createElement('div');
        div.className = 'draggable';
        div.draggable = true;
        div.setAttribute('data-speed', item.speed);
        div.textContent = item.text;
        speedsContainer.appendChild(div);
    });
    
    standardsContainer.innerHTML = '';
    shuffledStandards.forEach(item => {
        const div = document.createElement('div');
        div.className = 'drop-zone';
        div.setAttribute('data-answer', item.answer);
        div.textContent = item.text;
        standardsContainer.appendChild(div);
    });
}

function generateSummaryQuiz() {
    const quizContainer = document.getElementById('summaryQuiz');
    const questions = [
        {
            question: "Which protocol is responsible for breaking data into packets?",
            options: ["HTTP", "TCP", "FTP", "POP"],
            correct: 1
        },
        {
            question: "What does the 'S' in HTTPS stand for?",
            options: ["Server", "Simple", "Secure", "System"],
            correct: 2
        },
        {
            question: "Which email protocol deletes emails from the server after downloading?",
            options: ["SMTP", "IMAP", "POP", "FTP"],
            correct: 2
        },
        {
            question: "What type of model does FTP use?",
            options: ["Peer-to-peer", "Client-server", "Distributed", "Hybrid"],
            correct: 1
        },
        {
            question: "Which protocol is used for sending emails?",
            options: ["POP", "IMAP", "SMTP", "HTTP"],
            correct: 2
        },
        {
            question: "What does IP stand for?",
            options: ["Internet Protocol", "Internal Process", "Information Packet", "Instant Protocol"],
            correct: 0
        },
        {
            question: "Which is generally faster?",
            options: ["Wireless connections", "Wired connections", "Both are equal", "Depends on weather"],
            correct: 1
        },
        {
            question: "IMAP allows users to:",
            options: ["Only download emails", "Delete emails permanently", "Synchronize emails across devices", "Send emails"],
            correct: 2
        },
        {
            question: "Ethernet is an example of:",
            options: ["Wireless protocol", "Email protocol", "Wired protocol", "Security protocol"],
            correct: 2
        },
        {
            question: "Which protocol uses port 25 by default?",
            options: ["HTTP", "HTTPS", "FTP", "SMTP"],
            correct: 3
        }
    ];
    
    questions.sort(() => Math.random() - 0.5);
    
    const correctAnswers = [];
    
    quizContainer.innerHTML = questions.map((q, i) => {
        const optionMapping = q.options.map((opt, idx) => ({
            text: opt,
            originalIndex: idx
        }));
        
        const shuffledOptions = shuffleArray(optionMapping);
        
        const correctNewIndex = shuffledOptions.findIndex(opt => opt.originalIndex === q.correct);
        correctAnswers.push(correctNewIndex);
        
        return `
        <div class="quiz-question">
            <p><strong>Question ${i + 1}:</strong> ${q.question}</p>
            <div class="quiz-options">
                ${shuffledOptions.map((opt, j) => `
                    <label class="quiz-option">
                        <input type="radio" name="summary-q${i}" value="${j}">
                        ${opt.text}
                    </label>
                `).join('')}
            </div>
        </div>
    `;
    }).join('');
    
    state.summaryQuizAnswers = correctAnswers;
}

// Initialize function - moved before DOMContentLoaded
function initializeDragAndDrop() {
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

function initializeQuizzes() {
    document.querySelectorAll('.quiz-option input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll(`input[name="${this.name}"]`).forEach(r => {
                r.parentElement.classList.remove('selected');
            });
            this.parentElement.classList.add('selected');
        });
    });
}

function initializeCanvas() {
    const canvas = document.getElementById('drawingCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    function startDrawing(e) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        if (e.touches) {
            lastX = (e.touches[0].clientX - rect.left) * scaleX;
            lastY = (e.touches[0].clientY - rect.top) * scaleY;
        } else {
            lastX = (e.clientX - rect.left) * scaleX;
            lastY = (e.clientY - rect.top) * scaleY;
        }
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        let currentX, currentY;
        if (e.touches) {
            currentX = (e.touches[0].clientX - rect.left) * scaleX;
            currentY = (e.touches[0].clientY - rect.top) * scaleY;
        } else {
            currentX = (e.clientX - rect.left) * scaleX;
            currentY = (e.clientY - rect.top) * scaleY;
        }
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = document.getElementById('penColor').value;
        ctx.lineWidth = document.getElementById('penSize').value;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        lastX = currentX;
        lastY = currentY;
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    canvas.addEventListener('touchstart', startDrawing, {passive: false});
    canvas.addEventListener('touchmove', draw, {passive: false});
    canvas.addEventListener('touchend', stopDrawing);
}

function preventPaste() {
    document.addEventListener('paste', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            e.preventDefault();
            showShameMessage();
        }
    });
}

function showShameMessage() {
    const shame = document.getElementById('shameMessage');
    shame.style.display = 'block';
    setTimeout(() => {
        shame.style.display = 'none';
    }, 3000);
}

// Navigation
function navigateToSection(index) {
    const sections = document.querySelectorAll('.section');
    const navBtns = document.querySelectorAll('.nav-btn');
    
    sections.forEach(s => s.classList.remove('active'));
    navBtns.forEach(b => b.classList.remove('active'));
    
    sections[index].classList.add('active');
    navBtns[index].classList.add('active');
    state.currentSection = index;
    
    if (index === 9) {
        updateFinalStats();
    }
}

function handleKeyboardNavigation(e) {
    if (e.key === 'ArrowRight' && state.currentSection < 9) {
        navigateToSection(state.currentSection + 1);
    } else if (e.key === 'ArrowLeft' && state.currentSection > 0) {
        navigateToSection(state.currentSection - 1);
    }
}

// XP and Stats Management
function addXP(amount, taskId) {
    if (!state.completedTasks.has(taskId)) {
        state.completedTasks.add(taskId);
        state.xp += amount;
        updateLevel();
        updateStats();
        createParticles();
        triggerHaptic();
        
        if (state.completedTasks.size === 1) {
            unlockAchievement('firstStep');
        }
        
        checkSpeedRunner();
    }
}

function updateLevel() {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
        if (state.xp >= levelThresholds[i]) {
            if (state.level < i) {
                state.level = i;
                showAchievement("Level Up!", `You reached Level ${i}!`, "⬆️");
            }
            break;
        }
    }
}

function updateStats() {
    document.getElementById('xpValue').textContent = state.xp;
    document.getElementById('levelValue').textContent = state.level;
    document.getElementById('achievementCount').textContent = state.achievements.length;
    
    const currentLevelXP = levelThresholds[state.level];
    const nextLevelXP = levelThresholds[state.level + 1] || 999;
    const progress = ((state.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    document.getElementById('xpBar').style.width = Math.min(progress, 100) + '%';
}

function unlockAchievement(achievementId) {
    if (!state.achievements.includes(achievementId)) {
        state.achievements.push(achievementId);
        const achievement = achievements[achievementId];
        showAchievement(achievement.name, achievement.desc, achievement.icon);
        updateStats();
    }
}

function showAchievement(title, desc, icon = "🏆") {
    const popup = document.getElementById('achievementPopup');
    document.getElementById('achievementTitle').textContent = title;
    document.getElementById('achievementDesc').textContent = desc;
    document.querySelector('.achievement-icon').textContent = icon;
    
    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000);
}

function createParticles() {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = '✨';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = Math.random() * window.innerHeight + 'px';
        particle.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
        particle.style.setProperty('--ty', (Math.random() - 0.5) * 200 + 'px');
        particle.style.animation = 'particleAnimation 1s ease-out forwards';
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

function checkSpeedRunner() {
    taskTimestamps.push(Date.now());
    
    if (taskTimestamps.length > 3) {
        taskTimestamps.shift();
    }
    
    if (taskTimestamps.length === 3) {
        const timeDiff = taskTimestamps[2] - taskTimestamps[0];
        if (timeDiff <= 300000) {
            unlockAchievement('speedRunner');
        }
    }
}

function updateFinalStats() {
    document.getElementById('finalXP').textContent = state.xp;
    document.getElementById('finalLevel').textContent = state.level;
    document.getElementById('finalAchievements').textContent = state.achievements.length;
}

// Drag and Drop Handlers
function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    e.target.classList.add('drag-over');
    return false;
}

function handleDragLeave(e) {
    e.target.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    e.preventDefault();
    
    const dropZone = e.target.classList.contains('drop-zone') ? e.target : e.target.closest('.drop-zone');
    if (dropZone && draggedElement) {
        if (dropZone.classList.contains('category-drop')) {
            const clone = draggedElement.cloneNode(true);
            clone.classList.remove('dragging');
            dropZone.appendChild(clone);
            draggedElement.style.display = 'none';
        } else {
            if (dropZone.children.length > 0 && !dropZone.hasAttribute('data-answer')) {
                return;
            }
            dropZone.appendChild(draggedElement);
        }
    }
    
    dropZone.classList.remove('drag-over');
    return false;
}

function handleTouchStart(e) {
    touchItem = e.target;
    const touch = e.touches[0];
    touchOffset.x = touch.clientX - touchItem.offsetLeft;
    touchOffset.y = touch.clientY - touchItem.offsetTop;
    touchItem.style.position = 'fixed';
    touchItem.style.zIndex = '1000';
    e.preventDefault();
}

function handleTouchMove(e) {
    if (!touchItem) return;
    const touch = e.touches[0];
    touchItem.style.left = (touch.clientX - touchOffset.x) + 'px';
    touchItem.style.top = (touch.clientY - touchOffset.y) + 'px';
    e.preventDefault();
}

function handleTouchEnd(e) {
    if (!touchItem) return;
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementBelow?.closest('.drop-zone');
    
    if (dropZone) {
        dropZone.appendChild(touchItem);
    }
    
    touchItem.style.position = '';
    touchItem.style.zIndex = '';
    touchItem = null;
}

// All checking and reset functions follow...
function checkStarterAnswers() {
    const dropZones = document.querySelectorAll('#starterDescriptions .drop-zone');
    let correct = 0;
    
    dropZones.forEach(zone => {
        const expectedAnswer = zone.getAttribute('data-answer');
        const droppedItem = zone.querySelector('.draggable');
        
        if (droppedItem && droppedItem.getAttribute('data-protocol') === expectedAnswer) {
            zone.classList.add('correct');
            zone.classList.remove('incorrect');
            correct++;
        } else {
            zone.classList.add('incorrect');
            zone.classList.remove('correct');
        }
    });
    
    if (correct === 8) {
        addXP(10, 'starter-matching');
        unlockAchievement('protocolMaster');
        showAchievement("Perfect Match!", "All protocols correctly matched!", "🎯");
    } else {
        showAchievement("Try Again", `${correct}/8 correct. Keep going!`, "💪");
    }
}

function resetStarter() {
    randomizeStarterActivity();
    initializeDragAndDrop();
}

// HTTP/HTTPS Simulations
function simulateHTTP() {
    const packet = document.getElementById('dataPacket');
    const status = document.getElementById('simulationStatus');
    const connectionLine = document.getElementById('connectionLine');
    
    connectionLine.style.background = '#ef4444';
    packet.style.display = 'block';
    packet.style.background = '#ef4444';
    packet.textContent = 'Data (Unencrypted)';
    
    packet.style.left = '50px';
    packet.style.bottom = '100px';
    
    setTimeout(() => {
        packet.style.transition = 'all 2s ease-in-out';
        packet.style.right = '50px';
        packet.style.left = 'auto';
    }, 100);
    
    status.innerHTML = '<span style="color: #ef4444;">⚠️ Insecure HTTP Connection - Data is visible!</span>';
    
    addXP(5, 'http-simulation');
}

function simulateHTTPS() {
    const packet = document.getElementById('dataPacket');
    const status = document.getElementById('simulationStatus');
    const connectionLine = document.getElementById('connectionLine');
    
    connectionLine.style.background = '#10b981';
    packet.style.display = 'block';
    packet.style.background = '#10b981';
    packet.textContent = '🔒 Encrypted';
    
    packet.style.right = 'auto';
    packet.style.left = '50px';
    packet.style.bottom = '100px';
    
    setTimeout(() => {
        packet.style.transition = 'all 2s ease-in-out';
        packet.style.right = '50px';
        packet.style.left = 'auto';
    }, 100);
    
    status.innerHTML = '<span style="color: #10b981;">✅ Secure HTTPS Connection - Data is encrypted!</span>';
    
    addXP(5, 'https-simulation');
}

function checkFillBlanks() {
    const answers = {
        blank1: 'correct',
        blank2: 'correct',
        blank3: 'correct',
        blank4: 'correct'
    };
    
    let correct = 0;
    for (let id in answers) {
        const select = document.getElementById(id);
        if (select.value === answers[id]) {
            correct++;
            select.style.borderColor = '#10b981';
        } else {
            select.style.borderColor = '#ef4444';
        }
    }
    
    if (correct === 4) {
        addXP(10, 'fill-blanks');
        showAchievement("Fill Master!", "All blanks filled correctly!", "📝");
    } else {
        showAchievement("Keep Trying", `${correct}/4 correct`, "💪");
    }
}

function resetFillBlanks() {
    ['blank1', 'blank2', 'blank3', 'blank4'].forEach(id => {
        const select = document.getElementById(id);
        select.value = '';
        select.style.borderColor = '';
    });
    randomizeFillInBlanks();
}

function checkTrueFalse() {
    let correct = 0;
    
    Object.keys(trueFalseAnswers).forEach(questionId => {
        const selectedInput = document.querySelector(`input[name="${questionId}"]:checked`);
        if (selectedInput) {
            const selectedValue = selectedInput.value === 'true';
            if (selectedValue === trueFalseAnswers[questionId]) {
                correct++;
                selectedInput.parentElement.classList.add('correct');
            } else {
                selectedInput.parentElement.classList.add('incorrect');
            }
        }
    });
    
    const total = Object.keys(trueFalseAnswers).length;
    if (correct === total) {
        addXP(5, 'true-false');
    }
    
    showAchievement("True/False", `${correct}/${total} correct`, "✅");
}

// TCP/IP Functions
function startPacketSimulation() {
    const canvas = document.getElementById('routingCanvas');
    const ctx = canvas.getContext('2d');
    const info = document.getElementById('packetInfo');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const nodes = [
        {x: 100, y: 200, label: 'Client'},
        {x: 300, y: 100, label: 'Router 1'},
        {x: 300, y: 300, label: 'Router 2'},
        {x: 500, y: 200, label: 'Router 3'},
        {x: 700, y: 200, label: 'Server'}
    ];
    
    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 30, 0, 2 * Math.PI);
        ctx.fillStyle = '#2563eb';
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + 5);
    });
    
    let step = 0;
    const path = [nodes[0], nodes[1], nodes[3], nodes[4]];
    
    function animatePacket() {
        if (step < path.length - 1) {
            const from = path[step];
            const to = path[step + 1];
            let progress = 0;
            
            const interval = setInterval(() => {
                progress += 0.02;
                if (progress >= 1) {
                    clearInterval(interval);
                    step++;
                    setTimeout(animatePacket, 500);
                }
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                ctx.strokeStyle = '#e5e7eb';
                ctx.lineWidth = 2;
                for (let i = 0; i < nodes.length - 1; i++) {
                    for (let j = i + 1; j < nodes.length; j++) {
                        if (Math.abs(i - j) <= 2) {
                            ctx.beginPath();
                            ctx.moveTo(nodes[i].x, nodes[i].y);
                            ctx.lineTo(nodes[j].x, nodes[j].y);
                            ctx.stroke();
                        }
                    }
                }
                
                nodes.forEach((node, index) => {
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 30, 0, 2 * Math.PI);
                    ctx.fillStyle = path.includes(node) ? '#10b981' : '#2563eb';
                    ctx.fill();
                    ctx.fillStyle = 'white';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(node.label, node.x, node.y + 5);
                });
                
                const x = from.x + (to.x - from.x) * progress;
                const y = from.y + (to.y - from.y) * progress;
                ctx.beginPath();
                ctx.arc(x, y, 15, 0, 2 * Math.PI);
                ctx.fillStyle = '#f59e0b';
                ctx.fill();
                ctx.fillStyle = 'white';
                ctx.font = '10px Arial';
                ctx.fillText('PKT', x, y + 3);
            }, 20);
            
            info.textContent = `Packet traveling from ${from.label} to ${to.label}`;
        } else {
            info.textContent = 'Packet delivered successfully!';
            addXP(10, 'packet-simulation');
        }
    }
    
    animatePacket();
}

function resetPacketSimulation() {
    const canvas = document.getElementById('routingCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('packetInfo').textContent = '';
}

function checkSequence() {
    const drops = document.querySelectorAll('.sequence-drop');
    let correct = 0;
    
    drops.forEach(drop => {
        const position = parseInt(drop.getAttribute('data-position'));
        const item = drop.querySelector('.draggable');
        
        if (item) {
            const sequence = parseInt(item.getAttribute('data-sequence'));
            if (position === sequence) {
                drop.classList.add('correct');
                correct++;
            } else {
                drop.classList.add('incorrect');
            }
        }
    });
    
    if (correct === 4) {
        addXP(10, 'tcp-sequence');
        showAchievement("Sequence Master!", "TCP three-way handshake understood!", "🤝");
    }
}

function resetSequence() {
    randomizeSequenceItems();
    
    document.querySelectorAll('.sequence-drop').forEach(drop => {
        drop.classList.remove('correct', 'incorrect');
        while (drop.firstChild && drop.firstChild.classList && drop.firstChild.classList.contains('draggable')) {
            drop.removeChild(drop.firstChild);
        }
    });
}

function checkShortAnswers() {
    const tcpAnswer = document.getElementById('tcpFullForm').value.trim();
    const advantageAnswer = document.getElementById('tcpAdvantage').value.trim();
    
    let score = 0;
    let feedback = [];
    
    if (tcpAnswer.length >= 15) {
        const keywords = ['transmission', 'control', 'protocol'];
        const matchedKeywords = keywords.filter(keyword => 
            tcpAnswer.toLowerCase().includes(keyword)
        );
        
        if (matchedKeywords.length >= 2) {
            score += 5;
            feedback.push("✅ TCP full form correct!");
        } else {
            feedback.push("❌ TCP stands for Transmission Control Protocol");
        }
    } else {
        feedback.push("❌ Answer too short for TCP full form");
    }
    
    if (advantageAnswer.length >= 30) {
        const advantageKeywords = ['reliable', 'error', 'order', 'acknowledgment', 'retransmission', 'connection'];
        const matched = advantageKeywords.some(keyword => 
            advantageAnswer.toLowerCase().includes(keyword)
        );
        
        if (matched) {
            score += 5;
            feedback.push("✅ Good TCP advantage!");
        } else {
            feedback.push("💡 Consider mentioning reliability or error checking");
        }
    } else {
        feedback.push("❌ Please provide a more detailed advantage");
    }
    
    addXP(score, 'tcp-short-answers');
    showAchievement("Short Answers", feedback.join('\n'), "📝");
}

// Email Protocol Simulations
function simulatePOP() {
    const canvas = document.getElementById('emailCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(100, 50, 100, 80);
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Client', 150, 95);
    
    ctx.fillStyle = '#10b981';
    ctx.fillRect(600, 50, 100, 80);
    ctx.fillStyle = 'white';
    ctx.fillText('Server', 650, 95);
    
    let emailY = 90;
    const animate = setInterval(() => {
        ctx.clearRect(200, 0, 400, canvas.height);
        
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(650 - (650 - 150) * (emailY / 250), emailY, 40, 30);
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText('📧', 670 - (650 - 150) * (emailY / 250), emailY + 20);
        
        emailY += 5;
        
        if (emailY > 250) {
            clearInterval(animate);
            ctx.fillStyle = '#ef4444';
            ctx.font = '16px Arial';
            ctx.fillText('Email deleted from server!', 400, 250);
            addXP(5, 'pop-simulation');
        }
    }, 50);
}

function simulateIMAP() {
    const canvas = document.getElementById('emailCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(50, 50, 80, 60);
    ctx.fillRect(50, 150, 80, 60);
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Device 1', 90, 85);
    ctx.fillText('Device 2', 90, 185);
    
    ctx.fillStyle = '#10b981';
    ctx.fillRect(600, 100, 100, 80);
    ctx.fillStyle = 'white';
    ctx.fillText('Server', 650, 145);
    
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(130, 80);
    ctx.lineTo(600, 140);
    ctx.moveTo(130, 180);
    ctx.lineTo(600, 140);
    ctx.stroke();
    
    ctx.fillStyle = '#10b981';
    ctx.font = '16px Arial';
    ctx.fillText('Emails stay on server - synchronized!', 400, 250);
    
    addXP(5, 'imap-simulation');
}

function simulateSMTP() {
    const canvas = document.getElementById('emailCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(100, 100, 100, 80);
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Sender', 150, 145);
    
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(350, 100, 100, 80);
    ctx.fillStyle = 'white';
    ctx.fillText('SMTP', 400, 145);
    
    ctx.fillStyle = '#10b981';
    ctx.fillRect(600, 100, 100, 80);
    ctx.fillStyle = 'white';
    ctx.fillText('Recipient', 650, 145);
    
    let progress = 0;
    const animate = setInterval(() => {
        progress += 0.02;
        if (progress > 1) {
            clearInterval(animate);
            return;
        }
        
        ctx.clearRect(200, 50, 400, 100);
        
        const x = 200 + (400 * progress);
        ctx.fillStyle = '#f59e0b';
        ctx.font = '24px Arial';
        ctx.fillText('📨', x, 120);
        
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(200, 140);
        ctx.lineTo(200 + (400 * progress), 140);
        ctx.stroke();
    }, 50);
    
    addXP(5, 'smtp-simulation');
    
    if (state.completedTasks.has('pop-simulation') && 
        state.completedTasks.has('imap-simulation') && 
        state.completedTasks.has('smtp-simulation')) {
        unlockAchievement('simulationExpert');
    }
}

function checkCategories() {
    const dropZones = document.querySelectorAll('.category-drop');
    let allCorrect = true;
    
    dropZones.forEach(zone => {
        const expectedCategory = zone.getAttribute('data-category');
        const items = zone.querySelectorAll('.draggable');
        
        items.forEach(item => {
            if (item.getAttribute('data-category') === expectedCategory) {
                item.style.background = '#10b981';
                item.style.color = 'white';
            } else {
                item.style.background = '#ef4444';
                item.style.color = 'white';
                allCorrect = false;
            }
        });
    });
    
    if (allCorrect) {
        addXP(15, 'email-categories');
        showAchievement("Category Expert!", "All features correctly categorized!", "📧");
    }
}

function resetCategories() {
    randomizeEmailFeatures();
    document.querySelectorAll('.category-drop').forEach(zone => {
        zone.innerHTML = '';
    });
    initializeDragAndDrop();
}

function checkScenarios() {
    let score = 0;
    
    const scenario1 = document.querySelector('input[name="scenario1"]:checked');
    if (scenario1 && scenario1.value === 'IMAP') {
        score += 5;
        scenario1.parentElement.classList.add('correct');
    }
    
    const scenario2Answer = document.getElementById('scenario2Answer').value.trim();
    if (scenario2Answer.length >= 40) {
        const keywords = ['pop', 'download', 'delete', 'storage', 'local'];
        const matched = keywords.filter(keyword => 
            scenario2Answer.toLowerCase().includes(keyword)
        ).length;
        
        if (matched >= 2) {
            score += 10;
        }
    }
    
    addXP(score, 'email-scenarios');
    showAchievement("Scenario Analysis", `Scored ${score}/15 points`, "🎯");
}

// FTP Functions
function updateFileDisplay() {
    const clientDiv = document.getElementById('clientFiles');
    const serverDiv = document.getElementById('serverFiles');
    
    clientDiv.innerHTML = clientFiles.map(f => 
        `<div style="background: white; padding: 2px 5px; margin: 2px; border-radius: 3px; font-size: 12px;">${f}</div>`
    ).join('');
    
    serverDiv.innerHTML = serverFiles.map(f => 
        `<div style="background: white; padding: 2px 5px; margin: 2px; border-radius: 3px; font-size: 12px;">${f}</div>`
    ).join('');
}

function uploadFile() {
    if (clientFiles.length === 0) return;
    
    updateFileDisplay();
    
    const file = clientFiles.pop();
    const animation = document.getElementById('transferAnimation');
    animation.style.display = 'block';
    animation.style.left = '150px';
    animation.style.top = '140px';
    animation.innerHTML = `📁 ${file}`;
    animation.style.transition = 'all 1s ease-in-out';
    
    setTimeout(() => {
        animation.style.left = '620px';
    }, 100);
    
    setTimeout(() => {
        serverFiles.push(file);
        updateFileDisplay();
        animation.style.display = 'none';
        addXP(5, 'ftp-upload');
    }, 1200);
}

function downloadFile() {
    if (serverFiles.length === 0) return;
    
    updateFileDisplay();
    
    const file = serverFiles.pop();
    const animation = document.getElementById('transferAnimation');
    animation.style.display = 'block';
    animation.style.left = '620px';
    animation.style.top = '140px';
    animation.innerHTML = `📁 ${file}`;
    animation.style.transition = 'all 1s ease-in-out';
    
    setTimeout(() => {
        animation.style.left = '150px';
    }, 100);
    
    setTimeout(() => {
        clientFiles.push(file);
        updateFileDisplay();
        animation.style.display = 'none';
        addXP(5, 'ftp-download');
    }, 1200);
}

function resetFTPSim() {
    clientFiles = ['document.txt', 'image.jpg'];
    serverFiles = ['data.csv', 'backup.zip'];
    updateFileDisplay();
}

function checkFTPAnswers() {
    let score = 0;
    
    const ftp1 = document.querySelector('input[name="ftp1"]:checked');
    if (ftp1 && ftp1.value === 'B') {
        score += 5;
        ftp1.parentElement.classList.add('correct');
    }
    
    const ftp2 = document.querySelector('input[name="ftp2"]:checked');
    if (ftp2 && ftp2.value === 'B') {
        score += 5;
        ftp2.parentElement.classList.add('correct');
    }
    
    const securityAnswer = document.getElementById('ftpSecurity').value.trim();
    if (securityAnswer.length >= 30) {
        const keywords = ['plain', 'text', 'unencrypted', 'secure', 'password', 'intercept'];
        const matched = keywords.some(keyword => 
            securityAnswer.toLowerCase().includes(keyword)
        );
        
        if (matched) {
            score += 5;
        }
    }
    
    addXP(score, 'ftp-questions');
    showAchievement("FTP Knowledge", `Scored ${score}/15 points`, "📁");
}

// Wired/Ethernet Functions
function checkOddOneOut() {
    let score = 0;
    const group1Selection = state.oddOneOutSelections.group1;
    const group2Selection = state.oddOneOutSelections.group2;
    const explain1 = document.getElementById('oddExplain1').value.trim();
    const explain2 = document.getElementById('oddExplain2').value.trim();
    
    if (group1Selection === 'Wi-Fi' && explain1.length > 10) {
        score += 10;
    }
    
    if (group2Selection === 'Portable' && explain2.length > 10) {
        score += 10;
    }
    
    addXP(score, 'odd-one-out');
    showAchievement("Odd One Out", `Scored ${score}/20 points`, "🎯");
}

function selectOddOne(button, group, value) {
    document.querySelectorAll(`.odd-one[onclick*="${group}"]`).forEach(btn => {
        btn.classList.remove('selected');
    });
    
    button.classList.add('selected');
    state.oddOneOutSelections[group] = value;
}

function checkEthernetSpeeds() {
    const dropZones = document.querySelectorAll('#ethernetStandards .drop-zone');
    let correct = 0;
    
    dropZones.forEach(zone => {
        const expected = zone.getAttribute('data-answer');
        const item = zone.querySelector('.draggable');
        
        if (item && item.getAttribute('data-speed') === expected) {
            zone.classList.add('correct');
            correct++;
        } else {
            zone.classList.add('incorrect');
        }
    });
    
    if (correct === 4) {
        addXP(10, 'ethernet-speeds');
        showAchievement("Speed Expert!", "All Ethernet speeds matched!", "⚡");
    }
}

// Summary Quiz
function checkSummaryQuiz() {
    let correct = 0;
    const total = state.summaryQuizAnswers.length;
    
    state.summaryQuizAnswers.forEach((correctAnswer, i) => {
        const selected = document.querySelector(`input[name="summary-q${i}"]:checked`);
        const options = document.querySelectorAll(`input[name="summary-q${i}"]`);
        
        if (selected && parseInt(selected.value) === correctAnswer) {
            correct++;
            selected.parentElement.classList.add('correct');
        } else {
            options[correctAnswer].parentElement.classList.add('correct');
            if (selected) {
                selected.parentElement.classList.add('incorrect');
            }
        }
    });
    
    const percentage = Math.round((correct / total) * 100);
    
    document.getElementById('quizScore').textContent = `${correct}`;
    document.getElementById('quizResults').style.display = 'block';
    
    if (percentage >= 80) {
        addXP(30, 'summary-quiz');
        unlockAchievement('quizWhiz');
        document.getElementById('quizFeedback').innerHTML = `
            <p style="color: #10b981;">Excellent work! You scored ${percentage}%!</p>
        `;
    } else if (percentage >= 60) {
        addXP(20, 'summary-quiz');
        document.getElementById('quizFeedback').innerHTML = `
            <p style="color: #f59e0b;">Good effort! You scored ${percentage}%. Review the incorrect answers.</p>
        `;
    } else {
        addXP(10, 'summary-quiz');
        document.getElementById('quizFeedback').innerHTML = `
            <p style="color: #ef4444;">You scored ${percentage}%. Consider reviewing the material and trying again.</p>
        `;
    }
}

function resetSummaryQuiz() {
    generateSummaryQuiz();
    document.getElementById('quizResults').style.display = 'none';
}

// Practice Exam Functions
function checkPredictedMarks() {
    const predicted1 = parseInt(document.getElementById('predictedMarks1').value) || 0;
    const predicted2 = parseInt(document.getElementById('predictedMarks2').value) || 0;
    const predicted3 = parseInt(document.getElementById('predictedMarks3').value) || 0;
    
    const answer1a = document.getElementById('exam1a').value.trim();
    const answer1b = document.getElementById('exam1b').value.trim();
    const answer1c = document.getElementById('exam1c').value.trim();
    const answer2a = document.getElementById('exam2a').value.trim();
    const answer2b = document.getElementById('exam2b').value.trim();
    const answer2c = document.getElementById('exam2c').value.trim();
    const answer3 = document.getElementById('exam3').value.trim();
    
    if (answer1a.length < 10 || answer1b.length < 30 || answer2a.length < 30 || answer3.length < 50) {
        showAchievement("Incomplete", "Please make a reasonable attempt at all questions before viewing mark scheme", "⚠️");
        return;
    }
    
    const markScheme = document.getElementById('markScheme');
    markScheme.style.display = 'block';
    markScheme.innerHTML = `
        <h3>Mark Scheme</h3>
        
        <h4>Question 1 (4 marks)</h4>
        <p><strong>(a) [1 mark]</strong> Hypertext Transfer Protocol</p>
        <p><strong>(b) [2 marks]</strong> Any two from:</p>
        <ul>
            <li>Data is encrypted/secure during transmission</li>
            <li>Protects sensitive information (passwords, credit cards)</li>
            <li>Uses SSL/TLS certificates</li>
            <li>Prevents man-in-the-middle attacks</li>
            <li>Shows padlock in browser for user confidence</li>
        </ul>
        <p><strong>(c) [1 mark]</strong> SSL/TLS (accept either)</p>
        
        <h4>Question 2 (6 marks)</h4>
        <p><strong>(a) [2 marks]</strong></p>
        <ul>
            <li>POP downloads emails and deletes from server [1]</li>
            <li>IMAP keeps emails on server/allows synchronization [1]</li>
        </ul>
        <p><strong>(b) [2 marks]</strong></p>
        <ul>
            <li>Recommend IMAP [1]</li>
            <li>Because it allows access from multiple devices/synchronization [1]</li>
        </ul>
        <p><strong>(c) [2 marks]</strong></p>
        <ul>
            <li>SMTP (Simple Mail Transfer Protocol) [1]</li>
            <li>Used for sending/forwarding/transmitting emails [1]</li>
        </ul>
        
        <h4>Question 3 (5 marks)</h4>
        <p>Award marks for:</p>
        <ul>
            <li>TCP breaks data into packets [1]</li>
            <li>TCP ensures reliable delivery/error checking [1]</li>
            <li>IP handles addressing/routing [1]</li>
            <li>IP finds best path through network [1]</li>
            <li>They work together in TCP/IP stack/model [1]</li>
        </ul>
        
        <p style="margin-top: 20px; font-weight: bold;">
            Your predicted total: ${predicted1 + predicted2 + predicted3}/15 marks
        </p>
    `;
    
    addXP(40, 'exam-practice');
    unlockAchievement('examReady');
}

// Drawing Canvas
function clearCanvas() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Extension
function submitExtension() {
    const dns = document.getElementById('dnsExplanation').value.trim();
    const websockets = document.getElementById('websocketsAnswer').value.trim();
    const ipv6 = document.getElementById('ipv6Answer').value.trim();
    
    let score = 0;
    
    if (dns.length >= 50) score += 15;
    if (websockets.length >= 30) score += 15;
    if (ipv6.length >= 30) score += 20;
    
    if (score >= 40) {
        addXP(50, 'extension-activities');
        unlockAchievement('extensionExplorer');
        showAchievement("Extension Complete!", "Excellent research work!", "🚀");
    } else {
        showAchievement("Keep Going", "Add more detail to your answers", "💡");
    }
}

// Reset functions
function resetSection1() {
    resetFillBlanks();
    randomizeTrueFalse();
    document.querySelectorAll('#section-1 input[type="radio"]').forEach(radio => {
        radio.checked = false;
        radio.parentElement.classList.remove('correct', 'incorrect');
    });
}

function resetSection2() {
    resetSequence();
    resetPacketSimulation();
    document.getElementById('tcpFullForm').value = '';
    document.getElementById('tcpAdvantage').value = '';
}

function resetSection3() {
    resetCategories();
    randomizeScenarioOptions();
    document.querySelectorAll('#section-3 input[type="radio"]').forEach(radio => {
        radio.checked = false;
        radio.parentElement.classList.remove('correct', 'incorrect');
    });
    document.getElementById('scenario2Answer').value = '';
}

function resetSection4() {
    resetFTPSim();
    randomizeFTPQuestions();
    document.querySelectorAll('#section-4 input[type="radio"]').forEach(radio => {
        radio.checked = false;
        radio.parentElement.classList.remove('correct', 'incorrect');
    });
    document.getElementById('ftpSecurity').value = '';
}

function resetSection5() {
    document.getElementById('wiredAdvantages').value = '';
    document.getElementById('wirelessAdvantages').value = '';
    document.getElementById('oddExplain1').value = '';
    document.getElementById('oddExplain2').value = '';
    state.oddOneOutSelections = {};
    document.querySelectorAll('.odd-one').forEach(btn => {
        btn.classList.remove('selected');
    });
    randomizeEthernetActivity();
    initializeDragAndDrop();
}

function resetSection7() {
    ['exam1a', 'exam1b', 'exam1c', 'exam2a', 'exam2b', 'exam2c', 'exam3'].forEach(id => {
        document.getElementById(id).value = '';
    });
    ['predictedMarks1', 'predictedMarks2', 'predictedMarks3'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('markScheme').style.display = 'none';
}

function resetSection8() {
    clearCanvas();
    ['dnsExplanation', 'websocketsAnswer', 'ipv6Answer'].forEach(id => {
        document.getElementById(id).value = '';
    });
}

// Hints
function toggleHint(hintId) {
    const hint = document.getElementById(hintId);
    if (hint.style.display === 'none' || !hint.style.display) {
        hint.style.display = 'block';
        if (!state.hintUsage.has(hintId)) {
            state.hintUsage.add(hintId);
            state.xp = Math.max(0, state.xp - 2);
            updateStats();
        }
    } else {
        hint.style.display = 'none';
    }
}

// Accessibility functions
function changeFontSize(delta) {
    const root = document.documentElement;
    const currentSize = parseInt(getComputedStyle(root).getPropertyValue('--font-size'));
    const newSize = Math.max(12, Math.min(24, currentSize + delta));
    root.style.setProperty('--font-size', newSize + 'px');
    localStorage.setItem('fontSize', newSize);
}

function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
}

function toggleDyslexiaFont() {
    document.body.classList.toggle('dyslexia-font');
}

// Feedback system
function openFeedback() {
    document.getElementById('feedbackModal').style.display = 'block';
}

function closeFeedback() {
    document.getElementById('feedbackModal').style.display = 'none';
    document.getElementById('feedbackText').value = '';
}

function sendFeedback() {
    const feedback = document.getElementById('feedbackText').value.trim();
    if (feedback.length < 10) {
        alert('Please provide more detailed feedback');
        return;
    }
    
    const sectionName = document.querySelector('.section.active h2').textContent;
    const subject = `Network Protocols Worksheet Feedback - ${sectionName}`;
    const body = `Feedback from section: ${sectionName}\n\n${feedback}\n\nSection: ${state.currentSection}\nXP: ${state.xp}\nLevel: ${state.level}`;
    
    const mailtoLink = `mailto:millingtond@mgs.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    
    closeFeedback();
    showAchievement("Feedback Sent", "Thank you for your feedback!", "📧");
}

// Mobile support
function triggerHaptic() {
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
}

// Mobile swipe navigation
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
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && state.currentSection < 9) {
            navigateToSection(state.currentSection + 1);
        } else if (diff < 0 && state.currentSection > 0) {
            navigateToSection(state.currentSection - 1);
        }
    }
}

// Perfect section tracking
let sectionHintUsage = {};

function checkPerfectSection() {
    const currentSectionHints = Array.from(state.hintUsage).filter(hint => 
        hint.includes(`section-${state.currentSection}`)
    );
    
    if (currentSectionHints.length === 0 && state.completedTasks.size > 5) {
        unlockAchievement('perfectionist');
    }
}

// Auto-save progress
function saveProgress() {
    const progress = {
        xp: state.xp,
        level: state.level,
        achievements: state.achievements,
        currentSection: state.currentSection,
        completedTasks: Array.from(state.completedTasks)
    };
    localStorage.setItem('networkProtocolsProgress', JSON.stringify(progress));
}

function loadProgress() {
    const saved = localStorage.getItem('networkProtocolsProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        state.xp = progress.xp || 0;
        state.level = progress.level || 0;
        state.achievements = progress.achievements || [];
        state.currentSection = progress.currentSection || 0;
        state.completedTasks = new Set(progress.completedTasks || []);
        updateStats();
        navigateToSection(state.currentSection);
    }
}

// Save progress periodically
setInterval(saveProgress, 30000);

// Initialize FTP file display on load
window.addEventListener('load', () => {
    if (document.getElementById('clientFiles')) {
        updateFileDisplay();
    }
});

// Ensure proper cleanup on page unload
window.addEventListener('beforeunload', () => {
    saveProgress();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 's':
                e.preventDefault();
                saveProgress();
                showAchievement("Progress Saved", "Your progress has been saved!", "💾");
                break;
            case 'r':
                e.preventDefault();
                if (confirm('Reset current section?')) {
                    const resetBtn = document.querySelector('.section.active .btn-reset');
                    if (resetBtn) resetBtn.click();
                }
                break;
        }
    }
});

// Easter egg: Konami code
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            unlockEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function unlockEasterEgg() {
    state.xp += 100;
    updateStats();
    showAchievement("🎮 Konami Code!", "You found the secret! +100 XP", "🎮");
    createParticles();
    createParticles();
    createParticles();
}

// Performance optimization: Debounce resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const event = new Event('resize');
        window.dispatchEvent(event);
    }, 250);
});

// Ensure all animations complete properly
document.addEventListener('animationend', (e) => {
    if (e.target.classList.contains('particle')) {
        e.target.remove();
    }
});

// Window resize handler for canvas
window.addEventListener('resize', () => {
    const canvas = document.getElementById('drawingCanvas');
    if (canvas) {
        const container = canvas.parentElement;
        const aspectRatio = canvas.width / canvas.height;
        const newWidth = container.offsetWidth - 20;
        canvas.style.width = newWidth + 'px';
        canvas.style.height = (newWidth / aspectRatio) + 'px';
    }
});

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    randomizeStarterActivity();
    randomizeEmailFeatures();
    initializeDragAndDrop();
    initializeQuizzes();
    initializeCanvas();
    preventPaste();
    randomizeFillInBlanks();
    randomizeTrueFalse();
    randomizeFTPQuestions();
    randomizeSequenceItems();
    randomizeScenarioOptions();
    randomizeEthernetActivity();
    generateSummaryQuiz();
    updateStats();
    
    // Initialize accessibility
    const savedFontSize = localStorage.getItem('fontSize') || '16';
    document.documentElement.style.setProperty('--font-size', savedFontSize + 'px');
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
});

// Final initialization check
console.log('Network Protocols Worksheet initialized successfully!');