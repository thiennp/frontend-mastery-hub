# Tooling & Environment Setup: Building Your Development Workflow

## Introduction

A well-configured development environment is crucial for productive web development. This guide covers essential tools, setup procedures, and best practices that will streamline your workflow and help you write better code.

## Development Environment Overview

### What You'll Need
- **Code Editor/IDE**: For writing and editing code
- **Version Control**: To track changes and collaborate
- **Package Manager**: To manage dependencies
- **Build Tools**: To optimize and deploy your code
- **Browser Tools**: For debugging and testing
- **Terminal/Command Line**: For running commands and scripts

## Code Editors and IDEs

### Visual Studio Code (Recommended for Beginners)
VS Code is a free, powerful editor with excellent web development features.

#### Installation
1. Download from [code.visualstudio.com](https://code.visualstudio.com/)
2. Install following your OS instructions
3. Launch and install essential extensions

#### Essential Extensions
```json
{
    "recommendations": [
        "ms-vscode.vscode-html-css-support",
        "bradlc.vscode-tailwindcss",
        "esbenp.prettier-vscode",
        "ms-vscode.vscode-eslint",
        "ritwickdey.liveserver",
        "ms-vscode.vscode-json",
        "ms-vscode.vscode-css-formatter",
        "formulahendry.auto-rename-tag",
        "christian-kohler.path-intellisense",
        "ms-vscode.vscode-emmet"
    ]
}
```

#### VS Code Settings
```json
{
    "editor.formatOnSave": true,
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.rulers": [80, 120],
    "files.autoSave": "afterDelay",
    "emmet.includeLanguages": {
        "javascript": "javascriptreact"
    },
    "workbench.colorTheme": "Default Dark+",
    "editor.fontFamily": "'Fira Code', 'Consolas', monospace",
    "editor.fontLigatures": true
}
```

### Alternative Editors
- **Sublime Text**: Fast and lightweight
- **Atom**: Hackable text editor
- **WebStorm**: Full-featured IDE (paid)
- **Vim/Emacs**: For advanced users

## Version Control with Git

### What is Git?
Git is a distributed version control system that tracks changes in your code, enables collaboration, and provides a safety net for your work.

### Installation
```bash
# macOS (using Homebrew)
brew install git

# Windows
# Download from https://git-scm.com/download/win

# Linux (Ubuntu/Debian)
sudo apt-get install git

# Linux (CentOS/RHEL)
sudo yum install git
```

### Initial Setup
```bash
# Configure your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Configure line endings
git config --global core.autocrlf input  # macOS/Linux
git config --global core.autocrlf true   # Windows
```

### Basic Git Workflow
```bash
# Initialize a new repository
git init

# Check repository status
git status

# Add files to staging area
git add filename.html
git add .  # Add all files

# Commit changes
git commit -m "Initial commit: Add HTML structure"

# View commit history
git log --oneline

# Create and switch to a new branch
git checkout -b feature-name

# Switch between branches
git checkout main
git checkout feature-name

# Merge changes
git checkout main
git merge feature-name

# Delete branch after merging
git branch -d feature-name
```

### GitHub Integration
```bash
# Clone a remote repository
git clone https://github.com/username/repository.git

# Add remote origin
git remote add origin https://github.com/username/repository.git

# Push changes to remote
git push -u origin main

# Pull latest changes
git pull origin main

# Fork and clone workflow
git clone https://github.com/your-username/forked-repo.git
git remote add upstream https://github.com/original-owner/original-repo.git
git fetch upstream
git merge upstream/main
```

### Git Best Practices
```bash
# Write meaningful commit messages
git commit -m "feat: Add user authentication system

- Implement login/logout functionality
- Add password validation
- Include error handling for failed attempts"

# Use conventional commit format
# feat: new feature
# fix: bug fix
# docs: documentation changes
# style: formatting changes
# refactor: code refactoring
# test: adding tests
# chore: maintenance tasks

# Keep commits atomic and focused
# One logical change per commit
```

## Package Managers

### Node.js and npm
Node.js is a JavaScript runtime, and npm is its package manager.

#### Installation
```bash
# macOS (using Homebrew)
brew install node

# Windows
# Download from https://nodejs.org/

# Linux (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Verify Installation
```bash
node --version  # Should show version like v18.17.0
npm --version   # Should show version like 9.6.7
```

#### Basic npm Commands
```bash
# Initialize a new project
npm init
npm init -y  # Use all defaults

# Install packages
npm install package-name
npm install package-name --save-dev  # Development dependency
npm install -g package-name          # Global installation

# Remove packages
npm uninstall package-name

# Update packages
npm update

# Run scripts
npm run script-name
npm start
npm test
npm build
```

#### Package.json Structure
```json
{
  "name": "my-web-project",
  "version": "1.0.0",
  "description": "A web development project",
  "main": "index.js",
  "scripts": {
    "start": "live-server",
    "build": "webpack --mode production",
    "dev": "webpack --mode development --watch",
    "test": "jest",
    "lint": "eslint src/**/*.js"
  },
  "dependencies": {
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "eslint": "^8.45.0",
    "prettier": "^3.0.0",
    "webpack": "^5.88.0"
  },
  "keywords": ["web", "development", "html", "css", "javascript"],
  "author": "Your Name",
  "license": "MIT"
}
```

### Alternative Package Managers
- **Yarn**: Faster alternative to npm
- **pnpm**: Efficient package manager
- **Bun**: All-in-one JavaScript runtime and package manager

## Build Tools and Task Runners

### Webpack
Webpack is a module bundler that processes and optimizes your code.

#### Basic Setup
```bash
npm install webpack webpack-cli --save-dev
```

#### Webpack Configuration
```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: true,
  },
};
```

### Alternative Build Tools
- **Vite**: Fast build tool with hot module replacement
- **Parcel**: Zero-configuration bundler
- **Rollup**: Module bundler for libraries
- **Gulp**: Task runner for automation

## Development Server

### Live Server
A simple development server with live reload functionality.

#### Installation
```bash
npm install -g live-server
```

#### Usage
```bash
# Start server in current directory
live-server

# Start with specific port
live-server --port=8080

# Start with specific host
live-server --host=0.0.0.0
```

### VS Code Live Server Extension
1. Install "Live Server" extension
2. Right-click on HTML file
3. Select "Open with Live Server"

## Code Quality Tools

### ESLint
ESLint is a JavaScript linter that helps identify and fix code problems.

#### Installation
```bash
npm install eslint --save-dev
npx eslint --init
```

#### Configuration
```json
// .eslintrc.json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-unused-vars": "warn",
    "no-console": "warn"
  }
}
```

### Prettier
Prettier is a code formatter that enforces consistent code style.

#### Installation
```bash
npm install prettier --save-dev
```

#### Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

#### Integration with ESLint
```bash
npm install eslint-config-prettier eslint-plugin-prettier --save-dev
```

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "prettier"
  ],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

## Browser Developer Tools

### Chrome DevTools
Chrome's built-in developer tools are essential for debugging and development.

#### Key Panels
- **Elements**: Inspect and modify HTML/CSS
- **Console**: JavaScript debugging and logging
- **Sources**: Debug JavaScript code
- **Network**: Monitor HTTP requests
- **Performance**: Analyze page performance
- **Application**: Manage storage and service workers

#### Console Commands
```javascript
// Basic logging
console.log("Hello World");
console.error("Error message");
console.warn("Warning message");
console.info("Info message");

// Table display
console.table([
  {name: "John", age: 30},
  {name: "Jane", age: 25}
]);

// Grouping
console.group("User Details");
console.log("Name: John");
console.log("Age: 30");
console.groupEnd();

// Timing
console.time("Operation");
// ... perform operation
console.timeEnd("Operation");

// Stack trace
console.trace("Function call trace");
```

### Firefox Developer Tools
Firefox has similar tools with some unique features.

### Safari Web Inspector
Safari's developer tools for macOS users.

## Terminal and Command Line

### macOS/Linux Terminal
```bash
# Navigation
cd directory-name          # Change directory
cd ..                      # Go up one level
cd ~                       # Go to home directory
pwd                        # Print working directory
ls                         # List files
ls -la                     # List all files with details

# File operations
mkdir directory-name       # Create directory
touch filename.txt         # Create file
cp source dest            # Copy file
mv source dest            # Move/rename file
rm filename               # Remove file
rm -rf directory          # Remove directory and contents

# Text editing
nano filename             # Simple text editor
vim filename              # Advanced text editor
cat filename              # Display file contents
less filename             # View file with pagination

# Process management
ps aux                    # List all processes
kill process-id           # Kill process
top                       # Monitor system resources
```

### Windows Command Prompt/PowerShell
```cmd
# Navigation
cd directory-name
cd ..
cd %USERPROFILE%
dir
dir /a

# File operations
mkdir directory-name
type nul > filename.txt
copy source dest
move source dest
del filename
rmdir /s directory

# PowerShell specific
Get-ChildItem
New-Item -ItemType Directory -Name "directory-name"
Remove-Item filename
```

## Project Structure

### Recommended Directory Structure
```
project-name/
├── src/
│   ├── html/
│   │   └── index.html
│   ├── css/
│   │   ├── main.css
│   │   └── components/
│   ├── js/
│   │   ├── main.js
│   │   └── modules/
│   └── assets/
│       ├── images/
│       ├── fonts/
│       └── icons/
├── dist/
├── node_modules/
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── package.json
├── README.md
└── webpack.config.js
```

### .gitignore File
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
*.tgz
*.tar.gz

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity
```

## Environment Variables

### .env Files
```bash
# .env
NODE_ENV=development
PORT=3000
API_URL=http://localhost:8000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### Loading Environment Variables
```bash
# Install dotenv
npm install dotenv

# In your JavaScript file
require('dotenv').config();

console.log(process.env.NODE_ENV);
console.log(process.env.PORT);
```

## Testing Tools

### Jest
Jest is a JavaScript testing framework.

#### Installation
```bash
npm install jest --save-dev
```

#### Basic Test
```javascript
// math.js
function add(a, b) {
  return a + b;
}

module.exports = { add };

// math.test.js
const { add } = require('./math');

test('adds 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});
```

#### Running Tests
```bash
npm test
npm test -- --watch
npm test -- --coverage
```

### Alternative Testing Tools
- **Mocha**: Flexible testing framework
- **Cypress**: End-to-end testing
- **Playwright**: Cross-browser testing

## Deployment Tools

### Netlify
Free hosting for static websites.

#### Setup
1. Connect your GitHub repository
2. Configure build settings
3. Deploy automatically on push

#### Configuration
```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel
Another excellent option for static site hosting.

### GitHub Pages
Free hosting for GitHub repositories.

## Performance Tools

### Lighthouse
Chrome's built-in performance auditing tool.

### WebPageTest
Online performance testing service.

### Bundle Analyzer
```bash
npm install webpack-bundle-analyzer --save-dev
```

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

## Security Tools

### npm audit
```bash
npm audit
npm audit fix
```

### Snyk
Security vulnerability scanning.

### OWASP ZAP
Web application security testing.

## Continuous Integration/Continuous Deployment (CI/CD)

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build project
      run: npm run build
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './dist'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
```

## Best Practices

### Code Organization
- Use consistent file naming conventions
- Organize code into logical modules
- Separate concerns (HTML, CSS, JavaScript)
- Use meaningful directory names

### Version Control
- Commit frequently with meaningful messages
- Use branches for features and fixes
- Review code before merging
- Keep commits atomic and focused

### Performance
- Optimize images and assets
- Minimize HTTP requests
- Use efficient CSS selectors
- Bundle and minify code

### Security
- Keep dependencies updated
- Use HTTPS in production
- Validate user input
- Follow OWASP guidelines

## Troubleshooting Common Issues

### Node.js/npm Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Update npm
npm install -g npm@latest
```

### Git Issues
```bash
# Reset to last commit
git reset --hard HEAD

# Undo last commit
git reset --soft HEAD~1

# Fix merge conflicts
git status
# Edit conflicted files
git add .
git commit
```

### Build Issues
```bash
# Check for syntax errors
npm run lint

# Clear build cache
rm -rf dist/
npm run build

# Check webpack configuration
npx webpack --config webpack.config.js
```

## Conclusion

Setting up a proper development environment is an investment that pays dividends in productivity and code quality. The tools and practices covered in this guide provide a solid foundation for modern web development.

## Key Takeaways

- Choose tools that fit your workflow and skill level
- Version control is essential for collaboration and safety
- Automation tools save time and reduce errors
- Code quality tools help maintain standards
- Performance and security should be considered from the start
- Continuous learning and tool updates are important

## Next Steps

- Set up your development environment
- Practice using the tools covered
- Explore additional tools and extensions
- Build projects to test your setup
- Stay updated with tool developments
- Share your setup with the community
