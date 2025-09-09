# State Management Patterns in React

## Overview

State management is one of the most critical aspects of building React applications. As applications grow in complexity, managing state becomes increasingly challenging. This article explores various state management patterns, from simple local state to complex global state solutions.

## Local State Management

### useState Hook
The most basic form of state management in React is the `useState` hook for local component state.

```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);
  
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

### useReducer Hook
For more complex state logic, `useReducer` provides a more predictable way to manage state.

```javascript
import { useReducer } from 'react';

const initialState = { count: 0, step: 1 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'setStep':
      return { ...state, step: action.payload };
    case 'reset':
      return initialState;
    default:
      throw new Error('Unknown action type');
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Step: {state.step}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <input 
        type="number" 
        value={state.step}
        onChange={(e) => dispatch({ type: 'setStep', payload: parseInt(e.target.value) })}
      />
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

## Context API for Global State

### Basic Context Pattern
The Context API allows you to share state across multiple components without prop drilling.

```javascript
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

function UserProvider({ children }) {
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
  
  const value = {
    user,
    loading,
    login,
    logout
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

// Usage
function App() {
  return (
    <UserProvider>
      <Header />
      <Main />
    </UserProvider>
  );
}

function Header() {
  const { user, logout } = useUser();
  
  return (
    <header>
      {user ? (
        <div>
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button>Login</button>
      )}
    </header>
  );
}
```

### Multiple Contexts Pattern
For better performance and organization, split contexts by domain.

```javascript
// User Context
const UserContext = createContext();
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // ... user logic
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

// Theme Context
const ThemeContext = createContext();
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  // ... theme logic
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
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

## Custom Hooks for State Logic

### Reusable State Logic
Custom hooks allow you to extract and reuse stateful logic across components.

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
  const [language, setLanguage] = useLocalStorage('language', 'en');
  
  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
    </div>
  );
}
```

### API State Management Hook
```javascript
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);
  
  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, error, refetch };
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error, refetch } = useApi(`/api/users/${userId}`);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

## External State Management Libraries

### Redux Toolkit
Redux Toolkit provides a more opinionated approach to Redux with less boilerplate.

```javascript
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0, step: 1 },
  reducers: {
    increment: (state) => {
      state.value += state.step;
    },
    decrement: (state) => {
      state.value -= state.step;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    reset: (state) => {
      state.value = 0;
    }
  }
});

export const { increment, decrement, setStep, reset } = counterSlice.actions;

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
});

// Usage in component
import { useSelector, useDispatch } from 'react-redux';

function Counter() {
  const count = useSelector(state => state.counter.value);
  const step = useSelector(state => state.counter.step);
  const dispatch = useDispatch();
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Step: {step}</p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <input 
        type="number" 
        value={step}
        onChange={(e) => dispatch(setStep(parseInt(e.target.value)))}
      />
      <button onClick={() => dispatch(reset())}>Reset</button>
    </div>
  );
}
```

### Zustand
Zustand is a lightweight state management library with a simple API.

```javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  step: 1,
  increment: () => set((state) => ({ count: state.count + state.step })),
  decrement: () => set((state) => ({ count: state.count - state.step })),
  setStep: (step) => set({ step }),
  reset: () => set({ count: 0 })
}));

// Usage in component
function Counter() {
  const { count, step, increment, decrement, setStep, reset } = useStore();
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Step: {step}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <input 
        type="number" 
        value={step}
        onChange={(e) => setStep(parseInt(e.target.value))}
      />
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Jotai
Jotai provides atomic state management with a bottom-up approach.

```javascript
import { atom, useAtom } from 'jotai';

const countAtom = atom(0);
const stepAtom = atom(1);

const incrementAtom = atom(
  null,
  (get, set) => set(countAtom, get(countAtom) + get(stepAtom))
);

const decrementAtom = atom(
  null,
  (get, set) => set(countAtom, get(countAtom) - get(stepAtom))
);

// Usage in component
function Counter() {
  const [count] = useAtom(countAtom);
  const [step, setStep] = useAtom(stepAtom);
  const [, increment] = useAtom(incrementAtom);
  const [, decrement] = useAtom(decrementAtom);
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Step: {step}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <input 
        type="number" 
        value={step}
        onChange={(e) => setStep(parseInt(e.target.value))}
      />
    </div>
  );
}
```

## State Management Patterns

### Container/Presentational Pattern
Separate logic from presentation by using container components for state management.

```javascript
// Container Component
function UserListContainer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  const handleDelete = async (id) => {
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <UserList 
      users={users} 
      loading={loading} 
      error={error} 
      onDelete={handleDelete} 
    />
  );
}

// Presentational Component
function UserList({ users, loading, error, onDelete }) {
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
          <button onClick={() => onDelete(user.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

### Higher-Order Component Pattern
Use HOCs to add state management capabilities to components.

```javascript
function withUserData(WrappedComponent) {
  return function WithUserDataComponent(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await fetch('/api/user');
          const userData = await response.json();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchUser();
    }, []);
    
    return (
      <WrappedComponent 
        {...props} 
        user={user} 
        loading={loading} 
      />
    );
  };
}

// Usage
const UserProfile = withUserData(function UserProfile({ user, loading }) {
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
});
```

### Render Props Pattern
Use render props to share stateful logic between components.

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

## State Management Best Practices

### 1. Choose the Right Tool
- **Local State**: Component-specific data that doesn't need to be shared
- **Context API**: Simple global state that doesn't change frequently
- **Redux**: Complex global state with time-travel debugging needs
- **Zustand**: Lightweight global state with simple API
- **Jotai**: Atomic state management with fine-grained updates

### 2. Normalize State Structure
```javascript
// ❌ Bad: Nested state
const state = {
  users: [
    { id: 1, name: 'John', posts: [{ id: 1, title: 'Post 1' }] }
  ]
};

// ✅ Good: Normalized state
const state = {
  users: {
    1: { id: 1, name: 'John' }
  },
  posts: {
    1: { id: 1, title: 'Post 1', userId: 1 }
  },
  userPosts: {
    1: [1]
  }
};
```

### 3. Use Immutable Updates
```javascript
// ❌ Bad: Mutating state
const newState = state;
newState.users.push(newUser);

// ✅ Good: Immutable update
const newState = {
  ...state,
  users: [...state.users, newUser]
};
```

### 4. Separate Concerns
```javascript
// Separate different types of state
const useUserState = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  // ... user logic
};

const useThemeState = () => {
  const [theme, setTheme] = useState('light');
  // ... theme logic
};
```

### 5. Use Memoization for Performance
```javascript
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return data.map(item => expensiveCalculation(item));
  }, [data]);
  
  return <div>{/* render processed data */}</div>;
});
```

## Conclusion

State management in React is about choosing the right tool for the job. Start with local state and gradually move to more complex solutions as your application grows. The key is to keep state as local as possible and only lift it up when necessary. Use custom hooks to extract and reuse stateful logic, and consider external libraries when the built-in solutions become insufficient.

Remember that there's no one-size-fits-all solution. The best state management approach depends on your specific use case, team preferences, and application requirements.
