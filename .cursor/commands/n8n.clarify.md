---
name: n8n-clarify
description: Identify underspecified areas in workflow specification through targeted clarification questions
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Goal

Detect and reduce ambiguity in the workflow specification before planning and implementation. This ensures the workflow design is complete and unambiguous.

**Note**: This workflow is expected to run BEFORE `/n8n.plan`. If user explicitly skips clarification, warn that implementation rework risk increases.

## Execution Steps

### 1. Initialize Context

Run `.specify/scripts/bash/check-prerequisites.sh --json --paths-only` from repo root **once**. Parse JSON for:
- `FEATURE_DIR`
- `FEATURE_SPEC`

If JSON parsing fails, instruct user to re-run `/n8n.specify` or verify feature branch environment.

### 2. Load and Analyze Spec

Load current spec file. Perform structured ambiguity scan using this n8n-specific taxonomy:

#### Trigger & Execution Context
- Trigger type clarity (manual, webhook, schedule, event)
- Execution frequency and timing
- Who/what initiates execution
- Concurrent execution handling

#### Data Flow & Sources
- Input data sources identified
- Data format specifications
- Field mappings defined
- Data volume and batching strategy
- Output destinations specified

#### Integration & External Services
- All external services identified
- Authentication methods specified
- API endpoints and versions
- Rate limits and quotas understood
- Service failure handling defined

#### Processing Logic
- Transformation rules clarity
- Filtering and validation criteria
- Conditional logic specifications
- Looping and iteration requirements
- Data enrichment needs

#### Error Handling & Recovery
- Error detection strategies
- Retry and fallback behavior
- Failure notification channels
- Partial failure handling
- Timeout and rate limit responses

#### Non-Functional Attributes
- Performance targets (latency, throughput)
- Reliability expectations (success rate, uptime)
- Scalability requirements (concurrent executions, data volume)
- Observability needs (logging, monitoring, alerting)
- Security and authentication requirements

#### Testing & Validation
- Success criteria testability
- Edge case coverage
- Error scenario completeness
- Acceptance criteria clarity

#### Dependencies & Constraints
- External dependencies documented
- Environment requirements
- Technical constraints
- Explicit tradeoffs or limitations

#### Terminology & Consistency
- Consistent field naming
- Clear entity definitions
- Avoided ambiguous terms ("fast", "robust", "reliable" without metrics)

Mark each category: **Clear** / **Partial** / **Missing**

### 3. Generate Prioritized Questions

Create prioritized queue of clarification questions (maximum 5 total). Apply these constraints:

**Question Criteria:**
- Must be answerable with:
  * Multiple-choice (2-5 mutually exclusive options), OR
  * Short answer (≤5 words)
- Must materially impact:
  * Workflow architecture (trigger type, execution model)
  * Node selection (integration requirements, data operations)
  * Error handling strategy (retry, fallback, notifications)
  * Data flow design (sources, transformations, outputs)
  * Operational readiness (monitoring, alerting, scaling)

**Prioritization Rules:**
1. **Trigger & Execution** (blocks entire workflow structure)
2. **Critical Integrations** (affects authentication, node types, data flow)
3. **Data Flow** (input sources, output destinations, transformations)
4. **Error Handling** (retry strategy, notification channels, recovery)
5. **Performance & Scale** (throughput, concurrency, timeouts)

**Category Coverage:**
- Balance coverage across high-impact unresolved categories
- Prioritize by (Impact × Uncertainty) heuristic
- Avoid two low-impact questions when high-impact area remains unresolved

### 4. Interactive Questioning Loop

Present **EXACTLY ONE question at a time**:

**Multiple-Choice Format:**
```markdown
## Question [N]: [Topic]

**Category**: [Trigger/Integration/Data Flow/Error Handling/etc.]
**Impact**: [How this affects workflow design]

| Option | Description |
|--------|-------------|
| A | [Option A description] |
| B | [Option B description] |
| C | [Option C description] |
| D | [Option D description] (if needed) |
| Short | Provide different answer (≤5 words) |
```

**Short-Answer Format:**
```markdown
## Question [N]: [Topic]

**Category**: [Category name]
**Impact**: [How this affects workflow design]

**Format**: Short answer (≤5 words)
```

**After User Answers:**
- Validate answer maps to option or fits ≤5 word constraint
- If ambiguous, ask for quick disambiguation (doesn't count as new question)
- Record answer in working memory (don't write to disk yet)
- Move to next question

**Stop Conditions:**
- All critical ambiguities resolved early (remaining questions unnecessary)
- User signals completion ("done", "good", "no more", "proceed")
- Reached 5 asked questions

**Important:**
- Never reveal future queued questions in advance
- If no valid questions exist at start, immediately report no critical ambiguities

### 5. Integrate Answers (Incremental Updates)

After EACH accepted answer:

**First Integration:**
- Ensure `## Clarifications` section exists (create after Overview if missing)
- Create `### Session YYYY-MM-DD` subheading for today

**For Each Answer:**
- Append bullet: `- Q: <question> → A: <final answer>`
- Apply clarification to appropriate section(s):
  
  | Clarification Type | Target Section |
  |--------------------|----------------|
  | Trigger type/timing | **Trigger** subsection in Overview |
  | Integration details | **Integration Requirements** (INT-N) |
  | Data source/format | **Data Requirements** → Input Data |
  | Output destination | **Data Requirements** → Output Data |
  | Transformation logic | **Data Requirements** → Data Transformations |
  | Error handling | **Error Scenarios** (ES-N) |
  | Performance target | **Non-Functional Requirements** → NFR-1: Performance |
  | Edge case behavior | **Edge Cases** (EC-N) |

- If clarification invalidates earlier statement, **replace** (don't duplicate)
- Keep each integration minimal and testable
- Save spec file AFTER each integration (atomic overwrite)
- Preserve formatting and heading hierarchy

### 6. Validation (After Each Write + Final Pass)

Check:
- [ ] Clarifications session contains exactly one bullet per accepted answer
- [ ] Total asked questions ≤ 5
- [ ] Updated sections contain no lingering vague placeholders
- [ ] No contradictory earlier statements remain
- [ ] Markdown structure valid
- [ ] Only allowed new headings: `## Clarifications`, `### Session YYYY-MM-DD`
- [ ] Terminology consistency across all sections

### 7. Write Updated Spec

Save updated spec back to `FEATURE_SPEC`.

### 8. Report Completion

After questioning loop ends:

**Summary:**
- Number of questions asked & answered
- Path to updated spec
- Sections touched (list names)

**Coverage Summary Table:**

| Category | Status | Notes |
|----------|--------|-------|
| Trigger & Execution | Resolved/Deferred/Clear/Outstanding | [Notes] |
| Data Flow & Sources | Resolved/Deferred/Clear/Outstanding | [Notes] |
| Integration & Services | Resolved/Deferred/Clear/Outstanding | [Notes] |
| Error Handling | Resolved/Deferred/Clear/Outstanding | [Notes] |
| Non-Functional | Resolved/Deferred/Clear/Outstanding | [Notes] |

**Status Definitions:**
- **Resolved**: Was Partial/Missing, now addressed by clarification
- **Deferred**: Exceeds question quota or better suited for planning phase
- **Clear**: Already sufficient in original spec
- **Outstanding**: Still Partial/Missing but low impact

**Recommendations:**
- If Outstanding/Deferred remain, advise whether to:
  * Proceed to `/n8n.plan` (if low impact)
  * Run `/n8n.clarify` again post-plan
  * Gather more requirements before proceeding

**Suggested Next Command:** `/n8n.plan` or additional clarification

## Behavior Rules

- **If no meaningful ambiguities found**: Respond "No critical ambiguities detected. Spec is ready for planning." and suggest proceeding
- **If spec file missing**: Instruct user to run `/n8n.specify` first (don't create new spec)
- **Never exceed 5 total questions**: Clarification retries for same question don't count
- **Avoid speculative questions**: Don't ask about node types unless functional clarity requires it
- **Respect early termination**: Honor "stop", "done", "proceed" signals
- **If no questions asked due to full coverage**: Output compact coverage summary (all Clear), suggest advancing
- **If quota reached with unresolved high-impact categories**: Explicitly flag under Deferred with rationale

## Common n8n Clarification Patterns

### Trigger Type Ambiguity

**Indicators**: "automated", "when X happens", unclear timing
**Question**: "How should this workflow be triggered?"
**Options**: Manual/Webhook/Schedule/Event

### Integration Authentication

**Indicators**: Service mentioned without auth details
**Question**: "What authentication is needed for [Service]?"
**Options**: API Key/OAuth/Basic Auth/None

### Data Format Uncertainty

**Indicators**: "data", "information" without format
**Question**: "What format is the input data?"
**Options**: JSON/CSV/XML/Plain Text

### Error Notification Channel

**Indicators**: "notify on error" without channel
**Question**: "Where should error notifications go?"
**Options**: Email/Slack/Webhook/Log Only

### Execution Frequency

**Indicators**: "regularly", "periodically" without specifics
**Question**: "How often should this workflow run?"
**Options**: Hourly/Daily/Weekly/Custom Schedule

## Context for Prioritization

$ARGUMENTS

