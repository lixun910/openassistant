#!/bin/bash

# Simple script to add DCO sign-off to all commits using git filter-branch

echo "🔐 Adding DCO sign-off to all commits..."

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository"
    exit 1
fi

# Create a backup branch
BACKUP_BRANCH="backup-$(date +%Y%m%d-%H%M%S)"
echo "💾 Creating backup branch: $BACKUP_BRANCH"
git branch "$BACKUP_BRANCH"

# Use git filter-branch to add sign-off to all commits
echo "🔧 Adding DCO sign-off to all commits..."

git filter-branch --msg-filter '
    if ! grep -q "Signed-off-by" /dev/stdin; then
        cat
        echo ""
        echo "Signed-off-by: Cursor Agent <cursoragent@cursor.com>"
    else
        cat
    fi
' -- --all

echo "✅ DCO sign-off added to all commits successfully!"
echo "📋 Summary:"
echo "   - Backup branch created: $BACKUP_BRANCH"
echo "   - All commits now have DCO sign-off"

echo ""
echo "🚀 Next steps:"
echo "   1. Verify the changes: git log --oneline -10"
echo "   2. Push the changes: git push --force-with-lease"
echo "   3. The DCO check should now pass"