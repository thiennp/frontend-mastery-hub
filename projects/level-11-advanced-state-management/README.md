# Advanced State Management Project

## Overview

This project demonstrates advanced state management patterns in React, including Context API, custom hooks, useReducer, and external state management libraries. The application is a comprehensive task management system with real-time updates, user authentication, and complex state interactions.

## Project Structure

```
level-11-advanced-state-management/
├── README.md
├── index.html
├── styles.css
├── app.js
├── src/
│   ├── contexts/
│   │   ├── AuthContext.js
│   │   ├── ThemeContext.js
│   │   ├── NotificationContext.js
│   │   └── TodoContext.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useLocalStorage.js
│   │   ├── useDebounce.js
│   │   └── useTodos.js
│   ├── components/
│   │   ├── TodoApp.js
│   │   ├── TodoList.js
│   │   ├── TodoItem.js
│   │   ├── TodoForm.js
│   │   ├── UserProfile.js
│   │   ├── ThemeToggle.js
│   │   └── NotificationCenter.js
│   ├── reducers/
│   │   ├── todoReducer.js
│   │   └── authReducer.js
│   └── utils/
│       ├── api.js
│       ├── storage.js
│       └── helpers.js
└── tests/
    ├── components.test.js
    ├── hooks.test.js
    └── contexts.test.js
```

## Features

### Core State Management
- **Context API**: Global state management with multiple contexts
- **useReducer**: Complex state logic with predictable updates
- **Custom Hooks**: Reusable stateful logic
- **Local Storage**: Persistent state across sessions
- **Real-time Updates**: Live state synchronization

### Authentication & User Management
- **User Authentication**: Login/logout with JWT tokens
- **User Profiles**: Profile management and settings
- **Session Management**: Automatic token refresh
- **Role-based Access**: Different permissions for different users

### Task Management
- **CRUD Operations**: Create, read, update, delete tasks
- **Task Filtering**: Filter by status, priority, assignee
- **Task Search**: Real-time search with debouncing
- **Task Categories**: Organize tasks by categories
- **Due Dates**: Task scheduling and reminders
- **Task Dependencies**: Task relationships and dependencies

### Advanced Features
- **Real-time Collaboration**: Multiple users working on tasks
- **Offline Support**: Work offline with sync when online
- **Theme Switching**: Light/dark mode with persistence
- **Notifications**: Real-time notifications system
- **Keyboard Shortcuts**: Power user features
- **Drag & Drop**: Reorder tasks with drag and drop
- **Bulk Operations**: Select and operate on multiple tasks
- **Export/Import**: Data portability features

## State Management Patterns

### 1. Context API with Multiple Providers

```javascript
// AuthContext.js
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const login = async (credentials) => {
    // Login logic
  };
  
  const logout = () => {
    // Logout logic
  };
  
  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  }), [user, loading]);
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 2. useReducer for Complex State

```javascript
// todoReducer.js
const initialState = {
  todos: [],
  loading: false,
  error: null,
  filter: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

export function todoReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_TODOS':
      return { ...state, todos: action.payload, loading: false };
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo
        )
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload.sortBy, sortOrder: action.payload.sortOrder };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}
```

### 3. Custom Hooks for Reusable Logic

```javascript
// useTodos.js
export function useTodos() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  
  const addTodo = useCallback((todo) => {
    dispatch({ type: 'ADD_TODO', payload: todo });
  }, []);
  
  const updateTodo = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_TODO', payload: { id, ...updates } });
  }, []);
  
  const deleteTodo = useCallback((id) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  }, []);
  
  const setFilter = useCallback((filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);
  
  const setSort = useCallback((sortBy, sortOrder) => {
    dispatch({ type: 'SET_SORT', payload: { sortBy, sortOrder } });
  }, []);
  
  const filteredTodos = useMemo(() => {
    let filtered = state.todos;
    
    if (state.filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (state.filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }
    
    return filtered.sort((a, b) => {
      const aValue = a[state.sortBy];
      const bValue = b[state.sortBy];
      
      if (state.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [state.todos, state.filter, state.sortBy, state.sortOrder]);
  
  return {
    ...state,
    filteredTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    setFilter,
    setSort
  };
}
```

### 4. API Integration with Custom Hooks

```javascript
// useApi.js
export function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          ...options
        });
        
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
    
    return () => {
      cancelled = true;
    };
  }, [url, JSON.stringify(options)]);
  
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options)]);
  
  return { data, loading, error, refetch };
}
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser
- Basic understanding of React hooks

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd level-11-advanced-state-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Environment Setup

1. **Create environment file**
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   REACT_APP_WS_URL=ws://localhost:3001
   REACT_APP_VERSION=1.0.0
   ```

## Usage Examples

### Basic Todo Management

```javascript
import { useTodos } from './hooks/useTodos';

function TodoApp() {
  const {
    todos,
    filteredTodos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    setFilter
  } = useTodos();
  
  const handleAddTodo = (text) => {
    const todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    addTodo(todo);
  };
  
  return (
    <div>
      <TodoForm onSubmit={handleAddTodo} />
      <TodoList 
        todos={filteredTodos}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}
```

### Authentication with Context

```javascript
import { useAuth } from './contexts/AuthContext';

function UserProfile() {
  const { user, loading, logout } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Real-time Updates

```javascript
import { useEffect } from 'react';
import { useTodos } from './hooks/useTodos';

function TodoApp() {
  const { addTodo, updateTodo, deleteTodo } = useTodos();
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    
    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      
      switch (type) {
        case 'TODO_ADDED':
          addTodo(data);
          break;
        case 'TODO_UPDATED':
          updateTodo(data.id, data);
          break;
        case 'TODO_DELETED':
          deleteTodo(data.id);
          break;
      }
    };
    
    return () => ws.close();
  }, [addTodo, updateTodo, deleteTodo]);
  
  return <div>Todo App with real-time updates</div>;
}
```

## Testing

### Component Testing

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoApp } from './components/TodoApp';
import { TodoProvider } from './contexts/TodoContext';

test('renders todo app', () => {
  render(
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  );
  
  expect(screen.getByText('Todo App')).toBeInTheDocument();
});
```

### Hook Testing

```javascript
import { renderHook, act } from '@testing-library/react';
import { useTodos } from './hooks/useTodos';

test('useTodos hook', () => {
  const { result } = renderHook(() => useTodos());
  
  act(() => {
    result.current.addTodo({ id: 1, text: 'Test todo', completed: false });
  });
  
  expect(result.current.todos).toHaveLength(1);
  expect(result.current.todos[0].text).toBe('Test todo');
});
```

## Performance Optimization

### 1. Memoization

```javascript
const TodoItem = React.memo(function TodoItem({ todo, onUpdate, onDelete }) {
  const handleToggle = useCallback(() => {
    onUpdate(todo.id, { completed: !todo.completed });
  }, [todo.id, todo.completed, onUpdate]);
  
  const handleDelete = useCallback(() => {
    onDelete(todo.id);
  }, [todo.id, onDelete]);
  
  return (
    <div>
      <input 
        type="checkbox" 
        checked={todo.completed}
        onChange={handleToggle}
      />
      <span>{todo.text}</span>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
});
```

### 2. Context Optimization

```javascript
const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  
  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    ...state,
    dispatch
  }), [state]);
  
  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}
```

## Best Practices

### 1. State Structure
- Keep state as local as possible
- Normalize complex state structures
- Use immutable updates
- Separate concerns with multiple contexts

### 2. Performance
- Memoize context values
- Use useCallback for event handlers
- Implement proper cleanup
- Avoid unnecessary re-renders

### 3. Testing
- Test custom hooks in isolation
- Mock external dependencies
- Test error scenarios
- Use proper cleanup in tests

### 4. Error Handling
- Implement error boundaries
- Handle async errors gracefully
- Provide user-friendly error messages
- Log errors for debugging

## Troubleshooting

### Common Issues

1. **Infinite Re-renders**
   - Check dependency arrays in useEffect
   - Memoize context values
   - Avoid creating objects in render

2. **Stale Closures**
   - Use functional updates
   - Include all dependencies
   - Use useCallback for stable references

3. **Memory Leaks**
   - Clean up subscriptions
   - Cancel async operations
   - Remove event listeners

## Resources

- [React Context API Documentation](https://reactjs.org/docs/context.html)
- [useReducer Hook Documentation](https://reactjs.org/docs/hooks-reference.html#usereducer)
- [Custom Hooks Documentation](https://reactjs.org/docs/hooks-custom.html)
- [State Management Best Practices](https://reactjs.org/docs/thinking-in-react.html)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Support

For questions and support:
- Create an issue in the repository
- Check the documentation
- Review the code examples
- Join the community discussions
