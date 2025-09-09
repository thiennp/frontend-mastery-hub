# Advanced Context API Patterns

## Overview

The Context API is React's built-in solution for sharing state across multiple components without prop drilling. While it's simple for basic use cases, advanced patterns can help you build more maintainable and performant applications.

## Basic Context Pattern

```javascript
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Usage
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
    </ThemeProvider>
  );
}
```

## Advanced Patterns

### 1. Multiple Contexts for Better Performance

Instead of putting everything in one context, split by domain to prevent unnecessary re-renders.

```javascript
// User Context
const UserContext = createContext();
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const login = async (credentials) => {
    setLoading(true);
    try {
      const userData = await api.login(credentials);
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
  };
  
  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout
  }), [user, loading]);
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Theme Context
const ThemeContext = createContext();
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  const value = useMemo(() => ({
    theme,
    toggleTheme
  }), [theme, toggleTheme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// App with multiple providers
function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <Header />
        <Main />
      </ThemeProvider>
    </UserProvider>
  );
}
```

### 2. Context with Reducer Pattern

For complex state management, combine Context with useReducer.

```javascript
const initialState = {
  items: [],
  loading: false,
  error: null,
  filter: 'all'
};

function todoReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ITEMS':
      return { ...state, items: action.payload, loading: false };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

const TodoContext = createContext();

function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  
  const actions = useMemo(() => ({
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setItems: (items) => dispatch({ type: 'SET_ITEMS', payload: items }),
    addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
    updateItem: (item) => dispatch({ type: 'UPDATE_ITEM', payload: item }),
    deleteItem: (id) => dispatch({ type: 'DELETE_ITEM', payload: id }),
    setFilter: (filter) => dispatch({ type: 'SET_FILTER', payload: filter }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error })
  }), []);
  
  const value = useMemo(() => ({
    ...state,
    ...actions
  }), [state, actions]);
  
  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}

function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}
```

### 3. Context with Custom Hooks

Create custom hooks that encapsulate context logic and provide a clean API.

```javascript
// Auth Context
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await api.verifyToken(token);
          setUser(userData);
        }
      } catch (err) {
        setError(err.message);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const { user: userData, token } = await api.login(credentials);
      localStorage.setItem('token', token);
      setUser(userData);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };
  
  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  }), [user, loading, error]);
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook with additional logic
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  const { user, isAuthenticated } = context;
  
  // Additional computed values
  const isAdmin = useMemo(() => {
    return user?.role === 'admin';
  }, [user?.role]);
  
  const canEdit = useMemo(() => {
    return isAuthenticated && (isAdmin || user?.role === 'editor');
  }, [isAuthenticated, isAdmin, user?.role]);
  
  return {
    ...context,
    isAdmin,
    canEdit
  };
}
```

### 4. Context Composition Pattern

Compose multiple contexts to create a unified API.

```javascript
// Individual contexts
const UserContext = createContext();
const ThemeContext = createContext();
const NotificationContext = createContext();

// Composed context
const AppContext = createContext();

function AppProvider({ children }) {
  const user = useContext(UserContext);
  const theme = useContext(ThemeContext);
  const notifications = useContext(NotificationContext);
  
  const value = useMemo(() => ({
    user,
    theme,
    notifications,
    // Computed values
    isDarkMode: theme.theme === 'dark',
    hasNotifications: notifications.items.length > 0,
    // Combined actions
    logout: () => {
      user.logout();
      notifications.clear();
    }
  }), [user, theme, notifications]);
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Usage
function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
```

### 5. Context with Middleware Pattern

Add middleware-like functionality to context updates.

```javascript
function createContextWithMiddleware(initialState, middleware = []) {
  const Context = createContext();
  
  function Provider({ children }) {
    const [state, setState] = useState(initialState);
    
    const dispatch = useCallback((action) => {
      // Apply middleware
      const processedAction = middleware.reduce(
        (acc, middlewareFn) => middlewareFn(acc, state),
        action
      );
      
      // Update state
      setState(prevState => {
        if (typeof processedAction === 'function') {
          return processedAction(prevState);
        }
        return { ...prevState, ...processedAction };
      });
    }, [state]);
    
    const value = useMemo(() => ({
      ...state,
      dispatch
    }), [state, dispatch]);
    
    return (
      <Context.Provider value={value}>
        {children}
      </Context.Provider>
    );
  }
  
  return { Context, Provider };
}

// Middleware functions
const loggerMiddleware = (action, state) => {
  console.log('Action:', action);
  console.log('Previous state:', state);
  return action;
};

const validationMiddleware = (action, state) => {
  if (action.type === 'UPDATE_USER' && !action.payload.name) {
    throw new Error('User name is required');
  }
  return action;
};

// Create context with middleware
const { Context: UserContext, Provider: UserProvider } = createContextWithMiddleware(
  { user: null, loading: false },
  [loggerMiddleware, validationMiddleware]
);
```

### 6. Context with Selector Pattern

Implement selector pattern for better performance.

```javascript
function createContextWithSelector(initialState) {
  const Context = createContext();
  
  function Provider({ children }) {
    const [state, setState] = useState(initialState);
    
    const value = useMemo(() => ({
      state,
      setState,
      // Selector function
      useSelector: (selector) => {
        const [selectedValue, setSelectedValue] = useState(() => selector(state));
        
        useEffect(() => {
          const newValue = selector(state);
          if (newValue !== selectedValue) {
            setSelectedValue(newValue);
          }
        }, [state, selector, selectedValue]);
        
        return selectedValue;
      }
    }), [state]);
    
    return (
      <Context.Provider value={value}>
        {children}
      </Context.Provider>
    );
  }
  
  return { Context, Provider };
}

// Usage
const { Context: AppContext, Provider: AppProvider } = createContextWithSelector({
  user: null,
  theme: 'light',
  notifications: []
});

function useAppSelector(selector) {
  const { useSelector } = useContext(AppContext);
  return useSelector(selector);
}

// Component using selector
function UserName() {
  const name = useAppSelector(state => state.user?.name);
  return <div>{name}</div>;
}
```

## Performance Optimization

### 1. Memoizing Context Values

```javascript
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    theme,
    setTheme,
    isDark: theme === 'dark'
  }), [theme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### 2. Splitting Contexts by Update Frequency

```javascript
// Static data context (rarely changes)
const ConfigContext = createContext();
const ConfigProvider = ({ children }) => {
  const [config] = useState({
    apiUrl: process.env.REACT_APP_API_URL,
    version: '1.0.0',
    features: {
      darkMode: true,
      notifications: true
    }
  });
  
  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};

// Dynamic data context (changes frequently)
const UserContext = createContext();
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const value = useMemo(() => ({
    user,
    loading,
    setUser,
    setLoading
  }), [user, loading]);
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
```

### 3. Context with useCallback for Actions

```javascript
function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  
  // Memoize actions to prevent unnecessary re-renders
  const addTodo = useCallback((todo) => {
    setTodos(prev => [...prev, todo]);
  }, []);
  
  const updateTodo = useCallback((id, updates) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  }, []);
  
  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);
  
  const value = useMemo(() => ({
    todos,
    addTodo,
    updateTodo,
    deleteTodo
  }), [todos, addTodo, updateTodo, deleteTodo]);
  
  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}
```

## Testing Context

### 1. Testing Context Providers

```javascript
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';

function TestComponent() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => setTheme('dark')}>Toggle Theme</button>
    </div>
  );
}

test('ThemeProvider provides theme context', () => {
  render(
    <ThemeProvider>
      <TestComponent />
    </ThemeProvider>
  );
  
  expect(screen.getByTestId('theme')).toHaveTextContent('light');
});

test('ThemeProvider allows theme changes', () => {
  render(
    <ThemeProvider>
      <TestComponent />
    </ThemeProvider>
  );
  
  const button = screen.getByText('Toggle Theme');
  button.click();
  
  expect(screen.getByTestId('theme')).toHaveTextContent('dark');
});
```

### 2. Testing Custom Hooks

```javascript
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';

test('useAuth provides authentication state', () => {
  const wrapper = ({ children }) => (
    <AuthProvider>{children}</AuthProvider>
  );
  
  const { result } = renderHook(() => useAuth(), { wrapper });
  
  expect(result.current.isAuthenticated).toBe(false);
  expect(result.current.user).toBe(null);
});

test('useAuth handles login', async () => {
  const wrapper = ({ children }) => (
    <AuthProvider>{children}</AuthProvider>
  );
  
  const { result } = renderHook(() => useAuth(), { wrapper });
  
  await act(async () => {
    await result.current.login({ email: 'test@example.com', password: 'password' });
  });
  
  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.user).toBeDefined();
});
```

## Best Practices

1. **Split contexts by domain**: Don't put everything in one context
2. **Memoize context values**: Prevent unnecessary re-renders
3. **Use custom hooks**: Encapsulate context logic
4. **Provide fallback values**: Handle missing providers gracefully
5. **Test context providers**: Ensure they work correctly
6. **Consider performance**: Use selectors for large state objects
7. **Keep contexts focused**: Each context should have a single responsibility

## Conclusion

Advanced Context API patterns can help you build more maintainable and performant React applications. By understanding these patterns and applying them appropriately, you can create robust state management solutions without external libraries.
