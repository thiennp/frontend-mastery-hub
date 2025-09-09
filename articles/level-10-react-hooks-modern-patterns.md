# React Hooks & Modern Patterns

## Overview

React Hooks are functions that let you use state and other React features in functional components. Introduced in React 16.8, hooks revolutionized how we write React components by allowing functional components to have state and lifecycle methods.

## Built-in Hooks

### useState
The `useState` hook allows you to add state to functional components.

```javascript
import { useState } from 'react';

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
```

### useEffect
The `useEffect` hook lets you perform side effects in functional components.

```javascript
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId]); // Dependency array
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### useContext
The `useContext` hook allows you to consume context values in functional components.

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

function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <button 
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={`btn btn-${theme}`}
    >
      Toggle Theme
    </button>
  );
}
```

### useReducer
The `useReducer` hook is an alternative to `useState` for managing complex state logic.

```javascript
import { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>
        +
      </button>
      <button onClick={() => dispatch({ type: 'decrement' })}>
        -
      </button>
      <button onClick={() => dispatch({ type: 'reset' })}>
        Reset
      </button>
    </div>
  );
}
```

### useMemo
The `useMemo` hook memoizes expensive calculations.

```javascript
import { useState, useMemo } from 'react';

function ExpensiveComponent({ items }) {
  const [filter, setFilter] = useState('');
  
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);
  
  return (
    <div>
      <input 
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items"
      />
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### useCallback
The `useCallback` hook memoizes callback functions.

```javascript
import { useState, useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  
  const handleAddItem = useCallback(() => {
    setItems(prevItems => [
      ...prevItems,
      { id: Date.now(), value: Math.random() }
    ]);
  }, []);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <Child items={items} onAddItem={handleAddItem} />
    </div>
  );
}

function Child({ items, onAddItem }) {
  return (
    <div>
      <button onClick={onAddItem}>Add Item</button>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.value}</li>
        ))}
      </ul>
    </div>
  );
}
```

### useRef
The `useRef` hook creates a mutable ref object that persists for the full lifetime of the component.

```javascript
import { useRef, useEffect } from 'react';

function FocusInput() {
  const inputRef = useRef(null);
  
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  
  return <input ref={inputRef} placeholder="This input will be focused" />;
}
```

### useImperativeHandle
The `useImperativeHandle` hook customizes the instance value that is exposed to parent components when using ref.

```javascript
import { forwardRef, useImperativeHandle, useRef } from 'react';

const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    clear: () => {
      inputRef.current.value = '';
    }
  }));
  
  return <input ref={inputRef} {...props} />;
});

function Parent() {
  const fancyInputRef = useRef();
  
  const handleFocus = () => {
    fancyInputRef.current.focus();
  };
  
  const handleClear = () => {
    fancyInputRef.current.clear();
  };
  
  return (
    <div>
      <FancyInput ref={fancyInputRef} />
      <button onClick={handleFocus}>Focus Input</button>
      <button onClick={handleClear}>Clear Input</button>
    </div>
  );
}
```

## Custom Hooks

Custom hooks are functions that use other hooks and can be shared between components.

### Basic Custom Hook
```javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}

// Usage
function Counter() {
  const { count, increment, decrement, reset } = useCounter(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Custom Hook with useEffect
```javascript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <div>
      <label>
        Theme:
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    </div>
  );
}
```

### Custom Hook for API Calls
```javascript
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
          throw new Error('Network response was not ok');
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

// Usage
function UserList() {
  const { data: users, loading, error } = useApi('/api/users');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## Advanced Patterns

### Compound Components
Compound components are components that work together to form a complete UI.

```javascript
function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <div className="tabs">
      {children.map(child => 
        React.cloneElement(child, { 
          activeTab, 
          setActiveTab,
          key: child.props.label 
        })
      )}
    </div>
  );
}

function TabList({ activeTab, setActiveTab, children }) {
  return (
    <div className="tab-list">
      {children.map(child => 
        React.cloneElement(child, { 
          activeTab, 
          setActiveTab,
          key: child.props.label 
        })
      )}
    </div>
  );
}

function Tab({ label, activeTab, setActiveTab, children }) {
  const isActive = activeTab === label;
  
  return (
    <button 
      className={`tab ${isActive ? 'active' : ''}`}
      onClick={() => setActiveTab(label)}
    >
      {label}
    </button>
  );
}

function TabPanel({ label, activeTab, children }) {
  if (activeTab !== label) return null;
  
  return <div className="tab-panel">{children}</div>;
}

// Usage
function App() {
  return (
    <Tabs defaultTab="tab1">
      <TabList>
        <Tab label="tab1">Tab 1</Tab>
        <Tab label="tab2">Tab 2</Tab>
      </TabList>
      <TabPanel label="tab1">
        <p>Content for Tab 1</p>
      </TabPanel>
      <TabPanel label="tab2">
        <p>Content for Tab 2</p>
      </TabPanel>
    </Tabs>
  );
}
```

### Render Props
Render props are a pattern where a component's children are a function that receives data and returns JSX.

```javascript
function DataFetcher({ url, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
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
  
  return children({ data, loading, error });
}

// Usage
function UserProfile({ userId }) {
  return (
    <DataFetcher url={`/api/users/${userId}`}>
      {({ data: user, loading, error }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        
        return (
          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
        );
      }}
    </DataFetcher>
  );
}
```

### Higher-Order Components (HOCs)
HOCs are functions that take a component and return a new component with additional functionality.

```javascript
function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return <WrappedComponent {...props} />;
  };
}

function withErrorBoundary(WrappedComponent) {
  return class WithErrorBoundary extends React.Component {
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
        return <div>Something went wrong.</div>;
      }
      
      return <WrappedComponent {...this.props} />;
    }
  };
}

// Usage
const UserProfileWithLoading = withLoading(UserProfile);
const UserProfileWithErrorBoundary = withErrorBoundary(UserProfileWithLoading);
```

## Rules of Hooks

### 1. Only Call Hooks at the Top Level
Don't call hooks inside loops, conditions, or nested functions.

```javascript
// ❌ Wrong
function MyComponent() {
  if (condition) {
    const [state, setState] = useState(0); // Don't do this
  }
}

// ✅ Correct
function MyComponent() {
  const [state, setState] = useState(0);
  
  if (condition) {
    // Use state here
  }
}
```

### 2. Only Call Hooks from React Functions
Don't call hooks from regular JavaScript functions.

```javascript
// ❌ Wrong
function regularFunction() {
  const [state, setState] = useState(0); // Don't do this
}

// ✅ Correct
function MyComponent() {
  const [state, setState] = useState(0);
  
  const regularFunction = () => {
    // Use state here
  };
}
```

## Performance Optimization

### React.memo
`React.memo` is a higher-order component that memoizes the result of a component.

```javascript
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return data.map(item => expensiveCalculation(item));
  }, [data]);
  
  return <div>{/* render processed data */}</div>;
});
```

### useMemo and useCallback
Use these hooks to prevent unnecessary re-renders and expensive calculations.

```javascript
function Parent({ items }) {
  const [filter, setFilter] = useState('');
  
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);
  
  const handleItemClick = useCallback((id) => {
    // Handle item click
  }, []);
  
  return (
    <div>
      <input 
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <ItemList items={filteredItems} onItemClick={handleItemClick} />
    </div>
  );
}
```

## Conclusion

React Hooks have revolutionized how we write React components by allowing functional components to have state and lifecycle methods. Understanding hooks and modern patterns is essential for building scalable, maintainable React applications.

Key takeaways:
- Use built-in hooks for common functionality
- Create custom hooks for reusable logic
- Follow the rules of hooks
- Optimize performance with memoization
- Use modern patterns like compound components and render props

By mastering these concepts, you'll be able to write more efficient, maintainable, and reusable React code.
