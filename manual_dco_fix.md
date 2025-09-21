# Manual DCO Fix Instructions

## Problem
The DCO (Developer Certificate of Origin) check is failing because commits are missing the required sign-off line.

## Solution
Add "Signed-off-by: Cursor Agent <cursoragent@cursor.com>" to all commits that are missing it.

## Commands to Run

### 1. Check current status
```bash
cd /workspace
git status
git log --oneline -10
```

### 2. Check which commits are missing DCO sign-off
```bash
git log --format="%H %s" --no-merges -10 | while read commit message; do
    if ! git show --format="%B" -s "$commit" | grep -q "Signed-off-by"; then
        echo "Missing DCO: $commit $message"
    fi
done
```

### 3. Add DCO sign-off to recent commits (Option A - Interactive Rebase)
```bash
# Start interactive rebase for the last 10 commits
git rebase -i HEAD~10

# In the editor, change 'pick' to 'edit' for commits that need DCO sign-off
# Then for each commit that needs fixing, run:
git commit --amend --no-edit -m "$(git log -1 --pretty=format:'%s')

Signed-off-by: Cursor Agent <cursoragent@cursor.com>"
git rebase --continue
```

### 4. Add DCO sign-off to all commits (Option B - Filter Branch)
```bash
# Create backup branch first
git branch backup-$(date +%Y%m%d-%H%M%S)

# Use filter-branch to add sign-off to all commits
git filter-branch --msg-filter '
    if ! grep -q "Signed-off-by" /dev/stdin; then
        cat
        echo ""
        echo "Signed-off-by: Cursor Agent <cursoragent@cursor.com>"
    else
        cat
    fi
' -- --all
```

### 5. Verify the fix
```bash
# Check that all commits now have DCO sign-off
git log --format="%H %s" --no-merges -10 | while read commit message; do
    if git show --format="%B" -s "$commit" | grep -q "Signed-off-by"; then
        echo "✅ Has DCO: $commit $message"
    else
        echo "❌ Missing DCO: $commit $message"
    fi
done
```

### 6. Push the changes
```bash
git push --force-with-lease
```

## Alternative: Use the provided scripts

### Option 1: Simple fix (recommended)
```bash
chmod +x /workspace/simple_dco_fix.sh
./simple_dco_fix.sh
```

### Option 2: Interactive fix
```bash
chmod +x /workspace/fix_dco.sh
./fix_dco.sh
```

## What the DCO sign-off means

The DCO sign-off line indicates that the contributor certifies that:
- The contribution was created by them or they have the right to submit it
- The contribution is based on previous work covered by an appropriate open source license
- They understand the contribution is public and may be redistributed

## Format
```
Signed-off-by: Cursor Agent <cursoragent@cursor.com>
```

This line should be added to the commit message, typically at the end, separated by a blank line.