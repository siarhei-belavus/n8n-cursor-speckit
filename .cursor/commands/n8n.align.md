---
name: n8n-align
description: Align workflow specification artifacts with actual workflow implementation by reconciling changes and updating spec documents
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Goal

Ensure the specification is the first-class source of truth by carefully aligning it with the actual workflow implementation (workflow JSON + tests + docs). This command reconciles drift between spec/plan/tasks and the implemented workflow using git diff and structured analysis.

**Use Cases:**
- After manual workflow edits in n8n UI
- Mid-implementation to sync spec with progress
- After `/n8n.implement` to ensure completeness
- Before deployment to validate documentation accuracy

## Operating Constraints

**WRITE MODE with safeguards**: Edits applied to spec artifacts only; never change workflow JSON here.

**Constitution Authority**: The project constitution (`.specify/memory/constitution.md`) is non-negotiable. All alignment MUST comply with its gates. If governance gaps are discovered, prepare a Constitution Update Proposal (do not write automatically).

**All paths must be absolute**. No workflow execution or deployment commands are run by this command.

## Parameters

Optional parameters parsed from `$ARGUMENTS`:

- `--base=<rev>`: Base git revision to diff against (default: `main`)
- `--dry-run`: Analyze and propose changes, but do not write
- `--write=auto|ask` (default: `auto`): Apply edits automatically or ask before each file change
- `--feature=<abs-path>`: Manually specify feature directory (else auto-detected)

## Execution Steps

### 1. Prerequisite Discovery (Absolute Paths)

**Option A: Use check-prerequisites script**
```bash
.specify/scripts/bash/check-prerequisites.sh --json --include-tasks
```
Parse JSON for: `FEATURE_DIR`, `AVAILABLE_DOCS`

**Option B: Manual specification**
If `--feature` provided, use as `FEATURE_DIR`

**Option C: Auto-detection**
Prefer (in order):
1. Most recently modified subdirectory under `specs/**/` containing `spec.md`
2. Directory containing currently open `spec.md`
3. Abort with guidance if none found

**Derive absolute paths:**
```
SPEC = FEATURE_DIR/spec.md
PLAN = FEATURE_DIR/plan.md
RESEARCH = FEATURE_DIR/research.md
DATA_MODEL = FEATURE_DIR/data-model.md
QUICKSTART = FEATURE_DIR/quickstart.md
CONTRACTS_DIR = FEATURE_DIR/contracts/
TASKS = FEATURE_DIR/tasks.md
WORKFLOWS_DIR = FEATURE_DIR/workflows/
TEST_DATA_DIR = FEATURE_DIR/test-data/
TESTS_DIR = FEATURE_DIR/tests/
```

**Abort if missing**: `FEATURE_DIR` or `SPEC` → instruct to run `/n8n.specify` first

---

### 2. Determine Base Revision

- If `$ARGUMENTS` contains `--base=<rev>`, use that
- Else prefer `main`; fallback to `origin/main`; else `remotes/origin/HEAD`
- Validate existence: if not found, abort with guidance (`git branch -a`)

---

### 3. Compute Implementation Delta (Git Diff)

Execute:
```bash
git diff <BASE> --name-status
```

Capture: Added (A), Modified (M), Deleted (D) files

**Categorize changes:**

#### Workflow Changes
- `workflows/**/*.json` - Workflow definition files
- Pattern: Modified workflow structure, nodes, connections, parameters

#### Test Changes
- `test-data/**/*.json` - Test data files
- `tests/**/*.js`, `tests/**/*.sh` - Test scripts (Jest, bash, e2e)
- `test-snapshots/**/*.json` - Visual regression baselines
- `.github/workflows/**` - CI/CD pipeline changes

#### Documentation Changes
- `docs/**`, `README.md`, `quickstart.md`
- Credential setup, deployment guides

#### Configuration Changes
- `package.json` - Test dependencies, scripts
- `.env.example` - Environment variables
- Credential documentation files

---

### 4. Load Primary Sources and Constraints

Read authoritative documents (PRIMARY SOURCES FIRST):

**Product Requirements:**
- `docs/prd.md`, `PRODUCT.md` - Business requirements

**Architecture/Governance:**
- `.specify/memory/constitution.md` - Project principles
- `AGENTS.md`, `CONTRIBUTING.md` - Development guidelines
- Top-level `README.md` - High-level intent

**Treat these as authoritative intent** - alignment MUST NOT contradict them.

---

### 5. Analyze Workflow Implementation

For each modified workflow JSON file:

#### A. Load and Parse Workflow

```javascript
const workflow = JSON.parse(readFile(workflowPath));

// Extract workflow metadata
const workflowName = workflow.name;
const nodeCount = workflow.nodes.length;
const triggerType = workflow.nodes.find(n => n.type.includes('Trigger'))?.type;
```

#### B. Analyze Workflow Structure

**Nodes Analysis:**
```javascript
const nodeInventory = workflow.nodes.map(node => ({
  id: node.id,
  name: node.name,
  type: node.type,
  typeVersion: node.typeVersion,
  purpose: inferPurpose(node), // From name or parameters
  parameters: Object.keys(node.parameters),
  credentials: node.credentials ? Object.keys(node.credentials) : []
}));
```

**Connections Analysis:**
```javascript
const connectionFlow = analyzeConnections(workflow.connections);
// Produces: Trigger → Node1 → Node2 → Output
//           with error branches, parallel paths
```

**Integration Points:**
```javascript
const integrations = workflow.nodes
  .filter(n => isIntegrationNode(n))
  .map(n => ({
    service: extractServiceName(n.type),
    operation: n.parameters.operation || n.parameters.resource,
    authentication: n.credentials ? Object.keys(n.credentials)[0] : 'none'
  }));
```

**Error Handling:**
```javascript
const errorHandlers = workflow.nodes.filter(n => 
  n.name.toLowerCase().includes('error') || 
  n.parameters.onError
);
```

**Data Transformations:**
```javascript
const transformations = workflow.nodes
  .filter(n => n.type.includes('set') || n.type.includes('code'))
  .map(n => extractTransformationLogic(n));
```

#### C. Compare Against Spec/Plan

**Match nodes to requirements:**
```javascript
// For each FR in spec.md, find implementing nodes
const requirementCoverage = specRequirements.map(fr => ({
  requirement: fr.id,
  implementedBy: findImplementingNodes(fr, workflow.nodes),
  status: getImplementationStatus(fr, workflow.nodes)
}));
```

**Match nodes to plan architecture:**
```javascript
// For each planned node, check if implemented
const planCompliance = plan.nodeArchitecture.map(planned => ({
  plannedNode: planned.id,
  actualNode: findMatchingNode(planned, workflow.nodes),
  differences: compareConfiguration(planned, actualNode)
}));
```

**Detect undocumented nodes:**
```javascript
const undocumentedNodes = workflow.nodes.filter(node => 
  !isInPlan(node, plan.nodeArchitecture) &&
  !isInSpec(node, specRequirements)
);
```

---

### 6. Build Alignment Plan (Internal)

Map discovered changes to spec updates:

#### Workflow-Level Changes → `spec.md`

**New functionality discovered:**
- New nodes performing user-visible operations → Add to Functional Requirements
- New data validations → Add to Data Requirements
- New error scenarios → Add to Error Scenarios
- New edge case handling → Add to Edge Cases

**Modified functionality:**
- Changed validation rules → Update acceptance criteria
- Modified transformations → Update data transformation descriptions
- Changed error behavior → Update error scenario descriptions

#### Node Architecture Changes → `plan.md`

**Node additions:**
```markdown
Update Node Architecture section:
- Add new node to Node Selection table
- Add configuration details
- Document rationale for node choice
```

**Node modifications:**
```markdown
Update Node Architecture:
- Modify node parameters in configuration snippets
- Update expressions if changed
- Adjust connection architecture diagram
```

**Integration changes:**
```markdown
Update Integration Details (INT-N):
- Add new external services
- Update authentication methods
- Modify API endpoints or operations
- Update error handling strategies
```

#### Testing Changes → `plan.md` Testing Strategy + `tasks.md`

**New tests added:**
- Update Testing Strategy with new test types
- Add test tasks to tasks.md if missing
- Update test coverage metrics

**Test data changes:**
- Document new test scenarios
- Update edge case coverage

#### Configuration Changes → `quickstart.md`

**Environment variables:**
- Add new variables with descriptions
- Update credential requirements
- Document configuration examples

**Setup instructions:**
- Update installation steps
- Modify deployment procedures
- Adjust testing instructions

#### Tasks Completion → `tasks.md`

**Mark completed tasks:**
```markdown
- [X] T001: Initialize workflow structure
- [X] T004: Implement trigger node
```

**Add missing tasks:**
```markdown
- [ ] T0XX: Document new integration with [Service]
- [ ] T0XX: Update error handling for [Scenario]
```

---

### 7. Safety Gates Before Writes

#### Critical Ambiguities Check

**STOP and report if:**
- Conflicting behavior: Workflow does X but spec says Y
- Unclear intent: Major changes with no documentation
- Missing rationale: New integrations without justification
- Constitution violations: Changes conflict with principles

**Report blocking list:**
```markdown
❌ Critical Ambiguities Detected

1. **Spec-Implementation Conflict**
   - Spec: FR-3 requires email validation
   - Implementation: No email validation node found
   - Action: Update spec or add validation node?

2. **Undocumented Integration**
   - Workflow uses Airtable integration
   - Not mentioned in spec or plan
   - Action: Why was this added? Update requirements?

Recommended: Run `/n8n.clarify` to resolve these questions.
```

#### Dry Run Check

If `--dry-run` set:
- Output full Alignment Report with proposed edits
- Show diffs for each file
- STOP without writing

---

### 8. Apply Alignment Edits (Spec Artifacts Only)

**Edit Policy:**
- Minimal diff, precise edits
- Preserve section ordering and headings
- Update existing bullets over adding new ones (avoid duplication)
- Remove stale/contradictory text
- Use explicit, measurable statements
- Use absolute paths when listing files

#### A. Update `spec.md`

**Functional Requirements:**
```markdown
Add/update FRs for new workflow capabilities:

### FR-N: [New Functionality]
**Description**: [What the workflow does - discovered from nodes]
**Acceptance Criteria**:
- [ ] [Testable criterion from workflow behavior]
**Priority**: [P1|P2|P3]
**Implemented By**: workflows/[name].json nodes: [node-ids]
```

**Data Requirements:**
```markdown
Update Input/Output Data sections:
- Add newly validated fields
- Document transformation rules from Set/Code nodes
- Update schema based on actual workflow processing
```

**Integration Requirements:**
```markdown
Add/update INT-N for discovered integrations:

### INT-N: [Service Name]
**Purpose**: [Inferred from node configuration]
**Operations**: [From node parameters]
**Authentication**: [From credentials]
**Implemented By**: Node [node-id]
```

**Error Scenarios:**
```markdown
Add error scenarios from error handler nodes:

### ES-N: [Error Type]
**Trigger**: [What causes this - from error detection logic]
**Detection**: [How workflow detects - from node configuration]
**Response**: [What workflow does - from error handler nodes]
**Implemented By**: Error handler node [node-id]
```

**Success Criteria:**
```markdown
Update success criteria based on actual workflow performance:
- Execution time measured from test results
- Success rate from production logs
- Data accuracy from validation tests
```

#### B. Update `plan.md`

**Node Architecture:**
```markdown
Update Node Selection table with actual nodes:

| Node ID | Node Type | Purpose | Configuration | Status |
|---------|-----------|---------|---------------|--------|
| [actual-id] | [actual-type] | [discovered purpose] | [key params] | ✓ Implemented |
```

**Architectural Flow:**
```markdown
Update flow diagram to match actual connections:

```
[Actual Trigger] → [Actual Node 1] → [Actual Node 2] → [Output]
                        ↓ (error)
                   [Error Handler] → [Notification]
```
```

**Data Flow Design:**
```markdown
Update transformations table with actual expressions:

| Stage | Transformation | Node | Expression |
|-------|----------------|------|------------|
| 1 | [actual transform] | [node-id] | ={{ $json.field }} |
```

**Integration Details:**
```markdown
Update INT-N sections with actual configurations:

### Configuration:
```json
{
  "parameters": {
    // Actual parameters from workflow JSON
  }
}
```
```

**Testing Strategy:**
```markdown
Update with actual test implementations:
- CLI execution tests: [list actual test files]
- E2E tests: [list actual test scripts]
- Visual regression: [actual baseline files]
```

#### C. Update `research.md`

```markdown
Document decisions made during implementation:

## Decision: [Topic]
**Chosen**: [Actual node type / approach used]
**Rationale**: [Inferred or documented reason]
**Alternatives Considered**: [Other nodes that could have been used]
**Trade-offs**: [Why this choice was made]
**Implementation**: Node [node-id] in workflows/[name].json
```

#### D. Update `data-model.md`

```markdown
Adjust entities based on workflow data handling:

### Entity: [EntityName]
**Processing**: Node [node-id]
**Validation**: [Actual validation from Code/IF nodes]
**Transformation**: [Actual mappings from Set nodes]
```

#### E. Update `quickstart.md`

```markdown
Sync setup instructions with actual requirements:

### Prerequisites
- n8n version: [from package.json or deployment]
- Required credentials:
  - [Actual credential types from workflow nodes]

### Configuration
Environment variables (from workflow parameters):
- `VAR_NAME`: [Purpose from node usage]

### Testing
```bash
# Actual test commands that exist
npm run test
bash tests/e2e-test.sh
```
```

#### F. Update `contracts/`

```markdown
Ensure schemas match workflow input/output:

Update input-contract.json to match webhook parameters:
Update output-contract.json to match response structure:
```

#### G. Update `tasks.md`

**Mark completed tasks:**
```markdown
Look for implemented nodes/features and mark corresponding tasks:

- [X] T004: Implement trigger node (webhook node exists)
- [X] T007: Implement input validation (Code validation node exists)
- [X] T010: Configure Slack integration (Slack node configured)
```

**Add missing tasks:**
```markdown
For undocumented work completed:

### Phase X: Additional Work

- [ ] T0XX: Document [discovered integration]
- [ ] T0XX: Update tests for [new scenario]
- [ ] T0XX: Sync spec with [implemented feature]
```

---

### 9. Constitution Update Proposal (If Needed)

**Detect globally applicable principles learned:**

Examples:
- "All workflows MUST have error notifications configured"
- "Integration nodes MUST use credential references, never hardcoded values"
- "Workflows MUST have visual regression baselines in Git"
- "All webhooks MUST include input validation"

**Proposal Format:**
```markdown
## Constitution Update Proposal

### Proposed Principle: [Principle Name]

**Rationale**: During implementation, discovered that [pattern/issue]. This should be 
enforced globally to ensure [benefit].

**Normative Statement**:
- MUST: [Mandatory requirement with testable criteria]
- SHOULD: [Recommended practice with justification]

**Evidence**: Found in workflows/[name].json:
- [Specific example from implementation]

**Impact**:
- Templates to sync: [List]
- Gates affected: [List]
- Existing workflows affected: [Estimate]

**Suggested Action**: Run `/constitution` to formalize this amendment.
```

**DO NOT write constitution automatically** - include proposal in Alignment Report only.

---

### 10. Alignment Report (Output)

Generate comprehensive report:

```markdown
# Workflow Alignment Report: [Workflow Name]

**Generated**: [Date]
**Base Revision**: [git rev]
**Feature Directory**: [FEATURE_DIR]
**Dry Run**: [yes/no]

---

## Summary

**Workflow Changes Detected**: [count]
**Test Changes Detected**: [count]
**Documentation Changes Detected**: [count]

**Spec Artifacts Updated**: [count]
- spec.md: [change summary]
- plan.md: [change summary]
- tasks.md: [change summary]
- quickstart.md: [change summary]

---

## Workflow Analysis

### Workflow: workflows/[name].json

**Nodes**: [count]
**Integrations**: [count]
**Error Handlers**: [count]
**Test Coverage**: [percentage]

**Node Inventory**:
| ID | Type | Purpose | Status |
|----|------|---------|--------|
| [id] | [type] | [purpose] | ✓ Documented / ⚠ Missing in spec |

**Connection Flow**:
```
[Visual representation of actual workflow]
```

---

## Requirement Coverage

| Requirement | Status | Implemented By | Notes |
|-------------|--------|----------------|-------|
| FR-1 | ✓ Covered | Node: [id] | Matches spec |
| FR-2 | ⚠ Partial | Node: [id] | Missing validation |
| FR-3 | ✗ Missing | - | Not implemented |
| [New] | ➕ New | Node: [id] | Needs spec update |

---

## Plan Compliance

| Planned Node | Actual Node | Status | Differences |
|--------------|-------------|--------|-------------|
| validate | validate-input | ✓ Match | None |
| api-call | external-api | ✓ Match | Timeout changed: 30s → 60s |
| - | airtable-sync | ➕ New | Not in plan |

---

## Changes Applied

### spec.md
- ➕ Added FR-5: Airtable synchronization
- ✏️ Updated FR-2: Email validation now includes format check
- ✏️ Updated INT-3: Slack authentication method corrected
- ➕ Added ES-4: Airtable rate limit error handling

### plan.md
- ✏️ Updated Node Architecture table with actual node IDs
- ✏️ Corrected connection flow diagram
- ➕ Added INT-4: Airtable integration details
- ✏️ Updated timeout configuration: API calls now 60s
- ✏️ Added visual regression test baseline to Testing Strategy

### tasks.md
- ✓ Marked T001-T015 as completed
- ➕ Added T025: Document Airtable integration
- ➕ Added T026: Update visual regression baseline

### quickstart.md
- ➕ Added Airtable credential setup instructions
- ✏️ Updated test command to include e2e-test.sh
- ✏️ Updated environment variable documentation

---

## Undocumented Changes

### Nodes Not in Spec/Plan:
1. **airtable-sync** (Node ID: airtable1)
   - Purpose: Syncs processed data to Airtable
   - Integration: Airtable API
   - Needs: Spec update (INT-4), plan documentation

2. **retry-logic** (Node ID: retry1)
   - Purpose: Retry failed API calls
   - Feature: 3 retries with exponential backoff
   - Needs: Plan update (error handling strategy)

**Recommendation**: Update spec to include these features or remove if not intended.

---

## Critical Ambiguities

[If any detected]

❌ **Ambiguity 1**: [Description]
- **Issue**: [Specific conflict]
- **Action Required**: [What needs clarification]

**Recommended**: Run `/n8n.clarify` to resolve before deployment.

---

## Constitution Update Proposal

[If applicable]

### Proposed Principle: Mandatory Error Notifications

**Rationale**: All workflows in production should notify on errors to ensure 
observability. This workflow implements error notifications, but it's not 
enforced globally.

**Normative Statement**:
- MUST: All production workflows MUST have error notification configured
- SHOULD: Error notifications SHOULD include execution ID and error details

**Suggested Action**: Run `/constitution` to formalize.

---

## Validation Results

### MCP Validation
- ✓ Workflow structure valid
- ✓ Connections valid
- ✓ Expressions valid

### Test Results
- ✓ 15/15 CLI execution tests passed
- ✓ E2E tests passed (3/3 scenarios)
- ✓ Visual regression: No unexpected changes

---

## Metrics

**Before Alignment:**
- Spec coverage: 72%
- Documented integrations: 2/3
- Completed tasks: 15/20
- Undocumented nodes: 3

**After Alignment:**
- Spec coverage: 95%
- Documented integrations: 3/3
- Completed tasks: 20/22
- Undocumented nodes: 0

---

## Next Steps

1. **Review alignment changes** - Verify spec updates are accurate
2. **Resolve ambiguities** (if any) - Run `/n8n.clarify` if needed
3. **Update constitution** (if applicable) - Run `/constitution`
4. **Commit changes**:
   ```bash
   git add [FEATURE_DIR]
   git commit -m "docs(specs): align [workflow-name] with implementation"
   ```
5. **Deploy workflow** - Proceed to `/n8n.analyze` before deployment

---

## Suggested Commit Message

```
docs(specs): align [workflow-name] with implementation (git diff [BASE])

- Added FR-5: Airtable synchronization capability
- Updated FR-2: Enhanced email validation
- Added INT-4: Airtable integration details
- Corrected timeout configuration (30s → 60s)
- Marked tasks T001-T015 as completed
- Added visual regression baseline to testing strategy
- Updated credential setup for Airtable

Workflow changes:
- 3 new nodes (airtable-sync, retry-logic, format-output)
- Modified validation logic in Code node
- Enhanced error handling with retry strategy

Resolves drift between spec and implementation.
```

---

## AICODE Markers Added

[If any]

- `spec.md:L45`: AICODE-NOTE: Airtable integration added post-planning; review requirement priority
- `plan.md:L120`: AICODE-ASK: Should retry logic be configurable or hardcoded?

---

## Files Modified

[If not --dry-run]

- ✓ spec.md (42 lines changed)
- ✓ plan.md (38 lines changed)
- ✓ tasks.md (18 lines changed)
- ✓ quickstart.md (12 lines changed)

Total changes: 110 lines across 4 files
```

---

### 11. Commit Suggestion

**Format:**
```
docs(specs): align {feature-name} with implementation (git diff {BASE})

- [Major spec update 1]
- [Major spec update 2]
- [Major plan update]
- [Tasks marked complete]

Workflow changes:
- [Node additions/modifications]
- [Integration changes]
- [Configuration changes]
```

---

## Detection & Mapping Heuristics

### Node Type Detection

**Trigger identification:**
```javascript
const triggerTypes = [
  'manualTrigger', 'webhook', 'scheduleTrigger', 
  'emailTrigger', 'chatTrigger'
];
const trigger = workflow.nodes.find(n => 
  triggerTypes.some(t => n.type.includes(t))
);
```

**Integration nodes:**
```javascript
const integrationNodes = workflow.nodes.filter(n => 
  !n.type.includes('set') && 
  !n.type.includes('code') &&
  !n.type.includes('if') &&
  !n.type.includes('switch') &&
  !isTrigger(n)
);
```

**Data transformation nodes:**
```javascript
const transformNodes = workflow.nodes.filter(n =>
  n.type.includes('set') || 
  n.type.includes('code') ||
  n.type.includes('function')
);
```

**Error handling nodes:**
```javascript
const errorNodes = workflow.nodes.filter(n =>
  n.name.toLowerCase().includes('error') ||
  n.name.toLowerCase().includes('fail') ||
  hasErrorConnections(n)
);
```

### Configuration Detection

**Credentials used:**
```javascript
const credentials = workflow.nodes
  .flatMap(n => n.credentials ? Object.keys(n.credentials) : [])
  .filter((v, i, a) => a.indexOf(v) === i); // unique
```

**Environment variables:**
```javascript
const envVars = workflow.nodes
  .flatMap(n => extractEnvReferences(n.parameters))
  .filter((v, i, a) => a.indexOf(v) === i);
```

**Expressions used:**
```javascript
const expressions = workflow.nodes
  .flatMap(n => extractExpressions(n.parameters))
  .map(expr => ({
    node: n.id,
    expression: expr,
    references: parseExpressionReferences(expr)
  }));
```

### Test Detection

**CLI tests:**
- Files: `tests/**/*.test.js`, `tests/**/*.spec.js`
- Framework: Jest/Mocha detection from package.json

**E2E tests:**
- Files: `tests/**/e2e-*.sh`, `tests/**/*-e2e.js`
- Type: Bash scripts or Playwright/Cypress

**Visual regression:**
- Files: `test-snapshots/**/*-baseline.json`
- Purpose: Configuration change detection

---

## Behavior Rules

### Writing Rules

- **Never modify workflow JSON** - only spec/docs/tasks artifacts
- **Preserve formatting** - maintain section order and heading hierarchy
- **Update in place** - prefer modifying existing bullets over duplication
- **Remove stale content** - delete contradictory text when updating
- **Use absolute paths** - for all file references
- **Document decisions** - add AICODE markers for non-trivial choices

### Idempotency

- **Detect duplicates** - check if equivalent content already exists
- **Normalize terminology** - use consistent naming per spec glossary
- **Repeated runs** - should produce same spec without duplication

### Architecture Boundaries

- **Respect primary sources** - don't contradict governance docs
- **No implementation leakage** - keep spec business-focused
- **Maintain abstraction** - don't expose node internals in spec unnecessarily

---

## Failure Modes & Guidance

### Base Branch Not Found
```
❌ Error: Base branch 'main' not found

Available branches:
  main
  develop
  feature/webhook-processor
  
Suggestion: Specify base explicitly:
  /n8n.align --base=develop
```

### Missing Feature Directory
```
❌ Error: No feature directory found

Suggestions:
1. Run /n8n.specify to create initial spec
2. Specify feature directory manually:
   /n8n.align --feature=/path/to/feature
3. Open spec.md file to auto-detect feature directory
```

### Constitution Conflicts
```
❌ Error: Alignment conflicts with constitution

Conflicts detected:
1. Node 'api-call' uses hardcoded API key
   - Violates: Principle 3 (Credentials must use references)
   - Location: workflows/[name].json node 'api-call'

Recommendation: Fix violations in workflow before running align, or 
propose constitution amendment if practice should be allowed.
```

### Critical Ambiguities
```
❌ Error: Critical ambiguities detected

Cannot align due to unresolved conflicts:
1. Spec requires email validation, but no validation node found
2. Workflow has Airtable integration not mentioned in requirements

Recommendation: Run /n8n.clarify to resolve these questions first.
```

---

## Idempotency Checks

Before writing each change:

1. **Check for semantic duplicates**:
   ```javascript
   if (existingBulletSemanticallySame(newBullet, existingBullets)) {
     updateInPlace(existingBullet, newBullet);
   } else {
     append(newBullet);
   }
   ```

2. **Normalize terminology**:
   ```javascript
   const normalized = normalizeTerms(text, specGlossary);
   ```

3. **Validate no contradictions**:
   ```javascript
   if (contradicts(newContent, existingContent)) {
     replaceAndDocumentChange(existingContent, newContent);
   }
   ```

---

## Output Files

**Always Generated:**
1. Alignment Report (markdown, printed to console or file)

**Generated Unless --dry-run:**
2. Updated spec.md
3. Updated plan.md
4. Updated tasks.md
5. Updated quickstart.md
6. Updated research.md (if exists)
7. Updated data-model.md (if exists)
8. Updated contracts/* (if exists)

**Conditionally Generated:**
9. Constitution Update Proposal (if governance gaps detected)
10. AICODE markers (if non-trivial decisions need documentation)

---

## Context

$ARGUMENTS

