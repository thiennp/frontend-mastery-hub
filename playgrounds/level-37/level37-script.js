// Level 37: AI/ML Integration Script

// Exercise validation patterns
const exercisePatterns = {
    1: {
        required: ['MLAPIManager', 'classifyText', 'recognizeImage', 'generateRecommendations', 'analyzeSentiment'],
        description: 'Machine Learning APIs'
    },
    2: {
        required: ['TensorFlowManager', 'createNeuralNetwork', 'loadPretrainedModel', 'trainModel', 'predict'],
        description: 'TensorFlow.js'
    },
    3: {
        required: ['ComputerVisionManager', 'detectObjects', 'recognizeFaces', 'processImage', 'extractText'],
        description: 'Computer Vision'
    },
    4: {
        required: ['NLPManager', 'preprocessText', 'extractEntities', 'summarizeText', 'detectLanguage'],
        description: 'Natural Language Processing'
    },
    5: {
        required: ['AIFeaturesManager', 'createChatbot', 'createRecommendationEngine', 'createAutomationRule', 'smartSearch'],
        description: 'AI-powered Features'
    }
};

// Initialize level
document.addEventListener('DOMContentLoaded', function() {
    initializeLevel();
    loadProgress();
});

function initializeLevel() {
    // Set up code editors
    for (let i = 1; i <= 5; i++) {
        const textarea = document.getElementById(`code${i}`);
        if (textarea) {
            textarea.addEventListener('input', function() {
                clearOutput(i);
            });
        }
    }
    
    // Initialize progress
    updateProgress();
}

function runCode(exerciseNumber) {
    const code = document.getElementById(`code${exerciseNumber}`).value;
    const output = document.getElementById(`output${exerciseNumber}`);
    
    if (!code.trim()) {
        showOutput(exerciseNumber, 'Please enter some code to run.', 'error');
        return;
    }
    
    try {
        // Capture console output
        const originalLog = console.log;
        const originalError = console.error;
        let outputText = '';
        
        console.log = function(...args) {
            outputText += args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') + '\n';
        };
        
        console.error = function(...args) {
            outputText += 'ERROR: ' + args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') + '\n';
        };
        
        // Execute code
        const result = eval(code);
        
        // Restore console
        console.log = originalLog;
        console.error = originalError;
        
        // Show output
        if (outputText) {
            showOutput(exerciseNumber, outputText, 'success');
        } else if (result !== undefined) {
            showOutput(exerciseNumber, JSON.stringify(result, null, 2), 'success');
        } else {
            showOutput(exerciseNumber, 'Code executed successfully!', 'success');
        }
        
    } catch (error) {
        showOutput(exerciseNumber, `Error: ${error.message}`, 'error');
    }
}

function validateExercise(exerciseNumber) {
    const code = document.getElementById(`code${exerciseNumber}`).value;
    const pattern = exercisePatterns[exerciseNumber];
    
    if (!pattern) {
        showOutput(exerciseNumber, 'Validation pattern not found.', 'error');
        return;
    }
    
    let missing = [];
    let found = [];
    
    // Check for required patterns
    for (const required of pattern.required) {
        if (code.includes(required)) {
            found.push(required);
        } else {
            missing.push(required);
        }
    }
    
    let message = `Validating ${pattern.description}...\n\n`;
    
    if (found.length > 0) {
        message += `✅ Found: ${found.join(', ')}\n`;
    }
    
    if (missing.length > 0) {
        message += `❌ Missing: ${missing.join(', ')}\n`;
    }
    
    if (missing.length === 0) {
        message += `\n🎉 Exercise completed successfully!`;
        markExerciseComplete(exerciseNumber);
        showOutput(exerciseNumber, message, 'success');
    } else {
        message += `\n📝 Please implement the missing components.`;
        showOutput(exerciseNumber, message, 'error');
    }
}

function showOutput(exerciseNumber, message, type = 'success') {
    const output = document.getElementById(`output${exerciseNumber}`);
    output.textContent = message;
    output.className = `output ${type}`;
}

function clearOutput(exerciseNumber) {
    const output = document.getElementById(`output${exerciseNumber}`);
    output.textContent = '';
    output.className = 'output';
}

function markExerciseComplete(exerciseNumber) {
    const exercise = document.getElementById(`exercise${exerciseNumber}`);
    exercise.classList.add('completed');
    
    // Update progress
    updateProgress();
    saveProgress();
}

function updateProgress() {
    const completedExercises = document.querySelectorAll('.exercise.completed').length;
    const progressFill = document.getElementById('progressFill');
    const completedSpan = document.getElementById('completedExercises');
    
    const progress = (completedExercises / 5) * 100;
    progressFill.style.width = `${progress}%`;
    completedSpan.textContent = completedExercises;
    
    // Update badge count
    const badgeCount = document.getElementById('badgeCount');
    badgeCount.textContent = Math.floor(completedExercises / 5) * 10;
}

function saveProgress() {
    const progress = {
        level: 37,
        completedExercises: document.querySelectorAll('.exercise.completed').length,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('level37Progress', JSON.stringify(progress));
    
    // Update main hub progress
    updateMainHubProgress();
}

function loadProgress() {
    const saved = localStorage.getItem('level37Progress');
    if (saved) {
        const progress = JSON.parse(saved);
        
        // Mark completed exercises
        for (let i = 1; i <= progress.completedExercises; i++) {
            markExerciseComplete(i);
        }
    }
}

function updateMainHubProgress() {
    // Update main hub progress if available
    if (typeof updateLevelProgress === 'function') {
        updateLevelProgress(37, document.querySelectorAll('.exercise.completed').length, 5);
    }
}

// Navigation functions
function goToLevel(levelNumber) {
    if (levelNumber < 1 || levelNumber > 200) {
        alert('Invalid level number');
        return;
    }
    
    if (levelNumber === 37) {
        // Already on this level
        return;
    }
    
    // Save current progress before navigating
    saveProgress();
    
    // Navigate to level
    if (levelNumber === 1) {
        window.location.href = '../level-1/index.html';
    } else if (levelNumber <= 36) {
        window.location.href = `../level-${levelNumber}/index.html`;
    } else if (levelNumber === 38) {
        // Next level not implemented yet
        alert('Level 38 is not implemented yet. Stay tuned!');
        return;
    } else {
        window.location.href = `../level-${levelNumber}/index.html`;
    }
}

// AI/ML-specific helper functions
function simulateMLAPICall(endpoint, data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const response = {
                endpoint,
                data,
                result: generateMLResult(endpoint),
                confidence: Math.random() * 0.3 + 0.7,
                timestamp: new Date()
            };
            resolve(response);
        }, Math.random() * 1000 + 500);
    });
}

function generateMLResult(endpoint) {
    const results = {
        'classify': { category: 'positive', score: 0.85 },
        'recognize': { objects: ['person', 'car'], count: 2 },
        'recommend': { items: ['item1', 'item2', 'item3'], scores: [0.9, 0.8, 0.7] },
        'sentiment': { sentiment: 'positive', confidence: 0.88 },
        'translate': { translated: 'Hola mundo', source: 'en', target: 'es' }
    };
    
    return results[endpoint] || { result: 'success' };
}

function simulateTensorFlowTraining(model, epochs) {
    return new Promise((resolve) => {
        const trainingHistory = [];
        
        const trainEpoch = (epoch) => {
            if (epoch >= epochs) {
                resolve(trainingHistory);
                return;
            }
            
            const loss = Math.max(0.1, 1.0 - (epoch / epochs) * 0.8);
            const accuracy = Math.min(1.0, 0.5 + (epoch / epochs) * 0.4);
            
            trainingHistory.push({ epoch, loss, accuracy });
            
            setTimeout(() => trainEpoch(epoch + 1), 100);
        };
        
        trainEpoch(0);
    });
}

function simulateComputerVision(imageData) {
    return {
        objects: generateObjectDetections(),
        faces: generateFaceDetections(),
        text: generateOCRResults(),
        classification: generateImageClassification()
    };
}

function generateObjectDetections() {
    const objects = ['person', 'car', 'dog', 'cat', 'tree', 'building'];
    const count = Math.floor(Math.random() * 3) + 1;
    return objects.slice(0, count).map(obj => ({
        class: obj,
        confidence: Math.random() * 0.3 + 0.7,
        bbox: [Math.random() * 400, Math.random() * 300, 100, 100]
    }));
}

function generateFaceDetections() {
    return [{
        id: 'face_1',
        confidence: 0.92,
        bbox: [120, 80, 150, 180],
        age: Math.floor(Math.random() * 50) + 20,
        gender: Math.random() > 0.5 ? 'male' : 'female',
        emotions: ['happy', 'neutral', 'sad'][Math.floor(Math.random() * 3)]
    }];
}

function generateOCRResults() {
    const texts = ['Hello World!', 'Welcome to AI/ML', 'Computer Vision', 'Machine Learning'];
    return {
        text: texts[Math.floor(Math.random() * texts.length)],
        confidence: Math.random() * 0.3 + 0.7,
        boundingBoxes: [
            { text: 'Hello', bbox: [50, 100, 80, 30] },
            { text: 'World!', bbox: [140, 100, 70, 30] }
        ]
    };
}

function generateImageClassification() {
    const classes = ['landscape', 'portrait', 'abstract', 'nature', 'urban'];
    return classes.map(cls => ({
        class: cls,
        confidence: Math.random() * 0.4 + 0.6
    })).sort((a, b) => b.confidence - a.confidence);
}

function simulateNLPProcessing(text, operation) {
    const results = {
        'preprocess': {
            cleaned: text.toLowerCase().replace(/[^\w\s]/g, ''),
            tokens: text.split(' '),
            lemmatized: text.replace(/ing\b/g, ''),
            stopWordsRemoved: text.split(' ').filter(word => !['the', 'a', 'an'].includes(word))
        },
        'entities': {
            entities: [
                { text: 'John Doe', type: 'PERSON', confidence: 0.95 },
                { text: 'New York', type: 'LOCATION', confidence: 0.92 }
            ]
        },
        'sentiment': {
            sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
            confidence: Math.random() * 0.3 + 0.7,
            emotions: ['joy', 'sadness'][Math.floor(Math.random() * 2)]
        },
        'summarize': {
            summary: text.substring(0, Math.min(100, text.length)) + '...',
            compressionRatio: (100 / text.length) * 100
        },
        'translate': {
            translated: `[translated] ${text}`,
            confidence: Math.random() * 0.2 + 0.8
        }
    };
    
    return results[operation] || { result: 'processed' };
}

function simulateAIFeatures(featureType, data) {
    const features = {
        'chatbot': {
            response: generateChatbotResponse(data.message),
            context: { messageCount: 1, lastInteraction: new Date() }
        },
        'recommendation': {
            items: generateRecommendations(data.userId),
            confidence: Math.random() * 0.3 + 0.7
        },
        'automation': {
            executed: true,
            action: 'Notification sent',
            success: Math.random() > 0.1
        },
        'search': {
            results: generateSearchResults(data.query),
            suggestions: generateSearchSuggestions(data.query)
        }
    };
    
    return features[featureType] || { result: 'feature executed' };
}

function generateChatbotResponse(message) {
    const responses = [
        'Hello! How can I help you today?',
        'That sounds interesting! Tell me more.',
        'I understand. Let me help you with that.',
        'Great question! Here\'s what I can tell you.'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

function generateRecommendations(userId) {
    const items = ['movie', 'book', 'song', 'product', 'article'];
    return items.slice(0, 3).map(item => ({
        item,
        score: Math.random() * 0.4 + 0.6,
        reason: 'Based on your preferences'
    }));
}

function generateSearchResults(query) {
    return [
        { title: `Result for "${query}"`, relevance: 0.95, type: 'document' },
        { title: `Related to "${query}"`, relevance: 0.87, type: 'article' },
        { title: `About "${query}"`, relevance: 0.82, type: 'video' }
    ];
}

function generateSearchSuggestions(query) {
    return [
        `${query} tutorial`,
        `${query} examples`,
        `${query} best practices`
    ];
}

function calculateModelAccuracy(predictions, actuals) {
    if (predictions.length !== actuals.length) return 0;
    
    let correct = 0;
    for (let i = 0; i < predictions.length; i++) {
        if (predictions[i] === actuals[i]) correct++;
    }
    
    return correct / predictions.length;
}

function generateModelMetrics() {
    return {
        accuracy: Math.random() * 0.2 + 0.8,
        precision: Math.random() * 0.2 + 0.8,
        recall: Math.random() * 0.2 + 0.8,
        f1Score: Math.random() * 0.2 + 0.8,
        loss: Math.random() * 0.5 + 0.1
    };
}

function simulateModelInference(model, input) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const output = {
                prediction: Math.random() > 0.5 ? 'positive' : 'negative',
                confidence: Math.random() * 0.3 + 0.7,
                processingTime: Math.random() * 100 + 50, // ms
                timestamp: new Date()
            };
            resolve(output);
        }, Math.random() * 500 + 100);
    });
}

function generateTrainingData(size) {
    const data = [];
    for (let i = 0; i < size; i++) {
        data.push({
            input: [Math.random(), Math.random(), Math.random()],
            output: Math.random() > 0.5 ? 1 : 0
        });
    }
    return data;
}

function simulateDataPreprocessing(rawData) {
    return {
        cleaned: rawData.filter(item => item !== null),
        normalized: rawData.map(item => item / Math.max(...rawData)),
        encoded: rawData.map(item => item.toString()),
        split: {
            train: rawData.slice(0, Math.floor(rawData.length * 0.8)),
            test: rawData.slice(Math.floor(rawData.length * 0.8))
        }
    };
}

function generateAIMetrics() {
    return {
        modelPerformance: generateModelMetrics(),
        dataQuality: Math.random() * 0.3 + 0.7,
        trainingTime: Math.random() * 3600 + 300, // seconds
        inferenceSpeed: Math.random() * 100 + 10, // ms
        memoryUsage: Math.random() * 500 + 100, // MB
        gpuUtilization: Math.random() * 100 // %
    };
}

function simulateAITraining(model, data, epochs) {
    return new Promise((resolve) => {
        const history = [];
        let currentEpoch = 0;
        
        const trainStep = () => {
            if (currentEpoch >= epochs) {
                resolve(history);
                return;
            }
            
            const loss = Math.max(0.01, 1.0 - (currentEpoch / epochs) * 0.95);
            const accuracy = Math.min(0.99, 0.1 + (currentEpoch / epochs) * 0.85);
            
            history.push({
                epoch: currentEpoch,
                loss: loss,
                accuracy: accuracy,
                valLoss: loss * 1.1,
                valAccuracy: accuracy * 0.95
            });
            
            currentEpoch++;
            setTimeout(trainStep, 50);
        };
        
        trainStep();
    });
}

function generateAIPredictions(model, inputs) {
    return inputs.map(input => ({
        input,
        prediction: Math.random() > 0.5 ? 'positive' : 'negative',
        confidence: Math.random() * 0.3 + 0.7,
        probabilities: {
            positive: Math.random(),
            negative: Math.random()
        }
    }));
}

function simulateAIOptimization(model) {
    return {
        originalSize: Math.random() * 100 + 50, // MB
        optimizedSize: Math.random() * 50 + 25, // MB
        compressionRatio: Math.random() * 0.5 + 0.3,
        speedImprovement: Math.random() * 0.4 + 0.2,
        accuracyLoss: Math.random() * 0.05 + 0.01
    };
}

// Export functions for global access
window.runCode = runCode;
window.validateExercise = validateExercise;
window.goToLevel = goToLevel;
window.simulateMLAPICall = simulateMLAPICall;
window.generateMLResult = generateMLResult;
window.simulateTensorFlowTraining = simulateTensorFlowTraining;
window.simulateComputerVision = simulateComputerVision;
window.generateObjectDetections = generateObjectDetections;
window.generateFaceDetections = generateFaceDetections;
window.generateOCRResults = generateOCRResults;
window.generateImageClassification = generateImageClassification;
window.simulateNLPProcessing = simulateNLPProcessing;
window.simulateAIFeatures = simulateAIFeatures;
window.generateChatbotResponse = generateChatbotResponse;
window.generateRecommendations = generateRecommendations;
window.generateSearchResults = generateSearchResults;
window.generateSearchSuggestions = generateSearchSuggestions;
window.calculateModelAccuracy = calculateModelAccuracy;
window.generateModelMetrics = generateModelMetrics;
window.simulateModelInference = simulateModelInference;
window.generateTrainingData = generateTrainingData;
window.simulateDataPreprocessing = simulateDataPreprocessing;
window.generateAIMetrics = generateAIMetrics;
window.simulateAITraining = simulateAITraining;
window.generateAIPredictions = generateAIPredictions;
window.simulateAIOptimization = simulateAIOptimization;
