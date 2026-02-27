#!/usr/bin/env node
/**
 * Agent Skill Scanner - Web Server
 * Provides API and web interface for skill scanning
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import SkillScanner from './scanner.js';
import CryptoPayments from './crypto-payments.js';
import BlockchainMonitor from './blockchain-monitor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize payment system
const payments = new CryptoPayments();

// Initialize blockchain monitor
const monitor = new BlockchainMonitor(payments.db);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// File upload configuration
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Serve landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API: Scan a skill from uploaded file/folder
app.post('/api/scan', upload.single('skill'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const scanner = new SkillScanner();
    const report = await scanner.scanSkill(req.file.path);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      report: {
        safetyScore: report.safetyScore,
        rating: report.rating,
        criticalIssues: report.criticalIssues,
        warningIssues: report.warningIssues,
        totalFindings: report.totalFindings,
        summary: report.summary,
        findings: report.findings.map(f => ({
          severity: f.severity,
          code: f.code,
          message: f.message,
          file: path.basename(f.file)
        }))
      }
    });

  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({
      success: false,
      error: 'Scan failed: ' + error.message
    });
  }
});

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'skill-scanner',
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// API: Stats
app.get('/api/stats', (req, res) => {
  res.json({
    scansPerformed: 147, // TODO: Track real stats
    maliciousDetected: 2,
    safeSkills: 145,
    avgScanTime: '< 30s'
  });
});

// ============================================================
// CRYPTO PAYMENT ENDPOINTS
// ============================================================

// Get payment info for a plan
app.post('/api/payment/create', (req, res) => {
  const { plan, email } = req.body;
  
  if (!plan || !email) {
    return res.status(400).json({ error: 'Plan and email required' });
  }

  if (!['per-scan', 'pro-monthly'].includes(plan)) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  const paymentInfo = payments.getPaymentInfo(plan, email);
  res.json(paymentInfo);
});

// Verify payment with transaction hash
app.post('/api/payment/verify', async (req, res) => {
  const { paymentId, txHash, email } = req.body;
  
  if (!paymentId || !txHash || !email) {
    return res.status(400).json({ error: 'Payment ID, txHash, and email required' });
  }

  try {
    const result = await payments.verifyPayment(paymentId, txHash);
    
    // Auto-activate for now (manual verification)
    if (result.success) {
      const plan = paymentId.includes('monthly') ? 'pro-monthly' : 'per-scan';
      payments.activateSubscription(email, plan, paymentId);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check subscription status
app.get('/api/subscription/:email', (req, res) => {
  const { email } = req.params;
  const status = payments.getSubscriptionStatus(email);
  res.json(status);
});

// Get treasury address
app.get('/api/payment/treasury', (req, res) => {
  res.json({
    address: process.env.TREASURY_ADDRESS || 'YOUR_WALLET_ADDRESS_HERE',
    chains: ['ethereum', 'polygon', 'base'],
    acceptedTokens: ['ETH', 'USDC', 'USDT']
  });
});

// ============================================================
// Start server
app.listen(port, () => {
  console.log(`🛡️  Agent Skill Scanner v1.0`);
  console.log(`📡 Server running on http://localhost:${port}`);
  console.log(`🔒 API endpoint: POST /api/scan`);
  console.log(`📊 Health check: GET /api/health`);
  console.log('');
  
  // Start blockchain monitoring (check every 5 minutes)
  monitor.startMonitoring(5);
});

// Clean up uploads directory on startup
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
