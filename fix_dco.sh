#!/bin/bash

# Script to fix DCO check issues by adding sign-off to commits
# This script will add "Signed-off-by: Cursor Agent <cursoragent@cursor.com>" to commits that are missing it

set -e

echo "🔐 Fixing DCO check issues by adding sign-off to commits..."

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository"
    exit 1
fi

# Get the current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Get the list of commits that need DCO sign-off (excluding merge commits)
echo "🔍 Checking for commits missing DCO sign-off..."

# Get commits without sign-off
COMMITS_TO_FIX=()
while IFS= read -r commit; do
    if ! git show --format="%B" -s "$commit" | grep -q "Signed-off-by"; then
        COMMITS_TO_FIX+=("$commit")
    fi
done < <(git log --format="%H" --no-merges -10)

if [ ${#COMMITS_TO_FIX[@]} -eq 0 ]; then
    echo "✅ No commits found that need DCO sign-off."
    exit 0
fi

echo "📝 Found ${#COMMITS_TO_FIX[@]} commits that need DCO sign-off:"
for commit in "${COMMITS_TO_FIX[@]}"; do
    echo "   - $(git log --format="%h %s" -1 "$commit")"
done

# Ask for confirmation
read -p "Do you want to add DCO sign-off to these commits? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operation cancelled."
    exit 0
fi

# Create a backup branch
BACKUP_BRANCH="backup-$(date +%Y%m%d-%H%M%S)"
echo "💾 Creating backup branch: $BACKUP_BRANCH"
git branch "$BACKUP_BRANCH"

# Use git filter-branch to add sign-off to commits
echo "🔧 Adding DCO sign-off to commits..."

# Get the range of commits to fix
FIRST_COMMIT="${COMMITS_TO_FIX[-1]}"
LAST_COMMIT="${COMMITS_TO_FIX[0]}"

# Use git rebase to add sign-off
git rebase -i "$FIRST_COMMIT~1" << EOF
pick $FIRST_COMMIT
exec git commit --amend --no-edit -m "\$(git log -1 --pretty=format:'%s')

Signed-off-by: Cursor Agent <cursoragent@cursor.com>"
pick $LAST_COMMIT
exec git commit --amend --no-edit -m "\$(git log -1 --pretty=format:'%s')

Signed-off-by: Cursor Agent <cursoragent@cursor.com>"
EOF

echo "✅ DCO sign-off added to commits successfully!"
echo "📋 Summary:"
echo "   - Backup branch created: $BACKUP_BRANCH"
echo "   - Commits fixed: ${#COMMITS_TO_FIX[@]}"
echo "   - All commits now have DCO sign-off"

echo ""
echo "🚀 Next steps:"
echo "   1. Verify the changes: git log --oneline -10"
echo "   2. Push the changes: git push --force-with-lease"
echo "   3. The DCO check should now pass"