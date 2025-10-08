---
name: n8n-implement
description: Execute n8n workflow implementation by processing and executing all tasks from tasks.md
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Goal

Execute the implementation plan by building the n8n workflow according to tasks.md, validating at each phase, and producing a production-ready workflow JSON.

## n8n-MCP Validation Strategy

### Pre-Build Validation (REQUIRED)

**Validate node configurations BEFORE building:**

```javascript
// 1. Quick required fields check
mcp_n8n-mcp_validate_node_minimal(nodeType, {})

// 2. Full operation-aware validation
mcp_n8n-mcp_validate_node_operation(nodeType, fullConfig, {profile: 'runtime'})
```

**Fix ALL validation errors before proceeding to build.**

### Build Phase Guidelines

**Template Usage:**
- If using template: `mcp_n8n-mcp_get_template(templateId, {mode: "full"})`
- **MANDATORY ATTRIBUTION**: 
  > "This workflow is based on a template by **[author.name]** (@[author.username]). View the original at: [url]"

**Node Preferences:**
- **AVOID Code Node unless absolutely necessary**
- Prefer standard n8n nodes over custom code
- Use Code node only when standard nodes cannot achieve the requirement

**Visual Validation:**
- Present workflow architecture diagram to user
- Ask for approval before proceeding with implementation

**Build in Artifact:**
- Build workflow JSON in an artifact for easy editing
- Unless user explicitly requested creation in n8n instance

### Post-Build Validation (REQUIRED)

**Validate complete workflow BEFORE deployment:**

```javascript
// 1. Complete workflow validation (structure + connections + expressions)
mcp_n8n-mcp_validate_workflow(workflow)

// 2. Connection and structure validation
mcp_n8n-mcp_validate_workflow_connections(workflow)

// 3. Expression syntax validation
mcp_n8n-mcp_validate_workflow_expressions(workflow)
```

**Fix ALL issues found before deployment.**

### Post-Deployment Validation

**If deployed to n8n instance:**

```javascript
// 1. Validate deployed workflow
mcp_n8n-mcp_n8n_validate_workflow({id: workflowId})

// 2. Monitor execution status
mcp_n8n-mcp_n8n_list_executions({workflowId})
```

### Update Strategy

**Use diff operations for efficiency (80-90% token savings):**

```javascript
mcp_n8n-mcp_n8n_update_partial_workflow({
  workflowId: id,
  operations: [
    {type: 'updateNode', nodeId: 'node1', changes: {position: [100, 200]}}
  ]
})
```

## Execution Steps

### 1. Initialize Implementation Context

Run `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks` from repo root and parse:
- `FEATURE_DIR`
- `AVAILABLE_DOCS` list

All paths must be absolute.

### 2. Check Checklists Status

If `FEATURE_DIR/checklists/` exists:

**Scan all checklist files:**
- Count total items: All lines matching `- [ ]` or `- [X]` or `- [x]`
- Count completed: Lines matching `- [X]` or `- [x]`
- Count incomplete: Lines matching `- [ ]`

**Create status table:**
```
| Checklist | Total | Completed | Incomplete | Status |
|-----------|-------|-----------|------------|--------|
| requirements.md | 12 | 12 | 0 | ✓ PASS |
| architecture.md | 8 | 5 | 3 | ✗ FAIL |
```

**Determine overall status:**
- **PASS**: All checklists have 0 incomplete items
- **FAIL**: One or more checklists have incomplete items

**If any checklist incomplete:**
- Display table with incomplete counts
- **STOP** and ask: "Some checklists are incomplete. Do you want to proceed with implementation anyway? (yes/no)"
- Wait for user response
- If "no"/"wait"/"stop": halt execution
- If "yes"/"proceed"/"continue": proceed to step 3

**If all checklists complete:**
- Display table showing all passed
- Automatically proceed to step 3

### 3. Load Implementation Context

**REQUIRED:**
- `tasks.md`: Complete task list and execution plan
- `plan.md`: Node architecture, integrations, data flow

**IF EXISTS:**
- `data-model.md`: Entity definitions
- `contracts/`: Input/output schemas
- `research.md`: Technical decisions
- `quickstart.md`: Test scenarios

### 4. Parse Tasks Structure

Extract from `tasks.md`:
- **Task phases**: Setup, Core, Transformation, Integration, Error Handling, Testing, Documentation
- **Task dependencies**: Sequential vs parallel markers [P]
- **Task details**: ID, description, node types, configurations, acceptance criteria
- **Execution flow**: Dependency graph

### 5. Execute Implementation (Phase-by-Phase)

For each phase in order:

#### Phase 1: Setup & Validation

**T001-T003: Initialize Structure**
- Create base workflow JSON file
- Document credential requirements
- Validate node selections using MCP tools

```javascript
// Example validation
for (const nodeType of plannedNodes) {
  const essentials = await mcp_n8n-mcp_get_node_essentials(nodeType);
  const validation = await mcp_n8n-mcp_validate_node_minimal(nodeType, {});
  // Check validation results
}
```

**Output**: 
- `workflows/[workflow-name].json` (initial structure)
- `docs/credentials-setup.md`

**Checkpoint**: Validate JSON structure, all nodes verified

---

#### Phase 2: Core Workflow Structure

**T004: Implement Trigger Node**
```json
{
  "name": "[Workflow Name]",
  "nodes": [
    {
      "parameters": {
        // From plan.md Trigger Configuration
      },
      "id": "trigger",
      "name": "[Descriptive Name]",
      "type": "n8n-nodes-base.[triggerType]",
      "typeVersion": 1,
      "position": [0, 0]
    }
  ],
  "connections": {},
  "settings": {
    "executionOrder": "v1"
  }
}
```

**T005: Add Primary Processing Nodes**
- Add each node from plan.md Node Architecture
- Position: Increment x by 250 for each sequential node
- Configure basic parameters

**T006: Configure Node Connections**
```json
{
  "connections": {
    "[SourceNode]": {
      "main": [[
        {"node": "[DestNode]", "type": "main", "index": 0}
      ]]
    }
  }
}
```

**Checkpoint**: 
- Validate structure: `mcp_n8n-mcp_validate_workflow_connections(workflow)`
- No orphaned nodes
- All nodes in execution path

---

#### Phase 3: Data Transformation

**T007: Implement Input Validation**

Option 1: Using Code Node
```json
{
  "parameters": {
    "jsCode": "// Validate required fields\nconst item = $input.item().json;\nconst required = ['field1', 'field2'];\n\nfor (const field of required) {\n  if (!item[field]) {\n    throw new Error(`Missing required field: ${field}`);\n  }\n}\n\nreturn item;"
  },
  "id": "validate",
  "name": "Validate Input",
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [250, 0]
}
```

Option 2: Using IF Node
```json
{
  "parameters": {
    "conditions": {
      "string": [
        {
          "value1": "={{ $json.field1 }}",
          "operation": "isNotEmpty"
        }
      ]
    }
  },
  "id": "validate",
  "name": "Check Required Fields",
  "type": "n8n-nodes-base.if",
  "typeVersion": 2,
  "position": [250, 0]
}
```

**T008-T009: Configure Transformations**
- Use Set node for simple field mappings
- Use Code node for complex transformations
- Reference plan.md Data Transformations table

**Checkpoint**:
- Validate expressions: `mcp_n8n-mcp_validate_workflow_expressions(workflow)`
- Test transformations with sample data

---

#### Phase 4: Integration Implementation

For each integration from plan.md:

**Example: HTTP Request Integration**
```json
{
  "parameters": {
    "method": "POST",
    "url": "https://api.example.com/endpoint",
    "authentication": "predefinedCredentialType",
    "nodeCredentialType": "apiKeyAuth",
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        {
          "name": "field1",
          "value": "={{ $json.field1 }}"
        }
      ]
    },
    "options": {
      "timeout": 30000,
      "retry": {
        "enabled": true,
        "maxTries": 3,
        "waitBetweenTries": 1000
      }
    }
  },
  "id": "api-call",
  "name": "Call External API",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.1,
  "position": [500, 0]
}
```

**Example: Database Integration**
```json
{
  "parameters": {
    "operation": "insert",
    "table": "records",
    "columns": "={{ $json }}",
    "options": {}
  },
  "id": "db-insert",
  "name": "Insert to Database",
  "type": "n8n-nodes-base.postgres",
  "typeVersion": 2.4,
  "position": [750, 0],
  "credentials": {
    "postgres": {
      "id": "1",
      "name": "PostgreSQL account"
    }
  }
}
```

**Checkpoint**:
- Validate node configurations: `mcp_n8n-mcp_validate_node_operation(nodeType, config, 'runtime')`
- Test with mock credentials
- Verify error handling for integration failures

---

#### Phase 5: Error Handling

**Add Error Handling Paths**

1. **Error Detection**: Use Try/Catch branches or error outputs
2. **Retry Logic**: Add Wait node + Loop back
3. **Error Notifications**: Add notification nodes
4. **Fallback Paths**: Alternative execution routes

**Example: Error Handler**
```json
{
  "parameters": {
    "channel": "#errors",
    "text": "=Workflow Error:\nExecution ID: {{ $execution.id }}\nError: {{ $json.error.message }}\nTimestamp: {{ $now }}"
  },
  "id": "error-notify",
  "name": "Notify Error",
  "type": "n8n-nodes-base.slack",
  "typeVersion": 2.1,
  "position": [750, 300]
}
```

**Connections for Error Paths:**
```json
{
  "connections": {
    "Main Node": {
      "main": [[{"node": "Success Path", "type": "main", "index": 0}]],
      "error": [[{"node": "Error Handler", "type": "main", "index": 0}]]
    }
  }
}
```

**Checkpoint**:
- Test each error scenario from spec.md
- Verify retry logic executes correctly
- Confirm notifications sent

---

#### Phase 6: Testing & Validation

**Testing Levels Overview:**
1. **Structural Validation** (MCP tools) - Fast, automated
2. **CLI Execution Testing** (n8n execute) - Integration tests
3. **End-to-End Testing** (Behavior validation) - Side effects
4. **Visual Regression** (JSON snapshots) - Config changes

---

**T-Testing-1: Structural Validation (MCP)**

Run MCP validation tools on complete workflow:

```javascript
// Full workflow validation
const validation = await mcp_n8n-mcp_validate_workflow(workflow);

if (validation.valid) {
  console.log("✓ Workflow structure valid");
} else {
  console.error("✗ Validation errors:", validation.errors);
  // Fix errors before proceeding
  process.exit(1);
}

// Validate connections
const connValidation = await mcp_n8n-mcp_validate_workflow_connections(workflow);
if (!connValidation.valid) {
  console.error("✗ Connection errors:", connValidation.errors);
  process.exit(1);
}

// Validate expressions
const exprValidation = await mcp_n8n-mcp_validate_workflow_expressions(workflow);
if (!exprValidation.valid) {
  console.error("✗ Expression errors:", exprValidation.errors);
  process.exit(1);
}

console.log("✓ All MCP validations passed");
```

**Duration**: < 1 second
**Purpose**: Catch structural issues, invalid connections, syntax errors

---

**T-Testing-2: Setup CLI Execution Tests**

Create Jest test infrastructure:

1. Install dependencies:
```bash
npm install --save-dev jest
```

2. Create `tests/workflow.test.js`:
```javascript
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

describe('Workflow Execution Tests', () => {
  const workflowPath = 'workflows/[workflow-name].json';
  
  beforeAll(() => {
    // Ensure workflow file exists
    expect(existsSync(workflowPath)).toBe(true);
  });

  test('workflow structure is valid', () => {
    // This would use MCP tools in real implementation
    const workflow = JSON.parse(readFileSync(workflowPath, 'utf8'));
    expect(workflow.nodes).toBeDefined();
    expect(workflow.connections).toBeDefined();
  });

  test('happy path execution succeeds', () => {
    const output = execSync(
      `n8n execute --id ${workflowId}`,
      { encoding: 'utf8' }
    );
    const result = JSON.parse(output);
    expect(result[0].json.status).toBe('success');
  });

  test('handles invalid input gracefully', () => {
    // Test with invalid test data
    const testData = readFileSync('test-data/invalid-input.json', 'utf8');
    // Execute with invalid data and check error handling
    try {
      execSync(
        `n8n execute --id ${workflowId}`,
        { input: testData, encoding: 'utf8' }
      );
    } catch (error) {
      // Expect controlled error handling
      expect(error.message).toContain('validation');
    }
  });
});
```

3. Add test script to `package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

**T-Testing-3: CLI Execution Testing (Integration)**

Execute workflow via CLI and validate outputs:

**Happy Path Test:**
```bash
# Execute workflow by ID with valid test data
n8n execute --id <workflow-id> > test-results/happy-path.json

# Validate output
node -e "
  const result = require('./test-results/happy-path.json');
  console.assert(result[0].json.status === 'success', 'Status mismatch');
  console.assert(result[0].json.recordsProcessed > 0, 'No records processed');
  console.log('✓ Happy path test passed');
"
```

**Error Scenario Tests:**
```bash
# Test error handling with invalid input
for testFile in test-data/error-*.json; do
  echo "Testing: $testFile"
  n8n execute --id <workflow-id> < "$testFile" > test-results/$(basename "$testFile")
  # Validate error was handled correctly
done
```

**Edge Case Tests:**
```bash
# Test with empty input
n8n execute --id <workflow-id> < test-data/empty.json

# Test with large volume
n8n execute --id <workflow-id> < test-data/large-volume.json

# Test with malformed data
n8n execute --id <workflow-id> < test-data/malformed.json
```

**Duration**: < 30 seconds per test
**Purpose**: Validate workflow logic, data transformations, error handling

---

**T-Testing-4: End-to-End Testing (Behavior Validation)**

Test complete workflow behavior including side effects:

**For Webhook Workflows:**
```bash
#!/bin/bash
# e2e-test-webhook.sh

WEBHOOK_URL="https://n8n.test.com/webhook/[path]"
TEST_DATA="test-data/valid-input.json"

echo "🧪 Testing webhook workflow..."

# Trigger workflow
response=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d @"$TEST_DATA")

echo "Response: $response"

# Validate response
if echo "$response" | jq -e '.success == true' > /dev/null; then
  echo "✓ Webhook response valid"
else
  echo "✗ Webhook response invalid"
  exit 1
fi

# Validate side effects
echo "Checking side effects..."

# Check database record created
RECORD_COUNT=$(psql -h localhost -U user -d db -t -c \
  "SELECT COUNT(*) FROM records WHERE created_at > NOW() - INTERVAL '1 minute'")
if [ "$RECORD_COUNT" -gt 0 ]; then
  echo "✓ Database record created"
else
  echo "✗ No database record found"
  exit 1
fi

# Check Slack notification sent (via API or logs)
# Check file generated (if applicable)

echo "✓ E2E test passed"
```

**For Scheduled Workflows:**
```bash
# Manually trigger via n8n API
curl -X POST http://localhost:5678/rest/workflows/[id]/execute \
  -H "X-N8N-API-KEY: $API_KEY"

# Then validate side effects as above
```

**Duration**: < 5 minutes
**Purpose**: Validate external integrations, side effects, real behavior

---

**T-Testing-5: Visual Regression Testing (JSON Snapshot)**

Create baseline and detect configuration changes:

```bash
#!/bin/bash
# test-visual-regression.sh

WORKFLOW_FILE="workflows/[workflow-name].json"
BASELINE_FILE="test-snapshots/[workflow-name]-baseline.json"

# Create baseline if doesn't exist
if [ ! -f "$BASELINE_FILE" ]; then
  echo "Creating baseline snapshot..."
  cp "$WORKFLOW_FILE" "$BASELINE_FILE"
  git add "$BASELINE_FILE"
  echo "✓ Baseline created and tracked in Git"
  exit 0
fi

# Compare current against baseline
echo "Comparing workflow against baseline..."

if diff -u "$BASELINE_FILE" "$WORKFLOW_FILE" > /dev/null; then
  echo "✓ No configuration changes detected"
else
  echo "⚠ Configuration differences detected:"
  diff -u "$BASELINE_FILE" "$WORKFLOW_FILE" | head -20
  echo ""
  echo "Review changes. If intentional, update baseline:"
  echo "  cp $WORKFLOW_FILE $BASELINE_FILE"
  echo "  git add $BASELINE_FILE"
  exit 1
fi
```

**Duration**: < 5 seconds
**Purpose**: Prevent accidental configuration changes

---

**T-Testing-6: CI/CD Pipeline Setup**

Create `.github/workflows/test-workflow.yml`:

```yaml
name: n8n Workflow Tests

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'workflows/**'
      - 'test-data/**'
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install n8n
        run: npm install -g n8n
      
      - name: Install dependencies
        run: npm install
      
      - name: MCP Validation
        run: npm run test:mcp
        continue-on-error: false
      
      - name: CLI Execution Tests
        run: npm test
        continue-on-error: false
      
      - name: Visual Regression Test
        run: bash test-visual-regression.sh
        continue-on-error: true
      
      - name: E2E Tests (if applicable)
        run: bash e2e-test-webhook.sh
        if: contains(github.event_name, 'push')
        continue-on-error: true
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
```

---

**Testing Summary:**

After all tests complete, generate summary:

```markdown
# Testing Report: [Workflow Name]

## Test Execution Summary

### ✓ Structural Validation (MCP)
- Duration: < 1s
- Status: PASSED
- Details: All nodes valid, connections correct, expressions valid

### ✓ CLI Execution Tests (Jest)
- Duration: 28s
- Status: PASSED
- Tests Run: 15
- Tests Passed: 15
- Coverage: 87%

### ✓ End-to-End Tests
- Duration: 3m 42s
- Status: PASSED
- Webhooks tested: 3
- Side effects validated: 8
- All external integrations working

### ✓ Visual Regression
- Duration: < 1s
- Status: PASSED
- No unexpected configuration changes

## Overall Status: ✓ ALL TESTS PASSED

Ready for deployment.
```

**Checkpoint**:
- ✓ All MCP validations pass
- ✓ All Jest tests pass
- ✓ All CLI execution tests succeed
- ✓ All E2E tests validate side effects
- ✓ No unexpected configuration changes
- ✓ All acceptance criteria met
- ✓ Test artifacts generated

---

#### Phase 7: Documentation & Deployment

**Update Documentation**
- Finalize `quickstart.md` with actual node names
- Update credential setup with tested instructions
- Create test data files
- Document deployment process

**Validate Against Success Criteria**
Check each criterion from spec.md Success Criteria:
- [ ] [Criterion 1]: [Pass/Fail] - [Evidence]
- [ ] [Criterion 2]: [Pass/Fail] - [Evidence]

### 6. Progress Tracking & Error Handling

**After Each Task:**
- Mark task as completed [X] in tasks.md
- Report progress: "Completed T0XX: [Task name]"
- If task fails: Report error with context

**Error Handling Rules:**
- **Non-parallel task fails**: Halt execution, report error, suggest fix
- **Parallel task fails**: Continue with successful tasks, report failed ones at end
- **Validation fails**: Stop, show validation errors, suggest corrections
- **Testing fails**: Stop, show test results, identify failing scenario

### 7. Completion Validation

**Final Checks:**
- [ ] All tasks completed (check tasks.md)
- [ ] All nodes configured and connected
- [ ] All integrations working
- [ ] All error scenarios handled
- [ ] All tests passing
- [ ] All success criteria met
- [ ] Documentation complete
- [ ] Workflow validated with MCP tools

**Generate Completion Report:**
```markdown
# Implementation Complete: [Workflow Name]

## Summary
- **Total Tasks**: [Completed / Total]
- **Total Nodes**: [Count]
- **Integrations**: [Count]
- **Test Scenarios Passed**: [Count / Total]

## Artifacts Generated
- `workflows/[workflow-name].json`: Complete workflow (XXX lines)
- `docs/credentials-setup.md`: Credential documentation
- `test-data/`: Test data sets
- Updated `quickstart.md`

## Validation Results
✓ Workflow structure valid
✓ Connections valid
✓ Expressions valid
✓ All test scenarios passed
✓ All success criteria met

## Success Criteria Status
[List from spec.md with ✓ or ✗]

## Deployment Instructions
1. Import workflow JSON into n8n
2. Configure credentials per docs/credentials-setup.md
3. Test with test-data/valid-input.json
4. Activate workflow

## Next Steps
- Deploy to production n8n instance
- Monitor first executions
- Set up alerting per plan
```

### 8. Output Final Workflow

**Write workflow JSON** to `FEATURE_DIR/workflows/[workflow-name].json`

**Create artifact** with complete workflow for easy review:
```json
{
  "name": "[Workflow Name]",
  "nodes": [...],
  "connections": {...},
  "settings": {...},
  "tags": [...]
}
```

## Implementation Best Practices

### Node Configuration

**Use Set Node for simple mappings:**
```json
{
  "parameters": {
    "values": {
      "string": [
        {"name": "field1", "value": "={{ $json.source1 }}"},
        {"name": "field2", "value": "={{ $json.source2.toUpperCase() }}"}
      ],
      "number": [
        {"name": "count", "value": "={{ $json.items.length }}"}
      ]
    }
  }
}
```

**Use Code Node for complex logic:**
```javascript
// Access all items
const items = $input.all();

// Process each item
return items.map(item => ({
  json: {
    ...item.json,
    processed: true,
    timestamp: new Date().toISOString(),
    // Complex transformation
    computed: complexCalculation(item.json)
  }
}));
```

### Expression Best Practices

**Good expressions:**
- `={{ $json.fieldName }}` - Simple field access
- `={{ $json.date.toDate() }}` - Built-in functions
- `={{ $node["NodeName"].json.result }}` - Reference other nodes
- `={{ $json.items.length }}` - Array operations

**Avoid:**
- Hardcoded values that should be configurable
- Complex logic (use Code node instead)
- Unvalidated data references

### Error Handling Patterns

**Pattern 1: Try/Catch with Error Output**
```
[Node] → [Success Path]
   ↓ (error output)
[Error Handler] → [Notify] → [Fallback]
```

**Pattern 2: IF Node Validation**
```
[Input] → [IF: Validate] → [Process]
              ↓ (false)
          [Error Path]
```

**Pattern 3: Retry with Wait**
```
[API Call] → [Success]
   ↓ (error)
[Wait] → [Retry Counter] → [API Call] (loop back)
              ↓ (max retries)
          [Notify Failure]
```

### Positioning Guidelines

**Standard layout:**
- Trigger: [0, 0]
- Sequential nodes: increment x by 250
- Parallel branches: y offset ±200
- Error handlers: y offset -300
- Merge nodes: centered y coordinate

**Example:**
```
Trigger [0, 0]
  ↓
Process [250, 0]
  ├→ Branch A [500, 200]  ┐
  └→ Branch B [500, -200] ┘
      ↓ (merge)
    Result [750, 0]
      ↓ (error)
    Error [750, -300]
```

### Credential Handling

**Never hardcode credentials**
- Always use credential references
- Document credential types in separate file
- Include setup instructions
- Test with placeholder credentials first

**Example credential reference:**
```json
{
  "credentials": {
    "slackApi": {
      "id": "placeholder-id",
      "name": "Slack account"
    }
  }
}
```

## Validation Integration

Throughout implementation, use MCP tools:

**Before adding node:**
```javascript
mcp_n8n-mcp_get_node_essentials(nodeType, {includeExamples: true})
mcp_n8n-mcp_validate_node_minimal(nodeType, baseConfig)
```

**After each phase:**
```javascript
mcp_n8n-mcp_validate_workflow(workflow)
```

**Before finalization:**
```javascript
mcp_n8n-mcp_validate_workflow(workflow)
mcp_n8n-mcp_validate_workflow_connections(workflow)
mcp_n8n-mcp_validate_workflow_expressions(workflow)
```

## Behavior Rules

- **Execute tasks in dependency order** (never skip dependencies)
- **Mark tasks complete** in tasks.md after execution
- **Stop on critical errors** (validation failures, missing dependencies)
- **Continue on non-critical errors** (optional features, nice-to-haves)
- **Report progress regularly** (after each task or phase)
- **Validate frequently** (after each phase minimum)
- **Test early and often** (don't wait until end)
- **Update documentation** as implementation progresses

## Context

$ARGUMENTS

