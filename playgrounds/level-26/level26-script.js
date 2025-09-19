// Level 26: Blockchain & Web3 Script

class BlockchainWeb3Level {
    constructor() {
        this.exercises = [
            { id: 1, name: 'Smart Contracts', completed: false },
            { id: 2, name: 'DeFi Integration', completed: false },
            { id: 3, name: 'NFT Marketplace', completed: false },
            { id: 4, name: 'Web3 Integration', completed: false },
            { id: 5, name: 'Cryptocurrency Trading', completed: false }
        ];
        this.blockchainMetrics = {
            gasUsed: 0,
            contractStatus: 'Not Deployed',
            contractAddress: 'N/A',
            totalValueLocked: 0,
            averageAPY: 0,
            activePools: 0,
            totalNFTs: 0,
            marketplaceVolume: 0,
            floorPrice: 0,
            walletStatus: 'Disconnected',
            networkName: 'Unknown',
            walletBalance: 0,
            portfolioValue: 0,
            totalPnL: 0,
            totalTrades: 0
        };
        this.blockchain = [];
        this.transactionPool = [];
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.simulateBlockchain();
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

    simulateBlockchain() {
        // Initialize blockchain with genesis block
        this.blockchain.push({
            index: 0,
            timestamp: Date.now(),
            data: 'Genesis Block',
            previousHash: '0',
            hash: this.calculateHash(0, Date.now(), 'Genesis Block', '0'),
            nonce: 0
        });

        // Simulate dynamic blockchain metrics updates
        setInterval(() => {
            if (Math.random() > 0.4) {
                this.updateRandomBlockchainMetric();
            }
        }, 8000);

        // Mine new blocks periodically
        setInterval(() => {
            this.mineNewBlock();
        }, 15000);
    }

    calculateHash(index, timestamp, data, previousHash, nonce = 0) {
        // Simplified hash calculation (in reality, use SHA-256)
        const input = index + timestamp + JSON.stringify(data) + previousHash + nonce;
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }

    mineNewBlock() {
        if (this.transactionPool.length > 0) {
            const newBlock = {
                index: this.blockchain.length,
                timestamp: Date.now(),
                data: this.transactionPool.splice(0, 3), // Include up to 3 transactions
                previousHash: this.blockchain[this.blockchain.length - 1].hash,
                nonce: 0
            };

            // Proof of work simulation
            let difficulty = '00'; // Simplified difficulty
            while (!newBlock.hash || !newBlock.hash.startsWith(difficulty)) {
                newBlock.nonce++;
                newBlock.hash = this.calculateHash(
                    newBlock.index,
                    newBlock.timestamp,
                    newBlock.data,
                    newBlock.previousHash,
                    newBlock.nonce
                );
            }

            this.blockchain.push(newBlock);
            this.updateBlockchainVisualizations();
        }
    }

    addTransaction(from, to, amount, type = 'transfer') {
        const transaction = {
            id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            from,
            to,
            amount,
            type,
            timestamp: Date.now(),
            status: 'pending'
        };
        
        this.transactionPool.push(transaction);
        return transaction.id;
    }

    updateRandomBlockchainMetric() {
        const metrics = Object.keys(this.blockchainMetrics);
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
        
        if (randomMetric.includes('Gas') || randomMetric.includes('Trades')) {
            this.blockchainMetrics[randomMetric] = Math.floor(Math.random() * 500000) + 50000;
        } else if (randomMetric.includes('Value') || randomMetric.includes('Volume') || randomMetric.includes('Portfolio')) {
            this.blockchainMetrics[randomMetric] = (Math.random() * 1000000 + 100000).toFixed(2);
        } else if (randomMetric.includes('APY') || randomMetric.includes('Price')) {
            this.blockchainMetrics[randomMetric] = (Math.random() * 50 + 5).toFixed(2);
        } else if (randomMetric.includes('Balance')) {
            this.blockchainMetrics[randomMetric] = (Math.random() * 100 + 1).toFixed(4);
        } else if (randomMetric.includes('Status')) {
            const statuses = ['Connected', 'Connecting', 'Deployed', 'Processing'];
            this.blockchainMetrics[randomMetric] = statuses[Math.floor(Math.random() * statuses.length)];
        } else if (randomMetric.includes('Network')) {
            const networks = ['Ethereum', 'Polygon', 'BSC', 'Avalanche'];
            this.blockchainMetrics[randomMetric] = networks[Math.floor(Math.random() * networks.length)];
        }
        
        this.updateMetricsDisplay();
    }

    runExercise(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        const card = document.querySelector(`[data-exercise="${exerciseId}"]`);
        const outputContent = document.getElementById(`outputContent${exerciseId}`);
        const statusElement = card.querySelector('.exercise-status');
        
        statusElement.innerHTML = '<i class="fas fa-circle status-in-progress"></i><span>Mining Block...</span>';
        
        setTimeout(() => {
            this.executeBlockchainExercise(exerciseId, outputContent);
            this.markExerciseComplete(exerciseId);
            this.updateProgressDisplay();
        }, 5000);
    }

    executeBlockchainExercise(exerciseId, outputContent) {
        switch (exerciseId) {
            case 1:
                this.executeSmartContracts(outputContent);
                break;
            case 2:
                this.executeDeFiIntegration(outputContent);
                break;
            case 3:
                this.executeNFTMarketplace(outputContent);
                break;
            case 4:
                this.executeWeb3Integration(outputContent);
                break;
            case 5:
                this.executeCryptocurrencyTrading(outputContent);
                break;
        }
    }

    executeSmartContracts(outputContent) {
        this.blockchainMetrics.gasUsed = 420000;
        this.blockchainMetrics.contractStatus = 'Deployed';
        this.blockchainMetrics.contractAddress = '0x742d35Cc6Ae2';

        // Add deployment transaction
        this.addTransaction('0x0000', this.blockchainMetrics.contractAddress, 0, 'contract_deployment');

        outputContent.innerHTML = `
<div class="smart-contracts">
    <h4>📄 Smart Contract Deployed Successfully</h4>
    
    <div class="contract-info">
        <h5>📝 Contract Details:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>Contract Address:</strong> ${this.blockchainMetrics.contractAddress}<br>
            <strong>Gas Used:</strong> ${this.blockchainMetrics.gasUsed.toLocaleString()}<br>
            <strong>Network:</strong> Ethereum Mainnet<br>
            <strong>Block Number:</strong> ${this.blockchain.length + 1}<br>
            <strong>Transaction Hash:</strong> 0x${this.calculateHash(Date.now(), 'deployment', '', '')}<br>
        </div>
    </div>
    
    <div class="contract-functions">
        <h5>🔧 Available Functions:</h5>
        <div style="margin: 10px 0;">
            <span class="blockchain-result smart-contract">set(uint256) ✓</span>
            <span class="blockchain-result smart-contract">get() ✓</span>
            <span class="blockchain-result smart-contract">transfer(address,uint256) ✓</span>
            <span class="blockchain-result smart-contract">approve(address,uint256) ✓</span>
        </div>
    </div>
    
    <div class="contract-events">
        <h5>📡 Recent Events:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            DataUpdated(42) - Block ${this.blockchain.length}<br>
            Transfer(0x123..., 0x456..., 1000) - Block ${this.blockchain.length - 1}<br>
            Approval(0x789..., 0xabc..., 500) - Block ${this.blockchain.length - 2}<br>
        </div>
    </div>
    
    <div class="block-visualization">
        <div class="block">B${this.blockchain.length - 2}</div>
        <div class="block">B${this.blockchain.length - 1}</div>
        <div class="block">B${this.blockchain.length}</div>
        <div class="block blockchain-mining">MINING</div>
    </div>
    
    <div class="gas-optimization">
        <h5>⛽ Gas Optimization:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Original Gas Estimate: 650,000<br>
            Optimized Gas Usage: 420,000<br>
            <span class="blockchain-result gas-efficient">35% Gas Savings ✓</span><br>
            Optimization Techniques: Loop unrolling, packed structs, efficient storage
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
        this.updateBlockchainVisualizations();
    }

    executeDeFiIntegration(outputContent) {
        this.blockchainMetrics.totalValueLocked = 2450000;
        this.blockchainMetrics.averageAPY = 12.5;
        this.blockchainMetrics.activePools = 8;

        // Add liquidity transactions
        this.addTransaction('0x123', 'LiquidityPool', 1000, 'add_liquidity');
        this.addTransaction('0x456', 'StakingContract', 500, 'stake_tokens');

        outputContent.innerHTML = `
<div class="defi-integration">
    <h4>🏦 DeFi Protocol Launched</h4>
    
    <div class="liquidity-pools">
        <h5>💧 Active Liquidity Pools:</h5>
        <div style="margin: 15px 0;">
            <span class="blockchain-result defi-protocol">ETH/USDC (TVL: $450K)</span>
            <span class="blockchain-result defi-protocol">BTC/ETH (TVL: $320K)</span>
            <span class="blockchain-result defi-protocol">LINK/USDT (TVL: $180K)</span>
            <span class="blockchain-result defi-protocol">UNI/WETH (TVL: $290K)</span>
        </div>
    </div>
    
    <div class="yield-farming">
        <h5>🌾 Yield Farming Opportunities:</h5>
        <div class="wallet-visualization">
            <div class="wallet-balance">
                <div class="balance-title">ETH/USDC Pool</div>
                <div class="balance-value">15.2% APY</div>
            </div>
            <div class="wallet-balance">
                <div class="balance-title">Staking Rewards</div>
                <div class="balance-value">8.7% APY</div>
            </div>
            <div class="wallet-balance">
                <div class="balance-title">Liquidity Mining</div>
                <div class="balance-value">22.1% APY</div>
            </div>
        </div>
    </div>
    
    <div class="defi-metrics">
        <h5>📊 Protocol Metrics:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Total Value Locked: $${this.blockchainMetrics.totalValueLocked.toLocaleString()}<br>
            24h Volume: $1,247,380<br>
            Active Users: 12,450<br>
            Transactions: 34,567<br>
            Average APY: ${this.blockchainMetrics.averageAPY}%
        </div>
    </div>
    
    <div class="portfolio-allocation">
        <div class="allocation-segment eth-allocation" style="flex: 3;">ETH 30%</div>
        <div class="allocation-segment defi-allocation" style="flex: 2;">DeFi 20%</div>
        <div class="allocation-segment btc-allocation" style="flex: 2.5;">BTC 25%</div>
        <div class="allocation-segment stablecoin-allocation" style="flex: 2.5;">USDC 25%</div>
    </div>
    
    <div class="automated-strategies">
        <h5>🤖 Automated Strategies:</h5>
        <div style="margin: 10px 0;">
            <span class="blockchain-result high-security">Compound Strategy ✓</span>
            <span class="blockchain-result high-security">Rebalancing Bot ✓</span>
            <span class="blockchain-result high-security">Yield Optimization ✓</span>
            <span class="blockchain-result high-security">Risk Management ✓</span>
        </div>
    </div>
    
    <div class="transaction-pool">
        <div class="transaction">LP ADD</div>
        <div class="transaction">STAKE</div>
        <div class="transaction confirmed">SWAP</div>
        <div class="transaction">CLAIM</div>
        <div class="transaction confirmed">YIELD</div>
        <div class="transaction">FARM</div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeNFTMarketplace(outputContent) {
        this.blockchainMetrics.totalNFTs = 1247;
        this.blockchainMetrics.marketplaceVolume = 234.5;
        this.blockchainMetrics.floorPrice = 0.08;

        // Add NFT transactions
        this.addTransaction('0xArtist', '0xCollector', 1.5, 'nft_sale');
        this.addTransaction('0xMinter', 'NFTContract', 0, 'nft_mint');

        outputContent.innerHTML = `
<div class="nft-marketplace">
    <h4>🖼️ NFT Marketplace Live</h4>
    
    <div class="nft-collections">
        <h5>🎨 Featured Collections:</h5>
        <div style="margin: 15px 0;">
            <span class="blockchain-result nft-token">CryptoPunks (Floor: 45 ETH)</span>
            <span class="blockchain-result nft-token">BAYC (Floor: 15 ETH)</span>
            <span class="blockchain-result nft-token">Art Blocks (Floor: 2.1 ETH)</span>
            <span class="blockchain-result nft-token">Azuki (Floor: 8.5 ETH)</span>
        </div>
    </div>
    
    <div class="marketplace-stats">
        <h5>📈 Marketplace Statistics:</h5>
        <div class="wallet-visualization">
            <div class="wallet-balance">
                <div class="balance-title">Total NFTs</div>
                <div class="balance-value">${this.blockchainMetrics.totalNFTs.toLocaleString()}</div>
            </div>
            <div class="wallet-balance">
                <div class="balance-title">Volume (24h)</div>
                <div class="balance-value">${this.blockchainMetrics.marketplaceVolume} ETH</div>
            </div>
            <div class="wallet-balance">
                <div class="balance-title">Floor Price</div>
                <div class="balance-value">${this.blockchainMetrics.floorPrice} ETH</div>
            </div>
        </div>
    </div>
    
    <div class="recent-sales">
        <h5>💰 Recent Sales:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            Digital Art #4521 - 3.2 ETH<br>
            Pixel Avatar #892 - 1.8 ETH<br>
            Abstract NFT #156 - 2.7 ETH<br>
            Music Token #23 - 0.9 ETH<br>
            Virtual Land #445 - 5.1 ETH
        </div>
    </div>
    
    <div class="nft-utilities">
        <h5>🔧 NFT Utilities:</h5>
        <div style="margin: 10px 0;">
            <span class="blockchain-result nft-token">Lazy Minting ✓</span>
            <span class="blockchain-result nft-token">Royalty System ✓</span>
            <span class="blockchain-result nft-token">Auction House ✓</span>
            <span class="blockchain-result nft-token">IPFS Storage ✓</span>
        </div>
    </div>
    
    <div class="royalty-distribution">
        <h5>💎 Royalty Distribution:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Creator: 10% (0.32 ETH earned)<br>
            Platform: 2.5% (0.08 ETH earned)<br>
            Collector: 87.5% (2.8 ETH received)<br>
            <br>
            Total Royalties Paid: 45.7 ETH<br>
            Artists Supported: 1,247
        </div>
    </div>
    
    <div class="auction-activity">
        <h5>🔨 Live Auctions:</h5>
        <div class="transaction-pool">
            <div class="transaction">BID 2.1Ξ</div>
            <div class="transaction confirmed">SOLD 5.3Ξ</div>
            <div class="transaction">BID 1.8Ξ</div>
            <div class="transaction">BID 3.2Ξ</div>
            <div class="transaction confirmed">SOLD 2.7Ξ</div>
            <div class="transaction">BID 4.1Ξ</div>
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeWeb3Integration(outputContent) {
        this.blockchainMetrics.walletStatus = 'Connected';
        this.blockchainMetrics.networkName = 'Ethereum';
        this.blockchainMetrics.walletBalance = 12.4567;

        // Add wallet transaction
        this.addTransaction('MetaMask', '0xUser', 0, 'wallet_connect');

        outputContent.innerHTML = `
<div class="web3-integration">
    <h4>🔗 Web3 Integration Active</h4>
    
    <div class="wallet-connection">
        <h5>👛 Wallet Connection:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>Status:</strong> ${this.blockchainMetrics.walletStatus}<br>
            <strong>Network:</strong> ${this.blockchainMetrics.networkName} Mainnet<br>
            <strong>Address:</strong> 0x742d35Cc6Ae2344dd91adD3ec2EdD6d0c6D2a23<br>
            <strong>Balance:</strong> ${this.blockchainMetrics.walletBalance} ETH<br>
            <strong>Chain ID:</strong> 1
        </div>
    </div>
    
    <div class="supported-networks">
        <h5>🌐 Supported Networks:</h5>
        <div style="margin: 15px 0;">
            <span class="blockchain-result web3-connected">Ethereum ✓</span>
            <span class="blockchain-result web3-connected">Polygon ✓</span>
            <span class="blockchain-result web3-connected">BSC ✓</span>
            <span class="blockchain-result web3-connected">Avalanche ✓</span>
            <span class="blockchain-result web3-connected">Arbitrum ✓</span>
            <span class="blockchain-result web3-connected">Optimism ✓</span>
        </div>
    </div>
    
    <div class="web3-features">
        <h5>🚀 Web3 Features:</h5>
        <div class="wallet-visualization">
            <div class="wallet-balance">
                <div class="balance-title">Transaction Signing</div>
                <div class="balance-value">Active</div>
            </div>
            <div class="wallet-balance">
                <div class="balance-title">Token Management</div>
                <div class="balance-value">Enabled</div>
            </div>
            <div class="wallet-balance">
                <div class="balance-title">DApp Integration</div>
                <div class="balance-value">Ready</div>
            </div>
        </div>
    </div>
    
    <div class="message-signing">
        <h5>✍️ Message Signing:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>Message:</strong> "Hello Web3 World!"<br>
            <strong>Signature:</strong> 0x4f8b2c...9d3a1e<br>
            <strong>Verified:</strong> ✅ Valid<br>
            <strong>Timestamp:</strong> ${new Date().toLocaleString()}
        </div>
    </div>
    
    <div class="token-management">
        <h5>🪙 Token Portfolio:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            ETH: 12.4567 ($39,842.15)<br>
            USDC: 5,000.00 ($5,000.00)<br>
            UNI: 245.67 ($1,967.34)<br>
            LINK: 156.23 ($2,187.22)<br>
            AAVE: 45.12 ($3,421.44)
        </div>
    </div>
    
    <div class="web3-interactions">
        <h5>🔄 Recent Interactions:</h5>
        <div style="margin: 10px 0;">
            <span class="blockchain-result high-security">Contract Call ✓</span>
            <span class="blockchain-result high-security">Token Approval ✓</span>
            <span class="blockchain-result high-security">NFT Transfer ✓</span>
            <span class="blockchain-result high-security">Stake Tokens ✓</span>
        </div>
    </div>
    
    <div class="gas-tracker">
        <h5>⛽ Gas Tracker:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Current Gas Price: 25 Gwei<br>
            Fast: 35 Gwei (~2 min)<br>
            Standard: 25 Gwei (~5 min)<br>
            Safe: 20 Gwei (~10 min)<br>
            <br>
            Today's Gas Spent: 0.0234 ETH
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeCryptocurrencyTrading(outputContent) {
        this.blockchainMetrics.portfolioValue = 52847.32;
        this.blockchainMetrics.totalPnL = 2847.32;
        this.blockchainMetrics.totalTrades = 147;

        // Add trading transactions
        this.addTransaction('0xTrader', 'Exchange', 1.5, 'buy_order');
        this.addTransaction('Exchange', '0xTrader', 2.1, 'sell_order');

        outputContent.innerHTML = `
<div class="cryptocurrency-trading">
    <h4>📈 Trading Engine Active</h4>
    
    <div class="portfolio-overview">
        <h5>💼 Portfolio Overview:</h5>
        <div class="wallet-visualization">
            <div class="wallet-balance">
                <div class="balance-title">Portfolio Value</div>
                <div class="balance-value">$${this.blockchainMetrics.portfolioValue.toLocaleString()}</div>
            </div>
            <div class="wallet-balance">
                <div class="balance-title">Total P&L</div>
                <div class="balance-value" style="color: ${this.blockchainMetrics.totalPnL > 0 ? 'var(--success-color)' : 'var(--error-color)'}">
                    ${this.blockchainMetrics.totalPnL > 0 ? '+' : ''}$${this.blockchainMetrics.totalPnL.toLocaleString()}
                </div>
            </div>
            <div class="wallet-balance">
                <div class="balance-title">Total Trades</div>
                <div class="balance-value">${this.blockchainMetrics.totalTrades}</div>
            </div>
        </div>
    </div>
    
    <div class="trading-pairs">
        <h5>📊 Active Trading Pairs:</h5>
        <div style="margin: 15px 0;">
            <span class="blockchain-result crypto-trading">BTC/USDT ($43,250)</span>
            <span class="blockchain-result crypto-trading">ETH/USDT ($3,187)</span>
            <span class="blockchain-result crypto-trading">BNB/USDT ($425)</span>
            <span class="blockchain-result crypto-trading">ADA/USDT ($1.23)</span>
        </div>
    </div>
    
    <div class="trading-chart">
        <div class="chart-line"></div>
    </div>
    
    <div class="order-book">
        <h5>📋 Order Book:</h5>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 10px 0;">
            <div>
                <strong style="color: var(--success-color);">Buy Orders</strong><br>
                <span style="color: var(--text-secondary); font-size: 0.9rem;">
                    1.2456 BTC @ $43,180<br>
                    0.8934 BTC @ $43,150<br>
                    2.1234 BTC @ $43,120<br>
                    0.5678 BTC @ $43,090
                </span>
            </div>
            <div>
                <strong style="color: var(--error-color);">Sell Orders</strong><br>
                <span style="color: var(--text-secondary); font-size: 0.9rem;">
                    0.9876 BTC @ $43,280<br>
                    1.5432 BTC @ $43,310<br>
                    0.7891 BTC @ $43,340<br>
                    2.3456 BTC @ $43,370
                </span>
            </div>
        </div>
    </div>
    
    <div class="trading-algorithms">
        <h5>🤖 Trading Algorithms:</h5>
        <div style="margin: 10px 0;">
            <span class="blockchain-result high-security">DCA Strategy ✓</span>
            <span class="blockchain-result high-security">Grid Trading ✓</span>
            <span class="blockchain-result high-security">Arbitrage Bot ✓</span>
            <span class="blockchain-result high-security">Stop Loss ✓</span>
        </div>
    </div>
    
    <div class="trading-metrics">
        <h5>📊 Performance Metrics:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Win Rate: 68.5%<br>
            Average Profit: 2.3%<br>
            Max Drawdown: -8.4%<br>
            Sharpe Ratio: 1.47<br>
            Total Volume: $2,847,392<br>
            <br>
            Best Trade: +$2,340 (ETH long)<br>
            Worst Trade: -$890 (BTC short)
        </div>
    </div>
    
    <div class="market-analysis">
        <h5>🔍 Market Analysis:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>BTC Trend:</strong> Bullish (RSI: 67)<br>
            <strong>ETH Momentum:</strong> Strong (MACD: Positive)<br>
            <strong>Market Sentiment:</strong> Optimistic<br>
            <strong>Volume:</strong> Above Average (+23%)<br>
            <strong>Volatility:</strong> Moderate (VIX: 45)
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    updateBlockchainVisualizations() {
        // Update any blockchain visualizations in the DOM
        const blockVisualizations = document.querySelectorAll('.block-visualization');
        blockVisualizations.forEach(viz => {
            // Add mining animation to latest block
            const miningBlock = viz.querySelector('.blockchain-mining');
            if (miningBlock) {
                setTimeout(() => {
                    miningBlock.textContent = `B${this.blockchain.length}`;
                    miningBlock.classList.remove('blockchain-mining');
                }, 3000);
            }
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
        // Update Smart Contract metrics
        document.getElementById('gasUsed').textContent = this.blockchainMetrics.gasUsed.toLocaleString();
        document.getElementById('contractStatus').textContent = this.blockchainMetrics.contractStatus;
        document.getElementById('contractAddress').textContent = this.blockchainMetrics.contractAddress;

        // Update DeFi metrics
        document.getElementById('totalValueLocked').textContent = `$${this.blockchainMetrics.totalValueLocked.toLocaleString()}`;
        document.getElementById('averageAPY').textContent = `${this.blockchainMetrics.averageAPY}%`;
        document.getElementById('activePools').textContent = this.blockchainMetrics.activePools;

        // Update NFT Marketplace metrics
        document.getElementById('totalNFTs').textContent = this.blockchainMetrics.totalNFTs.toLocaleString();
        document.getElementById('marketplaceVolume').textContent = `${this.blockchainMetrics.marketplaceVolume} ETH`;
        document.getElementById('floorPrice').textContent = `${this.blockchainMetrics.floorPrice} ETH`;

        // Update Web3 Integration metrics
        document.getElementById('walletStatus').textContent = this.blockchainMetrics.walletStatus;
        document.getElementById('networkName').textContent = this.blockchainMetrics.networkName;
        document.getElementById('walletBalance').textContent = `${this.blockchainMetrics.walletBalance} ETH`;

        // Update Cryptocurrency Trading metrics
        document.getElementById('portfolioValue').textContent = `$${this.blockchainMetrics.portfolioValue.toLocaleString()}`;
        document.getElementById('totalPnL').textContent = `$${this.blockchainMetrics.totalPnL.toLocaleString()}`;
        document.getElementById('totalTrades').textContent = this.blockchainMetrics.totalTrades;
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
            if (!completedLevels.includes(26)) {
                completedLevels.push(26);
                localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
            }

            const totalProgress = JSON.parse(localStorage.getItem('totalProgress') || '0');
            localStorage.setItem('totalProgress', Math.max(totalProgress, 26).toString());

            setTimeout(() => {
                alert('🎉 Congratulations! You\'ve completed Level 26: Blockchain & Web3!\n\nYou\'ve mastered:\n• Smart contract development and deployment\n• DeFi protocol integration and liquidity management\n• NFT marketplace creation and trading\n• Web3 wallet integration and dApp connectivity\n• Cryptocurrency trading and portfolio management');
                
                window.location.href = '../../index.html';
            }, 2000);
        }
    }

    showCompletionAnimation() {
        const container = document.querySelector('.level-container');
        container.style.position = 'relative';
        container.style.overflow = 'hidden';

        for (let i = 0; i < 45; i++) {
            const cryptoIcon = document.createElement('div');
            cryptoIcon.style.position = 'absolute';
            cryptoIcon.style.fontSize = '20px';
            cryptoIcon.innerHTML = ['₿', 'Ξ', '🚀', '💎', '🔗', '📈', '💰'][Math.floor(Math.random() * 7)];
            cryptoIcon.style.left = Math.random() * 100 + '%';
            cryptoIcon.style.top = '-30px';
            cryptoIcon.style.animation = `cryptoFall ${Math.random() * 2 + 2}s linear forwards`;
            cryptoIcon.style.opacity = '0.8';
            cryptoIcon.classList.add('blockchain-mining');
            container.appendChild(cryptoIcon);

            setTimeout(() => cryptoIcon.remove(), 4000);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes cryptoFall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    resetLevel() {
        if (confirm('Are you sure you want to reset this level? All blockchain progress will be lost.')) {
            this.exercises.forEach(ex => ex.completed = false);
            
            document.querySelectorAll('.exercise-card').forEach(card => {
                card.classList.remove('completed');
                const statusElement = card.querySelector('.exercise-status');
                statusElement.innerHTML = '<i class="fas fa-circle status-pending"></i><span>Pending</span>';
            });

            document.querySelectorAll('.output-content').forEach(output => {
                output.innerHTML = '';
            });

            this.blockchainMetrics = {
                gasUsed: 0, contractStatus: 'Not Deployed', contractAddress: 'N/A',
                totalValueLocked: 0, averageAPY: 0, activePools: 0,
                totalNFTs: 0, marketplaceVolume: 0, floorPrice: 0,
                walletStatus: 'Disconnected', networkName: 'Unknown', walletBalance: 0,
                portfolioValue: 0, totalPnL: 0, totalTrades: 0
            };

            this.blockchain = [];
            this.transactionPool = [];
            this.simulateBlockchain();

            this.updateProgressDisplay();
            this.updateMetricsDisplay();
            this.saveProgress();
        }
    }

    saveProgress() {
        localStorage.setItem('level26Progress', JSON.stringify({
            exercises: this.exercises,
            blockchainMetrics: this.blockchainMetrics,
            blockchain: this.blockchain.slice(-10) // Save last 10 blocks
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem('level26Progress');
        if (saved) {
            const data = JSON.parse(saved);
            this.exercises = data.exercises || this.exercises;
            this.blockchainMetrics = data.blockchainMetrics || this.blockchainMetrics;
            this.blockchain = data.blockchain || this.blockchain;
            
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
    if (window.blockchainLevel) {
        window.blockchainLevel.runExercise(exerciseId);
    }
}

function completeLevel() {
    if (window.blockchainLevel) {
        window.blockchainLevel.completeLevel();
    }
}

function resetLevel() {
    if (window.blockchainLevel) {
        window.blockchainLevel.resetLevel();
    }
}

// Initialize the level when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.blockchainLevel = new BlockchainWeb3Level();
});
