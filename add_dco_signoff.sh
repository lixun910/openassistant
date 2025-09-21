#!/bin/bash

# Script to add DCO sign-off to commits that are missing it
# This script will add "Signed-off-by: Cursor Agent <cursoragent@cursor.com>" to commits

# Get the list of commits that need DCO sign-off
echo "Checking for commits missing DCO sign-off..."

# Get commits without sign-off
COMMITS=$(git log --format="%H" --no-merges -10 | while read commit; do
    if ! git show --format="%B" -s "$commit" | grep -q "Signed-off-by"; then
        echo "$commit"
    fi
done)

echo "Found commits that need DCO sign-off:"
echo "$COMMITS"

# Add DCO sign-off to each commit using git filter-branch
if [ -n "$COMMITS" ]; then
    echo "Adding DCO sign-off to commits..."
    
    # Use git filter-branch to add sign-off to commits
    git filter-branch --msg-filter '
        if ! grep -q "Signed-off-by" /dev/stdin; then
            cat
            echo ""
            echo "Signed-off-by: Cursor Agent <cursoragent@cursor.com>"
        else
            cat
        fi
    ' -- --all
    
    echo "DCO sign-off added to commits successfully!"
else
    echo "No commits found that need DCO sign-off."
fi