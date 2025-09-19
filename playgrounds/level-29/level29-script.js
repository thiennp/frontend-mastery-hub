// Level 29: Real-time Applications & WebRTC Script

class RealTimeWebRTCLevel {
    constructor() {
        this.exercises = [
            { id: 1, name: 'WebRTC Fundamentals', completed: false },
            { id: 2, name: 'Live Streaming', completed: false },
            { id: 3, name: 'Real-time Collaboration', completed: false },
            { id: 4, name: 'Media Handling', completed: false },
            { id: 5, name: 'Performance Optimization', completed: false }
        ];
        this.webrtcMetrics = {
            webrtcStatus: 'Disconnected',
            iceState: 'new',
            signalingState: 'stable',
            streamStatus: 'Offline',
            streamQuality: '720p',
            viewerCount: 0,
            collaborationUsers: 1,
            collaborationStatus: 'Connected',
            operationCount: 0,
            audioStatus: 'Enabled',
            videoStatus: 'Enabled',
            mediaQuality: 'HD',
            performanceFPS: 60,
            performanceLatency: 50,
            performanceCPU: 45
        };
        this.connections = new Map();
        this.streams = new Map();
        this.collaborationPeers = new Map();
        this.mediaDevices = [];
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.simulateRealTimeEnvironment();
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

    simulateRealTimeEnvironment() {
        // Simulate dynamic WebRTC metrics updates
        setInterval(() => {
            if (Math.random() > 0.4) {
                this.updateRandomWebRTCMetric();
            }
        }, 7000);

        // Simulate real-time data updates
        setInterval(() => {
            this.simulateRealTimeUpdates();
        }, 2000);
    }

    updateRandomWebRTCMetric() {
        const metrics = Object.keys(this.webrtcMetrics);
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
        
        if (randomMetric.includes('Count') || randomMetric.includes('FPS') || randomMetric.includes('CPU')) {
            this.webrtcMetrics[randomMetric] = Math.floor(Math.random() * 100) + 10;
        } else if (randomMetric.includes('Latency')) {
            this.webrtcMetrics[randomMetric] = Math.floor(Math.random() * 200) + 20;
        } else if (randomMetric.includes('Status')) {
            const statuses = ['Connected', 'Connecting', 'Disconnected', 'Error'];
            this.webrtcMetrics[randomMetric] = statuses[Math.floor(Math.random() * statuses.length)];
        } else if (randomMetric.includes('State')) {
            const states = ['new', 'checking', 'connected', 'completed', 'failed', 'disconnected', 'closed'];
            this.webrtcMetrics[randomMetric] = states[Math.floor(Math.random() * states.length)];
        } else if (randomMetric.includes('Quality')) {
            const qualities = ['480p', '720p', '1080p', '4K'];
            this.webrtcMetrics[randomMetric] = qualities[Math.floor(Math.random() * qualities.length)];
        }
        
        this.updateMetricsDisplay();
    }

    simulateRealTimeUpdates() {
        // Simulate real-time message updates
        if (this.webrtcMetrics.viewerCount > 0) {
            this.webrtcMetrics.viewerCount += Math.floor(Math.random() * 3);
        }
        if (this.webrtcMetrics.operationCount > 0) {
            this.webrtcMetrics.operationCount += Math.floor(Math.random() * 2);
        }
        
        this.updateMetricsDisplay();
    }

    runExercise(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        const card = document.querySelector(`[data-exercise="${exerciseId}"]`);
        const outputContent = document.getElementById(`outputContent${exerciseId}`);
        const statusElement = card.querySelector('.exercise-status');
        
        statusElement.innerHTML = '<i class="fas fa-circle status-in-progress"></i><span>Connecting...</span>';
        
        setTimeout(() => {
            this.executeWebRTCExercise(exerciseId, outputContent);
            this.markExerciseComplete(exerciseId);
            this.updateProgressDisplay();
        }, 6000);
    }

    executeWebRTCExercise(exerciseId, outputContent) {
        switch (exerciseId) {
            case 1:
                this.executeWebRTCFundamentals(outputContent);
                break;
            case 2:
                this.executeLiveStreaming(outputContent);
                break;
            case 3:
                this.executeRealTimeCollaboration(outputContent);
                break;
            case 4:
                this.executeMediaHandling(outputContent);
                break;
            case 5:
                this.executePerformanceOptimization(outputContent);
                break;
        }
    }

    executeWebRTCFundamentals(outputContent) {
        this.webrtcMetrics.webrtcStatus = 'Connected';
        this.webrtcMetrics.iceState = 'connected';
        this.webrtcMetrics.signalingState = 'stable';

        // Simulate WebRTC connection
        this.simulateWebRTCConnection();

        outputContent.innerHTML = `
<div class="webrtc-fundamentals-demo">
    <h4>🔗 WebRTC Connection Established</h4>
    
    <div class="webrtc-demo">
        <div class="peer-connection">Local</div>
        <div class="peer-connection">Remote</div>
        <div class="peer-connection">Data</div>
    </div>
    
    <div class="webrtc-results">
        <h5>📊 Connection Status:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>Status:</strong> ${this.webrtcMetrics.webrtcStatus}<br>
            <strong>ICE State:</strong> ${this.webrtcMetrics.iceState}<br>
            <strong>Signaling State:</strong> ${this.webrtcMetrics.signalingState}<br>
            <strong>Connection Type:</strong> Peer-to-Peer<br>
            <strong>Data Channel:</strong> Open<br>
            <strong>Media Streams:</strong> 2 (Audio + Video)
        </div>
    </div>
    
    <div class="webrtc-features">
        <h5>🎯 WebRTC Features Implemented:</h5>
        <div style="margin: 15px 0;">
            <span class="webrtc-result webrtc-connected">Peer Connection ✓</span>
            <span class="webrtc-result webrtc-connected">Media Streams ✓</span>
            <span class="webrtc-result webrtc-connected">Data Channels ✓</span>
            <span class="webrtc-result webrtc-connected">ICE Candidates ✓</span>
        </div>
    </div>
    
    <div class="webrtc-signaling">
        <h5>📡 Signaling Process:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Offer Created → ICE Gathering → Answer Received → Connection Established<br>
            STUN Server: stun.l.google.com:19302<br>
            TURN Server: turn.example.com (if needed)<br>
            <br>
            <span class="webrtc-result realtime-sync">Signaling Complete ✓</span>
        </div>
    </div>
    
    <div class="webrtc-examples">
        <h5>💡 WebRTC Examples:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color); font-family: monospace; font-size: 0.9rem;">
            const peerConnection = new RTCPeerConnection(config);<br>
            peerConnection.ontrack = (event) => {<br>
            &nbsp;&nbsp;remoteVideo.srcObject = event.streams[0];<br>
            };<br>
            peerConnection.addTrack(localStream.getTracks()[0], localStream);
        </div>
    </div>
    
    <div class="webrtc-monitoring">
        <h5>📈 Connection Monitoring:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Total Connections: 1,247<br>
            Average Latency: 45ms<br>
            Success Rate: 98.5%<br>
            Data Transferred: 2.3GB<br>
            Most Common Issue: NAT Traversal (15% of failures)
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    simulateWebRTCConnection() {
        // Simulate WebRTC connection process
        const connectionSteps = ['Creating Offer', 'ICE Gathering', 'Sending Offer', 'Receiving Answer', 'Connection Established'];
        connectionSteps.forEach((step, index) => {
            setTimeout(() => {
                console.log(`WebRTC step: ${step}`);
            }, index * 1200);
        });
    }

    executeLiveStreaming(outputContent) {
        this.webrtcMetrics.streamStatus = 'Live';
        this.webrtcMetrics.streamQuality = '1080p';
        this.webrtcMetrics.viewerCount = 42;

        // Simulate streaming
        this.simulateLiveStreaming();

        outputContent.innerHTML = `
<div class="live-streaming-demo">
    <h4>📺 Live Streaming Active</h4>
    
    <div class="streaming-demo">
        <div class="stream-item stream-quality">1080p</div>
        <div class="stream-item stream-bitrate">2.5 Mbps</div>
        <div class="stream-item stream-latency">15ms</div>
        <div class="stream-item stream-quality">H.264</div>
    </div>
    
    <div class="streaming-results">
        <h5>📊 Streaming Status:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>Status:</strong> ${this.webrtcMetrics.streamStatus}<br>
            <strong>Quality:</strong> ${this.webrtcMetrics.streamQuality}<br>
            <strong>Viewers:</strong> ${this.webrtcMetrics.viewerCount}<br>
            <strong>Bitrate:</strong> 2.5 Mbps<br>
            <strong>Latency:</strong> 15ms<br>
            <strong>Codec:</strong> H.264/VP9
        </div>
    </div>
    
    <div class="streaming-features">
        <h5>🎯 Streaming Features Implemented:</h5>
        <div style="margin: 15px 0;">
            <span class="webrtc-result streaming-active">MediaRecorder API ✓</span>
            <span class="webrtc-result streaming-active">Adaptive Bitrate ✓</span>
            <span class="webrtc-result streaming-active">Real-time Broadcasting ✓</span>
            <span class="webrtc-result streaming-active">Quality Optimization ✓</span>
        </div>
    </div>
    
    <div class="streaming-examples">
        <h5>💡 Streaming Examples:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color); font-family: monospace; font-size: 0.9rem;">
            const mediaRecorder = new MediaRecorder(stream, {<br>
            &nbsp;&nbsp;mimeType: 'video/webm;codecs=vp9',<br>
            &nbsp;&nbsp;videoBitsPerSecond: 2500000<br>
            });<br>
            mediaRecorder.start(1000); // 1-second chunks
        </div>
    </div>
    
    <div class="streaming-performance">
        <h5>⚡ Streaming Performance:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Encoding Speed: 30fps<br>
            Buffer Health: 95%<br>
            Dropped Frames: 0.2%<br>
            Network Utilization: 78%<br>
            <br>
            <span class="webrtc-result realtime-sync">Stream Quality: Excellent ✓</span>
        </div>
    </div>
    
    <div class="streaming-monitoring">
        <h5>📈 Streaming Monitoring:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Total Streams: 3,247<br>
            Average Viewers: 156<br>
            Peak Concurrent: 2,847<br>
            Stream Duration: 45 minutes average<br>
            Most Popular: Gaming streams (40% of traffic)
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    simulateLiveStreaming() {
        // Simulate streaming process
        const streamingSteps = ['Initializing Encoder', 'Starting Stream', 'Adapting Quality', 'Broadcasting Live'];
        streamingSteps.forEach((step, index) => {
            setTimeout(() => {
                console.log(`Streaming step: ${step}`);
            }, index * 1500);
        });
    }

    executeRealTimeCollaboration(outputContent) {
        this.webrtcMetrics.collaborationUsers = 5;
        this.webrtcMetrics.collaborationStatus = 'Connected';
        this.webrtcMetrics.operationCount = 127;

        // Simulate collaboration
        this.simulateCollaboration();

        outputContent.innerHTML = `
<div class="realtime-collaboration-demo">
    <h4>🤝 Real-time Collaboration Active</h4>
    
    <div class="collaboration-demo">
        <div class="user-cursor" style="background: #ff6b6b; left: 100px; top: 50px;"></div>
        <div class="user-cursor" style="background: #4ecdc4; left: 200px; top: 80px;"></div>
        <div class="user-cursor" style="background: #45b7d1; left: 150px; top: 120px;"></div>
        <div class="user-cursor" style="background: #96ceb4; left: 250px; top: 90px;"></div>
    </div>
    
    <div class="collaboration-results">
        <h5>📊 Collaboration Status:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>Active Users:</strong> ${this.webrtcMetrics.collaborationUsers}<br>
            <strong>Status:</strong> ${this.webrtcMetrics.collaborationStatus}<br>
            <strong>Operations:</strong> ${this.webrtcMetrics.operationCount}<br>
            <strong>Sync Latency:</strong> 12ms<br>
            <strong>Conflict Resolution:</strong> Last-write-wins<br>
            <strong>Data Channels:</strong> 3 active
        </div>
    </div>
    
    <div class="collaboration-features">
        <h5>🎯 Collaboration Features Implemented:</h5>
        <div style="margin: 15px 0;">
            <span class="webrtc-result collaboration-sync">Shared Cursors ✓</span>
            <span class="webrtc-result collaboration-sync">Real-time Editing ✓</span>
            <span class="webrtc-result collaboration-sync">Operational Transform ✓</span>
            <span class="webrtc-result collaboration-sync">Conflict Resolution ✓</span>
        </div>
    </div>
    
    <div class="collaboration-examples">
        <h5>💡 Collaboration Examples:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color); font-family: monospace; font-size: 0.9rem;">
            dataChannel.onmessage = (event) => {<br>
            &nbsp;&nbsp;const operation = JSON.parse(event.data);<br>
            &nbsp;&nbsp;applyOperation(operation);<br>
            &nbsp;&nbsp;updateUI();<br>
            };
        </div>
    </div>
    
    <div class="collaboration-performance">
        <h5>⚡ Collaboration Performance:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Message Latency: 12ms average<br>
            Sync Accuracy: 99.8%<br>
            Conflict Rate: 0.5%<br>
            Memory Usage: 45MB per user<br>
            <br>
            <span class="webrtc-result realtime-sync">Collaboration Quality: Excellent ✓</span>
        </div>
    </div>
    
    <div class="collaboration-monitoring">
        <h5>📈 Collaboration Monitoring:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Active Sessions: 1,247<br>
            Average Users per Session: 3.2<br>
            Operations per Minute: 2,847<br>
            Conflict Resolution Success: 98.5%<br>
            Most Active Feature: Real-time editing (60% of operations)
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    simulateCollaboration() {
        // Simulate collaboration updates
        const collaborationSteps = ['User Joined', 'Cursor Moved', 'Text Changed', 'Selection Updated'];
        collaborationSteps.forEach((step, index) => {
            setTimeout(() => {
                console.log(`Collaboration step: ${step}`);
            }, index * 1800);
        });
    }

    executeMediaHandling(outputContent) {
        this.webrtcMetrics.audioStatus = 'Enabled';
        this.webrtcMetrics.videoStatus = 'Enabled';
        this.webrtcMetrics.mediaQuality = 'HD';

        // Simulate media handling
        this.simulateMediaHandling();

        outputContent.innerHTML = `
<div class="media-handling-demo">
    <h4>🎤 Media Handling Active</h4>
    
    <div class="media-controls">
        <div class="media-button mute-button">🔇</div>
        <div class="media-button video-button">📹</div>
        <div class="media-button record-button">⏺️</div>
        <div class="media-button" style="background: var(--success-color);">📸</div>
    </div>
    
    <div class="media-results">
        <h5>📊 Media Status:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>Audio:</strong> ${this.webrtcMetrics.audioStatus}<br>
            <strong>Video:</strong> ${this.webrtcMetrics.videoStatus}<br>
            <strong>Quality:</strong> ${this.webrtcMetrics.mediaQuality}<br>
            <strong>Resolution:</strong> 1920x1080<br>
            <strong>Frame Rate:</strong> 30fps<br>
            <strong>Audio Sample Rate:</strong> 48kHz
        </div>
    </div>
    
    <div class="media-features">
        <h5>🎯 Media Features Implemented:</h5>
        <div style="margin: 15px 0;">
            <span class="webrtc-result media-processing">Device Management ✓</span>
            <span class="webrtc-result media-processing">Audio Processing ✓</span>
            <span class="webrtc-result media-processing">Video Effects ✓</span>
            <span class="webrtc-result media-processing">Screen Sharing ✓</span>
        </div>
    </div>
    
    <div class="media-examples">
        <h5>💡 Media Examples:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color); font-family: monospace; font-size: 0.9rem;">
            const stream = await navigator.mediaDevices.getUserMedia({<br>
            &nbsp;&nbsp;video: { width: 1280, height: 720 },<br>
            &nbsp;&nbsp;audio: { echoCancellation: true }<br>
            });<br>
            const mediaRecorder = new MediaRecorder(stream);
        </div>
    </div>
    
    <div class="media-performance">
        <h5>⚡ Media Performance:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Audio Latency: 8ms<br>
            Video Latency: 16ms<br>
            CPU Usage: 25%<br>
            Memory Usage: 120MB<br>
            <br>
            <span class="webrtc-result realtime-sync">Media Quality: Excellent ✓</span>
        </div>
    </div>
    
    <div class="media-monitoring">
        <h5>📈 Media Monitoring:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Total Media Sessions: 5,247<br>
            Average Duration: 25 minutes<br>
            Screen Share Usage: 35%<br>
            Audio Quality Issues: 0.8%<br>
            Video Quality Issues: 1.2%
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    simulateMediaHandling() {
        // Simulate media processing
        const mediaSteps = ['Initializing Devices', 'Starting Stream', 'Applying Effects', 'Processing Media'];
        mediaSteps.forEach((step, index) => {
            setTimeout(() => {
                console.log(`Media step: ${step}`);
            }, index * 2000);
        });
    }

    executePerformanceOptimization(outputContent) {
        this.webrtcMetrics.performanceFPS = 60;
        this.webrtcMetrics.performanceLatency = 25;
        this.webrtcMetrics.performanceCPU = 35;

        // Simulate performance optimization
        this.simulatePerformanceOptimization();

        outputContent.innerHTML = `
<div class="performance-optimization-demo">
    <h4>⚡ Performance Optimization Active</h4>
    
    <div class="performance-demo">
        <div class="metric-bar" style="width: 85%;">FPS</div>
        <div class="metric-bar" style="width: 92%;">Quality</div>
        <div class="metric-bar" style="width: 78%;">Bandwidth</div>
        <div class="metric-bar" style="width: 88%;">CPU</div>
    </div>
    
    <div class="performance-results">
        <h5>📊 Performance Metrics:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>FPS:</strong> ${this.webrtcMetrics.performanceFPS}<br>
            <strong>Latency:</strong> ${this.webrtcMetrics.performanceLatency}ms<br>
            <strong>CPU Usage:</strong> ${this.webrtcMetrics.performanceCPU}%<br>
            <strong>Memory Usage:</strong> 145MB<br>
            <strong>Bandwidth:</strong> 2.1 Mbps<br>
            <strong>Packet Loss:</strong> 0.1%
        </div>
    </div>
    
    <div class="performance-features">
        <h5>🎯 Optimization Features Implemented:</h5>
        <div style="margin: 15px 0;">
            <span class="webrtc-result performance-optimized">Adaptive Bitrate ✓</span>
            <span class="webrtc-result performance-optimized">Frame Skipping ✓</span>
            <span class="webrtc-result performance-optimized">Buffer Management ✓</span>
            <span class="webrtc-result performance-optimized">Resource Monitoring ✓</span>
        </div>
    </div>
    
    <div class="performance-examples">
        <h5>💡 Optimization Examples:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color); font-family: monospace; font-size: 0.9rem;">
            if (bandwidth < 1000) {<br>
            &nbsp;&nbsp;reduceVideoQuality();<br>
            &nbsp;&nbsp;enableAudioCompression();<br>
            } else if (bandwidth > 5000) {<br>
            &nbsp;&nbsp;increaseVideoQuality();<br>
            }
        </div>
    </div>
    
    <div class="performance-recommendations">
        <h5>💡 Performance Recommendations:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            • Use hardware acceleration when available<br>
            • Implement adaptive quality based on network conditions<br>
            • Optimize video codec settings for your use case<br>
            • Monitor and adjust frame rate based on device performance<br>
            • Implement proper error handling and recovery mechanisms<br>
            <br>
            <span class="webrtc-result realtime-sync">Performance Score: 95/100 ✓</span>
        </div>
    </div>
    
    <div class="performance-monitoring">
        <h5>📈 Performance Monitoring:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Average FPS: 58.2<br>
            Average Latency: 28ms<br>
            CPU Usage Trend: Stable<br>
            Memory Leaks: 0 detected<br>
            Performance Issues: 0.3% of sessions
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    simulatePerformanceOptimization() {
        // Simulate performance optimization
        const optimizationSteps = ['Analyzing Metrics', 'Applying Optimizations', 'Monitoring Performance', 'Adjusting Settings'];
        optimizationSteps.forEach((step, index) => {
            setTimeout(() => {
                console.log(`Performance step: ${step}`);
            }, index * 2500);
        });
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
        // Update WebRTC metrics
        document.getElementById('webrtcStatus').textContent = this.webrtcMetrics.webrtcStatus;
        document.getElementById('iceState').textContent = this.webrtcMetrics.iceState;
        document.getElementById('signalingState').textContent = this.webrtcMetrics.signalingState;

        // Update Streaming metrics
        document.getElementById('streamStatus').textContent = this.webrtcMetrics.streamStatus;
        document.getElementById('streamQuality').textContent = this.webrtcMetrics.streamQuality;
        document.getElementById('viewerCount').textContent = this.webrtcMetrics.viewerCount;

        // Update Collaboration metrics
        document.getElementById('collaborationUsers').textContent = this.webrtcMetrics.collaborationUsers;
        document.getElementById('collaborationStatus').textContent = this.webrtcMetrics.collaborationStatus;
        document.getElementById('operationCount').textContent = this.webrtcMetrics.operationCount;

        // Update Media metrics
        document.getElementById('audioStatus').textContent = this.webrtcMetrics.audioStatus;
        document.getElementById('videoStatus').textContent = this.webrtcMetrics.videoStatus;
        document.getElementById('mediaQuality').textContent = this.webrtcMetrics.mediaQuality;

        // Update Performance metrics
        document.getElementById('performanceFPS').textContent = this.webrtcMetrics.performanceFPS;
        document.getElementById('performanceLatency').textContent = `${this.webrtcMetrics.performanceLatency}ms`;
        document.getElementById('performanceCPU').textContent = `${this.webrtcMetrics.performanceCPU}%`;
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
            if (!completedLevels.includes(29)) {
                completedLevels.push(29);
                localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
            }

            const totalProgress = JSON.parse(localStorage.getItem('totalProgress') || '0');
            localStorage.setItem('totalProgress', Math.max(totalProgress, 29).toString());

            setTimeout(() => {
                alert('🎉 Congratulations! You\'ve completed Level 29: Real-time Applications & WebRTC!\n\nYou\'ve mastered:\n• WebRTC peer-to-peer connections and media streams\n• Live video streaming with MediaRecorder API\n• Real-time collaboration with shared cursors and editing\n• Advanced media handling with audio/video processing\n• Performance optimization for real-time applications');
                
                window.location.href = '../../index.html';
            }, 2000);
        }
    }

    showCompletionAnimation() {
        const container = document.querySelector('.level-container');
        container.style.position = 'relative';
        container.style.overflow = 'hidden';

        for (let i = 0; i < 60; i++) {
            const webrtcIcon = document.createElement('div');
            webrtcIcon.style.position = 'absolute';
            webrtcIcon.style.fontSize = '20px';
            webrtcIcon.innerHTML = ['📹', '🔗', '⚡', '🤝', '🎤', '📊', '💡'][Math.floor(Math.random() * 7)];
            webrtcIcon.style.left = Math.random() * 100 + '%';
            webrtcIcon.style.top = '-30px';
            webrtcIcon.style.animation = `webrtcFall ${Math.random() * 2 + 2}s linear forwards`;
            webrtcIcon.style.opacity = '0.8';
            webrtcIcon.classList.add('webrtc-processing');
            container.appendChild(webrtcIcon);

            setTimeout(() => webrtcIcon.remove(), 4000);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes webrtcFall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    resetLevel() {
        if (confirm('Are you sure you want to reset this level? All WebRTC progress will be lost.')) {
            this.exercises.forEach(ex => ex.completed = false);
            
            document.querySelectorAll('.exercise-card').forEach(card => {
                card.classList.remove('completed');
                const statusElement = card.querySelector('.exercise-status');
                statusElement.innerHTML = '<i class="fas fa-circle status-pending"></i><span>Pending</span>';
            });

            document.querySelectorAll('.output-content').forEach(output => {
                output.innerHTML = '';
            });

            this.webrtcMetrics = {
                webrtcStatus: 'Disconnected', iceState: 'new', signalingState: 'stable',
                streamStatus: 'Offline', streamQuality: '720p', viewerCount: 0,
                collaborationUsers: 1, collaborationStatus: 'Connected', operationCount: 0,
                audioStatus: 'Enabled', videoStatus: 'Enabled', mediaQuality: 'HD',
                performanceFPS: 60, performanceLatency: 50, performanceCPU: 45
            };

            this.connections.clear();
            this.streams.clear();
            this.collaborationPeers.clear();
            this.mediaDevices = [];

            this.updateProgressDisplay();
            this.updateMetricsDisplay();
            this.saveProgress();
        }
    }

    saveProgress() {
        localStorage.setItem('level29Progress', JSON.stringify({
            exercises: this.exercises,
            webrtcMetrics: this.webrtcMetrics,
            connections: Array.from(this.connections.entries()),
            streams: Array.from(this.streams.entries()),
            collaborationPeers: Array.from(this.collaborationPeers.entries()),
            mediaDevices: this.mediaDevices
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem('level29Progress');
        if (saved) {
            const data = JSON.parse(saved);
            this.exercises = data.exercises || this.exercises;
            this.webrtcMetrics = data.webrtcMetrics || this.webrtcMetrics;
            this.connections = new Map(data.connections || []);
            this.streams = new Map(data.streams || []);
            this.collaborationPeers = new Map(data.collaborationPeers || []);
            this.mediaDevices = data.mediaDevices || this.mediaDevices;
            
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
    if (window.webrtcLevel) {
        window.webrtcLevel.runExercise(exerciseId);
    }
}

function completeLevel() {
    if (window.webrtcLevel) {
        window.webrtcLevel.completeLevel();
    }
}

function resetLevel() {
    if (window.webrtcLevel) {
        window.webrtcLevel.resetLevel();
    }
}

// Initialize the level when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.webrtcLevel = new RealTimeWebRTCLevel();
});
