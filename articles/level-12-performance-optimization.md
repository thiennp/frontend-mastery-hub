# Performance Optimization in React: Advanced Techniques

## Table of Contents
1. [Introduction](#introduction)
2. [React.memo and Pure Components](#reactmemo-and-pure-components)
3. [useMemo and useCallback](#usememo-and-usecallback)
4. [Code Splitting and Lazy Loading](#code-splitting-and-lazy-loading)
5. [Virtual Scrolling](#virtual-scrolling)
6. [Bundle Optimization](#bundle-optimization)
7. [Memory Management](#memory-management)
8. [Rendering Optimization](#rendering-optimization)
9. [State Management Performance](#state-management-performance)
10. [Monitoring and Profiling](#monitoring-and-profiling)

## Introduction

Performance optimization in React is crucial for building fast, responsive applications. This guide covers advanced techniques for optimizing React applications, from component-level optimizations to bundle size reduction and memory management.

### Why Performance Matters

- **User Experience**: Fast applications provide better user experience
- **SEO**: Page speed affects search engine rankings
- **Accessibility**: Performance impacts users with slower devices
- **Business Impact**: Better performance leads to higher conversion rates
- **Scalability**: Optimized applications can handle more users and data

## React.memo and Pure Components

### React.memo for Function Components

```javascript
// Basic React.memo usage
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

// Custom comparison function
const UserCard = React.memo(({ user, onUpdate }) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onUpdate(user.id)}>Update</button>
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if user data or onUpdate function changes
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.name === nextProps.user.name &&
    prevProps.user.email === nextProps.user.email &&
    prevProps.onUpdate === nextProps.onUpdate
  );
});
```

### Pure Components for Class Components

```javascript
// Pure component example
class PureUserCard extends React.PureComponent {
  render() {
    const { user, onUpdate } = this.props;
    return (
      <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <button onClick={() => onUpdate(user.id)}>Update</button>
      </div>
    );
  }
}

// Regular component for comparison
class RegularUserCard extends React.Component {
  render() {
    const { user, onUpdate } = this.props;
    return (
      <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <button onClick={() => onUpdate(user.id)}>Update</button>
      </div>
    );
  }
}
```

### When to Use React.memo

```javascript
// Good: Expensive component with stable props
const ExpensiveChart = React.memo(({ data, config }) => {
  const chartData = useMemo(() => {
    return processChartData(data, config);
  }, [data, config]);

  return <Chart data={chartData} />;
});

// Bad: Simple component with frequently changing props
const SimpleText = React.memo(({ text }) => {
  return <span>{text}</span>; // Unnecessary memoization
});

// Good: Component with stable props but expensive rendering
const ComplexVisualization = React.memo(({ data }) => {
  const visualization = useMemo(() => {
    return createComplexVisualization(data);
  }, [data]);

  return <div>{visualization}</div>;
});
```

## useMemo and useCallback

### useMemo for Expensive Calculations

```javascript
// Expensive calculation with useMemo
function DataProcessor({ data, filter, sortBy }) {
  const processedData = useMemo(() => {
    console.log('Processing data...'); // This will only run when dependencies change
    
    return data
      .filter(item => item.category === filter)
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'date') return new Date(a.date) - new Date(b.date);
        return 0;
      })
      .map(item => ({
        ...item,
        processed: true
      }));
  }, [data, filter, sortBy]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

// useMemo for object creation
function UserProfile({ user, theme }) {
  const userStyle = useMemo(() => ({
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
    color: theme === 'dark' ? '#fff' : '#333',
    padding: '20px',
    borderRadius: '8px'
  }), [theme]);

  return (
    <div style={userStyle}>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

### useCallback for Function Memoization

```javascript
// useCallback for event handlers
function TodoList({ todos, onToggle, onDelete }) {
  const handleToggle = useCallback((id) => {
    onToggle(id);
  }, [onToggle]);

  const handleDelete = useCallback((id) => {
    onDelete(id);
  }, [onDelete]);

  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}

// useCallback with dependencies
function SearchComponent({ onSearch, searchTerm }) {
  const debouncedSearch = useCallback(
    debounce((term) => {
      onSearch(term);
    }, 300),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### Avoiding Common useMemo/useCallback Pitfalls

```javascript
// Bad: Unnecessary useMemo for simple calculations
function BadExample({ count }) {
  const doubled = useMemo(() => count * 2, [count]); // Unnecessary
  return <div>{doubled}</div>;
}

// Good: Only memoize expensive calculations
function GoodExample({ data }) {
  const expensiveResult = useMemo(() => {
    return data.reduce((acc, item) => {
      return acc + complexCalculation(item);
    }, 0);
  }, [data]);

  return <div>{expensiveResult}</div>;
}

// Bad: useCallback without dependencies
function BadCallback({ onUpdate }) {
  const handleClick = useCallback(() => {
    onUpdate(); // Missing onUpdate in dependencies
  }, []); // This will always use the initial onUpdate

  return <button onClick={handleClick}>Update</button>;
}

// Good: Proper dependencies
function GoodCallback({ onUpdate }) {
  const handleClick = useCallback(() => {
    onUpdate();
  }, [onUpdate]); // Correct dependencies

  return <button onClick={handleClick}>Update</button>;
}
```

## Code Splitting and Lazy Loading

### React.lazy for Component Splitting

```javascript
// Lazy loading components
const LazyDashboard = React.lazy(() => import('./Dashboard'));
const LazyProfile = React.lazy(() => import('./Profile'));
const LazySettings = React.lazy(() => import('./Settings'));

// Usage with Suspense
function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <LazyDashboard />;
      case 'profile':
        return <LazyProfile />;
      case 'settings':
        return <LazySettings />;
      default:
        return <LazyDashboard />;
    }
  };

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
        <button onClick={() => setCurrentPage('profile')}>Profile</button>
        <button onClick={() => setCurrentPage('settings')}>Settings</button>
      </nav>
      
      <Suspense fallback={<div>Loading...</div>}>
        {renderPage()}
      </Suspense>
    </div>
  );
}
```

### Route-based Code Splitting

```javascript
// Route-based lazy loading
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading page...</div>}>
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

### Dynamic Imports with Hooks

```javascript
// Custom hook for dynamic imports
function useDynamicImport(importFunction) {
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadComponent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const module = await importFunction();
      setComponent(() => module.default);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [importFunction]);

  return { component, loading, error, loadComponent };
}

// Usage
function DynamicComponent() {
  const { component: LazyComponent, loading, error, loadComponent } = useDynamicImport(
    () => import('./HeavyComponent')
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!LazyComponent) return <button onClick={loadComponent}>Load Component</button>;

  return <LazyComponent />;
}
```

## Virtual Scrolling

### Basic Virtual Scrolling Implementation

```javascript
// Virtual scrolling component
function VirtualList({ items, itemHeight, containerHeight, renderItem }) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef();

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(visibleStart, visibleEnd);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={visibleStart + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleStart + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Usage
function LargeList() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: Math.random()
  }));

  const renderItem = (item, index) => (
    <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <strong>{item.name}</strong> - Value: {item.value}
    </div>
  );

  return (
    <VirtualList
      items={items}
      itemHeight={50}
      containerHeight={400}
      renderItem={renderItem}
    />
  );
}
```

### Advanced Virtual Scrolling with Variable Heights

```javascript
// Virtual scrolling with variable heights
function VariableHeightVirtualList({ items, containerHeight, renderItem }) {
  const [scrollTop, setScrollTop] = useState(0);
  const [itemHeights, setItemHeights] = useState({});
  const containerRef = useRef();

  // Calculate cumulative heights
  const cumulativeHeights = useMemo(() => {
    let cumulative = 0;
    return items.map((item, index) => {
      const height = itemHeights[index] || 100; // Default height
      const result = cumulative;
      cumulative += height;
      return result;
    });
  }, [items, itemHeights]);

  const totalHeight = cumulativeHeights[cumulativeHeights.length - 1] + 
    (itemHeights[items.length - 1] || 100);

  // Find visible range
  const visibleRange = useMemo(() => {
    let start = 0;
    let end = items.length;

    for (let i = 0; i < cumulativeHeights.length; i++) {
      if (cumulativeHeights[i] + (itemHeights[i] || 100) > scrollTop) {
        start = i;
        break;
      }
    }

    for (let i = start; i < cumulativeHeights.length; i++) {
      if (cumulativeHeights[i] > scrollTop + containerHeight) {
        end = i;
        break;
      }
    }

    return { start, end };
  }, [scrollTop, containerHeight, cumulativeHeights, itemHeights]);

  const visibleItems = items.slice(visibleRange.start, visibleRange.end);
  const offsetY = cumulativeHeights[visibleRange.start] || 0;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  const measureItem = useCallback((index, height) => {
    setItemHeights(prev => ({
      ...prev,
      [index]: height
    }));
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={visibleRange.start + index}
              ref={(el) => {
                if (el) {
                  const height = el.offsetHeight;
                  measureItem(visibleRange.start + index, height);
                }
              }}
            >
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Bundle Optimization

### Webpack Bundle Analysis

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  // ... other config
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
};
```

### Dynamic Imports for Libraries

```javascript
// Lazy load heavy libraries
const loadChartLibrary = () => import('chart.js');
const loadMoment = () => import('moment');

function ChartComponent() {
  const [Chart, setChart] = useState(null);
  const [moment, setMoment] = useState(null);

  useEffect(() => {
    Promise.all([loadChartLibrary(), loadMoment()])
      .then(([chartModule, momentModule]) => {
        setChart(chartModule.default);
        setMoment(momentModule.default);
      });
  }, []);

  if (!Chart || !moment) {
    return <div>Loading chart library...</div>;
  }

  return <Chart data={data} />;
}
```

### Tree Shaking Optimization

```javascript
// Good: Named imports for tree shaking
import { debounce, throttle } from 'lodash-es';
import { format, parseISO } from 'date-fns';

// Bad: Import entire library
import _ from 'lodash';
import * as dateFns from 'date-fns';

// Good: Specific function imports
import { debounce } from 'lodash/debounce';
import { throttle } from 'lodash/throttle';
```

## Memory Management

### Cleaning Up Effects

```javascript
// Proper cleanup in useEffect
function DataFetcher({ url }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          signal: controller.signal
        });
        const result = await response.json();
        
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted && error.name !== 'AbortError') {
          console.error('Fetch error:', error);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [url]);

  if (loading) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```

### Avoiding Memory Leaks

```javascript
// Avoiding memory leaks with event listeners
function WindowSize() {
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
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div>Window size: {windowSize.width} x {windowSize.height}</div>;
}

// Avoiding memory leaks with timers
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);

    // Cleanup function
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div>Count: {count}</div>;
}
```

### WeakMap for Caching

```javascript
// Using WeakMap for caching without memory leaks
const cache = new WeakMap();

function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    if (cache.has(data)) {
      return cache.get(data);
    }

    const result = expensiveProcessing(data);
    cache.set(data, result);
    return result;
  }, [data]);

  return <div>{processedData}</div>;
}
```

## Rendering Optimization

### Avoiding Unnecessary Re-renders

```javascript
// Good: Stable references
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);

  // Stable function reference
  const handleItemClick = useCallback((itemId) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  // Stable object reference
  const config = useMemo(() => ({
    theme: 'dark',
    showLabels: true
  }), []);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ItemList items={items} onItemClick={handleItemClick} config={config} />
    </div>
  );
}

// Bad: New references on every render
function BadParentComponent() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ItemList 
        items={items} 
        onItemClick={(itemId) => setItems(prev => prev.filter(item => item.id !== itemId))}
        config={{ theme: 'dark', showLabels: true }}
      />
    </div>
  );
}
```

### Optimizing Context Usage

```javascript
// Good: Split contexts to avoid unnecessary re-renders
const UserContext = createContext();
const ThemeContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  
  const value = useMemo(() => ({
    user,
    setUser
  }), [user]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const value = useMemo(() => ({
    theme,
    setTheme
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Bad: Single context with all state
function BadAppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);

  const value = {
    user, setUser,
    theme, setTheme,
    notifications, setNotifications
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
```

## State Management Performance

### Optimizing Redux with Reselect

```javascript
// Using Reselect for memoized selectors
import { createSelector } from 'reselect';

const getUsers = (state) => state.users;
const getFilter = (state) => state.filter;

const getFilteredUsers = createSelector(
  [getUsers, getFilter],
  (users, filter) => {
    return users.filter(user => 
      user.name.toLowerCase().includes(filter.toLowerCase())
    );
  }
);

// Usage in component
function UserList() {
  const filteredUsers = useSelector(getFilteredUsers);
  
  return (
    <ul>
      {filteredUsers.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Optimizing Context with useMemo

```javascript
// Optimized context provider
function AppProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    theme: 'light',
    notifications: []
  });

  const value = useMemo(() => ({
    ...state,
    setUser: (user) => setState(prev => ({ ...prev, user })),
    setTheme: (theme) => setState(prev => ({ ...prev, theme })),
    addNotification: (notification) => setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, notification]
    }))
  }), [state]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
```

## Monitoring and Profiling

### React DevTools Profiler

```javascript
// Using React DevTools Profiler
function ProfiledComponent() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, filter]);

  return (
    <div>
      <input 
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter..."
      />
      <ul>
        {filteredData.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Performance Monitoring

```javascript
// Performance monitoring hook
function usePerformanceMonitor(componentName) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // More than one frame
        console.warn(`${componentName} took ${renderTime}ms to render`);
      }
    };
  });
}

// Usage
function ExpensiveComponent() {
  usePerformanceMonitor('ExpensiveComponent');
  
  // Component logic
  return <div>Expensive content</div>;
}
```

### Bundle Size Monitoring

```javascript
// Bundle size monitoring
function BundleSizeMonitor() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const bundleSize = performance.getEntriesByType('navigation')[0].transferSize;
      console.log(`Bundle size: ${(bundleSize / 1024).toFixed(2)} KB`);
    }
  }, []);

  return null;
}
```

## Conclusion

Performance optimization in React is an ongoing process that requires understanding of React's rendering behavior, JavaScript performance characteristics, and browser optimization techniques. By applying these patterns and techniques, you can build fast, responsive React applications that provide excellent user experiences.

Remember to:
- Measure before optimizing
- Use React DevTools Profiler to identify bottlenecks
- Apply optimizations judiciously - not everything needs to be optimized
- Monitor performance in production
- Keep up with React updates and new optimization techniques

The key is to find the right balance between performance and maintainability while ensuring your application meets the performance requirements of your users.
