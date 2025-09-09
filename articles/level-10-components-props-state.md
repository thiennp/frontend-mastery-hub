# Components, Props, and State in React

## Overview

Components are the building blocks of React applications. They are reusable pieces of UI that can accept inputs (props) and maintain internal state. Understanding how to create, compose, and manage components is fundamental to React development.

## Components

### Functional Components
Modern React uses functional components as the primary way to create components. They are JavaScript functions that return JSX.

```javascript
// Simple functional component
function Welcome() {
  return <h1>Hello, World!</h1>;
}

// Arrow function component
const Welcome = () => {
  return <h1>Hello, World!</h1>;
};

// Implicit return
const Welcome = () => <h1>Hello, World!</h1>;
```

### Class Components
Class components are the traditional way to create components in React. They're still used but functional components with hooks are preferred.

```javascript
class Welcome extends React.Component {
  render() {
    return <h1>Hello, World!</h1>;
  }
}
```

### Component Composition
Components can be composed together to build complex UIs.

```javascript
function App() {
  return (
    <div>
      <Header />
      <Main>
        <Sidebar />
        <Content />
      </Main>
      <Footer />
    </div>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}
```

## Props

Props (short for properties) are how you pass data from parent components to child components. They are read-only and immutable.

### Basic Props
```javascript
// Parent component
function App() {
  const name = "John";
  const age = 25;
  
  return <UserCard name={name} age={age} />;
}

// Child component
function UserCard({ name, age }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  );
}
```

### Props with Default Values
```javascript
function Button({ 
  text = "Click me", 
  variant = "primary", 
  size = "medium" 
}) {
  return (
    <button className={`btn btn-${variant} btn-${size}`}>
      {text}
    </button>
  );
}

// Usage
<Button /> {/* Uses default values */}
<Button text="Submit" variant="secondary" />
```

### Props Validation with PropTypes
```javascript
import PropTypes from 'prop-types';

function UserCard({ name, age, email }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
    </div>
  );
}

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  email: PropTypes.string
};

UserCard.defaultProps = {
  email: 'No email provided'
};
```

### Children Props
The `children` prop allows you to pass JSX elements as children to a component.

```javascript
function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

// Usage
<Card title="User Profile">
  <p>This is the card content</p>
  <button>Edit Profile</button>
</Card>
```

### Spread Props
You can use the spread operator to pass multiple props at once.

```javascript
function Button({ className, ...props }) {
  return (
    <button className={`btn ${className}`} {...props}>
      {props.children}
    </button>
  );
}

// Usage
<Button 
  className="custom-btn" 
  onClick={handleClick}
  disabled={isLoading}
>
  Click me
</Button>
```

## State

State represents data that can change over time. In functional components, state is managed using the `useState` hook.

### Basic State
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
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
    </div>
  );
}
```

### Multiple State Variables
```javascript
function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  
  return (
    <form>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="number"
        value={age}
        onChange={(e) => setAge(parseInt(e.target.value))}
        placeholder="Age"
      />
    </form>
  );
}
```

### Object State
```javascript
function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });
  
  const updateUser = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
  };
  
  return (
    <form>
      <input 
        value={user.name}
        onChange={(e) => updateUser('name', e.target.value)}
        placeholder="Name"
      />
      <input 
        value={user.email}
        onChange={(e) => updateUser('email', e.target.value)}
        placeholder="Email"
      />
      <input 
        type="number"
        value={user.age}
        onChange={(e) => updateUser('age', parseInt(e.target.value))}
        placeholder="Age"
      />
    </form>
  );
}
```

### Array State
```javascript
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos(prevTodos => [
        ...prevTodos,
        { id: Date.now(), text: newTodo, completed: false }
      ]);
      setNewTodo('');
    }
  };
  
  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  return (
    <div>
      <input 
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add todo"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input 
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ 
              textDecoration: todo.completed ? 'line-through' : 'none' 
            }}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Component Lifecycle

### Functional Components with useEffect
```javascript
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Component did mount
  useEffect(() => {
    fetchUser(userId).then(userData => {
      setUser(userData);
      setLoading(false);
    });
  }, [userId]);
  
  // Component did update
  useEffect(() => {
    if (user) {
      document.title = `${user.name} - Profile`;
    }
  }, [user]);
  
  // Component will unmount
  useEffect(() => {
    return () => {
      // Cleanup function
      console.log('Component unmounting');
    };
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Class Component Lifecycle
```javascript
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true
    };
  }
  
  componentDidMount() {
    this.fetchUser(this.props.userId);
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      this.fetchUser(this.props.userId);
    }
  }
  
  componentWillUnmount() {
    // Cleanup
    console.log('Component unmounting');
  }
  
  fetchUser = async (userId) => {
    this.setState({ loading: true });
    try {
      const user = await fetchUser(userId);
      this.setState({ user, loading: false });
    } catch (error) {
      this.setState({ loading: false });
    }
  };
  
  render() {
    const { user, loading } = this.state;
    
    if (loading) return <div>Loading...</div>;
    
    return (
      <div>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </div>
    );
  }
}
```

## Event Handling

### Basic Event Handling
```javascript
function Button() {
  const handleClick = () => {
    console.log('Button clicked!');
  };
  
  return <button onClick={handleClick}>Click me</button>;
}
```

### Event Handling with Parameters
```javascript
function TodoItem({ todo, onToggle, onDelete }) {
  const handleToggle = () => {
    onToggle(todo.id);
  };
  
  const handleDelete = () => {
    onDelete(todo.id);
  };
  
  return (
    <li>
      <input 
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
      />
      <span>{todo.text}</span>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}
```

### Synthetic Events
React uses synthetic events that wrap native events for cross-browser compatibility.

```javascript
function Form() {
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log('Form submitted');
  };
  
  const handleInputChange = (e) => {
    console.log('Input value:', e.target.value);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleInputChange} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Conditional Rendering

### If Statements
```javascript
function UserGreeting({ user }) {
  if (user) {
    return <h1>Welcome back, {user.name}!</h1>;
  }
  return <h1>Please log in.</h1>;
}
```

### Ternary Operators
```javascript
function UserStatus({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <p>Welcome back!</p>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  );
}
```

### Logical AND Operator
```javascript
function Notification({ message }) {
  return (
    <div>
      {message && <div className="notification">{message}</div>}
    </div>
  );
}
```

### Switch Statements
```javascript
function StatusIndicator({ status }) {
  switch (status) {
    case 'loading':
      return <div className="spinner">Loading...</div>;
    case 'success':
      return <div className="success">Success!</div>;
    case 'error':
      return <div className="error">Error occurred</div>;
    default:
      return <div className="unknown">Unknown status</div>;
  }
}
```

## Lists and Keys

### Rendering Lists
```javascript
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}
```

### Keys
Keys help React identify which items have changed, been added, or removed.

```javascript
function UserList({ users }) {
  return (
    <div>
      {users.map(user => (
        <UserCard 
          key={user.id} // Unique key for each user
          user={user}
        />
      ))}
    </div>
  );
}
```

## Best Practices

### 1. Component Naming
- Use PascalCase for component names
- Use descriptive names that indicate purpose

```javascript
// Good
function UserProfileCard() { }
function NavigationMenu() { }
function SearchInput() { }

// Bad
function Card() { }
function Menu() { }
function Input() { }
```

### 2. Props Destructuring
- Destructure props for cleaner code
- Use default values for optional props

```javascript
// Good
function UserCard({ name, email, avatar, isOnline = false }) {
  return (
    <div className={`user-card ${isOnline ? 'online' : 'offline'}`}>
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
}

// Bad
function UserCard(props) {
  return (
    <div className={`user-card ${props.isOnline ? 'online' : 'offline'}`}>
      <img src={props.avatar} alt={props.name} />
      <h3>{props.name}</h3>
      <p>{props.email}</p>
    </div>
  );
}
```

### 3. State Management
- Keep state as local as possible
- Lift state up when multiple components need it
- Use appropriate state management solutions for complex state

```javascript
// Good: Local state
function Counter() {
  const [count, setCount] = useState(0);
  // ... component logic
}

// Good: Lifted state
function App() {
  const [user, setUser] = useState(null);
  
  return (
    <div>
      <Header user={user} />
      <Main user={user} />
    </div>
  );
}
```

## Conclusion

Understanding components, props, and state is fundamental to React development. Components are the building blocks of React applications, props allow data to flow down from parent to child components, and state enables components to manage their own data and respond to user interactions.

By mastering these concepts, you'll be able to create reusable, maintainable, and interactive user interfaces. Remember to keep components small and focused, use props for data flow, and manage state appropriately for your application's needs.
