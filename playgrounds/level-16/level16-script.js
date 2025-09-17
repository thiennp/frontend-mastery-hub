// Level 16: Advanced Backend Patterns - Interactive Script

class BackendPatternsLevel {
    constructor() {
        this.exercises = [
            {
                id: 1,
                name: 'Microservices Architecture',
                completed: false,
                solutions: {
                    gateway: `const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const consul = require('consul');

const app = express();
const consulClient = consul();

// Service registry
const services = {
  'user-service': 'http://localhost:3001',
  'order-service': 'http://localhost:3002',
  'payment-service': 'http://localhost:3003'
};

// Service discovery middleware
app.use('/api/users/*', createProxyMiddleware({
  target: services['user-service'],
  changeOrigin: true,
  pathRewrite: { '^/api/users': '' }
}));

app.use('/api/orders/*', createProxyMiddleware({
  target: services['order-service'],
  changeOrigin: true,
  pathRewrite: { '^/api/orders': '' }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', services: Object.keys(services) });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(\`API Gateway running on port \${PORT}\`);
});`,
                    service: `const express = require('express');
const consul = require('consul');

const app = express();
const consulClient = consul();

// Service registration
const serviceId = 'user-service-1';
const serviceConfig = {
  name: 'user-service',
  id: serviceId,
  address: 'localhost',
  port: 3001,
  check: {
    http: 'http://localhost:3001/health',
    interval: '10s'
  }
};

// Register with Consul
consulClient.agent.service.register(serviceConfig, (err) => {
  if (err) throw err;
  console.log('User service registered with Consul');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'user-service' });
});

app.listen(3001, () => {
  console.log('User service running on port 3001');
});`,
                    package: `{
  "name": "microservices-demo",
  "version": "1.0.0",
  "description": "Microservices architecture demonstration",
  "main": "api-gateway.js",
  "scripts": {
    "start": "node api-gateway.js",
    "start:user": "node user-service.js",
    "dev": "concurrently \"npm run start:user\" \"npm run start\""
  },
  "dependencies": {
    "express": "^4.18.2",
    "http-proxy-middleware": "^2.0.6",
    "consul": "^0.40.0",
    "axios": "^1.5.0"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  },
  "keywords": ["microservices", "api-gateway", "consul"],
  "author": "Your Name",
  "license": "MIT"
}`
                }
            },
            {
                id: 2,
                name: 'Caching Strategies',
                completed: false,
                solutions: {
                    service: `const redis = require('redis');
const express = require('express');

const app = express();
const client = redis.createClient({
  host: 'localhost',
  port: 6379
});

// Cache-aside pattern
async function getCachedData(key, fetchFunction, ttl = 3600) {
  try {
    const cached = await client.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const data = await fetchFunction();
    await client.setex(key, ttl, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Cache error:', error);
    return await fetchFunction();
  }
}

// Write-through pattern
async function writeThroughCache(key, data, ttl = 3600) {
  try {
    await client.setex(key, ttl, JSON.stringify(data));
    // Write to persistent storage here
    return data;
  } catch (error) {
    console.error('Write-through error:', error);
    throw error;
  }
}

// Cache invalidation
async function invalidateCache(pattern) {
  const keys = await client.keys(pattern);
  if (keys.length > 0) {
    await client.del(keys);
  }
}

app.listen(3000, () => {
  console.log('Cache service running on port 3000');
});`,
                    patterns: `const redis = require('redis');

class CacheManager {
  constructor() {
    this.client = redis.createClient();
  }

  async cacheAside(key, fetchFunction, ttl = 3600) {
    try {
      const cached = await this.client.get(key);
      if (cached) {
        return JSON.parse(cached);
      }

      const data = await fetchFunction();
      await this.client.setex(key, ttl, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Cache error:', error);
      return await fetchFunction();
    }
  }

  async writeThrough(key, data, writeFunction, ttl = 3600) {
    try {
      await this.client.setex(key, ttl, JSON.stringify(data));
      await writeFunction(data);
      return data;
    } catch (error) {
      console.error('Write-through error:', error);
      throw error;
    }
  }

  async writeBehind(key, data, writeFunction, ttl = 3600) {
    try {
      await this.client.setex(key, ttl, JSON.stringify(data));
      setImmediate(() => {
        writeFunction(data).catch(console.error);
      });
      return data;
    } catch (error) {
      console.error('Write-behind error:', error);
      throw error;
    }
  }

  async invalidatePattern(pattern) {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(keys);
    }
  }
}

module.exports = CacheManager;`
                }
            },
            {
                id: 3,
                name: 'Message Queues',
                completed: false,
                solutions: {
                    producer: `const amqp = require('amqplib');

class MessageProducer {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
  }

  async publishMessage(queueName, message, options = {}) {
    await this.channel.assertQueue(queueName, { durable: true });
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true,
      ...options
    });
  }

  async publishToExchange(exchange, routingKey, message) {
    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
  }

  async close() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}

module.exports = MessageProducer;`,
                    consumer: `const amqp = require('amqplib');

class MessageConsumer {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
  }

  async consumeMessages(queueName, handler, options = {}) {
    await this.channel.assertQueue(queueName, { durable: true });
    this.channel.consume(queueName, (message) => {
      if (message) {
        const content = JSON.parse(message.content.toString());
        handler(content);
        this.channel.ack(message);
      }
    }, options);
  }

  async setupDeadLetterQueue(queueName, dlqName) {
    await this.channel.assertQueue(dlqName, { durable: true });
    await this.channel.assertQueue(queueName, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': dlqName
      }
    });
  }

  async close() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}

module.exports = MessageConsumer;`,
                    package: `{
  "name": "message-queue-demo",
  "version": "1.0.0",
  "description": "Message queue demonstration",
  "main": "producer.js",
  "scripts": {
    "start:producer": "node producer.js",
    "start:consumer": "node consumer.js",
    "dev": "concurrently \"npm run start:producer\" \"npm run start:consumer\""
  },
  "dependencies": {
    "amqplib": "^0.10.3"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  },
  "keywords": ["message-queue", "rabbitmq", "amqp"],
  "author": "Your Name",
  "license": "MIT"
}`
                }
            },
            {
                id: 4,
                name: 'Background Jobs',
                completed: false,
                solutions: {
                    processor: `const Queue = require('bull');
const Redis = require('ioredis');

const redis = new Redis({
  host: 'localhost',
  port: 6379
});

const emailQueue = new Queue('email processing', { redis });
const imageQueue = new Queue('image processing', { redis });

emailQueue.process('send-email', async (job) => {
  const { to, subject, body } = job.data;
  
  console.log(\`Sending email to \${to}: \${subject}\`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return { success: true, messageId: 'msg_' + Date.now() };
});

imageQueue.process('resize-image', async (job) => {
  const { imagePath, sizes } = job.data;
  
  console.log(\`Processing image: \${imagePath}\`);
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  return { success: true, processedImages: sizes.length };
});

emailQueue.on('completed', (job, result) => {
  console.log(\`Email job \${job.id} completed:\`, result);
});

emailQueue.on('failed', (job, err) => {
  console.error(\`Email job \${job.id} failed:\`, err);
});

module.exports = { emailQueue, imageQueue };`,
                    scheduler: `const Queue = require('bull');
const cron = require('node-cron');

class JobScheduler {
  constructor() {
    this.queues = new Map();
  }

  createQueue(name, options = {}) {
    const queue = new Queue(name, {
      redis: { host: 'localhost', port: 6379 },
      ...options
    });
    
    this.queues.set(name, queue);
    return queue;
  }

  scheduleRecurring(queueName, jobName, cronExpression, data) {
    const queue = this.queues.get(queueName);
    if (!queue) throw new Error(\`Queue \${queueName} not found\`);

    cron.schedule(cronExpression, () => {
      queue.add(jobName, data, {
        removeOnComplete: 10,
        removeOnFail: 5
      });
    });
  }

  scheduleDelayed(queueName, jobName, data, delay) {
    const queue = this.queues.get(queueName);
    if (!queue) throw new Error(\`Queue \${queueName} not found\`);

    return queue.add(jobName, data, { delay });
  }

  async getQueueStats(queueName) {
    const queue = this.queues.get(queueName);
    if (!queue) throw new Error(\`Queue \${queueName} not found\`);

    const waiting = await queue.getWaiting();
    const active = await queue.getActive();
    const completed = await queue.getCompleted();
    const failed = await queue.getFailed();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length
    };
  }
}

module.exports = JobScheduler;`
                }
            },
            {
                id: 5,
                name: 'Event Sourcing',
                completed: false,
                solutions: {
                    store: `class EventStore {
  constructor() {
    this.events = [];
    this.projections = new Map();
  }

  async appendEvents(streamId, events, expectedVersion) {
    const streamEvents = this.events.filter(e => e.streamId === streamId);
    if (streamEvents.length !== expectedVersion) {
      throw new Error('Concurrency conflict');
    }

    events.forEach((event, index) => {
      event.streamId = streamId;
      event.version = expectedVersion + index + 1;
      event.timestamp = new Date().toISOString();
      event.id = \`evt_\${Date.now()}_\${index}\`;
    });

    this.events.push(...events);
    return events;
  }

  async getEvents(streamId, fromVersion = 0) {
    return this.events
      .filter(e => e.streamId === streamId && e.version > fromVersion)
      .sort((a, b) => a.version - b.version);
  }

  subscribe(eventType, handler) {
    if (!this.projections.has(eventType)) {
      this.projections.set(eventType, []);
    }
    this.projections.get(eventType).push(handler);
  }

  createProjection(name, handlers) {
    this.projections.set(name, handlers);
  }
}

const EventTypes = {
  USER_CREATED: 'UserCreated',
  USER_UPDATED: 'UserUpdated',
  USER_DELETED: 'UserDeleted'
};

const CommandTypes = {
  CREATE_USER: 'CreateUser',
  UPDATE_USER: 'UpdateUser',
  DELETE_USER: 'DeleteUser'
};

module.exports = { EventStore, EventTypes, CommandTypes };`,
                    handler: `const { EventStore, EventTypes, CommandTypes } = require('./event-store');

class CommandHandler {
  constructor(eventStore) {
    this.eventStore = eventStore;
  }

  async handleCreateUser(command) {
    const { userId, name, email } = command.data;
    
    if (!userId || !name || !email) {
      throw new Error('Invalid command data');
    }

    const event = {
      type: EventTypes.USER_CREATED,
      streamId: \`user-\${userId}\`,
      data: { userId, name, email },
      timestamp: new Date().toISOString(),
      version: 1
    };

    await this.eventStore.appendEvents(\`user-\${userId}\`, [event], 0);
    return { success: true, eventId: event.id };
  }

  async handleUpdateUser(command) {
    const { userId, updates } = command.data;
    
    const events = await this.eventStore.getEvents(\`user-\${userId}\`);
    const currentVersion = events.length;

    const event = {
      type: EventTypes.USER_UPDATED,
      streamId: \`user-\${userId}\`,
      data: { userId, updates },
      timestamp: new Date().toISOString(),
      version: currentVersion + 1
    };

    await this.eventStore.appendEvents(\`user-\${userId}\`, [event], currentVersion);
    return { success: true, eventId: event.id };
  }

  async handleDeleteUser(command) {
    const { userId } = command.data;
    
    const events = await this.eventStore.getEvents(\`user-\${userId}\`);
    const currentVersion = events.length;

    const event = {
      type: EventTypes.USER_DELETED,
      streamId: \`user-\${userId}\`,
      data: { userId },
      timestamp: new Date().toISOString(),
      version: currentVersion + 1
    };

    await this.eventStore.appendEvents(\`user-\${userId}\`, [event], currentVersion);
    return { success: true, eventId: event.id };
  }
}

module.exports = CommandHandler;`
                }
            }
        ];
        
        this.currentExercise = 1;
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.updateProgress();
        this.updateBadge();
    }

    setupEventListeners() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const file = e.target.dataset.file;
                const exerciseId = this.getExerciseIdFromTab(e.target);
                this.switchTab(exerciseId, file);
            });
        });

        document.querySelectorAll('.code-editor').forEach(editor => {
            editor.addEventListener('input', () => {
                this.autoResize(editor);
            });
        });
    }

    getExerciseIdFromTab(tab) {
        const exerciseCard = tab.closest('.exercise-card');
        return parseInt(exerciseCard.id.replace('exercise', ''));
    }

    switchTab(exerciseId, file) {
        const exerciseCard = document.getElementById(`exercise${exerciseId}`);
        const tabs = exerciseCard.querySelectorAll('.tab');
        const editors = exerciseCard.querySelectorAll('.code-editor');

        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.file === file) {
                tab.classList.add('active');
            }
        });

        editors.forEach(editor => {
            editor.style.display = 'none';
            if (editor.id.includes(file.replace('.', '-'))) {
                editor.style.display = 'block';
            }
        });
    }

    autoResize(editor) {
        editor.style.height = 'auto';
        editor.style.height = editor.scrollHeight + 'px';
    }

    runExercise(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        const output = document.getElementById(`output${exerciseId}`);
        
        output.innerHTML = 'Initializing backend patterns...';
        output.className = 'output service-flow';

        setTimeout(() => {
            try {
                let result = '';
                
                if (exerciseId === 1) {
                    result = this.simulateMicroservices();
                } else if (exerciseId === 2) {
                    result = this.simulateCaching();
                } else if (exerciseId === 3) {
                    result = this.simulateMessageQueues();
                } else if (exerciseId === 4) {
                    result = this.simulateBackgroundJobs();
                } else if (exerciseId === 5) {
                    result = this.simulateEventSourcing();
                }

                output.innerHTML = result;
                output.className = 'output success';
            } catch (error) {
                output.innerHTML = `Error: ${error.message}`;
                output.className = 'output error';
            }
        }, 2500);
    }

    simulateMicroservices() {
        return `Microservices Architecture Started:
✓ API Gateway running on port 3000
✓ Service discovery with Consul enabled
✓ Load balancing configured

Service Registry:
- user-service: http://localhost:3001 ✓ Registered
- order-service: http://localhost:3002 ✓ Registered  
- payment-service: http://localhost:3003 ✓ Registered

API Gateway Routes:
✓ /api/users/* → user-service
✓ /api/orders/* → order-service
✓ /api/payments/* → payment-service

Health Checks:
✓ Gateway health: OK
✓ User service health: OK
✓ Service discovery: Active

Inter-Service Communication:
✓ HTTP proxy middleware configured
✓ Request routing working
✓ Service failover ready

✓ Microservices architecture successfully implemented!`;
    }

    simulateCaching() {
        return `Caching System Started:
✓ Redis connection established
✓ Cache manager initialized
✓ Multiple caching patterns implemented

Cache Patterns:
✓ Cache-Aside: Read-through caching
✓ Write-Through: Synchronous write to cache and storage
✓ Write-Behind: Asynchronous write to storage
✓ Cache Invalidation: Pattern-based invalidation

Performance Metrics:
- Cache hit rate: 85%
- Average response time: 45ms
- Memory usage: 128MB
- Cache size: 1,024 entries

Cache Operations:
✓ GET /api/users/1: Cache hit (15ms)
✓ GET /api/users/2: Cache miss (120ms)
✓ POST /api/users: Write-through (200ms)
✓ DELETE /api/users/1: Cache invalidation (25ms)

TTL Management:
✓ Default TTL: 3600 seconds
✓ Dynamic TTL based on data type
✓ Automatic cleanup of expired entries

✓ Caching strategies successfully implemented!`;
    }

    simulateMessageQueues() {
        return `Message Queue System Started:
✓ RabbitMQ connection established
✓ Producer and consumer initialized
✓ Dead letter queue configured

Queue Configuration:
- user-events: 150 messages
- order-events: 89 messages
- payment-events: 45 messages
- dead-letter: 3 messages

Message Processing:
✓ Producer: Publishing messages to queues
✓ Consumer: Processing messages from queues
✓ Acknowledgment: Messages acknowledged after processing
✓ Retry Logic: Failed messages retried 3 times

Exchange Types:
✓ Direct exchange: Point-to-point messaging
✓ Topic exchange: Pattern-based routing
✓ Fanout exchange: Broadcast messaging

Queue Statistics:
- Total messages processed: 284
- Success rate: 98.5%
- Average processing time: 150ms
- Failed messages: 4 (moved to DLQ)

✓ Message queue system successfully implemented!`;
    }

    simulateBackgroundJobs() {
        return `Background Job System Started:
✓ Bull Queue initialized with Redis
✓ Job processors registered
✓ Job scheduler configured

Job Queues:
- email-processing: 12 jobs (8 completed, 3 active, 1 waiting)
- image-processing: 5 jobs (4 completed, 1 active)
- data-export: 2 jobs (1 completed, 1 failed)

Job Types:
✓ Send Email: Processed 8/8 successfully
✓ Resize Image: Processed 4/5 successfully
✓ Generate Report: Processed 1/2 successfully
✓ Cleanup Data: Scheduled for daily execution

Job Scheduling:
✓ Recurring jobs: 3 configured
✓ Delayed jobs: 5 scheduled
✓ Cron jobs: 2 active
✓ Retry mechanism: 3 attempts with exponential backoff

Performance Metrics:
- Jobs per minute: 15
- Average job duration: 2.3 seconds
- Success rate: 94%
- Queue depth: 3 jobs

✓ Background job system successfully implemented!`;
    }

    simulateEventSourcing() {
        return `Event Sourcing System Started:
✓ Event store initialized
✓ Command handlers registered
✓ Event projections configured

Event Store:
- Total events: 1,247
- Event streams: 156
- Projections: 8 active
- Event types: 12 defined

Command Processing:
✓ CreateUser: 45 commands processed
✓ UpdateUser: 123 commands processed
✓ DeleteUser: 12 commands processed
✓ Command validation: 100% success rate

Event Types:
- UserCreated: 45 events
- UserUpdated: 123 events
- UserDeleted: 12 events
- UserLoggedIn: 89 events

Projections:
✓ UserReadModel: Updated in real-time
✓ UserStatistics: Aggregated from events
✓ AuditLog: Complete event history
✓ NotificationProjection: Event-driven notifications

CQRS Implementation:
✓ Command side: Event store + command handlers
✓ Query side: Read models from projections
✓ Event replay: Full system state reconstruction
✓ Event versioning: Optimistic concurrency control

✓ Event sourcing system successfully implemented!`;
    }

    checkExercise(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        const output = document.getElementById(`output${exerciseId}`);
        
        let isCorrect = false;
        let userCode = '';

        if (exerciseId === 1) {
            const gatewayCode = document.getElementById('editor1-gateway').value;
            const serviceCode = document.getElementById('editor1-service').value;
            const packageCode = document.getElementById('editor1-package').value;
            userCode = gatewayCode + '\n\n' + serviceCode + '\n\n' + packageCode;
            isCorrect = this.checkMicroservices(gatewayCode, serviceCode, packageCode);
        } else if (exerciseId === 2) {
            const serviceCode = document.getElementById('editor2-service').value;
            const patternsCode = document.getElementById('editor2-patterns').value;
            userCode = serviceCode + '\n\n' + patternsCode;
            isCorrect = this.checkCaching(serviceCode, patternsCode);
        } else if (exerciseId === 3) {
            const producerCode = document.getElementById('editor3-producer').value;
            const consumerCode = document.getElementById('editor3-consumer').value;
            const packageCode = document.getElementById('editor3-package').value;
            userCode = producerCode + '\n\n' + consumerCode + '\n\n' + packageCode;
            isCorrect = this.checkMessageQueues(producerCode, consumerCode, packageCode);
        } else if (exerciseId === 4) {
            const processorCode = document.getElementById('editor4-processor').value;
            const schedulerCode = document.getElementById('editor4-scheduler').value;
            userCode = processorCode + '\n\n' + schedulerCode;
            isCorrect = this.checkBackgroundJobs(processorCode, schedulerCode);
        } else if (exerciseId === 5) {
            const storeCode = document.getElementById('editor5-store').value;
            const handlerCode = document.getElementById('editor5-handler').value;
            userCode = storeCode + '\n\n' + handlerCode;
            isCorrect = this.checkEventSourcing(storeCode, handlerCode);
        }

        if (isCorrect) {
            exercise.completed = true;
            document.getElementById(`status${exerciseId}`).textContent = '✅ Completed';
            document.getElementById(`status${exerciseId}`).className = 'exercise-status completed';
            output.innerHTML = '🎉 Excellent! Your backend pattern solution is correct!';
            output.className = 'output success';
            
            document.getElementById(`exercise${exerciseId}`).classList.add('completed');
            
            this.updateProgress();
            this.updateBadge();
            this.saveProgress();
        } else {
            output.innerHTML = '❌ Not quite right. Check the hints and try again!';
            output.className = 'output error';
        }
    }

    checkMicroservices(gatewayCode, serviceCode, packageCode) {
        const hasProxy = gatewayCode.includes('createProxyMiddleware');
        const hasServiceRegistry = gatewayCode.includes('services');
        const hasConsul = serviceCode.includes('consul');
        const hasServiceRegistration = serviceCode.includes('agent.service.register');
        const hasHttpProxyDep = packageCode.includes('"http-proxy-middleware"');
        
        return hasProxy && hasServiceRegistry && hasConsul && hasServiceRegistration && hasHttpProxyDep;
    }

    checkCaching(serviceCode, patternsCode) {
        const hasRedis = serviceCode.includes('redis');
        const hasCacheAside = patternsCode.includes('cacheAside');
        const hasWriteThrough = patternsCode.includes('writeThrough');
        const hasWriteBehind = patternsCode.includes('writeBehind');
        const hasInvalidation = patternsCode.includes('invalidatePattern');
        
        return hasRedis && hasCacheAside && hasWriteThrough && hasWriteBehind && hasInvalidation;
    }

    checkMessageQueues(producerCode, consumerCode, packageCode) {
        const hasAmqp = producerCode.includes('amqplib');
        const hasPublish = producerCode.includes('publishMessage');
        const hasConsume = consumerCode.includes('consumeMessages');
        const hasDeadLetter = consumerCode.includes('DeadLetter');
        const hasAmqpDep = packageCode.includes('"amqplib"');
        
        return hasAmqp && hasPublish && hasConsume && hasDeadLetter && hasAmqpDep;
    }

    checkBackgroundJobs(processorCode, schedulerCode) {
        const hasBull = processorCode.includes('Queue');
        const hasProcess = processorCode.includes('process(');
        const hasSchedule = schedulerCode.includes('scheduleRecurring');
        const hasCron = schedulerCode.includes('cron.schedule');
        const hasStats = schedulerCode.includes('getQueueStats');
        
        return hasBull && hasProcess && hasSchedule && hasCron && hasStats;
    }

    checkEventSourcing(storeCode, handlerCode) {
        const hasEventStore = storeCode.includes('EventStore');
        const hasAppendEvents = storeCode.includes('appendEvents');
        const hasGetEvents = storeCode.includes('getEvents');
        const hasCommandHandler = handlerCode.includes('CommandHandler');
        const hasEventTypes = storeCode.includes('EventTypes');
        
        return hasEventStore && hasAppendEvents && hasGetEvents && hasCommandHandler && hasEventTypes;
    }

    updateProgress() {
        const completed = this.exercises.filter(ex => ex.completed).length;
        const total = this.exercises.length;
        const percentage = (completed / total) * 100;
        
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('progressFill').style.width = `${percentage}%`;
    }

    updateBadge() {
        const completed = this.exercises.filter(ex => ex.completed).length;
        const badge = document.getElementById('levelBadge');
        
        if (completed === 0) {
            badge.textContent = 'Backend Novice';
        } else if (completed < 3) {
            badge.textContent = 'Backend Learner';
        } else if (completed < 5) {
            badge.textContent = 'Backend Developer';
        } else {
            badge.textContent = 'Backend Architect';
        }
    }

    saveProgress() {
        const progress = {
            level: 16,
            exercises: this.exercises.map(ex => ({
                id: ex.id,
                completed: ex.completed
            })),
            completedAt: new Date().toISOString()
        };
        
        localStorage.setItem('level16Progress', JSON.stringify(progress));
        
        const mainProgress = JSON.parse(localStorage.getItem('frontendMasteryProgress') || '{}');
        mainProgress.level16 = progress;
        localStorage.setItem('frontendMasteryProgress', JSON.stringify(mainProgress));
    }

    loadProgress() {
        const saved = localStorage.getItem('level16Progress');
        if (saved) {
            const progress = JSON.parse(saved);
            progress.exercises.forEach(savedEx => {
                const exercise = this.exercises.find(ex => ex.id === savedEx.id);
                if (exercise) {
                    exercise.completed = savedEx.completed;
                    if (savedEx.completed) {
                        document.getElementById(`status${savedEx.id}`).textContent = '✅ Completed';
                        document.getElementById(`status${savedEx.id}`).className = 'exercise-status completed';
                    }
                }
            });
        }
    }

    goToPreviousLevel() {
        window.location.href = '../level-15/';
    }

    goToNextLevel() {
        const allCompleted = this.exercises.every(ex => ex.completed);
        if (allCompleted) {
            window.location.href = '../level-17/';
        } else {
            alert('Please complete all exercises before proceeding to the next level!');
        }
    }
}

// Global functions for HTML onclick handlers
function runExercise(exerciseId) {
    if (window.backendPatternsLevel) {
        window.backendPatternsLevel.runExercise(exerciseId);
    }
}

function checkExercise(exerciseId) {
    if (window.backendPatternsLevel) {
        window.backendPatternsLevel.checkExercise(exerciseId);
    }
}

function goToPreviousLevel() {
    if (window.backendPatternsLevel) {
        window.backendPatternsLevel.goToPreviousLevel();
    }
}

function goToNextLevel() {
    if (window.backendPatternsLevel) {
        window.backendPatternsLevel.goToNextLevel();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.backendPatternsLevel = new BackendPatternsLevel();
});
