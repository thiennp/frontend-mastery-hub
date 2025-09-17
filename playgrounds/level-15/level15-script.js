// Level 15: API Development - Interactive Script

class APILevel {
    constructor() {
        this.exercises = [
            {
                id: 1,
                name: 'REST API Fundamentals',
                completed: false,
                solutions: {
                    api: `const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// GET /api/users - Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// GET /api/users/:id - Get user by ID
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// POST /api/users - Create new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /api/users/:id - Update user
app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { name, email } = req.body;
  users[userIndex] = { ...users[userIndex], name, email };
  
  res.json(users[userIndex]);
});

// DELETE /api/users/:id - Delete user
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users.splice(userIndex, 1);
  res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(\`REST API server running on port \${PORT}\`);
});`,
                    package: `{
  "name": "rest-api-demo",
  "version": "1.0.0",
  "description": "REST API demonstration",
  "main": "rest-api.js",
  "scripts": {
    "start": "node rest-api.js",
    "dev": "nodemon rest-api.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "keywords": ["rest", "api", "express", "nodejs"],
  "author": "Your Name",
  "license": "MIT"
}`
                }
            },
            {
                id: 2,
                name: 'GraphQL API',
                completed: false,
                solutions: {
                    server: `const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const { typeDefs, resolvers } = require('./schema');

const app = express();
app.use(cors());

// In-memory data
let users = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
];

let posts = [
  { id: '1', title: 'First Post', content: 'Hello World!', authorId: '1', createdAt: new Date().toISOString() },
  { id: '2', title: 'Second Post', content: 'GraphQL is awesome!', authorId: '2', createdAt: new Date().toISOString() }
];

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    ...resolvers,
    Query: {
      users: () => users,
      user: (_, { id }) => users.find(u => u.id === id),
      posts: () => posts,
      post: (_, { id }) => posts.find(p => p.id === id)
    },
    Mutation: {
      createUser: (_, { name, email }) => {
        const newUser = { id: String(users.length + 1), name, email };
        users.push(newUser);
        return newUser;
      },
      createPost: (_, { title, content, authorId }) => {
        const newPost = { 
          id: String(posts.length + 1), 
          title, 
          content, 
          authorId, 
          createdAt: new Date().toISOString() 
        };
        posts.push(newPost);
        return newPost;
      }
    },
    User: {
      posts: (user) => posts.filter(p => p.authorId === user.id)
    },
    Post: {
      author: (post) => users.find(u => u.id === post.authorId)
    }
  },
  context: ({ req }) => ({
    users,
    posts
  })
});

const PORT = 4000;

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
  
  app.listen(PORT, () => {
    console.log(\`GraphQL server running at http://localhost:\${PORT}\${server.graphqlPath}\`);
  });
}

startServer().catch(console.error);`,
                    schema: `const { gql } = require('apollo-server-express');

const typeDefs = gql\`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }
  
  type Post {
    id: ID!
    title: String!
    content: String
    author: User!
    createdAt: String!
  }
  
  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
  }
  
  type Mutation {
    createUser(name: String!, email: String!): User!
    createPost(title: String!, content: String, authorId: ID!): Post!
  }
\`;

const resolvers = {
  Query: {
    users: () => [],
    user: (_, { id }) => null,
    posts: () => [],
    post: (_, { id }) => null
  },
  Mutation: {
    createUser: (_, { name, email }) => null,
    createPost: (_, { title, content, authorId }) => null
  },
  User: {
    posts: (user) => []
  },
  Post: {
    author: (post) => null
  }
};

module.exports = { typeDefs, resolvers };`,
                    package: `{
  "name": "graphql-api-demo",
  "version": "1.0.0",
  "description": "GraphQL API demonstration",
  "main": "graphql-server.js",
  "scripts": {
    "start": "node graphql-server.js",
    "dev": "nodemon graphql-server.js"
  },
  "dependencies": {
    "apollo-server-express": "^3.12.1",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "graphql": "^16.8.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "keywords": ["graphql", "apollo", "api", "nodejs"],
  "author": "Your Name",
  "license": "MIT"
}`
                }
            },
            {
                id: 3,
                name: 'API Authentication',
                completed: false,
                solutions: {
                    api: `const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory user store
let users = [];
let nextId = 1;

// POST /api/register - User registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = {
      id: nextId++,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/login - User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/profile - Get user profile (protected)
app.get('/api/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (user) {
    res.json({ id: user.id, name: user.name, email: user.email });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log(\`Auth API server running on port \${PORT}\`);
});`,
                    middleware: `const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key';

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Middleware to check user roles
function requireRole(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
}

// Rate limiting middleware
function rateLimit(maxRequests, windowMs) {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old requests
    if (requests.has(ip)) {
      const userRequests = requests.get(ip).filter(time => time > windowStart);
      requests.set(ip, userRequests);
    } else {
      requests.set(ip, []);
    }
    
    const userRequests = requests.get(ip);
    
    if (userRequests.length >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    
    userRequests.push(now);
    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole,
  rateLimit
};`,
                    package: `{
  "name": "auth-api-demo",
  "version": "1.0.0",
  "description": "API Authentication demonstration",
  "main": "auth-api.js",
  "scripts": {
    "start": "node auth-api.js",
    "dev": "nodemon auth-api.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "keywords": ["authentication", "jwt", "bcrypt", "api"],
  "author": "Your Name",
  "license": "MIT"
}`
                }
            },
            {
                id: 4,
                name: 'API Middleware & Validation',
                completed: false,
                solutions: {
                    api: `const express = require('express');
const { body, validationResult } = require('express-validator');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(\`[\${timestamp}] \${req.method} \${req.path} - \${req.ip}\`);
  next();
}

// Error handling middleware
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
}

// Validation middleware
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
}

// Apply logging middleware
app.use(requestLogger);

// POST /api/users - Create user with validation
app.post('/api/users', [
  body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Must be a valid email'),
  body('age').isInt({ min: 0, max: 120 }).withMessage('Age must be between 0 and 120')
], validateRequest, (req, res) => {
  const { name, email, age } = req.body;
  
  const newUser = {
    id: Date.now(),
    name,
    email,
    age,
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json({
    message: 'User created successfully',
    user: newUser
  });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(\`Middleware API server running on port \${PORT}\`);
});`,
                    validation: `const { body, param, query, validationResult } = require('express-validator');

// User validation rules
const userValidationRules = [
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('age')
    .isInt({ min: 0, max: 120 })
    .withMessage('Age must be between 0 and 120'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];

// Post validation rules
const postValidationRules = [
  body('title')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('content')
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters'),
  
  body('category')
    .isIn(['tech', 'business', 'lifestyle', 'travel'])
    .withMessage('Category must be one of: tech, business, lifestyle, travel')
];

// ID parameter validation
const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer')
];

// Query parameter validation
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

module.exports = {
  userValidationRules,
  postValidationRules,
  idValidation,
  paginationValidation,
  handleValidationErrors
};`,
                    package: `{
  "name": "middleware-api-demo",
  "version": "1.0.0",
  "description": "API Middleware and Validation demonstration",
  "main": "middleware-api.js",
  "scripts": {
    "start": "node middleware-api.js",
    "dev": "nodemon middleware-api.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "keywords": ["middleware", "validation", "express", "api"],
  "author": "Your Name",
  "license": "MIT"
}`
                }
            },
            {
                id: 5,
                name: 'API Testing & Documentation',
                completed: false,
                solutions: {
                    tests: `const request = require('supertest');
const app = require('./app');

describe('API Tests', () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    // Clean up test data
    testUser = null;
    authToken = null;
  });

  describe('User Endpoints', () => {
    test('GET /api/users should return all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);
      
      expect(response.body).toBeInstanceOf(Array);
    });

    test('POST /api/users should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        age: 25
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);
      
      expect(response.body.user).toMatchObject({
        name: userData.name,
        email: userData.email,
        age: userData.age
      });
      
      testUser = response.body.user;
    });

    test('POST /api/users should validate required fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'Test' })
        .expect(400);
      
      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('Authentication', () => {
    test('POST /api/register should register new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/register')
        .send(userData)
        .expect(201);
      
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
    });

    test('POST /api/login should authenticate user', async () => {
      // First register a user
      await request(app)
        .post('/api/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
      
      // Then login
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);
      
      expect(response.body.token).toBeDefined();
      authToken = response.body.token;
    });

    test('Protected routes should require authentication', async () => {
      await request(app)
        .get('/api/profile')
        .expect(401);
    });
  });

  describe('Error Handling', () => {
    test('Should return 404 for non-existent routes', async () => {
      await request(app)
        .get('/api/nonexistent')
        .expect(404);
    });
  });
});`,
                    swagger: `const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'A comprehensive API documentation',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            id: {
              type: 'integer',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            },
            details: {
              type: 'array',
              items: {
                type: 'object'
              },
              description: 'Validation error details'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './app.js']
};

const specs = swaggerJsdoc(options);

module.exports = { specs };`,
                    package: `{
  "name": "api-testing-demo",
  "version": "1.0.0",
  "description": "API Testing and Documentation demonstration",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "dependencies": {
    "express": "^4.18.2",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "nodemon": "^3.0.1"
  },
  "jest": {
    "testEnvironment": "node",
    "collectCoverageFrom": [
      "**/*.js",
      "!node_modules/**",
      "!coverage/**"
    ]
  },
  "keywords": ["testing", "swagger", "documentation", "api"],
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
        
        output.innerHTML = 'Starting API server...';
        output.className = 'output request-flow';

        // Simulate API execution
        setTimeout(() => {
            try {
                let result = '';
                
                if (exerciseId === 1) {
                    result = this.simulateRESTAPI();
                } else if (exerciseId === 2) {
                    result = this.simulateGraphQL();
                } else if (exerciseId === 3) {
                    result = this.simulateAuthAPI();
                } else if (exerciseId === 4) {
                    result = this.simulateMiddlewareAPI();
                } else if (exerciseId === 5) {
                    result = this.simulateTestingAPI();
                }

                output.innerHTML = result;
                output.className = 'output success';
            } catch (error) {
                output.innerHTML = `Error: ${error.message}`;
                output.className = 'output error';
            }
        }, 2000);
    }

    simulateRESTAPI() {
        return `REST API Server Started:
✓ Express server running on port 3000
✓ CORS middleware enabled
✓ JSON parsing enabled

API Endpoints Available:
GET    /api/users     - List all users
GET    /api/users/:id - Get user by ID
POST   /api/users     - Create new user
PUT    /api/users/:id - Update user
DELETE /api/users/:id - Delete user

Test Results:
✓ GET /api/users: 200 OK (2 users)
✓ POST /api/users: 201 Created
✓ GET /api/users/1: 200 OK
✓ PUT /api/users/1: 200 OK
✓ DELETE /api/users/1: 204 No Content

Error Handling:
✓ 404 for non-existent routes
✓ 400 for invalid data
✓ 500 for server errors

✓ REST API implementation successful!`;
    }

    simulateGraphQL() {
        return `GraphQL Server Started:
✓ Apollo Server running on port 4000
✓ GraphQL Playground available at /graphql
✓ Schema introspection enabled

GraphQL Schema:
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String
  author: User!
  createdAt: String!
}

Available Queries:
- users: [User!]!
- user(id: ID!): User
- posts: [Post!]!
- post(id: ID!): Post

Available Mutations:
- createUser(name: String!, email: String!): User!
- createPost(title: String!, content: String, authorId: ID!): Post!

Test Queries:
✓ Query users: Returns all users with posts
✓ Query user by ID: Returns specific user
✓ Mutation createUser: Creates new user
✓ Mutation createPost: Creates new post

✓ GraphQL API implementation successful!`;
    }

    simulateAuthAPI() {
        return `Authentication API Server Started:
✓ Express server running on port 3001
✓ JWT authentication enabled
✓ Password hashing with bcrypt
✓ CORS middleware enabled

Authentication Endpoints:
POST /api/register - User registration
POST /api/login    - User login
GET  /api/profile  - Get user profile (protected)

Security Features:
✓ Password hashing with bcrypt (10 rounds)
✓ JWT tokens with 24h expiration
✓ Protected routes with middleware
✓ Input validation and sanitization

Test Results:
✓ POST /api/register: 201 Created (user registered)
✓ POST /api/login: 200 OK (token generated)
✓ GET /api/profile: 200 OK (with valid token)
✓ GET /api/profile: 401 Unauthorized (no token)
✓ GET /api/profile: 403 Forbidden (invalid token)

Middleware Features:
✓ JWT token verification
✓ Role-based access control
✓ Rate limiting (100 requests/hour)
✓ Request logging

✓ Authentication API implementation successful!`;
    }

    simulateMiddlewareAPI() {
        return `Middleware API Server Started:
✓ Express server running on port 3002
✓ Request validation enabled
✓ Error handling middleware
✓ Request logging enabled

Middleware Stack:
✓ CORS middleware
✓ JSON parsing middleware
✓ Request logging middleware
✓ Validation middleware
✓ Error handling middleware

Validation Features:
✓ User data validation (name, email, age)
✓ Email format validation
✓ Age range validation (0-120)
✓ Password strength validation
✓ Custom validation functions

Test Results:
✓ POST /api/users (valid data): 201 Created
✓ POST /api/users (invalid email): 400 Bad Request
✓ POST /api/users (missing fields): 400 Bad Request
✓ POST /api/users (invalid age): 400 Bad Request

Error Handling:
✓ Validation errors: 400 with details
✓ Server errors: 500 with message
✓ Development vs production error messages
✓ Request logging for debugging

✓ Middleware API implementation successful!`;
    }

    simulateTestingAPI() {
        return `API Testing Suite Started:
✓ Jest test framework initialized
✓ Supertest for API testing
✓ Test coverage reporting enabled

Test Categories:
✓ User Endpoints (GET, POST, PUT, DELETE)
✓ Authentication (register, login, protected routes)
✓ Error Handling (404, 400, 500)
✓ Validation (required fields, data types)

Test Results:
✓ 15 tests passed
✓ 0 tests failed
✓ 95% code coverage
✓ All endpoints tested

API Documentation:
✓ Swagger UI available at /api-docs
✓ OpenAPI 3.0 specification
✓ Interactive API explorer
✓ Request/response examples
✓ Authentication documentation

Documentation Features:
✓ Complete API schema
✓ Request/response models
✓ Error response documentation
✓ Authentication requirements
✓ Example requests and responses

✓ API Testing & Documentation successful!`;
    }

    checkExercise(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        const output = document.getElementById(`output${exerciseId}`);
        
        let isCorrect = false;
        let userCode = '';

        if (exerciseId === 1) {
            const apiCode = document.getElementById('editor1-api').value;
            const packageCode = document.getElementById('editor1-package').value;
            userCode = apiCode + '\n\n' + packageCode;
            isCorrect = this.checkRESTAPI(apiCode, packageCode);
        } else if (exerciseId === 2) {
            const serverCode = document.getElementById('editor2-server').value;
            const schemaCode = document.getElementById('editor2-schema').value;
            const packageCode = document.getElementById('editor2-package').value;
            userCode = serverCode + '\n\n' + schemaCode + '\n\n' + packageCode;
            isCorrect = this.checkGraphQL(serverCode, schemaCode, packageCode);
        } else if (exerciseId === 3) {
            const apiCode = document.getElementById('editor3-api').value;
            const middlewareCode = document.getElementById('editor3-middleware').value;
            const packageCode = document.getElementById('editor3-package').value;
            userCode = apiCode + '\n\n' + middlewareCode + '\n\n' + packageCode;
            isCorrect = this.checkAuthAPI(apiCode, middlewareCode, packageCode);
        } else if (exerciseId === 4) {
            const apiCode = document.getElementById('editor4-api').value;
            const validationCode = document.getElementById('editor4-validation').value;
            const packageCode = document.getElementById('editor4-package').value;
            userCode = apiCode + '\n\n' + validationCode + '\n\n' + packageCode;
            isCorrect = this.checkMiddlewareAPI(apiCode, validationCode, packageCode);
        } else if (exerciseId === 5) {
            const testsCode = document.getElementById('editor5-tests').value;
            const swaggerCode = document.getElementById('editor5-swagger').value;
            const packageCode = document.getElementById('editor5-package').value;
            userCode = testsCode + '\n\n' + swaggerCode + '\n\n' + packageCode;
            isCorrect = this.checkTestingAPI(testsCode, swaggerCode, packageCode);
        }

        if (isCorrect) {
            exercise.completed = true;
            document.getElementById(`status${exerciseId}`).textContent = '✅ Completed';
            document.getElementById(`status${exerciseId}`).className = 'exercise-status completed';
            output.innerHTML = '🎉 Excellent! Your API solution is correct!';
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

    checkRESTAPI(apiCode, packageCode) {
        const hasExpress = apiCode.includes('express()');
        const hasGet = apiCode.includes('app.get(');
        const hasPost = apiCode.includes('app.post(');
        const hasPut = apiCode.includes('app.put(');
        const hasDelete = apiCode.includes('app.delete(');
        const hasErrorHandling = apiCode.includes('app.use(') && apiCode.includes('err');
        const hasExpressDep = packageCode.includes('"express"');
        
        return hasExpress && hasGet && hasPost && hasPut && hasDelete && hasErrorHandling && hasExpressDep;
    }

    checkGraphQL(serverCode, schemaCode, packageCode) {
        const hasApolloServer = serverCode.includes('ApolloServer');
        const hasTypeDefs = schemaCode.includes('typeDefs');
        const hasResolvers = schemaCode.includes('resolvers');
        const hasQuery = schemaCode.includes('type Query');
        const hasMutation = schemaCode.includes('type Mutation');
        const hasApolloDep = packageCode.includes('"apollo-server-express"');
        
        return hasApolloServer && hasTypeDefs && hasResolvers && hasQuery && hasMutation && hasApolloDep;
    }

    checkAuthAPI(apiCode, middlewareCode, packageCode) {
        const hasBcrypt = apiCode.includes('bcrypt');
        const hasJWT = apiCode.includes('jsonwebtoken');
        const hasRegister = apiCode.includes('/api/register');
        const hasLogin = apiCode.includes('/api/login');
        const hasAuthMiddleware = middlewareCode.includes('authenticateToken');
        const hasBcryptDep = packageCode.includes('"bcrypt"');
        
        return hasBcrypt && hasJWT && hasRegister && hasLogin && hasAuthMiddleware && hasBcryptDep;
    }

    checkMiddlewareAPI(apiCode, validationCode, packageCode) {
        const hasValidation = apiCode.includes('express-validator');
        const hasMiddleware = apiCode.includes('app.use(');
        const hasValidationRules = validationCode.includes('body(');
        const hasErrorHandling = apiCode.includes('errorHandler');
        const hasExpressValidatorDep = packageCode.includes('"express-validator"');
        
        return hasValidation && hasMiddleware && hasValidationRules && hasErrorHandling && hasExpressValidatorDep;
    }

    checkTestingAPI(testsCode, swaggerCode, packageCode) {
        const hasJest = testsCode.includes('describe(') && testsCode.includes('test(');
        const hasSupertest = testsCode.includes('request(');
        const hasSwagger = swaggerCode.includes('swagger-jsdoc');
        const hasJestDep = packageCode.includes('"jest"');
        const hasSupertestDep = packageCode.includes('"supertest"');
        
        return hasJest && hasSupertest && hasSwagger && hasJestDep && hasSupertestDep;
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
            badge.textContent = 'API Novice';
        } else if (completed < 3) {
            badge.textContent = 'API Learner';
        } else if (completed < 5) {
            badge.textContent = 'API Developer';
        } else {
            badge.textContent = 'API Master';
        }
    }

    saveProgress() {
        const progress = {
            level: 15,
            exercises: this.exercises.map(ex => ({
                id: ex.id,
                completed: ex.completed
            })),
            completedAt: new Date().toISOString()
        };
        
        localStorage.setItem('level15Progress', JSON.stringify(progress));
        
        // Also update main progress
        const mainProgress = JSON.parse(localStorage.getItem('frontendMasteryProgress') || '{}');
        mainProgress.level15 = progress;
        localStorage.setItem('frontendMasteryProgress', JSON.stringify(mainProgress));
    }

    loadProgress() {
        const saved = localStorage.getItem('level15Progress');
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
        window.location.href = '../level-14/';
    }

    goToNextLevel() {
        const allCompleted = this.exercises.every(ex => ex.completed);
        if (allCompleted) {
            window.location.href = '../level-16/';
        } else {
            alert('Please complete all exercises before proceeding to the next level!');
        }
    }
}

// Global functions for HTML onclick handlers
function runExercise(exerciseId) {
    if (window.apiLevel) {
        window.apiLevel.runExercise(exerciseId);
    }
}

function checkExercise(exerciseId) {
    if (window.apiLevel) {
        window.apiLevel.checkExercise(exerciseId);
    }
}

function goToPreviousLevel() {
    if (window.apiLevel) {
        window.apiLevel.goToPreviousLevel();
    }
}

function goToNextLevel() {
    if (window.apiLevel) {
        window.apiLevel.goToNextLevel();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.apiLevel = new APILevel();
});
