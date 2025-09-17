// Level 14: Database Integration - Interactive Script

class DatabaseLevel {
    constructor() {
        this.exercises = [
            {
                id: 1,
                name: 'MongoDB Basics',
                completed: false,
                solutions: {
                    mongodb: `const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('learning_db');
    const collection = db.collection('users');
    
    // 1. Insert a document
    const user1 = await collection.insertOne({
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      city: 'New York'
    });
    console.log('Inserted user:', user1.insertedId);
    
    // 2. Find documents
    const users = await collection.find({}).toArray();
    console.log('All users:', users);
    
    // 3. Update a document
    const updateResult = await collection.updateOne(
      { email: 'john@example.com' },
      { $set: { age: 31 } }
    );
    console.log('Updated documents:', updateResult.modifiedCount);
    
    // 4. Delete a document
    const deleteResult = await collection.deleteOne({ email: 'john@example.com' });
    console.log('Deleted documents:', deleteResult.deletedCount);
    
    // 5. Count documents
    const count = await collection.countDocuments();
    console.log('Total documents:', count);
    
  } finally {
    await client.close();
  }
}

main().catch(console.error);`,
                    package: `{
  "name": "mongodb-basics",
  "version": "1.0.0",
  "description": "MongoDB basics learning",
  "main": "mongodb-basics.js",
  "scripts": {
    "start": "node mongodb-basics.js"
  },
  "dependencies": {
    "mongodb": "^6.0.0"
  },
  "keywords": ["mongodb", "database", "nosql"],
  "author": "Your Name",
  "license": "MIT"
}`
                }
            },
            {
                id: 2,
                name: 'SQL Database Operations',
                completed: false,
                solutions: {
                    sql: `const sqlite3 = require('sqlite3').verbose();
const path = require('path');

async function main() {
  const db = new sqlite3.Database(':memory:');
  
  // 1. Create tables
  await new Promise((resolve, reject) => {
    db.exec(\`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    \`, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  
  // 2. Insert sample data
  await new Promise((resolve, reject) => {
    db.run(\`
      INSERT INTO users (name, email) VALUES 
      ('John Doe', 'john@example.com'),
      ('Jane Smith', 'jane@example.com')
    \`, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  
  await new Promise((resolve, reject) => {
    db.run(\`
      INSERT INTO posts (title, content, user_id) VALUES 
      ('First Post', 'This is my first post', 1),
      ('Second Post', 'This is my second post', 1),
      ('Hello World', 'Hello from Jane', 2)
    \`, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  
  // 3. Query with JOINs
  const postsWithUsers = await new Promise((resolve, reject) => {
    db.all(\`
      SELECT p.title, p.content, u.name as author, p.created_at
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    \`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
  
  console.log('Posts with authors:', postsWithUsers);
  
  // 4. Update records
  await new Promise((resolve, reject) => {
    db.run(\`
      UPDATE posts 
      SET content = 'Updated content' 
      WHERE id = 1
    \`, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  
  // 5. Handle transactions
  await new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      
      db.run('INSERT INTO users (name, email) VALUES (?, ?)', 
        ['Bob Johnson', 'bob@example.com'], function(err) {
        if (err) {
          db.run('ROLLBACK');
          reject(err);
        } else {
          const userId = this.lastID;
          db.run('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)',
            ['Bob\\'s Post', 'Hello from Bob', userId], function(err) {
            if (err) {
              db.run('ROLLBACK');
              reject(err);
            } else {
              db.run('COMMIT', (err) => {
                if (err) reject(err);
                else resolve();
              });
            }
          });
        }
      });
    });
  });
  
  console.log('SQL operations completed successfully!');
  db.close();
}

main().catch(console.error);`,
                    schema: `-- Database Schema
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  user_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Comments table
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER,
  user_id INTEGER,
  comment TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);`
                }
            },
            {
                id: 3,
                name: 'ORM with Prisma',
                completed: false,
                solutions: {
                    schema: `// Prisma Schema
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`,
                    operations: `const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // 1. Create a user
  const user = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
    },
  });
  console.log('Created user:', user);
  
  // 2. Create a post for the user
  const post = await prisma.post.create({
    data: {
      title: 'My First Post',
      content: 'This is the content of my first post',
      published: true,
      authorId: user.id,
    },
  });
  console.log('Created post:', post);
  
  // 3. Find users with their posts
  const usersWithPosts = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
  console.log('Users with posts:', usersWithPosts);
  
  // 4. Update a post
  const updatedPost = await prisma.post.update({
    where: { id: post.id },
    data: { content: 'Updated content' },
  });
  console.log('Updated post:', updatedPost);
  
  // 5. Delete a user and cascade posts
  const deletedUser = await prisma.user.delete({
    where: { id: user.id },
  });
  console.log('Deleted user:', deletedUser);
  
  console.log('Prisma operations completed!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });`,
                    package: `{
  "name": "prisma-demo",
  "version": "1.0.0",
  "description": "Prisma ORM demonstration",
  "main": "operations.js",
  "scripts": {
    "start": "node operations.js",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0"
  },
  "keywords": ["prisma", "orm", "database"],
  "author": "Your Name",
  "license": "MIT"
}`
                }
            },
            {
                id: 4,
                name: 'Database Design Patterns',
                completed: false,
                solutions: {
                    sql: `-- Database Design Patterns
-- 1. Normalized Schema Design
-- 2. Proper Indexing Strategy
-- 3. Relationship Management
-- 4. Performance Optimization

-- Users table (1NF, 2NF, 3NF compliant)
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Categories table (normalized)
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table with proper relationships
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id INTEGER,
  stock_quantity INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Composite indexes for common queries
CREATE INDEX idx_products_category_price ON products(category_id, price);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_stock ON products(stock_quantity);

-- Orders table (transactional)
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items (junction table)
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Indexes for order queries
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);`,
                    optimization: `// Database Optimization Techniques
const sqlite3 = require('sqlite3').verbose();

class DatabaseOptimizer {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath);
  }

  // 1. Query Optimization
  async optimizeQueries() {
    // Use prepared statements
    const stmt = this.db.prepare(\`
      SELECT u.username, u.email, COUNT(o.id) as order_count
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.created_at > ?
      GROUP BY u.id
      ORDER BY order_count DESC
      LIMIT ?
    \`);
    
    // Use EXPLAIN QUERY PLAN for optimization
    const explainQuery = \`
      EXPLAIN QUERY PLAN
      SELECT p.name, p.price, c.name as category
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.price BETWEEN ? AND ?
      ORDER BY p.price
    \`;
    
    return { stmt, explainQuery };
  }

  // 2. Connection Pooling
  setupConnectionPool() {
    // Configure connection limits
    this.db.configure('busyTimeout', 5000);
    this.db.configure('journal_mode', 'WAL');
    this.db.configure('synchronous', 'NORMAL');
  }

  // 3. Transaction Management
  async executeTransaction(operations) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');
        
        operations.forEach((operation, index) => {
          this.db.run(operation.sql, operation.params, function(err) {
            if (err) {
              this.db.run('ROLLBACK');
              reject(err);
            } else if (index === operations.length - 1) {
              this.db.run('COMMIT', (err) => {
                if (err) reject(err);
                else resolve();
              });
            }
          });
        });
      });
    });
  }

  // 4. Batch Operations
  async batchInsert(table, data) {
    const placeholders = data.map(() => '(?, ?, ?)').join(', ');
    const sql = \`INSERT INTO \${table} (name, value, created_at) VALUES \${placeholders}\`;
    
    const params = data.flatMap(item => [
      item.name,
      item.value,
      new Date().toISOString()
    ]);
    
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  close() {
    this.db.close();
  }
}

// Usage example
async function demonstrateOptimization() {
  const optimizer = new DatabaseOptimizer(':memory:');
  
  // Setup connection pool
  optimizer.setupConnectionPool();
  
  // Optimize queries
  const { stmt, explainQuery } = await optimizer.optimizeQueries();
  
  console.log('Database optimization techniques applied!');
  console.log('Query plan:', explainQuery);
  
  optimizer.close();
}

demonstrateOptimization().catch(console.error);`
                }
            },
            {
                id: 5,
                name: 'Database Integration with Express',
                completed: false,
                solutions: {
                    express: `// Express.js with Database Integration
const express = require('express');
const cors = require('cors');
const Database = require('./database');

const app = express();
const db = new Database();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    req.db = await db.getConnection();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// GET /api/users - Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await req.db.all('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST /api/users - Create new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await req.db.run(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    res.status(201).json({ id: result.lastID, name, email });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// GET /api/users/:id - Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await req.db.get(
      'SELECT * FROM users WHERE id = ?',
      [req.params.id]
    );
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT /api/users/:id - Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await req.db.run(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, req.params.id]
    );
    if (result.changes > 0) {
      res.json({ id: req.params.id, name, email });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id - Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const result = await req.db.run(
      'DELETE FROM users WHERE id = ?',
      [req.params.id]
    );
    if (result.changes > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(\`Express server with database running on port \${PORT}\`);
});`,
                    database: `// Database Connection Manager
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.dbPath = path.join(__dirname, 'app.db');
    this.db = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          this.initializeTables();
          resolve();
        }
      });
    });
  }

  async getConnection() {
    if (!this.db) {
      await this.connect();
    }
    return this.db;
  }

  initializeTables() {
    const createUsersTable = \`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    \`;
    
    this.db.run(createUsersTable);
  }

  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  async get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

module.exports = Database;`,
                    package: `{
  "name": "express-database",
  "version": "1.0.0",
  "description": "Express.js with database integration",
  "main": "express-db.js",
  "scripts": {
    "start": "node express-db.js",
    "dev": "nodemon express-db.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "sqlite3": "^5.1.6"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "keywords": ["express", "database", "sqlite", "api"],
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
        
        output.innerHTML = 'Running database operations...';
        output.className = 'output connecting';

        // Simulate database execution
        setTimeout(() => {
            try {
                let result = '';
                
                if (exerciseId === 1) {
                    result = this.simulateMongoDB();
                } else if (exerciseId === 2) {
                    result = this.simulateSQL();
                } else if (exerciseId === 3) {
                    result = this.simulatePrisma();
                } else if (exerciseId === 4) {
                    result = this.simulateDesignPatterns();
                } else if (exerciseId === 5) {
                    result = this.simulateExpressDB();
                }

                output.innerHTML = result;
                output.className = 'output success';
            } catch (error) {
                output.innerHTML = `Error: ${error.message}`;
                output.className = 'output error';
            }
        }, 1500);
    }

    simulateMongoDB() {
        return `Connected to MongoDB
✓ Database connection established
✓ Collection 'users' created

MongoDB Operations:
1. Insert Document:
   - Document ID: 507f1f77bcf86cd799439011
   - User: { name: 'John Doe', email: 'john@example.com', age: 30 }

2. Find Documents:
   - Found 1 document(s)
   - Results: [ { _id: ObjectId('507f1f77bcf86cd799439011'), name: 'John Doe', ... } ]

3. Update Document:
   - Modified 1 document(s)
   - Updated age from 30 to 31

4. Delete Document:
   - Deleted 1 document(s)
   - User john@example.com removed

5. Count Documents:
   - Total documents: 0

✓ All MongoDB operations completed successfully!`;
    }

    simulateSQL() {
        return `SQLite Database Operations:
✓ Database connection established
✓ Tables created successfully

Schema Creation:
- users table: ✓ Created with constraints
- posts table: ✓ Created with foreign keys
- comments table: ✓ Created with relationships

Data Operations:
1. Insert Sample Data:
   - 2 users inserted
   - 3 posts inserted
   - Foreign key relationships maintained

2. JOIN Query Results:
   - Post: "First Post" by John Doe
   - Post: "Second Post" by John Doe  
   - Post: "Hello World" by Jane Smith

3. Update Operation:
   - 1 post updated successfully
   - Content changed to "Updated content"

4. Transaction Results:
   - Transaction started
   - New user "Bob Johnson" created
   - New post "Bob's Post" created
   - Transaction committed successfully

✓ All SQL operations completed successfully!`;
    }

    simulatePrisma() {
        return `Prisma ORM Operations:
✓ Prisma client initialized
✓ Database connection established

ORM Operations:
1. Create User:
   - User ID: 1
   - Email: john@example.com
   - Name: John Doe

2. Create Post:
   - Post ID: 1
   - Title: "My First Post"
   - Author: John Doe
   - Published: true

3. Find Users with Posts:
   - User: John Doe
     - Posts: 1 post(s)
     - Latest: "My First Post"

4. Update Post:
   - Post ID: 1 updated
   - Content: "Updated content"
   - Timestamp: ${new Date().toISOString()}

5. Delete User (Cascade):
   - User ID: 1 deleted
   - Associated posts removed
   - Referential integrity maintained

✓ All Prisma operations completed successfully!`;
    }

    simulateDesignPatterns() {
        return `Database Design Patterns Applied:
✓ Normalized schema created
✓ Performance optimization implemented

Schema Design:
1. Normalization (1NF, 2NF, 3NF):
   - Users table: ✓ Fully normalized
   - Products table: ✓ Proper relationships
   - Orders table: ✓ Transactional design

2. Indexing Strategy:
   - Primary indexes: ✓ Created
   - Composite indexes: ✓ Optimized
   - Foreign key indexes: ✓ Applied

3. Relationship Management:
   - One-to-Many: users → posts ✓
   - Many-to-Many: orders ↔ products ✓
   - Foreign key constraints: ✓ Enforced

4. Performance Optimization:
   - Query plan analysis: ✓ Completed
   - Connection pooling: ✓ Configured
   - Transaction management: ✓ Implemented
   - Batch operations: ✓ Optimized

Query Performance:
- Simple queries: < 1ms
- JOIN queries: < 5ms
- Complex aggregations: < 10ms

✓ Database design patterns successfully implemented!`;
    }

    simulateExpressDB() {
        return `Express.js with Database Integration:
✓ Express server started
✓ Database connection established
✓ API endpoints configured

Server Status:
- Port: 3003
- Database: SQLite (app.db)
- Middleware: CORS, JSON parsing
- Error handling: ✓ Configured

API Endpoints:
GET    /api/users     - List all users ✓
POST   /api/users     - Create user ✓
GET    /api/users/:id - Get user by ID ✓
PUT    /api/users/:id - Update user ✓
DELETE /api/users/:id - Delete user ✓

Database Operations:
1. Connection Pool: ✓ Active
2. Prepared Statements: ✓ Optimized
3. Transaction Support: ✓ Available
4. Error Handling: ✓ Implemented

Test Results:
- GET /api/users: 200 OK (0 users)
- POST /api/users: 201 Created
- GET /api/users/1: 200 OK
- PUT /api/users/1: 200 OK
- DELETE /api/users/1: 204 No Content

✓ Express.js with database integration successful!`;
    }

    checkExercise(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        const output = document.getElementById(`output${exerciseId}`);
        
        let isCorrect = false;
        let userCode = '';

        if (exerciseId === 1) {
            const mongodbCode = document.getElementById('editor1-mongodb').value;
            const packageCode = document.getElementById('editor1-package').value;
            userCode = mongodbCode + '\n\n' + packageCode;
            isCorrect = this.checkMongoDB(mongodbCode, packageCode);
        } else if (exerciseId === 2) {
            const sqlCode = document.getElementById('editor2-sql').value;
            const schemaCode = document.getElementById('editor2-schema').value;
            userCode = sqlCode + '\n\n' + schemaCode;
            isCorrect = this.checkSQL(sqlCode, schemaCode);
        } else if (exerciseId === 3) {
            const schemaCode = document.getElementById('editor3-schema').value;
            const operationsCode = document.getElementById('editor3-operations').value;
            const packageCode = document.getElementById('editor3-package').value;
            userCode = schemaCode + '\n\n' + operationsCode + '\n\n' + packageCode;
            isCorrect = this.checkPrisma(schemaCode, operationsCode, packageCode);
        } else if (exerciseId === 4) {
            const sqlCode = document.getElementById('editor4-sql').value;
            const optimizationCode = document.getElementById('editor4-optimization').value;
            userCode = sqlCode + '\n\n' + optimizationCode;
            isCorrect = this.checkDesignPatterns(sqlCode, optimizationCode);
        } else if (exerciseId === 5) {
            const expressCode = document.getElementById('editor5-express').value;
            const databaseCode = document.getElementById('editor5-database').value;
            const packageCode = document.getElementById('editor5-package').value;
            userCode = expressCode + '\n\n' + databaseCode + '\n\n' + packageCode;
            isCorrect = this.checkExpressDB(expressCode, databaseCode, packageCode);
        }

        if (isCorrect) {
            exercise.completed = true;
            document.getElementById(`status${exerciseId}`).textContent = '✅ Completed';
            document.getElementById(`status${exerciseId}`).className = 'exercise-status completed';
            output.innerHTML = '🎉 Excellent! Your database solution is correct!';
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

    checkMongoDB(mongodbCode, packageCode) {
        const hasMongoClient = mongodbCode.includes('MongoClient');
        const hasConnect = mongodbCode.includes('connect()');
        const hasInsert = mongodbCode.includes('insertOne') || mongodbCode.includes('insert');
        const hasFind = mongodbCode.includes('find(');
        const hasUpdate = mongodbCode.includes('updateOne') || mongodbCode.includes('update');
        const hasDelete = mongodbCode.includes('deleteOne') || mongodbCode.includes('delete');
        const hasMongoDep = packageCode.includes('"mongodb"');
        
        return hasMongoClient && hasConnect && hasInsert && hasFind && hasUpdate && hasDelete && hasMongoDep;
    }

    checkSQL(sqlCode, schemaCode) {
        const hasSqlite3 = sqlCode.includes('sqlite3');
        const hasCreateTable = schemaCode.includes('CREATE TABLE');
        const hasInsert = sqlCode.includes('INSERT INTO');
        const hasSelect = sqlCode.includes('SELECT');
        const hasJoin = sqlCode.includes('JOIN');
        const hasTransaction = sqlCode.includes('BEGIN TRANSACTION') || sqlCode.includes('COMMIT');
        
        return hasSqlite3 && hasCreateTable && hasInsert && hasSelect && hasJoin && hasTransaction;
    }

    checkPrisma(schemaCode, operationsCode, packageCode) {
        const hasModel = schemaCode.includes('model User') && schemaCode.includes('model Post');
        const hasPrismaClient = operationsCode.includes('PrismaClient');
        const hasCreate = operationsCode.includes('prisma.user.create');
        const hasFind = operationsCode.includes('prisma.user.findMany');
        const hasUpdate = operationsCode.includes('prisma.user.update');
        const hasDelete = operationsCode.includes('prisma.user.delete');
        const hasPrismaDep = packageCode.includes('"@prisma/client"');
        
        return hasModel && hasPrismaClient && hasCreate && hasFind && hasUpdate && hasDelete && hasPrismaDep;
    }

    checkDesignPatterns(sqlCode, optimizationCode) {
        const hasCreateTable = sqlCode.includes('CREATE TABLE');
        const hasIndex = sqlCode.includes('CREATE INDEX');
        const hasForeignKey = sqlCode.includes('FOREIGN KEY');
        const hasClass = optimizationCode.includes('class DatabaseOptimizer');
        const hasQueryOpt = optimizationCode.includes('optimizeQueries');
        const hasTransaction = optimizationCode.includes('executeTransaction');
        
        return hasCreateTable && hasIndex && hasForeignKey && hasClass && hasQueryOpt && hasTransaction;
    }

    checkExpressDB(expressCode, databaseCode, packageCode) {
        const hasExpress = expressCode.includes('express()');
        const hasRoutes = expressCode.includes('app.get') && expressCode.includes('app.post');
        const hasDatabase = databaseCode.includes('class Database');
        const hasConnection = databaseCode.includes('getConnection');
        const hasErrorHandling = expressCode.includes('catch') || expressCode.includes('error');
        const hasExpressDep = packageCode.includes('"express"');
        
        return hasExpress && hasRoutes && hasDatabase && hasConnection && hasErrorHandling && hasExpressDep;
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
            badge.textContent = 'Database Novice';
        } else if (completed < 3) {
            badge.textContent = 'Database Learner';
        } else if (completed < 5) {
            badge.textContent = 'Database Developer';
        } else {
            badge.textContent = 'Database Master';
        }
    }

    saveProgress() {
        const progress = {
            level: 14,
            exercises: this.exercises.map(ex => ({
                id: ex.id,
                completed: ex.completed
            })),
            completedAt: new Date().toISOString()
        };
        
        localStorage.setItem('level14Progress', JSON.stringify(progress));
        
        // Also update main progress
        const mainProgress = JSON.parse(localStorage.getItem('frontendMasteryProgress') || '{}');
        mainProgress.level14 = progress;
        localStorage.setItem('frontendMasteryProgress', JSON.stringify(mainProgress));
    }

    loadProgress() {
        const saved = localStorage.getItem('level14Progress');
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
        window.location.href = '../level-13/';
    }

    goToNextLevel() {
        const allCompleted = this.exercises.every(ex => ex.completed);
        if (allCompleted) {
            window.location.href = '../level-15/';
        } else {
            alert('Please complete all exercises before proceeding to the next level!');
        }
    }
}

// Global functions for HTML onclick handlers
function runExercise(exerciseId) {
    if (window.databaseLevel) {
        window.databaseLevel.runExercise(exerciseId);
    }
}

function checkExercise(exerciseId) {
    if (window.databaseLevel) {
        window.databaseLevel.checkExercise(exerciseId);
    }
}

function goToPreviousLevel() {
    if (window.databaseLevel) {
        window.databaseLevel.goToPreviousLevel();
    }
}

function goToNextLevel() {
    if (window.databaseLevel) {
        window.databaseLevel.goToNextLevel();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.databaseLevel = new DatabaseLevel();
});
