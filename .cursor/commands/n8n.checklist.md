---
name: n8n-checklist
description: Generate custom quality checklist for n8n workflow based on requirements and implementation stage
---

## Checklist Purpose: "Unit Tests for Workflow Requirements"

**CRITICAL CONCEPT**: Checklists are **UNIT TESTS FOR WORKFLOW REQUIREMENTS** - they validate the quality, clarity, and completeness of workflow requirements and design in n8n.

**NOT for verification/testing**:
- ❌ NOT "Verify the webhook returns 200 OK"
- ❌ NOT "Test the Set node transforms data correctly"
- ❌ NOT "Confirm the workflow executes without errors"
- ❌ NOT checking if implementation works

**FOR requirements and design quality validation**:
- ✅ "Are trigger requirements clearly specified with type and timing?" (completeness)
- ✅ "Is 'fast processing' quantified with specific execution time targets?" (clarity)
- ✅ "Are error notification requirements consistent across all failure scenarios?" (consistency)
- ✅ "Are node selection criteria documented with rationale?" (traceability)
- ✅ "Does the plan define what happens when API rate limit is hit?" (edge cases)

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Execution Steps

### 1. Setup

Run `.specify/scripts/bash/check-prerequisites.sh --json` from repo root and parse JSON for:
- `FEATURE_DIR`
- `AVAILABLE_DOCS` list

All file paths must be absolute.

### 2. Clarify Intent (Dynamic)

Derive up to THREE initial contextual clarifying questions. They MUST:
- Be generated from user's phrasing + signals from spec/plan/workflow
- Only ask about information that materially changes checklist content
- Be skipped individually if already unambiguous in `$ARGUMENTS`
- Prefer precision over breadth

**Generation Algorithm:**

1. **Extract signals** from context:
   - Workflow domain keywords (webhook, schedule, ai-agent, integration, data-processing)
   - Risk indicators ("critical", "must", "production", "user-facing")
   - Stakeholder hints ("review", "testing", "deployment", "documentation")
   - Implementation stage (spec-only, planning, implementation, deployment)
   - Explicit deliverables ("validation", "error-handling", "performance", "security")

2. **Cluster signals** into candidate focus areas (max 4) ranked by relevance:
   - Requirements Quality (spec completeness, clarity, testability)
   - Architecture Quality (node selection, data flow, integration design)
   - Implementation Quality (configuration, expressions, error handling)
   - Deployment Readiness (testing, documentation, monitoring)

3. **Identify probable context** (if not explicit):
   - Stage: Spec review / Planning review / Pre-implementation / Post-implementation
   - Audience: Author / Peer reviewer / QA / Deployer
   - Depth: Quick sanity check / Standard review / Comprehensive audit

4. **Detect missing dimensions**:
   - Scope breadth (all workflows or specific integration?)
   - Depth/rigor (quick review or deployment gate?)
   - Risk emphasis (error handling, security, performance)
   - Exclusion boundaries (what to skip?)

5. **Formulate questions** from these archetypes:
   - **Scope refinement**: "Should this checklist cover all integrations or focus on [specific service]?"
   - **Risk prioritization**: "Which of these risk areas should receive mandatory checks: error handling, performance, security, data validation?"
   - **Depth calibration**: "Is this a pre-planning spec review or a pre-deployment audit?"
   - **Audience framing**: "Will this be used by the author, peer reviewers, or QA team?"
   - **Boundary exclusion**: "Should we explicitly exclude [specific area] from this checklist?"
   - **Stage-specific**: "Are you reviewing spec quality, plan architecture, or implemented workflow?"

**Question Formatting:**
- If options exist, use compact table with: Option | Candidate | Why It Matters
- Limit to A-E options max; omit table if free-form clearer
- Never ask user to restate what they already said
- No speculative categories

**Defaults when interaction impossible:**
- Depth: Standard
- Audience: Reviewer (if implementation exists), Author (if spec-only)
- Focus: Top 2 relevance clusters
- Stage: Infer from AVAILABLE_DOCS

Output questions (Q1/Q2/Q3). After answers: if ≥2 high-impact areas unclear, MAY ask up to TWO more targeted follow-ups (Q4/Q5) with one-line justification each. Do not exceed five total questions.

### 3. Understand User Request

Combine `$ARGUMENTS` + clarifying answers:
- Derive checklist theme (requirements, architecture, implementation, deployment)
- Consolidate explicit must-have items mentioned
- Map focus selections to category scaffolding
- Infer any missing context from spec/plan/workflow (do NOT hallucinate)

### 4. Load Feature Context

Read from FEATURE_DIR (prioritize by stage):

**Spec Stage** (spec.md exists):
- Workflow requirements and scope
- Trigger specifications
- Data requirements
- Integration requirements
- Error scenarios
- Success criteria

**Planning Stage** (plan.md exists):
- Node architecture
- Integration details
- Error handling strategy
- Data flow design

**Implementation Stage** (workflow JSON exists):
- Node configurations
- Connections
- Expressions
- Error handlers

**Context Loading Strategy:**
- Load only portions relevant to active focus areas
- Prefer summarizing long sections
- Use progressive disclosure
- Generate interim summary items instead of embedding raw text for large files

### 5. Generate Checklist - "Unit Tests for Workflow Requirements"

Create `FEATURE_DIR/checklists/` directory if doesn't exist.

**Generate unique filename:**
- Use short, descriptive name based on domain (e.g., `requirements.md`, `architecture.md`, `implementation.md`, `deployment.md`)
- Format: `[domain].md`
- If file exists, append to existing file
- Number items sequentially starting from CHK001
- Each `/n8n.checklist` run creates a NEW file (never overwrites)

**CORE PRINCIPLE - Test the Requirements/Design, Not the Implementation**:

Every checklist item MUST evaluate the REQUIREMENTS/DESIGN THEMSELVES for:
- **Completeness**: Are all necessary requirements/design elements present?
- **Clarity**: Are requirements/designs unambiguous and specific?
- **Consistency**: Do requirements/designs align with each other?
- **Measurability**: Can requirements be objectively verified?
- **Coverage**: Are all scenarios/edge cases addressed in requirements?

**Category Structure** - Group by quality dimensions:

**For Specification Checklists** (requirements.md):
- **Requirement Completeness** (Are all necessary requirements documented?)
- **Requirement Clarity** (Are requirements specific and unambiguous?)
- **Requirement Consistency** (Do requirements align without conflicts?)
- **Acceptance Criteria Quality** (Are success criteria measurable?)
- **Scenario Coverage** (Are all flows/cases addressed?)
- **Edge Case Coverage** (Are boundary conditions defined?)
- **Non-Functional Requirements** (Performance, reliability, observability specified?)
- **Dependencies & Assumptions** (Documented and validated?)

**For Architecture Checklists** (architecture.md):
- **Node Selection Quality** (Are node choices documented with rationale?)
- **Data Flow Clarity** (Are transformations well-defined?)
- **Integration Design Completeness** (All services addressed?)
- **Error Handling Architecture** (Comprehensive strategy defined?)
- **Performance Design** (Bottlenecks identified, optimization planned?)
- **Observability Design** (Logging, monitoring, alerting planned?)

**For Implementation Checklists** (implementation.md):
- **Configuration Completeness** (All required parameters present?)
- **Expression Quality** (Valid syntax, correct references?)
- **Connection Integrity** (No orphaned nodes, valid flow?)
- **Error Handler Completeness** (All error scenarios covered?)
- **Credential Handling** (No hardcoded secrets?)
- **Testing Completeness** (All scenarios have test cases?)

**For Deployment Checklists** (deployment.md):
- **Documentation Completeness** (Setup instructions, troubleshooting?)
- **Credential Setup** (All credentials documented and configured?)
- **Testing Validation** (All test scenarios passed?)
- **Monitoring Setup** (Alerts configured, dashboards ready?)
- **Rollback Plan** (Recovery strategy documented?)

**HOW TO WRITE CHECKLIST ITEMS**:

❌ **WRONG** (Testing implementation):
- "Verify webhook receives POST requests correctly"
- "Test Set node transforms email field to lowercase"
- "Confirm Slack notification sends on error"

✅ **CORRECT** (Testing requirements/design quality):
- "Are webhook endpoint path and HTTP methods specified in requirements?" [Completeness, Spec §Trigger]
- "Is 'normalize email' transformation defined with specific rules?" [Clarity, Spec §FR-3]
- "Are error notification channel and message format requirements consistent?" [Consistency, Spec §ES-1]
- "Is the node selection rationale documented for email normalization?" [Traceability, Plan §Node Architecture]
- "Are all integration failure modes addressed in error handling design?" [Coverage, Plan §Error Handling]

**ITEM STRUCTURE**:
- Question format asking about requirement/design quality
- Focus on what's WRITTEN (or not written) in spec/plan/workflow
- Include quality dimension in brackets [Completeness/Clarity/Consistency/etc.]
- Reference section `[Spec §X]` or `[Plan §Y]` when checking existing content
- Use `[Gap]` marker when checking for missing elements

**EXAMPLES BY QUALITY DIMENSION**:

**Completeness:**
- "Are all required input fields documented with types and validation rules? [Completeness, Spec §Data Requirements]"
- "Are error handling requirements defined for all external API calls? [Gap]"
- "Are node configuration requirements complete for all integrations? [Completeness, Plan §INT-2]"

**Clarity:**
- "Is 'fast processing' quantified with specific execution time targets? [Clarity, Spec §NFR-1]"
- "Are data transformation rules explicitly defined (not just 'process data')? [Clarity, Plan §Data Flow]"
- "Is 'rate limit handling' defined with specific retry strategy? [Ambiguity, Plan §Error Handling]"

**Consistency:**
- "Are field names consistent across input schema, transformations, and output schema? [Consistency]"
- "Do error notification channels match between spec and plan? [Consistency, Spec §ES-1, Plan §INT-3]"
- "Are timeout values consistent across all API integration requirements? [Consistency]"

**Coverage:**
- "Are requirements defined for zero-record scenarios (empty input)? [Coverage, Edge Case]"
- "Are all integration failure modes documented with recovery strategies? [Coverage, Gap]"
- "Are requirements specified for concurrent workflow executions? [Coverage, Gap]"

**Measurability:**
- "Can 'high throughput' be objectively measured with specific metrics? [Measurability, Spec §NFR-1]"
- "Are success criteria testable without implementation knowledge? [Acceptance Criteria, Spec §Success Criteria]"
- "Is 'error rate acceptable' quantified with specific thresholds? [Measurability, Spec §NFR-2]"

**Traceability (Architecture/Implementation):**
- "Is the rationale documented for choosing HTTP Request over native node? [Traceability, Plan §Node Selection]"
- "Are all nodes in workflow traced to requirements they implement? [Traceability, Gap]"
- "Is the credential type documented for each integration? [Traceability, Plan §INT-N]"

**Scenario Classification & Coverage**:
- Check if requirements exist for: Primary, Alternate, Exception/Error, Recovery, Non-Functional scenarios
- For each scenario class: "Are [scenario type] requirements complete, clear, and consistent?"
- If scenario class missing: "Are [scenario type] requirements intentionally excluded or missing? [Gap]"

**Surface & Resolve Issues** (Requirements/Design Quality):
- Ambiguities: "Is 'immediately' quantified with specific timing (seconds, minutes)? [Ambiguity, Spec §NFR-1]"
- Conflicts: "Do authentication requirements conflict between §INT-1 and §INT-2? [Conflict]"
- Assumptions: "Is the assumption of '99% API uptime' validated or documented as risk? [Assumption]"
- Dependencies: "Are external service SLAs and rate limits documented? [Dependency, Gap]"
- Missing definitions: "Is 'data validation' defined with specific rules and error messages? [Gap]"

**Content Consolidation**:
- Soft cap: If raw candidate items > 40, prioritize by risk/impact
- Merge near-duplicates checking same requirement aspect
- If >5 low-impact edge cases, create one item: "Are edge cases X, Y, Z addressed in requirements? [Coverage]"

**🚫 ABSOLUTELY PROHIBITED**:
- ❌ Any item starting with "Verify", "Test", "Confirm", "Check" + implementation behavior
- ❌ References to code execution, workflow execution, system behavior
- ❌ "Executes correctly", "works properly", "functions as expected"
- ❌ "Node processes", "workflow runs", "data flows"
- ❌ Test cases, test execution, QA procedures
- ❌ Implementation verification (node configurations work correctly)

**✅ REQUIRED PATTERNS**:
- ✅ "Are [requirement type] defined/specified/documented for [scenario]?"
- ✅ "Is [vague term] quantified/clarified with specific criteria?"
- ✅ "Are requirements consistent between [section A] and [section B]?"
- ✅ "Can [requirement] be objectively measured/verified?"
- ✅ "Are [edge cases/scenarios] addressed in requirements?"
- ✅ "Does the spec/plan define [missing aspect]?"

### 6. Structure Reference

Generate checklist following canonical template in `.specify/templates/checklist-template.md`. If unavailable, use:
- H1 title
- Purpose/created meta lines
- `##` category sections
- `- [ ] CHK### <requirement item>` lines with globally incrementing IDs starting CHK001

### 7. Report

Output:
- Full path to created checklist
- Item count
- Remind that each run creates new file
- Summarize:
  * Focus areas selected
  * Depth level
  * Stage (spec/plan/implementation/deployment)
  * Explicit must-have items incorporated

**Important**: Each `/n8n.checklist` invocation creates a checklist file with descriptive names unless file exists. Allows multiple checklist types with simple, memorable filenames.

## Example Checklist Types & Sample Items

### Requirements Quality Checklist: `requirements.md`

**Purpose**: Validate specification completeness before planning

**Sample items (testing requirements, NOT implementation):**
- "Are trigger type and execution frequency explicitly specified? [Completeness, Spec §Trigger]"
- "Is 'process incoming data' broken down into specific transformation rules? [Clarity, Spec §FR-2]"
- "Are input data validation rules consistent with output data requirements? [Consistency]"
- "Are error notification requirements defined for all failure scenarios? [Coverage, Gap]"
- "Is 'acceptable performance' quantified with specific execution time targets? [Measurability, Spec §NFR-1]"
- "Does the spec define behavior when external API is unavailable? [Edge Case, Gap]"

### Architecture Quality Checklist: `architecture.md`

**Purpose**: Validate design decisions before implementation

**Sample items:**
- "Is the rationale documented for choosing webhook over schedule trigger? [Traceability, Plan §Trigger Config]"
- "Are all data transformations mapped to specific node types? [Completeness, Plan §Data Flow]"
- "Are authentication methods specified for all integrations? [Completeness, Plan §INT-N]"
- "Is the error handling strategy complete for all identified failure modes? [Coverage, Plan §Error Handling]"
- "Are performance bottlenecks identified with mitigation strategies? [Completeness, Plan §Performance]"
- "Is the observability design consistent with NFR requirements? [Consistency, Spec §NFR-3, Plan §Observability]"

### Implementation Quality Checklist: `implementation.md`

**Purpose**: Validate workflow configuration before deployment

**Sample items:**
- "Are all nodes referenced in plan.md present in workflow JSON? [Completeness]"
- "Are credential references documented (not hardcoded)? [Security]"
- "Are all expressions using correct n8n syntax `={{ ... }}`? [Syntax]"
- "Are all nodes connected with no orphans? [Structure]"
- "Are error handlers implemented for all integrations? [Coverage]"
- "Are node positions consistent with architecture flow diagram? [Consistency]"

### Deployment Readiness Checklist: `deployment.md`

**Purpose**: Validate deployment preparedness

**Sample items:**
- "Are credential setup instructions complete and tested? [Completeness]"
- "Are all test scenarios documented with expected results? [Completeness]"
- "Is monitoring configured for all critical operations? [Observability]"
- "Is rollback procedure documented with step-by-step instructions? [Recovery]"
- "Are post-deployment validation steps defined? [Testing]"

## Anti-Examples: What NOT To Do

**❌ WRONG - These test implementation, not requirements:**
```markdown
- [ ] CHK001 - Verify webhook endpoint responds to POST requests [Plan §Trigger]
- [ ] CHK002 - Test Set node transforms email to lowercase correctly [Plan §Data Flow]
- [ ] CHK003 - Confirm Slack message sends when error occurs [Plan §Error Handling]
- [ ] CHK004 - Check that workflow executes in under 30 seconds [Spec §NFR-1]
```

**✅ CORRECT - These test requirements/design quality:**
```markdown
- [ ] CHK001 - Are webhook HTTP methods and path specified in requirements? [Completeness, Spec §Trigger]
- [ ] CHK002 - Are email normalization rules explicitly defined? [Clarity, Spec §FR-3]
- [ ] CHK003 - Are error notification channel and message format requirements documented? [Completeness, Spec §ES-1]
- [ ] CHK004 - Is performance target quantified with specific execution time? [Measurability, Spec §NFR-1]
- [ ] CHK005 - Is node selection rationale documented for email transformation? [Traceability, Plan §Data Flow]
- [ ] CHK006 - Are all error scenarios from spec addressed in error handling design? [Coverage, Plan §Error Handling]
```

**Key Differences:**
- Wrong: Tests if workflow works correctly
- Correct: Tests if requirements/design are written correctly
- Wrong: Verification of execution behavior
- Correct: Validation of requirement/design quality
- Wrong: "Does it do X?"
- Correct: "Is X clearly specified/designed?"

## Context

$ARGUMENTS

