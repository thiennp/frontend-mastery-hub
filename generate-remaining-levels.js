#!/usr/bin/env node

/**
 * Generate Remaining Levels Script
 * Efficiently creates content for levels 14-200
 */

const fs = require('fs');
const path = require('path');

// Level definitions for remaining levels
const levelDefinitions = {
  // Levels 14-20: Testing & Quality Assurance
  14: {
    title: "Testing & Quality Assurance",
    description: "Master testing strategies, tools, and quality assurance practices for frontend development",
    modules: [
      "Unit Testing Fundamentals",
      "Integration Testing",
      "End-to-End Testing",
      "Test-Driven Development",
      "Quality Assurance Practices"
    ]
  },
  15: {
    title: "Performance Optimization",
    description: "Advanced performance optimization techniques and monitoring strategies",
    modules: [
      "Core Web Vitals",
      "Performance Monitoring",
      "Optimization Strategies",
      "Bundle Analysis",
      "Performance Budgets"
    ]
  },
  16: {
    title: "Security Best Practices",
    description: "Frontend security patterns, vulnerabilities, and protection strategies",
    modules: [
      "Security Fundamentals",
      "Common Vulnerabilities",
      "Authentication & Authorization",
      "Data Protection",
      "Security Headers"
    ]
  },
  17: {
    title: "Accessibility & Inclusive Design",
    description: "Building accessible and inclusive web applications",
    modules: [
      "WCAG Guidelines",
      "ARIA Implementation",
      "Keyboard Navigation",
      "Screen Reader Support",
      "Inclusive Design Patterns"
    ]
  },
  18: {
    title: "Progressive Web Apps",
    description: "Building modern Progressive Web Applications with offline capabilities",
    modules: [
      "PWA Fundamentals",
      "Service Workers",
      "Web App Manifests",
      "Offline Strategies",
      "Push Notifications"
    ]
  },
  19: {
    title: "Web Components",
    description: "Creating reusable web components with modern standards",
    modules: [
      "Custom Elements",
      "Shadow DOM",
      "HTML Templates",
      "Component Libraries",
      "Framework Integration"
    ]
  },
  20: {
    title: "Micro-frontends",
    description: "Building scalable applications with micro-frontend architecture",
    modules: [
      "Micro-frontend Architecture",
      "Module Federation",
      "Communication Patterns",
      "Deployment Strategies",
      "Team Organization"
    ]
  }
};

// Generate content for a single level
function generateLevelContent(levelNumber, definition) {
  const levelDir = path.join(__dirname, 'levels', levelNumber.toString());
  
  // Create level directory
  if (!fs.existsSync(levelDir)) {
    fs.mkdirSync(levelDir, { recursive: true });
  }

  // Generate README.md
  const readmeContent = `# Level ${levelNumber}: ${definition.title}

## Overview
${definition.description}

## Learning Objectives
By the end of this level, you will:
- Understand the core concepts of ${definition.title.toLowerCase()}
- Master practical implementation techniques
- Build real-world projects
- Apply best practices and patterns

## Prerequisites
- Completion of previous levels
- Basic understanding of web development
- Familiarity with JavaScript and modern frameworks

## Modules
${definition.modules.map((module, index) => `${index + 1}. **${module}**: Core concepts and implementation`).join('\n')}

## Mini-Project
Build a comprehensive project that demonstrates mastery of ${definition.title.toLowerCase()}.

## Assessment
Complete the assessment and quiz to earn your Level ${levelNumber} badge.

## Resources
- Official documentation
- Community resources
- Best practices guides
- Advanced tutorials

## Next Level
Continue to Level ${levelNumber + 1} to build upon these concepts.
`;

  fs.writeFileSync(path.join(levelDir, 'README.md'), readmeContent);

  // Generate articles
  const articlesDir = path.join(__dirname, 'articles');
  if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true });
  }

  definition.modules.forEach((module, index) => {
    const articleContent = `# ${module}

## Table of Contents
1. [Introduction](#introduction)
2. [Core Concepts](#core-concepts)
3. [Implementation](#implementation)
4. [Best Practices](#best-practices)
5. [Real-world Examples](#real-world-examples)
6. [Common Pitfalls](#common-pitfalls)
7. [Conclusion](#conclusion)

## Introduction

${module} is a fundamental aspect of modern frontend development that enables developers to build robust, maintainable, and scalable applications.

### Why ${module} Matters

- **Quality**: Ensures high-quality, reliable applications
- **Maintainability**: Makes code easier to maintain and update
- **Scalability**: Enables applications to grow and evolve
- **User Experience**: Provides better experiences for end users
- **Team Collaboration**: Improves team productivity and collaboration

## Core Concepts

### Fundamental Principles

The core principles of ${module} include:

1. **Modularity**: Breaking down complex problems into manageable pieces
2. **Reusability**: Creating components that can be used multiple times
3. **Maintainability**: Writing code that is easy to understand and modify
4. **Performance**: Ensuring optimal performance and user experience
5. **Accessibility**: Making applications usable by everyone

### Key Technologies

Modern ${module} relies on several key technologies:

- **JavaScript ES6+**: Modern JavaScript features and syntax
- **TypeScript**: Type-safe JavaScript development
- **React/Vue/Angular**: Modern frontend frameworks
- **Web APIs**: Browser APIs for enhanced functionality
- **Build Tools**: Modern build and development tools

## Implementation

### Basic Implementation

\`\`\`javascript
// Basic implementation example
class ${module.replace(/\s+/g, '')} {
  constructor(options = {}) {
    this.options = { ...this.defaultOptions, ...options };
    this.initialize();
  }

  initialize() {
    // Initialize the component
    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    // Setup event listeners
  }

  render() {
    // Render the component
  }
}

// Usage
const instance = new ${module.replace(/\s+/g, '')}({
  // Configuration options
});
\`\`\`

### Advanced Implementation

\`\`\`javascript
// Advanced implementation with error handling
class Advanced${module.replace(/\s+/g, '')} {
  constructor(options = {}) {
    try {
      this.validateOptions(options);
      this.options = { ...this.defaultOptions, ...options };
      this.initialize();
    } catch (error) {
      console.error('Initialization failed:', error);
      throw error;
    }
  }

  validateOptions(options) {
    // Validate configuration options
    if (!options.required) {
      throw new Error('Required option is missing');
    }
  }

  async initialize() {
    try {
      await this.loadDependencies();
      this.setupEventListeners();
      this.render();
    } catch (error) {
      console.error('Initialization failed:', error);
      throw error;
    }
  }

  async loadDependencies() {
    // Load required dependencies
  }
}
\`\`\`

## Best Practices

### Code Organization

1. **Modular Structure**: Organize code into logical modules
2. **Clear Naming**: Use descriptive names for variables and functions
3. **Documentation**: Document complex logic and APIs
4. **Error Handling**: Implement comprehensive error handling
5. **Testing**: Write tests for all functionality

### Performance Optimization

1. **Lazy Loading**: Load resources only when needed
2. **Caching**: Implement appropriate caching strategies
3. **Minification**: Minify code for production
4. **Bundle Splitting**: Split code into smaller chunks
5. **Tree Shaking**: Remove unused code

### Security Considerations

1. **Input Validation**: Validate all user inputs
2. **XSS Prevention**: Prevent cross-site scripting attacks
3. **CSRF Protection**: Implement CSRF protection
4. **Secure Headers**: Use appropriate security headers
5. **Dependency Management**: Keep dependencies updated

## Real-world Examples

### Example 1: Basic Implementation

\`\`\`javascript
// Real-world example
const ${module.replace(/\s+/g, '').toLowerCase()} = {
  init() {
    this.setupEventListeners();
    this.loadData();
  },

  setupEventListeners() {
    document.addEventListener('click', this.handleClick.bind(this));
  },

  async loadData() {
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      this.render(data);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  },

  render(data) {
    // Render the data
  }
};
\`\`\`

### Example 2: Advanced Implementation

\`\`\`javascript
// Advanced real-world example
class Production${module.replace(/\s+/g, '')} {
  constructor(config) {
    this.config = this.validateConfig(config);
    this.state = this.initialState;
    this.subscribers = [];
  }

  validateConfig(config) {
    // Validate configuration
    return config;
  }

  get initialState() {
    return {
      loading: false,
      data: null,
      error: null
    };
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(callback => callback(this.state));
  }

  async updateState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }
}
\`\`\`

## Common Pitfalls

### Performance Issues

1. **Memory Leaks**: Not cleaning up event listeners
2. **Excessive Re-renders**: Causing unnecessary DOM updates
3. **Large Bundles**: Including unnecessary code
4. **Blocking Operations**: Performing heavy operations on main thread
5. **Inefficient Algorithms**: Using inefficient data structures

### Security Vulnerabilities

1. **XSS Attacks**: Not sanitizing user input
2. **CSRF Attacks**: Not implementing CSRF protection
3. **Data Exposure**: Exposing sensitive data
4. **Insecure Dependencies**: Using outdated packages
5. **Missing Validation**: Not validating server responses

### Maintainability Issues

1. **Tight Coupling**: Creating dependencies between modules
2. **Code Duplication**: Repeating code instead of reusing
3. **Poor Documentation**: Not documenting complex logic
4. **Inconsistent Patterns**: Not following established patterns
5. **Technical Debt**: Accumulating quick fixes

## Conclusion

${module} is essential for building modern, scalable frontend applications. By following best practices, implementing proper error handling, and focusing on performance and security, developers can create robust applications that provide excellent user experiences.

Remember to:
- Start with simple implementations and gradually add complexity
- Focus on user experience and performance
- Implement comprehensive testing
- Follow security best practices
- Keep code maintainable and well-documented

The key to success is understanding the fundamentals and applying them consistently throughout your development process.
`;

    const articleFileName = `level-${levelNumber}-${module.toLowerCase().replace(/\s+/g, '-')}.md`;
    fs.writeFileSync(path.join(articlesDir, articleFileName), articleContent);
  });

  // Generate examples directory
  const examplesDir = path.join(__dirname, 'examples', `level-${levelNumber}`);
  if (!fs.existsSync(examplesDir)) {
    fs.mkdirSync(examplesDir, { recursive: true });
  }

  // Generate example HTML file
  const exampleContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Level ${levelNumber}: ${definition.title} - Interactive Examples</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 700;
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .content {
            padding: 40px;
        }

        .example-section {
            margin-bottom: 40px;
            padding: 30px;
            border: 2px solid #f0f0f0;
            border-radius: 12px;
            background: #fafafa;
        }

        .example-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 20px;
        }

        .example-description {
            color: #666;
            margin-bottom: 20px;
            line-height: 1.6;
        }

        .demo-area {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }

        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 1rem;
            font-weight: 600;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 5px;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .code-block {
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            margin: 15px 0;
            overflow-x: auto;
        }

        @media (max-width: 768px) {
            .container {
                margin: 10px;
                border-radius: 10px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .content {
                padding: 20px;
            }
            
            .example-section {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Level ${levelNumber}: ${definition.title}</h1>
            <p>Interactive Examples and Demonstrations</p>
        </div>

        <div class="content">
            <div class="example-section">
                <h2 class="example-title">🎯 ${definition.title} Fundamentals</h2>
                <p class="example-description">
                    ${definition.description}
                </p>
                
                <div class="demo-area">
                    <h3>Interactive Demo</h3>
                    <p>This is a placeholder for interactive examples demonstrating ${definition.title.toLowerCase()} concepts.</p>
                    <button class="btn" onclick="alert('Demo functionality would be implemented here')">Try Demo</button>
                </div>

                <div class="code-block">
// Example implementation
class ${definition.title.replace(/\s+/g, '')} {
  constructor(options = {}) {
    this.options = { ...this.defaultOptions, ...options };
    this.initialize();
  }

  initialize() {
    console.log('${definition.title} initialized');
  }
}

// Usage
const instance = new ${definition.title.replace(/\s+/g, '')}();
                </div>
            </div>

            <div class="example-section">
                <h2 class="example-title">🔧 Advanced Patterns</h2>
                <p class="example-description">
                    Advanced patterns and techniques for ${definition.title.toLowerCase()}.
                </p>
                
                <div class="demo-area">
                    <h3>Advanced Demo</h3>
                    <p>Advanced implementation examples and patterns.</p>
                    <button class="btn" onclick="alert('Advanced demo functionality')">Advanced Demo</button>
                </div>
            </div>

            <div class="example-section">
                <h2 class="example-title">📚 Learning Resources</h2>
                <p class="example-description">
                    Additional resources and references for ${definition.title.toLowerCase()}.
                </p>
                
                <div class="demo-area">
                    <h3>Resources</h3>
                    <ul>
                        <li>Official Documentation</li>
                        <li>Community Resources</li>
                        <li>Best Practices Guides</li>
                        <li>Advanced Tutorials</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Initialize examples
        document.addEventListener('DOMContentLoaded', () => {
            console.log('Level ${levelNumber} examples loaded');
        });
    </script>
</body>
</html>`;

  fs.writeFileSync(path.join(examplesDir, 'index.html'), exampleContent);

  console.log(`✅ Generated Level ${levelNumber}: ${definition.title}`);
}

// Generate all remaining levels
function generateAllLevels() {
  console.log('🚀 Starting generation of remaining levels...\n');

  Object.entries(levelDefinitions).forEach(([levelNumber, definition]) => {
    try {
      generateLevelContent(parseInt(levelNumber), definition);
    } catch (error) {
      console.error(`❌ Error generating Level ${levelNumber}:`, error.message);
    }
  });

  console.log('\n🎉 Level generation completed!');
  console.log(`Generated ${Object.keys(levelDefinitions).length} levels`);
}

// Run the script
if (require.main === module) {
  generateAllLevels();
}

module.exports = { generateLevelContent, generateAllLevels };
