// React Task Manager Application

const { useState, useEffect, useReducer, useMemo, useCallback, createContext, useContext } = React;
const { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } = ReactRouterDOM;

// Mock API Service
class TaskAPI {
  constructor() {
    this.tasks = [
      {
        id: 1,
        title: 'Complete React project',
        description: 'Build a comprehensive task management application using React',
        priority: 'high',
        status: 'in-progress',
        assignee: 'John Doe',
        dueDate: '2024-01-15',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 2,
        title: 'Review Vue implementation',
        description: 'Review and test the Vue.js version of the application',
        priority: 'medium',
        status: 'todo',
        assignee: 'Jane Smith',
        dueDate: '2024-01-20',
        createdAt: '2024-01-02',
        updatedAt: '2024-01-02'
      },
      {
        id: 3,
        title: 'Write documentation',
        description: 'Create comprehensive documentation for all framework implementations',
        priority: 'low',
        status: 'completed',
        assignee: 'Bob Johnson',
        dueDate: '2024-01-10',
        createdAt: '2024-01-03',
        updatedAt: '2024-01-03'
      }
    ];
    this.users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'JD' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'JS' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', avatar: 'BJ' }
    ];
  }

  async getTasks() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.tasks];
  }

  async getTask(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.tasks.find(task => task.id === parseInt(id));
  }

  async createTask(task) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTask = {
      ...task,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    this.tasks.push(newTask);
    return newTask;
  }

  async updateTask(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = this.tasks.findIndex(task => task.id === parseInt(id));
    if (index !== -1) {
      this.tasks[index] = { ...this.tasks[index], ...updates, updatedAt: new Date().toISOString().split('T')[0] };
      return this.tasks[index];
    }
    throw new Error('Task not found');
  }

  async deleteTask(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = this.tasks.findIndex(task => task.id === parseInt(id));
    if (index !== -1) {
      this.tasks.splice(index, 1);
      return true;
    }
    throw new Error('Task not found');
  }

  async getUsers() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.users];
  }
}

// Context
const AppContext = createContext();

// Custom Hooks
function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskAPI.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    try {
      const newTask = await taskAPI.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id, updates) => {
    try {
      const updatedTask = await taskAPI.updateTask(id, updates);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      await taskAPI.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
}

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  return [storedValue, setValue];
}

// Components
function Header() {
  const location = useLocation();
  const [user, setUser] = useLocalStorage('user', null);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'fas fa-home' },
    { path: '/tasks', label: 'Tasks', icon: 'fas fa-tasks' },
    { path: '/analytics', label: 'Analytics', icon: 'fas fa-chart-bar' }
  ];

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__brand">
          <div className="header__logo">
            <i className="fab fa-react"></i>
          </div>
          <h1 className="header__title">Task Manager - React</h1>
        </div>
        
        <nav className="header__nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <i className={item.icon}></i>
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="header__actions">
          {user ? (
            <div className="user-menu">
              <span>Welcome, {user.name}</span>
              <button 
                className="btn btn--outline btn--sm"
                onClick={() => setUser(null)}
              >
                Logout
              </button>
            </div>
          ) : (
            <button className="btn btn--primary btn--sm">
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function StatCard({ title, value, change, icon, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card__header">
        <span className="stat-card__title">{title}</span>
        <div className={`stat-card__icon stat-card__icon--${color}`}>
          <i className={icon}></i>
        </div>
      </div>
      <div className="stat-card__value">{value}</div>
      {change && (
        <div className={`stat-card__change stat-card__change--${change.type}`}>
          <i className={`fas fa-arrow-${change.type === 'positive' ? 'up' : 'down'}`}></i>
          {change.value}
        </div>
      )}
    </div>
  );
}

function TaskItem({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    assignee: task.assignee,
    dueDate: task.dueDate
  });

  const handleSave = async () => {
    try {
      await onUpdate(task.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      assignee: task.assignee,
      dueDate: task.dueDate
    });
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'todo': return 'secondary';
      default: return 'secondary';
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && task.status !== 'completed';
  };

  const isDueSoon = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0 && task.status !== 'completed';
  };

  if (isEditing) {
    return (
      <div className="task-item">
        <div className="form-group">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="form-group__input"
            placeholder="Task title"
          />
        </div>
        <div className="form-group">
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="form-group__textarea"
            placeholder="Task description"
            rows="3"
          />
        </div>
        <div className="form-group">
          <select
            value={editData.priority}
            onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
            className="form-group__select"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
        <div className="form-group">
          <select
            value={editData.status}
            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
            className="form-group__select"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="form-group">
          <input
            type="date"
            value={editData.dueDate}
            onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
            className="form-group__input"
          />
        </div>
        <div className="task-item__actions">
          <button className="btn btn--success btn--sm" onClick={handleSave}>
            <i className="fas fa-save"></i>
            Save
          </button>
          <button className="btn btn--secondary btn--sm" onClick={handleCancel}>
            <i className="fas fa-times"></i>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}>
      <div className="task-item__header">
        <h3 className="task-item__title">{task.title}</h3>
        <span className={`task-item__priority task-item__priority--${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>
      
      <p className="task-item__description">{task.description}</p>
      
      <div className="task-item__meta">
        <div className="task-item__assignee">
          <div className="task-item__assignee-avatar">
            {task.assignee.split(' ').map(n => n[0]).join('')}
          </div>
          <span>{task.assignee}</span>
        </div>
        
        <div className={`task-item__due-date ${
          isOverdue(task.dueDate) ? 'overdue' : 
          isDueSoon(task.dueDate) ? 'due-soon' : ''
        }`}>
          <i className="fas fa-calendar"></i>
          {new Date(task.dueDate).toLocaleDateString()}
        </div>
        
        <span className={`btn btn--${getStatusColor(task.status)} btn--sm`}>
          {task.status.replace('-', ' ')}
        </span>
      </div>
      
      <div className="task-item__actions">
        <button 
          className="btn btn--outline btn--sm"
          onClick={() => setIsEditing(true)}
        >
          <i className="fas fa-edit"></i>
          Edit
        </button>
        <button 
          className="btn btn--error btn--sm"
          onClick={() => onDelete(task.id)}
        >
          <i className="fas fa-trash"></i>
          Delete
        </button>
      </div>
    </div>
  );
}

function TaskList({ tasks, onUpdate, onDelete, loading, error }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  if (loading) {
    return (
      <div className="task-list">
        <div className="loading">
          <div className="loading__spinner"></div>
          Loading tasks...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-list">
        <div className="empty-state">
          <div className="empty-state__icon">⚠️</div>
          <h3 className="empty-state__title">Error Loading Tasks</h3>
          <p className="empty-state__description">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="task-list__header">
        <h2 className="task-list__title">Tasks ({filteredTasks.length})</h2>
        <div className="task-list__actions">
          <button className="btn btn--primary">
            <i className="fas fa-plus"></i>
            Add Task
          </button>
        </div>
      </div>
      
      <div className="task-list__content">
        <div className="task-list__filters">
          <div className="task-list__search">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-group__input"
            />
          </div>
          
          <div className="task-list__filter">
            <label>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-group__select"
            >
              <option value="all">All</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="task-list__filter">
            <label>Priority:</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="form-group__select"
            >
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        
        <div className="task-list__items">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">📝</div>
              <h3 className="empty-state__title">No tasks found</h3>
              <p className="empty-state__description">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Create your first task to get started'
                }
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ tasks }) {
  const statusCounts = useMemo(() => {
    return tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});
  }, [tasks]);

  const priorityCounts = useMemo(() => {
    return tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});
  }, [tasks]);

  const overdueCount = useMemo(() => {
    const today = new Date();
    return tasks.filter(task => 
      new Date(task.dueDate) < today && task.status !== 'completed'
    ).length;
  }, [tasks]);

  return (
    <div className="sidebar">
      <h3 className="sidebar__title">Quick Stats</h3>
      
      <div className="sidebar__section">
        <h4 className="sidebar__section-title">Status</h4>
        <ul className="sidebar__list">
          <li className="sidebar__item">
            <span>To Do</span>
            <span className="sidebar__item-count">{statusCounts.todo || 0}</span>
          </li>
          <li className="sidebar__item">
            <span>In Progress</span>
            <span className="sidebar__item-count">{statusCounts['in-progress'] || 0}</span>
          </li>
          <li className="sidebar__item">
            <span>Completed</span>
            <span className="sidebar__item-count">{statusCounts.completed || 0}</span>
          </li>
        </ul>
      </div>
      
      <div className="sidebar__section">
        <h4 className="sidebar__section-title">Priority</h4>
        <ul className="sidebar__list">
          <li className="sidebar__item">
            <span>High</span>
            <span className="sidebar__item-count">{priorityCounts.high || 0}</span>
          </li>
          <li className="sidebar__item">
            <span>Medium</span>
            <span className="sidebar__item-count">{priorityCounts.medium || 0}</span>
          </li>
          <li className="sidebar__item">
            <span>Low</span>
            <span className="sidebar__item-count">{priorityCounts.low || 0}</span>
          </li>
        </ul>
      </div>
      
      <div className="sidebar__section">
        <h4 className="sidebar__section-title">Alerts</h4>
        <ul className="sidebar__list">
          <li className="sidebar__item">
            <span>Overdue</span>
            <span className="sidebar__item-count">{overdueCount}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function Dashboard() {
  const { tasks, loading, error } = useTasks();
  
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const overdue = tasks.filter(task => 
      new Date(task.dueDate) < new Date() && task.status !== 'completed'
    ).length;
    
    return { total, completed, inProgress, overdue };
  }, [tasks]);

  if (loading) {
    return (
      <div className="main">
        <div className="loading">
          <div className="loading__spinner"></div>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <div className="dashboard">
        <div className="dashboard__main">
          <div className="stats-grid">
            <StatCard
              title="Total Tasks"
              value={stats.total}
              icon="fas fa-tasks"
              color="primary"
            />
            <StatCard
              title="Completed"
              value={stats.completed}
              icon="fas fa-check-circle"
              color="success"
            />
            <StatCard
              title="In Progress"
              value={stats.inProgress}
              icon="fas fa-clock"
              color="warning"
            />
            <StatCard
              title="Overdue"
              value={stats.overdue}
              icon="fas fa-exclamation-triangle"
              color="error"
            />
          </div>
          
          <TaskList 
            tasks={tasks} 
            onUpdate={() => {}} 
            onDelete={() => {}} 
            loading={loading}
            error={error}
          />
        </div>
        
        <div className="dashboard__sidebar">
          <Sidebar tasks={tasks} />
        </div>
      </div>
    </div>
  );
}

function Tasks() {
  const { tasks, loading, error, updateTask, deleteTask } = useTasks();

  return (
    <div className="main">
      <TaskList 
        tasks={tasks} 
        onUpdate={updateTask} 
        onDelete={deleteTask} 
        loading={loading}
        error={error}
      />
    </div>
  );
}

function Analytics() {
  const { tasks, loading } = useTasks();
  
  const analytics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const priorityDistribution = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});
    
    const statusDistribution = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});
    
    return {
      total,
      completed,
      completionRate,
      priorityDistribution,
      statusDistribution
    };
  }, [tasks]);

  if (loading) {
    return (
      <div className="main">
        <div className="loading">
          <div className="loading__spinner"></div>
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <div className="stats-grid">
        <StatCard
          title="Completion Rate"
          value={`${analytics.completionRate}%`}
          icon="fas fa-chart-pie"
          color="success"
        />
        <StatCard
          title="Total Tasks"
          value={analytics.total}
          icon="fas fa-tasks"
          color="primary"
        />
        <StatCard
          title="Completed"
          value={analytics.completed}
          icon="fas fa-check-circle"
          color="success"
        />
        <StatCard
          title="Remaining"
          value={analytics.total - analytics.completed}
          icon="fas fa-hourglass-half"
          color="warning"
        />
      </div>
      
      <div className="dashboard">
        <div className="dashboard__main">
          <div className="task-list">
            <div className="task-list__header">
              <h2 className="task-list__title">Priority Distribution</h2>
            </div>
            <div className="task-list__content">
              <div className="stats-grid">
                {Object.entries(analytics.priorityDistribution).map(([priority, count]) => (
                  <div key={priority} className="stat-card">
                    <div className="stat-card__header">
                      <span className="stat-card__title">{priority.toUpperCase()}</span>
                    </div>
                    <div className="stat-card__value">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard__sidebar">
          <Sidebar tasks={tasks} />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useLocalStorage('user', null);

  useEffect(() => {
    // Simulate user login
    if (!user) {
      setUser({ id: 1, name: 'John Doe', email: 'john@example.com' });
    }
  }, [user, setUser]);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

// Initialize the app
const taskAPI = new TaskAPI();
ReactDOM.render(<App />, document.getElementById('root'));
