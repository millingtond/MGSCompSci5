// Global Variables
let currentXP = 0;
let currentLevel = 1;
let completedTasks = new Set();
let achievements = new Set();
let currentSection = 'welcome';

// XP Requirements per level
const XP_PER_LEVEL = 100;
const MAX_LEVEL = 5;

// Achievement definitions
const ACHIEVEMENTS = {
    firstStep: { name: "First Steps", description: "Complete your first task", xp: 10 },
    dragMaster: { name: "Drag Master", description: "Complete all drag and drop tasks", xp: 20 },
    quizWhiz: { name: "Quiz Whiz", description: "Get 100% on a quiz", xp: 15 },
    networkExpert: { name: "Network Expert", description: "Complete all main sections", xp: 30 },
    examReady: { name: "Exam Ready", description: "Complete all exam questions", xp: 25 },
    explorer: { name: "Explorer", description: "Find the hidden easter egg", xp: 50 },
    perfectionist: { name: "Perfectionist", description: "Achieve Level 5", xp: 40 }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeLesson();
    setupAntiPaste();
    setupDragAndDrop();
    setupNavigation();
    setupMobileGestures();
    setupKeyboardNavigation();
    
    // Delay simulation creation to ensure DOM is ready
    setTimeout(() => {
        createNetworkSimulations();
        addEducationalTooltips();
    }, 500);
    
    // Add ARIA live region for dynamic updates
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
});

// Initialize lesson
function initializeLesson() {
    updateXPDisplay();
    
    // Add welcome message
    setTimeout(() => {
        announceToScreenReader("Welcome to the Networks lesson. Complete tasks to earn XP and level up!");
    }, 1000);
}

// Anti-paste protection
function setupAntiPaste() {
    // Prevent paste events
    document.addEventListener('paste', function(e) {
        e.preventDefault();
        showShameMessage();
        document.body.classList.add('shame-mode');
        return false;
    });
    
    // Also prevent context menu on input fields
    document.querySelectorAll('input, textarea').forEach(element => {
        element.addEventListener('contextmenu', e => e.preventDefault());
    });
}

// Show shame message
function showShameMessage() {
    const shameMsg = document.getElementById('shameMessage');
    shameMsg.style.display = 'block';
    
    // Vibrate on mobile if supported
    if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
    }
    
    setTimeout(() => {
        shameMsg.style.display = 'none';
    }, 5000);
}

// XP and Achievement System
function awardXP(amount, taskId) {
    // Only award XP once per task
    if (completedTasks.has(taskId)) return;
    
    completedTasks.add(taskId);
    currentXP += amount;
    
    // Check for level up
    const newLevel = Math.min(Math.floor(currentXP / XP_PER_LEVEL) + 1, MAX_LEVEL);
    if (newLevel > currentLevel) {
        currentLevel = newLevel;
        showAchievement("Level Up!", `You've reached Level ${currentLevel}!`);
        createParticleEffect();
        
        if (currentLevel === MAX_LEVEL) {
            unlockAchievement('perfectionist');
        }
    }
    
    updateXPDisplay();
    
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
}

function updateXPDisplay() {
    const xpFill = document.getElementById('xpFill');
    const xpText = document.getElementById('xpText');
    const levelBadge = document.getElementById('levelBadge');
    
    const levelXP = (currentXP % XP_PER_LEVEL);
    const percentage = (levelXP / XP_PER_LEVEL) * 100;
    
    xpFill.style.width = percentage + '%';
    xpText.textContent = `${levelXP} / ${XP_PER_LEVEL} XP`;
    levelBadge.textContent = `Level ${currentLevel}`;
}

function unlockAchievement(achievementId) {
    if (achievements.has(achievementId)) return;
    
    achievements.add(achievementId);
    const achievement = ACHIEVEMENTS[achievementId];
    showAchievement(achievement.name, achievement.description);
    awardXP(achievement.xp, 'achievement_' + achievementId);
    createParticleEffect();
}

function showAchievement(title, description) {
    const popup = document.getElementById('achievementPopup');
    document.getElementById('achievementTitle').textContent = title;
    document.getElementById('achievementDesc').textContent = description;
    
    popup.classList.add('show');
    announceToScreenReader(`Achievement unlocked: ${title}. ${description}`);
    
    setTimeout(() => {
        popup.classList.remove('show');
    }, 4000);
}

// Particle Effects
function createParticleEffect() {
    const container = document.getElementById('particles');
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = window.innerHeight / 2 + 'px';
            particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            container.appendChild(particle);
            
            setTimeout(() => particle.remove(), 3000);
        }, i * 50);
    }
}

// Navigation System
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            navigateToSection(section);
        });
    });
}

function navigateToSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // Update navigation
        updateNavigation(sectionId);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update progress dots
        updateProgressDots();
        
        // Announce to screen reader
        const heading = targetSection.querySelector('h2');
        if (heading) {
            announceToScreenReader(`Now on section: ${heading.textContent}`);
        }
    }
}

function updateNavigation(sectionId) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === sectionId) {
            btn.classList.add('active');
            btn.setAttribute('aria-current', 'true');
        } else {
            btn.removeAttribute('aria-current');
        }
    });
}

function updateProgressDots() {
    const dots = document.querySelectorAll('.progress-dot');
    const sections = ['welcome', 'starter', 'wan', 'lan', 'client-server', 'peer-to-peer', 
                     'real-world', 'mistakes', 'exam', 'extension', 'takeaways', 'videos'];
    
    const currentIndex = sections.indexOf(currentSection);
    
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentIndex) {
            dot.classList.add('active');
        }
        if (index < currentIndex) {
            dot.classList.add('completed');
        }
    });
}

// Drag and Drop System
function setupDragAndDrop() {
    // Setup for all drag items
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);
    document.addEventListener('dragend', handleDragEnd);
    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    
    // Touch support for mobile
    let touchItem = null;
    
    document.addEventListener('touchstart', function(e) {
        const dragItem = e.target.closest('.drag-item');
        if (dragItem) {
            touchItem = dragItem;
            dragItem.style.opacity = '0.5';
        }
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!touchItem) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropZone = elementBelow?.closest('.drop-zone');
        
        if (dropZone) {
            dropZone.classList.add('drag-over');
        }
    });
    
    document.addEventListener('touchend', function(e) {
        if (!touchItem) return;
        
        const touch = e.changedTouches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropZone = elementBelow?.closest('.drop-zone');
        
        if (dropZone) {
            handleDropTouch(touchItem, dropZone);
        }
        
        touchItem.style.opacity = '1';
        touchItem = null;
        
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('drag-over');
        });
    });
}

let draggedElement = null;

function handleDragStart(e) {
    if (!e.target.classList.contains('drag-item')) return;
    
    draggedElement = e.target;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    const dropZone = e.target.closest('.drop-zone');
    if (dropZone) {
        dropZone.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    const dropZone = e.target.closest('.drop-zone');
    if (dropZone && !dropZone.contains(e.relatedTarget)) {
        dropZone.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    e.preventDefault();
    
    const dropZone = e.target.closest('.drop-zone');
    if (!dropZone || !draggedElement) return;
    
    processDropAction(draggedElement, dropZone);
    
    return false;
}

function handleDropTouch(dragItem, dropZone) {
    processDropAction(dragItem, dropZone);
}

function processDropAction(dragItem, dropZone) {
    const correctZone = dragItem.dataset.answer;
    const targetZone = dropZone.dataset.zone;
    
    dropZone.classList.remove('drag-over');
    
    if (correctZone === targetZone) {
        dropZone.classList.add('correct');
        dropZone.appendChild(dragItem.cloneNode(true));
        dragItem.style.display = 'none';
        
        // Check if task is complete
        checkDragDropComplete(dropZone.closest('.task'));
    } else {
        dropZone.classList.add('incorrect');
        setTimeout(() => {
            dropZone.classList.remove('incorrect');
        }, 1000);
    }
}

function handleDragEnd(e) {
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
    });
}

function checkDragDropComplete(taskElement) {
    const dragItems = taskElement.querySelectorAll('.drag-item:not([style*="display: none"])');
    if (dragItems.length === 0) {
        const feedback = taskElement.querySelector('.feedback');
        if (feedback) {
            feedback.textContent = "Excellent! All items correctly placed! 🎉";
            feedback.classList.add('success');
            feedback.style.display = 'block';
        }
        awardXP(15, taskElement.id || 'drag_task_' + Date.now());
        
        // Check for drag master achievement
        const allDragTasks = document.querySelectorAll('.drag-container');
        let allComplete = true;
        allDragTasks.forEach(container => {
            const remaining = container.querySelectorAll('.drag-item:not([style*="display: none"])');
            if (remaining.length > 0) allComplete = false;
        });
        if (allComplete) {
            unlockAchievement('dragMaster');
        }
    }
}

// Mobile Gestures
function setupMobileGestures() {
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
        const swipeThreshold = 100;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            const sections = ['welcome', 'starter', 'wan', 'lan', 'client-server', 'peer-to-peer', 
                            'real-world', 'mistakes', 'exam', 'extension', 'takeaways', 'videos'];
            const currentIndex = sections.indexOf(currentSection);
            
            if (diff > 0 && currentIndex < sections.length - 1) {
                // Swipe left - next section
                navigateToSection(sections[currentIndex + 1]);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - previous section
                navigateToSection(sections[currentIndex - 1]);
            }
        }
    }
}

// Keyboard Navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' && e.ctrlKey) {
            navigateNext();
        } else if (e.key === 'ArrowLeft' && e.ctrlKey) {
            navigatePrevious();
        }
    });
}

function navigateNext() {
    const sections = ['welcome', 'starter', 'wan', 'lan', 'client-server', 'peer-to-peer', 
                     'real-world', 'mistakes', 'exam', 'extension', 'takeaways', 'videos'];
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex < sections.length - 1) {
        navigateToSection(sections[currentIndex + 1]);
    }
}

function navigatePrevious() {
    const sections = ['welcome', 'starter', 'wan', 'lan', 'client-server', 'peer-to-peer', 
                     'real-world', 'mistakes', 'exam', 'extension', 'takeaways', 'videos'];
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex > 0) {
        navigateToSection(sections[currentIndex - 1]);
    }
}

// Accessibility Functions
function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    announceToScreenReader('High contrast mode ' + (document.body.classList.contains('high-contrast') ? 'enabled' : 'disabled'));
}

function toggleDyslexiaFont() {
    document.body.classList.toggle('dyslexia-font');
    announceToScreenReader('Dyslexia-friendly font ' + (document.body.classList.contains('dyslexia-font') ? 'enabled' : 'disabled'));
}

function increaseFontSize() {
    const currentSize = parseFloat(window.getComputedStyle(document.body).fontSize);
    document.body.style.fontSize = (currentSize + 2) + 'px';
    announceToScreenReader('Font size increased');
}

function decreaseFontSize() {
    const currentSize = parseFloat(window.getComputedStyle(document.body).fontSize);
    if (currentSize > 12) {
        document.body.style.fontSize = (currentSize - 2) + 'px';
        announceToScreenReader('Font size decreased');
    }
}

function announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

// Network Simulations
function createNetworkSimulations() {
    createWANSimulation();
    createClientServerSimulation();
    createP2PSimulation();
}

// Enhanced WAN Simulation
function createWANSimulation() {
    const container = document.getElementById('wanSimulation');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Add world map background
    container.style.background = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
    container.style.position = 'relative';
    
    // Add instructions
    const instructions = document.createElement('div');
    instructions.style.cssText = 'position: absolute; top: 10px; left: 10px; color: white; background: rgba(0,0,0,0.7); padding: 10px; border-radius: 5px; font-size: 14px; z-index: 50;';
    instructions.innerHTML = `<strong>🌍 WAN Simulation - How it Works</strong><br>
    1. Click any city to select it as source<br>
    2. Click another city as destination<br>
    3. Watch the packet route through ISP networks<br>
    4. Observe delays at each hop!`;
    container.appendChild(instructions);
    
    // Create cities with realistic positions
    const cities = [
        { name: 'London', x: 250, y: 120, timezone: 'GMT', country: 'UK' },
        { name: 'New York', x: 100, y: 140, timezone: 'EST', country: 'USA' },
        { name: 'Tokyo', x: 450, y: 130, timezone: 'JST', country: 'Japan' },
        { name: 'Sydney', x: 470, y: 250, timezone: 'AEDT', country: 'Australia' },
        { name: 'Dubai', x: 320, y: 160, timezone: 'GST', country: 'UAE' }
    ];
    
    // Add routing nodes (ISP infrastructure)
    const routingNodes = [
        { name: 'Atlantic Cable', x: 175, y: 130, type: 'undersea' },
        { name: 'ME Hub', x: 320, y: 140, type: 'hub' },
        { name: 'Pacific Cable', x: 460, y: 190, type: 'undersea' }
    ];
    
    const devices = [];
    const routers = [];
    const connections = new Map();
    
    // Create routing infrastructure first
    routingNodes.forEach(node => {
        const router = document.createElement('div');
        router.className = 'network-device routing-node';
        router.style.cssText = `
            left: ${node.x}px;
            top: ${node.y}px;
            width: 40px;
            height: 40px;
            background: #FF9800;
            border-radius: 50%;
            z-index: 5;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: white;
            box-shadow: 0 0 15px rgba(255,152,0,0.5);
        `;
        router.innerHTML = '📡';
        router.title = node.name;
        container.appendChild(router);
        routers.push(router);
    });
    
    // Create city nodes
    let selectedCity = null;
    cities.forEach((city, index) => {
        const device = document.createElement('div');
        device.className = 'network-device wan-city';
        device.style.cssText = `
            left: ${city.x}px;
            top: ${city.y}px;
            background: #fff;
            color: #333;
            box-shadow: 0 0 20px rgba(255,255,255,0.5);
            cursor: pointer;
            z-index: 10;
            transition: all 0.3s ease;
        `;
        device.innerHTML = `
            <div style="font-weight: bold;">${city.name}</div>
            <div style="font-size: 10px; opacity: 0.7;">${city.country}</div>
            <div style="font-size: 9px; opacity: 0.5;">${city.timezone}</div>
        `;
        
        device.onclick = () => {
            if (!selectedCity) {
                selectedCity = index;
                device.style.background = '#4CAF50';
                device.style.color = 'white';
                showNotification(`📍 Source: ${city.name} selected. Now click a destination!`, 2000);
            } else if (selectedCity !== index) {
                sendAdvancedWANData(selectedCity, index, cities, devices, routers, container);
                // Reset selection
                devices[selectedCity].style.background = '#fff';
                devices[selectedCity].style.color = '#333';
                selectedCity = null;
            }
        };
        
        device.onmouseover = () => {
            if (selectedCity !== index) {
                device.style.transform = 'scale(1.2)';
                device.style.boxShadow = '0 0 30px rgba(255,255,255,0.8)';
            }
        };
        device.onmouseout = () => {
            device.style.transform = 'scale(1)';
            device.style.boxShadow = '0 0 20px rgba(255,255,255,0.5)';
        };
        
        container.appendChild(device);
        devices.push(device);
    });
    
    // Create all cable connections
    const allConnections = [
        // City to router connections
        [0, 5], [1, 5], [5, 6], [6, 4], [6, 2], [2, 7], [7, 3], [4, 7],
        // Direct city connections for visualization
        [0, 1], [1, 4], [4, 2], [2, 3], [3, 4], [0, 4]
    ];
    
    allConnections.forEach(([from, to]) => {
        const fromNode = from < 5 ? cities[from] : routingNodes[from - 5];
        const toNode = to < 5 ? cities[to] : routingNodes[to - 5];
        const cable = createAdvancedCable(fromNode, toNode);
        container.appendChild(cable);
    });
    
    // Add statistics panel
    const statsPanel = document.createElement('div');
    statsPanel.id = 'wanStats';
    statsPanel.style.cssText = 'position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.8); color: white; padding: 15px; border-radius: 5px; font-size: 12px; min-width: 200px;';
    statsPanel.innerHTML = `
        <strong>📊 Network Statistics</strong><br>
        <div id="statContent">
            Packets Sent: 0<br>
            Average Latency: 0ms<br>
            Total Distance: 0km
        </div>
    `;
    container.appendChild(statsPanel);
    
    // Add ISP ownership info
    const ispBox = document.createElement('div');
    ispBox.style.cssText = 'position: absolute; bottom: 10px; right: 10px; background: rgba(255,255,255,0.9); padding: 10px; border-radius: 5px; font-size: 12px;';
    ispBox.innerHTML = `<strong>🏢 ISP Infrastructure</strong><br>
    London ↔ NY: BT & AT&T<br>
    Dubai Hub: Etisalat<br>
    Tokyo ↔ Sydney: NTT<br>
    <em style="color: #666;">Not owned by users!</em>`;
    container.appendChild(ispBox);
}

function createAdvancedCable(node1, node2) {
    const cable = document.createElement('div');
    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    cable.className = 'network-connection submarine-cable';
    cable.style.cssText = `
        position: absolute;
        left: ${node1.x + 40}px;
        top: ${node1.y + 40}px;
        width: ${length}px;
        height: 2px;
        background: rgba(100, 200, 255, 0.3);
        transform-origin: left center;
        transform: rotate(${angle}deg);
        pointer-events: none;
    `;
    
    return cable;
}

let wanStats = { packets: 0, totalLatency: 0, totalDistance: 0 };

function sendAdvancedWANData(fromIndex, toIndex, cities, devices, routers, container) {
    const fromCity = cities[fromIndex];
    const toCity = cities[toIndex];
    
    // Calculate realistic route through ISP infrastructure
    const route = calculateRealisticRoute(fromIndex, toIndex);
    
    // Create packet with ID
    const packetId = Date.now();
    const packet = document.createElement('div');
    packet.style.cssText = `
        position: absolute;
        width: 30px;
        height: 30px;
        background: #FFD700;
        border-radius: 50%;
        box-shadow: 0 0 20px #FFD700;
        z-index: 30;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
    `;
    packet.innerHTML = '📦';
    container.appendChild(packet);
    
    // Create latency display
    const latencyDisplay = document.createElement('div');
    latencyDisplay.style.cssText = `
        position: absolute;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
        z-index: 35;
        pointer-events: none;
    `;
    container.appendChild(latencyDisplay);
    
    let currentStep = 0;
    let totalLatency = 0;
    let totalDistance = 0;
    
    function animatePacketStep() {
        if (currentStep >= route.length) {
            // Packet arrived
            packet.remove();
            latencyDisplay.remove();
            
            // Update stats
            wanStats.packets++;
            wanStats.totalLatency += totalLatency;
            wanStats.totalDistance += totalDistance;
            
            updateWANStats();
            
            showNotification(`✅ Packet delivered!\nRoute: ${route.map(r => r.name).join(' → ')}\nTotal latency: ${totalLatency}ms\nDistance: ${Math.round(totalDistance)}km`, 4000);
            
            awardXP(10, 'wan_packet_' + packetId);
            return;
        }
        
        const currentNode = route[currentStep];
        const prevNode = currentStep > 0 ? route[currentStep - 1] : null;
        
        // Calculate hop latency
        let hopLatency = 0;
        if (prevNode) {
            const distance = calculateDistance(prevNode, currentNode);
            hopLatency = Math.round(distance / 20) + Math.random() * 10; // Base latency + jitter
            totalDistance += distance;
            totalLatency += hopLatency;
        }
        
        // Move packet
        packet.style.transition = `all ${hopLatency * 20}ms ease`;
        packet.style.left = (currentNode.x + 25) + 'px';
        packet.style.top = (currentNode.y + 25) + 'px';
        
        // Update latency display
        latencyDisplay.style.left = (currentNode.x + 60) + 'px';
        latencyDisplay.style.top = (currentNode.y + 10) + 'px';
        latencyDisplay.textContent = `+${hopLatency}ms`;
        
        // Flash the node
        if (currentNode.element) {
            currentNode.element.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                currentNode.element.style.animation = '';
            }, 500);
        }
        
        // Show hop info
        if (currentStep > 0) {
            const hopInfo = document.createElement('div');
            hopInfo.style.cssText = `
                position: absolute;
                left: ${currentNode.x + 10}px;
                top: ${currentNode.y - 30}px;
                background: rgba(255,255,255,0.9);
                color: #333;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 11px;
                z-index: 25;
                animation: fadeInOut 2s ease;
            `;
            hopInfo.textContent = `Hop ${currentStep}: ${currentNode.type || 'City'}`;
            container.appendChild(hopInfo);
            setTimeout(() => hopInfo.remove(), 2000);
        }
        
        currentStep++;
        setTimeout(animatePacketStep, hopLatency * 20 + 500);
    }
    
    animatePacketStep();
}

function calculateRealisticRoute(from, to) {
    // Define realistic routes that go through ISP infrastructure
    const routes = {
        '0-1': [0, 5, 1], // London → Atlantic Cable → New York
        '1-0': [1, 5, 0], // New York → Atlantic Cable → London
        '0-2': [0, 5, 6, 2], // London → Atlantic → ME Hub → Tokyo
        '2-0': [2, 6, 5, 0], // Tokyo → ME Hub → Atlantic → London
        '0-3': [0, 5, 6, 7, 3], // London → Atlantic → ME → Pacific → Sydney
        '3-0': [3, 7, 6, 5, 0], // Sydney → Pacific → ME → Atlantic → London
        '1-2': [1, 5, 6, 2], // NY → Atlantic → ME → Tokyo
        '2-1': [2, 6, 5, 1], // Tokyo → ME → Atlantic → NY
        '1-3': [1, 5, 6, 7, 3], // NY → Atlantic → ME → Pacific → Sydney
        '3-1': [3, 7, 6, 5, 1], // Sydney → Pacific → ME → Atlantic → NY
        '2-3': [2, 7, 3], // Tokyo → Pacific → Sydney
        '3-2': [3, 7, 2], // Sydney → Pacific → Tokyo
        '0-4': [0, 5, 6, 4], // London → Atlantic → ME → Dubai
        '4-0': [4, 6, 5, 0], // Dubai → ME → Atlantic → London
        '1-4': [1, 5, 6, 4], // NY → Atlantic → ME → Dubai
        '4-1': [4, 6, 5, 1], // Dubai → ME → Atlantic → NY
        '2-4': [2, 6, 4], // Tokyo → ME → Dubai
        '4-2': [4, 6, 2], // Dubai → ME → Tokyo
        '3-4': [3, 7, 6, 4], // Sydney → Pacific → ME → Dubai
        '4-3': [4, 6, 7, 3], // Dubai → ME → Pacific → Sydney
    };
    
    const key = `${from}-${to}`;
    const routeIndices = routes[key] || [from, to];
    
    // Convert to node objects with positions
    const cities = [
        { name: 'London', x: 250, y: 120, type: 'City', element: null },
        { name: 'New York', x: 100, y: 140, type: 'City', element: null },
        { name: 'Tokyo', x: 450, y: 130, type: 'City', element: null },
        { name: 'Sydney', x: 470, y: 250, type: 'City', element: null },
        { name: 'Dubai', x: 320, y: 160, type: 'City', element: null },
        { name: 'Atlantic Cable', x: 175, y: 130, type: 'Undersea Cable', element: null },
        { name: 'ME Hub', x: 320, y: 140, type: 'ISP Hub', element: null },
        { name: 'Pacific Cable', x: 460, y: 190, type: 'Undersea Cable', element: null }
    ];
    
    return routeIndices.map(index => cities[index]);
}

function updateWANStats() {
    const statsContent = document.getElementById('statContent');
    if (statsContent) {
        const avgLatency = wanStats.packets > 0 ? Math.round(wanStats.totalLatency / wanStats.packets) : 0;
        statsContent.innerHTML = `
            Packets Sent: ${wanStats.packets}<br>
            Average Latency: ${avgLatency}ms<br>
            Total Distance: ${Math.round(wanStats.totalDistance)}km<br>
            <span style="color: #4CAF50;">✓ All via ISP networks</span>
        `;
    }
}

// Enhanced Client-Server Simulation
function createClientServerSimulation() {
    const container = document.getElementById('clientServerSim');
    if (!container) return;
    
    container.innerHTML = '';
    container.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    // Instructions
    const instructions = document.createElement('div');
    instructions.style.cssText = 'position: absolute; top: 10px; left: 10px; color: white; background: rgba(0,0,0,0.7); padding: 10px; border-radius: 5px; font-size: 14px; z-index: 50;';
    instructions.innerHTML = `<strong>🖥️ Client-Server Demo - Interactive Features</strong><br>
    • Click clients to request files (see queue management)<br>
    • Click server for management tasks<br>
    • Try the "Server Failure" button to see what happens!<br>
    • Watch the server load indicator`;
    container.appendChild(instructions);
    
    // Server state
    const serverState = {
        online: true,
        load: 0,
        queue: [],
        processing: false,
        filesStored: ['Report.docx', 'Database.sql', 'Backup.zip', 'Config.xml'],
        logs: []
    };
    
    // Create central server with enhanced features
    const server = document.createElement('div');
    server.className = 'network-device server-main';
    server.style.cssText = `
        left: 250px;
        top: 110px;
        width: 100px;
        height: 100px;
        background: linear-gradient(135deg, #f44336, #e91e63);
        color: white;
        font-weight: bold;
        box-shadow: 0 0 30px rgba(244,67,54,0.5);
        cursor: pointer;
        z-index: 15;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
    `;
    server.innerHTML = `
        <div>SERVER</div>
        <div style="font-size: 10px; margin-top: 5px;">💾 Storage</div>
        <div style="font-size: 10px;">🔒 Security</div>
        <div style="font-size: 10px;">📊 Monitor</div>
    `;
    
    // Add server load indicator
    const loadIndicator = document.createElement('div');
    loadIndicator.id = 'serverLoad';
    loadIndicator.style.cssText = `
        position: absolute;
        bottom: -25px;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 8px;
        background: #333;
        border-radius: 4px;
        overflow: hidden;
    `;
    loadIndicator.innerHTML = '<div id="loadBar" style="height: 100%; width: 0%; background: #4CAF50; transition: width 0.3s ease;"></div>';
    server.appendChild(loadIndicator);
    
    const serverActions = ['Backup All Data', 'Update Software', 'Security Scan', 'Monitor Clients', 'User Management'];
    server.onclick = () => {
        if (!serverState.online) {
            showNotification('❌ Server is offline! No actions possible.', 2000);
            return;
        }
        const action = serverActions[Math.floor(Math.random() * serverActions.length)];
        performAdvancedServerAction(action, clients, serverState);
    };
    
    container.appendChild(server);
    
    // Create clients with enhanced features
    const clientPositions = [
        { x: 50, y: 50, name: 'Admin PC', user: 'Administrator', priority: 'high' },
        { x: 450, y: 50, name: 'Teacher PC', user: 'Ms. Smith', priority: 'medium' },
        { x: 50, y: 200, name: 'Student PC 1', user: 'Student A', priority: 'low' },
        { x: 450, y: 200, name: 'Student PC 2', user: 'Student B', priority: 'low' }
    ];
    
    const clients = [];
    const connections = [];
    
    clientPositions.forEach((pos, index) => {
        // Create connection first
        const connection = document.createElement('div');
        connection.className = 'network-connection client-cable';
        const dx = 300 - pos.x - 40;
        const dy = 160 - pos.y - 40;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        connection.style.cssText = `
            position: absolute;
            left: ${pos.x + 40}px;
            top: ${pos.y + 40}px;
            width: ${length}px;
            height: 3px;
            background: rgba(255,255,255,0.3);
            transform-origin: left center;
            transform: rotate(${angle}deg);
        `;
        container.appendChild(connection);
        connections.push(connection);
        
        // Create client
        const client = document.createElement('div');
        client.className = 'network-device client-node';
        client.style.cssText = `
            left: ${pos.x}px;
            top: ${pos.y}px;
            background: #2196F3;
            color: white;
            cursor: pointer;
            z-index: 10;
            position: relative;
        `;
        client.innerHTML = `
            <div style="font-weight: bold;">Client ${index + 1}</div>
            <div style="font-size: 10px;">${pos.name}</div>
            <div style="font-size: 9px; opacity: 0.7;">${pos.user}</div>
        `;
        
        // Add status indicator
        const statusDot = document.createElement('div');
        statusDot.className = 'client-status';
        statusDot.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            width: 10px;
            height: 10px;
            background: #4CAF50;
            border-radius: 50%;
        `;
        client.appendChild(statusDot);
        
        client.onclick = () => {
            if (!serverState.online) {
                client.querySelector('.client-status').style.background = '#f44336';
                showNotification(`❌ ${pos.user}: Cannot connect - Server is offline!`, 2000);
                return;
            }
            advancedClientRequest(index, pos, { x: 300, y: 160 }, serverState, clients);
        };
        
        container.appendChild(client);
        clients.push({ element: client, ...pos, connection });
    });
    
    // Server control panel
    const controlPanel = document.createElement('div');
    controlPanel.style.cssText = 'position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.95); padding: 15px; border-radius: 5px; font-size: 12px; width: 200px;';
    controlPanel.innerHTML = `
        <strong>🎛️ Server Controls</strong><br>
        <button id="toggleServer" class="btn btn-danger" style="margin-top: 10px; width: 100%;">Simulate Server Failure</button>
        <div id="queueDisplay" style="margin-top: 10px;">
            <strong>Request Queue:</strong>
            <div id="queueList" style="max-height: 100px; overflow-y: auto;">Empty</div>
        </div>
        <div id="serverLogs" style="margin-top: 10px;">
            <strong>Server Logs:</strong>
            <div id="logList" style="max-height: 80px; overflow-y: auto; font-size: 10px; font-family: monospace;">System ready...</div>
        </div>
    `;
    container.appendChild(controlPanel);
    
    // Server toggle functionality
    document.getElementById('toggleServer').onclick = () => {
        serverState.online = !serverState.online;
        const btn = document.getElementById('toggleServer');
        
        if (serverState.online) {
            server.style.background = 'linear-gradient(135deg, #f44336, #e91e63)';
            btn.textContent = 'Simulate Server Failure';
            btn.className = 'btn btn-danger';
            addServerLog('Server restored', serverState);
            showNotification('✅ Server is back online!', 2000);
            
            // Restore client connections
            clients.forEach(client => {
                client.element.querySelector('.client-status').style.background = '#4CAF50';
            });
        } else {
            server.style.background = '#666';
            server.style.animation = 'none';
            btn.textContent = 'Restore Server';
            btn.className = 'btn btn-success';
            addServerLog('SERVER FAILURE!', serverState);
            showNotification('💥 Server has failed! All services unavailable!', 3000);
            
            // Show all clients disconnected
            clients.forEach(client => {
                client.element.querySelector('.client-status').style.background = '#f44336';
            });
            
            // Clear queue
            serverState.queue = [];
            updateQueueDisplay(serverState);
        }
    };
    
    // Initialize display
    updateQueueDisplay(serverState);
}

function advancedClientRequest(clientIndex, clientPos, serverPos, serverState, clients) {
    const fileTypes = [
        { name: 'Report.docx', size: '2.3 MB', icon: '📄' },
        { name: 'Presentation.pptx', size: '15.7 MB', icon: '📊' },
        { name: 'Database_backup.sql', size: '156 MB', icon: '💾' },
        { name: 'Student_records.xlsx', size: '8.4 MB', icon: '📑' }
    ];
    
    const requestedFile = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    const requestId = Date.now();
    
    // Add to queue
    serverState.queue.push({
        id: requestId,
        client: clientIndex,
        clientName: clientPos.name,
        user: clientPos.user,
        file: requestedFile,
        priority: clientPos.priority,
        timestamp: new Date().toLocaleTimeString()
    });
    
    updateQueueDisplay(serverState);
    addServerLog(`Request from ${clientPos.user}: ${requestedFile.name}`, serverState);
    
    // Update server load
    updateServerLoad(serverState);
    
    // Create request packet
    const request = createPacket('#2196F3', '❓');
    const container = document.getElementById('clientServerSim');
    container.appendChild(request);
    
    // Animate to server
    animatePacket(request, clientPos, serverPos, () => {
        request.remove();
        
        // Process queue if not already processing
        if (!serverState.processing) {
            processServerQueue(serverState, clients, serverPos);
        }
    });
}

function processServerQueue(serverState, clients, serverPos) {
    if (serverState.queue.length === 0 || !serverState.online) {
        serverState.processing = false;
        updateServerLoad(serverState);
        return;
    }
    
    serverState.processing = true;
    
    // Sort queue by priority
    serverState.queue.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    // Process first request
    const request = serverState.queue.shift();
    updateQueueDisplay(serverState);
    
    // Show processing
    showNotification(`🔄 Server processing ${request.user}'s request for ${request.file.name}`, 1500);
    addServerLog(`Processing: ${request.file.name} (${request.file.size})`, serverState);
    
    // Simulate processing time based on file size
    const processingTime = parseInt(request.file.size) * 10;
    
    setTimeout(() => {
        if (!serverState.online) {
            addServerLog('Processing failed - server offline', serverState);
            serverState.processing = false;
            return;
        }
        
        // Send file back
        const response = createPacket('#4CAF50', request.file.icon);
        const container = document.getElementById('clientServerSim');
        container.appendChild(response);
        
        const client = clients[request.client];
        animatePacket(response, serverPos, client, () => {
            response.remove();
            showNotification(`✅ ${request.file.name} delivered to ${request.user}`, 2000);
            addServerLog(`Delivered: ${request.file.name} to ${request.user}`, serverState);
            awardXP(5, 'cs_request_processed_' + request.id);
            
            // Continue processing queue
            setTimeout(() => processServerQueue(serverState, clients, serverPos), 500);
        });
    }, processingTime);
}

function performAdvancedServerAction(action, clients, serverState) {
    showNotification(`🖥️ Server: ${action}`, 2000);
    addServerLog(`Admin action: ${action}`, serverState);
    
    if (action === 'Backup All Data') {
        // Visual backup animation
        clients.forEach((client, index) => {
            setTimeout(() => {
                // Create backup packet from client to server
                const backup = createPacket('#9C27B0', '💾');
                const container = document.getElementById('clientServerSim');
                container.appendChild(backup);
                
                animatePacket(backup, client, { x: 300, y: 160 }, () => {
                    backup.remove();
                    client.element.style.animation = 'backup-flash 1s ease';
                    setTimeout(() => client.element.style.animation = '', 1000);
                });
            }, index * 300);
        });
        
        setTimeout(() => {
            showNotification('✅ All client data backed up successfully!', 2000);
            addServerLog('Backup completed for all clients', serverState);
        }, clients.length * 300 + 1000);
        
    } else if (action === 'Security Scan') {
        // Create scanning animation
        const scanner = document.createElement('div');
        scanner.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 5px;
            background: linear-gradient(90deg, transparent, #4CAF50, transparent);
            animation: scan 2s linear;
        `;
        document.getElementById('clientServerSim').appendChild(scanner);
        
        setTimeout(() => {
            scanner.remove();
            showNotification('✅ Security scan complete - No threats detected', 2000);
            addServerLog('Security scan: All clear', serverState);
        }, 2000);
        
    } else if (action === 'Update Software') {
        // Send updates to all clients
        clients.forEach((client, index) => {
            setTimeout(() => {
                const update = createPacket('#FF9800', '⬆️');
                const container = document.getElementById('clientServerSim');
                container.appendChild(update);
                
                animatePacket(update, { x: 300, y: 160 }, client, () => {
                    update.remove();
                    // Show update progress on client
                    const progress = document.createElement('div');
                    progress.style.cssText = `
                        position: absolute;
                        bottom: -5px;
                        left: 0;
                        width: 0%;
                        height: 3px;
                        background: #FF9800;
                        transition: width 1s ease;
                    `;
                    client.element.appendChild(progress);
                    
                    setTimeout(() => {
                        progress.style.width = '100%';
                        setTimeout(() => progress.remove(), 1100);
                    }, 50);
                });
            }, index * 400);
        });
    }
    
    awardXP(8, 'server_action_' + action.replace(/\s/g, '_'));
}

function updateQueueDisplay(serverState) {
    const queueList = document.getElementById('queueList');
    if (serverState.queue.length === 0) {
        queueList.innerHTML = '<em style="color: #666;">Empty</em>';
    } else {
        queueList.innerHTML = serverState.queue.map((req, index) => `
            <div style="padding: 2px 0; border-bottom: 1px solid #eee;">
                ${index + 1}. ${req.user} - ${req.file.name}
                <span style="float: right; color: ${req.priority === 'high' ? '#f44336' : req.priority === 'medium' ? '#FF9800' : '#4CAF50'};">
                    ${req.priority}
                </span>
            </div>
        `).join('');
    }
}

function updateServerLoad(serverState) {
    const load = Math.min((serverState.queue.length * 20) + (serverState.processing ? 20 : 0), 100);
    serverState.load = load;
    
    const loadBar = document.getElementById('loadBar');
    if (loadBar) {
        loadBar.style.width = load + '%';
        loadBar.style.background = load > 80 ? '#f44336' : load > 50 ? '#FF9800' : '#4CAF50';
    }
}

function addServerLog(message, serverState) {
    const timestamp = new Date().toLocaleTimeString();
    serverState.logs.unshift(`[${timestamp}] ${message}`);
    serverState.logs = serverState.logs.slice(0, 10); // Keep last 10 logs
    
    const logList = document.getElementById('logList');
    if (logList) {
        logList.innerHTML = serverState.logs.join('<br>');
    }
}

// Enhanced P2P Simulation
function createP2PSimulation() {
    const container = document.getElementById('p2pSim');
    if (!container) return;
    
    container.innerHTML = '';
    container.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
    
    // Instructions
    const instructions = document.createElement('div');
    instructions.style.cssText = 'position: absolute; top: 10px; left: 10px; color: white; background: rgba(0,0,0,0.7); padding: 10px; border-radius: 5px; font-size: 14px; z-index: 50;';
    instructions.innerHTML = `<strong>🔗 Peer-to-Peer Demo - Advanced Features</strong><br>
    • Click peers to share files directly<br>
    • Try "Remove Peer" to see network resilience<br>
    • Watch how peers discover each other<br>
    • Notice: NO central point of failure!`;
    container.appendChild(instructions);
    
    // P2P network state
    const p2pState = {
        peers: [],
        connections: new Map(),
        activeTransfers: new Set(),
        sharedFiles: new Map(),
        networkStats: { transfers: 0, totalData: 0 }
    };
    
    // Create peer nodes with realistic data
    const peerData = [
        { x: 150, y: 50, name: 'Alice', status: 'online', files: ['Music.mp3', 'Photo.jpg', 'Notes.txt'], bandwidth: 100 },
        { x: 350, y: 50, name: 'Bob', status: 'online', files: ['Video.mp4', 'Game.exe', 'Music.mp3'], bandwidth: 50 },
        { x: 100, y: 200, name: 'Charlie', status: 'online', files: ['Doc.pdf', 'Code.py', 'Data.csv'], bandwidth: 75 },
        { x: 250, y: 150, name: 'Diana', status: 'online', files: ['Art.png', 'Note.txt', 'Music.mp3'], bandwidth: 100 },
        { x: 400, y: 200, name: 'Eve', status: 'online', files: ['Data.csv', 'App.zip', 'Video.mp4'], bandwidth: 25 }
    ];
    
    // Create peers
    peerData.forEach((data, index) => {
        const peer = document.createElement('div');
        peer.className = 'network-device peer-node';
        peer.style.cssText = `
            left: ${data.x}px;
            top: ${data.y}px;
            background: linear-gradient(135deg, #4CAF50, #8BC34A);
            color: white;
            cursor: pointer;
            z-index: 10;
            position: relative;
        `;
        peer.innerHTML = `
            <div style="font-weight: bold;">${data.name}</div>
            <div style="font-size: 10px;">📁 ${data.files.length} files</div>
            <div style="font-size: 9px;">⚡ ${data.bandwidth} Mbps</div>
        `;
        
        // Add online status indicator
        const statusDot = document.createElement('div');
        statusDot.className = 'peer-status';
        statusDot.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            width: 10px;
            height: 10px;
            background: #4CAF50;
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
        `;
        peer.appendChild(statusDot);
        
        peer.onclick = () => {
            if (data.status === 'online') {
                initiateAdvancedP2PTransfer(index, p2pState);
            } else {
                showNotification(`❌ ${data.name} is offline!`, 2000);
            }
        };
        
        container.appendChild(peer);
        p2pState.peers.push({ element: peer, ...data, id: index });
    });
    
    // Create potential connections (mesh topology)
    for (let i = 0; i < peerData.length; i++) {
        for (let j = i + 1; j < peerData.length; j++) {
            const connection = createP2PConnection(peerData[i], peerData[j]);
            connection.style.opacity = '0';
            container.appendChild(connection);
            p2pState.connections.set(`${i}-${j}`, connection);
        }
    }
    
    // Control panel
    const controlPanel = document.createElement('div');
    controlPanel.style.cssText = 'position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.95); padding: 15px; border-radius: 5px; font-size: 12px; width: 220px;';
    controlPanel.innerHTML = `
        <strong>🎛️ P2P Network Controls</strong><br>
        <button id="removePeer" class="btn btn-danger" style="margin-top: 10px; width: 100%;">Remove Random Peer</button>
        <button id="addPeer" class="btn btn-success" style="margin-top: 5px; width: 100%;">Add New Peer</button>
        <div style="margin-top: 10px;">
            <strong>Network Stats:</strong>
            <div id="p2pStats">
                Active Peers: ${p2pState.peers.filter(p => p.status === 'online').length}<br>
                Total Transfers: 0<br>
                Data Shared: 0 MB
            </div>
        </div>
        <div style="margin-top: 10px;">
            <strong>File Distribution:</strong>
            <div id="fileDistribution" style="font-size: 10px;">
                Loading...
            </div>
        </div>
    `;
    container.appendChild(controlPanel);
    
    // Peer removal functionality
    document.getElementById('removePeer').onclick = () => {
        const onlinePeers = p2pState.peers.filter(p => p.status === 'online');
        if (onlinePeers.length > 2) {
            const peerToRemove = onlinePeers[Math.floor(Math.random() * onlinePeers.length)];
            simulatePeerFailure(peerToRemove, p2pState);
        } else {
            showNotification('⚠️ Need at least 2 peers online!', 2000);
        }
    };
    
    // Peer addition functionality
    document.getElementById('addPeer').onclick = () => {
        if (p2pState.peers.filter(p => p.status === 'online').length < 7) {
            addNewPeer(p2pState, container);
        } else {
            showNotification('⚠️ Network at maximum capacity!', 2000);
        }
    };
    
    // Update file distribution display
    updateFileDistribution(p2pState);
    
    // Start peer discovery animation
    setTimeout(() => startPeerDiscovery(p2pState), 1000);
}

function initiateAdvancedP2PTransfer(fromIndex, p2pState) {
    const fromPeer = p2pState.peers[fromIndex];
    
    // Find peers that need files this peer has
    const availablePeers = p2pState.peers.filter((peer, index) => {
        if (index === fromIndex || peer.status === 'offline') return false;
        
        // Check if this peer needs any files from fromPeer
        const neededFiles = fromPeer.files.filter(file => !peer.files.includes(file));
        return neededFiles.length > 0;
    });
    
    if (availablePeers.length === 0) {
        showNotification(`ℹ️ ${fromPeer.name} has no unique files to share!`, 2000);
        return;
    }
    
    // Select random peer and file
    const toPeer = availablePeers[Math.floor(Math.random() * availablePeers.length)];
    const filesToShare = fromPeer.files.filter(file => !toPeer.files.includes(file));
    const file = filesToShare[Math.floor(Math.random() * filesToShare.length)];
    const fileSize = Math.round(Math.random() * 50 + 5); // 5-55 MB
    
    // Check if connection already active
    const connectionKey = fromIndex < toPeer.id ? `${fromIndex}-${toPeer.id}` : `${toPeer.id}-${fromIndex}`;
    if (p2pState.activeTransfers.has(connectionKey)) {
        showNotification(`⚠️ Transfer already in progress between ${fromPeer.name} and ${toPeer.name}!`, 2000);
        return;
    }
    
    p2pState.activeTransfers.add(connectionKey);
    
    // Show connection
    const connection = p2pState.connections.get(connectionKey);
    if (connection) {
        connection.style.opacity = '1';
        connection.style.background = '#FFD700';
        connection.style.height = '4px';
        connection.style.boxShadow = '0 0 10px #FFD700';
    }
    
    // Calculate transfer time based on bandwidth
    const minBandwidth = Math.min(fromPeer.bandwidth, toPeer.bandwidth);
    const transferTime = (fileSize / minBandwidth) * 1000 + 500;
    
    // Create file packet with progress
    const packet = createPacket('#FFD700', '📄');
    const container = document.getElementById('p2pSim');
    container.appendChild(packet);
    
    // Add transfer info
    const transferInfo = document.createElement('div');
    transferInfo.style.cssText = `
        position: absolute;
        left: ${(fromPeer.x + toPeer.x) / 2}px;
        top: ${(fromPeer.y + toPeer.y) / 2 - 30}px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 11px;
        z-index: 40;
    `;
    transferInfo.innerHTML = `${file} (${fileSize}MB)<br>Speed: ${minBandwidth}Mbps`;
    container.appendChild(transferInfo);
    
    // Animate transfer with progress
    packet.style.transition = `all ${transferTime}ms linear`;
    animatePacket(packet, fromPeer, toPeer, () => {
        packet.remove();
        transferInfo.remove();
        
        // Reset connection
        if (connection) {
            connection.style.opacity = '0.1';
            connection.style.background = 'rgba(76,175,80,0.5)';
            connection.style.height = '2px';
            connection.style.boxShadow = 'none';
        }
        
        p2pState.activeTransfers.delete(connectionKey);
        
        // Update peer's file list
        toPeer.files.push(file);
        toPeer.element.querySelector('div:nth-child(2)').textContent = `📁 ${toPeer.files.length} files`;
        
        // Update stats
        p2pState.networkStats.transfers++;
        p2pState.networkStats.totalData += fileSize;
        updateP2PStats(p2pState);
        updateFileDistribution(p2pState);
        
        showNotification(`✅ ${fromPeer.name} → ${toPeer.name}: ${file} (${fileSize}MB) transferred!`, 2500);
        awardXP(5, 'p2p_transfer_' + Date.now());
        
        // Chance of reciprocal sharing
        if (Math.random() > 0.5 && toPeer.status === 'online') {
            setTimeout(() => {
                if (toPeer.status === 'online') {
                    initiateAdvancedP2PTransfer(toPeer.id, p2pState);
                }
            }, 1000);
        }
    });
}

function simulatePeerFailure(peer, p2pState) {
    peer.status = 'offline';
    peer.element.style.background = '#666';
    peer.element.style.opacity = '0.5';
    peer.element.querySelector('.peer-status').style.background = '#f44336';
    peer.element.querySelector('.peer-status').style.animation = 'none';
    
    showNotification(`💥 ${peer.name} has gone offline! But the network continues...`, 3000);
    
    // Hide all connections to this peer
    p2pState.connections.forEach((connection, key) => {
        if (key.includes(peer.id.toString())) {
            connection.style.opacity = '0';
        }
    });
    
    updateP2PStats(p2pState);
    
    // Demonstrate network resilience - other peers continue sharing
    setTimeout(() => {
        const onlinePeers = p2pState.peers.filter(p => p.status === 'online');
        if (onlinePeers.length >= 2) {
            const randomPeer = onlinePeers[Math.floor(Math.random() * onlinePeers.length)];
            initiateAdvancedP2PTransfer(randomPeer.id, p2pState);
            showNotification('💪 Network continues functioning without the failed peer!', 2000);
        }
    }, 1500);
}

function addNewPeer(p2pState, container) {
    const names = ['Frank', 'Grace', 'Henry', 'Iris', 'Jack'];
    const usedNames = p2pState.peers.map(p => p.name);
    const availableNames = names.filter(n => !usedNames.includes(n));
    
    if (availableNames.length === 0) return;
    
    const newPeer = {
        id: p2pState.peers.length,
        name: availableNames[0],
        x: 50 + Math.random() * 400,
        y: 50 + Math.random() * 200,
        status: 'online',
        files: ['NewFile.txt'],
        bandwidth: Math.round(Math.random() * 75 + 25)
    };
    
    // Create peer element
    const peer = document.createElement('div');
    peer.className = 'network-device peer-node';
    peer.style.cssText = `
        left: ${newPeer.x}px;
        top: ${newPeer.y}px;
        background: linear-gradient(135deg, #4CAF50, #8BC34A);
        color: white;
        cursor: pointer;
        z-index: 10;
        position: relative;
        animation: fadeIn 0.5s ease;
    `;
    peer.innerHTML = `
        <div style="font-weight: bold;">${newPeer.name}</div>
        <div style="font-size: 10px;">📁 ${newPeer.files.length} files</div>
        <div style="font-size: 9px;">⚡ ${newPeer.bandwidth} Mbps</div>
    `;
    
    const statusDot = document.createElement('div');
    statusDot.className = 'peer-status';
    statusDot.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        width: 10px;
        height: 10px;
        background: #4CAF50;
        border-radius: 50%;
        animation: pulse 2s ease-in-out infinite;
    `;
    peer.appendChild(statusDot);
    
    peer.onclick = () => {
        if (newPeer.status === 'online') {
            initiateAdvancedP2PTransfer(newPeer.id, p2pState);
        }
    };
    
    container.appendChild(peer);
    newPeer.element = peer;
    p2pState.peers.push(newPeer);
    
    // Create connections to existing peers
    p2pState.peers.forEach((existingPeer, index) => {
        if (index < newPeer.id) {
            const connection = createP2PConnection(existingPeer, newPeer);
            connection.style.opacity = '0';
            container.appendChild(connection);
            p2pState.connections.set(`${index}-${newPeer.id}`, connection);
        }
    });
    
    showNotification(`✨ ${newPeer.name} joined the network!`, 2000);
    updateP2PStats(p2pState);
    
    // Start discovery process
    setTimeout(() => discoverPeers(newPeer, p2pState), 500);
}

function startPeerDiscovery(p2pState) {
    // Simulate peer discovery process
    let discovered = 0;
    const discoveryInterval = setInterval(() => {
        const connections = Array.from(p2pState.connections.entries());
        if (discovered < connections.length) {
            const [key, connection] = connections[discovered];
            connection.style.opacity = '0.1';
            connection.style.transition = 'opacity 0.5s ease';
            discovered++;
        } else {
            clearInterval(discoveryInterval);
            showNotification('✅ Peer discovery complete! Network ready.', 2000);
        }
    }, 200);
}

function discoverPeers(newPeer, p2pState) {
    // Animate discovery of other peers
    p2pState.peers.forEach((peer, index) => {
        if (peer.id !== newPeer.id && peer.status === 'online') {
            setTimeout(() => {
                const connectionKey = index < newPeer.id ? `${index}-${newPeer.id}` : `${newPeer.id}-${index}`;
                const connection = p2pState.connections.get(connectionKey);
                if (connection) {
                    connection.style.opacity = '0.1';
                    connection.style.transition = 'opacity 0.5s ease';
                }
            }, index * 300);
        }
    });
}

function updateP2PStats(p2pState) {
    const statsDiv = document.getElementById('p2pStats');
    if (statsDiv) {
        const onlinePeers = p2pState.peers.filter(p => p.status === 'online').length;
        statsDiv.innerHTML = `
            Active Peers: ${onlinePeers}<br>
            Total Transfers: ${p2pState.networkStats.transfers}<br>
            Data Shared: ${p2pState.networkStats.totalData} MB<br>
            <span style="color: ${onlinePeers >= 2 ? '#4CAF50' : '#f44336'};">
                ${onlinePeers >= 2 ? '✓ Network operational' : '⚠️ Need more peers'}
            </span>
        `;
    }
}

function updateFileDistribution(p2pState) {
    const distDiv = document.getElementById('fileDistribution');
    if (distDiv) {
        const fileCount = new Map();
        
        p2pState.peers.forEach(peer => {
            peer.files.forEach(file => {
                fileCount.set(file, (fileCount.get(file) || 0) + 1);
            });
        });
        
        const sortedFiles = Array.from(fileCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        distDiv.innerHTML = sortedFiles.map(([file, count]) => {
            const percentage = (count / p2pState.peers.length) * 100;
            return `${file}: ${count} peers (${Math.round(percentage)}%)`;
        }).join('<br>');
    }
}

// Helper Functions
function createPacket(color, icon) {
    const packet = document.createElement('div');
    packet.style.cssText = `
        position: absolute;
        width: 30px;
        height: 30px;
        background: ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 0 20px ${color};
        z-index: 30;
    `;
    packet.textContent = icon;
    return packet;
}

function animatePacket(packet, from, to, callback) {
    packet.style.left = (from.x + 25) + 'px';
    packet.style.top = (from.y + 25) + 'px';
    
    setTimeout(() => {
        packet.style.transition = 'all 1s ease';
        packet.style.left = (to.x + 25) + 'px';
        packet.style.top = (to.y + 25) + 'px';
        
        setTimeout(callback, 1000);
    }, 50);
}

function calculateDistance(node1, node2) {
    // Simplified distance calculation
    const dx = Math.abs(node1.x - node2.x);
    const dy = Math.abs(node1.y - node2.y);
    return Math.round(Math.sqrt(dx * dx + dy * dy) * 30); // Scale to realistic km
}

function showNotification(message, duration = 2000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-size: 14px;
        z-index: 1000;
        animation: slideUp 0.3s ease;
        white-space: pre-line;
        max-width: 400px;
        text-align: center;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Initialize tooltips for better education
function addEducationalTooltips() {
    // Add tooltips to network devices
    document.querySelectorAll('.wan-city').forEach(city => {
        city.title = 'WAN nodes represent cities connected through ISP infrastructure. Click to see how data travels across continents!';
    });
    
    document.querySelectorAll('.routing-node').forEach(node => {
        node.title = 'ISP routing infrastructure - These cables and hubs are owned by telecommunications companies, not by users!';
    });
    
    document.querySelectorAll('.server-main').forEach(server => {
        server.title = 'Central server manages all network resources. Click to perform administrative tasks!';
    });
    
    document.querySelectorAll('.client-node').forEach(client => {
        client.title = 'Client computers request services from the server. All communication goes through the central server.';
    });
    
    document.querySelectorAll('.peer-node').forEach(peer => {
        peer.title = 'Peer computers can share directly with each other - no central server needed!';
    });
}

// Call this after creating simulations
setTimeout(addEducationalTooltips, 1000);

// Add animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    @keyframes backup-flash {
        0%, 100% { background: #2196F3; }
        50% { background: #4CAF50; }
    }
    
    @keyframes scan {
        from { top: 0; }
        to { top: 100%; }
    }
    
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(100%); opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes fadeInOut {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }
    
    .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.3s ease;
    }
    
    .btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    
    .btn-danger {
        background: #f44336;
        color: white;
    }
    
    .btn-success {
        background: #4CAF50;
        color: white;
    }
    
    .routing-node {
        animation: glow 2s ease-in-out infinite;
    }
    
    @keyframes glow {
        0%, 100% { box-shadow: 0 0 15px rgba(255,152,0,0.5); }
        50% { box-shadow: 0 0 25px rgba(255,152,0,0.8); }
    }
`;
document.head.appendChild(style);

// Drawing Canvas
let isDrawing = false;
let canvas, ctx;

function showDrawingCanvas() {
    const container = document.getElementById('canvasContainer');
    container.style.display = 'block';
    
    canvas = document.getElementById('drawingCanvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 600;
    canvas.height = 300;
    
    // Setup drawing
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch support
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#333';
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                     e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function hideCanvas() {
    document.getElementById('canvasContainer').style.display = 'none';
}

// Answer Checking Functions
function normalizeAnswer(answer) {
    return answer.toLowerCase().trim().replace(/\s+/g, ' ');
}

function checkSynonyms(answer, correctAnswers) {
    const normalized = normalizeAnswer(answer);
    return correctAnswers.some(correct => {
        const normalizedCorrect = normalizeAnswer(correct);
        return normalized.includes(normalizedCorrect) || 
               normalizedCorrect.includes(normalized) ||
               calculateSimilarity(normalized, normalizedCorrect) > 0.8;
    });
}

function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = getEditDistance(longer, shorter);
    return (longer.length - editDistance) / parseFloat(longer.length);
}

function getEditDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

// Specific Task Functions

// Starter Activity
function resetStarterActivity() {
    const container = document.getElementById('starterItems');
    const items = container.querySelectorAll('.drag-item');
    items.forEach(item => {
        item.style.display = 'block';
        container.appendChild(item);
    });
    
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.innerHTML = zone.dataset.zone === 'wan' ? 'Drop WAN items here' : 'Drop LAN items here';
        zone.classList.remove('correct', 'incorrect');
    });
    
    document.getElementById('starterFeedback').style.display = 'none';
}

// WAN Section
function checkWANReflection() {
    const answer = document.getElementById('wanReflection').value;
    const feedback = document.getElementById('wanReflectionFeedback');
    
    if (answer.length < 20) {
        feedback.textContent = "Please write a more detailed observation about the simulation.";
        feedback.className = 'feedback error';
        feedback.style.display = 'block';
        return;
    }
    
    const keywords = ['distance', 'far', 'geographical', 'cities', 'countries', 'large', 'spread', 
                     'latency', 'delay', 'packet', 'ISP', 'infrastructure', 'telecom', 'route', 'slow'];
    const keywordCount = keywords.filter(keyword => answer.toLowerCase().includes(keyword)).length;
    
    if (keywordCount >= 3) {
        feedback.textContent = "Excellent observation! You've clearly understood how distance and infrastructure affect WAN communications.";
        feedback.className = 'feedback success';
        feedback.style.display = 'block';
        awardXP(15, 'wan_reflection');
    } else if (keywordCount >= 1) {
        feedback.textContent = "Good observation! WANs indeed involve large distances and rely on ISP infrastructure.";
        feedback.className = 'feedback success';
        feedback.style.display = 'block';
        awardXP(10, 'wan_reflection');
    } else {
        feedback.textContent = "Good effort! Try mentioning the packet delays, routing through ISPs, or how distance affects transmission.";
        feedback.className = 'feedback success';
        feedback.style.display = 'block';
        awardXP(5, 'wan_reflection');
    }
}

let selectedWANOptions = new Set();

function selectWANOption(button) {
    button.classList.toggle('selected');
    const isCorrect = button.dataset.correct === 'true';
    
    if (button.classList.contains('selected')) {
        selectedWANOptions.add({ element: button, correct: isCorrect });
    } else {
        selectedWANOptions.forEach(opt => {
            if (opt.element === button) {
                selectedWANOptions.delete(opt);
            }
        });
    }
}

function checkWANQuiz() {
    const feedback = document.getElementById('wanQuizFeedback');
    let correct = 0;
    let total = 0;
    
    document.querySelectorAll('#wanQuizOptions .quiz-option').forEach(option => {
        const isCorrect = option.dataset.correct === 'true';
        const isSelected = option.classList.contains('selected');
        
        if (isCorrect) total++;
        
        if (isSelected && isCorrect) {
            option.classList.add('correct');
            correct++;
        } else if (isSelected && !isCorrect) {
            option.classList.add('incorrect');
        } else if (!isSelected && isCorrect) {
            option.classList.add('correct');
        }
    });
    
    if (correct === total && selectedWANOptions.size === total) {
        feedback.textContent = "Perfect! You understand WAN characteristics perfectly! 🎉";
        feedback.className = 'feedback success';
        awardXP(20, 'wan_quiz');
        unlockAchievement('quizWhiz');
    } else {
        feedback.textContent = `You got ${correct} out of ${total} correct. Review the highlighted answers.`;
        feedback.className = 'feedback error';
        awardXP(10, 'wan_quiz');
    }
    
    feedback.style.display = 'block';
}

function resetWANQuiz() {
    selectedWANOptions.clear();
    document.querySelectorAll('#wanQuizOptions .quiz-option').forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    document.getElementById('wanQuizFeedback').style.display = 'none';
}

// LAN Section
function checkLANBlanks() {
    const blank1 = document.getElementById('lanBlank1').value;
    const blank2 = document.getElementById('lanBlank2').value;
    const blank3 = document.getElementById('lanBlank3').value;
    const feedback = document.getElementById('lanBlanksFeedback');
    
    let score = 0;
    
    // Check answer 1
    if (checkSynonyms(blank1, ['small', 'limited', 'restricted', 'local'])) {
        document.getElementById('lanBlank1').classList.add('correct');
        score++;
    } else {
        document.getElementById('lanBlank1').classList.add('incorrect');
    }
    
    // Check answer 2
    if (checkSynonyms(blank2, ['MAC', 'MAC address', 'physical', 'hardware'])) {
        document.getElementById('lanBlank2').classList.add('correct');
        score++;
    } else {
        document.getElementById('lanBlank2').classList.add('incorrect');
    }
    
    // Check answer 3
    if (checkSynonyms(blank3, ['company', 'home owners', 'users', 'organisation', 'business'])) {
        document.getElementById('lanBlank3').classList.add('correct');
        score++;
    } else {
        document.getElementById('lanBlank3').classList.add('incorrect');
    }
    
    if (score === 3) {
        feedback.textContent = "Excellent! All answers are correct! 🎉";
        feedback.className = 'feedback success';
        awardXP(15, 'lan_blanks');
    } else {
        feedback.textContent = `You got ${score} out of 3 correct. Check the highlighted fields.`;
        feedback.className = 'feedback error';
        if (score > 0) awardXP(5 * score, 'lan_blanks_partial');
    }
    
    feedback.style.display = 'block';
}

function resetLANComparison() {
    const container = document.getElementById('comparisonItems');
    const items = container.querySelectorAll('.drag-item');
    items.forEach(item => {
        item.style.display = 'block';
        container.appendChild(item);
    });
    
    document.querySelectorAll('#lanDropZone, #wanDropZone').forEach(zone => {
        zone.innerHTML = zone.id === 'lanDropZone' ? 'Drop LAN characteristics here' : 'Drop WAN characteristics here';
        zone.classList.remove('correct', 'incorrect');
    });
    
    document.getElementById('comparisonFeedback').style.display = 'none';
}

// Client-Server Section
const benefits = {
    central: {
        title: "Central Storage",
        description: "All files can be stored centrally, so workers can access files from any computer on the network. This ensures consistency and makes collaboration easier."
    },
    backup: {
        title: "Centralized Backups",
        description: "All data is backed up centrally each time. Individual computers do not need to backup their own data, reducing the risk of data loss."
    },
    monitor: {
        title: "Client Monitoring",
        description: "IT administrators can monitor clients to ensure they are working correctly. This helps identify and fix problems quickly."
    },
    update: {
        title: "Central Software Updates",
        description: "Software can be upgraded centrally, so you do not have to install updates on each computer individually. This saves time and ensures consistency."
    },
    security: {
        title: "Centralized Security",
        description: "Central security (antivirus/firewall) means you don't need to install protection on all computers. It's easier to manage security and install security updates."
    }
};

function showBenefit(benefitKey) {
    const detail = document.getElementById('benefitDetail');
    const benefit = benefits[benefitKey];
    
    document.getElementById('benefitTitle').textContent = benefit.title;
    document.getElementById('benefitDescription').textContent = benefit.description;
    detail.style.display = 'block';
    
    // Award XP for exploring benefits
    awardXP(3, 'benefit_' + benefitKey);
}

function checkCSReflection() {
    const answer = document.getElementById('csReflection').value;
    const feedback = document.getElementById('csReflectionFeedback');
    
    if (answer.length < 20) {
        feedback.textContent = "Please write a more detailed observation about the simulation.";
        feedback.className = 'feedback error';
        feedback.style.display = 'block';
        return;
    }
    
    const keywords = ['central', 'server', 'backup', 'security', 'update', 'manage', 'request', 
                     'file', 'storage', 'monitor', 'control', 'software'];
    const keywordCount = keywords.filter(keyword => answer.toLowerCase().includes(keyword)).length;
    
    if (keywordCount >= 3) {
        feedback.textContent = "Excellent! You've clearly understood the benefits of centralized management in client-server networks.";
        feedback.className = 'feedback success';
        feedback.style.display = 'block';
        awardXP(15, 'cs_reflection');
    } else if (keywordCount >= 1) {
        feedback.textContent = "Good observation! Client-server networks provide centralized control and management.";
        feedback.className = 'feedback success';
        feedback.style.display = 'block';
        awardXP(10, 'cs_reflection');
    } else {
        feedback.textContent = "Good effort! Try mentioning how the server manages files, security, or backups centrally.";
        feedback.className = 'feedback success';
        feedback.style.display = 'block';
        awardXP(5, 'cs_reflection');
    }
}

function resetCSAdvantages() {
    // Reset drag items and drop zones
    location.reload(); // Simple reset for now
}

// Peer-to-Peer Section
function checkP2PAnswers() {
    const answers = {
        p2p1: ['server', 'central server'],
        p2p2: ['specialist', 'expert', 'IT specialist', 'administrator'],
        p2p3: ['devices', 'computers', 'peers'],
        p2p4: ['network', 'whole network'],
        p2p5: ['files', 'data', 'resources']
    };
    
    let score = 0;
    const feedback = document.getElementById('p2pFeedback');
    
    for (let i = 1; i <= 5; i++) {
        const input = document.getElementById('p2p' + i);
        const answer = input.value;
        
        if (checkSynonyms(answer, answers['p2p' + i])) {
            input.classList.add('correct');
            input.classList.remove('incorrect');
            score++;
        } else {
            input.classList.add('incorrect');
            input.classList.remove('correct');
        }
    }
    
    if (score === 5) {
        feedback.textContent = "Perfect! You understand P2P benefits completely! 🎉";
        feedback.className = 'feedback success';
        awardXP(20, 'p2p_benefits');
    } else {
        feedback.textContent = `You got ${score} out of 5 correct. Review the highlighted answers.`;
        feedback.className = 'feedback error';
        if (score > 0) awardXP(4 * score, 'p2p_benefits_partial');
    }
    
    feedback.style.display = 'block';
}

function checkP2PReflection() {
    const answer = document.getElementById('p2pReflection').value;
    const feedback = document.getElementById('p2pReflectionFeedback');
    
    if (answer.length < 20) {
        feedback.textContent = "Please write a more detailed observation about the simulation.";
        feedback.className = 'feedback error';
        feedback.style.display = 'block';
        return;
    }
    
    const keywords = ['direct', 'no server', 'peer', 'decentralized', 'share', 'connect', 
                     'equal', 'between', 'any', 'resilient', 'independent', 'failure', 
                     'continues', 'bandwidth', 'discovery', 'mesh'];
    const keywordCount = keywords.filter(keyword => answer.toLowerCase().includes(keyword)).length;
    
    if (keywordCount >= 3) {
        feedback.textContent = "Excellent! You've clearly understood how P2P networks enable direct sharing without central control.";
        feedback.className = 'feedback success';
        feedback.style.display = 'block';
        awardXP(15, 'p2p_reflection');
    } else if (keywordCount >= 1) {
        feedback.textContent = "Good observation! P2P networks allow direct connections between any peers.";
        feedback.className = 'feedback success';
        feedback.style.display = 'block';
        awardXP(10, 'p2p_reflection');
    } else {
        feedback.textContent = "Good effort! Try mentioning the direct connections, lack of server, or how the network continues even if peers fail.";
        feedback.className = 'feedback success';
        feedback.style.display = 'block';
        awardXP(5, 'p2p_reflection');
    }
}

function resetP2PExercise() {
    for (let i = 1; i <= 5; i++) {
        const input = document.getElementById('p2p' + i);
        input.value = '';
        input.classList.remove('correct', 'incorrect');
    }
    document.getElementById('p2pFeedback').style.display = 'none';
}

// Decision Tree
let treeStep = 0;
const treeQuestions = [
    {
        question: "Do you need central file storage and management?",
        yes: 1,
        no: 3
    },
    {
        question: "Do you need to connect multiple sites or countries?",
        yes: 2,
        no: 2
    },
    {
        result: "Client-Server Network with WAN",
        recommendation: "You need a WAN to connect multiple locations, with client-server architecture at each site for central management."
    },
    {
        question: "Is your network limited to one location?",
        yes: 4,
        no: 5
    },
    {
        result: "Peer-to-Peer LAN",
        recommendation: "A simple peer-to-peer network within your local area will meet your needs without the complexity of a server."
    },
    {
        result: "Peer-to-Peer WAN",
        recommendation: "While unusual, you might need P2P connections over a wide area. Consider if client-server might be more suitable."
    }
];

function answerDecisionTree(answer) {
    const current = treeQuestions[treeStep];
    
    if (answer === 'yes' && current.yes !== undefined) {
        treeStep = current.yes;
    } else if (answer === 'no' && current.no !== undefined) {
        treeStep = current.no;
    }
    
    const next = treeQuestions[treeStep];
    
    if (next.result) {
        document.getElementById('questionContainer').style.display = 'none';
        document.getElementById('treeResult').style.display = 'block';
        document.getElementById('treeRecommendation').innerHTML = 
            `<strong>${next.result}</strong><br>${next.recommendation}`;
        awardXP(10, 'decision_tree');
    } else {
        document.getElementById('treeQuestion').textContent = next.question;
    }
}

// Real World Section
function checkScenarios() {
    const scenarios = [
        { id: 'scenario1', correct: 'lan-cs', why: 'scenario1Why' },
        { id: 'scenario2', correct: 'lan-p2p', why: 'scenario2Why' },
        { id: 'scenario3', correct: 'wan', why: 'scenario3Why' }
    ];
    
    let score = 0;
    const feedback = document.getElementById('scenariosFeedback');
    
    scenarios.forEach((scenario, index) => {
        const select = document.getElementById(scenario.id);
        const explanation = document.getElementById(scenario.why).value;
        
        if (select.value === scenario.correct && explanation.length > 20) {
            score++;
        }
    });
    
    if (score === 3) {
        feedback.textContent = "Excellent analysis! You clearly understand how to apply network knowledge! 🎉";
        feedback.className = 'feedback success';
        awardXP(25, 'scenarios');
    } else {
        feedback.textContent = `You correctly analyzed ${score} out of 3 scenarios. Remember to explain your reasoning.`;
        feedback.className = 'feedback error';
        if (score > 0) awardXP(8 * score, 'scenarios_partial');
    }
    
    feedback.style.display = 'block';
}

function checkCostAnalysis() {
    const answer = document.getElementById('costAnalysis').value;
    const feedback = document.getElementById('costFeedback');
    
    if (answer.length < 30) {
        feedback.textContent = "Please provide a more detailed recommendation.";
        feedback.className = 'feedback error';
        feedback.style.display = 'block';
        return;
    }
    
    const keywords = ['peer', 'p2p', 'cost', 'small', 'minimal', 'sharing'];
    const hasKeywords = keywords.filter(kw => answer.toLowerCase().includes(kw)).length >= 2;
    
    if (hasKeywords) {
        feedback.textContent = "Excellent recommendation! You've considered both cost and requirements.";
        feedback.className = 'feedback success';
        awardXP(15, 'cost_analysis');
    } else {
        feedback.textContent = "Good effort! Consider mentioning why P2P is suitable for small businesses with minimal sharing needs.";
        feedback.className = 'feedback success';
        awardXP(8, 'cost_analysis');
    }
    
    feedback.style.display = 'block';
}

// Common Mistakes Section
function checkMistake(num, isWrong) {
    const feedback = document.getElementById('mistake' + num + 'Feedback');
    const correctAnswers = {
        1: { wrong: true, explanation: "LANs are limited to small geographical areas. WANs connect different countries." },
        2: { wrong: true, explanation: "Peer-to-peer networks have NO central server. Each computer stores its own files." },
        3: { wrong: true, explanation: "WANs use infrastructure owned by telecommunications companies, not the user." },
        4: { wrong: false, explanation: "This is correct! Client-server networks do make security management easier." }
    };
    
    const correct = correctAnswers[num];
    
    if (isWrong === correct.wrong) {
        feedback.textContent = "✓ Correct! " + correct.explanation;
        feedback.className = 'feedback success';
        awardXP(5, 'mistake_' + num);
    } else {
        feedback.textContent = "✗ Not quite. " + correct.explanation;
        feedback.className = 'feedback error';
    }
    
    feedback.style.display = 'block';
}

function resetMistakes() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById('mistake' + i + 'Feedback').style.display = 'none';
    }
}

// Exam Questions
function checkExamQ1() {
    const answer = document.getElementById('examQ1').value;
    const marks = document.getElementById('q1Marks').value;
    const feedback = document.getElementById('examQ1Feedback');
    
    if (answer.length < 30) {
        alert("Please write a more complete answer before viewing the mark scheme.");
        return;
    }
    
    if (!marks) {
        alert("Please enter your predicted marks first.");
        return;
    }
    
    feedback.innerHTML = `
        <h4>Mark Scheme (2 marks)</h4>
        <p>Award 1 mark for each correct characteristic (max 2):</p>
        <ul>
            <li>Spans/covers a large geographical area ✓</li>
            <li>Uses infrastructure owned by telecommunications companies ✓</li>
            <li>Can connect different cities/countries/continents ✓</li>
            <li>Communication medium not owned by the user ✓</li>
        </ul>
    `;
    feedback.classList.add('show');
    
    awardXP(10, 'exam_q1');
}

function checkExamQ2() {
    const answer = document.getElementById('examQ2').value;
    const marks = document.getElementById('q2Marks').value;
    const feedback = document.getElementById('examQ2Feedback');
    
    if (answer.length < 50) {
        alert("Please write a more complete answer before viewing the mark scheme.");
        return;
    }
    
    if (!marks) {
        alert("Please enter your predicted marks first.");
        return;
    }
    
    feedback.innerHTML = `
        <h4>Mark Scheme (4 marks)</h4>
        <p>Award 2 marks for each well-explained advantage (max 4):</p>
        <ul>
            <li><strong>Central file storage (1)</strong> - students can access work from any computer (1)</li>
            <li><strong>Central backups (1)</strong> - all student work backed up automatically/reduced data loss (1)</li>
            <li><strong>Central security (1)</strong> - easier to protect against viruses/manage firewall (1)</li>
            <li><strong>Software updates (1)</strong> - can update all computers at once/ensures consistency (1)</li>
            <li><strong>User monitoring (1)</strong> - can check students are on task/computers working (1)</li>
        </ul>
    `;
    feedback.classList.add('show');
    
    awardXP(15, 'exam_q2');
}

function checkExamQ3() {
    const answer = document.getElementById('examQ3').value;
    const marks = document.getElementById('q3Marks').value;
    const feedback = document.getElementById('examQ3Feedback');
    
    if (answer.length < 100) {
        alert("Please write a more complete answer before viewing the mark scheme.");
        return;
    }
    
    if (!marks) {
        alert("Please enter your predicted marks first.");
        return;
    }
    
    feedback.innerHTML = `
        <h4>Mark Scheme (6 marks)</h4>
        <p><strong>Structure (2 marks):</strong></p>
        <ul>
            <li>Client-server has central server managing network (1)</li>
            <li>P2P has no server, all computers equal/connected directly (1)</li>
        </ul>
        <p><strong>Advantages (2 marks):</strong></p>
        <ul>
            <li>Client-server: central management/security/backups (1)</li>
            <li>P2P: lower cost/no specialist needed/resilient (1)</li>
        </ul>
        <p><strong>Use cases (2 marks):</strong></p>
        <ul>
            <li>Client-server: schools/businesses/where central control needed (1)</li>
            <li>P2P: home networks/small offices/minimal sharing needs (1)</li>
        </ul>
    `;
    feedback.classList.add('show');
    
    awardXP(20, 'exam_q3');
    
    // Check if all exam questions completed
    if (completedTasks.has('exam_q1') && completedTasks.has('exam_q2') && completedTasks.has('exam_q3')) {
        unlockAchievement('examReady');
    }
}

// Extension Activities
function checkTopologyResearch() {
    const answer = document.getElementById('topologyResearch').value;
    const feedback = document.getElementById('topologyFeedback');
    
    if (answer.length < 100) {
        feedback.textContent = "Please provide more detail about each topology.";
        feedback.className = 'feedback error';
        feedback.style.display = 'block';
        return;
    }
    
    const topologies = ['mesh', 'ring', 'hybrid'];
    const mentioned = topologies.filter(t => answer.toLowerCase().includes(t)).length;
    
    if (mentioned === 3) {
        feedback.textContent = "Excellent research! You've explored advanced network topologies thoroughly.";
        feedback.className = 'feedback success';
        awardXP(20, 'topology_research');
    } else {
        feedback.textContent = `Good start! You mentioned ${mentioned} out of 3 topologies. Try to cover all three.`;
        feedback.className = 'feedback error';
        awardXP(5 * mentioned, 'topology_partial');
    }
    
    feedback.style.display = 'block';
}

function checkFutureNetworks() {
    const answer = document.getElementById('futureNetworks').value;
    const feedback = document.getElementById('futureFeedback');
    
    if (answer.length < 50) {
        feedback.textContent = "Please provide more detail about your chosen technology.";
        feedback.className = 'feedback error';
        feedback.style.display = 'block';
        return;
    }
    
    feedback.textContent = "Great exploration of future networking technologies!";
    feedback.className = 'feedback success';
    feedback.style.display = 'block';
    awardXP(15, 'future_networks');
    
    // Easter egg - if they mention quantum
    if (answer.toLowerCase().includes('quantum')) {
        unlockAchievement('explorer');
    }
}

function checkSecurityDesign() {
    const answer = document.getElementById('securityDesign').value;
    const feedback = document.getElementById('securityFeedback');
    
    if (answer.length < 80) {
        feedback.textContent = "Please provide a more comprehensive network design.";
        feedback.className = 'feedback error';
        feedback.style.display = 'block';
        return;
    }
    
    const elements = ['network type', 'security', 'backup', 'cost'];
    const mentioned = elements.filter(e => answer.toLowerCase().includes(e)).length;
    
    if (mentioned >= 3) {
        feedback.textContent = "Excellent network design! You've considered all key aspects.";
        feedback.className = 'feedback success';
        awardXP(25, 'security_design');
    } else {
        feedback.textContent = `Good effort! Try to address all four design considerations.`;
        feedback.className = 'feedback error';
        awardXP(5 * mentioned, 'security_partial');
    }
    
    feedback.style.display = 'block';
}

// Key Takeaways
function checkCompletion() {
    const checkboxes = document.querySelectorAll('#checklist input[type="checkbox"]');
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const feedback = document.getElementById('completionFeedback');
    
    if (checked === checkboxes.length) {
        feedback.textContent = "Fantastic! You're ready to ace any networks question! 🎉";
        feedback.className = 'feedback success';
        awardXP(10, 'self_assessment');
        
        // Check if they've completed all main sections
        const mainSections = ['starter', 'wan', 'lan', 'client-server', 'peer-to-peer'];
        let allComplete = true;
        mainSections.forEach(section => {
            if (!completedTasks.has(section + '_main')) {
                allComplete = false;
            }
        });
        
        if (allComplete) {
            unlockAchievement('networkExpert');
        }
    } else {
        feedback.textContent = `You've checked ${checked} out of ${checkboxes.length} items. Keep reviewing!`;
        feedback.className = 'feedback error';
    }
    
    feedback.style.display = 'block';
}