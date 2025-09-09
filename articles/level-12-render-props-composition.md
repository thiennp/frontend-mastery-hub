# Render Props and Component Composition: Advanced React Patterns

## Table of Contents
1. [Introduction](#introduction)
2. [Render Props Deep Dive](#render-props-deep-dive)
3. [Component Composition Patterns](#component-composition-patterns)
4. [Advanced Composition Techniques](#advanced-composition-techniques)
5. [Performance Considerations](#performance-considerations)
6. [Real-world Examples](#real-world-examples)
7. [Best Practices](#best-practices)
8. [Common Pitfalls](#common-pitfalls)

## Introduction

Render Props and Component Composition are fundamental patterns in React that enable powerful component reuse and composition. These patterns allow you to build flexible, reusable components that can be composed together to create complex user interfaces.

### What are Render Props?

Render Props is a pattern where a component accepts a function as a prop and calls it to determine what to render. This pattern provides a way to share code between components using a prop whose value is a function.

### What is Component Composition?

Component Composition is the practice of building complex components by combining simpler components together. It's about creating components that work well together and can be easily combined to form larger, more complex interfaces.

## Render Props Deep Dive

### Basic Render Props Pattern

```javascript
// Data fetcher with render props
class DataFetcher extends React.Component {
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
<DataFetcher fetchData={fetchUsers}>
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
</DataFetcher>
```

### Render Props with Multiple Values

```javascript
// Mouse tracker with render props
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
      <div style={{ 
        position: 'absolute', 
        left: x, 
        top: y,
        width: 10,
        height: 10,
        background: 'red',
        borderRadius: '50%'
      }} />
    </div>
  )}
</MouseTracker>
```

### Render Props with Function Components

```javascript
// Function component with render props
function WindowSize({ children }) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return children(windowSize);
}

// Usage
<WindowSize>
  {({ width, height }) => (
    <div>
      <p>Window size: {width} x {height}</p>
      {width < 768 && <p>Mobile view</p>}
      {width >= 768 && <p>Desktop view</p>}
    </div>
  )}
</WindowSize>
```

### Render Props with Custom Hooks

```javascript
// Custom hook that returns render props
function useRenderProps(renderFunction, dependencies = []) {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const execute = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await renderFunction();
        if (isMounted) {
          setState(result);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    execute();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { state, loading, error };
}

// Usage
function DataComponent() {
  const { state, loading, error } = useRenderProps(
    () => fetchData(),
    []
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!state) return <div>No data</div>;

  return <div>{JSON.stringify(state)}</div>;
}
```

## Component Composition Patterns

### Basic Composition

```javascript
// Simple composition
function Layout({ children }) {
  return (
    <div className="layout">
      <header>Header</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  );
}

function Sidebar({ children }) {
  return <aside className="sidebar">{children}</aside>;
}

function Content({ children }) {
  return <div className="content">{children}</div>;
}

// Usage
<Layout>
  <Sidebar>
    <nav>Navigation</nav>
  </Sidebar>
  <Content>
    <h1>Main Content</h1>
  </Content>
</Layout>
```

### Compound Components

```javascript
// Compound component pattern
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

### Context-based Composition

```javascript
// Context for compound components
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

### Flexible Composition with Slots

```javascript
// Slot-based composition
function Card({ children, title, actions }) {
  return (
    <div className="card">
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
      {actions && <div className="card-footer">{actions}</div>}
    </div>
  );
}

// Usage
<Card 
  title="User Profile"
  actions={
    <div>
      <button>Edit</button>
      <button>Delete</button>
    </div>
  }
>
  <p>User information goes here</p>
</Card>
```

## Advanced Composition Techniques

### Higher-Order Components with Composition

```javascript
// HOC for adding loading state
function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return <WrappedComponent {...props} />;
  };
}

// HOC for adding error handling
function withErrorHandling(WrappedComponent) {
  return function WithErrorHandlingComponent({ error, ...props }) {
    if (error) {
      return <div>Error: {error.message}</div>;
    }
    return <WrappedComponent {...props} />;
  };
}

// Composing HOCs
const EnhancedComponent = compose(
  withLoading,
  withErrorHandling
)(BaseComponent);

// Usage
<EnhancedComponent 
  isLoading={loading}
  error={error}
  data={data}
/>
```

### Render Props with Composition

```javascript
// Composable render props
function withData(WrappedComponent) {
  return function WithDataComponent({ fetchData, ...props }) {
    return (
      <DataFetcher fetchData={fetchData}>
        {({ data, loading, error }) => (
          <WrappedComponent
            {...props}
            data={data}
            loading={loading}
            error={error}
          />
        )}
      </DataFetcher>
    );
  };
}

// Usage
const UserList = ({ data, loading, error }) => {
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
};

const UserListWithData = withData(UserList);
```

### Custom Hooks with Composition

```javascript
// Composable custom hooks
function useData(fetchFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFunction();
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
}

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
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

// Composing hooks
function useUserData(userId) {
  const [user, setUser] = useLocalStorage(`user-${userId}`, null);
  const { data, loading, error } = useData(
    () => fetchUser(userId),
    [userId]
  );

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  return { user, loading, error };
}
```

## Performance Considerations

### Memoization with Render Props

```javascript
// Memoized render props component
const MemoizedDataFetcher = React.memo(({ children, fetchData }) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const fetchDataAsync = async () => {
      try {
        const data = await fetchData();
        if (isMounted) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (isMounted) {
          setState({ data: null, loading: false, error });
        }
      }
    };

    fetchDataAsync();

    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  return children(state);
});

// Usage with memoized fetch function
function UserList() {
  const fetchUsers = useCallback(() => api.getUsers(), []);
  
  return (
    <MemoizedDataFetcher fetchData={fetchUsers}>
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
    </MemoizedDataFetcher>
  );
}
```

### Lazy Loading with Render Props

```javascript
// Lazy loading with render props
function LazyComponent({ children, fallback }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000); // Simulate loading time

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return fallback || <div>Loading...</div>;
  }

  return children;
}

// Usage
<LazyComponent fallback={<div>Loading component...</div>}>
  {() => <ExpensiveComponent />}
</LazyComponent>
```

## Real-world Examples

### Modal with Render Props

```javascript
// Modal component with render props
function Modal({ isOpen, onClose, children }) {
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// Usage
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        {({ close }) => (
          <div>
            <h2>Modal Title</h2>
            <p>Modal content goes here</p>
            <button onClick={close}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
```

### Form with Composition

```javascript
// Form components with composition
function Form({ children, onSubmit }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const setError = (name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { setValue, setError, values, errors })
      )}
    </form>
  );
}

function FormField({ name, label, type = 'text', setValue, setError, values, errors }) {
  const handleChange = (e) => {
    setValue(name, e.target.value);
    if (errors[name]) {
      setError(name, '');
    }
  };

  return (
    <div>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={values[name] || ''}
        onChange={handleChange}
      />
      {errors[name] && <span className="error">{errors[name]}</span>}
    </div>
  );
}

// Usage
<Form onSubmit={handleSubmit}>
  <FormField name="name" label="Name" />
  <FormField name="email" label="Email" type="email" />
  <button type="submit">Submit</button>
</Form>
```

## Best Practices

### 1. Use Render Props for Shared Logic

```javascript
// Good: Shared logic with render props
function DataProvider({ children, fetchData }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [fetchData]);

  return children({ data, loading, error });
}
```

### 2. Compose Components Thoughtfully

```javascript
// Good: Clear composition hierarchy
function App() {
  return (
    <Layout>
      <Header />
      <Main>
        <Sidebar />
        <Content>
          <UserList />
        </Content>
      </Main>
      <Footer />
    </Layout>
  );
}
```

### 3. Use Context for Deep Composition

```javascript
// Good: Context for deep component trees
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### 4. Memoize Expensive Operations

```javascript
// Good: Memoized render props
const ExpensiveComponent = React.memo(({ data, children }) => {
  const processedData = useMemo(() => {
    return data.map(item => expensiveOperation(item));
  }, [data]);

  return children(processedData);
});
```

## Common Pitfalls

### 1. Creating New Functions in Render

```javascript
// Bad: New function on every render
function MyComponent() {
  return (
    <DataProvider fetchData={() => fetchData()}>
      {({ data }) => <div>{data}</div>}
    </DataProvider>
  );
}

// Good: Memoized function
function MyComponent() {
  const fetchData = useCallback(() => api.getData(), []);
  
  return (
    <DataProvider fetchData={fetchData}>
      {({ data }) => <div>{data}</div>}
    </DataProvider>
  );
}
```

### 2. Overusing Render Props

```javascript
// Bad: Unnecessary render props
function SimpleComponent({ children }) {
  return <div>{children}</div>;
}

// Good: Simple composition
function SimpleComponent({ children }) {
  return <div>{children}</div>;
}
```

### 3. Not Handling Loading States

```javascript
// Bad: No loading state
function DataComponent() {
  return (
    <DataProvider fetchData={fetchData}>
      {({ data }) => <div>{data}</div>}
    </DataProvider>
  );
}

// Good: Proper loading handling
function DataComponent() {
  return (
    <DataProvider fetchData={fetchData}>
      {({ data, loading, error }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        return <div>{data}</div>;
      }}
    </DataProvider>
  );
}
```

## Conclusion

Render Props and Component Composition are powerful patterns that enable flexible and reusable React components. By understanding these patterns and applying them correctly, you can build more maintainable and scalable applications.

Remember to:
- Use render props for shared logic that needs to be flexible
- Compose components thoughtfully to create clear hierarchies
- Consider performance implications and use memoization when appropriate
- Avoid common pitfalls like creating new functions in render
- Choose the right pattern for the right situation

These patterns, when used correctly, can significantly improve your React development experience and the quality of your applications.
