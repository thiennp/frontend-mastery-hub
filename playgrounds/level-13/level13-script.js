// Level 13: Node.js Fundamentals - Interactive Script

class NodeJSLevel {
    constructor() {
        this.exercises = [
            {
                id: 1,
                name: 'Basic Node.js Setup',
                completed: false,
                solutions: {
                    server: `const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Node.js!');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
                    package: `{
  "name": "node-basics",
  "version": "1.0.0",
  "description": "Basic Node.js application",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "keywords": ["nodejs", "server"],
  "author": "Your Name",
  "license": "MIT"
}`
                }
            },
            {
                id: 2,
                name: 'File System Operations',
                completed: false,
                solution: `const fs = require('fs');
const path = require('path');

// 1. Create a file with content
fs.writeFileSync('sample.txt', 'Hello from Node.js file system!');

// 2. Read the file content
const content = fs.readFileSync('sample.txt', 'utf8');
console.log('File content:', content);

// 3. Append to the file
fs.appendFileSync('sample.txt', '\\nThis is appended content.');

// 4. Check if file exists
const exists = fs.existsSync('sample.txt');
console.log('File exists:', exists);

// 5. Get file stats
const stats = fs.statSync('sample.txt');
console.log('File stats:', {
  size: stats.size,
  created: stats.birthtime,
  modified: stats.mtime
});

console.log('File operations completed!');`
            },
            {
                id: 3,
                name: 'HTTP Server with Routes',
                completed: false,
                solution: `const http = require('http');
const url = require('url');

// Sample user data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Route handling
  if (path === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Welcome to Node.js HTTP Server!' }));
  }
  else if (path === '/api/users' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  }
  else if (path === '/api/users' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const newUser = JSON.parse(body);
        newUser.id = users.length + 1;
        users.push(newUser);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  }
  else if (path.startsWith('/api/users/') && method === 'GET') {
    const userId = parseInt(path.split('/')[3]);
    const user = users.find(u => u.id === userId);
    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not found' }));
    }
  }
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
  console.log('Available routes:');
  console.log('GET / - Welcome message');
  console.log('GET /api/users - Get all users');
  console.log('POST /api/users - Create new user');
  console.log('GET /api/users/:id - Get specific user');
});`
            },
            {
                id: 4,
                name: 'Express.js Basics',
                completed: false,
                solutions: {
                    express: `const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Express.js!' });
});

app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.post('/api/echo', (req, res) => {
  res.json({ 
    received: req.body,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(\`Express server running on port \${PORT}\`);
  console.log('Available routes:');
  console.log('GET / - Welcome message');
  console.log('GET /api/status - Health check');
  console.log('POST /api/echo - Echo back request data');
});`,
                    package: `{
  "name": "express-basics",
  "version": "1.0.0",
  "description": "Express.js application",
  "main": "express-app.js",
  "scripts": {
    "start": "node express-app.js",
    "dev": "nodemon express-app.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "keywords": ["express", "nodejs", "api"],
  "author": "Your Name",
  "license": "MIT"
}`
                }
            },
            {
                id: 5,
                name: 'Node.js Modules and NPM',
                completed: false,
                solutions: {
                    utils: `// Custom Utility Module (utils.js)
// Math utilities
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}

// String utilities
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function reverse(str) {
  return str.split('').reverse().join('');
}

// Date utilities
function getCurrentDate() {
  return new Date().toISOString();
}

function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
}

// Export your functions
module.exports = {
  add,
  multiply,
  divide,
  capitalize,
  reverse,
  getCurrentDate,
  formatDate
};`,
                    main: `// Main Application (main.js)
const utils = require('./utils');
const os = require('os');
const path = require('path');

console.log('=== Node.js Modules and NPM Demo ===\\n');

// 1. Use custom utils
console.log('Math operations:');
console.log('2 + 3 =', utils.add(2, 3));
console.log('4 * 5 =', utils.multiply(4, 5));
console.log('10 / 2 =', utils.divide(10, 2));

// 2. Use string utils
console.log('\\nString operations:');
console.log('hello world ->', utils.capitalize('hello world'));
console.log('javascript ->', utils.reverse('javascript'));

// 3. Use date utils
console.log('\\nDate operations:');
console.log('Current date:', utils.getCurrentDate());
console.log('Formatted date:', utils.formatDate(new Date()));

// 4. Use built-in modules
console.log('\\nSystem info:');
console.log('Platform:', os.platform());
console.log('Architecture:', os.arch());
console.log('Free memory:', Math.round(os.freemem() / 1024 / 1024), 'MB');
console.log('Total memory:', Math.round(os.totalmem() / 1024 / 1024), 'MB');
console.log('CPU cores:', os.cpus().length);
console.log('Home directory:', os.homedir());

// 5. Path operations
console.log('\\nPath operations:');
console.log('Current working directory:', process.cwd());
console.log('File extension:', path.extname(__filename));
console.log('Directory name:', path.dirname(__filename));

console.log('\\n=== Demo completed successfully! ===');`,
                    package: `{
  "name": "node-modules-demo",
  "version": "1.0.0",
  "description": "Node.js modules and NPM demonstration",
  "main": "main.js",
  "scripts": {
    "start": "node main.js",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": ["nodejs", "modules", "npm"],
  "author": "Your Name",
  "license": "MIT"
}`
                }
            }
        ];
        
        this.currentExercise = 1;
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.updateProgress();
        this.updateBadge();
    }

    setupEventListeners() {
        // Tab switching for multi-file exercises
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const file = e.target.dataset.file;
                const exerciseId = this.getExerciseIdFromTab(e.target);
                this.switchTab(exerciseId, file);
            });
        });

        // Code editor auto-resize
        document.querySelectorAll('.code-editor').forEach(editor => {
            editor.addEventListener('input', () => {
                this.autoResize(editor);
            });
        });
    }

    getExerciseIdFromTab(tab) {
        const exerciseCard = tab.closest('.exercise-card');
        return parseInt(exerciseCard.id.replace('exercise', ''));
    }

    switchTab(exerciseId, file) {
        const exerciseCard = document.getElementById(`exercise${exerciseId}`);
        const tabs = exerciseCard.querySelectorAll('.tab');
        const editors = exerciseCard.querySelectorAll('.code-editor');

        // Update tab states
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.file === file) {
                tab.classList.add('active');
            }
        });

        // Update editor visibility
        editors.forEach(editor => {
            editor.style.display = 'none';
            if (editor.id.includes(file.replace('.', '-'))) {
                editor.style.display = 'block';
            }
        });
    }

    autoResize(editor) {
        editor.style.height = 'auto';
        editor.style.height = editor.scrollHeight + 'px';
    }

    runExercise(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        const output = document.getElementById(`output${exerciseId}`);
        
        output.innerHTML = 'Running code...';
        output.className = 'output';

        // Simulate Node.js execution
        setTimeout(() => {
            try {
                let result = '';
                
                if (exerciseId === 1) {
                    result = this.simulateBasicServer();
                } else if (exerciseId === 2) {
                    result = this.simulateFileOperations();
                } else if (exerciseId === 3) {
                    result = this.simulateHTTPServer();
                } else if (exerciseId === 4) {
                    result = this.simulateExpressApp();
                } else if (exerciseId === 5) {
                    result = this.simulateModulesDemo();
                }

                output.innerHTML = result;
                output.className = 'output success';
            } catch (error) {
                output.innerHTML = `Error: ${error.message}`;
                output.className = 'output error';
            }
        }, 1000);
    }

    simulateBasicServer() {
        return `Server running on port 3000
✓ HTTP server created successfully
✓ Server listening on port 3000
✓ Ready to handle requests

Test the server by visiting:
http://localhost:3000

Expected response: "Hello from Node.js!"`;
    }

    simulateFileOperations() {
        return `File content: Hello from Node.js file system!
File exists: true
File stats: {
  size: 45,
  created: ${new Date().toISOString()},
  modified: ${new Date().toISOString()}
}
File operations completed!

✓ File created successfully
✓ File content read
✓ Content appended
✓ File existence verified
✓ File statistics retrieved`;
    }

    simulateHTTPServer() {
        return `Server running on port 3001
Available routes:
GET / - Welcome message
GET /api/users - Get all users
POST /api/users - Create new user
GET /api/users/:id - Get specific user

✓ HTTP server created
✓ Routes configured
✓ CORS headers set
✓ JSON responses enabled
✓ Error handling implemented

Test endpoints:
- GET http://localhost:3001/
- GET http://localhost:3001/api/users
- POST http://localhost:3001/api/users (with JSON body)`;
    }

    simulateExpressApp() {
        return `Express server running on port 3002
Available routes:
GET / - Welcome message
GET /api/status - Health check
POST /api/echo - Echo back request data

✓ Express app initialized
✓ Middleware configured
✓ Routes defined
✓ JSON parsing enabled
✓ CORS enabled
✓ Error handling implemented

Test endpoints:
- GET http://localhost:3002/
- GET http://localhost:3002/api/status
- POST http://localhost:3002/api/echo (with JSON body)`;
    }

    simulateModulesDemo() {
        return `=== Node.js Modules and NPM Demo ===

Math operations:
2 + 3 = 5
4 * 5 = 20
10 / 2 = 5

String operations:
hello world -> Hello world
javascript -> tpircsavaj

Date operations:
Current date: ${new Date().toISOString()}
Formatted date: ${new Date().toISOString().split('T')[0]}

System info:
Platform: ${navigator.platform}
Architecture: x64
Free memory: 8192 MB
Total memory: 16384 MB
CPU cores: 8
Home directory: /Users/username

Path operations:
Current working directory: /Users/username/project
File extension: .js
Directory name: /Users/username/project

=== Demo completed successfully! ===

✓ Custom modules imported
✓ Built-in modules used
✓ Math operations performed
✓ String manipulations executed
✓ Date formatting applied
✓ System information retrieved`;
    }

    checkExercise(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        const output = document.getElementById(`output${exerciseId}`);
        
        let isCorrect = false;
        let userCode = '';

        if (exerciseId === 1) {
            const serverCode = document.getElementById('editor1-server').value;
            const packageCode = document.getElementById('editor1-package').value;
            userCode = serverCode + '\n\n' + packageCode;
            isCorrect = this.checkBasicServer(serverCode, packageCode);
        } else if (exerciseId === 2) {
            userCode = document.getElementById('editor2').value;
            isCorrect = this.checkFileOperations(userCode);
        } else if (exerciseId === 3) {
            userCode = document.getElementById('editor3').value;
            isCorrect = this.checkHTTPServer(userCode);
        } else if (exerciseId === 4) {
            const expressCode = document.getElementById('editor4-express').value;
            const packageCode = document.getElementById('editor4-package').value;
            userCode = expressCode + '\n\n' + packageCode;
            isCorrect = this.checkExpressApp(expressCode, packageCode);
        } else if (exerciseId === 5) {
            const utilsCode = document.getElementById('editor5-utils').value;
            const mainCode = document.getElementById('editor5-main').value;
            const packageCode = document.getElementById('editor5-package').value;
            userCode = utilsCode + '\n\n' + mainCode + '\n\n' + packageCode;
            isCorrect = this.checkModulesDemo(utilsCode, mainCode, packageCode);
        }

        if (isCorrect) {
            exercise.completed = true;
            document.getElementById(`status${exerciseId}`).textContent = '✅ Completed';
            document.getElementById(`status${exerciseId}`).className = 'exercise-status completed';
            output.innerHTML = '🎉 Excellent! Your solution is correct!';
            output.className = 'output success';
            
            // Add completion animation
            document.getElementById(`exercise${exerciseId}`).classList.add('completed');
            
            this.updateProgress();
            this.updateBadge();
            this.saveProgress();
        } else {
            output.innerHTML = '❌ Not quite right. Check the hints and try again!';
            output.className = 'output error';
        }
    }

    checkBasicServer(serverCode, packageCode) {
        const hasHttp = serverCode.includes('require(\'http\')');
        const hasCreateServer = serverCode.includes('createServer');
        const hasListen = serverCode.includes('listen');
        const hasPackageJson = packageCode.includes('"main"') && packageCode.includes('"scripts"');
        
        return hasHttp && hasCreateServer && hasListen && hasPackageJson;
    }

    checkFileOperations(code) {
        const hasFs = code.includes('require(\'fs\')');
        const hasWriteFile = code.includes('writeFile') || code.includes('writeFileSync');
        const hasReadFile = code.includes('readFile') || code.includes('readFileSync');
        const hasExists = code.includes('exists') || code.includes('existsSync');
        const hasStats = code.includes('stat') || code.includes('statSync');
        
        return hasFs && hasWriteFile && hasReadFile && hasExists && hasStats;
    }

    checkHTTPServer(code) {
        const hasHttp = code.includes('require(\'http\')');
        const hasUrl = code.includes('require(\'url\')');
        const hasCreateServer = code.includes('createServer');
        const hasRouteHandling = code.includes('pathname') || code.includes('method');
        const hasListen = code.includes('listen');
        
        return hasHttp && hasUrl && hasCreateServer && hasRouteHandling && hasListen;
    }

    checkExpressApp(expressCode, packageCode) {
        const hasExpress = expressCode.includes('require(\'express\')');
        const hasApp = expressCode.includes('express()');
        const hasRoutes = expressCode.includes('app.get') || expressCode.includes('app.post');
        const hasListen = expressCode.includes('app.listen');
        const hasExpressDep = packageCode.includes('"express"');
        
        return hasExpress && hasApp && hasRoutes && hasListen && hasExpressDep;
    }

    checkModulesDemo(utilsCode, mainCode, packageCode) {
        const hasModuleExports = utilsCode.includes('module.exports');
        const hasRequire = mainCode.includes('require(\'./utils\')');
        const hasBuiltInModules = mainCode.includes('require(\'os\')') || mainCode.includes('require(\'path\')');
        const hasPackageJson = packageCode.includes('"main"') && packageCode.includes('"scripts"');
        
        return hasModuleExports && hasRequire && hasBuiltInModules && hasPackageJson;
    }

    updateProgress() {
        const completed = this.exercises.filter(ex => ex.completed).length;
        const total = this.exercises.length;
        const percentage = (completed / total) * 100;
        
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('progressFill').style.width = `${percentage}%`;
    }

    updateBadge() {
        const completed = this.exercises.filter(ex => ex.completed).length;
        const badge = document.getElementById('levelBadge');
        
        if (completed === 0) {
            badge.textContent = 'Node.js Novice';
        } else if (completed < 3) {
            badge.textContent = 'Node.js Learner';
        } else if (completed < 5) {
            badge.textContent = 'Node.js Developer';
        } else {
            badge.textContent = 'Node.js Master';
        }
    }

    saveProgress() {
        const progress = {
            level: 13,
            exercises: this.exercises.map(ex => ({
                id: ex.id,
                completed: ex.completed
            })),
            completedAt: new Date().toISOString()
        };
        
        localStorage.setItem('level13Progress', JSON.stringify(progress));
        
        // Also update main progress
        const mainProgress = JSON.parse(localStorage.getItem('frontendMasteryProgress') || '{}');
        mainProgress.level13 = progress;
        localStorage.setItem('frontendMasteryProgress', JSON.stringify(mainProgress));
    }

    loadProgress() {
        const saved = localStorage.getItem('level13Progress');
        if (saved) {
            const progress = JSON.parse(saved);
            progress.exercises.forEach(savedEx => {
                const exercise = this.exercises.find(ex => ex.id === savedEx.id);
                if (exercise) {
                    exercise.completed = savedEx.completed;
                    if (savedEx.completed) {
                        document.getElementById(`status${savedEx.id}`).textContent = '✅ Completed';
                        document.getElementById(`status${savedEx.id}`).className = 'exercise-status completed';
                    }
                }
            });
        }
    }

    goToPreviousLevel() {
        window.location.href = '../level-12/';
    }

    goToNextLevel() {
        const allCompleted = this.exercises.every(ex => ex.completed);
        if (allCompleted) {
            window.location.href = '../level-14/';
        } else {
            alert('Please complete all exercises before proceeding to the next level!');
        }
    }
}

// Global functions for HTML onclick handlers
function runExercise(exerciseId) {
    if (window.nodeJSLevel) {
        window.nodeJSLevel.runExercise(exerciseId);
    }
}

function checkExercise(exerciseId) {
    if (window.nodeJSLevel) {
        window.nodeJSLevel.checkExercise(exerciseId);
    }
}

function goToPreviousLevel() {
    if (window.nodeJSLevel) {
        window.nodeJSLevel.goToPreviousLevel();
    }
}

function goToNextLevel() {
    if (window.nodeJSLevel) {
        window.nodeJSLevel.goToNextLevel();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.nodeJSLevel = new NodeJSLevel();
});
