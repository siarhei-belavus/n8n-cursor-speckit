---
name: n8n-plan
description: Generate technical design and node architecture for n8n workflow from specification
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Goal

Transform the workflow specification into a concrete technical design with node selections, data flow architecture, and implementation-ready configuration details.

## Execution Steps

### 1. Setup

Run `.specify/scripts/bash/setup-plan.sh --json` from repo root and parse JSON for:
- `FEATURE_SPEC`
- `IMPL_PLAN`
- `SPECS_DIR`
- `BRANCH`

All paths must be absolute.

### 2. Load Context

Read:
- `FEATURE_SPEC`: Workflow requirements and specifications
- `.specify/memory/constitution.md`: Project principles and standards
- `IMPL_PLAN`: Template (already copied by setup script)

### 3. Execute Planning Workflow

Follow the n8n-specific planning structure:

## Planning Document Structure

Create `IMPL_PLAN` with this content:

```markdown
# Implementation Plan: [WORKFLOW_NAME]

**Created**: [DATE]
**Spec**: [Link to spec.md]
**Status**: Planning

## Quick Reference

**Workflow Type**: [automation|integration|ai-agent|data-processing|notification]
**Complexity**: [Simple|Medium|Complex]
**Estimated Nodes**: [Count estimate]
**External Services**: [List of integrations]
**Decomposition**: [Single workflow|Multiple sub-workflows]

## Workflow Decomposition Analysis

### Complexity Assessment

**Total Expected Nodes**: [Estimate from spec requirements]
**Logical Domains Identified**: [Count distinct operational areas]
**Integration Points**: [Count external services]

**Decomposition Decision**: [Keep as single workflow | Split into sub-workflows]

### Decomposition Criteria Evaluation

Evaluate whether to split into sub-workflows based on these factors:

| Criterion | Assessment | Weight | Notes |
|-----------|------------|--------|-------|
| **Size** (> 25 nodes) | [Yes/No] | High | Large workflows harder to maintain |
| **Distinct Domains** (> 2 logical areas) | [Yes/No] | High | Separate concerns = simpler components |
| **Reusability** (logic used elsewhere) | [Yes/No] | High | Sub-workflows can be reused |
| **Parallel Execution** (independent operations) | [Yes/No] | Medium | Sub-workflows can run concurrently |
| **Error Isolation** (failures contained) | [Yes/No] | Medium | Errors in sub-workflows don't crash parent |
| **Testing** (components tested independently) | [Yes/No] | Medium | Easier to test smaller units |
| **Team Collaboration** (multiple devs) | [Yes/No] | Low | Different devs can own sub-workflows |

**Recommendation**: 
- If ≥ 3 High criteria met → **Split into sub-workflows**
- If 1-2 High + 2+ Medium criteria met → **Consider splitting**
- Otherwise → **Keep as single workflow**

### Sub-Workflow Architecture (If Decomposed)

**Parent Workflow**: `workflows/[base-name]/main.json`
**Sub-Workflows**:
- `workflows/[base-name]/[sub-workflow-1].json` - [Purpose]
- `workflows/[base-name]/[sub-workflow-2].json` - [Purpose]
- `workflows/[base-name]/[sub-workflow-3].json` - [Purpose]

**Folder Structure**:
```
workflows/
└── [base-name]/
    ├── main.json              # Orchestrator/parent workflow
    ├── [domain-1].json        # Sub-workflow for domain 1
    ├── [domain-2].json        # Sub-workflow for domain 2
    └── [domain-3].json        # Sub-workflow for domain 3
```

**Communication Pattern**: [How sub-workflows are invoked and data passed]
- **Option 1: Execute Workflow Node** - Parent executes sub-workflows via n8n's Execute Workflow node
- **Option 2: Webhook Chain** - Sub-workflows triggered via internal webhooks
- **Option 3: Queue-Based** - Parent enqueues work, sub-workflows poll queue
- **Chosen**: [Selected pattern with rationale]

**Data Flow Between Workflows**:
```
[Parent: main.json]
    ↓ (passes: input data)
[Sub-workflow 1: validation.json]
    ↓ (returns: validated data)
[Sub-workflow 2: processing.json]
    ↓ (returns: processed results)
[Sub-workflow 3: notification.json]
    ↓ (returns: notification status)
[Parent: aggregates results]
```

**Sub-Workflow Definitions**:

#### Sub-Workflow 1: [Name]
- **File**: `workflows/[base-name]/[name].json`
- **Purpose**: [What this sub-workflow does]
- **Trigger**: [How it's invoked]
- **Input Contract**: [What data it receives]
- **Output Contract**: [What data it returns]
- **Dependencies**: [Other sub-workflows it depends on]
- **Reusability**: [Can be used by: list parent workflows]
- **Estimated Nodes**: [Count]

#### Sub-Workflow 2: [Name]
- **File**: `workflows/[base-name]/[name].json`
- **Purpose**: [What this sub-workflow does]
- **Trigger**: [How it's invoked]
- **Input Contract**: [What data it receives]
- **Output Contract**: [What data it returns]
- **Dependencies**: [Other sub-workflows it depends on]
- **Reusability**: [Can be used by: list parent workflows]
- **Estimated Nodes**: [Count]

**Error Handling Strategy**:
- **Sub-workflow failures**: [How parent handles sub-workflow errors]
- **Partial failures**: [Continue with remaining sub-workflows or stop?]
- **Rollback**: [How to undo partial changes if later sub-workflow fails]

**Testing Strategy**:
- **Unit Testing**: Each sub-workflow tested independently
- **Integration Testing**: Parent + sub-workflows tested together
- **Test Data**: Shared test data in `workflows/[base-name]/test-data/`

**Deployment Strategy**:
- **Order**: Deploy sub-workflows first, then parent
- **Versioning**: All sub-workflows versioned together
- **Rollback**: Rollback entire workflow family as unit

### Decomposition Trade-offs

**Benefits of Decomposition**:
- ✅ [Specific benefit 1 for this workflow]
- ✅ [Specific benefit 2 for this workflow]
- ✅ [Specific benefit 3 for this workflow]

**Costs of Decomposition**:
- ⚠️ [Specific cost 1 - e.g., increased complexity in coordination]
- ⚠️ [Specific cost 2 - e.g., more files to maintain]
- ⚠️ [Specific cost 3 - e.g., harder to debug across boundaries]

**Final Decision Rationale**:
[Explain why decomposition is/isn't being done for this specific workflow]

## Technical Context

### Trigger Configuration
- **Type**: [manualTrigger|webhook|scheduleTrigger|emailTrigger|chatTrigger]
- **Node**: `n8n-nodes-base.[triggerNodeType]`
- **Configuration**:
  ```json
  {
    "parameters": {
      // Trigger-specific parameters from spec
    }
  }
  ```
- **Rationale**: [Why this trigger type?]

### Node Architecture

#### Architectural Flow

```
[Trigger] → [Process 1] → [Process 2] → ... → [Output]
               ↓ (error)
           [Error Handler] → [Notification]
```

Visual representation:
- Main execution path
- Error handling branches
- Parallel processing paths
- Merge points

#### Node Selection

| Node ID | Node Type | Purpose | Configuration Highlights |
|---------|-----------|---------|--------------------------|
| trigger | n8n-nodes-base.webhook | Receive incoming data | Path: /data-receiver, Method: POST |
| validate | n8n-nodes-base.code | Validate required fields | Check name, email, phone fields |
| save | n8n-nodes-base.postgres | Store to database | Table: records, Operation: insert |
| notify | n8n-nodes-base.slack | Success notification | Channel: #alerts, Message: template |
| error | n8n-nodes-base.slack | Error notification | Channel: #errors, Include: error details |

**Node Selection Rationale:**
- [Why each node type was chosen over alternatives]
- [Trade-offs considered]

### Data Flow Design

#### Input Schema

```json
{
  "field1": "type - description",
  "field2": "type - description",
  "nested": {
    "field3": "type - description"
  }
}
```

#### Data Transformations

| Stage | Input | Transformation | Output | Node |
|-------|-------|----------------|--------|------|
| 1 | Webhook payload | Extract fields | Validated object | Code node |
| 2 | Validated object | Add timestamp | Enriched object | Set node |
| 3 | Enriched object | Format for DB | Insert statement | Code node |

**n8n Expression Examples:**
```javascript
// Access webhook data
={{ $json.fieldName }}

// Reference previous node
={{ $node["NodeName"].json.data }}

// Transform in Code node
return items.map(item => ({
  ...item.json,
  processed: true,
  timestamp: new Date().toISOString()
}));
```

#### Output Schema

```json
{
  "resultField1": "type - description",
  "resultField2": "type - description"
}
```

### Integration Details

#### INT-1: [Service Name] ([node-type])

**Node Type**: `n8n-nodes-base.[serviceName]` or `HTTP Request`
**Purpose**: [What this integration does]

**Configuration**:
```json
{
  "parameters": {
    "resource": "resourceType",
    "operation": "operationType",
    "field1": "value1"
  }
}
```

**Authentication**:
- **Type**: [API Key|OAuth2|Basic Auth|Header Auth]
- **Credentials Required**: [Credential type in n8n]
- **Setup Instructions**: [How to obtain/configure]

**Error Handling**:
- **Rate Limits**: [How to handle 429 responses]
- **Timeouts**: [Retry strategy]
- **Fallback**: [What happens on permanent failure]

**References**:
- Node documentation: [Link if using MCP tools]
- API documentation: [External docs]

[Additional integrations...]

### Error Handling Strategy

#### Error Detection

| Error Type | Detection Method | Handler Node |
|------------|------------------|--------------|
| Validation failure | Code node check | Error notification |
| API timeout | HTTP Request timeout | Retry logic + alert |
| Database error | Postgres node error | Log + rollback + notify |
| Rate limit hit | 429 response | Wait node + retry |

#### Error Flow Architecture

```
[Main Flow] → [Operation Node]
                  ↓ (on error)
              [Error Handler]
                  ↓
          [Log Error] → [Notify] → [Fallback Action]
```

#### Retry Configuration

| Operation | Retry Count | Backoff | Timeout | Fallback |
|-----------|-------------|---------|---------|----------|
| API calls | 3 | Exponential | 30s | Log + notify |
| DB writes | 2 | Linear | 10s | Queue for manual |
| Notifications | 1 | None | 5s | Log only |

### Performance Design

#### Execution Plan
- **Estimated Duration**: [Time per execution]
- **Bottleneck Analysis**: [Slowest operations identified]
- **Optimization Strategy**: [How to minimize execution time]

#### Batching Strategy
- **Batch Size**: [Items per batch]
- **Node**: `n8n-nodes-base.splitInBatches`
- **Rationale**: [Why this batch size?]

#### Parallel Execution
- **Parallel Nodes**: [Which operations can run in parallel?]
- **Merge Strategy**: [How to combine results]
- **Configuration**: [Parallel processing node setup]

### Observability Design

#### Logging Strategy
- **Execution Logs**: [What gets logged automatically]
- **Custom Logging**: [Additional logging nodes needed]
- **Log Format**: [Structure of log entries]

#### Monitoring
- **Success Metrics**: [What indicates healthy operation]
- **Error Metrics**: [What indicates problems]
- **Alerting Triggers**: [When to send alerts]

#### Debug Support
- **Test Execution**: [How to test workflow safely]
- **Breakpoints**: [Strategic points for manual inspection]
- **Data Inspection**: [Where to check intermediate results]

### Testing Strategy

#### Structural Validation (Automated)
- **MCP Validation**: Use n8n MCP tools for structure, connections, expressions
- **Tools**:
  ```javascript
  mcp_n8n-mcp_validate_workflow(workflow)
  mcp_n8n-mcp_validate_workflow_connections(workflow)
  mcp_n8n-mcp_validate_workflow_expressions(workflow)
  ```
- **When**: After each implementation phase, before deployment

#### Workflow Execution Testing (CLI-Based)
- **Approach**: Execute workflow via n8n CLI and validate outputs
- **Tool**: `n8n execute --id <workflow-id> --rawOutput`
- **Test Runner**: Jest, Mocha, or simple Bash scripts
- **Example**:
  ```javascript
  import { execSync } from 'child_process';
  
  test('workflow returns expected output', () => {
    // Execute using n8n API or workflow ID
    const output = execSync('n8n execute --id <workflow-id>').toString();
    const result = JSON.parse(output);
    expect(result[0].json.status).toBe('success');
  });
  ```
- **When**: Integration testing, CI/CD pipelines

#### End-to-End Testing (Behavior-Based)
- **Approach**: Trigger workflow and validate side effects
- **For webhooks**: 
  ```bash
  curl -X POST https://n8n.example.com/webhook/test -d '{"test": "data"}' | jq .
  ```
- **For scheduled workflows**: Manual trigger or time-based CI job
- **Validation Points**:
  - Database records created/updated
  - External API calls made
  - Notifications sent (Slack, email)
  - Files generated
- **Tools**: Playwright, Cypress, Postman, or curl + assertions
- **When**: Pre-production smoke tests, production monitoring

#### Visual Regression Testing (Config-Based)
- **Approach**: Snapshot workflow JSON and detect changes
- **Process**:
  1. Export workflow: `n8n export:workflow --id <id> --output baseline.json`
  2. Store in Git as baseline
  3. Compare against new exports (JSON diff)
  4. Flag unexpected node config or connection changes
- **When**: Preventing accidental configuration changes, CI validation

#### Test Data Strategy
- **Valid Input Samples**: Happy path test cases
- **Invalid Input Samples**: Validation failure cases
- **Edge Case Samples**: Boundary conditions, empty data, large volumes
- **Location**: `test-data/` directory with JSON files

#### CI/CD Integration
- **Pipeline Stages**:
  1. MCP Validation (fast, < 1 second)
  2. CLI Execution Tests (medium, < 30 seconds)
  3. End-to-End Tests (slow, < 5 minutes)
  4. Visual Regression (fast, < 5 seconds)
- **Failure Handling**: Block deployment on MCP validation or execution test failures
- **Reporting**: Test results, coverage metrics, performance benchmarks

## Constitution Check

[Reference from `.specify/memory/constitution.md`]

### Principle Alignment

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| [Principle 1] | [What it requires] | ✓ PASS / ✗ FAIL | [Compliance details] |
| [Principle 2] | [What it requires] | ✓ PASS / ✗ FAIL | [Compliance details] |

**Gate Evaluation:**
- [ ] All MUST principles satisfied
- [ ] SHOULD principles considered (document if not followed)
- [ ] No unjustified violations

**Issues Found:**
- [List any violations with justification or remediation plan]

## Phase 0: Research & Discovery

### Unknown Resolution

[For any "NEEDS CLARIFICATION" from Technical Context]

#### Research Task 1: [Topic]
**Question**: [What needs to be resolved]
**Investigation**: [Use n8n MCP tools to research]
**Findings**: [What was discovered]
**Decision**: [What was chosen]
**Rationale**: [Why chosen]
**Alternatives**: [What else was considered]

[Additional research tasks...]

### Node Discovery

#### Discovery Process:

1. **Search for functionality**:
```javascript
// Example MCP tool usage
mcp_n8n-mcp_search_nodes({query: "database", includeExamples: true})
mcp_n8n-mcp_search_nodes({query: "validation", includeExamples: true})
```

2. **Check templates**:
```javascript
mcp_n8n-mcp_search_templates_by_metadata({
  category: "automation",
  complexity: "simple"
})
```

3. **Validate node options**:
```javascript
mcp_n8n-mcp_get_node_essentials("n8n-nodes-base.postgres")
mcp_n8n-mcp_validate_node_minimal("n8n-nodes-base.postgres", {})
```

#### Discovery Results:

| Functionality Needed | Nodes Found | Selected Node | Why |
|----------------------|-------------|---------------|-----|
| [Requirement] | [Options] | [Choice] | [Rationale] |

### Best Practices Research

#### For [Technology/Pattern]:
- **Best Practice 1**: [Description and application]
- **Best Practice 2**: [Description and application]
- **Source**: [Where this guidance came from]

**Output**: `research.md` with all unknowns resolved

## Phase 1: Design Documents

### Data Model (`data-model.md`)

[If workflow processes structured data entities]

```markdown
# Data Model: [WORKFLOW_NAME]

## Entities

### Entity: [EntityName]
**Purpose**: [What this represents]
**Lifecycle**: [How this entity is created, updated, deleted]

**Fields**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| id | string | Yes | UUID format | Unique identifier |
| field1 | string | Yes | Max 255 chars | Description |
| field2 | number | No | Positive int | Description |

**Relationships**:
- [Related to EntityX via field]

**Validation Rules**:
- [Rule 1: specific validation logic]
- [Rule 2: specific validation logic]

**State Transitions** (if applicable):
```
[Initial] → [Processing] → [Complete]
            ↓ (error)
          [Failed] → [Retry]
```

[Additional entities...]
```

### Workflow Contracts (`contracts/`)

[Define input/output contracts for workflow]

#### `contracts/input-contract.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Workflow Input Schema",
  "type": "object",
  "required": ["field1", "field2"],
  "properties": {
    "field1": {
      "type": "string",
      "description": "Description",
      "examples": ["example value"]
    },
    "field2": {
      "type": "number",
      "minimum": 0
    }
  }
}
```

#### `contracts/output-contract.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Workflow Output Schema",
  "type": "object",
  "required": ["result", "status"],
  "properties": {
    "result": {
      "type": "object",
      "description": "Processed result"
    },
    "status": {
      "type": "string",
      "enum": ["success", "partial", "failed"]
    }
  }
}
```

### Quick Start Guide (`quickstart.md`)

```markdown
# Quick Start: [WORKFLOW_NAME]

## Prerequisites

- n8n instance (version X.X or higher)
- Required credentials configured:
  - [Credential 1]: [How to set up]
  - [Credential 2]: [How to set up]
- External services:
  - [Service]: [Access requirements]

## Installation

1. Import workflow JSON into n8n
2. Configure credentials:
   - [Step-by-step credential setup]
3. Set environment variables (if needed):
   - `VAR_NAME`: [Description]
4. Test workflow execution

## Testing Scenarios

### Test 1: Happy Path
**Input**: [Sample input data]
**Expected Output**: [Expected result]
**Verification**: [How to verify success]

### Test 2: Error Handling
**Input**: [Invalid/edge case input]
**Expected Behavior**: [How workflow should handle]
**Verification**: [What to check]

[Additional test scenarios...]

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| [Common problem] | [Why it happens] | [How to fix] |

## Customization

- **Modify trigger**: [How to change trigger config]
- **Adjust error handling**: [How to customize error behavior]
- **Scale for volume**: [How to handle more data]
```

### Agent Context Update

Run `.specify/scripts/bash/update-agent-context.sh cursor` to update AI agent context with:
- Selected nodes and their purposes
- Integration patterns
- Common expressions used
- Workflow architecture patterns

## Phase 2: Final Validation

### Constitution Re-Check

After design decisions, validate:
- [ ] No new principle violations introduced
- [ ] All design choices align with constitution
- [ ] Quality gates still satisfied

### Completeness Check

- [ ] All spec requirements have corresponding nodes
- [ ] All integrations have authentication strategy
- [ ] All error scenarios have handling nodes
- [ ] All data transformations defined
- [ ] Performance targets addressable with design

### Readiness for Implementation

- [ ] Node selections validated with MCP tools
- [ ] All "NEEDS CLARIFICATION" items resolved
- [ ] Data contracts defined
- [ ] Test scenarios documented
- [ ] Setup instructions complete

## Summary

**Workflow**: [Name]
**Nodes**: [Count]
**Integrations**: [Count]
**Complexity**: [Simple|Medium|Complex]

**Key Decisions**:
1. [Major decision 1 and rationale]
2. [Major decision 2 and rationale]
3. [Major decision 3 and rationale]

**Next Steps**: `/n8n.tasks` to generate implementation task list

**Branch**: [Branch name]
**Artifacts Created**:
- plan.md
- research.md (if needed)
- data-model.md (if needed)
- contracts/* (if needed)
- quickstart.md
```

### 4. Workflow Decomposition Analysis

Before proceeding with detailed planning, analyze whether workflow should be decomposed:

**Step 1: Estimate Complexity**
- Count expected nodes from functional requirements
- Identify distinct logical domains (e.g., validation, processing, notification)
- Count external integrations

**Step 2: Evaluate Decomposition Criteria**

For each criterion, assess and document:

```javascript
const decompositionScore = {
  size: estimatedNodes > 25 ? 'Yes' : 'No',
  domains: distinctDomains > 2 ? 'Yes' : 'No',
  reusability: hasReusableLogic() ? 'Yes' : 'No',
  parallel: hasIndependentOperations() ? 'Yes' : 'No',
  errorIsolation: needsIsolation() ? 'Yes' : 'No',
  testing: complexEnoughForSeparateTests() ? 'Yes' : 'No',
  teamCollaboration: multipleDevs ? 'Yes' : 'No'
};

// Count High criteria (size, domains, reusability)
const highCriteriaMet = [
  decompositionScore.size,
  decompositionScore.domains,
  decompositionScore.reusability
].filter(v => v === 'Yes').length;

// Decision logic
if (highCriteriaMet >= 3) {
  decision = 'Split into sub-workflows';
} else if (highCriteriaMet >= 1 && mediumCriteriaMet >= 2) {
  decision = 'Consider splitting - ask user';
} else {
  decision = 'Keep as single workflow';
}
```

**Step 3: If Decomposing, Design Architecture**

Identify logical sub-workflows:
- **Domain analysis**: Group requirements by domain/purpose
- **Dependency analysis**: Map data flow between domains
- **Communication pattern**: Choose Execute Workflow, Webhook, or Queue-based
- **Folder structure**: Create `workflows/[base-name]/` directory
- **Contracts**: Define input/output for each sub-workflow

**Example Decomposition:**

For a workflow that: receives order → validates → processes payment → updates inventory → sends confirmation

```
workflows/order-processing/
├── main.json                    # Orchestrator
├── validate-order.json          # Sub-workflow 1
├── process-payment.json         # Sub-workflow 2
├── update-inventory.json        # Sub-workflow 3
└── send-confirmation.json       # Sub-workflow 4
```

**Step 4: Document Decision**

Update Workflow Decomposition Analysis section with:
- Assessment results
- Chosen architecture (if decomposing)
- Rationale for decision
- Trade-offs considered

**Step 5: Adjust Planning for Sub-Workflows**

If decomposing:
- Create separate node architecture sections for each sub-workflow
- Define contracts in `contracts/[sub-workflow-name]-input.json` and `-output.json`
- Plan parent workflow with Execute Workflow nodes
- Document error handling across workflow boundaries

### 5. Research Phase (Phase 0)

For each "NEEDS CLARIFICATION" or unknown in Technical Context:

1. **Use n8n MCP tools** to research:
   ```javascript
   // Search for relevant nodes
   mcp_n8n-mcp_search_nodes({query: "relevant functionality", includeExamples: true})
   
   // Check existing templates
   mcp_n8n-mcp_search_templates("similar workflow")
   
   // Get node details
   mcp_n8n-mcp_get_node_essentials("n8n-nodes-base.nodetype", {includeExamples: true})
   
   // Validate configuration
   mcp_n8n-mcp_validate_node_minimal("n8n-nodes-base.nodetype", {})
   ```

2. **Document findings** in `research.md`:
   - Decision made
   - Rationale
   - Alternatives considered
   - Best practices applied

3. **Resolve all unknowns** before proceeding to Phase 1

### 5. Design Phase (Phase 1)

1. **Extract entities from spec** → `data-model.md` (if workflow handles structured data)
2. **Define input/output contracts** → `contracts/*.json` (JSON schemas)
3. **Create test scenarios** → `quickstart.md`
4. **Update agent context** → Run update script

### 6. Validation & Reporting

**Stop after Phase 1** and report:
- Branch name
- IMPL_PLAN path
- Generated artifacts list
- Constitution compliance status
- Readiness for `/n8n.tasks`

## Key Rules

- **Use absolute paths** for all files
- **ERROR on gate failures** or unresolved clarifications
- **Validate node selections** using MCP tools before documenting
- **Document rationale** for all major decisions
- **Templates first**: Always check existing templates before custom solutions
- **Node validation**: Pre-validate configurations with `validate_node_minimal`
- **Keep node-agnostic until necessary**: Prefer describing functionality over specific node types when multiple options exist

## Context

$ARGUMENTS

