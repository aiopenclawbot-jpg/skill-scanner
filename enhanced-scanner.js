#!/usr/bin/env node
/**
 * Enhanced Agent Anti-Virus Scanner
 * Comprehensive security scanning for AI agent skills
 */

import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

// Malicious domain blacklist
const SUSPICIOUS_DOMAINS = [
  'pastebin.com',
  'hastebin.com',
  'discord.gg',
  'bit.ly',
  't.me',
  'raw.githubusercontent.com', // Often used for malware staging
  'ngrok.io',
  'duckdns.org',
  'no-ip.com'
];

// Known malware signatures (hashes of malicious code patterns)
const MALWARE_SIGNATURES = [
  /eval\(atob\(/gi,  // Base64 eval pattern
  /Function\(.*atob/gi,  // Base64 Function pattern
  /child_process.*exec.*rm -rf/gi,  // Destructive commands
  /process\.binding\(['"]natives['"]\)/gi,  // Node.js internals access
];

class EnhancedSkillScanner {
  constructor() {
    this.findings = [];
    this.safetyScore = 100;
    this.criticalIssues = 0;
    this.warningIssues = 0;
    this.infoIssues = 0;
    this.malwareDetected = false;
    this.threatLevel = 'SAFE';
  }

  /**
   * Scan a skill directory or file
   */
  async scanSkill(skillPath) {
    console.log(`🔍 Scanning: ${skillPath}`);
    this.findings = [];
    this.safetyScore = 100;
    this.criticalIssues = 0;
    this.warningIssues = 0;
    this.infoIssues = 0;
    this.malwareDetected = false;

    const stats = fs.statSync(skillPath);
    
    if (stats.isDirectory()) {
      await this.scanDirectory(skillPath);
    } else {
      await this.scanFile(skillPath);
    }

    // Calculate threat level
    this.calculateThreatLevel();

    return this.generateReport();
  }

  /**
   * Calculate overall threat level
   */
  calculateThreatLevel() {
    if (this.malwareDetected || this.criticalIssues >= 5) {
      this.threatLevel = 'SEVERE';
    } else if (this.criticalIssues >= 3) {
      this.threatLevel = 'HIGH';
    } else if (this.criticalIssues >= 1) {
      this.threatLevel = 'MEDIUM';
    } else if (this.warningIssues >= 3) {
      this.threatLevel = 'LOW';
    } else {
      this.threatLevel = 'SAFE';
    }
  }

  /**
   * Enhanced pattern scanning with anti-virus signatures
   */
  scanPatterns(filePath, content) {
    const patterns = [
      // CRITICAL: Malware signatures
      {
        severity: 'critical',
        code: 'MALWARE_SIGNATURE',
        patterns: MALWARE_SIGNATURES,
        message: '⚠️ MALWARE DETECTED: Known malicious code pattern'
      },
      
      // CRITICAL: Wallet/crypto access
      {
        severity: 'critical',
        code: 'WALLET_ACCESS',
        patterns: [
          /private[_\s]?key/gi,
          /seed[_\s]?phrase/gi,
          /mnemonic/gi,
          /\.keystore/gi,
          /wallet\.dat/gi,
          /0x[a-fA-F0-9]{40}/g  // Ethereum addresses
        ],
        message: 'Accesses wallet private keys or seed phrases'
      },

      // CRITICAL: Keylogger patterns
      {
        severity: 'critical',
        code: 'KEYLOGGER',
        patterns: [
          /keydown|keyup|keypress/gi,
          /addEventListener.*key/gi,
          /on(keydown|keyup|keypress)/gi,
          /process\.stdin\.on.*data/gi
        ],
        message: 'Keylogger detected - captures keyboard input'
      },

      // CRITICAL: Screen capture / surveillance
      {
        severity: 'critical',
        code: 'SURVEILLANCE',
        patterns: [
          /captureScreen|takeScreenshot/gi,
          /desktopCapturer/gi,
          /screenshot|screen-capture/gi,
          /webcam|camera\.capture/gi
        ],
        message: 'Screen capture or camera access detected'
      },

      // CRITICAL: Backdoor patterns
      {
        severity: 'critical',
        code: 'BACKDOOR',
        patterns: [
          /net\.createServer|net\.connect/gi,
          /child_process.*netcat|nc -l/gi,
          /reverse[_\s]?shell/gi,
          /bindShell/gi,
          /ws:\/\/.*:\d+/g  // WebSocket connections
        ],
        message: 'Backdoor or remote access detected'
      },

      // CRITICAL: Code execution
      {
        severity: 'critical',
        code: 'DYNAMIC_EXECUTION',
        patterns: [
          /eval\s*\(/g,
          /Function\s*\(/g,
          /new\s+Function/g,
          /vm\.runInNewContext/g,
          /child_process\.exec/g
        ],
        message: 'Dynamic code execution detected'
      },

      // CRITICAL: Obfuscation
      {
        severity: 'critical',
        code: 'OBFUSCATION',
        patterns: [
          /atob\(/g,
          /btoa\(/g,
          /Buffer\.from.*base64/g,
          /\\x[0-9a-f]{2}/gi,
          /String\.fromCharCode/g
        ],
        message: 'Code obfuscation detected'
      },

      // CRITICAL: Clipboard hijacking
      {
        severity: 'critical',
        code: 'CLIPBOARD_ACCESS',
        patterns: [
          /clipboard\.write/gi,
          /clipboard\.read/gi,
          /navigator\.clipboard/gi,
          /document\.execCommand.*copy/gi
        ],
        message: 'Clipboard access (potential address hijacking)'
      },

      // CRITICAL: Credential theft
      {
        severity: 'critical',
        code: 'CREDENTIAL_THEFT',
        patterns: [
          /\.aws\/credentials/gi,
          /\.ssh\/id_rsa/gi,
          /\.npmrc/gi,
          /\.docker\/config\.json/gi,
          /\.kube\/config/gi,
          /password.*=.*process\.env/gi
        ],
        message: 'Accesses sensitive credential files'
      },

      // HIGH: Suspicious domains
      {
        severity: 'critical',
        code: 'SUSPICIOUS_DOMAIN',
        patterns: SUSPICIOUS_DOMAINS.map(d => new RegExp(d.replace('.', '\\.'), 'gi')),
        message: 'Connects to suspicious/blacklisted domain'
      },

      // HIGH: Process manipulation
      {
        severity: 'warning',
        code: 'PROCESS_MANIPULATION',
        patterns: [
          /process\.kill/gi,
          /process\.exit/gi,
          /process\.binding/gi,
          /require\(['"]repl['"]\)/gi
        ],
        message: 'Manipulates system processes'
      },

      // HIGH: File system writes
      {
        severity: 'warning',
        code: 'FILE_WRITE',
        patterns: [
          /fs\.write/gi,
          /fs\.appendFile/gi,
          /fs\.createWriteStream/gi,
          /\.pipe\(/gi
        ],
        message: 'Writes to file system'
      },

      // HIGH: Network requests
      {
        severity: 'warning',
        code: 'NETWORK_REQUEST',
        patterns: [
          /https?:\/\//g,
          /fetch\(/g,
          /axios\./g,
          /got\(/g,
          /request\(/g,
          /XMLHttpRequest/g
        ],
        message: 'Makes external network requests'
      },

      // MEDIUM: Environment variable access
      {
        severity: 'warning',
        code: 'ENV_ACCESS',
        patterns: [
          /process\.env/g,
          /dotenv/g,
          /config\.get/g
        ],
        message: 'Accesses environment variables'
      },

      // MEDIUM: Database connections
      {
        severity: 'info',
        code: 'DATABASE_ACCESS',
        patterns: [
          /mongodb:\/\//gi,
          /postgres:\/\//gi,
          /mysql:\/\//gi,
          /redis:\/\//gi
        ],
        message: 'Connects to database'
      }
    ];

    patterns.forEach(({ severity, code, patterns: patternList, message }) => {
      patternList.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches && matches.length > 0) {
          // Special handling for malware signatures
          if (code === 'MALWARE_SIGNATURE') {
            this.malwareDetected = true;
          }
          
          this.addFinding(severity, code, filePath, `${message} (${matches.length} occurrence${matches.length > 1 ? 's' : ''})`);
        }
      });
    });
  }

  /**
   * Enhanced JavaScript AST analysis
   */
  async scanJavaScript(filePath, content) {
    try {
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });

      traverse.default(ast, {
        // Detect eval usage
        CallExpression: (path) => {
          if (path.node.callee.name === 'eval') {
            this.addFinding('critical', 'EVAL_USAGE', filePath, 'Uses eval() - dangerous code execution');
          }

          // Detect Function constructor
          if (path.node.callee.name === 'Function') {
            this.addFinding('critical', 'FUNCTION_CONSTRUCTOR', filePath, 'Uses Function constructor - code injection risk');
          }

          // Detect require() with dynamic paths
          if (path.node.callee.name === 'require' && 
              path.node.arguments[0].type !== 'StringLiteral') {
            this.addFinding('warning', 'DYNAMIC_REQUIRE', filePath, 'Dynamic require() - potential code injection');
          }

          // Detect child_process usage
          if (path.node.callee.property?.name === 'exec' || 
              path.node.callee.property?.name === 'spawn') {
            this.addFinding('warning', 'SHELL_EXECUTION', filePath, 'Executes shell commands');
          }
        },

        // Detect dangerous imports
        ImportDeclaration: (path) => {
          const source = path.node.source.value;
          const dangerousModules = ['child_process', 'vm', 'fs', 'net', 'dgram', 'crypto'];
          
          if (dangerousModules.includes(source)) {
            this.addFinding('info', 'DANGEROUS_IMPORT', filePath, `Imports dangerous module: ${source}`);
          }
        },

        // Detect suspicious variable names
        VariableDeclarator: (path) => {
          const name = path.node.id.name;
          const suspicious = ['backdoor', 'payload', 'exploit', 'shell', 'inject', 'hack'];
          
          if (suspicious.some(s => name.toLowerCase().includes(s))) {
            this.addFinding('critical', 'SUSPICIOUS_VARIABLE', filePath, `Suspicious variable name: ${name}`);
          }
        }
      });

    } catch (error) {
      this.addFinding('warning', 'PARSE_ERROR', filePath, `Could not analyze: ${error.message}`);
    }
  }

  /**
   * Shell script analysis
   */
  scanShellScript(filePath, content) {
    const dangerousCommands = [
      { pattern: /rm\s+-rf\s+\//gi, message: 'Destructive file deletion' },
      { pattern: /chmod\s+777/gi, message: 'Dangerous permission change' },
      { pattern: /wget.*\|\s*sh/gi, message: 'Downloads and executes remote script' },
      { pattern: /curl.*\|\s*bash/gi, message: 'Downloads and executes remote script' },
      { pattern: /nc\s+-l/gi, message: 'Opens network listener (backdoor)' },
      { pattern: /\/dev\/tcp\//gi, message: 'Raw TCP connection' },
      { pattern: /crontab/gi, message: 'Modifies cron jobs (persistence)' },
      { pattern: /iptables/gi, message: 'Modifies firewall rules' }
    ];

    dangerousCommands.forEach(({ pattern, message }) => {
      if (pattern.test(content)) {
        this.addFinding('critical', 'DANGEROUS_SHELL_COMMAND', filePath, message);
      }
    });
  }

  /**
   * Recursively scan directory
   */
  async scanDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      if (file === 'node_modules' || file.startsWith('.')) continue;
      
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        await this.scanDirectory(filePath);
      } else if (this.isScannable(file)) {
        await this.scanFile(filePath);
      }
    }
  }

  isScannable(filename) {
    const ext = path.extname(filename);
    return ['.js', '.ts', '.jsx', '.tsx', '.sh', '.bash', '.py', '.md'].includes(ext);
  }

  async scanFile(filePath) {
    const ext = path.extname(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Pattern matching
    this.scanPatterns(filePath, content);

    // JavaScript AST
    if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
      try {
        await this.scanJavaScript(filePath, content);
      } catch (error) {
        // Ignore parse errors for now
      }
    }

    // Shell scripts
    if (['.sh', '.bash'].includes(ext)) {
      this.scanShellScript(filePath, content);
    }
  }

  addFinding(severity, code, file, message) {
    this.findings.push({ severity, code, file, message });
    
    if (severity === 'critical') {
      this.criticalIssues++;
      this.safetyScore -= 20;
    } else if (severity === 'warning') {
      this.warningIssues++;
      this.safetyScore -= 5;
    } else {
      this.infoIssues++;
      this.safetyScore -= 1;
    }
    
    this.safetyScore = Math.max(0, this.safetyScore);
  }

  generateReport() {
    const totalFindings = this.findings.length;
    
    let rating = '';
    let emoji = '';
    
    if (this.threatLevel === 'SEVERE') {
      rating = '🚨 SEVERE THREAT';
      emoji = '🚨';
    } else if (this.threatLevel === 'HIGH') {
      rating = '🚨 HIGH RISK';
      emoji = '⚠️';
    } else if (this.threatLevel === 'MEDIUM') {
      rating = '⚠️ MEDIUM RISK';
      emoji = '⚠️';
    } else if (this.threatLevel === 'LOW') {
      rating = '⚠️ LOW RISK';
      emoji = '⚠️';
    } else if (this.safetyScore >= 80) {
      rating = '✅ SAFE';
      emoji = '✅';
    } else if (this.safetyScore >= 60) {
      rating = '⚠️ CAUTION';
      emoji = '⚠️';
    } else {
      rating = '🚨 DANGEROUS';
      emoji = '🚨';
    }

    let summary = '';
    if (this.malwareDetected) {
      summary = '🚨 MALWARE DETECTED! Do NOT install this skill.';
    } else if (this.criticalIssues > 0) {
      summary = `🚨 ${this.criticalIssues} critical issue${this.criticalIssues > 1 ? 's' : ''}, ⚠️ ${this.warningIssues} warning${this.warningIssues > 1 ? 's' : ''}. Review recommended before use.`;
    } else if (this.warningIssues > 0) {
      summary = `⚠️ ${this.warningIssues} warning${this.warningIssues > 1 ? 's' : ''} found. Review recommended.`;
    } else {
      summary = '✅ No major security issues detected.';
    }

    return {
      safetyScore: this.safetyScore,
      threatLevel: this.threatLevel,
      rating,
      emoji,
      criticalIssues: this.criticalIssues,
      warningIssues: this.warningIssues,
      infoIssues: this.infoIssues,
      totalFindings,
      malwareDetected: this.malwareDetected,
      summary,
      findings: this.findings
    };
  }
}

export default EnhancedSkillScanner;
