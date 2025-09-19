// Level 24: AI/ML Integration Script

class AIMLLevel {
    constructor() {
        this.exercises = [
            { id: 1, name: 'Machine Learning APIs', completed: false },
            { id: 2, name: 'TensorFlow.js', completed: false },
            { id: 3, name: 'AI-Powered Features', completed: false },
            { id: 4, name: 'Natural Language Processing', completed: false },
            { id: 5, name: 'Computer Vision', completed: false }
        ];
        this.aiMetrics = {
            apiCount: 0,
            apiAccuracy: 0,
            apiResponse: 0,
            tfEpochs: 0,
            tfLoss: 0.0000,
            tfAccuracy: 0,
            aiFeatures: 0,
            aiAccuracy: 0,
            aiUsers: 0,
            nlpTokens: 0,
            nlpSentiment: 'Neutral',
            nlpEntities: 0,
            cvObjects: 0,
            cvFaces: 0,
            cvAccuracy: 0
        };
        this.models = new Map();
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.simulateAIEnvironment();
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

    simulateAIEnvironment() {
        // Simulate dynamic AI metrics updates
        setInterval(() => {
            if (Math.random() > 0.6) {
                this.updateRandomAIMetric();
            }
        }, 6000);
    }

    updateRandomAIMetric() {
        const metrics = Object.keys(this.aiMetrics);
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
        
        if (randomMetric.includes('Count') || randomMetric.includes('Features') || randomMetric.includes('Users')) {
            this.aiMetrics[randomMetric] = Math.floor(Math.random() * 100) + 10;
        } else if (randomMetric.includes('Accuracy')) {
            this.aiMetrics[randomMetric] = Math.floor(Math.random() * 30) + 70;
        } else if (randomMetric.includes('Response')) {
            this.aiMetrics[randomMetric] = Math.floor(Math.random() * 500) + 100;
        } else if (randomMetric === 'tfLoss') {
            this.aiMetrics[randomMetric] = (Math.random() * 0.1).toFixed(4);
        } else if (randomMetric === 'nlpSentiment') {
            const sentiments = ['Positive', 'Negative', 'Neutral'];
            this.aiMetrics[randomMetric] = sentiments[Math.floor(Math.random() * sentiments.length)];
        }
        
        this.updateMetricsDisplay();
    }

    runExercise(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        const card = document.querySelector(`[data-exercise="${exerciseId}"]`);
        const outputContent = document.getElementById(`outputContent${exerciseId}`);
        const statusElement = card.querySelector('.exercise-status');
        
        statusElement.innerHTML = '<i class="fas fa-circle status-in-progress"></i><span>Processing AI...</span>';
        
        setTimeout(() => {
            this.executeAIExercise(exerciseId, outputContent);
            this.markExerciseComplete(exerciseId);
            this.updateProgressDisplay();
        }, 3500);
    }

    executeAIExercise(exerciseId, outputContent) {
        switch (exerciseId) {
            case 1:
                this.executeMachineLearningAPIs(outputContent);
                break;
            case 2:
                this.executeTensorFlowJS(outputContent);
                break;
            case 3:
                this.executeAIPoweredFeatures(outputContent);
                break;
            case 4:
                this.executeNaturalLanguageProcessing(outputContent);
                break;
            case 5:
                this.executeComputerVision(outputContent);
                break;
        }
    }

    executeMachineLearningAPIs(outputContent) {
        this.aiMetrics.apiCount = 5;
        this.aiMetrics.apiAccuracy = 94;
        this.aiMetrics.apiResponse = 250;

        outputContent.innerHTML = `
<div class="ml-apis">
    <h4>🤖 Machine Learning APIs Connected</h4>
    
    <div class="api-services">
        <h5>🌐 Connected Services:</h5>
        <div style="margin: 15px 0;">
            <span class="ai-result ml-prediction">Google Cloud Vision API ✓</span>
            <span class="ai-result ml-prediction">Azure Cognitive Services ✓</span>
            <span class="ai-result ml-prediction">AWS Comprehend ✓</span>
            <span class="ai-result ml-prediction">OpenAI GPT API ✓</span>
            <span class="ai-result ml-prediction">IBM Watson ✓</span>
        </div>
    </div>
    
    <div class="api-analysis">
        <h5>📊 API Analysis Results:</h5>
        <div class="training-metrics">
            <div class="training-metric">
                <div class="metric-title">Image Recognition</div>
                <div class="metric-value">96%</div>
            </div>
            <div class="training-metric">
                <div class="metric-title">Sentiment Analysis</div>
                <div class="metric-value">92%</div>
            </div>
            <div class="training-metric">
                <div class="metric-title">Text Translation</div>
                <div class="metric-value">89%</div>
            </div>
            <div class="training-metric">
                <div class="metric-title">Speech Recognition</div>
                <div class="metric-value">94%</div>
            </div>
        </div>
    </div>
    
    <div class="api-predictions">
        <h5>🎯 Real-time Predictions:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            📸 Image: "Cat detected with 97.3% confidence"<br>
            💬 Text: "Positive sentiment score: 0.85"<br>
            🗣️ Audio: "Speech transcribed: 'Hello world'"<br>
            📈 Data: "Trend prediction: 15% increase likely"<br>
            🌍 Translation: "English → Spanish: 99% accuracy"
        </div>
    </div>
    
    <div class="performance-metrics">
        <h5>⚡ Performance Metrics:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Average Response Time: 250ms<br>
            API Calls Today: 1,247<br>
            Success Rate: 99.8%<br>
            Cost Efficiency: $0.002 per call<br>
            Rate Limit: 1000/hour remaining
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeTensorFlowJS(outputContent) {
        this.aiMetrics.tfEpochs = 100;
        this.aiMetrics.tfLoss = 0.0023;
        this.aiMetrics.tfAccuracy = 98;

        outputContent.innerHTML = `
<div class="tensorflow-training">
    <h4>🧠 TensorFlow.js Model Training Complete</h4>
    
    <div class="neural-network">
        <div class="neural-layer">
            <div class="neural-node"></div>
            <div class="neural-node"></div>
            <div class="neural-node"></div>
            <div class="neural-node"></div>
        </div>
        <div class="neural-layer">
            <div class="neural-node"></div>
            <div class="neural-node"></div>
            <div class="neural-node"></div>
        </div>
        <div class="neural-layer">
            <div class="neural-node"></div>
            <div class="neural-node"></div>
        </div>
        <div class="neural-layer">
            <div class="neural-node"></div>
        </div>
    </div>
    
    <div class="training-progress">
        <h5>📈 Training Progress:</h5>
        <div class="training-metrics">
            <div class="training-metric">
                <div class="metric-title">Epochs</div>
                <div class="metric-value">100</div>
            </div>
            <div class="training-metric">
                <div class="metric-title">Loss</div>
                <div class="metric-value">0.0023</div>
            </div>
            <div class="training-metric">
                <div class="metric-title">Accuracy</div>
                <div class="metric-value">98.2%</div>
            </div>
            <div class="training-metric">
                <div class="metric-title">Val Accuracy</div>
                <div class="metric-value">97.8%</div>
            </div>
        </div>
    </div>
    
    <div class="model-architecture">
        <h5>🏗️ Model Architecture:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Input Layer: 784 neurons (28x28 pixels)<br>
            Hidden Layer 1: 128 neurons (ReLU)<br>
            Hidden Layer 2: 64 neurons (ReLU)<br>
            Output Layer: 10 neurons (Softmax)<br>
            Total Parameters: 101,770
        </div>
    </div>
    
    <div class="prediction-results">
        <h5>🎯 Test Predictions:</h5>
        <div style="margin: 10px 0;">
            <span class="ai-result tensorflow-model">Digit 7: 99.1% confidence</span>
            <span class="ai-result tensorflow-model">Digit 3: 97.5% confidence</span>
            <span class="ai-result tensorflow-model">Digit 1: 98.8% confidence</span>
            <span class="ai-result tensorflow-model">Digit 9: 96.2% confidence</span>
        </div>
    </div>
    
    <div class="model-performance">
        <h5>📊 Performance Analysis:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Training Time: 2.3 minutes<br>
            Inference Speed: 15ms per prediction<br>
            Model Size: 1.2 MB<br>
            Browser Compatibility: 100%<br>
            Memory Usage: 45 MB
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeAIPoweredFeatures(outputContent) {
        this.aiMetrics.aiFeatures = 8;
        this.aiMetrics.aiAccuracy = 91;
        this.aiMetrics.aiUsers = 2453;

        outputContent.innerHTML = `
<div class="ai-features">
    <h4>✨ AI-Powered Features Activated</h4>
    
    <div class="smart-recommendations">
        <h5>🎯 Smart Recommendations Engine:</h5>
        <div style="margin: 15px 0;">
            <span class="ai-result ai-confidence-high">Content Match: 94%</span>
            <span class="ai-result ai-confidence-high">User Preference: 89%</span>
            <span class="ai-result ai-confidence-medium">Trending Factor: 76%</span>
            <span class="ai-result ai-confidence-high">Context Relevance: 92%</span>
        </div>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Generated 247 personalized recommendations<br>
            Click-through rate increased by 34%<br>
            User engagement up 28%
        </div>
    </div>
    
    <div class="content-generation">
        <h5>📝 Automated Content Generation:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>AI-Generated Summary:</strong><br>
            "This comprehensive tutorial covers advanced machine learning techniques, 
            providing practical examples and real-world applications. Perfect for 
            developers looking to enhance their AI skills with hands-on experience."
        </div>
        <div style="margin: 10px 0;">
            <span class="ai-result ml-training">Auto-Tags: machine-learning, tutorial, advanced</span>
            <span class="ai-result ml-training">SEO Score: 87/100</span>
            <span class="ai-result ml-training">Readability: Grade 8</span>
        </div>
    </div>
    
    <div class="intelligent-search">
        <h5>🔍 Intelligent Search Results:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Query: "machine learning tutorials for beginners"<br>
            <br>
            🎯 <strong>Smart Results (Relevance: 96%)</strong><br>
            1. "Introduction to ML" - Perfect match<br>
            2. "Python for AI Beginners" - High relevance<br>
            3. "Data Science Basics" - Related topic<br>
            <br>
            Search improvements:<br>
            • Semantic understanding: ✓<br>
            • Intent recognition: ✓<br>
            • Personalized results: ✓<br>
            • Auto-suggestions: ✓
        </div>
    </div>
    
    <div class="insights-generation">
        <h5>📊 Automated Insights:</h5>
        <div class="training-metrics">
            <div class="training-metric">
                <div class="metric-title">User Behavior</div>
                <div class="metric-value">Analyzed</div>
            </div>
            <div class="training-metric">
                <div class="metric-title">Trend Detection</div>
                <div class="metric-value">Active</div>
            </div>
            <div class="training-metric">
                <div class="metric-title">Anomaly Alerts</div>
                <div class="metric-value">3 Found</div>
            </div>
            <div class="training-metric">
                <div class="metric-title">Predictions</div>
                <div class="metric-value">Generated</div>
            </div>
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeNaturalLanguageProcessing(outputContent) {
        this.aiMetrics.nlpTokens = 1247;
        this.aiMetrics.nlpSentiment = 'Positive';
        this.aiMetrics.nlpEntities = 23;

        outputContent.innerHTML = `
<div class="nlp-processing">
    <h4>💬 Natural Language Processing Complete</h4>
    
    <div class="sentiment-analysis">
        <div class="sentiment-score sentiment-positive">
            <div class="metric-title">Positive</div>
            <div class="metric-value">78%</div>
        </div>
        <div class="sentiment-score sentiment-neutral">
            <div class="metric-title">Neutral</div>
            <div class="metric-value">18%</div>
        </div>
        <div class="sentiment-score sentiment-negative">
            <div class="metric-title">Negative</div>
            <div class="metric-value">4%</div>
        </div>
    </div>
    
    <div class="text-analysis">
        <h5>📝 Text Analysis Results:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Total Tokens: 1,247<br>
            Unique Words: 456<br>
            Reading Level: Grade 7<br>
            Estimated Reading Time: 4.2 minutes<br>
            Language Detected: English (99.8% confidence)
        </div>
    </div>
    
    <div class="entity-extraction">
        <h5>🏷️ Named Entity Recognition:</h5>
        <div style="margin: 10px 0;">
            <span class="ai-result ai-confidence-high">PERSON: John Smith</span>
            <span class="ai-result ai-confidence-high">ORG: Microsoft</span>
            <span class="ai-result ai-confidence-medium">LOC: San Francisco</span>
            <span class="ai-result ai-confidence-high">DATE: March 15, 2024</span>
            <span class="ai-result ai-confidence-medium">MONEY: $1,000</span>
        </div>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Total Entities Found: 23<br>
            Confidence Average: 94.2%<br>
            Processing Time: 120ms
        </div>
    </div>
    
    <div class="keyword-extraction">
        <h5>🔑 Key Terms & Topics:</h5>
        <div style="margin: 10px 0;">
            <span class="ai-result ml-prediction">machine learning (15 mentions)</span>
            <span class="ai-result ml-prediction">artificial intelligence (12)</span>
            <span class="ai-result ml-prediction">data science (8)</span>
            <span class="ai-result ml-prediction">neural networks (6)</span>
            <span class="ai-result ml-prediction">automation (5)</span>
        </div>
    </div>
    
    <div class="chatbot-demo">
        <h5>🤖 Chatbot Responses:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <div style="margin-bottom: 10px;">
                <strong>User:</strong> "What is machine learning?"<br>
                <strong>Bot:</strong> "Machine learning is a subset of AI that enables systems to learn and improve from data without explicit programming. It uses algorithms to identify patterns and make predictions."
            </div>
            <div>
                <strong>User:</strong> "How do I get started?"<br>
                <strong>Bot:</strong> "I recommend starting with Python basics, then exploring libraries like scikit-learn and TensorFlow. Our beginner tutorials are perfect for this!"
            </div>
        </div>
        <div style="margin: 10px 0;">
            <span class="ai-result ai-confidence-high">Intent Recognition: 96%</span>
            <span class="ai-result ai-confidence-high">Response Accuracy: 94%</span>
            <span class="ai-result ai-confidence-medium">Context Retention: 89%</span>
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeComputerVision(outputContent) {
        this.aiMetrics.cvObjects = 12;
        this.aiMetrics.cvFaces = 3;
        this.aiMetrics.cvAccuracy = 96;

        outputContent.innerHTML = `
<div class="computer-vision">
    <h4>👁️ Computer Vision Analysis Complete</h4>
    
    <div class="cv-detection">
        <h5>🎯 Object Detection Results:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color); text-align: center;">
            <div style="width: 200px; height: 150px; background: linear-gradient(45deg, #667eea, #764ba2); margin: 0 auto; border-radius: 8px; position: relative; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                📷 Sample Image Analysis
                <div class="detection-box" style="width: 60px; height: 40px; top: 20px; left: 30px;">
                    <div class="detection-label">Person 97%</div>
                </div>
                <div class="detection-box" style="width: 40px; height: 30px; top: 30px; right: 20px;">
                    <div class="detection-label">Car 89%</div>
                </div>
            </div>
        </div>
        <div style="margin: 10px 0;">
            <span class="ai-result ai-confidence-high">Person: 97.3%</span>
            <span class="ai-result ai-confidence-high">Car: 89.1%</span>
            <span class="ai-result ai-confidence-medium">Building: 78.4%</span>
            <span class="ai-result ai-confidence-high">Tree: 92.7%</span>
            <span class="ai-result ai-confidence-medium">Sign: 82.1%</span>
        </div>
    </div>
    
    <div class="face-detection">
        <h5>😊 Face Recognition & Analysis:</h5>
        <div class="training-metrics">
            <div class="training-metric">
                <div class="metric-title">Faces Detected</div>
                <div class="metric-value">3</div>
            </div>
            <div class="training-metric">
                <div class="metric-title">Age Estimation</div>
                <div class="metric-value">±3 years</div>
            </div>
            <div class="training-metric">
                <div class="metric-title">Emotion Analysis</div>
                <div class="metric-value">Happy</div>
            </div>
            <div class="training-metric">
                <div class="metric-title">Gender Detection</div>
                <div class="metric-value">94% Acc</div>
            </div>
        </div>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Face 1: Male, ~28 years, Happy (87%), Looking forward<br>
            Face 2: Female, ~34 years, Neutral (76%), Profile view<br>
            Face 3: Male, ~19 years, Surprised (92%), Tilted head
        </div>
    </div>
    
    <div class="image-classification">
        <h5>🏷️ Image Classification:</h5>
        <div style="margin: 10px 0;">
            <span class="ai-result tensorflow-model">Street Scene: 94.2%</span>
            <span class="ai-result tensorflow-model">Urban Environment: 89.7%</span>
            <span class="ai-result tensorflow-model">Daytime: 97.1%</span>
            <span class="ai-result tensorflow-model">Clear Weather: 85.3%</span>
        </div>
    </div>
    
    <div class="ocr-results">
        <h5>📖 Optical Character Recognition:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>Extracted Text:</strong><br>
            "STOP"<br>
            "Main Street"<br>
            "Speed Limit 25"<br>
            "No Parking"<br>
            "One Way →"
        </div>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Text Regions: 5<br>
            Average Confidence: 94.7%<br>
            Languages Detected: English<br>
            Processing Time: 340ms
        </div>
    </div>
    
    <div class="analysis-summary">
        <h5>📊 Analysis Summary:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Total Objects Identified: 12<br>
            Scene Classification: Urban street scene<br>
            Safety Assessment: Multiple traffic signs detected<br>
            Quality Score: 96/100<br>
            Recommended Actions: Traffic monitoring, pedestrian safety
        </div>
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
        
        card.classList.add('success-animation');
        setTimeout(() => {
            card.classList.remove('success-animation');
        }, 600);
        
        this.saveProgress();
    }

    updateMetricsDisplay() {
        // Update ML API metrics
        document.getElementById('apiCount').textContent = this.aiMetrics.apiCount;
        document.getElementById('apiAccuracy').textContent = `${this.aiMetrics.apiAccuracy}%`;
        document.getElementById('apiResponse').textContent = `${this.aiMetrics.apiResponse}ms`;

        // Update TensorFlow metrics
        document.getElementById('tfEpochs').textContent = this.aiMetrics.tfEpochs;
        document.getElementById('tfLoss').textContent = this.aiMetrics.tfLoss;
        document.getElementById('tfAccuracy').textContent = `${this.aiMetrics.tfAccuracy}%`;

        // Update AI Features metrics
        document.getElementById('aiFeatures').textContent = this.aiMetrics.aiFeatures;
        document.getElementById('aiAccuracy').textContent = `${this.aiMetrics.aiAccuracy}%`;
        document.getElementById('aiUsers').textContent = this.aiMetrics.aiUsers;

        // Update NLP metrics
        document.getElementById('nlpTokens').textContent = this.aiMetrics.nlpTokens;
        document.getElementById('nlpSentiment').textContent = this.aiMetrics.nlpSentiment;
        document.getElementById('nlpEntities').textContent = this.aiMetrics.nlpEntities;

        // Update Computer Vision metrics
        document.getElementById('cvObjects').textContent = this.aiMetrics.cvObjects;
        document.getElementById('cvFaces').textContent = this.aiMetrics.cvFaces;
        document.getElementById('cvAccuracy').textContent = `${this.aiMetrics.cvAccuracy}%`;
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
            if (!completedLevels.includes(24)) {
                completedLevels.push(24);
                localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
            }

            const totalProgress = JSON.parse(localStorage.getItem('totalProgress') || '0');
            localStorage.setItem('totalProgress', Math.max(totalProgress, 24).toString());

            setTimeout(() => {
                alert('🎉 Congratulations! You\'ve completed Level 24: AI/ML Integration!\n\nYou\'ve mastered:\n• Machine Learning API integration\n• TensorFlow.js model training\n• AI-powered feature implementation\n• Natural Language Processing\n• Computer Vision capabilities');
                
                window.location.href = '../../index.html';
            }, 2000);
        }
    }

    showCompletionAnimation() {
        const container = document.querySelector('.level-container');
        container.style.position = 'relative';
        container.style.overflow = 'hidden';

        for (let i = 0; i < 35; i++) {
            const aiIcon = document.createElement('div');
            aiIcon.style.position = 'absolute';
            aiIcon.style.fontSize = '20px';
            aiIcon.innerHTML = ['🤖', '🧠', '⚡', '👁️', '💬', '🎯', '📊'][Math.floor(Math.random() * 7)];
            aiIcon.style.left = Math.random() * 100 + '%';
            aiIcon.style.top = '-30px';
            aiIcon.style.animation = `aiFall ${Math.random() * 2 + 2}s linear forwards`;
            aiIcon.style.opacity = '0.8';
            aiIcon.classList.add('ai-processing');
            container.appendChild(aiIcon);

            setTimeout(() => aiIcon.remove(), 4000);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes aiFall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    resetLevel() {
        if (confirm('Are you sure you want to reset this level? All AI progress will be lost.')) {
            this.exercises.forEach(ex => ex.completed = false);
            
            document.querySelectorAll('.exercise-card').forEach(card => {
                card.classList.remove('completed');
                const statusElement = card.querySelector('.exercise-status');
                statusElement.innerHTML = '<i class="fas fa-circle status-pending"></i><span>Pending</span>';
            });

            document.querySelectorAll('.output-content').forEach(output => {
                output.innerHTML = '';
            });

            this.aiMetrics = {
                apiCount: 0, apiAccuracy: 0, apiResponse: 0,
                tfEpochs: 0, tfLoss: 0.0000, tfAccuracy: 0,
                aiFeatures: 0, aiAccuracy: 0, aiUsers: 0,
                nlpTokens: 0, nlpSentiment: 'Neutral', nlpEntities: 0,
                cvObjects: 0, cvFaces: 0, cvAccuracy: 0
            };

            this.updateProgressDisplay();
            this.updateMetricsDisplay();
            this.saveProgress();
        }
    }

    saveProgress() {
        localStorage.setItem('level24Progress', JSON.stringify({
            exercises: this.exercises,
            aiMetrics: this.aiMetrics
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem('level24Progress');
        if (saved) {
            const data = JSON.parse(saved);
            this.exercises = data.exercises || this.exercises;
            this.aiMetrics = data.aiMetrics || this.aiMetrics;
            
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
    if (window.aimlLevel) {
        window.aimlLevel.runExercise(exerciseId);
    }
}

function completeLevel() {
    if (window.aimlLevel) {
        window.aimlLevel.completeLevel();
    }
}

function resetLevel() {
    if (window.aimlLevel) {
        window.aimlLevel.resetLevel();
    }
}

// Initialize the level when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.aimlLevel = new AIMLLevel();
});
