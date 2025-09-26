// Script to add missing levels to index.html
const fs = require('fs');

const levelsToAdd = [
    {
        number: 30,
        title: "Microservices & API Architecture",
        description: "Microservices Design Patterns, API Gateway Implementation, Service Discovery & Load Balancing, Event-Driven Architecture, Distributed Systems Patterns"
    },
    {
        number: 31,
        title: "DevOps & CI/CD",
        description: "CI/CD Pipeline Configuration, Infrastructure as Code, Container Orchestration, Monitoring & Logging, DevOps Automation"
    },
    {
        number: 32,
        title: "Advanced Testing",
        description: "E2E Testing with Cypress, Performance Testing, Visual Testing, Test Automation, Testing Strategies"
    },
    {
        number: 33,
        title: "Security & Authentication",
        description: "OAuth 2.0 Implementation, JWT Token Management, Password Security, Security Headers, Penetration Testing"
    },
    {
        number: 34,
        title: "Performance Optimization",
        description: "Bundle Optimization, Image Optimization, Caching Strategies, Performance Monitoring, Advanced Optimization"
    },
    {
        number: 35,
        title: "Cloud Computing",
        description: "AWS Fundamentals, Azure Services, Google Cloud Platform, Serverless Architecture, Cloud Deployment"
    },
    {
        number: 36,
        title: "Mobile Development",
        description: "React Native, Flutter, Progressive Web Apps, Mobile Performance, Cross-platform Development"
    },
    {
        number: 37,
        title: "AI/ML Integration",
        description: "Machine Learning APIs, TensorFlow.js, Computer Vision, Natural Language Processing, AI-powered Features"
    },
    {
        number: 38,
        title: "WebAssembly",
        description: "WebAssembly Fundamentals, Performance Optimization, System Integration, Multi-threading, Advanced Features"
    },
    {
        number: 39,
        title: "Blockchain & Web3",
        description: "Smart Contracts, DeFi Integration, NFT Marketplace, Web3 Integration, Cryptocurrency Trading"
    },
    {
        number: 40,
        title: "Advanced Data Visualization",
        description: "D3.js Mastery, Interactive Charts, Real-time Data, Custom Visualizations, Performance Optimization"
    },
    {
        number: 41,
        title: "Edge Computing",
        description: "Edge Computing Fundamentals, IoT Integration, Real-time Processing, Edge AI, Performance Optimization"
    },
    {
        number: 42,
        title: "Quantum Computing",
        description: "Quantum Computing Fundamentals, Quantum Algorithms, Quantum Machine Learning, Quantum Cryptography, Quantum Simulation"
    },
    {
        number: 44,
        title: "Advanced AI Integration",
        description: "Advanced AI Model Integration, Real-time AI Processing, AI-Powered Personalization, AI Content Generation, AI Ethics & Bias Detection"
    },
    {
        number: 45,
        title: "Advanced Mobile Development",
        description: "Advanced React Native Architecture, Cross-platform State Management, Mobile Performance Optimization, Native Module Integration, Mobile Testing & CI/CD"
    },
    {
        number: 46,
        title: "Advanced Web Development",
        description: "Modern Web Standards & APIs, Progressive Web App Development, Advanced Web Performance, Advanced CSS & Layout Techniques, Web Security & Best Practices"
    },
    {
        number: 47,
        title: "Advanced Backend Development",
        description: "Microservices Architecture, Database Optimization, API Design, Serverless Computing, Advanced Backend Patterns"
    }
];

// Read the current index.html
let html = fs.readFileSync('index.html', 'utf8');

// Find the insertion point (before the badges section)
const insertionPoint = html.indexOf('        <section id="badges" class="badges-section">');

// Generate HTML for all missing levels
let levelsHTML = '';
levelsToAdd.forEach(level => {
    levelsHTML += `
                    <div class="level-card">
                        <div class="level-number">${level.number}</div>
                        <h3>${level.title}</h3>
                        <p>${level.description}</p>
                        <div class="level-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" id="level${level.number}Progress" style="width: 100%"></div>
                            </div>
                            <span class="progress-text" id="level${level.number}Status">Completed! 🎉</span>
                        </div>
                        <a href="playgrounds/level-${level.number}/index.html" class="level-button completed">Level Completed ✓</a>
                    </div>
`;
});

// Insert the levels HTML
const newHTML = html.slice(0, insertionPoint) + levelsHTML + html.slice(insertionPoint);

// Write the updated HTML
fs.writeFileSync('index.html', newHTML);

console.log('Added all missing levels to index.html');
