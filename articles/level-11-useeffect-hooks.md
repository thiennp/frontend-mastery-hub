# useEffect Hook Deep Dive

## Overview

The `useEffect` hook is one of the most important hooks in React for managing side effects. It allows you to perform operations that affect the component after it has rendered, such as data fetching, subscriptions, timers, and DOM manipulations.

## Basic Syntax

```javascript
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // Side effect code here
    console.log('Component mounted or updated');
    
    // Cleanup function (optional)
    return () => {
      console.log('Cleanup before next effect or unmount');
    };
  }, [dependencies]); // Dependency array
  
  return <div>My Component</div>;
}
```

## Effect Types

### 1. Effects That Run After Every Render
```javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // Runs after every render
    document.title = `Count: ${count}`;
  }); // No dependency array
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### 2. Effects That Run Only Once (Mount/Unmount)
```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Runs only once after mount
    const fetchUser = async () => {
      const response = await fetch(`/api/users/${userId}`);
      const userData = await response.json();
      setUser(userData);
    };
    
    fetchUser();
  }, []); // Empty dependency array
  
  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
```

### 3. Effects That Run When Dependencies Change
```javascript
function UserPosts({ userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Runs when userId changes
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/${userId}/posts`);
        const postsData = await response.json();
        setPosts(postsData);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [userId]); // Runs when userId changes
  
  if (loading) return <div>Loading posts...</div>;
  
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

## Cleanup Functions

Cleanup functions are essential for preventing memory leaks and cleaning up resources.

### Timer Cleanup
```javascript
function Timer() {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    
    // Cleanup function
    return () => {
      clearInterval(interval);
    };
  }, []); // Empty dependency array
  
  return <div>Seconds: {seconds}</div>;
}
```

### Event Listener Cleanup
```javascript
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
  }, []); // Empty dependency array
  
  return (
    <div>
      Window size: {windowSize.width} x {windowSize.height}
    </div>
  );
}
```

### Subscription Cleanup
```javascript
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const subscription = chatService.subscribe(roomId, (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    // Cleanup function
    return () => {
      subscription.unsubscribe();
    };
  }, [roomId]); // Runs when roomId changes
  
  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>{message.text}</div>
      ))}
    </div>
  );
}
```

## Common Patterns

### 1. Data Fetching
```javascript
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      cancelled = true;
    };
  }, [url]);
  
  return { data, loading, error };
}
```

### 2. Debounced Search
```javascript
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

function SearchComponent() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const { data: results, loading } = useApi(`/api/search?q=${debouncedQuery}`);
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {loading && <div>Searching...</div>}
      {results && (
        <div>
          {results.map(item => (
            <div key={item.id}>{item.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 3. Local Storage Sync
```javascript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setValue];
}
```

## Advanced Patterns

### 1. Multiple Effects
```javascript
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Effect for user data
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/users/${userId}`);
      const userData = await response.json();
      setUser(userData);
    };
    
    fetchUser();
  }, [userId]);
  
  // Effect for user posts
  useEffect(() => {
    if (!user) return;
    
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${userId}/posts`);
      const postsData = await response.json();
      setPosts(postsData);
    };
    
    fetchPosts();
  }, [userId, user]);
  
  // Effect for notifications
  useEffect(() => {
    const subscription = notificationService.subscribe(userId, (notification) => {
      setNotifications(prev => [...prev, notification]);
    });
    
    return () => subscription.unsubscribe();
  }, [userId]);
  
  return (
    <div>
      <h1>{user?.name}</h1>
      <div>Posts: {posts.length}</div>
      <div>Notifications: {notifications.length}</div>
    </div>
  );
}
```

### 2. Effect with Ref
```javascript
function AutoFocusInput() {
  const inputRef = useRef(null);
  
  useEffect(() => {
    // Focus the input after component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []); // Empty dependency array
  
  return <input ref={inputRef} placeholder="Auto-focused input" />;
}
```

### 3. Effect with Previous Value
```javascript
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}

function CounterWithPrevious() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  
  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## Performance Optimization

### 1. Memoized Effect Dependencies
```javascript
function ExpensiveComponent({ items, filter }) {
  const [filteredItems, setFilteredItems] = useState([]);
  
  // Memoize the expensive calculation
  const expensiveValue = useMemo(() => {
    return items.map(item => ({
      ...item,
      processed: expensiveCalculation(item)
    }));
  }, [items]);
  
  useEffect(() => {
    const filtered = expensiveValue.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [expensiveValue, filter]);
  
  return (
    <div>
      {filteredItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### 2. Effect with Callback Ref
```javascript
function useCallbackRef() {
  const [node, setNode] = useState(null);
  
  const callbackRef = useCallback((node) => {
    setNode(node);
  }, []);
  
  useEffect(() => {
    if (node) {
      // Do something with the node
      node.focus();
    }
  }, [node]);
  
  return callbackRef;
}
```

## Common Mistakes and Solutions

### 1. Missing Dependencies
```javascript
// ❌ Wrong: Missing dependencies
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(response => response.json())
      .then(data => setUser(data));
  }, []); // Missing userId dependency
  
  return <div>{user?.name}</div>;
}

// ✅ Correct: Include all dependencies
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(response => response.json())
      .then(data => setUser(data));
  }, [userId]); // Include userId dependency
  
  return <div>{user?.name}</div>;
}
```

### 2. Infinite Loops
```javascript
// ❌ Wrong: Object dependency causing infinite loop
function UserProfile({ user }) {
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    setProfile(user); // This will cause infinite re-renders
  }, [user]); // user object changes on every render
  
  return <div>{profile?.name}</div>;
}

// ✅ Correct: Use specific properties or memoize
function UserProfile({ user }) {
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    setProfile(user);
  }, [user.id, user.name]); // Use specific properties
  
  return <div>{profile?.name}</div>;
}
```

### 3. Stale Closures
```javascript
// ❌ Wrong: Stale closure
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1); // This will always use the initial count value
    }, 1000);
    
    return () => clearInterval(interval);
  }, [count]); // This causes the effect to re-run every second
  
  return <div>Count: {count}</div>;
}

// ✅ Correct: Use functional update
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1); // Use functional update
    }, 1000);
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array
  
  return <div>Count: {count}</div>;
}
```

## Best Practices

1. **Always include dependencies**: Use ESLint plugin to catch missing dependencies
2. **Use cleanup functions**: Prevent memory leaks and unwanted side effects
3. **Avoid infinite loops**: Be careful with object dependencies
4. **Use functional updates**: When state depends on previous state
5. **Separate concerns**: Use multiple effects for different purposes
6. **Memoize expensive calculations**: Use useMemo for expensive dependencies
7. **Handle async operations**: Use proper cleanup for async operations

## Conclusion

The `useEffect` hook is powerful but requires careful understanding of its behavior. By following best practices and understanding common pitfalls, you can effectively manage side effects in your React components while avoiding performance issues and bugs.
