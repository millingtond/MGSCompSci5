document.addEventListener('DOMContentLoaded', function () {
    // Common worksheet functionalities from worksheet-common.js
    if (typeof setupReadCheckboxes === 'function') setupReadCheckboxes();
    if (typeof updateFooterYear === 'function') updateFooterYear();
    
    if (typeof setupResetAllTasks === 'function') {
        const resetButton = document.getElementById('reset-all-tasks-threats2');
        if (resetButton) {
            setupResetAllTasks(resetButton, 'threats2-worksheet-progress', [
                () => resetAllFillBlanksThreats2(),
                () => resetAllImpactTextareasThreats2(),
                () => resetAllScenarioQuizzesThreats2(),
                () => resetDragDropThreats2()
            ]);
        }
    }
    if (typeof setupPdfExport === 'function') {
        const exportButton = document.getElementById('export-pdf-button-threats2');
        if (exportButton) {
            setupPdfExport(exportButton, 'GCSE-CS-Threats-Worksheet-Part2.pdf');
        }
    }

    // --- Conditional Mark Scheme Buttons ---
    const examTextareasThreats2 = document.querySelectorAll('#exam-practice-threats2 .exam-answer-textarea');
    const minCharsForRevealThreats2 = 40; 

    examTextareasThreats2.forEach(textarea => {
        const qIdParts = textarea.id.split('-'); // e.g., exam-t2-q1
        if (qIdParts[0] === 'exam' && qIdParts.length === 3) { 
            const qNum = qIdParts[2]; // q1, q2 etc.
            const buttonId = `ms-button-t2-${qNum}`;
            const button = document.getElementById(buttonId);
            if (button) {
                textarea.addEventListener('input', function() {
                    if (this.value.trim().length >= minCharsForRevealThreats2) {
                        button.disabled = false;
                        button.title = "Show Mark Scheme";
                    } else {
                        button.disabled = true;
                        button.title = `Type at least ${minCharsForRevealThreats2} characters to enable.`;
                    }
                });
                button.disabled = true; 
                button.title = `Type at least ${minCharsForRevealThreats2} characters to enable.`;
            }
        }
    });
    
    // --- Drag and Drop for Task: Match the Attack Technique! ---
    setupDragAndDropThreats2(); // Call setup for drag and drop

}); // End DOMContentLoaded

// --- Helper function to reset all fill-in-the-blanks on this page ---
function resetAllFillBlanksThreats2() {
    ['socialeng-fill-blanks-container', 'phishing-fill-blanks-container', 'pharming-fill-blanks-container', 'dos-fill-blanks-container', 'interception-fill-blanks-container', 'sqlinjection-fill-blanks-container'].forEach(id => {
        if (typeof window.resetFillBlanks === 'function') window.resetFillBlanks(id);
    });
}

// --- Helper function to reset all impact textareas (Reveal buttons are removed) ---
function resetAllImpactTextareasThreats2() {
    const impactSections = ['socialeng', 'phishing', 'pharming', 'dos', 'interception', 'sqlinjection'];
    impactSections.forEach(type => {
        const textarea = document.getElementById(`${type}-impact-student`);
        if (textarea) textarea.value = '';
        // No need to handle revealButton or suggestedDiv as they are removed
    });
}

// --- Helper function to reset all scenario quizzes ---
function resetAllScenarioQuizzesThreats2() {
    const quizItems = document.querySelectorAll('#task-identify-threats2 .quiz-item');
    quizItems.forEach((item, index) => {
        const selectId = `threat2-q${index + 1}`;
        const feedbackId = `feedback2-q${index + 1}`;
        const selectElement = document.getElementById(selectId);
        const feedbackElement = document.getElementById(feedbackId);
        if (selectElement) selectElement.value = "";
        if (feedbackElement) {
            feedbackElement.innerHTML = "";
            feedbackElement.className = 'feedback-area-inline mt-1'; // Reset classes
        }
        if(item) item.dataset.answeredCorrectly = "false";
    });
}


// --- Task: Identify the Threat! (Scenarios) ---
window.checkThreatQuestion = function(selectId, correctAnswer, feedbackId) {
    const selectElement = document.getElementById(selectId);
    const feedbackElement = document.getElementById(feedbackId);
    const userAnswer = selectElement.value;
    const quizItem = selectElement.closest('.quiz-item');

    if (!selectElement || !feedbackElement || !quizItem) return;

    if (userAnswer === correctAnswer) {
        feedbackElement.innerHTML = '<span class="text-green-600 font-semibold"><i class="fas fa-check-circle mr-1"></i>Correct!</span> Well done.';
        feedbackElement.className = 'feedback-area-inline text-green-700 show';
        quizItem.dataset.answeredCorrectly = "true";
    } else if (userAnswer === "") {
        feedbackElement.innerHTML = '<span class="text-yellow-600 font-semibold"><i class="fas fa-exclamation-triangle mr-1"></i>Please select an answer.</span>';
        feedbackElement.className = 'feedback-area-inline text-yellow-700 show';
        quizItem.dataset.answeredCorrectly = "false";
    } else {
        feedbackElement.innerHTML = `<span class="text-red-600 font-semibold"><i class="fas fa-times-circle mr-1"></i>Incorrect.</span> The correct answer is <strong>${correctAnswer}</strong>.`;
        feedbackElement.className = 'feedback-area-inline text-red-700 show';
        quizItem.dataset.answeredCorrectly = "false";
    }
};

// --- Fill in the Blanks Functionality ---
window.checkFillBlanks = window.checkFillBlanks || function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const inputs = container.querySelectorAll('.fill-in-blank');
    const feedbackDiv = container.querySelector('.feedback-area');
    let allCorrect = true;
    let answeredCount = 0;

    inputs.forEach(input => {
        const userAnswerRaw = input.value.trim();
        const userAnswers = userAnswerRaw.toLowerCase().split(/\s*(?:,|\/|or)\s*/).map(s => s.trim()).filter(s => s.length > 0);
        const correctAnswersRaw = input.dataset.answer;
        const correctAnswersArray = correctAnswersRaw.toLowerCase().split('|').map(s => s.trim());
        
        let isThisBlankCorrect = false;
        if (userAnswerRaw !== "") {
            answeredCount++;
            isThisBlankCorrect = userAnswers.some(ua => correctAnswersArray.includes(ua));
        }

        if (userAnswerRaw === "" && input.placeholder === "Type here...") {
             input.classList.remove('correct', 'incorrect');
             allCorrect = false; 
        } else if (userAnswerRaw === "") {
            input.classList.remove('correct', 'incorrect');
            allCorrect = false;
        }
         else if (isThisBlankCorrect) {
            input.classList.remove('incorrect');
            input.classList.add('correct');
        } else {
            input.classList.remove('correct');
            input.classList.add('incorrect');
            allCorrect = false;
        }
    });

    if (feedbackDiv) {
        if (answeredCount === 0 && inputs.length > 0) {
            feedbackDiv.innerHTML = '<span class="text-yellow-600">Please attempt to fill in some blanks.</span>';
        } else if (allCorrect && answeredCount === inputs.length) {
            feedbackDiv.innerHTML = '<span class="text-green-600 font-semibold">All correct! Great job!</span>';
        } else if (!allCorrect && answeredCount === inputs.length) {
            feedbackDiv.innerHTML = '<span class="text-red-600 font-semibold">Some answers are incorrect or missing. Please review.</span>';
        } else if (inputs.length > 0) { 
             feedbackDiv.innerHTML = '<span class="text-blue-600">Keep going! Check the highlighted boxes.</span>';
        } else {
            feedbackDiv.innerHTML = ''; 
        }
        feedbackDiv.className = 'feedback-area mt-2 show';
    }
};

window.resetFillBlanks = window.resetFillBlanks || function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const inputs = container.querySelectorAll('.fill-in-blank');
    const feedbackDiv = container.querySelector('.feedback-area');

    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('correct', 'incorrect');
    });
    if (feedbackDiv) {
        feedbackDiv.innerHTML = '';
        feedbackDiv.classList.remove('show');
    }
};

// --- Drag and Drop Functionality for Task: Match the Attack Technique! ---
function setupDragAndDropThreats2() {
    const draggablesContainer = document.getElementById('draggable-threats-part2');
    if (!draggablesContainer) {
        console.warn("Draggable items container 'draggable-threats-part2' not found.");
        return;
    }
    const draggables = Array.from(draggablesContainer.querySelectorAll('.drag-item'));
    const dropZones = document.querySelectorAll('#dropzone-container-part2 .drop-zone');
    const checkButton = document.getElementById('check-drag-drop-part2');
    const feedbackP = document.getElementById('drag-drop-feedback-part2');
    
    if (!draggables.length || !dropZones.length || !checkButton || !feedbackP) {
        console.warn("Drag and drop elements for Threats Part 2 (Match the Attack) not found. Skipping setup.");
        return;
    }

    // Shuffle draggable items
    for (let i = draggables.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        draggablesContainer.appendChild(draggables[j]); // This reorders them in the DOM
    }
    // Re-fetch draggables in new order for event listeners
    const shuffledDraggables = Array.from(draggablesContainer.querySelectorAll('.drag-item'));


    let draggedItem = null;

    shuffledDraggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            draggedItem = e.target;
            setTimeout(() => e.target.classList.add('opacity-50'), 0);
            e.dataTransfer.effectAllowed = 'move';
        });
        draggable.addEventListener('dragend', (e) => {
            setTimeout(() => {
                e.target.classList.remove('opacity-50');
                if (e.dataTransfer.dropEffect === 'none' && e.target.parentElement !== draggablesContainer) {
                    draggablesContainer.appendChild(e.target); 
                }
                draggedItem = null;
            }, 0);
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('bg-blue-100', 'border-blue-400');
            e.dataTransfer.dropEffect = 'move';
        });
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('bg-blue-100', 'border-blue-400');
        });
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('bg-blue-100', 'border-blue-400');
            if (draggedItem) {
                const existingItem = zone.querySelector('.drag-item');
                if (existingItem) {
                    draggablesContainer.appendChild(existingItem); 
                }
                zone.appendChild(draggedItem);
                draggedItem.classList.remove('opacity-50');
            }
        });
    });
    
    draggablesContainer.addEventListener('dragover', (e) => { 
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });
    draggablesContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem && draggedItem.parentElement !== draggablesContainer) {
            draggablesContainer.appendChild(draggedItem);
            draggedItem.classList.remove('opacity-50');
        }
    });


    checkButton.addEventListener('click', () => {
        let correctMatches = 0;
        let totalDroppedInZones = 0;
        
        dropZones.forEach(zone => {
            const droppedItem = zone.querySelector('.drag-item');
            zone.classList.remove('border-green-500', 'border-red-500'); 
            zone.classList.add('border-gray-300'); 

            if (droppedItem) {
                totalDroppedInZones++;
                if (droppedItem.id === zone.dataset.match) {
                    correctMatches++;
                    zone.classList.remove('border-gray-300');
                    zone.classList.add('border-green-500'); 
                } else {
                    zone.classList.remove('border-gray-300');
                    zone.classList.add('border-red-500'); 
                }
            }
        });

        if (totalDroppedInZones < dropZones.length) {
             feedbackP.textContent = `Please drag all items to a description. You've matched ${totalDroppedInZones} out of ${dropZones.length}.`;
             feedbackP.className = 'text-sm mt-2 text-yellow-700 h-6';
        } else if (correctMatches === dropZones.length) {
            feedbackP.textContent = `All ${correctMatches} matches are correct! Well done!`;
            feedbackP.className = 'text-sm mt-2 text-green-700 h-6';
        } else {
            feedbackP.textContent = `You got ${correctMatches} out of ${dropZones.length} correct. (Green = correct, Red = incorrect)`;
            feedbackP.className = 'text-sm mt-2 text-red-700 h-6';
        }
    });
}
window.setupDragAndDropThreats2 = setupDragAndDropThreats2; 

function resetDragDropThreats2() {
    const draggableContainer = document.getElementById('draggable-threats-part2');
    const dropZones = document.querySelectorAll('#dropzone-container-part2 .drop-zone');
    const feedbackP = document.getElementById('drag-drop-feedback-part2');

    if (!draggableContainer || !dropZones.length || !feedbackP) return;

    // Collect all items from drop zones first
    const itemsToReturn = [];
    dropZones.forEach(zone => {
        const droppedItem = zone.querySelector('.drag-item');
        if (droppedItem) {
            itemsToReturn.push(droppedItem);
        }
        zone.classList.remove('border-green-500', 'border-red-500', 'bg-blue-100', 'border-blue-400');
        zone.classList.add('border-gray-300'); // Reset to default border
        while (zone.firstChild) { // Clear the zone
            zone.removeChild(zone.firstChild);
        }
    });
    // Then append them back to the bank
    itemsToReturn.forEach(item => draggableContainer.appendChild(item));

    // Shuffle items in the bank again for a fresh start
    const draggablesInBank = Array.from(draggableContainer.querySelectorAll('.drag-item'));
    for (let i = draggablesInBank.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        draggableContainer.appendChild(draggablesInBank[j]);
    }
    
    feedbackP.textContent = '';
    feedbackP.className = 'text-sm mt-2 h-6';
}
window.resetDragDropThreats2 = resetDragDropThreats2;


// --- Global Helper Functions (toggleReveal, toggleMarkScheme) ---
window.toggleReveal = window.toggleReveal || function(elementId, buttonElement, showText, hideText) {
    const content = document.getElementById(elementId);
    // Removed textarea check as reveal buttons are no longer tied to textarea input for impacts
    if (content && buttonElement) {
        const isCurrentlyHidden = content.classList.contains('hidden') || !content.classList.contains('show');
        if (isCurrentlyHidden) { 
            content.classList.remove('hidden'); 
            content.classList.add('show');     
            buttonElement.textContent = hideText;
        } else {
            content.classList.add('hidden');
            content.classList.remove('show');
            buttonElement.textContent = showText;
        }
    }
};

window.toggleMarkScheme = window.toggleMarkScheme || function(markSchemeId, textareaId) {
    const markScheme = document.getElementById(markSchemeId);
    const qIdParts = textareaId.split('-');
    // Adjusted buttonId to match the new exam question IDs (e.g., exam-t2-q1 -> ms-button-t2-q1)
    const buttonId = `ms-button-${qIdParts[0] === 'exam' && qIdParts.length === 3 ? qIdParts[1] + '-' + qIdParts[2] : qIdParts[1]}`; 
    const button = document.getElementById(buttonId);
    const minChars = 40; 
    const textarea = document.getElementById(textareaId);

    if (markScheme && button) {
         const isCurrentlyHidden = markScheme.classList.contains('hidden') || !markScheme.classList.contains('show');
        if (isCurrentlyHidden) {
             if (textarea && textarea.value.trim().length < minChars && button.disabled) {
                  let tempMsg = button.parentNode.querySelector('.reveal-req-msg');
                if (!tempMsg) {
                    tempMsg = document.createElement('span');
                    tempMsg.className = 'reveal-req-msg text-xs text-red-500 ml-2';
                    button.parentNode.insertBefore(tempMsg, button.nextSibling);
                }
                tempMsg.textContent = ` Please write at least ${minChars} characters first.`;
                setTimeout(() => { if(tempMsg) tempMsg.remove(); }, 3000);
                return;
             }
            markScheme.classList.remove('hidden');
            markScheme.classList.add('show');
            button.textContent = 'Hide Mark Scheme';
        } else {
            markScheme.classList.add('hidden');
            markScheme.classList.remove('show');
            button.textContent = 'Show Mark Scheme';
        }
    }
};
