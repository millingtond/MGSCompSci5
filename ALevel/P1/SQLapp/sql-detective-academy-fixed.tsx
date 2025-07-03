import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, FileText, Database, Award, ChevronRight, AlertCircle, CheckCircle, BookOpen, Users, MapPin, Calendar, User, Lock, Unlock, Coffee, Briefcase, Phone, Mail, Clock, TrendingUp, Shield, Star, Target, Key, Fingerprint, Camera, FileSearch, UserX, Play, Pause, SkipForward, Eye, Link2, Zap, Grid3x3 } from 'lucide-react';

// Type Definitions
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

interface ExecutionStep {
  step: string;
  description: string;
  highlight: string;
}

interface QueryResultRow {
  [key: string]: any;
  suspect_id?: number;
  witness_id?: number;
  evidence_id?: number;
}

interface GroupedData {
  [key: string]: QueryResultRow[];
}

interface CountResult {
  [key: string]: number | string;
  count?: number;
}

interface AverageResult {
  [key: string]: string;
}

interface QuinnMessage {
  id: number;
  text: string;
  type: 'message' | 'thinking';
  timestamp?: string;
}

// Quinn responses moved outside component to prevent recreation
const quinnResponses = {
  welcome: [
    "👋 Hi there, Detective! I'm Quinn, your AI partner. I'll guide you through these cases without spoiling the mystery!",
    "🕵️ Ready to solve some mysteries? I'm here to help you think through the problems, not just give you answers!",
    "💡 Welcome to the Academy! Let's work together to build your detective skills. I'll give you hints, not solutions!"
  ],
  firstQuery: [
    "🎉 Excellent! You've executed your first query! The asterisk means 'give me all columns' - very thorough!",
    "👏 Great start! You're retrieving data from the database. Now try adding conditions to filter what you get back.",
    "✨ Your first query! You've learned how to ask the database for information. What will you investigate next?"
  ],
  whereClause: [
    "🔍 Smart thinking! WHERE clauses help us filter suspects. It's like sorting evidence into relevant piles.",
    "💭 I see you're narrowing down the suspects! WHERE is our magnifying glass for finding specific clues.",
    "🎯 Good detective work! You're filtering the data to find exactly what we need."
  ],
  joinSuccess: [
    "🔗 Brilliant! You've connected the evidence! JOINs are like finding the red string that links clues together.",
    "🤝 Excellent connection! You've linked two tables - that's advanced detective work!",
    "⭐ Impressive! JOINs help us see the bigger picture by connecting related information."
  ],
  syntaxError: [
    "🤔 Hmm, there's a small issue with the query structure. Let me think... ",
    "📝 I noticed a syntax hiccup. SQL has a specific order for its parts, like a sentence structure.",
    "💡 Almost there! The query structure needs a tiny adjustment. Remember: action, what, from where, conditions."
  ],
  tableNotFound: [
    "📋 That table doesn't exist in our evidence room. Check the Evidence Room to see what information we have available.",
    "🗂️ I can't find that table. Visit the Evidence Room module to see our database structure!",
    "❓ Hmm, that table isn't in our database. Remember, table names should match what's in our system exactly."
  ],
  encouragement: [
    "💪 Don't give up! Every great detective makes mistakes while learning.",
    "🌟 You're doing great! Each query teaches us something new.",
    "🎯 Keep going! You're closer to solving this than you think!"
  ],
  thinking: [
    "🤔 Let me analyze this query...",
    "💭 Thinking about the best approach...",
    "🔍 Examining the evidence...",
    "📊 Processing the data..."
  ],
  caseComplete: [
    "🎉 CASE CLOSED! Brilliant detective work! You've mastered this investigation technique!",
    "🏆 Outstanding! You've solved the case! Your SQL skills are growing stronger!",
    "⭐ Excellent work, Detective! Another mystery solved through careful data analysis!"
  ],
  hints: {
    noAlibi: "💡 Think about it: we need suspects who can't prove where they were. Look for a field that shows if someone has an alibi, and check when it's not true.",
    age: "💡 Age comparison needs a comparison operator. Which symbol means 'greater than' in math? Remember to specify which field contains the age.",
    join: "💡 To connect tables, you need to match their related fields. Look for columns that appear in both tables (hint: they often end with '_id').",
    count: "💡 There's a function that counts rows. It takes an asterisk (*) as a parameter. Don't forget to give your count result a name!",
    groupBy: "💡 There's a clause that groups rows with the same value together. It comes after WHERE but before ORDER BY."
  }
};

const SQLDetectiveAcademy = () => {
  const [activeModule, setActiveModule] = useState('office');
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResultRow[] | null>(null);
  const [queryError, setQueryError] = useState('');
  const [detectiveRank, setDetectiveRank] = useState('Rookie Detective');
  const [xp, setXp] = useState(0);
  const [completedCases, setCompletedCases] = useState<string[]>([]);
  const [currentHint, setCurrentHint] = useState('');
  const [unlockedCases, setUnlockedCases] = useState(['case1', 'case2', 'case3']);
  const [badges, setBadges] = useState<string[]>([]);
  const [activeCase, setActiveCase] = useState<string | null>(null);
  const [notebook, setNotebook] = useState<{ id: number; note: string; timestamp: string }[]>([]);
  
  // Visual Query Execution States
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState('');
  const [highlightedRows, setHighlightedRows] = useState<number[]>([]);
  const [filteredRows, setFilteredRows] = useState<(number | undefined)[]>([]);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  
  // Evidence Board States
  const [boardMode, setBoardMode] = useState('visual');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [whereConditions, setWhereConditions] = useState<string[]>([]);
  const [joinConnections, setJoinConnections] = useState<any[]>([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [connectionStart, setConnectionStart] = useState(null);
  const [hoveredSuspect, setHoveredSuspect] = useState<number | null>(null);
  
  // Quinn AI Assistant States
  const [quinnMessages, setQuinnMessages] = useState<QuinnMessage[]>([]);
  const [quinnThinking, setQuinnThinking] = useState(false);
  const [showQuinn, setShowQuinn] = useState(false);
  const [quinnMood, setQuinnMood] = useState('neutral');
  const [quinnInteractions, setQuinnInteractions] = useState(0);
  const [recentErrors, setRecentErrors] = useState<string[]>([]);
  
  // Visual Polish States
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [vintageMode, setVintageMode] = useState(false);
  const [isRaining, setIsRaining] = useState(false);
  const [suspectAnimations, setSuspectAnimations] = useState<{ [key: number]: boolean }>({});
  const [rotatingEvidence, setRotatingEvidence] = useState<{ [key: number]: boolean }>({});
  const [celebration, setCelebration] = useState(false);
  const [quinnNotification, setQuinnNotification] = useState(false);

  // Expanded detective database
  const database = {
    suspects: [
      { suspect_id: 1, name: 'John Smith', age: 35, occupation: 'Banker', height: 180, has_alibi: false, last_seen: '2025-01-15 22:30', location_id: 1 },
      { suspect_id: 2, name: 'Sarah Johnson', age: 28, occupation: 'Artist', height: 165, has_alibi: true, last_seen: '2025-01-14 18:00', location_id: 3 },
      { suspect_id: 3, name: 'Mike Wilson', age: 42, occupation: 'Security Guard', height: 190, has_alibi: false, last_seen: '2025-01-15 23:45', location_id: 1 },
      { suspect_id: 4, name: 'Emma Davis', age: 31, occupation: 'Teacher', height: 170, has_alibi: true, last_seen: '2025-01-13 16:00', location_id: 2 },
      { suspect_id: 5, name: 'Robert Brown', age: 55, occupation: 'Janitor', height: 175, has_alibi: false, last_seen: '2025-01-15 22:00', location_id: 1 },
      { suspect_id: 6, name: 'Lisa Anderson', age: 26, occupation: 'Journalist', height: 168, has_alibi: true, last_seen: '2025-01-15 20:00', location_id: 4 },
      { suspect_id: 7, name: 'David Lee', age: 39, occupation: 'Chef', height: 172, has_alibi: false, last_seen: '2025-01-15 21:30', location_id: 5 },
      { suspect_id: 8, name: 'Maria Garcia', age: 44, occupation: 'Lawyer', height: 162, has_alibi: true, last_seen: '2025-01-14 17:00', location_id: 2 }
    ],
    witnesses: [
      { witness_id: 1, name: 'Alice Cooper', age: 67, statement: 'Saw a tall man in dark clothes near the museum at 10 PM', credibility: 8, date_interviewed: '2025-01-16', suspect_id: 3 },
      { witness_id: 2, name: 'Tom Baker', age: 45, statement: 'Heard glass breaking around 10:30 PM from my apartment', credibility: 9, date_interviewed: '2025-01-16', suspect_id: null },
      { witness_id: 3, name: 'Lisa White', age: 29, statement: 'The security guard was acting nervous earlier that day', credibility: 7, date_interviewed: '2025-01-16', suspect_id: 3 },
      { witness_id: 4, name: 'James Miller', age: 52, statement: 'Saw someone running from the museum around 10:45 PM', credibility: 6, date_interviewed: '2025-01-17', suspect_id: null },
      { witness_id: 5, name: 'Nancy Drew', age: 38, statement: 'The janitor had keys to all rooms', credibility: 9, date_interviewed: '2025-01-17', suspect_id: 5 }
    ],
    evidence: [
      { evidence_id: 1, type: 'Fingerprint', description: 'Partial print on display case', location: 'Main Gallery', found_date: '2025-01-16 09:00', suspect_id: 3 },
      { evidence_id: 2, type: 'Security Footage', description: 'Figure entering at 10:15 PM', location: 'Main Entrance', found_date: '2025-01-16 08:00', suspect_id: 1 },
      { evidence_id: 3, type: 'Footprint', description: 'Size 11 boot print', location: 'Back Door', found_date: '2025-01-16 10:30', suspect_id: null },
      { evidence_id: 4, type: 'Fiber', description: 'Blue uniform fiber', location: 'Display Case', found_date: '2025-01-16 14:00', suspect_id: 3 },
      { evidence_id: 5, type: 'Tool Mark', description: 'Crowbar marks on door', location: 'Storage Room', found_date: '2025-01-16 11:00', suspect_id: null }
    ],
    locations: [
      { location_id: 1, name: 'City Museum', address: '123 Heritage St', type: 'Crime Scene' },
      { location_id: 2, name: 'Downtown Office', address: '456 Business Ave', type: 'Workplace' },
      { location_id: 3, name: 'Art Studio', address: '789 Creative Ln', type: 'Workplace' },
      { location_id: 4, name: 'News Building', address: '321 Press Rd', type: 'Workplace' },
      { location_id: 5, name: 'Restaurant District', address: '654 Culinary Way', type: 'Business' }
    ],
    cases: [
      { case_id: 1, name: 'Museum Heist', status: 'Active', opened_date: '2025-01-16', lead_detective: 'You' },
      { case_id: 2, name: 'Corporate Fraud', status: 'Active', opened_date: '2025-01-10', lead_detective: 'You' },
      { case_id: 3, name: 'Missing Person', status: 'Cold', opened_date: '2024-12-01', lead_detective: 'Det. Morgan' }
    ],
    phone_records: [
      { record_id: 1, caller_id: 1, recipient_id: 3, call_time: '2025-01-15 21:45', duration: 120 },
      { record_id: 2, caller_id: 3, recipient_id: 5, call_time: '2025-01-15 22:10', duration: 45 },
      { record_id: 3, caller_id: 2, recipient_id: 6, call_time: '2025-01-14 19:30', duration: 300 }
    ]
  };

  // Utility sleep function
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Quinn's thinking process with proper cleanup
  const quinnThink = useCallback(async (message, mood = 'thinking') => {
    setQuinnThinking(true);
    setQuinnMood(mood);
    
    // Add thinking message
    const thinkingMessage = {
      id: Date.now(),
      text: quinnResponses.thinking[Math.floor(Math.random() * quinnResponses.thinking.length)],
      type: 'thinking'
    };
    setQuinnMessages(prev => [...prev, thinkingMessage]);
    
    // Simulate thinking time
    await sleep(1500);
    
    // Remove thinking message and add actual message
    setQuinnMessages(prev => prev.filter(m => m.id !== thinkingMessage.id));
    addQuinnMessage(message, mood);
    setQuinnThinking(false);
  }, []);

  // Add Quinn message with overflow prevention
  const addQuinnMessage = useCallback((text, mood = 'neutral') => {
    setQuinnMood(mood);
    setQuinnMessages(prev => {
      // Keep only last 10 messages to prevent overflow
      const newMessage = {
        id: Date.now() + Math.random(), // Ensure unique ID
        text,
        type: 'message',
        timestamp: new Date().toLocaleTimeString()
      };
      const newMessages = [...prev.slice(-9), newMessage];
      
      // Ensure unique IDs
      return newMessages.filter((msg, index, self) => 
        index === self.findIndex(m => m.id === msg.id)
      );
    });
    
    // Track interactions for badge
    setQuinnInteractions(prev => {
      const newCount = prev + 1;
      if (newCount === 5) {
        setBadges(prevBadges => {
          if (!prevBadges.includes('quinn_friend')) {
            addToNotebook("🏆 Earned badge: Quinn's Friend!");
            return [...prevBadges, 'quinn_friend'];
          }
          return prevBadges;
        });
      }
      return newCount;
    });
  }, []);

  // Quinn analyzes query attempts only when open
  const analyzeQueryForQuinn = useCallback((query, error, result) => {
    if (!showQuinn) return;
    
    const upperQuery = query.toUpperCase();
    
    if (error) {
      // Track repeated errors
      setRecentErrors(prev => [...prev.slice(-2), error]);
      
      if (error.includes('Table') && error.includes('not found')) {
        quinnThink(quinnResponses.tableNotFound[Math.floor(Math.random() * quinnResponses.tableNotFound.length)], 'thinking');
      } else if (error.includes('syntax')) {
        quinnThink(quinnResponses.syntaxError[Math.floor(Math.random() * quinnResponses.syntaxError.length)] + 
          " Check that you have SELECT, FROM, and any WHERE conditions properly formatted.", 'thinking');
      }
      
      // Offer specific help based on the attempted query
      const timer = setTimeout(() => {
        if (upperQuery.includes('WERE') && !upperQuery.includes('WHERE')) {
          addQuinnMessage("💡 I noticed you typed 'WERE' - SQL uses 'WHERE' for filtering. It's a common typo!", 'encouraging');
        } else if (upperQuery.includes('SELCT') || upperQuery.includes('SLECT')) {
          addQuinnMessage("✏️ Quick tip: Make sure to spell keywords correctly. SQL needs proper spelling even though it ignores case!", 'encouraging');
        } else if (upperQuery.includes('FROM') && !upperQuery.includes('WHERE') && activeCase && activeCase.includes('case1')) {
          addQuinnMessage("🤔 You've got the basic query structure! Now you need to filter the results. What clause comes after FROM to add conditions?", 'encouraging');
        } else if (recentErrors.filter(e => e === error).length >= 2) {
          // Same error multiple times
          addQuinnMessage("🤔 I see you're getting the same error. Let's break it down: What are you trying to find? What table contains that information? What condition identifies the right records?", 'encouraging');
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    } else if (result) {
      // Clear error history on success
      setRecentErrors([]);
      
      // Successful query
      if (!badges.includes('first_clue')) {
        quinnThink(quinnResponses.firstQuery[Math.floor(Math.random() * quinnResponses.firstQuery.length)], 'happy');
      } else if (upperQuery.includes('WHERE')) {
        addQuinnMessage(quinnResponses.whereClause[Math.floor(Math.random() * quinnResponses.whereClause.length)], 'happy');
      } else if (upperQuery.includes('JOIN')) {
        quinnThink(quinnResponses.joinSuccess[Math.floor(Math.random() * quinnResponses.joinSuccess.length)], 'happy');
      }
      
      // Suggest next steps
      const timer = setTimeout(() => {
        if (result.length > 5 && !upperQuery.includes('WHERE')) {
          addQuinnMessage("💡 Pro tip: That's a lot of results! There's a clause that can filter these down to exactly what you need.", 'neutral');
        } else if (upperQuery.includes('SELECT *') && completedCases.length > 3) {
          addQuinnMessage("🎯 Advanced tip: Instead of getting all columns, you can specify exactly which ones you want. More efficient!", 'neutral');
        } else if (upperQuery.includes('WHERE') && result.length === 0) {
          addQuinnMessage("🔍 No results? Double-check your conditions. Are you looking for the right values? Sometimes it helps to query without conditions first to see what's in the table.", 'encouraging');
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showQuinn, badges, activeCase, recentErrors, completedCases, quinnThink, addQuinnMessage]);

  // Quinn provides alternative approaches
  const suggestAlternativeQuery = useCallback((currentQuery, objective) => {
    if (!showQuinn) return;
    
    const alternatives = {
      'has_alibi = FALSE': [
        "Did you know there are multiple ways to check for false values? Think about what FALSE represents...",
        "Boolean fields can be checked in different ways. What's another way to express 'not true'?",
        "Consider: FALSE is like saying 'not TRUE'. How else could you write that?"
      ],
      'age > 30': [
        "You could check ages in different ways. What if you wanted everyone 31 and above?",
        "Think about ranges - how would you check if age falls between two values?",
        "There's more than one way to exclude younger suspects. What's the opposite of 'less than or equal to 30'?"
      ]
    };
    
    // Find matching pattern and suggest alternative thinking
    Object.keys(alternatives).forEach(pattern => {
      if (currentQuery.includes(pattern)) {
        const timer = setTimeout(() => {
          const alt = alternatives[pattern][Math.floor(Math.random() * alternatives[pattern].length)];
          addQuinnMessage(`🔄 By the way, ${alt}`, 'neutral');
        }, 4000);
        
        return () => clearTimeout(timer);
      }
    });
  }, [showQuinn, addQuinnMessage]);

  // Initialize Quinn with welcome message only when first opened
  useEffect(() => {
    if (showQuinn && quinnMessages.length === 0) {
      const timer = setTimeout(() => {
        addQuinnMessage(quinnResponses.welcome[Math.floor(Math.random() * quinnResponses.welcome.length)], 'happy');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showQuinn, quinnMessages.length, addQuinnMessage]);

  // Quinn reacts to module changes only if already open
  useEffect(() => {
    if (showQuinn && activeModule) {
      let timer;
      if (activeModule === 'terminal' && executionSteps.length === 0) {
        timer = setTimeout(() => {
          addQuinnMessage("🖥️ Welcome to the Investigation Terminal! This is where we run our queries. Try starting with the basic structure: action word, which columns, which table.", 'encouraging');
        }, 500);
      } else if (activeModule === 'evidence_board') {
        timer = setTimeout(() => {
          addQuinnMessage("🎨 The Evidence Board lets you build queries visually! Click on elements to construct your investigation step by step.", 'encouraging');
        }, 500);
      } else if (activeModule === 'cases') {
        timer = setTimeout(() => {
          addQuinnMessage("📁 Here are all our active cases. Each one teaches a different SQL concept. Start simple and work your way up!", 'neutral');
        }, 500);
      }
      return () => clearTimeout(timer);
    }
  }, [activeModule, showQuinn, executionSteps.length, addQuinnMessage]);

  // Quinn offers help if student seems stuck (only if already open)
  useEffect(() => {
    if (showQuinn && activeModule === 'terminal' && sqlQuery.length > 0 && !queryResult && !queryError) {
      const inactivityTimer = setTimeout(() => {
        addQuinnMessage("🤔 Taking your time? Remember, queries typically start with an action word and specify which table to look at. Need help structuring your query?", 'encouraging');
      }, 30000); // 30 seconds of inactivity
      
      return () => clearTimeout(inactivityTimer);
    }
  }, [sqlQuery, queryResult, queryError, activeModule, showQuinn, addQuinnMessage]);

  // All cases with progressive difficulty
  const allCases = useMemo(() => [
    // Beginner Cases
    {
      id: 'case1',
      title: '🔍 Case #001: The Museum Heist - First Lead',
      difficulty: 1,
      category: 'SELECT Basics',
      description: 'A priceless artifact was stolen from the City Museum last night. We need to identify potential suspects.',
      briefing: 'The museum was robbed at approximately 10:30 PM. Start by finding all suspects who don\'t have verified alibis.',
      objective: 'Find all suspects where has_alibi is FALSE',
      hint: 'Use: SELECT * FROM suspects WHERE has_alibi = FALSE (case doesn\'t matter!)',
      solution: 'SELECT * FROM suspects WHERE has_alibi = FALSE',
      xpReward: 50,
      unlocks: ['case4']
    },
    {
      id: 'case2',
      title: '🔍 Case #002: Witness Testimony Review',
      difficulty: 1,
      category: 'SELECT Basics',
      description: 'Multiple witnesses have come forward. Review all their statements.',
      briefing: 'We\'ve interviewed several witnesses. Pull up all their testimonies for review.',
      objective: 'Retrieve all witness records',
      hint: 'Use: SELECT * FROM witnesses',
      solution: 'SELECT * FROM witnesses',
      xpReward: 40,
      unlocks: []
    },
    {
      id: 'case3',
      title: '🔍 Case #003: Evidence Catalog',
      difficulty: 1,
      category: 'SELECT Basics',
      description: 'Forensics has collected evidence from the crime scene.',
      briefing: 'Review all physical evidence collected from the museum.',
      objective: 'View all evidence records',
      hint: 'Use: SELECT * FROM evidence',
      solution: 'SELECT * FROM evidence',
      xpReward: 40,
      unlocks: ['case5']
    },
    // Intermediate Cases
    {
      id: 'case4',
      title: '🔍🔍 Case #004: Age Profile Analysis',
      difficulty: 2,
      category: 'WHERE Conditions',
      description: 'Profile suggests the thief is likely over 30 years old.',
      briefing: 'Criminal profilers believe the sophistication of this heist suggests an older perpetrator.',
      objective: 'Find all suspects older than 30',
      hint: 'Use: SELECT * FROM suspects WHERE age > 30',
      solution: 'SELECT * FROM suspects WHERE age > 30',
      xpReward: 60,
      unlocks: ['case6'],
      locked: true
    },
    {
      id: 'case5',
      title: '🔍🔍 Case #005: Night Owls',
      difficulty: 2,
      category: 'WHERE Conditions',
      description: 'Focus on suspects seen late at night.',
      briefing: 'The crime occurred around 10:30 PM. Find suspects who were seen after 9 PM.',
      objective: 'Find suspects last seen after 21:00',
      hint: 'Use time comparison in WHERE clause',
      solution: "SELECT * FROM suspects WHERE last_seen > '2025-01-15 21:00'",
      xpReward: 70,
      unlocks: ['case7'],
      locked: true
    },
    {
      id: 'case6',
      title: '🔍🔍 Case #006: Specific Intel',
      difficulty: 2,
      category: 'Column Selection',
      description: 'We need a quick reference list of suspect names and occupations.',
      briefing: 'Create a summary report showing just names and jobs of all suspects.',
      objective: 'Select only name and occupation columns from suspects',
      hint: 'Use: SELECT name, occupation FROM suspects',
      solution: 'SELECT name, occupation FROM suspects',
      xpReward: 60,
      unlocks: ['case8'],
      locked: true
    },
    // Advanced Cases
    {
      id: 'case7',
      title: '🔍🔍🔍 Case #007: The Museum Connection',
      difficulty: 3,
      category: 'Multiple Conditions',
      description: 'Cross-reference multiple factors to narrow down suspects.',
      briefing: 'Find suspects without alibis who were seen after 9 PM.',
      objective: 'Find suspects with no alibi seen after 21:00',
      hint: 'Combine conditions with AND',
      solution: "SELECT * FROM suspects WHERE has_alibi = FALSE AND last_seen > '2025-01-15 21:00'",
      xpReward: 100,
      unlocks: ['case9'],
      locked: true
    },
    {
      id: 'case8',
      title: '🔍🔍🔍 Case #008: Height Profile',
      difficulty: 3,
      category: 'Multiple Conditions',
      description: 'Security footage shows the thief was tall.',
      briefing: 'The suspect appears to be over 175cm tall and under 50 years old.',
      objective: 'Find suspects taller than 175cm and younger than 50',
      hint: 'Use AND to combine height and age conditions',
      solution: 'SELECT * FROM suspects WHERE height > 175 AND age < 50',
      xpReward: 100,
      unlocks: ['case10'],
      locked: true
    },
    // JOIN Cases
    {
      id: 'case9',
      title: '🔍🔍🔍🔍 Case #009: Witness Connections',
      difficulty: 4,
      category: 'JOIN Operations',
      description: 'Match witness statements to specific suspects.',
      briefing: 'Some witnesses identified specific suspects. Connect the testimonies.',
      objective: 'Join witnesses with suspects they identified',
      hint: 'Use INNER JOIN on suspect_id',
      solution: 'SELECT w.name as witness_name, w.statement, s.name as suspect_name FROM witnesses w INNER JOIN suspects s ON w.suspect_id = s.suspect_id',
      xpReward: 150,
      unlocks: ['case11'],
      locked: true
    },
    {
      id: 'case10',
      title: '🔍🔍🔍🔍 Case #010: Evidence Links',
      difficulty: 4,
      category: 'JOIN Operations',
      description: 'Connect physical evidence to suspects.',
      briefing: 'Match the evidence we found to specific suspects.',
      objective: 'Join evidence table with suspects',
      hint: 'Join evidence and suspects tables',
      solution: 'SELECT e.type, e.description, s.name FROM evidence e INNER JOIN suspects s ON e.suspect_id = s.suspect_id',
      xpReward: 150,
      unlocks: ['case12'],
      locked: true
    },
    // Aggregate Function Cases
    {
      id: 'case11',
      title: '🔍🔍🔍🔍🔍 Case #011: Statistical Analysis',
      difficulty: 5,
      category: 'Aggregate Functions',
      description: 'How many suspects do we have without alibis?',
      briefing: 'Get a count of suspects who can\'t verify their whereabouts.',
      objective: 'Count suspects without alibis',
      hint: 'Use COUNT(*) with WHERE',
      solution: 'SELECT COUNT(*) as suspects_without_alibi FROM suspects WHERE has_alibi = FALSE',
      xpReward: 120,
      unlocks: ['case13'],
      locked: true
    },
    {
      id: 'case12',
      title: '🔍🔍🔍🔍🔍 Case #012: Age Demographics',
      difficulty: 5,
      category: 'Aggregate Functions',
      description: 'What\'s the average age of our suspects?',
      briefing: 'Calculate demographic statistics for the suspect pool.',
      objective: 'Find the average age of all suspects',
      hint: 'Use AVG() function',
      solution: 'SELECT AVG(age) as average_age FROM suspects',
      xpReward: 120,
      unlocks: ['case14'],
      locked: true
    }
  ], []);

  // Quinn reacts to case selection only if already open
  useEffect(() => {
    if (showQuinn && activeCase) {
      const caseData = allCases.find(c => c.id === activeCase);
      if (caseData) {
        const timer = setTimeout(() => {
          if (caseData.difficulty === 1) {
            addQuinnMessage("📁 Good choice! This is a perfect case for practicing the basics.", 'encouraging');
          } else if (caseData.difficulty >= 4) {
            addQuinnMessage("💪 Challenging case! Take your time and think about how the tables connect.", 'encouraging');
          }
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [activeCase, showQuinn, allCases, addQuinnMessage]);

  // Check if it's night time for rain effect
  useEffect(() => {
    const hour = new Date().getHours();
    setIsRaining(hour >= 20 || hour <= 6);
  }, [activeModule]);

  // Particle effect generator with memory leak prevention
  const createParticles = useCallback((x: number, y: number, type = 'success') => {
    setParticles((prev: Particle[]) => {
      // Prevent too many particles
      if (prev.length > 100) {
        prev = prev.slice(-50);
      }
      
      const newParticles: Particle[] = [];
      const colors = type === 'success' ? ['#10b981', '#3b82f6', '#f59e0b'] : ['#ef4444', '#dc2626'];
      
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: Date.now() + i + Math.random(),
          x: x + (Math.random() - 0.5) * 100,
          y: y + (Math.random() - 0.5) * 100,
          vx: (Math.random() - 0.5) * 5,
          vy: -Math.random() * 10 - 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 6 + 4,
          life: 100
        });
      }
      
      // Schedule cleanup
      setTimeout(() => {
        setParticles((current: Particle[]) => current.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 2000);
      
      return [...prev, ...newParticles];
    });
  }, []);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;
    
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.5, // gravity
        life: particle.life - 2
      })).filter(p => p.life > 0));
    }, 50);
    
    return () => clearInterval(interval);
  }, [particles.length]);

  // Smooth module transition
  const handleModuleChange = useCallback((newModule) => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setActiveModule(newModule);
      setIsTransitioning(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Animate suspects on hover
  const animateSuspect = useCallback((suspectId) => {
    setSuspectAnimations(prev => ({
      ...prev,
      [suspectId]: true
    }));
    
    const timer = setTimeout(() => {
      setSuspectAnimations(prev => ({
        ...prev,
        [suspectId]: false
      }));
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);

  // Detective ranks and badges
  const ranks = [
    { name: 'Rookie Detective', minXP: 0, icon: '🔰' },
    { name: 'Junior Investigator', minXP: 100, icon: '🕵️' },
    { name: 'Senior Detective', minXP: 300, icon: '🕵️‍♂️' },
    { name: 'Lead Investigator', minXP: 600, icon: '⭐' },
    { name: 'Master Detective', minXP: 1000, icon: '🏆' }
  ];

  const allBadges = [
    { id: 'first_clue', name: 'First Clue', icon: '🔍', description: 'Execute your first SELECT query' },
    { id: 'evidence_expert', name: 'Evidence Expert', icon: '📋', description: 'Query all evidence types' },
    { id: 'join_master', name: 'Connection Specialist', icon: '🔗', description: 'Successfully use a JOIN' },
    { id: 'pattern_analyst', name: 'Pattern Analyst', icon: '📊', description: 'Use COUNT and GROUP BY' },
    { id: 'case_closed', name: 'Case Closed', icon: '✅', description: 'Solve your first major case' },
    { id: 'night_shift', name: 'Night Shift', icon: '🌙', description: 'Find all suspects seen after 9 PM' },
    { id: 'alibi_checker', name: 'Alibi Checker', icon: '🛡️', description: 'Identify all suspects without alibis' },
    { id: 'visual_detective', name: 'Visual Detective', icon: '👁️', description: 'Use the Evidence Board' },
    { id: 'quinn_friend', name: "Quinn's Friend", icon: '🤝', description: 'Get help from Quinn 5 times' }
  ];

  // Update rank based on XP
  useEffect(() => {
    const currentRank = ranks.filter(r => xp >= r.minXP).pop();
    if (currentRank) setDetectiveRank(currentRank.name);
  }, [xp]);

  // Visual Query Execution Functions
  const animateQueryExecution = async (query: string) => {
    setIsExecuting(true);
    setExecutionSteps([]);
    const steps: ExecutionStep[] = [];
    
    // Parse query for visualization
    const upperQuery = query.toUpperCase();
    
    // Step 1: FROM clause
    if (upperQuery.includes('FROM')) {
      steps.push({
        step: 'FROM',
        description: 'Loading data from table...',
        highlight: 'all'
      });
      setExecutionSteps([...steps]);
      await sleep(1000);
    }
    
    // Step 2: WHERE clause
    if (upperQuery.includes('WHERE')) {
      steps.push({
        step: 'WHERE',
        description: 'Applying filters...',
        highlight: 'filter'
      });
      setExecutionSteps([...steps]);
      await sleep(1500);
    }
    
    // Step 3: SELECT columns
    steps.push({
      step: 'SELECT',
      description: 'Selecting requested columns...',
      highlight: 'columns'
    });
    setExecutionSteps([...steps]);
    await sleep(1000);
    
    // Step 4: Complete
    steps.push({
      step: 'COMPLETE',
      description: 'Query execution complete!',
      highlight: 'done'
    });
    setExecutionSteps([...steps]);
    await sleep(500);
    
    setIsExecuting(false);
  };

  // Add to notebook
  const addToNotebook = useCallback((note) => {
    setNotebook(prev => [...prev, { id: Date.now(), note, timestamp: new Date().toLocaleTimeString() }]);
  }, []);

  // Normalize SQL query for comparison
  const normalizeSQL = (query) => {
    return query
      .toUpperCase()
      .replace(/\s+/g, ' ')
      .replace(/\s*([(),=<>!]+)\s*/g, '$1')
      .replace(/\s*;\s*$/, '')
      .replace(/["'`]/g, "'")
      .trim();
  };

  // Check if two queries are logically equivalent
  const queriesAreEquivalent = (query1, query2) => {
    const normalized1 = normalizeSQL(query1);
    const normalized2 = normalizeSQL(query2);
    
    // Direct match
    if (normalized1 === normalized2) return true;
    
    // Check for common variations
    if (normalized1 === normalized2 + ';' || normalized1 + ';' === normalized2) return true;
    
    // Check for quote variations
    const quotesNormalized1 = normalized1.replace(/["']/g, '"');
    const quotesNormalized2 = normalized2.replace(/["']/g, '"');
    if (quotesNormalized1 === quotesNormalized2) return true;
    
    // Check for TRUE/FALSE variations
    const booleanNormalized1 = normalized1
      .replace(/=\s*TRUE/g, '=1')
      .replace(/=\s*FALSE/g, '=0');
    const booleanNormalized2 = normalized2
      .replace(/=\s*TRUE/g, '=1')
      .replace(/=\s*FALSE/g, '=0');
    if (booleanNormalized1 === booleanNormalized2) return true;
    
    return false;
  };

  // Helper function to find field case-insensitively
  const findField = (obj, fieldName) => {
    const lowerFieldName = fieldName.toLowerCase();
    const actualField = Object.keys(obj).find(k => k.toLowerCase() === lowerFieldName);
    return actualField ? obj[actualField] : undefined;
  };

  // Fixed evaluateCondition function
  const evaluateCondition = (row, condition) => {
    const trimmedCondition = condition.trim();
    
    // Handle equals with flexible spacing
    if (trimmedCondition.match(/=/)) {
      const parts = trimmedCondition.split(/\s*=\s*/);
      const field = parts[0].trim();
      let value = parts[1].trim().replace(/['"]/g, '');
      
      const fieldValue = findField(row, field);
      if (fieldValue === undefined) return false;
      
      // Handle boolean values (case insensitive)
      if (value.toUpperCase() === 'TRUE' || value === '1') return fieldValue === true;
      if (value.toUpperCase() === 'FALSE' || value === '0') return fieldValue === false;
      
      // Handle numeric values
      if (!isNaN(value)) return fieldValue == value;
      
      // Handle string comparison (case insensitive for values)
      return String(fieldValue).toUpperCase() === value.toUpperCase();
    }
    
    // Handle greater than or equal with flexible spacing
    if (trimmedCondition.match(/>=/)) {
      const parts = trimmedCondition.split(/\s*>=\s*/);
      const field = parts[0].trim();
      const value = parts[1].trim().replace(/['"]/g, '');
      
      const fieldValue = findField(row, field);
      if (fieldValue === undefined) return false;
      
      if (value.includes(':')) {
        // Time comparison
        return fieldValue >= value;
      }
      return fieldValue >= parseFloat(value);
    }
    
    // Handle less than or equal with flexible spacing
    if (trimmedCondition.match(/<=/)) {
      const parts = trimmedCondition.split(/\s*<=\s*/);
      const field = parts[0].trim();
      const value = parts[1].trim().replace(/['"]/g, '');
      
      const fieldValue = findField(row, field);
      if (fieldValue === undefined) return false;
      
      return fieldValue <= parseFloat(value);
    }
    
    // Handle greater than with flexible spacing (after checking >=)
    if (trimmedCondition.match(/>/) && !trimmedCondition.match(/>=/)) {
      const parts = trimmedCondition.split(/\s*>\s*/);
      const field = parts[0].trim();
      const value = parts[1].trim().replace(/['"]/g, '');
      
      const fieldValue = findField(row, field);
      if (fieldValue === undefined) return false;
      
      if (value.includes(':')) {
        // Time comparison
        return fieldValue > value;
      }
      return fieldValue > parseFloat(value);
    }
    
    // Handle not equals with flexible spacing
    if (trimmedCondition.match(/!=/)) {
      const parts = trimmedCondition.split(/\s*!=\s*/);
      const field = parts[0].trim();
      let value = parts[1].trim().replace(/['"]/g, '');
      
      const fieldValue = findField(row, field);
      if (fieldValue === undefined) return false;
      
      // Handle boolean values
      if (value.toUpperCase() === 'TRUE' || value === '1') return fieldValue !== true;
      if (value.toUpperCase() === 'FALSE' || value === '0') return fieldValue !== false;
      
      // Handle numeric values
      if (!isNaN(value)) return fieldValue != value;
      
      // Handle string comparison
      return String(fieldValue).toUpperCase() !== value.toUpperCase();
    }
    
    // Handle less than with flexible spacing (after checking <=)
    if (trimmedCondition.match(/</) && !trimmedCondition.match(/<=/)) {
      const parts = trimmedCondition.split(/\s*<\s*/);
      const field = parts[0].trim();
      const value = parts[1].trim().replace(/['"]/g, '');
      
      const fieldValue = findField(row, field);
      if (fieldValue === undefined) return false;
      
      return fieldValue < parseFloat(value);
    }
    
    return true;
  };

  // Helper function to filter results by WHERE clause
  const filterByWhere = (results, whereClause) => {
    // Normalize the where clause for parsing
    const normalizedWhere = whereClause.trim();
    
    // Check if we have OR conditions
    if (normalizedWhere.match(/\s+OR\s+/i)) {
      // Split by OR first
      const orConditions = normalizedWhere.split(/\s+OR\s+/i);
      
      return results.filter(row => {
        // At least one OR condition must be true
        return orConditions.some(orCondition => {
          // Check if this OR part has AND conditions
          const andConditions = orCondition.split(/\s+AND\s+/i);
          
          // All AND conditions within this OR part must be true
          return andConditions.every(condition => evaluateCondition(row, condition));
        });
      });
    } else {
      // No OR, just AND conditions
      const conditions = normalizedWhere.split(/\s+AND\s+/i);
      
      return results.filter(row => {
        return conditions.every(condition => evaluateCondition(row, condition));
      });
    }
  };

  // Execute SQL query with visual animation
  const executeQuery = async () => {
    setQueryError('');
    setQueryResult(null);
    setCurrentHint('');

    const query = sqlQuery.trim();
    const upperQuery = query.toUpperCase();
    
    // Start visual execution
    if (activeModule === 'terminal') {
      await animateQueryExecution(query);
    }
    
    try {
      // SELECT queries
      if (upperQuery.startsWith('SELECT')) {
        let results: QueryResultRow[] = [];
        let fromMatch = upperQuery.match(/FROM\s+(\w+)/);
        
        if (!fromMatch) {
          setQueryError('Invalid syntax: Missing FROM clause');
          analyzeQueryForQuinn(query, 'Invalid syntax: Missing FROM clause', null);
          setRecentErrors(prev => {
            const newErrors = [...prev, 'Missing FROM'];
            if (newErrors.length >= 2 && !showQuinn) {
              setQuinnNotification(true);
            }
            return newErrors.slice(-3);
          });
          return;
        }
        
        const tableName = fromMatch[1].toLowerCase();
        
        // Check if table exists
        if (!database[tableName]) {
          const error = `Table '${tableName}' not found. Available tables: suspects, witnesses, evidence, locations, cases, phone_records`;
          setQueryError(error);
          analyzeQueryForQuinn(query, error, null);
          return;
        }
        
        // Handle empty tables
        if (!database[tableName] || database[tableName].length === 0) {
          results = [];
        } else {
          results = [...database[tableName]] as QueryResultRow[];
        }
        
        // Visual highlighting for WHERE clause
        if (upperQuery.includes('WHERE') && results.length > 0) {
          const whereClause = query.substring(query.toUpperCase().indexOf('WHERE') + 5);
          results = filterByWhere(results, whereClause);
          
          // Highlight filtered rows
          setFilteredRows(results.map(r => r.suspect_id || r.witness_id || r.evidence_id));
        }
        
        // Handle JOINs
        if (upperQuery.includes('JOIN')) {
          const joinMatch = upperQuery.match(/JOIN\s+(\w+)\s+(?:\w+\s+)?ON\s+(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/);
          if (joinMatch) {
            const joinTable = joinMatch[1].toLowerCase();
            const table1Field = joinMatch[3].toLowerCase();
            const table2Field = joinMatch[5].toLowerCase();
            
            if (database[joinTable]) {
              results = results.map(row => {
                const fieldValue1 = findField(row, table1Field);
                
                const joinRow = database[joinTable].find(jr => {
                  const fieldValue2 = findField(jr, table2Field);
                  return fieldValue1 !== undefined && fieldValue2 !== undefined && fieldValue1 === fieldValue2;
                });
                
                return joinRow ? Object.assign({}, row, joinRow) : row;
              }).filter(row => Object.keys(row).length > Object.keys(database[tableName][0] || {}).length);
            }
          }
        }
        
        // Handle GROUP BY
        if (upperQuery.includes('GROUP BY')) {
          const groupMatch = upperQuery.match(/GROUP\s+BY\s+(\w+)/);
          if (groupMatch) {
            const groupField = groupMatch[1].toLowerCase();
            const grouped: GroupedData = {};
            
            results.forEach(row => {
              const fieldValue = findField(row, groupField);
              if (fieldValue !== undefined) {
                const key = String(fieldValue);
                if (!grouped[key]) grouped[key] = [];
                grouped[key].push(row);
              }
            });
            
            // If COUNT is used
            if (upperQuery.includes('COUNT(')) {
              const countResults: QueryResultRow[] = Object.entries(grouped).map(([key, rows]) => ({
                [groupField]: key,
                count: rows.length
              }));
              results = countResults;
            }
          }
        }
        
        // Handle aggregate functions (without GROUP BY)
        if (upperQuery.includes('COUNT(') && !upperQuery.includes('GROUP BY')) {
          const countMatch = upperQuery.match(/COUNT\(([^)]+)\)/);
          if (countMatch && countMatch[1].trim() === '*') {
            const count = results.length;
            const aliasMatch = upperQuery.match(/COUNT\([^)]+\)\s+AS\s+(\w+)/);
            const alias = aliasMatch ? aliasMatch[1].toLowerCase() : 'count';
            const countResult: QueryResultRow = { [alias]: count };
            results = [countResult];
          }
        } else if (upperQuery.includes('AVG(')) {
          const avgMatch = upperQuery.match(/AVG\((\w+)\)/);
          if (avgMatch) {
            const field = avgMatch[1].toLowerCase();
            let sum = 0;
            let count = 0;
            
            results.forEach(row => {
              const fieldValue = findField(row, field);
              if (fieldValue != null && !isNaN(fieldValue)) {
                sum += fieldValue;
                count++;
              }
            });
            
            const avg = count > 0 ? sum / count : 0;
            const aliasMatch = upperQuery.match(/AVG\([^)]+\)\s+AS\s+(\w+)/);
            const alias = aliasMatch ? aliasMatch[1].toLowerCase() : 'average';
            const avgResult: QueryResultRow = { [alias]: avg.toFixed(2) };
            results = [avgResult];
          }
        }
        
        // Handle column selection
        if (!upperQuery.includes('SELECT *') && !upperQuery.includes('COUNT(') && !upperQuery.includes('AVG(') && results.length > 0) {
          const selectPart = query.substring(6, query.toUpperCase().indexOf('FROM')).trim();
          const columns = selectPart.split(',').map(col => {
            const parts = col.trim().split(/\s+as\s+/i);
            return {
              field: parts[0].trim().replace(/^\w+\./, '').toLowerCase(),
              alias: parts[1] ? parts[1].trim().toLowerCase() : null
            };
          });
          
          results = results.map(row => {
            const newRow = {};
            columns.forEach(col => {
              const key = col.alias || col.field;
              const fieldValue = findField(row, col.field);
              newRow[key] = fieldValue !== undefined ? fieldValue : null;
            });
            return newRow;
          });
        }
        
        // Handle ORDER BY
        if (upperQuery.includes('ORDER BY')) {
          const orderMatch = upperQuery.match(/ORDER\s+BY\s+(\w+)(?:\s+(ASC|DESC))?/);
          if (orderMatch) {
            const orderField = orderMatch[1].toLowerCase();
            const orderDir = orderMatch[2] || 'ASC';
            
            results.sort((a, b) => {
              const fieldA = findField(a, orderField);
              const fieldB = findField(b, orderField);
              
              if (fieldA === undefined || fieldB === undefined) return 0;
              
              if (orderDir === 'DESC') {
                return fieldB > fieldA ? 1 : -1;
              }
              return fieldA > fieldB ? 1 : -1;
            });
          }
        }
        
        setQueryResult(results);
        gainXP(25);
        
        // Clear error tracking on success
        setRecentErrors([]);
        setQuinnNotification(false);
        
        // Quinn analyzes the query
        analyzeQueryForQuinn(query, null, results);
        
        // Suggest alternatives after successful query
        suggestAlternativeQuery(query, activeCase);
        
        // Award badges
        if (!badges.includes('first_clue')) {
          setBadges([...badges, 'first_clue']);
          addToNotebook('🏆 Earned badge: First Clue!');
        }
        
        if (upperQuery.includes('JOIN') && !badges.includes('join_master')) {
          setBadges([...badges, 'join_master']);
          addToNotebook('🏆 Earned badge: Connection Specialist!');
        }
        
      } else {
        setQueryError('Only SELECT queries are currently supported in this demo.');
        analyzeQueryForQuinn(query, 'Only SELECT queries are currently supported', null);
        setRecentErrors(prev => {
          const newErrors = [...prev, 'SELECT query required'];
          if (newErrors.length >= 2 && !showQuinn) {
            setQuinnNotification(true);
          }
          return newErrors.slice(-3);
        });
      }
    } catch (error) {
      setQueryError('Query execution error: ' + error.message);
      analyzeQueryForQuinn(query, error.message, null);
      setRecentErrors(prev => {
        const newErrors = [...prev, error.message];
        if (newErrors.length >= 2 && !showQuinn) {
          setQuinnNotification(true);
        }
        return newErrors.slice(-3);
      });
    }
  };

  const gainXP = useCallback((points) => {
    setXp(prev => {
      const newXP = prev + points;
      // Create sparkle effect at XP display
      setTimeout(() => {
        const xpElement = document.querySelector('.xp-display');
        if (xpElement) {
          const rect = xpElement.getBoundingClientRect();
          createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'success');
        }
      }, 100);
      return newXP;
    });
    addToNotebook(`+${points} XP earned!`);
  }, [createParticles, addToNotebook]);

  const completeCase = useCallback((caseId) => {
    if (!completedCases.includes(caseId)) {
      setCompletedCases([...completedCases, caseId]);
      const caseData = allCases.find(c => c.id === caseId);
      
      if (caseData) {
        gainXP(caseData.xpReward);
        
        // Celebration effects
        setCelebration(true);
        createParticles(window.innerWidth / 2, window.innerHeight / 2, 'success');
        
        setTimeout(() => {
          setCelebration(false);
        }, 3000);
        
        // Quinn celebrates
        quinnThink(quinnResponses.caseComplete[Math.floor(Math.random() * quinnResponses.caseComplete.length)], 'happy');
        
        // Unlock new cases
        caseData.unlocks.forEach(unlockedId => {
          if (!unlockedCases.includes(unlockedId)) {
            setUnlockedCases([...unlockedCases, unlockedId]);
            addToNotebook(`🔓 New case unlocked: ${allCases.find(c => c.id === unlockedId)?.title}`);
          }
        });
      }
    }
  }, [completedCases, allCases, gainXP, createParticles, quinnThink, unlockedCases, addToNotebook]);

  // Evidence Board Functions
  const buildQueryFromBoard = () => {
    let query = '';
    
    if (selectedColumns.length > 0 && selectedTable) {
      // Build SELECT clause
      query = `SELECT ${selectedColumns.join(', ')} FROM ${selectedTable}`;
      
      // Add WHERE conditions
      if (whereConditions.length > 0) {
        query += ` WHERE ${whereConditions.join(' AND ')}`;
      }
      
      // Add JOINs
      if (joinConnections.length > 0) {
        joinConnections.forEach(join => {
          query += ` INNER JOIN ${join.table2} ON ${join.table1}.${join.field1} = ${join.table2}.${join.field2}`;
        });
      }
    }
    
    return query;
  };

  const handleTableDrop = (e, table) => {
    e.preventDefault();
    setSelectedTable(table);
    setSelectedColumns(['*']);
  };

  const handleColumnToggle = (column) => {
    if (selectedColumns.includes('*')) {
      setSelectedColumns([column]);
    } else {
      if (selectedColumns.includes(column)) {
        setSelectedColumns(selectedColumns.filter(c => c !== column));
      } else {
        setSelectedColumns([...selectedColumns, column]);
      }
    }
  };

  const addWhereCondition = (field, operator, value) => {
    const condition = `${field} ${operator} ${value}`;
    setWhereConditions([...whereConditions, condition]);
  };

  // Award visual detective badge when accessing evidence board
  useEffect(() => {
    if (activeModule === 'evidence_board') {
      setBadges(prev => {
        if (!prev.includes('visual_detective')) {
          addToNotebook('🏆 Earned badge: Visual Detective!');
          return [...prev, 'visual_detective'];
        }
        return prev;
      });
    }
  }, [activeModule, addToNotebook]);

  // Module content renderers
  const renderDetectiveOffice = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-lg shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 animate-float">
          <Fingerprint size={200} className="animate-pulse" />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-4 flex items-center">
            <Shield className="mr-3 text-yellow-400 animate-pulse" />
            Detective's Office
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg backdrop-blur">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Current Rank</span>
                <span className="text-2xl">{ranks.find(r => r.name === detectiveRank)?.icon}</span>
              </div>
              <p className="text-xl font-bold text-yellow-400">{detectiveRank}</p>
              <div className="mt-2 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((xp % 200) / 2, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg backdrop-blur">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Cases Solved</span>
                <Target className="text-green-400" />
              </div>
              <p className="text-3xl font-bold">{completedCases.length}</p>
              <p className="text-sm text-gray-400">of {allCases.length} total</p>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg backdrop-blur">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Experience</span>
                <TrendingUp className="text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-blue-400">{xp} XP</p>
              <p className="text-sm text-gray-400">Keep investigating!</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Badge Display */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Award className="mr-2 text-yellow-500" />
          Your Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allBadges.map(badge => {
            const earned = badges.includes(badge.id);
            return (
              <div 
                key={badge.id}
                className={`p-4 rounded-lg text-center transition-all duration-300 transform hover:scale-105 ${
                  earned 
                    ? 'bg-yellow-50 border-2 border-yellow-400 shadow-lg animate-glow' 
                    : 'bg-gray-100 border-2 border-gray-300 opacity-50 grayscale'
                }`}
              >
                <div className={`text-3xl mb-2 ${earned ? 'animate-bounce' : ''}`}>{badge.icon}</div>
                <p className="font-semibold text-sm">{badge.name}</p>
                <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Detective's Notebook */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <BookOpen className="mr-2" />
          Detective's Notebook
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {notebook.length === 0 ? (
            <p className="text-gray-500 italic">Your notebook is empty. Start investigating!</p>
          ) : (
            notebook.slice(-5).reverse().map(entry => (
              <div key={entry.id} className="flex items-start space-x-2 text-sm">
                <span className="text-gray-400">{entry.timestamp}</span>
                <span>{entry.note}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderEvidenceBoard = () => {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-6 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold flex items-center">
            <Grid3x3 className="mr-3" />
            Interactive Evidence Board
          </h2>
          <p className="mt-2 text-gray-300">Build SQL queries visually by connecting evidence</p>
        </div>
        
        {/* Mode Toggle */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex space-x-4">
            <button
              onClick={() => setBoardMode('visual')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                boardMode === 'visual' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <Eye className="inline mr-2" size={16} />
              Visual Builder
            </button>
            <button
              onClick={() => setBoardMode('query')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                boardMode === 'query' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <FileText className="inline mr-2" size={16} />
              Query View
            </button>
          </div>
        </div>
        
        {boardMode === 'visual' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table Selector */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold mb-4 flex items-center">
                <Database className="mr-2" />
                Available Tables
              </h3>
              <div className="space-y-3">
                {Object.keys(database).map(table => (
                  <div
                    key={table}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('table', table)}
                    onClick={() => setSelectedTable(table)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTable === table 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <p className="font-semibold capitalize">{table}</p>
                    <p className="text-xs text-gray-600">{database[table].length} records</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Query Builder Area */}
            <div className="lg:col-span-2 bg-gray-900 p-6 rounded-lg shadow-xl min-h-[400px]">
              <h3 className="text-white font-bold mb-4">Query Construction Area</h3>
              
              {selectedTable ? (
                <div className="space-y-6">
                  {/* Column Selection */}
                  <div className="bg-gray-800 p-4 rounded">
                    <h4 className="text-green-400 font-semibold mb-3">SELECT Columns:</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedColumns(['*'])}
                        className={`px-3 py-1 rounded text-sm ${
                          selectedColumns.includes('*') 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        * (all)
                      </button>
                      {database[selectedTable].length > 0 && Object.keys(database[selectedTable][0]).map(column => (
                        <button
                          key={column}
                          onClick={() => handleColumnToggle(column)}
                          className={`px-3 py-1 rounded text-sm ${
                            selectedColumns.includes(column) 
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {column}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* WHERE Conditions */}
                  <div className="bg-gray-800 p-4 rounded">
                    <h4 className="text-yellow-400 font-semibold mb-3">WHERE Conditions:</h4>
                    {selectedTable === 'suspects' && (
                      <div className="space-y-2">
                        <button
                          onClick={() => addWhereCondition('has_alibi', '=', 'FALSE')}
                          className="mr-2 px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                        >
                          + No Alibi
                        </button>
                        <button
                          onClick={() => addWhereCondition('age', '>', '30')}
                          className="mr-2 px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                        >
                          + Age > 30
                        </button>
                        <button
                          onClick={() => addWhereCondition('last_seen', '>', "'2025-01-15 21:00'")}
                          className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                        >
                          + Seen after 9 PM
                        </button>
                      </div>
                    )}
                    {whereConditions.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {whereConditions.map((condition, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-700 px-3 py-1 rounded">
                            <span className="text-sm text-gray-300">{condition}</span>
                            <button
                              onClick={() => setWhereConditions(whereConditions.filter((_, i) => i !== idx))}
                              className="text-red-400 hover:text-red-300"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Generated Query Preview */}
                  <div className="bg-gray-800 p-4 rounded">
                    <h4 className="text-blue-400 font-semibold mb-2">Generated Query:</h4>
                    <code className="text-green-400 text-sm">
                      {buildQueryFromBoard() || 'Select table and columns to build query...'}
                    </code>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSqlQuery(buildQueryFromBoard());
                      executeQuery();
                    }}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    <Zap className="inline mr-2" />
                    Execute Visual Query
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">Select or drag a table to start building your query</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Query View Mode
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold mb-4">Query History</h3>
            <div className="space-y-3">
              <div className="p-4 bg-gray-100 rounded">
                <code className="text-sm">{sqlQuery || 'No query built yet'}</code>
              </div>
            </div>
          </div>
        )}
        
        {/* Evidence Connection Visualizer */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold mb-4 flex items-center">
            <Link2 className="mr-2" />
            Evidence Connections
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Suspects Photos */}
            <div>
              <h4 className="font-semibold mb-3">Suspects</h4>
              <div className="grid grid-cols-4 gap-3">
                {database.suspects.slice(0, 4).map(suspect => (
                  <div
                    key={suspect.suspect_id}
                    onMouseEnter={() => {
                      setHoveredSuspect(suspect.suspect_id);
                      animateSuspect(suspect.suspect_id);
                    }}
                    onMouseLeave={() => setHoveredSuspect(null)}
                    className={`relative p-3 bg-gray-100 rounded-lg text-center cursor-pointer transition-all duration-300 transform ${
                      hoveredSuspect === suspect.suspect_id ? 'scale-110 shadow-xl z-10' : ''
                    } ${suspectAnimations[suspect.suspect_id] ? 'animate-bounce' : ''}`}
                    style={{
                      transform: hoveredSuspect === suspect.suspect_id ? 'rotateY(10deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d',
                      perspective: '1000px'
                    }}
                  >
                    <div className={`w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center relative overflow-hidden ${
                      suspectAnimations[suspect.suspect_id] ? 'animate-pulse' : ''
                    }`}>
                      <User size={24} className={suspectAnimations[suspect.suspect_id] ? 'animate-spin' : ''} />
                      {hoveredSuspect === suspect.suspect_id && (
                        <div className="absolute inset-0 bg-blue-400 opacity-30 animate-ping"></div>
                      )}
                    </div>
                    <p className="text-xs font-semibold">{suspect.name.split(' ')[0]}</p>
                    <p className="text-xs text-gray-600">{suspect.occupation}</p>
                    {!suspect.has_alibi && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                        !
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Evidence Items */}
            <div>
              <h4 className="font-semibold mb-3">Evidence</h4>
              <div className="space-y-2">
                {database.evidence.map(evidence => (
                  <div
                    key={evidence.evidence_id}
                    onMouseEnter={() => setRotatingEvidence({ ...rotatingEvidence, [evidence.evidence_id]: true })}
                    onMouseLeave={() => setRotatingEvidence({ ...rotatingEvidence, [evidence.evidence_id]: false })}
                    className={`p-3 bg-gray-100 rounded-lg flex items-center justify-between transition-all duration-500 ${
                      hoveredSuspect === evidence.suspect_id ? 'bg-yellow-100 border-2 border-yellow-400 shadow-lg' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`mr-2 text-gray-600 ${rotatingEvidence[evidence.evidence_id] ? 'animate-spin' : ''}`} 
                           style={{
                             transform: rotatingEvidence[evidence.evidence_id] ? 'rotateY(360deg)' : 'rotateY(0deg)',
                             transformStyle: 'preserve-3d',
                             transition: 'transform 1s'
                           }}>
                        <Fingerprint size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{evidence.type}</p>
                        <p className="text-xs text-gray-600">{evidence.location}</p>
                      </div>
                    </div>
                    {evidence.suspect_id && (
                      <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded animate-pulse">
                        ID: {evidence.suspect_id}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTrainingRoom = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center">
        <BookOpen className="mr-3" />
        SQL Training Room
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DDL Training */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-blue-700">DDL - Data Definition Language</h3>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded">
              <h4 className="font-semibold mb-2">CREATE DATABASE</h4>
              <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                CREATE DATABASE Crime_Investigation;
              </code>
              <p className="text-sm mt-2">Creates a new database for your cases</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded">
              <h4 className="font-semibold mb-2">CREATE TABLE</h4>
              <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                CREATE TABLE Suspects (<br />
                &nbsp;&nbsp;suspect_id INTEGER PRIMARY KEY,<br />
                &nbsp;&nbsp;name VARCHAR(100),<br />
                &nbsp;&nbsp;age INTEGER,<br />
                &nbsp;&nbsp;has_alibi BOOLEAN<br />
                );
              </code>
              <p className="text-sm mt-2">Creates a new table with columns and data types</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded">
              <h4 className="font-semibold mb-2">CREATE TABLE with All Data Types</h4>
              <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                CREATE TABLE Case_Records (<br />
                &nbsp;&nbsp;case_id INTEGER PRIMARY KEY,<br />
                &nbsp;&nbsp;case_code CHARACTER(6),  -- Fixed: 'UK2025'<br />
                &nbsp;&nbsp;description VARCHAR(500), -- Variable length<br />
                &nbsp;&nbsp;is_solved BOOLEAN,<br />
                &nbsp;&nbsp;priority_level INTEGER,<br />
                &nbsp;&nbsp;budget REAL,              -- Decimal: 25000.50<br />
                &nbsp;&nbsp;opened_date DATE,         -- '2025-01-15'<br />
                &nbsp;&nbsp;last_update TIME         -- '14:30:00'<br />
                );
              </code>
              <p className="text-sm mt-2">Example using all SQL data types from specification</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded">
              <h4 className="font-semibold mb-2">ALTER TABLE</h4>
              <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                ALTER TABLE Suspects<br />
                ADD phone_number VARCHAR(20);<br />
                <br />
                ALTER TABLE Evidence<br />
                ADD FOREIGN KEY (location_id)<br />
                REFERENCES Locations(location_id);
              </code>
              <p className="text-sm mt-2">Modify table: add columns or add constraints later</p>
            </div>
          </div>
        </div>
        
        {/* SELECT Training */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-green-700">SELECT - The Investigation Tool</h3>
          
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded">
              <h4 className="font-semibold mb-2">Basic SELECT</h4>
              <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                SELECT * FROM suspects;
              </code>
              <p className="text-sm mt-2">Retrieves all columns from the suspects table</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded">
              <h4 className="font-semibold mb-2">SELECT with WHERE</h4>
              <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                SELECT name, age FROM suspects<br />
                WHERE has_alibi = FALSE;
              </code>
              <p className="text-sm mt-2">Find specific suspects based on conditions</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded">
              <h4 className="font-semibold mb-2">WHERE with Dates/Times</h4>
              <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                -- Find recent evidence<br />
                SELECT * FROM evidence<br />
                WHERE found_date {'>'} '2025-01-14';<br />
                <br />
                -- Find suspects seen at night<br />
                SELECT * FROM suspects<br />
                WHERE TIME(last_seen) {'>'} '21:00:00';
              </code>
              <p className="text-sm mt-2">Query using DATE and TIME comparisons</p>
            </div>
          </div>
        </div>
        
        {/* DML Training - INSERT, UPDATE, DELETE */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-orange-700">DML - Data Manipulation</h3>
          
          <div className="space-y-4">
            <div className="bg-orange-50 p-4 rounded">
              <h4 className="font-semibold mb-2">INSERT INTO</h4>
              <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                INSERT INTO Suspects<br />
                (name, age, occupation, has_alibi)<br />
                VALUES ('Jane Doe', 29, 'Engineer', TRUE);
              </code>
              <p className="text-sm mt-2">Add new records to a table</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded">
              <h4 className="font-semibold mb-2">UPDATE</h4>
              <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                UPDATE Suspects<br />
                SET has_alibi = TRUE<br />
                WHERE suspect_id = 3;
              </code>
              <p className="text-sm mt-2">Modify existing records (always use WHERE!)</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded">
              <h4 className="font-semibold mb-2">DELETE FROM</h4>
              <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                DELETE FROM Suspects<br />
                WHERE cleared = TRUE;
              </code>
              <p className="text-sm mt-2">Remove records (careful with WHERE clause!)</p>
            </div>
          </div>
        </div>
        
        {/* JOIN Training */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-purple-700">JOIN - Connecting the Dots</h3>
          
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded">
              <h4 className="font-semibold mb-2">INNER JOIN (Two Tables)</h4>
              <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                -- Join two tables as per specification<br />
                SELECT s.name, e.type, e.found_date<br />
                FROM suspects s<br />
                INNER JOIN evidence e<br />
                ON s.suspect_id = e.suspect_id<br />
                WHERE e.type = 'Fingerprint';
              </code>
              <p className="text-sm mt-2">Query data from two related tables</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded">
              <h4 className="font-semibold mb-2">Table Aliases</h4>
              <p className="text-sm mb-2">Use short aliases (s, e, w) for cleaner queries:</p>
              <ul className="text-sm space-y-1">
                <li>• suspects s</li>
                <li>• evidence e</li>
                <li>• witnesses w</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Aggregate Functions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-indigo-700">Aggregate Functions - Pattern Analysis</h3>
          
          <div className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded">
              <h4 className="font-semibold mb-2">COUNT</h4>
              <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                SELECT COUNT(*) as total_suspects<br />
                FROM suspects<br />
                WHERE has_alibi = FALSE;
              </code>
              <p className="text-sm mt-2">Count suspects without alibis</p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded">
              <h4 className="font-semibold mb-2">AVG / SUM</h4>
              <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                SELECT AVG(age) as average_age<br />
                FROM suspects;<br />
                <br />
                SELECT SUM(duration) as total_time<br />
                FROM phone_records;
              </code>
              <p className="text-sm mt-2">Calculate averages and totals</p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded">
              <h4 className="font-semibold mb-2">GROUP BY</h4>
              <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                SELECT location_id, COUNT(*) as count<br />
                FROM suspects<br />
                GROUP BY location_id;
              </code>
              <p className="text-sm mt-2">Count suspects at each location</p>
            </div>
          </div>
        </div>
        
        {/* ORDER BY and Keys */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-pink-700">Additional SQL Features</h3>
          
          <div className="space-y-4">
            <div className="bg-pink-50 p-4 rounded">
              <h4 className="font-semibold mb-2">ORDER BY</h4>
              <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                SELECT name, age FROM suspects<br />
                ORDER BY age DESC;
              </code>
              <p className="text-sm mt-2">Sort results (DESC = descending, ASC = ascending)</p>
            </div>
            
            <div className="bg-pink-50 p-4 rounded">
              <h4 className="font-semibold mb-2">PRIMARY & FOREIGN KEYS</h4>
              <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                -- Method 1: Define in CREATE TABLE<br />
                CREATE TABLE Evidence (<br />
                &nbsp;&nbsp;evidence_id INTEGER PRIMARY KEY,<br />
                &nbsp;&nbsp;suspect_id INTEGER,<br />
                &nbsp;&nbsp;FOREIGN KEY (suspect_id)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;REFERENCES Suspects(suspect_id)<br />
                );<br />
                <br />
                -- Method 2: Add with ALTER TABLE<br />
                ALTER TABLE Evidence<br />
                ADD FOREIGN KEY (location_id)<br />
                REFERENCES Locations(location_id);
              </code>
              <p className="text-sm mt-2">Two ways to create relationships between tables</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-lg">
        <h3 className="font-bold mb-3 flex items-center">
          <Key className="mr-2" />
          Key SQL Keywords Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <strong className="text-blue-700">DDL</strong>
            <p>CREATE DATABASE</p>
            <p>CREATE TABLE</p>
            <p>ALTER TABLE</p>
          </div>
          <div>
            <strong className="text-green-700">DML - Query</strong>
            <p>SELECT</p>
            <p>FROM</p>
            <p>WHERE</p>
            <p>JOIN</p>
          </div>
          <div>
            <strong className="text-orange-700">DML - Modify</strong>
            <p>INSERT INTO</p>
            <p>UPDATE</p>
            <p>DELETE FROM</p>
          </div>
          <div>
            <strong className="text-purple-700">Functions</strong>
            <p>COUNT</p>
            <p>AVG / SUM</p>
            <p>GROUP BY</p>
            <p>ORDER BY</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-100 rounded text-sm">
          <strong>💡 Note:</strong> SQL is not case-sensitive! You can write SELECT, select, or SeLeCt - they all work the same. 
          Extra spaces are also fine: <code>SELECT * FROM suspects</code> is the same as <code>select&nbsp;&nbsp;*&nbsp;&nbsp;from&nbsp;&nbsp;suspects</code>
        </div>
      </div>
    </div>
  );

  const renderCaseFiles = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-900 to-gray-900 text-white p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold flex items-center">
          <Briefcase className="mr-3" />
          Active Case Files
        </h2>
        <p className="mt-2 text-gray-300">Solve cases to earn XP and unlock new investigations</p>
      </div>
      
      {/* Case Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['SELECT Basics', 'WHERE Conditions', 'JOIN Operations'].map(category => {
          const categoryCases = allCases.filter(c => c.category === category && unlockedCases.includes(c.id));
          const completedInCategory = categoryCases.filter(c => completedCases.includes(c.id)).length;
          
          return (
            <div key={category} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-lg">{category}</h3>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{completedInCategory}/{categoryCases.length}</span>
                </div>
                <div className="mt-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(completedInCategory / Math.max(categoryCases.length, 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Case List */}
      <div className="space-y-4">
        {allCases.map(caseItem => {
          const isUnlocked = unlockedCases.includes(caseItem.id);
          const isCompleted = completedCases.includes(caseItem.id);
          const isActive = activeCase === caseItem.id;
          
          return (
            <div 
              key={caseItem.id} 
              className={`relative rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${
                !isUnlocked ? 'opacity-50' : ''
              } ${
                isCompleted 
                  ? 'bg-green-50 border-2 border-green-400 hover:shadow-xl' 
                  : isActive 
                    ? 'bg-blue-50 border-2 border-blue-400 animate-pulse hover:shadow-xl'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg'
              }`}
              onClick={(e) => {
                if (isCompleted && !e.target.closest('button') && e.clientX && e.clientY) {
                  createParticles(e.clientX, e.clientY, 'success');
                }
              }}
            >
              {!isUnlocked && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Lock className="text-gray-600" size={48} />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold flex items-center">
                      {caseItem.title}
                      {isCompleted && <CheckCircle className="ml-2 text-green-500" size={20} />}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Category: {caseItem.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Reward</p>
                    <p className="font-bold text-blue-600">{caseItem.xpReward} XP</p>
                  </div>
                </div>
                
                <div className="bg-gray-100 p-4 rounded mb-4">
                  <p className="text-sm mb-2"><strong>Briefing:</strong> {caseItem.briefing}</p>
                  <p className="text-sm font-mono bg-white p-2 rounded mt-2">
                    <strong>Objective:</strong> {caseItem.objective}
                  </p>
                </div>
                
                {isActive && currentHint === caseItem.id && (
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 mb-4">
                    <p className="text-sm"><strong>💡 Hint:</strong> <code className="bg-gray-200 px-1 rounded">{caseItem.hint}</code></p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  {isUnlocked && (
                    <>
                      <button
                        onClick={() => setActiveCase(caseItem.id)}
                        className={`px-4 py-2 rounded font-semibold transition-colors ${
                          isActive 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {isActive ? 'Working on Case' : 'Start Investigation'}
                      </button>
                      
                      {isActive && !isCompleted && (
                        <>
                          <button
                            onClick={() => {
                              setCurrentHint(caseItem.id);
                              // Automatically open Quinn if providing hints
                              if (!showQuinn) {
                                setShowQuinn(true);
                                // Delay hint message until Quinn is open
                                setTimeout(() => {
                                  if (caseItem.id === 'case1' || caseItem.id === 'case4') {
                                    addQuinnMessage(quinnResponses.hints.noAlibi, 'encouraging');
                                  } else if (caseItem.id === 'case5' || caseItem.id === 'case8') {
                                    addQuinnMessage(quinnResponses.hints.age, 'encouraging');
                                  } else if (caseItem.id.includes('case9') || caseItem.id.includes('case10')) {
                                    addQuinnMessage(quinnResponses.hints.join, 'encouraging');
                                  }
                                }, 500);
                              } else {
                                // Quinn already open, show hint immediately
                                if (caseItem.id === 'case1' || caseItem.id === 'case4') {
                                  addQuinnMessage(quinnResponses.hints.noAlibi, 'encouraging');
                                } else if (caseItem.id === 'case5' || caseItem.id === 'case8') {
                                  addQuinnMessage(quinnResponses.hints.age, 'encouraging');
                                } else if (caseItem.id.includes('case9') || caseItem.id.includes('case10')) {
                                  addQuinnMessage(quinnResponses.hints.join, 'encouraging');
                                }
                              }
                            }}
                            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            Need a Hint? 💡
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderInvestigationTerminal = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center">
        <Search className="mr-3" />
        Investigation Terminal
      </h2>
      
      {/* Active Case Display */}
      {activeCase && (
        <div className="bg-blue-100 border-2 border-blue-400 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">
            Active Investigation: {allCases.find(c => c.id === activeCase)?.title}
          </h3>
          <p className="text-sm">{allCases.find(c => c.id === activeCase)?.objective}</p>
        </div>
      )}
      
      {/* Visual Query Execution Display */}
      {isExecuting && (
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-lg shadow-xl">
          <h3 className="font-bold mb-4 flex items-center">
            <Zap className="mr-2 animate-pulse" />
            Query Execution Visualizer
          </h3>
          <div className="space-y-3">
            {executionSteps.map((step, idx) => (
              <div 
                key={idx} 
                className={`flex items-center space-x-3 transition-all duration-500 ${
                  idx === executionSteps.length - 1 ? 'opacity-100 scale-105' : 'opacity-60'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.step === 'COMPLETE' ? 'bg-green-500' : 'bg-blue-500'
                }`}>
                  {step.step === 'COMPLETE' ? <CheckCircle size={16} /> : idx + 1}
                </div>
                <div>
                  <p className="font-semibold">{step.step}</p>
                  <p className="text-sm text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* SQL Terminal */}
      <div className={`bg-gray-900 text-white p-6 rounded-lg shadow-2xl relative ${isRaining ? 'animate-glow' : ''}`}>
        <div className="flex items-center mb-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className="ml-4 text-gray-400 text-sm">SQL Investigation Terminal v2.0</span>
        </div>
        
        <textarea
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          className="w-full h-40 p-4 bg-gray-800 text-green-400 font-mono rounded border border-gray-700 focus:outline-none focus:border-blue-500 resize-none"
          placeholder="Enter your SQL query here... (not case sensitive!)"
          spellCheck={false}
        />
        
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={(e) => {
              if (!isExecuting && e.clientX && e.clientY) {
                createParticles(e.clientX, e.clientY, 'success');
              }
              executeQuery();
            }}
            disabled={isExecuting}
            className={`px-6 py-2 rounded font-semibold transition-all duration-300 flex items-center transform ${
              isExecuting 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-lg active:scale-95'
            }`}
          >
            {isExecuting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Executing...
              </>
            ) : (
              <>
                <Search className="mr-2 transition-transform hover:rotate-12" size={16} />
                Execute Query
              </>
            )}
          </button>
          
          <button
            onClick={() => {
              setSqlQuery('');
              setQueryResult(null);
              setQueryError('');
              setExecutionSteps([]);
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Clear Terminal
          </button>
        </div>
        
        {/* Error Display */}
        {queryError && (
          <div className="mt-4 p-4 bg-red-900 bg-opacity-50 border border-red-500 rounded">
            <p className="text-red-200 flex items-center justify-between">
              <span className="flex items-center">
                <AlertCircle className="mr-2" size={16} />
                {queryError}
              </span>
              {!showQuinn && (
                <button
                  onClick={() => setShowQuinn(true)}
                  className="ml-4 text-xs bg-purple-600 bg-opacity-80 text-white px-2 py-1 rounded hover:bg-opacity-100"
                >
                  Ask Quinn for help 🤖
                </button>
              )}
            </p>
          </div>
        )}
        
        {/* Results Display with Animation */}
        {queryResult && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-green-400">Investigation Results:</h4>
              <span className="text-sm text-gray-400">{queryResult.length} record(s) found</span>
            </div>
            
            <div className="bg-gray-800 p-4 rounded overflow-x-auto">
              {queryResult.length === 0 ? (
                <p className="text-gray-400 italic">No records match your query.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      {Object.keys(queryResult[0]).map(key => (
                        <th key={key} className="text-left p-2 text-gray-400 font-semibold">
                          {key.toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.map((row, idx) => (
                      <tr 
                        key={idx} 
                        className={`border-b border-gray-700 transition-all duration-300 hover:bg-gray-600 ${
                          filteredRows.includes(row.suspect_id || row.witness_id || row.evidence_id)
                            ? 'bg-yellow-900 bg-opacity-30' 
                            : 'hover:bg-gray-700'
                        }`}
                        style={{
                          animation: isExecuting ? `fadeIn 0.5s ${idx * 0.1}s both` : 'none',
                          transform: 'translateX(0)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                      >
                        {Object.entries(row).map(([key, val], i) => (
                          <td key={i} className="p-2 text-gray-200">
                            {typeof val === 'boolean' ? (
                              val ? 
                                <span className="text-green-400">✓ TRUE</span> : 
                                <span className="text-red-400">✗ FALSE</span>
                            ) : (
                              String(val)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            {/* Check if query solves active case */}
            {activeCase && queryResult.length > 0 && !completedCases.includes(activeCase)} {
              (() => {
                const caseData = allCases.find(c => c.id === activeCase);
                if (caseData) {
                  // Check if the query is equivalent to the solution
                  const isCorrect = queriesAreEquivalent(sqlQuery, caseData.solution) ||
                    // Also check if it matches the key parts of the solution
                    (normalizeSQL(sqlQuery).includes(normalizeSQL(caseData.solution).substring(0, 30)) &&
                     queryResult.length > 0);
                  
                  if (isCorrect) {
                    setTimeout(() => {
                      completeCase(activeCase);
                      addToNotebook(`✅ Case solved: ${caseData.title}`);
                    }, 500);
                    
                    return (
                      <div className="mt-4 p-4 bg-green-800 rounded animate-pulse">
                        <p className="text-green-200 font-bold flex items-center">
                          <CheckCircle className="mr-2" />
                          Excellent work, Detective! Case solved!
                        </p>
                      </div>
                    );
                  }
                }
                return null;
              })()
            }
          </div>
        )}
      </div>
      
      {/* Quick Reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-3 flex items-center">
            <Database className="mr-2" size={20} />
            Available Tables
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-red-700">SUSPECTS</p>
              <p className="text-xs text-gray-600">8 records</p>
            </div>
            <div>
              <p className="font-semibold text-blue-700">WITNESSES</p>
              <p className="text-xs text-gray-600">5 records</p>
            </div>
            <div>
              <p className="font-semibold text-green-700">EVIDENCE</p>
              <p className="text-xs text-gray-600">5 records</p>
            </div>
            <div>
              <p className="font-semibold text-purple-700">LOCATIONS</p>
              <p className="text-xs text-gray-600">5 records</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-3 flex items-center">
            <FileSearch className="mr-2" size={20} />
            Common Queries
          </h3>
          <div className="space-y-2 text-xs">
            <code className="block bg-gray-100 p-2 rounded">SELECT * FROM table_name</code>
            <code className="block bg-gray-100 p-2 rounded">WHERE column = value</code>
            <code className="block bg-gray-100 p-2 rounded">JOIN table ON condition</code>
          </div>
          <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
            <strong>Tip:</strong> SQL is flexible! 
            <br />• Case doesn't matter: select = SELECT
            <br />• Extra spaces are OK
            <br />• TRUE = 1, FALSE = 0
          </div>
        </div>
      </div>
      
      {/* CSS Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes rain {
          from {
            transform: translateY(-100vh);
          }
          to {
            transform: translateY(100vh);
          }
        }
        
        .animate-rain {
          animation: rain linear infinite;
        }
        
        .sepia {
          filter: sepia(0.6) contrast(1.1) brightness(0.9);
        }
        
        .grayscale {
          filter: grayscale(1);
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        
        .animate-scan::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(to right, transparent, #3b82f6, transparent);
          animation: scan 2s linear infinite;
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
          }
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 15s ease infinite;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, #f0f0f0 0px, #f8f8f8 40px, #f0f0f0 80px);
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }
        
        /* Custom scrollbar for vintage mode */
        .sepia::-webkit-scrollbar {
          width: 12px;
        }
        
        .sepia::-webkit-scrollbar-track {
          background: #d4a574;
        }
        
        .sepia::-webkit-scrollbar-thumb {
          background: #8b6f34;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );

  const modules = [
    { id: 'office', title: "Detective's Office", icon: <Coffee />, description: 'Your headquarters' },
    { id: 'evidence_board', title: 'Evidence Board', icon: <Grid3x3 />, description: 'Visual query builder' },
    { id: 'training', title: 'Training Room', icon: <BookOpen />, description: 'SQL tutorials' },
    { id: 'cases', title: 'Case Files', icon: <Briefcase />, description: 'Active investigations' },
    { id: 'terminal', title: 'Investigation Terminal', icon: <Search />, description: 'Query executor' }
  ];

  const renderContent = () => {
    switch(activeModule) {
      case 'office': return renderDetectiveOffice();
      case 'evidence_board': return renderEvidenceBoard();
      case 'training': return renderTrainingRoom();
      case 'cases': return renderCaseFiles();
      case 'terminal': return renderInvestigationTerminal();
      default: return renderDetectiveOffice();
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 relative overflow-hidden ${vintageMode ? 'sepia' : ''}`}>
      {/* Rain Effect */}
      {isRaining && activeModule === 'terminal' && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-rain"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
                opacity: 0.3
              }}
            >
              <div className="w-0.5 h-8 bg-gradient-to-b from-transparent via-blue-300 to-transparent"></div>
            </div>
          ))}
        </div>
      )}
      
      {/* Particle Effects */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-40"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: '50%',
            opacity: particle.life / 100,
            transform: `scale(${particle.life / 100})`,
            transition: 'opacity 0.1s, transform 0.1s'
          }}
        />
      ))}
      
      {/* Celebration Overlay */}
      {celebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl font-bold text-yellow-400 animate-bounce">
            🎉 CASE SOLVED! 🎉
          </div>
        </div>
      )}
      
      {/* Vintage Filter Toggle */}
      <button
        onClick={() => setVintageMode(!vintageMode)}
        className="fixed top-4 left-4 z-30 bg-gray-800 text-white px-3 py-1 rounded-full text-sm hover:bg-gray-700 transition-all"
      >
        {vintageMode ? '🎬 Modern' : '📽️ Vintage'}
      </button>
      
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 text-white shadow-xl relative z-20 animate-gradient">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold flex items-center">
              <Shield className="mr-3 text-yellow-400 animate-pulse" size={32} />
              SQL Detective Academy
            </h1>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-xs text-gray-400">Current Rank</p>
                <p className="font-bold text-lg">{detectiveRank}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Experience</p>
                <p className="font-bold text-lg text-yellow-400 xp-display transition-all duration-300 hover:scale-110">{xp} XP</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Cases Solved</p>
                <p className="font-bold text-lg text-green-400">{completedCases.length}/{allCases.length}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-1">
            <nav className="bg-white rounded-lg shadow-lg p-4 sticky top-4">
              <h2 className="font-bold text-gray-700 mb-4">Headquarters</h2>
              <ul className="space-y-2">
                {modules.map(module => (
                  <li key={module.id}>
                    <button
                      onClick={() => handleModuleChange(module.id)}
                      className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all duration-300 ${
                        activeModule === module.id 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md transform scale-105' 
                          : 'hover:bg-gray-100 hover:transform hover:translate-x-1'
                      }`}
                    >
                      <div>
                        <span className="flex items-center font-semibold">
                          {module.icon}
                          <span className="ml-2">{module.title}</span>
                        </span>
                        <p className="text-xs mt-1 opacity-75">{module.description}</p>
                      </div>
                      <ChevronRight size={16} className={activeModule === module.id ? 'animate-pulse' : ''} />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className={`md:col-span-4 transition-all duration-300 ${isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
            {renderContent()}
          </main>
        </div>
      </div>
      
      {/* Quinn AI Assistant - Collapsed by default, appears only when needed */}
      <div className={`fixed bottom-4 right-4 transition-all duration-300 ${showQuinn ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="bg-white rounded-lg shadow-2xl border-2 border-purple-400 overflow-hidden transform hover:scale-105 transition-transform" 
             style={{ 
               width: '350px', 
               maxHeight: '500px',
               boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
             }}>
          {/* Quinn Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 ${quinnThinking ? 'animate-pulse' : ''}`}>
                {quinnMood === 'happy' && '😊'}
                {quinnMood === 'thinking' && '🤔'}
                {quinnMood === 'encouraging' && '💪'}
                {quinnMood === 'neutral' && '🤖'}
              </div>
              <div>
                <h3 className="font-bold">Quinn</h3>
                <p className="text-xs opacity-90">Your AI Detective Partner</p>
              </div>
            </div>
            <button
              onClick={() => setShowQuinn(!showQuinn)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1"
            >
              ×
            </button>
          </div>
          
          {/* Quinn Messages */}
          <div className="h-64 overflow-y-auto p-4 bg-gray-50" ref={(el) => {
            if (el && quinnMessages.length > 0) {
              el.scrollTop = el.scrollHeight;
            }
          }}>
            {quinnMessages.map((message, idx) => (
              <div key={message.id} className={`mb-3 ${message.type === 'thinking' ? 'animate-pulse' : ''}`}>
                <div className={`p-3 rounded-lg ${
                  message.type === 'thinking' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-white border border-gray-200'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  {message.timestamp && (
                    <p className="text-xs text-gray-400 mt-1">{message.timestamp}</p>
                  )}
                </div>
              </div>
            ))}
            {quinnMessages.length === 0 && (
              <p className="text-gray-400 text-center italic">Quinn is ready to help!</p>
            )}
          </div>
          
          {/* Quinn Actions */}
          <div className="p-3 bg-white border-t">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const encouragement = quinnResponses.encouragement[Math.floor(Math.random() * quinnResponses.encouragement.length)];
                  addQuinnMessage(encouragement, 'encouraging');
                }}
                className="flex-1 px-3 py-2 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200"
              >
                Need Encouragement
              </button>
              <button
                onClick={() => {
                  if (activeCase) {
                    const caseData = allCases.find(c => c.id === activeCase);
                    if (caseData) {
                      // Quinn demonstrates problem-solving process
                      setQuinnThinking(true);
                      setQuinnMood('thinking');
                      
                      const thinkingSteps = [
                        `🤔 Let me analyze this case: "${caseData.title}"`,
                        `📋 The objective is: ${caseData.objective}`,
                        `💭 First, I need to identify which table has this information...`,
                        `🎯 Based on the objective, I need to think about what data I'm looking for`,
                        `✏️ I'll need to structure a query with the right action, target, and conditions`,
                        `🔍 The key is understanding what makes these records special`,
                        `💡 Think about: What am I looking for? Where is it stored? What conditions identify it?`
                      ];
                      
                      // Show thinking process step by step
                      thinkingSteps.forEach((step, index) => {
                        setTimeout(() => {
                          setQuinnMessages(prev => [...prev, {
                            id: Date.now() + index,
                            text: step,
                            type: index < thinkingSteps.length - 1 ? 'thinking' : 'message',
                            timestamp: new Date().toLocaleTimeString()
                          }]);
                          
                          if (index === thinkingSteps.length - 1) {
                            setQuinnThinking(false);
                            setQuinnMood('encouraging');
                          }
                        }, index * 1500);
                      });
                    }
                  } else {
                    addQuinnMessage("💡 Select a case from the Case Files first, then I can help you solve it!", 'neutral');
                  }
                }}
                className="flex-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200"
              >
                Explain Current Case
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quinn Toggle Button (when hidden) */}
      {!showQuinn && (
        <button
          onClick={() => {
            setShowQuinn(true);
            setQuinnNotification(false);
          }}
          className={`fixed bottom-4 right-4 bg-purple-600 bg-opacity-80 text-white p-2 rounded-full shadow-md hover:bg-opacity-100 hover:shadow-lg transition-all hover:scale-110 ${
            queryError ? 'animate-pulse ring-2 ring-purple-400 ring-opacity-50' : ''
          }`}
          title="Need help? Ask Quinn!"
        >
          <div className="flex items-center relative">
            <span className="text-lg">🤖</span>
            {quinnNotification && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </button>
      )}
    </div>
  );
};

export default SQLDetectiveAcademy;