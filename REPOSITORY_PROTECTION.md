# Repository Protection Setup

This repository has been configured to prevent commits from unauthorized email addresses. This protection is **repository-specific only** and does not affect your global git configuration.

## 🔒 Protection Features

### 1. Pre-commit Hook
- **Location**: `.git/hooks/pre-commit`
- **Purpose**: Validates the author email before allowing commits
- **Scope**: Repository-specific only

### 2. Commit-msg Hook
- **Location**: `.git/hooks/commit-msg`
- **Purpose**: Additional validation layer for commit author information
- **Scope**: Repository-specific only

### 3. Author Configuration
- **Location**: `.git-authors`
- **Purpose**: Documents allowed email addresses for this repository

## ✅ Allowed Email Addresses

The following email addresses are authorized to commit to this repository:

- `nguyenphongthien@gmail.com` (Primary)
- `thien.nguyen@check24.de` (Legacy)

## 🛠️ How It Works

1. **Before each commit**: The pre-commit hook checks your configured email address
2. **During commit**: The commit-msg hook validates the author information
3. **If unauthorized**: The commit is rejected with clear error messages

## 📋 Usage Instructions

### For Repository Owner
The protection is already active. No additional setup required.

### For Contributors
1. **Set your email** to one of the allowed addresses:
   ```bash
   git config user.email "nguyenphongthien@gmail.com"
   ```

2. **Verify your configuration**:
   ```bash
   ./scripts/check-author.sh
   ```

3. **Make commits normally** - the protection will work automatically

### Checking Protection Status
Run the included script to check your configuration:
```bash
./scripts/check-author.sh
```

## 🔧 Management Commands

### Add New Author
To add a new authorized email address:

1. Edit `.git/hooks/pre-commit` and add the email to the `ALLOWED_EMAILS` array
2. Edit `.git/hooks/commit-msg` and add the email to the `ALLOWED_EMAILS` array
3. Edit `.git-authors` and add the email to the `ALLOWED_AUTHORS` array

### Remove Author
To remove an authorized email address:

1. Edit `.git/hooks/pre-commit` and remove the email from the `ALLOWED_EMAILS` array
2. Edit `.git/hooks/commit-msg` and remove the email from the `ALLOWED_EMAILS` array
3. Edit `.git-authors` and remove the email from the `ALLOWED_AUTHORS` array

### Disable Protection (Temporarily)
To temporarily disable protection:
```bash
mv .git/hooks/pre-commit .git/hooks/pre-commit.disabled
mv .git/hooks/commit-msg .git/hooks/commit-msg.disabled
```

To re-enable protection:
```bash
mv .git/hooks/pre-commit.disabled .git/hooks/pre-commit
mv .git/hooks/commit-msg.disabled .git/hooks/commit-msg
```

## 🚨 Error Messages

If you try to commit with an unauthorized email, you'll see:

```
❌ COMMIT REJECTED: Unauthorized email address

Current author email: unauthorized@example.com
Allowed emails for this repository:
  - nguyenphongthien@gmail.com
  - thien.nguyen@check24.de

To fix this, run one of the following commands:
  git config user.email 'nguyenphongthien@gmail.com'
  git config user.email 'thien.nguyen@check24.de'
```

## 📝 Notes

- This protection is **repository-specific** and does not affect other repositories
- The hooks are stored in `.git/hooks/` and are not tracked by git
- Contributors need to set their email address to one of the allowed addresses
- The protection works for both regular commits and merge commits
- This setup is compatible with GitHub, GitLab, and other git hosting services

## 🔄 GitHub Integration

For additional protection, consider enabling these GitHub repository settings:

1. **Branch Protection Rules**:
   - Go to Settings → Branches
   - Add rule for `main` and `gh-pages` branches
   - Enable "Restrict pushes that create files"

2. **Required Status Checks**:
   - Enable status checks for pull requests
   - Require branches to be up to date before merging

3. **Collaborator Restrictions**:
   - Manage repository access in Settings → Manage access
   - Only add trusted collaborators
