# Contributing to Skill Scanner

Thank you for your interest in contributing to Skill Scanner! This project aims to protect AI agents from malicious code, and your help is appreciated.

## Code of Conduct

This project adheres to a code of conduct adapted from the Contributor Covenant. By participating, you are expected to uphold this code.

### Our Standards

- Be respectful and inclusive
- Focus on what is best for the community
- Show empathy towards other contributors
- Accept constructive criticism gracefully

## How to Contribute

### Reporting Security Issues

**DO NOT** create public issues for security vulnerabilities. Instead:
- Email: security@skillscanner.io (or create a private security advisory on GitHub)
- Include: Detailed description, proof of concept, impact assessment

### Reporting Bugs

Before creating a bug report:
1. Check existing issues to avoid duplicates
2. Update to the latest version and verify the bug persists
3. Collect relevant information (OS, Node.js version, error messages)

Create an issue with:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs if applicable

### Suggesting Features

Feature requests are welcome! Please:
1. Check if it's already been requested
2. Explain the use case clearly
3. Describe the expected behavior
4. Consider implementation complexity

### Adding New Threat Patterns

We welcome contributions of new malware/threat detection patterns!

**To add a pattern:**

1. Fork the repository
2. Edit `scanner.js` → `scanPatterns()` method
3. Add your pattern:

```javascript
{
  severity: 'critical',  // or 'warning' or 'info'
  code: 'YOUR_THREAT_CODE',
  patterns: [
    /your-regex-pattern/gi,
    /another-pattern/gi
  ],
  message: 'Clear description of what this detects'
}
```

4. Add tests in `test/scanner.test.js`:

```javascript
it('should detect [your threat]', async () => {
  const maliciousCode = `
    // example malicious code
  `;
  
  fs.writeFileSync('/tmp/test.js', maliciousCode);
  const result = await scanner.scanSkill('/tmp/test.js');
  
  expect(result.findings.some(f => f.code === 'YOUR_THREAT_CODE')).toBe(true);
  
  fs.unlinkSync('/tmp/test.js');
});
```

5. Submit a pull request with:
   - Description of the threat
   - Real-world example (if safe to share)
   - References (CVE, security advisories, etc.)

### Code Style

- Use ES6+ JavaScript
- Follow existing code formatting
- Add comments for complex logic
- Keep functions focused and small
- Use descriptive variable names

### Testing

Run tests before submitting:

```bash
npm test
```

All tests must pass. Add new tests for new features.

### Pull Request Process

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** with clear, atomic commits
4. **Add tests** for new functionality
5. **Update documentation** if needed
6. **Run tests** and ensure they pass
7. **Submit pull request** with:
   - Clear description of changes
   - Link to related issue (if any)
   - Screenshots/examples for UI changes

### Commit Message Guidelines

Use clear, descriptive commit messages:

```
feat: add detection for [threat type]
fix: correct false positive in [pattern]
docs: update README with [new info]
test: add tests for [feature]
refactor: improve [component]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `test`: Adding or updating tests
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `chore`: Maintenance tasks

## Development Setup

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm 8+
- Git

### Local Setup

1. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/skill-scanner.git
   cd skill-scanner
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Link for local testing:**
   ```bash
   npm link
   ```

4. **Test the CLI:**
   ```bash
   skill-scanner test/fixtures/malicious.js
   ```

5. **Run tests:**
   ```bash
   npm test
   ```

6. **Run linter:**
   ```bash
   npm run lint
   ```

### Project Structure

```
skill-scanner/
├── scanner.js           # Core scanning logic
├── server.js           # Payment detection server
├── crypto-payments.js  # Crypto payment handling
├── blockchain-monitor.js # Blockchain monitoring
├── cli.js              # CLI interface
├── test/               # Test files
│   └── scanner.test.js
├── docs/               # Documentation
├── README.md           # Main documentation
├── EXAMPLES.md         # Usage examples
├── SECURITY_FEATURES.md # Threat detection details
└── REVENUE_MODEL.md    # Business model docs
```

## Types of Contributions Needed

### High Priority
- [ ] New malware signatures
- [ ] Better AST analysis patterns
- [ ] Performance improvements
- [ ] False positive reduction
- [ ] Documentation improvements

### Medium Priority
- [ ] Additional language support (Python, Ruby, etc.)
- [ ] Better CLI UX
- [ ] More comprehensive tests
- [ ] CI/CD pipeline improvements

### Nice to Have
- [ ] GUI interface
- [ ] Browser extension
- [ ] IDE plugins (VS Code, etc.)
- [ ] Machine learning threat detection
- [ ] Sandbox execution testing

## Recognition

Contributors will be:
- Listed in README.md contributors section
- Mentioned in release notes
- Eligible for bounties (if applicable)
- Invited to contributor Discord channel

## Questions?

- **Documentation:** Check README.md and docs/
- **Bugs:** Create an issue
- **Feature ideas:** Create an issue with [Feature Request] tag
- **Security:** Email security@skillscanner.io
- **General:** Create a discussion on GitHub

---

**Thank you for helping make AI agents more secure!** 🛡️
