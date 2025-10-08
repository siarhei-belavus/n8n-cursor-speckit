# n8n Speckit Framework

> A systematic, quality-driven approach to building production-ready n8n workflows

## Prerequisites

### Required: n8n MCP Server

This framework requires the **n8n-MCP** server to be installed and configured in Cursor. The MCP server provides AI assistants with the ability to:
- Interact with n8n's API and build workflows programmatically
- Fetch actual n8n node documentation
- Validate node syntax and configuration

**Install n8n-MCP:**
- Repository: https://github.com/czlonkowski/n8n-mcp
- Follow the installation instructions in the n8n-MCP documentation
- Configure it in your Cursor MCP settings

Once n8n-MCP is installed and configured, you can proceed with installing the Speckit framework below.

## Installation

### Recommended: Clone and Install

```bash
# 1. Clone the repository
git clone https://github.com/siarhei-belavus/n8n-cursor-speckit.git
cd n8n-cursor-speckit

# 2. Run the interactive installer
npm run install:n8n-sk

# 3. Enter your target project path when prompted
# Example: /path/to/your/n8n-project
# Or: ~/projects/my-n8n-workflows

# The installer will:
# ✓ Copy .cursor/commands/ (all n8n commands)
# ✓ Copy .specify/ (framework files)
# ✓ Ask to overwrite if files exist
# ✓ Optionally copy documentation
```

### Installation with Options

```bash
# Provide target directory as argument
npm run install:n8n-sk -- /path/to/target

# Force overwrite all existing files
npm run install:force

# Or use node directly
node install.js                           # Interactive
node install.js /path/to/target          # With path
node install.js --force                  # Force overwrite
node install.js /path/to/target --force  # Both
```

### Verify Installation

After installation, open Cursor in your project and type `/n8n.` - you should see all available commands:
- `/n8n.specify`
- `/n8n.clarify`
- `/n8n.plan`
- `/n8n.implement`
- `/n8n.analyze`
- `/n8n.align`
- `/n8n.checklist`

## Quick Links

- 🚀 **[Installation Demo](DEMO.md)** - See the installation flow in action
- 📚 **[Quick Start Guide](QUICK_START.md)** - Get started in 5 minutes
- 📘 **[Usage Guide](USAGE.md)** - Complete usage instructions
- 💡 **[Usage Examples](USAGE_EXAMPLES.md)** - 10 real-world scenarios
- 📖 **Full Documentation** - This README (below)
- 🧪 **Testing** - Run `npm test` to verify installation

## Overview

The **n8n Speckit** is an adaptation of the [Speckit software development framework](https://github.com/github/spec-kit) specifically designed for n8n workflow development. It provides a structured methodology for going from idea to production-ready workflow with comprehensive documentation, validation, and quality gates.

**Inspired by**: This framework is inspired by GitHub's [Spec-Kit](https://github.com/github/spec-kit), which pioneered the spec-driven development approach for general software engineering.

### Why Use n8n Speckit?

**Traditional n8n development:**
```
Idea → Build workflow → Test → Fix issues → Deploy → Hope it works
```

**With n8n Speckit:**
```
Idea → Specify → Clarify → Plan → Generate Tasks → Implement → Analyze → Deploy with confidence
```

**Benefits:**
- 🎯 **Clear Requirements**: Explicit specifications prevent scope creep and misunderstandings
- 🔍 **Early Validation**: Catch issues before implementation, not after deployment
- 📋 **Quality Gates**: Checklists ensure nothing is missed
- 🔄 **Consistency**: Standardized process across all workflows
- 📚 **Documentation**: Complete records of decisions and rationale
- 🤝 **Collaboration**: Clear artifacts for team review and handoff
- 🚀 **Faster Iteration**: Structured approach reduces rework

## The n8n Speckit Workflow

### Phase 1: Specification (`/n8n.specify`)

**Purpose**: Define WHAT the workflow should do (not HOW)

**Input**: Natural language workflow description
**Output**: Complete specification document (`spec.md`)

**What it captures:**
- Workflow purpose and scope
- Trigger type and execution frequency
- Input/output data requirements
- Integration requirements
- Error scenarios and handling
- Success criteria (measurable, node-agnostic)
- Edge cases

**Example:**
```bash
/n8n.specify Process incoming webhook data, validate required fields, 
store in PostgreSQL, and send Slack notification on success or failure
```

**Outputs:**
```
feature/webhook-processor/
├── spec.md                    # Complete specification
└── checklists/
    └── requirements.md        # Auto-generated quality checklist
```

**Key Principles:**
- ✅ Business requirements and outcomes
- ✅ Data flow and transformations
- ✅ Integration behavior
- ❌ NO node types (HTTP Request, Set, IF)
- ❌ NO n8n expressions
- ❌ NO implementation details

---

### Phase 2: Clarification (`/n8n.clarify`)

**Purpose**: Resolve ambiguities before planning

**Input**: Generated specification
**Output**: Updated `spec.md` with clarifications

**Process:**
1. Analyzes spec for ambiguities across:
   - Trigger & execution context
   - Data flow & sources
   - Integration & authentication
   - Error handling & recovery
   - Performance & reliability

2. Asks up to 5 targeted questions (one at a time):
   ```markdown
   ## Question 1: How should this workflow be triggered?
   
   | Option | Description |
   |--------|-------------|
   | A | Manual execution (testing/one-off) |
   | B | Webhook endpoint (external calls) |
   | C | Schedule (recurring at specific times) |
   | D | Event-driven (file upload, etc.) |
   ```

3. Integrates answers into spec incrementally
4. Reports coverage summary

**When to use:**
- After `/n8n.specify` if [NEEDS CLARIFICATION] markers present
- When requirements are unclear or incomplete
- Before investing time in planning

**When to skip:**
- Requirements are completely detailed
- Building quick prototype/spike
- User explicitly states "skip clarifications"

---

### Phase 3: Planning (`/n8n.plan`)

**Purpose**: Design the technical architecture and node selection

**Input**: Clarified specification
**Output**: Complete implementation plan (`plan.md`)

**What it creates:**
- **Workflow Decomposition Analysis**: Evaluates whether to split into sub-workflows
- **Node Architecture**: Visual flow, node selection table, rationale
- **Data Flow Design**: Input/output schemas, transformations, expressions
- **Integration Details**: Node types, authentication, error handling
- **Error Handling Strategy**: Detection, retry, notification, fallback
- **Performance Design**: Batching, parallel execution, bottlenecks
- **Observability Design**: Logging, monitoring, alerting

**Workflow Decomposition Feature:**

The planning phase automatically analyzes workflow complexity and recommends decomposition into smaller sub-workflows when appropriate:

**Decomposition Criteria:**
- Size > 25 nodes expected
- Multiple distinct logical domains (validation, processing, notification, etc.)
- Reusable logic that could serve multiple parent workflows
- Independent operations that could run in parallel
- Complex error handling requiring isolation

**When to Decompose:**
```
✅ Split if: ≥ 3 high-priority criteria met
⚠️ Consider if: 1-2 high + 2+ medium criteria met
❌ Keep single if: Otherwise
```

**Example Decomposition:**

Original spec: "Process order, validate, charge payment, update inventory, send confirmation"

Planning analysis identifies 4 distinct domains → Recommends decomposition:

```
workflows/order-processing/
├── main.json                    # Orchestrator workflow
├── validate-order.json          # Validation sub-workflow
├── process-payment.json         # Payment sub-workflow  
├── update-inventory.json        # Inventory sub-workflow
└── send-confirmation.json       # Notification sub-workflow
```

**Benefits:**
- Each sub-workflow is simple (5-10 nodes)
- Independent testing and deployment
- Reusable components (e.g., send-confirmation used by other workflows)
- Better error isolation (payment failure doesn't block inventory check)
- Team can work on sub-workflows in parallel

**Additional artifacts:**
```
feature/webhook-processor/
├── plan.md                    # Technical design
├── research.md                # Node discovery & decisions
├── data-model.md              # Entity definitions (if applicable)
├── contracts/
│   ├── input-contract.json    # JSON schema for input
│   └── output-contract.json   # JSON schema for output
└── quickstart.md              # Test scenarios & setup
```

**Uses n8n MCP tools extensively:**
```javascript
// Discover appropriate nodes
mcp_n8n-mcp_search_nodes({query: "database", includeExamples: true})

// Validate selections
mcp_n8n-mcp_get_node_essentials("n8n-nodes-base.postgres")
mcp_n8n-mcp_validate_node_minimal("n8n-nodes-base.postgres", {})

// Check existing templates
mcp_n8n-mcp_search_templates_by_metadata({category: "automation"})
```

**Key outputs:**
- Specific node types for each operation
- Connection architecture
- Configuration snippets
- Credential requirements
- Error handling flows

---

### Phase 4: Task Generation (`/n8n.tasks`)

**Purpose**: Break down implementation into actionable tasks

**Input**: Plan + Specification
**Output**: Ordered task list (`tasks.md`)

**Task organization:**
1. **Phase 1: Setup & Validation**
   - Initialize workflow structure
   - Document credentials
   - Validate node selections

2. **Phase 2: Core Workflow Structure**
   - Implement trigger node
   - Add primary processing nodes
   - Configure connections

3. **Phase 3: Data Transformation**
   - Input validation
   - Field mappings
   - Data enrichment

4. **Phase 4: Integration Implementation**
   - Configure external services
   - Set up authentication
   - Add response handling

5. **Phase 5: Error Handling**
   - Error detection
   - Retry logic
   - Notifications
   - Fallback paths

6. **Phase 6: Testing & Validation**
   - Structure validation
   - Happy path testing
   - Error scenario testing
   - Edge case testing

7. **Phase 7: Documentation & Deployment**
   - Update guides
   - Create test data
   - Deployment instructions

**Each task includes:**
- Clear description
- File paths
- Node IDs and types
- Configuration snippets
- Acceptance criteria
- Dependencies
- Parallel markers [P]

---

### Phase 5: Implementation (`/n8n.implement`)

**Purpose**: Execute the task list and build the workflow

**Input**: Tasks + Plan + Specification
**Output**: Complete workflow JSON

**Process:**
1. **Check checklists**: Verify all quality gates passed
2. **Load context**: Tasks, plan, contracts, test scenarios
3. **Execute phase-by-phase**:
   - Setup → Core → Transformation → Integration → Error Handling → Testing → Documentation
4. **Validate at each phase** using MCP tools
5. **Mark tasks complete** [X] as executed
6. **Test thoroughly**: Happy path, errors, edge cases
7. **Generate completion report**

**Validation integration:**
```javascript
// After each phase
mcp_n8n-mcp_validate_workflow(workflow)
mcp_n8n-mcp_validate_workflow_connections(workflow)
mcp_n8n-mcp_validate_workflow_expressions(workflow)
```

**Output:**
```
feature/webhook-processor/
├── workflows/
│   └── webhook-processor.json    # Complete workflow
├── test-data/
│   ├── valid-input.json
│   ├── invalid-input.json
│   └── edge-cases.json
└── docs/
    ├── credentials-setup.md
    └── deployment.md
```

---

### Phase 6: Analysis (`/n8n.analyze`)

**Purpose**: Validate consistency and quality across all artifacts

**Input**: All artifacts (spec, plan, tasks, workflow)
**Output**: Comprehensive analysis report

**What it validates:**

1. **MCP Validation** (authoritative):
   - Workflow structure
   - Node connections
   - Expression syntax
   - Node references

2. **Requirements Coverage**:
   - Every FR implemented
   - Every integration configured
   - Every error scenario handled
   - Every edge case covered

3. **Consistency Checks**:
   - Spec → Plan → Workflow alignment
   - Terminology consistency
   - Configuration matches plan
   - Data flow matches design

4. **Quality Analysis**:
   - Node configurations complete
   - Credentials properly referenced
   - Error handlers comprehensive
   - Testing complete

5. **Constitution Compliance**:
   - Principles adhered to
   - Quality gates satisfied

**Report includes:**
- Executive summary (PASS/FAIL/WARNING)
- Detailed findings table (50 max)
- Coverage analysis
- Consistency checks
- Metrics summary
- Deployment recommendation

**Severity levels:**
- **CRITICAL**: Blocks deployment (validation errors, missing P1 requirements)
- **HIGH**: Should fix before deployment
- **MEDIUM**: Fix post-deployment
- **LOW**: Optional improvements

---

### Phase 7: Alignment (`/n8n.align`)

**Purpose**: Sync specification artifacts with actual workflow implementation

**Input**: Workflow JSON + git changes
**Output**: Updated spec.md, plan.md, tasks.md, quickstart.md

**When to use:**
- After manually editing workflow in n8n UI
- Mid-implementation to prevent spec drift
- After `/n8n.implement` to ensure completeness
- Before deployment to validate documentation accuracy

**What it does:**

1. **Analyzes git changes**:
   ```bash
   git diff main --name-status
   # Detects workflow JSON changes, test changes, docs changes
   ```

2. **Parses workflow structure**:
   - Nodes inventory (types, purposes, configurations)
   - Connection flow analysis
   - Integration points identification
   - Error handling detection
   - Data transformation extraction

3. **Compares against spec/plan**:
   - Matches nodes to requirements
   - Validates plan compliance
   - Detects undocumented nodes
   - Identifies configuration drift

4. **Updates spec artifacts**:
   - **spec.md**: Adds/updates FRs, integrations, error scenarios
   - **plan.md**: Updates node architecture, configurations, testing strategy
   - **tasks.md**: Marks completed tasks, adds missing ones
   - **quickstart.md**: Syncs setup instructions, credentials, tests

**Example usage:**
```bash
# After editing workflow in n8n UI
/n8n.align

# Compare against specific branch
/n8n.align --base=develop

# Dry run to see proposed changes
/n8n.align --dry-run

# Manual feature directory
/n8n.align --feature=/path/to/feature
```

**Output example:**
```markdown
# Alignment Report

## Summary
- Workflow changes: 3 new nodes added
- Spec artifacts updated: 4 files
- Requirement coverage: 72% → 95%

## Changes Applied
- Added FR-5: Airtable synchronization
- Updated INT-3: Slack authentication corrected
- Marked tasks T001-T015 as completed
- Added Airtable credential setup to quickstart

## Undocumented Changes
- airtable-sync node (not in plan)
- retry-logic node (not in spec)

Recommendation: Review and approve alignment changes
```

**Safety features:**
- Detects critical ambiguities (stops if conflicts found)
- Constitution compliance checking
- Dry-run mode to preview changes
- Generates constitution update proposals for new principles

---

### Phase 8: Checklist Generation (`/n8n.checklist`)

**Purpose**: Generate custom quality checklists for validation

**When to use:**
- After `/n8n.specify`: Requirements quality checklist
- After `/n8n.plan`: Architecture quality checklist
- After `/n8n.implement`: Implementation quality checklist
- Before deployment: Deployment readiness checklist

**Checklist types:**

**Requirements Checklist** (`requirements.md`):
```markdown
- [ ] CHK001 - Are trigger type and execution frequency explicitly specified? [Completeness, Spec §Trigger]
- [ ] CHK002 - Is 'process data' broken down into specific transformation rules? [Clarity, Spec §FR-2]
- [ ] CHK003 - Are error notification requirements defined for all failure scenarios? [Coverage, Gap]
```

**Architecture Checklist** (`architecture.md`):
```markdown
- [ ] CHK001 - Is rationale documented for node selection? [Traceability, Plan §Node Selection]
- [ ] CHK002 - Are all data transformations mapped to nodes? [Completeness, Plan §Data Flow]
- [ ] CHK003 - Is error handling strategy complete? [Coverage, Plan §Error Handling]
```

**Implementation Checklist** (`implementation.md`):
```markdown
- [ ] CHK001 - Are all planned nodes present in workflow? [Completeness]
- [ ] CHK002 - Are credentials referenced (not hardcoded)? [Security]
- [ ] CHK003 - Are all expressions using correct syntax? [Syntax]
```

**Deployment Checklist** (`deployment.md`):
```markdown
- [ ] CHK001 - Are credential setup instructions complete? [Completeness]
- [ ] CHK002 - Are all test scenarios documented? [Completeness]
- [ ] CHK003 - Is monitoring configured? [Observability]
```

**Key Principle**: Checklists test **requirement/design quality**, NOT implementation behavior.

---

## Complete Workflow Example

### Step-by-Step: Building a Webhook Data Processor

#### 1. Specify

```bash
/n8n.specify Create a workflow that receives webhook data, validates 
required fields (name, email, phone), stores valid records in PostgreSQL, 
and sends Slack notifications for both success and validation failures
```

**Generates:** `spec.md` with clear requirements

#### 2. Clarify (if needed)

System asks clarifying questions:
```markdown
Question 1: What Slack channel for notifications?
Answer: #alerts
```

**Updates:** `spec.md` with clarifications

#### 3. Plan

```bash
/n8n.plan
```

**Generates:**
- `plan.md` with node architecture:
  - Webhook trigger
  - Code node for validation
  - Postgres insert
  - Slack notifications (success & error)
- `contracts/input-contract.json`
- `quickstart.md` with test scenarios

#### 4. Generate Tasks

```bash
/n8n.tasks
```

**Generates:** `tasks.md` with 20+ ordered tasks:
- T001: Initialize workflow structure [P]
- T002: Document credentials [P]
- T003: Validate node selections
- T004: Implement webhook trigger
- ... (17 more tasks)

#### 5. Create Quality Checklist

```bash
/n8n.checklist Create architecture quality checklist focusing on 
error handling and data validation
```

**Generates:** `checklists/architecture.md` with validation items

#### 6. Implement

```bash
/n8n.implement
```

**Process:**
- Checks all checklists passed
- Executes tasks phase by phase
- Validates with MCP tools after each phase
- Marks tasks complete [X]
- Tests all scenarios
- Generates complete workflow JSON

**Generates:** `workflows/webhook-processor.json`

#### 7. Analyze

```bash
/n8n.analyze
```

**Generates:** Comprehensive analysis report:
- ✓ MCP validation: PASS
- ✓ Requirements coverage: 100%
- ✓ Constitution compliance: PASS
- **Recommendation**: READY FOR DEPLOYMENT

#### 8. Deploy & Manual Edits

Deploy workflow to production. Later, make manual edits in n8n UI (add retry logic, adjust timeout).

#### 9. Align Spec with Changes

```bash
/n8n.align
```

**Generates:** Alignment report:
- Detected: retry logic node added, timeout changed
- Updated: plan.md with new configuration
- Updated: spec.md with enhanced error handling
- Marked: Additional tasks as complete
- **Recommendation**: Review alignment, commit changes

---

## File Structure

After complete workflow development:

```
feature/webhook-data-processor/
├── spec.md                              # What to build
├── plan.md                              # How to build it
├── tasks.md                             # Step-by-step tasks
├── research.md                          # Node discovery & decisions
├── data-model.md                        # Entity definitions
├── quickstart.md                        # Setup & test instructions
├── checklists/
│   ├── requirements.md                  # Spec quality checklist
│   ├── architecture.md                  # Plan quality checklist
│   ├── implementation.md                # Workflow quality checklist
│   └── deployment.md                    # Pre-deployment checklist
├── contracts/
│   ├── input-contract.json              # Input data schema
│   └── output-contract.json             # Output data schema
├── workflows/
│   └── webhook-data-processor.json      # Complete workflow
├── test-data/
│   ├── valid-input.json                 # Test cases
│   ├── invalid-input.json
│   └── edge-cases.json
└── docs/
    ├── credentials-setup.md             # Credential instructions
    └── deployment.md                    # Deployment guide
```

---

## Command Reference

### `/n8n.specify [description]`
Create workflow specification from natural language
- **When**: Start of every workflow project
- **Input**: Workflow description
- **Output**: `spec.md`, `checklists/requirements.md`

### `/n8n.clarify`
Resolve ambiguities in specification
- **When**: After `/n8n.specify` if unclear requirements
- **Input**: `spec.md`
- **Output**: Updated `spec.md` with clarifications

### `/n8n.plan`
Design technical architecture and select nodes
- **When**: After specification is clear
- **Input**: `spec.md`
- **Output**: `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

### `/n8n.tasks`
Generate actionable task breakdown
- **When**: After planning is complete
- **Input**: `spec.md`, `plan.md`
- **Output**: `tasks.md`

### `/n8n.implement`
Execute tasks and build workflow
- **When**: After tasks generated and checklists passed
- **Input**: `tasks.md`, `plan.md`, `spec.md`
- **Output**: `workflows/[name].json`, test data, documentation

### `/n8n.analyze`
Validate consistency and quality
- **When**: After implementation, before deployment
- **Input**: All artifacts
- **Output**: Analysis report with findings and recommendations

### `/n8n.align`
Sync specifications with workflow implementation
- **When**: After manual workflow edits, mid-implementation, before deployment
- **Input**: Workflow JSON + git changes
- **Output**: Updated spec.md, plan.md, tasks.md, quickstart.md
- **Options**: `--base=<rev>`, `--dry-run`, `--write=auto|ask`

### `/n8n.checklist [focus]`
Generate custom quality checklist
- **When**: Any phase for quality validation
- **Input**: Context from spec/plan/workflow
- **Output**: `checklists/[type].md`

---

## Best Practices

### 1. Always Start with Specification

Don't jump into building. Spend time on clear requirements.

**Bad:**
```
"I'll just build it and see what happens"
→ Unclear requirements, rework, missing features
```

**Good:**
```
/n8n.specify → /n8n.clarify → /n8n.plan
→ Clear requirements, efficient implementation, complete features
```

### 2. Use Clarification Phase

Don't guess at ambiguous requirements.

**Bad:**
```
"I'll assume they want X"
→ Builds wrong thing
```

**Good:**
```
System: "Should this run hourly or daily?"
User: "Daily at 9 AM"
→ Builds right thing
```

### 3. Validate Early and Often

Use MCP tools throughout implementation.

```javascript
// Before implementing node
mcp_n8n-mcp_get_node_essentials(nodeType)

// After each phase
mcp_n8n-mcp_validate_workflow(workflow)

// Before deployment
mcp_n8n-mcp_validate_workflow(workflow)
mcp_n8n-mcp_validate_workflow_connections(workflow)
mcp_n8n-mcp_validate_workflow_expressions(workflow)
```

### 4. Use Checklists as Quality Gates

Generate and complete checklists before proceeding.

```
Spec complete → Requirements checklist → Plan
Plan complete → Architecture checklist → Implement
Implementation complete → Implementation checklist → Analyze
Analysis passed → Deployment checklist → Deploy
```

### 5. Leverage Existing Templates

Always check for existing templates before custom development.

```javascript
// In /n8n.plan phase
mcp_n8n-mcp_search_templates_by_metadata({
  category: "webhook_processing",
  complexity: "simple",
  maxSetupMinutes: 30
})
```

### 6. Document Decisions

Record WHY you made choices, not just WHAT you chose.

**In `research.md`:**
```markdown
## Decision: Node Selection for Validation

**Chosen**: Code node
**Rationale**: Complex validation logic with custom error messages
**Alternatives Considered**:
- IF node: Too limited for multiple field checks
- Function node: Code node has better debugging
```

### 7. Test Thoroughly

Don't skip edge cases and error scenarios.

**In `/n8n.implement`:**
- Test happy path ✓
- Test error scenarios ✓
- Test edge cases ✓
- Test with real data ✓

### 8. Analyze Before Deploying

Always run `/n8n.analyze` before production deployment.

```bash
/n8n.analyze

# If CRITICAL issues found → Fix
# If HIGH issues found → Consider fixing
# If MEDIUM/LOW only → Document and deploy
```

### 9. Consider Workflow Decomposition

Let the planning phase analyze whether complex workflows should be split.

**Don't force decomposition:**
```
❌ "I want 5 sub-workflows" (arbitrary)
❌ Decompose every workflow by default
❌ Skip decomposition for 50+ node workflows
```

**Let analysis guide you:**
```
✅ Run /n8n.plan and review decomposition recommendation
✅ Trust the criteria-based decision
✅ Consider reusability opportunities
✅ Think about team collaboration needs
```

**Folder structure for decomposed workflows:**
```
workflows/
├── simple-webhook/                 # Single workflow
│   └── main.json
├── order-processing/               # Decomposed workflow family
│   ├── main.json                   # Parent orchestrator
│   ├── validate-order.json         # Sub-workflow
│   ├── process-payment.json        # Sub-workflow
│   ├── update-inventory.json       # Sub-workflow
│   └── send-confirmation.json      # Sub-workflow (reusable)
└── notification-system/            # Another workflow family
    ├── main.json
    └── send-confirmation.json      # Symlink or copy of reusable component
```

**Communication patterns:**
- **Execute Workflow node**: Best for synchronous sub-workflows that return data
- **Webhook chain**: Good for async sub-workflows with loose coupling
- **Queue-based**: Best for high-volume, distributed processing

### 10. Keep Specs Aligned

Run `/n8n.align` after manual workflow edits to prevent spec drift.

**Triggers for alignment:**
- After editing workflow in n8n UI
- After emergency hotfixes to production workflows
- Before updating workflow documentation
- When onboarding new team members (ensure docs match reality)

```bash
# After manual changes
/n8n.align

# Review alignment report
# Approve changes
# Commit updated specs
git add feature/my-workflow/
git commit -m "docs: align spec with workflow changes"
```

**Why this matters:**
- Prevents documentation rot
- Ensures spec remains source of truth
- Makes future changes predictable
- Enables accurate handoffs

---

## Common Patterns

### Pattern 1: API Integration Workflow

```
Spec: Process API data hourly, validate, transform, store
↓
Clarify: Which API? Auth method? Error handling?
↓
Plan: Schedule trigger → HTTP Request → Code validation → Set transform → Postgres
↓
Tasks: 18 tasks across 7 phases
↓
Implement: Complete workflow with error handlers
↓
Analyze: Validation passed, deploy ready
```

### Pattern 2: Webhook Handler

```
Spec: Receive webhook, validate, process, respond
↓
Plan: Webhook trigger → IF validation → Process branches → Respond
↓
Implement: Sync response, async processing
↓
Test: Invalid input, timeout handling, concurrent requests
```

### Pattern 3: AI Agent Workflow

```
Spec: Chat-triggered AI agent with tools
↓
Plan: Chat trigger → AI Agent → Tool nodes → Response
↓
Implement: Tool selection, error handling, context management
↓
Validate: Tool connections, LLM configuration, fallback behavior
```

### Pattern 4: Data Processing Pipeline

```
Spec: Batch process data, transform, load to warehouse
↓
Plan: Schedule trigger → Split batches → Transform → Load → Notify
↓
Implement: Parallel processing, error recovery, progress tracking
↓
Test: Large volumes, failures, partial processing
```

### Pattern 5: Complex Workflow with Decomposition

```
Spec: Order processing system (validation, payment, inventory, notification)
↓
Clarify: Payment provider? Inventory system? Notification channels?
↓
Plan: Decomposition analysis → 4 distinct domains → Split into sub-workflows
  - main.json: Orchestrator
  - validate-order.json: Input validation
  - process-payment.json: Payment handling
  - update-inventory.json: Inventory management
  - send-confirmation.json: Customer notification
↓
Tasks: Generate tasks for each sub-workflow + parent orchestration
↓
Implement: Build 5 workflows in workflows/order-processing/ folder
↓
Test: Unit test each sub-workflow, integration test full flow
↓
Analyze: Validate all sub-workflows + parent coordination
```

**Decomposition Indicators:**
- Original estimate: 40+ nodes
- After decomposition: 5 workflows × 8 nodes average = manageable
- Reusable components: send-confirmation.json used by 3 other parent workflows
- Parallel execution: validate + check-inventory run concurrently
- Team collaboration: Different devs own payment vs inventory logic

---

## Comparison: Traditional vs. Speckit

### Traditional Approach

```
1. Get vague requirement
2. Start building in n8n UI
3. Realize requirement unclear
4. Ask questions mid-build
5. Rebuild parts of workflow
6. Test, find issues
7. Fix issues
8. Deploy, hope it works
9. Issues in production
10. Emergency fixes

Time: 2-3 days
Rework: 40%
Documentation: Minimal
Quality: Variable
```

### Speckit Approach

```
1. /n8n.specify (30 min)
2. /n8n.clarify (15 min)
3. /n8n.plan (45 min)
4. /n8n.checklist (10 min)
5. /n8n.tasks (15 min)
6. /n8n.implement (2-3 hours)
7. /n8n.analyze (15 min)
8. Deploy with confidence

Time: 1-1.5 days
Rework: 5%
Documentation: Complete
Quality: Consistent, high
```

**Savings:** 40-50% time reduction, 90% less rework, complete documentation

---

## Integration with Existing n8n Commands

The n8n Speckit complements existing n8n commands:

### Use `/n8n.build` for quick workflows
- **When**: Simple workflows, prototypes, well-defined requirements
- **Process**: Requirements → Clarify → Generate workflow

### Use **n8n Speckit** for production workflows
- **When**: Complex workflows, team projects, long-term maintenance
- **Process**: Specify → Clarify → Plan → Tasks → Implement → Analyze

### Use `/n8n.code` for conversions
- **When**: Converting existing code to n8n
- **Then**: Use `/n8n.analyze` to validate result

### Use `/n8n.fix` for debugging
- **When**: Existing workflow has issues
- **Then**: Use `/n8n.analyze` to find all issues systematically

---

## Testing Strategies

The n8n Speckit integrates multiple testing levels to ensure workflow quality:

### Testing Levels

```
1. Structural Validation (MCP) ─→ < 1 second
2. CLI Execution Testing     ─→ < 30 seconds  
3. End-to-End Testing        ─→ < 5 minutes
4. Visual Regression         ─→ < 5 seconds
```

### 1. Structural Validation (MCP Tools)

**Purpose**: Validate workflow structure, connections, and expressions
**When**: After each implementation phase, before deployment
**Tool**: n8n MCP validation tools
**Speed**: Fast (< 1 second)

```javascript
// Automated structural validation
mcp_n8n-mcp_validate_workflow(workflow)
mcp_n8n-mcp_validate_workflow_connections(workflow)
mcp_n8n-mcp_validate_workflow_expressions(workflow)
```

**Catches:**
- Invalid JSON structure
- Missing required node fields
- Disconnected/orphaned nodes
- Invalid node type references
- Circular dependencies
- Malformed expressions
- Invalid node references

**Integration**: Built into `/n8n.implement` and `/n8n.analyze`

---

### 2. CLI Execution Testing (Integration Tests)

**Purpose**: Execute workflow and validate outputs
**When**: Integration testing, CI/CD pipelines
**Tool**: `n8n execute` CLI + Jest/Mocha
**Speed**: Medium (< 30 seconds)

**Setup:**
```bash
npm install --save-dev jest

# package.json
{
  "scripts": {
    "test": "jest",
    "test:execution": "jest tests/workflow.test.js"
  }
}
```

**Example Test:**
```javascript
import { execSync } from 'child_process';

test('workflow returns expected output', () => {
  const output = execSync(
    'n8n execute --id <workflow-id>',
    { encoding: 'utf8' }
  );
  const result = JSON.parse(output);
  expect(result[0].json.status).toBe('success');
  expect(result[0].json.recordsProcessed).toBeGreaterThan(0);
});

test('workflow handles invalid input', () => {
  try {
    execSync('n8n execute --id <workflow-id>', {
      input: JSON.stringify({invalid: 'data'}),
      encoding: 'utf8'
    });
  } catch (error) {
    expect(error.message).toContain('validation');
  }
});
```

**Test Cases:**
- Happy path execution
- Error scenario handling
- Edge cases (empty input, large volume, malformed data)
- Data transformation validation
- Output schema compliance

**Integration**: Generated as tasks in `/n8n.tasks`, executed in `/n8n.implement`

---

### 3. End-to-End Testing (Behavior Validation)

**Purpose**: Validate external effects and integrations
**When**: Pre-production smoke tests, production monitoring
**Tools**: curl, Playwright, Cypress, Postman
**Speed**: Slow (< 5 minutes)

**For Webhook Workflows:**
```bash
#!/bin/bash
# e2e-test.sh

WEBHOOK_URL="https://n8n.example.com/webhook/test"

# Trigger workflow
response=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d @test-data/valid-input.json)

# Validate response
echo "$response" | jq -e '.success == true' || exit 1

# Validate side effects
# Check database record created
psql -c "SELECT COUNT(*) FROM records WHERE created_at > NOW() - INTERVAL '1 minute'" | grep -q "1"

# Check Slack notification sent
# Check file generated
# etc.

echo "✓ E2E test passed"
```

**Validation Points:**
- HTTP webhook responses
- Database records created/updated
- External API calls made
- Notifications sent (Slack, email)
- Files generated/modified
- Third-party service state changes

**Tools:**
- **curl**: Simple HTTP testing
- **Playwright/Cypress**: Complex UI interactions
- **Postman**: API testing collections
- **Database clients**: Direct DB validation

---

### 4. Visual Regression Testing (Config Validation)

**Purpose**: Detect accidental workflow configuration changes
**When**: CI validation, preventing unintended changes
**Tool**: JSON diff + Git
**Speed**: Fast (< 5 seconds)

**Setup:**
```bash
#!/bin/bash
# test-visual-regression.sh

WORKFLOW_FILE="workflows/my-workflow.json"
BASELINE_FILE="test-snapshots/my-workflow-baseline.json"

# Create baseline on first run
if [ ! -f "$BASELINE_FILE" ]; then
  cp "$WORKFLOW_FILE" "$BASELINE_FILE"
  git add "$BASELINE_FILE"
  exit 0
fi

# Compare against baseline
if diff -u "$BASELINE_FILE" "$WORKFLOW_FILE" > /dev/null; then
  echo "✓ No configuration changes"
else
  echo "⚠ Configuration changed:"
  diff -u "$BASELINE_FILE" "$WORKFLOW_FILE" | head -20
  echo "If intentional: cp $WORKFLOW_FILE $BASELINE_FILE"
  exit 1
fi
```

**Detects:**
- Node configuration changes
- Connection modifications
- Expression updates
- Parameter changes
- Position modifications

**Use Cases:**
- Prevent accidental edits
- Track configuration history
- Audit workflow changes

---

### CI/CD Integration

**GitHub Actions Example:**

```yaml
name: n8n Workflow Tests

on:
  push:
    paths:
      - 'workflows/**'
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install n8n
        run: npm install -g n8n
      
      - name: Install dependencies
        run: npm install
      
      - name: MCP Validation (Fast)
        run: npm run test:mcp
        continue-on-error: false
      
      - name: CLI Execution Tests (Medium)
        run: npm run test:execution
        continue-on-error: false
      
      - name: Visual Regression (Fast)
        run: bash test-visual-regression.sh
        continue-on-error: true
      
      - name: E2E Tests (Slow)
        run: bash e2e-test.sh
        if: github.event_name == 'push'
        continue-on-error: true
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
```

**Using Testcontainers for Isolated Testing:**

For CI/CD pipelines, [Testcontainers](https://testcontainers.com/) provides isolated, reproducible n8n instances:

```javascript
import { GenericContainer } from 'testcontainers';

describe('n8n workflow integration tests', () => {
  let n8nContainer;
  let n8nUrl;

  beforeAll(async () => {
    n8nContainer = await new GenericContainer('n8nio/n8n')
      .withExposedPorts(5678)
      .withEnvironment({
        N8N_BASIC_AUTH_ACTIVE: 'false',
        N8N_DIAGNOSTICS_ENABLED: 'false'
      })
      .start();
    
    n8nUrl = `http://localhost:${n8nContainer.getMappedPort(5678)}`;
  });

  afterAll(async () => {
    await n8nContainer.stop();
  });

  test('workflow executes correctly', async () => {
    // Use n8n API to upload and execute workflow
    // Validate results
  });
});
```

**Benefits:**
- ✅ Isolated environment per test run
- ✅ No dependency on external n8n instance
- ✅ Automatic cleanup
- ✅ Works in any CI/CD platform (GitHub Actions, GitLab CI, Jenkins, etc.)

**Pipeline Stages:**
1. **MCP Validation** - Fast, blocks on failure
2. **CLI Execution** - Medium, blocks on failure
3. **Visual Regression** - Fast, warns on changes
4. **E2E Tests** - Slow, warns on failure

---

### Testing Best Practices

**1. Test Data Organization**
```
test-data/
├── valid-input.json          # Happy path
├── invalid-input.json        # Validation failures
├── empty-input.json          # Edge case: empty
├── large-volume.json         # Edge case: volume
├── malformed.json            # Edge case: malformed
└── error-*.json              # Error scenarios
```

**2. Test Isolation**
- Each test should be independent
- Clean up test data after execution
- Use separate test environments
- Mock external services when appropriate

**3. Test Coverage Targets**
- **Structural**: 100% (all nodes validated)
- **CLI Execution**: 80%+ (all critical paths)
- **E2E**: 60%+ (key user journeys)
- **Visual Regression**: 100% (all workflows tracked)

**4. Test Naming Conventions**
```javascript
// Good
test('webhook validates required fields and rejects invalid email')

// Bad
test('test 1')
```

**5. Failure Reporting**
```javascript
test('workflow processes orders', () => {
  const result = execSync('n8n execute --id <workflow-id>').toString();
  const output = JSON.parse(result);
  
  // Good: Descriptive assertion
  expect(output[0].json.ordersProcessed)
    .withContext('Expected at least 1 order processed')
    .toBeGreaterThan(0);
});
```

---

### Testing Decision Tree

**Choose your testing approach:**

```
Is this a simple workflow (< 5 nodes)?
├─ Yes → MCP Validation only
└─ No → Is it production-critical?
    ├─ Yes → All 4 testing levels
    └─ No → MCP + CLI Execution

Does it have external integrations?
├─ Yes → Add E2E tests
└─ No → Skip E2E

Is configuration stability important?
├─ Yes → Add Visual Regression
└─ No → Skip Visual Regression
```

---

### Test Artifacts Generated

After running tests, you'll have:

```
feature/webhook-processor/
├── workflows/
│   └── webhook-processor.json
├── tests/
│   ├── workflow.test.js           # Jest tests
│   ├── e2e-test.sh                # E2E test script
│   └── test-visual-regression.sh  # Snapshot comparison
├── test-data/
│   ├── valid-input.json
│   ├── invalid-input.json
│   └── edge-cases.json
├── test-results/
│   ├── happy-path.json
│   ├── error-scenarios.json
│   └── coverage-report.html
├── test-snapshots/
│   └── webhook-processor-baseline.json
└── .github/workflows/
    └── test-workflow.yml
```

---

### Testing Philosophy

**The n8n Speckit testing approach:**

✅ **Automated where possible** - MCP and CLI tests run without human intervention
✅ **Multi-level coverage** - From structure to behavior
✅ **Fast feedback** - MCP validation in < 1 second
✅ **Production-ready** - E2E tests validate real behavior
✅ **CI/CD integrated** - Blocks bad deployments
✅ **Change detection** - Visual regression catches accidents

**Not perfect, but practical:**
- ❌ No official n8n testing framework (yet)
- ✅ Community-proven patterns
- ✅ Reliable automation
- ✅ Good-enough coverage

---

## Troubleshooting

### "Too much overhead for simple workflows"

**Solution**: Use appropriate commands for complexity
- Simple (< 5 nodes): Use `/n8n.build`
- Medium (5-15 nodes): Use Specify → Plan → Implement
- Complex (> 15 nodes): Use full Speckit workflow

### "Clarification questions slow me down"

**Solution**: Clarification prevents costly rework
- Time spent: 5-15 minutes
- Time saved: Hours of rebuilding
- Skip clarification only for prototypes

### "Generated tasks are too detailed"

**Solution**: Detailed tasks prevent missed steps
- Use tasks as checklist, not rigid script
- Mark complete [X] as you go
- Skip tasks for trivial operations

### "/n8n.analyze finds too many issues"

**Solution**: Issues exist whether found or not
- CRITICAL issues would cause production failures
- HIGH issues would require urgent fixes
- Better to find before deployment than after

---

## FAQ

**Q: Do I need to use all commands for every workflow?**
A: No. Use appropriate commands for complexity:
- Simple workflows: `/n8n.build`
- Production workflows: Full Speckit
- Code conversions: `/n8n.code` + `/n8n.analyze`

**Q: Can I skip the clarification phase?**
A: Yes, but only if requirements are completely clear. Clarification prevents rework.

**Q: How long does the full Speckit process take?**
A: 1-2 days for complex workflows vs. 2-3 days traditional (with less rework).

**Q: Can I use this for existing workflows?**
A: Yes! Use `/n8n.specify` to create initial spec from workflow description, then `/n8n.align` to sync with actual workflow JSON.

**Q: What if I disagree with the generated plan?**
A: Plans are editable. Modify `plan.md`, then regenerate tasks.

**Q: Do checklists slow down development?**
A: No. They catch issues early, preventing costly late-stage fixes.

**Q: Is this overkill for personal projects?**
A: Use full workflow for projects you'll maintain long-term. Use `/n8n.build` for quick experiments.

**Q: What if I manually edit the workflow in n8n UI?**
A: Run `/n8n.align` to sync the spec with your changes. It analyzes the workflow JSON and updates documentation automatically.

**Q: How do I prevent spec/workflow drift?**
A: Run `/n8n.align` after any manual workflow changes. Use `--dry-run` to preview changes before applying.

**Q: When should I decompose a workflow into sub-workflows?**
A: Let `/n8n.plan` analyze and recommend. Generally decompose if:
- Expected to exceed 25 nodes
- Has 3+ distinct logical domains (validation, processing, notification)
- Contains reusable logic needed by other workflows
- Requires parallel execution of independent operations
- Benefits from error isolation between components

**Q: How do sub-workflows communicate?**
A: Three main patterns supported:
1. **Execute Workflow node** (recommended) - Synchronous, returns data to parent
2. **Webhook chain** - Asynchronous, loose coupling
3. **Queue-based** - High-volume distributed processing

The planning phase recommends the best pattern for your use case.

**Q: Can I share sub-workflows across parent workflows?**
A: Yes! That's a key benefit. Example: `send-confirmation.json` can be reused by order-processing, support-ticket, and registration workflows. Place shared sub-workflows in a common folder or use symlinks.

**Q: What if I disagree with the decomposition recommendation?**
A: The recommendation is based on criteria, but you decide. If plan suggests decomposition but you prefer single workflow, document the rationale in plan.md. If plan suggests single but you want to decompose, manually update the decomposition section with your reasoning.

---

## Summary

The **n8n Speckit** brings software engineering rigor to n8n workflow development:

✅ **Clear specifications** prevent scope creep  
✅ **Early validation** catches issues before implementation  
✅ **Quality gates** ensure nothing is missed  
✅ **Complete documentation** enables maintenance and collaboration  
✅ **Systematic approach** reduces rework and improves consistency  
✅ **MCP validation** ensures structural correctness  
✅ **Smart decomposition** splits complex workflows into manageable sub-workflows  
✅ **Spec-workflow alignment** prevents documentation drift  
✅ **Production-ready** workflows that work reliably  

**Complete workflow lifecycle:**

```bash
# Specify what to build
/n8n.specify [your workflow description]

# Plan how to build it
/n8n.plan

# Implement the workflow
/n8n.implement

# Validate before deployment
/n8n.analyze

# Keep specs aligned with reality
/n8n.align
```

**Key innovation**: The `/n8n.align` command ensures your specification remains the single source of truth, automatically syncing with workflow changes.

## Acknowledgements

This project is inspired by and adapted from GitHub's [Spec-Kit](https://github.com/github/spec-kit), which pioneered the spec-driven development methodology for software engineering. The n8n Speckit applies these proven principles specifically to n8n workflow development, bringing systematic quality and documentation practices to the n8n ecosystem.

Special thanks to:
- **GitHub's Spec-Kit team** for creating the foundational spec-driven development framework
- **The n8n community** for building an amazing workflow automation platform
- **n8n-MCP contributors** for enabling programmatic n8n workflow interaction through the Model Context Protocol

---

Happy workflow building! 🚀

