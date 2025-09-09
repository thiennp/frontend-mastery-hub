/**
 * Advanced React Patterns Showcase
 * Demonstrates HOCs, Render Props, Compound Components, Custom Hooks, and Performance Optimization
 */

// Global state
let currentSection = 'hoc';
let counter = 0;
let virtualItems = [];
let renderCount = 0;
let isMemoized = false;
let hasError = false;
let debounceTimer = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeMouseTracker();
    initializeWindowSize();
    initializeDebounce();
    initializePerformanceMonitoring();
    loadFromStorage();
    updatePerformanceMetrics();
});

// Navigation
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.dataset.section;
            switchSection(targetSection);
        });
    });
}

function switchSection(sectionId) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

    // Update sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    currentSection = sectionId;
}

// HOC Examples
function toggleLoading() {
    const content = document.getElementById('loadingContent');
    content.innerHTML = '<div class="loading">Loading with HOC...</div>';
    
    setTimeout(() => {
        content.innerHTML = '<div class="success">HOC loaded successfully!</div>';
    }, 2000);
}

function triggerError() {
    const content = document.getElementById('errorContent');
    content.innerHTML = '<div class="error">Error caught by HOC!</div>';
    
    setTimeout(() => {
        content.innerHTML = '<div class="success">Error handled gracefully by HOC</div>';
    }, 3000);
}

function fetchData() {
    const content = document.getElementById('dataContent');
    content.innerHTML = '<div class="loading">Fetching data with HOC...</div>';
    
    setTimeout(() => {
        const mockData = [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
        ];
        
        content.innerHTML = `
            <div class="success">Data fetched successfully!</div>
            <ul style="margin-top: 10px;">
                ${mockData.map(user => `<li>${user.name} - ${user.email}</li>`).join('')}
            </ul>
        `;
    }, 1500);
}

// Render Props Examples
function initializeMouseTracker() {
    const mouseArea = document.getElementById('mouseArea');
    const mousePosition = document.getElementById('mousePosition');
    
    if (mouseArea && mousePosition) {
        mouseArea.addEventListener('mousemove', (e) => {
            const rect = mouseArea.getBoundingClientRect();
            const x = Math.round(e.clientX - rect.left);
            const y = Math.round(e.clientY - rect.top);
            mousePosition.textContent = `Mouse: (${x}, ${y})`;
        });
    }
}

function loadData() {
    const content = document.getElementById('providerContent');
    content.innerHTML = '<div class="loading">Loading data with render props...</div>';
    
    setTimeout(() => {
        content.innerHTML = `
            <div class="success">Data loaded with render props!</div>
            <p style="margin-top: 10px;">This demonstrates how render props can share data fetching logic between components.</p>
        `;
    }, 1000);
}

function initializeWindowSize() {
    const sizeInfo = document.getElementById('sizeInfo');
    
    if (sizeInfo) {
        const updateSize = () => {
            sizeInfo.innerHTML = `
                <div style="text-align: center;">
                    <h4>Window Size</h4>
                    <p>Width: ${window.innerWidth}px</p>
                    <p>Height: ${window.innerHeight}px</p>
                    <p>Device Pixel Ratio: ${window.devicePixelRatio}</p>
                </div>
            `;
        };
        
        updateSize();
        window.addEventListener('resize', updateSize);
    }
}

// Compound Components Examples
function switchTab(tabId) {
    // Remove active class from all tabs and panels
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    // Add active class to selected tab and panel
    event.target.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

function openModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('fade-in');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Custom Hooks Examples
function incrementCounter() {
    counter++;
    updateCounterDisplay();
}

function decrementCounter() {
    counter--;
    updateCounterDisplay();
}

function resetCounter() {
    counter = 0;
    updateCounterDisplay();
}

function updateCounterDisplay() {
    const counterValue = document.getElementById('counterValue');
    if (counterValue) {
        counterValue.textContent = counter;
    }
}

function saveToStorage() {
    const input = document.getElementById('storageInput');
    const value = input.value;
    if (value) {
        localStorage.setItem('demoValue', value);
        loadFromStorage();
    }
}

function loadFromStorage() {
    const value = localStorage.getItem('demoValue') || 'No value stored';
    const storageValue = document.getElementById('storageValue');
    if (storageValue) {
        storageValue.textContent = `Stored value: ${value}`;
    }
}

function initializeDebounce() {
    const input = document.getElementById('debounceInput');
    const debounceValue = document.getElementById('debounceValue');
    
    if (input && debounceValue) {
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                debounceValue.textContent = `Debounced value: ${e.target.value}`;
            }, 300);
        });
    }
}

// Performance Examples
function addVirtualItems() {
    const count = Math.floor(Math.random() * 50) + 10; // Add 10-60 items
    for (let i = 0; i < count; i++) {
        virtualItems.push({
            id: Date.now() + i,
            name: `Item ${virtualItems.length + 1}`,
            value: Math.random().toFixed(2)
        });
    }
    updateVirtualList();
    updatePerformanceMetrics();
}

function clearVirtualItems() {
    virtualItems = [];
    updateVirtualList();
    updatePerformanceMetrics();
}

function updateVirtualList() {
    const container = document.getElementById('virtualList');
    const countElement = document.getElementById('virtualCount');
    
    if (countElement) {
        countElement.textContent = `Items: ${virtualItems.length}`;
    }
    
    if (container) {
        container.innerHTML = '';
        
        if (virtualItems.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No items</div>';
            return;
        }

        // Virtual scrolling simulation
        const itemHeight = 50;
        const containerHeight = 300;
        const visibleCount = Math.ceil(containerHeight / itemHeight);
        const startIndex = Math.max(0, virtualItems.length - visibleCount);
        const endIndex = Math.min(virtualItems.length, startIndex + visibleCount);
        
        const visibleItems = virtualItems.slice(startIndex, endIndex);
        
        visibleItems.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'virtual-item';
            itemDiv.innerHTML = `
                <span>${item.name} (Value: ${item.value})</span>
                <button class="btn btn-danger" onclick="removeVirtualItem(${startIndex + index})" style="padding: 5px 10px; font-size: 0.8rem;">Remove</button>
            `;
            container.appendChild(itemDiv);
        });
    }
}

function removeVirtualItem(index) {
    virtualItems.splice(index, 1);
    updateVirtualList();
    updatePerformanceMetrics();
}

function toggleMemoization() {
    isMemoized = !isMemoized;
    const content = document.getElementById('memoContent');
    
    if (content) {
        content.innerHTML = `
            <div class="${isMemoized ? 'success' : 'error'}">
                Memoization is ${isMemoized ? 'enabled' : 'disabled'}
            </div>
            <p style="margin-top: 10px;">
                ${isMemoized 
                    ? 'Components are memoized to prevent unnecessary re-renders.' 
                    : 'Components will re-render on every parent update.'
                }
            </p>
        `;
    }
}

// Performance Monitoring
function initializePerformanceMonitoring() {
    // Monitor render performance
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'measure') {
                console.log(`${entry.name}: ${entry.duration}ms`);
            }
        }
    });
    
    observer.observe({ entryTypes: ['measure'] });
}

function updatePerformanceMetrics() {
    renderCount++;
    const startTime = performance.now();
    
    // Simulate some work
    setTimeout(() => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        const renderCountElement = document.getElementById('renderCount');
        const renderTimeElement = document.getElementById('renderTime');
        const memoryElement = document.getElementById('memoryUsage');
        
        if (renderCountElement) {
            renderCountElement.textContent = renderCount;
        }
        
        if (renderTimeElement) {
            renderTimeElement.textContent = `${renderTime.toFixed(2)}ms`;
            
            // Update performance indicators
            const parent = renderTimeElement.parentElement;
            parent.className = 'metric';
            if (renderTime < 16) {
                parent.classList.add('good');
            } else if (renderTime < 50) {
                parent.classList.add('warning');
            } else {
                parent.classList.add('bad');
            }
        }
        
        if (memoryElement && performance.memory) {
            const memoryMB = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
            memoryElement.textContent = `${memoryMB}MB`;
        }
    }, 0);
}

// Error Boundary Examples
function triggerBoundaryError() {
    hasError = true;
    const content = document.getElementById('boundaryContent');
    
    if (content) {
        content.innerHTML = `
            <div class="error">
                <h4>Error Boundary Caught This Error!</h4>
                <p>This is a simulated error that would normally crash the component tree, but the error boundary caught it and displayed this fallback UI.</p>
                <button class="btn btn-success" onclick="resetBoundaryError()" style="margin-top: 10px;">Reset</button>
            </div>
        `;
    }
}

function resetBoundaryError() {
    hasError = false;
    const content = document.getElementById('boundaryContent');
    
    if (content) {
        content.innerHTML = `
            <div class="safe-component">
                <h4>Safe Component</h4>
                <p>This component is protected by an error boundary.</p>
            </div>
        `;
    }
}

function simulateAsyncError() {
    const content = document.getElementById('recoveryContent');
    
    if (content) {
        content.innerHTML = '<div class="loading">Simulating async error...</div>';
        
        setTimeout(() => {
            content.innerHTML = `
                <div class="error">
                    <h4>Async Error Simulated</h4>
                    <p>This demonstrates how error boundaries can catch errors in async operations.</p>
                    <button class="btn btn-success" onclick="simulateAsyncError()" style="margin-top: 10px;">Try Again</button>
                </div>
            `;
        }, 1000);
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// React-like Hooks Implementation (Simplified)
class HookState {
    constructor() {
        this.state = [];
        this.effects = [];
        this.currentIndex = 0;
    }

    reset() {
        this.currentIndex = 0;
    }

    useState(initialValue) {
        const index = this.currentIndex++;
        if (this.state[index] === undefined) {
            this.state[index] = initialValue;
        }
        return [
            this.state[index],
            (newValue) => {
                this.state[index] = typeof newValue === 'function' 
                    ? newValue(this.state[index])
                    : newValue;
            }
        ];
    }

    useEffect(effect, dependencies) {
        const index = this.currentIndex++;
        const prevDependencies = this.effects[index]?.dependencies;
        
        const hasChanged = !dependencies || 
            !prevDependencies ||
            dependencies.some((dep, i) => dep !== prevDependencies[i]);
        
        if (hasChanged) {
            if (this.effects[index]?.cleanup) {
                this.effects[index].cleanup();
            }
            
            const cleanup = effect();
            this.effects[index] = { effect, dependencies, cleanup };
        }
    }

    useCallback(callback, dependencies) {
        const index = this.currentIndex++;
        const prevDependencies = this.effects[index]?.dependencies;
        
        const hasChanged = !dependencies || 
            !prevDependencies ||
            dependencies.some((dep, i) => dep !== prevDependencies[i]);
        
        if (hasChanged) {
            this.effects[index] = { callback, dependencies };
        }
        
        return this.effects[index]?.callback || callback;
    }

    useMemo(factory, dependencies) {
        const index = this.currentIndex++;
        const prevDependencies = this.effects[index]?.dependencies;
        
        const hasChanged = !dependencies || 
            !prevDependencies ||
            dependencies.some((dep, i) => dep !== prevDependencies[i]);
        
        if (hasChanged) {
            this.effects[index] = { 
                value: factory(), 
                dependencies 
            };
        }
        
        return this.effects[index]?.value;
    }
}

// Global hook state instance
const hookState = new HookState();

// Simplified React-like functions
function useState(initialValue) {
    return hookState.useState(initialValue);
}

function useEffect(effect, dependencies) {
    return hookState.useEffect(effect, dependencies);
}

function useCallback(callback, dependencies) {
    return hookState.useCallback(callback, dependencies);
}

function useMemo(factory, dependencies) {
    return hookState.useMemo(factory, dependencies);
}

// Export for global access
window.switchSection = switchSection;
window.toggleLoading = toggleLoading;
window.triggerError = triggerError;
window.fetchData = fetchData;
window.loadData = loadData;
window.switchTab = switchTab;
window.openModal = openModal;
window.closeModal = closeModal;
window.incrementCounter = incrementCounter;
window.decrementCounter = decrementCounter;
window.resetCounter = resetCounter;
window.saveToStorage = saveToStorage;
window.loadFromStorage = loadFromStorage;
window.addVirtualItems = addVirtualItems;
window.clearVirtualItems = clearVirtualItems;
window.removeVirtualItem = removeVirtualItem;
window.toggleMemoization = toggleMemoization;
window.triggerBoundaryError = triggerBoundaryError;
window.resetBoundaryError = resetBoundaryError;
window.simulateAsyncError = simulateAsyncError;
