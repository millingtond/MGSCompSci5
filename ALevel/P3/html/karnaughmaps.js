// K-Map Learning Tool - script.js (Definitive Stable Version)

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. STATE MANAGEMENT ---
    let currentProblem = {};
    let isSelectionMode = false;
    let selectedCells = [];
    let userLoops = [];

    // --- 2. DOM ELEMENT REFERENCES ---
    const kmapGrid = document.getElementById('kmap-grid');
    const kmapCells = document.querySelectorAll('.kmap-cell');
    const newQuestionBtn = document.getElementById('new-question-btn');
    const solveGridBtn = document.getElementById('solve-grid-btn');

        const saveProgressBtn = document.getElementById('save-progress-btn'); // New
    const loadProgressBtn = document.getElementById('load-progress-btn');
    const questionDisplay = document.getElementById('question-display');
    const feedbackText = document.getElementById('feedback-text');
    const checkKMapBtn = document.getElementById('check-kmap-btn');
    const selectModeBtn = document.getElementById('select-mode-btn');
    const createGroupBtn = document.getElementById('create-group-btn');
    const clearSelectionBtn = document.getElementById('clear-selection-btn');
    const clearAllGroupsBtn = document.getElementById('clear-all-groups-btn'); // ADD THIS LINE

    const checkLoopsBtn = document.getElementById('check-loops-btn');
    const booleanExpressionInput = document.getElementById('boolean-expression-input');
    const checkFinalAnswerBtn = document.getElementById('check-final-answer-btn');
    const loopOverlay = document.getElementById('loop-overlay');

    // --- 3. ALL FUNCTION DEFINITIONS ---

    // --- Main Controller & UI Functions ---

    const generateNewQuestion = () => {
        console.log("Generating new solvable question...");
        resetKMapGrid();
        clearAllLoops();
        clearSelection();
        provideFeedback('info', "A new question has been generated. Good luck!");
        booleanExpressionInput.value = '';
        if (isSelectionMode) {
            toggleSelectionMode();
        }

        const kmapSolution = generateSolvableKMap();
        const unsimplifiedSOP = deriveSOPFromKMap(kmapSolution);
        const optimalLoops = solveKMap(kmapSolution);

        currentProblem = {
            is4Variable: true,
            correctKMap: kmapSolution,
            unsimplifiedSOP: unsimplifiedSOP,
            optimalSolution: optimalLoops
        };

        displayQuestion();
        console.log("New question created:", currentProblem);
        console.log("Optimal solution requires:", optimalLoops.length, "loops.");
    };

    const provideFeedback = (type, message) => {
        feedbackText.textContent = message;
        switch (type) {
            case 'success':
                feedbackText.style.backgroundColor = '#d4edda';
                feedbackText.style.color = '#155724';
                break;
            case 'error':
                feedbackText.style.backgroundColor = '#f8d7da';
                feedbackText.style.color = '#721c24';
                break;
            case 'warning':
                feedbackText.style.backgroundColor = '#fff3cd';
                feedbackText.style.color = '#856404';
                break;
            default:
                feedbackText.style.backgroundColor = 'transparent';
                feedbackText.style.color = '#333';
        }
    };

    const resetKMapGrid = () => {
        kmapCells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('one', 'selected');
        });
    };

    const clearAllLoops = () => {
        loopOverlay.innerHTML = '';
        if (userLoops) {
            userLoops.forEach(loop => loop.elements = []);
        }
        userLoops = [];
    };

    const clearSelection = () => {
        selectedCells = [];
        kmapCells.forEach(cell => cell.classList.remove('selected'));
    };

    const toggleSelectionMode = () => {
        isSelectionMode = !isSelectionMode;
        clearSelection();
        if (isSelectionMode) {
            selectModeBtn.style.backgroundColor = '#28a745';
            provideFeedback('info', "Select Mode ON: Click on '1's to form a group, then click 'Create Group'.");
        } else {
            selectModeBtn.style.backgroundColor = '';
        }
    };

    const handleCellClick = (event) => {
        const cell = event.target;
        if (isSelectionMode) {
            if (!cell.classList.contains('one')) return;
            const coords = {
                r: parseInt(cell.dataset.row),
                c: parseInt(cell.dataset.col)
            };
            const existingIndex = selectedCells.findIndex(sc => sc.r === coords.r && sc.c === coords.c);
            if (existingIndex > -1) {
                selectedCells.splice(existingIndex, 1);
                cell.classList.remove('selected');
            } else {
                selectedCells.push(coords);
                cell.classList.add('selected');
            }
        } else {
            cell.classList.toggle('one');
            cell.textContent = cell.classList.contains('one') ? '1' : '';
        }
    };

    const solveGrid = () => {
        if (!currentProblem.correctKMap) {
            provideFeedback('error', "No problem generated to solve!");
            return;
        }
        resetKMapGrid();
        const solution = currentProblem.correctKMap;
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (solution[r][c] === 1) {
                    const cellElement = document.querySelector(`.kmap-cell[data-row="${r}"][data-col="${c}"]`);
                    if (cellElement) {
                        cellElement.classList.add('one');
                        cellElement.textContent = '1';
                    }
                }
            }
        }
        provideFeedback('info', 'Grid has been auto-solved for testing purposes.');
    };

    const displayQuestion = () => {
        questionDisplay.innerHTML = `Complete the K-map for the following Boolean expression: <br><strong>Z = ${currentProblem.unsimplifiedSOP}</strong>`;
    };

    // --- Problem Generation & Solver Logic ---

    const getAllOneCoordinates = (kmap) => {
        const ones = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (kmap[r][c] === 1) {
                    ones.push({ r, c });
                }
            }
        }
        return ones;
    };

    const generateSolvableKMap = () => {
        const kmap = Array(4).fill(0).map(() => Array(4).fill(0));
        const numLoops = Math.random() < 0.5 ? 2 : 3;
        const groupTemplates = {
            4: [{ h: 2, w: 2 }, { h: 1, w: 4 }, { h: 4, w: 1 }],
            2: [{ h: 1, w: 2 }, { h: 2, w: 1 }]
        };
        for (let i = 0; i < numLoops; i++) {
            const size = Math.random() < 0.7 ? 4 : 2;
            const templates = groupTemplates[size];
            const template = templates[Math.floor(Math.random() * templates.length)];
            const r = Math.floor(Math.random() * 4);
            const c = Math.floor(Math.random() * 4);
            for (let y = 0; y < template.h; y++) {
                for (let x = 0; x < template.w; x++) {
                    const curR = (r + y) % 4;
                    const curC = (c + x) % 4;
                    kmap[curR][curC] = 1;
                }
            }
        }
        if (getAllOneCoordinates(kmap).length < 3 || getAllOneCoordinates(kmap).length > 10) {
            return generateSolvableKMap();
        }
        return kmap;
    };

    const deriveSOPFromKMap = (kmap) => {
        const terms = [];
        const ab_map = ['00', '01', '11', '10'];
        const cd_map = ['00', '01', '11', '10'];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (kmap[r][c] === 1) {
                    const ab = ab_map[c];
                    const cd = cd_map[r];
                    let term = "";
                    term += (ab[0] === '0') ? "A'" : "A";
                    term += (ab[1] === '0') ? "B'" : "B";
                    term += (cd[0] === '0') ? "C'" : "C";
                    term += (cd[1] === '0') ? "D'" : "D";
                    terms.push(term);
                }
            }
        }
        return terms.join(' + ');
    };

    const getValidGroup = (r, c, h, w, kmap) => {
        const groupCells = [];
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                const curR = (r + i) % 4;
                const curC = (c + j) % 4;
                if (kmap[curR][curC] !== 1) return null;
                groupCells.push({ r: curR, c: curC });
            }
        }
        return groupCells;
    };

    const findAllPossibleGroups = (kmap) => {
        const groups = [];
        const groupSizes = [{ w: 4, h: 2 }, { w: 2, h: 4 }, { w: 4, h: 1 }, { w: 1, h: 4 }, { w: 2, h: 2 }, { w: 2, h: 1 }, { w: 1, h: 2 }];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (kmap[r][c] === 1) groups.push([{ r, c }]);
                for (const size of groupSizes) {
                    const group = getValidGroup(r, c, size.h, size.w, kmap);
                    if (group) groups.push(group);
                }
            }
        }
        return groups;
    };

    // Replace your existing solveKMap function with this corrected version

const solveKMap = (kmap) => {
    const allOnes = getAllOneCoordinates(kmap);
    if (allOnes.length === 0) return [];
    if (allOnes.length === 16) return [[...allOnes]];

    const allGroups = findAllPossibleGroups(kmap);
    const primeImplicants = allGroups.filter(g1 => !allGroups.some(g2 => g1.length < g2.length && g1.every(c1 => g2.some(c2 => c1.r === c2.r && c1.c === c2.c))));
    
    const solutionLoops = [];
    let coveredOnes = new Set();

    // Find and add essential prime implicants
    allOnes.forEach(one => {
        const coveringPIGroups = primeImplicants.filter(pi => pi.some(cell => cell.r === one.r && cell.c === one.c));
        if (coveringPIGroups.length === 1) {
            const essentialGroup = coveringPIGroups[0];
            const isAlreadyInSolution = solutionLoops.some(sl => sl.length === essentialGroup.length && sl.every(c1 => essentialGroup.some(c2 => c1.r === c2.r && c1.c === c2.c)));
            if (!isAlreadyInSolution) {
                solutionLoops.push(essentialGroup);
                essentialGroup.forEach(cell => coveredOnes.add(`${cell.r},${cell.c}`));
            }
        }
    });

    let remainingPIs = primeImplicants.filter(pi => !solutionLoops.some(sl => sl.every((cell, i) => cell.r === pi[i].r && cell.c === pi[i].c)));
    
    // Greedily cover the rest
    while (coveredOnes.size < allOnes.length) {
        if (remainingPIs.length === 0) break;
        
        // --- THIS IS THE CORRECTED SORTING LOGIC ---
        remainingPIs.sort((a, b) => {
            const uncoveredA = a.filter(c => !coveredOnes.has(`${c.r},${c.c}`)).length;
            const uncoveredB = b.filter(c => !coveredOnes.has(`${c.r},${c.c}`)).length;
            
            // Primary sort: by number of uncovered cells covered.
            if (uncoveredB !== uncoveredA) {
                return uncoveredB - uncoveredA;
            }
            
            // Tie-breaker: prefer the overall larger group.
            return b.length - a.length;
        });
        // --- END OF CORRECTION ---
        
        if (remainingPIs.length > 0 && remainingPIs[0].filter(c => !coveredOnes.has(`${c.r},${c.c}`)).length === 0) break;
        
        const bestPI = remainingPIs[0];
        solutionLoops.push(bestPI);
        bestPI.forEach(cell => coveredOnes.add(`${cell.r},${cell.c}`));
        remainingPIs = remainingPIs.filter(pi => pi !== bestPI);
    }
    return solutionLoops;
};

const saveProgress = () => {
        console.log("Saving progress...");
        if (!currentProblem.correctKMap) {
            provideFeedback('error', 'Nothing to save yet!');
            return;
        }

        // Get the current state of the 1s and 0s on the grid
        const gridState = [];
        for (let r = 0; r < 4; r++) {
            const row = [];
            for (let c = 0; c < 4; c++) {
                const cell = document.querySelector(`.kmap-cell[data-row="${r}"][data-col="${c}"]`);
                row.push(cell.classList.contains('one') ? 1 : 0);
            }
            gridState.push(row);
        }

        // Create a serializable version of the user's loops (without DOM elements)
        const serializableLoops = userLoops.map(loop => ({ cells: loop.cells }));

        const saveState = {
            problem: currentProblem,
            gridState: gridState,
            loops: serializableLoops,
            finalAnswerText: booleanExpressionInput.value,
            feedbackText: feedbackText.textContent,
            feedbackType: feedbackText.style.backgroundColor === 'rgb(212, 237, 218)' ? 'success' : 
                          feedbackText.style.backgroundColor === 'rgb(248, 215, 218)' ? 'error' : 
                          feedbackText.style.backgroundColor === 'rgb(255, 243, 205)' ? 'warning' : 'info'
        };

        // Save the state object to localStorage as a JSON string
        localStorage.setItem('kmapSaveState', JSON.stringify(saveState));
        provideFeedback('success', 'Progress saved successfully!');
    };

    const loadProgress = () => {
        console.log("Loading progress...");
        const savedJSON = localStorage.getItem('kmapSaveState');

        if (!savedJSON) {
            provideFeedback('error', 'No saved progress found.');
            return;
        }

        const savedState = JSON.parse(savedJSON);

        // Restore all state variables
        currentProblem = savedState.problem;
        booleanExpressionInput.value = savedState.finalAnswerText;
        provideFeedback(savedState.feedbackType, savedState.feedbackText);

        // Restore the K-map grid
        resetKMapGrid();
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (savedState.gridState[r][c] === 1) {
                    const cell = document.querySelector(`.kmap-cell[data-row="${r}"][data-col="${c}"]`);
                    cell.classList.add('one');
                    cell.textContent = '1';
                }
            }
        }

        // Restore the user's loops
        userLoops = savedState.loops.map(loopData => ({
            ...loopData,
            elements: [] // elements will be recreated
        }));
        loopOverlay.innerHTML = '';
        userLoops.forEach(drawVisualLoopForGroup);

        // Update the question display
        displayQuestion();
        console.log("Progress loaded.");
    };

    // --- Group Creation, Validation, and Drawing ---

    const isGroupGeometricallyValid = (cells) => {
        const n = cells.length;
        if (n === 0 || (n & (n - 1)) !== 0) return false;
        const rows = [...new Set(cells.map(c => c.r))];
        const cols = [...new Set(cells.map(c => c.c))];
        if (rows.length * cols.length !== n) return false;
        const checkContiguous = (arr, max) => {
            if (arr.length <= 1) return true;
            const sorted = arr.sort((a, b) => a - b);
            let isNormalBlock = true;
            for (let i = 0; i < sorted.length - 1; i++) {
                if (sorted[i + 1] !== sorted[i] + 1) {
                    isNormalBlock = false;
                    break;
                }
            }
            if (isNormalBlock) return true;
            if ((sorted[sorted.length - 1] + 1) % max === sorted[0]) {
                let gaps = 0;
                for (let i = 0; i < sorted.length - 1; i++) {
                    if (sorted[i + 1] !== sorted[i] + 1) {
                        gaps++;
                    }
                }
                return gaps === 1;
            }
            return false;
        };
        return checkContiguous(rows, 4) && checkContiguous(cols, 4);
    };

    // Replace the existing drawVisualLoopForGroup function with this corrected version

const drawVisualLoopForGroup = (loop) => {
    const getCellElement = (r, c) => document.querySelector(`.kmap-cell[data-row="${r}"][data-col="${c}"]`);

    const splitIntoContiguousBlocks = (indices) => {
        if (indices.length === 0) return [];
        const sorted = [...new Set(indices)].sort((a,b) => a-b);
        const blocks = [];
        let currentBlock = [sorted[0]];
        for(let i=1; i<sorted.length; i++) {
            if(sorted[i] === sorted[i-1] + 1) {
                currentBlock.push(sorted[i]);
            } else {
                blocks.push(currentBlock);
                currentBlock = [sorted[i]];
            }
        }
        blocks.push(currentBlock);
        return blocks;
    };

    const rows = loop.cells.map(c => c.r);
    const cols = loop.cells.map(c => c.c);
    
    const rowBlocks = splitIntoContiguousBlocks(rows);
    const colBlocks = splitIntoContiguousBlocks(cols);

    const hasColWrap = colBlocks.length > 1 && (cols.includes(0) && cols.includes(3));
    const hasRowWrap = rowBlocks.length > 1 && (rows.includes(0) && rows.includes(3));

    loop.elements = [];
    for (const rb of rowBlocks) {
        for (const cb of colBlocks) {
            const firstCell = getCellElement(rb[0], cb[0]);
            const lastRowCell = getCellElement(rb[rb.length-1], cb[0]);
            const lastColCell = getCellElement(rb[0], cb[cb.length-1]);
            if (!firstCell || !lastRowCell || !lastColCell) continue;

            const loopElement = document.createElement('div');
            loopElement.className = 'loop';
            
            loopElement.style.left = `${firstCell.offsetLeft - 5}px`;
            loopElement.style.top = `${firstCell.offsetTop - 5}px`;
            loopElement.style.width = `${lastColCell.offsetLeft + lastColCell.offsetWidth - firstCell.offsetLeft + 10}px`;
            loopElement.style.height = `${lastRowCell.offsetTop + lastRowCell.offsetHeight - firstCell.offsetTop + 10}px`;
            
            // --- THIS IS THE CORRECTED LOGIC ---
            if (hasColWrap) {
                // If it's the block on the far-left (col 0), open its left border.
                if (cb.includes(0)) loopElement.classList.add('open-left');
                // If it's the block on the far-right (col 3), open its right border.
                if (cb.includes(3)) loopElement.classList.add('open-right');
            }
             if (hasRowWrap) {
                // If it's the block on the top (row 0), open its top border.
                if (rb.includes(0)) loopElement.classList.add('open-top');
                // If it's the block on the bottom (row 3), open its bottom border.
                if (rb.includes(3)) loopElement.classList.add('open-bottom');
            }
            // --- END OF CORRECTION ---

            loopOverlay.appendChild(loopElement);
            loop.elements.push(loopElement);
        }
    }
};
    
    const createGroupFromSelection = () => {
        if (selectedCells.length === 0) {
            provideFeedback('error', 'No cells selected.');
            return;
        }
        if (!isGroupGeometricallyValid(selectedCells)) {
            provideFeedback('error', 'Invalid group shape. A group must form a valid rectangle (including wrap-around) with a size that is a power of two.');
            clearSelection();
            return;
        }
        const newLoop = { cells: [...selectedCells], elements: [] };
        userLoops.push(newLoop);
        loopOverlay.innerHTML = '';
        userLoops.forEach(drawVisualLoopForGroup);
        clearSelection();
    };

    // --- Answer Checking Functions ---
    
    const checkKMapFill = () => { 
        if (!currentProblem.correctKMap) { provideFeedback('error', "Please generate a question first!"); return; } 
        let errors = 0; 
        const solution = currentProblem.correctKMap; 
        kmapCells.forEach(cell => { const row = parseInt(cell.dataset.row); const col = parseInt(cell.dataset.col); const userValue = cell.classList.contains('one') ? 1 : 0; if (userValue !== solution[row][col]) { errors++; } }); 
        if (errors === 0) { provideFeedback('success', "Excellent! The K-map is filled correctly. You can now select cells for grouping."); } 
        else { const s = errors > 1 ? 's' : ''; provideFeedback('error', `Not quite. You have ${errors} error${s} in your K-map.`); } 
    };

    const checkLoops = () => {
        const allOnes = getAllOneCoordinates(currentProblem.correctKMap);
        if (allOnes.length > 0 && userLoops.length === 0) {
            provideFeedback('error', 'You need to create groups to cover all the 1s.');
            return;
        }
        const allCoveredOnes = new Set();
        userLoops.forEach(loop => { loop.cells.forEach(cell => allCoveredOnes.add(`${cell.r},${cell.c}`)); });
        if (allCoveredOnes.size < allOnes.length) {
            provideFeedback('error', `Not quite. You've missed some 1s.`);
            return;
        }
        if (userLoops.length > currentProblem.optimalSolution.length) {
            provideFeedback('warning', `Your loops cover all the 1s, but your solution is not optimal. You have used ${userLoops.length} loops, but it can be solved with ${currentProblem.optimalSolution.length}.`);
            return;
        }
        if (userLoops.length < currentProblem.optimalSolution.length) {
             provideFeedback('error', `Your solution requires more loops. The optimal solution requires ${currentProblem.optimalSolution.length}.`);
             return;
        }
        provideFeedback('success', `Excellent! You have found the optimal solution with ${currentProblem.optimalSolution.length} loops.`);
    };
    
    const checkFinalAnswer = () => {
        if(userLoops.length === 0) { provideFeedback('error', 'Please create groups first.'); return; }
        const correctTerms = userLoops.map(loop => getTermFromGroup(loop.cells));
        const correctExpression = normalizeExpression(correctTerms.join('+'));
        const userInput = booleanExpressionInput.value;
        if (!userInput) { provideFeedback('error', 'Please type your simplified expression into the box.'); return; }
        const userExpression = normalizeExpression(userInput);
        if (userExpression === correctExpression) {
            provideFeedback('success', `Perfect! The expression Z = ${correctExpression} is correct!`);
        } else {
            provideFeedback('error', `Not quite. The correct expression from your loops is Z = ${correctExpression}.`);
        }
    };
    
    const getTermFromGroup = (groupOfCells) => { 
        const ab_map = ['00', '01', '11', '10']; 
        const cd_map = ['00', '01', '11', '10']; 
        let term = ''; 
        if (groupOfCells.length === 0) return ''; 
        if (groupOfCells.length === 16) return '1'; 
        const ab_values = new Set(groupOfCells.map(cell => ab_map[cell.c])); 
        const cd_values = new Set(groupOfCells.map(cell => cd_map[cell.r])); 
        const a_values = new Set(Array.from(ab_values).map(v => v[0])); 
        if (a_values.size === 1) term += (a_values.values().next().value === '0') ? "A'" : "A"; 
        const b_values = new Set(Array.from(ab_values).map(v => v[1])); 
        if (b_values.size === 1) term += (b_values.values().next().value === '0') ? "B'" : "B"; 
        const c_values = new Set(Array.from(cd_values).map(v => v[0])); 
        if (c_values.size === 1) term += (c_values.values().next().value === '0') ? "C'" : "C"; 
        const d_values = new Set(Array.from(cd_values).map(v => v[1])); 
        if (d_values.size === 1) term += (d_values.values().next().value === '0') ? "D'" : "D"; 
        return term; 
    };

    const normalizeExpression = (expr) => { 
        let cleanExpr = expr.replace(/\s+/g, '').toUpperCase().replace(/!/g, "'"); 
        const terms = cleanExpr.split('+'); 
        const normalizedTerms = terms.map(term => { 
            const parts = term.match(/[A-D]'?/g) || []; 
            return parts.sort().join(''); 
        }); 
        return normalizedTerms.sort().join(' + '); 
    };
    
    // --- 4. EVENT LISTENER ATTACHMENTS ---
    
    kmapCells.forEach(cell => cell.addEventListener('click', handleCellClick));
    newQuestionBtn.addEventListener('click', generateNewQuestion);
    solveGridBtn.addEventListener('click', solveGrid);
    checkKMapBtn.addEventListener('click', checkKMapFill);
    selectModeBtn.addEventListener('click', toggleSelectionMode);
    createGroupBtn.addEventListener('click', createGroupFromSelection);
    clearSelectionBtn.addEventListener('click', clearSelection);
    clearAllGroupsBtn.addEventListener('click', clearAllLoops); // ADD THIS LINE

        saveProgressBtn.addEventListener('click', saveProgress); // New
    loadProgressBtn.addEventListener('click', loadProgress); // New

    checkLoopsBtn.addEventListener('click', checkLoops);
    checkFinalAnswerBtn.addEventListener('click', checkFinalAnswer);

        if (localStorage.getItem('kmapSaveState')) {
        if (confirm("Saved progress found. Would you like to load it?")) {
            loadProgress();
        } else {
            localStorage.removeItem('kmapSaveState');
            generateNewQuestion();
        }
    } else {
        generateNewQuestion();
    }

    // --- 5. INITIALISATION ---
    generateNewQuestion();
});