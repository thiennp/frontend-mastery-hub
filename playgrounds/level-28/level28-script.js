// Level 28: GraphQL & Advanced APIs Script

class GraphQLAPIsLevel {
    constructor() {
        this.exercises = [
            { id: 1, name: 'GraphQL Queries', completed: false },
            { id: 2, name: 'GraphQL Mutations', completed: false },
            { id: 3, name: 'GraphQL Subscriptions', completed: false },
            { id: 4, name: 'API Design Patterns', completed: false },
            { id: 5, name: 'Real-time Data Integration', completed: false }
        ];
        this.apiMetrics = {
            queryFields: 0,
            queryDepth: 0,
            queryTime: 0,
            mutationOps: 0,
            mutationSuccess: 0,
            mutationTime: 0,
            activeSubs: 0,
            messageCount: 0,
            connectionStatus: 'Disconnected',
            apiEndpoints: 0,
            apiVersion: 'v1',
            apiCoverage: 0,
            wsStatus: 'Disconnected',
            sseStatus: 'Disconnected',
            rtMessageCount: 0
        };
        this.queries = [];
        this.mutations = [];
        this.subscriptions = new Map();
        this.apiEndpoints = [];
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.simulateAPIEnvironment();
        this.updateProgressDisplay();
    }

    setupEventListeners() {
        document.querySelectorAll('.exercise-card').forEach(card => {
            const exerciseId = parseInt(card.dataset.exercise);
            const runBtn = card.querySelector('.run-btn');
            runBtn.addEventListener('click', () => this.runExercise(exerciseId));
        });

        document.getElementById('completeBtn').addEventListener('click', () => this.completeLevel());
        document.querySelector('.btn-secondary').addEventListener('click', () => this.resetLevel());
    }

    simulateAPIEnvironment() {
        // Simulate dynamic API metrics updates
        setInterval(() => {
            if (Math.random() > 0.5) {
                this.updateRandomAPIMetric();
            }
        }, 6000);

        // Simulate real-time data updates
        setInterval(() => {
            this.simulateRealTimeData();
        }, 3000);
    }

    updateRandomAPIMetric() {
        const metrics = Object.keys(this.apiMetrics);
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
        
        if (randomMetric.includes('Fields') || randomMetric.includes('Ops') || randomMetric.includes('Endpoints') || randomMetric.includes('Subs') || randomMetric.includes('Count')) {
            this.apiMetrics[randomMetric] = Math.floor(Math.random() * 50) + 10;
        } else if (randomMetric.includes('Time')) {
            this.apiMetrics[randomMetric] = Math.floor(Math.random() * 500) + 50;
        } else if (randomMetric.includes('Success') || randomMetric.includes('Coverage')) {
            this.apiMetrics[randomMetric] = Math.floor(Math.random() * 20) + 80;
        } else if (randomMetric.includes('Depth')) {
            this.apiMetrics[randomMetric] = Math.floor(Math.random() * 8) + 2;
        } else if (randomMetric.includes('Status')) {
            const statuses = ['Connected', 'Connecting', 'Disconnected', 'Error'];
            this.apiMetrics[randomMetric] = statuses[Math.floor(Math.random() * statuses.length)];
        } else if (randomMetric.includes('Version')) {
            const versions = ['v1', 'v2', 'v3'];
            this.apiMetrics[randomMetric] = versions[Math.floor(Math.random() * versions.length)];
        }
        
        this.updateMetricsDisplay();
    }

    simulateRealTimeData() {
        // Simulate real-time message updates
        if (this.apiMetrics.messageCount > 0) {
            this.apiMetrics.messageCount += Math.floor(Math.random() * 3);
        }
        if (this.apiMetrics.rtMessageCount > 0) {
            this.apiMetrics.rtMessageCount += Math.floor(Math.random() * 2);
        }
        
        this.updateMetricsDisplay();
    }

    runExercise(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        const card = document.querySelector(`[data-exercise="${exerciseId}"]`);
        const outputContent = document.getElementById(`outputContent${exerciseId}`);
        const statusElement = card.querySelector('.exercise-status');
        
        statusElement.innerHTML = '<i class="fas fa-circle status-in-progress"></i><span>Processing API...</span>';
        
        setTimeout(() => {
            this.executeAPIExercise(exerciseId, outputContent);
            this.markExerciseComplete(exerciseId);
            this.updateProgressDisplay();
        }, 5000);
    }

    executeAPIExercise(exerciseId, outputContent) {
        switch (exerciseId) {
            case 1:
                this.executeGraphQLQueries(outputContent);
                break;
            case 2:
                this.executeGraphQLMutations(outputContent);
                break;
            case 3:
                this.executeGraphQLSubscriptions(outputContent);
                break;
            case 4:
                this.executeAPIDesignPatterns(outputContent);
                break;
            case 5:
                this.executeRealTimeIntegration(outputContent);
                break;
        }
    }

    executeGraphQLQueries(outputContent) {
        this.apiMetrics.queryFields = 15;
        this.apiMetrics.queryDepth = 4;
        this.apiMetrics.queryTime = 120;

        // Simulate query execution
        this.simulateQueryExecution();

        outputContent.innerHTML = `
<div class="graphql-queries-demo">
    <h4>🔍 GraphQL Queries Executed</h4>
    
    <div class="query-visualization">
        <div class="query-node">Users</div>
        <div class="query-node">Posts</div>
        <div class="query-node">Comments</div>
        <div class="query-node">Likes</div>
        <div class="query-node">Profile</div>
    </div>
    
    <div class="query-results">
        <h5>📊 Query Results:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>Query:</strong> GetUsers<br>
            <strong>Fields:</strong> ${this.apiMetrics.queryFields}<br>
            <strong>Depth:</strong> ${this.apiMetrics.queryDepth}<br>
            <strong>Execution Time:</strong> ${this.apiMetrics.queryTime}ms<br>
            <strong>Data Size:</strong> 2.3KB<br>
            <strong>Cache Hit:</strong> 85%
        </div>
    </div>
    
    <div class="query-features">
        <h5>🎯 Query Features Implemented:</h5>
        <div style="margin: 15px 0;">
            <span class="graphql-result query-executed">Field Selection ✓</span>
            <span class="graphql-result query-executed">Arguments ✓</span>
            <span class="graphql-result query-executed">Aliases ✓</span>
            <span class="graphql-result query-executed">Fragments ✓</span>
        </div>
    </div>
    
    <div class="query-optimization">
        <h5>⚡ Query Optimization:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            DataLoader: Batch loading enabled<br>
            Caching: Redis cache with 5min TTL<br>
            Query Complexity: 45/100 (Good)<br>
            N+1 Prevention: Dataloader batching<br>
            <br>
            <span class="graphql-result optimized-query">Query Performance: Excellent ✓</span>
        </div>
    </div>
    
    <div class="query-examples">
        <h5>💡 Query Examples:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color); font-family: monospace; font-size: 0.9rem;">
            query GetUserWithPosts($userId: ID!) {<br>
            &nbsp;&nbsp;user(id: $userId) {<br>
            &nbsp;&nbsp;&nbsp;&nbsp;id<br>
            &nbsp;&nbsp;&nbsp;&nbsp;name<br>
            &nbsp;&nbsp;&nbsp;&nbsp;email<br>
            &nbsp;&nbsp;&nbsp;&nbsp;posts {<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;content<br>
            &nbsp;&nbsp;&nbsp;&nbsp;}<br>
            &nbsp;&nbsp;}<br>
            }
        </div>
    </div>
    
    <div class="query-monitoring">
        <h5>📈 Query Monitoring:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Total Queries: 1,247<br>
            Average Response Time: 95ms<br>
            Error Rate: 0.2%<br>
            Cache Hit Rate: 85%<br>
            Most Popular Query: GetUsers (45% of traffic)
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    simulateQueryExecution() {
        // Simulate query processing
        const querySteps = ['Parsing', 'Validation', 'Execution', 'Response'];
        querySteps.forEach((step, index) => {
            setTimeout(() => {
                console.log(`Query step: ${step}`);
            }, index * 1000);
        });
    }

    executeGraphQLMutations(outputContent) {
        this.apiMetrics.mutationOps = 8;
        this.apiMetrics.mutationSuccess = 95;
        this.apiMetrics.mutationTime = 180;

        // Simulate mutation execution
        this.simulateMutationExecution();

        outputContent.innerHTML = `
<div class="graphql-mutations-demo">
    <h4>✏️ GraphQL Mutations Executed</h4>
    
    <div class="mutation-pool">
        <div class="mutation-item executed">Create</div>
        <div class="mutation-item executed">Update</div>
        <div class="mutation-item executed">Delete</div>
        <div class="mutation-item executed">Like</div>
        <div class="mutation-item executed">Comment</div>
        <div class="mutation-item failed">Update</div>
        <div class="mutation-item executed">Share</div>
        <div class="mutation-item executed">Follow</div>
    </div>
    
    <div class="mutation-results">
        <h5>📊 Mutation Results:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>Operations:</strong> ${this.apiMetrics.mutationOps}<br>
            <strong>Success Rate:</strong> ${this.apiMetrics.mutationSuccess}%<br>
            <strong>Average Time:</strong> ${this.apiMetrics.mutationTime}ms<br>
            <strong>Data Modified:</strong> 15 records<br>
            <strong>Validation Errors:</strong> 1
        </div>
    </div>
    
    <div class="mutation-features">
        <h5>🎯 Mutation Features Implemented:</h5>
        <div style="margin: 15px 0;">
            <span class="graphql-result mutation-executed">Input Types ✓</span>
            <span class="graphql-result mutation-executed">Validation ✓</span>
            <span class="graphql-result mutation-executed">Error Handling ✓</span>
            <span class="graphql-result mutation-executed">Optimistic Updates ✓</span>
        </div>
    </div>
    
    <div class="mutation-examples">
        <h5>💡 Mutation Examples:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color); font-family: monospace; font-size: 0.9rem;">
            mutation CreatePost($input: CreatePostInput!) {<br>
            &nbsp;&nbsp;createPost(input: $input) {<br>
            &nbsp;&nbsp;&nbsp;&nbsp;post {<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;content<br>
            &nbsp;&nbsp;&nbsp;&nbsp;}<br>
            &nbsp;&nbsp;&nbsp;&nbsp;errors {<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;field<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;message<br>
            &nbsp;&nbsp;&nbsp;&nbsp;}<br>
            &nbsp;&nbsp;}<br>
            }
        </div>
    </div>
    
    <div class="mutation-security">
        <h5>🔒 Mutation Security:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Authentication: JWT tokens required<br>
            Authorization: Role-based access control<br>
            Rate Limiting: 100 mutations/hour per user<br>
            Input Sanitization: XSS protection enabled<br>
            <br>
            <span class="graphql-result data-synced">Security Score: 98/100 ✓</span>
        </div>
    </div>
    
    <div class="mutation-monitoring">
        <h5>📈 Mutation Monitoring:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Total Mutations: 2,847<br>
            Success Rate: 95.2%<br>
            Average Response Time: 180ms<br>
            Most Common: CreatePost (35% of mutations)<br>
            Error Types: Validation (60%), Authorization (25%), System (15%)
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    simulateMutationExecution() {
        // Simulate mutation processing
        const mutationSteps = ['Validation', 'Authorization', 'Execution', 'Response'];
        mutationSteps.forEach((step, index) => {
            setTimeout(() => {
                console.log(`Mutation step: ${step}`);
            }, index * 1200);
        });
    }

    executeGraphQLSubscriptions(outputContent) {
        this.apiMetrics.activeSubs = 5;
        this.apiMetrics.messageCount = 23;
        this.apiMetrics.connectionStatus = 'Connected';

        // Start subscription simulation
        this.startSubscriptionSimulation();

        outputContent.innerHTML = `
<div class="graphql-subscriptions-demo">
    <h4>📡 GraphQL Subscriptions Active</h4>
    
    <div class="subscription-demo">
        <div class="subscription-channel">
            <div class="channel-title">User Updates</div>
            <div class="channel-status connected">Connected</div>
        </div>
        <div class="subscription-channel">
            <div class="channel-title">Post Comments</div>
            <div class="channel-status connected">Connected</div>
        </div>
        <div class="subscription-channel">
            <div class="channel-title">Notifications</div>
            <div class="channel-status connected">Connected</div>
        </div>
        <div class="subscription-channel">
            <div class="channel-title">Live Chat</div>
            <div class="channel-status connected">Connected</div>
        </div>
    </div>
    
    <div class="subscription-results">
        <h5>📊 Subscription Status:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>Active Subscriptions:</strong> ${this.apiMetrics.activeSubs}<br>
            <strong>Messages Received:</strong> ${this.apiMetrics.messageCount}<br>
            <strong>Connection Status:</strong> ${this.apiMetrics.connectionStatus}<br>
            <strong>WebSocket URL:</strong> ws://localhost:4000/graphql<br>
            <strong>Heartbeat Interval:</strong> 30s
        </div>
    </div>
    
    <div class="subscription-features">
        <h5>🎯 Subscription Features Implemented:</h5>
        <div style="margin: 15px 0;">
            <span class="graphql-result subscription-active">Real-time Updates ✓</span>
            <span class="graphql-result subscription-active">WebSocket Connection ✓</span>
            <span class="graphql-result subscription-active">Auto Reconnect ✓</span>
            <span class="graphql-result subscription-active">Message Filtering ✓</span>
        </div>
    </div>
    
    <div class="subscription-examples">
        <h5>💡 Subscription Examples:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color); font-family: monospace; font-size: 0.9rem;">
            subscription PostUpdates($postId: ID!) {<br>
            &nbsp;&nbsp;postUpdated(postId: $postId) {<br>
            &nbsp;&nbsp;&nbsp;&nbsp;id<br>
            &nbsp;&nbsp;&nbsp;&nbsp;title<br>
            &nbsp;&nbsp;&nbsp;&nbsp;likes<br>
            &nbsp;&nbsp;&nbsp;&nbsp;comments {<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;content<br>
            &nbsp;&nbsp;&nbsp;&nbsp;}<br>
            &nbsp;&nbsp;}<br>
            }
        </div>
    </div>
    
    <div class="subscription-performance">
        <h5>⚡ Subscription Performance:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Message Latency: 15ms average<br>
            Connection Stability: 99.8% uptime<br>
            Memory Usage: 45MB per connection<br>
            Concurrent Subscriptions: 1,000+<br>
            <br>
            <span class="graphql-result optimized-query">Real-time Performance: Excellent ✓</span>
        </div>
    </div>
    
    <div class="subscription-monitoring">
        <h5>📈 Subscription Monitoring:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Total Subscriptions: 3,247<br>
            Active Connections: 892<br>
            Messages per Second: 45<br>
            Error Rate: 0.1%<br>
            Most Popular: PostUpdates (40% of subscriptions)
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    startSubscriptionSimulation() {
        // Simulate real-time message updates
        setInterval(() => {
            if (this.apiMetrics.messageCount > 0) {
                this.apiMetrics.messageCount += Math.floor(Math.random() * 3);
                this.updateMetricsDisplay();
            }
        }, 2000);
    }

    executeAPIDesignPatterns(outputContent) {
        this.apiMetrics.apiEndpoints = 24;
        this.apiMetrics.apiVersion = 'v2';
        this.apiMetrics.apiCoverage = 92;

        outputContent.innerHTML = `
<div class="api-design-demo">
    <h4>🏗️ API Design Patterns Implemented</h4>
    
    <div class="api-endpoints">
        <div class="endpoint-item get-endpoint">GET /users</div>
        <div class="endpoint-item get-endpoint">GET /users/:id</div>
        <div class="endpoint-item post-endpoint">POST /users</div>
        <div class="endpoint-item put-endpoint">PUT /users/:id</div>
        <div class="endpoint-item delete-endpoint">DELETE /users/:id</div>
        <div class="endpoint-item get-endpoint">GET /posts</div>
        <div class="endpoint-item post-endpoint">POST /posts</div>
        <div class="endpoint-item get-endpoint">GET /comments</div>
    </div>
    
    <div class="api-results">
        <h5>📊 API Design Metrics:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>Total Endpoints:</strong> ${this.apiMetrics.apiEndpoints}<br>
            <strong>API Version:</strong> ${this.apiMetrics.apiVersion}<br>
            <strong>Coverage:</strong> ${this.apiMetrics.apiCoverage}%<br>
            <strong>Response Time:</strong> 95ms average<br>
            <strong>Uptime:</strong> 99.9%
        </div>
    </div>
    
    <div class="api-features">
        <h5>🎯 API Features Implemented:</h5>
        <div style="margin: 15px 0;">
            <span class="graphql-result api-endpoint">RESTful Design ✓</span>
            <span class="graphql-result api-endpoint">Versioning ✓</span>
            <span class="graphql-result api-endpoint">Error Handling ✓</span>
            <span class="graphql-result api-endpoint">Rate Limiting ✓</span>
        </div>
    </div>
    
    <div class="api-patterns">
        <h5>🏛️ Design Patterns:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>Resource-based URLs:</strong> /api/v2/users, /api/v2/posts<br>
            <strong>HTTP Methods:</strong> GET, POST, PUT, DELETE, PATCH<br>
            <strong>Status Codes:</strong> 200, 201, 400, 401, 404, 500<br>
            <strong>Content Types:</strong> application/json, application/xml<br>
            <strong>Authentication:</strong> JWT Bearer tokens<br>
            <strong>Pagination:</strong> ?page=1&limit=20
        </div>
    </div>
    
    <div class="api-security">
        <h5>🔒 API Security:</h5>
        <div style="margin: 10px 0;">
            <span class="graphql-result data-synced">HTTPS Only ✓</span>
            <span class="graphql-result data-synced">CORS Configured ✓</span>
            <span class="graphql-result data-synced">Rate Limiting ✓</span>
            <span class="graphql-result data-synced">Input Validation ✓</span>
        </div>
    </div>
    
    <div class="api-documentation">
        <h5>📚 API Documentation:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            OpenAPI 3.0 Specification<br>
            Interactive API Explorer<br>
            Code Examples in 5+ Languages<br>
            Postman Collection Available<br>
            <br>
            <span class="graphql-result optimized-query">Documentation Score: 95/100 ✓</span>
        </div>
    </div>
    
    <div class="api-monitoring">
        <h5>📈 API Monitoring:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Total Requests: 1.2M/day<br>
            Average Response Time: 95ms<br>
            Error Rate: 0.3%<br>
            Most Popular Endpoint: GET /users (25% of traffic)<br>
            API Usage by Client: Web (60%), Mobile (30%), Third-party (10%)
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeRealTimeIntegration(outputContent) {
        this.apiMetrics.wsStatus = 'Connected';
        this.apiMetrics.sseStatus = 'Connected';
        this.apiMetrics.rtMessageCount = 47;

        // Start real-time simulation
        this.startRealTimeSimulation();

        outputContent.innerHTML = `
<div class="realtime-integration-demo">
    <h4>⚡ Real-time Data Integration Active</h4>
    
    <div class="connection-status">
        <div class="connection-type">
            <div class="connection-title">WebSocket</div>
            <div class="connection-indicator connected"></div>
            <div class="channel-status connected">Connected</div>
        </div>
        <div class="connection-type">
            <div class="connection-title">Server-Sent Events</div>
            <div class="connection-indicator connected"></div>
            <div class="channel-status connected">Connected</div>
        </div>
        <div class="connection-type">
            <div class="connection-title">Data Sync</div>
            <div class="connection-indicator connected"></div>
            <div class="channel-status connected">Synced</div>
        </div>
    </div>
    
    <div class="realtime-results">
        <h5>📊 Real-time Status:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>WebSocket Status:</strong> ${this.apiMetrics.wsStatus}<br>
            <strong>SSE Status:</strong> ${this.apiMetrics.sseStatus}<br>
            <strong>Messages Processed:</strong> ${this.apiMetrics.rtMessageCount}<br>
            <strong>Connection Latency:</strong> 12ms<br>
            <strong>Data Sync Status:</strong> Real-time
        </div>
    </div>
    
    <div class="data-flow">
        <div class="data-packet">User</div>
        <div class="data-packet">Post</div>
        <div class="data-packet">Like</div>
        <div class="data-packet">Comment</div>
        <div class="data-packet">Share</div>
        <div class="data-packet">Follow</div>
    </div>
    
    <div class="realtime-features">
        <h5>🎯 Real-time Features Implemented:</h5>
        <div style="margin: 15px 0;">
            <span class="graphql-result realtime-connected">WebSocket Manager ✓</span>
            <span class="graphql-result realtime-connected">SSE Manager ✓</span>
            <span class="graphql-result realtime-connected">Data Synchronizer ✓</span>
            <span class="graphql-result realtime-connected">Connection Resilience ✓</span>
        </div>
    </div>
    
    <div class="realtime-examples">
        <h5>💡 Real-time Examples:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color); font-family: monospace; font-size: 0.9rem;">
            // WebSocket Connection<br>
            const ws = new WebSocket('ws://localhost:8080/ws');<br>
            ws.onmessage = (event) => {<br>
            &nbsp;&nbsp;const data = JSON.parse(event.data);<br>
            &nbsp;&nbsp;updateUI(data);<br>
            };<br><br>
            
            // Server-Sent Events<br>
            const eventSource = new EventSource('/api/events');<br>
            eventSource.onmessage = (event) => {<br>
            &nbsp;&nbsp;handleRealTimeUpdate(event.data);<br>
            };
        </div>
    </div>
    
    <div class="realtime-performance">
        <h5>⚡ Real-time Performance:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Message Latency: 12ms average<br>
            Connection Stability: 99.9% uptime<br>
            Concurrent Connections: 5,000+<br>
            Data Throughput: 1,200 messages/second<br>
            <br>
            <span class="graphql-result optimized-query">Real-time Performance: Excellent ✓</span>
        </div>
    </div>
    
    <div class="realtime-monitoring">
        <h5>📈 Real-time Monitoring:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Active Connections: 2,847<br>
            Messages per Second: 1,200<br>
            Error Rate: 0.05%<br>
            Reconnection Success: 98%<br>
            Average Session Duration: 45 minutes
        </div>
    </div>
    
    <div class="realtime-benefits">
        <h5>💡 Real-time Benefits:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Instant data synchronization across clients<br>
            Improved user experience with live updates<br>
            Reduced server load with efficient connections<br>
            Better collaboration features<br>
            Enhanced real-time analytics and monitoring
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    startRealTimeSimulation() {
        // Simulate real-time message updates
        setInterval(() => {
            if (this.apiMetrics.rtMessageCount > 0) {
                this.apiMetrics.rtMessageCount += Math.floor(Math.random() * 2);
                this.updateMetricsDisplay();
            }
        }, 1500);
    }

    markExerciseComplete(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        exercise.completed = true;
        
        const card = document.querySelector(`[data-exercise="${exerciseId}"]`);
        const statusElement = card.querySelector('.exercise-status');
        
        card.classList.add('completed');
        statusElement.innerHTML = '<i class="fas fa-circle status-completed"></i><span>Completed</span>';
        
        card.classList.add('success-animation');
        setTimeout(() => {
            card.classList.remove('success-animation');
        }, 600);
        
        this.saveProgress();
    }

    updateMetricsDisplay() {
        // Update GraphQL Query metrics
        document.getElementById('queryFields').textContent = this.apiMetrics.queryFields;
        document.getElementById('queryDepth').textContent = this.apiMetrics.queryDepth;
        document.getElementById('queryTime').textContent = `${this.apiMetrics.queryTime}ms`;

        // Update GraphQL Mutation metrics
        document.getElementById('mutationOps').textContent = this.apiMetrics.mutationOps;
        document.getElementById('mutationSuccess').textContent = `${this.apiMetrics.mutationSuccess}%`;
        document.getElementById('mutationTime').textContent = `${this.apiMetrics.mutationTime}ms`;

        // Update GraphQL Subscription metrics
        document.getElementById('activeSubs').textContent = this.apiMetrics.activeSubs;
        document.getElementById('messageCount').textContent = this.apiMetrics.messageCount;
        document.getElementById('connectionStatus').textContent = this.apiMetrics.connectionStatus;

        // Update API Design metrics
        document.getElementById('apiEndpoints').textContent = this.apiMetrics.apiEndpoints;
        document.getElementById('apiVersion').textContent = this.apiMetrics.apiVersion;
        document.getElementById('apiCoverage').textContent = `${this.apiMetrics.apiCoverage}%`;

        // Update Real-time Integration metrics
        document.getElementById('wsStatus').textContent = this.apiMetrics.wsStatus;
        document.getElementById('sseStatus').textContent = this.apiMetrics.sseStatus;
        document.getElementById('rtMessageCount').textContent = this.apiMetrics.rtMessageCount;
    }

    updateProgressDisplay() {
        const completedCount = this.exercises.filter(ex => ex.completed).length;
        const totalCount = this.exercises.length;
        const percentage = (completedCount / totalCount) * 100;

        const progressFill = document.getElementById('overallProgress');
        progressFill.style.width = `${percentage}%`;

        const progressText = document.querySelector('.progress-text');
        progressText.textContent = `${completedCount}/${totalCount} Complete`;

        const completeBtn = document.getElementById('completeBtn');
        completeBtn.disabled = completedCount < totalCount;
    }

    completeLevel() {
        if (this.exercises.every(ex => ex.completed)) {
            this.showCompletionAnimation();
            
            const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
            if (!completedLevels.includes(28)) {
                completedLevels.push(28);
                localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
            }

            const totalProgress = JSON.parse(localStorage.getItem('totalProgress') || '0');
            localStorage.setItem('totalProgress', Math.max(totalProgress, 28).toString());

            setTimeout(() => {
                alert('🎉 Congratulations! You\'ve completed Level 28: GraphQL & Advanced APIs!\n\nYou\'ve mastered:\n• GraphQL queries with field selection and optimization\n• GraphQL mutations with input validation and error handling\n• GraphQL subscriptions with real-time data streaming\n• API design patterns with RESTful principles and versioning\n• Real-time data integration with WebSockets and SSE');
                
                window.location.href = '../../index.html';
            }, 2000);
        }
    }

    showCompletionAnimation() {
        const container = document.querySelector('.level-container');
        container.style.position = 'relative';
        container.style.overflow = 'hidden';

        for (let i = 0; i < 55; i++) {
            const apiIcon = document.createElement('div');
            apiIcon.style.position = 'absolute';
            apiIcon.style.fontSize = '20px';
            apiIcon.innerHTML = ['🔗', '📡', '⚡', '🏗️', '📊', '🎯', '💡'][Math.floor(Math.random() * 7)];
            apiIcon.style.left = Math.random() * 100 + '%';
            apiIcon.style.top = '-30px';
            apiIcon.style.animation = `apiFall ${Math.random() * 2 + 2}s linear forwards`;
            apiIcon.style.opacity = '0.8';
            apiIcon.classList.add('graphql-processing');
            container.appendChild(apiIcon);

            setTimeout(() => apiIcon.remove(), 4000);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes apiFall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    resetLevel() {
        if (confirm('Are you sure you want to reset this level? All API progress will be lost.')) {
            this.exercises.forEach(ex => ex.completed = false);
            
            document.querySelectorAll('.exercise-card').forEach(card => {
                card.classList.remove('completed');
                const statusElement = card.querySelector('.exercise-status');
                statusElement.innerHTML = '<i class="fas fa-circle status-pending"></i><span>Pending</span>';
            });

            document.querySelectorAll('.output-content').forEach(output => {
                output.innerHTML = '';
            });

            this.apiMetrics = {
                queryFields: 0, queryDepth: 0, queryTime: 0,
                mutationOps: 0, mutationSuccess: 0, mutationTime: 0,
                activeSubs: 0, messageCount: 0, connectionStatus: 'Disconnected',
                apiEndpoints: 0, apiVersion: 'v1', apiCoverage: 0,
                wsStatus: 'Disconnected', sseStatus: 'Disconnected', rtMessageCount: 0
            };

            this.queries = [];
            this.mutations = [];
            this.subscriptions.clear();
            this.apiEndpoints = [];

            this.updateProgressDisplay();
            this.updateMetricsDisplay();
            this.saveProgress();
        }
    }

    saveProgress() {
        localStorage.setItem('level28Progress', JSON.stringify({
            exercises: this.exercises,
            apiMetrics: this.apiMetrics,
            queries: this.queries,
            mutations: this.mutations,
            subscriptions: Array.from(this.subscriptions.entries()),
            apiEndpoints: this.apiEndpoints
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem('level28Progress');
        if (saved) {
            const data = JSON.parse(saved);
            this.exercises = data.exercises || this.exercises;
            this.apiMetrics = data.apiMetrics || this.apiMetrics;
            this.queries = data.queries || this.queries;
            this.mutations = data.mutations || this.mutations;
            this.subscriptions = new Map(data.subscriptions || []);
            this.apiEndpoints = data.apiEndpoints || this.apiEndpoints;
            
            this.exercises.forEach((exercise, index) => {
                if (exercise.completed) {
                    const card = document.querySelector(`[data-exercise="${index + 1}"]`);
                    if (card) {
                        card.classList.add('completed');
                        const statusElement = card.querySelector('.exercise-status');
                        statusElement.innerHTML = '<i class="fas fa-circle status-completed"></i><span>Completed</span>';
                    }
                }
            });
        }
    }
}

// Global functions for HTML onclick handlers
function runExercise(exerciseId) {
    if (window.apiLevel) {
        window.apiLevel.runExercise(exerciseId);
    }
}

function completeLevel() {
    if (window.apiLevel) {
        window.apiLevel.completeLevel();
    }
}

function resetLevel() {
    if (window.apiLevel) {
        window.apiLevel.resetLevel();
    }
}

// Initialize the level when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.apiLevel = new GraphQLAPIsLevel();
});
