// --- Function to disable copy, paste, cut, and context menu ---
function disableCopyPasteCut(element) {
    const eventsToBlock = ['copy', 'paste', 'cut', 'contextmenu'];
    eventsToBlock.forEach(eventType => {
        element.addEventListener(eventType, (e) => {
            e.preventDefault();
            // Optionally, provide feedback to the user:
            // console.log(`${eventType} action is disabled on this element.`);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Disable copy/paste on relevant elements commonly found in worksheets
    const elementsToProtect = document.querySelectorAll(
        'input[type="text"], textarea, .fill-blank[contenteditable="true"]'
    );
    elementsToProtect.forEach(el => {
        disableCopyPasteCut(el);
    });
});


// --- Theme Toggle Functionality ---
function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function toggleTheme() {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const newTheme = isDarkMode ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    updateThemeToggleButton(newTheme); // Optional: Update button icon/text
}

function updateThemeToggleButton(theme) {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        // Example: Change icon based on theme (requires Font Awesome or similar)
        // You might need to adjust the icon classes based on what you use
        if (theme === 'dark') {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode'; // Icon for switching to light
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode'; // Icon for switching to dark
        }
    }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    let preferredTheme = localStorage.getItem('theme');
    if (!preferredTheme) {
        // If no preference saved, check OS preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            preferredTheme = 'dark';
        } else {
            preferredTheme = 'light'; // Default to light if OS preference not dark or not supported
        }
    }
    applyTheme(preferredTheme);
    updateThemeToggleButton(preferredTheme); // Set initial button state

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
});

/**
 * Toggles the visibility of a mark scheme element and updates the button text.
 * @param {string} markSchemeId - The ID of the mark scheme element to toggle.
 * @param {string} [textareaId] - (Optional) The ID of the associated textarea. Not used directly for toggling here
 *                                as button enabling logic is separate, but kept for signature consistency.
 * @param {HTMLElement} buttonElement - The button element that was clicked.
 */
window.toggleMarkScheme = function(markSchemeId, textareaId, buttonElement) {
    const markScheme = document.getElementById(markSchemeId);
    if (!markScheme) {
        console.error(`Mark scheme element with ID '${markSchemeId}' not found.`);
        return;
    }

    const isShown = markScheme.classList.contains('show');

    if (isShown) {
        markScheme.classList.remove('show');
        if (buttonElement) {
            buttonElement.textContent = 'Show Mark Scheme';
        }
    } else {
        markScheme.classList.add('show');
        if (buttonElement) {
            buttonElement.textContent = 'Hide Mark Scheme';
        }
    }
};
