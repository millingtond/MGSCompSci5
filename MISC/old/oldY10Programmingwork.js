'use strict';
// Encapsulate everything in an IIFE to avoid global pollution
(function() {
    // --- XP AND BADGES CONFIGURATION ---
    const XP_VALUES = {
        '1': 10,  // Section 1 tasks - 10 XP each
        '2': 15,  // Section 2 tasks - 15 XP each
        '3': 20,  // Section 3 tasks - 20 XP each
        '4': 25,  // Section 4 tasks - 25 XP each
        '5': 30,  // Section 5 tasks - 30 XP each
        '6': 50,  // Section 6 challenges - 50 XP each
        'theory': 5 // XP for a correct theory question
    };
    
    const BADGES = [
        { name: 'Beginner', xpRequired: 0, icon: '🌱' },
        { name: 'Novice', xpRequired: 100, icon: '🌿' },
        { name: 'Apprentice', xpRequired: 250, icon: '🌳' },
        { name: 'Coder', xpRequired: 500, icon: '💻' },
        { name: 'Developer', xpRequired: 750, icon: '🚀' },
        { name: 'Expert', xpRequired: 1000, icon: '⭐' },
        { name: 'Master', xpRequired: 1250, icon: '🏆' },
        { name: 'Legend', xpRequired: 1500, icon: '👑' }
    ];
    
    const SECTION_COMPLETION_BONUS = {
        1: 50,
        2: 75,
        3: 100,
        4: 125,
        5: 150,
        6: 200
    };
    
    // --- DATA: Programming Tasks ---
    const TASKS = {
        // SECTION 1
        '1-1': {
            section: 1,
            title: 'Hello, World!',
            instructions: '<h3>Task: Print a Message</h3><p>The first step in any programming journey is to print "Hello, World!".</p><p>Write a single line of Python code that displays the exact text <code>Hello, World!</code> on the screen.</p>',
            exampleOutput: 'Hello, World!',
            starterCode: '# Write your code here',
            hints: ['You will need to use the print() function.', 'The text you want to print should be inside the parentheses and enclosed in quote marks (e.g. "text").'],
            testCases: [{ inputs: [], expectedOutput: 'Hello, World!\n' }],
            theoryQuestions: [
                { 
                    type: 'multiple-choice', 
                    q: 'What is the data type of "Hello, World!"?', 
                    options: ['Integer', 'String', 'Boolean', 'Float'], 
                    a: 1, 
                    explanation: 'A String is a sequence of characters enclosed in quotation marks.' 
                },
                { 
                    type: 'short-answer', 
                    q: 'Which programming construct is demonstrated by a program that runs a single line of code from top to bottom?', 
                    a: 'Sequence', 
                    variations: ['sequential', 'sequencing', 'sequential execution'],
                    explanation: 'Sequence means the instructions are executed in the order they are written, one after another.' 
                }
            ]
        },
        '1-2': {
            section: 1,
            title: 'Personal Greeting',
            instructions: '<h3>Task: Get User Input</h3><p>Write a program that asks the user for their name and then prints a personalised greeting.</p><p><strong>Note:</strong> The input prompt can be anything you like. The output must be exactly: <code>Hello, [name]</code></p>',
            exampleOutput: 'Hello, Alice',
            starterCode: '# Get the user\'s name\n# Print a greeting',
            hints: ['Store the result of the input() function in a variable.', 'Use the + operator to join the string "Hello, " with the user\'s name.', 'The exact input prompt doesn\'t matter for testing - use whatever feels natural!'],
            testCases: [{ inputs: ['Alice'], expectedOutput: 'Hello, Alice\n' }],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'What is the purpose of a variable in a program like this?', 
                    keywords: ['store', 'data', 'value', 'memory', 'hold', 'save', 'keep'],
                    minLength: 30,
                    a: 'To store data', 
                    explanation: 'A variable stores a piece of data (like the user\'s name) in memory so it can be referred to and used later in the program.' 
                },
                { 
                    type: 'fill-in-the-blank', 
                    q: 'The + operator, when used to join strings, is called ____.', 
                    a: 'concatenation',
                    variations: ['concat', 'concatenating', 'string concatenation'],
                    explanation: 'Concatenation is the process of joining strings end-to-end.' 
                }
            ]
        },
        '1-3': {
            section: 1,
            title: 'Storing Numbers',
            instructions: '<h3>Task: Variables and Types</h3><p>Write a program that:</p><ol><li>Asks the user for their age</li><li>Converts the input into an integer</li><li>Calculates what their age will be in 10 years</li><li>Prints exactly: <code>In 10 years, you will be [age] years old.</code></li></ol>',
            exampleOutput: 'In 10 years, you will be 25 years old.',
            starterCode: '# Get age from user\n# Convert to integer and calculate future age\n# Print the result',
            hints: ['The input() function returns a string. You must convert it to a number using int().', 'Create a new variable for the future age, e.g., future_age = age + 10.', 'To print numbers and strings together, you might need to convert the number back to a string using str().'],
            testCases: [{ inputs: ['15'], expectedOutput: 'In 10 years, you will be 25 years old.\n' }],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'The program uses int() to convert the user\'s input. Explain what this function does and why it is necessary.', 
                    keywords: ['convert', 'integer', 'string', 'input', 'number', 'calculation', 'type', 'change'],
                    minLength: 60,
                    a: 'It converts a value to an Integer.', 
                    explanation: 'The int() function converts a value into an Integer data type. It is necessary because the input() function always returns a String, and you cannot perform mathematical calculations on a string.' 
                },
                { 
                    type: 'multiple-choice', 
                    q: 'What type of error would occur if you tried to perform `age + 10` before converting `age` to an integer?', 
                    options: ['SyntaxError', 'ValueError', 'TypeError', 'NameError'], 
                    a: 2, 
                    explanation: 'A TypeError occurs when an operation is performed on an object of an inappropriate type, like adding a string to an integer.' 
                }
            ]
        },
        '1-4': {
            section: 1,
            title: 'Simple Area Calculator',
            instructions: '<h3>Task: Rectangle Area</h3><p>Write a program that calculates the area of a rectangle.</p><ol><li>Ask the user for the width</li><li>Ask the user for the height</li><li>Calculate the area (width × height)</li><li>Print exactly: <code>The area is: [area]</code></li></ol>',
            exampleOutput: 'The area is: 50',
            starterCode: '# Get width and height from the user\n# Calculate and print the area',
            hints: ['You will need two input() calls.', 'Remember to convert both inputs to numbers (int or float) before multiplying them.'],
            testCases: [{ inputs: ['5', '10'], expectedOutput: 'The area is: 50\n' }],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'In this program, name one variable you created and explain what value it stores.', 
                    keywords: ['width', 'height', 'area', 'store', 'value', 'number', 'input', 'calculate'],
                    minLength: 40,
                    a: 'Variables store width, height, or area values', 
                    explanation: 'Variables like width and height store the user\'s input values, while area stores the calculated result.' 
                }
            ]
        },
        '1-5': {
            section: 1,
            title: 'Working with Floats',
            instructions: '<h3>Task: Tip Calculator</h3><p>Write a program to calculate a 15% tip on a restaurant bill.</p><ol><li>Ask the user for the total bill amount</li><li>Convert the input to a float</li><li>Calculate the tip (bill × 0.15)</li><li>Print exactly: <code>The tip is: [amount]</code></li></ol>',
            exampleOutput: 'The tip is: 7.5',
            starterCode: '# Get bill amount and calculate 15% tip',
            hints: ['Use float() to handle decimal numbers.', 'To calculate 15%, you multiply by 0.15.'],
            testCases: [{ inputs: ['50.00'], expectedOutput: 'The tip is: 7.5\n' }],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'What is the difference between an Integer and a Real (float) data type?', 
                    keywords: ['whole', 'decimal', 'point', 'fraction', 'number', 'integer', 'float'],
                    minLength: 50,
                    a: 'An integer is a whole number, while a float is a number with a decimal point.', 
                    explanation: 'Integers are for whole numbers (e.g., 10, -5), while Floats are for numbers with fractional parts (e.g., 7.5, -3.14).' 
                }
            ]
        },
        '1-6': {
            section: 1,
            title: 'Integer Division (//)',
            instructions: '<h3>Task: Sharing Sweets</h3><p>You have 50 sweets to share equally among 7 children.</p><p>Using integer division (<code>//</code>), calculate how many whole sweets each child receives. Print only the number.</p>',
            exampleOutput: '7',
            starterCode: 'sweets = 50\nchildren = 7\n# Calculate how many sweets each child gets',
            hints: ['Standard division / gives a float (e.g., 7.14).', 'Integer division // gives only the whole number part of the division.'],
            testCases: [{ inputs: [], expectedOutput: '7\n' }],
            theoryQuestions: [
                { 
                    type: 'fill-in-the-blank', 
                    q: 'The `//` operator performs ___ division.', 
                    a: 'integer',
                    variations: ['floor', 'whole number', 'int', 'whole'],
                    explanation: 'It divides and then rounds down to the nearest whole number, discarding the remainder.' 
                }
            ]
        },
        '1-7': {
            section: 1,
            title: 'Modulus Operator (%)',
            instructions: '<h3>Task: Leftover Sweets</h3><p>Following on from the previous task, you have 50 sweets and 7 children.</p><p>Using the modulus operator (<code>%</code>), calculate how many sweets are left over after sharing them equally. Print only the number.</p>',
            exampleOutput: '1',
            starterCode: 'sweets = 50\nchildren = 7\n# Calculate the remaining sweets',
            hints: ['The modulus operator % gives the remainder of a division.', 'For example, 10 % 3 is 1.'],
            testCases: [{ inputs: [], expectedOutput: '1\n' }],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'What is the result of `10 % 4`?', 
                    a: '2',
                    variations: ['two', '2.0'],
                    explanation: '10 divided by 4 is 2 with a remainder of 2. The modulus operator returns the remainder.' 
                }
            ]
        },
        '1-8': {
            section: 1,
            title: 'Exponentiation (**)',
            instructions: '<h3>Task: Squared and Cubed</h3><p>Ask the user for a number. Then calculate and print:</p><ol><li><code>[number] squared is [result]</code></li><li><code>[number] cubed is [result]</code></li></ol>',
            exampleOutput: '4 squared is 16\n4 cubed is 64',
            starterCode: '# Get a number from the user\n# Calculate and print the square and cube',
            hints: ['The operator for exponentiation (raising to a power) is **.', 'number ** 2 is the square. number ** 3 is the cube.'],
            testCases: [{ inputs: ['4'], expectedOutput: '4 squared is 16\n4 cubed is 64\n' }],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'What arithmetic operator is used for exponentiation (raising a number to a power)?', 
                    a: '**',
                    variations: ['double asterisk', 'two asterisks', '* *', 'star star'],
                    explanation: 'The double asterisk `**` is used to raise the number on the left to the power of the number on the right.' 
                }
            ]
        },
        '1-9': {
            section: 1,
            title: 'Mad Libs Story',
            instructions: '<h3>Task: Build a Story</h3><p>Create a simple story generator. Ask the user for:</p><ul><li>A person\'s name</li><li>A verb (action word)</li><li>An adjective (describing word)</li><li>A noun (thing)</li></ul><p>Then print exactly: <code>[Name] decided to [verb] the [adjective] [noun].</code></p>',
            exampleOutput: 'Ada decided to code the giant computer.',
            starterCode: '# Get 4 inputs from the user\n\n# Print the final story sentence',
            hints: ['You will need four variables to store the user\'s inputs.', 'Use string concatenation (+) to join the words and form the final sentence.'],
            testCases: [{ inputs: ['Ada', 'code', 'giant', 'computer'], expectedOutput: 'Ada decided to code the giant computer.\n' }],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'Explain how variables help make this Mad Libs program work.', 
                    keywords: ['store', 'input', 'user', 'change', 'different', 'reuse', 'value'],
                    minLength: 50,
                    a: 'Variables store user input that can change each time.', 
                    explanation: 'Variables store the user\'s input words, allowing the program to create different stories each time it runs by inserting these variable values into the sentence template.' 
                }
            ]
        },
        '1-10': {
            section: 1,
            title: 'Section 1 Challenge',
            instructions: '<h3>Task: Journey Calculator</h3><p>Write a program that calculates the cost of a car journey.</p><ol><li>Ask for the journey distance in miles (can be decimal)</li><li>Ask for the car\'s fuel efficiency in miles per gallon (MPG)</li><li>Ask for the price of fuel per litre</li><li>Calculate and print exactly: <code>Total cost: [amount]</code></li></ol><h3>Hints:</h3><ul><li>1 gallon = 4.546 litres</li><li>Gallons needed = distance ÷ MPG</li><li>Litres needed = gallons × 4.546</li><li>Total cost = litres × price per litre</li></ul>',
            exampleOutput: 'Total cost: 13.638',
            starterCode: '# This is a multi-step calculation.\n# Break the problem down!',
            hints: ['Create a variable for each step of the calculation to keep your code clear.', 'The final output will likely be a float with many decimal places. That is okay for this task.'],
            testCases: [{ inputs: ['100', '50', '1.50'], expectedOutput: 'Total cost: 13.638\n' }],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'Why is it good practice to use named constants (like GALLONS_TO_LITRES) instead of just typing the number directly in calculations?', 
                    keywords: ['readable', 'change', 'maintain', 'understand', 'update', 'clear', 'meaning'],
                    minLength: 60,
                    a: 'Constants make code more readable and maintainable.', 
                    explanation: 'Using named constants makes the code more readable (you know what the number represents) and easier to maintain (if the value changes, you only update it in one place).' 
                }
            ]
        },
        '1-11': {
            section: 1,
            title: 'Temperature Converter',
            instructions: '<h3>Task: Celsius to Fahrenheit</h3><p>Ask the user for a temperature in Celsius and convert it to Fahrenheit.</p><p>The formula is: <code>Fahrenheit = (Celsius * 9/5) + 32</code>.</p><p>Print only the final temperature in Fahrenheit.</p>',
            exampleOutput: '68.0',
            starterCode: '# Ask for a temperature in Celsius\n# Convert it to a float\n# Calculate Fahrenheit\n# Print the result',
            hints: ['Remember that `input()` gives you a string, so you\'ll need to convert it to a number using `float()`.', 'The fraction 9/5 can also be written as 1.8.'],
            testCases: [{ inputs: ['20'], expectedOutput: '68.0\n' }, { inputs: ['0'], expectedOutput: '32.0\n' }],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'In the formula `(Celsius * 9/5) + 32`, which part is calculated first according to the order of operations?', 
                    a: 'The multiplication (Celsius * 9/5).',
                    variations: ['celsius * 9/5', 'multiplication', 'multiply', 'the multiplication'],
                    explanation: 'Order of operations dictates that Multiplication and Division are performed before Addition and Subtraction.' 
                }
            ]
        },
        '1-12': {
            section: 1,
            title: 'String Repetition',
            instructions: '<h3>Task: Repeat a Word</h3><p>Ask the user for a short word and a number.</p><p>Print the word repeated that many times, with no spaces in between.</p>',
            exampleOutput: 'PythonPythonPython',
            starterCode: '# Ask the user for a word\n# Ask the user for a number\n# Repeat the word and print it',
            hints: ['In Python, you can use the `*` operator to repeat a string.', 'Make sure to convert the number from the user into an integer using `int()` before you use it.'],
            testCases: [{ inputs: ['Python', '3'], expectedOutput: 'PythonPythonPython\n' }],
            theoryQuestions: [
                { 
                    type: 'multiple-choice', 
                    q: 'What is the `*` operator doing in this task?', 
                    options: ['Multiplication', 'Exponentiation', 'Repetition', 'Comparison'], 
                    a: 2, 
                    explanation: 'When used with a string and an integer, the `*` operator performs string repetition.' 
                }
            ]
        },
        '1-13': {
            section: 1,
            title: 'Circle Calculations',
            instructions: '<h3>Task: Area and Circumference</h3><p>Ask the user for the radius of a circle.</p><p>Calculate and print both the area and the circumference of the circle, each on a new line. Use `3.14159` as the value for π.</p><p>Print exactly:<br><code>Area: [result]</code><br><code>Circumference: [result]</code></p>',
            exampleOutput: 'Area: 78.53975\nCircumference: 31.4159',
            starterCode: 'pi = 3.14159\n# Ask for the radius\n# Calculate the area (pi * r^2)\n# Calculate the circumference (2 * pi * r)\n# Print both results',
            hints: ['The formula for the area of a circle is πr².', 'The formula for the circumference is 2πr.', 'Use the `**` operator for exponents (radius squared).'],
            testCases: [{ inputs: ['5'], expectedOutput: 'Area: 78.53975\nCircumference: 31.4159\n' }],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'Why should the value of pi be stored as a constant rather than a regular variable?', 
                    keywords: ['change', 'fixed', 'constant', 'same', 'mathematical', 'value', 'modify'],
                    minLength: 40,
                    a: 'Pi never changes - it\'s a fixed mathematical value.', 
                    explanation: 'The value of Pi is a mathematical constant that never changes, so it should be defined as a constant to prevent accidental modification.' 
                }
            ]
        },
        '1-14': {
            section: 1,
            title: 'Daily Routine',
            instructions: '<h3>Task: Multi-line Printing</h3><p>Using a single `print()` statement, display a three-line daily routine.</p><p>The output should be exactly:</p><p><code>Morning: Wake up and code.</code><br><code>Afternoon: Learn new things.</code><br><code>Evening: Rest and reflect.</code></p>',
            exampleOutput: 'Morning: Wake up and code.\nAfternoon: Learn new things.\nEvening: Rest and reflect.',
            starterCode: '# Use a single print statement and triple quotes to print the routine.',
            hints: ['You can create a string that spans multiple lines by enclosing it in triple quotes (`"""` or `\'\'\'`).', 'The newlines inside the triple-quoted string will be preserved when printed.'],
            testCases: [{ inputs: [], expectedOutput: 'Morning: Wake up and code.\nAfternoon: Learn new things.\nEvening: Rest and reflect.\n' }],
            theoryQuestions: [
                { 
                    type: 'fill-in-the-blank', 
                    q: 'To create a multi-line string in Python, you can enclose the text in ___ quotes.', 
                    a: 'triple',
                    variations: ['3', 'three', 'tripple'],
                    explanation: 'Triple quotes (either """ or \'\'\') allow a string to span multiple lines.' 
                }
            ]
        },
        '1-15': {
            section: 1,
            title: 'Simple Receipt',
            instructions: '<h3>Task: Calculate a Total</h3><p>Ask the user for the price of three separate items.</p><p>Calculate the total cost and print a simple receipt with the price of each item and the total.</p><p>Print exactly:<br><code>Item 1: £[price1]</code><br><code>Item 2: £[price2]</code><br><code>Item 3: £[price3]</code><br><code>Total: £[total]</code></p>',
            exampleOutput: 'Item 1: £10.5\nItem 2: £5.0\nItem 3: £2.25\nTotal: £17.75',
            starterCode: '# Ask for the price of three items\n# Convert them to floats\n# Calculate the total\n# Print the receipt',
            hints: ['You will need three separate `input()` calls.', 'Remember to use `float()` to convert the prices to numbers you can do maths with.', 'Create a variable to store the sum of the three prices.'],
            testCases: [{ inputs: ['10.50', '5.00', '2.25'], expectedOutput: 'Item 1: £10.5\nItem 2: £5.0\nItem 3: £2.25\nTotal: £17.75\n' }],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'Why is it better to use the `float()` function instead of `int()` for the prices in this task?', 
                    keywords: ['decimal', 'pence', 'cents', 'money', 'currency', 'precise', 'point'],
                    minLength: 40,
                    a: 'Because prices often include decimal points (pence).', 
                    explanation: 'The `float` data type can store decimal values, which is necessary for currency. Using `int()` would cause an error or lose the decimal part of the price.' 
                }
            ]
        },
        // SECTION 2
        '2-1': {
            section: 2,
            title: 'Positive or Negative',
            instructions: '<h3>Task: Number Check</h3><p>Ask the user to enter a number. Print exactly:</p><ul><li><code>Positive</code> if the number is greater than 0</li><li><code>Negative</code> if less than 0</li><li><code>Zero</code> if exactly 0</li></ul>',
            exampleOutput: 'Positive',
            starterCode: '# Get a number from the user\n# Use if/elif/else to check the number',
            hints: ['You will need an if for the first condition, an elif for the second, and an else for the final case.', 'The condition for checking equality is ==.'],
            testCases: [
                { inputs: ['10'], expectedOutput: 'Positive\n' },
                { inputs: ['-5'], expectedOutput: 'Negative\n' },
                { inputs: ['0'], expectedOutput: 'Zero\n' }
            ],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'What is the name of the programming construct used to make decisions in this code?', 
                    a: 'Selection',
                    variations: ['if statement', 'conditional', 'decision', 'branching', 'if'],
                    explanation: 'Selection (e.g., IF...ELIF...ELSE) allows the program to choose a path to execute based on a condition.' 
                },
                { 
                    type: 'short-answer', 
                    q: 'Explain the difference between = and == in Python.', 
                    keywords: ['assign', 'compare', 'value', 'check', 'equal', 'give', 'test', 'set'],
                    minLength: 60,
                    a: 'Assignment (=) gives a variable a value. Comparison (==) checks if two values are equal.', 
                    explanation: 'The assignment operator (=) is used to assign a value to a variable (e.g., x = 5). The comparison operator (==) is used to check if two values are equal, and it evaluates to a Boolean (True or False).' 
                }
            ]
        },
        '2-2': {
            section: 2,
            title: 'Age Check',
            instructions: '<h3>Task: Are you old enough?</h3><p>A rollercoaster has an age restriction: you must be 12 or older to ride.</p><p>Ask for the user\'s age and print exactly:</p><ul><li><code>Access granted</code> if 12 or older</li><li><code>Access denied</code> if under 12</li></ul>',
            exampleOutput: 'Access granted',
            starterCode: '# Get age and check if 12 or older',
            hints: ['The condition is "age is greater than or equal to 12".', 'The operator for "greater than or equal to" is >=.'],
            testCases: [
                { inputs: ['15'], expectedOutput: 'Access granted\n' },
                { inputs: ['12'], expectedOutput: 'Access granted\n' },
                { inputs: ['11'], expectedOutput: 'Access denied\n' }
            ],
            theoryQuestions: [
                { 
                    type: 'fill-in-the-blank', 
                    q: 'The `>=` operator checks if a value is greater than ___ equal to another value.', 
                    a: 'or',
                    variations: ['OR'],
                    explanation: '`>=` means "greater than OR equal to".'
                },
                { 
                    type: 'multiple-choice', 
                    q: 'For this task, the age 12 is an example of what kind of test data?', 
                    options: ['Normal', 'Boundary', 'Invalid', 'Erroneous'], 
                    a: 1, 
                    explanation: 'Boundary data is a value at the very edge of a condition, used to check that the logic is correct at the exact point where behavior should change.' 
                }
            ]
        },
        '2-3': {
            section: 2,
            title: 'Simple Password',
            instructions: '<h3>Task: Password Checker</h3><p>Write a program that asks for a password. The correct password is "secret123".</p><p>Print exactly:</p><ul><li><code>Welcome</code> if correct</li><li><code>Wrong password</code> if incorrect</li></ul>',
            exampleOutput: 'Welcome',
            starterCode: 'password = "secret123"\n\n# Get user input and check password',
            hints: ['You are comparing two strings for equality.', 'The == operator works for strings as well as numbers.'],
            testCases: [
                { inputs: ['secret123'], expectedOutput: 'Welcome\n' },
                { inputs: ['password'], expectedOutput: 'Wrong password\n' }
            ],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'Why is it important to use == instead of = when comparing the password?', 
                    keywords: ['compare', 'assign', 'check', 'test', 'equal', 'value'],
                    minLength: 40,
                    a: '== compares values, = assigns values', 
                    explanation: 'Using = would assign "secret123" to the variable instead of checking if they are equal. == is the comparison operator that tests equality.' 
                }
            ]
        },
        '2-4': {
            section: 2,
            title: 'Even or Odd',
            instructions: '<h3>Task: Even or Odd Checker</h3><p>Ask the user for a whole number and determine if it is even or odd.</p><p>Print exactly <code>Even</code> or <code>Odd</code></p><p><strong>Hint:</strong> An even number has no remainder when divided by 2.</p>',
            exampleOutput: 'Even',
            starterCode: '# Get a number and check if even or odd',
            hints: ['If number % 2 is equal to 0, the number is even.', 'Otherwise, the number is odd.'],
            testCases: [
                { inputs: ['10'], expectedOutput: 'Even\n' },
                { inputs: ['7'], expectedOutput: 'Odd\n' }
            ],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'Give an example of invalid test data for this program and explain why it would cause an error.', 
                    keywords: ['string', 'text', 'letter', 'float', 'decimal', 'error', 'int', 'type'],
                    minLength: 50,
                    a: 'A string like "hello" or a float like "7.5".', 
                    explanation: 'The program expects a whole number (integer). Entering text or a decimal would cause a ValueError when `int()` tries to convert it.' 
                }
            ]
        },
        '2-5': {
            section: 2,
            title: 'Grading Program',
            instructions: '<h3>Task: Assign a Grade</h3><p>Write a program that takes a test score (0-100) and prints the grade:</p><ul><li>Over 80: <code>A</code></li><li>Over 60: <code>B</code></li><li>Over 40: <code>C</code></li><li>40 or below: <code>Fail</code></li></ul>',
            exampleOutput: 'A',
            starterCode: '# Get score and assign grade',
            hints: ['Use an if/elif/elif/else structure.', 'The order of your checks is important. Start by checking for the highest grade first.'],
            testCases: [
                { inputs: ['95'], expectedOutput: 'A\n' },
                { inputs: ['72'], expectedOutput: 'B\n' },
                { inputs: ['50'], expectedOutput: 'C\n' },
                { inputs: ['30'], expectedOutput: 'Fail\n' }
            ],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'Why is the order of the `if`/`elif` statements important in this task?', 
                    keywords: ['overlap', 'check', 'first', 'order', 'condition', 'match'],
                    minLength: 50,
                    a: 'Because the conditions overlap.', 
                    explanation: 'If you checked `score > 40` first, a score of 95 would be graded as a C. By checking for the highest grade (`> 80`) first, you ensure each score gets the correct grade.' 
                }
            ]
        },
        '2-6': {
            section: 2,
            title: 'Boolean Operator: AND',
            instructions: '<h3>Task: VIP Lounge Access</h3><p>To enter a VIP lounge, a person must be over 18 AND have a VIP pass.</p><p>Ask for:</p><ol><li>Their age</li><li>If they have a pass (yes/no)</li></ol><p>Print <code>Access granted</code> or <code>Access denied</code></p>',
            exampleOutput: 'Access granted',
            starterCode: '# Get age and VIP pass status\n# Check BOTH conditions',
            hints: ['Your if statement will need two conditions joined by the and keyword.', 'The condition will look something like: if age > 18 and has_pass == "yes":'],
            testCases: [
                { inputs: ['25', 'yes'], expectedOutput: 'Access granted\n' },
                { inputs: ['25', 'no'], expectedOutput: 'Access denied\n' },
                { inputs: ['17', 'yes'], expectedOutput: 'Access denied\n' }
            ],
            theoryQuestions: [
                { 
                    type: 'multiple-choice', 
                    q: 'For the AND operator to result in a True outcome, how many of the conditions must be true?', 
                    options: ['At least one', 'Exactly one', 'Both'], 
                    a: 2, 
                    explanation: 'The AND operator requires all conditions connected by it to be true for the entire expression to be true.' 
                },
                { 
                    type: 'short-answer', 
                    q: 'If a user is 25 but enters "no" for the pass, which part of the `if` statement causes the "Access denied" message?', 
                    keywords: ['pass', 'false', 'condition', 'second', 'no'],
                    minLength: 40,
                    a: 'The `has_pass == "yes"` part.', 
                    explanation: 'Even though the age condition (`age > 18`) is true, the pass condition is false. Since AND requires both to be true, the entire condition is false, and the program executes the `else` block.' 
                }
            ]
        },
        '2-7': {
            section: 2,
            title: 'Boolean Operator: OR',
            instructions: '<h3>Task: Weekend or Weekday</h3><p>Ask the user for the day of the week.</p><p>Print exactly:</p><ul><li><code>It\'s the weekend!</code> for Saturday or Sunday</li><li><code>It\'s a weekday.</code> for any other day</li></ul>',
            exampleOutput: 'It\'s the weekend!',
            starterCode: '# Get day and check if weekend',
            hints: ['Your if statement will need two conditions joined by the or keyword.', 'The condition will look like: if day == "Saturday" or day == "Sunday":'],
            testCases: [
                { inputs: ['Sunday'], expectedOutput: 'It\'s the weekend!\n' },
                { inputs: ['Monday'], expectedOutput: 'It\'s a weekday.\n' }
            ],
            theoryQuestions: [
                { 
                    type: 'multiple-choice', 
                    q: 'For the OR operator to result in a True outcome, how many of the conditions must be true?', 
                    options: ['At least one', 'Exactly one', 'Both'], 
                    a: 0, 
                    explanation: 'The OR operator only requires one of the conditions connected by it to be true for the entire expression to be true.' 
                }
            ]
        },
        '2-8': {
            section: 2,
            title: 'Boolean Operator: NOT',
            instructions: '<h3>Task: Not a Vowel</h3><p>Ask the user to enter a single lowercase letter.</p><p>Print exactly:</p><ul><li><code>Consonant</code> if NOT a vowel (a, e, i, o, u)</li><li><code>Vowel</code> if it is a vowel</li></ul>',
            exampleOutput: 'Consonant',
            starterCode: '# Get letter and check if NOT a vowel',
            hints: ['One way to do this is to check if the letter is not in the group of vowels.', 'A complex condition could be: if letter != "a" and letter != "e" and ...'],
            testCases: [
                { inputs: ['b'], expectedOutput: 'Consonant\n' },
                { inputs: ['e'], expectedOutput: 'Vowel\n' }
            ],
            theoryQuestions: [
                { 
                    type: 'fill-in-the-blank', 
                    q: 'The `NOT` operator ___ a boolean value.', 
                    a: 'inverts',
                    variations: ['reverses', 'flips', 'negates', 'changes'],
                    explanation: '`NOT True` becomes `False`, and `NOT False` becomes `True`.' 
                }
            ]
        },
        '2-9': {
            section: 2,
            title: 'Nested Selection',
            instructions: '<h3>Task: Cinema Tickets</h3><p>Cinema pricing rules:</p><ul><li>Standard ticket: £10</li><li>Wednesday: £2 off</li><li>Students get additional £1 off</li></ul><p>Ask for:</p><ol><li>Day of the week</li><li>Student status (yes/no)</li></ol><p>Print exactly: <code>Price: [amount]</code></p>',
            exampleOutput: 'Price: 7',
            starterCode: '# Get day and student status\n# Calculate price with discounts',
            hints: ['Start with a base price, e.g., price = 10.', 'Use an if statement to check the day. Inside that, you can use another if statement to check for student status. This is called nesting.'],
            testCases: [
                { inputs: ['Monday', 'no'], expectedOutput: 'Price: 10\n' },
                { inputs: ['Wednesday', 'no'], expectedOutput: 'Price: 8\n' },
                { inputs: ['Wednesday', 'yes'], expectedOutput: 'Price: 7\n' }
            ],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'What is nested selection?', 
                    a: 'An IF statement inside another IF statement.',
                    variations: ['if inside if', 'if within if', 'selection inside selection'],
                    explanation: 'Nesting allows for more complex decision-making, where a second condition is only checked if a first condition is met.' 
                }
            ]
        },
        '2-10': {
            section: 2,
            title: 'Section 2 Challenge',
            instructions: '<h3>Task: Leap Year Calculator</h3><p>A year is a leap year if:</p><ul><li>Divisible by 4 AND not divisible by 100</li><li>OR divisible by 400</li></ul><p>Ask for a year and print exactly <code>Leap year</code> or <code>Not a leap year</code></p>',
            exampleOutput: 'Leap year',
            starterCode: '# Get year and check if it\'s a leap year',
            hints: ['You can use the modulus operator % to check for divisibility.', 'The logic is complex. Try to write it as one large if condition using and, or, and parentheses () to group the logic correctly.'],
            testCases: [
                { inputs: ['2024'], expectedOutput: 'Leap year\n' },
                { inputs: ['2023'], expectedOutput: 'Not a leap year\n' },
                { inputs: ['1900'], expectedOutput: 'Not a leap year\n' },
                { inputs: ['2000'], expectedOutput: 'Leap year\n' }
            ],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'What is the purpose of the parentheses `()` when writing a complex boolean expression like in this task?', 
                    keywords: ['order', 'group', 'operations', 'control', 'evaluate', 'priority'],
                    minLength: 40,
                    a: 'To control the order of operations.', 
                    explanation: 'Parentheses group conditions together, ensuring that the logic within them is evaluated first, just like in mathematics.' 
                }
            ]
        },
        '2-11': {
            section: 2,
            title: 'Ticket Prices',
            instructions: '<h3>Task: Cinema Ticket Prices</h3><p>Ask the user for their age and display the correct ticket price based on these rules:</p><ul><li>Age 4 or under: <code>Free</code></li><li>Age 5 to 16: <code>£8</code></li><li>Age 17 to 60: <code>£12</code></li><li>Age over 60: <code>£10</code></li></ul><p>Print the price exactly like: <code>Price: [price]</code></p>',
            exampleOutput: 'Price: £8',
            starterCode: '# Ask the user for their age\n# Use an if-elif-else chain to determine the price\n# Print the final price',
            hints: ['Start by checking for the youngest age group (`age <= 4`).', 'Use `elif` for the next conditions.', 'Make sure the last condition (`else`) handles everyone over 60.'],
            testCases: [
                { inputs: ['4'], expectedOutput: 'Price: Free\n' },
                { inputs: ['10'], expectedOutput: 'Price: £8\n' },
                { inputs: ['30'], expectedOutput: 'Price: £12\n' },
                { inputs: ['65'], expectedOutput: 'Price: £10\n' }
            ]
        },
        '2-12': {
            section: 2,
            title: 'Simple Login with Two-Factor',
            instructions: '<h3>Task: Two-Step Login</h3><p>Create a simple login system. First, ask for a username and password.</p><p>If the username is <code>admin</code> AND the password is <code>password123</code>, then ask for a secret pin.</p><p>If the pin is <code>9876</code>, print <code>Access granted</code>. If the pin is wrong, print <code>Incorrect pin.</code>. If the username/password are wrong, print <code>Incorrect username or password.</code></p>',
            exampleOutput: 'Access granted',
            starterCode: '# Ask for username and password\n# If they are correct...\n    # ...then ask for the pin and check it\n# Otherwise...\n    # ...print an error message',
            hints: ['This requires a nested `if` statement.', 'The first `if` checks the username and password. The second `if`, inside the first one, checks the pin.'],
            testCases: [
                { inputs: ['admin', 'password123', '9876'], expectedOutput: 'Access granted\n' },
                { inputs: ['admin', 'password123', '1111'], expectedOutput: 'Incorrect pin.\n' },
                { inputs: ['guest', '12345', ''], expectedOutput: 'Incorrect username or password.\n' }
            ]
        },
        '2-13': {
            section: 2,
            title: 'Character Type Checker',
            instructions: '<h3>Task: What Type of Character?</h3><p>Ask the user to enter a single character. Your program should determine if it is a lowercase letter, an uppercase letter, a number, or another type of symbol.</p><p>Print one of: <code>Lowercase letter</code>, <code>Uppercase letter</code>, <code>Number</code>, or <code>Symbol</code>.</p><p><strong>Note:</strong> You can solve this by comparing characters, for example: <code>if char >= \'a\' and char <= \'z\':</code></p>',
            exampleOutput: 'Lowercase letter',
            starterCode: '# Ask for a single character\n# Use an if-elif-else chain to check its type',
            hints: ['You can compare strings and characters in Python.', 'The condition for an uppercase letter is `char >= "A" and char <= "Z"`.', 'Use `else` at the end to catch anything that isn\'t a letter or number.'],
            testCases: [
                { inputs: ['h'], expectedOutput: 'Lowercase letter\n' },
                { inputs: ['Q'], expectedOutput: 'Uppercase letter\n' },
                { inputs: ['9'], expectedOutput: 'Number\n' },
                { inputs: ['£'], expectedOutput: 'Symbol\n' }
            ]
        },
        '2-14': {
            section: 2,
            title: 'Discount Calculator',
            instructions: '<h3>Task: Apply a Discount</h3><p>Ask the user for their total purchase amount.</p><p>If the amount is over £100, apply a 20% discount. If the amount is over £50 (but not over £100), apply a 10% discount. Otherwise, there is no discount.</p><p>Print the final price exactly like: <code>Final price: £[amount]</code></p>',
            exampleOutput: 'Final price: £96.0',
            starterCode: '# Ask for the purchase amount\n# Calculate the discount\n# Print the final price',
            hints: ['The order of your `if`/`elif` checks is very important. Check for the biggest discount first!', 'To calculate a 20% discount, you can multiply the price by 0.8.', 'To calculate a 10% discount, multiply by 0.9.'],
            testCases: [
                { inputs: ['120'], expectedOutput: 'Final price: £96.0\n' },
                { inputs: ['75'], expectedOutput: 'Final price: £67.5\n' },
                { inputs: ['40'], expectedOutput: 'Final price: £40.0\n' }
            ]
        },
        '2-15': {
            section: 2,
            title: 'Triangle Classifier',
            instructions: '<h3>Task: Classify a Triangle</h3><p>Ask the user for the lengths of the three sides of a triangle.</p><p>Your program should determine if the triangle is <strong>equilateral</strong> (all three sides are equal), <strong>isosceles</strong> (exactly two sides are equal), or <strong>scalene</strong> (no sides are equal).</p><p>Print the classification.</p>',
            exampleOutput: 'Equilateral',
            starterCode: '# Ask for the length of three sides\n# Convert inputs to integers\n# Use selection to classify the triangle',
            hints: ['First, check if all three sides are equal: `side1 == side2 and side2 == side3`.', 'Next, check if any two sides are equal: `side1 == side2 or side2 == side3 or side1 == side3`.', 'If neither of the above is true, it must be scalene.'],
            testCases: [
                { inputs: ['5', '5', '5'], expectedOutput: 'Equilateral\n' },
                { inputs: ['5', '7', '5'], expectedOutput: 'Isosceles\n' },
                { inputs: ['5', '6', '7'], expectedOutput: 'Scalene\n' }
            ]
        },
        // SECTION 3
        '3-1': {
            section: 3,
            title: 'FOR Loop: Counting',
            instructions: '<h3>Task: Count to 10</h3><p>Using a <code>for</code> loop and the <code>range()</code> function, print the numbers from 1 to 10, each on a new line.</p>',
            exampleOutput: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10',
            starterCode: '# Use a for loop to iterate from 1 to 10',
            hints: ['range(1, 11) will generate numbers from 1 up to (but not including) 11.', 'The variable in your loop (e.g., i) will hold the current number on each pass.'],
            testCases: [{ inputs: [], expectedOutput: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n' }],
            theoryQuestions: [
                { 
                    type: 'multiple-choice', 
                    q: 'Is a FOR loop typically used for count-controlled or condition-controlled iteration?', 
                    options: ['Count-controlled', 'Condition-controlled'], 
                    a: 0, 
                    explanation: 'A FOR loop is used when you know in advance how many times you want the loop to run (e.g., a specific number of times, or for every item in a list).' 
                },
                { 
                    type: 'short-answer', 
                    q: 'What would you change in `range(1, 11)` to make the loop count up to and including 50?', 
                    a: 'range(1, 51)',
                    variations: ['range(1,51)', '1, 51', '1 51'],
                    explanation: 'The `range` function stops *before* the second number, so `range(1, 51)` will generate numbers from 1 to 50.' 
                }
            ]
        },
        '3-2': {
            section: 3,
            title: 'FOR Loop: Times Table',
            instructions: '<h3>Task: Times Table</h3><p>Ask the user for a number. Print its times table from 1 to 12.</p><p>First print: <code>Times table for [number]</code></p><p>Then each line: <code>[number] x [i] = [result]</code></p>',
            exampleOutput: 'Times table for 3\n3 x 1 = 3\n3 x 2 = 6\n...',
            starterCode: '# Get a number from the user\n# Print header\n# Use a for loop to print the times table',
            hints: ['Your loop should run from 1 to 12 (range(1, 13)).', 'Inside the loop, calculate result = num * i and then print all the parts.'],
            testCases: [{ inputs: ['3'], expectedOutput: 'Times table for 3\n3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30\n3 x 11 = 33\n3 x 12 = 36\n' }]
        },
        '3-3': {
            section: 3,
            title: 'FOR Loop: Summation',
            instructions: '<h3>Task: Sum of Numbers</h3><p>Using a <code>for</code> loop, calculate the sum of all numbers from 1 to 100 inclusive. Print only the final total.</p>',
            exampleOutput: '5050',
            starterCode: 'total = 0\n# Loop from 1 to 100\n    # Add the current number to the total\n\n# Print the final total',
            hints: ['Create a variable called total and set it to 0 before the loop starts.', 'Inside the loop, use total = total + i to accumulate the sum.'],
            testCases: [{ inputs: [], expectedOutput: '5050\n' }]
        },
        '3-4': {
            section: 3,
            title: 'FOR Loop: Backwards',
            instructions: '<h3>Task: Countdown</h3><p>Use a <code>for</code> loop to print a countdown from 10 to 1, each on a new line.</p><p>After the countdown, print <code>Blast off!</code></p>',
            exampleOutput: '10\n9\n8\n7\n6\n5\n4\n3\n2\n1\nBlast off!',
            starterCode: '# Loop from 10 down to 1\n\n# After the loop, print "Blast off!"',
            hints: ['Try using range(10, 0, -1). This starts at 10, stops before 0, and steps by -1.', 'The final print statement should be outside/after the loop.'],
            testCases: [{ inputs: [], expectedOutput: '10\n9\n8\n7\n6\n5\n4\n3\n2\n1\nBlast off!\n' }]
        },
        '3-5': {
            section: 3,
            title: 'WHILE Loop: Simple',
            instructions: '<h3>Task: Repeating Message</h3><p>Use a <code>while</code> loop to print <code>Are we there yet?</code> exactly 5 times.</p>',
            exampleOutput: 'Are we there yet?\nAre we there yet?\nAre we there yet?\nAre we there yet?\nAre we there yet?',
            starterCode: '# You will need a counter variable',
            hints: ['Create a counter variable and set it to 0 before the loop.', 'The loop condition could be: while counter < 5:', 'Don\'t forget to increase the counter by 1 inside the loop (counter = counter + 1) to avoid an infinite loop!'],
            testCases: [{ inputs: [], expectedOutput: 'Are we there yet?\nAre we there yet?\nAre we there yet?\nAre we there yet?\nAre we there yet?\n' }],
            theoryQuestions: [
                { 
                    type: 'multiple-choice', 
                    q: 'Is a WHILE loop count-controlled or condition-controlled?', 
                    options: ['Count-controlled', 'Condition-controlled'], 
                    a: 1, 
                    explanation: 'A WHILE loop continues to run as long as a certain condition remains true. It is used when you don\'t know how many times the loop will need to execute.' 
                },
                { 
                    type: 'short-answer', 
                    q: 'What would happen if the line `counter = counter + 1` was removed from the loop? What is this type of error called?', 
                    a: 'An infinite loop.',
                    variations: ['infinite loop', 'endless loop', 'loop forever'],
                    explanation: 'The program would get stuck in an infinite loop because the `counter` variable would never increase to 5, so the condition `counter < 5` would always be true. This is a type of logical error.' 
                }
            ]
        },
        '3-6': {
            section: 3,
            title: 'WHILE Loop: User Input',
            instructions: '<h3>Task: Loop Until "quit"</h3><p>Repeatedly ask the user for input and echo it back. Stop when they type "quit".</p><p>Don\'t print the word "quit".</p>',
            exampleOutput: 'hello\nworld',
            starterCode: 'command = ""\n# Create a while loop that continues until command equals "quit"\n    # Get input from user\n    # Check if it\'s not "quit" before printing',
            hints: ['The loop condition is: while command != "quit":', 'Inside the loop, you need to get new input from the user.', 'Add an if statement so you don\'t print the final "quit" command.'],
            testCases: [{ inputs: ['hello', 'world', 'quit'], expectedOutput: 'hello\nworld\n' }]
        },
        '3-7': {
            section: 3,
            title: 'WHILE Loop: Validation',
            instructions: '<h3>Task: Valid Input</h3><p>Ask the user to enter a number between 1 and 10. Keep asking until they enter a valid number.</p><p>Once valid, print <code>Thank you</code></p>',
            exampleOutput: 'Thank you',
            starterCode: 'num = 0\n# Loop while num is not valid',
            hints: ['Initialize your number variable to a value that is not valid (e.g., 0).', 'The while loop condition should check if the number is outside the valid range: while num < 1 or num > 10:'],
            testCases: [{ inputs: ['15', '0', '5'], expectedOutput: 'Thank you\n' }]
        },
        '3-8': {
            section: 3,
            title: 'Looping Through a String',
            instructions: '<h3>Task: Spell It Out</h3><p>Ask the user for their name. Using a <code>for</code> loop, print each letter on a new line.</p>',
            exampleOutput: 'B\ne\nn',
            starterCode: '# Get name from user\n# Loop through each character in the name string',
            hints: ['A for loop can iterate directly over a string.', 'for letter in name: will work.'],
            testCases: [{ inputs: ['Ben'], expectedOutput: 'B\ne\nn\n' }]
        },
        '3-9': {
            section: 3,
            title: 'FizzBuzz Challenge',
            instructions: '<h3>Task: The FizzBuzz Game</h3><p>Print the numbers 1 to 15 with these rules:</p><ul><li>Multiples of 3: print <code>Fizz</code></li><li>Multiples of 5: print <code>Buzz</code></li><li>Multiples of both: print <code>FizzBuzz</code></li><li>Otherwise: print the number</li></ul>',
            exampleOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz',
            starterCode: '# Loop from 1 to 15',
            hints: ['Use the modulus operator % to check for multiples.', 'The condition for "FizzBuzz" (i % 3 == 0 and i % 5 == 0) must be checked FIRST.'],
            testCases: [{ inputs: [], expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n' }],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'Why is it important to check for `i % 3 == 0 and i % 5 == 0` before checking for the other conditions?', 
                    keywords: ['specific', 'both', 'first', 'order', 'match', 'check'],
                    minLength: 40,
                    a: 'To handle the most specific case first.', 
                    explanation: 'If you checked for `i % 3 == 0` first, it would print "Fizz" for a number like 15 and stop, never getting to the "FizzBuzz" check. The most specific condition must always be checked first.' 
                },
                { 
                    type: 'short-answer', 
                    q: 'What is the purpose of the modulus (%) operator in this task?', 
                    a: 'To find the remainder of a division.',
                    variations: ['remainder', 'find remainder', 'get remainder', 'check divisibility'],
                    explanation: 'The modulus operator finds the remainder of a division. It is used here to check if a number is perfectly divisible by another (i.e., if the remainder is 0).' 
                }
            ]
        },
        '3-10': {
            section: 3,
            title: 'Section 3 Challenge',
            instructions: '<h3>Task: Guess the Number Game</h3><p>Create a guessing game with secret number 42.</p><ol><li>Print <code>I am thinking of a number...</code></li><li>Let the user keep guessing</li><li>For each guess print: <code>Too high</code>, <code>Too low</code>, or <code>Correct!</code></li><li>Stop when correct</li></ol>',
            exampleOutput: 'I am thinking of a number...\nToo high\nToo low\nCorrect!',
            starterCode: 'secret_number = 42\nguess = 0\nprint("I am thinking of a number...")\n\n# Loop while the guess is not the secret number',
            hints: ['The while loop condition should be: while guess != secret_number:', 'Inside the loop, get the user\'s input and convert it to an integer.', 'Use an if/elif/else block inside the loop to provide feedback.'],
            testCases: [{ inputs: ['50', '30', '42'], expectedOutput: 'I am thinking of a number...\nToo high\nToo low\nCorrect!\n' }]
        },
        '3-11': {
            section: 3,
            title: 'Print Even Numbers',
            instructions: '<h3>Task: Loop with a Step</h3><p>Using a <code>for</code> loop, print all the even numbers from 2 to 20, inclusive.</p>',
            exampleOutput: '2\n4\n6\n8\n10\n12\n14\n16\n18\n20',
            starterCode: '# Use a for loop with a range that has a start, stop, and step value.',
            hints: ['The `range()` function can take a third argument, which is the "step".', 'To get numbers from 2 to 20, the stop value needs to be 21.', 'Use a step of 2 to get only the even numbers.'],
            testCases: [{ inputs: [], expectedOutput: '2\n4\n6\n8\n10\n12\n14\n16\n18\n20\n' }]
        },
        '3-12': {
            section: 3,
            title: 'Sum of User Inputs',
            instructions: '<h3>Task: Running Total</h3><p>Write a program that continuously asks the user for numbers and adds them to a running total.</p><p>The loop should stop when the user types the word <code>done</code>. Finally, the program should print the total sum.</p>',
            exampleOutput: 'Total: 17',
            starterCode: 'total = 0\nuser_input = ""\n\n# Create a while loop that continues as long as the user has not typed "done"\n\n# After the loop, print the total',
            hints: ['You need a `while` loop with the condition `user_input != "done"`.', 'Inside the loop, first get the input. Then, use an `if` statement to check if the input is *not* "done". If it isn\'t, convert it to an integer and add it to your total.'],
            testCases: [{ inputs: ['5', '10', '2', 'done'], expectedOutput: 'Total: 17\n' }]
        },
        '3-13': {
            section: 3,
            title: 'Factorial Calculator',
            instructions: '<h3>Task: Calculate a Factorial</h3><p>Ask the user for a number and calculate its factorial.</p><p>A factorial is the product of all positive integers up to that number. For example, the factorial of 5 (written as 5!) is 5 × 4 × 3 × 2 × 1 = 120.</p><p>Print exactly: <code>The factorial of [num] is [result]</code></p>',
            exampleOutput: 'The factorial of 5 is 120',
            starterCode: '# Ask the user for a number\nfactorial = 1\n\n# Use a for loop to calculate the factorial\n\n# Print the result',
            hints: ['Initialize your `factorial` variable to 1, not 0.', 'Your `for` loop should iterate from 1 up to (and including) the user\'s number.', 'Inside the loop, multiply the `factorial` variable by the current loop number: `factorial = factorial * i`.'],
            testCases: [{ inputs: ['5'], expectedOutput: 'The factorial of 5 is 120\n' }]
        },
        '3-14': {
            section: 3,
            title: 'Simple Pattern Drawing',
            instructions: '<h3>Task: Draw a Square</h3><p>Ask the user for a number representing the size of a square.</p><p>Using nested <code>for</code> loops, print a square of asterisks (`*`) of that size. For example, if the user enters 4, it should print a 4x4 square.</p>',
            exampleOutput: '****\n****\n****\n****',
            starterCode: 'size = int(input("Enter size: "))\n\n# Use a loop for the rows\n    # Use a second loop (nested) for the columns',
            hints: ['The outer loop will control how many rows are printed.', 'The inner loop will print the asterisks for a single row.', 'To print asterisks on the same line, use `print("*", end="")`. After the inner loop finishes, use an empty `print()` to move to the next line.'],
            testCases: [{ inputs: ['4'], expectedOutput: '****\n****\n****\n****\n' }]
        },
        '3-15': {
            section: 3,
            title: 'Find the First Vowel',
            instructions: '<h3>Task: Find the First Vowel</h3><p>Ask the user for a word. Loop through the letters of the word and find the first vowel (a, e, i, o, u).</p><p>As soon as you find the first vowel, print it and stop the program from searching any further. If no vowels are found, print nothing.</p><p><strong>Hint:</strong> Use a boolean "flag" variable to keep track of whether you have already found and printed a vowel.</p>',
            exampleOutput: 'o',
            starterCode: 'word = input("Enter a word: ")\nvowels = "aeiou"\nvowel_found = False\n\n# Loop through each letter in the word\n    # Check if the letter is a vowel AND if you haven\'t found one yet',
            hints: ['Create a boolean variable `vowel_found` and set it to `False` before the loop.', 'Inside the loop, your `if` condition should be: `if letter in vowels and vowel_found == False:`', 'If the condition is true, print the letter and then set `vowel_found = True`.'],
            testCases: [{ inputs: ['programming'], expectedOutput: 'o\n' }, { inputs: ['rhythm'], expectedOutput: '' }]
        },
        // SECTION 4
        '4-1': {
            section: 4,
            title: 'Creating a List',
            instructions: '<h3>Task: Your Favourite Things</h3><p>Create a list containing exactly: <code>[\'red\', \'green\', \'blue\']</code></p><p>Then:</p><ol><li>Print the entire list</li><li>Print only the second item (green)</li></ol>',
            exampleOutput: '[\'red\', \'green\', \'blue\']\ngreen',
            starterCode: '# Create a list of colours\n# Print the whole list\n# Print the second item',
            hints: ['Lists are created with square brackets [], with items separated by commas.', 'To access the second item, use the index [1].'],
            testCases: [{ inputs: [], expectedOutput: '[\'red\', \'green\', \'blue\']\ngreen\n' }],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'What is a 1D array (or list in Python)?', 
                    keywords: ['collection', 'items', 'ordered', 'store', 'data', 'structure'],
                    minLength: 40,
                    a: 'A data structure that stores an ordered collection of items.', 
                    explanation: 'It is a data structure that stores a collection of items in a specific order. Each item can be accessed using its index.' 
                },
                { 
                    type: 'fill-in-the-blank', 
                    q: 'In Python, list indices start at 0. `colours[2]` would return the value ___.', 
                    a: 'blue',
                    variations: ['Blue', '"blue"', "'blue'"],
                    explanation: '`colours[0]` is \'red\', `colours[1]` is \'green\', and `colours[2]` is \'blue\'.' 
                }
            ]
        },
        '4-2': {
            section: 4,
            title: 'Looping Through a List',
            instructions: '<h3>Task: Greeting Party</h3><p>Create a list: <code>[\'Alice\', \'Bob\', \'Charlie\']</code></p><p>Use a loop to print <code>Hello, [name]</code> for each person.</p>',
            exampleOutput: 'Hello, Alice\nHello, Bob\nHello, Charlie',
            starterCode: '# Create a list of guests\n# Loop through the guests list and greet each one',
            hints: ['You can loop directly over a list: for name in guests:', 'Inside the loop, the name variable will hold the current name from the list.'],
            testCases: [{ inputs: [], expectedOutput: 'Hello, Alice\nHello, Bob\nHello, Charlie\n' }]
        },
        '4-3': {
            section: 4,
            title: 'Adding to a List',
            instructions: '<h3>Task: Shopping List</h3><p>Start with: <code>[\'milk\', \'bread\']</code></p><p>Ask the user for another item. Add it to the list using <code>append()</code>. Print the updated list.</p>',
            exampleOutput: '[\'milk\', \'bread\', \'eggs\']',
            starterCode: '# Create initial shopping list\n# Get item from user\n# Append the item to the list\n# Print the new list',
            hints: ['The syntax to add an item is list_name.append(item_to_add).', 'The new item will be added to the end of the list.'],
            testCases: [{ inputs: ['eggs'], expectedOutput: '[\'milk\', \'bread\', \'eggs\']\n' }]
        },
        '4-4': {
            section: 4,
            title: 'Accessing by Index',
            instructions: '<h3>Task: Top of the Charts</h3><p>Create list: <code>[\'Song A\', \'Song B\', \'Song C\']</code></p><p>Ask user for position (1, 2, or 3). Print the song at that position.</p><p><strong>Remember:</strong> User enters 1-3, but indices are 0-2!</p>',
            exampleOutput: 'Song B',
            starterCode: '# Create list of top songs\n# Get position from user\n# Get the correct index and print the song',
            hints: ['Calculate the index: index = pos - 1.', 'Use this calculated index to access the item from the list: top_songs[index].'],
            testCases: [{ inputs: ['2'], expectedOutput: 'Song B\n' }]
        },
        '4-5': {
            section: 4,
            title: 'Getting List Length',
            instructions: '<h3>Task: How Many Guests?</h3><p>Create: <code>[\'Anna\', \'Bob\', \'Charlie\', \'David\']</code></p><p>Use <code>len()</code> to count items. Print exactly: <code>There are [number] guests.</code></p>',
            exampleOutput: 'There are 4 guests.',
            starterCode: '# Create a list of guests\n# Get the length and print the message',
            hints: ['len(list_name) returns the number of items in the list.', 'You will need to convert the length to a string using str() to print it with other text.'],
            testCases: [{ inputs: [], expectedOutput: 'There are 4 guests.\n' }],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'What does the built-in `len()` function do when used with a list?', 
                    a: 'It returns the number of items in the list.',
                    variations: ['returns number of items', 'counts items', 'gives length', 'returns length'],
                    explanation: '`len()` returns the length (number of items) of an object like a list or string as an integer.' 
                },
                { 
                    type: 'short-answer', 
                    q: 'The `len()` function returns an integer. Why is it necessary to use `str()` before printing it with other text?', 
                    keywords: ['type', 'string', 'concatenate', 'join', 'convert', 'integer'],
                    minLength: 40,
                    a: 'To avoid a TypeError.', 
                    explanation: 'Python cannot concatenate (join) a string with an integer directly. `str()` converts the integer to a string so they can be joined for printing.' 
                }
            ]
        },
        '4-6': {
            section: 4,
            title: 'String Length',
            instructions: '<h3>Task: Character Count</h3><p>Ask for the user\'s name. Count the characters using <code>len()</code>.</p><p>Print exactly: <code>Your name has [number] characters.</code></p>',
            exampleOutput: 'Your name has 5 characters.',
            starterCode: '# Get name from user\n# Count characters and print result',
            hints: ['The len() function works on strings as well as lists.'],
            testCases: [{ inputs: ['David'], expectedOutput: 'Your name has 5 characters.\n' }]
        },
        '4-7': {
            section: 4,
            title: 'String Slicing',
            instructions: '<h3>Task: First and Last Letter</h3><p>Ask for a word. Print:</p><ol><li><code>First letter: [letter]</code></li><li><code>Last letter: [letter]</code></li></ol>',
            exampleOutput: 'First letter: P\nLast letter: n',
            starterCode: '# Get a word from user\n# Print first and last letters',
            hints: ['word[0] will give you the first character.', 'Python has a handy feature where index [-1] gives you the last character.'],
            testCases: [{ inputs: ['Python'], expectedOutput: 'First letter: P\nLast letter: n\n' }]
        },
        '4-8': {
            section: 4,
            title: 'Changing Case',
            instructions: '<h3>Task: Shouting and Whispering</h3><p>Ask for a sentence. Print it in:</p><ol><li>All UPPERCASE</li><li>All lowercase</li></ol>',
            exampleOutput: 'HELLO WORLD\nhello world',
            starterCode: '# Get a sentence from user\n# Print in uppercase\n# Print in lowercase',
            hints: ['sentence.upper() will return the uppercase version.', 'sentence.lower() will return the lowercase version.'],
            testCases: [{ inputs: ['Hello World'], expectedOutput: 'HELLO WORLD\nhello world\n' }]
        },
        '4-9': {
            section: 4,
            title: 'Linear Search in a List',
            instructions: '<h3>Task: Is it on the list?</h3><p>Approved guests: <code>["Ken", "Ryu", "Chun-Li"]</code></p><p>Ask for a name. Search the list using a loop.</p><p>Print <code>Welcome</code> or <code>Sorry, you are not on the list.</code></p>',
            exampleOutput: 'Welcome',
            starterCode: 'approved = ["Ken", "Ryu", "Chun-Li"]\n# Get name to check\nfound = False\n\n# Loop through the approved list\n    # If the name matches, set found to True\n\n# After the loop, check if the name was found',
            hints: ['Use a boolean variable (a "flag"), e.g., found = False, before the loop.', 'Inside the loop, if you find a match, set found = True.', 'After the loop finishes, use an if statement to check the value of your found flag.'],
            testCases: [
                { inputs: ['Ryu'], expectedOutput: 'Welcome\n' },
                { inputs: ['Zangief'], expectedOutput: 'Sorry, you are not on the list.\n' }
            ]
        },
        '4-10': {
            section: 4,
            title: 'Section 4 Challenge',
            instructions: '<h3>Task: Finding Max Score</h3><p>Given scores: <code>[78, 92, 56, 88, 99, 67]</code></p><p>Find the highest score WITHOUT using <code>max()</code>. Use a loop!</p><p>Print exactly: <code>The highest score is: [score]</code></p>',
            exampleOutput: 'The highest score is: 99',
            starterCode: 'scores = [78, 92, 56, 88, 99, 67]\nhighest_score = 0\n\n# Loop through the scores list\n    # If the current score is higher than highest_score, update highest_score\n\n# Print the final highest score',
            hints: ['Initialize highest_score to the first item in the list, or to 0.', 'Inside your loop, compare the current score with highest_score.', 'If score > highest_score, then you have a new highest score, so you should update it: highest_score = score.'],
            testCases: [{ inputs: [], expectedOutput: 'The highest score is: 99\n' }]
        },
        '4-11': {
            section: 4,
            title: 'To-Do List Manager',
            instructions: '<h3>Task: Simple To-Do List</h3><p>Create a program that lets a user manage a to-do list. The user should be able to type <code>add</code>, <code>remove</code>, or <code>view</code>.</p><ul><li><strong>add</strong>: Ask for an item and append it to the list.</li><li><strong>remove</strong>: Ask for the item to remove. You must do this by creating a new, empty list and copying over all items from the old list except the one being removed. Then replace the old list with the new one.</li><li><strong>view</strong>: Print the current list.</li></ul><p>The program should loop until the user types <code>exit</code>.</p>',
            exampleOutput: "['buy milk', 'code']",
            starterCode: 'todo_list = []\ncommand = ""\n\nwhile command != "exit":\n    command = input("What would you like to do (add, remove, view, exit)? ")\n    # Your code here',
            hints: ['For "remove", create a new empty list inside the if block.', 'Loop through the original `todo_list` and if an item is NOT the one to be removed, `append` it to the new list.', 'After the loop, set `todo_list = new_list`.'],
            testCases: [{ inputs: ['add', 'call mum', 'add', 'feed cat', 'view', 'remove', 'call mum', 'view', 'exit'], expectedOutput: "['call mum', 'feed cat']\n['feed cat']\n" }]
        },
        '4.12': {
            section: 4,
            title: 'Reverse a String',
            instructions: '<h3>Task: Reverse with Slicing</h3><p>Ask the user for a word and print it in reverse. You must do this using string slicing, not a loop.</p>',
            exampleOutput: 'nohtyP',
            starterCode: '# Ask the user for a word\n# Use slicing to reverse it\n# Print the result',
            hints: ['String slicing can take a third argument, which is the "step".', 'A step of `-1` tells Python to go backwards through the string.', 'The slice `[::-1]` will reverse any string or list.'],
            testCases: [{ inputs: ['Python'], expectedOutput: 'nohtyP\n' }]
        },
        '4.13': {
            section: 4,
            title: 'Check for Palindrome',
            instructions: '<h3>Task: Palindrome Checker</h3><p>Ask the user for a word and check if it is a palindrome. A palindrome is a word that reads the same forwards and backwards (e.g., "racecar", "level").</p><p>Print <code>It\'s a palindrome!</code> or <code>It\'s not a palindrome.</code></p>',
            exampleOutput: "It's a palindrome!",
            starterCode: '# Ask the user for a word\n# Reverse the word\n# Compare the original word with the reversed one',
            hints: ['You can reverse the word using the `[::-1]` slice from the previous task.', 'Use an `if` statement to compare the original word to its reversed version.'],
            testCases: [
                { inputs: ['racecar'], expectedOutput: "It's a palindrome!\n" },
                { inputs: ['hello'], expectedOutput: "It's not a palindrome.\n" }
            ]
        },
        '4-14': {
            section: 4,
            title: 'Word Counter',
            instructions: '<h3>Task: Count Words in a Sentence</h3><p>Ask the user to enter a sentence. Your program should then count how many words are in it and print the result.</p><p><strong>Note:</strong> The `.split()` method is a helpful tool for this. It is an excellent extension to see how strings and lists work together, but it is not required by all GCSE specifications.</p>',
            exampleOutput: 'Word count: 9',
            starterCode: 'sentence = input("Enter a sentence: ")\n# Split the sentence into a list of words\n# Count the items in the list and print the result',
            hints: ['The `.split()` method, when used on a string, will break it into a list of words.', 'Once you have the list of words, you can use `len()` to find out how many there are.'],
            testCases: [{ inputs: ['The quick brown fox jumps over the lazy dog'], expectedOutput: 'Word count: 9\n' }],
            theoryQuestions: [
                { 
                    type: 'multiple-choice', 
                    q: 'The `.split()` method is a pre-written subprogram. Does it act like a function or a procedure?', 
                    options: ['Function', 'Procedure'], 
                    a: 0, 
                    explanation: 'It acts like a function because it returns a value (a list of words). A procedure performs a task but does not return a value.' 
                },
                { 
                    type: 'short-answer', 
                    q: 'How does using a built-in method like `.split()` demonstrate the concept of abstraction?', 
                    keywords: ['hide', 'complex', 'details', 'simple', 'internal', 'work'],
                    minLength: 50,
                    a: 'It hides complexity.', 
                    explanation: 'Abstraction means hiding complex details and showing only the necessary features. With `.split()`, we don\'t need to know *how* it works internally to find spaces and break up the string; we just know that it does the job for us.' 
                }
            ]
        },
        '4-15': {
            section: 4,
            title: 'Find and Replace',
            instructions: '<h3>Task: Find and Replace a Word</h3><p>Start with the sentence: `"I like to eat apples and bananas."`. Ask the user for a word to find and a word to replace it with.</p><p>Then, print the new, updated sentence.</p><p><strong>Note:</strong> This task uses the `.replace()` method. This is a very powerful built-in Python feature, and while it is not formally part of the GCSE specification, this is an excellent extension task to see what\'s possible.</p>',
            exampleOutput: 'I like to eat pears and bananas.',
            starterCode: 'sentence = "I like to eat apples and bananas."\n# Ask for the word to find\n# Ask for the new word\n# Use the replace method and print the result',
            hints: ['The `.replace()` method works like this: `new_sentence = old_sentence.replace(word_to_find, new_word)`.', 'The method returns a *new* string with the changes; it does not change the original string.'],
            testCases: [{ inputs: ['apples', 'pears'], expectedOutput: 'I like to eat pears and bananas.\n' }]
        },
        // SECTION 5
        '5-1': {
            section: 5,
            title: 'Defining a Procedure',
            instructions: '<h3>Task: Simple Greeting Procedure</h3><p>Define a procedure <code>show_greeting</code> that prints <code>Welcome to the program!</code></p><p>Then call it to run it.</p>',
            exampleOutput: 'Welcome to the program!',
            starterCode: '# Define the procedure here\n\n# Call the procedure here',
            hints: ['Procedures are defined with def procedure_name():', 'The code inside the procedure must be indented.', 'To run the procedure, you simply type its name followed by parentheses: show_greeting().'],
            testCases: [{ inputs: [], expectedOutput: 'Welcome to the program!\n' }],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'What is the main difference between a procedure and a function?', 
                    keywords: ['return', 'value', 'procedure', 'function', 'result'],
                    minLength: 40,
                    a: 'A function returns a value, a procedure does not.', 
                    explanation: 'A function uses the `return` keyword to send a value back to where it was called. A procedure just performs a set of actions.' 
                },
                { 
                    type: 'short-answer', 
                    q: 'Give one reason why using subprograms makes code easier to maintain.', 
                    keywords: ['reuse', 'debug', 'fix', 'update', 'change', 'organize', 'modular'],
                    minLength: 50,
                    a: 'Code is reusable and easier to debug.', 
                    explanation: 'It breaks a large program into smaller, manageable chunks. If you need to fix or update a piece of logic, you only need to change it in one place (the subprogram) instead of finding every place it was used.' 
                }
            ]
        },
        '5-2': {
            section: 5,
            title: 'Procedure with a Parameter',
            instructions: '<h3>Task: Personalised Greeting</h3><p>Define <code>greet_user(name)</code> that prints <code>Hello, [name]</code></p><p>Call it with "Alice" as the argument.</p>',
            exampleOutput: 'Hello, Alice',
            starterCode: '# Define a procedure with a name parameter\n\n# Call the procedure with "Alice"',
            hints: ['Parameters go inside the parentheses in the def line.', 'When you call the procedure, the value you put inside the parentheses is passed into the name parameter.'],
            testCases: [{ inputs: [], expectedOutput: 'Hello, Alice\n' }]
        },
        '5-3': {
            section: 5,
            title: 'Defining a Function',
            instructions: '<h3>Task: Adding Function</h3><p>Define <code>add_numbers(a, b)</code> that returns their sum.</p><p>Call it with 5 and 10, store the result, and print it.</p>',
            exampleOutput: '15',
            starterCode: '# Define a function that adds two numbers and returns the result\n\n# Call the function and print the result',
            hints: ['Your function must end with return sum_variable.', 'When you call the function, the returned value can be assigned to a variable: result = add_numbers(...).'],
            testCases: [{ inputs: [], expectedOutput: '15\n' }],
            theoryQuestions: [
                { 
                    type: 'fill-in-the-blank', 
                    q: 'The ___ keyword sends a value back from a function.', 
                    a: 'return',
                    variations: ['RETURN', 'Return'],
                    explanation: 'The `return` keyword sends a value back from the function to the part of the code that called it. It also exits the function.' 
                },
                { 
                    type: 'short-answer', 
                    q: 'Explain the difference between a local variable (inside a function) and a global variable.', 
                    keywords: ['local', 'global', 'inside', 'outside', 'scope', 'access', 'function'],
                    minLength: 60,
                    a: 'Local variables only exist inside a function, global variables exist everywhere.', 
                    explanation: 'A local variable is created inside a function and can only be accessed within that function. A global variable is created outside of any function and can be accessed from anywhere in the program.' 
                }
            ]
        },
        '5-4': {
            section: 5,
            title: 'Function: Area Calculator',
            instructions: '<h3>Task: Rectangle Area Function</h3><p>Create <code>calculate_area(width, height)</code> that returns the area.</p><p>Ask user for width and height, call the function, print the result.</p>',
            exampleOutput: '56',
            starterCode: '# Define your function here\n\n# Get user input for width and height\n\n# Call the function and print the result',
            hints: ['Remember to convert the user\'s input to numbers before passing them to the function.', 'Your main code will get the inputs, call the function, and then handle the printing.'],
            testCases: [{ inputs: ['7', '8'], expectedOutput: '56\n' }]
        },
        '5-5': {
            section: 5,
            title: 'Functions: Average',
            instructions: '<h3>Task: Average Calculator</h3><p>Create <code>calculate_average(num1, num2, num3)</code> that returns the average.</p><p>Test with values 10, 20, 30 and print the result.</p>',
            exampleOutput: '20.0',
            starterCode: '# Define function to calculate average of 3 numbers\n\n# Test with 10, 20, 30',
            hints: ['Average = (num1 + num2 + num3) / 3', 'Remember to return the result'],
            testCases: [{ inputs: [], expectedOutput: '20.0\n' }]
        },
        '5-6': {
            section: 5,
            title: 'Temperature Converter Function',
            instructions: '<h3>Task: Celsius to Fahrenheit Function</h3><p>Create a function named `celsius_to_fahrenheit` that takes one number (a temperature in Celsius) as an argument.</p><p>The function should calculate the equivalent temperature in Fahrenheit and <strong>return</strong> it.</p><p>The formula is: `Fahrenheit = (Celsius * 9/5) + 32`</p><p>Finally, test your function by calling it with the value `20` and printing the returned result.</p>',
            exampleOutput: '68.0',
            starterCode: 'def celsius_to_fahrenheit(celsius):\n    # Calculate fahrenheit and return it\n    pass\n\n# Call the function with 20 and print the result\n',
            hints: ['The variable `celsius` inside the function will hold the value that is passed in when the function is called.', 'Your function must use the `return` keyword to send the calculated value back.'],
            testCases: [{ inputs: [], expectedOutput: '68.0\n' }]
        },
        '5-7': {
            section: 5,
            title: 'Default Parameters',
            instructions: '<h3>Task: Flexible Greeting Function</h3><p>Create a function `greet(name, greeting="Hello")` that prints a greeting.</p><p>This function uses a <strong>default parameter</strong>. If a greeting is not provided when the function is called, it will automatically use "Hello".</p><p>Test this by calling the function twice:<br>1. Once with just a name: `greet("Bob")`<br>2. Once with a name and a custom greeting: `greet("Alice", "Good morning")`</p>',
            exampleOutput: 'Hello, Bob\nGood morning, Alice',
            starterCode: 'def greet(name, greeting="Hello"):\n    # Print the greeting and the name\n    pass\n\n# Call the function twice to test it\n',
            hints: ['You define a default parameter by using an equals sign in the function definition: `def my_func(param="default value")`.', 'Inside the function, you can just use the `greeting` and `name` variables as normal.'],
            testCases: [{ inputs: [], expectedOutput: 'Hello, Bob\nGood morning, Alice\n' }],
            theoryQuestions: [
                { 
                    type: 'short-answer', 
                    q: 'What is a parameter?', 
                    keywords: ['placeholder', 'value', 'function', 'pass', 'input', 'argument'],
                    minLength: 40,
                    a: 'A placeholder for a value that is passed into a function.', 
                    explanation: 'A parameter is a special variable listed inside the parentheses in a function definition, which acts as a placeholder for a value that will be passed into the function when it is called.' 
                },
                { 
                    type: 'short-answer', 
                    q: 'How does providing a default value for a parameter make a function more flexible?', 
                    keywords: ['optional', 'default', 'flexible', 'call', 'without', 'value'],
                    minLength: 50,
                    a: 'It makes the parameter optional.', 
                    explanation: 'The function can be called with or without providing a value for that parameter, making it usable in more situations without causing an error.' 
                }
            ]
        },
        '5-8': {
            section: 5,
            title: 'Return Multiple Values',
            instructions: '<h3>Task: Get User Details Function</h3><p>Create a function `get_name_and_age` that asks the user for their name and their age.</p><p>The function should then <strong>return both</strong> of these values.</p><p>In the main part of your program, call this function and store the two returned values in two separate variables. Finally, print them out.</p>',
            exampleOutput: 'Name: Alice, Age: 30',
            starterCode: 'def get_name_and_age():\n    name = input("Enter name: ")\n    age = input("Enter age: ")\n    # Return both name and age\n    pass\n\n# Call the function and store the results\nuser_name, user_age = get_name_and_age()\n\n# Print the stored variables\n',
            hints: ['To return multiple values from a function, just list them after the `return` keyword, separated by commas: `return value1, value2`.', 'You can "unpack" the returned values into multiple variables when you call the function: `var1, var2 = my_function()`.'],
            testCases: [{ inputs: ['Alice', '30'], expectedOutput: 'Name: Alice, Age: 30\n' }]
        },
        '5-9': {
            section: 5,
            title: 'List Statistics Function',
            instructions: '<h3>Task: Function for List Stats</h3><p>Create a function `list_stats(numbers)` that takes a list of numbers as an argument.</p><p>The function should find the minimum number, the maximum number, and the average of the numbers in the list. It should then <strong>return all three</strong> of these values.</p><p>You must find the min and max using a loop, not the built-in `min()` and `max()` functions.</p><p>Test your function with the list `[10, 20, 30, 40, 50]`.</p>',
            exampleOutput: 'Min: 10, Max: 50, Average: 30.0',
            starterCode: 'def list_stats(numbers):\n    # Find the min, max, and average using loops\n    # Return the three values\n    pass\n\nsample_scores = [10, 20, 30, 40, 50]\nmin_val, max_val, avg_val = list_stats(sample_scores)\nprint(f"Min: {min_val}, Max: {max_val}, Average: {avg_val}")\n',
            hints: ['To find the sum (for the average), loop through the list and add each number to a total.', 'To find the minimum, set a `min_val` variable to the first item in the list, then loop through the rest, updating `min_val` if you find a smaller number.', 'Do the same for the maximum value.'],
            testCases: [{ inputs: [], expectedOutput: 'Min: 10, Max: 50, Average: 30.0\n' }]
        },
        '5-10': {
            section: 5,
            title: 'Recursive Countdown',
            instructions: '<h3>Challenge: Recursive Countdown</h3><p>This is an advanced challenge task that introduces <strong>recursion</strong>.</p><p>A recursive function is a function that calls itself.</p><p>Create a function `countdown(n)` that prints the numbers from `n` down to 1. The function must call itself to work. When `n` is 0, the function should stop.</p><p><strong>Note:</strong> Recursion is an advanced topic not on the GCSE specification, but is a core concept in computer science.</p>',
            exampleOutput: '5\n4\n3\n2\n1',
            starterCode: 'def countdown(n):\n    # The "base case": what to do when we need to stop?\n    if n == 0:\n        return # Stop the function\n    else:\n        # Print the current number\n        # Then call the function again with a smaller number\n        pass\n\ncountdown(5)\n',
            hints: ['A recursive function needs a "base case" - an `if` statement that tells it when to stop, otherwise it will loop forever.', 'In the `else` block, you should first `print(n)`, and then make the recursive call: `countdown(n - 1)`.'],
            testCases: [{ inputs: [], expectedOutput: '5\n4\n3\n2\n1\n' }]
        },
        // SECTION 6 - COMPREHENSIVE CHALLENGES
        '6-1': {
            section: 6,
            title: 'Student Grade Manager',
            instructions: '<h3>Challenge: Complete Grade System</h3><p>Create a program that manages student grades:</p><ol><li>Ask how many students (must be 1-10)</li><li>For each student, ask for name and score (0-100)</li><li>Store names and scores in separate lists</li><li>Calculate and print class average</li><li>Find and print highest scorer\'s name</li><li>Count and print how many passed (≥50)</li></ol><p>Use functions for average calculation and finding highest score.</p>',
            exampleOutput: 'How many students? 3\nStudent 1 name: Alice\nStudent 1 score: 85\nStudent 2 name: Bob\nStudent 2 score: 72\nStudent 3 name: Charlie\nStudent 3 score: 45\n\nClass average: 67.3\nHighest scorer: Alice with 85\nStudents passed: 2',
            starterCode: '# Define function to calculate average\ndef calculate_average(scores):\n    # Your code here\n    pass\n\n# Define function to find highest score index\ndef find_highest_index(scores):\n    # Your code here\n    pass\n\n# Main program\n# Get number of students (validate 1-10)\n# Create empty lists for names and scores\n# Loop to get student data\n# Calculate and display results',
            hints: ['Use while loop for input validation', 'Remember list indices for matching names to scores', 'The average might be a decimal - use round() for one decimal place'],
            testCases: [{ inputs: ['3', 'Alice', '85', 'Bob', '72', 'Charlie', '45'], expectedOutput: 'Class average: 67.3\nHighest scorer: Alice with 85\nStudents passed: 2\n' }]
        },
        '6-2': {
            section: 6,
            title: 'Shopping Till System',
            instructions: '<h3>Challenge: Supermarket Checkout</h3><p>Create a shopping till system:</p><ol><li>Show menu: 1=Add item, 2=View basket, 3=Checkout, 4=Exit</li><li>Add item: ask for item name and price</li><li>View basket: show all items with prices</li><li>Checkout: show total, apply 10% discount if over £50</li><li>Keep running until user exits</li></ol><p>Use lists to store items and prices. Create functions for each menu option.</p>',
            exampleOutput: 'Menu:\n1. Add item\n2. View basket\n3. Checkout\n4. Exit\nChoice: 1\nItem name: Apples\nItem price: 2.50\nApples added!\n\nMenu:\n1. Add item\n2. View basket\n3. Checkout\n4. Exit\nChoice: 3\nYour basket:\nApples - £2.50\nTotal: £2.50\nThank you!',
            starterCode: '# Define function to display menu\ndef show_menu():\n    print("Menu:")\n    print("1. Add item")\n    print("2. View basket")\n    print("3. Checkout")\n    print("4. Exit")\n\n# Define other functions here\n\n# Main program\nitems = []\nprices = []\nchoice = ""\n\n# Main loop',
            hints: ['Use parallel lists - items[0] matches prices[0]', 'For checkout, sum all prices then check if discount applies', 'Format prices to 2 decimal places'],
            testCases: [{ inputs: ['1', 'Bread', '1.20', '1', 'Milk', '0.99', '3', '4'], expectedOutput: 'Menu:\n1. Add item\n2. View basket\n3. Checkout\n4. Exit\nBread added!\nMenu:\n1. Add item\n2. View basket\n3. Checkout\n4. Exit\nMilk added!\nMenu:\n1. Add item\n2. View basket\n3. Checkout\n4. Exit\nYour basket:\nBread - £1.2\nMilk - £0.99\nTotal: £2.19\nThank you!\nMenu:\n1. Add item\n2. View basket\n3. Checkout\n4. Exit\nGoodbye!\n' }]
        },
        '6-3': {
            section: 6,
            title: 'Password Generator',
            instructions: '<h3>Challenge: Secure Password Creator</h3><p>Build a password generator with options:</p><ol><li>Ask for password length (8-20 characters)</li><li>Ask if include numbers (yes/no)</li><li>Ask if include symbols (yes/no)</li><li>Generate password using rules</li><li>Check password strength and report it</li></ol><p>Rules: Always include letters. Strength: Weak (<10 chars), Medium (10-15), Strong (>15 with numbers AND symbols)</p>',
            exampleOutput: 'Password length (8-20): 12\nInclude numbers? (yes/no): yes\nInclude symbols? (yes/no): no\n\nGenerated password: AbCdEf123GhI\nPassword strength: Medium',
            starterCode: 'import random\n\n# Define function to generate password\ndef generate_password(length, use_numbers, use_symbols):\n    letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"\n    numbers = "0123456789"\n    symbols = "!@#$%^&*"\n    \n    # Build character pool based on options\n    # Generate password\n    pass\n\n# Define function to check strength\ndef check_strength(password, has_numbers, has_symbols):\n    # Your code here\n    pass\n\n# Main program',
            hints: ['Build a pool of allowed characters based on user choices', 'Use random.choice() to pick random characters', 'Remember to validate the length input'],
            testCases: [{ inputs: ['12', 'yes', 'no'], expectedOutput: 'Generated password: AbCdEf123GhI\nPassword strength: Medium\n' }]
        },
        '6-4': {
            section: 6,
            title: 'Quiz Game with High Scores',
            instructions: '<h3>Challenge: Python Knowledge Quiz</h3><p>Create a quiz game:</p><ol><li>Store 5 questions with multiple choice answers</li><li>Show each question with options A, B, C</li><li>Track score and time taken</li><li>Calculate points: correct answer = 10 points, bonus 5 if answered in <5 seconds</li><li>Show final score and performance message</li></ol><p>Performance: <30 points="Need practice", 30-60="Good job!", >60="Python Expert!"</p>',
            exampleOutput: 'Python Quiz - 5 Questions\n\nQ1: What keyword defines a function?\nA) def\nB) func\nC) function\nYour answer: A\nCorrect! (Time: 3 seconds) +15 points\n\n[...more questions...]\n\nFinal Score: 65 points\nPerformance: Python Expert!',
            starterCode: 'import time\n\n# Quiz data\nquestions = [\n    "What keyword defines a function?",\n    "Which operator is used for exponentiation?",\n    # Add more questions\n]\n\noptions = [\n    ["A) def", "B) func", "C) function"],\n    ["A) ^", "B) **", "C) exp"],\n    # Add more options\n]\n\nanswers = ["A", "B"]  # Add more answers\n\n# Main quiz loop',
            hints: ['Use time.time() before and after input to measure response time', 'Keep questions and options in parallel lists', 'Calculate time difference for bonus points'],
            testCases: [{ inputs: ['A', 'B', 'C', 'A', 'B'], expectedOutput: 'Python Quiz - 5 Questions\n\nQ1: What keyword defines a function?\nA) def\nB) func  \nC) function\nCorrect!\n\nQ2: Which operator is used for exponentiation?\nA) ^\nB) **\nC) exp\nCorrect!\n\nQ3: How do you start a comment?\nA) //\nB) #\nC) --\nWrong! Correct answer: B\n\nQ4: Which creates a list?\nA) []\nB) {}\nC) ()\nCorrect!\n\nQ5: What does len() return?\nA) Last element\nB) List size\nC) List type\nCorrect!\n\nFinal Score: 40 points\nPerformance: Good job!\n' }]
        },
        '6-5': {
            section: 6,
            title: 'Text Adventure Game',
            instructions: '<h3>Ultimate Challenge: Escape Room</h3><p>Create a text adventure game:</p><ol><li>Player starts in a locked room with 100 health</li><li>Available commands: look, search [object], use [item], inventory, help</li><li>Room contains: desk (has key), door (locked), window (has crowbar), chest (has potion)</li><li>Player must find key to unlock door</li><li>Each action costs 10 health, potion restores 50</li><li>Win by escaping, lose if health reaches 0</li></ol>',
            exampleOutput: 'Welcome to Escape Room!\nYou wake up in a locked room. Health: 100\n\nWhat do you do? look\nYou see: a desk, a door, a window, and a chest.\nHealth: 90\n\nWhat do you do? search desk\nYou found a key!\nHealth: 80\n\nWhat do you do? use key\nYou unlock the door and escape!\nYOU WIN!',
            starterCode: '# Game setup\nhealth = 100\ninventory = []\nroom_items = {\n    "desk": "key",\n    "window": "crowbar", \n    "chest": "potion"\n}\nfound_items = {}\ndoor_locked = True\n\n# Define game functions\ndef show_help():\n    print("Commands: look, search [object], use [item], inventory, help")\n\n# Add more functions\n\n# Main game loop\nprint("Welcome to Escape Room!")\nprint("You wake up in a locked room. Health:", health)\n\n# Game loop here',
            hints: ['Use dictionaries to track items and their locations', 'Split user input to get command and target', 'Check inventory before allowing item use'],
            testCases: [{ inputs: ['look', 'search desk', 'use key'], expectedOutput: 'Welcome to Escape Room!\nYou wake up in a locked room. Health: 100\n\nYou see: a desk, a door, a window, and a chest.\nHealth: 90\n\nYou found a key!\nHealth: 80\n\nYou unlock the door and escape!\nYOU WIN!\n' }]
        }
    };
    
    // --- APPLICATION STATE ---
    const appState = {
        pyodide: null,
        pyodideLoadPromise: null,
        isPyodideReady: false,
        editor: null,
        currentTaskId: null,
        userProgress: {},
        xpData: {
            totalXP: 0,
            taskXP: {},
            theoryXP: {},
            currentBadge: 'Beginner'
        },
        streakData: {
            currentStreak: 0,
            longestStreak: 0,
            lastActiveDate: null,
            totalDaysActive: 0
        },
        completedSections: {},
        domBatchUpdates: [],
        domBatchScheduled: false,
        eventListeners: new Map()
    };
    
    // --- XP SYSTEM FUNCTIONS ---
    function calculateTaskXP(taskId) {
        const task = TASKS[taskId];
        if (!task) return 0;
        return XP_VALUES[task.section] || 0;
    }
    
    function awardXP(taskId, type = 'task') {
        const xpKey = `${type}XP`;
        const xpDataStore = appState.xpData[xpKey];
        if (!xpDataStore) return 0;

        const xpIdentifier = type === 'theory' ? `${appState.currentTaskId}-${taskId}` : taskId;
        
        if (xpDataStore[xpIdentifier]) {
            return 0; // Already awarded
        }
        
        const xpAmount = type === 'task' ? calculateTaskXP(taskId) : XP_VALUES.theory;
        xpDataStore[xpIdentifier] = xpAmount;
        appState.xpData.totalXP += xpAmount;
        updateBadge();
        saveXPData();
        showXPNotification(xpAmount, type);
        updateXPDisplay();
        updateBadgeDisplay();
        return xpAmount;
    }
    
    function updateBadge() {
        for (let i = BADGES.length - 1; i >= 0; i--) {
            if (appState.xpData.totalXP >= BADGES[i].xpRequired) {
                appState.xpData.currentBadge = BADGES[i].name;
                break;
            }
        }
    }
    
    function showXPNotification(xpAmount, type='task') {
        const notification = document.getElementById('xp-notification');
        const xpEarned = document.getElementById('xp-earned');
        const xpMessage = document.getElementById('xp-message');
        if (!notification || !xpEarned || !xpMessage) return;
        
        xpEarned.textContent = xpAmount;
        xpMessage.textContent = type === 'task' ? 'Task completed!' : 'Theory correct!';
        
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    }
    
    // Streak Management Functions
    function updateStreak() {
        const today = new Date().toDateString();
        const lastActive = appState.streakData.lastActiveDate;
        
        if (!lastActive) {
            appState.streakData.currentStreak = 1;
            appState.streakData.lastActiveDate = today;
            appState.streakData.totalDaysActive = 1;
        } else if (lastActive === today) {
            return;
        } else {
            const lastDate = new Date(lastActive);
            const todayDate = new Date(today);
            const dayDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
            
            if (dayDiff === 1) {
                appState.streakData.currentStreak++;
            } else {
                appState.streakData.currentStreak = 1;
            }
            appState.streakData.totalDaysActive++;
            appState.streakData.lastActiveDate = today;
            
            if (appState.streakData.currentStreak > appState.streakData.longestStreak) {
                appState.streakData.longestStreak = appState.streakData.currentStreak;
            }
        }
        
        saveStreakData();
        updateStreakDisplay();
    }
    
    function updateStreakDisplay() {
        const streakDisplay = document.getElementById('streak-display');
        const streakCount = document.getElementById('streak-count');
        if (!streakDisplay || !streakCount) return;
        
        if (appState.streakData.currentStreak > 0) {
            streakDisplay.style.display = 'flex';
            streakCount.textContent = `${appState.streakData.currentStreak} day streak`;
        }
    }
    
    function checkDailyBonus() {
        const today = new Date().toDateString();
        const lastBonus = localStorage.getItem('pythonProjectLastBonus');
        
        if (lastBonus !== today && appState.streakData.currentStreak > 1) {
            const bonusXP = Math.min(appState.streakData.currentStreak * 5, 50);
            appState.xpData.totalXP += bonusXP;
            localStorage.setItem('pythonProjectLastBonus', today);
            showXPNotification(bonusXP);
            updateXPDisplay();
            saveXPData();
        }
    }
    
    function updateXPDisplay() {
        const xpDisplay = document.getElementById('total-xp');
        if (xpDisplay) {
            xpDisplay.textContent = `${appState.xpData.totalXP} XP`;
        }
        const badgeDisplay = document.getElementById('current-badge');
        if (badgeDisplay) {
            badgeDisplay.textContent = appState.xpData.currentBadge;
        }
    }
    
    function updateBadgeDisplay() {
        const badgeList = document.getElementById('badge-list');
        if (!badgeList) return;
        badgeList.innerHTML = '';
        BADGES.forEach(badge => {
            const badgeItem = document.createElement('div');
            badgeItem.className = 'badge-item';
            if (appState.xpData.totalXP >= badge.xpRequired) {
                badgeItem.classList.add('earned');
            }
            const icon = document.createElement('div');
            icon.className = 'badge-icon';
            icon.textContent = badge.icon;
            const name = document.createElement('div');
            name.className = 'badge-name';
            name.textContent = badge.name;
            const xp = document.createElement('div');
            xp.className = 'badge-xp';
            xp.textContent = `${badge.xpRequired} XP`;
            badgeItem.appendChild(icon);
            badgeItem.appendChild(name);
            badgeItem.appendChild(xp);
            badgeList.appendChild(badgeItem);
        });
    }
    
    function saveXPData() {
        try {
            const encoded = btoa(JSON.stringify(appState.xpData));
            localStorage.setItem('pythonProjectXP', encoded);
        } catch (e) {
            console.error('Could not save XP data', e);
        }
    }
    
    function loadXPData() {
        try {
            const encoded = localStorage.getItem('pythonProjectXP');
            if (encoded) {
                const decoded = JSON.parse(atob(encoded));
                if (decoded && typeof decoded.totalXP === 'number') {
                    appState.xpData = decoded;
                     // Ensure new XP stores exist
                    if (!appState.xpData.taskXP) appState.xpData.taskXP = {};
                    if (!appState.xpData.theoryXP) appState.xpData.theoryXP = {};
                }
            }
        } catch (e) {
            console.error('Could not load XP data', e);
             appState.xpData = {
                totalXP: 0,
                taskXP: {},
                theoryXP: {},
                currentBadge: 'Beginner'
            };
        }
    }
    
    function saveStreakData() {
        localStorage.setItem('pythonProjectStreak', JSON.stringify(appState.streakData));
    }
    
    function loadStreakData() {
        try {
            const saved = localStorage.getItem('pythonProjectStreak');
            if (saved) {
                appState.streakData = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Could not load streak data', e);
        }
    }
    
    function loadCompletedSections() {
        try {
            const saved = localStorage.getItem('pythonProjectCompletedSections');
            if (saved) {
                appState.completedSections = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Could not load completed sections', e);
        }
    }
    
    // --- ERROR BOUNDARY ---
    class ErrorBoundary {
        constructor() {
            this.errors = [];
            this.maxErrors = 50;
        }
        
        handle(error, context = {}) {
            console.error('Error:', error, 'Context:', context);
            
            this.errors.push({
                timestamp: Date.now(),
                error: error.message,
                stack: error.stack,
                context
            });
            
            if (this.errors.length > this.maxErrors) {
                this.errors.shift();
            }
            
            this.showUserMessage(error, context);
        }
        
        showUserMessage(error, context) {
            let message = 'An error occurred';
            
            if (error.name === 'SyntaxError' && context.type === 'python') {
                message = 'There\'s a syntax error in your Python code. Check your brackets and quotes.';
            } else if (error.message.includes('timeout')) {
                message = 'Your code took too long to run. Try to optimize it or check for infinite loops.';
            } else if (error.message.includes('Pyodide')) {
                message = 'Python environment error. Please refresh the page.';
            }
            
            showToast(message, 'error');
        }
    }
    
    const errorBoundary = new ErrorBoundary();
    
    // --- UTILITY FUNCTIONS ---
    function safeCreateElement(tag, className, textContent) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    }
    
    function safeSetTextContent(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) element.textContent = text;
    }
    
    function addManagedEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        
        if (!appState.eventListeners.has(element)) {
            appState.eventListeners.set(element, []);
        }
        
        appState.eventListeners.get(element).push({ event, handler });
    }
    
    function removeAllEventListeners() {
        appState.eventListeners.forEach((listeners, element) => {
            listeners.forEach(({ event, handler }) => {
                element.removeEventListener(event, handler);
            });
        });
        
        appState.eventListeners.clear();
    }
    
    function showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = `toast show toast-${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // --- PYTHON CODE VALIDATION ---
    function validatePythonCode(code) {
        const dangerousPatterns = [
            /__import__/,
            /exec\s*\(/,
            /eval\s*\(/,
            /compile\s*\(/,
            /globals\s*\(/,
            /locals\s*\(/,
            /vars\s*\(/,
            /dir\s*\(/,
            /open\s*\([^)]*['"]\s*\/[^'"]*['"]/,
            /os\./,
            /subprocess/,
            /socket/,
            /sys\.exit/
        ];
        
        for (const pattern of dangerousPatterns) {
            if (pattern.test(code)) {
                throw new Error('Code contains potentially dangerous operations');
            }
        }
        
        if (code.length > 10000) {
            throw new Error('Code is too long (max 10,000 characters)');
        }
        
        return true;
    }
    
    // --- PYODIDE MANAGEMENT ---
    async function ensurePyodideLoaded() {
        if (appState.isPyodideReady) return appState.pyodide;
        
        if (!appState.pyodideLoadPromise) {
            appState.pyodideLoadPromise = loadPyodideEnvironment();
        }
        
        return appState.pyodideLoadPromise;
    }
    
    async function loadPyodideEnvironment() {
        try {
            updateHeaderStatus('Loading Python environment...');
            
            if (typeof loadPyodide === 'undefined') {
                await loadScript('https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js');
            }
            
            appState.pyodide = await loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
            });
            
            appState.pyodide.runPython(`
                import sys
                from js import prompt
                
                def custom_input(prompt_text=""):
                    res = prompt(prompt_text)
                    print(prompt_text, end="")
                    return res if res is not None else ""
                
                __builtins__.input = custom_input
            `);
            
            appState.isPyodideReady = true;
            updateHeaderStatus('Python Ready. Happy Coding!');
            
            return appState.pyodide;
            
        } catch (error) {
            errorBoundary.handle(error, { type: 'pyodide-load' });
            updateHeaderStatus('Failed to load Python environment');
            throw error;
        }
    }
    
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // --- UI GENERATION ---
    function updateHeaderStatus(message) {
        safeSetTextContent('header-subtitle', message);
        safeSetTextContent('python-status', message);
        
        if (message === 'Python Ready. Happy Coding!') {
            safeSetTextContent('header-subtitle', '70 core tasks + 5 comprehensive challenges. Earn XP and unlock badges!');
        }
    }
    
    function generateSidebar() {
        const sidebarNav = document.getElementById('sidebar-nav');
        if (!sidebarNav) return;
        
        sidebarNav.innerHTML = '';
        
        const sections = {};
        for (const taskId in TASKS) {
            const task = TASKS[taskId];
            if (!sections[task.section]) {
                sections[task.section] = [];
            }
            sections[task.section].push(taskId);
        }
        
        Object.keys(sections).sort((a,b) => a - b).forEach(sectionNum => {
            const sectionDiv = safeCreateElement('div', 'section-container');
            const header = safeCreateElement('div', 'section-header');
            if (sectionNum == '6') {
                header.classList.add('challenges');
            }
            const headerText = safeCreateElement('span');
            headerText.textContent = sectionNum == '6' ? 'Comprehensive Challenges' : `Section ${sectionNum}`;
            const arrow = safeCreateElement('span', 'section-arrow');
            arrow.textContent = '▶';
            header.appendChild(headerText);
            header.appendChild(arrow);
            
            const taskList = safeCreateElement('ul', 'task-list');
            taskList.id = `section-list-${sectionNum}`;

            sections[sectionNum].sort().forEach(taskId => {
                const task = TASKS[taskId];
                const li = safeCreateElement('li', 'task-item');
                li.id = `task-item-${taskId}`;
                
                if (appState.userProgress[taskId]?.completed) {
                    li.classList.add('completed');
                }
                
                const status = safeCreateElement('span', 'task-item-status');
                const title = safeCreateElement('span');
                title.textContent = task.title;
                
                const xpBadge = safeCreateElement('span', 'task-xp');
                xpBadge.textContent = `${calculateTaskXP(taskId)} XP`;
                
                li.appendChild(status);
                li.appendChild(title);
                li.appendChild(xpBadge);
                
                addManagedEventListener(li, 'click', () => switchTask(taskId));
                taskList.appendChild(li);
            });
            
            addManagedEventListener(header, 'click', () => {
                taskList.classList.toggle('open');
                arrow.classList.toggle('open');
            });
            
            const exportContainer = safeCreateElement('div', 'export-button-container');
            const exportBtn = safeCreateElement('button', 'btn btn-secondary');
            exportBtn.textContent = sectionNum == '6' ? 'Export Challenge Answers' : `Export Section ${sectionNum} Answers`;
            addManagedEventListener(exportBtn, 'click', () => exportSectionAnswers(sectionNum));
            exportContainer.appendChild(exportBtn);
            
            sectionDiv.appendChild(header);
            sectionDiv.appendChild(taskList);
            taskList.appendChild(exportContainer);
            sidebarNav.appendChild(sectionDiv);
        });
    }
    
    function switchTask(taskId) {
        try {
            appState.currentTaskId = taskId;
            
            const task = TASKS[taskId];
            const mainContent = document.getElementById('mainContent');
            if (!mainContent) return;
            
            document.querySelectorAll('.task-item').forEach(item => {
                item.classList.remove('active');
            });
            const taskItem = document.getElementById(`task-item-${taskId}`);
            if (taskItem) {
                taskItem.classList.add('active');
            }
            
            const taskList = document.getElementById(`section-list-${task.section}`);
            if (taskList && !taskList.classList.contains('open')) {
                taskList.classList.add('open');
                const arrow = taskList.previousElementSibling.querySelector('.section-arrow');
                if (arrow) arrow.classList.add('open');
            }
            
            mainContent.innerHTML = '';
            
            const taskHeader = safeCreateElement('div', 'task-header');
            const taskTitleWrapper = safeCreateElement('div');
            const taskTitle = safeCreateElement('h2', 'task-title');
            const taskNumber = taskId.replace('-', '.');
            taskTitle.textContent = `${taskNumber} - ${task.title}`;
            taskTitleWrapper.appendChild(taskTitle);
            
            const xpBadge = safeCreateElement('div', 'task-xp-badge');
            const xpIcon = safeCreateElement('span');
            xpIcon.textContent = '⭐ ';
            const xpText = safeCreateElement('span');
            xpText.textContent = `${calculateTaskXP(taskId)} XP`;
            xpBadge.appendChild(xpIcon);
            xpBadge.appendChild(xpText);
            
            taskHeader.appendChild(taskTitleWrapper);
            taskHeader.appendChild(xpBadge);
            
            const instructions = safeCreateElement('div', 'instructions allow-select');
            
            const instructionContent = safeCreateElement('div');
            instructionContent.innerHTML = task.instructions;
            instructions.appendChild(instructionContent);
            
            if (task.exampleOutput) {
                const exampleBox = safeCreateElement('div', 'example-output');
                const exampleHeader = safeCreateElement('div', 'example-output-header');
                exampleHeader.textContent = '📋 Example Output:';
                const exampleContent = safeCreateElement('div', 'allow-select');
                exampleContent.textContent = task.exampleOutput;
                exampleBox.appendChild(exampleHeader);
                exampleBox.appendChild(exampleContent);
                instructions.appendChild(exampleBox);
            }
            
            const editorContainer = safeCreateElement('div', 'editor-container');
            const editorHeader = safeCreateElement('div', 'editor-header');
            const fileName = safeCreateElement('span');
            fileName.textContent = 'student_code.py';
            const copyBtn = safeCreateElement('button', 'btn btn-warning');
            copyBtn.textContent = 'Copy Code';
            addManagedEventListener(copyBtn, 'click', copyCode);
            editorHeader.appendChild(fileName);
            editorHeader.appendChild(copyBtn);
            
            const editorTextarea = safeCreateElement('textarea');
            editorTextarea.id = 'editor';
            
            editorContainer.appendChild(editorHeader);
            editorContainer.appendChild(editorTextarea);
            
            const controls = safeCreateElement('div', 'controls');
            
            const runBtn = safeCreateElement('button', 'btn btn-primary');
            runBtn.textContent = '▶ Run';
            addManagedEventListener(runBtn, 'click', runCode);
            
            const checkBtn = safeCreateElement('button', 'btn btn-success');
            checkBtn.textContent = '✔ Check Solution';
            addManagedEventListener(checkBtn, 'click', checkSolution);
            
            const hintBtn = safeCreateElement('button', 'btn btn-secondary');
            hintBtn.textContent = '💡 Show Hint';
            addManagedEventListener(hintBtn, 'click', showHint);
            
            const resetBtn = safeCreateElement('button', 'btn btn-secondary');
            resetBtn.textContent = '↺ Reset';
            addManagedEventListener(resetBtn, 'click', resetCode);
            
            controls.appendChild(runBtn);
            controls.appendChild(checkBtn);
            controls.appendChild(hintBtn);
            controls.appendChild(resetBtn);
            
            const hintBox = safeCreateElement('div', 'hint-box');
            hintBox.id = 'hint-box';
            
            const outputPanel = safeCreateElement('div', 'output-panel');
            const outputHeader = safeCreateElement('div', 'output-header');
            outputHeader.textContent = 'Console Output';
            const outputContent = safeCreateElement('div', 'output-content');
            outputContent.id = 'output';
            outputPanel.appendChild(outputHeader);
            outputPanel.appendChild(outputContent);
            
            const checksContainer = safeCreateElement('div', 'checks-container');
            checksContainer.id = 'checks-container';
            checksContainer.style.display = 'none';
            
            mainContent.appendChild(taskHeader);
            mainContent.appendChild(instructions);
            mainContent.appendChild(editorContainer);
            mainContent.appendChild(controls);
            mainContent.appendChild(hintBox);
            mainContent.appendChild(outputPanel);
            mainContent.appendChild(checksContainer);
            
            // Render Theory Questions
            if (task.theoryQuestions && task.theoryQuestions.length > 0) {
                const theoryContainer = safeCreateElement('div', 'theory-questions-container');
                const theoryHeader = safeCreateElement('h3');
                theoryHeader.textContent = '🤔 Theory Check';
                theoryContainer.appendChild(theoryHeader);

                task.theoryQuestions.forEach((item, index) => {
                    const questionDiv = safeCreateElement('div', 'theory-question');
                    questionDiv.id = `theory-q-${index}`;

                    const qText = safeCreateElement('p', 'allow-select');
                    qText.innerHTML = `<strong>Q${index + 1}:</strong> ${item.q}`;
                    questionDiv.appendChild(qText);
                    
                    const inputArea = safeCreateElement('div', 'theory-input-area');
                    
                    // Generate different input types
                    switch(item.type) {
                        case 'multiple-choice':
                            const optionsGroup = safeCreateElement('div', 'theory-options-group');
                            optionsGroup.id = `theory-options-${index}`;
                            item.options.forEach((opt, optIndex) => {
                                const optionDiv = safeCreateElement('div', 'theory-option');
                                optionDiv.textContent = opt;
                                addManagedEventListener(optionDiv, 'click', () => {
                                    optionsGroup.querySelectorAll('.theory-option').forEach(o => o.classList.remove('selected'));
                                    optionDiv.classList.add('selected');
                                });
                                optionsGroup.appendChild(optionDiv);
                            });
                            inputArea.appendChild(optionsGroup);
                            break;
                        
                        case 'fill-in-the-blank':
                            const blankInput = safeCreateElement('input', 'theory-input-blank');
                            blankInput.type = 'text';
                            blankInput.id = `theory-input-${index}`;
                            blankInput.placeholder = 'Type answer here...';
                            inputArea.appendChild(blankInput);
                            break;
                        
                        case 'short-answer':
                        default:
                            const textarea = safeCreateElement('textarea', 'theory-textarea');
                            textarea.id = `theory-input-${index}`;
                            textarea.placeholder = 'Type your answer here...';
                            inputArea.appendChild(textarea);
                            
                            // Add character counter for questions with minimum length
                            if (item.minLength) {
                                const charCount = safeCreateElement('div', 'character-count');
                                charCount.id = `char-count-${index}`;
                                charCount.textContent = `0 / ${item.minLength} characters minimum`;
                                
                                addManagedEventListener(textarea, 'input', () => {
                                    const length = textarea.value.trim().length;
                                    charCount.textContent = `${length} / ${item.minLength} characters minimum`;
                                    charCount.classList.toggle('warning', length < item.minLength);
                                    textarea.classList.toggle('insufficient', length < item.minLength);
                                });
                                
                                inputArea.appendChild(charCount);
                            }
                            
                            // Add keyword hint for keyword-based questions
                            if (item.keywords && item.keywordHint !== false) {
                                const hint = safeCreateElement('div', 'keyword-hint');
                                hint.textContent = '💡 Include key concepts in your answer for full credit.';
                                inputArea.appendChild(hint);
                            }
                            break;
                    }
                    
                    questionDiv.appendChild(inputArea);

                    const feedbackDiv = safeCreateElement('div', 'theory-feedback');
                    feedbackDiv.id = `theory-feedback-${index}`;

                    const answerDiv = safeCreateElement('div', 'theory-answer hidden allow-select');
                    answerDiv.id = `theory-answer-${index}`;
                    answerDiv.innerHTML = `<p><strong>Explanation:</strong> ${item.explanation}</p>`;
                    
                    const checkAnswerBtn = safeCreateElement('button', 'btn btn-secondary btn-sm');
                    checkAnswerBtn.textContent = 'Check Answer';
                    checkAnswerBtn.id = `check-btn-${index}`;
                    
                    addManagedEventListener(checkAnswerBtn, 'click', () => checkTheoryAnswer(index, item));
                    
                    questionDiv.appendChild(checkAnswerBtn);
                    questionDiv.appendChild(feedbackDiv);
                    questionDiv.appendChild(answerDiv);
                    theoryContainer.appendChild(questionDiv);
                });

                mainContent.appendChild(theoryContainer);
            }
            
            initializeEditor(task.starterCode);
            window.history.pushState({}, '', `?task=${taskId}`);
            
        } catch (error) {
            errorBoundary.handle(error, { type: 'switch-task', taskId });
        }
    }
    
    function initializeEditor(starterCode) {
        const editorTextarea = document.getElementById('editor');
        if (!editorTextarea) return;
        
        if (appState.editor) {
            appState.editor.toTextArea();
        }
        
        if (typeof CodeMirror === 'undefined') {
            errorBoundary.handle(new Error('CodeMirror not loaded'), { type: 'editor-init' });
            return;
        }
        
        appState.editor = CodeMirror.fromTextArea(editorTextarea, {
            mode: 'python',
            theme: 'monokai',
            lineNumbers: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            indentUnit: 4
        });
        
        const savedCode = appState.userProgress[appState.currentTaskId]?.code || starterCode;
        appState.editor.setValue(savedCode);
        
        appState.editor.on('change', () => {
            if (!appState.userProgress[appState.currentTaskId]) {
                appState.userProgress[appState.currentTaskId] = { code: '', completed: false, theory: {} };
            }
            appState.userProgress[appState.currentTaskId].code = appState.editor.getValue();
            saveProgress();
        });
    }
    
    function showWelcomeMessage() {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;
        
        mainContent.innerHTML = '';
        
        const welcome = safeCreateElement('div');
        const title = safeCreateElement('h2');
        title.textContent = 'Welcome to your GCSE Python Summer Project!';
        
        const p1 = safeCreateElement('p', 'allow-select');
        p1.textContent = 'This project now contains 70 core tasks (Sections 1-5) and 5 comprehensive challenges (Section 6).';
        
        const p2 = safeCreateElement('p', 'allow-select');
        p2.textContent = 'Core sections cover: Variables & Operations, Selection, Loops, Lists & Strings, and Functions.';
        
        const p3 = safeCreateElement('p', 'allow-select');
        p3.textContent = 'Challenges combine multiple concepts into larger programs. Each task awards XP - complete them all to unlock badges!';
        
        const xpInfo = safeCreateElement('div', 'test-info-box');
        xpInfo.innerHTML = `<h4>⭐ XP System</h4>
        <p>Earn XP by completing tasks and answering theory questions correctly. Unlock badges as you progress!</p>`;
        
        const testingNote = safeCreateElement('div', 'test-info-box');
        testingNote.innerHTML = `<h4>📋 About Testing Your Code</h4>
        <p>When you click "Check Solution", your code is tested automatically:</p>
        <ul>
            <li><strong>Input prompts are flexible</strong> - Use any prompt text you like</li>
            <li><strong>Only output is tested</strong> - Make sure your output matches exactly</li>
            <li><strong>Check example outputs</strong> - Each task shows what output is expected</li>
        </ul>`;
        
        const p4 = safeCreateElement('p', 'allow-select');
        p4.textContent = 'Select a task from the sidebar to begin. Your progress and XP are automatically saved.';
        
        const p5 = safeCreateElement('p', 'allow-select');
        p5.id = 'python-status';
        p5.textContent = 'Python environment will load when you run your first program.';
        
        const backupSection = safeCreateElement('div', 'test-info-box');
        backupSection.style.background = '#e3f2fd';
        backupSection.style.borderColor = '#2196f3';
        backupSection.innerHTML = `<h4>💾 Backup Your Progress</h4>
        <p><strong>Important:</strong> Your progress is saved in your browser. To prevent data loss:</p>
        <ul>
            <li>Don't clear your browser data</li>
            <li>Use the same browser and computer</li>
            <li>Create regular backups (recommended weekly)</li>
        </ul>`;
        
        const backupButtons = safeCreateElement('div', 'controls');
        backupButtons.style.marginTop = '1rem';
        
        const backupBtn = safeCreateElement('button', 'btn btn-primary');
        backupBtn.textContent = '⬇ Download Backup';
        addManagedEventListener(backupBtn, 'click', exportFullProgressWithTracking);
        
        const restoreBtn = safeCreateElement('button', 'btn btn-secondary');
        restoreBtn.textContent = '⬆ Restore from Backup';
        addManagedEventListener(restoreBtn, 'click', importFullProgress);
        
        backupButtons.appendChild(backupBtn);
        backupButtons.appendChild(restoreBtn);
        backupSection.appendChild(backupButtons);
        
        welcome.appendChild(title);
        welcome.appendChild(p1);
        welcome.appendChild(p2);
        welcome.appendChild(p3);
        welcome.appendChild(xpInfo);
        welcome.appendChild(testingNote);
        welcome.appendChild(backupSection);
        welcome.appendChild(p4);
        welcome.appendChild(p5);
        mainContent.appendChild(welcome);
    }
    
    // --- CORE FUNCTIONALITY ---
    async function runCode() {
        try {
            const pyodide = await ensurePyodideLoaded();
            
            if (!appState.editor) {
                showToast('Editor not initialized.', 'error');
                return;
            }
            
            const code = appState.editor.getValue();
            validatePythonCode(code);
            
            const outputElement = document.getElementById('output');
            outputElement.textContent = 'Running...';
            outputElement.classList.remove('error');
            
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Code execution timeout')), 5000)
            );
            
            const runPromise = (async () => {
                pyodide.runPython(`
                    import sys, io
                    sys.stdout = io.StringIO()
                `);
                await pyodide.runPythonAsync(code);
                return pyodide.runPython(`sys.stdout.getvalue()`);
            })();
            
            const output = await Promise.race([runPromise, timeoutPromise]);
            outputElement.textContent = output || '(No output)';
            
        } catch (error) {
            const outputElement = document.getElementById('output');
            outputElement.textContent = error.toString();
            outputElement.classList.add('error');
            errorBoundary.handle(error, { type: 'python', action: 'run' });
        } finally {
            if (appState.pyodide) {
                appState.pyodide.runPython(`
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
    
    async function checkSolution() {
        try {
            const pyodide = await ensurePyodideLoaded();
            
            if (!appState.editor || !appState.currentTaskId) {
                showToast('No task selected.', 'error');
                return;
            }
            
            const task = TASKS[appState.currentTaskId];
            const studentCode = appState.editor.getValue();
            validatePythonCode(studentCode);
            
            const checksContainer = document.getElementById('checks-container');
            checksContainer.style.display = 'block';
            checksContainer.innerHTML = '';
            
            const checksHeader = safeCreateElement('h3');
            checksHeader.textContent = task.section == 6 ? 'Challenge Checks:' : 'Solution Checks:';
            checksContainer.appendChild(checksHeader);
            
            let allPassed = true;
            
            for (let i = 0; i < task.testCases.length; i++) {
                const testCase = task.testCases[i];
                const mockInput = testCase.inputs.slice();
                let passed = false;

                let actualOutput = '';
                
                try {
                    pyodide.globals.set('mock_inputs', mockInput);
                    pyodide.runPython(`
                        _mock_input_list = mock_inputs.to_py()
                        
                        def _test_input(prompt=""):
                            if not _mock_input_list: 
                                return ""
                            print(prompt, end="")
                            return _mock_input_list.pop(0)
                        
                        __builtins__.input = _test_input
                    `);

                    pyodide.runPython(`
                        import sys, io
                        sys.stdout = io.StringIO()
                    `);
                    await pyodide.runPythonAsync(studentCode);
                    actualOutput = pyodide.runPython(`sys.stdout.getvalue()`);
                    
                    passed = (actualOutput.trim().replace(/\r\n/g, '\n') === testCase.expectedOutput.trim().replace(/\r\n/g, '\n'));
                } catch (err) {
                    actualOutput = err.toString();
                }
                
                if (!passed) {
                    allPassed = false;
                }
                
                const checkItem = safeCreateElement('div', `check-item ${passed ? 'passed' : 'failed'}`);
                const checkIcon = safeCreateElement('div', `check-icon ${passed ? 'passed' : 'failed'}`);
                checkIcon.textContent = passed ? '✔' : '✖';
                
                const checkDesc = safeCreateElement('div', 'check-description');
                let description = `Test ${i + 1}: `;
                
                if (testCase.inputs.length > 0) {
                    description += `With input(s): [${testCase.inputs.map(i => `'${i}'`).join(', ')}]. `;
                }
                
                description += `Expected: <code>${testCase.expectedOutput.trim().replace(/\n/g, '\\n')}</code>. Got: <code>${actualOutput.trim().replace(/\n/g, '\\n')}</code>`;
                
                checkDesc.innerHTML = description;
                
                checkItem.appendChild(checkIcon);
                checkItem.appendChild(checkDesc);
                checksContainer.appendChild(checkItem);
            }
            
            if (allPassed) {
                showToast('All tests passed! Well done!', 'success');
                if (!appState.userProgress[appState.currentTaskId]?.completed) {
                    if (!appState.userProgress[appState.currentTaskId]) {
                        appState.userProgress[appState.currentTaskId] = { code: '', completed: false, theory: {} };
                    }
                    appState.userProgress[appState.currentTaskId].completed = true;
                    saveProgress();
                    const taskItem = document.getElementById(`task-item-${appState.currentTaskId}`);
                    if (taskItem) taskItem.classList.add('completed');
                    
                    awardXP(appState.currentTaskId, 'task');
                    
                    const section = task.section;
                    const sectionTasks = Object.keys(TASKS).filter(id => TASKS[id].section === section);
                    const completedInSection = sectionTasks.every(id => appState.userProgress[id]?.completed);
                    
                    if (completedInSection && !appState.completedSections[section]) {
                        appState.completedSections[section] = true;
                        localStorage.setItem('pythonProjectCompletedSections', JSON.stringify(appState.completedSections));
                        
                        const bonusXP = SECTION_COMPLETION_BONUS[section] || 50;
                        appState.xpData.totalXP += bonusXP;
                        showXPNotification(bonusXP, 'bonus');
                        showToast(`Section ${section} completed! +${bonusXP} bonus XP!`, 'success');
                        saveXPData();
                        updateXPDisplay();
                    }
                }
            } else {
                showToast('Some tests failed. Check your output matches exactly!', 'warning');
            }
            
        } catch (error) {
            errorBoundary.handle(error, { type: 'check-solution' });
        } finally {
            if (appState.pyodide) {
                 pyodide.runPython(`
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
    
    function checkTheoryAnswer(questionIndex, questionData) {
        const feedbackDiv = document.getElementById(`theory-feedback-${questionIndex}`);
        const answerDiv = document.getElementById(`theory-answer-${questionIndex}`);
        let isCorrect = false;
        let feedbackMessage = '';

        switch(questionData.type) {
            case 'multiple-choice':
                const optionsGroup = document.getElementById(`theory-options-${questionIndex}`);
                const selectedOption = optionsGroup.querySelector('.theory-option.selected');
                if (selectedOption) {
                    const selectedIndex = Array.from(optionsGroup.children).indexOf(selectedOption);
                    isCorrect = (selectedIndex === questionData.a);
                } else {
                    feedbackMessage = 'Please select an answer.';
                }
                break;
            
            case 'fill-in-the-blank':
                const blankInput = document.getElementById(`theory-input-${questionIndex}`).value;
                const userAnswer = normalizeAnswer(blankInput);
                const correctAnswer = normalizeAnswer(questionData.a);
                
                // Check for variations and common misspellings
                isCorrect = checkShortAnswer(userAnswer, correctAnswer, questionData.variations);
                
                if (blankInput.trim() === '') {
                    feedbackMessage = 'Please enter an answer.';
                }
                break;
            
            case 'short-answer':
                const textInput = document.getElementById(`theory-input-${questionIndex}`).value;
                
                // For longer answers, require minimum text length
                if (questionData.minLength && textInput.trim().length < questionData.minLength) {
                    feedbackMessage = `Please write a more detailed answer (at least ${questionData.minLength} characters).`;
                    break;
                }
                
                // Check for keywords in longer answers
                if (questionData.keywords) {
                    isCorrect = checkKeywords(textInput, questionData.keywords);
                    if (!isCorrect && textInput.trim().length > 0) {
                        feedbackMessage = 'Your answer is missing some key concepts. Try to include more specific details.';
                    }
                } else {
                    // For simple short answers, use forgiving comparison
                    const userShortAnswer = normalizeAnswer(textInput);
                    const correctShortAnswer = normalizeAnswer(questionData.a);
                    isCorrect = checkShortAnswer(userShortAnswer, correctShortAnswer, questionData.variations);
                }
                
                if (textInput.trim() === '') {
                    feedbackMessage = 'Please enter an answer.';
                }
                break;
        }

        feedbackDiv.innerHTML = '';
        
        if (feedbackMessage) {
            const feedbackText = safeCreateElement('span', 'incorrect');
            feedbackText.textContent = feedbackMessage;
            feedbackDiv.appendChild(feedbackText);
            return; // Don't show the answer yet
        }
        
        const feedbackText = safeCreateElement('span', isCorrect ? 'correct' : 'incorrect');
        feedbackText.textContent = isCorrect ? 'Correct! Well done!' : 'Not quite right. See the explanation below.';
        feedbackDiv.appendChild(feedbackText);

        if (isCorrect) {
            awardXP(questionIndex, 'theory');
            document.getElementById(`theory-q-${questionIndex}`).classList.add('correctly-answered');
        }
        
        answerDiv.classList.remove('hidden');
    }

    // Helper function to normalize answers for comparison
    function normalizeAnswer(answer) {
        return answer
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/[.,!?;:]/g, '') // Remove punctuation
            .replace(/^(a|an|the)\s+/i, ''); // Remove articles
    }

    // Helper function to check short answers with variations
    function checkShortAnswer(userAnswer, correctAnswer, variations = []) {
        // Direct match
        if (userAnswer === correctAnswer) return true;
        
        // Check variations
        if (variations && variations.length > 0) {
            for (const variation of variations) {
                if (userAnswer === normalizeAnswer(variation)) return true;
            }
        }
        
        // Check for common misspellings and variations
        // Allow for one character difference (typo tolerance)
        if (levenshteinDistance(userAnswer, correctAnswer) <= 1) return true;
        
        // Check if answer contains the correct answer (for compound words)
        if (userAnswer.includes(correctAnswer) || correctAnswer.includes(userAnswer)) return true;
        
        return false;
    }

    // Helper function to check for keywords in longer answers
    function checkKeywords(answer, keywords) {
        const normalizedAnswer = answer.toLowerCase();
        let matchedKeywords = 0;
        const requiredMatches = Math.ceil(keywords.length * 0.6); // Require 60% of keywords
        
        for (const keyword of keywords) {
            // Handle keyword phrases (can contain spaces)
            if (normalizedAnswer.includes(keyword.toLowerCase())) {
                matchedKeywords++;
            }
        }
        
        return matchedKeywords >= requiredMatches;
    }

    // Levenshtein distance for typo tolerance
    function levenshteinDistance(str1, str2) {
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

    function showHint() {
        if (!appState.currentTaskId) return;
        
        const task = TASKS[appState.currentTaskId];
        const hintBox = document.getElementById('hint-box');
        
        if (!task.hints || task.hints.length === 0) {
            hintBox.textContent = 'No hints available for this task.';
        } else {
            if (!appState.userProgress[appState.currentTaskId]) {
                appState.userProgress[appState.currentTaskId] = {};
            }
            const currentHintIndex = appState.userProgress[appState.currentTaskId].hintIndex || 0;
            appState.userProgress[appState.currentTaskId].hintIndex = 
                (currentHintIndex + 1) % task.hints.length;
            
            hintBox.innerHTML = '';
            const hintTitle = safeCreateElement('h4');
            hintTitle.textContent = `💡 Hint ${appState.userProgress[appState.currentTaskId].hintIndex + 1} of ${task.hints.length}`;
            const hintText = safeCreateElement('p', 'allow-select');
            hintText.textContent = task.hints[appState.userProgress[appState.currentTaskId].hintIndex];
            
            hintBox.appendChild(hintTitle);
            hintBox.appendChild(hintText);
            saveProgress();
        }
        hintBox.style.display = 'block';
    }
    
    function resetCode() {
        if (confirm('Are you sure you want to reset your code for this task? This cannot be undone.')) {
            appState.editor.setValue(TASKS[appState.currentTaskId].starterCode);
        }
    }
    
    function copyCode() {
        if (!appState.editor) return;
        
        const code = appState.editor.getValue();
        navigator.clipboard.writeText(code).then(
            () => showToast('Code copied to clipboard!', 'success'),
            () => showToast('Failed to copy code.', 'error')
        );
    }
    // Global clipboard utility
window.copyToClipboard = async function(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
        return true;
    } catch (err) {
        showToast('Failed to copy.', 'error');
        return false;
    }
};
    
    function exportSectionAnswers(sectionNum) {
        const sectionName = sectionNum == '6' ? 'Challenges' : `Section ${sectionNum}`;
        let content = `# Python Summer Project - ${sectionName} Answers\n\n`;
        let hasAnswers = false;
        
        const taskIds = Object.keys(TASKS).filter(id => TASKS[id].section == sectionNum).sort();

        for (const taskId of taskIds) {
            if (appState.userProgress[taskId]?.code) {
                const task = TASKS[taskId];
                const taskNumber = taskId.replace('-', '.');
                content += '\n# -----------------------------------------\n';
                content += `# TASK ${taskNumber} - ${task.title}\n`;
                content += '# -----------------------------------------\n\n';
                content += appState.userProgress[taskId].code + '\n\n';
                hasAnswers = true;
            }
        }
        
        if (!hasAnswers) {
            showToast(`No answers saved for ${sectionName} yet.`, 'warning');
            return;
        }
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = sectionNum == '6' ? 'challenges_answers.py' : `section_${sectionNum}_answers.py`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    function exportFullProgress() {
        const backup = {
            version: '1.1', // Incremented version for new structure
            timestamp: new Date().toISOString(),
            progress: appState.userProgress,
            xpData: appState.xpData,
            streakData: appState.streakData,
            completedSections: appState.completedSections
        };
        
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `python_project_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Full progress backup downloaded!', 'success');
    }
    
    function importFullProgress() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                const text = await file.text();
                const backup = JSON.parse(text);
                
                if (!backup.version || !backup.progress || !backup.xpData) {
                    throw new Error('Invalid backup file format');
                }
                
                if (confirm('This will replace all your current progress. Are you sure?')) {
                    appState.userProgress = backup.progress;
                    appState.xpData = backup.xpData;
                    appState.streakData = backup.streakData || { currentStreak: 0, longestStreak: 0, lastActiveDate: null, totalDaysActive: 0 };
                    appState.completedSections = backup.completedSections || {};

                    // Ensure new XP stores exist for backwards compatibility
                    if (!appState.xpData.taskXP) appState.xpData.taskXP = {};
                    if (!appState.xpData.theoryXP) appState.xpData.theoryXP = {};
                    
                    saveProgress();
                    saveXPData();
                    saveStreakData();
                    localStorage.setItem('pythonProjectCompletedSections', JSON.stringify(appState.completedSections));
                    
                    updateXPDisplay();
                    updateBadgeDisplay();
                    generateSidebar();
                    
                    showToast('Progress restored successfully!', 'success');
                    
                    if (appState.currentTaskId) {
                        switchTask(appState.currentTaskId);
                    }
                }
            } catch (error) {
                showToast('Failed to import backup file', 'error');
                console.error('Import error:', error);
            }
        };
        
        input.click();
    }
    
    // --- LOCAL STORAGE ---
    function saveProgress() {
        try {
            localStorage.setItem('pythonSummerProjectProgress', JSON.stringify(appState.userProgress));
            localStorage.setItem('pythonProjectLastSave', Date.now().toString());
        } catch (e) {
            console.error('Could not save progress to localStorage.', e);
        }
    }
    
    function loadProgress() {
        try {
            const saved = localStorage.getItem('pythonSummerProjectProgress');
            if (saved) {
                appState.userProgress = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Could not load progress from localStorage.', e);
            appState.userProgress = {};
        }
    }
    
    function checkBackupReminder() {
        const lastBackup = localStorage.getItem('pythonProjectLastBackup');
        const lastSave = localStorage.getItem('pythonProjectLastSave');
        
        if (!lastSave) return;
        
        const now = Date.now();
        const weekInMs = 7 * 24 * 60 * 60 * 1000;
        
        if (!lastBackup || (now - parseInt(lastBackup)) > weekInMs) {
            if (Object.keys(appState.userProgress).length > 5) {
                setTimeout(() => {
                    const reminder = document.getElementById('backup-reminder');
                    if (reminder) reminder.classList.add('show');
                }, 5000);
            }
        }
    }
    
    function exportFullProgressWithTracking() {
        exportFullProgress();
        localStorage.setItem('pythonProjectLastBackup', Date.now().toString());
        
        const reminder = document.getElementById('backup-reminder');
        if (reminder) reminder.classList.remove('show');
    }
    
    function showBackupModal() {
        const modal = document.getElementById('backup-modal');
        if (modal) {
            modal.style.display = 'block';
        }
    }
    
    function hideBackupModal() {
        const modal = document.getElementById('backup-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // --- INITIALIZATION ---
    async function main() {
        try {
            document.getElementById('loading-message').style.display = 'none';
            document.querySelector('.header').style.display = 'flex';
            document.querySelector('.main-container').style.display = 'grid';
            
            try {
                const testKey = '__localStorage_test__';
                localStorage.setItem(testKey, 'test');
                localStorage.removeItem(testKey);
            } catch (e) {
                const warningBox = safeCreateElement('div', 'error-message');
                warningBox.style.margin = '1rem';
                warningBox.innerHTML = '<strong>⚠️ Warning:</strong> Your browser is not saving data (possibly in private/incognito mode). Your progress will be lost when you close this tab. Please use normal browsing mode or download regular backups!';
                document.querySelector('.main-container').prepend(warningBox);
            }
            
            loadProgress();
            loadXPData();
            loadStreakData();
            loadCompletedSections();
            
            updateXPDisplay();
            updateBadgeDisplay();
            
            generateSidebar();
            
            const urlParams = new URLSearchParams(window.location.search);
            const taskIdFromUrl = urlParams.get('task');
            
            if (taskIdFromUrl && TASKS[taskIdFromUrl]) {
                switchTask(taskIdFromUrl);
            } else {
                showWelcomeMessage();
            }
            
            addManagedEventListener(document.getElementById('backup-btn'), 'click', exportFullProgressWithTracking);
            addManagedEventListener(document.getElementById('restore-btn'), 'click', importFullProgress);
            addManagedEventListener(document.getElementById('reminder-backup-btn'), 'click', exportFullProgressWithTracking);
            addManagedEventListener(document.getElementById('close-reminder'), 'click', () => {
                document.getElementById('backup-reminder').classList.remove('show');
            });
            addManagedEventListener(document.getElementById('modal-backup-btn'), 'click', () => {
                exportFullProgressWithTracking();
                hideBackupModal();
            });
            addManagedEventListener(document.getElementById('modal-skip-btn'), 'click', hideBackupModal);
            
            updateStreak();
            checkDailyBonus();
            checkBackupReminder();
            
            setTimeout(() => {
                if (Object.keys(appState.userProgress).length > 0) {
                    showBackupModal();
                }
            }, 1500);
            
            addManagedEventListener(window, 'click', (event) => {
                if (event.target === document.getElementById('backup-modal')) {
                    hideBackupModal();
                }
            });
            
        } catch (error) {
            errorBoundary.handle(error, { type: 'initialization' });
            showToast('Failed to initialize application', 'error');
        }
    }
    
    window.addEventListener('beforeunload', (e) => {
        if (Object.keys(appState.userProgress).length > 0) {
            e.preventDefault();
            e.returnValue = '';
        }
        removeAllEventListeners();
        if (appState.editor) {
            appState.editor.toTextArea();
        }
    });
    

    // Export useful functions for enhanced features
    window.showToast = showToast;
    window.TASKS = TASKS;
    window.appState = appState;
    window.ensurePyodideLoaded = ensurePyodideLoaded;
    window.saveXPData = saveXPData;
    window.updateXPDisplay = updateXPDisplay;
    window.main = main;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
    
})(); // End of IIFE