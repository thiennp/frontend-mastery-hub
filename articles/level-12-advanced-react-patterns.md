# Advanced React Patterns: Building Scalable and Maintainable Applications

## Table of Contents
1. [Introduction](#introduction)
2. [Higher-Order Components (HOCs)](#higher-order-components-hocs)
3. [Render Props Pattern](#render-props-pattern)
4. [Compound Components](#compound-components)
5. [Custom Hooks Patterns](#custom-hooks-patterns)
6. [Context Patterns](#context-patterns)
7. [Performance Optimization Patterns](#performance-optimization-patterns)
8. [Error Boundary Patterns](#error-boundary-patterns)
9. [Advanced State Management Patterns](#advanced-state-management-patterns)
10. [Best Practices and Anti-patterns](#best-practices-and-anti-patterns)

## Introduction

Advanced React patterns are sophisticated techniques that help developers build more maintainable, reusable, and performant React applications. These patterns solve common problems in large-scale applications and provide elegant solutions for complex component hierarchies.

### Why Advanced Patterns Matter

- **Reusability**: Create components that can be used in multiple contexts
- **Maintainability**: Write code that's easier to understand and modify
- **Performance**: Optimize rendering and reduce unnecessary re-renders
- **Scalability**: Build applications that can grow without becoming unwieldy
- **Developer Experience**: Improve the development process with better abstractions

## Higher-Order Components (HOCs)

Higher-Order Components are functions that take a component and return a new component with additional functionality.

### Basic HOC Pattern

```javascript
// Higher-Order Component
function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return <WrappedComponent {...props} />;
  };
}

// Usage
const UserProfile = ({ user }) => <div>{user.name}</div>;
const UserProfileWithLoading = withLoading(UserProfile);
```

### Advanced HOC with State and Lifecycle

```javascript
function withData(WrappedComponent) {
  return class WithDataComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: null,
        loading: true,
        error: null
      };
    }

    async componentDidMount() {
      try {
        const data = await this.props.fetchData();
        this.setState({ data, loading: false });
      } catch (error) {
        this.setState({ error, loading: false });
      }
    }

    render() {
      const { fetchData, ...restProps } = this.props;
      return (
        <WrappedComponent
          {...restProps}
          {...this.state}
        />
      );
    }
  };
}

// Usage
const UserList = ({ data, loading, error }) => {
  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
};

const UserListWithData = withData(UserList);
```

### HOC Composition

```javascript
// Multiple HOCs can be composed
const EnhancedComponent = compose(
  withLoading,
  withData,
  withErrorHandling
)(BaseComponent);

// Or using the pipe pattern
const EnhancedComponent = pipe(
  withLoading,
  withData,
  withErrorHandling
)(BaseComponent);
```

## Render Props Pattern

Render Props is a pattern where a component accepts a function as a prop and calls it to determine what to render.

### Basic Render Props

```javascript
class DataProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      error: null
    };
  }

  async componentDidMount() {
    try {
      const data = await this.props.fetchData();
      this.setState({ data, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }

  render() {
    return this.props.children(this.state);
  }
}

// Usage
<DataProvider fetchData={fetchUsers}>
  {({ data, loading, error }) => (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <ul>
          {data.map(user => <li key={user.id}>{user.name}</li>)}
        </ul>
      )}
    </div>
  )}
</DataProvider>
```

### Render Props with Multiple Values

```javascript
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.children(this.state)}
      </div>
    );
  }
}

// Usage
<MouseTracker>
  {({ x, y }) => (
    <div>
      <h1>Mouse position: {x}, {y}</h1>
    </div>
  )}
</MouseTracker>
```

### Render Props as Function Components

```javascript
function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}

// Usage
function MouseDisplay() {
  const { x, y } = useMousePosition();
  return <div>Mouse position: {x}, {y}</div>;
}
```

## Compound Components

Compound Components are a pattern where multiple components work together to form a cohesive interface.

### Basic Compound Component

```javascript
const Tabs = ({ children, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="tabs">
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

const TabList = ({ children, activeTab, setActiveTab }) => (
  <div className="tab-list">
    {React.Children.map(children, child =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);

const Tab = ({ children, tabId, activeTab, setActiveTab }) => (
  <button
    className={`tab ${activeTab === tabId ? 'active' : ''}`}
    onClick={() => setActiveTab(tabId)}
  >
    {children}
  </button>
);

const TabPanels = ({ children, activeTab }) => (
  <div className="tab-panels">
    {React.Children.map(children, child =>
      React.cloneElement(child, { activeTab })
    )}
  </div>
);

const TabPanel = ({ children, tabId, activeTab }) => (
  activeTab === tabId ? <div className="tab-panel">{children}</div> : null
);

// Usage
<Tabs defaultTab="tab1">
  <TabList>
    <Tab tabId="tab1">Tab 1</Tab>
    <Tab tabId="tab2">Tab 2</Tab>
  </TabList>
  <TabPanels>
    <TabPanel tabId="tab1">Content 1</TabPanel>
    <TabPanel tabId="tab2">Content 2</TabPanel>
  </TabPanels>
</Tabs>
```

### Advanced Compound Component with Context

```javascript
const TabsContext = createContext();

const Tabs = ({ children, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

const TabList = ({ children }) => (
  <div className="tab-list">{children}</div>
);

const Tab = ({ children, tabId }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  
  return (
    <button
      className={`tab ${activeTab === tabId ? 'active' : ''}`}
      onClick={() => setActiveTab(tabId)}
    >
      {children}
    </button>
  );
};

const TabPanels = ({ children }) => (
  <div className="tab-panels">{children}</div>
);

const TabPanel = ({ children, tabId }) => {
  const { activeTab } = useContext(TabsContext);
  return activeTab === tabId ? <div className="tab-panel">{children}</div> : null;
};
```

## Custom Hooks Patterns

Custom hooks allow you to extract component logic into reusable functions.

### Basic Custom Hook

```javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

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

### Advanced Custom Hook with Async Operations

```javascript
function useAsync(asyncFunction, dependencies = []) {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async (...args) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await asyncFunction(...args);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState({ data: null, loading: false, error });
      throw error;
    }
  }, dependencies);

  return { ...state, execute };
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error, execute } = useAsync(
    () => fetchUser(userId),
    [userId]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>No user found</div>;

  return <div>{user.name}</div>;
}
```

### Custom Hook for Form Management

```javascript
function useForm(initialValues, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field];
      const value = values[field];
      
      if (rule.required && !value) {
        newErrors[field] = rule.message || `${field} is required`;
      } else if (rule.pattern && !rule.pattern.test(value)) {
        newErrors[field] = rule.message || `${field} is invalid`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);

  const handleSubmit = useCallback((onSubmit) => {
    return (e) => {
      e.preventDefault();
      setTouched({});
      
      if (validate()) {
        onSubmit(values);
      }
    };
  }, [values, validate]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validate,
    handleSubmit
  };
}

// Usage
function ContactForm() {
  const { values, errors, touched, setValue, setFieldTouched, handleSubmit } = useForm(
    { name: '', email: '', message: '' },
    {
      name: { required: true, message: 'Name is required' },
      email: { 
        required: true, 
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email'
      },
      message: { required: true, message: 'Message is required' }
    }
  );

  const onSubmit = (formValues) => {
    console.log('Form submitted:', formValues);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          type="text"
          value={values.name}
          onChange={(e) => setValue('name', e.target.value)}
          onBlur={() => setFieldTouched('name')}
          placeholder="Name"
        />
        {touched.name && errors.name && <span>{errors.name}</span>}
      </div>
      
      <div>
        <input
          type="email"
          value={values.email}
          onChange={(e) => setValue('email', e.target.value)}
          onBlur={() => setFieldTouched('email')}
          placeholder="Email"
        />
        {touched.email && errors.email && <span>{errors.email}</span>}
      </div>
      
      <div>
        <textarea
          value={values.message}
          onChange={(e) => setValue('message', e.target.value)}
          onBlur={() => setFieldTouched('message')}
          placeholder="Message"
        />
        {touched.message && errors.message && <span>{errors.message}</span>}
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Context Patterns

### Context with Reducer Pattern

```javascript
const AppContext = createContext();

const initialState = {
  user: null,
  theme: 'light',
  notifications: []
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'REMOVE_NOTIFICATION':
      return { 
        ...state, 
        notifications: state.notifications.filter(n => n.id !== action.payload) 
      };
    default:
      return state;
  }
}

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = useMemo(() => ({
    ...state,
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    setTheme: (theme) => dispatch({ type: 'SET_THEME', payload: theme }),
    addNotification: (notification) => dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { ...notification, id: Date.now() } 
    }),
    removeNotification: (id) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
  }), [state]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
```

### Multiple Context Pattern

```javascript
// Separate contexts for different concerns
const UserContext = createContext();
const ThemeContext = createContext();
const NotificationContext = createContext();

// Custom hooks for each context
function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
```

## Performance Optimization Patterns

### Memoization Patterns

```javascript
// React.memo for component memoization
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: expensiveCalculation(item)
    }));
  }, [data]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.processed}</div>
      ))}
    </div>
  );
});

// useMemo for expensive calculations
function DataProcessor({ data }) {
  const processedData = useMemo(() => {
    return data.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.value;
      return acc;
    }, {});
  }, [data]);

  return <div>{JSON.stringify(processedData)}</div>;
}

// useCallback for function memoization
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);

  const handleItemClick = useCallback((itemId) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ItemList items={items} onItemClick={handleItemClick} />
    </div>
  );
}
```

### Virtual Scrolling Pattern

```javascript
function VirtualList({ items, itemHeight, containerHeight }) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={visibleStart + index}
              style={{ height: itemHeight }}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Error Boundary Patterns

### Basic Error Boundary

```javascript
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
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<ErrorFallback />}>
  <MyComponent />
</ErrorBoundary>
```

### Error Boundary with Hooks

```javascript
function useErrorBoundary() {
  const [error, setError] = useState(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const captureError = useCallback((error) => {
    setError(error);
  }, []);

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}

function ErrorBoundary({ children, fallback }) {
  const { captureError, resetError } = useErrorBoundary();

  return (
    <ErrorBoundaryContext.Provider value={{ captureError, resetError }}>
      {children}
    </ErrorBoundaryContext.Provider>
  );
}
```

## Advanced State Management Patterns

### State Machine Pattern

```javascript
function useStateMachine(initialState, transitions) {
  const [state, setState] = useState(initialState);

  const transition = useCallback((action, payload) => {
    const currentState = state;
    const transitionFn = transitions[currentState]?.[action];
    
    if (transitionFn) {
      const newState = transitionFn(currentState, payload);
      setState(newState);
      return newState;
    } else {
      console.warn(`Invalid transition: ${action} from ${currentState}`);
      return currentState;
    }
  }, [state, transitions]);

  return [state, transition];
}

// Usage
const transitions = {
  idle: {
    start: () => 'loading',
    error: (state, payload) => 'error'
  },
  loading: {
    success: (state, payload) => 'success',
    error: (state, payload) => 'error'
  },
  success: {
    reset: () => 'idle'
  },
  error: {
    retry: () => 'loading',
    reset: () => 'idle'
  }
};

function DataFetcher() {
  const [state, transition] = useStateMachine('idle', transitions);

  const fetchData = async () => {
    transition('start');
    try {
      const data = await api.getData();
      transition('success', data);
    } catch (error) {
      transition('error', error);
    }
  };

  return (
    <div>
      <p>State: {state}</p>
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}
```

## Best Practices and Anti-patterns

### Best Practices

1. **Use Composition Over Inheritance**
   ```javascript
   // Good: Composition
   function App() {
     return (
       <Layout>
         <Header />
         <Main>
           <Sidebar />
           <Content />
         </Main>
         <Footer />
       </Layout>
     );
   }
   ```

2. **Keep Components Small and Focused**
   ```javascript
   // Good: Single responsibility
   function UserAvatar({ user }) {
     return <img src={user.avatar} alt={user.name} />;
   }
   ```

3. **Use Custom Hooks for Reusable Logic**
   ```javascript
   // Good: Reusable logic
   function useLocalStorage(key, initialValue) {
     // Implementation
   }
   ```

4. **Prefer Function Components with Hooks**
   ```javascript
   // Good: Modern React
   function MyComponent() {
     const [state, setState] = useState(initialState);
     return <div>{state}</div>;
   }
   ```

### Anti-patterns to Avoid

1. **Don't Use HOCs for Everything**
   ```javascript
   // Bad: Overusing HOCs
   const MyComponent = withLoading(withError(withData(BaseComponent)));
   ```

2. **Avoid Prop Drilling**
   ```javascript
   // Bad: Prop drilling
   function App() {
     return <Level1 user={user} />;
   }
   function Level1({ user }) {
     return <Level2 user={user} />;
   }
   function Level2({ user }) {
     return <Level3 user={user} />;
   }
   ```

3. **Don't Mutate State Directly**
   ```javascript
   // Bad: Direct mutation
   state.items.push(newItem);
   setState(state);
   
   // Good: Immutable update
   setState(prev => ({ ...prev, items: [...prev.items, newItem] }));
   ```

4. **Avoid Creating Objects in Render**
   ```javascript
   // Bad: New object on every render
   function MyComponent() {
     return <ChildComponent style={{ color: 'red' }} />;
   }
   
   // Good: Memoized object
   function MyComponent() {
     const style = useMemo(() => ({ color: 'red' }), []);
     return <ChildComponent style={style} />;
   }
   ```

## Conclusion

Advanced React patterns provide powerful tools for building scalable and maintainable applications. By understanding and applying these patterns correctly, you can create components that are more reusable, performant, and easier to maintain. Remember to choose the right pattern for the right situation and always consider the trade-offs between complexity and maintainability.

The key is to start simple and gradually introduce more advanced patterns as your application grows and requirements become more complex. Always prioritize readability and maintainability over cleverness, and don't be afraid to refactor when you find better patterns for your specific use case.
