#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Comprehensive level definitions for all remaining levels
const allLevels = {
  // Levels 21-30: Vue.js Ecosystem
  21: "Vue.js Fundamentals",
  22: "Vue.js Components & Composition",
  23: "Vue.js State Management",
  24: "Vue.js Routing & Navigation",
  25: "Vue.js Advanced Patterns",
  26: "Vue.js Testing",
  27: "Vue.js Performance",
  28: "Vue.js Ecosystem Tools",
  29: "Vue.js Best Practices",
  30: "Vue.js Production Deployment",

  // Levels 31-40: Angular Framework
  31: "Angular Fundamentals",
  32: "Angular Components & Services",
  33: "Angular Routing & Navigation",
  34: "Angular State Management",
  35: "Angular Forms & Validation",
  36: "Angular HTTP & APIs",
  37: "Angular Testing",
  38: "Angular Performance",
  39: "Angular Advanced Features",
  40: "Angular Production Deployment",

  // Levels 41-50: Modern Frameworks
  41: "Svelte Fundamentals",
  42: "SvelteKit Framework",
  43: "Solid.js Framework",
  44: "Alpine.js Framework",
  45: "Lit Web Components",
  46: "Stencil Framework",
  47: "Qwik Framework",
  48: "Framework Comparison",
  49: "Framework Migration",
  50: "Framework Selection",

  // Levels 51-60: Advanced Frontend Concepts
  51: "Advanced JavaScript Patterns",
  52: "Functional Programming",
  53: "Reactive Programming",
  54: "Event-Driven Architecture",
  55: "State Management Patterns",
  56: "Component Architecture",
  57: "Design Patterns",
  58: "Architecture Patterns",
  59: "Code Organization",
  60: "Refactoring Techniques",

  // Levels 61-70: Backend Integration
  61: "RESTful APIs",
  62: "GraphQL Integration",
  63: "WebSocket Communication",
  64: "Server-Sent Events",
  65: "API Design",
  66: "API Testing",
  67: "API Documentation",
  68: "API Security",
  69: "API Performance",
  70: "API Monitoring",

  // Levels 71-80: Database & Data Management
  71: "Database Fundamentals",
  72: "SQL Databases",
  73: "NoSQL Databases",
  74: "Database Design",
  75: "Data Modeling",
  76: "Data Migration",
  77: "Data Validation",
  78: "Data Caching",
  79: "Data Synchronization",
  80: "Data Analytics",

  // Levels 81-90: DevOps & Deployment
  81: "Version Control",
  82: "CI/CD Pipelines",
  83: "Docker & Containers",
  84: "Cloud Deployment",
  85: "Server Configuration",
  86: "Monitoring & Logging",
  87: "Error Tracking",
  88: "Performance Monitoring",
  89: "Security Scanning",
  90: "Backup & Recovery",

  // Levels 91-100: Testing & Quality
  91: "Testing Fundamentals",
  92: "Unit Testing",
  93: "Integration Testing",
  94: "End-to-End Testing",
  95: "Visual Testing",
  96: "Performance Testing",
  97: "Security Testing",
  98: "Accessibility Testing",
  99: "Test Automation",
  100: "Quality Assurance",

  // Levels 101-110: Advanced JavaScript
  101: "ES6+ Features",
  102: "Async Programming",
  103: "Modules & Imports",
  104: "Generators & Iterators",
  105: "Proxies & Reflection",
  106: "Symbols & Iterators",
  107: "Memory Management",
  108: "Performance Optimization",
  109: "Debugging Techniques",
  110: "JavaScript Engines",

  // Levels 111-120: TypeScript
  111: "TypeScript Fundamentals",
  112: "Type System",
  113: "Advanced Types",
  114: "Generics",
  115: "Decorators",
  116: "Modules & Namespaces",
  117: "Compiler Options",
  118: "TypeScript with Frameworks",
  119: "TypeScript Testing",
  120: "TypeScript Best Practices",

  // Levels 121-130: CSS Advanced
  121: "CSS Grid Advanced",
  122: "CSS Flexbox Advanced",
  123: "CSS Custom Properties",
  124: "CSS Animations",
  125: "CSS Transitions",
  126: "CSS Transforms",
  127: "CSS Filters",
  128: "CSS Masking",
  129: "CSS Clipping",
  130: "CSS Houdini",

  // Levels 131-140: Build Tools
  131: "Webpack Advanced",
  132: "Vite Build Tool",
  133: "Rollup Bundler",
  134: "Parcel Bundler",
  135: "ESBuild Tool",
  136: "SWC Compiler",
  137: "Babel Configuration",
  138: "PostCSS Processing",
  139: "Asset Optimization",
  140: "Build Optimization",

  // Levels 141-150: Performance
  141: "Core Web Vitals",
  142: "Performance Metrics",
  143: "Performance Budgets",
  144: "Code Splitting",
  145: "Lazy Loading",
  146: "Caching Strategies",
  147: "CDN Optimization",
  148: "Image Optimization",
  149: "Font Optimization",
  150: "Performance Monitoring",

  // Levels 151-160: Security
  151: "Web Security Fundamentals",
  152: "Authentication & Authorization",
  153: "Data Protection",
  154: "Input Validation",
  155: "Output Encoding",
  156: "Security Headers",
  157: "Content Security Policy",
  158: "HTTPS & SSL/TLS",
  159: "Security Testing",
  160: "Security Monitoring",

  // Levels 161-170: Mobile & Responsive
  161: "Responsive Design",
  162: "Mobile-First Development",
  163: "Touch Interactions",
  164: "Mobile Performance",
  165: "Progressive Enhancement",
  166: "Adaptive Design",
  167: "Mobile Testing",
  168: "Cross-Platform Development",
  169: "Native App Integration",
  170: "Mobile Optimization",

  // Levels 171-180: Advanced Architecture
  171: "Micro-frontends",
  172: "Monorepo Architecture",
  173: "Component Libraries",
  174: "Design Systems",
  175: "Plugin Architecture",
  176: "Event Architecture",
  177: "State Architecture",
  178: "Data Architecture",
  179: "API Architecture",
  180: "System Architecture",

  // Levels 181-190: Emerging Technologies
  181: "WebAssembly",
  182: "Web Workers",
  183: "Service Workers",
  184: "Web APIs",
  185: "Browser APIs",
  186: "AI/ML Integration",
  187: "Blockchain Integration",
  188: "IoT Integration",
  189: "AR/VR Integration",
  190: "Future Technologies",

  // Levels 191-200: Mastery & Leadership
  191: "Technical Leadership",
  192: "Team Management",
  193: "Project Planning",
  194: "Code Review",
  195: "Mentoring",
  196: "Technical Writing",
  197: "Public Speaking",
  198: "Open Source",
  199: "Career Development",
  200: "Industry Mastery"
};

// Generate content for a single level
function generateLevel(levelNumber, title) {
  const levelDir = path.join(__dirname, 'levels', levelNumber.toString());
  
  // Create level directory
  if (!fs.existsSync(levelDir)) {
    fs.mkdirSync(levelDir, { recursive: true });
  }

  // Generate README.md
  const readmeContent = `# Level ${levelNumber}: ${title}

## Overview
This level focuses on ${title.toLowerCase()} and provides comprehensive learning materials, examples, and projects.

## Learning Objectives
By the end of this level, you will:
- Understand the core concepts of ${title.toLowerCase()}
- Master practical implementation techniques
- Build real-world projects
- Apply best practices and patterns

## Prerequisites
- Completion of previous levels
- Basic understanding of web development
- Familiarity with JavaScript and modern frameworks

## Modules
1. **Fundamentals**: Core concepts and principles
2. **Implementation**: Practical coding examples
3. **Advanced Patterns**: Complex scenarios and optimizations
4. **Best Practices**: Industry standards and recommendations
5. **Real-world Applications**: Project-based learning

## Mini-Project
Build a comprehensive project that demonstrates mastery of ${title.toLowerCase()}.

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

  // Generate articles directory
  const articlesDir = path.join(__dirname, 'articles');
  if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true });
  }

  // Generate 3 articles per level
  const articles = [
    `${title} Fundamentals`,
    `Advanced ${title} Patterns`,
    `${title} Best Practices`
  ];

  articles.forEach((articleTitle, index) => {
    const articleContent = `# ${articleTitle}

## Table of Contents
1. [Introduction](#introduction)
2. [Core Concepts](#core-concepts)
3. [Implementation](#implementation)
4. [Best Practices](#best-practices)
5. [Real-world Examples](#real-world-examples)
6. [Common Pitfalls](#common-pitfalls)
7. [Conclusion](#conclusion)

## Introduction

${articleTitle} is a fundamental aspect of modern frontend development that enables developers to build robust, maintainable, and scalable applications.

### Why ${articleTitle} Matters

- **Quality**: Ensures high-quality, reliable applications
- **Maintainability**: Makes code easier to maintain and update
- **Scalability**: Enables applications to grow and evolve
- **User Experience**: Provides better experiences for end users
- **Team Collaboration**: Improves team productivity and collaboration

## Core Concepts

### Fundamental Principles

The core principles of ${articleTitle} include:

1. **Modularity**: Breaking down complex problems into manageable pieces
2. **Reusability**: Creating components that can be used multiple times
3. **Maintainability**: Writing code that is easy to understand and modify
4. **Performance**: Ensuring optimal performance and user experience
5. **Accessibility**: Making applications usable by everyone

### Key Technologies

Modern ${articleTitle} relies on several key technologies:

- **JavaScript ES6+**: Modern JavaScript features and syntax
- **TypeScript**: Type-safe JavaScript development
- **React/Vue/Angular**: Modern frontend frameworks
- **Web APIs**: Browser APIs for enhanced functionality
- **Build Tools**: Modern build and development tools

## Implementation

### Basic Implementation

\`\`\`javascript
// Basic implementation example
class ${articleTitle.replace(/\s+/g, '')} {
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
const instance = new ${articleTitle.replace(/\s+/g, '')}({
  // Configuration options
});
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

## Real-world Examples

### Example 1: Basic Implementation

\`\`\`javascript
// Real-world example
const ${articleTitle.replace(/\s+/g, '').toLowerCase()} = {
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

## Conclusion

${articleTitle} is essential for building modern, scalable frontend applications. By following best practices, implementing proper error handling, and focusing on performance and security, developers can create robust applications that provide excellent user experiences.

Remember to:
- Start with simple implementations and gradually add complexity
- Focus on user experience and performance
- Implement comprehensive testing
- Follow security best practices
- Keep code maintainable and well-documented

The key to success is understanding the fundamentals and applying them consistently throughout your development process.
`;

    const articleFileName = `level-${levelNumber}-${articleTitle.toLowerCase().replace(/\s+/g, '-')}.md`;
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
    <title>Level ${levelNumber}: ${title} - Interactive Examples</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { font-size: 2.5rem; margin-bottom: 10px; font-weight: 700; }
        .header p { font-size: 1.1rem; opacity: 0.9; }
        .content { padding: 40px; }
        .example-section { margin-bottom: 40px; padding: 30px; border: 2px solid #f0f0f0; border-radius: 12px; background: #fafafa; }
        .example-title { font-size: 1.5rem; font-weight: 600; color: #333; margin-bottom: 20px; }
        .example-description { color: #666; margin-bottom: 20px; line-height: 1.6; }
        .demo-area { background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; font-size: 1rem; font-weight: 600; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; margin: 5px; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3); }
        .code-block { background: #1e1e1e; color: #d4d4d4; padding: 20px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 0.9rem; margin: 15px 0; overflow-x: auto; }
        @media (max-width: 768px) { .container { margin: 10px; border-radius: 10px; } .header h1 { font-size: 2rem; } .content { padding: 20px; } .example-section { padding: 20px; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Level ${levelNumber}: ${title}</h1>
            <p>Interactive Examples and Demonstrations</p>
        </div>
        <div class="content">
            <div class="example-section">
                <h2 class="example-title">🎯 ${title} Fundamentals</h2>
                <p class="example-description">Learn the core concepts and principles of ${title.toLowerCase()}.</p>
                <div class="demo-area">
                    <h3>Interactive Demo</h3>
                    <p>This is a placeholder for interactive examples demonstrating ${title.toLowerCase()} concepts.</p>
                    <button class="btn" onclick="alert('Demo functionality would be implemented here')">Try Demo</button>
                </div>
                <div class="code-block">
// Example implementation
class ${title.replace(/\s+/g, '')} {
  constructor(options = {}) {
    this.options = { ...this.defaultOptions, ...options };
    this.initialize();
  }
  initialize() {
    console.log('${title} initialized');
  }
}
const instance = new ${title.replace(/\s+/g, '')}();
                </div>
            </div>
            <div class="example-section">
                <h2 class="example-title">🔧 Advanced Patterns</h2>
                <p class="example-description">Advanced patterns and techniques for ${title.toLowerCase()}.</p>
                <div class="demo-area">
                    <h3>Advanced Demo</h3>
                    <p>Advanced implementation examples and patterns.</p>
                    <button class="btn" onclick="alert('Advanced demo functionality')">Advanced Demo</button>
                </div>
            </div>
        </div>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            console.log('Level ${levelNumber} examples loaded');
        });
    </script>
</body>
</html>`;

  fs.writeFileSync(path.join(examplesDir, 'index.html'), exampleContent);

  console.log(`✅ Generated Level ${levelNumber}: ${title}`);
}

// Generate all levels
function generateAllLevels() {
  console.log('🚀 Starting generation of all remaining levels...\n');

  let count = 0;
  Object.entries(allLevels).forEach(([levelNumber, title]) => {
    try {
      generateLevel(parseInt(levelNumber), title);
      count++;
    } catch (error) {
      console.error(`❌ Error generating Level ${levelNumber}:`, error.message);
    }
  });

  console.log(`\n🎉 Level generation completed!`);
  console.log(`Generated ${count} levels (21-200)`);
}

// Run the script
if (require.main === module) {
  generateAllLevels();
}

module.exports = { generateLevel, generateAllLevels };
