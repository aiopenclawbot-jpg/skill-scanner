#!/bin/bash

echo "🚀 Publishing Skill Scanner to GitHub & npm"
echo ""

# Check if GitHub username is set
read -p "Enter your GitHub username (e.g., lionclawai): " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "❌ GitHub username required"
    exit 1
fi

echo ""
echo "📍 Step 1: Pushing to GitHub..."

# Update package.json with correct GitHub URL
sed -i '' "s|github.com/lionclawai|github.com/$GITHUB_USER|g" package.json

# Add remote if not exists
git remote remove origin 2>/dev/null
git remote add origin https://github.com/$GITHUB_USER/skill-scanner.git

# Commit and push
git add .
git commit -m "Update GitHub URLs" || true
git push -u origin main

echo "✅ Pushed to GitHub!"
echo ""

# Check if npm is logged in
echo "📦 Step 2: Publishing to npm..."
echo "Make sure you're logged in to npm (npm login)"
echo ""

read -p "Have you logged in to npm? (y/n): " NPM_LOGIN

if [ "$NPM_LOGIN" != "y" ]; then
    echo "Run: npm login"
    echo "Then run this script again"
    exit 0
fi

# Publish to npm
npm publish

echo ""
echo "✅ Published to npm!"
echo ""
echo "🎉 Done! Your package is live:"
echo "   GitHub: https://github.com/$GITHUB_USER/skill-scanner"
echo "   npm: https://www.npmjs.com/package/skill-scanner"
echo ""
echo "📝 Next steps:"
echo "   1. Test: npm install -g skill-scanner"
echo "   2. Follow POST_NOW.md to start marketing"
echo ""
