# Self-healing with AI Example

**This is a practical example demonstrating how test automation pipelines can detect, analyse, and fix test failures using AI-powered analysis. It uses Cypress, OpenAI's APIs, GitHub Actions, and TodoMVC-React**

## 🎯 What is Self-Healing Test Automation?

This example demonstrates a modern approach to self-healing for automated tests using Large Language Models (LLMs). At a high level, it's based on three main stages: **Context Composition**, **AI Analysis & Generation**, and **Validation**.

The self-healing process begins when a test failure is detected and works through three main stages:

**Context Composition**:
- **Detect** when Cypress tests fail
- **Extract** failure metadata (test info, error details, DOM snapshots, timestamps)
- **Compose** structured failure data with AI prompts

**AI Analysis & Generation**:
- **Send** failure data and prompts to AI model
- **Analyse** root causes and generate fixes using AI
- **Receive** AI response with proposed solutions

**Validation**:
- **Apply** fixes to temporary branch
- **Rerun** tests to validate solutions
- **Submit** for human approval (PR) if tests pass

This example demonstrates a modular architecture for implementing self-healing capabilities in Cypress test suites, focusing on the detection, composition, analysis, and generation phases. The validation phase includes automated fix application and test rerun capabilities.

## 🚀 Quick Test Instructions

### Option 1: Break the App
1. Edit `src/components/header/header.js` line 8: change "todos" to "todo's"
2. Run `npm run test:e2e` to see failure
3. Check `cypress/failures/` for captured artifacts
4. Build AI payload: `node scripts/ai-payload-builder.js cypress/failures/new-todo-clean.html`

### Option 2: Break the Test
1. Edit `tests/e2e/new-todo.spec.js` line 50: change "todos" to "wrong-text"
2. Run `npm run test:e2e` to see failure
3. Follow steps 3-4 from Option 1

### Option 3: Test Pipeline
1. Make a breaking change (app or test)
2. Commit and push: `git add . && git commit -m "Break test" && git push`
3. Watch GitHub Actions for auto-healing pipeline

## 🏗️ Architecture Overview

```
                       ┌─────────────────┐
                       │  Human          │
                       │  Approval       │
                       │  (PR)           │
                       └─────────────────┘
                                ▲
                            NO  │  
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cypress Test  │───▶│  Test Failure   │    │  Context        │    │  AI Analysis    │
│   Execution     │    │  Detection?     │    │  Composition    │    │  & Generation   │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
          ▲                       YES │          ▲           │          ▲      │
          │                           ▼          │           ▼          │      │
          │                       ┌─────────────────┐    ┌─────────────────┐   │
          │                       │  Failure        │    │  Structured     │   │
          │                       │  Metadata       │    │  Failure Data   │   │
          │                       │  + DOM Snapshot │    │  + AI Prompt    │   │
          │                       └─────────────────┘    └─────────────────┘   │
          │                                                                    ▼
          │                                                           ┌─────────────────┐
          │                                                           │  AI Response    │
          │                                                           │  (Solutions)    │
          │                                                           └─────────────────┘
          │                                                                    │
          │                                                                    ▼
          │                                                           ┌─────────────────┐
          │                                                           │  Apply fix to   │
          │                                                           │  Test file      │
          │                                                           └─────────────────┘
          │                                                                    │
          └────────────────────────────────────────────────────────────────────┘
                                     Feedback Loop
                                     (Test Rerun)
```

## 📁 Project Structure

```
AI-autoheal-POC-todomvc/
├── scripts/                          # 🧠 Self-healing engine
│   ├── ai-payload-builder.js         # Main orchestrator for AI payload creation
│   ├── prompts.js                    # AI prompt templates and configuration
│   ├── code-fixer.js                 # Applies AI-generated fixes to test files
│   ├── fix-parser.js                 # Parses AI responses and extracts fixes
│   └── clean-dom.js                  # DOM cleaning utility for AI analysis
├── tests/
│   └── e2e/
│       └── new-todo.spec.js          # Sample Cypress test suite with failure capture
├── cypress/
│   └── failures/                     # Captured failure artifacts (DOM, screenshots, logs)
├── src/                              # TodoMVC React application
└── cypress.config.js                 # Cypress configuration
```

## 🔧 How It Works

### 1. **Cypress Test Execution**
The Cypress test suite executes tests against the TodoMVC application:
- Test execution with configured browsers (Chrome, Firefox)
- Real-time test status monitoring
- Screenshot capture on failure

### 2. **Failure Detection & Artifact Capture**
When a test fails, the `afterEach` hook in `new-todo.spec.js` automatically captures:
- **Screenshots**: Visual state at failure point
- **DOM Snapshots**: Complete HTML structure for AI analysis
- **Error Logs**: Stack traces and error messages
- **Test Context**: Metadata including file paths, line numbers, timestamps

```javascript
afterEach(function () {
  if (this.currentTest.state === 'failed') {
    const testTitle = this.currentTest.title;
    const errorMessage = this.currentTest.err?.stack || this.currentTest.err?.message;
    
    // Capture screenshot
    cy.screenshot(`${testTitle} (failure)`);
    
    // Capture DOM snapshot
    cy.document().then((doc) => {
      const html = doc.documentElement.outerHTML;
      cy.writeFile(`cypress/failures/${testTitle}.html`, html);
    });
    
    // Capture error context
    const testContext = {
      testName: this.currentTest.title,
      testFile: Cypress.spec.relative,
      error: {
        message: this.currentTest.err?.message,
        line: errorLine,
        column: errorColumn
      }
    };
    cy.writeFile(`cypress/failures/${testTitle}.context.json`, JSON.stringify(testContext, null, 2));
  }
});
```

### 3. **Context Composition**
The `ai-payload-builder.js` script structures and enriches the failure data:

```javascript
function buildOpenAIPayload(context) {
  const { testContent, domContent, testContext } = context;
  
  const userPrompt = USER_PROMPT_TEMPLATE
    .replace('{{TEST_FILE_PATH}}', testContext.testFile)
    .replace('{{TEST_CONTENT}}', testContent)
    .replace('{{DOM_CONTENT}}', domContent)
    .replace('{{ERROR_LOCATION}}', errorLocation);
    
  return {
    model: 'gpt-4',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ]
  };
}
```

### 4. **AI Analysis & Generation**
The AI model analyzes the structured failure data and generates specific fixes:

**Input**: Test file content, DOM snapshot, error location
**Output**: Structured JSON with specific code changes

```json
{
  "analysis": "Test expects 'todos' but finds 'todo's' in the DOM - text content mismatch",
  "fix": {
    "file": "tests/e2e/new-todo.spec.js",
    "line": 50,
    "column": 12,
    "oldCode": "cy.contains('h1', 'todos')",
    "newCode": "cy.contains('h1', \"todo's\")",
    "reason": "Text content mismatch between expected and actual DOM"
  }
}
```

### 5. **Fix Application**
The `code-fixer.js` script applies AI-generated fixes:

```javascript
function applyFix(fixData) {
  const { file, line, oldCode, newCode } = fixData;
  
  // Read target file
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  // Apply fix
  const newLine = lines[line - 1].replace(oldCode, newCode);
  lines[line - 1] = newLine;
  
  // Write updated content
  fs.writeFileSync(file, lines.join('\n'));
}
```

### 6. **Test Rerun & Validation**
After applying fixes:
- Rerun the previously failed tests
- Monitor success/failure of applied solutions
- Collect performance metrics
- Generate fix effectiveness reports

### 7. **Data Persistence**
The system currently saves basic failure data:
- DOM snapshots (saved to `cypress/failures/`)
- Error logs with stack traces (saved to `cypress/failures/`)
- Test context metadata (saved as JSON files)
- AI payload files (when generated)
- Fix summaries (when fixes are applied)

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- GitHub repository with Actions enabled

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start
# Application will be available at http://localhost:9300
```

### Run Tests
```bash
# Run tests in headless mode
npm run cypress

# Or run with UI for development
npx cypress open
```
