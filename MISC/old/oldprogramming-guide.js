// GCSE Programming Guide Module
// Educational guide for J277 Computer Science specification

const PROGRAMMING_GUIDE = {
    sections: [
        {
            id: 'fundamentals',
            title: '🌟 Programming Fundamentals',
            icon: '📚',
            topics: ['variables', 'data-types', 'input-output', 'comments']
        },
        {
            id: 'operators',
            title: '🔧 Operators',
            icon: '➕',
            topics: ['arithmetic', 'comparison', 'boolean']
        },
        {
            id: 'constructs',
            title: '🏗️ Programming Constructs',
            icon: '🔄',
            topics: ['sequence', 'selection', 'iteration']
        },
        {
            id: 'data-structures',
            title: '📊 Data Structures',
            icon: '📦',
            topics: ['lists-arrays', 'strings']
        },
        {
            id: 'subprograms',
            title: '🔨 Subprograms',
            icon: '⚙️',
            topics: ['functions', 'procedures', 'parameters']
        }
    ],
    
    content: {
        // FUNDAMENTALS
        'variables': {
            title: 'Variables and Constants',
            content: `
<h3>What are Variables?</h3>
<p>Variables are like labelled boxes that store data in your program. They can hold different types of information and their values can change during program execution.</p>

<div class="concept-box">
    <h4>🎯 Key Concept</h4>
    <p>A variable has three important properties:</p>
    <ul>
        <li><strong>Name</strong> - What we call it (e.g., age, score, username)</li>
        <li><strong>Value</strong> - What it stores (e.g., 15, 100, "Alice")</li>
        <li><strong>Type</strong> - What kind of data it holds (e.g., integer, string)</li>
    </ul>
</div>

<h4>Creating Variables</h4>
<div class="code-example">
    <pre><code># Creating variables
name = "Alice"          # String variable
age = 15               # Integer variable
height = 1.65          # Float variable
is_student = True      # Boolean variable

# You can change variable values
age = 16               # Now age is 16
name = "Bob"          # Now name is "Bob"</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Variable Naming Rules</h4>
<div class="rules-box">
    <p>✅ <strong>DO:</strong></p>
    <ul>
        <li>Start with a letter or underscore</li>
        <li>Use letters, numbers, and underscores</li>
        <li>Use descriptive names (player_score not ps)</li>
        <li>Use lowercase with underscores (snake_case)</li>
    </ul>
    <p>❌ <strong>DON'T:</strong></p>
    <ul>
        <li>Start with a number (3lives ❌)</li>
        <li>Use spaces (player score ❌)</li>
        <li>Use Python keywords (if, while, for ❌)</li>
        <li>Use special characters except _ (!@#$ ❌)</li>
    </ul>
</div>

<h4>Constants</h4>
<p>Constants are values that shouldn't change during program execution. In Python, we use UPPERCASE names to indicate constants:</p>

<div class="code-example">
    <pre><code># Constants (by convention)
PI = 3.14159
GRAVITY = 9.81
MAX_PLAYERS = 4
GAME_TITLE = "Space Adventure"

# These CAN be changed, but SHOULDN'T be
# The uppercase name warns other programmers</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<div class="practice-box">
    <h4>🎮 Try It Yourself!</h4>
    <p>Create variables for a game character:</p>
    <ol>
        <li>Character name (string)</li>
        <li>Health points (integer)</li>
        <li>Speed (float)</li>
        <li>Is alive (boolean)</li>
    </ol>
    <button class="btn btn-primary" onclick="openPlaygroundWithCode('# Create your game character variables here\\ncharacter_name = \\nhealth = \\nspeed = \\nis_alive = \\n\\n# Print them out\\nprint(f\"Character: {character_name}\")\\nprint(f\"Health: {health}\")\\nprint(f\"Speed: {speed}\")\\nprint(f\"Alive: {is_alive}\")')">Open in Playground</button>
</div>
`,
            quiz: [
                {
                    question: "Which of these is a valid variable name?",
                    options: ["2player", "player-2", "player_2", "player 2"],
                    correct: 2,
                    explanation: "player_2 is valid. Variable names can't start with numbers, contain hyphens, or have spaces."
                },
                {
                    question: "What's the difference between a variable and a constant?",
                    options: [
                        "Variables use lowercase, constants use uppercase",
                        "Variables can change value, constants shouldn't",
                        "Both A and B are correct",
                        "There is no difference"
                    ],
                    correct: 2,
                    explanation: "Both are correct! Constants use UPPERCASE names and their values shouldn't change."
                }
            ]
        },
        
        'data-types': {
            title: 'Data Types',
            content: `
<h3>Understanding Data Types</h3>
<p>Data types tell Python what kind of information we're storing. Each type has different properties and operations.</p>

<div class="concept-box">
    <h4>🎯 The Main Data Types</h4>
    <table class="data-types-table">
        <tr>
            <th>Type</th>
            <th>Python Name</th>
            <th>Example</th>
            <th>Used For</th>
        </tr>
        <tr>
            <td><strong>Integer</strong></td>
            <td>int</td>
            <td>42, -10, 0</td>
            <td>Whole numbers</td>
        </tr>
        <tr>
            <td><strong>Real/Float</strong></td>
            <td>float</td>
            <td>3.14, -0.5, 1.0</td>
            <td>Decimal numbers</td>
        </tr>
        <tr>
            <td><strong>String</strong></td>
            <td>str</td>
            <td>"Hello", 'Python'</td>
            <td>Text</td>
        </tr>
        <tr>
            <td><strong>Character</strong></td>
            <td>str (length 1)</td>
            <td>'A', '7', '!'</td>
            <td>Single character</td>
        </tr>
        <tr>
            <td><strong>Boolean</strong></td>
            <td>bool</td>
            <td>True, False</td>
            <td>Yes/No values</td>
        </tr>
    </table>
</div>

<h4>1. Integer (int)</h4>
<div class="code-example">
    <pre><code># Integers are whole numbers
age = 16
score = -50
temperature = 0

# Operations with integers
total = 10 + 5      # 15
difference = 20 - 8  # 12
product = 4 * 6     # 24
quotient = 15 // 3  # 5 (integer division)</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>2. Float (Real Numbers)</h4>
<div class="code-example">
    <pre><code># Floats have decimal points
height = 1.75
price = 19.99
pi = 3.14159

# Float operations
area = 3.14 * 5.0 * 5.0  # 78.5
average = (4.5 + 3.2 + 5.8) / 3  # 4.5</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>3. String (Text)</h4>
<div class="code-example">
    <pre><code># Strings store text
name = "Alice"
message = 'Hello, World!'
address = "123 Python Street"

# String operations
greeting = "Hello, " + name  # Concatenation
repeated = "Ha" * 3          # "HaHaHa"
length = len(name)           # 5</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>4. Boolean</h4>
<div class="code-example">
    <pre><code># Booleans are True or False
is_ready = True
game_over = False
is_valid = age >= 18  # Result depends on age

# Boolean operations
both_true = True and True      # True
either_true = True or False    # True
opposite = not True            # False</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Type Conversion (Casting)</h4>
<p>Sometimes you need to convert between types:</p>

<div class="code-example">
    <pre><code># Converting between types
# String to Integer
age_text = "16"
age_number = int(age_text)  # 16

# Integer to String
score = 100
score_text = str(score)  # "100"

# String to Float
price_text = "19.99"
price_number = float(price_text)  # 19.99

# Be careful!
# int("hello") would cause an error!</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<div class="warning-box">
    <h4>⚠️ Common Pitfall</h4>
    <p>The <code>input()</code> function ALWAYS returns a string, even if the user types a number!</p>
    <pre><code># Wrong way
age = input("Enter age: ")  # age is a string!
next_year = age + 1         # ERROR!

# Right way
age = int(input("Enter age: "))  # Convert to int
next_year = age + 1             # Works!</code></pre>
</div>

<div class="practice-box">
    <h4>🎮 Try It Yourself!</h4>
    <p>Create a program that asks for your name and age, then calculates when you'll be 100:</p>
    <button class="btn btn-primary" onclick="openPlaygroundWithCode('# Get user information\\nname = input(\"What\\'s your name? \")\\nage = int(input(\"How old are you? \"))\\n\\n# Calculate years until 100\\nyears_to_100 = 100 - age\\n\\n# Display result\\nprint(f\"Hi {name}!\")\\nprint(f\"You\\'ll be 100 in {years_to_100} years!\")')">Open in Playground</button>
</div>
`,
            quiz: [
                {
                    question: "What data type would you use to store a person's height in meters?",
                    options: ["int", "float", "str", "bool"],
                    correct: 1,
                    explanation: "Float is best for height because it can store decimal values like 1.75 meters."
                },
                {
                    question: "What will happen if you try: age = '25' + 1",
                    options: [
                        "age will be 26",
                        "age will be '251'",
                        "You'll get a TypeError",
                        "age will be 25"
                    ],
                    correct: 2,
                    explanation: "You can't add a string and an integer. You need to convert the string to int first."
                }
            ]
        },
        
        'input-output': {
            title: 'Input and Output',
            content: `
<h3>Input and Output (I/O)</h3>
<p>Programs need to communicate with users. Input gets information FROM the user, output sends information TO the user.</p>

<div class="concept-box">
    <h4>🎯 Key Functions</h4>
    <ul>
        <li><code>input()</code> - Gets text from the user</li>
        <li><code>print()</code> - Displays information to the user</li>
    </ul>
</div>

<h4>Output with print()</h4>
<div class="code-example">
    <pre><code># Basic printing
print("Hello, World!")
print("Welcome to Python")

# Printing variables
name = "Alice"
age = 16
print(name)
print(age)

# Printing multiple items
print("Name:", name, "Age:", age)

# Using f-strings (formatted strings)
print(f"Hello, {name}! You are {age} years old.")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Different Ways to Format Output</h4>
<div class="code-example">
    <pre><code># Method 1: Comma separation
score = 95
print("Your score is", score)  # Your score is 95

# Method 2: String concatenation
print("Your score is " + str(score))  # Your score is 95

# Method 3: f-strings (RECOMMENDED!)
print(f"Your score is {score}")  # Your score is 95

# f-strings can do calculations
print(f"Double score: {score * 2}")  # Double score: 190</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Input with input()</h4>
<div class="code-example">
    <pre><code># Basic input
name = input("What's your name? ")
print(f"Hello, {name}!")

# Input with type conversion
age = int(input("How old are you? "))
next_year = age + 1
print(f"Next year you'll be {next_year}")

# Getting float input
height = float(input("Enter your height in meters: "))
print(f"You are {height}m tall")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Special Print Options</h4>
<div class="code-example">
    <pre><code># Print without newline
print("Hello", end="")
print("World")  # Output: HelloWorld

# Print with custom separator
print("A", "B", "C", sep="-")  # Output: A-B-C

# Print multiple lines
print("""This is
a multi-line
message""")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<div class="tip-box">
    <h4>💡 Pro Tips</h4>
    <ul>
        <li>Always add a space at the end of input prompts: <code>input("Name: ")</code></li>
        <li>Use descriptive prompts: <code>input("Enter temperature in Celsius: ")</code></li>
        <li>Validate input when needed (check if it's the right type/range)</li>
    </ul>
</div>

<h4>Common Input Patterns</h4>
<div class="code-example">
    <pre><code># Getting multiple inputs
first_name = input("First name: ")
last_name = input("Last name: ")
full_name = first_name + " " + last_name

# Getting a list of numbers
numbers = input("Enter 3 numbers separated by spaces: ")
# If user enters: "10 20 30"
num_list = numbers.split()  # ["10", "20", "30"]

# Safe input with error handling
try:
    age = int(input("Enter your age: "))
except ValueError:
    print("That's not a valid number!")
    age = 0</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<div class="practice-box">
    <h4>🎮 Try It Yourself!</h4>
    <p>Create a simple calculator that gets two numbers and shows their sum, difference, product, and quotient:</p>
    <button class="btn btn-primary" onclick="openPlaygroundWithCode('# Simple Calculator\\nprint(\"=== Simple Calculator ===\")\\n\\n# Get input\\nnum1 = float(input(\"Enter first number: \"))\\nnum2 = float(input(\"Enter second number: \"))\\n\\n# Calculate\\nsum_result = num1 + num2\\ndiff = num1 - num2\\nproduct = num1 * num2\\nquotient = num1 / num2\\n\\n# Display results\\nprint(f\"\\n{num1} + {num2} = {sum_result}\")\\nprint(f\"{num1} - {num2} = {diff}\")\\nprint(f\"{num1} × {num2} = {product}\")\\nprint(f\"{num1} ÷ {num2} = {quotient}\")')">Open in Playground</button>
</div>
`,
            quiz: [
                {
                    question: "What type of data does input() always return?",
                    options: ["int", "float", "str", "Depends on what the user types"],
                    correct: 2,
                    explanation: "input() ALWAYS returns a string, even if the user types numbers."
                },
                {
                    question: "Which is the best way to print a variable's value with text?",
                    options: [
                        'print("Score:", score)',
                        'print("Score: " + str(score))',
                        'print(f"Score: {score}")',
                        "All are equally good"
                    ],
                    correct: 2,
                    explanation: "f-strings are the most readable and efficient way to format output in modern Python."
                }
            ]
        },
        
        'comments': {
            title: 'Comments',
            content: `
<h3>Comments in Python</h3>
<p>Comments are notes for humans that Python ignores. They make your code easier to understand!</p>

<div class="concept-box">
    <h4>🎯 Why Use Comments?</h4>
    <ul>
        <li>Explain what your code does</li>
        <li>Leave notes for your future self</li>
        <li>Help other programmers understand your code</li>
        <li>Temporarily disable code for testing</li>
    </ul>
</div>

<h4>Single-Line Comments</h4>
<div class="code-example">
    <pre><code># This is a comment - Python ignores this line
name = "Alice"  # You can also put comments at the end

# Use comments to explain complex code
# Calculate the area of a circle
radius = 5
area = 3.14159 * radius ** 2  # pi × r²</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Multi-Line Comments</h4>
<div class="code-example">
    <pre><code># For multiple lines, use multiple # symbols
# This program calculates the average
# of three test scores and determines
# if the student passed or failed

# Or use triple quotes (technically a string)
"""
This is a multi-line comment.
It can span several lines.
Python treats it as a string but ignores it
if it's not assigned to a variable.
"""</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Good Commenting Practices</h4>
<div class="rules-box">
    <p>✅ <strong>GOOD Comments:</strong></p>
    <pre><code># Calculate discount for bulk orders over 100 items
if quantity > 100:
    discount = 0.15  # 15% discount
    
# Convert Celsius to Fahrenheit using formula: F = C × 9/5 + 32
fahrenheit = celsius * 9/5 + 32</code></pre>
    
    <p>❌ <strong>BAD Comments:</strong></p>
    <pre><code># Set x to 5
x = 5  # This is obvious!

# Increment counter
counter = counter + 1  # The code already says this!</code></pre>
</div>

<h4>Using Comments for Program Headers</h4>
<div class="code-example">
    <pre><code>"""
Program: Grade Calculator
Author: Your Name
Date: June 2024
Description: This program calculates the average
            of test scores and assigns a grade.
"""

# Main program starts here
print("Welcome to Grade Calculator")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Comments for Debugging</h4>
<div class="code-example">
    <pre><code># You can "comment out" code to test
score = 85
# bonus = 10  # Temporarily disabled
# score = score + bonus

print(f"Final score: {score}")

# TODO comments for future work
# TODO: Add input validation
# TODO: Handle negative scores
# FIXME: Division by zero error when no tests</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<div class="tip-box">
    <h4>💡 Comment Guidelines</h4>
    <ul>
        <li>Comment WHY, not WHAT (the code shows what)</li>
        <li>Keep comments up-to-date when you change code</li>
        <li>Use clear, simple language</li>
        <li>Don't over-comment obvious code</li>
        <li>Use TODO/FIXME for future improvements</li>
    </ul>
</div>

<div class="practice-box">
    <h4>🎮 Try It Yourself!</h4>
    <p>Add helpful comments to this temperature converter:</p>
    <button class="btn btn-primary" onclick="openPlaygroundWithCode('# Add comments to explain this program\\n\\ntemp = float(input(\"Temperature in C: \"))\\n\\nf = temp * 9/5 + 32\\nk = temp + 273.15\\n\\nprint(f\"{temp}°C = {f}°F\")\\nprint(f\"{temp}°C = {k}K\")')">Open in Playground</button>
</div>
`,
            quiz: [
                {
                    question: "Which symbol starts a single-line comment in Python?",
                    options: ["//", "#", "/*", "--"],
                    correct: 1,
                    explanation: "The # symbol starts a single-line comment in Python."
                },
                {
                    question: "What's the main purpose of comments?",
                    options: [
                        "To make the program run faster",
                        "To explain code to humans",
                        "To fix errors",
                        "To create variables"
                    ],
                    correct: 1,
                    explanation: "Comments are for humans to understand the code. Python ignores them completely."
                }
            ]
        },
        
        // OPERATORS
        'arithmetic': {
            title: 'Arithmetic Operators',
            content: `
<h3>Arithmetic Operators</h3>
<p>Arithmetic operators perform mathematical calculations. Python provides all the basic operations plus some special ones!</p>

<div class="concept-box">
    <h4>🎯 The Arithmetic Operators</h4>
    <table class="operators-table">
        <tr>
            <th>Operator</th>
            <th>Name</th>
            <th>Example</th>
            <th>Result</th>
        </tr>
        <tr>
            <td><code>+</code></td>
            <td>Addition</td>
            <td>10 + 3</td>
            <td>13</td>
        </tr>
        <tr>
            <td><code>-</code></td>
            <td>Subtraction</td>
            <td>10 - 3</td>
            <td>7</td>
        </tr>
        <tr>
            <td><code>*</code></td>
            <td>Multiplication</td>
            <td>10 * 3</td>
            <td>30</td>
        </tr>
        <tr>
            <td><code>/</code></td>
            <td>Division</td>
            <td>10 / 3</td>
            <td>3.333...</td>
        </tr>
        <tr>
            <td><code>//</code></td>
            <td>Integer Division</td>
            <td>10 // 3</td>
            <td>3</td>
        </tr>
        <tr>
            <td><code>%</code></td>
            <td>Modulus (Remainder)</td>
            <td>10 % 3</td>
            <td>1</td>
        </tr>
        <tr>
            <td><code>**</code></td>
            <td>Exponentiation (Power)</td>
            <td>10 ** 3</td>
            <td>1000</td>
        </tr>
    </table>
</div>

<h4>Basic Operations</h4>
<div class="code-example">
    <pre><code># Addition and Subtraction
total = 25 + 17      # 42
difference = 100 - 37 # 63
change = -5 + 8      # 3

# Multiplication
area = 15 * 8        # 120
double = 2 * 45      # 90
percentage = 0.15 * 200  # 30.0</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Division Types</h4>
<div class="code-example">
    <pre><code># Regular division (always gives float)
result1 = 10 / 2     # 5.0 (not 5!)
result2 = 15 / 4     # 3.75

# Integer division (rounds down)
result3 = 15 // 4    # 3
result4 = 20 // 6    # 3
result5 = -15 // 4   # -4 (rounds DOWN, not towards 0)</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>The Modulus Operator (%)</h4>
<p>Modulus gives the remainder after division. Very useful for many problems!</p>

<div class="code-example">
    <pre><code># Basic modulus
print(17 % 5)    # 2 (17 ÷ 5 = 3 remainder 2)
print(20 % 6)    # 2 (20 ÷ 6 = 3 remainder 2)
print(15 % 3)    # 0 (divides evenly)

# Practical uses
# Check if even or odd
number = 24
if number % 2 == 0:
    print("Even")
else:
    print("Odd")

# Get last digit
last_digit = 12345 % 10  # 5

# Check divisibility
if year % 4 == 0:
    print("Might be a leap year")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Exponentiation (**)</h4>
<div class="code-example">
    <pre><code># Powers
squared = 5 ** 2     # 25
cubed = 3 ** 3      # 27
power_of_10 = 10 ** 4  # 10000

# Square roots (power of 0.5)
square_root = 9 ** 0.5   # 3.0
cube_root = 27 ** (1/3)  # 3.0</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Order of Operations (BIDMAS/PEMDAS)</h4>
<div class="concept-box">
    <p>Python follows mathematical order of operations:</p>
    <ol>
        <li><strong>B</strong>rackets (Parentheses)</li>
        <li><strong>I</strong>ndices (Exponents) **</li>
        <li><strong>D</strong>ivision and <strong>M</strong>ultiplication (left to right)</li>
        <li><strong>A</strong>ddition and <strong>S</strong>ubtraction (left to right)</li>
    </ol>
</div>

<div class="code-example">
    <pre><code># Without brackets
result1 = 2 + 3 * 4      # 14 (not 20!)
result2 = 10 - 6 / 2     # 7.0 (not 2!)
result3 = 2 ** 3 * 4     # 32 (8 * 4)

# With brackets to change order
result4 = (2 + 3) * 4    # 20
result5 = (10 - 6) / 2   # 2.0
result6 = 2 ** (3 * 4)   # 4096</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Common Calculations</h4>
<div class="code-example">
    <pre><code># Average of numbers
num1, num2, num3 = 85, 92, 78
average = (num1 + num2 + num3) / 3  # 85.0

# Percentage calculation
score = 42
total = 50
percentage = (score / total) * 100  # 84.0

# Temperature conversion
celsius = 25
fahrenheit = celsius * 9/5 + 32  # 77.0

# Circle calculations
radius = 5
pi = 3.14159
area = pi * radius ** 2  # 78.54
circumference = 2 * pi * radius  # 31.42</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<div class="practice-box">
    <h4>🎮 Try It Yourself!</h4>
    <p>Create a program that calculates how to share sweets fairly:</p>
    <button class="btn btn-primary" onclick="openPlaygroundWithCode('# Sweet Sharing Calculator\\nprint(\"=== Sweet Sharing Calculator ===\")\\n\\n# Get input\\nsweets = int(input(\"How many sweets? \"))\\nchildren = int(input(\"How many children? \"))\\n\\n# Calculate fair share\\nper_child = sweets // children\\nleftover = sweets % children\\n\\n# Display results\\nprint(f\"\\nEach child gets: {per_child} sweets\")\\nprint(f\"Sweets left over: {leftover}\")\\n\\n# Extra challenge: What if we give out the leftovers?\\nif leftover > 0:\\n    print(f\"\\n{leftover} children will get 1 extra sweet!\")')">Open in Playground</button>
</div>
`,
            quiz: [
                {
                    question: "What is the result of 17 % 5?",
                    options: ["3.4", "3", "2", "85"],
                    correct: 2,
                    explanation: "17 ÷ 5 = 3 remainder 2. The modulus operator returns the remainder."
                },
                {
                    question: "What is the result of 2 + 3 * 4?",
                    options: ["20", "14", "24", "11"],
                    correct: 1,
                    explanation: "Following BIDMAS, multiplication happens first: 3 * 4 = 12, then 2 + 12 = 14"
                }
            ]
        },
        
        'comparison': {
            title: 'Comparison Operators',
            content: `
<h3>Comparison Operators</h3>
<p>Comparison operators compare two values and return a Boolean result (True or False). They're essential for making decisions in your programs!</p>

<div class="concept-box">
    <h4>🎯 The Comparison Operators</h4>
    <table class="operators-table">
        <tr>
            <th>Operator</th>
            <th>Meaning</th>
            <th>Example</th>
            <th>Result</th>
        </tr>
        <tr>
            <td><code>==</code></td>
            <td>Equal to</td>
            <td>5 == 5</td>
            <td>True</td>
        </tr>
        <tr>
            <td><code>!=</code></td>
            <td>Not equal to</td>
            <td>5 != 3</td>
            <td>True</td>
        </tr>
        <tr>
            <td><code>&lt;</code></td>
            <td>Less than</td>
            <td>3 &lt; 5</td>
            <td>True</td>
        </tr>
        <tr>
            <td><code>&gt;</code></td>
            <td>Greater than</td>
            <td>5 &gt; 3</td>
            <td>True</td>
        </tr>
        <tr>
            <td><code>&lt;=</code></td>
            <td>Less than or equal to</td>
            <td>5 &lt;= 5</td>
            <td>True</td>
        </tr>
        <tr>
            <td><code>&gt;=</code></td>
            <td>Greater than or equal to</td>
            <td>3 &gt;= 5</td>
            <td>False</td>
        </tr>
    </table>
</div>

<h4>Basic Comparisons</h4>
<div class="code-example">
    <pre><code># Comparing numbers
print(10 > 5)      # True
print(7 < 3)       # False
print(15 == 15)    # True
print(20 != 20)    # False

# Comparing variables
age = 16
voting_age = 18
can_vote = age >= voting_age  # False

score = 85
passing_score = 60
passed = score >= passing_score  # True</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<div class="warning-box">
    <h4>⚠️ Common Mistake: = vs ==</h4>
    <pre><code># WRONG - This assigns 5 to x!
if x = 5:  # SyntaxError!
    print("x is 5")

# RIGHT - This compares x with 5
if x == 5:
    print("x is 5")</code></pre>
    <p>Remember: <code>=</code> assigns values, <code>==</code> compares values!</p>
</div>

<h4>Comparing Different Types</h4>
<div class="code-example">
    <pre><code># Comparing strings (alphabetical order)
print("apple" < "banana")    # True (a comes before b)
print("Apple" < "apple")     # True (capitals come first)
print("cat" == "cat")        # True
print("Cat" == "cat")        # False (case sensitive!)

# Comparing string lengths
name1 = "Alice"
name2 = "Bob"
print(len(name1) > len(name2))  # True (5 > 3)

# Mixed types (be careful!)
print("5" == 5)    # False (string vs integer)
print(5 == 5.0)    # True (int vs float is OK)</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Using Comparisons in Programs</h4>
<div class="code-example">
    <pre><code># Password checker
password = input("Enter password: ")
if password == "secret123":
    print("Access granted!")
else:
    print("Access denied!")

# Grade boundaries
mark = int(input("Enter your mark: "))
if mark >= 90:
    grade = "A*"
elif mark >= 80:
    grade = "A"
elif mark >= 70:
    grade = "B"
elif mark >= 60:
    grade = "C"
else:
    grade = "F"
print(f"Your grade: {grade}")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Chaining Comparisons</h4>
<p>Python allows you to chain comparisons in a natural way:</p>

<div class="code-example">
    <pre><code># Check if value is in range
age = 15
is_teenager = 13 <= age <= 19  # True

# Same as:
is_teenager = age >= 13 and age <= 19

# Temperature ranges
temp = 22
is_comfortable = 18 <= temp <= 25  # True

# Validate test scores
score = int(input("Enter score (0-100): "))
if 0 <= score <= 100:
    print("Valid score")
else:
    print("Score must be between 0 and 100")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Practical Examples</h4>
<div class="code-example">
    <pre><code># Ticket pricing
age = int(input("Enter your age: "))
if age < 5:
    price = 0  # Free for under 5s
elif age <= 16:
    price = 5  # Child price
elif age >= 65:
    price = 7  # Senior price
else:
    price = 10  # Adult price
    
print(f"Ticket price: £{price}")

# Username validation
username = input("Choose username: ")
if len(username) < 3:
    print("Too short! Must be at least 3 characters")
elif len(username) > 20:
    print("Too long! Maximum 20 characters")
else:
    print("Username accepted!")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<div class="practice-box">
    <h4>🎮 Try It Yourself!</h4>
    <p>Create a number guessing game that tells the player if their guess is too high, too low, or correct:</p>
    <button class="btn btn-primary" onclick="openPlaygroundWithCode('# Number Guessing Game\\nprint(\"=== Guess the Number ===\")\\nprint(\"I\\'m thinking of a number between 1 and 100\")\\n\\n# Secret number\\nsecret = 42\\n\\n# Get player\\'s guess\\nguess = int(input(\"Your guess: \"))\\n\\n# Compare and give feedback\\nif guess < secret:\\n    print(\"Too low! Try a higher number.\")\\nelif guess > secret:\\n    print(\"Too high! Try a lower number.\")\\nelse:\\n    print(\"🎉 Correct! You got it!\")\\n\\n# Show how far off they were\\ndifference = abs(guess - secret)\\nprint(f\"You were {difference} away from the answer.\")')">Open in Playground</button>
</div>
`,
            quiz: [
                {
                    question: "What is the result of 'apple' < 'banana'?",
                    options: ["True", "False", "Error", "None"],
                    correct: 0,
                    explanation: "String comparison works alphabetically. 'a' comes before 'b', so 'apple' < 'banana' is True."
                },
                {
                    question: "Which operator checks if two values are NOT equal?",
                    options: ["<>", "!=", "==", "~="],
                    correct: 1,
                    explanation: "The != operator means 'not equal to' in Python."
                }
            ]
        },
        
        'boolean': {
            title: 'Boolean Operators',
            content: `
<h3>Boolean Operators (Logical Operators)</h3>
<p>Boolean operators combine or modify Boolean values (True/False). They help you create complex conditions!</p>

<div class="concept-box">
    <h4>🎯 The Boolean Operators</h4>
    <table class="operators-table">
        <tr>
            <th>Operator</th>
            <th>Meaning</th>
            <th>Example</th>
            <th>Result</th>
        </tr>
        <tr>
            <td><code>and</code></td>
            <td>Both must be True</td>
            <td>True and True</td>
            <td>True</td>
        </tr>
        <tr>
            <td><code>or</code></td>
            <td>At least one must be True</td>
            <td>True or False</td>
            <td>True</td>
        </tr>
        <tr>
            <td><code>not</code></td>
            <td>Reverses the Boolean</td>
            <td>not True</td>
            <td>False</td>
        </tr>
    </table>
</div>

<h4>The AND Operator</h4>
<p>Both conditions must be True for the result to be True:</p>

<div class="code-example">
    <pre><code># AND truth table
print(True and True)    # True
print(True and False)   # False
print(False and True)   # False
print(False and False)  # False

# Practical examples
age = 16
has_permission = True

# Both conditions must be true
can_go = age >= 15 and has_permission  # True

# Multiple conditions
temperature = 22
is_sunny = True
is_weekend = True
perfect_picnic = temperature > 20 and is_sunny and is_weekend</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>The OR Operator</h4>
<p>At least one condition must be True for the result to be True:</p>

<div class="code-example">
    <pre><code># OR truth table
print(True or True)     # True
print(True or False)    # True
print(False or True)    # True
print(False or False)   # False

# Practical examples
day = "Saturday"
is_holiday = False

# Either condition can be true
day_off = day == "Saturday" or day == "Sunday" or is_holiday

# Student discount eligibility
age = 19
has_student_id = True
gets_discount = age <= 18 or has_student_id  # True</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>The NOT Operator</h4>
<p>Reverses a Boolean value:</p>

<div class="code-example">
    <pre><code># NOT examples
print(not True)   # False
print(not False)  # True

# Practical uses
is_raining = False
is_dry = not is_raining  # True

# Checking for invalid input
password = ""
is_invalid = not password  # True (empty string is "falsy")

# Common pattern
logged_in = False
if not logged_in:
    print("Please log in first!")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Combining Operators</h4>
<p>You can combine operators to create complex conditions:</p>

<div class="code-example">
    <pre><code># Complex conditions
age = 17
has_license = True
is_insured = True

can_drive = age >= 17 and has_license and is_insured

# Mixing AND and OR (use parentheses!)
# Without parentheses - AND is evaluated first
is_weekend = True
is_holiday = False
has_homework = True
can_play = is_weekend or is_holiday and not has_homework  # True

# With parentheses - clearer logic
can_play = (is_weekend or is_holiday) and not has_homework  # False</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Operator Precedence</h4>
<div class="concept-box">
    <p>Order of evaluation (highest to lowest):</p>
    <ol>
        <li><code>not</code></li>
        <li><code>and</code></li>
        <li><code>or</code></li>
    </ol>
    <p>Use parentheses to make your intention clear!</p>
</div>

<h4>Real-World Examples</h4>
<div class="code-example">
    <pre><code># Theme park ride restrictions
height = 140  # cm
age = 12
has_adult = True

# Must be tall enough AND (old enough OR with adult)
can_ride = height >= 120 and (age >= 14 or has_adult)

# Password validation
password = input("Create password: ")
is_long_enough = len(password) >= 8
has_number = any(char.isdigit() for char in password)
has_letter = any(char.isalpha() for char in password)

is_valid = is_long_enough and has_number and has_letter

if not is_valid:
    print("Password must be 8+ characters with letters and numbers")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Short-Circuit Evaluation</h4>
<p>Python is smart! It stops evaluating as soon as it knows the answer:</p>

<div class="code-example">
    <pre><code># With AND - stops at first False
# If age < 18, it won't even check has_id
age = 16
has_id = True
if age >= 18 and has_id:
    print("Can enter")

# With OR - stops at first True
# If it's Saturday, it won't check if it's Sunday
day = "Saturday"
if day == "Saturday" or day == "Sunday":
    print("It's the weekend!")

# This prevents errors
name = ""
# Without short-circuit, this would error on empty string
if name and name[0].isupper():
    print("Name starts with capital")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<div class="practice-box">
    <h4>🎮 Try It Yourself!</h4>
    <p>Create a game access checker that validates multiple conditions:</p>
    <button class="btn btn-primary" onclick="openPlaygroundWithCode('# Game Access Checker\\nprint(\"=== Online Game Access ===\")\\n\\n# Get player info\\nage = int(input(\"Your age: \"))\\nhas_permission = input(\"Parent permission? (yes/no): \") == \"yes\"\\nis_subscribed = input(\"Active subscription? (yes/no): \") == \"yes\"\\nhours_played_today = int(input(\"Hours played today: \"))\\n\\n# Check conditions\\nage_ok = age >= 13 or (age >= 10 and has_permission)\\ntime_ok = hours_played_today < 3\\ncan_play = age_ok and is_subscribed and time_ok\\n\\n# Give feedback\\nprint(\"\\n--- Access Check Results ---\")\\nprint(f\"Age requirement: {\'✓\' if age_ok else \'✗\'}\")\\nprint(f\"Subscription: {\'✓\' if is_subscribed else \'✗\'}\")\\nprint(f\"Time limit: {\'✓\' if time_ok else \'✗\'}\")\\nprint(f\"\\nAccess: {\'GRANTED\' if can_play else \'DENIED\'}\")')">Open in Playground</button>
</div>
`,
            quiz: [
                {
                    question: "What is the result of: True and False or True?",
                    options: ["True", "False", "Error", "None"],
                    correct: 0,
                    explanation: "AND is evaluated first: True and False = False. Then: False or True = True."
                },
                {
                    question: "When does 'x and y' return True?",
                    options: [
                        "When x is True",
                        "When y is True",
                        "When both x and y are True",
                        "When either x or y is True"
                    ],
                    correct: 2,
                    explanation: "The AND operator requires BOTH conditions to be True."
                }
            ]
        },
        
        // CONSTRUCTS
        'sequence': {
            title: 'Sequence',
            content: `
<h3>Sequence - The Foundation of Programming</h3>
<p>Sequence is the simplest programming construct. It means executing instructions one after another, in order, from top to bottom.</p>

<div class="concept-box">
    <h4>🎯 What is Sequence?</h4>
    <p>Imagine following a recipe:</p>
    <ol>
        <li>Get ingredients</li>
        <li>Mix ingredients</li>
        <li>Bake in oven</li>
        <li>Let cool</li>
        <li>Serve</li>
    </ol>
    <p>You MUST do these steps in order - that's sequence!</p>
</div>

<h4>How Python Executes Code</h4>
<div class="code-example">
    <pre><code># Python runs each line in order
print("Step 1: Starting program")    # Runs 1st
name = input("Enter your name: ")     # Runs 2nd
print(f"Step 3: Hello, {name}")       # Runs 3rd
age = int(input("Enter your age: "))  # Runs 4th
print(f"Step 5: You are {age}")       # Runs 5th
print("Step 6: Program complete")     # Runs 6th</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Order Matters!</h4>
<div class="code-example">
    <pre><code># ❌ WRONG ORDER - This will error!
print(f"Hello, {name}")  # Error: name doesn't exist yet!
name = "Alice"

# ✅ CORRECT ORDER
name = "Alice"
print(f"Hello, {name}")  # Works: name exists now

# ❌ WRONG - Using before calculating
print(f"Total: {total}")  # Error: total doesn't exist
price = 10
tax = 2
total = price + tax

# ✅ CORRECT - Calculate first, then use
price = 10
tax = 2
total = price + tax
print(f"Total: {total}")  # Works: total has been calculated</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Building a Program Step-by-Step</h4>
<p>Let's build a simple calculator program showing sequence:</p>

<div class="code-example">
    <pre><code># Temperature Converter - Sequential Steps

# Step 1: Display title
print("=== Temperature Converter ===")
print()

# Step 2: Get input from user
celsius = float(input("Enter temperature in Celsius: "))

# Step 3: Perform calculations
fahrenheit = celsius * 9/5 + 32
kelvin = celsius + 273.15

# Step 4: Display results
print()
print("Conversion Results:")
print(f"Celsius: {celsius}°C")
print(f"Fahrenheit: {fahrenheit}°F")
print(f"Kelvin: {kelvin}K")

# Step 5: End message
print()
print("Thank you for using the converter!")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Common Sequence Patterns</h4>
<div class="code-example">
    <pre><code># INPUT → PROCESS → OUTPUT pattern
# 1. INPUT: Get data
length = float(input("Rectangle length: "))
width = float(input("Rectangle width: "))

# 2. PROCESS: Calculate
area = length * width
perimeter = 2 * (length + width)

# 3. OUTPUT: Show results
print(f"Area: {area}")
print(f"Perimeter: {perimeter}")

# INITIALIZE → MODIFY → USE pattern
# 1. INITIALIZE: Create variables
total = 0
count = 0

# 2. MODIFY: Change values
total = total + 85
count = count + 1
total = total + 92
count = count + 1

# 3. USE: Work with final values
average = total / count
print(f"Average: {average}")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Planning Your Sequence</h4>
<div class="tip-box">
    <h4>💡 Before Coding, Plan Your Steps:</h4>
    <ol>
        <li><strong>What inputs do I need?</strong> Get these first</li>
        <li><strong>What calculations/processing?</strong> Do these next</li>
        <li><strong>What output should I show?</strong> Display last</li>
    </ol>
    <p>Write comments for your steps before adding code!</p>
</div>

<div class="code-example">
    <pre><code># Shopping Bill Calculator - Planned with comments

# 1. Get prices for three items
# 2. Calculate subtotal
# 3. Calculate tax (20%)
# 4. Calculate final total
# 5. Display itemized bill

# Now fill in the code:
print("=== Shopping Bill Calculator ===")

# 1. Get prices for three items
item1 = float(input("Price of item 1: £"))
item2 = float(input("Price of item 2: £"))
item3 = float(input("Price of item 3: £"))

# 2. Calculate subtotal
subtotal = item1 + item2 + item3

# 3. Calculate tax (20%)
tax = subtotal * 0.20

# 4. Calculate final total
total = subtotal + tax

# 5. Display itemized bill
print("\n--- Your Bill ---")
print(f"Item 1: £{item1:.2f}")
print(f"Item 2: £{item2:.2f}")
print(f"Item 3: £{item3:.2f}")
print(f"Subtotal: £{subtotal:.2f}")
print(f"Tax (20%): £{tax:.2f}")
print(f"Total: £{total:.2f}")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<div class="practice-box">
    <h4>🎮 Try It Yourself!</h4>
    <p>Create a BMI calculator that follows a clear sequence:</p>
    <button class="btn btn-primary" onclick="openPlaygroundWithCode('# BMI Calculator - Follow the sequence!\\n\\n# Step 1: Display welcome message\\nprint(\"=== BMI Calculator ===\")\\nprint(\"Body Mass Index helps assess healthy weight\\n\")\\n\\n# Step 2: Get user input\\n# Get weight in kg\\n# Get height in meters\\n\\n# Step 3: Calculate BMI\\n# Formula: BMI = weight / (height * height)\\n\\n# Step 4: Determine category\\n# Under 18.5: Underweight\\n# 18.5-24.9: Normal\\n# 25-29.9: Overweight\\n# 30+: Obese\\n\\n# Step 5: Display results\\n# Show BMI value\\n# Show category\\n\\n# Fill in the code for each step!')">Open in Playground</button>
</div>
`,
            quiz: [
                {
                    question: "What happens if you try to use a variable before creating it?",
                    options: [
                        "Python creates it automatically",
                        "It uses a default value",
                        "You get a NameError",
                        "Nothing happens"
                    ],
                    correct: 2,
                    explanation: "You must create (define) a variable before using it. Python executes code in sequence."
                },
                {
                    question: "What is the correct order for a calculation program?",
                    options: [
                        "Output → Input → Process",
                        "Input → Process → Output",
                        "Process → Input → Output",
                        "The order doesn't matter"
                    ],
                    correct: 1,
                    explanation: "First get input, then process/calculate, finally show output. This is the standard sequence."
                }
            ]
        },
        
        'selection': {
            title: 'Selection (IF Statements)',
            content: `
<h3>Selection - Making Decisions</h3>
<p>Selection allows your program to make decisions and choose different paths based on conditions. It's like a choose-your-own-adventure book!</p>

<div class="concept-box">
    <h4>🎯 What is Selection?</h4>
    <p>Selection lets your program ask questions and act differently based on the answers:</p>
    <ul>
        <li><strong>IF</strong> it's raining → take an umbrella</li>
        <li><strong>IF</strong> password is correct → allow access, <strong>ELSE</strong> → deny access</li>
        <li><strong>IF</strong> score ≥ 90 → grade A, <strong>ELIF</strong> score ≥ 80 → grade B...</li>
    </ul>
</div>

<h4>The IF Statement</h4>
<div class="code-example">
    <pre><code># Basic IF statement
age = 18
if age >= 18:
    print("You are an adult")
    print("You can vote")

# The indented code only runs if condition is True
temperature = 30
if temperature > 25:
    print("It's hot today!")
    print("Stay hydrated!")

print("This always prints")  # Not indented = always runs</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>IF-ELSE: Two-Way Decision</h4>
<div class="code-example">
    <pre><code># IF-ELSE gives two options
password = input("Enter password: ")
if password == "secret123":
    print("✅ Access granted!")
    print("Welcome to the system")
else:
    print("❌ Access denied!")
    print("Invalid password")

# Another example
score = int(input("Enter test score: "))
if score >= 50:
    print("You passed! 🎉")
    result = "PASS"
else:
    print("You failed. 😢")
    result = "FAIL"
    
print(f"Result: {result}")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>IF-ELIF-ELSE: Multiple Options</h4>
<div class="code-example">
    <pre><code># Multiple conditions with ELIF
mark = int(input("Enter your mark (0-100): "))

if mark >= 90:
    grade = "A*"
    print("Outstanding! 🌟")
elif mark >= 80:
    grade = "A"
    print("Excellent! ⭐")
elif mark >= 70:
    grade = "B"
    print("Very good! 👍")
elif mark >= 60:
    grade = "C"
    print("Good! ✓")
elif mark >= 50:
    grade = "D"
    print("Satisfactory")
else:
    grade = "F"
    print("Need to improve")

print(f"Your grade: {grade}")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<div class="tip-box">
    <h4>💡 Important Rules:</h4>
    <ul>
        <li>Conditions are checked in order - first match wins!</li>
        <li>Once a condition is True, remaining conditions are skipped</li>
        <li>The <code>else</code> catches everything that didn't match</li>
        <li>Indentation shows what code belongs to each condition</li>
    </ul>
</div>

<h4>Nested Selection</h4>
<p>You can put IF statements inside other IF statements:</p>

<div class="code-example">
    <pre><code># Nested IF example - Theme park entry
age = int(input("Enter your age: "))
height = int(input("Enter your height in cm: "))

if age >= 12:
    # Old enough, now check height
    if height >= 140:
        print("✅ You can ride all attractions!")
    else:
        print("⚠️ You can ride some attractions")
        print("Must be 140cm+ for big rides")
else:
    # Too young
    print("❌ Sorry, must be 12 or older")
    print("Try the kids' area instead!")

# Another example - Login system
username = input("Username: ")
if username == "admin":
    password = input("Password: ")
    if password == "secure123":
        print("Welcome, administrator!")
    else:
        print("Wrong password for admin")
else:
    print("Unknown user")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Multiple Conditions</h4>
<p>Use AND, OR, NOT to check multiple things:</p>

<div class="code-example">
    <pre><code># Using AND - both must be true
age = 16
has_license = True

if age >= 17 and has_license:
    print("You can drive!")
else:
    print("You cannot drive yet")

# Using OR - at least one must be true
day = "Saturday"
is_holiday = False

if day == "Saturday" or day == "Sunday" or is_holiday:
    print("No school today! 🎉")
else:
    print("School day 📚")

# Using NOT
is_raining = False
if not is_raining:
    print("Great weather for a picnic!")

# Complex conditions
temperature = 22
humidity = 65
wind_speed = 10

if temperature >= 20 and temperature <= 25 and humidity < 70 and wind_speed < 15:
    print("Perfect weather conditions!")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Common Selection Patterns</h4>
<div class="code-example">
    <pre><code># Pattern 1: Validation
number = int(input("Enter a number (1-10): "))
if number < 1 or number > 10:
    print("Invalid! Must be between 1 and 10")
else:
    print(f"You chose {number}")

# Pattern 2: Menu selection
print("1. Play Game")
print("2. High Scores")
print("3. Settings")
print("4. Quit")

choice = input("Select option: ")
if choice == "1":
    print("Starting game...")
elif choice == "2":
    print("Showing high scores...")
elif choice == "3":
    print("Opening settings...")
elif choice == "4":
    print("Goodbye!")
else:
    print("Invalid option!")

# Pattern 3: Range checking
score = 85
if score >= 90:
    performance = "Excellent"
elif score >= 70:
    performance = "Good"
elif score >= 50:
    performance = "Pass"
else:
    performance = "Fail"</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<div class="practice-box">
    <h4>🎮 Try It Yourself!</h4>
    <p>Create a movie ticket pricing system with age-based discounts:</p>
    <button class="btn btn-primary" onclick="openPlaygroundWithCode('# Cinema Ticket Pricing System\\nprint(\"=== CINEMA TICKET PRICING ===\")\\nprint(\"Standard price: £12\\n\")\\n\\n# Get customer information\\nage = int(input(\"Enter your age: \"))\\nday = input(\"What day is it? \").lower()\\nis_student = input(\"Are you a student? (yes/no): \").lower() == \"yes\"\\n\\n# Determine base price based on age\\n# Under 5: Free\\n# 5-12: £6 (child price)\\n# 13-17: £8 (teen price)\\n# 18-64: £12 (adult price)\\n# 65+: £8 (senior price)\\n\\n# Apply discounts\\n# Students: 20% off\\n# Wednesday: £2 off for everyone\\n\\n# Calculate and display final price\\n\\n# Add your selection logic here!')">Open in Playground</button>
</div>
`,
            quiz: [
                {
                    question: "In an IF-ELIF-ELSE chain, how many conditions can be True?",
                    options: [
                        "All of them",
                        "Only one",
                        "At least one",
                        "None of them"
                    ],
                    correct: 1,
                    explanation: "Only the FIRST true condition executes. Once one is True, the rest are skipped."
                },
                {
                    question: "What happens if no IF/ELIF conditions are True and there's no ELSE?",
                    options: [
                        "Error occurs",
                        "First condition runs",
                        "Nothing happens",
                        "All conditions run"
                    ],
                    correct: 2,
                    explanation: "If no conditions are True and there's no ELSE, the program continues after the IF block."
                }
            ]
        },
        
        'iteration': {
            title: 'Iteration (Loops)',
            content: `
<h3>Iteration - Repeating Code</h3>
<p>Iteration means repeating code multiple times. Instead of writing the same code over and over, we use loops!</p>

<div class="concept-box">
    <h4>🎯 Types of Loops</h4>
    <ul>
        <li><strong>FOR loops</strong> - When you know how many times to repeat (count-controlled)</li>
        <li><strong>WHILE loops</strong> - When you repeat until a condition changes (condition-controlled)</li>
    </ul>
</div>

<h4>FOR Loops - Count-Controlled</h4>
<p>Use FOR loops when you know exactly how many times to repeat:</p>

<div class="code-example">
    <pre><code># Basic FOR loop
for i in range(5):
    print(f"Count: {i}")
# Output: 0, 1, 2, 3, 4

# Counting from 1
for i in range(1, 6):
    print(f"Number: {i}")
# Output: 1, 2, 3, 4, 5

# Counting with steps
for i in range(0, 11, 2):
    print(f"Even: {i}")
# Output: 0, 2, 4, 6, 8, 10

# Counting backwards
for i in range(10, 0, -1):
    print(f"Countdown: {i}")
print("Blast off! 🚀")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Understanding range()</h4>
<div class="concept-box">
    <h4>The range() function:</h4>
    <ul>
        <li><code>range(5)</code> → 0, 1, 2, 3, 4 (stops BEFORE 5)</li>
        <li><code>range(1, 6)</code> → 1, 2, 3, 4, 5 (start at 1, stop before 6)</li>
        <li><code>range(0, 10, 2)</code> → 0, 2, 4, 6, 8 (step by 2)</li>
        <li><code>range(10, 0, -1)</code> → 10, 9, 8...1 (count down)</li>
    </ul>
</div>

<h4>FOR Loop Patterns</h4>
<div class="code-example">
    <pre><code># Pattern 1: Repeat action N times
print("Hip ", end="")
for i in range(3):
    print("Hip ", end="")
print("Hooray!")
# Output: Hip Hip Hip Hooray!

# Pattern 2: Running total
total = 0
for i in range(1, 6):
    total = total + i
    print(f"Added {i}, total now: {total}")
print(f"Final total: {total}")

# Pattern 3: Generate sequence
print("Powers of 2:")
for i in range(8):
    power = 2 ** i
    print(f"2^{i} = {power}")

# Pattern 4: Collect input
scores = []
for i in range(3):
    score = int(input(f"Enter score {i+1}: "))
    scores.append(score)
average = sum(scores) / len(scores)
print(f"Average: {average}")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>WHILE Loops - Condition-Controlled</h4>
<p>Use WHILE loops when you don't know how many times to repeat:</p>

<div class="code-example">
    <pre><code># Basic WHILE loop
count = 0
while count < 5:
    print(f"Count: {count}")
    count = count + 1  # IMPORTANT: Update the condition!

# User-controlled loop
answer = ""
while answer != "yes":
    answer = input("Do you understand? (yes/no): ")
    if answer == "no":
        print("Let me explain again...")
print("Great! Let's continue.")

# Validation loop
age = -1  # Start with invalid value
while age < 0 or age > 120:
    age = int(input("Enter your age (0-120): "))
    if age < 0 or age > 120:
        print("Invalid age! Try again.")
print(f"Your age is {age}")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<div class="warning-box">
    <h4>⚠️ Avoid Infinite Loops!</h4>
    <pre><code># ❌ INFINITE LOOP - Never ends!
count = 1
while count > 0:
    print(count)
    count = count + 1  # Gets bigger, never < 0!

# ❌ FORGOT TO UPDATE
number = 5
while number != 0:
    print(number)
    # Forgot: number = number - 1

# ✅ CORRECT - Has an exit condition
number = 5
while number > 0:
    print(number)
    number = number - 1  # Will reach 0</code></pre>
</div>

<h4>Loop Control Statements</h4>
<div class="code-example">
    <pre><code># BREAK - Exit loop early
for i in range(10):
    if i == 5:
        break  # Stop when we reach 5
    print(i)
# Output: 0, 1, 2, 3, 4

# CONTINUE - Skip rest of current iteration
for i in range(5):
    if i == 2:
        continue  # Skip when i is 2
    print(i)
# Output: 0, 1, 3, 4

# Practical example
while True:  # Infinite loop
    command = input("Enter command (quit to exit): ")
    if command == "quit":
        break  # Exit the loop
    if command == "":
        continue  # Skip empty commands
    print(f"Processing: {command}")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Nested Loops</h4>
<p>You can put loops inside other loops:</p>

<div class="code-example">
    <pre><code># Multiplication table
for i in range(1, 4):
    for j in range(1, 4):
        result = i * j
        print(f"{i} × {j} = {result}")
    print()  # Empty line between tables

# Drawing patterns
size = 5
# Triangle
for i in range(1, size + 1):
    for j in range(i):
        print("*", end="")
    print()  # New line

# Rectangle
width = 4
height = 3
for i in range(height):
    for j in range(width):
        print("#", end="")
    print()  # New line</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Common Loop Problems</h4>
<div class="code-example">
    <pre><code># Finding maximum
numbers = [45, 67, 23, 89, 12, 78]
max_num = numbers[0]  # Start with first
for num in numbers:
    if num > max_num:
        max_num = num
print(f"Maximum: {max_num}")

# Counting occurrences
text = "hello world"
count = 0
for letter in text:
    if letter == 'l':
        count = count + 1
print(f"Found {count} letter 'l's")

# Search loop
names = ["Alice", "Bob", "Charlie", "David"]
search = "Charlie"
found = False
for name in names:
    if name == search:
        found = True
        break
if found:
    print(f"{search} is in the list!")
else:
    print(f"{search} not found")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<div class="practice-box">
    <h4>🎮 Try It Yourself!</h4>
    <p>Create a number guessing game using loops:</p>
    <button class="btn btn-primary" onclick="openPlaygroundWithCode('# Number Guessing Game\\nimport random\\n\\nprint(\"=== GUESS THE NUMBER ===\")\\nprint(\"I\\'m thinking of a number between 1 and 100\\n\")\\n\\n# Generate random number\\nsecret = random.randint(1, 100)\\nguesses = 0\\nguessed = False\\n\\n# Main game loop\\nwhile not guessed:\\n    # Get player\\'s guess\\n    # Add to guess count\\n    # Check if correct, too high, or too low\\n    # Give feedback\\n    # Set guessed = True if correct\\n\\n# After loop - show stats\\nprint(f\"\\nYou got it in {guesses} guesses!\")\\n\\n# Bonus: Add difficulty levels\\n# Easy: tell if very close (within 5)\\n# Hard: limited number of guesses')">Open in Playground</button>
</div>
`,
            quiz: [
                {
                    question: "What does range(3, 8) produce?",
                    options: [
                        "3, 4, 5, 6, 7, 8",
                        "3, 4, 5, 6, 7",
                        "4, 5, 6, 7",
                        "3, 4, 5, 6"
                    ],
                    correct: 1,
                    explanation: "range(3, 8) starts at 3 and stops BEFORE 8, giving: 3, 4, 5, 6, 7"
                },
                {
                    question: "When should you use a WHILE loop instead of a FOR loop?",
                    options: [
                        "When counting to 10",
                        "When you don't know how many times to repeat",
                        "When processing a list",
                        "Never - they're the same"
                    ],
                    correct: 1,
                    explanation: "Use WHILE when repetition depends on a condition, not a count."
                }
            ]
        },
        
        // DATA STRUCTURES
        'lists-arrays': {
            title: 'Lists and Arrays',
            content: `
<h3>Lists (Arrays) - Storing Multiple Values</h3>
<p>Lists let you store multiple values in a single variable. Think of a list as a row of boxes, each holding one item.</p>

<div class="concept-box">
    <h4>🎯 What are Lists?</h4>
    <ul>
        <li>Ordered collection of items</li>
        <li>Can hold any data type</li>
        <li>Items accessed by position (index)</li>
        <li>Can be changed (mutable)</li>
        <li>Size can grow or shrink</li>
    </ul>
</div>

<h4>Creating Lists</h4>
<div class="code-example">
    <pre><code># Empty list
shopping = []

# List with values
numbers = [10, 20, 30, 40, 50]
names = ["Alice", "Bob", "Charlie"]
mixed = [42, "Hello", 3.14, True]  # Different types OK!

# List from range
countdown = list(range(10, 0, -1))  # [10, 9, 8, ..., 1]

# List with repeated values
zeros = [0] * 5  # [0, 0, 0, 0, 0]</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Accessing List Items</h4>
<div class="concept-box">
    <h4>List Indexing:</h4>
    <p>Items are numbered starting from 0:</p>
    <pre>  List: ["A", "B", "C", "D", "E"]
Index:   0    1    2    3    4
 From end: -5   -4   -3   -2   -1</pre>
</div>

<div class="code-example">
    <pre><code># Accessing items
fruits = ["apple", "banana", "cherry", "date"]

# By positive index
print(fruits[0])    # "apple" (first item)
print(fruits[2])    # "cherry" (third item)

# By negative index
print(fruits[-1])   # "date" (last item)
print(fruits[-2])   # "cherry" (second from last)

# Get list length
print(len(fruits))  # 4

# Check if item exists
if "banana" in fruits:
    print("We have bananas!")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Modifying Lists</h4>
<div class="code-example">
    <pre><code># Change an item
scores = [85, 92, 78, 95]
scores[2] = 88  # Change 78 to 88
print(scores)   # [85, 92, 88, 95]

# Add items
scores.append(90)       # Add to end
print(scores)          # [85, 92, 88, 95, 90]

scores.insert(0, 100)  # Insert at position
print(scores)          # [100, 85, 92, 88, 95, 90]

# Remove items
scores.remove(88)      # Remove first 88
print(scores)          # [100, 85, 92, 95, 90]

last = scores.pop()    # Remove and return last
print(last)           # 90
print(scores)         # [100, 85, 92, 95]

del scores[0]         # Delete by index
print(scores)         # [85, 92, 95]</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>List Operations</h4>
<div class="code-example">
    <pre><code># Combining lists
list1 = [1, 2, 3]
list2 = [4, 5, 6]
combined = list1 + list2  # [1, 2, 3, 4, 5, 6]

# Repeating lists
pattern = [0, 1] * 3      # [0, 1, 0, 1, 0, 1]

# Slicing (getting parts)
numbers = [10, 20, 30, 40, 50, 60, 70]
print(numbers[2:5])   # [30, 40, 50] (index 2 to 4)
print(numbers[:3])    # [10, 20, 30] (first 3)
print(numbers[4:])    # [50, 60, 70] (from index 4)
print(numbers[::2])   # [10, 30, 50, 70] (every 2nd)

# Useful list methods
nums = [3, 1, 4, 1, 5, 9, 2]
nums.sort()           # Sort in place
print(nums)          # [1, 1, 2, 3, 4, 5, 9]

nums.reverse()       # Reverse in place
print(nums)          # [9, 5, 4, 3, 2, 1, 1]

print(nums.count(1)) # 2 (count of 1s)
print(nums.index(5)) # 1 (position of 5)</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Looping Through Lists</h4>
<div class="code-example">
    <pre><code># Method 1: Direct iteration (best for reading)
colors = ["red", "green", "blue"]
for color in colors:
    print(f"Color: {color}")

# Method 2: Using index (when position matters)
for i in range(len(colors)):
    print(f"Color {i+1}: {colors[i]}")

# Method 3: Using enumerate (best of both!)
for i, color in enumerate(colors):
    print(f"Color {i+1}: {color}")

# Processing list items
prices = [10.50, 25.00, 5.99, 12.75]
total = 0
for price in prices:
    total = total + price
print(f"Total: £{total:.2f}")

# Modifying while looping (use index)
for i in range(len(prices)):
    prices[i] = prices[i] * 1.20  # Add 20% tax</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Common List Patterns</h4>
<div class="code-example">
    <pre><code># Pattern 1: Building a list
squares = []
for i in range(1, 6):
    squares.append(i ** 2)
print(squares)  # [1, 4, 9, 16, 25]

# Pattern 2: Filtering
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = []
for num in numbers:
    if num % 2 == 0:
        evens.append(num)
print(evens)  # [2, 4, 6, 8, 10]

# Pattern 3: Finding in list
names = ["Alice", "Bob", "Charlie", "David"]
search = "Charlie"
if search in names:
    position = names.index(search)
    print(f"{search} found at position {position}")

# Pattern 4: List as queue
queue = []
queue.append("Person 1")  # Join queue
queue.append("Person 2")
queue.append("Person 3")
next_person = queue.pop(0)  # Serve first person
print(f"Now serving: {next_person}")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>2D Lists (Lists of Lists)</h4>
<div class="code-example">
    <pre><code># Creating a grid (2D list)
grid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# Accessing items
print(grid[0][0])  # 1 (top-left)
print(grid[1][1])  # 5 (middle)
print(grid[2][2])  # 9 (bottom-right)

# Looping through 2D list
for row in grid:
    for item in row:
        print(item, end=" ")
    print()  # New line after each row

# Practical example: Tic-tac-toe board
board = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "]
]
board[1][1] = "X"  # Place X in center</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<div class="practice-box">
    <h4>🎮 Try It Yourself!</h4>
    <p>Create a student grade manager using lists:</p>
    <button class="btn btn-primary" onclick="openPlaygroundWithCode('# Student Grade Manager\\nprint(\"=== STUDENT GRADE MANAGER ===\")\\n\\n# Initialize empty lists\\nstudent_names = []\\nstudent_scores = []\\n\\n# Get number of students\\nnum_students = int(input(\"How many students? \"))\\n\\n# Collect student data\\nfor i in range(num_students):\\n    name = input(f\"Enter name for student {i+1}: \")\\n    score = int(input(f\"Enter score for {name}: \"))\\n    # Add to lists\\n    # YOUR CODE HERE\\n\\n# Calculate statistics\\n# Find average score\\n# Find highest score and who got it\\n# Find lowest score and who got it\\n# Count how many passed (score >= 50)\\n\\n# Display results\\nprint(\"\\n--- CLASS RESULTS ---\")\\n# YOUR CODE HERE\\n\\n# Show all students and grades\\nprint(\"\\nStudent Scores:\")\\nfor i in range(len(student_names)):\\n    # Display each student\\n    # YOUR CODE HERE')">Open in Playground</button>
</div>
`,
            quiz: [
                {
                    question: "What is the index of the LAST item in a list of 5 items?",
                    options: ["5", "4", "-1", "Both 4 and -1"],
                    correct: 3,
                    explanation: "In a list of 5 items, the last item is at index 4 (counting from 0) or -1 (counting from end)."
                },
                {
                    question: "Which method adds an item to the END of a list?",
                    options: ["insert()", "append()", "add()", "push()"],
                    correct: 1,
                    explanation: "append() adds an item to the end of a list. insert() adds at a specific position."
                }
            ]
        },
        
        'strings': {
            title: 'String Manipulation',
            content: `
<h3>String Manipulation</h3>
<p>Strings are sequences of characters. Python provides many powerful ways to work with text!</p>

<div class="concept-box">
    <h4>🎯 Strings are Like Lists!</h4>
    <ul>
        <li>Each character has an index</li>
        <li>Can loop through characters</li>
        <li>Can slice to get parts</li>
        <li>BUT strings are immutable (can't change individual characters)</li>
    </ul>
</div>

<h4>String Basics</h4>
<div class="code-example">
    <pre><code># Creating strings
single = 'Hello'
double = "World"
multi = """This is
a multi-line
string"""

# String length
message = "Hello, Python!"
print(len(message))  # 14

# Accessing characters
print(message[0])    # 'H' (first)
print(message[7])    # 'P'
print(message[-1])   # '!' (last)

# Strings are immutable!
# message[0] = 'h'  # ERROR! Can't change

# But you can create new strings
new_message = 'h' + message[1:]  # "hello, Python!"</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>String Slicing</h4>
<div class="code-example">
    <pre><code># Slicing syntax: string[start:end:step]
text = "Python Programming"

# Basic slicing
print(text[0:6])     # "Python"
print(text[7:])      # "Programming"
print(text[:6])      # "Python"
print(text[::2])     # "Pto rgamn" (every 2nd char)

# Negative indices
print(text[-11:])    # "Programming"
print(text[:-12])    # "Python"

# Reverse a string
print(text[::-1])    # "gnimmargorP nohtyP"

# Extract parts
email = "student@school.com"
username = email[:email.index('@')]  # "student"
domain = email[email.index('@')+1:]  # "school.com"</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>String Methods - Changing Case</h4>
<div class="code-example">
    <pre><code>text = "Hello World"

# Case methods
print(text.upper())      # "HELLO WORLD"
print(text.lower())      # "hello world"
print(text.title())      # "Hello World"
print(text.capitalize()) # "Hello world"
print(text.swapcase())   # "hELLO wORLD"

# Practical uses
name = input("Enter your name: ").strip().title()
# Removes spaces and capitalizes properly

password1 = input("Enter password: ")
password2 = input("Confirm password: ")
if password1.lower() == password2.lower():
    print("Passwords match (ignoring case)")

# Check case
if text.isupper():
    print("All uppercase")
elif text.islower():
    print("All lowercase")
elif text.istitle():
    print("Title case")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>String Methods - Finding and Counting</h4>
<div class="code-example">
    <pre><code>message = "Python is awesome and Python is fun"

# Count occurrences
print(message.count("Python"))    # 2
print(message.count("is"))        # 2
print(message.count("java"))      # 0

# Find positions
print(message.find("awesome"))    # 10 (first occurrence)
print(message.find("terrible"))   # -1 (not found)
print(message.index("awesome"))   # 10 (like find)
# print(message.index("terrible")) # ERROR if not found!

# Check start/end
filename = "document.pdf"
if filename.endswith(".pdf"):
    print("This is a PDF file")
    
if filename.startswith("doc"):
    print("Filename starts with 'doc'")

# Check content
if "Python" in message:
    print("Message mentions Python")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>String Methods - Modifying</h4>
<div class="code-example">
    <pre><code># Replace (creates new string)
text = "I love Java"
new_text = text.replace("Java", "Python")
print(new_text)  # "I love Python"

# Replace multiple
phone = "555-123-4567"
clean_phone = phone.replace("-", "")  # "5551234567"

# Strip whitespace
user_input = "  hello world  \n"
clean = user_input.strip()      # "hello world"
left = user_input.lstrip()      # "hello world  \n"
right = user_input.rstrip()     # "  hello world"

# Split into list
sentence = "Python is great"
words = sentence.split()         # ["Python", "is", "great"]

data = "apple,banana,cherry"
fruits = data.split(",")         # ["apple", "banana", "cherry"]

# Join list into string
words = ["Python", "is", "awesome"]
sentence = " ".join(words)       # "Python is awesome"
csv_line = ",".join(words)       # "Python,is,awesome"</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>String Formatting</h4>
<div class="code-example">
    <pre><code># Method 1: f-strings (BEST!)
name = "Alice"
age = 16
height = 1.65

print(f"Hello, {name}!")
print(f"{name} is {age} years old")
print(f"Height: {height:.1f}m")  # 1 decimal place

# Expressions in f-strings
print(f"Next year {name} will be {age + 1}")
print(f"Double height: {height * 2:.2f}m")

# Method 2: .format() (older style)
print("Hello, {}!".format(name))
print("{} is {} years old".format(name, age))

# Method 3: % formatting (very old)
print("Hello, %s!" % name)
print("%s is %d years old" % (name, age))

# Alignment and padding
print(f"{'Left':<10}|")     # "Left      |"
print(f"{'Right':>10}|")    # "     Right|"
print(f"{'Center':^10}|")   # "  Center  |"
print(f"{42:05d}")          # "00042" (pad with zeros)</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>String Validation</h4>
<div class="code-example">
    <pre><code># Check string content
password = "Pass123!"

# Check if alphanumeric
if password.isalnum():
    print("Only letters and numbers")
else:
    print("Contains special characters")

# Other checks
print("abc123".isalnum())    # True
print("12345".isdigit())     # True
print("Hello".isalpha())     # True
print("   ".isspace())       # True

# Password validation
def validate_password(pwd):
    if len(pwd) < 8:
        return "Too short"
    
    has_upper = any(c.isupper() for c in pwd)
    has_lower = any(c.islower() for c in pwd)
    has_digit = any(c.isdigit() for c in pwd)
    
    if not (has_upper and has_lower and has_digit):
        return "Must have uppercase, lowercase, and digit"
    
    return "Valid password"

result = validate_password("MyPass123")
print(result)</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Common String Patterns</h4>
<div class="code-example">
    <pre><code># Pattern 1: Cleaning input
user_input = input("Enter email: ").strip().lower()

# Pattern 2: Building strings
result = ""
for i in range(5):
    result = result + str(i) + " "
print(result)  # "0 1 2 3 4 "

# Pattern 3: Extracting data
full_name = "Smith, John"
last_name = full_name[:full_name.index(",")]
first_name = full_name[full_name.index(",")+2:]

# Pattern 4: Validation loop
while True:
    username = input("Choose username (3-10 chars): ")
    if 3 <= len(username) <= 10:
        break
    print("Invalid length!")

# Pattern 5: Counting characters
text = "Hello World"
vowel_count = 0
for char in text.lower():
    if char in "aeiou":
        vowel_count += 1
print(f"Vowels: {vowel_count}")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<div class="practice-box">
    <h4>🎮 Try It Yourself!</h4>
    <p>Create a text analyzer that processes user input:</p>
    <button class="btn btn-primary" onclick="openPlaygroundWithCode('# Text Analyzer\\nprint(\"=== TEXT ANALYZER ===\")\\n\\n# Get text from user\\ntext = input(\"Enter some text: \")\\n\\n# Analysis tasks:\\n# 1. Count total characters\\n# 2. Count characters (no spaces)\\n# 3. Count words\\n# 4. Count sentences (periods)\\n# 5. Find longest word\\n# 6. Count vowels\\n# 7. Check if palindrome\\n\\n# Your analysis code here\\n\\n# Display results\\nprint(\"\\n--- ANALYSIS RESULTS ---\")\\n# Show all statistics\\n\\n# Bonus: Word frequency\\n# Count how many times each word appears')">Open in Playground</button>
</div>
`,
            quiz: [
                {
                    question: "What does 'hello'.find('x') return?",
                    options: ["0", "None", "-1", "Error"],
                    correct: 2,
                    explanation: "The find() method returns -1 when the substring is not found."
                },
                {
                    question: "Which method would you use to remove spaces from both ends of a string?",
                    options: ["remove()", "strip()", "delete()", "clean()"],
                    correct: 1,
                    explanation: "strip() removes whitespace from both ends of a string."
                }
            ]
        },
        
        // SUBPROGRAMS
        'functions': {
            title: 'Functions',
            content: `
<h3>Functions - Reusable Code with Return Values</h3>
<p>Functions are reusable blocks of code that can take inputs, process them, and return outputs. They're like mini-programs within your program!</p>

<div class="concept-box">
    <h4>🎯 Function vs Procedure</h4>
    <ul>
        <li><strong>Function</strong> - Returns a value using <code>return</code></li>
        <li><strong>Procedure</strong> - Performs actions but doesn't return a value</li>
    </ul>
    <p>In Python, both are created with <code>def</code>, but functions have <code>return</code> statements.</p>
</div>

<h4>Creating Functions</h4>
<div class="code-example">
    <pre><code># Basic function structure
def function_name(parameters):
    """Optional description"""
    # Function body
    return result

# Simple function - no parameters
def get_pi():
    return 3.14159

# Using the function
pi_value = get_pi()
print(f"Pi is approximately {pi_value}")

# Function with parameters
def add_numbers(a, b):
    result = a + b
    return result

# Call the function
sum = add_numbers(5, 3)
print(f"5 + 3 = {sum}")  # 8</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Function Parameters</h4>
<div class="code-example">
    <pre><code># Single parameter
def square(number):
    return number ** 2

print(square(5))     # 25
print(square(10))    # 100

# Multiple parameters
def calculate_area(length, width):
    return length * width

area = calculate_area(10, 5)
print(f"Area: {area}")  # 50

# Parameters with default values
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Alice"))              # "Hello, Alice!"
print(greet("Bob", "Good morning")) # "Good morning, Bob!"

# Named arguments (any order)
def make_coffee(size="medium", sugar=1, milk=True):
    return f"{size} coffee with {sugar} sugar, milk: {milk}"

print(make_coffee())                    # Uses all defaults
print(make_coffee(sugar=2, size="large")) # Named arguments</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Return Statements</h4>
<div class="code-example">
    <pre><code># Simple return
def get_age_in_days(years):
    days = years * 365
    return days

age = 16
days_old = get_age_in_days(age)
print(f"You are {days_old} days old!")

# Multiple returns (exits at first return)
def check_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"
    # Code after return never runs!

grade = check_grade(85)
print(f"Your grade: {grade}")

# Returning multiple values
def get_min_max(numbers):
    return min(numbers), max(numbers)

lowest, highest = get_min_max([5, 2, 8, 1, 9])
print(f"Range: {lowest} to {highest}")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Functions Calling Functions</h4>
<div class="code-example">
    <pre><code># Functions can use other functions
def celsius_to_fahrenheit(celsius):
    return celsius * 9/5 + 32

def celsius_to_kelvin(celsius):
    return celsius + 273.15

def temperature_converter(celsius):
    """Convert to all temperature scales"""
    fahrenheit = celsius_to_fahrenheit(celsius)
    kelvin = celsius_to_kelvin(celsius)
    return celsius, fahrenheit, kelvin

# Use the main function
temp = 25
c, f, k = temperature_converter(temp)
print(f"{c}°C = {f}°F = {k}K")

# Building complex functions from simple ones
def is_even(n):
    return n % 2 == 0

def count_evens(numbers):
    count = 0
    for num in numbers:
        if is_even(num):  # Using another function
            count += 1
    return count

my_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = count_evens(my_list)
print(f"Even numbers: {evens}")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Variable Scope</h4>
<div class="code-example">
    <pre><code># Local variables exist only inside functions
def calculate_tax(amount):
    tax_rate = 0.20  # Local variable
    tax = amount * tax_rate
    return tax

# print(tax_rate)  # ERROR! tax_rate doesn't exist here

# Global variables
total_sales = 0  # Global

def add_sale(amount):
    global total_sales  # Tell Python to use global
    total_sales = total_sales + amount
    commission = amount * 0.1  # Local variable
    return commission

# Using the function
comm1 = add_sale(100)
comm2 = add_sale(200)
print(f"Total sales: {total_sales}")  # 300
print(f"Commission: {comm1 + comm2}")  # 30

# Parameters are local
def double(x):
    x = x * 2  # Only changes local x
    return x

number = 10
result = double(number)
print(f"number: {number}")  # Still 10
print(f"result: {result}")  # 20</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Common Function Patterns</h4>
<div class="code-example">
    <pre><code># Pattern 1: Validation function
def is_valid_password(password):
    if len(password) < 8:
        return False
    if not any(c.isupper() for c in password):
        return False
    if not any(c.isdigit() for c in password):
        return False
    return True

# Pattern 2: Calculation function
def calculate_discount(price, discount_percent):
    discount = price * (discount_percent / 100)
    final_price = price - discount
    return final_price

# Pattern 3: Conversion function
def miles_to_km(miles):
    return miles * 1.60934

# Pattern 4: Search function
def find_in_list(items, target):
    for i, item in enumerate(items):
        if item == target:
            return i  # Return position
    return -1  # Not found

# Pattern 5: Aggregation function
def get_statistics(numbers):
    total = sum(numbers)
    average = total / len(numbers)
    minimum = min(numbers)
    maximum = max(numbers)
    return {
        'sum': total,
        'avg': average,
        'min': minimum,
        'max': maximum
    }</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Functions Best Practices</h4>
<div class="tip-box">
    <h4>💡 Writing Good Functions:</h4>
    <ul>
        <li><strong>Single Purpose</strong> - Each function should do ONE thing well</li>
        <li><strong>Good Names</strong> - Use verbs that describe what it does</li>
        <li><strong>Document</strong> - Add a docstring explaining the function</li>
        <li><strong>Test</strong> - Try different inputs to ensure it works</li>
    </ul>
</div>

<div class="code-example">
    <pre><code># Well-designed function
def calculate_circle_area(radius):
    """
    Calculate the area of a circle.
    
    Parameters:
        radius (float): The radius of the circle
        
    Returns:
        float: The area of the circle
    """
    if radius < 0:
        return 0  # Handle invalid input
    
    pi = 3.14159
    area = pi * radius ** 2
    return area

# Test the function
test_radii = [5, 10, 0, -5]
for r in test_radii:
    area = calculate_circle_area(r)
    print(f"Radius {r} → Area {area:.2f}")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<div class="practice-box">
    <h4>🎮 Try It Yourself!</h4>
    <p>Create a grade calculator with multiple functions:</p>
    <button class="btn btn-primary" onclick="openPlaygroundWithCode('# Grade Calculator System\\n\\ndef calculate_average(scores):\\n    \"\"\"Calculate average of a list of scores\"\"\"\\n    # YOUR CODE HERE\\n    pass\\n\\ndef get_letter_grade(average):\\n    \"\"\"Convert percentage to letter grade\"\"\"\\n    # 90+ = A, 80+ = B, 70+ = C, 60+ = D, else F\\n    # YOUR CODE HERE\\n    pass\\n\\ndef is_passing(average):\\n    \"\"\"Check if student passed (60+)\"\"\"\\n    # YOUR CODE HERE\\n    pass\\n\\ndef get_grade_report(name, scores):\\n    \"\"\"Generate complete grade report\"\"\"\\n    # Use other functions to:\\n    # 1. Calculate average\\n    # 2. Get letter grade\\n    # 3. Check if passing\\n    # 4. Return formatted report string\\n    # YOUR CODE HERE\\n    pass\\n\\n# Main program\\nprint(\"=== GRADE CALCULATOR ===\")\\nstudent_name = input(\"Student name: \")\\n\\n# Get test scores\\nscores = []\\nfor i in range(3):\\n    score = int(input(f\"Enter test {i+1} score: \"))\\n    scores.append(score)\\n\\n# Generate and print report\\nreport = get_grade_report(student_name, scores)\\nprint(report)')">Open in Playground</button>
</div>
`,
            quiz: [
                {
                    question: "What's the main difference between a function and a procedure?",
                    options: [
                        "Functions use def, procedures use proc",
                        "Functions return values, procedures don't",
                        "Functions take parameters, procedures don't",
                        "There is no difference"
                    ],
                    correct: 1,
                    explanation: "Functions return values using the return statement. Procedures perform actions but don't return values."
                },
                {
                    question: "What happens when a function reaches a return statement?",
                    options: [
                        "It continues to the next line",
                        "It starts over from the beginning",
                        "It exits immediately with that value",
                        "It prints the value"
                    ],
                    correct: 2,
                    explanation: "When return is executed, the function exits immediately and sends back the specified value."
                }
            ]
        },
        
        'procedures': {
            title: 'Procedures',
            content: `
<h3>Procedures - Reusable Code Without Return Values</h3>
<p>Procedures are reusable blocks of code that perform actions but don't return values. They help organize code and avoid repetition.</p>

<div class="concept-box">
    <h4>🎯 When to Use Procedures</h4>
    <ul>
        <li>Displaying information</li>
        <li>Printing reports</li>
        <li>Modifying global variables</li>
        <li>Performing actions (like saving files)</li>
        <li>Any task that doesn't need to send back a value</li>
    </ul>
</div>

<h4>Creating Procedures</h4>
<div class="code-example">
    <pre><code># Basic procedure - no parameters
def display_welcome():
    print("=" * 30)
    print("Welcome to Python Programming!")
    print("=" * 30)
    print()

# Call the procedure
display_welcome()
# Note: No value returned or stored

# Procedure with parameters
def display_student_info(name, age, grade):
    print(f"Student: {name}")
    print(f"Age: {age}")
    print(f"Grade: {grade}")
    print("-" * 20)

# Use the procedure
display_student_info("Alice", 16, "Year 11")
display_student_info("Bob", 15, "Year 10")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Procedures vs Functions</h4>
<div class="code-example">
    <pre><code># PROCEDURE - Performs action, no return
def print_square(number):
    result = number ** 2
    print(f"{number} squared is {result}")
    # No return statement!

# FUNCTION - Returns a value
def calculate_square(number):
    result = number ** 2
    return result  # Returns the value

# Using them differently
print_square(5)        # Prints: "5 squared is 25"
                      # Can't store result!

answer = calculate_square(5)  # Stores 25 in answer
print(f"Answer: {answer}")    # We can use the result

# This won't work as expected:
result = print_square(5)  # Prints but...
print(result)            # Prints: None (no return value)</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Common Procedure Patterns</h4>
<div class="code-example">
    <pre><code># Pattern 1: Display procedures
def display_menu():
    print("\n=== MAIN MENU ===")
    print("1. New Game")
    print("2. Load Game")
    print("3. Settings")
    print("4. Quit")
    print("================\n")

def display_error(message):
    print(f"❌ ERROR: {message}")
    print("Please try again.")

# Pattern 2: Formatting procedures
def print_receipt(items, prices):
    print("\n----- RECEIPT -----")
    total = 0
    for i in range(len(items)):
        print(f"{items[i]:<15} £{prices[i]:>6.2f}")
        total += prices[i]
    print("-" * 23)
    print(f"{'TOTAL':<15} £{total:>6.2f}")
    print("==================\n")

# Pattern 3: Action procedures
def clear_screen():
    print("\n" * 50)  # Simple screen clear

def pause():
    input("\nPress Enter to continue...")

# Pattern 4: Setup procedures
def initialize_game():
    global player_score, player_lives, game_level
    player_score = 0
    player_lives = 3
    game_level = 1
    print("Game initialized!")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Procedures with Side Effects</h4>
<p>Procedures often modify things outside themselves (side effects):</p>

<div class="code-example">
    <pre><code># Modifying global variables
score = 0
lives = 3

def add_points(points):
    global score
    score = score + points
    print(f"Added {points} points! Total: {score}")

def lose_life():
    global lives
    lives = lives - 1
    print(f"Lost a life! Lives remaining: {lives}")
    if lives == 0:
        print("GAME OVER!")

# Modifying lists (passed by reference)
def add_high_score(scores, new_score):
    scores.append(new_score)
    scores.sort(reverse=True)
    if len(scores) > 10:
        scores.pop()  # Keep only top 10
    print(f"High score added: {new_score}")

# Using the procedures
high_scores = [100, 90, 85, 80, 75]
add_high_score(high_scores, 95)
print(f"High scores: {high_scores}")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Organizing Code with Procedures</h4>
<div class="code-example">
    <pre><code># Break complex tasks into procedures
def get_user_details():
    """Get user information"""
    print("Please enter your details:")
    name = input("Name: ")
    age = int(input("Age: "))
    email = input("Email: ")
    return name, age, email  # Can return for use

def validate_age(age):
    """Check if age is valid"""
    if age < 0 or age > 150:
        display_error("Invalid age")
        return False
    return True

def display_summary(name, age, email):
    """Show user summary"""
    print("\n=== USER SUMMARY ===")
    print(f"Name: {name}")
    print(f"Age: {age}")
    print(f"Email: {email}")
    print("==================\n")

def save_to_file(name, age, email):
    """Save user data (procedure - no return)"""
    # In real program, would write to file
    print("✅ User data saved successfully!")

# Main program using procedures
def main():
    display_welcome()
    
    name, age, email = get_user_details()
    
    if validate_age(age):
        display_summary(name, age, email)
        save_to_file(name, age, email)
    
    print("Thank you!")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Procedure Best Practices</h4>
<div class="tip-box">
    <h4>💡 Writing Good Procedures:</h4>
    <ul>
        <li><strong>Clear Purpose</strong> - Name shows what it does (use verbs)</li>
        <li><strong>No Return Confusion</strong> - If it needs to return data, use a function instead</li>
        <li><strong>Document Side Effects</strong> - Note if it modifies global variables</li>
        <li><strong>Keep It Focused</strong> - One procedure, one task</li>
    </ul>
</div>

<div class="practice-box">
    <h4>🎮 Try It Yourself!</h4>
    <p>Create a student report card system using procedures:</p>
    <button class="btn btn-primary" onclick="openPlaygroundWithCode('# Student Report Card System\\n\\n# Global variables for student data\\nstudent_name = \"\"\\nsubjects = []\\nscores = []\\n\\ndef display_header():\\n    \"\"\"Display report card header\"\"\"\\n    # YOUR CODE HERE\\n    pass\\n\\ndef get_student_data():\\n    \"\"\"Get student name and subjects/scores\"\"\"\\n    global student_name, subjects, scores\\n    # YOUR CODE HERE\\n    # Get name\\n    # Get 3 subjects and their scores\\n    pass\\n\\ndef display_grades():\\n    \"\"\"Display all subjects and grades\"\"\"\\n    # YOUR CODE HERE\\n    # Show each subject with score and letter grade\\n    pass\\n\\ndef display_summary():\\n    \"\"\"Display average and overall performance\"\"\"\\n    # YOUR CODE HERE\\n    # Calculate and show average\\n    # Show pass/fail status\\n    pass\\n\\ndef print_footer():\\n    \"\"\"Print report card footer\"\"\"\\n    # YOUR CODE HERE\\n    pass\\n\\n# Main program\\nprint(\"=== STUDENT REPORT CARD GENERATOR ===\")\\nget_student_data()\\n\\n# Generate report card\\nprint(\"\\n\" + \"=\" * 40)\\ndisplay_header()\\ndisplay_grades()\\ndisplay_summary()\\nprint_footer()\\nprint(\"=\" * 40)')">Open in Playground</button>
</div>
`,
            quiz: [
                {
                    question: "When should you use a procedure instead of a function?",
                    options: [
                        "When you need to calculate something",
                        "When you need to display/print information",
                        "When you need to get user input",
                        "When you need to return multiple values"
                    ],
                    correct: 1,
                    explanation: "Use procedures for actions like displaying information that don't need to return a value."
                },
                {
                    question: "What does a procedure return in Python?",
                    options: [
                        "0",
                        "False",
                        "None",
                        "Empty string"
                    ],
                    correct: 2,
                    explanation: "Procedures implicitly return None if they don't have a return statement."
                }
            ]
        },
        
        'parameters': {
            title: 'Parameters and Arguments',
            content: `
<h3>Parameters and Arguments</h3>
<p>Parameters are the variables that functions and procedures use to receive data. Arguments are the actual values you pass when calling them.</p>

<div class="concept-box">
    <h4>🎯 Key Terms</h4>
    <ul>
        <li><strong>Parameter</strong> - Variable in function definition (placeholder)</li>
        <li><strong>Argument</strong> - Actual value passed when calling (real data)</li>
        <li><strong>Return Value</strong> - Data sent back by a function</li>
    </ul>
</div>

<h4>Understanding Parameters</h4>
<div class="code-example">
    <pre><code># Function definition with parameters
def greet(name, age):  # 'name' and 'age' are PARAMETERS
    return f"Hello {name}, you are {age} years old"

# Function call with arguments
message = greet("Alice", 16)  # "Alice" and 16 are ARGUMENTS
print(message)

# The flow:
# 1. "Alice" goes into parameter 'name'
# 2. 16 goes into parameter 'age'
# 3. Function uses these values
# 4. Returns the result</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Positional Parameters</h4>
<p>Arguments match parameters by position:</p>

<div class="code-example">
    <pre><code># Order matters!
def make_sandwich(bread, filling, sauce):
    return f"{filling} on {bread} with {sauce}"

# Correct order
sandwich1 = make_sandwich("white", "cheese", "mayo")
print(sandwich1)  # "cheese on white with mayo"

# Wrong order = wrong result!
sandwich2 = make_sandwich("mayo", "white", "cheese")
print(sandwich2)  # "white on mayo with cheese" ???

# Multiple parameters example
def calculate_pay(hours, rate, overtime_hours=0):
    regular_pay = hours * rate
    overtime_pay = overtime_hours * rate * 1.5
    return regular_pay + overtime_pay

# Using the function
pay1 = calculate_pay(40, 10)      # No overtime
pay2 = calculate_pay(40, 10, 5)   # With overtime
print(f"Regular: £{pay1}, With OT: £{pay2}")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Default Parameters</h4>
<p>Parameters can have default values:</p>

<div class="code-example">
    <pre><code># Default parameters must come after required ones
def create_user(username, role="student", active=True):
    return {
        "username": username,
        "role": role,
        "active": active
    }

# Different ways to call
user1 = create_user("alice")  # Uses defaults
print(user1)  # {'username': 'alice', 'role': 'student', 'active': True}

user2 = create_user("bob", "teacher")  # Override role
print(user2)  # {'username': 'bob', 'role': 'teacher', 'active': True}

user3 = create_user("charlie", "admin", False)  # Override both
print(user3)  # {'username': 'charlie', 'role': 'admin', 'active': False}

# Practical example
def print_receipt(items, tax_rate=0.20, currency="£"):
    subtotal = sum(items)
    tax = subtotal * tax_rate
    total = subtotal + tax
    
    print(f"Subtotal: {currency}{subtotal:.2f}")
    print(f"Tax ({tax_rate*100}%): {currency}{tax:.2f}")
    print(f"Total: {currency}{total:.2f}")

# Use with defaults
print_receipt([10, 20, 15])  # UK defaults

# Override for different country
print_receipt([10, 20, 15], tax_rate=0.08, currency="$")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Keyword Arguments</h4>
<p>You can specify which parameter gets which value:</p>

<div class="code-example">
    <pre><code># Using parameter names explicitly
def send_email(to, subject, body, cc=None, urgent=False):
    print(f"To: {to}")
    print(f"Subject: {subject}")
    if urgent:
        print("URGENT!")
    print(f"Body: {body}")
    if cc:
        print(f"CC: {cc}")

# Positional arguments (must be in order)
send_email("alice@email.com", "Meeting", "Please attend")

# Keyword arguments (any order)
send_email(
    body="Please attend the meeting",
    subject="Important Meeting",
    to="bob@email.com",
    urgent=True
)

# Mix positional and keyword (positional first!)
send_email(
    "charlie@email.com",  # Positional
    "Update",            # Positional
    body="Here's the update",  # Keyword
    urgent=True          # Keyword
)</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Variable Number of Arguments</h4>
<p>Sometimes you don't know how many arguments you'll get:</p>

<div class="code-example">
    <pre><code># *args for variable positional arguments
def calculate_total(*prices):
    # prices is a tuple of all arguments
    total = sum(prices)
    return total

# Can call with any number of arguments
print(calculate_total(10))           # 10
print(calculate_total(10, 20))       # 30
print(calculate_total(10, 20, 15, 5)) # 50

# Practical example
def find_winner(*scores):
    if not scores:
        return "No scores provided"
    
    max_score = max(scores)
    position = scores.index(max_score) + 1
    return f"Player {position} wins with {max_score} points!"

print(find_winner(85, 92, 78, 95, 88))  # Player 4 wins!

# **kwargs for variable keyword arguments
def build_profile(name, **details):
    # details is a dictionary
    profile = f"Name: {name}\n"
    for key, value in details.items():
        profile += f"{key}: {value}\n"
    return profile

# Call with any keyword arguments
print(build_profile("Alice", age=16, city="London", hobby="coding"))</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Passing Different Data Types</h4>
<div class="code-example">
    <pre><code># Passing simple types (copies)
def modify_number(x):
    x = x * 2
    print(f"Inside function: {x}")
    return x

number = 10
result = modify_number(number)
print(f"Original: {number}")  # Still 10
print(f"Result: {result}")    # 20

# Passing lists (references)
def modify_list(lst):
    lst.append(99)  # This DOES change the original!
    lst[0] = 100    # This too!
    print(f"Inside function: {lst}")

my_list = [1, 2, 3]
modify_list(my_list)
print(f"Original list: {my_list}")  # Changed!

# Safe list modification
def safe_modify_list(lst):
    new_list = lst.copy()  # Make a copy first
    new_list.append(99)
    return new_list

my_list = [1, 2, 3]
new = safe_modify_list(my_list)
print(f"Original: {my_list}")  # Unchanged
print(f"New: {new}")          # Modified copy</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<h4>Return Values</h4>
<div class="code-example">
    <pre><code># Single return value
def calculate_area(radius):
    return 3.14159 * radius ** 2

area = calculate_area(5)
print(f"Area: {area}")

# Multiple return values
def get_min_max_avg(numbers):
    minimum = min(numbers)
    maximum = max(numbers)
    average = sum(numbers) / len(numbers)
    return minimum, maximum, average

# Unpack multiple returns
data = [45, 67, 23, 89, 12, 56]
min_val, max_val, avg_val = get_min_max_avg(data)
print(f"Min: {min_val}, Max: {max_val}, Avg: {avg_val:.1f}")

# Return different types
def process_score(score):
    if score < 0:
        return None  # Invalid
    elif score >= 50:
        return True  # Pass
    else:
        return False  # Fail

# Check return value
result = process_score(75)
if result is None:
    print("Invalid score")
elif result:
    print("Passed!")
else:
    print("Failed")</code></pre>
    <button class="copy-btn" onclick="copyToClipboard(this)">📋 Copy</button>
</div>

<div class="practice-box">
    <h4>🎮 Try It Yourself!</h4>
    <p>Create a flexible shopping calculator with various parameter types:</p>
    <button class="btn btn-primary" onclick="openPlaygroundWithCode('# Shopping Calculator with Parameters\\n\\ndef calculate_item_total(price, quantity=1, discount=0):\\n    \"\"\"Calculate total for one item type\"\"\"\\n    # YOUR CODE HERE\\n    # Apply discount as percentage\\n    # Return total for this item\\n    pass\\n\\ndef calculate_basket(*items, tax_rate=0.20, delivery=0):\\n    \"\"\"Calculate total for multiple items\"\"\"\\n    # YOUR CODE HERE\\n    # items is a tuple of (price, quantity, discount) tuples\\n    # Calculate subtotal of all items\\n    # Add tax\\n    # Add delivery\\n    # Return total\\n    pass\\n\\ndef generate_receipt(customer_name, *items, **options):\\n    \"\"\"Generate detailed receipt\"\"\"\\n    # YOUR CODE HERE\\n    # options might include: tax_rate, delivery, currency, etc.\\n    # Print formatted receipt with all items\\n    # Show subtotal, tax, delivery, total\\n    pass\\n\\n# Test the functions\\nprint(\"=== SHOPPING CALCULATOR ===\")\\n\\n# Single item\\nitem1_total = calculate_item_total(25.99, 2, 10)  # 10% off\\nprint(f\"Item 1 total: £{item1_total:.2f}\")\\n\\n# Multiple items with default tax\\ntotal = calculate_basket(\\n    (10, 1, 0),    # £10, qty 1, no discount\\n    (20, 2, 5),    # £20, qty 2, 5% discount\\n    (15, 1, 10),   # £15, qty 1, 10% discount\\n    delivery=5.99\\n)\\nprint(f\"Basket total: £{total:.2f}\")\\n\\n# Full receipt\\ngenerate_receipt(\\n    \"Alice Smith\",\\n    (10, 1, 0),\\n    (20, 2, 5),\\n    tax_rate=0.15,\\n    delivery=5.99,\\n    currency=\"$\"\\n)')">Open in Playground</button>
</div>
`,
            quiz: [
                {
                    question: "What's the difference between a parameter and an argument?",
                    options: [
                        "They are the same thing",
                        "Parameters are in the definition, arguments are the actual values",
                        "Arguments are in the definition, parameters are the actual values",
                        "Parameters are for functions, arguments are for procedures"
                    ],
                    correct: 1,
                    explanation: "Parameters are the variable names in the function definition. Arguments are the actual values passed when calling."
                },
                {
                    question: "What happens if you pass a list as an argument to a function?",
                    options: [
                        "A copy is always made",
                        "The original list cannot be modified",
                        "Changes to the list affect the original",
                        "An error occurs"
                    ],
                    correct: 2,
                    explanation: "Lists are passed by reference, so modifications inside the function affect the original list."
                }
            ]
        }
    }
};

// Guide functionality
function initializeProgrammingGuide() {
    console.log('Initializing Programming Guide...');
    
    // Add guide button to sidebar
    addGuideButton();
    
    // Set up event listeners
    setupGuideListeners();
}

function addGuideButton() {
    const maxRetries = 10;
    let retries = 0;
    
    function tryAddButton() {
        const sidebar = document.getElementById('sidebar-nav');
        if (!sidebar) {
            if (retries < maxRetries) {
                retries++;
                setTimeout(tryAddButton, 500); // Retry after 500ms
            } else {
                console.error('Could not find sidebar after', maxRetries, 'attempts');
            }
            return;
        }
        
        // Check if button already exists
        if (document.querySelector('.guide-btn')) {
            return;
        }
        
        // Create guide section
        const guideSection = document.createElement('div');
        guideSection.className = 'guide-section';
        guideSection.innerHTML = `
            <button class="btn btn-primary guide-btn" onclick="openProgrammingGuide()">
                📖 Programming Guide
            </button>
        `;
        
        sidebar.appendChild(guideSection);
    }
    
    tryAddButton();
}

function openProgrammingGuide() {
    const modal = document.createElement('div');
    modal.className = 'guide-modal-overlay';
    modal.innerHTML = `
        <div class="guide-modal">
            <div class="guide-header">
                <h1>📖 GCSE Programming Guide</h1>
                <button class="close-btn" onclick="closeProgrammingGuide()">×</button>
            </div>
            <div class="guide-container">
                <div class="guide-sidebar">
                    <h3>Topics</h3>
                    ${generateGuideSidebar()}
                </div>
                <div class="guide-content" id="guide-content">
                    ${generateWelcomeContent()}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for navigation
    setupGuideNavigation();
}

function generateGuideSidebar() {
    let html = '';
    
    PROGRAMMING_GUIDE.sections.forEach(section => {
        html += `
            <div class="guide-section-group">
                <h4>${section.icon} ${section.title}</h4>
                <ul class="guide-topic-list">
        `;
        
        section.topics.forEach(topicId => {
            const topic = PROGRAMMING_GUIDE.content[topicId];
            if (topic) {
                html += `
                    <li>
                        <a href="#" class="guide-topic-link" data-topic="${topicId}">
                            ${topic.title}
                        </a>
                    </li>
                `;
            }
        });
        
        html += `
                </ul>
            </div>
        `;
    });
    
    return html;
}

function generateWelcomeContent() {
    return `
        <div class="guide-welcome">
            <h2>Welcome to the GCSE Programming Guide!</h2>
            <p>This guide covers all the programming concepts you need for the J277 Computer Science specification.</p>
            
            <div class="guide-features">
                <div class="feature-card">
                    <h3>📚 Learn</h3>
                    <p>Clear explanations with examples for every concept</p>
                </div>
                <div class="feature-card">
                    <h3>💻 Practice</h3>
                    <p>Try examples in the code playground</p>
                </div>
                <div class="feature-card">
                    <h3>🎯 Test</h3>
                    <p>Check your understanding with quizzes</p>
                </div>
            </div>
            
            <h3>How to Use This Guide</h3>
            <ol>
                <li>Choose a topic from the sidebar</li>
                <li>Read through the explanations and examples</li>
                <li>Try the code examples yourself</li>
                <li>Test your knowledge with the quiz</li>
                <li>Practice with the coding challenges</li>
            </ol>
            
            <p><strong>Tip:</strong> Work through the topics in order if you're new to programming!</p>
        </div>
    `;
}

function loadGuideTopic(topicId) {
    const content = PROGRAMMING_GUIDE.content[topicId];
    if (!content) return;
    
    const contentDiv = document.getElementById('guide-content');
    contentDiv.innerHTML = `
        <div class="guide-topic">
            <h2>${content.title}</h2>
            ${content.content}
            
            ${content.quiz ? generateQuizSection(topicId, content.quiz) : ''}
        </div>
    `;
    
    // Add copy functionality to code examples
    setupCodeCopyButtons();
    
    // Highlight active topic
    document.querySelectorAll('.guide-topic-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.topic === topicId) {
            link.classList.add('active');
        }
    });
}

function generateQuizSection(topicId, questions) {
    let html = '<div class="guide-quiz"><h3>🎯 Quick Quiz</h3>';
    
    questions.forEach((q, index) => {
        html += `
            <div class="quiz-question" data-topic="${topicId}" data-question="${index}">
                <p><strong>Q${index + 1}:</strong> ${q.question}</p>
                <div class="quiz-options">
        `;
        
        q.options.forEach((option, optIndex) => {
            html += `
                <label class="quiz-option">
                    <input type="radio" name="quiz-${topicId}-${index}" value="${optIndex}">
                    <span>${option}</span>
                </label>
            `;
        });
        
        html += `
                </div>
                <button class="btn btn-primary btn-sm" onclick="checkQuizAnswer('${topicId}', ${index})">
                    Check Answer
                </button>
                <div class="quiz-feedback" id="feedback-${topicId}-${index}"></div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function checkQuizAnswer(topicId, questionIndex) {
    const question = PROGRAMMING_GUIDE.content[topicId].quiz[questionIndex];
    const selectedOption = document.querySelector(`input[name="quiz-${topicId}-${questionIndex}"]:checked`);
    const feedbackDiv = document.getElementById(`feedback-${topicId}-${questionIndex}`);
    
    if (!selectedOption) {
        feedbackDiv.innerHTML = '<p class="incorrect">Please select an answer!</p>';
        return;
    }
    
    const answer = parseInt(selectedOption.value);
    
    if (answer === question.correct) {
        feedbackDiv.innerHTML = `
            <p class="correct">✅ Correct!</p>
            <p class="explanation">${question.explanation}</p>
        `;
    } else {
        feedbackDiv.innerHTML = `
            <p class="incorrect">❌ Not quite right.</p>
            <p class="explanation">${question.explanation}</p>
        `;
    }
}

function setupGuideNavigation() {
    // Topic links
    document.querySelectorAll('.guide-topic-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const topicId = link.dataset.topic;
            loadGuideTopic(topicId);
        });
    });
}

function setupCodeCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            copyToClipboard(this);
        });
    });
}

async function copyToClipboard(button) {
    const codeBlock = button.previousElementSibling;
    const code = codeBlock.textContent;
    
    if (window.copyToClipboard) {
        const success = await window.copyToClipboard(code);
        if (success) {
            const originalText = button.textContent;
            button.textContent = '✅ Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        }
    } else {
        console.error('Global copyToClipboard function not found');
    }
}

function openPlaygroundWithCode(code) {
    // Close the guide
    closeProgrammingGuide();
}

function closeProgrammingGuide() {
    const modal = document.querySelector('.guide-modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function setupGuideListeners() {
    // Add keyboard shortcut (Ctrl/Cmd + G)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
            e.preventDefault();
            openProgrammingGuide();
        }
    });
}

// Guide styles
// Check if guide styles already exist
if (!document.getElementById('guide-modal-styles')) {
    const guideStyles = document.createElement('style');
    guideStyles.id = 'guide-modal-styles';
    guideStyles.textContent = `
/* Guide Button */
.guide-section {
    padding: 1rem;
    border-top: 1px solid var(--border-color);
    margin-top: 1rem;
}

.guide-btn {
    width: 100%;
    font-size: 1rem;
    padding: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

/* Guide Modal */
.guide-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 6000;
}

.guide-modal {
    background: var(--bg-secondary);
    width: 90%;
    height: 90%;
    max-width: 1400px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.guide-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-primary);
}

.guide-header h1 {
    margin: 0;
    font-size: 1.75rem;
}

.guide-container {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.guide-sidebar {
    width: 300px;
    background: var(--bg-primary);
    padding: 1.5rem;
    overflow-y: auto;
    border-right: 1px solid var(--border-color);
}

.guide-sidebar h3 {
    margin-top: 0;
    margin-bottom: 1rem;
}

.guide-section-group {
    margin-bottom: 2rem;
}

.guide-section-group h4 {
    margin-bottom: 0.5rem;
    color: var(--primary-color);
}

.guide-topic-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.guide-topic-link {
    display: block;
    padding: 0.5rem 0.75rem;
    text-decoration: none;
    color: var(--text-primary);
    border-radius: 4px;
    transition: background 0.2s;
}

.guide-topic-link:hover {
    background: var(--border-color);
}

.guide-topic-link.active {
    background: var(--primary-color);
    color: white;
}

.guide-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
}

/* Guide Content Styles */
.guide-welcome {
    max-width: 800px;
    margin: 0 auto;
}

.guide-features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
}

.feature-card {
    background: var(--bg-primary);
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
}

.feature-card h3 {
    margin-top: 0;
}

.guide-topic h2 {
    margin-top: 0;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--primary-light);
}

.guide-topic h3 {
    margin-top: 2rem;
    color: var(--primary-color);
}

.guide-topic h4 {
    margin-top: 1.5rem;
}

/* Content Elements */
.concept-box {
    background: var(--primary-light);
    padding: 1.5rem;
    border-radius: 8px;
    margin: 1rem 0;
    border-left: 4px solid var(--primary-color);
}

.code-example {
    position: relative;
    margin: 1rem 0;
}

.code-example pre {
    background: #2d2d2d;
    color: #f8f8f2;
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
}

.code-example code {
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
}

.copy-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
}

.tip-box, .warning-box, .rules-box {
    padding: 1rem;
    border-radius: 6px;
    margin: 1rem 0;
}

.tip-box {
    background: #e3f2fd;
    border-left: 4px solid #2196f3;
}

.warning-box {
    background: #fff3cd;
    border-left: 4px solid #ffc107;
}

.rules-box {
    background: #f8f9fa;
    border: 1px solid var(--border-color);
}

.practice-box {
    background: #f0f9ff;
    padding: 1.5rem;
    border-radius: 8px;
    margin: 2rem 0;
    border: 2px solid #3b82f6;
}

.practice-box h4 {
    margin-top: 0;
}

/* Tables */
.data-types-table, .operators-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
}

.data-types-table th, .operators-table th {
    background: var(--primary-color);
    color: white;
    padding: 0.75rem;
    text-align: left;
}

.data-types-table td, .operators-table td {
    padding: 0.75rem;
    border: 1px solid var(--border-color);
}

.data-types-table tr:nth-child(even), .operators-table tr:nth-child(even) {
    background: var(--bg-primary);
}

/* Quiz Section */
.guide-quiz {
    margin-top: 3rem;
    padding: 1.5rem;
    background: var(--bg-primary);
    border-radius: 8px;
}

.quiz-question {
    margin-bottom: 2rem;
    padding: 1rem;
    background: white;
    border-radius: 6px;
}

.quiz-options {
    margin: 1rem 0;
}

.quiz-option {
    display: block;
    padding: 0.5rem;
    margin: 0.25rem 0;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s;
}

.quiz-option:hover {
    background: var(--bg-primary);
}

.quiz-feedback {
    margin-top: 1rem;
}

.quiz-feedback .correct {
    color: var(--success-color);
    font-weight: bold;
}

.quiz-feedback .incorrect {
    color: var(--error-color);
    font-weight: bold;
}

.quiz-feedback .explanation {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: var(--bg-primary);
    border-radius: 4px;
}

/* Responsive */
@media (max-width: 992px) {
    .guide-container {
        flex-direction: column;
    }
    
    .guide-sidebar {
        width: 100%;
        max-height: 200px;
        border-right: none;
        border-bottom: 1px solid var(--border-color);
    }
    
    .guide-features {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .guide-modal {
        width: 100%;
        height: 100%;
        border-radius: 0;
    }
    
    .code-example pre {
        font-size: 0.8rem;
    }
}
`;
document.head.appendChild(guideStyles);
}

// Export for use
if (typeof window !== 'undefined') {
    window.initializeProgrammingGuide = initializeProgrammingGuide;
    window.openProgrammingGuide = openProgrammingGuide;
    window.closeProgrammingGuide = closeProgrammingGuide;
    window.checkQuizAnswer = checkQuizAnswer;
    window.openPlaygroundWithCode = openPlaygroundWithCode;
    window.copyToClipboard = copyToClipboard;
    window.PROGRAMMING_GUIDE = PROGRAMMING_GUIDE;
    
}