// Enhanced Features Module - Fixed Version
// This should replace the content in enhanced-features.js

// --- ACHIEVEMENT SYSTEM ---
const ACHIEVEMENTS = [
    { id: 'first-steps', name: 'First Steps', desc: 'Complete your first task', icon: '🎯', xp: 10 },
    { id: 'perfectionist', name: 'Perfectionist', desc: 'Complete 10 tasks without using hints', icon: '💎', xp: 50 },
    { id: 'speed-demon', name: 'Speed Coder', desc: 'Complete a task in under 2 minutes', icon: '⚡', xp: 25 },
    { id: 'theory-master', name: 'Theory Master', desc: 'Answer 20 theory questions correctly', icon: '📚', xp: 30 },
    { id: 'section-complete', name: 'Section Champion', desc: 'Complete an entire section', icon: '🏆', xp: 40 },
    { id: 'halfway-there', name: 'Halfway There', desc: 'Complete 50% of all tasks', icon: '🎖️', xp: 35 },
    { id: 'bug-free', name: 'Bug Free', desc: 'Complete 5 tasks without any errors on first run', icon: '🐛', xp: 30 },
    { id: 'persistent', name: 'Persistent', desc: 'Work on tasks for 7 consecutive days', icon: '🔥', xp: 45 },
    { id: 'explorer', name: 'Explorer', desc: 'Try all different sections', icon: '🗺️', xp: 20 },
    { id: 'helper', name: 'Helper', desc: 'Use hints effectively on 10 different tasks', icon: '💡', xp: 15 }
];

// --- ENHANCED ERROR MESSAGES ---
const ERROR_EXPLANATIONS = {
    'IndentationError': {
        message: 'Your code indentation is incorrect',
        hint: 'Python uses spaces to show which lines belong together. Make sure all lines in a block have the same indentation.',
        visual: '📐',
        example: 'if x > 5:\n    print("x is big")  # This line must be indented'
    },
    'NameError': {
        message: 'You\'re using a variable that doesn\'t exist',
        hint: 'Check: 1) Did you create the variable? 2) Is it spelled correctly? 3) Did you create it before using it?',
        visual: '❓',
        example: 'name = "Alice"  # Create variable first\nprint(name)     # Then use it'
    },
    'TypeError': {
        message: 'You\'re mixing incompatible data types',
        hint: 'Common causes: Adding numbers to strings, or calling functions with wrong argument types.',
        visual: '🔄',
        example: 'age = int(input())  # Convert string to number\nfuture_age = age + 5  # Now you can add'
    },
    'SyntaxError': {
        message: 'Your code structure is incorrect',
        hint: 'Check for: Missing colons (:), unmatched brackets, or incorrect Python keywords.',
        visual: '⚠️',
        example: 'if x > 5:  # Don\'t forget the colon!'
    },
    'ValueError': {
        message: 'The value you provided is invalid',
        hint: 'This often happens when converting strings to numbers. Make sure the input is actually a number.',
        visual: '📊',
        example: 'int("hello")  # This will cause ValueError\nint("123")    # This works!'
    },
    'IndexError': {
        message: 'You\'re trying to access a list position that doesn\'t exist',
        hint: 'Remember: List indices start at 0, and the last index is len(list) - 1.',
        visual: '📍',
        example: 'my_list = [1, 2, 3]\nprint(my_list[2])  # Valid: prints 3\nprint(my_list[3])  # Error: no index 3'
    }
};

// --- AUTO-SAVE AND VERSION HISTORY ---
class CodeVersionManager {
    constructor() {
        this.versions = {};
        this.maxVersionsPerTask = 20;
        this.autoSaveInterval = 30000; // 30 seconds
        this.lastSaveTime = {};
    }
    
    saveVersion(taskId, code) {
        if (!this.versions[taskId]) {
            this.versions[taskId] = [];
        }
        
        const version = {
            code: code,
            timestamp: Date.now(),
            id: this.generateVersionId()
        };
        
        this.versions[taskId].unshift(version);
        
        // Keep only recent versions
        if (this.versions[taskId].length > this.maxVersionsPerTask) {
            this.versions[taskId] = this.versions[taskId].slice(0, this.maxVersionsPerTask);
        }
        
        this.saveToLocalStorage();
        this.lastSaveTime[taskId] = Date.now();
    }
    
    getVersions(taskId) {
        return this.versions[taskId] || [];
    }
    
    restoreVersion(taskId, versionId) {
        const versions = this.getVersions(taskId);
        const version = versions.find(v => v.id === versionId);
        return version ? version.code : null;
    }
    
    generateVersionId() {
        return 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    saveToLocalStorage() {
        try {
            localStorage.setItem('pythonProjectVersions', JSON.stringify(this.versions));
        } catch (e) {
            console.error('Failed to save versions', e);
        }
    }
    
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('pythonProjectVersions');
            if (saved) {
                this.versions = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load versions', e);
        }
    }
}

// --- INTERACTIVE DEBUGGER ---
class InteractiveDebugger {
    constructor() {
        this.isActive = false;
        this.currentLine = 0;
        this.variables = {};
        this.callStack = [];
        this.breakpoints = new Set();
        this.executionTrace = [];
    }
    
    async startDebug(code, pyodide) {
        this.isActive = true;
        this.currentLine = 0;
        this.variables = {};
        this.executionTrace = [];
        
        // Parse code to identify key points
        const lines = code.split('\n');
        const debugCode = this.instrumentCode(lines);
        
        // Show debugger panel
        this.showDebuggerPanel();
        
        try {
            await pyodide.runPythonAsync(debugCode);
        } catch (error) {
            this.handleDebugError(error);
        }
    }
    
    instrumentCode(lines) {
        // Add debug hooks to track variable changes and line execution
        let instrumented = `
import sys
_debug_vars = {}
_debug_line = 0

def _debug_hook(frame, event, arg):
    global _debug_vars, _debug_line
    if event == 'line':
        _debug_line = frame.f_lineno
        _debug_vars = dict(frame.f_locals)
        # Send to JS
        from js import window
        window._updateDebugger(_debug_line, _debug_vars)
    return _debug_hook

sys.settrace(_debug_hook)

`;
        instrumented += lines.join('\n');
        instrumented += '\nsys.settrace(None)';
        
        return instrumented;
    }
    
    showDebuggerPanel() {
        const panel = document.getElementById('debugger-panel') || this.createDebuggerPanel();
        panel.classList.add('active');
        this.updateVariableDisplay();
    }
    
    createDebuggerPanel() {
        const panel = document.createElement('div');
        panel.id = 'debugger-panel';
        panel.className = 'debugger-panel';
        panel.innerHTML = `
            <div class="debug-controls">
                <button class="debug-btn" onclick="window.debugger.step()">Step →</button>
                <button class="debug-btn" onclick="window.debugger.continue()">Continue ▶</button>
                <button class="debug-btn" onclick="window.debugger.stop()">Stop ■</button>
            </div>
            <div class="debug-info">
                <h4>Variables:</h4>
                <div id="variable-watch" class="variable-watch"></div>
            </div>
            <div class="execution-trace">
                <h4>Execution Trace:</h4>
                <div id="trace-list"></div>
            </div>
        `;
        document.body.appendChild(panel);
        return panel;
    }
    
    updateVariableDisplay() {
        const watchDiv = document.getElementById('variable-watch');
        if (!watchDiv) return;
        
        watchDiv.innerHTML = '';
        for (const [name, value] of Object.entries(this.variables)) {
            const item = document.createElement('div');
            item.className = 'variable-item';
            item.innerHTML = `
                <span class="variable-name">${name}:</span>
                <span class="variable-value">${this.formatValue(value)}</span>
            `;
            watchDiv.appendChild(item);
        }
    }
    
    formatValue(value) {
        if (typeof value === 'string') return `"${value}"`;
        if (Array.isArray(value)) return `[${value.join(', ')}]`;
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    }
    
    highlightCurrentLine(lineNumber) {
        // Remove previous highlights
        document.querySelectorAll('.current-line-indicator').forEach(el => {
            el.classList.remove('current-line-indicator');
        });
        
        // Add highlight to current line
        const lineElement = document.querySelector(`.CodeMirror-line:nth-child(${lineNumber})`);
        if (lineElement) {
            lineElement.classList.add('current-line-indicator');
        }
    }
    
    step() {
        console.log('Step through code');
    }
    
    continue() {
        console.log('Continue execution');
    }
    
    stop() {
        this.isActive = false;
        const panel = document.getElementById('debugger-panel');
        if (panel) {
            panel.classList.remove('active');
        }
    }
    
    handleDebugError(error) {
        console.error('Debug error:', error);
        this.stop();
    }
}

// --- SMART CODE ANALYSIS ---
class SmartCodeAnalyzer {
    analyzeCode(code) {
        const analysis = {
            hasInfiniteLoop: false,
            suggestions: [],
            antiPatterns: [],
            complexity: 0
        };
        
        // Check for infinite loops
        analysis.hasInfiniteLoop = this.detectInfiniteLoop(code);
        
        // Check for anti-patterns
        analysis.antiPatterns = this.detectAntiPatterns(code);
        
        // Suggest optimizations
        analysis.suggestions = this.suggestOptimizations(code);
        
        // Calculate complexity
        analysis.complexity = this.calculateComplexity(code);
        
        return analysis;
    }
    
    detectInfiniteLoop(code) {
        // Simple heuristic checks
        const patterns = [
            /while\s+True\s*:(?![\s\S]*break)/,  // while True without break
            /while\s+1\s*:(?![\s\S]*break)/,     // while 1 without break
            /while\s+([a-zA-Z_]\w*)\s*:(?![\s\S]*\1\s*=)/, // while var: without modifying var
        ];
        
        return patterns.some(pattern => pattern.test(code));
    }
    
    detectAntiPatterns(code) {
        const antiPatterns = [];
        
        // Using == for None comparison
        if (/==\s*None/.test(code) || /!=\s*None/.test(code)) {
            antiPatterns.push({
                type: 'none-comparison',
                message: 'Use "is None" or "is not None" instead of == or != with None',
                line: this.findLineNumber(code, /[!=]=\s*None/)
            });
        }
        
        // Mutable default arguments
        if (/def\s+\w+\s*\([^)]*=\s*\[/.test(code) || /def\s+\w+\s*\([^)]*=\s*\{/.test(code)) {
            antiPatterns.push({
                type: 'mutable-default',
                message: 'Avoid mutable default arguments (lists or dicts)',
                line: this.findLineNumber(code, /def\s+\w+\s*\([^)]*=\s*[\[{]/)
            });
        }
        
        // Bare except
        if (/except\s*:/.test(code)) {
            antiPatterns.push({
                type: 'bare-except',
                message: 'Avoid bare except clauses. Specify the exception type.',
                line: this.findLineNumber(code, /except\s*:/)
            });
        }
        
        return antiPatterns;
    }
    
    suggestOptimizations(code) {
        const suggestions = [];
        
        // Suggest list comprehension
        if (/for\s+\w+\s+in\s+[\w\[\]]+\s*:\s*\n\s*\w+\.append\(/.test(code)) {
            suggestions.push({
                type: 'list-comprehension',
                message: 'Consider using a list comprehension for better performance',
                example: 'result = [item for item in items if condition]'
            });
        }
        
        // Suggest enumerate
        if (/for\s+i\s+in\s+range\(len\((\w+)\)\)\s*:[\s\S]*\1\[i\]/.test(code)) {
            suggestions.push({
                type: 'use-enumerate',
                message: 'Use enumerate() instead of range(len())',
                example: 'for i, item in enumerate(items):'
            });
        }
        
        // Suggest f-strings
        if (/['"].*%[sd].*['"]/.test(code) || /\.format\(/.test(code)) {
            suggestions.push({
                type: 'use-f-strings',
                message: 'Consider using f-strings for cleaner string formatting',
                example: 'f"Hello {name}"'
            });
        }
        
        return suggestions;
    }
    
    calculateComplexity(code) {
        let complexity = 1;
        
        // Count decision points
        complexity += (code.match(/\bif\b/g) || []).length;
        complexity += (code.match(/\belif\b/g) || []).length;
        complexity += (code.match(/\bfor\b/g) || []).length;
        complexity += (code.match(/\bwhile\b/g) || []).length;
        complexity += (code.match(/\band\b/g) || []).length;
        complexity += (code.match(/\bor\b/g) || []).length;
        
        return complexity;
    }
    
    findLineNumber(code, pattern) {
        const lines = code.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (pattern.test(lines[i])) {
                return i + 1;
            }
        }
        return -1;
    }
}

// --- THEME MANAGER ---
class ThemeManager {
    constructor() {
        this.themes = ['light', 'dark', 'high-contrast'];
        this.currentTheme = this.loadTheme() || 'light';
        this.fontSize = this.loadFontSize() || 'normal';
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.applyFontSize(this.fontSize);
        this.createThemeControls();
        this.createAccessibilityPanel();
    }
    
    createThemeControls() {
        const controls = document.createElement('div');
        controls.className = 'theme-controls no-print';
        controls.innerHTML = `
            <button class="theme-btn" data-theme="light" title="Light Theme">☀️</button>
            <button class="theme-btn" data-theme="dark" title="Dark Theme">🌙</button>
            <button class="theme-btn" data-theme="high-contrast" title="High Contrast">🔲</button>
            <button class="theme-btn" id="accessibility-btn" title="Accessibility Options">♿</button>
        `;
        
        document.body.appendChild(controls);
        
        // Add event listeners
        controls.querySelectorAll('[data-theme]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setTheme(btn.dataset.theme);
            });
        });
        
        document.getElementById('accessibility-btn').addEventListener('click', () => {
            this.toggleAccessibilityPanel();
        });
        
        this.updateThemeButtons();
    }
    
    createAccessibilityPanel() {
        const panel = document.createElement('div');
        panel.className = 'accessibility-panel no-print';
        panel.innerHTML = `
            <h4>Accessibility Options</h4>
            <div class="font-size-control">
                <label>Font Size:</label>
                <button onclick="window.themeManager.changeFontSize('small')">A-</button>
                <button onclick="window.themeManager.changeFontSize('normal')">A</button>
                <button onclick="window.themeManager.changeFontSize('large')">A+</button>
                <button onclick="window.themeManager.changeFontSize('extra-large')">A++</button>
            </div>
            <div class="keyboard-nav-info">
                <p>Keyboard Navigation:</p>
                <ul>
                    <li>Tab: Navigate between elements</li>
                    <li>Enter: Activate buttons/links</li>
                    <li>Arrow keys: Navigate lists</li>
                </ul>
            </div>
        `;
        
        document.body.appendChild(panel);
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        this.saveTheme(theme);
        this.updateThemeButtons();
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update CodeMirror theme
        if (window.appState && window.appState.editor) {
            const cmTheme = theme === 'dark' ? 'monokai' : 'default';
            window.appState.editor.setOption('theme', cmTheme);
        }
    }
    
    updateThemeButtons() {
        document.querySelectorAll('.theme-btn[data-theme]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === this.currentTheme);
        });
    }
    
    changeFontSize(size) {
        this.fontSize = size;
        this.applyFontSize(size);
        this.saveFontSize(size);
    }
    
    applyFontSize(size) {
        document.body.className = document.body.className.replace(/font-size-\w+/g, '');
        document.body.classList.add(`font-size-${size}`);
    }
    
    toggleAccessibilityPanel() {
        const panel = document.querySelector('.accessibility-panel');
        panel.classList.toggle('show');
    }
    
    saveTheme(theme) {
        localStorage.setItem('pythonProjectTheme', theme);
    }
    
    loadTheme() {
        return localStorage.getItem('pythonProjectTheme');
    }
    
    saveFontSize(size) {
        localStorage.setItem('pythonProjectFontSize', size);
    }
    
    loadFontSize() {
        return localStorage.getItem('pythonProjectFontSize');
    }
}

// --- PROGRESS VISUALIZATION ---
class ProgressVisualizer {
    constructor() {
        this.chart = null;
    }
    
    createProgressChart(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const canvas = document.createElement('canvas');
        canvas.id = 'progress-chart';
        container.appendChild(canvas);
        
        // Calculate progress data
        const progressData = this.calculateProgressData();
        
        // Create chart using Chart.js (if available)
        if (typeof Chart !== 'undefined') {
            this.chart = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: progressData.labels,
                    datasets: [{
                        label: 'Tasks Completed',
                        data: progressData.completed,
                        backgroundColor: '#198754',
                        borderColor: '#157347',
                        borderWidth: 1
                    }, {
                        label: 'Total Tasks',
                        data: progressData.total,
                        backgroundColor: '#e9ecef',
                        borderColor: '#dee2e6',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } else {
            // Fallback: Create simple HTML progress bars
            this.createSimpleProgressBars(container, progressData);
        }
    }
    
    calculateProgressData() {
        const sections = {};
        
        // Initialize sections
        for (let i = 1; i <= 6; i++) {
            sections[i] = { total: 0, completed: 0 };
        }
        
        // Count tasks - Fixed to use window.TASKS
        if (window.TASKS) {
            for (const [taskId, task] of Object.entries(window.TASKS)) {
                sections[task.section].total++;
                if (window.appState && window.appState.userProgress[taskId]?.completed) {
                    sections[task.section].completed++;
                }
            }
        }
        
        return {
            labels: Object.keys(sections).map(s => s === '6' ? 'Challenges' : `Section ${s}`),
            completed: Object.values(sections).map(s => s.completed),
            total: Object.values(sections).map(s => s.total)
        };
    }
    
    createSimpleProgressBars(container, data) {
        container.innerHTML = '<h4>Progress by Section</h4>';
        
        data.labels.forEach((label, index) => {
            const completed = data.completed[index];
            const total = data.total[index];
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
            
            const progressBar = document.createElement('div');
            progressBar.className = 'simple-progress-bar';
            progressBar.innerHTML = `
                <div class="progress-label">${label}: ${completed}/${total} (${percentage}%)</div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
            `;
            container.appendChild(progressBar);
        });
    }
    
    createActivityHeatmap(containerId) {
        // Create a calendar heatmap showing daily activity
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const activityData = this.getActivityData();
        const heatmap = this.renderHeatmap(activityData);
        container.appendChild(heatmap);
    }
    
    getActivityData() {
        // Get activity data from user progress timestamps
        const activity = {};
        
        // This would be populated from actual usage data
        // For now, return sample data
        const today = new Date();
        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            activity[dateStr] = Math.floor(Math.random() * 5);
        }
        
        return activity;
    }
    
    renderHeatmap(data) {
        const container = document.createElement('div');
        container.className = 'activity-heatmap';
        
        // Simple heatmap implementation
        // In production, use a library like Cal-Heatmap
        
        return container;
    }
}

// --- SMART HINTS SYSTEM ---
class SmartHintSystem {
    constructor() {
        this.hintUsage = {};
        this.userErrors = {};
    }
    
    getSmartHint(taskId, attemptCount, lastError) {
        const task = window.TASKS ? window.TASKS[taskId] : null;
        if (!task) return null;
        
        // Track hint usage
        if (!this.hintUsage[taskId]) {
            this.hintUsage[taskId] = { count: 0, shownHints: [] };
        }
        
        // Analyze error patterns
        const errorType = this.classifyError(lastError);
        
        // Get appropriate hint based on context
        let hint = null;
        
        if (errorType && ERROR_EXPLANATIONS[errorType]) {
            // Error-specific hint
            hint = {
                type: 'error',
                title: 'Error Help',
                content: ERROR_EXPLANATIONS[errorType].hint,
                example: ERROR_EXPLANATIONS[errorType].example
            };
        } else if (attemptCount > 3) {
            // Struggling - provide more direct hint
            hint = {
                type: 'direct',
                title: 'Direct Hint',
                content: task.hints[Math.min(attemptCount - 3, task.hints.length - 1)]
            };
        } else {
            // Progressive hint
            const hintIndex = this.hintUsage[taskId].count % task.hints.length;
            hint = {
                type: 'progressive',
                title: `Hint ${hintIndex + 1}`,
                content: task.hints[hintIndex]
            };
        }
        
        this.hintUsage[taskId].count++;
        this.hintUsage[taskId].shownHints.push(hint);
        
        return hint;
    }
    
    classifyError(error) {
        if (!error) return null;
        
        const errorStr = error.toString();
        for (const [errorType, _] of Object.entries(ERROR_EXPLANATIONS)) {
            if (errorStr.includes(errorType)) {
                return errorType;
            }
        }
        
        return null;
    }
}

// --- EXPORT MANAGER ---
class ExportManager {
    async exportToPDF() {
        // Check if jsPDF is available
        if (typeof jsPDF === 'undefined') {
            await this.loadJsPDF();
        }
        
        const pdf = new jsPDF();
        let yPosition = 20;
        
        // Add title
        pdf.setFontSize(20);
        pdf.text('Python Summer Project - Progress Report', 20, yPosition);
        yPosition += 15;
        
        // Add student info
        pdf.setFontSize(12);
        pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
        yPosition += 10;
        
        if (window.appState) {
            pdf.text(`Total XP: ${window.appState.xpData.totalXP}`, 20, yPosition);
            yPosition += 10;
            pdf.text(`Current Badge: ${window.appState.xpData.currentBadge}`, 20, yPosition);
            yPosition += 15;
            
            // Add completed tasks
            pdf.setFontSize(14);
            pdf.text('Completed Tasks:', 20, yPosition);
            yPosition += 10;
            
            pdf.setFontSize(10);
            for (const [taskId, progress] of Object.entries(window.appState.userProgress)) {
                if (progress.completed && window.TASKS) {
                    const task = window.TASKS[taskId];
                    pdf.text(`${taskId}: ${task.title}`, 25, yPosition);
                    yPosition += 7;
                    
                    if (yPosition > 270) {
                        pdf.addPage();
                        yPosition = 20;
                    }
                }
            }
        }
        
        // Save PDF
        pdf.save('python-project-progress.pdf');
    }
    
    async exportWorkbook() {
        // Export all completed code as a workbook
        const workbook = this.generateWorkbook();
        
        // Create blob and download
        const blob = new Blob([workbook], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'python-project-workbook.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    generateWorkbook() {
        let html = `
<!DOCTYPE html>
<html>
<head>
    <title>Python Project Workbook</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .task { margin-bottom: 40px; page-break-inside: avoid; }
        .task-header { background: #f0f0f0; padding: 10px; }
        .code { background: #f5f5f5; padding: 15px; border-left: 3px solid #4CAF50; }
        pre { white-space: pre-wrap; }
        @media print { .task { page-break-inside: avoid; } }
    </style>
</head>
<body>
    <h1>Python Summer Project - Completed Solutions</h1>`;
        
        if (window.appState) {
            html += `
    <p>Student: ${window.appState.xpData.currentBadge} (${window.appState.xpData.totalXP} XP)</p>
    <p>Generated: ${new Date().toLocaleDateString()}</p>
    <hr>
`;
            
            for (const [taskId, progress] of Object.entries(window.appState.userProgress)) {
                if (progress.completed && progress.code && window.TASKS) {
                    const task = window.TASKS[taskId];
                    html += `
    <div class="task">
        <div class="task-header">
            <h2>Task ${taskId}: ${task.title}</h2>
        </div>
        <div class="code">
            <pre>${this.escapeHtml(progress.code)}</pre>
        </div>
    </div>
`;
                }
            }
        }
        
        html += `
</body>
</html>`;
        
        return html;
    }
    
    generateCertificate() {
        if (!window.appState || !window.TASKS) return;
        
        const completedTasks = Object.values(window.appState.userProgress).filter(p => p.completed).length;
        const totalTasks = Object.keys(window.TASKS).length;
        const percentage = Math.round((completedTasks / totalTasks) * 100);
        
        if (percentage < 80) {
            if (window.showToast) {
                window.showToast('Complete at least 80% of tasks to generate a certificate!', 'warning');
            }
            return;
        }
        
        // Create certificate HTML
        const certificate = `
<!DOCTYPE html>
<html>
<head>
    <title>Certificate of Completion</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            text-align: center;
            padding: 50px;
            background: linear-gradient(to bottom, #f0f9ff, #e0f2fe);
        }
        .certificate {
            max-width: 800px;
            margin: 0 auto;
            padding: 50px;
            background: white;
            border: 2px solid #0369a1;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        h1 { font-size: 48px; color: #0c4a6e; margin-bottom: 20px; }
        h2 { font-size: 32px; color: #0369a1; }
        .date { margin-top: 50px; font-size: 18px; }
        .stats { margin: 30px 0; font-size: 20px; }
        .signature { margin-top: 50px; border-top: 2px solid #0369a1; display: inline-block; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="certificate">
        <h1>Certificate of Completion</h1>
        <h2>Python Summer Project</h2>
        <p style="font-size: 24px; margin: 30px 0;">This certifies that</p>
        <h2 style="font-size: 36px; color: #0c4a6e;">${window.appState.xpData.currentBadge}</h2>
        <p style="font-size: 20px;">has successfully completed</p>
        <div class="stats">
            <strong>${completedTasks}</strong> out of <strong>${totalTasks}</strong> programming tasks<br>
            Earning <strong>${window.appState.xpData.totalXP} XP</strong>
        </div>
        <div class="date">
            ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <div class="signature">
            Python Learning Platform
        </div>
    </div>
</body>
</html>`;
        
        // Open in new window for printing
        const win = window.open('', 'Certificate', 'width=900,height=700');
        win.document.write(certificate);
        win.document.close();
        
        setTimeout(() => {
            win.print();
        }, 500);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    async loadJsPDF() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
}

// --- CONCEPT MAP ---
class ConceptMap {
    constructor() {
        this.concepts = this.buildConceptHierarchy();
        this.connections = this.buildConnections();
    }
    
    buildConceptHierarchy() {
        return {
            'basics': {
                name: 'Python Basics',
                x: 400, y: 50,
                children: ['variables', 'io', 'operators'],
                tasks: ['1-1', '1-2']
            },
            'variables': {
                name: 'Variables & Types',
                x: 200, y: 150,
                children: ['numbers', 'strings'],
                tasks: ['1-3', '1-4', '1-5']
            },
            'io': {
                name: 'Input/Output',
                x: 400, y: 150,
                children: [],
                tasks: ['1-2', '1-14']
            },
            'operators': {
                name: 'Operators',
                x: 600, y: 150,
                children: ['arithmetic', 'comparison', 'logical'],
                tasks: ['1-6', '1-7', '1-8']
            },
            'numbers': {
                name: 'Numbers',
                x: 100, y: 250,
                children: [],
                tasks: ['1-3', '1-5', '1-11']
            },
            'strings': {
                name: 'Strings',
                x: 300, y: 250,
                children: ['string_methods'],
                tasks: ['1-9', '1-12', '4-7', '4-8']
            },
            'arithmetic': {
                name: 'Arithmetic',
                x: 500, y: 250,
                children: [],
                tasks: ['1-6', '1-7', '1-8']
            },
            'comparison': {
                name: 'Comparison',
                x: 600, y: 250,
                children: [],
                tasks: ['2-1', '2-2', '2-3']
            },
            'logical': {
                name: 'Logical',
                x: 700, y: 250,
                children: [],
                tasks: ['2-6', '2-7', '2-8']
            },
            'selection': {
                name: 'Selection',
                x: 400, y: 350,
                children: ['if_else', 'nested_if'],
                tasks: ['2-1', '2-2', '2-3', '2-4', '2-5']
            },
            'if_else': {
                name: 'If/Else',
                x: 300, y: 450,
                children: [],
                tasks: ['2-1', '2-2', '2-3']
            },
            'nested_if': {
                name: 'Nested Selection',
                x: 500, y: 450,
                children: [],
                tasks: ['2-9', '2-10']
            },
            'loops': {
                name: 'Loops',
                x: 200, y: 550,
                children: ['for_loops', 'while_loops'],
                tasks: ['3-1', '3-2', '3-3']
            },
            'for_loops': {
                name: 'For Loops',
                x: 100, y: 650,
                children: [],
                tasks: ['3-1', '3-2', '3-3', '3-4']
            },
            'while_loops': {
                name: 'While Loops',
                x: 300, y: 650,
                children: [],
                tasks: ['3-5', '3-6', '3-7']
            },
            'lists': {
                name: 'Lists & Arrays',
                x: 600, y: 550,
                children: ['list_methods', 'list_iteration'],
                tasks: ['4-1', '4-2', '4-3']
            },
            'list_methods': {
                name: 'List Methods',
                x: 500, y: 650,
                children: [],
                tasks: ['4-3', '4-5', '4-11']
            },
            'list_iteration': {
                name: 'List Iteration',
                x: 700, y: 650,
                children: [],
                tasks: ['4-2', '4-9', '4-10']
            },
            'string_methods': {
                name: 'String Methods',
                x: 300, y: 350,
                children: [],
                tasks: ['4-6', '4-7', '4-8', '4-12']
            },
            'functions': {
                name: 'Functions',
                x: 400, y: 750,
                children: ['procedures', 'return_values'],
                tasks: ['5-1', '5-2', '5-3']
            },
            'procedures': {
                name: 'Procedures',
                x: 300, y: 850,
                children: [],
                tasks: ['5-1', '5-2']
            },
            'return_values': {
                name: 'Return Values',
                x: 500, y: 850,
                children: [],
                tasks: ['5-3', '5-4', '5-5']
            }
        };
    }
    
    buildConnections() {
        const connections = [];
        
        for (const [conceptId, concept] of Object.entries(this.concepts)) {
            for (const childId of concept.children) {
                connections.push({
                    from: conceptId,
                    to: childId
                });
            }
        }
        
        // Add cross-connections
        connections.push(
            { from: 'comparison', to: 'selection' },
            { from: 'logical', to: 'selection' },
            { from: 'strings', to: 'lists' },
            { from: 'loops', to: 'lists' },
            { from: 'selection', to: 'functions' },
            { from: 'loops', to: 'functions' }
        );
        
        return connections;
    }
    
    render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }
    
    container.innerHTML = '';
    container.style.cssText = 'width: 100%; height: 600px; position: relative; overflow: auto; background: #f5f5f5;';
    
    // Create a canvas-like container
    const canvas = document.createElement('div');
    canvas.style.cssText = 'position: relative; width: 900px; height: 950px; margin: 0 auto;';
    
    // First, draw all connections as lines
    this.connections.forEach(conn => {
        const from = this.concepts[conn.from];
        const to = this.concepts[conn.to];
        
        if (from && to) {
            const line = document.createElement('div');
            
            // Calculate line position and angle
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            line.style.cssText = `
                position: absolute;
                left: ${from.x}px;
                top: ${from.y}px;
                width: ${length}px;
                height: 2px;
                background: #ddd;
                transform-origin: 0 50%;
                transform: rotate(${angle}deg);
                z-index: 1;
            `;
            
            canvas.appendChild(line);
        }
    });
    
    // Then draw all concept nodes
    for (const [conceptId, concept] of Object.entries(this.concepts)) {
        const node = document.createElement('div');
        
        // Check completion status
        const isCompleted = this.isConceptCompleted(concept);
        const isCurrent = this.isConceptCurrent(concept);
        
        // Style based on status
        let bgColor = '#e0e0e0';
        let textColor = '#333';
        let borderColor = '#ccc';
        
        if (isCompleted) {
            bgColor = '#4CAF50';
            textColor = 'white';
            borderColor = '#388E3C';
        } else if (isCurrent) {
            bgColor = '#FFC107';
            textColor = '#333';
            borderColor = '#F57C00';
        }
        
        node.style.cssText = `
            position: absolute;
            left: ${concept.x - 60}px;
            top: ${concept.y - 30}px;
            width: 120px;
            height: 60px;
            background: ${bgColor};
            color: ${textColor};
            border: 2px solid ${borderColor};
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            z-index: 10;
            padding: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        `;
        
        node.textContent = concept.name;
        
        // Hover effect
        node.addEventListener('mouseenter', () => {
            node.style.transform = 'scale(1.1)';
            node.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            node.style.zIndex = '20';
        });
        
        node.addEventListener('mouseleave', () => {
            node.style.transform = 'scale(1)';
            node.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            node.style.zIndex = '10';
        });
        
        // Click handler
        node.addEventListener('click', () => {
            this.showConceptDetails(conceptId, concept);
        });
        
        canvas.appendChild(node);
    }
    
    // Add title
    const title = document.createElement('div');
    title.style.cssText = `
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 18px;
        font-weight: bold;
        color: #333;
    `;
    title.textContent = 'Python Learning Path';
    canvas.appendChild(title);
    
    container.appendChild(canvas);
}
    
    createNode(conceptId, concept) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', `translate(${concept.x}, ${concept.y})`);
        g.style.cursor = 'pointer';
        
        // Check completion status
        const isCompleted = this.isConceptCompleted(concept);
        const isCurrent = this.isConceptCurrent(concept);
        
        // Create circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', '40');
        circle.setAttribute('fill', isCompleted ? '#198754' : (isCurrent ? '#ffc107' : '#e9ecef'));
        circle.setAttribute('stroke', isCompleted ? '#157347' : (isCurrent ? '#ff9800' : '#dee2e6'));
        circle.setAttribute('stroke-width', '3');
        
        // Create text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dy', '5');
        text.setAttribute('fill', isCompleted ? 'white' : 'black');
        text.setAttribute('font-size', '12');
        text.textContent = concept.name;
        
        g.appendChild(circle);
        g.appendChild(text);
        
        // Add click handler
        g.addEventListener('click', () => {
            this.showConceptDetails(conceptId, concept);
        });
        
        return g;
    }
    
    isConceptCompleted(concept) {
        if (!window.appState) return false;
        return concept.tasks.every(taskId => window.appState.userProgress[taskId]?.completed);
    }
    
    isConceptCurrent(concept) {
        if (!window.appState) return false;
        return concept.tasks.some(taskId => taskId === window.appState.currentTaskId);
    }
    
    showConceptDetails(conceptId, concept) {
    if (!window.appState) return;
    
    const completed = concept.tasks.filter(taskId => window.appState.userProgress[taskId]?.completed).length;
    const total = concept.tasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Create a nice modal popup
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
    `;
    
    const taskList = concept.tasks.map(taskId => {
        const task = window.TASKS ? window.TASKS[taskId] : null;
        const isCompleted = window.appState.userProgress[taskId]?.completed;
        const checkmark = isCompleted ? '✅' : '⬜';
        const taskTitle = task ? task.title : taskId;
        return `<li>${checkmark} ${taskId}: ${taskTitle}</li>`;
    }).join('');
    
    popup.innerHTML = `
        <h3 style="margin-top: 0; color: #333;">${concept.name}</h3>
        <div style="margin: 10px 0;">
            <div style="background: #e0e0e0; height: 20px; border-radius: 10px; overflow: hidden;">
                <div style="width: ${percentage}%; height: 100%; background: #4CAF50; transition: width 0.3s;"></div>
            </div>
            <p style="text-align: center; margin: 5px 0; color: #666;">${completed}/${total} tasks completed (${percentage}%)</p>
        </div>
        <div style="max-height: 200px; overflow-y: auto; margin: 15px 0;">
            <p style="font-weight: bold; margin-bottom: 5px;">Tasks in this concept:</p>
            <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
                ${taskList}
            </ul>
        </div>
        <button onclick="this.parentElement.remove(); document.getElementById('concept-overlay').remove();" 
                style="background: #2196F3; color: white; border: none; padding: 8px 20px; border-radius: 4px; cursor: pointer; width: 100%; margin-top: 10px;">
            Close
        </button>
    `;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'concept-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
    `;
    overlay.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
    });
    
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
}
}

// --- CODE PLAYGROUND ---
class CodePlayground {
    constructor() {
        this.playgroundEditor = null;
    }
    
    create() {
    const container = document.createElement('div');
    container.className = 'playground-container';
    container.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: 500px; padding: 20px;';
    
    // Editor section
    const editorSection = document.createElement('div');
    editorSection.style.cssText = 'display: flex; flex-direction: column; background: #2d2d2d; border-radius: 8px; overflow: hidden;';
    
    // Editor header
    const editorHeader = document.createElement('div');
    editorHeader.style.cssText = 'background: #1e1e1e; padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444;';
    editorHeader.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="color: #fff; font-weight: 500;">🐍 Python Playground</span>
            <span style="color: #888; font-size: 12px;">Write and test your code</span>
        </div>
        <div style="display: flex; gap: 8px;">
            <button onclick="window.playground.run()" style="background: #4CAF50; color: white; border: none; padding: 6px 16px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 14px; font-weight: 500;">
                ▶ Run
            </button>
            <button onclick="window.playground.clear()" style="background: #555; color: white; border: none; padding: 6px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                Clear
            </button>
            <button onclick="window.playground.save()" style="background: #2196F3; color: white; border: none; padding: 6px 16px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 14px;">
                💾 Save
            </button>
        </div>
    `;
    
    // Editor wrapper
    const editorWrapper = document.createElement('div');
    editorWrapper.style.cssText = 'flex: 1; position: relative;';
    
    const editorTextarea = document.createElement('textarea');
    editorTextarea.id = 'playground-editor';
    editorTextarea.style.cssText = 'width: 100%; height: 100%; border: none; outline: none; resize: none;';
    
    editorWrapper.appendChild(editorTextarea);
    editorSection.appendChild(editorHeader);
    editorSection.appendChild(editorWrapper);
    
    // Output section
    const outputSection = document.createElement('div');
    outputSection.style.cssText = 'display: flex; flex-direction: column; background: #f8f9fa; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0;';
    
    // Output header
    const outputHeader = document.createElement('div');
    outputHeader.style.cssText = 'background: #fff; padding: 10px 15px; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;';
    outputHeader.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-weight: 500; color: #333;">📤 Output</span>
            <span id="execution-status" style="font-size: 12px; color: #666;"></span>
        </div>
        <button onclick="document.getElementById('playground-output').textContent=''" style="background: none; border: 1px solid #ddd; padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; color: #666;">
            Clear Output
        </button>
    `;
    
    // Output content
    const outputContent = document.createElement('div');
    outputContent.style.cssText = 'flex: 1; padding: 15px; overflow-y: auto; background: #fff;';
    
    const outputPre = document.createElement('pre');
    outputPre.id = 'playground-output';
    outputPre.style.cssText = 'margin: 0; font-family: "Courier New", monospace; font-size: 14px; line-height: 1.5; color: #333; white-space: pre-wrap; word-wrap: break-word;';
    outputPre.textContent = 'Click "Run" to execute your code...';
    
    outputContent.appendChild(outputPre);
    outputSection.appendChild(outputHeader);
    outputSection.appendChild(outputContent);
    
    // Add keyboard shortcuts info
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.style.cssText = 'grid-column: 1 / -1; padding: 10px; background: #f0f0f0; border-radius: 4px; font-size: 12px; color: #666; text-align: center;';
    shortcutsInfo.innerHTML = '💡 <strong>Tip:</strong> Press Ctrl+Enter to run your code';
    
    container.appendChild(editorSection);
    container.appendChild(outputSection);
    container.appendChild(shortcutsInfo);
    
    return container;
}
    
    init() {
    const textarea = document.getElementById('playground-editor');
    if (!textarea) return;
    
    // Check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
        console.error('CodeMirror not loaded');
        return;
    }
    
    this.playgroundEditor = CodeMirror.fromTextArea(textarea, {
        mode: 'python',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        lineWrapping: true,
        extraKeys: {
            "Ctrl-Enter": () => this.run(),
            "Cmd-Enter": () => this.run(),
            "Ctrl-S": () => this.save(),
            "Cmd-S": () => this.save()
        }
    });
    
    // Set size to fill container
    this.playgroundEditor.setSize("100%", "100%");
    
    // Load saved playground code
    const saved = localStorage.getItem('pythonProjectPlayground');
    if (saved) {
        this.playgroundEditor.setValue(saved);
    } else {
        // Set default starter code
        this.playgroundEditor.setValue(`# Welcome to the Python Playground!
# Write your code here and click Run to execute it.

print("Hello, World!")

# Try some calculations
x = 5
y = 3
print(f"{x} + {y} = {x + y}")

# Get user input
name = input("What's your name? ")
print(f"Nice to meet you, {name}!")
`);
    }
}
    
    async run() {
    if (!this.playgroundEditor || !window.appState || !window.ensurePyodideLoaded) return;
    
    const code = this.playgroundEditor.getValue();
    const outputEl = document.getElementById('playground-output');
    const statusEl = document.getElementById('execution-status');
    
    // Update status
    if (statusEl) {
        statusEl.textContent = '⏳ Running...';
        statusEl.style.color = '#ff9800';
    }
    
    // Clear output and show loading
    outputEl.textContent = '';
    outputEl.style.color = '#333';
    
    try {
        const pyodide = await window.ensurePyodideLoaded();
        
        // Set up output capture
        pyodide.runPython(`
            import sys, io
            sys.stdout = io.StringIO()
            sys.stderr = io.StringIO()
        `);
        
        // Run the code
        await pyodide.runPythonAsync(code);
        
        // Get output
        const stdout = pyodide.runPython(`sys.stdout.getvalue()`);
        const stderr = pyodide.runPython(`sys.stderr.getvalue()`);
        
        if (stderr) {
            outputEl.textContent = stderr;
            outputEl.style.color = '#d32f2f';
            if (statusEl) {
                statusEl.textContent = '❌ Error';
                statusEl.style.color = '#d32f2f';
            }
        } else {
            outputEl.textContent = stdout || '(No output)';
            outputEl.style.color = '#333';
            if (statusEl) {
                statusEl.textContent = '✅ Success';
                statusEl.style.color = '#4CAF50';
            }
        }
    } catch (error) {
        outputEl.textContent = error.toString();
        outputEl.style.color = '#d32f2f';
        if (statusEl) {
            statusEl.textContent = '❌ Error';
            statusEl.style.color = '#d32f2f';
        }
    } finally {
        // Reset Python environment
        if (window.appState.pyodide) {
            window.appState.pyodide.runPython(`
                import sys
                from js import prompt
                
                def custom_input(prompt_text=""):
                    res = prompt(prompt_text)
                    print(prompt_text, end="")
                    return res if res is not None else ""
                
                __builtins__.input = custom_input
            `);
        }
    }
}
    
    clear() {
        if (this.playgroundEditor) {
            this.playgroundEditor.setValue('');
        }
        const outputEl = document.getElementById('playground-output');
        if (outputEl) {
            outputEl.textContent = '';
        }
    }
    
    save() {
        if (this.playgroundEditor) {
            const code = this.playgroundEditor.getValue();
            localStorage.setItem('pythonProjectPlayground', code);
            if (window.showToast) {
                window.showToast('Playground code saved!', 'success');
            }
        }
    }
}

// --- ACHIEVEMENT TRACKER ---
class AchievementTracker {
    constructor() {
        this.unlockedAchievements = this.loadAchievements() || [];
    }
    
checkAchievements() {
        if (!window.appState) return;
        
        // Ensure unlockedAchievements is an array
        if (!Array.isArray(this.unlockedAchievements)) {
            console.error('unlockedAchievements is not an array, resetting');
            this.unlockedAchievements = [];
            this.saveAchievements();
        }
        
        ACHIEVEMENTS.forEach(achievement => {
            if (!this.unlockedAchievements.includes(achievement.id)) {
                if (this.checkAchievementCondition(achievement)) {
                    this.unlockAchievement(achievement);
                }
            }
        });
    }
    
    checkAchievementCondition(achievement) {
        if (!window.appState) return false;
        
        switch (achievement.id) {
            case 'first-steps':
                return Object.values(window.appState.userProgress).some(p => p.completed);
                
            case 'perfectionist':
                let tasksWithoutHints = 0;
                for (const [taskId, progress] of Object.entries(window.appState.userProgress)) {
                    if (progress.completed && !progress.hintIndex) {
                        tasksWithoutHints++;
                    }
                }
                return tasksWithoutHints >= 10;
                
            case 'speed-demon':
                // Check if any task was completed in under 2 minutes
                // This would require tracking start/completion times
                return false; // TODO: Implement timing
                
            case 'theory-master':
                let correctTheory = 0;
                for (const [_, qData] of Object.entries(window.appState.xpData.theoryXP || {})) {
                    correctTheory++;
                }
                return correctTheory >= 20;
                
            case 'section-complete':
                return Object.values(window.appState.completedSections).some(completed => completed);
                
            case 'halfway-there':
                if (!window.TASKS) return false;
                const totalTasks = Object.keys(window.TASKS).length;
                const completedTasks = Object.values(window.appState.userProgress).filter(p => p.completed).length;
                return completedTasks >= totalTasks / 2;
                
            case 'bug-free':
                // TODO: Track first-run successes
                return false;
                
            case 'persistent':
                return window.appState.streakData.currentStreak >= 7;
                
            case 'explorer':
                if (!window.TASKS) return false;
                const touchedSections = new Set();
                for (const [taskId, progress] of Object.entries(window.appState.userProgress)) {
                    if (progress.code && progress.code.length > 10) {
                        touchedSections.add(window.TASKS[taskId].section);
                    }
                }
                return touchedSections.size >= 6;
                
            case 'helper':
                let hintsUsed = 0;
                for (const [_, progress] of Object.entries(window.appState.userProgress)) {
                    if (progress.hintIndex && progress.hintIndex > 0) {
                        hintsUsed++;
                    }
                }
                return hintsUsed >= 10;
                
            default:
                return false;
        }
    }
    
    unlockAchievement(achievement) {
        if (!window.appState) return;
        
        this.unlockedAchievements.push(achievement.id);
        this.saveAchievements();
        
        // Award XP
        window.appState.xpData.totalXP += achievement.xp;
        if (window.saveXPData) window.saveXPData();
        if (window.updateXPDisplay) window.updateXPDisplay();
        
        // Show notification
        this.showAchievementNotification(achievement);
    }
    
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <h4>Achievement Unlocked!</h4>
                <p>${achievement.name}</p>
                <p>${achievement.desc}</p>
                <p>+${achievement.xp} XP</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    saveAchievements() {
        localStorage.setItem('pythonProjectAchievements', JSON.stringify(this.unlockedAchievements));
    }
    
    loadAchievements() {
        try {
            const saved = localStorage.getItem('pythonProjectAchievements');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Ensure it's an array
                if (Array.isArray(parsed)) {
                    return parsed;
                } else {
                    console.warn('Invalid achievements data, resetting to empty array');
                    return [];
                }
            }
            return [];
        } catch (e) {
            console.error('Error loading achievements:', e);
            return [];
        }
    }
}

// --- MODAL FUNCTIONS ---
function showProgressModal() {
    // Remove any existing modal first
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 9999;';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = 'background: white; width: 90%; max-width: 600px; max-height: 80vh; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden;';
    
    // Create header
    const header = document.createElement('div');
    header.style.cssText = 'padding: 20px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;';
    header.innerHTML = `
        <h2 style="margin: 0;">📊 Your Progress</h2>
        <button style="background: none; border: none; font-size: 24px; cursor: pointer;" onclick="this.closest('.modal-overlay').remove()">×</button>
    `;
    
    // Create body
    const body = document.createElement('div');
    body.style.cssText = 'padding: 20px; overflow-y: auto; flex: 1;';
    
    // Get progress data
    const xp = window.appState ? window.appState.xpData.totalXP : 0;
    const badge = window.appState ? window.appState.xpData.currentBadge : 'Beginner';
    const currentStreak = window.appState ? window.appState.streakData.currentStreak : 0;
    const longestStreak = window.appState ? window.appState.streakData.longestStreak : 0;
    
    // Calculate section progress
    let sectionHTML = '';
    for (let section = 1; section <= 6; section++) {
        const sectionTasks = Object.keys(TASKS || {}).filter(id => TASKS[id].section == section);
        const completedTasks = sectionTasks.filter(id => window.appState && window.appState.userProgress[id]?.completed).length;
        const totalTasks = sectionTasks.length;
        const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        const sectionName = section == 6 ? 'Challenges' : `Section ${section}`;
        sectionHTML += `
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>${sectionName}</span>
                    <span>${completedTasks}/${totalTasks} (${percentage}%)</span>
                </div>
                <div style="width: 100%; height: 20px; background: #f0f0f0; border-radius: 10px; overflow: hidden;">
                    <div style="width: ${percentage}%; height: 100%; background: #4CAF50; transition: width 0.3s;"></div>
                </div>
            </div>
        `;
    }
    
    // Set body content
    body.innerHTML = `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0;">Statistics</h3>
            <p style="margin: 5px 0;"><strong>Total XP:</strong> ${xp}</p>
            <p style="margin: 5px 0;"><strong>Current Badge:</strong> ${badge}</p>
            <p style="margin: 5px 0;"><strong>Current Streak:</strong> ${currentStreak} days</p>
            <p style="margin: 5px 0;"><strong>Longest Streak:</strong> ${longestStreak} days</p>
        </div>
        
        <div>
            <h3>Progress by Section</h3>
            ${sectionHTML}
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
            <h4 style="margin-top: 0;">Next Badge</h4>
            ${getNextBadgeInfo(xp)}
        </div>
    `;
    
    // Assemble modal
    modalContent.appendChild(header);
    modalContent.appendChild(body);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Helper function to get next badge info
function getNextBadgeInfo(currentXP) {
    const badges = [
        { name: 'Beginner', xpRequired: 0, icon: '🌱' },
        { name: 'Novice', xpRequired: 100, icon: '🌿' },
        { name: 'Apprentice', xpRequired: 250, icon: '🌳' },
        { name: 'Coder', xpRequired: 500, icon: '💻' },
        { name: 'Developer', xpRequired: 750, icon: '🚀' },
        { name: 'Expert', xpRequired: 1000, icon: '⭐' },
        { name: 'Master', xpRequired: 1250, icon: '🏆' },
        { name: 'Legend', xpRequired: 1500, icon: '👑' }
    ];
    
    for (let i = 0; i < badges.length; i++) {
        if (currentXP < badges[i].xpRequired) {
            const needed = badges[i].xpRequired - currentXP;
            const progress = i > 0 ? ((currentXP - badges[i-1].xpRequired) / (badges[i].xpRequired - badges[i-1].xpRequired) * 100) : 0;
            
            return `
                <p style="margin: 5px 0;">${badges[i].icon} <strong>${badges[i].name}</strong> - ${needed} XP needed</p>
                <div style="width: 100%; height: 10px; background: #ddd; border-radius: 5px; overflow: hidden;">
                    <div style="width: ${progress}%; height: 100%; background: #2196f3;"></div>
                </div>
            `;
        }
    }
    
    return '<p>🎉 You\'ve reached the highest badge!</p>';
}
window.showProgressModal = showProgressModal; // ADD THIS LINE

function showPlaygroundModal() {
    // Ensure enhanced features are initialized
    if (!window.appState.enhancedFeaturesInitialized) {
        if (typeof initializeEnhancedFeatures === 'function') {
            initializeEnhancedFeatures();
        }
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h2>🎮 Code Playground</h2>
                <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">×</button>
            </div>
            <div class="modal-body" style="padding: 0;">
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Create playground if it doesn't exist
    if (!window.appState.playground) {
        window.appState.playground = new CodePlayground();
    }
    
    // Create and append playground
    const playgroundElement = window.appState.playground.create();
    modal.querySelector('.modal-body').appendChild(playgroundElement);
    
    setTimeout(() => {
        window.appState.playground.init();
    }, 100);
}
window.showPlaygroundModal = showPlaygroundModal; // ADD THIS LINE

function showConceptMapModal() {
    // Ensure enhanced features are initialized
    if (!window.appState.enhancedFeaturesInitialized) {
        if (typeof initializeEnhancedFeatures === 'function') {
            initializeEnhancedFeatures();
        }
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h2>🗺️ Concept Map</h2>
                <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">×</button>
            </div>
            <div class="modal-body">
                <div id="concept-map-container" class="concept-map-container"></div>
                <div class="concept-map-legend">
                    <h4>Legend</h4>
                    <div><span style="color: #198754;">●</span> Completed</div>
                    <div><span style="color: #ffc107;">●</span> Current</div>
                    <div><span style="color: #e9ecef;">●</span> Not Started</div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Create concept map if it doesn't exist
    if (!window.appState.conceptMap) {
        window.appState.conceptMap = new ConceptMap();
    }
    
    // Render concept map
    setTimeout(() => {
        window.appState.conceptMap.render('concept-map-container');
    }, 100);
}
window.showConceptMapModal = showConceptMapModal; // ADD THIS LINE

// --- INITIALIZE ENHANCED FEATURES ---
function initializeEnhancedFeatures() {
    console.log('Initializing enhanced features...');
    // Check if appState exists
    if (!window.appState) {
        console.error('appState not found! Retrying in 1 second...');
        setTimeout(initializeEnhancedFeatures, 1000);
        return;
    }
    
    // Check if already initialized
    if (window.appState.enhancedFeaturesInitialized) {
        console.log('Enhanced features already initialized');
        return;
    }
    
    // Ensure appState exists
    if (!window.appState) {
        console.error('appState not found!');
        return;
    }
    
    // Initialize all enhanced features
    window.appState.versionManager = new CodeVersionManager();
    window.appState.debugger = new InteractiveDebugger();
    window.appState.codeAnalyzer = new SmartCodeAnalyzer();
    window.appState.themeManager = new ThemeManager();
    window.appState.progressVisualizer = new ProgressVisualizer();
    window.appState.smartHints = new SmartHintSystem();
    window.appState.exportManager = new ExportManager();
    window.appState.conceptMap = new ConceptMap();
    window.appState.playground = new CodePlayground();
    window.appState.achievementTracker = new AchievementTracker();
    
    // Add global references for onclick handlers
    window.debugger = window.appState.debugger;
    window.themeManager = window.appState.themeManager;
    window.playground = window.appState.playground;
    
    // Initialize theme manager
    window.appState.themeManager.init();
    
    // Load version history
    window.appState.versionManager.loadFromLocalStorage();
    
    // Check achievements
    window.appState.achievementTracker.checkAchievements();
    
    // Add debug hook
    window._updateDebugger = function(line, vars) {
        if (window.appState.debugger.isActive) {
            window.appState.debugger.currentLine = line;
            window.appState.debugger.variables = vars;
            window.appState.debugger.updateVariableDisplay();
            window.appState.debugger.highlightCurrentLine(line);
        }
    };
    
    // Initialize auto-save
    initializeAutoSave();
    
// Update button event listeners - add debug logging
    console.log('Setting up button event listeners...');
    
    const progressBtn = document.getElementById('progress-btn');
    console.log('Progress button found:', progressBtn);
    if (progressBtn) {
        progressBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Progress button clicked');
            if (window.showProgressModal) {
                window.showProgressModal();
            } else {
                console.error('showProgressModal not found on window');
            }
        });
    }
    
    const certBtn = document.getElementById('cert-btn');
    console.log('Certificate button found:', certBtn);
    if (certBtn) {
        certBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Certificate button clicked');
            if (window.appState && window.appState.exportManager) {
                window.appState.exportManager.generateCertificate();
            } else {
                console.error('Export manager not initialized');
            }
        });
    }
    
    const playgroundBtn = document.getElementById('playground-btn');
    console.log('Playground button found:', playgroundBtn);
    if (playgroundBtn) {
        playgroundBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Playground button clicked');
            if (window.showPlaygroundModal) {
                window.showPlaygroundModal();
            } else {
                console.error('showPlaygroundModal not found on window');
            }
        });
    }
    
    const mapBtn = document.getElementById('map-btn');
    console.log('Map button found:', mapBtn);
    if (mapBtn) {
        mapBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Map button clicked');
            if (window.showConceptMapModal) {
                window.showConceptMapModal();
            } else {
                console.error('showConceptMapModal not found on window');
            }
        });
    }
    
    // Initialize Programming Guide
    if (window.initializeProgrammingGuide) {
        window.initializeProgrammingGuide();
        console.log('Programming Guide initialized!');
    }
    
    console.log('Enhanced features initialized successfully!');
    // Mark as initialized
    window.appState.enhancedFeaturesInitialized = true;
}

// Initialize auto-save
function initializeAutoSave() {
    setInterval(() => {
        if (window.appState && window.appState.editor && window.appState.currentTaskId) {
            const currentCode = window.appState.editor.getValue();
            const lastSaved = window.appState.versionManager.lastSaveTime[window.appState.currentTaskId] || 0;
            const timeSinceLastSave = Date.now() - lastSaved;
            
            if (timeSinceLastSave > 30000) { // 30 seconds
                window.appState.versionManager.saveVersion(window.appState.currentTaskId, currentCode);
                if (window.showToast) {
                    window.showToast('Auto-saved', 'info');
                }
            }
        }
    }, 30000);
}

// Add modal styles
// Check if modal styles already exist
if (!document.getElementById('enhanced-modal-styles')) {
    const modalStyles = document.createElement('style');
    modalStyles.id = 'enhanced-modal-styles';
    modalStyles.textContent = `
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5000;
}

.modal-content {
    background: var(--bg-secondary);
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.modal-large {
    max-width: 1200px;
}

.modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    margin: 0;
}

.modal-body {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-primary);
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background 0.2s;
}

.close-btn:hover {
    background: var(--border-color);
}

.progress-stats {
    margin-top: 2rem;
    padding: 1rem;
    background: var(--bg-primary);
    border-radius: 8px;
}

.progress-stats h3 {
    margin-top: 0;
}

.progress-stats p {
    margin: 0.5rem 0;
}

.simple-progress-bar {
    margin-bottom: 1rem;
}

.progress-label {
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.progress-track {
    height: 20px;
    background: #e9ecef;
    border-radius: 10px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: #198754;
    transition: width 0.3s ease;
}

.concept-map-legend {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    background: var(--bg-secondary);
    padding: 1rem;
    border-radius: 8px;
    box-shadow: var(--shadow-md);
}

.concept-map-legend h4 {
    margin: 0 0 0.5rem 0;
}

.concept-map-legend div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.25rem 0;
}


`;
document.head.appendChild(modalStyles);
}

// Export for use in main application
if (typeof window !== 'undefined') {
    window.initializeEnhancedFeatures = initializeEnhancedFeatures;
    window.showProgressModal = showProgressModal;
    window.showPlaygroundModal = showPlaygroundModal;
    window.showConceptMapModal = showConceptMapModal;
}
