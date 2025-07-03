document.addEventListener('DOMContentLoaded', () => {
    // --- PASTE PREVENTION ---
    document.addEventListener('paste', (e) => {
        document.body.classList.add('shame-mode');
        e.preventDefault();
    });

    // --- GLOBAL STATE ---
    let currentSection = 0;
    let xp = 0;
    let level = 1;
    const achievements = new Set();
    const completedActions = new Set();
    const TOTAL_LEVELS = 5;
    const XP_PER_LEVEL = 200;

    // --- HTML CONTENT TEMPLATES ---
    const sections = [
        // 0: Welcome
        `<h1>🛡️ Welcome to Defensive Design!</h1>
         <div class="card">
             <h2>Building Storm-Proof Software</h2>
             <p>Imagine building a house. You wouldn't just build it for a sunny day; you'd add strong foundations, reinforced windows, and a solid roof to withstand storms. <strong>Defensive Design</strong> is the same idea for software.</p>
             <p>In this lesson, you'll learn how to write programs that are robust, secure, and prepared for unexpected situations. You'll anticipate how users might make mistakes and how to protect your programs from them.</p>
             <div style="margin: 2rem 0;">
                 <h3>🎯 How This Works:</h3>
                 <ul>
                     <li>✅ Complete activities to earn XP.</li>
                     <li>🏆 Unlock achievements for mastering concepts.</li>
                     <li>📝 Practice exam questions with instant feedback.</li>
                 </ul>
             </div>
             <p><strong>Ready to build stronger code?</strong> Click Next!</p>
             <div class="easter-egg" id="easter-egg-1"></div>
         </div>`,
        // 1: Starter
        `<h1>🎮 Starter: Threat or Defence?</h1>
         <p>Before we dive in, let's see what you already know. Drag each term into the correct category: is it a <strong>Threat</strong> we need to defend against, or a <strong>Defence</strong> technique we can use?</p>
         <div class="drag-drop-container">
             <div>
                 <h3>Items to Sort:</h3>
                 <div id="starter-items" class="drop-zone" data-category="source">
                     <div class="drag-item" draggable="true" data-type="defence">Input Validation</div>
                     <div class="drag-item" draggable="true" data-type="threat">SQL Injection</div>
                     <div class="drag-item" draggable="true" data-type="defence">Authentication</div>
                     <div class="drag-item" draggable="true" data-type="threat">Accidental Misuse</div>
                     <div class="drag-item" draggable="true" data-type="defence">Commenting Code</div>
                     <div class="drag-item" draggable="true" data-type="threat">Brute-force Attack</div>
                     <div class="drag-item" draggable="true" data-type="defence">Input Sanitisation</div>
                 </div>
             </div>
             <div>
                 <div class="drop-zone" data-category="threat"><h3>Threats</h3></div>
                 <div class="drop-zone" data-category="defence" style="margin-top: 1rem;"><h3>Defences</h3></div>
             </div>
         </div>
         <div style="text-align: center; margin-top: 2rem;">
             <button class="btn" id="check-starter-btn">Check Answers</button>
             <button class="btn" id="reset-starter-btn">Reset</button>
         </div>
         <div id="starter-feedback" style="margin-top: 1rem; text-align: center;"></div>`,
        // 2: Learning Outcomes
        `<h1>🎯 Learning Outcomes</h1>
         <p>By the end of this lesson, you will be able to:</p>
         <div class="card"><h3>✅ Knowledge</h3><ul>
             <li>Define and distinguish between validation, verification, and sanitisation.</li>
             <li>Describe different types of authentication, including 2FA.</li>
             <li>Identify key features of maintainable code (comments, indentation, naming, sub-routines).</li>
         </ul></div>
         <div class="card"><h3>🔧 Skills</h3><ul>
             <li>Identify and apply appropriate validation checks (Presence, Length, Range, Format, Existence).</li>
             <li>Analyse code for maintainability issues.</li>
             <li>Explain how defensive design principles prevent common security threats.</li>
         </ul></div>`,
        // 3: Validation vs Verification
        `<h1>🤔 Validation vs. Verification</h1>
         <p>These two terms sound similar but mean very different things in programming.</p>
         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
             <div class="card">
                 <h3>VALIDATION</h3>
                 <p><strong>The Question:</strong> Is this data sensible and acceptable?</p>
                 <p><strong>The Goal:</strong> To reject bad data before it causes errors.</p>
                 <p><strong>Example:</strong> Checking that an age entered is between 0 and 120. An age of -5 is not sensible.</p>
             </div>
             <div class="card">
                 <h3>VERIFICATION</h3>
                 <p><strong>The Question:</strong> Has this data been entered correctly?</p>
                 <p><strong>The Goal:</strong> To prevent typos and data entry mistakes.</p>
                 <p><strong>Example:</strong> Asking a user to type their new password twice to make sure they didn't make a typo.</p>
             </div>
         </div>
         <h3>Quick Quiz</h3>
         <p>For each scenario, click whether it's an example of Validation or Verification.</p>
         <div id="vv-quiz">
            <div class="vv-question" data-correct-answer="verification">
                <p>A website asks you to enter your email address twice when signing up.</p>
                <div class="vv-choices">
                    <button class="btn vv-choice-btn" data-choice="validation">Validation</button>
                    <button class="btn vv-choice-btn" data-choice="verification">Verification</button>
                </div>
            </div>
            <div class="vv-question" data-correct-answer="validation">
                <p>A program rejects a month value of "13".</p>
                <div class="vv-choices">
                    <button class="btn vv-choice-btn" data-choice="validation">Validation</button>
                    <button class="btn vv-choice-btn" data-choice="verification">Verification</button>
                </div>
            </div>
            <div class="vv-question" data-correct-answer="verification">
                <p>A cashier reads your order back to you before you pay.</p>
                <div class="vv-choices">
                    <button class="btn vv-choice-btn" data-choice="validation">Validation</button>
                    <button class="btn vv-choice-btn" data-choice="verification">Verification</button>
                </div>
            </div>
            <div class="vv-question" data-correct-answer="validation">
                <p>An online form ensures your phone number contains only digits and is 11 characters long.</p>
                <div class="vv-choices">
                    <button class="btn vv-choice-btn" data-choice="validation">Validation</button>
                    <button class="btn vv-choice-btn" data-choice="verification">Verification</button>
                </div>
            </div>
            <div class="vv-question" data-correct-answer="validation">
                <p>A website form checks if a credit card number has exactly 16 digits.</p>
                <div class="vv-choices">
                    <button class="btn vv-choice-btn" data-choice="validation">Validation</button>
                    <button class="btn vv-choice-btn" data-choice="verification">Verification</button>
                </div>
            </div>
            <div class="vv-question" data-correct-answer="verification">
                <p>A pop-up box asks, "Are you sure you want to delete this file?"</p>
                <div class="vv-choices">
                    <button class="btn vv-choice-btn" data-choice="validation">Validation</button>
                    <button class="btn vv-choice-btn" data-choice="verification">Verification</button>
                </div>
            </div>
         </div>
         <style>
            .vv-question { background: #f9f9f9; border: 2px solid #eee; border-radius: 10px; padding: 1rem; margin: 1rem 0; transition: border-color 0.3s; }
            .vv-question p { margin-bottom: 1rem; }
            .vv-choices { display: flex; gap: 1rem; justify-content: center; }
            .vv-choice-btn { background-color: #f0f0f0; color: #333; border: 2px solid transparent; }
            .vv-choice-btn.selected { background-color: #e3f2fd; border-color: #2196f3; color: #2196f3; }
            .vv-question.correct { border-color: #4caf50; }
            .vv-question.incorrect { border-color: #f44336; }
         </style>
         <div style="text-align: center; margin-top: 1.5rem;">
            <button class="btn" id="check-vv-quiz-btn">Check Answers</button>
         </div>
         <div id="vv-quiz-feedback" style="text-align: center; margin-top: 1rem; font-weight: bold;"></div>`,
        // 4: Validation Toolkit (OVERHAULED)
        `<h1>🛠️ The Validation Toolkit</h1>
        <p>Let's practice the different types of validation. Complete the tasks at each "station".</p>
        
        <div class="card">
            <h3>Station 1: Presence Check</h3>
            <p>This check ensures that the user has actually entered some data.</p>
            <label for="presence-input">Required Username:</label>
            <input type="text" id="presence-input" placeholder="Cannot be blank" style="width:100%; padding:0.5rem; border-radius:5px; border: 1px solid #ccc;">
            <button class="btn" id="presence-btn" style="margin-top:0.5rem;">Submit</button>
            <div id="presence-feedback" class="feedback-box"></div>
        </div>

        <div class="card">
            <h3>Station 2: Length Check</h3>
            <p>This check ensures the input is the correct number of characters.</p>
            <label for="length-input">PIN Code (must be exactly 4 characters):</label>
            <input type="text" id="length-input" maxlength="10" style="width:100%; padding:0.5rem; border-radius:5px; border: 1px solid #ccc;">
            <div id="length-feedback" class="feedback-box"></div>
        </div>

        <div class="card">
            <h3>Station 3: Range Check</h3>
            <p>This check ensures a number is between a lower and upper bound.</p>
            <label for="range-input">Enter a quantity (1-100):</label>
            <input type="number" id="range-input" style="width:100%; padding:0.5rem; border-radius:5px; border: 1px solid #ccc;">
            <button class="btn" id="range-btn" style="margin-top:0.5rem;">Check Number</button>
            <div id="range-feedback" class="feedback-box"></div>
        </div>
        
        <div class="card">
            <h3>Station 4: Format Check</h3>
            <p>This check ensures the data follows a specific pattern.</p>
            <label for="format-input">Email Address (e.g., name@example.com):</label>
            <input type="text" id="format-input" style="width:100%; padding:0.5rem; border-radius:5px; border: 1px solid #ccc;">
            <button class="btn" id="format-btn" style="margin-top:0.5rem;">Check Format</button>
            <div id="format-feedback" class="feedback-box"></div>
        </div>

        <div class="card">
            <h3>Station 5: Existence/List Check</h3>
            <p>This check ensures the input is one of a few allowed options.</p>
            <label for="existence-input">Choose a primary colour (red, green, or blue):</label>
            <input type="text" id="existence-input" style="width:100%; padding:0.5rem; border-radius:5px; border: 1px solid #ccc;">
            <button class="btn" id="existence-btn" style="margin-top:0.5rem;">Check Colour</button>
            <div id="existence-feedback" class="feedback-box"></div>
        </div>
        <style>.feedback-box { margin-top: 0.5rem; font-weight: bold; } .correct-feedback { color: #4caf50; } .incorrect-feedback { color: #f44336; }</style>
        `,
        // 5: Authentication
        `<h1>🔑 Authentication: Who Goes There?</h1>
         <p>Authentication is the process of proving you are who you say you are. It's the digital equivalent of a bouncer checking your ID.</p>
         <div class="card">
             <h3>Spotlight: Two-Factor Authentication (2FA)</h3>
             <p>2FA is much more secure because it combines <strong>two</strong> different methods: something you <strong>know</strong> (like a password) and something you <strong>have</strong> (like your phone).</p>
         </div>
         <div class="card">
            <h3>Password Cracker Mini-Game</h3>
            <p>This illustrates why strong passwords are a vital defence. Click 'Start' to see a computer attempt to guess a weak password using a brute-force attack.</p>
            <div id="password-cracker" class="simulator" style="background-color: #37474f; color: #fff; text-align: center;">
                <p>Password to crack: <strong id="crack-target" style="color: #ffc107; font-size: 1.5rem;">123</strong></p>
                <p>Current Guess: <strong id="crack-guess" style="font-size: 1.5rem;">0</strong></p>
                <p>Time Elapsed: <strong id="crack-time">0.00s</strong></p>
            </div>
            <div style="text-align: center;">
                 <button class="btn" id="crack-start-btn">Start Cracking</button>
            </div>
            <div id="crack-feedback" class="card" style="display:none; background-color: #e8f5e9;"></div>
         </div>`,
        // 6: Maintainable Code
        `<h1>✍️ Writing Maintainable Code</h1>
        <p>Good code doesn't just work; it's also easy for other programmers (and your future self!) to read, understand, and modify. This is <strong>maintainability</strong>.</p>
        <h3>Code Refactor Challenge</h3>
        <p class="card" style="background: #e3f2fd;">The Python code below is supposed to find the <strong>highest number in a list</strong>, but it's very difficult to understand. Your task is to rewrite it in the blank box below to be more maintainable.</p>
        <div style="display:grid; grid-template-columns: 1fr; gap:1rem;">
            <div class="simulator">
                <p># POORLY WRITTEN CODE</p>
                <pre><code>def x(d):
a=d[0]
for i in d:
if i>a:
a=i
return a</code></pre>
            </div>
            <div>
                <p><strong>Your Refactored Code:</strong></p>
                <textarea id="refactor-input" class="no-paste"></textarea>
                <div style="text-align:center;">
                    <button class="btn" id="check-refactor-btn">Check My Code</button>
                    <button class="btn" id="reveal-refactor-btn">Reveal Suggestion</button>
                </div>
                <div id="refactor-score-feedback" class="card" style="display:none;"></div>
                <div id="refactor-suggestion" class="simulator" style="display:none; margin-top:1rem; background-color:#e8f5e9; color:#333;">
                    <p># SUGGESTED REFACTORED CODE</p>
                    <pre><code># Finds the highest number in a list.
def find_highest_number(numbers):
    # Set the initial highest number to the first element.
    highest = numbers[0]
    # Loop through each number in the list.
    for number in numbers:
        # If the current number is greater, update highest.
        if number > highest:
            highest = number
    return highest</code></pre>
                </div>
            </div>
        </div>`,
        // 7: Input Sanitisation & Threats
        `<h1>🔬 Input Sanitisation & Real-World Threats</h1>
         <p>Sometimes, users don't just make mistakes; they can be malicious. <strong>Input Sanitisation</strong> is the process of cleaning user input to remove dangerous characters.</p>
         <p>A common attack it prevents is <strong>SQL Injection</strong>, where attackers try to manipulate your database.</p>
         <div class="card" id="sql-sim-container">
            <h3>SQL Injection Simulator</h3>
            <p><strong>Step 1:</strong> Try to log in with the malicious input <code>' OR 1=1; --</code> to see the vulnerability.</p>
            <label for="sql-input">Username:</label>
            <input type="text" id="sql-input" style="width:100%; padding:0.5rem; border-radius:5px; border: 1px solid #ccc;">
            <button id="sql-login-btn" class="btn">Login</button>
            <p style="margin-top:1rem;"><strong>Resulting Database Query:</strong></p>
            <div class="simulator" id="sql-query-output">SELECT * FROM users WHERE username = '[your_input]'</div>
            <div id="sql-feedback" style="text-align:center; font-weight:bold; margin-top:1rem;"></div>
            <div style="text-align:center;">
                <button id="sql-fix-btn" class="btn" style="display:none; background-color:#4caf50;">Apply Sanitisation Fix</button>
            </div>
         </div>`,
        // 8: Common Mistakes
        `<h1>🤔 Common Mistakes & Myth Busting</h1>
         <p>Let's clear up some common misconceptions about defensive design. Label each statement as a Fact or a Myth.</p>
         <div id="myth-quiz-container">
            <div class="card" data-answer="myth">
                <p><strong>Statement 1:</strong> "Commenting every single line of code is the best way to make it maintainable."</p>
                <button class="btn fact-btn">Fact</button> <button class="btn myth-btn">Myth</button>
                <div class="feedback" style="display:none;"><strong>Myth.</strong> Good code should be self-documenting. Comments are for explaining the 'why' of complex parts, not the 'what' of simple lines.</div>
            </div>
            <div class="card" data-answer="fact">
                <p><strong>Statement 2:</strong> "Input validation helps prevent accidental user errors AND malicious attacks."</p>
                <button class="btn fact-btn">Fact</button> <button class="btn myth-btn">Myth</button>
                <div class="feedback" style="display:none;"><strong>Fact.</strong> It stops a user from entering their age as '150' by mistake, and also stops an attacker trying to crash the system with invalid data.</div>
            </div>
             <div class="card" data-answer="myth">
                <p><strong>Statement 3:</strong> "Validation and Verification are the same thing."</p>
                <button class="btn fact-btn">Fact</button> <button class="btn myth-btn">Myth</button>
                <div class="feedback" style="display:none;"><strong>Myth.</strong> Validation checks if data is sensible (e.g., is the number in range?). Verification checks if data was typed correctly (e.g., enter password twice).</div>
            </div>
         </div>`,
        // 9: Exam Questions
        `<h1>📝 Practice Exam Questions</h1>
         <p>Test your knowledge with these GCSE-style questions.</p>
         <div class="exam-question">
             <h3>Question 1 [4 marks]</h3>
             <p>Explain the difference between input validation and input verification. Use an example for each.</p>
             <textarea id="q1-answer" class="no-paste"></textarea>
             <div class="marks-input">
                 <label>Predicted marks (out of 4):</label>
                 <input type="number" id="q1-marks" min="0" max="4">
                 <button class="btn show-scheme-btn" data-question="q1" disabled>Show Mark Scheme</button>
             </div>
             <div class="mark-scheme" id="q1-scheme">
                 <h4>Mark Scheme:</h4>
                 <ul>
                     <li><strong>Validation:</strong> A check to ensure data is sensible/reasonable/allowed [1]. <strong>Example:</strong> A range check to ensure age is between 0-120 [1].</li>
                     <li><strong>Verification:</strong> A check to ensure data has been entered correctly/exactly as intended [1]. <strong>Example:</strong> Double entry of a password or email [1].</li>
                 </ul>
             </div>
         </div>
         <div class="exam-question">
             <h3>Question 2 [6 marks]</h3>
             <p>A school is creating a program for students to book a computer for a lunchtime session. The program needs to be robust.</p>
             <p>Describe <strong>three</strong> different validation checks that could be used on the input form, which asks for the student's <strong>full name</strong>, <strong>year group (7-11)</strong>, and the <strong>computer number (1-30)</strong>.</p>
             <textarea id="q2-answer" class="no-paste"></textarea>
             <div class="marks-input">
                 <label>Predicted marks (out of 6):</label>
                 <input type="number" id="q2-marks" min="0" max="6">
                 <button class="btn show-scheme-btn" data-question="q2" disabled>Show Mark Scheme</button>
             </div>
             <div class="mark-scheme" id="q2-scheme">
                 <h4>Mark Scheme (1 mark for identifying check, 1 for applying it):</h4>
                 <ul>
                     <li><strong>Presence Check:</strong> To ensure the student's name is not left blank. [2]</li>
                     <li><strong>Range Check:</strong> To ensure the year group entered is between 7 and 11 (inclusive). [2]</li>
                     <li><strong>Range Check:</strong> To ensure the computer number is between 1 and 30 (inclusive). [2]</li>
                     <li><em>(Alternative marks for: Type check on year/computer number, length check on name)</em></li>
                 </ul>
             </div>
         </div>`,
        // 10: Extension Activities
        `<h1>🚀 Extension Activities</h1>
         <p>Ready to go beyond the specification? Try these challenges.</p>
         <div class="extension-activity">
             <h2>🧠 Challenge 1: Hashing and Salting</h2>
             <p>Storing passwords directly is a major security flaw. Instead, systems store a <strong>hash</strong> of the password. To make this even more secure, they add a 'salt'.</p>
             <p><strong>Research Task:</strong> In your own words, what is password hashing, and what is a 'salt'? Why is salting important to protect against attacks like 'rainbow tables'?</p>
             <textarea id="ext1-answer" class="no-paste" placeholder="Hashing is a one-way process that... A salt is..."></textarea>
         </div>
         <div class="extension-activity">
             <h2>🧪 Challenge 2: Design a Test Plan</h2>
             <p>You are testing a new password creation form. The rules are: 8-16 characters, must contain at least one number, and must contain at least one uppercase letter.</p>
             <p><strong>Design Task:</strong> List 5 test cases for this form. Include the test data you would use and the expected outcome (Pass/Fail). Think about normal, boundary, and erroneous data.</p>
             <textarea id="ext2-answer" class="no-paste" placeholder="1. Data: 'Password123', Expected: Pass
2. Data: 'pass', Expected: Fail (too short)
..."></textarea>
         </div>`,
        // 11: Summary
        `<h1>🎯 Key Takeaways</h1>
         <div class="card">
             <h2>✅ What You've Learned</h2>
             <ul>
                 <li><strong>Defensive Design</strong> is about creating robust programs that anticipate and handle misuse and errors.</li>
                 <li><strong>Validation</strong> checks if data is sensible (Range, Length, Format etc.), while <strong>Verification</strong> checks if it was typed correctly (Double Entry).</li>
                 <li><strong>Authentication</strong> (Passwords, 2FA) is vital for ensuring only authorised users can access a system.</li>
                 <li><strong>Maintainable Code</strong> (Comments, Naming, Indentation, Sub-routines) is crucial for long-term development and collaboration.</li>
                 <li><strong>Input Sanitisation</strong> cleans data to prevent security threats like SQL Injection.</li>
             </ul>
         </div>
         <div class="card">
             <h2>💡 The Golden Rule</h2>
             <p style="font-size: 1.2rem; text-align: center;"><strong>Never trust user input! Always check, clean, and validate it.</strong></p>
         </div>
         <div class="card">
             <h2>🏆 Your Progress</h2>
             <p>Congratulations on completing this lesson! You've earned:</p>
             <div style="text-align: center; font-size: 2rem; margin: 1rem 0;">
                 <span id="final-xp">0</span> XP
             </div>
             <div id="achievements-summary" style="text-align: center;"></div>
         </div>`,
        // 12: Video Resources
        `<h1>🎥 Video Resources</h1>
         <p>Watch these videos to reinforce your learning.</p>
         <div class="card video-placeholder"><h3>Video 1: Input Validation Explained</h3><p>Video link to be added.</p></div>
         <div class="card video-placeholder"><h3>Video 2: How 2FA Works</h3><p>Video link to be added.</p></div>`
    ];

    const mainContent = document.getElementById('main-content');
    const navLinksContainer = document.querySelector('.nav-links');

    // --- INITIALIZATION ---
    function init() {
        let sectionHTML = '';
        sections.forEach((content, i) => {
            sectionHTML += `<section class="section ${i === 0 ? 'active' : ''}" id="section-${i}">
                ${content}
                <div class="section-nav">
                    <button class="nav-btn prev-btn" ${i === 0 ? 'disabled' : ''}>← Previous</button>
                    <button class="nav-btn next-btn" ${i === sections.length - 1 ? 'disabled' : ''}>Next →</button>
                </div>
            </section>`;
        });
        mainContent.innerHTML = sectionHTML;

        addEventListeners();
        setupDragDrop();
        loadAccessibilitySettings();
        navigateToSection(0, true);
    }
    
    // --- NAVIGATION ---
    function navigateToSection(index, isInitialLoad = false) {
        if (index < 0 || index >= sections.length) return;
        currentSection = index;
        
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(`section-${index}`).classList.add('active');
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector(`.nav-link[data-section="${index}"]`).classList.add('active');
        
        if (!isInitialLoad) {
            document.getElementById(`section-${index}`).focus({ preventScroll: true });
            if (window.navigator.vibrate) window.navigator.vibrate(50);
        }
        
        if (index === 11) {
            const finalXp = document.getElementById('final-xp');
            if(finalXp) finalXp.textContent = xp;
            
            const summaryDiv = document.getElementById('achievements-summary');
            if(summaryDiv){
                summaryDiv.innerHTML = '<h3>Achievements Unlocked:</h3>';
                if (achievements.size > 0) {
                    achievements.forEach(ach => summaryDiv.innerHTML += `<span>🏆 ${ach}</span><br>`);
                } else {
                    summaryDiv.innerHTML += '<p>None yet. Go back and complete some tasks!</p>';
                }
            }
        }
    }

    // --- XP & ACHIEVEMENTS ---
    function addXP(amount, actionId) {
        if (completedActions.has(actionId)) return;
        completedActions.add(actionId);

        xp += amount;
        const oldLevel = level;
        level = Math.floor(xp / XP_PER_LEVEL) + 1;
        level = Math.min(level, TOTAL_LEVELS);
        
        const xpCount = document.getElementById('xp-count');
        if(xpCount) xpCount.textContent = xp;

        const xpInLevel = level < TOTAL_LEVELS ? xp % XP_PER_LEVEL : XP_PER_LEVEL;
        const fillPercent = (xpInLevel / XP_PER_LEVEL) * 100;

        const xpFill = document.getElementById('xp-fill');
        if(xpFill) xpFill.style.width = `${fillPercent}%`;
        
        const xpBar = document.querySelector('.xp-bar');
        if(xpBar) xpBar.setAttribute('aria-valuenow', fillPercent);
        
        createParticles(document.querySelector('.xp-container'));

        if (level > oldLevel) {
            const levelEl = document.getElementById('level');
            if(levelEl) levelEl.textContent = level;
            showAchievement('🎉', `Level Up!`, `You've reached Level ${level}!`);
        }
    }

    function showAchievement(icon, title, description) {
        if (achievements.has(title)) return;
        achievements.add(title);

        const popup = document.getElementById('achievement-popup');
        if(!popup) return;
        
        popup.querySelector('#achievement-icon').textContent = icon;
        popup.querySelector('#achievement-title').textContent = title;
        popup.querySelector('#achievement-desc').textContent = description;

        popup.classList.add('show');
        if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);

        setTimeout(() => popup.classList.remove('show'), 4000);
    }

    function createParticles(element) {
        if (document.body.classList.contains('reduce-motion') || !element) return;
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            p.style.setProperty('--color', `hsl(${Math.random() * 360}, 70%, 60%)`);
            p.style.left = `${rect.left + rect.width / 2}px`;
            p.style.top = `${rect.top + rect.height / 2}px`;
            p.style.setProperty('--x', `${(Math.random() - 0.5) * 200}px`);
            p.style.setProperty('--y', `${(Math.random() - 0.5) * 200}px`);
            document.body.appendChild(p);
            p.addEventListener('animationend', () => p.remove());
        }
    }
    
    // --- ACCESSIBILITY ---
    function loadAccessibilitySettings() {
        const settings = ['fontSize', 'highContrast', 'dyslexiaFont', 'reduceMotion'];
        settings.forEach(setting => {
            const value = localStorage.getItem(setting);
            if (value) {
                const toggle = document.getElementById(`${setting.replace(/([A-Z])/g, '-$1').toLowerCase()}-toggle`);
                if (setting === 'fontSize') {
                    document.body.classList.add(`font-${value}`);
                    document.getElementById('font-size-select').value = value;
                } else if (value === 'true' && toggle) {
                    document.body.classList.add(setting.replace(/([A-Z])/g, '-$1').toLowerCase());
                    toggle.checked = true;
                }
            }
        });
    }

    // --- EVENT HANDLING ---
    function addEventListeners() {
        // Main Nav
        navLinksContainer.addEventListener('click', e => {
            if (e.target.matches('.nav-link')) {
                navigateToSection(parseInt(e.target.dataset.section));
            }
        });

        // Keyboard Nav & Mobile Swipes
        document.addEventListener('keydown', e => {
            if (e.altKey && e.key === 'ArrowRight') navigateToSection(currentSection + 1);
            if (e.altKey && e.key === 'ArrowLeft') navigateToSection(currentSection - 1);
        });
        let touchstartX = 0;
        mainContent.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX }, { passive: true });
        mainContent.addEventListener('touchend', e => {
            const touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX - 50) navigateToSection(currentSection + 1);
            if (touchendX > touchstartX + 50) navigateToSection(currentSection - 1);
        });

        // Accessibility Panel
        document.getElementById('accessibility-btn')?.addEventListener('click', () => document.getElementById('accessibility-panel')?.classList.toggle('show'));
        document.getElementById('font-size-select')?.addEventListener('change', e => {
            document.body.className = document.body.className.replace(/font-(small|medium|large|xlarge)/g, '');
            document.body.classList.add(`font-${e.target.value}`);
            localStorage.setItem('fontSize', e.target.value);
        });
        ['high-contrast', 'dyslexia-font', 'reduce-motion'].forEach(cls => {
            const toggle = document.getElementById(`${cls}-toggle`);
            if (toggle) {
                toggle.addEventListener('change', e => {
                    const camelCase = cls.replace(/-([a-z])/g, g => g[1].toUpperCase());
                    document.body.classList.toggle(cls, e.target.checked);
                    localStorage.setItem(camelCase, e.target.checked);
                });
            }
        });
        document.getElementById('reset-accessibility-btn')?.addEventListener('click', () => {
             localStorage.clear();
             window.location.reload();
        });
        document.getElementById('easter-egg-1')?.addEventListener('click', () => {
            showAchievement('🥚', 'Easter Egg!', 'You found a hidden secret!');
            addXP(50, 'easter-egg-1');
        });

        // CENTRAL CLICK HANDLER using Event Delegation
        mainContent.addEventListener('click', e => {
            const target = e.target;

            // Section Nav
            if (target.matches('.next-btn')) navigateToSection(currentSection + 1);
            if (target.matches('.prev-btn')) navigateToSection(currentSection - 1);
            
            // Section 1: Starter
            if (target.id === 'check-starter-btn') handleStarterCheck();
            if (target.id === 'reset-starter-btn') handleStarterReset();

            // Section 3: V&V Quiz
            if (target.matches('.vv-choice-btn')) handleVvChoice(target);
            if (target.id === 'check-vv-quiz-btn') handleVvCheck();

            // Section 4: Validation Stations
            if (target.id === 'presence-btn') handlePresenceCheck();
            if (target.id === 'range-btn') handleRangeCheck();
            if (target.id === 'format-btn') handleFormatCheck();
            if (target.id === 'existence-btn') handleExistenceCheck();
            
            // Section 5: Password Cracker
            if (target.id === 'crack-start-btn') handlePasswordCracker();
            
            // Section 6: Refactor
            if (target.id === 'check-refactor-btn') handleRefactorCheck();
            if (target.id === 'reveal-refactor-btn') document.getElementById('refactor-suggestion').style.display = 'block';

            // Section 7: SQLi Sim
            if (target.id === 'sql-login-btn') handleSqlSim();
            if (target.id === 'sql-fix-btn') handleSqlFix();

            // Section 8: Myth Quiz
            if (target.matches('.fact-btn') || target.matches('.myth-btn')) handleMythCheck(target);
            
            // Section 9: Exam Questions
            if (target.matches('.show-scheme-btn')) handleShowScheme(target);
        });
        
        // Input listeners for real-time feedback
        mainContent.addEventListener('input', e => {
            // Exam Questions
            if(e.target.matches('.exam-question textarea, .exam-question input[type="number"]')) {
                handleExamInput(e.target);
            }
            // Section 4: Length Check Station
            if (e.target.id === 'length-input') {
                handleLengthCheck(e.target);
            }
        });
    }

    // --- DRAG & DROP ---
    function setupDragDrop() {
        let draggedItem = null;
        mainContent.addEventListener('dragstart', e => { if (e.target.matches('.drag-item')) { draggedItem = e.target; setTimeout(() => e.target.classList.add('dragging'), 0); } });
        mainContent.addEventListener('dragend', e => { if (e.target.matches('.drag-item')) { e.target.classList.remove('dragging'); draggedItem = null; } });
        mainContent.addEventListener('dragover', e => { if (e.target.matches('.drop-zone')) e.preventDefault(); });
        mainContent.addEventListener('drop', e => { if (e.target.matches('.drop-zone')) { e.preventDefault(); if (draggedItem) e.target.appendChild(draggedItem); } });
    }

    // --- HANDLER FUNCTIONS ---
    function handleExamInput(target) {
        const questionDiv = target.closest('.exam-question');
        if (questionDiv) {
            const answerText = questionDiv.querySelector('textarea');
            const marksInput = questionDiv.querySelector('input[type="number"]');
            const showBtn = questionDiv.querySelector('.show-scheme-btn');
            if (answerText && marksInput && showBtn) {
                const requiredLength = (parseInt(marksInput.max) || 4) * 10;
                const isAnswered = answerText.value.length >= requiredLength;
                const isMarked = marksInput.value !== '';
                showBtn.disabled = !(isAnswered && isMarked);
            }
        }
    }

    function handleStarterCheck() {
        let correct = 0;
        const threatZone = document.querySelector('#section-1 .drop-zone[data-category="threat"]');
        const defenceZone = document.querySelector('#section-1 .drop-zone[data-category="defence"]');
        if (!threatZone || !defenceZone) return;

        threatZone.querySelectorAll('.drag-item').forEach(item => { if(item.dataset.type === 'threat') correct++; });
        defenceZone.querySelectorAll('.drag-item').forEach(item => { if(item.dataset.type === 'defence') correct++; });

        const feedback = document.getElementById('starter-feedback');
        if(!feedback) return;
        if (threatZone.querySelectorAll('.drag-item').length === 3 && defenceZone.querySelectorAll('.drag-item').length === 4 && correct === 7) {
            feedback.innerHTML = '<h3 style="color: #4caf50;">Perfect! You know your threats from your defences!</h3>';
            addXP(30, 'starter-correct');
            showAchievement('🎯', 'Quick Start', 'Aced the starter activity!');
        } else {
            const totalInZones = threatZone.querySelectorAll('.drag-item').length + defenceZone.querySelectorAll('.drag-item').length;
            feedback.innerHTML = `<h3 style="color: #f44336;">Not quite. You sorted ${totalInZones} out of 7 items. Try again!</h3>`;
        }
    }

    function handleStarterReset() {
        const container = document.getElementById('starter-items');
        const feedback = document.getElementById('starter-feedback');
        document.querySelectorAll('#section-1 .drag-item').forEach(item => container?.appendChild(item));
        if(feedback) feedback.innerHTML = '';
    }

    function handleVvChoice(button) {
        const choicesDiv = button.parentElement;
        choicesDiv?.querySelectorAll('.vv-choice-btn').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
    }

    function handleVvCheck() {
        const questions = document.querySelectorAll('#vv-quiz .vv-question');
        let correctCount = 0;
        let answeredCount = 0;
        questions.forEach(question => {
            question.classList.remove('correct', 'incorrect');
            const selectedButton = question.querySelector('.vv-choice-btn.selected');
            if (selectedButton) {
                answeredCount++;
                if (selectedButton.dataset.choice === question.dataset.correctAnswer) {
                    question.classList.add('correct');
                    correctCount++;
                    addXP(5, `vv-quiz-${question.querySelector('p').textContent.substring(0, 15)}`);
                } else {
                    question.classList.add('incorrect');
                }
            }
        });
        const feedbackDiv = document.getElementById('vv-quiz-feedback');
        if (!feedbackDiv) return;
        if (answeredCount === 0) {
            feedbackDiv.textContent = 'Please answer at least one question.';
            return;
        }
        feedbackDiv.textContent = `You got ${correctCount} out of ${questions.length} correct!`;
        if (correctCount === questions.length) {
            showAchievement('✅', 'V&V Expert', 'You mastered Validation vs. Verification!');
            if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
        }
    }
    
    // --- Validation Station Handlers ---
    function handlePresenceCheck() {
        const input = document.getElementById('presence-input');
        const feedback = document.getElementById('presence-feedback');
        if (!input || !feedback) return;
        if(input.value.trim() !== '') {
            feedback.textContent = 'Success! Input is present.';
            feedback.className = 'feedback-box correct-feedback';
            addXP(5, 'validation-presence');
        } else {
            feedback.textContent = 'Error: Input cannot be blank.';
            feedback.className = 'feedback-box incorrect-feedback';
        }
    }

    function handleLengthCheck(input) {
        const feedback = document.getElementById('length-feedback');
        if (!input || !feedback) return;
        const len = input.value.length;
        if (len === 4) {
            feedback.textContent = `Length is ${len}/4. Correct!`;
            feedback.className = 'feedback-box correct-feedback';
            addXP(5, 'validation-length');
        } else {
            feedback.textContent = `Length is ${len}/4. Keep trying...`;
            feedback.className = 'feedback-box incorrect-feedback';
        }
    }

    function handleRangeCheck() {
        const input = document.getElementById('range-input');
        const feedback = document.getElementById('range-feedback');
        if (!input || !feedback) return;
        const num = parseInt(input.value);
        if (!isNaN(num) && num >= 1 && num <= 100) {
            feedback.textContent = `Success! ${num} is in the range 1-100.`;
            feedback.className = 'feedback-box correct-feedback';
            addXP(5, 'validation-range');
        } else {
            feedback.textContent = `Error: Input must be a number between 1 and 100.`;
            feedback.className = 'feedback-box incorrect-feedback';
        }
    }

    function handleFormatCheck() {
        const input = document.getElementById('format-input');
        const feedback = document.getElementById('format-feedback');
        if (!input || !feedback) return;
        // Simple regex: contains characters, then @, then more characters, then ., then final characters.
        const regex = /.+@.+\..+/;
        if (regex.test(input.value)) {
            feedback.textContent = `Success! This looks like a valid email format.`;
            feedback.className = 'feedback-box correct-feedback';
            addXP(5, 'validation-format');
        } else {
            feedback.textContent = `Error: This does not match a typical email format.`;
            feedback.className = 'feedback-box incorrect-feedback';
        }
    }

    function handleExistenceCheck() {
        const input = document.getElementById('existence-input');
        const feedback = document.getElementById('existence-feedback');
        if (!input || !feedback) return;
        const allowed = ['red', 'green', 'blue'];
        if(allowed.includes(input.value.trim().toLowerCase())) {
            feedback.textContent = `Success! '${input.value}' is an allowed colour.`;
            feedback.className = 'feedback-box correct-feedback';
            addXP(5, 'validation-existence');
        } else {
            feedback.textContent = `Error: '${input.value}' is not in the allowed list (red, green, blue).`;
            feedback.className = 'feedback-box incorrect-feedback';
        }
    }
    
    function handlePasswordCracker() {
        const startBtn = document.getElementById('crack-start-btn');
        if (!startBtn || startBtn.disabled) return;
        
        startBtn.disabled = true;
        startBtn.textContent = 'Cracking...';
        
        const target = document.getElementById('crack-target').textContent;
        const guessEl = document.getElementById('crack-guess');
        const timeEl = document.getElementById('crack-time');
        const feedbackEl = document.getElementById('crack-feedback');
        
        let guess = 0;
        const startTime = performance.now();
        
        const intervalId = setInterval(() => {
            guess++;
            if (guessEl) guessEl.textContent = guess;
            
            const time = (performance.now() - startTime) / 1000;
            if(timeEl) timeEl.textContent = `${time.toFixed(2)}s`;
            
            if (String(guess) === target) {
                clearInterval(intervalId);
                const finalTime = (performance.now() - startTime) / 1000;
                if(guessEl) guessEl.style.color = '#4caf50';
                if(feedbackEl) {
                    feedbackEl.style.display = 'block';
                    feedbackEl.innerHTML = `<h4>Cracked!</h4><p>It took only <strong>${finalTime.toFixed(2)} seconds</strong> to guess the weak password '${target}'. This is why strong passwords (with letters, numbers, and symbols) are essential to defend against brute-force attacks.</p>`;
                }
                startBtn.textContent = 'Cracked!';
                addXP(25, 'cracker-game-complete');
                showAchievement('🔓', 'Password Cracked!', 'You demonstrated how weak passwords fall.');
            }
        }, 10);
    }

    function handleRefactorCheck() {
        const code = document.getElementById('refactor-input')?.value;
        const feedbackEl = document.getElementById('refactor-score-feedback');
        if(code === undefined || !feedbackEl) return;

        let score = 0;
        let feedbackPoints = [];

        // Check for comments
        if (code.includes('#')) {
            score++;
            feedbackPoints.push('✅ Used comments');
        } else {
            feedbackPoints.push('❌ Missing comments');
        }

        // Check for indentation (newline followed by whitespace)
        if (/\n\s+/.test(code)) {
             score++;
             feedbackPoints.push('✅ Used indentation');
        } else {
            feedbackPoints.push('❌ Missing indentation');
        }

        // Check for meaningful names (presence of an underscore is a good, forgiving proxy)
        if (code.includes('_')) {
             score++;
             feedbackPoints.push('✅ Used meaningful variable names (e.g., snake_case)');
        } else {
            feedbackPoints.push('❌ Try using longer, more descriptive variable names');
        }
        
        feedbackEl.style.display = 'block';
        feedbackEl.innerHTML = `<h4>Maintainability Score: ${score}/3</h4><ul>${feedbackPoints.map(f => `<li>${f}</li>`).join('')}</ul>`;

        if(score > 0) {
            addXP(score * 10, 'refactor-complete');
        }
        if (score === 3) {
            showAchievement('✍️', 'Code Whisperer', 'You wrote highly maintainable code!');
        }
    }

    function handleSqlSim() {
        const container = document.getElementById('sql-sim-container');
        const inputEl = document.getElementById('sql-input');
        const outputEl = document.getElementById('sql-query-output');
        const feedbackEl = document.getElementById('sql-feedback');
        const fixBtn = document.getElementById('sql-fix-btn');
        if(!container || !inputEl || !outputEl || !feedbackEl || !fixBtn) return;
        
        const input = inputEl.value;
        const isSanitised = container.dataset.sanitised === 'true';
        
        let finalInput = input;
        if(isSanitised) {
            // Simple sanitisation: remove single quotes and semicolons
            finalInput = input.replace(/[';]/g, '');
        }

        outputEl.textContent = `SELECT * FROM users WHERE username = '${finalInput}'`;
        
        const isMalicious = input.toLowerCase().includes(' or 1=1');

        if (isMalicious && !isSanitised) {
            outputEl.style.color = '#f44336';
            feedbackEl.textContent = 'ACCESS GRANTED! The malicious code tricked the database.';
            feedbackEl.style.color = '#f44336';
            fixBtn.style.display = 'inline-block';
            showAchievement('☠️', 'Hacker!', 'You performed a SQL Injection attack!');
        } else if (isMalicious && isSanitised) {
            outputEl.style.color = 'inherit';
            feedbackEl.textContent = 'ACCESS DENIED. The sanitised input did not match any user.';
            feedbackEl.style.color = '#4caf50';
        } else {
            outputEl.style.color = 'inherit';
            feedbackEl.textContent = 'ACCESS DENIED. Username not found.';
            feedbackEl.style.color = 'inherit';
        }
        addXP(5, `sql-sim-use-${isSanitised}`);
    }
    
    function handleSqlFix() {
        const container = document.getElementById('sql-sim-container');
        const fixBtn = document.getElementById('sql-fix-btn');
        const feedbackEl = document.getElementById('sql-feedback');
        if(!container || !fixBtn || !feedbackEl) return;

        container.dataset.sanitised = 'true';
        fixBtn.style.display = 'none';
        feedbackEl.textContent = 'Sanitisation Applied! Malicious characters will now be removed. Try the attack again.';
        feedbackEl.style.color = '#4caf50';
        addXP(20, 'sql-fix-applied');
        showAchievement('🛡️', 'System Secured', 'You applied a sanitisation fix.');
    }
    
    function handleMythCheck(button) {
        const card = button.closest('.card');
        if (!card) return;
        const feedback = card.querySelector('.feedback');
        const isCorrect = (button.classList.contains('fact-btn') && card.dataset.answer === 'fact') || (button.classList.contains('myth-btn') && card.dataset.answer === 'myth');
        if(feedback) {
            feedback.style.display = 'block';
            feedback.style.color = isCorrect ? '#4caf50' : '#f44336';
        }
        if (isCorrect) {
            addXP(10, `myth-quiz-${card.querySelector('strong').textContent.substring(0, 10)}`);
            if (window.navigator.vibrate) window.navigator.vibrate(100);
        }
    }

    function handleShowScheme(button) {
        const qId = button.dataset.question;
        if (!qId) return;
        const scheme = document.getElementById(`${qId}-scheme`);
        if (scheme) {
            scheme.classList.toggle('show');
            addXP(10, `exam-q-${qId}`);
        }
    }

    // --- START THE APP ---
    init();
});