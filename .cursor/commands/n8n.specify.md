---
name: n8n-specify
description: Create n8n workflow specification from natural language requirements
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Goal

Create a complete, implementation-ready specification for an n8n workflow that captures WHAT the workflow should do without specifying HOW (node types, specific configurations).

## Outline

The text the user typed after this command **is** the workflow description. Do not ask the user to repeat it unless they provided an empty command.

Given that workflow description, do this:

1. **Initialize Feature Structure**: Run `.specify/scripts/bash/create-new-feature.sh --json "$ARGUMENTS"` from repo root and parse JSON output for BRANCH_NAME and SPEC_FILE. All paths must be absolute.
   **IMPORTANT**: Run this script only once. Parse the JSON output for actual paths.

2. **Load Template**: Read `.specify/templates/spec-template.md` to understand required sections.

3. **Execute Specification Workflow**:
   
   a. **Parse user description**:
      - If empty: ERROR "No workflow description provided"
      - Extract: trigger events, data sources, transformations, outputs, integrations, error handling needs
   
   b. **Identify workflow characteristics**:
      - **Trigger type**: Manual, webhook, schedule, event-driven, chat, email
      - **Data flow**: Input sources → transformations → outputs
      - **Integrations**: External services, APIs, databases
      - **Complexity**: Simple (≤5 operations), Medium (6-15), Complex (>15)
      - **Error handling**: Required error scenarios, fallback behavior
   
   c. **Handle unclear aspects**:
      - Make informed guesses based on common n8n patterns
      - Only mark with [NEEDS CLARIFICATION: specific question] if:
        * Choice significantly impacts workflow architecture or node selection
        * Multiple reasonable interpretations exist with different implications
        * No reasonable default exists (e.g., webhook vs schedule trigger)
      - **LIMIT: Maximum 3 [NEEDS CLARIFICATION] markers total**
      - Prioritize: trigger type > integrations > data flow > error handling
   
   d. **Generate Workflow Requirements**:
      - Each requirement must be testable by executing the workflow
      - Use reasonable defaults for unspecified details (document in Assumptions)
   
   e. **Define Success Criteria**:
      - Create measurable, node-agnostic outcomes
      - Include: execution time, success rate, data accuracy, error handling
      - Each criterion must be verifiable by workflow execution
   
   f. **Return**: SUCCESS (spec ready for clarification or planning)

4. **Write Specification**: Create SPEC_FILE using this structure:

```markdown
# Workflow Specification: [WORKFLOW_NAME]

**Created**: [DATE]
**Status**: Draft
**Type**: [automation|integration|ai-agent|data-processing|notification]

## Overview

### Purpose
[What business problem does this workflow solve? Why is it needed?]

### Scope
**In Scope:**
- [What this workflow will do]
- [Key capabilities included]

**Out of Scope:**
- [What this workflow will NOT do]
- [Related functionality handled elsewhere]

### Workflow Decomposition

**Complexity Assessment**: [simple|moderate|complex]
- Simple: Single linear flow, < 10 nodes expected
- Moderate: Some branching, 10-20 nodes expected
- Complex: Multiple logical domains, > 20 nodes expected

**Decomposition Candidates** (for complex workflows):
If this workflow involves multiple distinct logical operations or domains, consider decomposition:
- **Sub-workflow 1**: [Logical operation/domain] - [Purpose]
- **Sub-workflow 2**: [Logical operation/domain] - [Purpose]
- **Coordination**: [How sub-workflows interact]

**Rationale for Decomposition** (if applicable):
- [Reusability: Sub-workflow used in multiple parent workflows]
- [Maintainability: Separate concerns for easier updates]
- [Testing: Independent testing of logical components]
- [Performance: Parallel execution opportunities]
- [Clarity: Simpler individual workflows vs. one complex workflow]

**Note**: Final decomposition decision made during `/n8n.plan` phase based on technical analysis.

### Trigger
**Type**: [manual|webhook|schedule|event|email|chat]
**Description**: [When and how should this workflow execute?]
**Frequency**: [one-time|on-demand|hourly|daily|event-driven]

## Workflow Requirements

### Functional Requirements

#### FR-1: [Requirement Name]
**Description**: [What must the workflow do?]
**Acceptance Criteria**:
- [ ] [Specific, testable criteria]
- [ ] [Observable behavior that must occur]
**Priority**: [P1|P2|P3]

[Additional FRs as needed...]

### Data Requirements

#### Input Data
- **Source**: [Where does data come from? API, file, webhook payload, manual input]
- **Format**: [JSON, CSV, XML, plain text, binary]
- **Required Fields**: 
  - `field_name`: [type] - [description]
- **Validation Rules**: [What makes input data valid?]
- **Volume**: [How many items per execution? Batch size?]

#### Output Data
- **Destination**: [Where does output go? Database, file, API, notification]
- **Format**: [JSON, CSV, email, Slack message]
- **Required Fields**:
  - `field_name`: [type] - [description]
- **Success Indicators**: [What indicates successful output?]

#### Data Transformations
- [Input field] → [Transformation logic] → [Output field]
- [Describe any calculations, formatting, enrichment needed]

### Integration Requirements

#### INT-1: [Service Name]
**Purpose**: [Why integrate with this service?]
**Operations**: [What operations are needed? Read, write, query, notify]
**Authentication**: [API key, OAuth, basic auth, none]
**Rate Limits**: [Known rate limits or quotas]
**Failure Behavior**: [What happens if this service is unavailable?]

[Additional integrations as needed...]

### Non-Functional Requirements

#### NFR-1: Performance
- Execution time: [Target duration per run]
- Throughput: [Items processed per minute]
- Timeout tolerance: [Maximum acceptable wait time]

#### NFR-2: Reliability
- Success rate target: [e.g., 99% of executions succeed]
- Retry strategy: [Should failed items retry? How many times?]
- Error notification: [Who/what should be notified on failure?]

#### NFR-3: Observability
- Logging requirements: [What should be logged?]
- Monitoring needs: [What metrics should be tracked?]
- Alerting: [What triggers alerts?]

#### NFR-4: Testing & Validation
- Testing approach: [MCP validation, CLI execution, end-to-end, visual regression]
- Test coverage requirements: [Which scenarios must be tested?]
- Automation requirements: [CI/CD integration needed?]
- Test data requirements: [Sample inputs for testing]

## User Scenarios & Testing

### Scenario 1: [Primary Use Case]
**Given**: [Initial state/input]
**When**: [Trigger event occurs]
**Then**: [Expected workflow behavior and output]
**Success Criteria**: [How to verify this scenario works]

[Additional scenarios...]

### Edge Cases

#### EC-1: [Edge Case Name]
**Scenario**: [What unusual situation might occur?]
**Expected Behavior**: [How should workflow handle this?]
**Example**: [Concrete example of this edge case]

[Additional edge cases: empty data, malformed input, service timeout, rate limit hit, concurrent executions...]

### Error Scenarios

#### ES-1: [Error Name]
**Trigger**: [What causes this error?]
**Detection**: [How does workflow know this error occurred?]
**Response**: [What should workflow do?]
**Notification**: [Who/what should be notified?]
**Recovery**: [Can workflow retry? Fallback behavior?]

[Additional error scenarios...]

## Success Criteria

[Node-agnostic, measurable outcomes. NO mention of specific node types.]

**Primary Success Criteria:**
- [ ] [Measurable outcome 1 - e.g., "Process 100 records in under 5 minutes"]
- [ ] [Measurable outcome 2 - e.g., "99% of valid inputs produce expected output"]
- [ ] [Measurable outcome 3 - e.g., "Failed executions trigger notifications within 30 seconds"]

**Quality Criteria:**
- [ ] [Data accuracy - e.g., "Transformed data matches expected format 100%"]
- [ ] [Error handling - e.g., "All error scenarios have defined recovery paths"]
- [ ] [Observability - e.g., "All executions are logged with sufficient detail for debugging"]

## Key Entities

[If workflow processes structured data, define entities here]

### Entity: [EntityName]
**Description**: [What this entity represents]
**Fields**:
- `field_name`: [type] - [description, constraints]
**Validation Rules**: [What makes this entity valid?]
**Relationships**: [How does this relate to other entities?]

## Dependencies & Assumptions

### External Dependencies
- [Service name]: [Why needed? What's required?]
- [API endpoint]: [Purpose, availability expectations]

### Assumptions
- [Assumption about data availability]
- [Assumption about service uptime]
- [Assumption about execution environment]

### Constraints
- [Known limitation 1]
- [Known limitation 2]

## Clarifications

[This section will be populated by /n8n.clarify command]

## Notes

[Any additional context, background, or future considerations]
```

5. **Specification Quality Validation**: After writing the initial spec, validate it:

   a. **Create Quality Checklist**: Generate `FEATURE_DIR/checklists/requirements.md`:
   
   ```markdown
   # Workflow Specification Quality Checklist
   
   **Purpose**: Validate workflow specification completeness before planning
   **Created**: [DATE]
   **Feature**: [Link to spec.md]
   
   ## Content Quality
   
   - [ ] No node-specific implementation details (HTTP Request node, Set node, etc.)
   - [ ] Focused on WHAT workflow does, not HOW it's built
   - [ ] Written for stakeholders, not just n8n developers
   - [ ] All mandatory sections completed
   
   ## Requirement Completeness
   
   - [ ] No [NEEDS CLARIFICATION] markers remain
   - [ ] Trigger type is clearly defined
   - [ ] Input data sources and formats specified
   - [ ] Output destinations and formats specified
   - [ ] All integrations identified with authentication needs
   - [ ] Success criteria are measurable and node-agnostic
   - [ ] Error scenarios are defined with recovery strategies
   - [ ] Edge cases are identified
   - [ ] Data validation rules are specified
   
   ## Workflow Readiness
   
   - [ ] All functional requirements have clear acceptance criteria
   - [ ] Primary use case scenario is well-defined
   - [ ] Workflow can be tested without knowing node implementation
   - [ ] Performance and reliability targets are quantified
   - [ ] Dependencies and assumptions are documented
   
   ## Notes
   
   - Items marked incomplete require spec updates before `/n8n.clarify` or `/n8n.plan`
   ```
   
   b. **Run Validation**: Review spec against checklist items
   
   c. **Handle Validation Results**:
      
      - **If all items pass**: Mark checklist complete, proceed to step 6
      
      - **If items fail (excluding [NEEDS CLARIFICATION])**:
        1. List failing items and specific issues
        2. Update spec to address each issue
        3. Re-run validation until all pass (max 3 iterations)
        4. If still failing after 3 iterations, document remaining issues
      
      - **If [NEEDS CLARIFICATION] markers remain** (max 3):
        1. Extract all markers from spec
        2. Present each as a question with options:
        
        ```markdown
        ## Question [N]: [Topic]
        
        **Context**: [Quote relevant spec section]
        
        **What we need to know**: [Question from marker]
        
        **Suggested Answers**:
        
        | Option | Answer | Implications |
        |--------|--------|--------------|
        | A      | [First option] | [Impact on workflow] |
        | B      | [Second option] | [Impact on workflow] |
        | C      | [Third option] | [Impact on workflow] |
        | Custom | Provide your own answer | [How to provide custom input] |
        
        **Your choice**: _[Wait for response]_
        ```
        
        3. Number questions Q1, Q2, Q3 (max 3 total)
        4. Present all questions together
        5. Wait for user responses
        6. Update spec by replacing markers with answers
        7. Re-run validation
   
   d. **Update Checklist**: After each iteration, update checklist with current status

6. **Report Completion**:
   - Branch name and spec file path
   - Checklist validation results
   - Workflow complexity estimate
   - Readiness for next phase (`/n8n.clarify` or `/n8n.plan`)

## Key Principles

### What to Specify

**Focus on:**
- Business requirements and outcomes
- Data flow and transformations
- Integration needs and behavior
- Error handling and recovery
- Success and failure criteria

**Examples:**
- ✅ "Workflow processes incoming webhook data, validates required fields, stores in database, sends Slack notification"
- ✅ "On validation failure, workflow logs error and sends alert to #errors channel"
- ✅ "Workflow runs every hour and processes up to 100 records per execution"

### What NOT to Specify

**Avoid:**
- Specific node types (HTTP Request, Set, IF, Code)
- Node configuration details
- n8n expressions or syntax
- Node positioning or connections

**Examples:**
- ❌ "Use HTTP Request node to call API"
- ❌ "Use Set node to transform data with expression `={{ $json.field }}`"
- ❌ "Connect Webhook node to IF node to Filter node"

### Success Criteria Guidelines

Success criteria must be:
1. **Measurable**: Include specific metrics (time, rate, count, percentage)
2. **Node-agnostic**: No mention of n8n nodes or implementation
3. **Outcome-focused**: Describe results, not process
4. **Verifiable**: Can be tested by executing the workflow

**Good examples**:
- "Process 100 webhook requests per minute without errors"
- "99% of executions complete within 30 seconds"
- "All failed validations trigger immediate error notifications"
- "Transformed data matches expected schema 100% of the time"

**Bad examples** (implementation-focused):
- "HTTP Request node completes in under 200ms" (too technical)
- "Set node transforms all fields correctly" (node-specific)
- "Workflow has no disconnected nodes" (implementation detail)

## Clarification Guidelines

### When to Add [NEEDS CLARIFICATION]

Only for critical decisions that:
1. **Block workflow architecture**: Can't determine trigger type, execution model
2. **Affect integration design**: Multiple authentication options, unclear API endpoints
3. **Impact data flow**: Ambiguous data sources, unclear transformation logic
4. **Have no reasonable default**: Webhook vs schedule, sync vs async

### What Has Reasonable Defaults (don't ask)

- Error notification method: Assume email or most common channel mentioned
- Data format: Assume JSON for APIs, CSV for files (unless specified)
- Retry strategy: Standard 3 retries with exponential backoff
- Execution timeout: 5 minutes for simple workflows, 30 minutes for complex
- Logging level: Standard execution logging with errors captured

## Workflow Types

Common workflow types to guide specification:

- **Automation**: Triggered by schedule or event, performs routine tasks
- **Integration**: Connects two or more services, syncs data bidirectionally
- **AI Agent**: Uses LLM to process natural language, make decisions
- **Data Processing**: Transforms, validates, enriches data from sources
- **Notification**: Monitors conditions, sends alerts when triggered
- **Webhook Handler**: Receives HTTP requests, processes and responds
- **Scheduled Report**: Runs on schedule, generates and sends reports

Identify workflow type early to guide requirement gathering.

---

Now, describe the workflow you want to specify.

I will create a complete specification that's ready for clarification and planning.

