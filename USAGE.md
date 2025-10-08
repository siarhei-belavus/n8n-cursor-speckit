# Usage Guide

## Complete Installation Walkthrough

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/n8n-cursor-speckit.git
cd n8n-cursor-speckit
```

### Step 2: Run the Installer

```bash
npm run install:n8n-sk
```

### Step 3: Interactive Prompts

The installer will guide you through:

#### Prompt 1: Target Directory
```
Enter target project directory path: 
```

**Examples:**
- Absolute path: `/Users/me/projects/my-n8n-project`
- Relative path: `../my-project`
- Home directory: `~/projects/my-workflows`

**What happens:**
- If directory doesn't exist, you'll be asked to create it
- Cannot be the same as the source directory

#### Prompt 2: Create Directory (if doesn't exist)
```
Target directory does not exist: /path/to/project
Create it? (y/n):
```

- Type `y` to create
- Type `n` to cancel

#### Prompt 3: Overwrite Files (for each existing file)
```
File exists: /path/to/project/.cursor/commands/n8n.specify.md
  Overwrite? (y/n/a=all):
```

**Options:**
- `y` or `yes` - Overwrite this file
- `n` or `no` - Skip this file
- `a` or `all` - Overwrite all remaining files without asking

#### Prompt 4: Optional Documentation
```
Install Documentation? (y/n):
```

- `y` - Installs README as `n8n-speckit-README.md`
- `n` - Skips documentation

### Step 4: Installation Complete

You'll see a summary:
```
════════════════════════════════════════════════════════════
Installation Summary:
  ✓ Copied:  18 file(s)
  ⊘ Skipped: 0 file(s)
  ✗ Failed:  0 file(s)
════════════════════════════════════════════════════════════

✨ Installation complete!

📖 What was installed:
   • Cursor commands in: /path/to/project/.cursor/commands/
   • Speckit framework in: /path/to/project/.specify/

🚀 Next steps:
   1. cd /path/to/project
   2. Open directory in Cursor: cursor .
   3. Type /n8n.specify to start building workflows
```

## Usage Scenarios

### Scenario 1: Fresh Installation

```bash
# Clone and install
git clone https://github.com/yourusername/n8n-cursor-speckit.git
cd n8n-cursor-speckit
npm run install:n8n-sk

# When prompted
> ~/my-new-project
> y (create directory)
> y (install docs)
```

### Scenario 2: Install to Existing Project

```bash
cd n8n-cursor-speckit
npm run install:n8n-sk

# When prompted
> /Users/me/existing-project
> y (overwrite files)
> a (overwrite all when asked multiple times)
> n (skip docs if you have your own README)
```

### Scenario 3: Force Install (No Prompts for Overwrites)

```bash
npm run install:force

# Will still prompt for:
> target directory
> create directory (if doesn't exist)
> optional files

# But will automatically overwrite all existing files
```

### Scenario 4: Non-Interactive (With Arguments)

```bash
# Provide target as argument
node install.js ~/my-project

# Only prompts for:
# - Create directory (if needed)
# - Overwrite files (if exist)
# - Optional documentation

# Or fully automated (force + skip prompts)
echo "y" | node install.js ~/my-project --force
```

### Scenario 5: Reinstall / Update

```bash
# To update an existing installation
cd n8n-cursor-speckit
git pull  # Get latest changes

npm run install:n8n-sk
> /path/to/my/project
> a (overwrite all when prompted)
```

## Command Line Options

### Target Directory

```bash
# As argument (positional)
node install.js /path/to/project

# Or via npm script
npm run install:n8n-sk -- /path/to/project
```

### Force Mode

```bash
# Overwrites all existing files without asking
node install.js --force
npm run install:force

# Can combine with target
node install.js /path/to/project --force
```

### Skip Prompts (Not yet implemented but planned)

```bash
# Would skip optional file prompts
node install.js --skip-prompts
node install.js -y
```

## Troubleshooting

### "Cannot install to the same directory as source"

**Problem:** Trying to install to the n8n-cursor-speckit directory itself

**Solution:** Specify a different target directory
```bash
npm run install:n8n-sk -- /different/path
```

### "No target directory provided"

**Problem:** Pressed Enter without typing a path

**Solution:** Run again and provide a valid path
```bash
npm run install:n8n-sk
> /Users/me/my-project  # Type this
```

### "Failed to create directory"

**Problem:** Permission denied or invalid path

**Solutions:**
- Check directory permissions
- Use absolute path instead of relative
- Create parent directories first
- Run with appropriate permissions

### Files Not Appearing in Cursor

**Problem:** Commands don't show up after installation

**Solutions:**
1. Restart Cursor
2. Verify files exist:
   ```bash
   ls -la /path/to/project/.cursor/commands/
   ```
3. Check file permissions:
   ```bash
   chmod 644 /path/to/project/.cursor/commands/*.md
   ```
4. Ensure `.cursor/commands/` is in your workspace root

### Want to Skip Some Files

**Solution:** When prompted for each file:
- Type `n` to skip individual files
- Type `a` only when you want to accept ALL remaining files

## Verifying Installation

### Check Installed Files

```bash
cd /path/to/your/project

# Check cursor commands (should show 7 files)
ls -1 .cursor/commands/
# n8n.align.md
# n8n.analyze.md
# n8n.checklist.md
# n8n.clarify.md
# n8n.implement.md
# n8n.plan.md
# n8n.specify.md

# Check framework files (should show 3 directories)
ls -1 .specify/
# memory
# scripts
# templates

# Count total files
find .cursor/commands .specify -type f | wc -l
# Should show: 18
```

### Test in Cursor

1. Open your project:
   ```bash
   cd /path/to/your/project
   cursor .
   ```

2. Type `/n8n.` in the command palette

3. Should see all 7 commands:
   - `/n8n.align`
   - `/n8n.analyze`
   - `/n8n.checklist`
   - `/n8n.clarify`
   - `/n8n.implement`
   - `/n8n.plan`
   - `/n8n.specify`

## Uninstalling

To remove n8n Speckit from your project:

```bash
cd /path/to/your/project

# Remove cursor commands
rm -rf .cursor/commands/n8n.*.md

# Remove framework files
rm -rf .specify

# Remove optional documentation (if installed)
rm -f n8n-speckit-README.md
```

Or remove entire directories if they only contain n8n Speckit:
```bash
rm -rf .cursor .specify n8n-speckit-README.md
```

## Advanced Usage

### Install to Multiple Projects

```bash
cd n8n-cursor-speckit

# Project 1
npm run install:n8n-sk -- ~/projects/project1

# Project 2
npm run install:n8n-sk -- ~/projects/project2

# Project 3
npm run install:n8n-sk -- ~/projects/project3
```

### Scripted Installation

```bash
#!/bin/bash
# install-to-all.sh

PROJECTS=(
  "~/project1"
  "~/project2"
  "~/project3"
)

for project in "${PROJECTS[@]}"; do
  echo "Installing to $project"
  echo "$project" | node install.js --force
done
```

### Keep Framework Updated

```bash
# Create an alias for easy updates
alias update-n8n-sk='cd ~/n8n-cursor-speckit && git pull && npm run install:force -- ~/my-project'

# Use it
update-n8n-sk
```

## Next Steps

After installation:

1. **Read the Documentation**
   - If you installed it: `n8n-speckit-README.md`
   - Or view in repo: `README.md`

2. **Try the Quick Start**
   - See `QUICK_START.md` in this repo

3. **Build Your First Workflow**
   ```
   /n8n.specify Create a simple webhook that responds with a greeting
   ```

4. **Explore Examples**
   - See `USAGE_EXAMPLES.md` in this repo

Happy workflow building! 🚀

