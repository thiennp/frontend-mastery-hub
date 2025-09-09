# React Best Practices & Architecture

## Overview

Building scalable, maintainable React applications requires following established best practices and architectural patterns. This article covers essential practices for component design, state management, performance optimization, and code organization.

## Component Design Principles

### 1. Single Responsibility Principle
Each component should have one reason to change and one responsibility.

```javascript
// ❌ Bad: Multiple responsibilities
function UserDashboard({ user }) {
  const [todos, setTodos] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <TodoList todos={todos} />
      <NotificationList notifications={notifications} />
      <UserSettings user={user} />
    </div>
  );
}

// ✅ Good: Single responsibility
function UserDashboard({ user }) {
  return (
    <div>
      <UserHeader user={user} />
      <DashboardContent user={user} />
    </div>
  );
}

function DashboardContent({ user }) {
  return (
    <div>
      <TodoSection userId={user.id} />
      <NotificationSection userId={user.id} />
      <SettingsSection user={user} />
    </div>
  );
}
```

### 2. Composition Over Inheritance
Use composition to build complex UIs from simple components.

```javascript
// ✅ Good: Composition
function Card({ children, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ children }) {
  return <div className="card-header">{children}</div>;
}

function CardBody({ children }) {
  return <div className="card-body">{children}</div>;
}

function CardFooter({ children }) {
  return <div className="card-footer">{children}</div>;
}

// Usage
function UserCard({ user }) {
  return (
    <Card className="user-card">
      <CardHeader>
        <h3>{user.name}</h3>
      </CardHeader>
      <CardBody>
        <p>{user.email}</p>
        <p>{user.bio}</p>
      </CardBody>
      <CardFooter>
        <button>Edit Profile</button>
      </CardFooter>
    </Card>
  );
}
```

### 3. Props Interface Design
Design clear, consistent prop interfaces.

```javascript
// ✅ Good: Clear prop interface
function Button({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const sizeClasses = `btn-${size}`;
  const stateClasses = disabled ? 'btn-disabled' : '';
  const loadingClasses = loading ? 'btn-loading' : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${stateClasses} ${loadingClasses} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}

// Usage
<Button 
  variant="secondary" 
  size="large" 
  loading={isSubmitting}
  onClick={handleSubmit}
>
  Submit
</Button>
```

## State Management Patterns

### 1. Local State
Keep state as local as possible.

```javascript
// ✅ Good: Local state for component-specific data
function SearchInput({ onSearch }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search..."
      />
    </form>
  );
}
```

### 2. Lifted State
Lift state up when multiple components need it.

```javascript
// ✅ Good: Lifted state for shared data
function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  
  return (
    <div className={`app ${theme}`}>
      <Header user={user} onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
      <Main user={user} />
      <Sidebar user={user} />
    </div>
  );
}
```

### 3. Context for Global State
Use Context for state that needs to be shared across many components.

```javascript
// ✅ Good: Context for global state
const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await api.getUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);
  
  const value = {
    user,
    setUser,
    loading,
    login: async (credentials) => {
      const userData = await api.login(credentials);
      setUser(userData);
    },
    logout: () => {
      setUser(null);
      api.logout();
    }
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
```

### 4. Custom Hooks for State Logic
Extract stateful logic into custom hooks.

```javascript
// ✅ Good: Custom hook for state logic
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);
  
  return [storedValue, setValue];
}

function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);
  
  return { data, loading, error };
}
```

## Performance Optimization

### 1. React.memo
Use React.memo for expensive components.

```javascript
// ✅ Good: Memoized component
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data, onUpdate }) {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: expensiveCalculation(item)
    }));
  }, [data]);
  
  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} item={item} onUpdate={onUpdate} />
      ))}
    </div>
  );
});

// Custom comparison function
const MyComponent = React.memo(function MyComponent({ user, settings }) {
  return <div>{user.name} - {settings.theme}</div>;
}, (prevProps, nextProps) => {
  return prevProps.user.id === nextProps.user.id && 
         prevProps.settings.theme === nextProps.settings.theme;
});
```

### 2. useMemo and useCallback
Use these hooks to prevent unnecessary re-renders and expensive calculations.

```javascript
// ✅ Good: Memoized values and callbacks
function Parent({ items, filter }) {
  const [selectedItems, setSelectedItems] = useState([]);
  
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);
  
  const handleItemSelect = useCallback((itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);
  
  const handleSelectAll = useCallback(() => {
    setSelectedItems(prev => 
      prev.length === filteredItems.length 
        ? [] 
        : filteredItems.map(item => item.id)
    );
  }, [filteredItems]);
  
  return (
    <div>
      <button onClick={handleSelectAll}>
        {selectedItems.length === filteredItems.length ? 'Deselect All' : 'Select All'}
      </button>
      <ItemList 
        items={filteredItems} 
        selectedItems={selectedItems}
        onItemSelect={handleItemSelect}
      />
    </div>
  );
}
```

### 3. Code Splitting
Implement code splitting for better performance.

```javascript
// ✅ Good: Code splitting with React.lazy
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  const [showLazy, setShowLazy] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowLazy(true)}>
        Load Lazy Component
      </button>
      {showLazy && (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </Suspense>
      )}
    </div>
  );
}

// Route-based code splitting
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

## Error Handling

### 1. Error Boundaries
Implement error boundaries for graceful error handling.

```javascript
// ✅ Good: Error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
    this.logErrorToService(error, errorInfo);
  }
  
  logErrorToService = (error, errorInfo) => {
    // Send error to monitoring service
    console.log('Error logged to service:', error, errorInfo);
  };
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details>
            {this.state.error && this.state.error.toString()}
          </details>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <Header />
      <Main />
      <Footer />
    </ErrorBoundary>
  );
}
```

### 2. Error Handling in Hooks
Handle errors in custom hooks and effects.

```javascript
// ✅ Good: Error handling in custom hook
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
        console.error('API error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);
  
  return { data, loading, error };
}
```

## Testing Strategies

### 1. Component Testing
Write comprehensive component tests.

```javascript
// ✅ Good: Component testing
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter', () => {
  it('renders initial count', () => {
    render(<Counter initialCount={5} />);
    expect(screen.getByText('Count: 5')).toBeInTheDocument();
  });
  
  it('increments count on button click', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    const incrementButton = screen.getByText('Increment');
    await user.click(incrementButton);
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
  
  it('calls onCountChange when count changes', async () => {
    const onCountChange = jest.fn();
    const user = userEvent.setup();
    render(<Counter onCountChange={onCountChange} />);
    
    const incrementButton = screen.getByText('Increment');
    await user.click(incrementButton);
    
    expect(onCountChange).toHaveBeenCalledWith(1);
  });
});
```

### 2. Custom Hook Testing
Test custom hooks with renderHook.

```javascript
// ✅ Good: Custom hook testing
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });
  
  it('should initialize with custom value', () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });
  
  it('should increment count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
  
  it('should decrement count', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });
  
  it('should reset count', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.increment();
      result.current.reset();
    });
    
    expect(result.current.count).toBe(5);
  });
});
```

## Code Organization

### 1. File Structure
Organize files by feature, not by type.

```
src/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.js
│   │   │   ├── Button.test.js
│   │   │   └── Button.stories.js
│   │   └── Modal/
│   └── features/
│       ├── auth/
│       │   ├── LoginForm/
│       │   ├── SignupForm/
│       │   └── index.js
│       └── dashboard/
│           ├── UserCard/
│           ├── StatsWidget/
│           └── index.js
├── hooks/
│   ├── useAuth.js
│   ├── useApi.js
│   └── index.js
├── services/
│   ├── api.js
│   ├── auth.js
│   └── index.js
├── utils/
│   ├── helpers.js
│   ├── constants.js
│   └── index.js
└── App.js
```

### 2. Barrel Exports
Use barrel exports for clean imports.

```javascript
// components/common/index.js
export { Button } from './Button/Button';
export { Modal } from './Modal/Modal';
export { Input } from './Input/Input';

// components/features/auth/index.js
export { LoginForm } from './LoginForm/LoginForm';
export { SignupForm } from './SignupForm/SignupForm';
export { AuthProvider } from './AuthProvider/AuthProvider';

// Usage
import { Button, Modal } from './components/common';
import { LoginForm, AuthProvider } from './components/features/auth';
```

### 3. Constants and Configuration
Centralize constants and configuration.

```javascript
// constants/index.js
export const API_ENDPOINTS = {
  USERS: '/api/users',
  AUTH: '/api/auth',
  POSTS: '/api/posts'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard'
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// config/index.js
export const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  environment: process.env.NODE_ENV,
  features: {
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    enableDebug: process.env.NODE_ENV === 'development'
  }
};
```

## Accessibility

### 1. Semantic HTML
Use semantic HTML elements.

```javascript
// ✅ Good: Semantic HTML
function Article({ title, content, author, date }) {
  return (
    <article>
      <header>
        <h1>{title}</h1>
        <p>By {author} on {date}</p>
      </header>
      <main>
        <p>{content}</p>
      </main>
      <footer>
        <button>Share</button>
        <button>Bookmark</button>
      </footer>
    </article>
  );
}
```

### 2. ARIA Attributes
Use ARIA attributes for accessibility.

```javascript
// ✅ Good: ARIA attributes
function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content">
        <header>
          <h2 id="modal-title">{title}</h2>
          <button 
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
```

## Conclusion

Following these best practices and architectural patterns will help you build scalable, maintainable React applications. Key takeaways:

1. **Component Design**: Single responsibility, composition over inheritance
2. **State Management**: Local state, lifted state, context, custom hooks
3. **Performance**: React.memo, useMemo, useCallback, code splitting
4. **Error Handling**: Error boundaries, proper error handling in hooks
5. **Testing**: Comprehensive component and hook testing
6. **Code Organization**: Feature-based structure, barrel exports
7. **Accessibility**: Semantic HTML, ARIA attributes

Remember that these practices should be applied based on your project's specific needs and constraints. Start with the basics and gradually adopt more advanced patterns as your application grows.
