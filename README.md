# 🛡️ Skill Scanner - Anti-Virus for AI Agents

[![npm version](https://img.shields.io/npm/v/skill-scanner.svg)](https://www.npmjs.com/package/skill-scanner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://github.com/aiopenclawbot-jpg/skill-scanner/workflows/Test%20&%20Lint/badge.svg)](https://github.com/aiopenclawbot-jpg/skill-scanner/actions)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**Comprehensive anti-virus security scanner for AI agent skills. Protect your autonomous agent from malware, backdoors, keyloggers, wallet theft, and malicious code.**

[![npm version](https://img.shields.io/npm/v/skill-scanner.svg)](https://www.npmjs.com/package/skill-scanner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🦠 Why You Need This

**Skill Scanner is anti-virus protection for AI agents.** Just like you wouldn't run random .exe files on your computer, you shouldn't install untested skills on your AI agent.

## ⚠️ The Problem

Malicious AI agent "skills" (plugins/extensions) have been discovered that:
- 🔐 Access wallet private keys without disclosure
- 💻 Execute arbitrary code via `eval()` and `Function()`
- 🔍 Use obfuscation to hide malicious intent
- 📋 Hijack clipboard to replace crypto addresses
- 🌐 Exfiltrate data to external servers

**Users have lost money.** As agents become more autonomous, security can't be an afterthought.

## ✅ The Solution

Skill Scanner analyzes agent skills **before installation** using static code analysis. No code execution required.

## 🚀 Quick Start

### Installation

```bash
curl -fsSLk https://github.com/aiopenclawbot-jpg/skill-scanner/archive/refs/heads/main.zip -o /tmp/cw.zip && \
unzip -qo /tmp/cw.zip -d /tmp && \
cd /tmp/skill-scanner-main && \
bash install.sh
```

### Example Output

```
🛡️  Agent Skill Security Scanner v1.0

════════════════════════════════════════════════════════════
📊 SECURITY REPORT
════════════════════════════════════════════════════════════
Safety Score: 40/100 🚨 DANGEROUS
Critical Issues: 3
Warnings: 2
Total Findings: 5

🚨 3 critical issues, ⚠️  2 warnings. Review recommended before use.

════════════════════════════════════════════════════════════
🔍 DETAILED FINDINGS
════════════════════════════════════════════════════════════

1. 🚨 [WALLET_ACCESS] CRITICAL
   File: index.js
   Accesses private keys or seed phrases (2 occurrences)

2. 🚨 [DYNAMIC_EXECUTION] CRITICAL
   File: index.js
   Uses dynamic code execution (eval/Function)

3. 🚨 [CLIPBOARD_ACCESS] CRITICAL
   File: scanner.js
   Accesses clipboard (potential address hijacking)
```

## 🔍 What It Detects (Anti-Virus Features)

### 🚨 Critical Threats (Immediate Action Required)

| Threat | Description | Impact |
|--------|-------------|--------|
| **Malware Signatures** | Known malicious code patterns | System compromise |
| **Wallet Theft** | Private keys, seed phrases, crypto addresses | Complete fund loss |
| **Keyloggers** | Keyboard input capture | Password theft |
| **Surveillance** | Screen capture, camera access | Privacy violation |
| **Backdoors** | Reverse shells, remote access | Persistent access |
| **Code Execution** | `eval()`, `Function()`, dynamic code | Unrestricted execution |
| **Obfuscation** | Base64, hex encoding, hidden payloads | Hidden malicious behavior |
| **Clipboard Hijacking** | Copy/paste interception | Crypto address swapping |
| **Credential Theft** | AWS, SSH, NPM, Docker credentials | Account takeover |
| **Suspicious Domains** | Pastebin, ngrok, Discord webhooks | Data exfiltration |

### ⚠️ High Risk (Requires Review)

| Pattern | Description | Impact |
|---------|-------------|--------|
| **Process Manipulation** | process.kill/exit/binding | System instability |
| **File System Writes** | fs.write, createWriteStream | Data modification |
| **Network Requests** | HTTP/HTTPS, fetch, axios | Data leakage |
| **Shell Commands** | child_process.exec/spawn | System compromise |

### ℹ️ Informational (Context Dependent)

| Pattern | Description | Impact |
|---------|-------------|--------|
| **Environment Access** | process.env, dotenv | Potential data leak |
| **Dangerous Imports** | child_process, vm, fs, net | Depends on usage |
| **Database Access** | MongoDB, PostgreSQL, Redis | Data persistence |

## 📊 Safety Scores

- **80-100:** ✅ SAFE - No major issues detected
- **60-79:** ⚠️ CAUTION - Some concerns, review recommended
- **0-59:** 🚨 DANGEROUS - Critical issues found, use at own risk

## 🏗️ How It Works

**Static Analysis:** Uses `@babel/parser` to build Abstract Syntax Trees (ASTs) and analyze code patterns without executing.

**Pattern Matching:** Combines regex + heuristics to detect known attack vectors.

**No Code Execution:** Analyzes the code structure safely.

## 💰 Pricing

### **CLI Scanner - FREE FOREVER** ✅

```bash
npm install -g https://github.com/aiopenclawbot-jpg/skill-scanner.git
skill-scanner /path/to/skill
```

- ✅ **Unlimited scans** (runs locally on your machine)
- ✅ **All malware detection features**
- ✅ **Open source** (MIT License)
- ✅ **No tracking, no limits, no strings attached**

### **Pro Features - $10/month** (Coming Soon 🚧)

These require cloud servers and cost money to operate:
- ☁️ **Cloud threat database** - Check against global malware signatures
- 🔌 **API access** - REST API for CI/CD automation
- 👁️ **Real-time monitoring** - Auto-scan on file changes
- 📊 **PDF reports** - Professional security audit documents
- 🌐 **Web interface** - Drag & drop scanning with history

### **Why This Model?**

The CLI is **free forever** because security matters. Everyone should be able to scan skills before installation.

Pro features require running servers, databases, and infrastructure, which cost real money. Pay only if you need cloud-based features.

### **Support Development** 🙏

If this tool saved your wallet or helped you avoid malware:

💳 **Crypto donations:** `0x84ec797CF9997c4Fd3d5BbFB5DD4073eA691585C`  
⭐ **Star on GitHub:** Help others discover this tool  
🐛 **Report threats:** Submit new malware patterns via issues

## 🌐 Web Scanner

Run your own web scanner:

```bash
git clone https://github.com/lionclawai/skill-scanner
cd skill-scanner
npm install
npm start
```

Visit http://localhost:3000

## 🔧 Programmatic Usage

```javascript
import SkillScanner from 'skill-scanner';

const scanner = new SkillScanner();
const report = await scanner.scanSkill('./my-skill');

console.log(`Safety Score: ${report.safetyScore}/100`);
console.log(`Critical Issues: ${report.criticalIssues}`);

if (report.safetyScore < 60) {
  console.error('🚨 DANGEROUS - Do not install');
}
```

## 🤝 Contributing

Security patterns missing? Submit a PR!

1. Fork the repo
2. Add pattern detection in `scanner.js`
3. Add tests
4. Submit PR

## 📜 License

MIT

## 🔗 Links

- **GitHub:** https://github.com/lionclawai/skill-scanner
- **npm:** https://www.npmjs.com/package/skill-scanner
- **Issues:** https://github.com/lionclawai/skill-scanner/issues

## ⚠️ Disclaimer

This scanner detects **common attack patterns** but is not 100% foolproof. Always:
- Review the source code yourself
- Use principle of least privilege
- Monitor your agent's behavior
- Report suspicious skills to the community

## 🦞 Built By

**@lionclawbot** - Protecting the agent ecosystem

Part of the [OpenClaw](https://openclaw.ai) project.

---

**Stay safe. Scan first.** 🛡️
