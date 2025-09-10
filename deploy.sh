#!/bin/bash

# Deploy Frontend Mastery Hub to GitHub Pages
echo "🚀 Deploying Frontend Mastery Hub to GitHub Pages..."

# Create or update gh-pages branch
git checkout --orphan gh-pages
git rm -rf .

# Copy all files except .git and .github
find . -maxdepth 1 -not -name '.git' -not -name '.github' -not -name '.' -exec cp -r {} . \;

# Add all files
git add .
git commit -m "Deploy Frontend Mastery Hub to GitHub Pages"

# Push to gh-pages branch
git push origin gh-pages --force

echo "✅ Deployment complete! Site should be available at:"
echo "   https://thiennp.github.io/frontend-mastery-hub/"
