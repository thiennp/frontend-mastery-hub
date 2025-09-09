# Developer Experience & Tooling

## Overview

Developer experience (DX) is crucial for productivity and code quality. Modern development tooling focuses on providing fast feedback, intelligent assistance, and seamless workflows that help developers build better applications more efficiently.

## Development Server Features

### Hot Module Replacement (HMR)

HMR allows updating modules without losing application state, providing instant feedback during development.

#### Webpack HMR

```javascript
// webpack.config.js
module.exports = {
  devServer: {
    hot: true,
    liveReload: false
  }
};

// HMR API usage
if (module.hot) {
  module.hot.accept('./component.js', () => {
    // Handle component updates
    console.log('Component updated');
  });
  
  module.hot.accept('./reducer.js', () => {
    // Handle reducer updates
    const newReducer = require('./reducer.js').default;
    store.replaceReducer(newReducer);
  });
}
```

#### Vite HMR

```javascript
// vite.config.js
export default defineConfig({
  server: {
    hmr: {
      overlay: true
    }
  }
});

// HMR API usage
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // Handle updates
    console.log('Module updated');
  });
  
  import.meta.hot.accept('./component.js', (newComponent) => {
    // Handle specific component updates
    updateComponent(newComponent);
  });
}
```

### Fast Refresh

Fast Refresh provides even better HMR for React components, preserving state and avoiding full page reloads.

```javascript
// React Fast Refresh
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default Counter;
```

### Development Server Configuration

#### Webpack Dev Server

```javascript
// webpack.config.js
module.exports = {
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'public')
    },
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    }
  }
};
```

#### Vite Dev Server

```javascript
// vite.config.js
export default defineConfig({
  server: {
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});
```

## Code Quality Tools

### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'react-hooks'
  ],
  rules: {
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
```

### Prettier Configuration

```javascript
// .prettierrc.js
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'lf'
};
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## Debugging Tools

### Source Maps

```javascript
// webpack.config.js
module.exports = {
  devtool: 'eval-cheap-module-source-map', // Development
  // devtool: 'source-map', // Production
};
```

### Browser DevTools Integration

```javascript
// React DevTools
import React from 'react';
import { createRoot } from 'react-dom/client';

// Redux DevTools
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
);
```

### VS Code Debugging

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true
    }
  ]
}
```

## Testing Integration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Testing Library Setup

```javascript
// src/setupTests.ts
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-testid' });
```

### Cypress Configuration

```javascript
// cypress.config.js
module.exports = {
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720
  }
};
```

## Build Automation

### NPM Scripts

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write src/**/*.{ts,tsx,js,jsx}",
    "type-check": "tsc --noEmit"
  }
}
```

### Husky Git Hooks

```javascript
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm run type-check
npm run test
```

### Lint-Staged

```javascript
// .lintstagedrc.js
module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write'
  ],
  '*.{json,md}': [
    'prettier --write'
  ]
};
```

## IDE Integration

### VS Code Extensions

```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json"
  ]
}
```

### VS Code Settings

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  }
}
```

## Performance Monitoring

### Webpack Bundle Analyzer

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    })
  ]
};
```

### Lighthouse CI

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      startServerCommand: 'npm run start'
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }]
      }
    }
  }
};
```

## Development Workflow

### Pre-commit Hooks

```javascript
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### Pre-push Hooks

```javascript
// .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run test
npm run build
```

### CI/CD Integration

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build
```

## Error Handling and Reporting

### Error Boundaries

```javascript
// ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Error Reporting

```javascript
// errorReporting.js
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV
});

export const captureException = (error, context) => {
  Sentry.captureException(error, { extra: context });
};
```

## Development Environment Setup

### Docker Development

```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

## Best Practices

### 1. Fast Feedback Loops
- Use HMR for instant updates
- Implement fast test runners
- Set up pre-commit hooks for quick feedback

### 2. Consistent Code Quality
- Use ESLint and Prettier
- Set up automated formatting
- Implement code review processes

### 3. Comprehensive Testing
- Unit tests for business logic
- Integration tests for components
- E2E tests for critical user flows

### 4. Performance Monitoring
- Bundle size monitoring
- Performance budgets
- Real-time performance tracking

### 5. Developer Experience
- Clear documentation
- Consistent tooling
- Easy setup and onboarding

## Common Issues and Solutions

### 1. Slow Build Times
- Use build caching
- Implement parallel processing
- Optimize loader configurations

### 2. HMR Not Working
- Check HMR configuration
- Verify module boundaries
- Use proper HMR APIs

### 3. TypeScript Errors
- Configure strict mode gradually
- Use proper type definitions
- Set up proper module resolution

### 4. Test Failures
- Use proper test utilities
- Mock external dependencies
- Set up proper test environment

## Conclusion

Developer experience is about creating tools and workflows that help developers be more productive and write better code. By implementing the right tools and practices, you can create an environment that supports rapid development while maintaining high code quality.

The key is to start with the basics - fast feedback, good tooling, and clear processes - and then iterate based on your team's specific needs and challenges.

## Next Steps

1. **Set up core tooling** - ESLint, Prettier, TypeScript
2. **Implement testing** - Unit, integration, and E2E tests
3. **Configure build tools** - Fast builds and HMR
4. **Set up automation** - Pre-commit hooks and CI/CD
5. **Monitor and iterate** - Track metrics and improve workflows

Remember: Good developer experience is an investment that pays dividends in productivity, code quality, and team satisfaction.
