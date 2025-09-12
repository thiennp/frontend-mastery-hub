#!/bin/bash

# Deploy Frontend Mastery Hub to GitHub Pages (Complete Version)
echo "🚀 Deploying Frontend Mastery Hub to GitHub Pages (Complete Version)..."

# Ensure we're on gh-pages branch
git checkout gh-pages

# Add all files including playgrounds
git add .

# Commit all changes
git commit -m "Deploy complete Frontend Mastery Hub with all levels and playgrounds

- 10 completed levels with 50+ interactive exercises
- 8 badges and comprehensive progress tracking
- All playgrounds with live code editors
- Responsive design and modern UI
- Real-time preview and validation

Progress: 10/200 levels complete (5%)"

# Push to gh-pages branch
git push origin gh-pages

echo "✅ Complete deployment successful!"
echo "🌐 Site is available at: https://thiennp.github.io/frontend-mastery-hub/"
echo "📊 Current progress: 11/200 levels complete (5.5%)"
echo "🎯 Next: Level 12 - TypeScript Advanced"
