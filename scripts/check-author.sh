#!/bin/bash

# Script to check and validate git author configuration for this repository
# This script helps ensure only authorized authors can commit to this repository

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Allowed email addresses
ALLOWED_EMAILS=(
    "nguyenphongthien@gmail.com"
    "thien.nguyen@check24.de"
)

echo "🔍 Checking Git Author Configuration for this Repository"
echo "=================================================="

# Check current git configuration
CURRENT_EMAIL=$(git config user.email)
CURRENT_NAME=$(git config user.name)

echo "Current Git Configuration:"
echo "  Name:  $CURRENT_NAME"
echo "  Email: $CURRENT_EMAIL"
echo ""

# Check if current email is allowed
is_email_allowed() {
    local email="$1"
    for allowed_email in "${ALLOWED_EMAILS[@]}"; do
        if [ "$email" = "$allowed_email" ]; then
            return 0
        fi
    done
    return 1
}

if is_email_allowed "$CURRENT_EMAIL"; then
    echo -e "${GREEN}✅ Current email is authorized for this repository${NC}"
else
    echo -e "${RED}❌ Current email is NOT authorized for this repository${NC}"
    echo ""
    echo "Allowed email addresses:"
    for allowed_email in "${ALLOWED_EMAILS[@]}"; do
        echo "  - $allowed_email"
    done
    echo ""
    echo "To fix this, run:"
    echo -e "${YELLOW}  git config user.email 'nguyenphongthien@gmail.com'${NC}"
    echo ""
fi

# Check if hooks are installed
if [ -f ".git/hooks/pre-commit" ] && [ -x ".git/hooks/pre-commit" ]; then
    echo -e "${GREEN}✅ Pre-commit hook is installed and executable${NC}"
else
    echo -e "${YELLOW}⚠️  Pre-commit hook is not properly installed${NC}"
fi

if [ -f ".git/hooks/commit-msg" ] && [ -x ".git/hooks/commit-msg" ]; then
    echo -e "${GREEN}✅ Commit-msg hook is installed and executable${NC}"
else
    echo -e "${YELLOW}⚠️  Commit-msg hook is not properly installed${NC}"
fi

echo ""
echo "Repository Protection Status:"
echo "  - Pre-commit validation: $(if [ -f ".git/hooks/pre-commit" ] && [ -x ".git/hooks/pre-commit" ]; then echo "Active"; else echo "Inactive"; fi)"
echo "  - Commit-msg validation: $(if [ -f ".git/hooks/commit-msg" ] && [ -x ".git/hooks/commit-msg" ]; then echo "Active"; else echo "Inactive"; fi)"
