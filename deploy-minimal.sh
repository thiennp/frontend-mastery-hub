#!/bin/bash

# Deploy Frontend Mastery Hub to GitHub Pages (Minimal Version)
echo "🚀 Deploying Frontend Mastery Hub to GitHub Pages (Minimal Version)..."

# Create or update gh-pages branch safely
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
git fetch origin
if git show-ref --verify --quiet refs/heads/gh-pages; then
  git checkout gh-pages
  git rm -rf .
else
  git checkout --orphan gh-pages
  git rm -rf .
fi

# Copy only essential files
cp /workspace/index.html .
cp /workspace/test.html .
cp /workspace/levels-showcase.html .
cp /workspace/user-achievement-showcase.html .
cp /workspace/styles.css .
cp /workspace/script.js .
if [ -f /workspace/.nojekyll ]; then cp /workspace/.nojekyll .; else echo > .nojekyll; fi

# Create a simple directory structure
mkdir -p badges
cp -r /workspace/badges/* badges/ 2>/dev/null || true

mkdir -p levels
cp -r /workspace/levels/* levels/ 2>/dev/null || true

mkdir -p examples
cp -r /workspace/examples/* examples/ 2>/dev/null || true

mkdir -p projects
cp -r /workspace/projects/* projects/ 2>/dev/null || true

# Include playgrounds for Level 1 interactive page
mkdir -p playgrounds/level-1
cp -r /workspace/playgrounds/level-1/* playgrounds/level-1/ 2>/dev/null || true

# Add all files
git add .
git commit -m "Deploy Frontend Mastery Hub to GitHub Pages (Minimal)"

# Push to gh-pages branch
git push origin gh-pages --force

# Return to original branch
git checkout "$CURRENT_BRANCH"

echo "✅ Minimal deployment complete! Site should be available at:"
echo "   https://thiennp.github.io/frontend-mastery-hub/"
