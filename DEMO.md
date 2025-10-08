# Installation Demo

## What You Get

```
🎯 n8n Cursor Speckit
├── 7 Cursor Commands      (~135 KB)
│   ├── /n8n.specify       Create specifications
│   ├── /n8n.clarify       Resolve ambiguities
│   ├── /n8n.plan          Design architecture
│   ├── /n8n.implement     Build workflows
│   ├── /n8n.analyze       Validate quality
│   ├── /n8n.align         Sync specs with changes
│   └── /n8n.checklist     Generate quality gates
│
└── 11 Framework Files     (Speckit infrastructure)
    ├── Templates          spec, plan, tasks, checklists
    ├── Scripts            automation helpers
    └── Constitution       quality principles
```

## Installation Flow

### Step 1: Clone

```bash
$ git clone https://github.com/siarhei-belavus/n8n-cursor-speckit.git
$ cd n8n-cursor-speckit
```

### Step 2: Run Installer

```bash
$ npm run install:n8n-sk

╔════════════════════════════════════════════════╗
║     n8n Cursor Speckit Installation           ║
╚════════════════════════════════════════════════╝

📂 Source: /Users/me/n8n-cursor-speckit

Enter target project directory path: _
```

**Type your project path:**
- `/Users/me/my-n8n-project`
- `~/projects/workflows`
- `../my-project`

### Step 3: Install Progress

```
📂 Target: /Users/me/my-n8n-project

📦 Installing n8n Speckit files...

📁 Cursor command templates (.cursor/commands):
  ✓ Copied: .cursor/commands/n8n.align.md
  ✓ Copied: .cursor/commands/n8n.analyze.md
  ✓ Copied: .cursor/commands/n8n.checklist.md
  ✓ Copied: .cursor/commands/n8n.clarify.md
  ✓ Copied: .cursor/commands/n8n.implement.md
  ✓ Copied: .cursor/commands/n8n.plan.md
  ✓ Copied: .cursor/commands/n8n.specify.md

📁 Speckit framework files (.specify):
  ✓ Copied: .specify/memory/constitution.md
  ✓ Copied: .specify/scripts/bash/check-prerequisites.sh
  ✓ Copied: .specify/scripts/bash/common.sh
  ✓ Copied: .specify/scripts/bash/create-new-feature.sh
  ✓ Copied: .specify/scripts/bash/setup-plan.sh
  ✓ Copied: .specify/scripts/bash/update-agent-context.sh
  ✓ Copied: .specify/templates/agent-file-template.md
  ✓ Copied: .specify/templates/checklist-template.md
  ✓ Copied: .specify/templates/plan-template.md
  ✓ Copied: .specify/templates/spec-template.md
  ✓ Copied: .specify/templates/tasks-template.md

📄 Optional files:

Install Documentation? (y/n): y
  ✓ Copied: n8n-speckit-README.md
```

### Step 4: Summary

```
════════════════════════════════════════════════════════════
Installation Summary:
  ✓ Copied:  18 file(s)
  ⊘ Skipped: 0 file(s)
  ✗ Failed:  0 file(s)
════════════════════════════════════════════════════════════

✨ Installation complete!

📖 What was installed:
   • Cursor commands in: /Users/me/my-n8n-project/.cursor/commands/
   • Speckit framework in: /Users/me/my-n8n-project/.specify/

🚀 Next steps:
   1. cd /Users/me/my-n8n-project
   2. Open directory in Cursor: cursor .
   3. Type /n8n.specify to start building workflows

💡 Available commands:
   /n8n.specify   - Create workflow specification
   /n8n.clarify   - Resolve ambiguities
   /n8n.plan      - Design technical architecture
   /n8n.implement - Build the workflow
   /n8n.analyze   - Validate quality
   /n8n.align     - Sync specs with changes
   /n8n.checklist - Generate quality checklists
```

## Handling Existing Files

If files already exist, you'll be prompted:

```
📁 Cursor command templates (.cursor/commands):

File exists: /Users/me/project/.cursor/commands/n8n.specify.md
  Overwrite? (y/n/a=all): _
```

**Options:**
- `y` or `yes` → Overwrite this file
- `n` or `no` → Skip this file
- `a` or `all` → Overwrite ALL remaining files

**Example interaction:**
```
Overwrite? (y/n/a=all): n
  ⊘ Skipped: .cursor/commands/n8n.specify.md

File exists: /Users/me/project/.cursor/commands/n8n.plan.md
  Overwrite? (y/n/a=all): a
  ✓ Copied: .cursor/commands/n8n.plan.md
  ✓ Copied: .cursor/commands/n8n.implement.md
  ✓ Copied: .cursor/commands/n8n.analyze.md
  ... (rest automatically overwritten)
```

## Quick Commands

### Interactive Install
```bash
npm run install:n8n-sk
# Prompts for target
# Prompts for overwrites
# Prompts for optional files
```

### With Target Path
```bash
npm run install:n8n-sk -- ~/my-project
# No target prompt
# Still prompts for overwrites
# Still prompts for optional files
```

### Force Mode
```bash
npm run install:force
# Prompts for target
# Overwrites all without asking
# Still prompts for optional files
```

### Fully Automated
```bash
echo "y" | node install.js ~/my-project --force
# Target provided
# Overwrites all
# Accepts all prompts (auto-yes)
```

## Directory Structure After Installation

```
my-n8n-project/
├── .cursor/
│   └── commands/
│       ├── n8n.align.md
│       ├── n8n.analyze.md
│       ├── n8n.checklist.md
│       ├── n8n.clarify.md
│       ├── n8n.implement.md
│       ├── n8n.plan.md
│       └── n8n.specify.md
├── .specify/
│   ├── memory/
│   │   └── constitution.md
│   ├── scripts/
│   │   └── bash/
│   │       ├── check-prerequisites.sh
│   │       ├── common.sh
│   │       ├── create-new-feature.sh
│   │       ├── setup-plan.sh
│   │       └── update-agent-context.sh
│   └── templates/
│       ├── agent-file-template.md
│       ├── checklist-template.md
│       ├── plan-template.md
│       ├── spec-template.md
│       └── tasks-template.md
├── n8n-speckit-README.md (optional)
└── (your existing project files...)
```

## Using the Commands

### In Cursor

1. Open your project:
   ```bash
   cd ~/my-n8n-project
   cursor .
   ```

2. Open command palette (Cmd+Shift+P or Ctrl+Shift+P)

3. Type `/n8n.` to see all commands

4. Start with `/n8n.specify`:
   ```
   /n8n.specify Create a webhook that receives order data, 
   validates required fields, stores in PostgreSQL, and sends 
   Slack notification on success or failure
   ```

5. Follow the workflow:
   ```
   /n8n.specify  → spec.md
   /n8n.clarify  → updated spec.md (if needed)
   /n8n.plan     → plan.md, contracts, quickstart
   /n8n.implement → workflow JSON, tests, docs
   /n8n.analyze  → validation report
   ```

## Real-World Example

### Scenario: Setting Up For New Project

```bash
# 1. Clone speckit repo
git clone https://github.com/siarhei-belavus/n8n-cursor-speckit.git

# 2. Create your n8n project
mkdir ~/my-n8n-workflows
cd ~/my-n8n-workflows
git init

# 3. Install speckit
cd ~/n8n-cursor-speckit
npm run install:n8n-sk
> ~/my-n8n-workflows
> y (install docs)

# 4. Start building
cd ~/my-n8n-workflows
cursor .

# 5. Use commands
# Type: /n8n.specify ...
```

### Scenario: Adding to Existing Project

```bash
# 1. Clone speckit
git clone https://github.com/siarhei-belavus/n8n-cursor-speckit.git

# 2. Install to existing project
cd n8n-cursor-speckit
npm run install:n8n-sk
> ~/existing-project
> a (overwrite all conflicts)
> n (skip docs, we have our own)

# 3. Start using
cd ~/existing-project
cursor .
# Type: /n8n.specify ...
```

## Troubleshooting

### Commands don't appear in Cursor
- Restart Cursor
- Verify files: `ls -la .cursor/commands/`
- Check you're in the correct workspace

### "Cannot install to same directory"
- You tried to install to the speckit repo itself
- Specify a different target path

### Permission errors
- Check directory permissions
- Try with sudo (not recommended)
- Or create target dir first: `mkdir -p ~/my-project`

## Summary

**Clone → Install → Build**

```bash
# One-time setup
git clone https://github.com/siarhei-belavus/n8n-cursor-speckit.git
cd n8n-cursor-speckit
npm run install:n8n-sk

# Then in Cursor
/n8n.specify → /n8n.plan → /n8n.implement → /n8n.analyze

# Production-ready workflows in hours, not days! 🚀
```

