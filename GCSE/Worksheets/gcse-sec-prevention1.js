document.addEventListener('DOMContentLoaded', function () {
    // Common worksheet functionalities
    if (typeof setupReadCheckboxes === 'function') setupReadCheckboxes();
    if (typeof updateFooterYear === 'function') updateFooterYear();
    
    if (typeof setupResetAllTasks === 'function') {
        const resetButton = document.getElementById('reset-all-tasks-prevention1');
        if (resetButton) {
            setupResetAllTasks(resetButton, 'prevention1-worksheet-progress', [
                () => resetAllFillBlanksPrevention1(),
                () => resetAntivirusAlerts(),
                () => resetFirewallRuleLogic(),
                () => resetPenTestPhaseOrder(),
                () => resetPenTestTypeScenarios(),
                () => { // Reset for other textareas
                    document.getElementById('starter-q1-prevention1').value = '';
                    document.getElementById('antimalware-importance-student').value = '';
                    document.getElementById('firewall-reflection-student').value = '';
                    document.getElementById('pentest-reflection-student').value = '';
                    document.getElementById('bakery-antimalware').value = '';
                    document.getElementById('bakery-firewall').value = '';
                    document.getElementById('bakery-pentest').value = '';
                    // // const ruleInputs = ['firewall-rule-action', 'firewall-rule-protocol', 'firewall-rule-source', 'firewall-rule-destination'];
                    // // ruleInputs.forEach(id => {
                    // //     const el = document.getElementById(id);
                    // //     if (el) el.value = (el.tagName === 'SELECT' ? '' : '');
                    // // });
                    // // const fdFeedback = document.getElementById('firewall-design-feedback');
                    // // if(fdFeedback) {
                    // //     fdFeedback.innerHTML = '';
                    // //     fdFeedback.classList.remove('show');
                    // // }
                }
            ]);
        }
    }
    if (typeof setupPdfExport === 'function') {
        const exportButton = document.getElementById('export-pdf-button-prevention1');
        if (exportButton) {
            setupPdfExport(exportButton, 'GCSE-CS-Prevention-Worksheet-Part1-Interactive.pdf');
        }
    }

    const examTextareasPrevention1 = document.querySelectorAll('#exam-practice-prevention1 .exam-answer-textarea');
    const minCharsForMarkSchemeReveal = 40; 
    examTextareasPrevention1.forEach(textarea => {
        const qIdParts = textarea.id.split('-'); 
        if (qIdParts[0] === 'exam' && qIdParts.length === 3) { 
            const qNum = qIdParts[2]; 
            const buttonId = `ms-button-p1-${qNum}`; 
            const button = document.getElementById(buttonId);
            if (button) {
                textarea.addEventListener('input', function() {
                    button.disabled = this.value.trim().length < minCharsForMarkSchemeReveal;
                    button.title = button.disabled ? `Type at least ${minCharsForMarkSchemeReveal} characters to enable.` : "Show Mark Scheme";
                });
                button.disabled = true; 
                button.title = `Type at least ${minCharsForMarkSchemeReveal} characters to enable.`;
            }
        }
    });
    
    setupAntivirusAlerts();
    setupFirewallRuleLogic();
    setupPenTestPhaseOrder();
    setupPenTestTypeScenarios();
});

function resetAllFillBlanksPrevention1() {
    ['antimalware-fill-blanks-container', 'firewall-fill-blanks-container', 'pentest-fill-blanks-container'].forEach(id => {
        if (typeof window.resetFillBlanks === 'function') window.resetFillBlanks(id);
    });
}

// --- Antivirus Alert - What's Your Action? ---
const antivirusAlertsData = [
    { id: 'alert1', message: "Threat Detected: 'Generic.Trojan' in Downloads/FreeGameInstaller.exe", options: ["Ignore", "Quarantine", "Allow", "Delete Immediately"], correctAnswer: "Quarantine", explanation: "Quarantining isolates the threat without deleting potentially important system files if it's a false positive. Deleting immediately can be risky. Allowing or ignoring is unsafe." },
    { id: 'alert2', message: "Suspicious File Behaviour: 'UnknownApp.exe' is trying to access webcam.", options: ["Block Access", "Allow Access Once", "Always Allow Access", "Uninstall UnknownApp.exe"], correctAnswer: "Block Access", explanation: "Unless you explicitly know and trust this app, block access. Allowing unknown apps to access hardware like webcams is a major privacy risk. Uninstalling might be a next step after investigation." },
    { id: 'alert3', message: "Virus Definitions Outdated. Last update: 30 days ago.", options: ["Ignore", "Update Now", "Disable Antivirus", "Scan Anyway"], correctAnswer: "Update Now", explanation: "Outdated definitions mean your antivirus can't detect the latest threats. Updating immediately is crucial." }
];

window.setupAntivirusAlerts = function() {
    const container = document.getElementById('antivirus-alerts-container');
    if (!container) return;
    container.innerHTML = ''; 

    antivirusAlertsData.forEach((alertItem, index) => {
        const div = document.createElement('div');
        div.className = 'p-3 bg-white border border-gray-200 rounded-md shadow-sm';
        div.dataset.alertId = alertItem.id;
        div.dataset.correctAction = alertItem.correctAction;

        let optionsHtml = '';
        alertItem.options.forEach(opt => {
            optionsHtml += `<label class="alert-action-option text-sm"><input type="radio" name="alert-action-${alertItem.id}" value="${opt}" class="form-radio text-green-500 mr-2"> ${opt}</label>`;
        });

        div.innerHTML = `
            <p class="font-medium text-gray-800">${index + 1}. ${alertItem.message}</p>
            <div class="mt-2 space-y-1">${optionsHtml}</div>
            <div id="alert-feedback-${alertItem.id}" class="feedback-area-inline mt-1"></div>
            <div id="alert-explanation-${alertItem.id}" class="text-xs text-gray-600 mt-1 hidden"><strong>Explanation:</strong> ${alertItem.explanation}</div>
        `;
        container.appendChild(div);
    });
};

window.checkAntivirusAlerts = function() {
    const alertContainers = document.querySelectorAll('#antivirus-alerts-container > div');
    alertContainers.forEach(container => {
        const alertId = container.dataset.alertId;
        const correctAnswer = container.dataset.correctAction;
        const feedbackEl = document.getElementById(`alert-feedback-${alertId}`);
        const explanationEl = document.getElementById(`alert-explanation-${alertId}`);
        const selectedRadio = container.querySelector(`input[name="alert-action-${alertId}"]:checked`);
        
        container.querySelectorAll('.alert-action-option').forEach(optLabel => {
            optLabel.classList.remove('correct', 'incorrect');
        });

        if (selectedRadio) {
            const userAnswer = selectedRadio.value;
            const selectedLabel = selectedRadio.parentElement;
            if (userAnswer === correctAnswer) {
                if(selectedLabel) selectedLabel.classList.add('correct');
                if(feedbackEl) feedbackEl.innerHTML = `<span class="text-green-600 font-semibold"><i class="fas fa-check-circle mr-1"></i>Correct!</span>`;
            } else {
                if(selectedLabel) selectedLabel.classList.add('incorrect');
                if(feedbackEl) feedbackEl.innerHTML = `<span class="text-red-600 font-semibold"><i class="fas fa-times-circle mr-1"></i>Not quite.</span> The best action is '${correctAnswer}'.`;
            }
            if (explanationEl) explanationEl.classList.remove('hidden');
        } else if(feedbackEl) {
            feedbackEl.innerHTML = `<span class="text-yellow-600 font-semibold"><i class="fas fa-exclamation-triangle mr-1"></i>Please select an action.</span>`;
            if (explanationEl) explanationEl.classList.add('hidden');
        }
        if(feedbackEl) feedbackEl.className = 'feedback-area-inline mt-1 show';
    });
};
window.resetAntivirusAlerts = setupAntivirusAlerts;


// --- Firewall Rule Logic Challenge ---
const firewallRuleComponents = [
    { id: "fwc1", text: "Action: ALLOW", type: "action" },
    { id: "fwc2", text: "Action: BLOCK", type: "action" },
    { id: "fwc3", text: "Source IP: ANY", type: "source" },
    { id: "fwc4", text: "Dest Port: 80 (HTTP)", type: "port" },
    { id: "fwc5", text: "Protocol: TCP", type: "protocol" },
    { id: "fwc6", text: "Direction: INCOMING", type: "direction" }
];
const firewallRuleDescriptions = [
    { id: "fwd1", text: "Permits any computer to access web pages on your server.", correctComponents: ["fwc1", "fwc3", "fwc4", "fwc5", "fwc6"] }, // Simplified, assumes server is destination
    { id: "fwd2", text: "Blocks all incoming TCP connections to your computer's web server port.", correctComponents: ["fwc2", "fwc4", "fwc5", "fwc6"] },
    { id: "fwd3", text: "A general rule to allow your computer to browse websites.", correctComponents: ["fwc1", "fwc3", "fwc4", "fwc5"] } // Assumes outgoing is implied or default allow
];
let draggedFirewallRuleItem = null;

window.setupFirewallRuleLogic = function() {
    const bankContainer = document.getElementById('firewall-rule-bank');
    const dropzonesContainer = document.getElementById('firewall-rule-dropzones');
    const feedbackEl = document.getElementById('firewall-rule-logic-feedback');

    if (!bankContainer || !dropzonesContainer || !feedbackEl) return;

    bankContainer.innerHTML = ''; 
    dropzonesContainer.innerHTML = ''; 
    feedbackEl.innerHTML = '';
    feedbackEl.classList.remove('show');

    const shuffledComponents = [...firewallRuleComponents].sort(() => Math.random() - 0.5);
    shuffledComponents.forEach(item => {
        const div = document.createElement('div');
        div.id = `drag-rule-${item.id}`;
        div.className = 'drag-item-rule';
        div.textContent = item.text;
        div.draggable = true;
        div.dataset.componentId = item.id;
        div.addEventListener('dragstart', e => { draggedFirewallRuleItem = e.target; setTimeout(() => e.target.classList.add('dragging'), 0); });
        div.addEventListener('dragend', e => { setTimeout(() => e.target.classList.remove('dragging'), 0); });
        bankContainer.appendChild(div);
    });

    firewallRuleDescriptions.forEach(desc => {
        const dzDiv = document.createElement('div');
        dzDiv.className = 'drop-zone-rule-desc p-3 bg-white border-2 border-dashed border-gray-300 rounded min-h-[60px]';
        dzDiv.dataset.descId = desc.id;
        dzDiv.innerHTML = `<p class="rule-description-text">${desc.text}</p><div class="dropped-items-area flex flex-wrap gap-1 min-h-[30px]"></div>`;
        
        const dropTargetArea = dzDiv; 
        dropTargetArea.addEventListener('dragover', e => { e.preventDefault(); dropTargetArea.classList.add('dragover'); });
        dropTargetArea.addEventListener('dragleave', () => dropTargetArea.classList.remove('dragover'));
        dropTargetArea.addEventListener('drop', e => {
            e.preventDefault();
            dropTargetArea.classList.remove('dragover');
            if (draggedFirewallRuleItem) {
                const droppedItemsArea = dropTargetArea.querySelector('.dropped-items-area');
                if(droppedItemsArea) droppedItemsArea.appendChild(draggedFirewallRuleItem);
                draggedFirewallRuleItem.classList.remove('dragging'); 
            }
        });
        dropzonesContainer.appendChild(dzDiv);
    });
     bankContainer.addEventListener('dragover', e => { e.preventDefault(); });
    bankContainer.addEventListener('drop', e => { 
        e.preventDefault();
        if (draggedFirewallRuleItem && draggedFirewallRuleItem.parentElement.classList.contains('dropped-items-area')) {
            bankContainer.appendChild(draggedFirewallRuleItem);
        }
    });
};

window.checkFirewallRuleLogic = function() {
    const dropzones = document.querySelectorAll('#firewall-rule-dropzones .drop-zone-rule-desc');
    const feedbackEl = document.getElementById('firewall-rule-logic-feedback');
    if (!dropzones.length || !feedbackEl) return;

    let totalCorrectDropzones = 0;
    dropzones.forEach(zone => {
        const descId = zone.dataset.descId;
        const descriptionData = firewallRuleDescriptions.find(d => d.id === descId);
        const droppedItems = zone.querySelectorAll('.dropped-items-area .drag-item-rule');
        
        zone.classList.remove('border-green-500', 'border-red-500');
        zone.classList.add('border-gray-300'); 

        if (descriptionData && droppedItems.length === descriptionData.correctComponents.length) {
            let allComponentsMatch = true;
            const droppedComponentIds = Array.from(droppedItems).map(item => item.dataset.componentId);
            for (const correctCompId of descriptionData.correctComponents) {
                if (!droppedComponentIds.includes(correctCompId)) {
                    allComponentsMatch = false;
                    break;
                }
            }
            if (allComponentsMatch) {
                totalCorrectDropzones++;
                zone.classList.remove('border-gray-300');
                zone.classList.add('border-green-500');
            } else {
                zone.classList.remove('border-gray-300');
                zone.classList.add('border-red-500');
            }
        } else if (droppedItems.length > 0) { 
            zone.classList.remove('border-gray-300');
            zone.classList.add('border-red-500');
        }
    });

    if (totalCorrectDropzones === firewallRuleDescriptions.length) {
        feedbackEl.innerHTML = `<span class="text-green-600 font-semibold"><i class="fas fa-check-circle mr-1"></i>All rule descriptions correctly matched!</span>`;
    } else {
        feedbackEl.innerHTML = `<span class="text-red-600 font-semibold"><i class="fas fa-times-circle mr-1"></i>Some rule descriptions are incorrect.</span> You correctly matched ${totalCorrectDropzones}/${firewallRuleDescriptions.length}.`;
    }
    feedbackEl.className = 'feedback-area mt-2 show';
};
window.resetFirewallRuleLogic = setupFirewallRuleLogic;

window.checkDesignedFirewallRule = function() { 
    const feedbackDiv = document.getElementById('firewall-design-feedback');
    if (feedbackDiv) {
        const actionEl = document.getElementById('firewall-rule-action');
        const protocolPortEl = document.getElementById('firewall-rule-protocol');
        if(actionEl && protocolPortEl && actionEl.value && protocolPortEl.value) {
            feedbackDiv.innerHTML = '<span class="text-blue-600">Firewall rule components noted. Good job attempting to design a rule! Discuss with your teacher if this configuration would achieve the desired outcome and how it could be refined.</span>';
        } else {
            feedbackDiv.innerHTML = '<span class="text-yellow-600">Please select an action and specify protocol/port for your rule (if applicable).</span>';
        }
        feedbackDiv.className = 'feedback-area mt-2 show';
    }
};

// --- Penetration Testing Phases Order & Describe ---
const penTestPhasesData = [
    { id: "plan", name: "Planning & Reconnaissance", descriptionPlaceholder: "Define scope, objectives, gather public info..." },
    { id: "scan", name: "Scanning", descriptionPlaceholder: "Identify open ports, services, vulnerabilities..." },
    { id: "exploit", name: "Gaining Access (Exploitation)", descriptionPlaceholder: "Attempt to exploit vulnerabilities..." },
    { id: "maintain", name: "Maintaining Access & Post-Exploitation", descriptionPlaceholder: "Escalate privileges, explore further..." },
    { id: "report", name: "Analysis & Reporting", descriptionPlaceholder: "Document findings, recommend fixes..." }
];
let draggedPenTestPhase = null;

window.setupPenTestPhaseOrder = function() {
    const bankContainer = document.getElementById('pentest-phase-bank');
    const dropzonesContainer = document.getElementById('pentest-phase-dropzones-ordered');
    const feedbackEl = document.getElementById('pentest-phase-feedback');

    if (!bankContainer || !dropzonesContainer || !feedbackEl) return;

    bankContainer.innerHTML = '<h4 class="font-semibold text-blue-800 mb-2 text-center">Phases (Drag these)</h4>';
    dropzonesContainer.innerHTML = '<h4 class="font-semibold text-blue-800 mb-2 text-center">Correct Order (Drop & Describe)</h4>';
    feedbackEl.innerHTML = '';
    feedbackEl.classList.remove('show');

    const shuffledPhases = [...penTestPhasesData].sort(() => Math.random() - 0.5);
    shuffledPhases.forEach(phase => {
        const div = document.createElement('div');
        div.id = `drag-phase-${phase.id}`;
        div.className = 'drag-item-phase';
        div.textContent = phase.name;
        div.draggable = true;
        div.dataset.phaseId = phase.id;
        div.addEventListener('dragstart', e => { draggedPenTestPhase = e.target; setTimeout(() => e.target.classList.add('dragging'), 0); });
        div.addEventListener('dragend', e => { setTimeout(() => e.target.classList.remove('dragging'), 0); });
        bankContainer.appendChild(div);
    });

    for (let i = 0; i < penTestPhasesData.length; i++) {
        const phaseData = penTestPhasesData[i]; 
        const dzDiv = document.createElement('div');
        dzDiv.className = 'drop-zone-phase';
        dzDiv.dataset.orderIndex = i; 
        dzDiv.innerHTML = `<span class="text-xs text-gray-500 mb-1">Phase ${i + 1}:</span>
                           <div class="drop-target-area min-h-[40px] w-full bg-gray-100 rounded flex items-center justify-center p-1 mb-1 border border-dashed border-gray-400">Drop here</div>
                           <textarea class="exam-answer-textarea mt-1 text-black" rows="1" placeholder="${phaseData.descriptionPlaceholder}"></textarea>`;
        
        const dropTargetArea = dzDiv.querySelector('.drop-target-area');
        dropTargetArea.addEventListener('dragover', e => { e.preventDefault(); dropTargetArea.classList.add('bg-blue-100'); });
        dropTargetArea.addEventListener('dragleave', () => dropTargetArea.classList.remove('bg-blue-100'));
        dropTargetArea.addEventListener('drop', e => {
            e.preventDefault();
            dropTargetArea.classList.remove('bg-blue-100');
            if (draggedPenTestPhase) {
                const existingPhaseInDropzone = dropTargetArea.querySelector('.drag-item-phase');
                if (existingPhaseInDropzone && bankContainer.contains(draggedPenTestPhase)) { 
                     bankContainer.appendChild(existingPhaseInDropzone);
                } else if (existingPhaseInDropzone && draggedPenTestPhase.parentElement.classList.contains('drop-target-area') && draggedPenTestPhase.parentElement !== dropTargetArea) {
                    draggedPenTestPhase.parentElement.appendChild(existingPhaseInDropzone);
                }
                dropTargetArea.innerHTML = ''; 
                dropTargetArea.appendChild(draggedPenTestPhase);
                draggedPenTestPhase.classList.remove('dragging');
            }
        });
        dropzonesContainer.appendChild(dzDiv);
    }
     bankContainer.addEventListener('dragover', e => { e.preventDefault(); });
    bankContainer.addEventListener('drop', e => { 
        e.preventDefault();
        if (draggedPenTestPhase && draggedPenTestPhase.parentElement.classList.contains('drop-target-area')) {
             draggedPenTestPhase.parentElement.innerHTML = 'Drop here'; 
            bankContainer.appendChild(draggedPenTestPhase);
        }
    });
};

window.checkPenTestPhaseOrder = function() {
    const dropzones = document.querySelectorAll('#pentest-phase-dropzones-ordered .drop-zone-phase');
    const feedbackEl = document.getElementById('pentest-phase-feedback');
    if (!dropzones.length || !feedbackEl) return;

    let correctOrderCount = 0;
    let allPhasesPlaced = true;
    let allDescriptionsFilled = true;

    dropzones.forEach((zone, index) => {
        const droppedItem = zone.querySelector('.drag-item-phase');
        const dropTargetArea = zone.querySelector('.drop-target-area');
        const descriptionTextarea = zone.querySelector('textarea');
        
        if(dropTargetArea) dropTargetArea.classList.remove('border-green-500', 'border-red-500'); 
        if(dropTargetArea) dropTargetArea.style.borderColor = ''; 
        if(dropTargetArea) dropTargetArea.classList.add('border-gray-400');

        if (droppedItem) {
            if (droppedItem.dataset.phaseId === penTestPhasesData[index].id) {
                correctOrderCount++;
                if(dropTargetArea) {
                    dropTargetArea.classList.remove('border-gray-400', 'border-red-500');
                    dropTargetArea.classList.add('border-green-500'); 
                }
            } else {
                if(dropTargetArea) {
                    dropTargetArea.classList.remove('border-gray-400', 'border-green-500');
                    dropTargetArea.classList.add('border-red-500');
                }
            }
        } else {
            allPhasesPlaced = false;
        }
        if (descriptionTextarea && descriptionTextarea.value.trim() === '') {
            allDescriptionsFilled = false;
        }
    });

    if (!allPhasesPlaced) {
        feedbackEl.innerHTML = '<span class="text-yellow-600 font-semibold"><i class="fas fa-exclamation-triangle mr-1"></i>Please place all phases in order.</span>';
    } else if (correctOrderCount === penTestPhasesData.length) {
        if (!allDescriptionsFilled) {
            feedbackEl.innerHTML = '<span class="text-blue-600 font-semibold"><i class="fas fa-info-circle mr-1"></i>Phases are in the correct order! Now, please describe each phase.</span>';
        } else {
            feedbackEl.innerHTML = '<span class="text-green-600 font-semibold"><i class="fas fa-check-circle mr-1"></i>Phases are in the correct order and descriptions provided!</span> Well done.';
        }
    } else {
        feedbackEl.innerHTML = `<span class="text-red-600 font-semibold"><i class="fas fa-times-circle mr-1"></i>Order is incorrect.</span> You have ${correctOrderCount}/${penTestPhasesData.length} phases in the right place.`;
    }
    feedbackEl.className = 'feedback-area mt-2 show';
};
window.resetPenTestPhaseOrder = setupPenTestPhaseOrder;


// --- Pen Test Type Choices ---
const penTestTypeScenariosData = [
    { id: 'ptype1', scenario: "A startup is about to launch its first e-commerce website and wants an attacker's perspective on how secure it is from external threats, without giving away any internal system details.", correctAnswer: "Black Box", explanation: "Black Box testing simulates an external attacker with no prior knowledge of the system, which is ideal for understanding external vulnerabilities." },
    { id: 'ptype2', scenario: "A large bank wants to perform a thorough security audit of its internal network and applications. They are willing to provide the testing team with full network diagrams, source code, and admin credentials.", correctAnswer: "White Box", explanation: "White Box testing involves having full knowledge of the system, allowing for a very deep and comprehensive security audit, suitable for internal reviews." },
    { id: 'ptype3', scenario: "A company wants to test the security of a specific API that will be used by third-party developers. They will provide API documentation but not the full source code of the backend systems.", correctAnswer: "Grey Box", explanation: "Grey Box testing involves partial knowledge, like API documentation, which is suitable for testing specific interfaces without full internal access." }
];

window.setupPenTestTypeScenarios = function() {
    const container = document.getElementById('pentest-type-scenarios-container');
    if (!container) return;
    container.innerHTML = '';
    penTestTypeScenariosData.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'p-3 bg-white border border-gray-200 rounded-md shadow-sm';
        div.innerHTML = `
            <p class="font-medium text-gray-800">${item.scenario}</p>
            <div class="mt-2 space-x-2">
                <button class="activity-option text-sm !py-1 !px-3" onclick="selectPenTestTypeOption(this, 'Black Box', ${index})">Black Box</button>
                <button class="activity-option text-sm !py-1 !px-3" onclick="selectPenTestTypeOption(this, 'White Box', ${index})">White Box</button>
                <button class="activity-option text-sm !py-1 !px-3" onclick="selectPenTestTypeOption(this, 'Grey Box', ${index})">Grey Box</button>
            </div>
            <textarea id="pentest-type-reason-${index}" class="exam-answer-textarea mt-2 text-black" rows="1" placeholder="Briefly explain why..."></textarea>
            <div id="pentest-type-feedback-${index}" class="feedback-area-inline mt-1"></div>
        `;
        container.appendChild(div);
    });
};

window.selectPenTestTypeOption = function(buttonEl, selectedType, index) {
    const itemContainer = buttonEl.closest('.p-3');
    if (!itemContainer) return;
    itemContainer.querySelectorAll('.activity-option').forEach(btn => btn.classList.remove('selected', 'correct', 'incorrect'));
    buttonEl.classList.add('selected');
    itemContainer.dataset.selectedType = selectedType;
    const feedbackEl = document.getElementById(`pentest-type-feedback-${index}`);
    if (feedbackEl) {
        feedbackEl.innerHTML = '';
        feedbackEl.classList.remove('show');
    }
};

window.checkPenTestTypeChoices = function() {
     penTestTypeScenariosData.forEach((item, index) => {
        const itemContainer = document.querySelector(`#pentest-type-scenarios-container > div:nth-child(${index + 1})`);
        if (!itemContainer) return;

        const feedbackEl = document.getElementById(`pentest-type-feedback-${index}`);
        const selectedButton = itemContainer.querySelector('.activity-option.selected');
        const userAnswer = itemContainer.dataset.selectedType;

        if (selectedButton && userAnswer) {
            selectedButton.classList.remove('correct', 'incorrect');
            if (userAnswer === item.correctAnswer) {
                selectedButton.classList.add('correct');
                if (feedbackEl) feedbackEl.innerHTML = `<span class="text-green-600 font-semibold"><i class="fas fa-check-circle mr-1"></i>Correct!</span> ${item.explanation}`;
            } else {
                selectedButton.classList.add('incorrect');
                if (feedbackEl) feedbackEl.innerHTML = `<span class="text-red-600 font-semibold"><i class="fas fa-times-circle mr-1"></i>Not quite.</span> The best choice is ${item.correctAnswer}. ${item.explanation}`;
            }
        } else if(feedbackEl) {
            feedbackEl.innerHTML = `<span class="text-yellow-600 font-semibold"><i class="fas fa-exclamation-triangle mr-1"></i>Please select a test type.</span>`;
        }
        if(feedbackEl) feedbackEl.className = 'feedback-area-inline mt-1 show';
    });
};
window.resetPenTestTypeScenarios = setupPenTestTypeScenarios;


// --- Global Helper Functions (toggleMarkScheme) ---
if (typeof window.toggleMarkScheme !== 'function') {
    window.toggleMarkScheme = function(markSchemeId, textareaId) {
        const markScheme = document.getElementById(markSchemeId);
        const qIdParts = textareaId.split('-');
        let buttonIdSuffix = '';
        if (qIdParts[0] === 'exam' && qIdParts.length >= 3) { 
            buttonIdSuffix = qIdParts[1] + '-' + qIdParts[2];
        } else if (qIdParts.length >= 2) {
            buttonIdSuffix = qIdParts[1];
        } else {
            console.error('Could not determine button ID from textareaId:', textareaId);
            return;
        }
        const buttonId = `ms-button-${buttonIdSuffix}`;
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
                    setTimeout(() => { if(tempMsg && tempMsg.parentNode) tempMsg.remove(); }, 3000);
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
}

// Ensure FillBlanks functions are globally available if not in worksheet-common.js
if (typeof window.checkFillBlanks !== 'function') {
    window.checkFillBlanks = function(containerId) { 
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID '${containerId}' not found for checkFillBlanks.`);
            return;
        }
        const blanks = container.querySelectorAll('.fill-in-blank');
        const feedbackElId = containerId + '-feedback'; 
        const feedbackEl = document.getElementById(feedbackElId);
        let allCorrect = true;
        let anyAttempted = false;

        blanks.forEach(blank => {
            const userAnswer = blank.value.trim().toLowerCase();
            const correctAnswerString = blank.dataset.answer || "";
            // The data-answer should already be simplified to a single answer by the Python script
            const correctAnswer = correctAnswerString.toLowerCase().trim();
            
            blank.classList.remove('correct', 'incorrect');

            if (userAnswer !== "") {
                anyAttempted = true;
                if (userAnswer === correctAnswer) {
                    blank.classList.add('correct');
                } else {
                    blank.classList.add('incorrect');
                    allCorrect = false;
                }
            } else {
                allCorrect = false; 
            }
        });

        if (feedbackEl) {
            if (!anyAttempted && blanks.length > 0) { // Only show "please attempt" if there are blanks to fill
                feedbackEl.innerHTML = `<span class="text-yellow-600 font-semibold"><i class="fas fa-exclamation-triangle mr-1"></i>Please attempt to fill in the blanks.</span>`;
            } else if (allCorrect && blanks.length > 0) {
                feedbackEl.innerHTML = `<span class="text-green-600 font-semibold"><i class="fas fa-check-circle mr-1"></i>All correct! Well done.</span>`;
            } else if (!allCorrect && anyAttempted) {
                feedbackEl.innerHTML = `<span class="text-red-600 font-semibold"><i class="fas fa-times-circle mr-1"></i>Some answers are incorrect or missing. Please review.</span>`;
            } else { // No blanks or no attempts on existing blanks
                 feedbackEl.innerHTML = ''; // Clear feedback if no blanks or no attempt on existing ones
                 feedbackEl.classList.remove('show');
                 return; // Don't show feedback div if nothing to report
            }
            feedbackEl.className = 'feedback-area mt-2 show';
        }
     };
}
if (typeof window.resetFillBlanks !== 'function') {
    window.resetFillBlanks = function(containerId) { 
        const container = document.getElementById(containerId);
         if (!container) {
            console.error(`Container with ID '${containerId}' not found for resetFillBlanks.`);
            return;
        }
        const blanks = container.querySelectorAll('.fill-in-blank');
        blanks.forEach(blank => {
            blank.value = '';
            blank.classList.remove('correct', 'incorrect');
        });
        const feedbackElId = containerId + '-feedback';
        const feedbackEl = document.getElementById(feedbackElId);
        if (feedbackEl) {
            feedbackEl.innerHTML = '';
            feedbackEl.classList.remove('show');
        }
    };
}
