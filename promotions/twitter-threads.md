# Twitter/X Promotion Threads

## Thread 1: Security Alert (Fear-based)

🚨 SECURITY ALERT for AI agent developers

Malicious agent "skills" have been caught stealing user wallets.

Here's what happened and how to protect yourself 🧵

---

Recently discovered: agent skills that accessed private keys and exfiltrated funds without disclosure.

Users installed them thinking they were legit tools. They weren't.

---

These malicious skills used:
• Obfuscated code (base64/hex) to hide intent
• Clipboard hijacking to replace wallet addresses  
• Unauthorized API calls to exfiltrate data
• File system access to read sensitive info

---

As agents become more autonomous, security can't be an afterthought.

We're giving agents MORE access, which means MORE attack surface.

---

Solution: I built a free security scanner

npm install -g skill-scanner
skill-scanner /path/to/skill

Detects wallet access, code execution, obfuscation, clipboard hijacking, and more.

---

Example output:

🛡️ Safety Score: 40/100 🚨 DANGEROUS
Critical Issues: 3

🚨 [WALLET_ACCESS] CRITICAL
🚨 [DYNAMIC_EXECUTION] CRITICAL  
🚨 [CLIPBOARD_ACCESS] CRITICAL

Review before installing.

---

The scanner is open-source and free.

Web interface available at skillscan.ai (coming soon)

CLI: npm install -g skill-scanner

Stay safe out there. 🛡️

---

## Thread 2: Product Launch

I built Skill Scanner 🛡️

A security tool for AI agent skills/plugins

Think: virus scanner, but for agent extensions

Here's why this matters 🧵

---

AI agents are getting more autonomous.

They can:
• Run shell commands
• Access files
• Make API calls
• Control your browser
• Read your clipboard

That's powerful. But also dangerous if malicious.

---

"Skills" (plugins/extensions) extend agent capabilities.

Problem: Anyone can publish a skill. No vetting process.

Some skills are malicious. They compromise wallets, steal data, etc.

---

Skill Scanner detects these patterns BEFORE installation:

✅ Wallet access
✅ Code execution (eval)
✅ Obfuscation
✅ Clipboard hijacking
✅ Data exfiltration

Static analysis. No code execution needed.

---

How to use:

npm install -g skill-scanner
skill-scanner /path/to/skill

Get instant safety report in <30 seconds.

---

Pricing:
• CLI: Free forever
• Web: 3 free scans/month
• Pro: $10/mo unlimited

💳 Crypto payments accepted (ETH/USDC/USDT)

---

Why I built this:

Security should be default in the agent ecosystem.

If we want mainstream adoption, we need trust.

Can't trust blindly. Need tools to verify.

---

Try it out: npm install -g skill-scanner

Open-source. Contributions welcome.

Let's make the agent ecosystem safe. 🛡️

---

## Thread 3: Problem + Solution (Educational)

You know what nobody talks about?

Security in the AI agent ecosystem.

Everyone's building autonomous agents. Nobody's thinking about attack vectors.

Here's what's coming (and how to prepare) 🧵

---

AI agents have access to:
• Your files
• Your terminal
• Your browser
• Your API keys
• Your clipboard
• Your calendar

That's a LOT of access.

---

Current security model: "Just trust the code"

Reality: Most people don't read the source.

Even if you do, malicious code is often obfuscated.

---

Attack vectors I've seen:

1. Wallet compromise (private key access)
2. Clipboard hijacking (address replacement)
3. Data exfiltration (API calls to attacker servers)
4. File system abuse (reading .env, .aws, .ssh)

---

Real example:

A "productivity skill" that accessed your clipboard and replaced crypto addresses.

You copy a wallet address → paste it → money goes to attacker.

Silent. Devastating.

---

Solution: Security scanning BEFORE installation

I built Skill Scanner to detect these patterns:

npm install -g skill-scanner
skill-scanner /path/to/skill

Free. Open-source. Takes 30 seconds.

---

What it checks:
• Code execution (eval, Function)
• Wallet access patterns
• Obfuscation techniques
• API calls to unknown servers
• File system abuse
• Clipboard access

---

This isn't perfect security. It's a defense layer.

Still do your own code review.
Still use principle of least privilege.
Still monitor your agent's behavior.

But this catches the obvious stuff.

---

The agent ecosystem needs better security tooling.

As we give agents more autonomy, we need better guardrails.

This is step 1.

Try it: npm install -g skill-scanner

---

## Short Posts (Twitter)

### Post 1
🚨 Malicious AI agent skills are stealing wallets

Scan before you install:
npm install -g skill-scanner

Free, open-source, takes 30 seconds

Don't lose your crypto. 🛡️

### Post 2
Built a security scanner for AI agent skills

Detects wallet access, code execution, obfuscation, etc.

npm install -g skill-scanner

Because security > convenience

### Post 3
PSA: Not all AI agent "skills" are safe

Some access your wallet without telling you
Some hijack your clipboard
Some exfiltrate data

Scan first: npm install -g skill-scanner

### Post 4
You wouldn't download a random exe

Why download random AI agent skills?

Scan them first: npm install -g skill-scanner

Free security scanner. <30 sec reports.

### Post 5
AI agents have terminal access
They can run any command
They can read any file

Malicious skills exploit this

Scan before installing: npm install -g skill-scanner

Stay safe 🛡️
