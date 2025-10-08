---
name: n8n-analyze
description: Perform comprehensive validation and consistency analysis across workflow artifacts
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Goal

Identify inconsistencies, configuration errors, missing requirements coverage, and quality issues across specification, plan, tasks, and workflow JSON before deployment. This is a **READ-ONLY** analysis that produces actionable findings.

## Operating Constraints

**STRICTLY READ-ONLY**: Do **not** modify any files. Output a structured analysis report. Offer an optional remediation plan (user must explicitly approve before any follow-up editing commands).

**Constitution Authority**: The project constitution (`.specify/memory/constitution.md`) is **non-negotiable**. Constitution conflicts are automatically CRITICAL and require workflow adjustment.

## Execution Steps

### 1. Initialize Analysis Context

Run `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks` once from repo root and parse JSON for:
- `FEATURE_DIR`
- `AVAILABLE_DOCS`

Derive absolute paths:
- `SPEC = FEATURE_DIR/spec.md`
- `PLAN = FEATURE_DIR/plan.md`
- `TASKS = FEATURE_DIR/tasks.md`
- `WORKFLOW = FEATURE_DIR/workflows/[workflow-name].json`

Abort with error if required files missing (instruct user to run missing prerequisite command).

### 2. Load Artifacts (Progressive Disclosure)

Load only necessary context from each artifact:

**From spec.md:**
- Overview (purpose, scope, trigger)
- Functional Requirements (FR-N)
- Data Requirements (input, output, transformations)
- Integration Requirements (INT-N)
- Non-Functional Requirements (NFR-N)
- User Scenarios
- Edge Cases (EC-N)
- Error Scenarios (ES-N)
- Success Criteria

**From plan.md:**
- Node Architecture
- Node Selection table
- Data Flow Design
- Integration Details (INT-N)
- Error Handling Strategy
- Performance Design
- Observability Design

**From tasks.md:**
- Task list with IDs, descriptions, phases
- Dependencies
- Parallel markers [P]
- Referenced node types and configurations

**From workflow JSON:**
- Workflow name, metadata
- Nodes array (id, name, type, typeVersion, parameters, position)
- Connections object
- Settings
- Credentials references

**From constitution:**
- Load `.specify/memory/constitution.md` for principle validation

### 3. Build Semantic Models

Create internal representations:

**Requirements Inventory:**
- Each FR, NFR, INT with stable key
- Priority levels (P1, P2, P3)
- Acceptance criteria

**Node Inventory:**
- Each node in workflow with type, purpose, configuration
- Node positions and connections
- Credential references

**Task-to-Node Mapping:**
- Map each task to nodes it creates/configures
- Track coverage of requirements by tasks by nodes

**Constitution Rule Set:**
- Extract principle names and normative statements

### 4. Detection Passes (Token-Efficient Analysis)

Focus on high-signal findings. Limit to 50 findings total.

#### A. Workflow Structure Validation

Using n8n MCP tools:
```javascript
// Validate complete workflow
const validation = await mcp_n8n-mcp_validate_workflow(workflow);

// Validate connections
const connValidation = await mcp_n8n-mcp_validate_workflow_connections(workflow);

// Validate expressions
const exprValidation = await mcp_n8n-mcp_validate_workflow_expressions(workflow);
```

**Detection:**
- Invalid JSON structure
- Missing required node fields
- Disconnected nodes (orphans)
- Invalid node type references
- Circular dependencies
- Invalid connection structure
- Malformed expressions
- Invalid node references in expressions

#### B. Requirements Coverage

**Functional Requirements:**
- Each FR-N from spec → mapped to nodes in workflow?
- Each node in workflow → serves which requirement?
- Unmapped requirements (specified but not implemented)
- Unmapped nodes (implemented but not specified)

**Integration Requirements:**
- Each INT-N from spec → corresponding node in workflow?
- Authentication configured (credentials referenced)?
- Error handling per INT-N Error Handling strategy?

**Error Scenarios:**
- Each ES-N from spec → error handler nodes in workflow?
- Error notifications configured?
- Retry/fallback logic implemented?

**Edge Cases:**
- Each EC-N from spec → handling logic in workflow?

#### C. Spec-Plan-Workflow Consistency

**Node Type Consistency:**
- Nodes in workflow match plan.md Node Selection?
- All planned nodes implemented?
- Extra nodes not in plan (document rationale)?

**Data Flow Consistency:**
- Input schema from spec → validated in workflow?
- Output schema from spec → produced by workflow?
- Transformations from plan → implemented in workflow?

**Integration Consistency:**
- Service names match across spec/plan/workflow?
- Authentication methods match plan?
- Configuration matches plan's INT-N Configuration?

#### D. Configuration Quality

**Node Configuration:**
- Required parameters present (validate with MCP tools)
- Parameter values appropriate (no placeholder values)
- Credentials properly referenced
- Timeout and retry configs match plan

**Expression Quality:**
- Correct n8n expression syntax `={{ ... }}`
- Valid node references
- No references to non-existent nodes
- No undefined field accesses (where verifiable)

**Position Quality:**
- No overlapping nodes (same [x, y])
- Consistent spacing (roughly 250px between nodes)
- Error handlers positioned appropriately

#### E. Error Handling Completeness

**For each integration/operation:**
- Error output configured or try/catch implemented?
- Error notification node present?
- Retry logic matches plan (if specified)?
- Fallback path exists (if specified)?

**Error Scenarios Coverage:**
- Each ES-N from spec has corresponding error handler?
- Error detection logic implemented?
- Notification channels match spec?

#### F. Non-Functional Requirements

**Performance (NFR-1):**
- Batch processing configured (if needed for volume)?
- Parallel execution used where appropriate?
- Timeout settings appropriate?

**Reliability (NFR-2):**
- Retry strategies implemented?
- Success rate trackable?
- Error recovery paths exist?

**Observability (NFR-3):**
- Logging nodes present (if required)?
- Monitoring hooks configured?
- Alerting configured per spec?

#### G. Constitution Alignment

**For each principle:**
- Workflow adheres to MUST requirements?
- SHOULD recommendations followed (or justified)?
- No violations of project standards?

**Common Checks:**
- Credential handling (never hardcoded)
- Error handling completeness
- Testing coverage
- Documentation requirements

#### H. Task Completion Verification

**From tasks.md:**
- All tasks marked complete [X]?
- All task acceptance criteria verifiable in workflow?
- Parallel execution opportunities used [P]?
- Dependencies respected?

### 5. Severity Assignment

Prioritize findings:

**CRITICAL:**
- MCP validation failures (invalid structure, expressions)
- Violates constitution MUST principle
- Missing required functionality (P1 requirement not implemented)
- Disconnected/orphaned nodes
- Invalid credentials references
- Circular dependencies

**HIGH:**
- P2 requirement not implemented
- Integration missing error handling
- Missing retry logic (when specified)
- Expression references non-existent node
- Configuration mismatch between plan and workflow
- Missing edge case handling

**MEDIUM:**
- P3 requirement not implemented
- Inconsistent terminology across artifacts
- Missing non-functional requirement (monitoring, logging)
- Suboptimal node positioning
- Missing documentation

**LOW:**
- Style/naming improvements
- Optional features not implemented
- Minor documentation gaps

### 6. Produce Compact Analysis Report

Output markdown report (no file writes):

```markdown
# Workflow Analysis Report: [WORKFLOW_NAME]

**Generated**: [DATE]
**Workflow File**: [Path]
**Status**: [PASS / FAIL / WARNING]

## Executive Summary

- **Total Findings**: [Count] (Critical: X, High: Y, Medium: Z, Low: W)
- **MCP Validation**: [PASS / FAIL]
- **Requirements Coverage**: [X/Y requirements implemented] ([%])
- **Constitution Compliance**: [PASS / FAIL]
- **Recommendation**: [DEPLOY / FIX CRITICAL / FIX HIGH PRIORITY]

---

## MCP Validation Results

### Workflow Structure
[Output from mcp_n8n-mcp_validate_workflow]
- ✓ / ✗ Valid JSON structure
- ✓ / ✗ All required node fields present
- ✓ / ✗ No validation errors

### Connections
[Output from mcp_n8n-mcp_validate_workflow_connections]
- ✓ / ✗ All nodes connected
- ✓ / ✗ No orphaned nodes
- ✓ / ✗ No circular dependencies
- ✓ / ✗ AI tool connections valid (if applicable)

### Expressions
[Output from mcp_n8n-mcp_validate_workflow_expressions]
- ✓ / ✗ All expressions valid syntax
- ✓ / ✗ All node references valid
- ✓ / ✗ No undefined field accesses

---

## Detailed Findings

| ID | Severity | Category | Location | Summary | Recommendation |
|----|----------|----------|----------|---------|----------------|
| A1 | CRITICAL | Structure | Node "xyz" | Missing required parameter 'url' | Add url parameter per plan.md |
| A2 | HIGH | Coverage | FR-3 | No nodes implement user notification requirement | Add notification node |
| A3 | MEDIUM | Consistency | Integration INT-2 | Auth method differs from plan | Update to use API Key per plan |

[One row per finding, max 50 rows]

---

## Requirements Coverage Analysis

### Functional Requirements

| Requirement | Priority | Implemented | Nodes | Status | Notes |
|-------------|----------|-------------|-------|--------|-------|
| FR-1: [Desc] | P1 | ✓ | trigger, process | PASS | Complete |
| FR-2: [Desc] | P1 | ✗ | - | FAIL | Not implemented |
| FR-3: [Desc] | P2 | ⚠ | notify | PARTIAL | Missing error case |

**Coverage Summary:**
- P1 Requirements: X/Y implemented ([%])
- P2 Requirements: X/Y implemented ([%])
- P3 Requirements: X/Y implemented ([%])
- **Overall: X/Y ([%])**

### Integration Requirements

| Integration | Specified | Implemented | Auth Configured | Error Handling | Status |
|-------------|-----------|-------------|-----------------|----------------|--------|
| INT-1: Slack | ✓ | ✓ | ✓ | ✓ | PASS |
| INT-2: Database | ✓ | ✓ | ✓ | ✗ | FAIL |

### Error Scenarios

| Scenario | Specified | Handler Node | Notification | Retry | Status |
|----------|-----------|--------------|--------------|-------|--------|
| ES-1: API Timeout | ✓ | error-handler | ✓ | ✓ | PASS |
| ES-2: Validation Fail | ✓ | - | ✗ | ✗ | FAIL |

### Edge Cases

| Case | Specified | Handled | Notes |
|------|-----------|---------|-------|
| EC-1: Empty input | ✓ | ✓ | IF node checks |
| EC-2: Malformed data | ✓ | ✗ | Not handled |

---

## Node Inventory

**Total Nodes**: [Count]

| Node ID | Type | Purpose | From Plan | Configured | Connected | Status |
|---------|------|---------|-----------|------------|-----------|--------|
| trigger | webhook | Receive data | ✓ | ✓ | ✓ | ✓ PASS |
| validate | code | Validate input | ✓ | ✓ | ✓ | ✓ PASS |
| process | set | Transform data | ✓ | ⚠ | ✓ | ⚠ INCOMPLETE |

**Issues:**
- [List nodes with configuration or connection problems]

---

## Spec-Plan-Workflow Consistency

### Data Flow Consistency

| Flow Element | Spec | Plan | Workflow | Status |
|--------------|------|------|----------|--------|
| Input validation | Required fields listed | Code node validation | Implemented | ✓ CONSISTENT |
| API call timeout | 30s | 30s | 10s | ✗ INCONSISTENT |

**Inconsistencies Found:** [Count]

### Terminology Consistency

| Term | Spec | Plan | Workflow | Status |
|------|------|------|----------|--------|
| User record | user_record | user | user_record | ⚠ PARTIAL |

---

## Non-Functional Requirements Compliance

### NFR-1: Performance
- Target: [From spec]
- Design: [From plan]
- Implementation: [From workflow analysis]
- Status: ✓ / ✗ / ⚠

### NFR-2: Reliability
- Target: [From spec]
- Implementation: [Error handlers, retries]
- Status: ✓ / ✗ / ⚠

### NFR-3: Observability
- Target: [From spec]
- Implementation: [Logging nodes, monitoring]
- Status: ✓ / ✗ / ⚠

---

## Constitution Alignment

| Principle | Requirement | Workflow Status | Evidence |
|-----------|-------------|-----------------|----------|
| [Principle 1] | [Requirement] | ✓ PASS / ✗ FAIL | [Where validated] |

**Violations Found:** [Count]
**Critical Violations:** [List any MUST principle violations]

---

## Configuration Quality Analysis

### Credentials
- Total credential references: [Count]
- Valid references: [Count]
- Issues: [List any problems]

### Expressions
- Total expressions: [Count]
- Valid syntax: [Count]
- Invalid references: [Count]
- Issues: [List specific problems]

### Node Positioning
- Overlapping nodes: [Count]
- Inconsistent spacing: [Count]
- Recommendations: [Positioning improvements]

---

## Task Completion Status

**From tasks.md:**

| Phase | Tasks Total | Tasks Complete | Status |
|-------|-------------|----------------|--------|
| Setup | X | X | ✓ COMPLETE |
| Core | Y | Y-1 | ⚠ INCOMPLETE |

**Incomplete Tasks:** [List tasks still marked [ ] ]

---

## Metrics Summary

- **Total Requirements**: [Count]
- **Implemented Requirements**: [Count] ([%])
- **Total Nodes**: [Count]
- **Validated Nodes**: [Count]
- **Critical Issues**: [Count]
- **High Priority Issues**: [Count]
- **Constitution Violations**: [Count]
- **MCP Validation**: [PASS/FAIL]

---

## Overall Assessment

**Deployment Readiness**: [READY / NOT READY / READY WITH WARNINGS]

**Critical Blockers:** [Count]
[List critical issues that must be fixed]

**Recommended Actions:**
1. [Priority 1 action]
2. [Priority 2 action]
3. [Priority 3 action]

**If READY**: Workflow meets all requirements and quality gates. Proceed to deployment.

**If NOT READY**: Critical issues must be resolved before deployment. See findings above.

**If READY WITH WARNINGS**: Workflow is functional but has non-critical issues. Consider fixing before deployment.

---

## Next Actions

### If Critical Issues Exist:
- Recommend resolving critical issues before deployment
- Provide specific fixes for each CRITICAL finding
- Suggest re-running `/n8n.analyze` after fixes

### If Only High/Medium Issues:
- User may deploy with warnings
- Provide improvement suggestions
- Optional: Fix issues incrementally post-deployment

### Suggested Commands:
- Fix specific issues: Edit workflow JSON and re-analyze
- Update plan: `/n8n.plan` to adjust architecture
- Update tasks: Manually edit tasks.md to add missing coverage

---

## Appendix: Unmapped Elements

### Unmapped Requirements
[Requirements from spec not covered by workflow nodes]

### Unmapped Nodes
[Nodes in workflow not traced to requirements]

### Unmapped Tasks
[Tasks from tasks.md not reflected in workflow]
```

### 7. Offer Remediation

Ask user: "Would you like me to suggest concrete remediation edits for the top N critical/high issues?" (Do NOT apply automatically.)

## Operating Principles

### Context Efficiency
- **Minimal high-signal tokens**: Focus on actionable findings
- **Progressive disclosure**: Load artifacts incrementally
- **Token-efficient output**: Limit findings table to 50 rows
- **Deterministic results**: Rerunning without changes produces consistent results

### Analysis Guidelines
- **NEVER modify files** (read-only analysis)
- **NEVER hallucinate missing sections** (report accurately)
- **Prioritize constitution violations** (always CRITICAL)
- **Use MCP validation tools** (authoritative for structure/expression validation)
- **Report zero issues gracefully** (emit success report with metrics)

### MCP Tool Integration

Always use these for definitive validation:
```javascript
// Primary validation - run first
mcp_n8n-mcp_validate_workflow(workflow)

// Connection validation
mcp_n8n-mcp_validate_workflow_connections(workflow)

// Expression validation
mcp_n8n-mcp_validate_workflow_expressions(workflow)

// Node-specific validation (if checking specific configurations)
mcp_n8n-mcp_validate_node_operation(nodeType, nodeConfig, 'runtime')
```

## Common Issues to Detect

### Structure Issues
- Missing required workflow fields (name, nodes, connections)
- Invalid node structure (missing id, name, type, position)
- Missing typeVersion
- Invalid node type references

### Connection Issues
- Orphaned nodes (no incoming or outgoing connections)
- Invalid node references in connections
- Circular dependencies
- Multiple incompatible connections

### Expression Issues
- Missing `=` prefix: `{{ ... }}` should be `={{ ... }}`
- Invalid node references: `$node["NonExistent"]`
- Syntax errors in expressions
- Undefined field access

### Coverage Issues
- P1 requirements not implemented
- Missing error handlers for critical operations
- No retry logic for flaky integrations
- Missing input validation

### Configuration Issues
- Hardcoded credentials (instead of references)
- Placeholder values in production workflow
- Timeout too short for long operations
- Missing required parameters

### Consistency Issues
- Node types differ from plan
- Authentication methods differ from plan
- Data transformations don't match spec
- Terminology inconsistent across artifacts

## Context

$ARGUMENTS

