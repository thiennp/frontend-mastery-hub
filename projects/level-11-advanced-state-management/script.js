/**
 * Advanced State Management Project
 * Demonstrates React-like state management patterns using vanilla JavaScript
 */

// State Management System
class StateManager {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.listeners = new Set();
    this.middleware = [];
  }

  // Get current state
  getState() {
    return { ...this.state };
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Dispatch state updates
  dispatch(updater) {
    const prevState = { ...this.state };
    
    // Apply middleware
    let newState = updater(this.state);
    
    // Run through middleware
    for (const middleware of this.middleware) {
      newState = middleware(prevState, newState);
    }
    
    this.state = newState;
    
    // Notify listeners
    this.listeners.forEach(listener => listener(this.state, prevState));
  }

  // Add middleware
  addMiddleware(middleware) {
    this.middleware.push(middleware);
  }

  // Reset state
  reset(newState = {}) {
    this.dispatch(() => newState);
  }
}

// Middleware for logging
const loggerMiddleware = (prevState, newState) => {
  console.log('State changed:', {
    prev: prevState,
    next: newState,
    timestamp: new Date().toISOString()
  });
  return newState;
};

// Middleware for persistence
const persistenceMiddleware = (prevState, newState) => {
  if (newState.todos !== prevState.todos) {
    localStorage.setItem('todos', JSON.stringify(newState.todos));
  }
  if (newState.user !== prevState.user) {
    localStorage.setItem('user', JSON.stringify(newState.user));
  }
  return newState;
};

// Todo Management System
class TodoManager {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.initializeState();
  }

  initializeState() {
    const savedTodos = localStorage.getItem('todos');
    const savedUser = localStorage.getItem('user');
    
    this.stateManager.dispatch(state => ({
      ...state,
      todos: savedTodos ? JSON.parse(savedTodos) : [],
      user: savedUser ? JSON.parse(savedUser) : {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'JD'
      },
      filters: {
        status: 'all',
        priority: 'all',
        search: ''
      },
      ui: {
        loading: false,
        error: null,
        theme: 'light'
      }
    }));
  }

  // Todo CRUD operations
  addTodo(todo) {
    this.stateManager.dispatch(state => ({
      ...state,
      todos: [...state.todos, {
        id: Date.now(),
        ...todo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]
    }));
  }

  updateTodo(id, updates) {
    this.stateManager.dispatch(state => ({
      ...state,
      todos: state.todos.map(todo =>
        todo.id === id
          ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
          : todo
      )
    }));
  }

  deleteTodo(id) {
    this.stateManager.dispatch(state => ({
      ...state,
      todos: state.todos.filter(todo => todo.id !== id)
    }));
  }

  toggleTodo(id) {
    this.stateManager.dispatch(state => ({
      ...state,
      todos: state.todos.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
          : todo
      )
    }));
  }

  // Filter operations
  setFilter(filterType, value) {
    this.stateManager.dispatch(state => ({
      ...state,
      filters: {
        ...state.filters,
        [filterType]: value
      }
    }));
  }

  // Get filtered todos
  getFilteredTodos() {
    const { todos, filters } = this.stateManager.getState();
    
    return todos.filter(todo => {
      // Status filter
      if (filters.status === 'completed' && !todo.completed) return false;
      if (filters.status === 'pending' && todo.completed) return false;
      
      // Priority filter
      if (filters.priority !== 'all' && todo.priority !== filters.priority) return false;
      
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesTitle = todo.title.toLowerCase().includes(searchTerm);
        const matchesDescription = todo.description.toLowerCase().includes(searchTerm);
        if (!matchesTitle && !matchesDescription) return false;
      }
      
      return true;
    });
  }

  // Statistics
  getStats() {
    const { todos } = this.stateManager.getState();
    
    return {
      total: todos.length,
      completed: todos.filter(todo => todo.completed).length,
      pending: todos.filter(todo => !todo.completed).length,
      overdue: todos.filter(todo => {
        if (todo.completed || !todo.dueDate) return false;
        return new Date(todo.dueDate) < new Date();
      }).length
    };
  }
}

// UI Components
class TodoApp {
  constructor() {
    this.stateManager = new StateManager();
    this.todoManager = new TodoManager(this.stateManager);
    this.initializeApp();
  }

  initializeApp() {
    // Add middleware
    this.stateManager.addMiddleware(loggerMiddleware);
    this.stateManager.addMiddleware(persistenceMiddleware);
    
    // Subscribe to state changes
    this.stateManager.subscribe((state) => this.render(state));
    
    // Initialize UI
    this.setupEventListeners();
    this.render(this.stateManager.getState());
  }

  setupEventListeners() {
    // Add todo form
    const addTodoForm = document.getElementById('addTodoForm');
    if (addTodoForm) {
      addTodoForm.addEventListener('submit', (e) => this.handleAddTodo(e));
    }

    // Filter controls
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const searchInput = document.getElementById('searchInput');

    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.todoManager.setFilter('status', e.target.value);
      });
    }

    if (priorityFilter) {
      priorityFilter.addEventListener('change', (e) => {
        this.todoManager.setFilter('priority', e.target.value);
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.todoManager.setFilter('search', e.target.value);
      });
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Modal controls
    this.setupModalControls();
  }

  setupModalControls() {
    const modal = document.getElementById('todoModal');
    const closeModal = document.getElementById('closeModal');
    const modalOverlay = document.querySelector('.modal-overlay');

    if (closeModal) {
      closeModal.addEventListener('click', () => this.closeModal());
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          this.closeModal();
        }
      });
    }

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
        this.closeModal();
      }
    });
  }

  handleAddTodo(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const todo = {
      title: formData.get('title'),
      description: formData.get('description'),
      priority: formData.get('priority'),
      dueDate: formData.get('dueDate'),
      assignee: formData.get('assignee')
    };

    // Validation
    if (!todo.title.trim()) {
      this.showNotification('Title is required', 'error');
      return;
    }

    this.todoManager.addTodo(todo);
    this.closeModal();
    this.showNotification('Todo added successfully', 'success');
    
    // Reset form
    e.target.reset();
  }

  handleToggleTodo(id) {
    this.todoManager.toggleTodo(id);
  }

  handleDeleteTodo(id) {
    if (confirm('Are you sure you want to delete this todo?')) {
      this.todoManager.deleteTodo(id);
      this.showNotification('Todo deleted successfully', 'success');
    }
  }

  handleEditTodo(id) {
    const { todos } = this.stateManager.getState();
    const todo = todos.find(t => t.id === id);
    
    if (todo) {
      // Populate form with todo data
      document.getElementById('editTitle').value = todo.title;
      document.getElementById('editDescription').value = todo.description;
      document.getElementById('editPriority').value = todo.priority;
      document.getElementById('editDueDate').value = todo.dueDate;
      document.getElementById('editAssignee').value = todo.assignee;
      
      // Show edit modal
      this.showEditModal(id);
    }
  }

  handleUpdateTodo(id) {
    const form = document.getElementById('editTodoForm');
    const formData = new FormData(form);
    
    const updates = {
      title: formData.get('title'),
      description: formData.get('description'),
      priority: formData.get('priority'),
      dueDate: formData.get('dueDate'),
      assignee: formData.get('assignee')
    };

    this.todoManager.updateTodo(id, updates);
    this.closeEditModal();
    this.showNotification('Todo updated successfully', 'success');
  }

  toggleTheme() {
    this.stateManager.dispatch(state => ({
      ...state,
      ui: {
        ...state.ui,
        theme: state.ui.theme === 'light' ? 'dark' : 'light'
      }
    }));
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', 
      this.stateManager.getState().ui.theme
    );
  }

  showModal() {
    const modal = document.getElementById('todoModal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    const modal = document.getElementById('todoModal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  showEditModal(id) {
    const modal = document.getElementById('editTodoModal');
    if (modal) {
      modal.dataset.todoId = id;
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  closeEditModal() {
    const modal = document.getElementById('editTodoModal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 1.2em; cursor: pointer;">&times;</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 3000);
  }

  render(state) {
    this.renderStats(state);
    this.renderTodos(state);
    this.renderSidebar(state);
  }

  renderStats(state) {
    const stats = this.todoManager.getStats();
    
    // Update stat cards
    const statCards = {
      total: document.querySelector('[data-stat="total"]'),
      completed: document.querySelector('[data-stat="completed"]'),
      pending: document.querySelector('[data-stat="pending"]'),
      overdue: document.querySelector('[data-stat="overdue"]')
    };

    Object.entries(statCards).forEach(([key, element]) => {
      if (element) {
        element.textContent = stats[key];
      }
    });
  }

  renderTodos(state) {
    const todosContainer = document.getElementById('todosContainer');
    if (!todosContainer) return;

    const filteredTodos = this.todoManager.getFilteredTodos();
    
    if (filteredTodos.length === 0) {
      todosContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">📝</div>
          <div class="empty-state__title">No todos found</div>
          <div class="empty-state__description">
            ${state.filters.search ? 'Try adjusting your search or filters.' : 'Create your first todo to get started!'}
          </div>
        </div>
      `;
      return;
    }

    todosContainer.innerHTML = filteredTodos.map(todo => this.renderTodoItem(todo)).join('');
  }

  renderTodoItem(todo) {
    const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
    const isOverdue = dueDate && dueDate < new Date() && !todo.completed;
    const isDueSoon = dueDate && dueDate < new Date(Date.now() + 24 * 60 * 60 * 1000) && !todo.completed;
    
    return `
      <div class="todo-item ${todo.completed ? 'completed' : ''}" data-todo-id="${todo.id}">
        <div class="todo-item__header">
          <div>
            <div class="todo-item__title">${this.escapeHtml(todo.title)}</div>
            <div class="todo-item__priority todo-item__priority--${todo.priority}">
              ${todo.priority}
            </div>
          </div>
        </div>
        
        <div class="todo-item__description">${this.escapeHtml(todo.description || '')}</div>
        
        <div class="todo-item__meta">
          <div class="todo-item__assignee">
            <div class="todo-item__assignee-avatar">${this.getInitials(todo.assignee)}</div>
            <span>${this.escapeHtml(todo.assignee)}</span>
          </div>
          
          ${dueDate ? `
            <div class="todo-item__due-date ${isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : ''}">
              📅 ${dueDate.toLocaleDateString()}
            </div>
          ` : ''}
        </div>
        
        <div class="todo-item__actions">
          <button class="btn btn--sm ${todo.completed ? 'btn--secondary' : 'btn--success'}" 
                  onclick="app.handleToggleTodo(${todo.id})">
            ${todo.completed ? 'Undo' : 'Complete'}
          </button>
          <button class="btn btn--sm btn--outline" 
                  onclick="app.handleEditTodo(${todo.id})">
            Edit
          </button>
          <button class="btn btn--sm btn--error" 
                  onclick="app.handleDeleteTodo(${todo.id})">
            Delete
          </button>
        </div>
      </div>
    `;
  }

  renderSidebar(state) {
    const sidebarContainer = document.getElementById('sidebarContainer');
    if (!sidebarContainer) return;

    const stats = this.todoManager.getStats();
    
    sidebarContainer.innerHTML = `
      <div class="sidebar">
        <h3 class="sidebar__title">Quick Stats</h3>
        
        <div class="sidebar__section">
          <div class="sidebar__section-title">Status</div>
          <ul class="sidebar__list">
            <li class="sidebar__item ${state.filters.status === 'all' ? 'active' : ''}" 
                onclick="app.todoManager.setFilter('status', 'all')">
              All Todos
              <span class="sidebar__item-count">${stats.total}</span>
            </li>
            <li class="sidebar__item ${state.filters.status === 'pending' ? 'active' : ''}" 
                onclick="app.todoManager.setFilter('status', 'pending')">
              Pending
              <span class="sidebar__item-count">${stats.pending}</span>
            </li>
            <li class="sidebar__item ${state.filters.status === 'completed' ? 'active' : ''}" 
                onclick="app.todoManager.setFilter('status', 'completed')">
              Completed
              <span class="sidebar__item-count">${stats.completed}</span>
            </li>
          </ul>
        </div>
        
        <div class="sidebar__section">
          <div class="sidebar__section-title">Priority</div>
          <ul class="sidebar__list">
            <li class="sidebar__item ${state.filters.priority === 'all' ? 'active' : ''}" 
                onclick="app.todoManager.setFilter('priority', 'all')">
              All Priorities
            </li>
            <li class="sidebar__item ${state.filters.priority === 'high' ? 'active' : ''}" 
                onclick="app.todoManager.setFilter('priority', 'high')">
              High Priority
            </li>
            <li class="sidebar__item ${state.filters.priority === 'medium' ? 'active' : ''}" 
                onclick="app.todoManager.setFilter('priority', 'medium')">
              Medium Priority
            </li>
            <li class="sidebar__item ${state.filters.priority === 'low' ? 'active' : ''}" 
                onclick="app.todoManager.setFilter('priority', 'low')">
              Low Priority
            </li>
          </ul>
        </div>
        
        ${stats.overdue > 0 ? `
          <div class="sidebar__section">
            <div class="sidebar__section-title">Attention</div>
            <ul class="sidebar__list">
              <li class="sidebar__item" style="color: var(--color-error);">
                ⚠️ Overdue
                <span class="sidebar__item-count">${stats.overdue}</span>
              </li>
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Utility methods
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  getInitials(name) {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}

// Custom Hooks (React-like patterns)
class CustomHooks {
  static useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        return initialValue;
      }
    });

    const setStoredValue = (value) => {
      try {
        setValue(value);
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    };

    return [value, setStoredValue];
  }

  static useDebounce(value, delay) {
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

  static useAsync(asyncFunction, dependencies = []) {
    const [state, setState] = useState({
      data: null,
      loading: false,
      error: null
    });

    useEffect(() => {
      let isMounted = true;

      const executeAsync = async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        try {
          const result = await asyncFunction();
          if (isMounted) {
            setState({ data: result, loading: false, error: null });
          }
        } catch (error) {
          if (isMounted) {
            setState({ data: null, loading: false, error: error.message });
          }
        }
      };

      executeAsync();

      return () => {
        isMounted = false;
      };
    }, dependencies);

    return state;
  }
}

// Simple state management for hooks
let hookState = [];
let hookIndex = 0;

function useState(initialValue) {
  const currentIndex = hookIndex++;
  
  if (hookState[currentIndex] === undefined) {
    hookState[currentIndex] = initialValue;
  }
  
  const setState = (newValue) => {
    hookState[currentIndex] = typeof newValue === 'function' 
      ? newValue(hookState[currentIndex])
      : newValue;
  };
  
  return [hookState[currentIndex], setState];
}

function useEffect(effect, dependencies) {
  const currentIndex = hookIndex++;
  const prevDependencies = hookState[currentIndex];
  
  const hasChanged = !dependencies || 
    !prevDependencies ||
    dependencies.some((dep, index) => dep !== prevDependencies[index]);
  
  if (hasChanged) {
    if (typeof effect === 'function') {
      const cleanup = effect();
      if (typeof cleanup === 'function') {
        hookState[currentIndex + 1] = cleanup;
      }
    }
    hookState[currentIndex] = dependencies;
  }
}

// Initialize the app
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new TodoApp();
  
  // Add some sample todos for demonstration
  if (app.stateManager.getState().todos.length === 0) {
    const sampleTodos = [
      {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the state management system',
        priority: 'high',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assignee: 'John Doe'
      },
      {
        title: 'Review code quality',
        description: 'Conduct code review and refactor if necessary',
        priority: 'medium',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assignee: 'Jane Smith'
      },
      {
        title: 'Update dependencies',
        description: 'Update all project dependencies to latest versions',
        priority: 'low',
        assignee: 'John Doe'
      }
    ];
    
    sampleTodos.forEach(todo => app.todoManager.addTodo(todo));
  }
});

// Export for global access
window.app = app;
window.TodoApp = TodoApp;
window.StateManager = StateManager;
window.CustomHooks = CustomHooks;
