# Changelog

All notable changes to Skill Scanner will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-26

### Added - Initial Release 🎉

#### Core Features
- **Comprehensive anti-virus scanning** for AI agent skills
- **Malware signature detection** (known malicious patterns)
- **10+ critical threat categories:**
  - Wallet & crypto theft detection
  - Keylogger detection
  - Backdoor & remote access detection
  - Surveillance & spyware detection
  - Clipboard hijacking detection
  - Credential theft detection
  - Code obfuscation detection
  - Suspicious domain blacklist
  - Dynamic code execution detection
  - Process manipulation detection

#### Analysis Capabilities
- **JavaScript AST analysis** using @babel/parser
- **Shell script security analysis** (bash, sh)
- **Pattern-based detection** (regex)
- **Recursive directory scanning**
- **Multi-file correlation**

#### Threat Classification
- **5-level threat system:** SAFE, LOW, MEDIUM, HIGH, SEVERE
- **Safety scoring** (0-100 scale)
- **Malware detection flag**
- **Detailed findings report**

#### CLI Features
- **Simple scanning:** `skill-scanner /path/to/skill`
- **JSON output:** `--json` flag for automation
- **Quiet mode:** `--quiet` for scripts
- **Exit codes:** 0=safe, 1=warnings, 2=critical, 3=malware

#### Payment System
- **Crypto payment support** (ETH, USDC, USDT)
- **Multi-chain:** Ethereum, Polygon, Base, Arbitrum, Optimism
- **Automatic payment detection** (5-minute polling)
- **Auto-subscription activation**
- **Treasury:** 0x84ec797CF9997c4Fd3d5BbFB5DD4073eA691585C

#### Pricing Tiers
- **Free:** 3 scans/month
- **Pro:** $10/month unlimited scans + advanced features
- **Per-scan:** $2 one-time scan

#### Documentation
- Comprehensive README with examples
- Security features documentation (SECURITY_FEATURES.md)
- Real-world usage examples (EXAMPLES.md)
- Revenue model documentation (REVENUE_MODEL.md)
- Contributing guidelines (CONTRIBUTING.md)
- Test suite with 15+ test cases

#### Detection Patterns
- 50+ malware patterns
- 20+ suspicious domains blacklisted
- Shell script dangerous command detection
- Obfuscation pattern recognition
- Credential file access detection

### Technical Details
- **Language:** JavaScript/Node.js (ES6+)
- **Dependencies:** @babel/parser, @babel/traverse, express
- **Architecture:** Local-first, privacy-focused
- **Open Source:** MIT License

### Supported File Types
- JavaScript (.js, .jsx)
- TypeScript (.ts, .tsx)
- Shell scripts (.sh, .bash)
- Python (.py)
- Markdown (.md)

---

## [Unreleased]

### Planned Features
- [ ] Real-time file monitoring (`--watch` mode)
- [ ] Cloud threat database (Pro feature)
- [ ] API access for automation (Pro feature)
- [ ] PDF report generation (Pro feature)
- [ ] Custom detection rules
- [ ] Historical scanning & comparison
- [ ] CI/CD integration templates
- [ ] Python analysis (beyond pattern matching)
- [ ] Machine learning threat detection
- [ ] Sandbox execution testing
- [ ] Browser extension
- [ ] VS Code plugin
- [ ] Discord bot integration
- [ ] Community threat sharing
- [ ] Automated quarantine

### Future Improvements
- [ ] Reduce false positive rate
- [ ] Faster scanning performance
- [ ] Better error messages
- [ ] Improved CLI UX
- [ ] More comprehensive tests
- [ ] Detailed remediation guides
- [ ] Compliance reporting (OWASP, CWE, etc.)

---

## Version History

### Pre-release Development
- **2026-02-26:** Initial development and testing
- **2026-02-26:** First public release (v1.0.0)

---

## Release Notes

### v1.0.0 - "Guardian Launch" 🛡️

**Release Date:** February 26, 2026

This is the first public release of Skill Scanner, the anti-virus solution for AI agents. After extensive testing and development, we're proud to release a comprehensive security scanner that protects autonomous agents from malicious skills and plugins.

**Highlights:**
- Detects 10+ categories of critical threats
- 50+ malware patterns in signature database
- Automatic crypto payment system (no credit cards!)
- Privacy-first local scanning
- Freemium model (free tier always available)
- Open source under MIT license

**Why This Matters:**
AI agents are increasingly powerful and have access to sensitive data, crypto wallets, and system resources. Malicious skills can steal funds, harvest credentials, install backdoors, and compromise privacy. Skill Scanner provides the first line of defense.

**What's Next:**
We're working on real-time monitoring, cloud threat intelligence, and API access for Pro users. Community contributions are welcome!

**Get Started:**
```bash
npm install -g skill-scanner
skill-scanner /path/to/skill
```

**Feedback:**
- GitHub Issues: https://github.com/aiopenclawbot-jpg/skill-scanner/issues
- Discussions: https://github.com/aiopenclawbot-jpg/skill-scanner/discussions
- Email: feedback@skillscanner.io

---

**Stay safe. Scan first.** 🛡️
