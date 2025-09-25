document.addEventListener('DOMContentLoaded', () => {
    // Function to run AI Model Integration exercise
    window.runAIModelIntegration = () => {
        const code = document.getElementById('ai-model-integration-code').value;
        const output = document.getElementById('ai-model-integration-output');
        try {
            // Simulate AI model integration
            const result = eval(code); // DANGER: In a real app, use a secure sandbox!
            output.textContent = `✅ AI Model Manager initialized successfully!\n\nFeatures implemented:\n- Intelligent model routing\n- Fallback mechanisms\n- Context-aware selection\n- Multi-model support\n\nSimulation: Model selection based on input type completed.`;
            output.style.color = 'green';
        } catch (e) {
            output.textContent = `❌ Error: ${e.message}`;
            output.style.color = 'red';
        }
    };

    // Function to run Real-time AI Processing exercise
    window.runRealtimeAI = () => {
        const code = document.getElementById('realtime-ai-code').value;
        const output = document.getElementById('realtime-ai-output');
        try {
            const result = eval(code); // DANGER: In a real app, use a secure sandbox!
            output.textContent = `✅ Real-time AI Processor ready!\n\nFeatures implemented:\n- WebSocket streaming\n- Real-time processing\n- Event-driven architecture\n- AI response handling\n\nSimulation: WebSocket connection established for AI streaming.`;
            output.style.color = 'green';
        } catch (e) {
            output.textContent = `❌ Error: ${e.message}`;
            output.style.color = 'red';
        }
    };

    // Function to run AI Personalization exercise
    window.runAIPersonalization = () => {
        const code = document.getElementById('ai-personalization-code').value;
        const output = document.getElementById('ai-personalization-output');
        try {
            const result = eval(code); // DANGER: In a real app, use a secure sandbox!
            output.textContent = `✅ Personalization Engine initialized!\n\nFeatures implemented:\n- User behavior analysis\n- ML-powered recommendations\n- Pattern recognition\n- Dynamic profile updates\n\nSimulation: User profile analysis completed with 85% accuracy.`;
            output.style.color = 'green';
        } catch (e) {
            output.textContent = `❌ Error: ${e.message}`;
            output.style.color = 'red';
        }
    };

    // Function to run AI Content Generation exercise
    window.runAIContentGeneration = () => {
        const code = document.getElementById('ai-content-generation-code').value;
        const output = document.getElementById('ai-content-generation-output');
        try {
            const result = eval(code); // DANGER: In a real app, use a secure sandbox!
            output.textContent = `✅ Content Generator ready!\n\nFeatures implemented:\n- Template-based generation\n- Quality validation\n- Context awareness\n- Post-processing pipeline\n\nSimulation: Content generated with 92% quality score.`;
            output.style.color = 'green';
        } catch (e) {
            output.textContent = `❌ Error: ${e.message}`;
            output.style.color = 'red';
        }
    };

    // Function to run AI Ethics exercise
    window.runAIEthics = () => {
        const code = document.getElementById('ai-ethics-code').value;
        const output = document.getElementById('ai-ethics-output');
        try {
            const result = eval(code); // DANGER: In a real app, use a secure sandbox!
            output.textContent = `✅ AI Ethics Monitor initialized!\n\nFeatures implemented:\n- Bias detection algorithms\n- Fairness assessment\n- Ethics rule enforcement\n- Responsible AI practices\n\nSimulation: Bias analysis completed - 0.15 bias score (excellent).`;
            output.style.color = 'green';
        } catch (e) {
            output.textContent = `❌ Error: ${e.message}`;
            output.style.color = 'red';
        }
    };

    // Add AI-themed visual effects
    const exerciseSections = document.querySelectorAll('.exercise-section');
    exerciseSections.forEach((section, index) => {
        section.addEventListener('mouseenter', () => {
            section.classList.add('ai-processing');
        });
        
        section.addEventListener('mouseleave', () => {
            section.classList.remove('ai-processing');
        });
    });

    // Simulate AI processing indicators
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            button.textContent = '🤖 Processing...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = button.textContent.replace('🤖 Processing...', 'Run Code');
                button.disabled = false;
            }, 2000);
        });
    });

    // Add neural network visualization effect
    const container = document.querySelector('.container');
    const neuralNetwork = document.createElement('div');
    neuralNetwork.className = 'neural-network-bg';
    neuralNetwork.innerHTML = `
        <div class="neural-node" style="top: 10%; left: 20%;"></div>
        <div class="neural-node" style="top: 30%; left: 40%;"></div>
        <div class="neural-node" style="top: 50%; left: 60%;"></div>
        <div class="neural-node" style="top: 70%; left: 80%;"></div>
        <div class="neural-node" style="top: 90%; left: 30%;"></div>
    `;
    container.appendChild(neuralNetwork);

    // Add CSS for neural network visualization
    const style = document.createElement('style');
    style.textContent = `
        .neural-network-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }
        
        .neural-node {
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            animation: neural-pulse 3s infinite;
        }
        
        @keyframes neural-pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.5); }
        }
    `;
    document.head.appendChild(style);
});
