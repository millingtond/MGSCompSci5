document.addEventListener('DOMContentLoaded', () => {

    // A single object to hold the entire game's state and logic
    const game = {
        // --- STATE ---
        state: {
            level: 1,
            commands: ["right", "right", "down", "down"],
            currentStep: 0,
            spritePos: { x: 1, y: 1 },
            initialSpritePos: { x: 1, y: 1 },
            gridSize: 10,
            gridCellSize: 50, // Will be calculated dynamically
            isAnimating: false,
        },

        // --- DOM ELEMENTS ---
        elements: {
            gridContainer: document.querySelector('.grid-container'),
            sprite: document.querySelector('.sprite'),
            codeBlock: document.querySelector('.code-block'),
            resetBtn: document.querySelector('.reset-btn'),
            levelCompleteMenu: document.querySelector('.level-complete-menu'),
            nextLevelBtn: document.querySelector('.menu-btn-primary'),
            replayBtn: document.querySelector('.menu-btn-secondary'),
            levelTitle: document.querySelector('.level-title'),
            menuTitle: document.querySelector('.menu-title'),
        },

        // --- METHODS ---

        /**
         * Initializes the game
         */
        init() {
            this.setupEventListeners();
            this.buildGrid();
            this.resetLevel();
            console.log("Game Initialized.");
        },
        
        /**
         * Recalculates sizes and repositions elements on window resize
         */
        handleResize() {
            const state = this.state;
            const elems = this.elements;

            // Calculate new cell size based on the actual grid container size
            state.gridCellSize = elems.gridContainer.offsetWidth / state.gridSize;

            // Update sprite size and position based on new cell size
            const spriteSize = state.gridCellSize * 0.7;
            elems.sprite.style.width = `${spriteSize}px`;
            elems.sprite.style.height = `${spriteSize}px`;
            
            this.updateSpritePosition();
        },

        /**
         * Builds the grid cells using a performant DocumentFragment
         */
        buildGrid() {
            const elems = this.elements;
            const state = this.state;
            const fragment = document.createDocumentFragment();
            
            elems.gridContainer.innerHTML = ''; // Clear old grid
            
            for (let y = 0; y < state.gridSize; y++) {
                for (let x = 0; x < state.gridSize; x++) {
                    const cell = document.createElement('div');
                    cell.className = 'grid-cell';
                    cell.id = `cell-${x}-${y}`;
                    fragment.appendChild(cell);
                }
            }
            elems.gridContainer.appendChild(fragment);
            elems.gridContainer.appendChild(elems.sprite); // Ensure sprite is on top
        },
        
        /**
         * Populates the code block with the current level's commands
         */
        displayCommands() {
            this.elements.codeBlock.innerHTML = this.state.commands
                .map(cmd => `<div>${cmd}</div>`)
                .join('');
        },

        /**
         * Resets the current level to its starting state
         */
        resetLevel() {
            const state = this.state;
            
            state.isAnimating = false;
            this.elements.levelCompleteMenu.classList.remove('visible');
            state.currentStep = 0;
            state.spritePos = { ...state.initialSpritePos };
            
            this.elements.levelTitle.textContent = `Level ${state.level}`;
            this.elements.menuTitle.textContent = `Level ${state.level} Complete!`;

            this.displayCommands();
            this.updateHighlight();
            this.handleResize(); // Recalculate sizes and set initial position
        },

        /**
         * Handles keyboard input from the player
         */
        handleKeyPress(e) {
            if (this.state.isAnimating) return;

            const expectedCommand = this.state.commands[this.state.currentStep];
            if (!expectedCommand) return;

            const keyMap = { "ArrowUp": "up", "ArrowDown": "down", "ArrowLeft": "left", "ArrowRight": "right" };
            const playerCommand = keyMap[e.key];
            if (!playerCommand) return;

            if (playerCommand === expectedCommand) {
                this.onCorrectMove(playerCommand);
            } else {
                this.onIncorrectMove();
            }
        },

        onCorrectMove(command) {
            const pos = this.state.spritePos;
            if (command === "right") pos.x++;
            if (command === "left")  pos.x--;
            if (command === "down")  pos.y++;
            if (command === "up")    pos.y--;
            
            this.state.currentStep++;
            this.updateSpritePosition();
            this.updateHighlight();
            
            if (this.state.currentStep === this.state.commands.length) {
                this.startLevelCompleteSequence();
            }
        },

        onIncorrectMove() {
            this.state.isAnimating = true;
            const sprite = this.elements.sprite;
            sprite.classList.add('sprite-shake');
            sprite.addEventListener('animationend', () => {
                sprite.classList.remove('sprite-shake');
                this.state.isAnimating = false;
            }, { once: true });
        },

        /**
         * Updates the sprite's pixel position on the screen
         */
        updateSpritePosition() {
            const { spritePos, gridCellSize } = this.state;
            const { sprite } = this.elements;
            const spriteSize = gridCellSize * 0.7;
            const offset = (gridCellSize - spriteSize) / 2; // To center the sprite in the cell

            sprite.style.top = `${spritePos.y * gridCellSize + offset}px`;
            sprite.style.left = `${spritePos.x * gridCellSize + offset}px`;
        },

        /**
         * Highlights the current line of code
         */
        updateHighlight() {
            const codeLines = this.elements.codeBlock.children;
            for (let i = 0; i < codeLines.length; i++) {
                codeLines[i].classList.toggle('active-line', i === this.state.currentStep);
            }
        },
        
        /**
         * Runs the victory animation and shows the menu
         */
        startLevelCompleteSequence() {
            this.state.isAnimating = true;
            const { sprite, gridContainer } = this.elements;
            const { spritePos } = this.state;
            
            const targetCell = gridContainer.querySelector(`#cell-${spritePos.x}-${spritePos.y}`);
            
            sprite.className = 'sprite sprite-celebrate'; // Use className to override other animations
            if (targetCell) targetCell.classList.add('tile-flash');

            setTimeout(() => {
                this.elements.levelCompleteMenu.classList.add('visible');
                sprite.className = 'sprite'; // Reset class after animation
                if (targetCell) targetCell.classList.remove('tile-flash');
            }, 1200);
        },

        /**
         * Sets up all event listeners
         */
        setupEventListeners() {
            window.addEventListener('keydown', this.handleKeyPress.bind(this));
            window.addEventListener('resize', this.handleResize.bind(this));
            this.elements.resetBtn.addEventListener('click', this.resetLevel.bind(this));
            this.elements.replayBtn.addEventListener('click', this.resetLevel.bind(this));
            this.elements.nextLevelBtn.addEventListener('click', () => {
                alert("More levels coming soon!");
                this.resetLevel();
            });
        }
    };

    // --- START THE GAME ---
    game.init();

});