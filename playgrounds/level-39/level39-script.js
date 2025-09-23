// Level 39: Blockchain & Web3 Script

// Global variables
let currentProgress = 0;
let completedExercises = new Set();
let blockchainSimulation = new Map();

// Initialize the level
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    updateUI();
    initializeBlockchainSimulation();
});

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('level39_progress');
    if (saved) {
        const data = JSON.parse(saved);
        currentProgress = data.progress || 0;
        completedExercises = new Set(data.completed || []);
    }
}

// Save progress to localStorage
function saveProgress() {
    const data = {
        progress: currentProgress,
        completed: Array.from(completedExercises),
        timestamp: Date.now()
    };
    localStorage.setItem('level39_progress', JSON.stringify(data));
    
    // Update main hub progress
    updateMainHubProgress();
}

// Update main hub progress
function updateMainHubProgress() {
    const hubProgress = JSON.parse(localStorage.getItem('hub_progress') || '{}');
    hubProgress.level39 = {
        completed: completedExercises.size === 5,
        progress: currentProgress,
        timestamp: Date.now()
    };
    localStorage.setItem('hub_progress', JSON.stringify(hubProgress));
}

// Update UI based on current progress
function updateUI() {
    updateProgressBar();
    updateBadges();
    updateExerciseCards();
}

// Update progress bar
function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const percentage = (currentProgress / 5) * 100;
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${currentProgress}/5`;
}

// Update badges
function updateBadges() {
    for (let i = 1; i <= 5; i++) {
        const badge = document.getElementById(`badge${i}`);
        if (completedExercises.has(i)) {
            badge.classList.add('unlocked');
        } else {
            badge.classList.remove('unlocked');
        }
    }
}

// Update exercise cards
function updateExerciseCards() {
    for (let i = 1; i <= 5; i++) {
        const card = document.getElementById(`exercise${i}`);
        if (completedExercises.has(i)) {
            card.classList.add('completed');
        } else {
            card.classList.remove('completed');
        }
    }
}

// Initialize blockchain simulation
function initializeBlockchainSimulation() {
    // Create mock blockchain environment
    createMockBlockchainEnvironment();
}

// Create mock blockchain environment
function createMockBlockchainEnvironment() {
    // Mock smart contract for Exercise 1
    blockchainSimulation.set('token', {
        name: 'SimpleToken',
        symbol: 'STK',
        decimals: 18,
        totalSupply: '1000000000000000000000000', // 1M tokens
        balanceOf: new Map([
            ['0x1234...', '1000000000000000000000000'],
            ['0x5678...', '0']
        ]),
        transfer: (from, to, amount) => {
            const fromBalance = blockchainSimulation.get('token').balanceOf.get(from);
            const toBalance = blockchainSimulation.get('token').balanceOf.get(to);
            if (fromBalance >= amount) {
                blockchainSimulation.get('token').balanceOf.set(from, fromBalance - amount);
                blockchainSimulation.get('token').balanceOf.set(to, toBalance + amount);
                return { success: true, txHash: generateTxHash() };
            }
            return { success: false, error: 'Insufficient balance' };
        }
    });
    
    // Mock DeFi protocol for Exercise 2
    blockchainSimulation.set('defi', {
        totalLiquidity: '1000000000000000000000', // 1000 ETH
        interestRate: 5,
        deposits: new Map([
            ['0x1234...', '100000000000000000000'], // 100 ETH
            ['0x5678...', '50000000000000000000']   // 50 ETH
        ]),
        borrows: new Map([
            ['0x1234...', '30000000000000000000'], // 30 ETH
            ['0x5678...', '0']
        ]),
        deposit: (user, amount) => {
            const currentDeposit = blockchainSimulation.get('defi').deposits.get(user) || '0';
            const newDeposit = (parseInt(currentDeposit) + parseInt(amount)).toString();
            blockchainSimulation.get('defi').deposits.set(user, newDeposit);
            blockchainSimulation.get('defi').totalLiquidity = (parseInt(blockchainSimulation.get('defi').totalLiquidity) + parseInt(amount)).toString();
            return { success: true, txHash: generateTxHash() };
        },
        borrow: (user, amount) => {
            const deposit = blockchainSimulation.get('defi').deposits.get(user) || '0';
            const maxBorrow = parseInt(deposit) * 50 / 100;
            if (parseInt(amount) <= maxBorrow && parseInt(amount) <= parseInt(blockchainSimulation.get('defi').totalLiquidity)) {
                const currentBorrow = blockchainSimulation.get('defi').borrows.get(user) || '0';
                blockchainSimulation.get('defi').borrows.set(user, (parseInt(currentBorrow) + parseInt(amount)).toString());
                blockchainSimulation.get('defi').totalLiquidity = (parseInt(blockchainSimulation.get('defi').totalLiquidity) - parseInt(amount)).toString();
                return { success: true, txHash: generateTxHash() };
            }
            return { success: false, error: 'Borrow limit exceeded' };
        }
    });
    
    // Mock NFT marketplace for Exercise 3
    blockchainSimulation.set('nft', {
        nextTokenId: 1,
        nfts: new Map(),
        mintNFT: (owner, metadataURI) => {
            const tokenId = blockchainSimulation.get('nft').nextTokenId++;
            blockchainSimulation.get('nft').nfts.set(tokenId, {
                tokenId: tokenId,
                owner: owner,
                metadataURI: metadataURI,
                price: '0',
                forSale: false
            });
            return { success: true, tokenId: tokenId, txHash: generateTxHash() };
        },
        listForSale: (tokenId, price) => {
            const nft = blockchainSimulation.get('nft').nfts.get(tokenId);
            if (nft) {
                nft.price = price;
                nft.forSale = true;
                return { success: true, txHash: generateTxHash() };
            }
            return { success: false, error: 'NFT not found' };
        },
        buyNFT: (tokenId, buyer, price) => {
            const nft = blockchainSimulation.get('nft').nfts.get(tokenId);
            if (nft && nft.forSale && parseInt(price) >= parseInt(nft.price)) {
                nft.owner = buyer;
                nft.forSale = false;
                return { success: true, txHash: generateTxHash() };
            }
            return { success: false, error: 'Purchase failed' };
        }
    });
    
    // Mock Web3 integration for Exercise 4
    blockchainSimulation.set('web3', {
        connected: false,
        account: null,
        balance: '0',
        connectWallet: () => {
            blockchainSimulation.get('web3').connected = true;
            blockchainSimulation.get('web3').account = '0x1234567890abcdef1234567890abcdef12345678';
            blockchainSimulation.get('web3').balance = '1000000000000000000'; // 1 ETH
            return { success: true, account: blockchainSimulation.get('web3').account };
        },
        sendTransaction: (to, value) => {
            const currentBalance = parseInt(blockchainSimulation.get('web3').balance);
            const txValue = parseInt(value);
            if (currentBalance >= txValue) {
                blockchainSimulation.get('web3').balance = (currentBalance - txValue).toString();
                return { success: true, txHash: generateTxHash() };
            }
            return { success: false, error: 'Insufficient balance' };
        }
    });
    
    // Mock trading bot for Exercise 5
    blockchainSimulation.set('trading', {
        prices: new Map([
            ['ETH', '2000'],
            ['BTC', '45000'],
            ['USDC', '1']
        ]),
        getPrice: (token) => {
            return blockchainSimulation.get('trading').prices.get(token) || '0';
        },
        swapTokens: (tokenIn, tokenOut, amountIn) => {
            const priceIn = parseInt(blockchainSimulation.get('trading').getPrice(tokenIn));
            const priceOut = parseInt(blockchainSimulation.get('trading').getPrice(tokenOut));
            const amountOut = (parseInt(amountIn) * priceIn / priceOut).toString();
            return { success: true, amountOut: amountOut, txHash: generateTxHash() };
        },
        executeArbitrage: (tokenA, tokenB, amount) => {
            const priceA = parseInt(blockchainSimulation.get('trading').getPrice(tokenA));
            const priceB = parseInt(blockchainSimulation.get('trading').getPrice(tokenB));
            if (priceA > priceB * 1.01) {
                return { success: true, profit: (priceA - priceB * 1.01).toString(), txHash: generateTxHash() };
            }
            return { success: false, message: 'No arbitrage opportunity' };
        }
    });
}

// Generate mock transaction hash
function generateTxHash() {
    return '0x' + Math.random().toString(16).substr(2, 64);
}

// Run exercise
function runExercise(exerciseNumber) {
    const codeInput = document.getElementById(`code${exerciseNumber}`);
    const outputPanel = document.getElementById(`output${exerciseNumber}`);
    const code = codeInput.value.trim();
    
    if (!code) {
        showOutput(exerciseNumber, 'Please enter some code to run.');
        return;
    }
    
    try {
        let result;
        
        switch (exerciseNumber) {
            case 1:
                result = runExercise1(code);
                break;
            case 2:
                result = runExercise2(code);
                break;
            case 3:
                result = runExercise3(code);
                break;
            case 4:
                result = runExercise4(code);
                break;
            case 5:
                result = runExercise5(code);
                break;
            default:
                result = 'Unknown exercise number.';
        }
        
        showOutput(exerciseNumber, result);
        
        // Check if exercise is completed
        if (checkExerciseCompletion(exerciseNumber, code, result)) {
            completeExercise(exerciseNumber);
        }
        
    } catch (error) {
        showOutput(exerciseNumber, `Error: ${error.message}`);
    }
}

// Run Exercise 1: Smart Contracts
function runExercise1(code) {
    const token = blockchainSimulation.get('token');
    
    const output = [];
    output.push('📜 Smart Contract Deployment Successful!');
    output.push('');
    output.push('🔧 Contract Details:');
    output.push(`Name: ${token.name}`);
    output.push(`Symbol: ${token.symbol}`);
    output.push(`Decimals: ${token.decimals}`);
    output.push(`Total Supply: ${(parseInt(token.totalSupply) / 1e18).toLocaleString()} ${token.symbol}`);
    output.push('');
    
    // Test transfer function
    const transferResult = token.transfer('0x1234...', '0x5678...', '100000000000000000000'); // 100 tokens
    if (transferResult.success) {
        output.push('✅ Transfer Test:');
        output.push(`From: 0x1234...`);
        output.push(`To: 0x5678...`);
        output.push(`Amount: 100 ${token.symbol}`);
        output.push(`Transaction Hash: ${transferResult.txHash}`);
        output.push('');
        
        // Show updated balances
        output.push('💰 Updated Balances:');
        output.push(`0x1234...: ${(parseInt(token.balanceOf.get('0x1234...')) / 1e18).toLocaleString()} ${token.symbol}`);
        output.push(`0x5678...: ${(parseInt(token.balanceOf.get('0x5678...')) / 1e18).toLocaleString()} ${token.symbol}`);
    } else {
        output.push(`❌ Transfer Failed: ${transferResult.error}`);
    }
    
    output.push('');
    output.push('🚀 Smart contract functionality verified!');
    
    return output.join('\n');
}

// Run Exercise 2: DeFi Integration
function runExercise2(code) {
    const defi = blockchainSimulation.get('defi');
    
    const output = [];
    output.push('💰 DeFi Protocol Analysis');
    output.push('');
    output.push('📊 Protocol Status:');
    output.push(`Total Liquidity: ${(parseInt(defi.totalLiquidity) / 1e18).toLocaleString()} ETH`);
    output.push(`Interest Rate: ${defi.interestRate}% APY`);
    output.push('');
    
    // Test deposit
    const depositResult = defi.deposit('0x9999...', '10000000000000000000'); // 10 ETH
    if (depositResult.success) {
        output.push('✅ Deposit Test:');
        output.push(`User: 0x9999...`);
        output.push(`Amount: 10 ETH`);
        output.push(`Transaction Hash: ${depositResult.txHash}`);
        output.push('');
    }
    
    // Test borrow
    const borrowResult = defi.borrow('0x1234...', '20000000000000000000'); // 20 ETH
    if (borrowResult.success) {
        output.push('✅ Borrow Test:');
        output.push(`User: 0x1234...`);
        output.push(`Amount: 20 ETH`);
        output.push(`Transaction Hash: ${borrowResult.txHash}`);
        output.push('');
    }
    
    // Show current positions
    output.push('📈 Current Positions:');
    output.push(`0x1234... Deposit: ${(parseInt(defi.deposits.get('0x1234...')) / 1e18).toLocaleString()} ETH`);
    output.push(`0x1234... Borrow: ${(parseInt(defi.borrows.get('0x1234...')) / 1e18).toLocaleString()} ETH`);
    output.push(`0x5678... Deposit: ${(parseInt(defi.deposits.get('0x5678...')) / 1e18).toLocaleString()} ETH`);
    output.push('');
    
    // Calculate interest
    const interest = defi.borrows.get('0x1234...') * defi.interestRate / 100;
    output.push(`💸 Interest Due: ${(parseInt(interest) / 1e18).toFixed(4)} ETH`);
    
    output.push('');
    output.push('✅ DeFi integration successful!');
    
    return output.join('\n');
}

// Run Exercise 3: NFT Marketplace
function runExercise3(code) {
    const nft = blockchainSimulation.get('nft');
    
    const output = [];
    output.push('🎨 NFT Marketplace Operations');
    output.push('');
    
    // Test minting
    const mintResult = nft.mintNFT('0x1234...', 'https://metadata.example.com/nft/1');
    if (mintResult.success) {
        output.push('✅ NFT Minted:');
        output.push(`Token ID: ${mintResult.tokenId}`);
        output.push(`Owner: 0x1234...`);
        output.push(`Metadata: https://metadata.example.com/nft/1`);
        output.push(`Transaction Hash: ${mintResult.txHash}`);
        output.push('');
    }
    
    // Test listing for sale
    const listResult = nft.listForSale(mintResult.tokenId, '1000000000000000000'); // 1 ETH
    if (listResult.success) {
        output.push('✅ NFT Listed for Sale:');
        output.push(`Token ID: ${mintResult.tokenId}`);
        output.push(`Price: 1 ETH`);
        output.push(`Transaction Hash: ${listResult.txHash}`);
        output.push('');
    }
    
    // Test buying
    const buyResult = nft.buyNFT(mintResult.tokenId, '0x5678...', '1000000000000000000');
    if (buyResult.success) {
        output.push('✅ NFT Purchased:');
        output.push(`Token ID: ${mintResult.tokenId}`);
        output.push(`New Owner: 0x5678...`);
        output.push(`Price: 1 ETH`);
        output.push(`Transaction Hash: ${buyResult.txHash}`);
        output.push('');
    }
    
    // Show marketplace stats
    output.push('📊 Marketplace Statistics:');
    output.push(`Total NFTs: ${nft.nextTokenId - 1}`);
    output.push(`Active Listings: ${Array.from(nft.nfts.values()).filter(n => n.forSale).length}`);
    output.push(`Total Volume: 1 ETH`);
    
    output.push('');
    output.push('✅ NFT marketplace operations successful!');
    
    return output.join('\n');
}

// Run Exercise 4: Web3 Integration
function runExercise4(code) {
    const web3 = blockchainSimulation.get('web3');
    
    const output = [];
    output.push('🌐 Web3 Integration Test');
    output.push('');
    
    // Test wallet connection
    const connectResult = web3.connectWallet();
    if (connectResult.success) {
        output.push('✅ Wallet Connected:');
        output.push(`Account: ${connectResult.account}`);
        output.push(`Balance: ${(parseInt(web3.balance) / 1e18).toFixed(4)} ETH`);
        output.push('');
    }
    
    // Test transaction
    const txResult = web3.sendTransaction('0x9999...', '100000000000000000'); // 0.1 ETH
    if (txResult.success) {
        output.push('✅ Transaction Sent:');
        output.push(`To: 0x9999...`);
        output.push(`Amount: 0.1 ETH`);
        output.push(`Transaction Hash: ${txResult.txHash}`);
        output.push(`Gas Used: 21,000`);
        output.push(`Gas Price: 20 Gwei`);
        output.push('');
    }
    
    // Show updated balance
    output.push('💰 Updated Balance:');
    output.push(`${(parseInt(web3.balance) / 1e18).toFixed(4)} ETH`);
    
    // Test message signing
    const message = 'Hello Web3!';
    const signature = '0x' + Math.random().toString(16).substr(2, 130);
    output.push('');
    output.push('✍️ Message Signature:');
    output.push(`Message: "${message}"`);
    output.push(`Signature: ${signature}`);
    output.push(`Verified: ✅`);
    
    output.push('');
    output.push('✅ Web3 integration successful!');
    
    return output.join('\n');
}

// Run Exercise 5: Cryptocurrency Trading
function runExercise5(code) {
    const trading = blockchainSimulation.get('trading');
    
    const output = [];
    output.push('📈 Cryptocurrency Trading Analysis');
    output.push('');
    
    // Show current prices
    output.push('💱 Current Prices:');
    output.push(`ETH: $${trading.getPrice('ETH')}`);
    output.push(`BTC: $${trading.getPrice('BTC')}`);
    output.push(`USDC: $${trading.getPrice('USDC')}`);
    output.push('');
    
    // Test token swap
    const swapResult = trading.swapTokens('ETH', 'USDC', '1000000000000000000'); // 1 ETH
    if (swapResult.success) {
        output.push('✅ Token Swap Executed:');
        output.push(`From: 1 ETH`);
        output.push(`To: ${(parseInt(swapResult.amountOut) / 1e6).toLocaleString()} USDC`);
        output.push(`Exchange Rate: 1 ETH = ${(parseInt(swapResult.amountOut) / 1e6).toLocaleString()} USDC`);
        output.push(`Transaction Hash: ${swapResult.txHash}`);
        output.push('');
    }
    
    // Test arbitrage
    const arbitrageResult = trading.executeArbitrage('ETH', 'BTC', '1000000000000000000');
    if (arbitrageResult.success) {
        output.push('✅ Arbitrage Opportunity Found:');
        output.push(`Profit: $${arbitrageResult.profit}`);
        output.push(`Transaction Hash: ${arbitrageResult.txHash}`);
        output.push('');
    } else {
        output.push('ℹ️ Arbitrage Check:');
        output.push(arbitrageResult.message);
        output.push('');
    }
    
    // Trading statistics
    output.push('📊 Trading Statistics:');
    output.push(`Total Swaps: 1`);
    output.push(`Total Volume: 1 ETH`);
    output.push(`Average Gas Used: 150,000`);
    output.push(`Success Rate: 100%`);
    
    output.push('');
    output.push('✅ Cryptocurrency trading operations successful!');
    
    return output.join('\n');
}

// Show output in the output panel
function showOutput(exerciseNumber, output) {
    const outputPanel = document.getElementById(`output${exerciseNumber}`);
    outputPanel.textContent = output;
    
    // Add syntax highlighting for blockchain terms
    if (output.includes('Transaction Hash') || output.includes('ETH') || output.includes('0x')) {
        outputPanel.innerHTML = highlightBlockchainOutput(output);
    }
}

// Highlight blockchain output
function highlightBlockchainOutput(output) {
    return output
        .replace(/Transaction Hash: (0x[a-fA-F0-9]+)/g, 'Transaction Hash: <span class="transaction-hash">$1</span>')
        .replace(/(\d+\.?\d*) ETH/g, '<span class="eth-balance">$1 ETH</span>')
        .replace(/(0x[a-fA-F0-9]+)/g, '<span class="transaction-hash">$1</span>')
        .replace(/\$(\d+)/g, '<span class="eth-balance">$$1</span>');
}

// Check if exercise is completed
function checkExerciseCompletion(exerciseNumber, code, result) {
    const checks = {
        1: () => code.includes('contract') && code.includes('transfer') && result.includes('Transfer Test'),
        2: () => code.includes('DeFi') && code.includes('deposit') && result.includes('Deposit Test'),
        3: () => code.includes('NFT') && code.includes('mint') && result.includes('NFT Minted'),
        4: () => code.includes('Web3') && code.includes('connect') && result.includes('Wallet Connected'),
        5: () => code.includes('trading') && code.includes('swap') && result.includes('Token Swap')
    };
    
    return checks[exerciseNumber] ? checks[exerciseNumber]() : false;
}

// Complete exercise
function completeExercise(exerciseNumber) {
    if (!completedExercises.has(exerciseNumber)) {
        completedExercises.add(exerciseNumber);
        currentProgress = completedExercises.size;
        
        // Update UI
        updateUI();
        
        // Save progress
        saveProgress();
        
        // Show completion message
        showCompletionMessage(exerciseNumber);
        
        // Unlock next exercise
        if (exerciseNumber < 5) {
            setTimeout(() => {
                const nextCard = document.getElementById(`exercise${exerciseNumber + 1}`);
                nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1000);
        }
    }
}

// Show completion message
function showCompletionMessage(exerciseNumber) {
    const messages = {
        1: '📜 Smart Contracts mastered!',
        2: '💰 DeFi Integration complete!',
        3: '🎨 NFT Marketplace built!',
        4: '🌐 Web3 Integration successful!',
        5: '📈 Cryptocurrency Trading implemented!'
    };
    
    const message = messages[exerciseNumber];
    if (message) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #1a1a2e, #16213e);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            font-weight: 600;
            animation: slideIn 0.5s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
}

// Navigation functions
function goToLevel(levelNumber) {
    if (levelNumber === 38) {
        window.location.href = '../level-38/index.html';
    } else if (levelNumber === 40) {
        window.location.href = '../level-40/index.html';
    }
}

function goToHub() {
    window.location.href = '../../index.html';
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Auto-save progress every 30 seconds
setInterval(saveProgress, 30000);

// Handle page unload
window.addEventListener('beforeunload', saveProgress);
