#!/usr/bin/env node
/**
 * Crypto Payment Handler for Skill Scanner
 * Accepts ETH, USDC, USDT payments
 */

import fs from 'fs';
import path from 'path';

// Treasury configuration
const TREASURY = {
  address: process.env.TREASURY_ADDRESS || '0x84ec797CF9997c4Fd3d5BbFB5DD4073eA691585C',
  chains: ['ethereum', 'polygon', 'base', 'arbitrum', 'optimism'],
  acceptedTokens: {
    ETH: { decimals: 18, symbol: 'ETH' },
    USDC: { decimals: 6, symbol: 'USDC' },
    USDT: { decimals: 6, symbol: 'USDT' }
  }
};

// Pricing in USD
const PRICING = {
  'per-scan': 2.00,
  'pro-monthly': 10.00
};

// Payment database (simple JSON file)
const DB_PATH = './payments.json';

class CryptoPayments {
  constructor() {
    this.loadDatabase();
    
    // Auto-save database every 30 seconds if changed
    setInterval(() => {
      if (this.dbChanged) {
        this.saveDatabase();
        this.dbChanged = false;
      }
    }, 30000);
  }

  loadDatabase() {
    if (fs.existsSync(DB_PATH)) {
      this.db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } else {
      this.db = {
        payments: [],
        subscriptions: {}
      };
      this.saveDatabase();
    }
    this.dbChanged = false;
  }

  saveDatabase() {
    fs.writeFileSync(DB_PATH, JSON.stringify(this.db, null, 2));
  }

  markChanged() {
    this.dbChanged = true;
  }

  /**
   * Generate payment instructions
   */
  getPaymentInfo(plan, email) {
    const amount = PRICING[plan];
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      paymentId,
      plan,
      amount: amount,
      treasury: TREASURY.address,
      instructions: {
        step1: `Send $${amount} worth of ETH, USDC, or USDT to:`,
        address: TREASURY.address,
        step2: 'Include this memo/note with your transaction:',
        memo: paymentId,
        step3: 'Payment will be verified within 5 minutes',
        chains: TREASURY.chains
      },
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Verify payment manually (for now)
   * TODO: Integrate blockchain APIs (Etherscan, Polygonscan, Basescan)
   */
  async verifyPayment(paymentId, txHash) {
    // For now, store payment info
    const payment = {
      paymentId,
      txHash,
      status: 'pending',
      verifiedAt: new Date().toISOString()
    };

    this.db.payments.push(payment);
    this.markChanged();

    return {
      success: true,
      message: 'Payment received! Verifying on blockchain...',
      status: 'pending',
      paymentId
    };
  }

  /**
   * Check if user has valid subscription
   */
  hasAccess(email, plan = 'pro-monthly') {
    const sub = this.db.subscriptions[email];
    if (!sub) return false;
    
    // Check if subscription is active
    if (sub.plan !== plan) return false;
    
    const expiresAt = new Date(sub.expiresAt);
    return expiresAt > new Date();
  }

  /**
   * Activate subscription after payment verified
   */
  activateSubscription(email, plan, paymentId) {
    const expiresAt = new Date();
    
    if (plan === 'pro-monthly') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (plan === 'per-scan') {
      // Single scan, expires in 24h
      expiresAt.setHours(expiresAt.getHours() + 24);
    }

    this.db.subscriptions[email] = {
      plan,
      paymentId,
      activatedAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      scansUsed: 0
    };

    this.markChanged();

    return {
      success: true,
      plan,
      expiresAt: expiresAt.toISOString()
    };
  }

  /**
   * Track scan usage
   */
  incrementScan(email) {
    if (this.db.subscriptions[email]) {
      this.db.subscriptions[email].scansUsed++;
      this.markChanged();
    }
  }

  /**
   * Get subscription status
   */
  getSubscriptionStatus(email) {
    const sub = this.db.subscriptions[email];
    if (!sub) {
      return {
        active: false,
        plan: 'free',
        scansRemaining: 3 // Free tier
      };
    }

    const isActive = new Date(sub.expiresAt) > new Date();
    
    return {
      active: isActive,
      plan: sub.plan,
      expiresAt: sub.expiresAt,
      scansUsed: sub.scansUsed,
      scansRemaining: sub.plan === 'pro-monthly' ? 'unlimited' : (1 - sub.scansUsed)
    };
  }
}

export default CryptoPayments;
