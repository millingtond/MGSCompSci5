document.addEventListener('DOMContentLoaded', async function() {
    // Wait for Skulpt to load
    let skulptReady = false;
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    while (!skulptReady && attempts < maxAttempts) {
        if (typeof Sk !== 'undefined') {
            skulptReady = true;
            console.log('Skulpt loaded successfully');
        } else {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
    }
    
    // Hide loading message and show content
    const loadingMessage = document.getElementById('loading-message');
    const header = document.querySelector('.main-header');
    const main = document.querySelector('main');
    
    if (loadingMessage) loadingMessage.style.display = 'none';
    if (header) header.style.display = 'flex';
    if (main) main.style.display = 'block';
    
    if (!skulptReady) {
        console.error('Skulpt failed to load after 5 seconds');
        // Show error message
        if (main) {
            main.innerHTML = `
                <div class="card" style="text-align: center; margin-top: 2rem;">
                    <h2>Python Environment Loading Error</h2>
                    <p>The Python interpreter failed to load. This might be due to:</p>
                    <ul style="text-align: left; display: inline-block;">
                        <li>Network connectivity issues</li>
                        <li>Ad blockers or browser extensions</li>
                        <li>Firewall restrictions</li>
                    </ul>
                    <p>Please try refreshing the page or using a different browser.</p>
                    <button class="btn btn-primary" onclick="location.reload()">Refresh Page</button>
                </div>
            `;
        }
        return;
    }
    
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
    
    document.getElementById('check-starter-btn').addEventListener('click', checkStarterTask);
    document.getElementById('reset-starter-btn').addEventListener('click', resetStarterTask);
    document.getElementById('run-task1-btn').addEventListener('click', runPythonTask1);  // Keep this as is
    document.getElementById('hint-task1-btn').addEventListener('click', () => toggleHint('hint-task1'));
    document.getElementById('reset-task1-btn').addEventListener('click', resetPythonTask1);
    document.getElementById('rocket-sim-btn').addEventListener('click', runRocketSim);
    document.getElementById('submit-reflection1').addEventListener('click', checkReflection1);
    document.getElementById('run-task2-btn').addEventListener('click', runPythonTask2);  // Keep this as is
    document.getElementById('reset-task2-btn').addEventListener('click', resetPythonTask2);
    document.getElementById('check-comparison-btn').addEventListener('click', checkComparisonTask);
    document.getElementById('reset-comparison-btn').addEventListener('click', resetComparisonTask);
    document.getElementById('check-trace-btn').addEventListener('click', checkTraceTable);
    document.getElementById('exam-q1-answer').addEventListener('input', checkExamQ1Length);
    document.getElementById('show-q1-markscheme').addEventListener('click', showQ1MarkScheme);
    document.getElementById('run-task3-btn').addEventListener('click', runPythonTask3);  // Keep this as is
    document.getElementById('reset-task3-btn').addEventListener('click', resetPythonTask3);
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
    
    function toggleHint(hintId) { document.getElementById(hintId).style.display = document.getElementById(hintId).style.display === 'none' ? 'block' : 'none'; }
    
    function showFeedback(elId, msg, isCorrect) {
        const fb = document.getElementById(elId);
        fb.innerHTML = `<i class="fa-solid ${isCorrect ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> ${msg}`;
        fb.className = 'feedback-box';
        fb.classList.add(isCorrect ? 'feedback-correct' : 'feedback-incorrect');
        fb.style.display = 'flex';
    }

    function saveState() { localStorage.setItem('ocrLoopLessonState', JSON.stringify(state)); }
    
    function loadState() {
        const saved = localStorage.getItem('ocrLoopLessonState');
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
    
    function triggerShameMode(reset = true) {
        state.shamed = true;
        saveState();
        document.body.classList.add('shame-mode');
        const overlay = document.getElementById('shame-overlay');
        if (overlay) {
            overlay.innerHTML = '<h1>CHEATING DETECTED</h1><p>Pasting is not learning. Your progress has been reset.</p>';
            overlay.style.display = 'flex';
        }
        if (reset) {
            state = { xp: 0, level: 1, completedTasks: [], unlockedAchievements: [], shamed: true };
            saveState();
            setTimeout(() => location.reload(), 3000);
        }
    }
    
    // =================================================================================
    //                                  TASK-SPECIFIC LOGIC
    // =================================================================================
    
    function initDragAndDrop() {
        new Sortable(document.getElementById('starter-target'), { group: 'starter', animation: 150 });
        new Sortable(document.getElementById('starter-source'), { group: 'starter', animation: 150 });
        new Sortable(document.getElementById('while-dropzone'), { group: 'comparison', animation: 150 });
        new Sortable(document.getElementById('do-until-dropzone'), { group: 'comparison', animation: 150 });
        new Sortable(document.getElementById('properties-source'), { group: 'comparison', animation: 150 });
    }

    function checkStarterTask() {
        const correctOrder = ['1','2','3'];
        const userOrder = Array.from(document.querySelectorAll('#starter-target .drag-item')).map(item => item.dataset.id);
        if (JSON.stringify(correctOrder) === JSON.stringify(userOrder)) {
            showFeedback('starter-feedback', 'Perfect! You know the structure of a for loop.', true);
            addXp(20, 'starter-loops');
            unlockAchievement('structure-whiz', 'Structure Whiz');
        } else {
            showFeedback('starter-feedback', 'Not quite right. Remember the loop definition comes first, then the indented code, then the `next` statement.', false);
        }
    }
    
    function resetStarterTask() {
        const target = document.getElementById('starter-target');
        const source = document.getElementById('starter-source');
        while(target.firstChild) { source.appendChild(target.firstChild); }
        document.getElementById('starter-feedback').style.display = 'none';
    }
    
    let task1Editor, task2Editor, task3Editor;
    function initAceEditors() {
        const setupEditor = (id, code) => {
            let editor = ace.edit(id);
            editor.setTheme("ace/theme/tomorrow_night");
            editor.session.setMode("ace/mode/python");
            editor.setValue(code, -1);
            return editor;
        };
        task1Editor = setupEditor("task1-editor", `# A number will be provided for testing, e.g.\nnumber = 7\n\n# Your code here...\n`);
        task2Editor = setupEditor("task2-editor", `import random\n\nsecret_number = random.randint(1, 10)\nguess = 0 # Initialise guess to a value that is not the secret number\n\n# Your while loop here...\n\nprint("You guessed it!")`);
        task3Editor = setupEditor("task3-editor", `# Use a nested loop to print a 5x5 square of asterisks\n`);
    }

    async function runSkulptCode(code, outputElId) {
        const outputEl = document.getElementById(outputElId);
        outputEl.textContent = '';
        
        // Configure Skulpt similar to Y10 files
        Sk.configure({
            output: (text) => { outputEl.textContent += text; },
            read: (x) => { 
                if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
                    throw "File not found: '" + x + "'"; 
                }
                return Sk.builtinFiles["files"][x]; 
            },
            inputfun: (prompt) => window.prompt(prompt),
            inputfunTakesPrompt: true,
            __future__: Sk.python3
        });
        
        // Set execution limits
        Sk.execLimit = 10000; // 10 seconds

        try {
            await Sk.misceval.asyncToPromise(() => 
                Sk.importMainWithBody("<stdin>", false, code, true)
            );
            return { success: true, output: outputEl.textContent };
        } catch (e) {
            outputEl.textContent = e.toString();
            return { success: false, output: e.toString() };
        }
    }

async function runPythonTask1() {
    const userCode = task1Editor.getValue();
    const result = await runSkulptCode(userCode, 'task1-output');
    
    // Only provide feedback if there was an error
    if (!result.success) {
        showFeedback('task1-feedback', 'Error in your code. Check the output for details.', false);
    }
}

async function runPythonTask2() {
    const userCode = task2Editor.getValue();
    const result = await runSkulptCode(userCode, 'task2-output');
    
    // Only provide feedback if there was an error
    if (!result.success) {
        showFeedback('task2-feedback', 'Error in your code. Check the output for details.', false);
    }
}

async function runPythonTask3() {
    const userCode = task3Editor.getValue();
    const result = await runSkulptCode(userCode, 'task3-output');
    
    // Only provide feedback if there was an error
    if (!result.success) {
        showFeedback('task3-feedback', 'Error in your code. Check the output for details.', false);
    }
}
    function resetPythonTask1() { task1Editor.setValue(`# A number will be provided...\n`, -1); }
    
    let fuel = 100;
    function runRocketSim() {
        const outputEl = document.getElementById('rocket-output');
        const fuelEl = document.getElementById('rocket-fuel');
        if (fuel > 0) {
            fuel -= 30;
            if (fuel < 0) fuel = 0;
            outputEl.textContent = `Successful burn! Traveled 30 units. Remaining fuel: ${fuel}`;
        } else {
            outputEl.textContent = `Mission failed. Not enough fuel to travel.`;
            document.getElementById('rocket-sim-btn').disabled = true;
        }
        fuelEl.textContent = fuel;
    }
    function checkReflection1() {
        const answer = document.getElementById('reflection-q1').value.toLowerCase();
        if (answer.includes('never') || answer.includes('not run')) {
            showFeedback('reflection1-feedback', 'Great answer! You correctly identified that if the condition (fuel > 0) is false at the start, the loop body (travel) will never run.', true);
            addXp(15, 'reflection1-loops');
        } else {
            showFeedback('reflection1-feedback', 'Good start. Try to mention that the loop would never execute its code because the condition is checked before it can run.', false);
        }
    }

async function runPythonTask2() {
    const userCode = task2Editor.getValue();
    const result = await runSkulptCode(userCode, 'task2-output');
    
    // Only provide feedback if there was an error
    if (!result.success) {
        showFeedback('task2-feedback', 'Error in your code. Check the output for details.', false);
    }
}
    function resetPythonTask2() { task2Editor.setValue(`import random\nsecret_number = random.randint(1, 10)\n...`, -1); }
    
    function checkComparisonTask() {
        let correct = true;
        document.querySelectorAll('#while-dropzone .drag-item').forEach(item => { if (item.dataset.target !== 'while') correct = false; });
        document.querySelectorAll('#do-until-dropzone .drag-item').forEach(item => { if (item.dataset.target !== 'do-until') correct = false; });
        if (document.querySelectorAll('#properties-source .drag-item').length > 0) correct = false;
        if (correct) {
            showFeedback('comparison-feedback', 'Correct! You\'ve mastered the key differences.', true);
            addXp(40, 'comparison');
            unlockAchievement('classifier', 'Loop Classifier');
        } else {
            showFeedback('comparison-feedback', 'Some properties are in the wrong place. Check the definitions and try again!', false);
        }
    }
    
    function resetComparisonTask() {
        const source = document.getElementById('properties-source');
        document.querySelectorAll('#while-dropzone .drag-item, #do-until-dropzone .drag-item').forEach(item => { source.appendChild(item); });
        document.getElementById('comparison-feedback').style.display = 'none';
    }
    
    function checkTraceTable() {
        let correctCount = 0;
        const inputs = document.querySelectorAll('#trace-table-body input');
        inputs.forEach(input => {
            if (input.value.trim().toLowerCase() === input.dataset.answer.toLowerCase()) {
                input.style.border = '2px solid var(--correct-color)';
                correctCount++;
            } else {
                input.style.border = '2px solid var(--incorrect-color)';
            }
        });
        if (correctCount === inputs.length) {
            showFeedback('trace-feedback', 'Perfect trace! You followed the logic flawlessly.', true);
            addXp(75, 'trace-table-1');
            unlockAchievement('tracer', 'Trace Ace');
        } else {
            showFeedback('trace-feedback', `You got ${correctCount} out of ${inputs.length} correct. The highlighted boxes are wrong. Check your calculations!`, false);
        }
    }
    
    function checkExamQ1Length() {
        const answer = document.getElementById('exam-q1-answer').value;
        document.getElementById('show-q1-markscheme').disabled = answer.length < 50;
    }

    function showQ1MarkScheme() {
        document.getElementById('q1-markscheme').style.display = 'block';
        const answer = document.getElementById('exam-q1-answer').value.toLowerCase();
        let score = 0;
        if((answer.includes('before') || answer.includes('start')) && (answer.includes('after') || answer.includes('end'))) { score++; }
        if(answer.includes('at least once') || answer.includes('might not')) { score++; }
        if(score >= 2) {
            showFeedback('exam-q1-feedback', 'Excellent! Your answer hits all the key points of the mark scheme.', true);
            addXp(40, 'exam-q1-loops');
        } else if (score === 1) {
            showFeedback('exam-q1-feedback', 'Good answer. You have one of the key points. Compare your answer to the mark scheme to see how to get full marks.', true);
            addXp(20, 'exam-q1-loops');
        } else {
            showFeedback('exam-q1-feedback', 'Your answer is missing the key points. Review the mark scheme carefully.', false);
        }
    }

async function runPythonTask3() {
    const userCode = task3Editor.getValue();
    const result = await runSkulptCode(userCode, 'task3-output');
    
    // Only provide feedback if there was an error
    if (!result.success) {
        showFeedback('task3-feedback', 'Error in your code. Check the output for details.', false);
    }
}
    function resetPythonTask3() { task3Editor.setValue(`# Use a nested loop...\n`, -1); }

    init();
});