import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Helper Functions for Expression Logic ---

const operators = ['+', '-', '*', '/'];
const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

// Generates a random expression tree
function generateExpressionTree(depth = 0) {
    if (depth > 2 || (depth > 0 && Math.random() > 0.6)) {
        return { value: Math.floor(Math.random() * 9) + 1 };
    }
    const node = {
        op: operators[Math.floor(Math.random() * operators.length)],
        left: generateExpressionTree(depth + 1),
        right: generateExpressionTree(depth + 1)
    };
    if (node.op === '/' && node.right.value === 0) {
        node.right.value = Math.floor(Math.random() * 8) + 1;
    }
    return node;
}

// Converts an expression tree to an Infix string
function toInfix(node) {
    if (node.value !== undefined) return node.value.toString();
    const left = toInfix(node.left);
    const right = toInfix(node.right);
    const leftNeedsBrackets = node.left.op && precedence[node.left.op] < precedence[node.op];
    const rightNeedsBrackets = node.right.op && precedence[node.right.op] <= precedence[node.op];
    const leftStr = leftNeedsBrackets ? `(${left})` : left;
    const rightStr = rightNeedsBrackets ? `(${right})` : right;
    return `${leftStr} ${node.op} ${rightStr}`;
}

// Converts an expression tree to an RPN string
function toRPN(node) {
    if (node.value !== undefined) return node.value.toString();
    const left = toRPN(node.left);
    const right = toRPN(node.right);
    return `${left} ${right} ${node.op}`;
}

// Safely evaluates an RPN expression string
function evaluateRPN(rpn) {
    if (!rpn) return NaN;
    const stack = [];
    const tokens = rpn.split(' ');
    for (const token of tokens) {
        if (token === '') continue;
        if (!isNaN(parseFloat(token))) {
            stack.push(parseFloat(token));
        } else {
            if (stack.length < 2) return NaN;
            const b = stack.pop();
            const a = stack.pop();
            switch (token) {
                case '+': stack.push(a + b); break;
                case '-': stack.push(a - b); break;
                case '*': stack.push(a * b); break;
                case '/': if (b === 0) return NaN; stack.push(a / b); break;
                default: return NaN;
            }
        }
    }
    return stack.length === 1 ? stack[0] : NaN;
}

// Converts an infix string to an RPN string using Shunting-Yard
function infixToRPN(infix) {
    const outputQueue = [];
    const operatorStack = [];
    const tokens = infix.replace(/\s+/g, '').match(/(\d+\.?\d*|[+\-*/()])/g);

    if (!tokens) return '';

    for (const token of tokens) {
        if (!isNaN(parseFloat(token))) {
            outputQueue.push(token);
        } else if (operators.includes(token)) {
            while (
                operatorStack.length > 0 &&
                operatorStack[operatorStack.length - 1] !== '(' &&
                precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
            ) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        } else if (token === '(') {
            operatorStack.push(token);
        } else if (token === ')') {
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                outputQueue.push(operatorStack.pop());
            }
            if (operatorStack[operatorStack.length - 1] === '(') {
                operatorStack.pop();
            }
        }
    }

    while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
    }

    return outputQueue.join(' ');
}


// --- React Components ---

// Scratchpad Component
const Scratchpad = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState('pen');

    const setupCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const parent = canvas.parentElement;
        canvas.width = parent.clientWidth * 2;
        canvas.height = (parent.clientWidth / 2) * 2;
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientWidth / 2}px`;

        const context = canvas.getContext('2d');
        context.scale(2, 2);
        context.lineCap = 'round';
        context.strokeStyle = '#FFFFFF';
        context.lineWidth = 2;
        contextRef.current = context;
    }, []);

    useEffect(() => {
        setupCanvas();
        window.addEventListener('resize', setupCanvas);
        return () => window.removeEventListener('resize', setupCanvas);
    }, [setupCanvas]);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.globalCompositeOperation = tool === 'pen' ? 'source-over' : 'destination-out';
        contextRef.current.lineWidth = tool === 'pen' ? 2 : 20;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };
    
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div className="mt-8 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-300">Scratchpad</h3>
                <div className="flex gap-2">
                    <button onClick={() => setTool('pen')} className={`btn text-sm p-2 ${tool === 'pen' ? 'active' : ''}`}>Pen</button>
                    <button onClick={() => setTool('eraser')} className={`btn text-sm p-2 ${tool === 'eraser' ? 'active' : ''}`}>Eraser</button>
                    <button onClick={clearCanvas} className="btn text-sm p-2">Clear</button>
                </div>
            </div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onMouseLeave={finishDrawing}
                className="drawing-canvas"
            />
        </div>
    );
};


// QuizPage Component
const QuizPage = ({ mode }) => {
    const [question, setQuestion] = useState({ infix: '', rpn: '' });
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const generateNewQuestion = useCallback(() => {
        const tree = generateExpressionTree();
        setQuestion({
            infix: toInfix(tree),
            rpn: toRPN(tree),
        });
        setAnswer('');
        setFeedback({ message: '', type: '' });
    }, []);

    useEffect(() => {
        generateNewQuestion();
    }, [generateNewQuestion, mode]);

    const checkAnswer = () => {
        const userAnswerRaw = answer;
        let isCorrect = false;
        let correctAnswer = '';

        if (mode === 'to-rpn') {
            correctAnswer = question.rpn.replace(/\s+/g, '');
            isCorrect = userAnswerRaw.replace(/\s/g, '') === correctAnswer;
        } else { // 'to-infix'
            correctAnswer = question.infix;
            try {
                // Convert user's infix answer to RPN, then evaluate
                const userRPN = infixToRPN(userAnswerRaw);
                const userResult = evaluateRPN(userRPN);
                
                // Evaluate the correct RPN
                const correctResult = evaluateRPN(question.rpn);

                // Compare results with a small tolerance for floating point issues
                if (!isNaN(userResult) && Math.abs(userResult - correctResult) < 0.001) {
                    isCorrect = true;
                } else {
                    throw new Error("Incorrect result");
                }
            } catch (e) {
                isCorrect = false;
            }
        }
        
        if (isCorrect) {
            setFeedback({ message: 'Correct! Well done.', type: 'success' });
        } else {
            const message = `Not quite. The correct answer is: ${correctAnswer}`;
            setFeedback({ message, type: 'error' });
        }
    };

    const feedbackColor = feedback.type === 'success' ? 'text-green-400' : 'text-red-400';
    const inputColor = feedback.type === 'success' ? 'border-green-500' : feedback.type === 'error' ? 'border-red-500' : 'border-gray-600';

    return (
        <div className="glass-card p-8 text-center">
            <h2 className="text-2xl font-bold mb-2 text-white">
                {mode === 'to-rpn' ? 'Convert to Reverse Polish Notation' : 'Convert to Infix Notation'}
            </h2>
            <p className="mb-4 text-gray-400">
                {mode === 'to-rpn' ? 'Convert the Infix expression to RPN. Do not use spaces.' : 'Convert the RPN expression to a valid Infix expression.'}
            </p>
            <div className="font-mono text-2xl text-orange-400 bg-gray-900 p-4 rounded-lg mb-4 min-h-[68px] flex items-center justify-center">
                {mode === 'to-rpn' ? question.infix : question.rpn}
            </div>
            
            <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={mode === 'to-rpn' ? 'Your RPN answer...' : 'Your Infix answer...'}
                className={`max-w-lg mx-auto bg-gray-800 border-2 rounded-lg p-3 text-white text-center font-mono transition-all duration-300 ${inputColor}`}
            />
            
            <div className={`mt-4 text-lg min-h-[50px] font-semibold ${feedbackColor}`}>
                {feedback.message}
            </div>

            <div className="flex justify-center gap-4 mt-4">
                <button onClick={checkAnswer} className="btn btn-primary">Check Answer</button>
                <button onClick={generateNewQuestion} className="btn">New Question</button>
            </div>

            <Scratchpad />
        </div>
    );
};


// Main App Component
export default function App() {
    const [mode, setMode] = useState('to-rpn');

    const commonBtnStyles = "btn transition-all duration-300";
    const activeBtnStyles = "active bg-gradient-to-r from-pink-500 to-orange-500 text-white border-transparent shadow-lg";
    const inactiveBtnStyles = "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600";

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
            <style>{`
                :root { --accent-color: #e94560; --accent-hover: #f97316; }
                .glass-card { background: rgba(31, 41, 55, 0.5); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
                .btn { padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; }
                .btn-primary { background: linear-gradient(45deg, var(--accent-color), var(--accent-hover)); color: white; border: none; }
                .btn.active { background: linear-gradient(45deg, var(--accent-color), var(--accent-hover)); color: white; border: none; }
                .drawing-canvas { background-color: rgba(17, 24, 39, 0.7); border-radius: 0.5rem; cursor: crosshair; touch-action: none; display: block; }
            `}</style>
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-6">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-rose-500">Conversion Practice</h1>
                    <p className="mt-2 text-lg text-gray-300">Infinite questions for Infix & RPN conversion.</p>
                </header>

                <div className="flex justify-center gap-4 mb-6">
                    <button onClick={() => setMode('to-rpn')} className={`${commonBtnStyles} ${mode === 'to-rpn' ? activeBtnStyles : inactiveBtnStyles}`}>
                        Infix &rarr; RPN
                    </button>
                    <button onClick={() => setMode('to-infix')} className={`${commonBtnStyles} ${mode === 'to-infix' ? activeBtnStyles : inactiveBtnStyles}`}>
                        RPN &rarr; Infix
                    </button>
                </div>

                <main>
                    {mode === 'to-rpn' ? <QuizPage mode="to-rpn" key="to-rpn" /> : <QuizPage mode="to-infix" key="to-infix" />}
                </main>
            </div>
        </div>
    );
}
