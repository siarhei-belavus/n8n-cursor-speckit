# Quick Start Guide

## Prerequisites

**Before installing n8n Speckit, you need the n8n-MCP server:**

- Install from: https://github.com/czlonkowski/n8n-mcp
- Configure it in your Cursor MCP settings
- The MCP server enables AI assistants to:
  - Interact with n8n workflows programmatically
  - Fetch actual n8n node documentation
  - Validate node syntax and configuration

## Installation (5 minutes)

### Step 1: Clone the Repository

```bash
git clone https://github.com/siarhei-belavus/n8n-cursor-speckit.git
cd n8n-cursor-speckit
```

### Step 2: Run the Interactive Installer

```bash
npm run install:n8n-sk
```

The installer will prompt you for:
1. **Target directory path** - Where to install (e.g., `~/projects/my-n8n-project`)
2. **Create directory?** - If target doesn't exist
3. **Overwrite files?** - If files already exist (y/n/a=all)
4. **Install documentation?** - Optional README (y/n)

### Step 3: Verify Installation

```bash
# Go to your project
cd /path/to/your/project

# Check installed files
ls -la .cursor/commands/  # Should show n8n.*.md files
ls -la .specify/          # Should show framework files

# Open in Cursor
cursor .
```

### Step 4: Test a Command

In Cursor, type `/n8n.` - you should see all commands available:
- `/n8n.specify`
- `/n8n.clarify`
- `/n8n.plan`
- `/n8n.implement`
- `/n8n.analyze`
- `/n8n.align`
- `/n8n.checklist`

## Your First Workflow

### Step 1: Specify
```
/n8n.specify Create a simple webhook that receives JSON data with a name field 
and responds with a greeting message
```

### Step 2: Plan
```
/n8n.plan
```

### Step 3: Implement
```
/n8n.implement
```

### Step 4: Analyze
```
/n8n.analyze
```

That's it! You now have a complete, validated n8n workflow with full documentation.

## Directory Structure After Installation

```
your-project/
├── .cursor/
│   └── commands/
│       ├── n8n.align.md
│       ├── n8n.analyze.md
│       ├── n8n.checklist.md
│       ├── n8n.clarify.md
│       ├── n8n.implement.md
│       ├── n8n.plan.md
│       └── n8n.specify.md
└── n8n-speckit-README.md (optional)
```

## Workflow Structure Created

After running through the commands, you'll have:

```
feature/your-workflow-name/
├── spec.md                    # Requirements
├── plan.md                    # Technical design
├── tasks.md                   # Implementation tasks
├── research.md                # Node selection decisions
├── quickstart.md              # Setup guide
├── checklists/
│   ├── requirements.md
│   ├── architecture.md
│   └── implementation.md
├── contracts/
│   ├── input-contract.json
│   └── output-contract.json
├── workflows/
│   └── your-workflow.json
├── test-data/
│   ├── valid-input.json
│   ├── invalid-input.json
│   └── edge-cases.json
└── docs/
    ├── credentials-setup.md
    └── deployment.md
```

## Common Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/n8n.specify` | Define requirements | Start of every project |
| `/n8n.clarify` | Resolve ambiguities | After specify, if needed |
| `/n8n.plan` | Design architecture | After clear requirements |
| `/n8n.implement` | Build workflow | After planning complete |
| `/n8n.analyze` | Validate quality | Before deployment |
| `/n8n.align` | Sync specs with changes | After manual edits |
| `/n8n.checklist` | Generate quality gates | Any phase |

## Troubleshooting

### Commands not appearing in Cursor
- Restart Cursor
- Check `.cursor/commands/` directory exists
- Verify files are `.md` format

### Installation fails
- Run with `--force` flag: `node install.js --force`
- Check file permissions
- Verify Node.js version >= 14

### Reinstall from scratch
```bash
rm -rf .cursor/commands/n8n.*.md
npm run n8n:install -- --force
```

## Next Steps

1. Read the full documentation: `n8n-speckit-README.md`
2. Try building a simple workflow
3. Explore advanced features:
   - Workflow decomposition
   - Spec alignment
   - Custom checklists
   - MCP validation

## Support

- Documentation: See `README.md` or `n8n-speckit-README.md`
- Issues: https://github.com/siarhei-belavus/n8n-cursor-speckit/issues
- Examples: See the README for common patterns

Happy workflow building! 🚀

