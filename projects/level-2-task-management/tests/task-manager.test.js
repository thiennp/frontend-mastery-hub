// Task Management System Tests
// Run these tests in the browser console or with a testing framework

// Test Suite for Task Class
function testTaskClass() {
    console.log('Testing Task Class...');
    
    // Test 1: Task Creation
    try {
        const task = new Task('Test Task', 'Test Description', 'high', 'work', '2024-12-31', 'pending');
        
        if (task.title !== 'Test Task') throw new Error('Title not set correctly');
        if (task.description !== 'Test Description') throw new Error('Description not set correctly');
        if (task.priority !== 'high') throw new Error('Priority not set correctly');
        if (task.category !== 'work') throw new Error('Category not set correctly');
        if (task.status !== 'pending') throw new Error('Status not set correctly');
        if (!task.id) throw new Error('ID not generated');
        if (!task.createdAt) throw new Error('CreatedAt not set');
        
        console.log('✓ Task creation test passed');
    } catch (error) {
        console.error('✗ Task creation test failed:', error.message);
    }
    
    // Test 2: Task Update
    try {
        const task = new Task('Original Title', 'Original Description');
        task.update({ title: 'Updated Title', priority: 'high' });
        
        if (task.title !== 'Updated Title') throw new Error('Title not updated');
        if (task.priority !== 'high') throw new Error('Priority not updated');
        if (task.description !== 'Original Description') throw new Error('Description changed unexpectedly');
        
        console.log('✓ Task update test passed');
    } catch (error) {
        console.error('✗ Task update test failed:', error.message);
    }
    
    // Test 3: Task Overdue Check
    try {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        
        const overdueTask = new Task('Overdue Task', '', 'medium', 'work', pastDate.toISOString().split('T')[0]);
        const futureTask = new Task('Future Task', '', 'medium', 'work', '2025-12-31');
        
        if (!overdueTask.isOverdue()) throw new Error('Overdue task not detected as overdue');
        if (futureTask.isOverdue()) throw new Error('Future task incorrectly marked as overdue');
        
        console.log('✓ Task overdue check test passed');
    } catch (error) {
        console.error('✗ Task overdue check test failed:', error.message);
    }
    
    // Test 4: Task JSON Serialization
    try {
        const task = new Task('Test Task', 'Test Description', 'high', 'work', '2024-12-31', 'pending');
        const json = task.toJSON();
        const restoredTask = Task.fromJSON(json);
        
        if (restoredTask.title !== task.title) throw new Error('Title not restored correctly');
        if (restoredTask.description !== task.description) throw new Error('Description not restored correctly');
        if (restoredTask.priority !== task.priority) throw new Error('Priority not restored correctly');
        if (restoredTask.id !== task.id) throw new Error('ID not restored correctly');
        
        console.log('✓ Task JSON serialization test passed');
    } catch (error) {
        console.error('✗ Task JSON serialization test failed:', error.message);
    }
}

// Test Suite for TaskManager Class
function testTaskManagerClass() {
    console.log('Testing TaskManager Class...');
    
    // Test 1: Task Addition
    try {
        const taskManager = new TaskManager();
        const initialCount = taskManager.tasks.length;
        
        const taskData = {
            title: 'Test Task',
            description: 'Test Description',
            priority: 'high',
            category: 'work',
            dueDate: '2024-12-31',
            status: 'pending'
        };
        
        taskManager.addTask(taskData);
        
        if (taskManager.tasks.length !== initialCount + 1) throw new Error('Task not added');
        if (taskManager.tasks[taskManager.tasks.length - 1].title !== 'Test Task') throw new Error('Task data not set correctly');
        
        console.log('✓ Task addition test passed');
    } catch (error) {
        console.error('✗ Task addition test failed:', error.message);
    }
    
    // Test 2: Task Validation
    try {
        const taskManager = new TaskManager();
        
        // Test empty title
        try {
            taskManager.addTask({ title: '', description: 'Test' });
            throw new Error('Empty title should have thrown error');
        } catch (error) {
            if (error.name !== 'ValidationError') throw new Error('Wrong error type for empty title');
        }
        
        // Test short title
        try {
            taskManager.addTask({ title: 'ab', description: 'Test' });
            throw new Error('Short title should have thrown error');
        } catch (error) {
            if (error.name !== 'ValidationError') throw new Error('Wrong error type for short title');
        }
        
        // Test invalid priority
        try {
            taskManager.addTask({ title: 'Valid Title', priority: 'invalid' });
            throw new Error('Invalid priority should have thrown error');
        } catch (error) {
            if (error.name !== 'ValidationError') throw new Error('Wrong error type for invalid priority');
        }
        
        console.log('✓ Task validation test passed');
    } catch (error) {
        console.error('✗ Task validation test failed:', error.message);
    }
    
    // Test 3: Task Filtering
    try {
        const taskManager = new TaskManager();
        
        // Add test tasks
        taskManager.addTask({ title: 'Work Task', description: 'Work description', category: 'work', priority: 'high' });
        taskManager.addTask({ title: 'Personal Task', description: 'Personal description', category: 'personal', priority: 'low' });
        taskManager.addTask({ title: 'Another Work Task', description: 'Another work description', category: 'work', priority: 'medium' });
        
        // Test category filter
        taskManager.filters.category = 'work';
        const workTasks = taskManager.getFilteredTasks();
        if (workTasks.length !== 2) throw new Error('Category filter not working correctly');
        
        // Test priority filter
        taskManager.filters.category = '';
        taskManager.filters.priority = 'high';
        const highPriorityTasks = taskManager.getFilteredTasks();
        if (highPriorityTasks.length !== 1) throw new Error('Priority filter not working correctly');
        
        // Test search filter
        taskManager.filters.priority = '';
        taskManager.filters.search = 'work';
        const searchTasks = taskManager.getFilteredTasks();
        if (searchTasks.length !== 2) throw new Error('Search filter not working correctly');
        
        console.log('✓ Task filtering test passed');
    } catch (error) {
        console.error('✗ Task filtering test failed:', error.message);
    }
    
    // Test 4: Task Statistics
    try {
        const taskManager = new TaskManager();
        
        // Add test tasks with different statuses
        taskManager.addTask({ title: 'Task 1', status: 'pending' });
        taskManager.addTask({ title: 'Task 2', status: 'in-progress' });
        taskManager.addTask({ title: 'Task 3', status: 'completed' });
        taskManager.addTask({ title: 'Task 4', status: 'pending', priority: 'high' });
        
        const stats = taskManager.getTaskStatistics();
        
        if (stats.total !== 4) throw new Error('Total count incorrect');
        if (stats.pending !== 2) throw new Error('Pending count incorrect');
        if (stats.inProgress !== 1) throw new Error('In progress count incorrect');
        if (stats.completed !== 1) throw new Error('Completed count incorrect');
        if (stats.highPriority !== 1) throw new Error('High priority count incorrect');
        
        console.log('✓ Task statistics test passed');
    } catch (error) {
        console.error('✗ Task statistics test failed:', error.message);
    }
    
    // Test 5: Task Sorting
    try {
        const taskManager = new TaskManager();
        
        // Add test tasks
        taskManager.addTask({ title: 'Z Task', priority: 'low' });
        taskManager.addTask({ title: 'A Task', priority: 'high' });
        taskManager.addTask({ title: 'M Task', priority: 'medium' });
        
        // Test title sorting
        taskManager.sortBy = 'title';
        const titleSorted = taskManager.getSortedTasks();
        if (titleSorted[0].title !== 'A Task') throw new Error('Title sorting not working');
        
        // Test priority sorting
        taskManager.sortBy = 'priority';
        const prioritySorted = taskManager.getSortedTasks();
        if (prioritySorted[0].priority !== 'high') throw new Error('Priority sorting not working');
        
        console.log('✓ Task sorting test passed');
    } catch (error) {
        console.error('✗ Task sorting test failed:', error.message);
    }
}

// Test Suite for Error Handling
function testErrorHandling() {
    console.log('Testing Error Handling...');
    
    // Test 1: Custom Error Classes
    try {
        const validationError = new ValidationError('Test validation error', 'title');
        if (validationError.name !== 'ValidationError') throw new Error('ValidationError name incorrect');
        if (validationError.field !== 'title') throw new Error('ValidationError field incorrect');
        
        const taskError = new TaskError('Test task error');
        if (taskError.name !== 'TaskError') throw new Error('TaskError name incorrect');
        
        console.log('✓ Custom error classes test passed');
    } catch (error) {
        console.error('✗ Custom error classes test failed:', error.message);
    }
    
    // Test 2: Task Manager Error Handling
    try {
        const taskManager = new TaskManager();
        
        // Test task not found error
        try {
            taskManager.updateTask('nonexistent-id', { title: 'New Title' });
            throw new Error('Update non-existent task should have thrown error');
        } catch (error) {
            if (error.name !== 'TaskError') throw new Error('Wrong error type for non-existent task');
        }
        
        // Test delete non-existent task
        try {
            taskManager.deleteTask('nonexistent-id');
            throw new Error('Delete non-existent task should have thrown error');
        } catch (error) {
            if (error.name !== 'TaskError') throw new Error('Wrong error type for delete non-existent task');
        }
        
        console.log('✓ Task manager error handling test passed');
    } catch (error) {
        console.error('✗ Task manager error handling test failed:', error.message);
    }
}

// Test Suite for Functional Programming
function testFunctionalProgramming() {
    console.log('Testing Functional Programming...');
    
    // Test 1: Pure Functions
    try {
        const taskManager = new TaskManager();
        
        // Add test tasks
        taskManager.addTask({ title: 'Task 1', priority: 'high' });
        taskManager.addTask({ title: 'Task 2', priority: 'low' });
        taskManager.addTask({ title: 'Task 3', priority: 'high' });
        
        // Test statistics function (should be pure)
        const stats1 = taskManager.getTaskStatistics();
        const stats2 = taskManager.getTaskStatistics();
        
        if (JSON.stringify(stats1) !== JSON.stringify(stats2)) {
            throw new Error('Statistics function is not pure');
        }
        
        console.log('✓ Pure functions test passed');
    } catch (error) {
        console.error('✗ Pure functions test failed:', error.message);
    }
    
    // Test 2: Array Methods
    try {
        const taskManager = new TaskManager();
        
        // Add test tasks
        taskManager.addTask({ title: 'Work Task', category: 'work' });
        taskManager.addTask({ title: 'Personal Task', category: 'personal' });
        taskManager.addTask({ title: 'Another Work Task', category: 'work' });
        
        // Test filtering with array methods
        const workTasks = taskManager.tasks.filter(task => task.category === 'work');
        if (workTasks.length !== 2) throw new Error('Array filter not working');
        
        // Test mapping
        const taskTitles = taskManager.tasks.map(task => task.title);
        if (taskTitles.length !== 3) throw new Error('Array map not working');
        
        // Test reducing
        const totalTasks = taskManager.tasks.reduce((count, task) => count + 1, 0);
        if (totalTasks !== 3) throw new Error('Array reduce not working');
        
        console.log('✓ Array methods test passed');
    } catch (error) {
        console.error('✗ Array methods test failed:', error.message);
    }
}

// Test Suite for Control Flow
function testControlFlow() {
    console.log('Testing Control Flow...');
    
    // Test 1: Conditional Logic
    try {
        const taskManager = new TaskManager();
        
        // Add tasks with different statuses
        taskManager.addTask({ title: 'Pending Task', status: 'pending' });
        taskManager.addTask({ title: 'Completed Task', status: 'completed' });
        
        // Test conditional filtering
        const pendingTasks = taskManager.tasks.filter(task => task.status === 'pending');
        const completedTasks = taskManager.tasks.filter(task => task.status === 'completed');
        
        if (pendingTasks.length !== 1) throw new Error('Pending filter not working');
        if (completedTasks.length !== 1) throw new Error('Completed filter not working');
        
        console.log('✓ Conditional logic test passed');
    } catch (error) {
        console.error('✗ Conditional logic test failed:', error.message);
    }
    
    // Test 2: Loops
    try {
        const taskManager = new TaskManager();
        
        // Add multiple tasks
        for (let i = 0; i < 5; i++) {
            taskManager.addTask({ title: `Task ${i + 1}` });
        }
        
        if (taskManager.tasks.length !== 5) throw new Error('Loop not working correctly');
        
        // Test forEach
        let count = 0;
        taskManager.tasks.forEach(task => count++);
        if (count !== 5) throw new Error('forEach not working correctly');
        
        console.log('✓ Loops test passed');
    } catch (error) {
        console.error('✗ Loops test failed:', error.message);
    }
}

// Run All Tests
function runAllTests() {
    console.log('Starting Task Management System Tests...\n');
    
    testTaskClass();
    console.log('');
    
    testTaskManagerClass();
    console.log('');
    
    testErrorHandling();
    console.log('');
    
    testFunctionalProgramming();
    console.log('');
    
    testControlFlow();
    console.log('');
    
    console.log('All tests completed!');
}

// Export for use in browser console
if (typeof window !== 'undefined') {
    window.runAllTests = runAllTests;
    window.testTaskClass = testTaskClass;
    window.testTaskManagerClass = testTaskManagerClass;
    window.testErrorHandling = testErrorHandling;
    window.testFunctionalProgramming = testFunctionalProgramming;
    window.testControlFlow = testControlFlow;
}

// Auto-run tests if in browser
if (typeof window !== 'undefined' && window.location.pathname.includes('index.html')) {
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            console.log('Running tests automatically...');
            runAllTests();
        }, 1000);
    });
}

