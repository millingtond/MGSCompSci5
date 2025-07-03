// The main application logic is wrapped in an async function to allow for waiting.
async function mainApp() {
    
    // =================================================================================
    //                                  LOADING & INITIALIZATION
    // =================================================================================
    const loadingOverlay = document.getElementById('loading-overlay');
    const appContent = document.getElementById('app-content');
    
    // --- Wait for the Skulpt library to be ready ---
    let skulptReady = false;
    let attempts = 0;
    const maxAttempts = 50; // Wait for up to 5 seconds

    while (attempts < maxAttempts) {
        if (typeof Sk !== 'undefined' && Sk.builtin) {
            skulptReady = true;
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms
        attempts++;
    }

    // --- Handle Skulpt Loading Failure ---
    if (!skulptReady) {
        console.error("Skulpt library failed to load after 5 seconds.");
        loadingOverlay.innerHTML = `
            <p style="color: var(--incorrect-color); font-weight: bold;">Error: Could not load the Python environment.</p>
            <p>Please check your internet connection and refresh the page.</p>
            <button class="btn btn-primary" onclick="location.reload()">Refresh</button>
        `;
        return; // Stop the app from initializing
    }

    // --- Skulpt is ready, proceed with initializing the app ---
    loadingOverlay.style.display = 'none';
    appContent.style.display = 'block';

    // =================================================================================
    //                                  CORE APP STATE & SETUP
    // =================================================================================
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('.quick-access-nav a');
    const prevBtn = document.getElementById('prev-section-btn');
    const nextBtn = document.getElementById('next-section-btn');
    const levelDisplay = document.getElementById('level-display');
    const xpBar = document.getElementById('xp-bar');
    const xpText = document.getElementById('xp-text');

    let currentSectionIndex = 0;
    let state = { xp: 0, level: 1, completedTasks: [], unlockedAchievements: [], shamed: false };
    const xpPerLevel = [0, 100, 250, 450, 700, 1000];

    function init() {
        loadState();
        if(state.shamed) { triggerShameMode(false); return; }
        setupEventListeners();
        updateUI();
        initStarterQuiz();
        initAceEditors();
        initDragAndDrop();
        document.body.onpaste = (e) => { e.preventDefault(); triggerShameMode(); return false; };
    }

    function setupEventListeners() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSectionId = link.getAttribute('data-section');
                const targetIndex = Array.from(sections).findIndex(s => s.id === targetSectionId);
                if(targetIndex !== -1) navigateToSection(targetIndex);
            });
        });
        prevBtn.addEventListener('click', () => navigateToSection(currentSectionIndex - 1));
        nextBtn.addEventListener('click', () => navigateToSection(currentSectionIndex + 1));
        
        document.getElementById('check-vc-btn').addEventListener('click', checkVcTask);
        document.getElementById('reset-vc-btn').addEventListener('click', resetVcTask);
        document.getElementById('check-dt-btn').addEventListener('click', checkDtTask);
        document.getElementById('reset-dt-btn').addEventListener('click', resetDtTask);
        
        document.getElementById('check-casting-btn').addEventListener('click', checkCastingTask);
        document.getElementById('reset-casting-btn').addEventListener('click', resetCastingTask);
        document.getElementById('run-concat-btn').addEventListener('click', runConcatTask);
        document.getElementById('reset-concat-btn').addEventListener('click', resetConcatTask);
        document.getElementById('check-concepts-btn').addEventListener('click', checkConceptsTask);
        document.getElementById('reset-concepts-btn').addEventListener('click', resetConceptsTask);
        document.getElementById('check-constructs-btn').addEventListener('click', checkConstructsTask);
        document.getElementById('reset-constructs-btn').addEventListener('click', resetConstructsTask);

        document.getElementById('check-op-table-btn').addEventListener('click', checkOpTable);
        document.getElementById('reset-op-table-btn').addEventListener('click', resetOpTable);
        document.getElementById('check-divmod-btn').addEventListener('click', checkDivMod);
        document.getElementById('reset-divmod-btn').addEventListener('click', resetDivMod);
        document.getElementById('run-task1-btn').addEventListener('click', runPythonLoginTask);
        document.getElementById('reset-task1-btn').addEventListener('click', resetPythonLoginTask);
    }
    
    function navigateToSection(index) {
        if (index < 0 || index >= sections.length) return;
        currentSectionIndex = index;
        sections.forEach((s, i) => s.classList.toggle('active', i === index));
        navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === sections[index].id));
        prevBtn.disabled = (index === 0);
        nextBtn.disabled = (index === sections.length - 1);
        window.scrollTo(0, 0);
    }

    function updateUI() {
        const currentLevelXp = xpPerLevel[state.level - 1];
        const nextLevelXp = xpPerLevel[state.level];
        const xpIntoLevel = state.xp - currentLevelXp;
        const xpForThisLevel = nextLevelXp - currentLevelXp;
        const percentage = Math.min(100, (xpIntoLevel / xpForThisLevel) * 100);
        levelDisplay.textContent = `Level ${state.level}`;
        xpBar.style.width = `${percentage}%`;
        xpText.textContent = `${state.xp} / ${nextLevelXp} XP`;
    }
    
    function showFeedback(elId, msg, isCorrect) {
        const fb = document.getElementById(elId);
        fb.innerHTML = `<i class="fa-solid ${isCorrect ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> ${msg}`;
        fb.className = 'feedback-box';
        fb.classList.add(isCorrect ? 'feedback-correct' : 'feedback-incorrect');
        fb.style.display = 'flex';
    }

    function saveState() { localStorage.setItem('ocrFundamentalsLessonState', JSON.stringify(state)); }
    
    function loadState() {
        const saved = localStorage.getItem('ocrFundamentalsLessonState');
        if (saved) { state = JSON.parse(saved); }
    }

    function addXp(amount, taskId) {
        if (state.completedTasks.includes(taskId)) return;
        state.xp += amount;
        state.completedTasks.push(taskId);
        if (state.level < xpPerLevel.length -1 && state.xp >= xpPerLevel[state.level]) {
            state.level++;
            unlockAchievement(`level${state.level}`, `Reached Level ${state.level}!`);
            celebrate();
        }
        updateUI();
        saveState();
    }

    function unlockAchievement(id, name) {
        if (state.unlockedAchievements.includes(id)) return;
        state.unlockedAchievements.push(id);
        const achievementNameEl = document.getElementById('achievement-name');
        const popup = document.getElementById('achievement-popup');
        if (achievementNameEl && popup) {
            achievementNameEl.textContent = name;
            popup.classList.add('show');
        }
        if (navigator.vibrate) navigator.vibrate(100);
        setTimeout(() => {
            if (popup) popup.classList.remove('show');
        }, 4000);
        saveState();
    }
    
    function celebrate() { confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } }); }
    
    function triggerShameMode(reset = true) { /* Unchanged */ }
    
    // =================================================================================
    //                                  TASK-SPECIFIC LOGIC
    // =================================================================================
    
    const starterQuestions = [
        { q: "When you get an idea for a program, you...", a1: "Start coding immediately", a2: "Plan it all on paper first" },
        { q: "A perfect program is one that is...", a1: "Extremely fast and efficient", a2: "Easy for others to read and understand" },
        { q: "When debugging, your first instinct is to...", a1: "Add `print()` statements everywhere", a2: "Read through the code line by line" }
    ];
    let currentStarterQ = 0;
    let starterAnswers = [];

    function initStarterQuiz() { /* Unchanged */ }
    function showStarterResult() { /* Unchanged */ }

    function checkVcTask() { /* Unchanged */ }
    function resetVcTask() { /* Unchanged */ }

    function initDragAndDrop() { /* Unchanged */ }
    function checkDtTask() { /* Unchanged */ }
    function resetDtTask() { /* Unchanged */ }

    // --- Key Concepts Tasks ---
    function checkCastingTask() { /* Unchanged */ }
    function resetCastingTask() { /* Unchanged */ }

    async function runConcatTask() {
        const userCode = concatEditor.getValue();
        const fullCode = `first_name = "Ada"\nlast_name = "Lovelace"\n${userCode}`;
        const result = await runSkulptCode(fullCode, 'concat-feedback');
        if (result.success && result.output.trim() === "Ada Lovelace") {
            showFeedback('concat-feedback', 'Perfect! You successfully joined the strings.', true);
            addXp(30, 'concat-task');
        } else {
            showFeedback('concat-feedback', `The output was "${result.output.trim()}". Make sure you create a fullName variable and print it. Don't forget the space!`, false);
        }
    }
    function resetConcatTask() { /* Unchanged */ }
    function checkConceptsTask() { /* Unchanged */ }
    function resetConceptsTask() { /* Unchanged */ }
    function checkConstructsTask() { /* Unchanged */ }
    function resetConstructsTask() { /* Unchanged */ }

    // --- Operators Tasks ---
    function checkOpTable() { /* Unchanged */ }
    function resetOpTable() { /* Unchanged */ }
    function checkDivMod() { /* Unchanged */ }
    function resetDivMod() { /* Unchanged */ }

    // --- Final Coding Task ---
    let task1Editor, concatEditor;
    function initAceEditors() {
        task1Editor = ace.edit("task1-editor");
        task1Editor.setTheme("ace/theme/tomorrow_night");
        task1Editor.session.setMode("ace/mode/python");
        task1Editor.setValue(`# The values of these variables will be changed for testing...`, -1);
        
        concatEditor = ace.edit("concat-editor");
        concatEditor.setTheme("ace/theme/tomorrow_night");
        concatEditor.session.setMode("ace/mode/python");
        concatEditor.setValue(`# Create a 'fullName' variable here...`, -1);
    }

    async function runSkulptCode(code, outputElId) {
        const outputEl = document.getElementById(outputElId);
        outputEl.textContent = '';
        
        Sk.configure({
            output: (text) => { outputEl.textContent += text; },
            read: (x) => { if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) throw "File not found: '" + x + "'"; return Sk.builtinFiles["files"][x]; }
        });

        try {
            await Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true));
            return { success: true, output: outputEl.textContent };
        } catch (e) {
            outputEl.textContent = e.toString();
            return { success: false, output: e.toString() };
        }
    }

    async function runPythonLoginTask() { /* Unchanged */ }
    function resetPythonLoginTask() { /* Unchanged */ }

    // --- Kick off the application ---
    init();
}

// Start the main application logic
mainApp();
