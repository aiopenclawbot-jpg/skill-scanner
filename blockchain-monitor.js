#!/usr/bin/env node
/**
 * Blockchain Payment Monitor
 * Automatically verifies crypto payments via Etherscan/Polygonscan/Basescan APIs
 */

import https from 'https';
import fs from 'fs';

const TREASURY_ADDRESS = '0x84ec797CF9997c4Fd3d5BbFB5DD4073eA691585C';

// Free API endpoints (no key required for basic calls)
const EXPLORERS = {
  ethereum: {
    name: 'Ethereum',
    api: 'api.etherscan.io',
    symbol: 'ETH'
  },
  polygon: {
    name: 'Polygon',
    api: 'api.polygonscan.com',
    symbol: 'MATIC'
  },
  base: {
    name: 'Base',
    api: 'api.basescan.org',
    symbol: 'ETH'
  }
};

// Pricing in USD
const PRICING = {
  'per-scan': 2.00,
  'pro-monthly': 10.00
};

// Rough USD prices (update these periodically or use price oracle)
const USD_PRICES = {
  ETH: 3000,
  MATIC: 0.80,
  USDC: 1.00,
  USDT: 1.00
};

class BlockchainMonitor {
  constructor(paymentsDb) {
    this.paymentsDb = paymentsDb;
    this.lastChecked = {};
    this.knownTxs = new Set();
  }

  /**
   * Fetch recent transactions for treasury address
   */
  async fetchTransactions(chain) {
    const explorer = EXPLORERS[chain];
    if (!explorer) return [];

    return new Promise((resolve, reject) => {
      const path = `/api?module=account&action=txlist&address=${TREASURY_ADDRESS}&startblock=0&endblock=99999999&sort=desc`;
      
      const options = {
        hostname: explorer.api,
        path: path,
        method: 'GET',
        headers: { 'User-Agent': 'SkillScanner/1.0' }
      };

      https.get(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.status === '1' && json.result) {
              resolve(json.result);
            } else {
              resolve([]);
            }
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  }

  /**
   * Fetch ERC-20 token transactions (USDC, USDT)
   */
  async fetchTokenTransactions(chain) {
    const explorer = EXPLORERS[chain];
    if (!explorer) return [];

    return new Promise((resolve, reject) => {
      const path = `/api?module=account&action=tokentx&address=${TREASURY_ADDRESS}&startblock=0&endblock=99999999&sort=desc`;
      
      const options = {
        hostname: explorer.api,
        path: path,
        method: 'GET',
        headers: { 'User-Agent': 'SkillScanner/1.0' }
      };

      https.get(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.status === '1' && json.result) {
              resolve(json.result);
            } else {
              resolve([]);
            }
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  }

  /**
   * Calculate USD value of transaction
   */
  calculateUSDValue(tx, chain) {
    let amount = 0;
    let token = 'ETH';

    if (tx.tokenSymbol) {
      // ERC-20 token transaction
      token = tx.tokenSymbol.toUpperCase();
      const decimals = parseInt(tx.tokenDecimal) || 18;
      amount = parseFloat(tx.value) / Math.pow(10, decimals);
    } else {
      // Native token (ETH/MATIC)
      token = EXPLORERS[chain].symbol;
      amount = parseFloat(tx.value) / 1e18;
    }

    const price = USD_PRICES[token] || 0;
    return amount * price;
  }

  /**
   * Match transaction to pending payment
   */
  matchTransaction(tx, usdValue) {
    // Check if amount matches any pricing tier (with 5% tolerance)
    for (const [plan, price] of Object.entries(PRICING)) {
      const tolerance = price * 0.05;
      if (usdValue >= price - tolerance && usdValue <= price + tolerance) {
        return plan;
      }
    }
    return null;
  }

  /**
   * Process a single transaction
   */
  async processTransaction(tx, chain) {
    const txHash = tx.hash;
    
    // Skip if already processed
    if (this.knownTxs.has(txHash)) return null;
    
    // Skip if outgoing
    if (tx.from.toLowerCase() === TREASURY_ADDRESS.toLowerCase()) return null;
    
    // Calculate USD value
    const usdValue = this.calculateUSDValue(tx, chain);
    
    // Match to pricing plan
    const plan = this.matchTransaction(tx, usdValue);
    
    if (!plan) return null;

    this.knownTxs.add(txHash);

    return {
      txHash,
      chain,
      from: tx.from,
      usdValue,
      plan,
      timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString()
    };
  }

  /**
   * Monitor all chains for new payments
   */
  async checkForPayments() {
    console.log('🔍 Checking for new payments...');
    
    const newPayments = [];

    for (const chain of Object.keys(EXPLORERS)) {
      try {
        // Check native transactions
        const nativeTxs = await this.fetchTransactions(chain);
        
        // Check recent transactions (last 10)
        for (const tx of nativeTxs.slice(0, 10)) {
          const payment = await this.processTransaction(tx, chain);
          if (payment) {
            newPayments.push(payment);
            console.log(`💰 Payment detected: $${payment.usdValue.toFixed(2)} (${payment.plan}) - ${payment.txHash.slice(0, 10)}...`);
          }
        }

        // Check token transactions (USDC, USDT)
        const tokenTxs = await this.fetchTokenTransactions(chain);
        
        for (const tx of tokenTxs.slice(0, 10)) {
          const payment = await this.processTransaction(tx, chain);
          if (payment) {
            newPayments.push(payment);
            console.log(`💰 Token payment detected: $${payment.usdValue.toFixed(2)} (${payment.plan}) - ${payment.txHash.slice(0, 10)}...`);
          }
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`❌ Error checking ${chain}:`, error.message);
      }
    }

    return newPayments;
  }

  /**
   * Activate subscription for detected payment
   */
  activatePayment(payment) {
    // Generate email from address (temporary until user provides real email)
    const email = `${payment.from.toLowerCase()}@crypto.user`;
    
    const expiresAt = new Date();
    if (payment.plan === 'pro-monthly') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (payment.plan === 'per-scan') {
      expiresAt.setHours(expiresAt.getHours() + 24);
    }

    const subscription = {
      email,
      walletAddress: payment.from,
      plan: payment.plan,
      paymentId: payment.txHash,
      chain: payment.chain,
      usdValue: payment.usdValue,
      activatedAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      scansUsed: 0
    };

    // Save to database
    this.paymentsDb.subscriptions[email] = subscription;
    this.paymentsDb.payments.push({
      txHash: payment.txHash,
      email,
      plan: payment.plan,
      amount: payment.usdValue,
      status: 'confirmed',
      chain: payment.chain,
      timestamp: payment.timestamp
    });

    return subscription;
  }

  /**
   * Start monitoring loop
   */
  async startMonitoring(intervalMinutes = 5) {
    console.log(`🚀 Starting blockchain monitor (checking every ${intervalMinutes} minutes)`);
    console.log(`📍 Treasury: ${TREASURY_ADDRESS}`);
    console.log(`⛓️  Chains: ${Object.keys(EXPLORERS).join(', ')}`);
    console.log('');

    // Check immediately on start
    const initialPayments = await this.checkForPayments();
    for (const payment of initialPayments) {
      const sub = this.activatePayment(payment);
      console.log(`✅ Activated: ${sub.email} (${sub.plan}) - Expires: ${sub.expiresAt}`);
    }

    // Then check periodically
    setInterval(async () => {
      const payments = await this.checkForPayments();
      
      for (const payment of payments) {
        const sub = this.activatePayment(payment);
        console.log(`✅ Activated: ${sub.email} (${sub.plan}) - Expires: ${sub.expiresAt}`);
      }

      if (payments.length === 0) {
        console.log('✓ No new payments');
      }
    }, intervalMinutes * 60 * 1000);
  }
}

export default BlockchainMonitor;
