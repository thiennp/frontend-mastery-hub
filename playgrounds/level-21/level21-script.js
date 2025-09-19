// Level 21: Cloud Computing Script

class CloudComputingLevel {
    constructor() {
        this.exercises = [
            { id: 1, name: 'AWS Fundamentals', completed: false },
            { id: 2, name: 'Azure Services', completed: false },
            { id: 3, name: 'Google Cloud Platform', completed: false },
            { id: 4, name: 'Serverless Architecture', completed: false },
            { id: 5, name: 'Cloud Deployment & DevOps', completed: false }
        ];
        this.currentExercise = 1;
        this.cloudMetrics = {
            ec2Status: 'Not Created',
            s3Status: 'Not Created',
            lambdaStatus: 'Not Deployed',
            appServiceStatus: 'Not Created',
            functionsStatus: 'Not Deployed',
            storageStatus: 'Not Created',
            computeStatus: 'Not Created',
            gcpFunctionsStatus: 'Not Deployed',
            gcpStorageStatus: 'Not Created',
            serverlessFunctions: 0,
            eventCount: 0,
            apiEndpoints: 0,
            pipelineStatus: 'Not Running',
            infrastructureStatus: 'Not Deployed',
            monitoringStatus: 'Not Configured'
        };
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.initializeCloudSimulation();
        this.updateProgressDisplay();
    }

    setupEventListeners() {
        // Exercise completion tracking
        document.querySelectorAll('.exercise-card').forEach(card => {
            const exerciseId = parseInt(card.dataset.exercise);
            const runBtn = card.querySelector('.run-btn');
            runBtn.addEventListener('click', () => this.runExercise(exerciseId));
        });

        // Level completion
        document.getElementById('completeBtn').addEventListener('click', () => this.completeLevel());
        
        // Reset level
        document.querySelector('.btn-secondary').addEventListener('click', () => this.resetLevel());
    }

    initializeCloudSimulation() {
        // Simulate cloud service status updates
        this.simulateCloudServices();
    }

    simulateCloudServices() {
        // Simulate random cloud service status changes
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.updateRandomCloudMetric();
            }
        }, 3000);
    }

    updateRandomCloudMetric() {
        const metrics = Object.keys(this.cloudMetrics);
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
        
        if (randomMetric.includes('Status')) {
            const statuses = ['Running', 'Stopped', 'Pending', 'Error'];
            this.cloudMetrics[randomMetric] = statuses[Math.floor(Math.random() * statuses.length)];
        } else if (randomMetric.includes('Count') || randomMetric.includes('Functions') || randomMetric.includes('Endpoints')) {
            this.cloudMetrics[randomMetric] = Math.floor(Math.random() * 10);
        }
        
        this.updateMetricsDisplay();
    }

    runExercise(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        const card = document.querySelector(`[data-exercise="${exerciseId}"]`);
        const outputContent = document.getElementById(`outputContent${exerciseId}`);
        const statusElement = card.querySelector('.exercise-status');
        
        // Update status to in-progress
        statusElement.innerHTML = '<i class="fas fa-circle status-in-progress"></i><span>Running...</span>';
        
        // Simulate exercise execution
        setTimeout(() => {
            this.executeExercise(exerciseId, outputContent);
            this.markExerciseComplete(exerciseId);
            this.updateProgressDisplay();
        }, 2000);
    }

    executeExercise(exerciseId, outputContent) {
        switch (exerciseId) {
            case 1:
                this.executeAWSFundamentals(outputContent);
                break;
            case 2:
                this.executeAzureServices(outputContent);
                break;
            case 3:
                this.executeGCPServices(outputContent);
                break;
            case 4:
                this.executeServerlessArchitecture(outputContent);
                break;
            case 5:
                this.executeCloudDevOps(outputContent);
                break;
        }
    }

    executeAWSFundamentals(outputContent) {
        this.cloudMetrics.ec2Status = 'Running';
        this.cloudMetrics.s3Status = 'Running';
        this.cloudMetrics.lambdaStatus = 'Deployed';

        outputContent.innerHTML = `
<div class="aws-infrastructure">
    <h4>🚀 AWS Infrastructure Deployed</h4>
    <div class="infrastructure-diagram">
        <div class="cloud-component">
            <div class="component-title">EC2 Instance</div>
            <div class="component-details">
                Type: t3.micro<br>
                Status: Running<br>
                Public IP: 54.123.45.67<br>
                Security Group: web-server-sg
            </div>
        </div>
        
        <div class="cloud-component">
            <div class="component-title">S3 Bucket</div>
            <div class="component-details">
                Name: my-web-app-assets<br>
                Region: us-east-1<br>
                Status: Active<br>
                Objects: 1,247 files
            </div>
        </div>
        
        <div class="cloud-component">
            <div class="component-title">Lambda Function</div>
            <div class="component-details">
                Name: api-handler<br>
                Runtime: Node.js 18.x<br>
                Memory: 128 MB<br>
                Timeout: 30 seconds
            </div>
        </div>
    </div>
    
    <div class="aws-services">
        <h5>🎯 AWS Services Configured:</h5>
        <div class="service-badges">
            <span class="service-badge aws-service">EC2</span>
            <span class="service-badge aws-service">S3</span>
            <span class="service-badge aws-service">Lambda</span>
            <span class="service-badge aws-service">IAM</span>
            <span class="service-badge aws-service">CloudFront</span>
        </div>
    </div>
    
    <div class="cloud-services">
        <span class="cloud-service service-running">EC2: Running</span>
        <span class="cloud-service service-running">S3: Active</span>
        <span class="cloud-service service-running">Lambda: Deployed</span>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeAzureServices(outputContent) {
        this.cloudMetrics.appServiceStatus = 'Running';
        this.cloudMetrics.functionsStatus = 'Deployed';
        this.cloudMetrics.storageStatus = 'Active';

        outputContent.innerHTML = `
<div class="azure-infrastructure">
    <h4>☁️ Azure Services Deployed</h4>
    <div class="infrastructure-diagram">
        <div class="cloud-component">
            <div class="component-title">App Service</div>
            <div class="component-details">
                Name: my-web-app<br>
                Resource Group: my-resource-group<br>
                SKU: F1 (Free)<br>
                Status: Running
            </div>
        </div>
        
        <div class="cloud-component">
            <div class="component-title">Azure Functions</div>
            <div class="component-details">
                Function App: my-functions<br>
                Runtime: Node.js 18.x<br>
                Functions: 3 deployed<br>
                Status: Active
            </div>
        </div>
        
        <div class="cloud-component">
            <div class="component-title">Storage Account</div>
            <div class="component-details">
                Name: mystorageaccount<br>
                Type: StorageV2<br>
                Tier: Hot<br>
                Status: Active
            </div>
        </div>
    </div>
    
    <div class="azure-services">
        <h5>🎯 Azure Services Configured:</h5>
        <div class="service-badges">
            <span class="service-badge azure-service">App Service</span>
            <span class="service-badge azure-service">Functions</span>
            <span class="service-badge azure-service">Storage</span>
            <span class="service-badge azure-service">DevOps</span>
            <span class="service-badge azure-service">ARM Templates</span>
        </div>
    </div>
    
    <div class="cloud-services">
        <span class="cloud-service service-running">App Service: Running</span>
        <span class="cloud-service service-running">Functions: Deployed</span>
        <span class="cloud-service service-running">Storage: Active</span>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeGCPServices(outputContent) {
        this.cloudMetrics.computeStatus = 'Running';
        this.cloudMetrics.gcpFunctionsStatus = 'Deployed';
        this.cloudMetrics.gcpStorageStatus = 'Active';

        outputContent.innerHTML = `
<div class="gcp-infrastructure">
    <h4>🌐 Google Cloud Platform Deployed</h4>
    <div class="infrastructure-diagram">
        <div class="cloud-component">
            <div class="component-title">Compute Engine</div>
            <div class="component-details">
                Name: my-web-server<br>
                Machine Type: e2-micro<br>
                Zone: us-central1-a<br>
                Status: Running
            </div>
        </div>
        
        <div class="cloud-component">
            <div class="component-title">Cloud Functions</div>
            <div class="component-details">
                Function: apiHandler<br>
                Runtime: Node.js 18<br>
                Memory: 256 MB<br>
                Status: Active
            </div>
        </div>
        
        <div class="cloud-component">
            <div class="component-title">Cloud Storage</div>
            <div class="component-details">
                Bucket: my-web-app-bucket<br>
                Location: US<br>
                Class: STANDARD<br>
                Status: Active
            </div>
        </div>
        
        <div class="cloud-component">
            <div class="component-title">Firebase</div>
            <div class="component-details">
                Project: my-project-id<br>
                Services: Auth, Firestore, Hosting<br>
                Status: Connected
            </div>
        </div>
    </div>
    
    <div class="gcp-services">
        <h5>🎯 GCP Services Configured:</h5>
        <div class="service-badges">
            <span class="service-badge gcp-service">Compute Engine</span>
            <span class="service-badge gcp-service">Cloud Functions</span>
            <span class="service-badge gcp-service">Cloud Storage</span>
            <span class="service-badge gcp-service">Firebase</span>
            <span class="service-badge gcp-service">Cloud Build</span>
        </div>
    </div>
    
    <div class="cloud-services">
        <span class="cloud-service service-running">Compute: Running</span>
        <span class="cloud-service service-running">Functions: Deployed</span>
        <span class="cloud-service service-running">Storage: Active</span>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeServerlessArchitecture(outputContent) {
        this.cloudMetrics.serverlessFunctions = 5;
        this.cloudMetrics.eventCount = 12;
        this.cloudMetrics.apiEndpoints = 8;

        outputContent.innerHTML = `
<div class="serverless-architecture">
    <h4>⚡ Serverless Architecture Deployed</h4>
    <div class="architecture-diagram">
        <div class="architecture-layer">
            <div class="layer-title">
                <i class="fas fa-cloud"></i> API Gateway Layer
            </div>
            <div class="layer-services">
                <span class="service-badge">AWS API Gateway</span>
                <span class="service-badge">Azure API Management</span>
                <span class="service-badge">GCP API Gateway</span>
            </div>
        </div>
        
        <div class="architecture-layer">
            <div class="layer-title">
                <i class="fas fa-server"></i> Function Layer
            </div>
            <div class="layer-services">
                <span class="service-badge">AWS Lambda</span>
                <span class="service-badge">Azure Functions</span>
                <span class="service-badge">GCP Cloud Functions</span>
            </div>
        </div>
        
        <div class="architecture-layer">
            <div class="layer-title">
                <i class="fas fa-database"></i> Data Layer
            </div>
            <div class="layer-services">
                <span class="service-badge">DynamoDB</span>
                <span class="service-badge">Cosmos DB</span>
                <span class="service-badge">Firestore</span>
            </div>
        </div>
    </div>
    
    <div class="serverless-metrics">
        <h5>📊 Serverless Metrics:</h5>
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-title">Functions Deployed</div>
                <div class="metric-value">5</div>
            </div>
            <div class="metric-card">
                <div class="metric-title">Event Handlers</div>
                <div class="metric-value">12</div>
            </div>
            <div class="metric-card">
                <div class="metric-title">API Endpoints</div>
                <div class="metric-value">8</div>
            </div>
        </div>
    </div>
    
    <div class="event-driven-patterns">
        <h5>🎯 Event-Driven Patterns:</h5>
        <ul>
            <li>✅ HTTP triggers for API endpoints</li>
            <li>✅ Database triggers for data changes</li>
            <li>✅ Message queue triggers for async processing</li>
            <li>✅ Scheduled triggers for batch jobs</li>
        </ul>
    </div>
    
    <div class="cloud-services">
        <span class="cloud-service service-running">Functions: 5 Deployed</span>
        <span class="cloud-service service-running">Events: 12 Active</span>
        <span class="cloud-service service-running">APIs: 8 Endpoints</span>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeCloudDevOps(outputContent) {
        this.cloudMetrics.pipelineStatus = 'Running';
        this.cloudMetrics.infrastructureStatus = 'Deployed';
        this.cloudMetrics.monitoringStatus = 'Configured';

        outputContent.innerHTML = `
<div class="cloud-devops">
    <h4>🚀 Cloud DevOps Pipeline Deployed</h4>
    <div class="pipeline-visualization">
        <div class="pipeline-step">
            <div class="step-icon">1</div>
            <div class="step-content">
                <div class="step-title">Source Control</div>
                <div class="step-description">GitHub repository with automated triggers</div>
            </div>
        </div>
        
        <div class="pipeline-step">
            <div class="step-icon">2</div>
            <div class="step-content">
                <div class="step-title">Build & Test</div>
                <div class="step-description">Automated testing and code quality checks</div>
            </div>
        </div>
        
        <div class="pipeline-step">
            <div class="step-icon">3</div>
            <div class="step-content">
                <div class="step-title">Infrastructure as Code</div>
                <div class="step-description">Terraform deployment to multiple environments</div>
            </div>
        </div>
        
        <div class="pipeline-step">
            <div class="step-icon">4</div>
            <div class="step-content">
                <div class="step-title">Deploy</div>
                <div class="step-description">Multi-cloud deployment with blue-green strategy</div>
            </div>
        </div>
        
        <div class="pipeline-step">
            <div class="step-icon">5</div>
            <div class="step-content">
                <div class="step-title">Monitor</div>
                <div class="step-description">Real-time monitoring and alerting</div>
            </div>
        </div>
    </div>
    
    <div class="infrastructure-status">
        <h5>🏗️ Infrastructure Status:</h5>
        <div class="infra-grid">
            <div class="infra-item">
                <span class="infra-label">Terraform State:</span>
                <span class="service-status service-running">Deployed</span>
            </div>
            <div class="infra-item">
                <span class="infra-label">CI/CD Pipeline:</span>
                <span class="service-status service-running">Active</span>
            </div>
            <div class="infra-item">
                <span class="infra-label">Monitoring:</span>
                <span class="service-status service-running">Configured</span>
            </div>
            <div class="infra-item">
                <span class="infra-label">Logging:</span>
                <span class="service-status service-running">Active</span>
            </div>
        </div>
    </div>
    
    <div class="monitoring-dashboard">
        <h5>📊 Monitoring Dashboard:</h5>
        <div class="monitoring-metrics">
            <div class="monitor-card">
                <div class="monitor-title">Application Performance</div>
                <div class="monitor-value">99.9% Uptime</div>
            </div>
            <div class="monitor-card">
                <div class="monitor-title">Response Time</div>
                <div class="monitor-value">120ms Avg</div>
            </div>
            <div class="monitor-card">
                <div class="monitor-title">Error Rate</div>
                <div class="monitor-value">0.01%</div>
            </div>
        </div>
    </div>
    
    <div class="cloud-services">
        <span class="cloud-service service-running">Pipeline: Running</span>
        <span class="cloud-service service-running">Infrastructure: Deployed</span>
        <span class="cloud-service service-running">Monitoring: Configured</span>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    markExerciseComplete(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        exercise.completed = true;
        
        const card = document.querySelector(`[data-exercise="${exerciseId}"]`);
        const statusElement = card.querySelector('.exercise-status');
        
        card.classList.add('completed');
        statusElement.innerHTML = '<i class="fas fa-circle status-completed"></i><span>Completed</span>';
        
        // Add success animation
        card.classList.add('success-animation');
        setTimeout(() => {
            card.classList.remove('success-animation');
        }, 600);
        
        this.saveProgress();
    }

    updateMetricsDisplay() {
        // Update AWS metrics
        document.getElementById('ec2Status').textContent = this.cloudMetrics.ec2Status;
        document.getElementById('s3Status').textContent = this.cloudMetrics.s3Status;
        document.getElementById('lambdaStatus').textContent = this.cloudMetrics.lambdaStatus;

        // Update Azure metrics
        document.getElementById('appServiceStatus').textContent = this.cloudMetrics.appServiceStatus;
        document.getElementById('functionsStatus').textContent = this.cloudMetrics.functionsStatus;
        document.getElementById('storageStatus').textContent = this.cloudMetrics.storageStatus;

        // Update GCP metrics
        document.getElementById('computeStatus').textContent = this.cloudMetrics.computeStatus;
        document.getElementById('gcpFunctionsStatus').textContent = this.cloudMetrics.gcpFunctionsStatus;
        document.getElementById('gcpStorageStatus').textContent = this.cloudMetrics.gcpStorageStatus;

        // Update serverless metrics
        document.getElementById('serverlessFunctions').textContent = this.cloudMetrics.serverlessFunctions;
        document.getElementById('eventCount').textContent = this.cloudMetrics.eventCount;
        document.getElementById('apiEndpoints').textContent = this.cloudMetrics.apiEndpoints;

        // Update DevOps metrics
        document.getElementById('pipelineStatus').textContent = this.cloudMetrics.pipelineStatus;
        document.getElementById('infrastructureStatus').textContent = this.cloudMetrics.infrastructureStatus;
        document.getElementById('monitoringStatus').textContent = this.cloudMetrics.monitoringStatus;
    }

    updateProgressDisplay() {
        const completedCount = this.exercises.filter(ex => ex.completed).length;
        const totalCount = this.exercises.length;
        const percentage = (completedCount / totalCount) * 100;

        // Update progress bar
        const progressFill = document.getElementById('overallProgress');
        progressFill.style.width = `${percentage}%`;

        // Update progress text
        const progressText = document.querySelector('.progress-text');
        progressText.textContent = `${completedCount}/${totalCount} Complete`;

        // Enable/disable complete button
        const completeBtn = document.getElementById('completeBtn');
        completeBtn.disabled = completedCount < totalCount;
    }

    completeLevel() {
        if (this.exercises.every(ex => ex.completed)) {
            // Show completion animation
            this.showCompletionAnimation();
            
            // Update local storage
            const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
            if (!completedLevels.includes(21)) {
                completedLevels.push(21);
                localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
            }

            // Update progress
            const totalProgress = JSON.parse(localStorage.getItem('totalProgress') || '0');
            localStorage.setItem('totalProgress', Math.max(totalProgress, 21).toString());

            // Show success message
            setTimeout(() => {
                alert('🎉 Congratulations! You\'ve completed Level 21: Cloud Computing!\n\nYou\'ve mastered:\n• AWS fundamentals and services\n• Azure services and deployment\n• Google Cloud Platform integration\n• Serverless architecture patterns\n• Cloud DevOps and automation');
                
                // Redirect to main hub
                window.location.href = '../../index.html';
            }, 2000);
        }
    }

    showCompletionAnimation() {
        const container = document.querySelector('.level-container');
        container.style.position = 'relative';
        container.style.overflow = 'hidden';

        // Create cloud confetti effect
        for (let i = 0; i < 30; i++) {
            const cloud = document.createElement('div');
            cloud.style.position = 'absolute';
            cloud.style.width = '20px';
            cloud.style.height = '20px';
            cloud.style.backgroundColor = ['#0078d4', '#00d4aa', '#ff6b35', '#4285f4'][Math.floor(Math.random() * 4)];
            cloud.style.left = Math.random() * 100 + '%';
            cloud.style.top = '-20px';
            cloud.style.borderRadius = '50%';
            cloud.style.animation = `cloudFall ${Math.random() * 2 + 2}s linear forwards`;
            cloud.style.opacity = '0.8';
            container.appendChild(cloud);

            setTimeout(() => cloud.remove(), 4000);
        }

        // Add cloud animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes cloudFall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    resetLevel() {
        if (confirm('Are you sure you want to reset this level? All progress will be lost.')) {
            this.exercises.forEach(ex => ex.completed = false);
            
            // Reset UI
            document.querySelectorAll('.exercise-card').forEach(card => {
                card.classList.remove('completed');
                const statusElement = card.querySelector('.exercise-status');
                statusElement.innerHTML = '<i class="fas fa-circle status-pending"></i><span>Pending</span>';
            });

            // Clear outputs
            document.querySelectorAll('.output-content').forEach(output => {
                output.innerHTML = '';
            });

            // Reset metrics
            this.cloudMetrics = {
                ec2Status: 'Not Created',
                s3Status: 'Not Created',
                lambdaStatus: 'Not Deployed',
                appServiceStatus: 'Not Created',
                functionsStatus: 'Not Deployed',
                storageStatus: 'Not Created',
                computeStatus: 'Not Created',
                gcpFunctionsStatus: 'Not Deployed',
                gcpStorageStatus: 'Not Created',
                serverlessFunctions: 0,
                eventCount: 0,
                apiEndpoints: 0,
                pipelineStatus: 'Not Running',
                infrastructureStatus: 'Not Deployed',
                monitoringStatus: 'Not Configured'
            };

            this.updateProgressDisplay();
            this.updateMetricsDisplay();
            this.saveProgress();
        }
    }

    saveProgress() {
        localStorage.setItem('level21Progress', JSON.stringify({
            exercises: this.exercises,
            cloudMetrics: this.cloudMetrics
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem('level21Progress');
        if (saved) {
            const data = JSON.parse(saved);
            this.exercises = data.exercises || this.exercises;
            this.cloudMetrics = data.cloudMetrics || this.cloudMetrics;
            
            // Update UI based on saved progress
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
    if (window.cloudLevel) {
        window.cloudLevel.runExercise(exerciseId);
    }
}

function completeLevel() {
    if (window.cloudLevel) {
        window.cloudLevel.completeLevel();
    }
}

function resetLevel() {
    if (window.cloudLevel) {
        window.cloudLevel.resetLevel();
    }
}

// Initialize the level when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.cloudLevel = new CloudComputingLevel();
});

// Add additional CSS for the dynamic content
const additionalStyles = `
<style>
.service-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.service-badge {
    background: rgba(0, 120, 212, 0.1);
    color: var(--azure-color);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    border: 1px solid rgba(0, 120, 212, 0.3);
}

.aws-service {
    background: rgba(255, 153, 0, 0.1);
    color: var(--aws-color);
    border-color: rgba(255, 153, 0, 0.3);
}

.gcp-service {
    background: rgba(66, 133, 244, 0.1);
    color: var(--gcp-color);
    border-color: rgba(66, 133, 244, 0.3);
}

.azure-service {
    background: rgba(0, 120, 212, 0.1);
    color: var(--azure-color);
    border-color: rgba(0, 120, 212, 0.3);
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin: 15px 0;
}

.metric-card {
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 15px;
    text-align: center;
}

.metric-title {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 8px;
}

.metric-value {
    color: var(--accent-color);
    font-size: 1.5rem;
    font-weight: bold;
}

.infra-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
    margin: 15px 0;
}

.infra-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: var(--surface-color);
    border-radius: 6px;
    border: 1px solid var(--border-color);
}

.infra-label {
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.monitoring-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin: 15px 0;
}

.monitor-card {
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 15px;
    text-align: center;
}

.monitor-title {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 8px;
}

.monitor-value {
    color: var(--success-color);
    font-size: 1.2rem;
    font-weight: bold;
}

.cloud-services {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 15px;
}

.cloud-service {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
    margin: 2px;
}

.service-running {
    background: rgba(40, 167, 69, 0.1);
    color: var(--success-color);
    border: 1px solid rgba(40, 167, 69, 0.3);
}

.service-stopped {
    background: rgba(220, 53, 69, 0.1);
    color: var(--error-color);
    border: 1px solid rgba(220, 53, 69, 0.3);
}

.service-pending {
    background: rgba(255, 193, 7, 0.1);
    color: var(--warning-color);
    border: 1px solid rgba(255, 193, 7, 0.3);
}

@media (max-width: 768px) {
    .metrics-grid,
    .monitoring-metrics {
        grid-template-columns: 1fr;
    }
    
    .infra-grid {
        grid-template-columns: 1fr;
    }
    
    .cloud-services {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);
