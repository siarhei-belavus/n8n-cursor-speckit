# Usage Examples

This guide provides practical examples of using the n8n Cursor Speckit in different scenarios.

## Example 1: Simple Webhook Processor

### Scenario
Create a webhook that validates incoming data and stores it in a database.

### Commands Used
```
/n8n.specify Create a webhook that receives JSON data with email and name fields,
validates the email format, stores valid entries in PostgreSQL, and rejects invalid ones

/n8n.plan

/n8n.implement

/n8n.analyze
```

### Result
```
feature/webhook-validator/
├── spec.md
├── plan.md
├── tasks.md
├── workflows/
│   └── webhook-validator.json
└── test-data/
    ├── valid-email.json
    └── invalid-email.json
```

---

## Example 2: Scheduled Data Sync

### Scenario
Sync data from an API to Airtable every hour.

### Commands Used
```
/n8n.specify Create a workflow that runs hourly, fetches user data from
JSONPlaceholder API, transforms it to match Airtable schema, and upserts to Airtable

/n8n.clarify
# Answer questions about:
# - Which Airtable fields to map
# - How to handle duplicate users
# - Error notification preferences

/n8n.plan

/n8n.tasks

/n8n.implement

/n8n.analyze
```

### Key Features
- Automatic clarification of ambiguities
- Task breakdown for complex implementation
- Full validation before deployment

---

## Example 3: AI-Powered Customer Support

### Scenario
Create an AI agent that processes customer inquiries from Slack.

### Commands Used
```
/n8n.specify Build a workflow triggered by Slack messages in #support channel,
uses OpenAI to analyze the message, searches knowledge base, and responds with
helpful information or escalates to human

/n8n.clarify
# Questions about:
# - OpenAI model selection
# - Knowledge base structure
# - Escalation criteria

/n8n.plan
# Plan includes AI Agent node, tool configuration, error handling

/n8n.checklist Create implementation checklist focusing on AI tool configuration
and error scenarios

/n8n.implement

/n8n.analyze
```

### Advanced Features
- Custom checklist generation
- AI Agent configuration
- Complex error handling

---

## Example 4: Workflow with Manual Edits

### Scenario
Build a workflow, then make manual improvements in the n8n UI, then sync the spec.

### Commands Used
```
# Initial development
/n8n.specify Create a simple data processing workflow

/n8n.plan

/n8n.implement

# Deploy and test in n8n UI
# Make manual improvements:
# - Add retry logic
# - Adjust timeout settings
# - Add debug logging

# Sync spec with changes
/n8n.align

# Review alignment report
# Commit updated documentation
```

### Why This Matters
- Keeps documentation in sync with reality
- Tracks all changes systematically
- Prevents spec drift

---

## Example 5: Complex Multi-Step Pipeline

### Scenario
Build an order processing system with validation, payment, inventory, and notifications.

### Commands Used
```
/n8n.specify Build an order processing system that validates order details,
processes payment through Stripe, updates inventory in PostgreSQL, sends
confirmation email, and handles all error scenarios with proper notifications

/n8n.clarify
# Many clarifications needed for complex workflow

/n8n.plan
# Plan recommends decomposition into sub-workflows:
# - main.json (orchestrator)
# - validate-order.json
# - process-payment.json
# - update-inventory.json
# - send-confirmation.json

/n8n.tasks
# Separate task lists for each sub-workflow

/n8n.implement
# Implements all 5 workflows

/n8n.analyze
# Validates entire workflow family

/n8n.align
# Syncs all sub-workflow specs
```

### Result Structure
```
workflows/order-processing/
├── main.json
├── validate-order.json
├── process-payment.json
├── update-inventory.json
└── send-confirmation.json

feature/order-processing/
├── spec.md
├── plan.md (includes decomposition analysis)
├── tasks.md
├── workflows/ (contains the 5 JSONs)
└── test-data/
    ├── valid-order.json
    ├── invalid-order.json
    └── payment-failure.json
```

---

## Example 6: Converting Existing Code

### Scenario
You have Python code that needs to become an n8n workflow.

### Commands Used
```
# Use Cursor's /n8n.code command first
/n8n.code Convert this Python script to n8n workflow:
[paste Python code]

# Then validate with Speckit
/n8n.analyze

# If issues found, create proper spec
/n8n.specify [describe what the Python code does]

/n8n.plan

/n8n.implement
```

### Integration Strategy
- Use existing `/n8n.code` for conversion
- Use `/n8n.analyze` for validation
- Use full Speckit for complex refactoring

---

## Example 7: Quick Prototype vs Production

### Quick Prototype (< 30 minutes)
```bash
# Use built-in n8n.build command
/n8n.build Create a webhook that sends Slack messages
```

### Production Version (1-2 hours)
```bash
# Use full Speckit
/n8n.specify Create a production-ready webhook handler with validation,
error handling, logging, and monitoring

/n8n.clarify
/n8n.plan
/n8n.implement
/n8n.analyze
```

### When to Use Each
- **Prototype**: Testing ideas, demos, personal projects
- **Production**: Team projects, customer-facing, long-term maintenance

---

## Example 8: Team Collaboration

### Scenario
Multiple developers working on different workflows.

### Developer 1: Spec Author
```
/n8n.specify [workflow description]
/n8n.clarify
/n8n.plan

# Commit: spec.md, plan.md
git add feature/my-workflow/
git commit -m "spec: define webhook processor requirements"
git push
```

### Developer 2: Implementer
```
# Pull latest changes
git pull

# Implement based on spec
cd feature/my-workflow
# Review spec.md and plan.md
/n8n.implement

# Commit: workflow JSON, tests
git add feature/my-workflow/workflows/
git commit -m "feat: implement webhook processor"
git push
```

### Developer 3: Reviewer
```
# Pull latest changes
git pull

# Validate implementation
/n8n.analyze

# Verify alignment
/n8n.align --dry-run

# If aligned, approve PR
```

---

## Example 9: Debugging Existing Workflow

### Scenario
Production workflow has issues, need to debug and fix.

### Commands Used
```
# First, analyze current state
/n8n.analyze

# Review findings
# Fix critical issues in n8n UI

# Sync changes back to spec
/n8n.align

# Verify fixes
/n8n.analyze

# If complex changes needed
/n8n.specify [update description with new requirements]
/n8n.plan [update plan]
/n8n.implement [rebuild workflow]
```

---

## Example 10: Adding Tests to Existing Workflow

### Scenario
You have a working workflow but no tests.

### Commands Used
```
# Create spec from existing workflow
/n8n.specify [describe what the workflow does]

# Generate test scenarios
/n8n.plan
# This creates quickstart.md with test scenarios

# Generate test checklist
/n8n.checklist Create testing checklist for this workflow

# Align spec with actual implementation
/n8n.align

# Now you have:
# - spec.md (requirements)
# - plan.md (design)
# - quickstart.md (test scenarios)
# - test-data/ (test cases)
# - checklists/implementation.md (test checklist)
```

---

## Common Patterns

### Pattern 1: Spec → Implement (Green Field)
```
/n8n.specify → /n8n.clarify → /n8n.plan → /n8n.implement → /n8n.analyze
```
**Use for**: New projects, clear requirements

---

### Pattern 2: Implement → Align (Manual First)
```
[Build in n8n UI] → /n8n.specify → /n8n.align
```
**Use for**: Prototypes that became production, manual workflows

---

### Pattern 3: Analyze → Fix → Align (Debugging)
```
/n8n.analyze → [Fix issues] → /n8n.align → /n8n.analyze
```
**Use for**: Debugging, refactoring, quality improvements

---

### Pattern 4: Checklist → Implement → Checklist (Quality Focus)
```
/n8n.specify → /n8n.plan → /n8n.checklist → /n8n.implement → /n8n.checklist
```
**Use for**: Critical workflows, compliance requirements

---

## Tips & Tricks

### Tip 1: Start Small
Don't use full Speckit for trivial workflows. Use `/n8n.build` for quick tasks.

### Tip 2: Invest in Clarification
5 minutes of clarification saves hours of rework. Answer all questions thoughtfully.

### Tip 3: Review Generated Plans
Plans are intelligent but not perfect. Review and edit `plan.md` before implementing.

### Tip 4: Use Checklists Proactively
Generate checklists early in the process, not at the end.

### Tip 5: Align Frequently
Don't wait for major changes. Run `/n8n.align` after any manual edit.

### Tip 6: Let Decomposition Happen Naturally
Don't force workflow splits. Trust the planning phase analysis.

### Tip 7: Version Control Everything
Commit all speckit artifacts (spec, plan, tasks, workflows). They're your documentation.

### Tip 8: Test Before Analyze
Run manual tests before `/n8n.analyze`. It's faster to catch obvious issues yourself.

### Tip 9: Use Dry Run
Use `--dry-run` flag with `/n8n.align` to preview changes before applying.

### Tip 10: Document Decisions
Use `research.md` to document why you chose specific nodes or approaches.

---

## Next Steps

1. **Try Example 1**: Build a simple webhook to get familiar with the workflow
2. **Read Full Docs**: See `README.md` for complete reference
3. **Build Real Project**: Apply Speckit to your actual n8n workflow
4. **Share Experience**: Contribute examples and improvements

Happy building! 🚀

