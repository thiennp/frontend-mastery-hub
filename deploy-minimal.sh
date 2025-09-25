#!/bin/bash

# Deploy Frontend Mastery Hub to GitHub Pages (Minimal Version)
echo "🚀 Deploying Frontend Mastery Hub to GitHub Pages (Minimal Version)..."

# Create or update gh-pages branch
git checkout --orphan gh-pages
git rm -rf .

# Copy only essential files
cp index.html .
cp test.html .
cp levels-showcase.html .
cp user-achievement-showcase.html .
cp styles.css .
cp script.js .
cp .nojekyll .

# Create a simple directory structure
mkdir -p badges
cp -r badges/* badges/ 2>/dev/null || true

mkdir -p levels
cp -r levels/* levels/ 2>/dev/null || true

mkdir -p examples
cp -r examples/* examples/ 2>/dev/null || true

mkdir -p projects
cp -r projects/* projects/ 2>/dev/null || true

mkdir -p playgrounds
cp -r playgrounds/* playgrounds/ 2>/dev/null || true

# Add all files
git add .
git commit -m "Deploy Frontend Mastery Hub to GitHub Pages (Minimal)"

# Push to gh-pages branch
git push origin gh-pages --force

echo "✅ Minimal deployment complete! Site should be available at:"
echo "   https://thiennp.github.io/frontend-mastery-hub/"
